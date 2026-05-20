/**
 * Lenis Smooth Scroll Provider  +  GSAP ScrollTrigger 동기화
 *
 * ★ 스크롤 느낌 튜닝 ★
 * ─ duration:        0.8 (빠릿) / 1.15 (현재) / 1.5 (부드러움)
 * ─ wheelMultiplier: 휠 한 칸 거리 (1 = OS 기본)
 *
 * ★ GSAP ScrollTrigger 와 어떻게 연결되는가 ★
 *   Lenis 가 native scroll 을 가로채는데, GSAP ScrollTrigger 는 native scroll 을 보고 동작함.
 *   → `gsap.ticker` 안에서 `lenis.raf()` 호출 + `lenis.on('scroll', ScrollTrigger.update)` 로
 *     Lenis 스크롤이 발생할 때마다 ScrollTrigger 가 다시 계산.
 *   덕분에 모든 GSAP ScrollTrigger 가 Lenis 의 부드러운 스크롤과 100% 동기화됨.
 *
 * ★ 비활성화 ★
 * ─ app/layout.tsx 에서 <LenisProvider>{children}</LenisProvider> 를 그냥 {children} 으로
 */
"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type ReactNode } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    function update(time: number) {
      lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // 페이지 첫 진입 시 ScrollTrigger 강제 refresh
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return null;
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
