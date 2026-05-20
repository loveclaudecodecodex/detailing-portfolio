/**
 * WOW A — Before/After 클릭 토글 (split 없음)
 *
 * ★ 미디어 ★
 * ─ Before 이미지:      /public/images/wow-before.jpg
 * ─ After 이미지:       /public/images/wow-after.jpg
 *
 * ★ 자주 수정 ★
 * ─ 카테고리 라벨:      "BEFORE / AFTER"
 * ─ 헤드라인:           "같은 차, 같은 각도. 차이만 남습니다."
 * ─ 좌측 텍스트 힌트:   "BEFORE  ·  시공 전"
 * ─ 우측 텍스트 힌트:   "시공 후  ·  AFTER"
 * ─ 초기 상태:          useState<Mode>("before") — "after" 로 바꾸면 시공 후로 시작
 *
 * ★ 동작 ★
 *   2가지 모드만: "before" | "after". 항상 한 장만 풀화면.
 *   ─ 좌측 영역 클릭 → BEFORE 로 전환
 *   ─ 우측 영역 클릭 → AFTER 로 전환
 *   ─ opacity 850ms cubic-bezier 페이드
 *
 * ★ 컬러 ★
 * ─ 활성 라벨:          text-brand-gold
 * ─ 비활성 라벨:        text-foreground/60 (호버 시 foreground)
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Mode = "before" | "after";

export default function WowA() {
  const [mode, setMode] = useState<Mode>("before");
  const sectionRef = useRef<HTMLElement>(null);
  const introPlayedRef = useRef(false);

  // 진입 1회 자동 wipe: Before → 1.2s 후 After → 2.5s 후 Before 복귀
  useEffect(() => {
    if (introPlayedRef.current) return;
    const el = sectionRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.4 && !introPlayedRef.current) {
            introPlayedRef.current = true;
            const toAfter = setTimeout(() => setMode("after"), 1200);
            const toBefore = setTimeout(() => setMode("before"), 1200 + 2500);
            obs.disconnect();
            return () => {
              clearTimeout(toAfter);
              clearTimeout(toBefore);
            };
          }
        });
      },
      { threshold: [0, 0.4, 0.7] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[640px] select-none overflow-hidden bg-brand-black">
      {/* Before — 항상 깔림 */}
      <Image
        src="/images/wow-before.jpg"
        alt="시공 전 차량"
        fill
        sizes="100vw"
        priority
        className="object-cover"
        draggable={false}
      />

      {/* After — opacity 페이드 */}
      <Image
        src="/images/wow-after.jpg"
        alt="시공 후 차량"
        fill
        sizes="100vw"
        className={cn(
          "object-cover transition-opacity duration-[850ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
          mode === "after" ? "opacity-100" : "opacity-0"
        )}
        draggable={false}
      />

      {/* ── 좌측 클릭 → BEFORE ── */}
      <button
        type="button"
        onClick={() => setMode("before")}
        aria-label="시공 전 보기"
        className="group absolute inset-y-0 left-0 z-20 w-1/2 cursor-pointer focus-visible:outline-none"
      >
        <span
          className={cn(
            "absolute bottom-10 left-6 text-[11px] font-semibold tracking-[0.32em] transition-all md:bottom-14 md:left-12",
            mode === "before"
              ? "text-brand-gold"
              : "text-foreground/60 group-hover:text-foreground"
          )}
        >
          BEFORE &nbsp;·&nbsp; 시공 전
        </span>
      </button>

      {/* ── 우측 클릭 → AFTER ── */}
      <button
        type="button"
        onClick={() => setMode("after")}
        aria-label="시공 후 보기"
        className="group absolute inset-y-0 right-0 z-20 w-1/2 cursor-pointer focus-visible:outline-none"
      >
        <span
          className={cn(
            "absolute bottom-10 right-6 text-[11px] font-semibold tracking-[0.32em] transition-all md:bottom-14 md:right-12",
            mode === "after"
              ? "text-brand-gold"
              : "text-foreground/60 group-hover:text-foreground"
          )}
        >
          시공 후 &nbsp;·&nbsp; AFTER
        </span>
      </button>

      {/* 다크 마스크 — 카피 가독성 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-brand-black/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-brand-black/75 to-transparent" />

      {/* 상단 카피 */}
      <div className="pointer-events-none absolute inset-x-0 top-14 z-30 px-6 text-center">
        <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
          BEFORE / AFTER
        </span>
        <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-foreground drop-shadow-2xl md:text-5xl">
          같은 차, 같은 각도. 차이만 남습니다.
        </h2>
      </div>
    </section>
  );
}
