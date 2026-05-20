/**
 * Quote — 즉시 견적 계산기 (3단계 stepper)
 *
 * ★ 전환 핵심 섹션 ★
 *   "내 차 얼마지?" 의구심을 사이트 안에서 해결.
 *   AI 폼 티 줄이기 위해 한 화면에 동시 표시가 아닌, 단계별 진행 (대화 느낌).
 *
 * ★ 가격 모델 ★
 *   견적 = (선택 옵션들의 priceLow~priceHigh 합) × (차종 multiplier)
 *
 * ★ 자주 수정 ★
 * ─ 차종 multiplier:    `carClasses` 배열 (1.0 = 경/소형 기준)
 * ─ 옵션 가격대:        `options` 배열 priceLow / priceHigh (만원)
 * ─ 카톡 URL:           CTA href
 * ─ 카피:               각 step 의 h3 ("어떤 차 타시나요?" 등)
 *
 * ★ 동작 ★
 *   Step 1 (CAR)     → 차종 5개 중 하나 선택 → [다음 단계]
 *   Step 2 (OPTIONS) → 시공 옵션 복수 선택 + 옵션별 가격대 표시 → [견적 보기]
 *   Step 3 (QUOTE)   → 큰 숫자로 견적 범위 표시 + 카톡 CTA
 *
 *   각 단계는 카드 자체가 활성/비활성 표시 (라디오/체크 동그라미 없음).
 *   활성 카드 = 골드 그라데이션 / 비활성 = 다크 글래스.
 */
"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const carClasses = [
  { key: "compact", label: "경/소형",     multiplier: 1.0 },
  { key: "midsize", label: "준중형/중형", multiplier: 1.2 },
  { key: "large",   label: "준대형",      multiplier: 1.4 },
  { key: "luxury",  label: "대형/럭셔리", multiplier: 1.7 },
  { key: "sports",  label: "스포츠/SUV", multiplier: 1.5 },
];

const options = [
  { key: "ppf-full",    label: "PPF 풀랩",         desc: "차량 외부 전체 시공",         priceLow: 250, priceHigh: 350 },
  { key: "ppf-partial", label: "PPF 부분 (전면)",  desc: "전면 범퍼 · 후드 · 휀더",     priceLow: 80,  priceHigh: 150 },
  { key: "coating",     label: "세라믹 코팅",      desc: "9H 발수 · 광택",              priceLow: 70,  priceHigh: 150 },
  { key: "tint",        label: "윈도우 틴팅",      desc: "자외선 · 적외선 차단",        priceLow: 30,  priceHigh: 70  },
  { key: "wheel",       label: "휠 코팅",          desc: "휠 보호 + 광택",              priceLow: 30,  priceHigh: 50  },
];

type Step = "car" | "options" | "result";

