#!/usr/bin/env bash
# ============================================================
# Hero 영상 후처리 스크립트
# ------------------------------------------------------------
# Pexels 또는 AI 생성 원본 영상을 가이드 스펙으로 변환:
#   - PC : 1920×1080, H.264, ≤5MB, 오디오 제거, +faststart
#   - 모바일 : 1080×1920, H.264, ≤3MB, 오디오 제거, +faststart
#   - 옵션: 번호판 마스킹 (블러 또는 검은 박스)
#   - 옵션: 트림 (특정 구간만 사용)
#
# 사용법:
#   ./scripts/process-hero-video.sh \
#       --pc <원본-PC.mp4> \
#       --mobile <원본-모바일.mp4> \
#       [--pc-mask "x,y,w,h"]              # 검은 박스
#       [--pc-blur "x,y,w,h"]              # 가우시안 블러
#       [--pc-trim "start:end"]            # 예: "5:15" (5초~15초)
#       [--mobile-mask "x,y,w,h"]
#       [--mobile-blur "x,y,w,h"]
#       [--mobile-trim "start:end"]
#
# 예 (PC 번호판 가운데 하단 박스 마스킹 + 8~16초 사용):
#   ./scripts/process-hero-video.sh \
#       --pc ~/Downloads/pexels-bmw-m3.mp4 \
#       --mobile ~/Downloads/pexels-shiny-black.mp4 \
#       --pc-blur "860,820,400,120" \
#       --pc-trim "8:16"
#
# 의존성:
#   brew install ffmpeg
# ============================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${PROJECT_ROOT}/public/videos"

# ── 인자 파싱 ───────────────────────────────────────────
PC_SRC=""
MOBILE_SRC=""
PC_MASK=""
PC_BLUR=""
PC_TRIM=""
MOBILE_MASK=""
MOBILE_BLUR=""
MOBILE_TRIM=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pc)            PC_SRC="$2"; shift 2 ;;
    --mobile)        MOBILE_SRC="$2"; shift 2 ;;
    --pc-mask)       PC_MASK="$2"; shift 2 ;;
    --pc-blur)       PC_BLUR="$2"; shift 2 ;;
    --pc-trim)       PC_TRIM="$2"; shift 2 ;;
    --mobile-mask)   MOBILE_MASK="$2"; shift 2 ;;
    --mobile-blur)   MOBILE_BLUR="$2"; shift 2 ;;
    --mobile-trim)   MOBILE_TRIM="$2"; shift 2 ;;
    *) echo "❌ 알 수 없는 옵션: $1"; exit 1 ;;
  esac
done

# ── 검증 ────────────────────────────────────────────────
if [[ -z "$PC_SRC" || -z "$MOBILE_SRC" ]]; then
  echo "❌ --pc <파일> --mobile <파일> 필수"
  exit 1
fi
[[ -f "$PC_SRC" ]]     || { echo "❌ PC 원본 없음: $PC_SRC"; exit 1; }
[[ -f "$MOBILE_SRC" ]] || { echo "❌ 모바일 원본 없음: $MOBILE_SRC"; exit 1; }

command -v ffmpeg >/dev/null 2>&1 || {
  echo "❌ ffmpeg 미설치 →  brew install ffmpeg"; exit 1;
}

mkdir -p "$OUT_DIR"

# ── 필터 체인 빌더 ──────────────────────────────────────
# 입력: 마스킹 / 블러 좌표 (x,y,w,h)  +  목표 해상도 (WxH)
# 출력: -vf 에 들어갈 filter chain
build_filter() {
  local mask="$1" blur="$2" target_w="$3" target_h="$4"
  local chain=""

  # 1) 마스킹 (검은 박스)
  if [[ -n "$mask" ]]; then
    IFS=',' read -r mx my mw mh <<< "$mask"
    chain+="drawbox=x=${mx}:y=${my}:w=${mw}:h=${mh}:color=black:t=fill,"
  fi

  # 2) 가우시안 블러 (해당 영역)
  if [[ -n "$blur" ]]; then
    IFS=',' read -r bx by bw bh <<< "$blur"
    # crop+boxblur+overlay 패턴
    chain="[in]crop=${bw}:${bh}:${bx}:${by},boxblur=20:2[blr];[in][blr]overlay=${bx}:${by}[masked]; ${chain}"
  fi

  # 3) 스케일 + 크롭 (목표 해상도 채우기)
  chain+="scale=${target_w}:${target_h}:force_original_aspect_ratio=increase,crop=${target_w}:${target_h}"

  echo "$chain"
}

