#!/usr/bin/env bash
# ============================================================
# WOW A 이미지 후처리 스크립트
# ------------------------------------------------------------
# GPT-Image-2 생성 PNG(1920×1088) → 미디어 가이드 스펙으로 변환:
#   - 위아래 4px 크롭 → 1920×1080
#   - JPG 85% 변환
#   - public/images/wow-after.jpg, wow-before.jpg 배치
#
# 사용법:
#   ./scripts/process-wow-a.sh <after.png> <before.png>
#
# 예:
#   ./scripts/process-wow-a.sh \
#       ~/Downloads/wow-after.png \
#       ~/Downloads/wow-before.png
#
# 의존성: ffmpeg (이미 설치됨)
# ============================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${PROJECT_ROOT}/public/images"

AFTER_SRC="${1:-}"
BEFORE_SRC="${2:-}"

if [[ -z "$AFTER_SRC" || -z "$BEFORE_SRC" ]]; then
  echo "❌ 사용법: $0 <after.png> <before.png>"
  exit 1
fi

[[ -f "$AFTER_SRC" ]]  || { echo "❌ after 없음: $AFTER_SRC"; exit 1; }
[[ -f "$BEFORE_SRC" ]] || { echo "❌ before 없음: $BEFORE_SRC"; exit 1; }

command -v ffmpeg >/dev/null 2>&1 || {
  echo "❌ ffmpeg 미설치 → brew install ffmpeg"; exit 1;
}

mkdir -p "$OUT_DIR"

convert_one() {
  local src="$1" out="$2"
  echo "▶ $(basename "$out") 변환 중..."

  # 입력 크기 확인
  local in_w in_h
  in_w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width  -of csv=p=0 "$src")
  in_h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src")
  echo "  입력: ${in_w}×${in_h}"

  # 1920×1080 중앙 크롭 (입력이 1088이면 위아래 4px씩, 다른 크기여도 OK)
  ffmpeg -y -i "$src" \
    -vf "scale=1920:-2:force_original_aspect_ratio=increase,crop=1920:1080" \
    -q:v 2 \
    "$out" \
    -loglevel error

  # 결과 출력
  ls -lh "$out"
}

convert_one "$AFTER_SRC"  "${OUT_DIR}/wow-after.jpg"
convert_one "$BEFORE_SRC" "${OUT_DIR}/wow-before.jpg"

echo ""
echo "✅ WOW A 페어 변환 완료"
echo ""
echo "📋 다음 단계:"
echo "  1. 두 이미지를 시각 검증 (차종/각도/광원 일치 확인)"
echo "  2. docs/자산_등록부.md 표 갱신"
echo "  3. 다른 세션이 WOW A 컴포넌트 구현 가능"
