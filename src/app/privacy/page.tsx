/**
 * 개인정보 처리방침 — /privacy
 *
 * ★ 임시 약관 ★
 *   표준 한국 사이트 개인정보 처리방침 골격. 실 비즈니스에서는 변호사 검토 권장.
 *
 * ★ 자주 수정 ★
 * ─ 개인정보 보호책임자 정보 (성명/연락처/이메일)
 * ─ 보유 기간 (필요시 회사 정책에 맞게)
 * ─ 시행일자 (페이지 하단)
 */
import type { Metadata } from "next";
import Nav from "@/components/sections/nav";
import Footer from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "개인정보 처리방침 — BLACKOUT GLOSS",
  description: "BLACKOUT GLOSS 개인정보 처리방침.",
};

const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "1. 개인정보의 수집 항목",
    body: (
      <>
        <p>BLACKOUT GLOSS(이하 “회사”)는 시공 상담 및 예약 서비스 제공을 위해 다음의 항목을 수집합니다.</p>
        <ul className="ml-5 mt-3 list-disc space-y-1.5">
          <li>필수 항목: 이름, 연락처, 차종 정보</li>
          <li>선택 항목: 이메일, 시공 희망일</li>
          <li>자동 수집: 접속 IP, 쿠키, 방문 일시</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. 개인정보의 수집 및 이용 목적",
    body: (
      <ul className="ml-5 list-disc space-y-1.5">
        <li>상담 예약 및 견적 안내</li>
        <li>시공 일정 조율 및 시공 후 사후 관리</li>
        <li>이벤트 정보 안내 (수신 동의자 한정)</li>
      </ul>
    ),
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    body: (
      <>
        <p>회원의 개인정보는 원칙적으로 수집·이용 목적이 달성되면 지체 없이 파기합니다. 단, 관련 법령에 따라 다음 정보는 명시된 기간 동안 보존합니다.</p>
        <ul className="ml-5 mt-3 list-disc space-y-1.5">
          <li>계약 또는 청약철회 등의 기록: 5년</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
          <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: (
      <p>
        회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 법령의 규정에 따르거나 수사 목적으로 법령에 정해진
        절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.
      </p>
    ),
  },
  {
    title: "5. 이용자의 권리",
    body: (
      <p>
        이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회·수정·삭제 요청할 수 있으며, 회사는 관련 법령에 따라 지체 없이
        처리합니다. 요청은 아래 개인정보 보호책임자에게 서면, 전화, 이메일로 연락하시면 됩니다.
      </p>
    ),
  },
  {
    title: "6. 개인정보 보호책임자",
    body: (
      <>
        <p>회사는 이용자의 개인정보를 보호하고 관련 불만을 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정합니다.</p>
        <ul className="ml-5 mt-3 list-disc space-y-1.5">
          <li>성명: 강동욱</li>
          <li>
            연락처:{" "}
            <a href="tel:010-1234-5678" className="text-brand-gold hover:opacity-80">
              010-1234-5678
            </a>
          </li>
          <li>
            이메일:{" "}
            <a href="mailto:privacy@blackoutgloss.com" className="text-brand-gold hover:opacity-80">
              privacy@blackoutgloss.com
            </a>
          </li>
        </ul>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-black pb-24 pt-32">
        <div className="mx-auto max-w-[840px] px-6">
          <header className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
              PRIVACY POLICY
            </span>
            <h1 className="mt-4 font-display text-5xl tracking-tight text-foreground md:text-6xl">
              개인정보 처리방침
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
              본 페이지는 임시 약관입니다. 실 서비스 전에 변호사 검토 후 업데이트 권장.
            </p>
          </header>

          <article className="space-y-10 rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-sm leading-[1.8] text-muted-foreground md:p-12">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="mb-3 text-base font-semibold text-foreground md:text-lg">
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}

            <p className="border-t border-white/5 pt-6 text-xs text-muted-foreground/70">
              본 방침은 2026년 5월 13일부터 시행됩니다.
            </p>
          </article>

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
