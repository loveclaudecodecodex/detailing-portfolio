/**
 * 사업자 정보 페이지 — /business-info
 *
 * ★ 자주 수정 ★
 * ─ `info` 배열: label / value 한 줄씩 교체
 * ─ 주소, 이메일은 임시 — 실제 매장 주소와 이메일로 교체
 */
import type { Metadata } from "next";
import Nav from "@/components/sections/nav";
import Footer from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "사업자 정보 — BLACKOUT GLOSS",
  description: "BLACKOUT GLOSS 사업자 정보 및 연락처.",
};

const info = [
  { label: "상호명",         value: "BLACKOUT GLOSS" },
  { label: "대표자",          value: "강동욱" },
  { label: "사업자등록번호",  value: "369-45-00972" },
  { label: "통신판매업 신고", value: "준비 중" },
  { label: "연락처",          value: "010-1234-5678", href: "tel:010-1234-5678" },
  { label: "이메일",          value: "info@blackoutgloss.com", href: "mailto:info@blackoutgloss.com" },
  { label: "주소",            value: "서울특별시 강남구 (임시 주소 — 실제 매장 주소로 교체)" },
  { label: "영업시간",        value: "평일 10:00 — 19:00 · 예약제 운영" },
];

export default function BusinessInfo() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-black pb-24 pt-32">
        <div className="mx-auto max-w-[720px] px-6">
          <header className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
              BUSINESS INFO
            </span>
            <h1 className="mt-4 font-display text-5xl tracking-tight text-foreground md:text-6xl">
              사업자 정보
            </h1>
          </header>

          <dl className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
            {info.map((i) => (
              <div
                key={i.label}
                className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-xs font-semibold tracking-[0.18em] text-brand-gold sm:text-sm sm:tracking-wider">
                  {i.label}
                </dt>
                <dd className="text-sm text-foreground sm:text-base">
                  {i.href ? (
                    <a
                      href={i.href}
                      className="transition-colors hover:text-brand-gold"
                    >
                      {i.value}
                    </a>
                  ) : (
                    i.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← 홈으로 돌아가기
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
