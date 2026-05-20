/**
 * SectionReveal — GSAP ScrollTrigger 진입 시 fade-up
 *
 * ★ 사용법 ★
 *   <SectionReveal>              // 자기 자신을 fade-up
 *   <SectionReveal stagger>      // 자식들을 0.08초 간격으로 stagger fade-up
 *   <SectionReveal delay={0.3}>  // 진입 + 0.3초 대기 후 시작
 *
 * ★ 자주 수정 ★
 * ─ 시작 위치:          start: "top 80%" — top 이 viewport 80% 지점 도달 시 트리거
 *                       빠르게 → "top 90%" / 늦게 → "top 65%"
 * ─ Fade-up 거리:       y: 40 → 값↑ 더 멀리서 올라옴
 * ─ duration:           0.9s
 * ─ stagger 간격:       0.08s
 * ─ ease:               "power2.out" (부드러운 감속)
 *
 * ★ 동작 ★
 *   prefers-reduced-motion: reduce 일 때 애니메이션 X.
 *   ScrollTrigger toggleActions: play none none reverse → 다시 위로 스크롤하면 역재생.
 */
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
  y?: number;
};

export default function SectionReveal({
  children,
  className,
  delay = 0,
  stagger = false,
  y = 40,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 접근성 — 모션 감소 환경 존중
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(stagger ? el.children : el, { opacity: 1, y: 0 });
      return;
    }

    const targets = stagger ? el.children : el;
    const tween = gsap.from(targets, {
      opacity: 0,
      y,
      duration: 0.9,
      ease: "power2.out",
      stagger: stagger ? 0.08 : 0,
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
