/**
 * Nav — 상단 네비게이션 (fixed top, 스크롤 시 backdrop blur)
 *
 * ★ 자주 수정 ★
 * ─ 로고 텍스트:        "BLACKOUT GLOSS"
 * ─ 메뉴 항목:          `menu` 배열 (label/href)
 * ─ CTA 텍스트/링크:    "견적 문의" / href="#cta"
 *
 * ★ 모바일 햄버거 메뉴 ★
 *   md(768) 미만에서 햄버거 버튼이 등장.
 *   클릭 시 데스크탑 메뉴와 동일 항목을 드로어로 펼침.
 *   햄버거 SVG 가 group-aria-expanded 로 X 모양으로 부드럽게 회전.
 *
 * ★ 컬러 ★
 * ─ 스크롤 / 메뉴 열림: bg-brand-black/80 backdrop-blur-xl + 보더
 * ─ 메뉴 텍스트:        text-muted-foreground → hover text-foreground
 * ─ 견적 문의:          text-foreground (흰색 텍스트만, 버튼 형태 X)
 */
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const menu = [
  { label: "Services",  href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing",   href: "#pricing" },
  { label: "Reviews",   href: "#reviews" },
  { label: "FAQ",       href: "#faq" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // scroll fade-in 배경
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 모바일 메뉴 열렸을 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || mobileOpen
          ? "border-b border-white/5 bg-brand-black/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-6 md:px-16">
        {/* 로고 */}
        <a
          href="#top"
          className="font-display text-lg tracking-[0.14em] text-foreground transition-opacity hover:opacity-80"
        >
          BLACKOUT GLOSS
        </a>

        {/* 데스크탑 메뉴 (md+) */}
        <ul className="hidden items-center gap-8 md:flex">
          {menu.map((m) => (
            <li key={m.label}>
              <a
                href={m.href}
                className="font-display text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {m.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 우측 영역 */}
        <div className="flex items-center gap-2">
          {/* 데스크탑 CTA */}
          <a
            href="#cta"
            className="hidden font-display text-sm tracking-wide text-foreground transition-opacity hover:opacity-70 md:inline-block"
          >
            Contact
          </a>

          {/* 모바일 햄버거 — 3선 → X 변환 (첨부 코드 패턴) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
            className="group flex size-10 items-center justify-center text-foreground md:hidden"
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none"
            >
              <path
                d="M4 12L20 12"
                className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
              />
              <path
                d="M4 12H20"
                className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
              />
              <path
                d="M4 12H20"
                className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* 모바일 드로어 */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden",
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="border-t border-white/5 bg-brand-black/95 px-6 py-3 backdrop-blur-xl">
          {menu.map((m) => (
            <li key={m.label}>
              <a
                href={m.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-display text-lg tracking-wide text-foreground/85 transition-colors hover:text-brand-gold"
              >
                {m.label}
              </a>
            </li>
          ))}
          <li className="mt-2 border-t border-white/5 pt-3">
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-3 font-display text-lg tracking-wide text-brand-gold transition-opacity hover:opacity-70"
            >
              <span>Contact</span>
              <span>→</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
