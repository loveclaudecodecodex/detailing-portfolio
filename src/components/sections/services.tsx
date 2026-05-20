/**
 * Services — 매거진식 2-column 비대칭 레이아웃
 *
 * ★ 구조 ★
 *   lg 이상: 좌측 sticky 챕터 마커(01 / Services / 인트로 카피)
 *            우측 서비스 카드 세로 스택 (image 좌 / 텍스트 우 horizontal)
 *   lg 미만: 헤더 → 카드 순으로 자연 스택, sticky 해제
 *
 * ★ 미디어 ★
 * ─ 각 서비스 배경:     /public/images/service-{ppf|coating|tint|wrap}.jpg
 *
 * ★ 자주 수정 ★
 * ─ 서비스 추가/삭제:   `services` 배열
 * ─ 좌측 카피:          <header> 내 <p>
 *
 * ★ GSAP 인터랙션 ★
 * ─ Header fade-up      섹션 진입 시 카테고리/제목 부드럽게 등장
 * ─ Cards stagger       카드들이 0.1초 간격으로 차례로 fade-up
 */
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ShieldCheck, Droplets, Sun, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const services: Array<{
  icon: LucideIcon;
  image: string;
  enTitle: string;
  koTitle: string;
  desc: string;
}> = [
  { icon: ShieldCheck, image: "/images/service-ppf.jpg",     enTitle: "PPF",             koTitle: "페인트 보호 필름", desc: "스톤칩 · 스크래치 · 자외선. 10년 보증." },
  { icon: Droplets,    image: "/images/service-coating.jpg", enTitle: "Ceramic Coating", koTitle: "세라믹 코팅",     desc: "9H 나노 세라믹. 발수 · 광택 유지." },
  { icon: Sun,         image: "/images/service-tint.jpg",    enTitle: "Window Tint",     koTitle: "윈도우 틴팅",     desc: "자외선 99% · 적외선 92% 차단." },
  { icon: Palette,     image: "/images/service-wrap.jpg",    enTitle: "Wrap",            koTitle: "랩핑 / 데칼",     desc: "컬러 체인지 · 부분 시공." },
];

export default function Services() {
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
          opacity: 0, y: 50, duration: 0.8, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ulRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="bg-brand-black py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(280px,400px)_1fr] lg:gap-24">
          {/* LEFT — sticky chapter marker */}
          <header ref={headerRef} className="lg:sticky lg:top-28 lg:self-start">
            <div className="font-display text-7xl leading-none text-brand-gold/30 md:text-[120px]">
              01
            </div>
            <h2 className="-mt-2 font-display text-5xl tracking-tight text-foreground md:text-6xl">
              Services
            </h2>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-muted-foreground">
              신차 출고 직후가 가장 중요한 시간.<br />
              페인트가 가장 깨끗할 때 시작하는 디테일링 4종.
            </p>
            <div className="mt-10 hidden items-center gap-3 text-[10px] font-semibold tracking-[0.32em] text-brand-gold lg:flex">
              <span className="h-px w-12 bg-brand-gold/50" />
              <span>SCROLL</span>
            </div>
          </header>

          {/* RIGHT — service cards (horizontal layout) */}
          <ul ref={ulRef} className="flex flex-col gap-5 md:gap-8">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.enTitle}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:border-brand-gold/30 hover:bg-white/[0.04]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[40%_1fr]">
                    <div className="relative aspect-[4/3] overflow-hidden sm:aspect-square">
                      <Image
                        src={s.image}
                        alt={`${s.enTitle} 시공 예시`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 320px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        draggable={false}
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 md:p-8">
                      <div className="flex size-11 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-black/50 backdrop-blur transition-all duration-300 group-hover:border-brand-gold/80 group-hover:bg-brand-gold/15">
                        <Icon className="size-5 text-brand-gold" strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground md:text-3xl">
                        {s.enTitle}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">{s.koTitle}</p>
                      <p className="mt-4 text-sm leading-relaxed text-foreground/75 md:text-base">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
