> **핵심 Takeaway**
> WOW A 이미지 페어(`wow-before.jpg` / `wow-after.jpg`)를 **GPT-Image-2**로 생성하는 워크플로우.
> 핵심: **After 먼저 생성 → After를 reference로 Before 편집** 방식이 일관성 최강.
> 사이즈는 **1920×1088** 으로 생성하고 위아래 4px 크롭해서 1920×1080 만들기.

# WOW A — GPT-Image-2 생성 가이드

작성일: 2026-05-12
모델: `gpt-image-2` (OpenAI, 2026-04-21 출시)
대상: `public/images/wow-before.jpg` · `wow-after.jpg`

---

## ⚠️ 가장 중요한 제약 (한 번 더 강조)

두 이미지가 **차종 / 각도 / 광원 / 카메라 위치 / 배경**까지 모두 동일해야 변신 효과가 살아남.
**한 장만 생성하면 십중팔구 깨짐.** 반드시 **편집 모드(이미지→이미지)**로 짝 생성.

---

## 핵심 스펙

| 항목 | 값 | 비고 |
|------|-----|------|
| 모델 ID | `gpt-image-2` | API/SDK |
| 사이즈 | **1920×1088** | 두 변 모두 16 배수, 16:9에 가장 가까움 |
| Quality | `high` | WOW 모먼트 핵심 자산 — 비용 아끼지 말기 |
| 최종 출력 | 1920×1080 JPG 85% | 후처리 스크립트 자동 |
| 비용 | $0.03/이미지 (high 기준) | 페어 2장 ≈ $0.06 |

> **왜 1920×1088?**
> GPT-Image-2는 양변이 16 배수여야 하는데 1080은 67.5라 16 배수 X. 1088이 가장 가까운 16 배수.
> 위아래 4px씩 잘라 1920×1080 만들면 미디어 가이드 스펙과 일치.

---

## 🔄 워크플로우 (2단계 편집 방식)

### Phase 1 — After 이미지 생성 (텍스트 → 이미지)

먼저 **시공 완료** 이미지를 생성. 이게 일관성의 기준(reference)이 됨.

**프롬프트 (영문 — GPT-Image-2가 영문에서 더 안정):**
```
Cinematic three-quarter front view photograph of a glossy jet-black BMW 5 Series
sedan parked in a minimal dark professional detailing studio.
The body has just been ceramic-coated — mirror-like reflection across the hood,
deep wet-look black with crystal-clear highlights from soft warm key lights
positioned above-right and above-left.
Polished chrome wheels, crisp clear headlights, freshly waxed paint.
Background: smooth dark charcoal seamless backdrop, polished concrete floor
with subtle reflection.
Shot on a full-frame camera, 50mm lens, f/4, golden warm color grade,
luxury automotive commercial style.
The car occupies the center-right of the frame, with negative space on the left
for text overlay.
No license plate, no people, no logos, no watermark.
Photorealistic, ultra detailed, 16:9 cinematic framing, professional ad photography.
```

**API/Playground 설정:**
```json
{
  "model": "gpt-image-2",
  "prompt": "<위 프롬프트>",
  "size": "1920x1088",
  "quality": "high",
  "n": 1
}
```

**ChatGPT UI 사용 시:**
- 위 프롬프트 그대로 붙여넣기
- "Use 1920x1088 size, 16:9 cinematic framing" 추가 강조
- 생성 후 마음에 들 때까지 변형 요청 (`generate variations`)

---

### Phase 2 — Before 이미지 생성 (After 편집)

After 이미지를 **reference로 첨부**하고 편집 모드로 호출.

**프롬프트 (편집):**
```
Edit this image:

Change: The car is now BEFORE detailing. Add a thick layer of dried dust
covering the entire body, dried water spots and faint streaks on the hood
and doors, muddy spray pattern along the lower body sills, faint grime
buildup around the headlights and wheel wells, dull oxidized finish on the
paint, water-stained chrome wheels. The lighting becomes slightly colder
and overcast (less warm, less saturated, lower contrast).

Preserve EXACTLY:
- The exact same car model, color, and angle (three-quarter front view)
- The exact same camera position, focal length, and framing
- The exact same background (dark charcoal backdrop, polished concrete)
- The same key light positions (above-right, above-left) — only intensity/warmth shifts
- The same composition: car in center-right, negative space on left
- Same vehicle proportions, wheel arches, body lines

Constraints:
- Do NOT change the car model or angle
- Do NOT add people, license plates, logos, or watermarks
- Do NOT redesign the studio or change the floor
- Keep photorealistic, professional automotive photography style
```

**API 호출:**
```python
from openai import OpenAI
client = OpenAI()

result = client.images.edit(
    model="gpt-image-2",
    image=open("wow-after-1920x1088.png", "rb"),
    prompt="<위 편집 프롬프트>",
    size="1920x1088",
    quality="high"
)
```

