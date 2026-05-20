/**
 * Pricing — 4 카테고리 × 3 플랜 (Badge + CircleCheck 패턴)
 *
 * ★ 자주 수정 ★
 * ─ 탭 추가/삭제:       `categories` 배열
 * ─ 플랜:               `plans` 객체 — 카테고리 key 별로 Plan 3개
 *                        · name:        플랜명 (Essential / Standard / Complete)
 *                        · price:       숫자 (만원)
 *                        · description: 한 줄 카피
 *                        · features:    체크 리스트
 *                        · highlighted: true → 골드 강조 카드 (MOST POPULAR 배지)
 * ─ CTA 링크:           모든 카드가 카톡 채널로 → 상수 `KAKAO_URL` 한 줄 교체
 * ─ CTA 텍스트:         "{plan.name} 시작하기"
 *
 * ★ 컬러 ★
 * ─ 일반 카드:          bg-white/[0.02] + 호버 시 골드 보더 + 살짝 위로
 * ─ 강조 카드:          gradient brand-gold/[0.06] → bronze/[0.03] + 골드 그림자
 * ─ MOST POPULAR 배지:  bg-brand-gold/15 골드 텍스트
 *
 * ★ GSAP ★
 * ─ 진입 시 헤더 fade-up + 카드 stagger
 * ─ 탭 변경 시 카드 다시 stagger
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ── inline Badge (shadcn 의존성 없이 동일 API) ──
function Badge({
  variant = "secondary",
  children,
}: {
  variant?: "default" | "secondary";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        variant === "default"
          ? "bg-gradient-to-br from-brand-gold to-brand-bronze text-brand-black"
          : "bg-white/10 text-foreground"
      )}
    >
      {children}
    </span>
  );
}

const categories = [
  { key: "ppf",     label: "PPF" },
  { key: "coating", label: "코팅" },
  { key: "tint",    label: "틴팅" },
  { key: "wrap",    label: "랩핑" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

type Plan = {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

const plans: Record<CategoryKey, Plan[]> = {
  ppf: [
    {
      name: "Essential",
      price: 80,
      description: "출고 1~2주 내 부분 시공 입문",
      features: ["부분 PPF (전면 범퍼)", "기본 코팅 1년 보증", "유지보수 점검 1회"],
    },
    {
      name: "Standard",
      price: 250,
      description: "가장 인기 — 풀 PPF + 코팅 보증",
      features: ["풀 PPF 시공", "세라믹 코팅 3년 보증", "윈도우 틴팅 포함", "유지보수 3회"],
      highlighted: true,
    },
    {
      name: "Complete",
      price: 600,
      description: "VVIP 풀케어 + 픽업·탁송 무료",
      features: ["풀 PPF + 풀 코팅", "10년 PPF 보증", "픽업·탁송 무료", "연 4회 케어"],
    },
  ],
  coating: [
    { name: "Essential", price: 40,  description: "기본 광택 + 1년 보증",      features: ["기본 광택", "1년 보증"] },
    { name: "Standard",  price: 90,  description: "9H 세라믹 발수 코팅",       features: ["9H 세라믹", "3년 보증", "발수 코팅"], highlighted: true },
    { name: "Complete",  price: 180, description: "5년 보증 + 케어 무제한",    features: ["풀 코팅", "5년 보증", "케어 무제한"] },
  ],
  tint: [
    { name: "Essential", price: 25,  description: "측·후면 기본 틴팅",         features: ["측·후면 틴팅"] },
    { name: "Standard",  price: 55,  description: "전면 포함 자외선 99% 차단", features: ["전면 + 측면", "자외선 99% 차단"], highlighted: true },
    { name: "Complete",  price: 120, description: "최고급 필름 풀패키지",      features: ["풀 틴팅", "최고급 필름"] },
  ],
  wrap: [
    { name: "Essential", price: 60,  description: "부분 컬러 랩핑",            features: ["부분 랩핑"] },
    { name: "Standard",  price: 220, description: "풀 컬러 체인지",            features: ["풀 랩핑", "컬러 체인지"], highlighted: true },
    { name: "Complete",  price: 450, description: "프리미엄 + 디테일 데칼",    features: ["프리미엄 필름", "디테일 데칼"] },
  ],
};

const KAKAO_URL = "https://www.kakaocorp.com/page/service/service/KakaoTalk";          // ← 카카오톡 채널 URL

export default function Pricing() {
  const [active, setActive] = useState<CategoryKey>("ppf");
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 진입 시 한 번
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0, y: 40, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          opacity: 0, y: 60, duration: 0.8, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  // 탭 변경 시 카드 다시 stagger
  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }
    );
  }, [active]);

  return (
    <section id="pricing" className="bg-brand-black py-16 md:py-28">
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <header ref={headerRef} className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
            CLEAR PRICING
          </span>
          <h2 className="mt-4 font-display text-5xl tracking-tight text-foreground md:text-6xl">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground md:text-base">
            필요에 맞는 패키지를 선택하세요. 정확한 견적은 카톡 상담에서 확정됩니다.
          </p>
        </header>

        {/* Tabs */}
        <div className="mx-auto mb-12 flex w-fit gap-1 rounded-full border border-white/5 bg-white/[0.02] p-1">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={cn(
                "rounded-full px-6 py-2 text-sm transition-colors",
                active === c.key
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans[active].map((p) => (
            <PricingCard key={p.name} plan={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-7 text-left transition-all duration-300",
        plan.highlighted
          ? "border-brand-gold/40 bg-gradient-to-br from-brand-gold/[0.06] to-brand-bronze/[0.03] shadow-xl shadow-brand-gold/15 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-gold/30 md:-translate-y-1"
          : "border-white/5 bg-white/[0.02] hover:-translate-y-1.5 hover:border-brand-gold/30 hover:bg-white/[0.04]"
      )}
      aria-label={`${plan.name} 패키지`}
    >
      {/* Header: Badge + Most popular */}
      <div className="flex items-center gap-2">
        <Badge variant={plan.highlighted ? "default" : "secondary"}>
          {plan.name}
        </Badge>
        {plan.highlighted && (
          <span className="rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-brand-gold">
            MOST POPULAR
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          {plan.price}
        </span>
        <span className="text-sm text-muted-foreground">만원~</span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {plan.description}
      </p>

      {/* Divider */}
      <div className="my-6 border-t border-white/5" />

      {/* Features */}
      <ul className="space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start text-sm text-foreground/85">
            <CircleCheck
              className="mr-2.5 mt-0.5 size-4 shrink-0 text-brand-gold"
              strokeWidth={2}
              aria-hidden
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-7">
        <Link
          href={KAKAO_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            "inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all",
            plan.highlighted
              ? "bg-gradient-to-br from-brand-gold to-brand-bronze text-brand-black hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-gold/40"
              : "border border-white/10 text-foreground hover:border-brand-gold/40 hover:text-brand-gold"
          )}
        >
          {plan.name} 시작하기
        </Link>
      </div>
    </div>
  );
}
