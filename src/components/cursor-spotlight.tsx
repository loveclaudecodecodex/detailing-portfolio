/**
 * CursorSpotlight — 마우스 따라다니는 골드 spotlight
 *
 * ★ 효과 ★
 *   다크 페이지 위에 은은한 골드 radial gradient 가 마우스를 따라 움직임.
 *   첫 인상 wow + 럭셔리 톤 강화.
 *
 * ★ 자주 수정 ★
 * ─ 색상:               radial-gradient 의 rgba(212,175,55,...) — brand-gold 기반
 * ─ 글로우 크기:        circle 380px (값↑ 더 넓게)
 * ─ 글로우 강도:        opacity 0.10 (값↑ 더 진하게, 너무 진하면 콘텐츠 가독성 ↓)
 * ─ 추적 부드러움:      lerp factor 0.18 (값↑ 빠르게 따라옴, 0.05~0.25)
 *
 * ★ 비활성 조건 ★
 * ─ prefers-reduced-motion: reduce
 * ─ 모바일 (max-width: 768px)
 */
"use client";

import { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
    }
    function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      if (el) {
        el.style.background = `radial-gradient(circle 380px at ${cx}px ${cy}px, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 35%, transparent 70%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      aria-hidden
    />
  );
}
