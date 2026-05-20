/**
 * Root Layout — 사이트 전체 셸
 *
 * ★ 자주 수정하는 부분 ★
 * ─ SEO 제목/설명:        metadata.title, metadata.description
 * ─ OG 이미지:            metadata.openGraph.images  (Figma → /public/og-image.png)
 * ─ 도메인:               metadataBase  (배포 시 실제 도메인으로)
 * ─ favicon:              metadata.icons  (/public/favicon.ico, /public/apple-touch-icon.png)
 *
 * ★ 폰트 추가/변경 ★
 * ─ 영문 헤딩(Anton)  → 아래 Anton({ ... })
 * ─ 한국어 본문        → "pretendard/dist/web/variable/pretendardvariable.css" import
 * ─ 사용처: Tailwind 클래스 `font-display`(영문 헤딩) / 기본(한국어 본문)
 *
 * ★ 색 톤 변경 ★
 * ─ src/app/globals.css 의 `--brand-gold / --brand-bronze / --brand-black / --gradient-gold` 수정
 */
import type { Metadata } from "next";
import { Anton, Asta_Sans } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import LenisProvider from "@/components/lenis-provider";
import Analytics from "@/components/analytics";
import CursorSpotlight from "@/components/cursor-spotlight";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Asta Sans — 모던 영문 본문 폰트. 한국어 글리프는 자동으로 Pretendard fallback.
const astaSans = Asta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-asta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLACKOUT GLOSS — 강남 프리미엄 디테일링",          // ← 브라우저 탭/검색 결과 제목
  description:
    "PPF · 세라믹 코팅 · 윈도우 틴팅. 신차 출고 직후, 가장 중요한 시간. 1,247+ 누적 시공.",
  metadataBase: new URL("https://blackoutgloss.com"),          // ← 배포 도메인으로 교체
  openGraph: {
    title: "BLACKOUT GLOSS — 강남 프리미엄 디테일링",
    description: "신차 출고 직후, 가장 중요한 시간.",
    type: "website",
    locale: "ko_KR",
    images: ["/images/og-image.png"],                           // ← public/images/og-image.png
  },
  // icons 는 app/icon.tsx 와 app/apple-icon.tsx 가 자동 라우트로 처리하므로 명시 불필요.
  // 실제 PNG 파일로 교체하려면 public/ 에 favicon.ico, apple-touch-icon.png 두고 여기 아래 주석 해제:
  // icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`dark ${anton.variable} ${astaSans.variable} antialiased`}>
      <body className={`${astaSans.className} bg-brand-black text-foreground min-h-screen`}>
        {/* 접근성 — 키보드 사용자가 Nav 건너뛰고 메인 콘텐츠로 바로 점프 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-brand-black"
        >
          콘텐츠로 건너뛰기
        </a>
        <CursorSpotlight />
        <LenisProvider>{children}</LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