export default function Quote() {
  const [step, setStep] = useState<Step>("car");
  const [carClass, setCarClass] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { low, high } = useMemo(() => {
    const klass = carClasses.find((c) => c.key === carClass);
    const mult = klass?.multiplier ?? 1;
    let l = 0;
    let h = 0;
    for (const k of selected) {
      const o = options.find((o) => o.key === k);
      if (o) {
        l += o.priceLow;
        h += o.priceHigh;
      }
    }
    return { low: Math.round(l * mult), high: Math.round(h * mult) };
  }, [carClass, selected]);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const stepIndex = step === "car" ? 0 : step === "options" ? 1 : 2;

  return (
    <section id="quote" className="bg-brand-black py-12 md:py-20">
      <div className="mx-auto max-w-[760px] px-6 md:px-0">
        <header className="mb-10 text-center">
          <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
            INSTANT QUOTE
          </span>
          <h2 className="mt-4 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
            즉시 견적
          </h2>
        </header>

        {/* Step indicator */}
        <div className="mx-auto mb-14 flex max-w-md items-center justify-between text-[10px] font-semibold tracking-[0.32em]">
          {(["CAR", "OPTIONS", "QUOTE"] as const).map((s, i) => {
            const isActive = stepIndex === i;
            const isPast = stepIndex > i;
            return (
              <div key={s} className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    isActive ? "bg-brand-gold" : isPast ? "bg-brand-gold/40" : "bg-white/15"
                  )}
                />
                <span
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-brand-gold"
                      : isPast
                      ? "text-foreground/40"
                      : "text-white/30"
                  )}
                >
                  0{i + 1}  ·  {s}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Step 1: CAR ── */}
        {step === "car" && (
          <div>
            <h3 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              차량 종류를 골라주세요
            </h3>
            <ul className="space-y-3">
              {carClasses.map((c) => {
                const active = carClass === c.key;
                return (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => setCarClass(c.key)}
                      className={cn(
                        "w-full rounded-2xl px-7 py-5 text-left text-lg font-semibold transition-all",
                        active
                          ? "bg-gradient-to-br from-brand-gold to-brand-bronze text-brand-black shadow-xl shadow-brand-gold/20"
                          : "bg-white/[0.03] text-foreground hover:bg-white/[0.07]"
                      )}
                    >
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => carClass && setStep("options")}
              disabled={!carClass}
              className={cn(
                "mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold transition-all",
                carClass
                  ? "bg-foreground text-brand-black hover:opacity-90"
                  : "cursor-not-allowed bg-white/[0.04] text-muted-foreground"
              )}
            >
              다음
              <ArrowRight className="size-4" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* ── Step 2: OPTIONS ── */}
        {step === "options" && (
          <div>
            <h3 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              원하시는 서비스를 선택해주세요
            </h3>
            <p className="mb-10 text-center text-xs text-muted-foreground">
              여러 개 선택 가능합니다
            </p>
            <ul className="space-y-3">
              {options.map((o) => {
                const active = selected.has(o.key);
                return (
                  <li key={o.key}>
                    <button
                      type="button"
                      onClick={() => toggle(o.key)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 rounded-2xl px-7 py-5 text-left transition-all",
                        active
                          ? "bg-gradient-to-br from-brand-gold to-brand-bronze text-brand-black shadow-xl shadow-brand-gold/20"
                          : "bg-white/[0.03] text-foreground hover:bg-white/[0.07]"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-lg font-semibold">{o.label}</div>
                        <div
                          className={cn(
                            "mt-1 text-xs",
                            active ? "text-brand-black/70" : "text-muted-foreground"
                          )}
                        >
                          {o.desc}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "whitespace-nowrap text-xs font-medium",
                          active ? "text-brand-black/70" : "text-muted-foreground"
                        )}
                      >
                        {o.priceLow}~{o.priceHigh} 만원
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("car")}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-7 py-4 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.08]"
              >
                <ArrowLeft className="size-4" strokeWidth={2} />
                이전
              </button>
              <button
                type="button"
                onClick={() => selected.size > 0 && setStep("result")}
                disabled={selected.size === 0}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold transition-all",
                  selected.size > 0
                    ? "bg-foreground text-brand-black hover:opacity-90"
                    : "cursor-not-allowed bg-white/[0.04] text-muted-foreground"
                )}
              >
                견적 보기
                <ArrowRight className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: RESULT ── */}
        {step === "result" && (
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
              EXPECTED PRICE
            </span>
            <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              지금 시공하시면
            </h3>
            <div className="mt-10 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 md:gap-x-4">
              <span className="text-6xl font-extrabold tracking-tight text-brand-gold md:text-8xl">
                {low.toLocaleString()}
              </span>
              <span className="text-3xl font-bold text-muted-foreground md:text-5xl">~</span>
              <span className="text-6xl font-extrabold tracking-tight text-brand-gold md:text-8xl">
                {high.toLocaleString()}
              </span>
              <span className="text-base text-muted-foreground md:text-2xl">만원</span>
            </div>
            <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-muted-foreground">
              * 차량 컨디션 · 추가 옵션 · 시공 시점에 따라 변동될 수 있습니다.
              <br />
              정확한 견적은 카카오톡 상담 시 확정해 드립니다.
            </p>

            <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://www.kakaocorp.com/page/service/service/KakaoTalk"                       /* ← 카카오톡 채널 URL */
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brand-gold to-brand-bronze px-8 py-4 text-sm font-semibold text-brand-black transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-gold/30"
              >
                <MessageCircle className="size-4" strokeWidth={2} />
                이 견적으로 카톡 상담
              </a>
              <button
                type="button"
                onClick={() => setStep("options")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm text-foreground transition-colors hover:border-white/30"
              >
                <ArrowLeft className="size-4" strokeWidth={2} />
                옵션 다시 선택
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
