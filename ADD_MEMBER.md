# 매주 새 멤버 추가하는 방법

매주 1명씩 자료를 공개하는 흐름입니다. 5분이면 끝납니다.

---

## Step 1 · 영문 ID 정하기

`이름-성` 영문 lowercase, 하이픈 구분.

| 한글 이름 | 영문 ID 예시 |
|-----------|--------------|
| 이우창 | `lee-woochang` |
| 정원옥 | `jung-wonok` |
| 김보람 | `kim-boram` |

이미 `data/members.json`에 미리 채워둔 ID가 있으니 그걸 쓰면 됩니다.

---

## Step 2 · 자산 폴더 만들기

```
assets/members/{영문ID}/
├── digital-card.png       ← 필수. BNI 서초 공통 오렌지 카드 (세로 9:16, 1280×2272 권장)
├── card-front.png         ← 실물 명함 앞면 (가로 16:9, 3500×2000 권장)
├── card-back.png          ← 실물 명함 뒷면 (가로 16:9, 3500×2000 권장)
├── infographic.png        ← 한 장 인포그래픽 (정사각형 1:1, 1920×1920 권장)
├── presentation.pptx      ← 상세 PPT (10~20장)
└── slides/                ← PPT 슬라이드를 PNG로 추출 (슬라이드 뷰어 자동 활성화)
    ├── slide-01.png       ← 첫 슬라이드 (1920×1080 권장)
    ├── slide-02.png
    └── ... (이후 순서대로)
```

> 파일명을 정확히 일치시키면 별도 코드 수정 없이 자동 노출됩니다.

### 슬라이드 추출 방법 (Windows · PowerPoint 기준)

**가장 간단한 방법:**
1. PowerPoint에서 PPT 열기
2. `파일` → `다른 이름으로 저장` → 파일 형식을 **`PNG (*.png)`** 선택
3. "모든 슬라이드" 선택 → 폴더에 자동 저장됨
4. 저장된 파일명을 `slide-01.png`, `slide-02.png`, … 형식으로 이름 변경
5. `assets/members/{영문ID}/slides/` 폴더에 복사

**자동화 (PowerShell 1줄):**
```powershell
$src = "presentation.pptx 경로"; $out = "slides 폴더 경로"; New-Item -ItemType Directory -Force $out | Out-Null
$pp = New-Object -ComObject PowerPoint.Application; $pres = $pp.Presentations.Open($src, $true, $false, $false)
for($i=1; $i -le $pres.Slides.Count; $i++){ $pres.Slides.Item($i).Export((Join-Path $out ("slide-{0:D2}.png" -f $i)), "PNG", 1920, 1080) }
$pres.Close(); $pp.Quit()
```

> 슬라이드 폴더가 비어 있으면 뷰어 자리에 "PPT 다운로드" 버튼만 노출됩니다. 자료 점진적 업데이트 환영.

---

## Step 3 · `data/members.json` 업데이트

해당 멤버 객체를 찾아 다음 필드를 채우세요:

```json
{
  "id": "lee-woochang",
  "order": 1,
  "name": "이우창",
  "title": "대표이사",
  "company": "(주)더파운트",
  "companyEn": "The FOUNT",
  "category": "재무·세무",
  "industry": "병원 절세 컨설팅",
  "tagline": "세금은 줄이고, 자산은 지키는 병원의 재무 닥터",
  "subTagline": "병원 원장님의 '남는 돈'을 만드는 구조 설계자",
  "phone": "010-2944-4286",
  "email": "mablue7856@nate.com",
  "address": "서울 성동구 성수일로10 서울숲ITCT 1608호",
  "expertise": [
    "병원 맞춤형 절세 컨설팅",
    "과오납 세금 및 심평원 환급 컨설팅",
    "재무·투자 컨설팅"
  ],
  "referralTargets": [
    "병원 원장, 네트워크 운영자",
    "의료 전문 변호사 · 노무사",
    "의료기기 · 의약품 영업사원",
    "세무사 · 회계사"
  ],
  "valueProps": [
    "병원 운영 특성을 정확히 이해한 전문가들이 최적의 절세·경영 전략을 설계합니다.",
    "의료진의 재무적 고민을 해결하고, 병원의 브랜드 가치를 높이는 파트너가 되겠습니다."
  ],
  "publishedAt": "2026-04-29",
  "status": "featured",
  "assets": {
    "digitalCard": "assets/members/lee-woochang/digital-card.png",
    "cardFront": "assets/members/lee-woochang/card-front.png",
    "cardBack": "assets/members/lee-woochang/card-back.png",
    "infographic": "assets/members/lee-woochang/infographic.png",
    "presentation": "assets/members/lee-woochang/presentation.pptx"
  }
}
```

