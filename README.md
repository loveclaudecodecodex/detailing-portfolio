# detailing-portfolio

자동차 디테일링 (PPF · 세라믹 코팅 · 윈도우 틴팅) 스튜디오용 단일 페이지 포트폴리오. Next.js 16 App Router 기반, GSAP 중심의 시네마틱 스크롤 사이트.

---

## 기술 스택 (실제 설치 버전 기준)

| 영역 | 라이브러리 | 버전 |
|---|---|---|
| 프레임워크 | next | 16.2.6 |
| UI 런타임 | react / react-dom | 19.2.4 |
| 언어 | typescript | ^5 |
| 스타일링 | tailwindcss | ^4 (`@tailwindcss/postcss`) |
| 애니메이션 (주력) | gsap + @gsap/react | 3.15.0 / 2.1.2 |
| 스무스 스크롤 | lenis | 1.3.23 |
| Tailwind 모션 유틸 | tw-animate-css | ^1.4.0 |
| Headless UI primitive | @base-ui/react | ^1.4.1 |
| 아이콘 | lucide-react | 1.14.0 |
| 스타일 유틸 | clsx / tailwind-merge / class-variance-authority | — |
| shadcn CLI | shadcn | ^4.7.0 |
| 한글 폰트 | pretendard | ^1.3.9 |
| 린트 | eslint + eslint-config-next | ^9 |

> ⚠️ Next.js 16은 `AGENTS.md`에 명시된 대로 이전 버전과 API·관례·파일 구조가 다를 수 있음. 코드 작성 전 `node_modules/next/dist/docs/`의 관련 가이드를 먼저 확인할 것.

---

## 라이브러리별 — 이 프로젝트에서 어떻게 쓰는가 / 어떻게 쓰면 좋은가

### Next.js 16 (App Router)

- **현재 사용처:** `src/app/` 아래 `layout.tsx`, `page.tsx`, `not-found.tsx`, `business-info/page.tsx`, `privacy/page.tsx`. 정적 페이지 위주.
- **활용 팁:**
  - 메인 페이지(`src/app/page.tsx`)는 클라이언트 인터랙션이 많아 섹션 컴포넌트들이 `"use client"` 됨. layout은 가능한 서버 컴포넌트로 유지하고, 인터랙션은 섹션 단위로 격리.
  - 이미지 최적화는 `next/image` 활용 (현재 `public/images/` 안의 jpg/png 직접 참조 중 — 추후 점진적 교체 고려).
  - 16.x의 변경점(특히 라우팅·캐싱·`async` 컴포넌트 동작)은 매번 공식 문서로 재확인. 학습데이터 기반 가정 금물.

### React 19

- 컴파일러·`use()` hook·`useFormStatus` 등 신규 API 가용. 단, 본 프로젝트에선 아직 활용 안 함 (단순 `useState`/`useEffect`/`useMemo`/`useRef` 위주).

### GSAP 3 + @gsap/react

- **현재 사용처:** 거의 모든 섹션 (`hero`, `services`, `pricing`, `process`, `portfolio`, `faq`, `wow-c`, `animations/section-reveal`)과 `lenis-provider`.
- **역할:** 진입 stagger 애니메이션, 스크롤 트리거 reveal, 마스킹 슬라이드(`y: 100% → 0`).
- **활용 팁:**
  - React 환경에선 `@gsap/react`의 `useGSAP` hook 사용 → 자동 cleanup. `useEffect + ctx.revert()` 보일러플레이트 줄임.
  - 스크롤 트리거를 본격적으로 쓸 거면 `ScrollTrigger` 플러그인 등록을 `lenis-provider`와 같은 곳에서 단 한 번. 여러 컴포넌트에서 중복 register하면 워닝.
  - Lenis와 ScrollTrigger를 같이 쓸 때는 Lenis의 `scroll` 이벤트를 ScrollTrigger.update에 연결해야 sync 깨짐 없이 동작 (Lenis 공식 가이드 참조).
  - 동일 트윈을 여러 요소에 적용할 땐 `gsap.utils.toArray()` 와 `stagger` 옵션이 가장 깔끔.

### Lenis (smooth scroll)

- **현재 사용처:** `src/app/layout.tsx` → `LenisProvider`(`src/components/lenis-provider.tsx`)로 전역 wrap.
- **활용 팁:**
  - SSR 안전을 위해 provider는 `"use client"`로 분리, 인스턴스는 `useRef`로 보관.
  - 모바일에서 native momentum scroll을 막아 어색해질 수 있음 → `lenis.options.smoothTouch = false` (또는 미설정) 가 일반적 권장.
  - 특정 요소에서 Lenis 스크롤을 막고 싶으면 `data-lenis-prevent` 속성 부여 (모달 내부 스크롤 등).
  - GSAP ScrollTrigger와의 sync는 위 GSAP 섹션 참조.

### @base-ui/react

- **현재 사용처:** `src/components/ui/`의 `button`, `dialog`, `tabs`, `avatar`.
- **위치:** Material UI 팀이 만드는 headless component primitive 라이브러리. Radix UI와 유사한 포지션 (스타일 없는 a11y primitive).
- **활용 팁:**
  - shadcn 식 패턴 — base primitive를 우리가 스타일링한 wrapper로 감싸 `src/components/ui/`에 둠. 새 컴포넌트도 이 패턴 유지.
  - 1.x 메이저라 API 안정성이 비교적 최근 확보. 신규 컴포넌트 추가 시 docs(`base-ui.com`) 최신 변경 확인.
  - Dialog는 SSR 환경에서 portal 이슈가 잦으니 `"use client"` 명시.

