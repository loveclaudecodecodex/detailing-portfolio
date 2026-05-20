/**
 * DotNav — 우측 fixed 섹션 네비게이션 (데스크탑 전용)
 *
 * ★ 동작 ★
 *   - 페이지 우측 가운데에 작은 dot 8개
 *   - 현재 viewport 에 보이는 섹션의 dot 이 골드 + 1.5x scale
 *   - hover 시 섹션 라벨 텍스트 등장
 *   - 클릭 시 해당 섹션으로 부드러운 스크롤 (앵커 점프)
 *
 * ★ 자주 수정 ★
 * ─ `sections` 배열: id / label 한 줄씩 (id 는 실제 섹션 id 와 일치)
 * ─ 위치:        right-6 top-1/2 → right-10 등으로 조정
 * ─ dot 크기:    size-1.5 (활성 시 scale-150)
 *
 * ★ 비활성 조건 ★
 * ─ 모바일 (md:block 만 활성)
 */
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "top",       label: "Main" },
  { id: "services",  label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "quote",     label: "Quote" },
  { id: "pricing",   label: "Pricing" },
  { id: "reviews",   label: "Reviews" },
  { id: "faq",       label: "FAQ" },
  { id: "cta",       label: "Contact" },
];

export default function DotNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        // 가장 많이 보이는 섹션 활성
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = sections.findIndex((s) => visible.target.id === s.id);
          if (idx >= 0) setActive(idx);
        }
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <nav
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      aria-label="섹션 네비게이션"
    >
      <ul className="space-y-3.5">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-label={s.label}
              className="group flex items-center gap-3"
            >
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-[0.24em] transition-opacity",
                  active === i
                    ? "text-brand-gold opacity-100"
                    : "text-foreground/60 opacity-0 group-hover:opacity-100"
                )}
              >
                {s.label.toUpperCase()}
              </span>
              <span
                className={cn(
                  "block size-1.5 rounded-full transition-all duration-300",
                  active === i
                    ? "scale-[1.8] bg-brand-gold"
                    : "bg-white/25 group-hover:bg-white/70"
                )}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
