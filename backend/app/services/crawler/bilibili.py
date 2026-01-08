"""B站采集器"""

import asyncio
import hashlib
import time
import urllib.parse
from dataclasses import dataclass
from functools import reduce
from typing import Callable, List, Optional, Set

import httpx

from app.core.logging import log


# wbi 签名混淆表
MIXIN_KEY_ENC_TAB = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52
]


@dataclass
class Comment:
    """评论数据结构"""
    rpid: int           # 评论唯一ID
    mid: int            # 用户ID
    uname: str          # 用户名
    content: str        # 评论内容
    like: int = 0       # 点赞数
    ctime: int = 0      # 发布时间戳
    rcount: int = 0     # 子评论总数
    is_up: bool = False # 是否为UP主评论


@dataclass
class VideoInfo:
    """视频信息"""
    bvid: str
    aid: int
    title: str
    owner_mid: int
    owner_name: str
    view: int = 0
    like: int = 0


@dataclass
class UPVideoInfo:
    """UP主视频信息"""
    bvid: str
    aid: int
    title: str
    pic: str            # 封面图 URL
    duration: int       # 时长（秒）
    created: int        # 发布时间戳
    play: int = 0       # 播放量
    comment: int = 0    # 评论数


class BilibiliCrawler:
    """
    B站采集器

    支持功能：
    1. 获取视频基本信息
    2. 全量采集视频评论（支持分页）
    3. 深度采集UP主的所有评论（包括置顶、根评论、楼中楼回复）
    4. 获取UP主的所有视频列表
    """

    VIDEO_API = "https://api.bilibili.com/x/web-interface/view"
    COMMENT_API = "https://api.bilibili.com/x/v2/reply/main"
    SUB_COMMENT_API = "https://api.bilibili.com/x/v2/reply/reply"
    SPACE_VIDEO_API = "https://api.bilibili.com/x/space/wbi/arc/search"

    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.bilibili.com",
    }

    def __init__(self, cookie: str = ""):
        self.cookie = cookie
        self._wbi_img_key: Optional[str] = None
        self._wbi_sub_key: Optional[str] = None

    async def _get_wbi_keys(self, client: httpx.AsyncClient) -> tuple:
        """获取 wbi 签名所需的 img_key 和 sub_key"""
        if self._wbi_img_key and self._wbi_sub_key:
            return self._wbi_img_key, self._wbi_sub_key

        resp = await client.get(
            "https://api.bilibili.com/x/web-interface/nav",
            headers=self._base_headers()
        )
        data = resp.json()

        if data["code"] == 0:
            wbi_img = data["data"]["wbi_img"]
            # 从 URL 中提取 key（去掉 .png 后缀）
            self._wbi_img_key = wbi_img["img_url"].split("/")[-1].split(".")[0]
            self._wbi_sub_key = wbi_img["sub_url"].split("/")[-1].split(".")[0]
        else:
            log.warning(f"[Bilibili] 获取 wbi keys 失败: {data.get('message')}")
            self._wbi_img_key = ""
            self._wbi_sub_key = ""

        return self._wbi_img_key, self._wbi_sub_key

    def _get_mixin_key(self, img_key: str, sub_key: str) -> str:
        """生成 mixin_key"""
        raw_key = img_key + sub_key
        return reduce(lambda s, i: s + raw_key[i], MIXIN_KEY_ENC_TAB, "")[:32]

    def _sign_wbi_params(self, params: dict, mixin_key: str) -> dict:
        """对参数进行 wbi 签名"""
        params["wts"] = int(time.time())
        # 按 key 排序
        sorted_params = sorted(params.items())
        # URL 编码
        query = urllib.parse.urlencode(sorted_params)
        # 计算签名
        w_rid = hashlib.md5((query + mixin_key).encode()).hexdigest()
        params["w_rid"] = w_rid
        return params

    async def get_video_info(self, bvid: str) -> VideoInfo:
        """获取视频信息"""
        log.info(f"[Bilibili] 获取视频信息: {bvid}")

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                self.VIDEO_API,
                params={"bvid": bvid},
                headers=self._headers(bvid)
            )
            data = resp.json()

        if data["code"] != 0:
            raise Exception(f"获取视频信息失败: {data['message']}")

        info = data["data"]
        return VideoInfo(
            bvid=bvid,
            aid=info["aid"],
            title=info["title"],
            owner_mid=info["owner"]["mid"],
            owner_name=info["owner"]["name"],
            view=info.get("stat", {}).get("view", 0),
            like=info.get("stat", {}).get("like", 0),
        )

    async def get_comments(
        self,
        bvid: str,
        max_pages: int = 5,
        include_sub: bool = False
    ) -> List[Comment]:
        """
        全量获取评论

        Args:
            bvid: 视频BV号
            max_pages: 最大抓取页数
            include_sub: 是否包含所有子评论（注意：开启后会显著增加请求次数）
        """
        video_info = await self.get_video_info(bvid)
        return await self._fetch_comments_logic(
            bvid=bvid,
            aid=video_info.aid,
            owner_mid=video_info.owner_mid,
            max_pages=max_pages,
            include_sub=include_sub,
            only_up=False
        )

    async def get_up_comments(self, bvid: str, max_pages: int = 10) -> List[Comment]:
        """
        深度采集UP主的所有评论

        逻辑：
        1. 扫描置顶评论 (top_replies)
        2. 扫描每一页根评论 (replies)
        3. 识别 up_reply 标志，递归采集有UP主参与互动的楼中楼
        """
        video_info = await self.get_video_info(bvid)
        log.info(f"[Bilibili] 开始深度采集UP主评论: {bvid}, UP: {video_info.owner_name}")

        return await self._fetch_comments_logic(
            bvid=bvid,
            aid=video_info.aid,
            owner_mid=video_info.owner_mid,
            max_pages=max_pages,
            include_sub=False, # 逻辑内部会根据 up_reply 自动决定是否进入子评论
            only_up=True
        )

    async def _fetch_comments_logic(
        self,
        bvid: str,
        aid: int,
        owner_mid: int,
        max_pages: int,
        include_sub: bool,
        only_up: bool
    ) -> List[Comment]:
        """核心采集逻辑"""
        all_comments: List[Comment] = []
        seen_ids: Set[int] = set()
        page = 1

        async with httpx.AsyncClient() as client:
            while True:
                if max_pages > 0 and page > max_pages:
                    break

                log.info(f"[Bilibili] 正在处理第 {page} 页评论...")

                resp = await client.get(
                    self.COMMENT_API,
                    params={"type": 1, "oid": aid, "mode": 3, "pn": page, "ps": 20},
                    headers=self._headers(bvid)
                )
                data = resp.json()

                if data["code"] != 0:
                    log.warning(f"[Bilibili] 接口返回错误: {data.get('message')}")
                    break

                reply_data = data.get("data", {})

                # 1. 处理置顶评论 (仅第一页)
                if page == 1:
                    top_replies = reply_data.get("top_replies") or []
                    for r in top_replies:
                        comment = self._parse_reply(r, owner_mid)
                        if self._should_append(comment, seen_ids, only_up):
                            all_comments.append(comment)
                            seen_ids.add(comment.rpid)

                # 2. 处理普通根评论
                replies = reply_data.get("replies")
                if not replies:
                    break

                for r in replies:
                    root_comment = self._parse_reply(r, owner_mid)

                    # 添加根评论
                    if self._should_append(root_comment, seen_ids, only_up):
                        all_comments.append(root_comment)
                        seen_ids.add(root_comment.rpid)

                    # 3. 处理楼中楼 (子评论)
                    # 场景A: 全量采集模式 (include_sub=True)
                    # 场景B: 仅UP主模式 (only_up=True) 且该楼有UP主回复 (up_reply=True)
                    has_up_in_sub = r.get("reply_control", {}).get("up_reply", False)

                    if include_sub or (only_up and has_up_in_sub):
                        sub_comments = await self._fetch_sub_comments(
                            client, bvid, aid, root_comment.rpid, owner_mid, only_up
                        )
                        for sc in sub_comments:
                            if self._should_append(sc, seen_ids, only_up):
                                all_comments.append(sc)
                                seen_ids.add(sc.rpid)

                page += 1
                await asyncio.sleep(0.5)

        log.info(f"[Bilibili] 采集完成，共获取 {len(all_comments)} 条符合条件的评论")
        return all_comments

    async def _fetch_sub_comments(
        self,
        client: httpx.AsyncClient,
        bvid: str,
        aid: int,
        root_id: int,
        owner_mid: int,
        only_up: bool
    ) -> List[Comment]:
        """采集子评论（楼中楼）"""
        sub_results: List[Comment] = []
        sub_page = 1

        while True:
            # 子评论接口
            resp = await client.get(
                self.SUB_COMMENT_API,
                params={"type": 1, "oid": aid, "root": root_id, "pn": sub_page, "ps": 20},
                headers=self._headers(bvid)
            )
            data = resp.json()

            if data["code"] != 0:
                break

            replies = data.get("data", {}).get("replies")
            if not replies:
                break

            for r in replies:
                comment = self._parse_reply(r, owner_mid)
                sub_results.append(comment)

            sub_page += 1
            await asyncio.sleep(0.3)

        return sub_results

    def _parse_reply(self, r: dict, owner_mid: int) -> Comment:
        """解析单条评论数据"""
        member = r["member"]
        # 注意：member.mid 在某些版本 API 中是字符串，统一转 int 比较
        mid = int(member["mid"])

        return Comment(
            rpid=r["rpid"],
            mid=mid,
            uname=member["uname"],
            content=r["content"]["message"],
            like=r.get("like", 0),
            ctime=r.get("ctime", 0),
            rcount=r.get("rcount", 0),
            is_up=(mid == owner_mid)
        )

    def _should_append(self, comment: Comment, seen_ids: Set[int], only_up: bool) -> bool:
        """判断是否应该将评论加入结果集"""
        if comment.rpid in seen_ids:
            return False
        if only_up and not comment.is_up:
            return False
        return True

    def _base_headers(self) -> dict:
        """构造基础请求头"""
        headers = self.HEADERS.copy()
        if self.cookie:
            headers["Cookie"] = self.cookie
        return headers

    def _headers(self, bvid: str) -> dict:
        """构造请求头"""
        headers = self.HEADERS.copy()
        headers["Referer"] = f"https://www.bilibili.com/video/{bvid}"
        if self.cookie:
            headers["Cookie"] = self.cookie
        return headers

    def _space_headers(self, mid: int) -> dict:
        """构造空间请求头"""
        headers = self.HEADERS.copy()
        headers["Referer"] = f"https://space.bilibili.com/{mid}/video"
        if self.cookie:
            headers["Cookie"] = self.cookie
        return headers

    async def get_up_videos(
        self,
        mid: int,
        max_pages: int = 0
    ) -> List[UPVideoInfo]:
        """
        获取UP主的所有视频列表

        Args:
            mid: UP主的用户ID
            max_pages: 最大抓取页数，0 表示全部采集

        Returns:
            视频信息列表
        """
        log.info(f"[Bilibili] 开始采集UP主视频列表: mid={mid}")

        all_videos: List[UPVideoInfo] = []
        page = 1
        page_size = 30  # B站 API 默认最大 30

        async with httpx.AsyncClient() as client:
            # 获取 wbi keys（用于签名）
            img_key, sub_key = await self._get_wbi_keys(client)
            mixin_key = self._get_mixin_key(img_key, sub_key)

            while True:
                if max_pages > 0 and page > max_pages:
                    break

                log.info(f"[Bilibili] 正在获取第 {page} 页视频...")

                # 构造参数并签名
                params = {
                    "mid": mid,
                    "pn": page,
                    "ps": page_size,
                    "order": "pubdate",
                }
                signed_params = self._sign_wbi_params(params.copy(), mixin_key)

                resp = await client.get(
                    self.SPACE_VIDEO_API,
                    params=signed_params,
                    headers=self._space_headers(mid),
                    timeout=10.0
                )
                data = resp.json()

                if data["code"] != 0:
                    log.warning(f"[Bilibili] 接口返回错误: {data.get('message')}")
                    break

                vlist = data.get("data", {}).get("list", {}).get("vlist", [])
                if not vlist:
                    break

                for v in vlist:
                    video = UPVideoInfo(
                        bvid=v["bvid"],
                        aid=v["aid"],
                        title=v["title"],
                        pic=v["pic"],
                        duration=v.get("length", 0) if isinstance(v.get("length"), int) else 0,
                        created=v.get("created", 0),
                        play=v.get("play", 0),
                        comment=v.get("comment", 0),
                    )
                    all_videos.append(video)

                page += 1
                await asyncio.sleep(0.5)

        log.info(f"[Bilibili] UP主视频采集完成，共获取 {len(all_videos)} 个视频")
        return all_videos

    async def download_up_videos(
        self,
        mid: int,
        output_dir: str,
        max_pages: int = 0,
        proxy: Optional[str] = None,
        on_progress: Optional[Callable[[int, int, str], None]] = None,
    ) -> List[str]:
        """
        下载指定 UP 主的所有视频

        Args:
            mid: UP 主 ID
            output_dir: 输出目录
            max_pages: 最大采集页数，0 表示全部
            proxy: 代理地址（可选）
            on_progress: 进度回调 (current_index, total, video_title)

        Returns:
            下载成功的文件路径列表

        Example:
            crawler = BilibiliCrawler(cookie="...")
            paths = await crawler.download_up_videos(
                mid=12345678,
                output_dir="./downloads",
                max_pages=1
            )
        """
        from pathlib import Path
        from app.util import yt_dlp_util

        log.info(f"[Bilibili] 开始下载UP主视频: mid={mid}, output_dir={output_dir}")

        # 1. 获取 UP 主视频列表
        videos = await self.get_up_videos(mid=mid, max_pages=max_pages)

        if not videos:
            log.warning(f"[Bilibili] 未获取到任何视频: mid={mid}")
            return []

        log.info(f"[Bilibili] 共获取 {len(videos)} 个视频，开始下载...")

        # 2. 确保输出目录存在
        Path(output_dir).mkdir(parents=True, exist_ok=True)

        # 3. 逐个下载视频
        downloaded_paths: List[str] = []
        total = len(videos)

        for idx, video in enumerate(videos, start=1):
            video_url = f"https://www.bilibili.com/video/{video.bvid}"
            log.info(f"[Bilibili] [{idx}/{total}] 下载: {video.title}")

            if on_progress:
                on_progress(idx, total, video.title)

            try:
                path = await yt_dlp_util.download(
                    url=video_url,
                    output_dir=output_dir,
                    proxy=proxy,
                    extra_opts={
                        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
                        "merge_output_format": "mp4",
                    }
                )
                downloaded_paths.append(path)
                log.info(f"[Bilibili] [{idx}/{total}] 下载成功: {path}")
            except Exception as e:
                log.error(f"[Bilibili] [{idx}/{total}] 下载失败: {video.title}, 错误: {e}")
                # 继续下载下一个视频，不中断整个流程

        log.info(f"[Bilibili] UP主视频下载完成，成功: {len(downloaded_paths)}/{total}")
        return downloaded_paths

