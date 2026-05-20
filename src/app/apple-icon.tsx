/**
 * Apple Touch Icon — iOS 홈 화면 추가 시 사용 (180×180 PNG)
 *
 * ★ 자주 수정 ★
 * ─ icon.tsx 와 동일 디자인을 큰 사이즈로 (자동 라우트 /apple-icon)
 * ─ 글자 크기:          fontSize 110 (180 대비 약 60%)
 * ─ 둥글기:             borderRadius 36 (Apple guideline ~20%)
 */
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 36,
          color: "#0a0a0a",
          fontSize: 110,
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