**ChatGPT UI 사용 시:**
- After 이미지 생성한 같은 대화에서:
  - "Now show the same exact car in the same exact angle and lighting, but BEFORE detailing — covered in dust, dried water spots, dull finish" 후속 요청
- 또는 새 대화 시작 후 After 이미지 업로드 + 위 편집 프롬프트 첨부

---

## ✅ 결과 검증 체크리스트

생성된 페어를 나란히 놓고 확인:

- [ ] **차종 동일** — 보디 라인, 헤드라이트 모양, 그릴, 휠 동일
- [ ] **각도 동일** — three-quarter front view 유지
- [ ] **카메라 위치 동일** — 화면 내 차의 크기/위치 매치
- [ ] **배경 동일** — 같은 스튜디오 / 바닥
- [ ] **광원 위치 동일** — 키 라이트가 차에 떨어지는 방향 매치 (강도는 다소 다를 수 있음)
- [ ] **번호판 없음** — 양쪽 모두
- [ ] **사람 없음** — 양쪽 모두
- [ ] **상태 차이 명확** — Before는 확실히 더럽고 After는 확실히 광택

❌ 위 항목 중 하나라도 어긋나면 **재생성**. WOW A는 동일성이 효과의 핵심.

---

## 🔧 후처리

다운로드한 PNG 2장을 한 번에 1920×1080 JPG로 변환:

```bash
./scripts/process-wow-a.sh \
  ~/Downloads/wow-after-1920x1088.png \
  ~/Downloads/wow-before-1920x1088.png
```

→ 자동으로:
1. 위아래 4px 크롭 (1920×1088 → 1920×1080)
2. JPG 85% 변환
3. `public/images/wow-after.jpg`, `wow-before.jpg` 배치

---

## 💡 일관성 강화 팁

### 1. 첫 시도에서 마음에 안 들면
After 이미지부터 다시 — Before는 무조건 After에서 파생되도록.

### 2. 카메라 각도가 미묘하게 어긋날 때
편집 프롬프트에 "**Use the exact pixel-level alignment of the input image**" 추가.

### 3. 광원이 너무 다르게 바뀔 때
"Maintain the same Key/Fill/Rim light direction. Only adjust temperature from warm (5500K) to slightly cooler (5000K)" 명시.

### 4. After가 너무 광택이 약할 때
프롬프트에 "**competition-show-car level of gloss**", "**concours d'elegance finish**", "**ceramic coating fresh from professional detailer**" 같은 강조 키워드.

### 5. Before가 너무 깨끗할 때
"**very heavily dust-covered**", "**looks neglected for weeks**", "**clearly dirty before detailing**" 같은 강도 키워드 추가.

---

## 🎨 차종 변형 (필요 시)

기본 프롬프트의 "BMW 5 Series"를 다른 페르소나 차종으로 교체 가능:

| 페르소나 | 차종 키워드 |
|---------|-------------|
| ① 신차 직장인 | `glossy jet-black BMW 5 Series sedan` (기본) |
| ① · ② | `glossy obsidian-black Mercedes-Benz E-Class sedan` |
| ② 럭셔리 | `glossy deep-black Porsche Panamera sedan` |
| ① 국내 | `glossy onyx-black Genesis G80 sedan` |

다만 한 사이트에선 **하나의 차종으로 통일** 권장 (브랜드 일관성).

---

## ❌ 흔한 실패 패턴

| 증상 | 원인 | 해결 |
|------|------|-----|
| Before가 After보다 광택이 더 좋음 | "dirty" 강도 부족 | "heavily / clearly / very" 추가 |
| 차종이 살짝 다른 모델로 바뀜 | Preserve 누락 | "exact same car model" 명시 |
| 각도가 어긋남 | 편집이 아닌 재생성 모드 | image edit API 또는 후속 대화 사용 |
| 번호판이 생김 | 명시 안 함 | "No license plate" 양쪽 모두 |
| 사람 손이 등장 | 모델 추측 | "No people, no hands" 추가 |
| 배경이 야외/도심으로 바뀜 | 스튜디오 강조 부족 | "minimal dark professional studio" 강조 |

---

## 📦 출력 시 자산 등록

생성·후처리 완료 후 `docs/자산_등록부.md` 표에 등록:
- 출처: GPT-Image-2 (날짜·프롬프트 버전)
- 라이센스: OpenAI 생성물 (상업 사용 가능 — OpenAI Terms of Use 2024+)
- 비고: 페어 동일성 검증 통과

---

## 관련 링크
- [[미디어_리소스_가이드]] — WOW A 명세 (3-1번 섹션)
- [[미디어_제작_프롬프트_1순위]] — 다른 도구 (Midjourney/FLUX/Imagen) 옵션
- [[자산_등록부]] — 진행 상황 추적
- [OpenAI GPT-Image-2 docs](https://developers.openai.com/api/docs/models/gpt-image-2)
- [GPT-Image-2 Prompting Guide (OpenAI Cookbook)](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
