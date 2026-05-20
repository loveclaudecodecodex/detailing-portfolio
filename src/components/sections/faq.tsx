/**
 * FAQ — 자주 묻는 질문 (ReUI accordion-1 기반)
 *
 * ★ 자주 수정 ★
 * ─ 질문 추가/삭제:     `faqs` 배열 (id / q / a)
 * ─ 초기 펼침 항목:     <Accordion defaultValue="..."> — 빈 문자열이면 다 닫힘
 * ─ variant:            "outline" (현재) — 각 아이템 보더 카드 / "default" — 구분선만
 * ─ collapsible:        true — 열린 항목 다시 클릭하면 닫힘
 *
 * ★ 동작 ★
 *   한 번에 하나만 열림. 다른 거 누르면 이전 자동 닫힘.
 *
 * ★ GSAP ★
 * ─ 헤더 fade-up + 아코디언 아이템 stagger
 */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-1";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    id: "faq-1",
    q: "PPF는 보증 기간이 얼마나 되나요?",
    a: "10년 정품 PPF 사용 시 균열·황변·박리 10년 무상 보증입니다. 일부 부분 시공의 경우 5년 보증으로 운영됩니다.",
  },
  {
    id: "faq-2",
    q: "시공 시간은 얼마나 걸리나요?",
    a: "PPF 풀랩 기준 한 대당 평균 12시간 (8~16시간). 세라믹 코팅만은 4~6시간, 틴팅은 2~3시간 소요됩니다.",
  },
  {
    id: "faq-3",
    q: "출고 직후 바로 받는 게 좋나요?",
    a: "네. 출고 후 1~2주 이내가 가장 이상적입니다. 도장이 깨끗할 때 시공해야 PPF/코팅 효과가 극대화됩니다.",
  },
  {
    id: "faq-4",
    q: "결제는 어떻게 이루어지나요?",
    a: "예약 시 10% 디포짓, 시공 완료 후 잔금 결제입니다. 카드·계좌이체·현금 모두 가능하며, 50만원 이상은 카드 할부 됩니다.",
  },
];

export default function Faq() {
  const headerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }
      if (listRef.current) {
        // Accordion → div(space-y-2) > AccordionItem(div) 구조라 listRef.firstElementChild.children 가 항목들
        const wrapper = listRef.current.firstElementChild;
        if (wrapper) {
          gsap.from(wrapper.children, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" className="bg-brand-black py-20 md:py-24">
      <div className="mx-auto max-w-[880px] px-6 md:px-0">
        <header ref={headerRef} className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
            QUESTIONS
          </span>
          <h2 className="mt-4 font-display text-5xl tracking-tight text-foreground md:text-6xl">
            FAQ
          </h2>
        </header>

        <div ref={listRef}>
          <Accordion
            type="single"
            variant="outline"
            collapsible
            defaultValue="faq-1"
            className="w-full"
          >
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
