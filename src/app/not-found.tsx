/**
 * 404 — Not Found 페이지
 *
 * ★ 자주 수정 ★
 * ─ 헤드라인:           "찾으시는 페이지를 발견하지 못했습니다."
 * ─ 서브카피:           아래 <p> 텍스트
 * ─ CTA Primary:        "홈으로 돌아가기" / href="/"
 * ─ CTA Secondary:      "카카오톡 상담" / href="https://www.kakaocorp.com/page/service/service/KakaoTalk"
 *                       (cta-footer.tsx 와 동일한 카톡 URL 사용 권장)
 *
 * ★ Figma 디자인 ★
 * ─ Brand Assets 이전 페이지 옆 "404 — Not Found" 에서 시각 확인 가능
 */
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-brand-black text-foreground">
      {/* 우상단 골드 라디얼 글로우 */}
      <div className="pointer-events-none absolute -right-[400px] -top-[400px] size-[1100px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28)_0%,rgba(212,175,55,0.06)_45%,transparent_70%)]" />

      {/* 상단 로고 */}
      <div className="absolute left-6 top-6 md:left-16 md:top-8">
        <span className="font-display text-base tracking-[0.14em] text-foreground">
          BLACKOUT GLOSS
        </span>
        <div className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground">
          DETAILING STUDIO · SEOUL
        </div>
      </div>

      {/* 우상단 백 링크 */}
      <Link
        href="/"
        className="absolute right-6 top-8 text-sm text-muted-foreground transition-colors hover:text-foreground md:right-16"
      >
        ← Back to Home
      </Link>

      {/* 중앙 컨텐츠 */}
      <div className="mx-auto max-w-[720px] px-6 md:px-0">
        <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
          PAGE NOT FOUND
        </span>
        <h1
          className="mt-4 font-display text-[160px] leading-none tracking-tight md:text-[280px]"
          style={{
            background: "linear-gradient(180deg, #f2f2f2 0%, #525252 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>
        <h2 className="mt-8 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
          찾으시는 페이지를 발견하지 못했습니다.
        </h2>
        <p className="mt-5 text-sm leading-[1.7] text-muted-foreground md:text-base">
          주소가 변경되었거나, 더 이상 존재하지 않는 페이지입니다.
          <br />
          홈에서 다시 시작하시거나 카카오톡으로 직접 문의해 주세요.
        </p>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-br from-brand-gold to-brand-bronze px-7 py-3.5 text-sm font-semibold text-brand-black transition-transform hover:scale-[1.03]"
          >
            홈으로 돌아가기
          </Link>
          <a
            href="https://www.kakaocorp.com/page/service/service/KakaoTalk"          /* ← 카카오톡 채널 URL (cta-footer.tsx 와 동일하게 유지) */
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-brand-gold/40 px-7 py-3.5 text-sm text-brand-gold transition-colors hover:bg-brand-gold/10"
          >
            카카오톡 상담
          </a>
        </div>

        {/* 좌하단 액센트 바 */}
        <div className="mt-16 h-px w-12 bg-gradient-to-r from-brand-gold to-transparent" />
      </div>

      {/* 우하단 에러 태그 */}
      <div className="absolute bottom-6 right-6 text-[11px] tracking-[0.32em] text-brand-gold/70 md:right-16 md:bottom-8">
        ERROR · 404 · NOT FOUND
      </div>
    </main>
  );
}
