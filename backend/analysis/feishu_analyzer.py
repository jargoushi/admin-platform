"""
飞书链接分析器 - 简化版
只获取URL和标题
"""
import asyncio
import json
import re
from collections import Counter
from pathlib import Path
from typing import List, Tuple

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.util.Playwright_util import PlaywrightUtil


def read_urls_from_file(file_path: str) -> List[str]:
    """从文件读取URL列表"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'https://[a-zA-Z0-9]+\.feishu\.cn/[^\s]+'
    matches = re.findall(pattern, content)
    return [url.strip() for url in matches if url.strip()]


def normalize_url(url: str) -> str:
    """标准化URL，去除查询参数"""
    return url.split('?')[0] if '?' in url else url


def check_duplicates(urls: List[str]) -> Tuple[List[str], dict]:
    """检查重复的URL"""
    normalized_counter = Counter([normalize_url(url) for url in urls])
    duplicates = {url: count for url, count in normalized_counter.items() if count > 1}
    unique_urls = list(set([normalize_url(url) for url in urls]))
    return unique_urls, duplicates


async def fetch_title(url: str, util: PlaywrightUtil) -> dict:
    """获取URL的标题"""
    result = {'url': url, 'title': None}

    try:
        page = util._get_page()
        await page.goto(url, timeout=10000, wait_until='domcontentloaded')
        await asyncio.sleep(0.5)

        title = await page.title()
        # 移除 " - 飞书云文档" 后缀
        if title and ' - 飞书云文档' in title:
            title = title.replace(' - 飞书云文档', '')
        result['title'] = title

    except Exception as e:
        result['title'] = f"获取失败: {str(e)}"

    return result


async def analyze_urls(file_path: str, test_count: int = None):
    """分析URL文件"""
    print("=" * 60)
    print("飞书链接分析")
    print("=" * 60)

    urls = read_urls_from_file(file_path)
    print(f"\n📊 总URL: {len(urls)}")

    unique_urls, duplicates = check_duplicates(urls)
    print(f"📊 去重后: {len(unique_urls)}")

    if duplicates:
        print(f"\n⚠️ 重复URL: {len(duplicates)} 个")
    else:
        print("\n✅ 无重复URL")

    test_urls = unique_urls if test_count is None else unique_urls[:test_count]
    total = len(test_urls)
    print(f"\n🔍 获取标题中 (共 {total} 个)...")

    util = PlaywrightUtil(headless=True)
    all_results = []

    try:
        await util.start_browser()

        for i, url in enumerate(test_urls, 1):
            result = await fetch_title(url, util)
            all_results.append(result)

            if i % 10 == 0 or i == total:
                print(f"[{i}/{total}] {i*100//total}%")

            await asyncio.sleep(0.3)

    finally:
        await util.close_browser()

    print("\n✅ 完成")
    return {'unique_url_list': unique_urls, 'results': all_results}


if __name__ == '__main__':
    data_file = Path(__file__).parent.parent / 'data' / '生财1226.txt'

    if not data_file.exists():
        print(f"文件不存在: {data_file}")
    else:
        result = asyncio.run(analyze_urls(str(data_file), test_count=None))

        # 保存结果
        results_file = Path(__file__).parent / 'feishu_results.json'
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(result['results'], f, ensure_ascii=False, indent=2)
        print(f"结果已保存至: {results_file}")
