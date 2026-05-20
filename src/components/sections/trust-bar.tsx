/**
 * Trust Bar — 신뢰 지표 4종 (스크롤 진입 시 카운트업)
 *
 * ★ 자주 수정 ★
 * ─ 지표 추가/삭제:     `stats` 배열 (value/suffix/label/decimal)
 * ─ 위치:               Brand Marquee 아래 (Stats 섹션 직후)
 *
 * ★ 컬러 ★
 * ─ 숫자 골드:          text-brand-gold
 * ─ 라벨 회색:          text-muted-foreground
 * ─ 보더:               border-y border-white/5
 */
"use client";

import { NumberTicker } from "@/components/ui/number-ticker";

const stats: Array<{
  value: number;
  suffix?: string;
  label: string;
  decimal?: number;
}> = [
  { value: 1247, suffix: "+",  label: "누적 시공 차량" },
  { value: 12,   suffix: "년", label: "운영 경력" },
  { value: 38,   suffix: "%",  label: "재방문율" },
  { value: 4.9,  suffix: "",   label: "평균 만족도", decimal: 1 },
];

export default function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-brand-black py-10 md:py-14">
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-y-8 px-6 md:grid-cols-4 md:gap-0 md:px-16">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="flex items-baseline justify-center gap-0.5">
              <NumberTicker
                value={s.value}
                decimalPlaces={s.decimal ?? 0}
                className="text-3xl font-extrabold tracking-tight text-brand-gold md:text-4xl"
              />
              {s.suffix && (
                <span className="text-xl font-extrabold text-brand-gold md:text-2xl">
                  {s.suffix}
                </span>
              )}
            </div>
            <p className="mt-2 text-[11px] tracking-wide text-muted-foreground md:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
