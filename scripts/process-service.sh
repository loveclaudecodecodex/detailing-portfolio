#!/usr/bin/env bash
# ============================================================
# 서비스 카드 후처리 스크립트
# ------------------------------------------------------------
# GPT-Image-2 생성 PNG → 800×600 JPG로 변환:
#   - 4:3 종횡비로 가운데 크롭
#   - 800×600 다운스케일
#   - JPG 85% 변환
#   - public/images/service-{ppf,tint,wrap,coating}.jpg 배치
#
# 사용법:
#   ./scripts/process-service.sh <slug> <원본.png>
#
# slug: ppf | tint | wrap | coating
#
# 예:
#   ./scripts/process-service.sh ppf  ~/Downloads/service-ppf.png
#   ./scripts/process-service.sh tint ~/Downloads/service-tint.png
#   ./scripts/process-service.sh wrap ~/Downloads/service-wrap.png
#
# 배치 모드:
#   ./scripts/process-service.sh --batch <디렉토리>
#   → service-{ppf,tint,wrap}.png 패턴 매칭하여 일괄 변환
#
# 의존성: ffmpeg
# ============================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${PROJECT_ROOT}/public/images"

command -v ffmpeg >/dev/null 2>&1 || {
  echo "❌ ffmpeg 미설치 → brew install ffmpeg"; exit 1;
}

mkdir -p "$OUT_DIR"

VALID_SLUGS=("ppf" "tint" "wrap" "coating")

is_valid_slug() {
  local s="$1"
  for v in "${VALID_SLUGS[@]}"; do
    [[ "$v" == "$s" ]] && return 0
  done
  return 1
}

convert_one() {
  local src="$1" slug="$2"
  local out="${OUT_DIR}/service-${slug}.jpg"
  echo "▶ service-${slug}.jpg 변환 중..."

  local in_w in_h
  in_w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width  -of csv=p=0 "$src")
  in_h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src")
  echo "  입력: ${in_w}×${in_h}"

  # 4:3으로 가운데 크롭 후 800×600 다운스케일
  # 1. 가로 800에 맞춰 비율 유지
  # 2. 800×600 가운데 크롭
  ffmpeg -y -i "$src" \
    -vf "scale=800:-2:force_original_aspect_ratio=increase,crop=800:600" \
    -q:v 2 \
    "$out" \
    -loglevel error

  ls -lh "$out" | awk '{printf "  결과: %s  %s\n", $5, $NF}'
}

# 배치 모드 ─────────────────────────────────────────────────────
if [[ "${1:-}" == "--batch" ]]; then
  BATCH_DIR="${2:-}"
  [[ -z "$BATCH_DIR" || ! -d "$BATCH_DIR" ]] && {
    echo "❌ 사용법: $0 --batch <디렉토리>"; exit 1;
  }

  echo "▶ 배치 모드: ${BATCH_DIR}"
  echo ""

  COUNT=0
  for slug in ppf tint wrap; do
    src=""
    for ext in png PNG; do
      candidate="$BATCH_DIR/service-${slug}.${ext}"
      [[ -f "$candidate" ]] && { src="$candidate"; break; }
    done
    if [[ -z "$src" ]]; then
      echo "⚠️  service-${slug}.png 없음 — 스킵"
      continue
    fi
    convert_one "$src" "$slug"
    echo ""
    COUNT=$((COUNT + 1))
  done

  echo "✅ 총 ${COUNT}장 변환 완료"
  exit 0
fi

# 단일 카드 모드 ────────────────────────────────────────────────
SLUG="${1:-}"
SRC="${2:-}"

if [[ -z "$SLUG" || -z "$SRC" ]]; then
  cat <<EOF
❌ 사용법:
   $0 <slug> <원본.png>
   $0 --batch <디렉토리>

slug: ppf | tint | wrap | coating

예:
   $0 ppf  ~/Downloads/service-ppf.png
   $0 --batch ~/Desktop
EOF
  exit 1
fi

if ! is_valid_slug "$SLUG"; then
  echo "❌ 유효하지 않은 slug: $SLUG"
  echo "   사용 가능: ${VALID_SLUGS[*]}"
  exit 1
fi

[[ -f "$SRC" ]] || { echo "❌ 원본 없음: $SRC"; exit 1; }

convert_one "$SRC" "$SLUG"

echo ""
echo "✅ service-${SLUG}.jpg 변환 완료"
