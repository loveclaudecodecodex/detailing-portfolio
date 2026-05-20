/**
 * Home — 메인 페이지 조립
 *
 * ★ 페이지 순서 변경 ★
 *   아래 jsx 안 컴포넌트 순서를 그대로 바꾸면 끝.
 *
 * ★ 신규 섹션 추가 ★
 *   components/sections/<이름>.tsx 생성 → 여기서 import → 원하는 위치에 <Foo /> 삽입
 *
 * ★ 성능 — Code Splitting ★
 *   Hero / Nav 등 above-the-fold 는 즉시 로드.
 *   below-the-fold 섹션들 (WowC, Portfolio, Quote, Pricing, Reviews, FAQ, CtaFooter)
 *   은 next/dynamic 으로 lazy chunk → 초기 JS bundle 절감 (Lighthouse Performance ↑).
 */
import dynamic from "next/dynamic";
import Nav from "@/components/sections/nav";
import DotNav from "@/components/dot-nav";
import Hero from "@/components/sections/hero";
import WowA from "@/components/sections/wow-a";
import Stats from "@/components/sections/stats";
import TrustBar from "@/components/sections/trust-bar";
import Services from "@/components/sections/services";
import Footer from "@/components/sections/footer";

// Below-the-fold lazy load
const WowC = dynamic(() => import("@/components/sections/wow-c"));
const Process = dynamic(() => import("@/components/sections/process"));
const Portfolio = dynamic(() => import("@/components/sections/portfolio"));
const Quote = dynamic(() => import("@/components/sections/quote"));
const Pricing = dynamic(() => import("@/components/sections/pricing"));
const Reviews = dynamic(() => import("@/components/sections/reviews"));
const Faq = dynamic(() => import("@/components/sections/faq"));
const CtaFooter = dynamic(() => import("@/components/sections/cta-footer"));

export default function Home() {
  return (
    <>
      <Nav />
      <DotNav />

      <main id="main" className="bg-brand-black text-foreground">
        <Hero />
        <WowA />
        <Stats />
        <TrustBar />
        <Services />
        <WowC />
        <Process />
        <Portfolio />
        <Quote />
        <Pricing />
        <Reviews />
        <Faq />
        <CtaFooter />
      </main>

      <Footer />
    </>
  );
}
