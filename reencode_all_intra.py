import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using FFmpeg binary at: {ffmpeg_exe}")

input_desktop = "public/images/elevator-hero.mp4"
input_mobile = "public/images/elevator-hero-720p.mp4"

output_desktop = "public/images/elevator-allkeyframe-desktop.mp4"
output_mobile = "public/images/elevator-allkeyframe-mobile.mp4"

# FFmpeg flags for All-Intra keyframe-every-frame encoding:
# -c:v libx264: H.264 video codec
# -g 1: GOP size = 1 (every frame is a keyframe!)
# -keyint_min 1: Minimum keyframe interval = 1
# -bf 0: Disable B-frames (b-frames require forward/backward decoding dependencies)
# -crf 18: High quality
# -pix_fmt yuv420p: Standard Web-compatible 8-bit YUV 4:2:4 chroma for hardware video decoders
# -movflags +faststart: Move MP4 MOOV atom to header for instant 0ms Web streaming

def convert_video(src, dst):
    if not os.path.exists(src):
        print(f"Source video {src} not found!")
        return
    print(f"\n--- Encoding All-Intra Keyframe Video: {src} -> {dst} ---")
    cmd = [
        ffmpeg_exe, "-y",
        "-i", src,
        "-c:v", "libx264",
        "-g", "1",
        "-keyint_min", "1",
        "-bf", "0",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        dst
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode == 0:
        size_mb = os.path.getsize(dst) / (1024 * 1024)
        print(f"SUCCESS! Output created: {dst} ({size_mb:.2f} MB)")
    else:
        print(f"ERROR encoding {src}:\n{res.stderr}")

convert_video(input_desktop, output_desktop)
convert_video(input_mobile, output_mobile)
