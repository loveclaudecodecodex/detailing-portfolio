#!/usr/bin/env bash
# ============================================================
# 포트폴리오 페어 후처리 스크립트
# ------------------------------------------------------------
# GPT-Image-2 생성 PNG(1920×1088 권장) → 미디어 가이드 스펙으로:
#   - 위아래 4px 크롭 → 1920×1080
#   - 1600×900 다운스케일
#   - JPG 85% 변환
#   - public/images/portfolio-NN-{before,after}.jpg 배치
#
# 두 가지 사용법 ───────────────────────────────────────────────
#
# A. 단일 페어:
#    ./scripts/process-portfolio.sh 01 <after.png> <before.png>
#
# B. 디렉토리 일괄 (파일명 규칙 준수 필수):
#    ./scripts/process-portfolio.sh --batch <dir>
#    → <dir>에서 portfolio-NN-after.png / portfolio-NN-before.png 매칭하여 일괄 변환
#
# 예:
#   ./scripts/process-portfolio.sh 01 ~/Downloads/p01-after.png ~/Downloads/p01-before.png
#   ./scripts/process-portfolio.sh --batch ~/Desktop
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

convert_one() {
  local src="$1" out="$2"
  echo "▶ $(basename "$out") 변환 중..."

  local in_w in_h
  in_w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width  -of csv=p=0 "$src")
  in_h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src")
  echo "  입력: ${in_w}×${in_h}"

  # 16:9 유지하며 1600×900 출력
  # 1. 가로 1600에 맞춰 비율 유지 스케일
  # 2. 1600×900 가운데 크롭 (입력이 16:9 아니어도 안전)
  ffmpeg -y -i "$src" \
    -vf "scale=1600:-2:force_original_aspect_ratio=increase,crop=1600:900" \
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

  PAIR_COUNT=0
  for after in "$BATCH_DIR"/portfolio-*-after.png "$BATCH_DIR"/portfolio-*-after.PNG; do
    [[ ! -f "$after" ]] && continue
    fname=$(basename "$after")
    base="${fname%.[pP][nN][gG]}"      # 확장자 제거 → portfolio-NN-after
    base="${base%-after}"               # -after 제거 → portfolio-NN
    num="${base#portfolio-}"            # portfolio- 제거 → NN
    before="$BATCH_DIR/${base}-before.png"
    [[ ! -f "$before" ]] && before="$BATCH_DIR/${base}-before.PNG"
    if [[ ! -f "$before" ]]; then
      echo "⚠️  ${base}: before 짝 없음 — 스킵"
      continue
    fi

    echo "── Pair ${num} ──────────"
    convert_one "$after"  "${OUT_DIR}/portfolio-${num}-after.jpg"
    convert_one "$before" "${OUT_DIR}/portfolio-${num}-before.jpg"
    echo ""
    PAIR_COUNT=$((PAIR_COUNT + 1))
  done

  echo "✅ 총 ${PAIR_COUNT}쌍 변환 완료"
  exit 0
fi

# 단일 페어 모드 ────────────────────────────────────────────────
NUM="${1:-}"
AFTER_SRC="${2:-}"
BEFORE_SRC="${3:-}"

if [[ -z "$NUM" || -z "$AFTER_SRC" || -z "$BEFORE_SRC" ]]; then
  cat <<EOF
❌ 사용법:
   $0 <번호> <after.png> <before.png>
   $0 --batch <디렉토리>

예:
   $0 01 ~/Downloads/p01-after.png ~/Downloads/p01-before.png
   $0 --batch ~/Desktop
EOF
  exit 1
fi

# 번호 정규화 (1 → 01)
NUM_PADDED=$(printf "%02d" "$NUM")

[[ -f "$AFTER_SRC" ]]  || { echo "❌ after 없음: $AFTER_SRC"; exit 1; }
[[ -f "$BEFORE_SRC" ]] || { echo "❌ before 없음: $BEFORE_SRC"; exit 1; }

echo "── Pair ${NUM_PADDED} ──────────"
convert_one "$AFTER_SRC"  "${OUT_DIR}/portfolio-${NUM_PADDED}-after.jpg"
convert_one "$BEFORE_SRC" "${OUT_DIR}/portfolio-${NUM_PADDED}-before.jpg"

echo ""
echo "✅ Pair ${NUM_PADDED} 변환 완료"
echo ""
echo "📋 다음 단계:"
echo "  1. 페어 시각 검증 (차종/각도/광원 일치)"
echo "  2. 6쌍 모두 완료되면 docs/자산_등록부.md 갱신"
