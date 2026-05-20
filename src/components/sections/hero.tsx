/**
 * Hero — 시네마틱 풀블리드 영상 + 좌하단 카피 (D 컨셉)
 *
 * ★ 미디어 ★
 * ─ 영상:               /public/videos/hero-bg.mp4   (PC/모바일 공통, object-cover 로 크롭)
 * ─ Poster:             /public/images/hero-poster.jpg
 *
 * ★ 자주 수정 ★
 * ─ eyebrow:            "PROCESS · DETAIL · CARE"
 * ─ h1 두 줄:           "신차 출고 직후," / "가장 중요한 시간."
 * ─ sub:                "PPF · 세라믹 코팅 · 윈도우 틴팅. 강남, 예약제 운영."
 * ─ CTA 텍스트/링크:    "상담 예약" / href="#cta"
 *
 * ★ GSAP 인트로 ★
 *   페이지 진입 1초 후 카피들이 stagger 로 fade-up.
 *   순서: eyebrow → h1 line1 → h1 line2 → sub → CTA → scroll hint
 *   각 요소 마스크된 inline-block 안에서 y: 100% → 0 슬라이드.
 */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root.querySelectorAll("[data-anim]"), { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // 헤드라인 글자별 stagger (더 미세한 시네마틱)
      const headlineChars = root.querySelectorAll("[data-char]");
      if (headlineChars.length > 0) {
        gsap.from(headlineChars, {
          y: "100%",
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.03,
          delay: 0.5,
        });
      }
      // 나머지 요소 (eyebrow, sub, CTA) fade-up
      gsap.from("[data-anim]", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.14,
        delay: 0.25,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-brand-black"
    >
      {/* ▶ 배경 영상 — PC/모바일 공통. object-cover 로 좌우 또는 상하 크롭 */}
      <video
        className="absolute inset-0 size-full object-cover"
        poster="/images/hero-poster.jpg"
        src="/videos/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* 하단 그라디언트 마스크 */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-brand-black via-brand-black/70 to-transparent" />

      {/* 카피 — GSAP stagger */}
      <div
        ref={rootRef}
        className="absolute inset-0 mx-auto flex max-w-[1440px] flex-col justify-end px-6 pb-16 md:px-16 md:pb-32"
      >
        <span data-anim className="text-[10px] font-semibold tracking-[0.32em] text-brand-gold md:text-xs">
          PROCESS · DETAIL · CARE
        </span>
        <h1 className="mt-4 text-[34px] font-extrabold leading-[1.15] tracking-tight text-foreground md:mt-5 md:text-6xl">
          <span className="block overflow-hidden">
            {"신차 출고 직후,".split("").map((ch, i) => (
              <span key={i} data-char className="inline-block">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden">
            {"가장 중요한 시간.".split("").map((ch, i) => (
              <span key={i} data-char className="inline-block">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </h1>
        <p data-anim className="mt-5 text-[13px] text-muted-foreground md:mt-6 md:text-base">
          PPF · 세라믹 코팅 · 윈도우 틴팅. 강남, 예약제 운영.
        </p>

        <div data-anim className="mt-7 flex items-center gap-4 md:mt-8">
          <a
            href="#cta"
            className="rounded-full bg-gradient-to-br from-brand-gold to-brand-bronze px-6 py-3 text-sm font-semibold text-brand-black transition-transform hover:scale-[1.03] md:px-7 md:py-3.5"
          >
            상담 예약
          </a>
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center text-muted-foreground">
        <div data-anim className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.32em]">SCROLL</span>
          <span className="animate-bounce text-base">↓</span>
        </div>
      </div>
    </section>
  );
}
