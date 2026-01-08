# 下载模块测试
"""
使用: python -m app.test.test_downloader
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

OUTPUT_DIR = "./test_downloads"


# ============================================================================
# 单元测试
# ============================================================================

async def run_unit_tests():
    """运行单元测试（不需要网络）"""
    from app.services.downloader.strategies.youtube import YoutubeStrategy
    from app.services.downloader.strategies.douyin import DouyinStrategy
    from app.services.downloader.strategies.bilibili import BilibiliStrategy
    from app.services.downloader.strategy_registry import StrategyRegistry

    tests = [
        ("YouTube URL匹配", YoutubeStrategy.can_handle("https://www.youtube.com/watch?v=abc")),
        ("抖音 URL匹配", DouyinStrategy.can_handle("https://www.douyin.com/video/123")),
        ("B站 URL匹配", BilibiliStrategy.can_handle("https://www.bilibili.com/video/BV1xx")),
        ("策略注册", StrategyRegistry.get_strategy("https://www.bilibili.com/video/BV1xx") is not None),
    ]

    print("=" * 60)
    print("单元测试")
    print("=" * 60)

    passed = 0
    for name, result in tests:
        status = "✓" if result else "✗"
        print(f"  {status} {name}")
        if result:
            passed += 1

    print(f"\n结果: {passed}/{len(tests)} 通过")


# ============================================================================
# 视频下载
# ============================================================================

async def download_video(url: str, output_dir: str = OUTPUT_DIR):
    """下载单个视频"""
    from app.util import yt_dlp_util

    print(f"下载: {url}")
    path = await yt_dlp_util.download(url=url, output_dir=output_dir)
    print(f"✓ 完成: {path}")


async def download_up_videos(mid: int, output_dir: str = OUTPUT_DIR, cookie: str = "", max_pages: int = 1):
    """下载UP主视频"""
    from app.services.crawler.bilibili import BilibiliCrawler

    print(f"下载UP主: {mid}")
    crawler = BilibiliCrawler(cookie=cookie)
    paths = await crawler.download_up_videos(
        mid=mid,
        output_dir=output_dir,
        max_pages=max_pages,
        on_progress=lambda i, t, title: print(f"  [{i}/{t}] {title}")
    )
    print(f"✓ 完成: 共 {len(paths)} 个视频")


# ============================================================================
# 入口 - 在这里修改测试参数
# ============================================================================

async def main():
    # 单元测试
    await run_unit_tests()

    # === 下载单个视频 ===
    # await download_video("https://www.bilibili.com/video/BV1xx411c7XW")

    # === 下载UP主视频 ===
    await download_up_videos(
        mid=3546890348006167,
        cookie="buvid3=7DAFC921-D1A0-EEC3-83BA-3888A6DD28C162330infoc; b_nut=1767686162; _uuid=5DDD2934-8767-31088-6A11-64B19110F6F8D64461infoc; CURRENT_QUALITY=0; rpdid=|(k|~JJ)kl~)0J'u~Y~Y)YuYJ; buvid4=3DDDEEC1-8048-5CC6-C5A7-E0EBB3BDBD3163556-026010615-eIDFHwPtykRJ/MD6qlGf5A%3D%3D; home_feed_column=5; browser_resolution=1920-919; SESSDATA=35296d0b%2C1783238535%2C2a055%2A12CjCLMjYnOVM-0WcawDP9k6k-DlhAN_XTwfeLCAKZd0bZvIDmDyAcH3DfD72MxJRfnaQSVkVZM2w4dDAtdFRsckpaTFdNc2h5NjZOeWs2Z2FnZFI2YzV3bjNjRXBQdkxBeUJqWGdpbmhnbzJmUUQ1M2xYMU1tZ3ZVUWNmbFVUbTJ1LVZjNDJBUnVBIIEC; bili_jct=ab64d75e4445ac6ff23b55e802e7df11; DedeUserID=618187299; DedeUserID__ckMd5=1dba1558595d1e27; theme-tip-show=SHOWED; theme-avatar-tip-show=SHOWED; sid=4ikm0aq9; fingerprint=af11763681c266afe26e2729579ab3a8; buvid_fp_plain=undefined; buvid_fp=af11763681c266afe26e2729579ab3a8; bp_t_offset_618187299=1155053401818529792; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjgwMjk0MzIsImlhdCI6MTc2Nzc3MDE3MiwicGx0IjotMX0.c0DvjWLUV85SnJrGaTqimWEQDuxJcqx6keOqGxvubOo; bili_ticket_expires=1768029372; CURRENT_FNVAL=4048; b_lsid=D576D458_19B9B9B9D3D",
        max_pages=1
    )


if __name__ == "__main__":
    asyncio.run(main())
