/**
 * Placeholder — 미디어 의존 섹션 (Hero·WOW A·WOW C·Portfolio) 자리 표시용
 *
 * ★ 사용법 ★
 *   <Placeholder
 *     code="WOW A"
 *     title="Before / After 시공 비교"
 *     media="/wow-before.jpg, /wow-after.jpg"
 *     todo="components/sections/wow-a.tsx 작성 후 page.tsx 에서 교체"
 *   />
 *
 * ★ 제거 ★
 * ─ 미디어 + 실제 컴포넌트 작성 완료되면 page.tsx 에서 <Placeholder /> 자체를 새 섹션으로 교체
 */
type Props = {
  code: string;         // 섹션 코드 ("WOW A" 등)
  title: string;        // 사람 친화 제목
  media: string;        // 필요한 미디어 파일 경로
  todo: string;         // 다음에 해야 할 작업 안내
};

export default function Placeholder({ code, title, media, todo }: Props) {
  return (
    <section className="flex min-h-[40vh] items-center justify-center border-y border-dashed border-white/10 bg-white/[0.015] py-20">
      <div className="mx-auto max-w-[640px] px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-brand-gold">
          <span className="size-1.5 rounded-full bg-brand-gold" />
          {code} · MEDIA PENDING
        </div>
        <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-3 text-xs text-muted-foreground">
          필요 미디어: <code className="text-brand-gold">{media}</code>
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">{todo}</p>
      </div>
    </section>
  );
}
