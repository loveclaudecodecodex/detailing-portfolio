/**
 * Reviews — 후기 (무한 슬라이드 Marquee)
 *
 * ★ 자주 수정 ★
 * ─ 후기 추가/삭제:     아래 `reviews` 배열
 *                        · stars: 별 갯수 (1-5)
 *                        · text:  후기 본문
 *                        · name:  이름 (가명 처리 권장)
 *                        · car:   차종
 * ─ 슬라이드 속도:      <Marquee> 의 `duration` 속성 — CSS 변수 `--duration` 으로 제어 가능
 * ─ 슬라이드 멈춤:      <Marquee pauseOnHover>
 * ─ 방향 반대:          <Marquee reverse>
 *
 * ★ 컬러 ★
 * ─ 카드 배경:          bg-white/[0.02]
 * ─ 별:                 text-brand-gold
 */
import { Marquee } from "@/components/ui/marquee";

const reviews = [
  {
    stars: 5,
    text: "출고 다음 날 PPF 풀랩. 1년 지났는데 광택은 그대로.",
    name: "김** 님",
    car: "BMW 5시리즈",
  },
  {
    stars: 5,
    text: "픽업·탁송까지 처리해줘서 일정 손해가 없었습니다.",
    name: "박** 대표",
    car: "벤츠 S클래스",
  },
  {
    stars: 5,
    text: "첫 차라서 부담됐는데 부분 PPF로 합리적으로 마쳤습니다.",
    name: "이** 님",
    car: "현대 아반떼",
  },
  {
    stars: 5,
    text: "예약·시공·픽업 전 과정이 깔끔. 다음 차도 여기서 합니다.",
    name: "최** 부장",
    car: "포르쉐 911",
  },
  {
    stars: 5,
    text: "1년 만에 재시공. 케어 시스템이 다른 곳과 차원이 달랐어요.",
    name: "정** 대표",
    car: "벤츠 E클래스",
  },
];

function ReviewCard({ r }: { r: (typeof reviews)[number] }) {
  return (
    <div className="mx-3 w-[360px] shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div className="text-brand-gold">{"★".repeat(r.stars)}</div>
      <p className="mt-4 text-sm leading-relaxed text-foreground">{r.text}</p>
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{r.name}</span>
        <span>·</span>
        <span>{r.car}</span>
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-brand-black py-16 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.32em] text-brand-gold">
            CUSTOMER VOICE
          </span>
          <h2 className="mt-4 font-display text-5xl tracking-tight text-foreground md:text-6xl">
            Reviews
          </h2>
        </header>

        <Marquee className="[--duration:40s]" pauseOnHover>
          {reviews.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
