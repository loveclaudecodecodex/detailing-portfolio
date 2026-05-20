/**
 * Portfolio — 시공 사례 6장 그리드 (Before → 호버 → After)
 *
 * ★ 미디어 ★
 * ─ Before/After 이미지: /public/images/portfolio-{NN}-{before|after}.jpg
 *                         (NN: 01~06, 총 12장)
 *
 *   카드 추가: items 배열에 새 항목 추가 + 동일 명명 규칙으로 이미지 2장 배치.
 *
 * ★ 자주 수정 ★
 * ─ 카드 정보:          아래 `items` 배열
 *                        · car:     차종 + 시공 종류
 *                        · before:  시공 전 이미지 경로
 *                        · after:   시공 후 이미지 경로
 * ─ 카드 수 변경:       ul 의 `lg:grid-cols-3` 조정
 *
 * ★ 동작 ★
 *   기본은 BEFORE 이미지. 호버 시 AFTER 가 페이드인.
 *   모바일은 호버 없으므로 매 카드 우상단 토글 버튼으로 전환.
 *
 * ★ 컬러 ★
 * ─ 카드 보더:          border-white/5
 * ─ 우상단 토글:        bg-brand-gold/85 text-brand-black
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const items = [
  { id: 1, car: "BMW 5시리즈 — PPF 풀랩",        before: "/images/portfolio-01-before.jpg", after: "/images/portfolio-01-after.jpg" },
  { id: 2, car: "벤츠 E클래스 — 세라믹 코팅",    before: "/images/portfolio-02-before.jpg", after: "/images/portfolio-02-after.jpg" },
  { id: 3, car: "포르쉐 911 — 부분 PPF + 코팅",   before: "/images/portfolio-03-before.jpg", after: "/images/portfolio-03-after.jpg" },
  { id: 4, car: "제네시스 G80 — 풀패키지",        before: "/images/portfolio-04-before.jpg", after: "/images/portfolio-04-after.jpg" },
  { id: 5, car: "벤츠 S클래스 — VVIP 풀랩",       before: "/images/portfolio-05-before.jpg", after: "/images/portfolio-05-after.jpg" },
  { id: 6, car: "현대 아반떼 — 가성비 코팅",      before: "/images/portfolio-06-before.jpg", after: "/images/portfolio-06-after.jpg" },
];

export default function Portfolio() {
  const [showAfter, setShowAfter] = useState<Record<number, boolean>>({});
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
          opacity: 0, y: 50, duration: 0.7, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: ulRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="portfolio" className="bg-brand-black py-24 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <header ref={headerRef} className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
            CASE STUDY
          </span>
          <h2 className="mt-4 font-display text-5xl tracking-tight text-foreground md:text-6xl">
            Portfolio
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            카드 위에 마우스를 올리면 시공 후로 전환됩니다.
          </p>
        </header>

        {/* 모바일: 가로 스크롤 snap / 태블릿+: grid. 모바일 페이지 길이 다이어트 */}
        <ul
          ref={ulRef}
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
        >
          {items.map((it) => {
            const active = !!showAfter[it.id];
            return (
              <li
                key={it.id}
                className="group relative aspect-[4/3] w-[80vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/5 md:w-auto md:shrink"
                onMouseEnter={() => setShowAfter((s) => ({ ...s, [it.id]: true }))}
                onMouseLeave={() => setShowAfter((s) => ({ ...s, [it.id]: false }))}
              >
                {/* BEFORE (바닥) */}
                <Image
                  src={it.before}
                  alt={`${it.car} 시공 전`}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                {/* AFTER (페이드인) */}
                <Image
                  src={it.after}
                  alt={`${it.car} 시공 후`}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-opacity duration-700 ease-out",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />

                {/* 상단 우상 토글 (모바일 친화) */}
                <button
                  type="button"
                  onClick={() => setShowAfter((s) => ({ ...s, [it.id]: !active }))}
                  className={cn(
                    "absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.24em] backdrop-blur transition-colors",
                    active
                      ? "bg-brand-gold/85 text-brand-black"
                      : "bg-black/60 text-white"
                  )}
                  aria-label="시공 전후 토글"
                >
                  {active ? "AFTER" : "BEFORE"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
