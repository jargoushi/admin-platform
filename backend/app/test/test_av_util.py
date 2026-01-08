# 音视频工具类测试
"""
使用: python -m app.test.test_av_util
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

OUTPUT_DIR = "./test_av_output"


def run_tests():
    """运行单元测试"""
    from app.util.av_util import AVUtil

    print("=" * 60)
    print("AVUtil 单元测试")
    print("=" * 60)

    tests = [
        ("模块导入", True),
        ("get_info 方法存在", hasattr(AVUtil, "get_info")),
        ("extract_audio 方法存在", hasattr(AVUtil, "extract_audio")),
        ("capture_frame 方法存在", hasattr(AVUtil, "capture_frame")),
        ("capture_frames 方法存在", hasattr(AVUtil, "capture_frames")),
        ("trim 方法存在", hasattr(AVUtil, "trim")),
        ("merge_audio_video 方法存在", hasattr(AVUtil, "merge_audio_video")),
        ("convert 方法存在", hasattr(AVUtil, "convert")),
        ("compress 方法存在", hasattr(AVUtil, "compress")),
        ("burn_subtitles 方法存在", hasattr(AVUtil, "burn_subtitles")),
    ]

    passed = 0
    for name, result in tests:
        status = "✓" if result else "✗"
        print(f"  {status} {name}")
        if result:
            passed += 1

    print(f"\n结果: {passed}/{len(tests)} 通过")
    return passed == len(tests)


def test_get_info(video_path: str):
    """测试获取视频信息"""
    from app.util.av_util import AVUtil

    print(f"\n获取视频信息: {video_path}")
    info = AVUtil.get_info(video_path)
    print(f"  时长: {AVUtil.format_duration(info.duration)}")
    print(f"  分辨率: {info.width}x{info.height}")
    print(f"  帧率: {info.fps} fps")
    print(f"  码率: {info.bitrate // 1000} kbps")
    print(f"  视频编码: {info.codec}")
    print(f"  音频编码: {info.audio_codec}")
    print(f"  文件大小: {AVUtil.format_size(info.size_bytes)}")


def test_extract_audio(video_path: str):
    """测试提取音频"""
    from app.util.av_util import AVUtil
    import os

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output = os.path.join(OUTPUT_DIR, "extracted_audio.mp3")
    AVUtil.extract_audio(video_path, output)


def test_capture_frame(video_path: str, time_sec: float = 5.0):
    """测试截帧"""
    from app.util.av_util import AVUtil
    import os

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output = os.path.join(OUTPUT_DIR, f"frame_{time_sec}s.jpg")
    AVUtil.capture_frame(video_path, time_sec, output)


def test_trim(video_path: str, start: float = 0, end: float = 10):
    """测试裁剪"""
    from app.util.av_util import AVUtil
    import os

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output = os.path.join(OUTPUT_DIR, "trimmed.mp4")
    AVUtil.trim(video_path, output, start, end)


def test_compress(video_path: str, crf: int = 28):
    """测试压缩"""
    from app.util.av_util import AVUtil
    import os

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output = os.path.join(OUTPUT_DIR, "compressed.mp4")
    AVUtil.compress(video_path, output, crf=crf)


def test_transcribe(video_path: str):
    """测试语音转字幕（先截取前30秒）"""
    from app.util.av_util import AVUtil
    import os

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 先截取前30秒
    short_video = os.path.join(OUTPUT_DIR, "short_video.mp4")
    print("截取前30秒视频...")
    AVUtil.trim(video_path, short_video, start_sec=0, end_sec=30)

    # 再转字幕
    output = os.path.join(OUTPUT_DIR, "subtitle.srt")
    AVUtil.transcribe(short_video, output)
    print(f"✓ 字幕已生成: {output}")


def get_test_video() -> str:
    """获取 test_downloads 目录下的第一个视频"""
    test_dir = "test_downloads"
    if not os.path.exists(test_dir):
        raise FileNotFoundError(f"测试目录不存在: {test_dir}")

    for f in os.listdir(test_dir):
        if f.endswith(".mp4"):
            return os.path.join(test_dir, f)

    raise FileNotFoundError("未找到测试视频")


def batch_trim_test():
    """批量截取 test_downloads 目录下所有视频的前1分钟"""
    from app.util.av_util import AVUtil
    import os

    input_dir = "test_downloads"
    output_dir = "test_av_output"
    os.makedirs(output_dir, exist_ok=True)

    if not os.path.exists(input_dir):
        print(f"输入目录不存在: {input_dir}")
        return

    files = [f for f in os.listdir(input_dir) if f.endswith(".mp4")]
    print(f"找到 {len(files)} 个视频文件，开始批量截取前1分钟...")

    for f in files:
        input_path = os.path.join(input_dir, f)
        output_path = os.path.join(output_dir, f)
        print(f"正在处理: {f}")
        try:
            AVUtil.trim(input_path, output_path, start_sec=0, duration_sec=60)
            print(f"✓ 已保存: {output_path}")
        except Exception as e:
            print(f"✗ 处理失败 {f}: {e}")


if __name__ == "__main__":
    run_tests()

    # === 集成测试 ===
    # video = get_test_video()
    # test_get_info(video)
    # test_extract_audio(video)
    # test_capture_frame(video, 5.0)
    # test_trim(video, 0, 10)
    # test_compress(video)
    # test_transcribe(video)

    # 批量截取测试
    batch_trim_test()



