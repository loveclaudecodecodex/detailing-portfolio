/**
 * Footer — 페이지 맨 아래 (거대 워터마크 + 저작권 + 링크 + SNS)
 *
 * ★ 자주 수정 ★
 * ─ 거대 워터마크 텍스트: "BLACKOUT GLOSS"
 * ─ 저작권 텍스트:      아래 © 문구
 * ─ 사업자 정보 링크:   href="/business-info"
 * ─ 개인정보 처리방침:  href="/privacy"
 * ─ 인스타그램 URL:     href="https://www.instagram.com/"
 *
 * ★ 워터마크 ★
 *   font-display 거대 텍스트 (20vw) — 다크 위에 거의 안 보이지만
 *   브랜드 마무리 인상을 남기는 시그니처. 모바일에서는 작게 (12vw).
 */
/**
 * lucide-react 1.14 에 Instagram 아이콘이 없어서 인라인 SVG 사용.
 */
function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-brand-black">
      {/* 거대 워터마크 — 마지막 브랜드 인상 */}
      <div className="pointer-events-none select-none px-6 pb-6 pt-16 md:px-16">
        <h2
          className="font-display leading-[0.85] tracking-tight text-foreground/[0.04]"
          style={{ fontSize: "clamp(72px, 18vw, 280px)" }}
        >
          BLACKOUT GLOSS
        </h2>
      </div>

      {/* 저작권 + 링크 */}
      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 border-t border-white/5 px-6 py-8 text-sm text-muted-foreground md:flex-row md:px-16">
        <div>© BLACKOUT GLOSS — 강남 프리미엄 디테일링</div>

        <ul className="flex items-center gap-6">
          <li>
            <a href="/business-info" className="transition-colors hover:text-foreground">
              사업자 정보
            </a>
          </li>
          <li>
            <a href="/privacy" className="transition-colors hover:text-foreground">
              개인정보 처리방침
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <InstagramIcon className="size-4" />
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
