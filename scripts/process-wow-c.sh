#!/usr/bin/env bash
# ============================================================
# WOW C 시공 타임랩스 후처리 스크립트
# ------------------------------------------------------------
# 단일 시공 영상을 30초 매끄러운 타임랩스로 변환:
#   - 슬로우다운 (목표 길이 30초에 맞춰 자동 계산)
#   - minterpolate (motion compensated interpolation, 30fps 매끄러움)
#   - 1920×1080, ≤10MB, 오디오 제거, +faststart
#
# 단계별 텍스트 오버레이는 영상에 박지 않음 — 코드 세션의
# GSAP/CSS 레이어에서 처리 (스크롤 시점에 동적 변경 가능)
#
# 사용법:
#   ./scripts/process-wow-c.sh <원본.mp4>
#
# 예:
#   ./scripts/process-wow-c.sh raw-media/pexels-detailer-polishing-black-car.mp4
#
# 의존성: ffmpeg
# ============================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${PROJECT_ROOT}/public/videos"
OUT_FILE="${OUT_DIR}/process-timelapse.mp4"
TARGET_DURATION=30  # 초

SRC="${1:-}"
[[ -z "$SRC" || ! -f "$SRC" ]] && { echo "❌ 사용법: $0 <원본.mp4>"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || {
  echo "❌ ffmpeg 미설치 → brew install ffmpeg"; exit 1;
}

mkdir -p "$OUT_DIR"

# 원본 길이 측정
SRC_DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
echo "▶ 원본 길이: ${SRC_DURATION}초"
echo "▶ 목표 길이: ${TARGET_DURATION}초"

# PTS 배율 계산 (예: 16초 → 30초면 1.875x)
PTS_FACTOR=$(awk "BEGIN { printf \"%.4f\", ${TARGET_DURATION} / ${SRC_DURATION} }")
echo "▶ PTS 배율: ${PTS_FACTOR}x"

echo ""
echo "▶ 변환 중 (minterpolate 사용 — 시간 다소 소요)..."

# 슬로우다운 + minterpolate로 30fps 매끄러움 유지
# minterpolate mode=mci (motion compensated interpolation, 가장 자연스러움)
ffmpeg -y -i "$SRC" \
  -filter:v "setpts=${PTS_FACTOR}*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libx264 -preset slow -crf 23 \
  -b:v 6M -maxrate 10M -bufsize 16M \
  -an -pix_fmt yuv420p -movflags +faststart \
  -t "$TARGET_DURATION" \
  "$OUT_FILE" 2>&1 | tail -3

echo ""
echo "✅ 변환 완료"
ls -lh "$OUT_FILE"

ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate:format=duration,size \
  -of default=noprint_wrappers=1 "$OUT_FILE"

SIZE=$(stat -f%z "$OUT_FILE")
(( SIZE > 10485760 )) && echo "⚠️  10MB 초과 — CRF를 25~27로 올려 재실행 권장"
