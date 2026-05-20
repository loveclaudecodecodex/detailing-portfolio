/**
 * Brand Marquee — saintcut HTML 구조 그대로 (이미지 src 도 saintcut.com 절대 경로)
 *
 * ⚠️ 임시 데모용 ⚠️
 *   이미지 11장은 saintcut.com 의 wp-content 자산입니다.
 *   실 서비스 전에 반드시 본인 시공 사진으로 교체하세요.
 *   교체 방법:
 *     1) /public/brands/ 폴더에 main_banner_001.png ~ 011.png 같은 명명으로 11장 배치
 *     2) 아래 `images` 배열의 URL 을 "/brands/main_banner_001.png" 로 변경
 *
 *   saintcut 측이 referer 차단 / 이미지 삭제 시 깨질 수 있음.
 *
 * ★ 자주 수정 ★
 * ─ 이미지 추가/삭제:   `images` 배열 직접 수정
 * ─ 마퀴 속도:          [--duration:50s] 값 조정 (값↑ 천천히)
 * ─ 이미지 높이:        h-32 (128px) — 원본 비율 유지하면서 높이만 고정
 */
"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";

// saintcut.com 원본 URL (포트폴리오 데모용, 실서비스 시 교체 필요)
const images = [
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_001.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_002.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_003.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_004.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_005.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_006.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_007.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_008.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_009.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_010.png",
  "https://saintcut.com/wp-content/uploads/2024/01/main_banner_011.png",
];

export default function Stats() {
  return (
    <section className="overflow-hidden bg-brand-black py-12 md:py-24">
      <Marquee className="[--duration:50s] [--gap:2.5rem]" pauseOnHover>
        {images.map((src) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={200}
            height={160}
            unoptimized
            // mix-blend-screen: 흰색 배경 → 다크에 자연 흡수, 검정 로고는 살아남음
            className="h-32 w-auto shrink-0 object-contain mix-blend-screen transition-opacity hover:opacity-100 md:h-40"
            draggable={false}
          />
        ))}
      </Marquee>
    </section>
  );
}
