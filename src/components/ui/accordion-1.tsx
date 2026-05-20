/**
 * accordion-1 — ReUI 스타일 단일 아코디언
 *
 * ★ 사용 예시 ★
 *   <Accordion type="single" variant="outline" collapsible className="w-full">
 *     <AccordionItem value="q1">
 *       <AccordionTrigger>질문 1</AccordionTrigger>
 *       <AccordionContent>답변 1</AccordionContent>
 *     </AccordionItem>
 *     ...
 *   </Accordion>
 *
 * ★ 지원 ★
 * ─ type="single"           한 번에 하나만 열림
 * ─ collapsible             열려있는 항목을 다시 클릭해서 닫을 수 있게
 * ─ variant="outline"       각 아이템에 보더 + 다크 글래스 배경 (현재 브랜드 톤)
 * ─ variant="default"       항목 사이 보더만 (구분선 스타일)
 *
 * ★ 컬러 ★
 * ─ 활성 아이템 보더:     border-brand-gold/30
 * ─ 활성 배경 톤:         bg-brand-gold/[0.04]
 * ─ +/- 아이콘:           text-brand-gold
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline";

type AccordionCtx = {
  activeValue: string | null;
  setActive: (v: string | null) => void;
  collapsible: boolean;
  variant: Variant;
};

const AccordionContext = createContext<AccordionCtx | null>(null);
const ItemContext = createContext<string>("");

type AccordionProps = {
  type?: "single";
  collapsible?: boolean;
  variant?: Variant;
  defaultValue?: string;
  className?: string;
  children: ReactNode;
};

export function Accordion({
  collapsible = false,
  variant = "default",
  defaultValue = "",
  className,
  children,
}: AccordionProps) {
  const [activeValue, setActiveValue] = useState<string | null>(
    defaultValue || null
  );

  return (
    <AccordionContext.Provider
      value={{
        activeValue,
        setActive: setActiveValue,
        collapsible,
        variant,
      }}
    >
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = {
  value: string;
  className?: string;
  children: ReactNode;
};

export function AccordionItem({
  value,
  className,
  children,
}: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  const isOpen = ctx?.activeValue === value;

  return (
    <ItemContext.Provider value={value}>
      <div
        className={cn(
          "overflow-hidden transition-colors",
          ctx?.variant === "outline"
            ? cn(
                "rounded-xl border",
                isOpen
                  ? "border-brand-gold/30 bg-brand-gold/[0.04]"
                  : "border-white/5 bg-white/[0.02]"
              )
            : "border-b border-white/5",
          className
        )}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

type AccordionTriggerProps = {
  className?: string;
  children: ReactNode;
};

export function AccordionTrigger({
  className,
  children,
}: AccordionTriggerProps) {
  const ctx = useContext(AccordionContext);
  const value = useContext(ItemContext);
  const isOpen = ctx?.activeValue === value;

  function onClick() {
    if (!ctx) return;
    if (isOpen) {
      if (ctx.collapsible) ctx.setActive(null);
    } else {
      ctx.setActive(value);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      className={cn(
        "flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base text-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      <span className="flex-1">{children}</span>
      {isOpen ? (
        <Minus className="size-5 shrink-0 text-brand-gold transition-transform" strokeWidth={1.6} />
      ) : (
        <Plus className="size-5 shrink-0 text-brand-gold transition-transform" strokeWidth={1.6} />
      )}
    </button>
  );
}

type AccordionContentProps = {
  className?: string;
  children: ReactNode;
};

export function AccordionContent({
  className,
  children,
}: AccordionContentProps) {
  const ctx = useContext(AccordionContext);
  const value = useContext(ItemContext);
  const isOpen = ctx?.activeValue === value;

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "px-6 pb-5 text-sm leading-relaxed text-muted-foreground",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
