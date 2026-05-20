/**
 * CTA Footer — 마지막 상담 유도 섹션 (영상 배경 + 다크 마스크)
 *
 * ★ 미디어 ★
 * ─ 영상 파일:          /public/videos/cta-bg.mp4   (시공자 폴리셔 작업 컷)
 *                        교체: 같은 파일명으로 덮어쓰기. 다른 무드 원하면 다른 mp4 사용
 *
 * ★ 자주 수정 ★
 * ─ 헤딩:               "상담 예약"
 * ─ 서브카피:           "카카오톡으로 견적·일정을 안내드립니다."
 * ─ 카카오톡 링크:      href="https://www.kakaocorp.com/page/service/service/KakaoTalk"
 * ─ 전화번호:           "010-1234-5678"
 *
 * ★ 컬러 ★
 * ─ 영상 opacity:       20-30% (값↑ 더 잘 보이지만 카피 가독성 ↓)
 * ─ 카톡 버튼:          bg-gradient-to-br from-brand-gold to-brand-bronze
 * ─ 전화 버튼:          border + 호버 시 골드
 */
import { MessageCircle, Phone } from "lucide-react";

export default function CtaFooter() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-brand-black py-20 md:py-32 text-center"
    >
      {/* 영상 배경 */}
      <video
        className="absolute inset-0 size-full object-cover opacity-30"
        src="/videos/cta-bg.mp4"
        poster="/images/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* 다크 마스크 (카피 가독성) */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/55 to-brand-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.6)_70%)]" />

      {/* 컨텐츠 */}
      <div className="relative z-10 mx-auto max-w-[720px] px-6">
        <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
          BOOK NOW
        </span>
        <h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          상담 예약
        </h2>
        <p className="mt-5 text-base text-muted-foreground">
          카카오톡으로 견적·일정을 안내드립니다.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://www.kakaocorp.com/page/service/service/KakaoTalk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand-gold to-brand-bronze px-7 py-3.5 text-sm font-semibold text-brand-black shadow-xl shadow-brand-gold/30 transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            카카오톡 상담
          </a>

          <a
            href="tel:010-1234-5678"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-brand-black/50 px-7 py-3.5 text-sm text-foreground backdrop-blur transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
          >
            <Phone className="size-4" strokeWidth={1.8} />
            010-1234-5678
          </a>
        </div>
      </div>
    </section>
  );
}
