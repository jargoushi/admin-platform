# 采集模块测试
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))


async def test_bilibili_crawler():
    """测试B站采集器"""
    print("=" * 60)
    print("B站采集器测试")
    print("=" * 60)

    try:
        from app.services.crawler.bilibili import BilibiliCrawler, Comment, VideoInfo

        print("\n✓ 导入成功")

        crawler = BilibiliCrawler()
        print("✓ 实例化成功")

        comment = Comment(rpid=1, mid=123, uname="test", content="hello", is_up=True)
        assert comment.is_up is True
        print("✓ Comment 数据结构正常")

        info = VideoInfo(bvid="BV123", title="test", owner_mid=123, owner_name="test")
        assert info.bvid == "BV123"
        print("✓ VideoInfo 数据结构正常")

        print("\n" + "=" * 60)
        print("测试结果: 全部通过")
        print("=" * 60)

    except Exception as e:
        print(f"✗ 测试失败: {e}")


async def test_integration(bvid: str = None):
    """集成测试（需网络）"""
    if not bvid:
        return

    # 尝试从环境变量获取 COOKIE，方便本地测试
    cookie = os.getenv("BILIBILI_COOKIE", "")

    print(f"\n" + "=" * 60)
    print(f"集成测试: {bvid}")
    print(f"Cookie 状态: {'已提供' if cookie else '未提供'}")
    print("=" * 60)

    from app.services.crawler.bilibili import BilibiliCrawler

    crawler = BilibiliCrawler(cookie=cookie)

    # 1. 测试视频信息
    info = await crawler.get_video_info(bvid)
    print(f"✓ 视频信息: {info.title} (UP: {info.owner_name})")

    # 2. 测试全量评论采集 (1页)
    comments = await crawler.get_comments(bvid, max_pages=1, include_sub=True)
    print(f"✓ 全量评论采集 (1页, 含子评论): {len(comments)} 条")

    # 3. 测试 UP 主评论深度采集
    up_comments = await crawler.get_up_comments(bvid, max_pages=2)
    print(f"✓ UP 主评论深度采集: {len(up_comments)} 条")
    if up_comments:
        for i, c in enumerate(up_comments[:3], 1):
            print(f"   [{i}] {c.content[:50]}...")


if __name__ == "__main__":
    # 设置环境变量用于测试（可选）
    os.environ["BILIBILI_COOKIE"] = "buvid3=7DAFC921-D1A0-EEC3-83BA-3888A6DD28C162330infoc; SESSDATA=35296d0b%2C1783238535%2C2a055%2A12CjCLMjYnOVM-0WcawDP9k6k-DlhAN_XTwfeLCAKZd0bZvIDmDyAcH3DfD72MxJRfnaQSVkVZM2w4dDAtdFRsckpaTFdNc2h5NjZOeWs2Z2FnZFI2YzV3bjNjRXBQdkxBeUJqWGdpbmhnbzJmUUQ1M2xYMU1tZ3ZVUWNmbFVUbTJ1LVZjNDJBUnVBIIEC; bili_jct=ab64d75e4445ac6ff23b55e802e7df11"

    asyncio.run(test_bilibili_crawler())

    # 使用之前测试成功的 BV 号
    asyncio.run(test_integration("BV1ZnigBLEE5"))
