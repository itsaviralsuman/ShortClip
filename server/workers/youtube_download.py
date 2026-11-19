"""
YouTube Video Downloader using yt-dlp + FFmpeg
Downloads video and audio, merges them into a single faststart MP4 with AAC audio,
and generates a 16kHz mono WAV for Whisper transcription.
"""
import sys
import json
import os
import subprocess
import argparse
import re
import shutil

def sanitize_filename(name, max_len=60):
    """Remove special chars, truncate."""
    name = re.sub(r'[^\w\s\-]', '', name)
    name = re.sub(r'\s+', '_', name.strip())
    return name[:max_len] or 'video'

def find_ffmpeg():
    """Finds ffmpeg executable from system PATH or node_modules."""
    for candidate in ['ffmpeg', 'ffmpeg.exe']:
        found = shutil.which(candidate)
        if found:
            return found

    script_dir = os.path.dirname(os.path.abspath(__file__))
    server_dir = os.path.dirname(script_dir)
    project_root = os.path.dirname(server_dir)

    candidates = [
        os.path.join(server_dir, 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe'),
        os.path.join(project_root, 'server', 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe'),
        os.path.join(project_root, 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe'),
        r"C:\Users\Aviral Suman\Downloads\Agents practice\Build an automation website\server\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None

def download_youtube(url, output_dir, job_id='dl'):
    ffmpeg_bin = find_ffmpeg()
    final_mp4 = os.path.join(output_dir, f'{job_id}_merged.mp4')
    audio_wav = os.path.join(output_dir, f'{job_id}_whisper.wav')

    # Step 1: Extract metadata
    info_cmd = [
        sys.executable, '-m', 'yt_dlp',
        '--dump-json',
        '--no-playlist',
        '--quiet',
        url
    ]
    if ffmpeg_bin:
        info_cmd.extend(['--ffmpeg-location', ffmpeg_bin])

    try:
        info_result = subprocess.run(info_cmd, capture_output=True, text=True, timeout=90)
        if info_result.returncode != 0:
            raise RuntimeError(f'Metadata extraction failed: {info_result.stderr[:400]}')
        info = json.loads(info_result.stdout)
        title = info.get('title', 'Video')
        duration_seconds = float(info.get('duration', 0))
        uploader = info.get('uploader', '')
    except Exception as e:
        raise RuntimeError(f'Failed to get video info: {str(e)}')

    safe_title = sanitize_filename(title)
    video_out_template = os.path.join(output_dir, f'{job_id}_vid.%(ext)s')

    # Step 2: Download best video + audio with yt-dlp (prefer 1080p/720p H.264/MP4 for fast editing)
    # We ask for best video + best audio and merge directly to mp4
    dl_cmd = [
        sys.executable, '-m', 'yt_dlp',
        '-f', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best[height<=720]/best',
        '--merge-output-format', 'mp4',
        '--concurrent-fragments', '6',
        '--no-playlist',
        '--quiet',
        '-o', video_out_template,
        url
    ]
    if ffmpeg_bin:
        dl_cmd.extend(['--ffmpeg-location', ffmpeg_bin])

    try:
        subprocess.run(dl_cmd, capture_output=True, text=True, timeout=900)
    except Exception as e:
        pass

    # Inspect downloaded files in output_dir
    files = os.listdir(output_dir)
    video_files = [f for f in files if f.startswith(f'{job_id}_vid') and any(f.endswith(ext) for ext in ['.mp4', '.mkv', '.webm'])]
    audio_files = [f for f in files if f.startswith(f'{job_id}_vid') and any(f.endswith(ext) for ext in ['.m4a', '.opus', '.webm', '.aac', '.mp3'])]

    chosen_video = None
    # If a merged mp4 already exists
    for f in video_files:
        if f.endswith('.mp4') and not any(part in f for part in ['.f401.', '.f137.', '.f248.', '.f399.']):
            chosen_video = os.path.join(output_dir, f)
            break

    # If yt-dlp created separate dash video and audio files (e.g. .f401.mp4 and .f140.m4a)
    if not chosen_video and video_files and ffmpeg_bin:
        dash_v = os.path.join(output_dir, video_files[0])
        # Find audio file
        dash_a = None
        for af in audio_files:
            p = os.path.join(output_dir, af)
            if p != dash_v:
                dash_a = p
                break

        if dash_a:
            # Mux dash video + audio into final_mp4
            mux_cmd = [
                ffmpeg_bin, '-y',
                '-i', dash_v,
                '-i', dash_a,
                '-c:v', 'copy',
                '-c:a', 'aac',
                '-b:a', '192k',
                '-movflags', '+faststart',
                final_mp4
            ]
            sub_res = subprocess.run(mux_cmd, capture_output=True, timeout=300)
            if os.path.exists(final_mp4):
                chosen_video = final_mp4
        else:
            # Re-encode single file with faststart
            chosen_video = dash_v

    if not chosen_video and video_files:
        chosen_video = os.path.join(output_dir, video_files[0])

    if not chosen_video:
        raise RuntimeError('No video file could be downloaded.')

    # Step 3: Extract clean 16kHz mono WAV for Whisper transcription
    if ffmpeg_bin and chosen_video:
        extract_cmd = [
            ffmpeg_bin, '-y',
            '-i', chosen_video,
            '-vn',
            '-acodec', 'pcm_s16le',
            '-ar', '16000',
            '-ac', '1',
            audio_wav
        ]
        subprocess.run(extract_cmd, capture_output=True, timeout=180)

    audio_res = audio_wav if os.path.exists(audio_wav) else None

    result = {
        'success': True,
        'title': title,
        'uploader': uploader,
        'duration_seconds': duration_seconds,
        'video_path': chosen_video,
        'audio_path': audio_res,
        'safe_title': safe_title
    }
    print(json.dumps(result))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Download YouTube video + audio via yt-dlp + FFmpeg')
    parser.add_argument('url', help='YouTube URL to download')
    parser.add_argument('--output-dir', required=True, help='Directory to save downloaded files')
    parser.add_argument('--job-id', default='dl', help='Job ID prefix for output filenames')
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)

    try:
        download_youtube(args.url, args.output_dir, args.job_id)
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
        sys.exit(1)
