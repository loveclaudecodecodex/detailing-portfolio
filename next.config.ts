import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // 정적 export — Netlify 드래그앤드롭 배포용 (out/ 생성)
  output: "export",
  // Turbopack root — 부모 디렉토리의 package-lock.json 때문에 잘못된 root 인식 방지
  turbopack: {
    root: path.resolve(__dirname),
  },
  // export 모드에서는 next/image 옵티마이저가 동작하지 않으므로 unoptimized 필요
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "saintcut.com" },
    ],
  },
};

export default nextConfig;
