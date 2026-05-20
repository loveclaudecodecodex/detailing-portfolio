/**
 * favicon — Next.js App Router 자동 라우트 (/icon → 32×32 PNG)
 *
 * ★ 자주 수정 ★
 * ─ 글자:               "B"  (한 글자 권장 — 32×32 라 더 들어가면 안 보임)
 * ─ 그라데이션 색:      background 의 #d4af37 → #b8772a  (brand-gold → brand-bronze)
 * ─ 배경 둥글기:        borderRadius (5~8 사이)
 * ─ 글자 크기:          fontSize (22 = 32×32 에 꽉 차지 않게 적정)
 *
 * ★ 큰 사이즈 (180×180 iOS 홈 화면) ★
 * ─ src/app/apple-icon.tsx 에서 동일 디자인 큰 버전 자동 생성
 */
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #d4af37 0%, #b8772a 100%)",
          borderRadius: 6,
          color: "#0a0a0a",
          fontSize: 22,
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
