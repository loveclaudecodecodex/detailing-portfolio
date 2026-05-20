/**
 * WOW C — 시공 타임랩스 풀블리드 (영상 무한 루프 + GSAP 스크롤 진행 바)
 *
 * ★ 미디어 ★
 * ─ 영상 파일:          /public/videos/process-timelapse.mp4
 *                        · autoplay + muted + loop + playsInline
 *
 * ★ 영상 정책 ★
 *   영상 자체는 끊김 방지 위해 자연 무한 루프 (currentTime 컨트롤 X).
 *   대신 스크롤 진행은 영상 위에 가로 progress bar 로 시각화 → 인터랙션 시그널 제공.
 *
 * ★ 로딩 최적화 ★
 *   IntersectionObserver 가 섹션이 화면 1뷰포트 안에 접근하면 source 활성화.
 *
 * ★ GSAP ★
 *   하단 골드 progress bar — section 이 viewport 진입 ~ 빠져나갈 때까지 scaleX 0 → 1.
 *   ScrollTrigger scrub: true 라 스크롤과 1:1 동기화.
 *
 * ★ 자주 수정 ★
 * ─ 스크롤 거리:        section min-h-[200svh] — 영상 위에 머무는 길이
 * ─ progress bar 높이:  h-[3px]
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WowC() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // ── 영상 lazy load
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShouldLoad(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "100% 0px" }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // ── source 추가 후 강제 load + 재생
  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [shouldLoad]);

  // ── GSAP scroll-driven progress bar
  useEffect(() => {
    const section = sectionRef.current;
    const progress = progressRef.current;
    if (!section || !progress) return;

    const tween = gsap.fromTo(
      progress,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh bg-brand-black md:min-h-[200svh]"
    >
      <div className="h-svh w-full overflow-hidden md:sticky md:top-0">
        <video
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 size-full object-cover"
        >
          {shouldLoad && (
            <source src="/videos/process-timelapse.mp4" type="video/mp4" />
          )}
        </video>

        {/* 하단 어둠 마스크 (progress bar 가독성) */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-black/80 to-transparent" />

        {/* PROCESS 라벨 (좌하) */}
        <div className="absolute bottom-10 left-6 z-10 md:bottom-14 md:left-16">
          <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
            PROCESS
          </span>
        </div>

        {/* GSAP scrub progress bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-white/10">
          <div
            ref={progressRef}
            className="h-full origin-left bg-gradient-to-r from-brand-gold to-brand-bronze"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
