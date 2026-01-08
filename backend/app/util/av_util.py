"""
音视频工具类

基于 FFmpeg 封装常用音视频处理功能。
需要系统安装 FFmpeg 并添加到 PATH。
"""

import os
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, List

from loguru import logger

try:
    import ffmpeg
except ImportError:
    raise ImportError("请先安装 ffmpeg-python: pip install ffmpeg-python")


@dataclass
class VideoInfo:
    """视频信息"""
    path: str
    duration: float         # 时长（秒）
    width: int              # 宽度
    height: int             # 高度
    fps: float              # 帧率
    bitrate: int            # 码率（bps）
    codec: str              # 编码格式
    audio_codec: str        # 音频编码
    size_bytes: int         # 文件大小


class AVUtil:
    """
    音视频工具类

    提供以下功能：
    1. 获取视频信息
    2. 提取音频
    3. 视频截帧
    4. 视频裁剪
    5. 音视频合并
    6. 格式转换
    7. 视频压缩
    8. 添加字幕
    """

    @staticmethod
    def _ensure_path(path: str) -> Path:
        """确保路径有效"""
        p = Path(path)
        if not p.exists():
            raise FileNotFoundError(f"文件不存在: {path}")
        return p

    @staticmethod
    def _ensure_output_dir(output_path: str) -> None:
        """确保输出目录存在"""
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # ========== 1. 获取视频信息 ==========

    @staticmethod
    def get_info(video_path: str) -> VideoInfo:
        """
        获取视频信息

        Args:
            video_path: 视频路径

        Returns:
            VideoInfo 对象
        """
        AVUtil._ensure_path(video_path)

        try:
            probe = ffmpeg.probe(video_path)
        except ffmpeg.Error as e:
            raise RuntimeError(f"无法读取视频信息: {e.stderr.decode() if e.stderr else str(e)}")

        video_stream = next(
            (s for s in probe["streams"] if s["codec_type"] == "video"), None
        )
        audio_stream = next(
            (s for s in probe["streams"] if s["codec_type"] == "audio"), None
        )

        if not video_stream:
            raise ValueError("未找到视频流")

        # 解析帧率（可能是 "30/1" 格式）
        fps_str = video_stream.get("r_frame_rate", "0/1")
        fps_parts = fps_str.split("/")
        fps = float(fps_parts[0]) / float(fps_parts[1]) if len(fps_parts) == 2 else float(fps_parts[0])

        return VideoInfo(
            path=video_path,
            duration=float(probe["format"].get("duration", 0)),
            width=int(video_stream.get("width", 0)),
            height=int(video_stream.get("height", 0)),
            fps=round(fps, 2),
            bitrate=int(probe["format"].get("bit_rate", 0)),
            codec=video_stream.get("codec_name", "unknown"),
            audio_codec=audio_stream.get("codec_name", "none") if audio_stream else "none",
            size_bytes=int(probe["format"].get("size", 0)),
        )

    # ========== 2. 提取音频 ==========

    @staticmethod
    def extract_audio(
        video_path: str,
        output_path: str,
        format: str = "mp3",
        bitrate: str = "192k"
    ) -> str:
        """
        从视频中提取音频

        Args:
            video_path: 输入视频路径
            output_path: 输出音频路径
            format: 输出格式 (mp3, wav, aac)
            bitrate: 音频码率

        Returns:
            输出文件路径
        """
        AVUtil._ensure_path(video_path)
        AVUtil._ensure_output_dir(output_path)

        logger.info(f"提取音频: {video_path} -> {output_path}")

        try:
            (
                ffmpeg
                .input(video_path)
                .output(output_path, acodec="libmp3lame" if format == "mp3" else None, audio_bitrate=bitrate)
                .overwrite_output()
                .run(quiet=True)
            )
            logger.info(f"✓ 音频提取完成: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            raise RuntimeError(f"提取音频失败: {e.stderr.decode() if e.stderr else str(e)}")

    # ========== 3. 视频截帧 ==========

    @staticmethod
    def capture_frame(video_path: str, time_sec: float, output_path: str) -> str:
        """
        截取视频某一帧

        Args:
            video_path: 输入视频路径
            time_sec: 截取时间点（秒）
            output_path: 输出图片路径（建议 .jpg 或 .png）

        Returns:
            输出文件路径
        """
        AVUtil._ensure_path(video_path)
        AVUtil._ensure_output_dir(output_path)

        logger.info(f"截取帧: {video_path} @ {time_sec}s -> {output_path}")

        try:
            (
                ffmpeg
                .input(video_path, ss=time_sec)
                .output(output_path, vframes=1)
                .overwrite_output()
                .run(quiet=True)
            )
            logger.info(f"✓ 截帧完成: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            raise RuntimeError(f"截帧失败: {e.stderr.decode() if e.stderr else str(e)}")

    @staticmethod
    def capture_frames(
        video_path: str,
        output_dir: str,
        interval_sec: float = 1.0,
        prefix: str = "frame"
    ) -> List[str]:
        """
        按间隔截取多帧

        Args:
            video_path: 输入视频路径
            output_dir: 输出目录
            interval_sec: 截帧间隔（秒）
            prefix: 文件名前缀

        Returns:
            输出文件路径列表
        """
        AVUtil._ensure_path(video_path)
        Path(output_dir).mkdir(parents=True, exist_ok=True)

        info = AVUtil.get_info(video_path)
        fps = 1 / interval_sec  # 每秒截几帧

        output_pattern = str(Path(output_dir) / f"{prefix}_%04d.jpg")

        logger.info(f"批量截帧: {video_path} -> {output_dir} (间隔 {interval_sec}s)")

        try:
            (
                ffmpeg
                .input(video_path)
                .filter("fps", fps=fps)
                .output(output_pattern)
                .overwrite_output()
                .run(quiet=True)
            )

            # 收集生成的文件
            frames = sorted(Path(output_dir).glob(f"{prefix}_*.jpg"))
            logger.info(f"✓ 批量截帧完成，共 {len(frames)} 帧")
            return [str(f) for f in frames]
        except ffmpeg.Error as e:
            raise RuntimeError(f"批量截帧失败: {e.stderr.decode() if e.stderr else str(e)}")

    # ========== 4. 视频裁剪 ==========

    @staticmethod
    def trim(
        video_path: str,
        output_path: str,
        start_sec: float,
        end_sec: Optional[float] = None,
        duration_sec: Optional[float] = None
    ) -> str:
        """
        裁剪视频片段

        Args:
            video_path: 输入视频路径
            output_path: 输出视频路径
            start_sec: 起始时间（秒）
            end_sec: 结束时间（秒），与 duration_sec 二选一
            duration_sec: 持续时长（秒），与 end_sec 二选一

        Returns:
            输出文件路径
        """
        AVUtil._ensure_path(video_path)
        AVUtil._ensure_output_dir(output_path)

        if end_sec is not None:
            duration_sec = end_sec - start_sec

        if duration_sec is None or duration_sec <= 0:
            raise ValueError("必须指定 end_sec 或 duration_sec")

        logger.info(f"裁剪视频: {video_path} [{start_sec}s - {start_sec + duration_sec}s] -> {output_path}")

        try:
            (
                ffmpeg
                .input(video_path, ss=start_sec, t=duration_sec)
                .output(output_path, c="copy")
                .overwrite_output()
                .run(quiet=True)
            )
            logger.info(f"✓ 裁剪完成: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            raise RuntimeError(f"裁剪失败: {e.stderr.decode() if e.stderr else str(e)}")

    # ========== 5. 音视频合并 ==========

    @staticmethod
    def merge_audio_video(
        video_path: str,
        audio_path: str,
        output_path: str,
        replace_audio: bool = True
    ) -> str:
        """
        合并音频和视频

        Args:
            video_path: 输入视频路径
            audio_path: 输入音频路径
            output_path: 输出视频路径
            replace_audio: 是否替换原有音频（True=替换，False=混音）

        Returns:
            输出文件路径
        """
        AVUtil._ensure_path(video_path)
        AVUtil._ensure_path(audio_path)
        AVUtil._ensure_output_dir(output_path)

        logger.info(f"合并音视频: {video_path} + {audio_path} -> {output_path}")

        try:
            video = ffmpeg.input(video_path)
            audio = ffmpeg.input(audio_path)

            if replace_audio:
                # 替换原有音频
                (
                    ffmpeg
                    .output(video.video, audio.audio, output_path, vcodec="copy", acodec="aac")
                    .overwrite_output()
                    .run(quiet=True)
                )
            else:
                # 混音（保留原音频）
                (
                    ffmpeg
                    .output(video, audio, output_path, vcodec="copy")
                    .overwrite_output()
                    .run(quiet=True)
                )

            logger.info(f"✓ 合并完成: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            raise RuntimeError(f"合并失败: {e.stderr.decode() if e.stderr else str(e)}")

    # ========== 6. 格式转换 ==========

    @staticmethod
    def convert(
        input_path: str,
        output_path: str,
        vcodec: Optional[str] = None,
        acodec: Optional[str] = None
    ) -> str:
        """
        格式转换

        Args:
            input_path: 输入文件路径
            output_path: 输出文件路径（扩展名决定格式）
            vcodec: 视频编码器（可选，如 libx264）
            acodec: 音频编码器（可选，如 aac）

        Returns:
            输出文件路径
        """
        AVUtil._ensure_path(input_path)
        AVUtil._ensure_output_dir(output_path)

        logger.info(f"格式转换: {input_path} -> {output_path}")

        try:
            stream = ffmpeg.input(input_path)
            kwargs = {}
            if vcodec:
                kwargs["vcodec"] = vcodec
            if acodec:
                kwargs["acodec"] = acodec

            (
                ffmpeg
                .output(stream, output_path, **kwargs)
                .overwrite_output()
                .run(quiet=True)
            )
            logger.info(f"✓ 转换完成: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            raise RuntimeError(f"转换失败: {e.stderr.decode() if e.stderr else str(e)}")

    # ========== 7. 视频压缩 ==========

    @staticmethod
    def compress(
        video_path: str,
        output_path: str,
        crf: int = 23,
        scale: Optional[str] = None
    ) -> str:
        """
        视频压缩

        Args:
            video_path: 输入视频路径
            output_path: 输出视频路径
            crf: 压缩质量 (0-51, 越小质量越高，建议 18-28)
            scale: 缩放分辨率（如 "1280:720" 或 "-1:720" 保持比例）

        Returns:
            输出文件路径
        """
        AVUtil._ensure_path(video_path)
        AVUtil._ensure_output_dir(output_path)

        logger.info(f"压缩视频: {video_path} -> {output_path} (crf={crf}, scale={scale})")

        try:
            stream = ffmpeg.input(video_path)

            if scale:
                stream = stream.filter("scale", scale)

            (
                ffmpeg
                .output(stream, output_path, vcodec="libx264", crf=crf, preset="medium")
                .overwrite_output()
                .run(quiet=True)
            )
            logger.info(f"✓ 压缩完成: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            raise RuntimeError(f"压缩失败: {e.stderr.decode() if e.stderr else str(e)}")

    # ========== 8. 添加字幕 ==========

    @staticmethod
    def burn_subtitles(
        video_path: str,
        srt_path: str,
        output_path: str,
        font_size: int = 24
    ) -> str:
        """
        烧录字幕到视频

        Args:
            video_path: 输入视频路径
            srt_path: SRT 字幕文件路径
            output_path: 输出视频路径
            font_size: 字幕字体大小

        Returns:
            输出文件路径
        """
        AVUtil._ensure_path(video_path)
        AVUtil._ensure_path(srt_path)
        AVUtil._ensure_output_dir(output_path)

        logger.info(f"烧录字幕: {video_path} + {srt_path} -> {output_path}")

        # 处理 Windows 路径中的反斜杠和冒号
        srt_path_escaped = srt_path.replace("\\", "/").replace(":", "\\:")

        try:
            (
                ffmpeg
                .input(video_path)
                .output(
                    output_path,
                    vf=f"subtitles='{srt_path_escaped}':force_style='FontSize={font_size}'"
                )
                .overwrite_output()
                .run(quiet=True)
            )
            logger.info(f"✓ 字幕烧录完成: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            raise RuntimeError(f"字幕烧录失败: {e.stderr.decode() if e.stderr else str(e)}")

    # ========== 工具方法 ==========

    @staticmethod
    def format_duration(seconds: float) -> str:
        """格式化时长为 HH:MM:SS"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"

    @staticmethod
    def format_size(size_bytes: int) -> str:
        """格式化文件大小"""
        for unit in ["B", "KB", "MB", "GB"]:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} TB"

    # ========== 9. 语音转字幕 ==========

    @staticmethod
    def transcribe(
        media_path: str,
        output_path: Optional[str] = None,
        format: str = "srt",
        poll_interval: float = 5.0
    ) -> str:
        """
        语音转字幕（使用 B站必剪 API，免费无需本地模型）

        Args:
            media_path: 输入音视频文件路径
            output_path: 输出字幕文件路径（可选，默认同名 .srt）
            format: 输出格式 (srt, json, lrc, txt)
            poll_interval: 任务状态轮询间隔（秒）

        Returns:
            输出字幕文件路径

        Example:
            AVUtil.transcribe("video.mp4", "subtitle.srt")
        """
        try:
            from bcut_asr import BcutASR
            from bcut_asr.orm import ResultStateEnum
        except ImportError:
            raise ImportError(
                "请先安装 bcut-asr: uv pip install git+https://github.com/SocialSisterYi/bcut-asr.git"
            )

        import time
        import tempfile

        AVUtil._ensure_path(media_path)

        # 默认输出路径
        if output_path is None:
            base = Path(media_path).stem
            output_path = str(Path(media_path).parent / f"{base}.{format}")

        AVUtil._ensure_output_dir(output_path)

        logger.info(f"语音转字幕: {media_path} -> {output_path}")

        # 支持的音频格式
        supported_audio = [".flac", ".aac", ".m4a", ".mp3", ".wav"]
        file_ext = Path(media_path).suffix.lower()

        # 如果是视频或不支持的格式，先提取音频
        temp_audio = None
        actual_media = media_path

        if file_ext not in supported_audio:
            logger.info("检测到视频文件，先提取音频...")
            temp_audio = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
            temp_audio.close()
            try:
                (
                    ffmpeg
                    .input(media_path)
                    .output(temp_audio.name, acodec="libmp3lame", audio_bitrate="192k")
                    .overwrite_output()
                    .run(quiet=True)
                )
                actual_media = temp_audio.name
                logger.info(f"✓ 音频提取完成: {temp_audio.name}")
            except ffmpeg.Error as e:
                if temp_audio and os.path.exists(temp_audio.name):
                    os.unlink(temp_audio.name)
                raise RuntimeError(f"提取音频失败: {e.stderr.decode() if e.stderr else str(e)}")

        try:
            asr = BcutASR(actual_media)
            # 补丁：添加必要的请求头以修复 412 错误
            asr.session.headers.update({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://member.bilibili.com/"
            })
            asr.upload()
            logger.info("✓ 文件上传完成")

            asr.create_task()
            logger.info("✓ 任务创建成功，等待识别...")

            # 轮询等待结果
            while True:
                result = asr.result()
                if result.state == ResultStateEnum.COMPLETE:
                    break
                logger.info(f"  识别中... (状态: {result.state})")
                time.sleep(poll_interval)

            # 解析字幕
            subtitle = result.parse()
            if not subtitle.has_data():
                raise RuntimeError("识别结果为空")

            # 输出到文件
            content = ""
            if format == "srt":
                content = subtitle.to_srt()
            elif format == "json":
                import json
                content = json.dumps(subtitle.to_json(), ensure_ascii=False, indent=2)
            elif format == "lrc":
                content = subtitle.to_lrc()
            elif format == "txt":
                content = subtitle.to_txt()
            else:
                raise ValueError(f"不支持的格式: {format}")

            with open(output_path, "w", encoding="utf-8") as f:
                f.write(content)

            logger.info(f"✓ 字幕生成完成: {output_path}")
            return output_path

        except Exception as e:
            raise RuntimeError(f"语音转字幕失败: {str(e)}")

        finally:
            # 清理临时音频文件
            if temp_audio and os.path.exists(temp_audio.name):
                os.unlink(temp_audio.name)