# 블러는 복합 필터(filter_complex) 필요해서 분리 처리
encode() {
  local src="$1" out="$2" target_w="$3" target_h="$4"
  local mask="$5" blur="$6" trim="$7"
  local crf="$8" bv="$9" maxrate="${10}" bufsize="${11}"

  local trim_args=""
  if [[ -n "$trim" ]]; then
    local start="${trim%:*}" end="${trim#*:}"
    local duration=$(( end - start ))
    trim_args="-ss ${start} -t ${duration}"
  fi

  if [[ -n "$blur" ]]; then
    # filter_complex 경로
    IFS=',' read -r bx by bw bh <<< "$blur"
    local extra_mask=""
    if [[ -n "$mask" ]]; then
      IFS=',' read -r mx my mw mh <<< "$mask"
      extra_mask=",drawbox=x=${mx}:y=${my}:w=${mw}:h=${mh}:color=black:t=fill"
    fi
    ffmpeg -y $trim_args -i "$src" \
      -filter_complex "[0:v]split[base][cp];[cp]crop=${bw}:${bh}:${bx}:${by},boxblur=25:3[blr];[base][blr]overlay=${bx}:${by}${extra_mask},scale=${target_w}:${target_h}:force_original_aspect_ratio=increase,crop=${target_w}:${target_h}[outv]" \
      -map "[outv]" \
      -c:v libx264 -preset slow -crf "$crf" \
      -b:v "$bv" -maxrate "$maxrate" -bufsize "$bufsize" \
      -an -pix_fmt yuv420p -movflags +faststart \
      "$out"
  else
    # 단순 -vf 경로
    local vf="scale=${target_w}:${target_h}:force_original_aspect_ratio=increase,crop=${target_w}:${target_h}"
    if [[ -n "$mask" ]]; then
      IFS=',' read -r mx my mw mh <<< "$mask"
      vf="drawbox=x=${mx}:y=${my}:w=${mw}:h=${mh}:color=black:t=fill,${vf}"
    fi
    ffmpeg -y $trim_args -i "$src" \
      -c:v libx264 -preset slow -crf "$crf" \
      -b:v "$bv" -maxrate "$maxrate" -bufsize "$bufsize" \
      -vf "$vf" \
      -an -pix_fmt yuv420p -movflags +faststart \
      "$out"
  fi
}

# ── PC 변환 ─────────────────────────────────────────────
echo "▶ PC 영상 변환 중..."
encode "$PC_SRC" "${OUT_DIR}/hero-bg.mp4" 1920 1080 \
  "$PC_MASK" "$PC_BLUR" "$PC_TRIM" 23 4M 5M 8M

# ── 모바일 변환 ─────────────────────────────────────────
echo "▶ 모바일 영상 변환 중..."
encode "$MOBILE_SRC" "${OUT_DIR}/hero-bg-mobile.mp4" 1080 1920 \
  "$MOBILE_MASK" "$MOBILE_BLUR" "$MOBILE_TRIM" 25 2.5M 3M 5M

# ── 결과 ────────────────────────────────────────────────
echo ""
echo "✅ 변환 완료"
ls -lh "${OUT_DIR}/hero-bg.mp4" "${OUT_DIR}/hero-bg-mobile.mp4"

PC_SIZE=$(stat -f%z "${OUT_DIR}/hero-bg.mp4")
MOBILE_SIZE=$(stat -f%z "${OUT_DIR}/hero-bg-mobile.mp4")
(( PC_SIZE > 5242880 ))     && echo "⚠️  PC 영상이 5MB 초과 — CRF를 25~27로 올려 재실행 권장"
(( MOBILE_SIZE > 3145728 )) && echo "⚠️  모바일 영상이 3MB 초과 — CRF를 27~29로 올려 재실행 권장"