### lucide-react

- **현재 사용처:** `pricing`, `services`, `quote`, `footer`, `cta-footer`, `ui/dialog`, `ui/accordion-1` 등.
- **활용 팁:**
  - `import { ArrowRight, MessageCircle } from "lucide-react"` 같이 named import만 사용 → tree-shaking 보장. `import * as Icons` 금지.
  - 동일 디자인 톤 유지를 위해 `strokeWidth`를 1.5~2 사이로 통일 (현재 코드 기준 점검 가치 있음).

### Tailwind CSS v4 + tw-animate-css

- **v3 → v4 변경점 주의:** 설정이 JS config 파일 대신 CSS의 `@theme` 블록으로 이동. `src/app/globals.css` 확인.
- **tw-animate-css:** Tailwind 클래스 형태로 CSS 애니메이션을 쓰게 해주는 유틸. 가벼운 fade/slide 정도는 GSAP 안 쓰고 이걸로 처리 가능 → 번들 절약.
- **활용 팁:**
  - Tailwind v4는 PostCSS 플러그인이 별도 패키지(`@tailwindcss/postcss`). v3 시절 설정 글 보고 따라하면 깨짐.

### clsx + tailwind-merge + class-variance-authority (cva)

- **역할:** shadcn 컴포넌트 표준 유틸 3종. `src/lib/utils.ts`의 `cn()` 헬퍼가 `clsx`+`twMerge` 조합.
- **활용 팁:**
  - 동일 속성(`p-4` vs `p-2`)이 충돌하면 `twMerge`가 뒤에 오는 걸 채택 → variant 시스템에서 default + override 패턴 쉬워짐.
  - 컴포넌트별 variant 정의는 `cva()`로. props로 variant 노출 시 타입 추론까지 자동.

### pretendard

- 한글에 최적화된 가변 폰트. `next/font/local` 또는 직접 link로 로드. 현재 `public/fonts/`는 비어있고(`gitkeep`만), `pretendard` 패키지를 npm으로 받는 방식이면 `import "pretendard/dist/web/static/pretendard.css"` 형태로 사용.
- **활용 팁:** 가변 폰트(variable)는 한 파일로 모든 굵기를 커버해 폰트 요청 수↓. layout에서 한 번만 import.

### shadcn (CLI)

- **역할:** dependency에 들어있지만 런타임 라이브러리가 아니라 컴포넌트 코드를 프로젝트에 복사해주는 CLI. `npx shadcn add <component>`로 신규 UI primitive를 `src/components/ui/`에 생성.
- **현재 상태:** 이 프로젝트의 `ui/*`는 shadcn 패턴이되 base는 @base-ui/react로 커스텀돼 있음. CLI로 새 컴포넌트 받으면 base가 다를 수 있으니 받아온 코드를 @base-ui/react 기반으로 수정 필요.

---

## 설치는 됐지만 현재 미사용 (확인 후 정리 권장)

`package.json`에 있지만 `src/`에서 import 없는 패키지:

- **motion (12.38.0)** — framer-motion의 차세대 패키지. 현재 GSAP만 쓰고 있어 충돌. 둘 다 가져갈 이유 없으면 제거.
- **framer-motion (12.38.0)** — 위와 사실상 동일 패키지(과거 이름). `motion`과 중복.
- **react-hook-form (^7.75.0) + @hookform/resolvers (^5.2.2) + zod (^4.4.3)** — 견적 폼(`quote.tsx`)에 쓰려고 깐 듯하나 현재 `useState`만 사용. 폼 검증·서버 액션 연동 시 활성화 가치 있음.

> 미사용 dep 제거: `npm uninstall motion framer-motion` (사용 안 할 경우)

---

## 디렉토리 구조

```
src/
├─ app/
│  ├─ layout.tsx           # 전역 layout + Lenis provider
│  ├─ page.tsx             # 메인 (섹션 조립)
│  ├─ globals.css          # Tailwind v4 + theme
│  ├─ icon.tsx / apple-icon.tsx
│  ├─ not-found.tsx
│  ├─ business-info/page.tsx
│  └─ privacy/page.tsx
├─ components/
│  ├─ sections/            # 페이지 섹션 단위 (hero, services, pricing, …)
│  ├─ ui/                  # @base-ui/react 기반 primitive wrapper
│  ├─ animations/          # GSAP 공용 애니메이션 (section-reveal)
│  ├─ lenis-provider.tsx
│  ├─ cursor-spotlight.tsx
│  ├─ dot-nav.tsx
│  └─ analytics.tsx
└─ lib/
   └─ utils.ts             # cn() 헬퍼

public/
├─ images/                 # 포트폴리오 before/after, 서비스 컷
├─ videos/                 # hero / cta / process timelapse mp4
└─ fonts/, icons/

scripts/                   # ffmpeg 기반 미디어 전처리 sh
docs/                      # 개발 가이드 / 콘셉트 노트
raw-media/                 # 원본 미디어 (gitignore)
```

---

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

---

## 미디어 파이프라인

`scripts/` 안의 sh 스크립트가 `raw-media/`의 원본을 `public/images/` · `public/videos/`로 가공 (ffmpeg 필요). 자세한 내용은 `docs/미디어_리소스_가이드.md` 참조.

---

## 배포

Vercel 권장 (Next.js 16 공식 호스트). `next build` 후 정적 export(`out/`)도 가능하나, App Router에서 활용한 기능에 따라 export 호환성 점검 필요.

---

## 라이선스

`LICENSE` 파일 참조.
