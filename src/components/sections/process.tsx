/**
 * Process — 시공 프로세스 4단계 (텍스트 카드 stagger)
 *
 * ★ 자주 수정 ★
 * ─ 단계 추가/삭제:     `steps` 배열 (num/title/desc)
 * ─ 단계 수 변경:       4단계 외에는 grid-cols-4 → grid-cols-N 조정
 *
 * ★ 컬러 ★
 * ─ 단계 번호:          text-brand-gold
 * ─ 카드 보더:          border-white/5 (호버 시 골드)
 *
 * ★ GSAP ★
 * ─ 헤더 fade-up + 카드 4개 stagger 0.1s
 */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "상담 · 견적",
    desc: "차종 + 시공 옵션 확정. 카톡으로 사진 받고 정확한 견적 안내.",
  },
  {
    num: "02",
    title: "입고 · 사전 처리",
    desc: "차량 입고 후 세차 + 마스킹. 시공 직전 도장면 정밀 점검.",
  },
  {
    num: "03",
    title: "정밀 시공",
    desc: "PPF · 세라믹 코팅 · 윈도우 틴팅. 한 대당 평균 12시간 작업.",
  },
  {
    num: "04",
    title: "검수 · 출고",
    desc: "최종 검수 + 사후 케어 안내. 10년 보증서 발급.",
  },
];

export default function Process() {
  const headerRef = useRef<HTMLElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
      if (ulRef.current) {
        gsap.from(ulRef.current.children, {
          opacity: 0, y: 40, duration: 0.7, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ulRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-brand-black py-16 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <header ref={headerRef} className="mb-12 text-center">
          <div className="font-display text-7xl leading-none text-brand-gold/30 md:text-[120px]">
            02
          </div>
          <h2 className="-mt-2 font-display text-5xl tracking-tight text-foreground md:text-6xl">
            Process
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground md:text-base">
            상담부터 출고까지 4단계로 진행합니다.
          </p>
        </header>

        <ul ref={ulRef} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.num}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-7 transition-colors hover:border-brand-gold/30 hover:bg-white/[0.04]"
            >
              <div className="font-display text-4xl text-brand-gold">
                {s.num}
              </div>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
