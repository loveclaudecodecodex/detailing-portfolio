#!/usr/bin/env bash
# ============================================================
# 영상 분석 도구 — 번호판 좌표 찾기용
# ------------------------------------------------------------
# 영상에서 시작·중간·끝·1초 간격 프레임을 추출해 시각적 확인 가능
#
# 사용법:
#   ./scripts/extract-frames.sh <영상.mp4>
#
# 출력: /tmp/frames-<이름>/ 에 프레임 PNG 저장
#       Finder에서 직접 열어 번호판 좌표(x,y,w,h) 메모
# ============================================================

set -euo pipefail

SRC="${1:-}"
[[ -z "$SRC" || ! -f "$SRC" ]] && { echo "❌ 사용법: $0 <영상.mp4>"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || {
  echo "❌ ffmpeg 미설치 →  brew install ffmpeg"; exit 1;
}

NAME="$(basename "$SRC" | sed 's/\.[^.]*$//')"
OUT_DIR="/tmp/frames-${NAME}"
mkdir -p "$OUT_DIR"

# 영상 정보
echo "▶ 영상 정보:"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,duration,nb_frames \
  -of default=noprint_wrappers=1 "$SRC"
echo ""

# 1초 간격으로 프레임 추출
echo "▶ 1초 간격 프레임 추출 중 → ${OUT_DIR}"
ffmpeg -y -i "$SRC" -vf "fps=1" "${OUT_DIR}/frame-%03d.png" 2>&1 | tail -3

# Finder 열기
echo ""
echo "✅ 완료. Finder 열기:"
echo "    open ${OUT_DIR}"
open "$OUT_DIR" 2>/dev/null || true

echo ""
echo "💡 다음 단계:"
echo "  1. 프레임 PNG들을 열어 번호판 위치 확인"
echo "  2. 미리보기에서 좌상단(x,y)와 크기(w,h) 메모"
echo "     (미리보기 → 도구 → 선택 후 인스펙터)"
echo "  3. 다음 명령으로 마스킹:"
echo "     ./scripts/process-hero-video.sh \\"
echo "         --pc \"$SRC\" \\"
echo "         --mobile <모바일.mp4> \\"
echo "         --pc-blur \"x,y,w,h\""