### 필수 vs 선택 필드

| 필드 | 필수 | 비고 |
|------|------|------|
| `id`, `name`, `company`, `industry`, `category` | ✅ | 그리드 카드에 표시 |
| `tagline`, `subTagline` | ✅ | 상세 페이지 히어로 |
| `phone`, `email`, `address` | ✅ | 연락처 카드 |
| `expertise` (3~5개) | ✅ | 전문 분야 |
| `referralTargets` (3~5개) | ✅ | 누구를 소개받고 싶은지 |
| `valueProps` (1~3개) | 선택 | 가치 제안 문장 |
| `assets.*` | ✅ | 자산 4종 경로 |
| `publishedAt` | 선택 | 공개일 (YYYY-MM-DD) |

---

## Step 4 · `featuredId` 변경

루트의 `featuredId` 값을 이번 주 새 멤버 ID로 바꾸고, 지난 주 멤버의 `status`는 `"archived"`로:

```diff
- "featuredId": "lee-woochang",
+ "featuredId": "jung-wonok",
  "lastUpdated": "2026-05-06",

  "members": [
    {
      "id": "lee-woochang",
-     "status": "featured",
+     "status": "archived",
      ...
    },
    {
      "id": "jung-wonok",
-     "status": "upcoming",
+     "status": "featured",
      ...
    }
  ]
```

`lastUpdated`도 함께 업데이트하면 푸터에 자동 반영됩니다.

---

## Step 5 · 푸시

```bash
git add data/members.json assets/members/{영문ID}/
git commit -m "feat: {이름} 대표 ({회사}) 추가"
git push
```

GitHub Pages가 활성화되어 있으면 1~2분 안에 라이브 사이트에 반영됩니다.

---

## 자주 묻는 것

### Q. PPT가 너무 큰데 (50MB+) 깃에 올려도 되나요?
A. GitHub은 100MB까지 허용하지만, 브라우저 다운로드 속도와 깃 클론 시간을 고려하면 **30MB 이하**로 압축 권장. PPT 안에 비디오·고해상도 이미지가 있다면 따로 분리하거나 압축하세요.

### Q. 자산이 아직 다 안 갖춰졌어요. 일부만 올려도 되나요?
A. 가능합니다. `assets` 객체에서 없는 키는 빼거나 빈 문자열로 두면 상세 페이지에서 "준비중" 자리표시자가 자동으로 들어갑니다.

### Q. 디지털 명함 디자인 템플릿이 있나요?
A. `assets/members/lee-woochang/digital-card.png`을 레퍼런스로 같은 BNI Major 오렌지 헤더 + 인물 사진 + 회사명 + 전문분야/리퍼럴 양옆 배치 형식을 유지하면 됩니다.

### Q. 인포그래픽은 어떻게 만드나요?
A. NotebookLM의 Mind Map 또는 Gemini 이미지 생성으로 "손그림 노트 스타일 / 3-column / 의사의 현실 → 해결책 → 리퍼럴 가이드" 구조로 만들면 일관됩니다. 이우창 대표 자료가 좋은 예시.

---

이형진 (BNI 서초 메이저 · adjinpr@naver.com)에게 언제든 문의 주세요.
