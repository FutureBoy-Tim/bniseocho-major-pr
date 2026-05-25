# BNI 서초 메이저 PR 사이트 — 운영 가이드

> 이 파일은 클로드 새 대화창 진입 시 자동 로드됩니다. 매번 컨텍스트 다시 설명할 필요 없이 한 줄 명령으로 작업 가능.

## 프로젝트 핵심

- **목적**: 39명 챕터 멤버를 외부 대표님에게 PR하는 정적 사이트
- **관점**: "검증된 전문가 39인을 사업 성장이 필요한 외부 대표님께 소개" — 내부 추천 채널 아님
- **운영**: 매주 1명씩 피처드 변경 (월요일 권장)
- **스택**: 순수 HTML + Vanilla JS + Pretendard. 빌드 없음. GitHub Pages 자동 배포.
- **로컬 미리보기**: `python -m http.server 8765` → http://localhost:8765/

## 4종 자산 구조 (확정, 변경 금지)

각 멤버 폴더 `assets/members/{영문ID}/`에 다음 4개 파일 + PPT 1개:

| 파일명 | 비율 | 용도 | 필수 |
|---|---|---|---|
| `digital-card.png` | 9:16 | BNI 공통 디자인 디지털 명함 (오렌지 헤더) | ✅ |
| `card-front.png` | 16:9 | 실물 명함 앞면 | ✅ |
| `card-back.png` | 16:9 | 실물 명함 뒷면 (연락처) | ✅ |
| `infographic.png` | 1:1 | 사업 한 페이지 인포그래픽 | ✅ |
| `presentation.pptx` | — | 상세 PPT (10~20장) | ✅ |
| `slides/slide-NN.png` | 16:9 | PPT를 PNG로 추출 (슬라이드 뷰어용) | 선택 |

**파일명·비율 모두 고정.** 사이즈가 살짝 달라도 슬롯이 `object-fit: contain`으로 받아주므로 그대로 넣으면 됨.

## 멤버 추가 워크플로우 — 한 줄 명령

운영자가 다음 형태로 말하면 클로드가 알아서 모두 처리:

```
"이번 주는 박상철 대표(에이드림 / IT 컨설팅) 추가해줘. 
자산 4개는 다운로드 폴더에 있어. (또는 카톡으로 받은 거)"
```

클로드가 자동 수행:
1. **영문 ID 결정** (예: `park-sangchul`) — `data/members.json` 기존 멤버 객체 확인
2. **자산 복사**: Downloads/카톡 폴더에서 가장 최근 명함·인포그래픽·PPT 찾아 `assets/members/{id}/`에 표준 파일명으로 복사
3. **JSON 업데이트**: 해당 멤버 객체의 `tagline`, `expertise`, `referralTargets`, `phone`, `email`, `address`, `assets.*` 채우기
4. **피처드 교체**: 루트 `featuredId` 새 ID로 변경, 지난 주 멤버 `status`를 `"featured"` → `"archived"`로
5. **lastUpdated** 오늘 날짜로 갱신 + `sitemap.xml`의 `<lastmod>` 일괄 갱신
6. **OG 이미지 메타 업데이트** (★중요 — 카톡 미리보기 라지 카드 표시):
   - `index.html`과 `member.html`에서 다음 4개 라인의 URL을 새 멤버 인포그래픽으로 교체:
     - `og:image` content
     - `og:image:secure_url` content
     - `twitter:image` content
     - `og:image:alt` content (멤버명·회사명 갱신)
   - 카톡 봇은 JS 실행 안 하므로 정적 메타가 필수. 동적 OG는 페이지 표시용 보조.
7. **(선택) PPT 슬라이드 추출**: `assets/members/{id}/slides/slide-NN.png` 생성 (PowerPoint COM 자동화)
8. **로컬 확인 안내**: http://localhost:8765/ 새로고침
9. **카카오 캐시 갱신 안내**: push 후 https://developers.kakao.com/tool/clear/og 에서 URL 입력 → 캐시 삭제 (안 하면 옛 미리보기 그대로)

## SEO·확산 시스템 (2026-04-30 도입, 2026-05-24 마무리)

### 박혀있는 SEO 시그널 (자동/정적)
- ✅ `sitemap.xml` (41 URL: 메인 + intro + 39명)
- ✅ `robots.txt` (네이버 Yeti, 다음 Daumoa 명시 허용)
- ✅ JSON-LD Organization · WebSite · ItemList(39명) · Person(member 동적)
- ✅ canonical URL (member.html은 ?id= 동적 갱신)
- ✅ OG 메타 + Twitter Card (라지 카드용 width/height/alt 명시)
- ✅ meta robots (index, follow, max-image-preview:large)
- ✅ meta keywords + author + locale
- ✅ GitHub 리포 description/topics (GitHub 자체 검색 노출)

### 매주 멤버 변경 시 수동 갱신 (1줄 명령으로 처리)
운영자: "이번 주 ㅇㅇ 대표 추가" → 클로드가 자동으로:
1. `sitemap.xml` lastmod 오늘 날짜로 갱신
2. JSON-LD ItemList 재생성 (members.json 기준)
3. OG 메타 4개(og:image / og:image:secure_url / twitter:image / og:image:alt) 새 featured 멤버 인포그래픽으로 교체
4. Organization logo도 새 featured 멤버 이미지로 교체
5. `data/members.json`의 `lastUpdated` 오늘로 갱신
6. push → GitHub Pages 자동 배포
7. 카카오 캐시 갱신 안내: https://developers.kakao.com/tool/clear/og

### 운영자 1회 작업 (검색엔진 등록)
초기에 한 번만 하면 됨. SEO_AND_PROMOTION.md 1·2단계 참조.

**네이버 서치어드바이저** (한국 검색 60%):
1. https://searchadvisor.naver.com/ → 사이트 추가
2. HTML 태그 방식 인증 → content 코드 복사
3. 클로드에게: "네이버 인증 코드는 abc123 야"
4. 클로드가 자동: index.html·member.html의 `REPLACE_WITH_NAVER_CODE` 교체 + push
5. 네이버 콘솔에서 "확인" 클릭 + sitemap.xml 제출

**구글 서치 콘솔** (글로벌 + 한국 30%):
- 같은 방식. `REPLACE_WITH_GOOGLE_CODE` 자리.

확산 전략 전체는 [SEO_AND_PROMOTION.md](SEO_AND_PROMOTION.md) 참조 — 비기술자용 단계별 가이드.

## 조찬모임 초대장 시스템 (2026-05-26 도입)

매주 한 분의 멤버가 프레젠테이션 연사로 서는 BNI 조찬모임 초대장을 사이트에서 노출.

### 자동 동작
- `data/members.json`의 `invitations` 배열에서 **오늘 날짜 기준 가장 가까운 미래/당일 초대장**을 자동 선택해 메인에 큰 카드로 표시
- 그 외 미래 주차 초대장은 "다음 주차 초대장 미리보기"로 작게 노출
- 다운로드(JPG) + 카톡 공유 + 링크 복사 버튼 자동 동작
- 이미지 클릭 시 라이트박스로 확대

### 운영자 액션 (주 1회·매주 수요일 이후)
새 초대장 1장 추가하려면:
1. 초대장 이미지를 `assets/invitations/YYYY-MM-DD.jpg` 표준 파일명으로 저장
2. `data/members.json`의 `invitations` 배열에 객체 1개 추가:
   ```json
   {
     "volume": 54,
     "date": "2026-07-08",
     "dayKorean": "수",
     "time": "06:20",
     "presenter": {"name": "○○○", "title": "대표", "company": "○○회사"},
     "presenterMemberId": "yyy",
     "imageUrl": "assets/invitations/2026-07-08.jpg"
   }
   ```
3. push → 자동 배포

운영자가 클로드한테:
> "다음 주 초대장 받았어. {대표명} {회사명}, 7월 8일(수)"
→ 클로드가 BNI 폴더/Downloads에서 자동으로 이미지 찾아 복사 + JSON 추가 + push

### 공통 모임 정보 (`data/members.json` → `meeting` 키)
- schedule, venue, dressCode, businessCards, fee, account, ed, growthAmbassador, director

## 비즈니스 문의 폼 (Formspree)

[index.html](index.html) 하단 Producer 섹션에 비즈니스 문의 폼 있음. 데이터는 Formspree로 수집.

**초기 setup (1회, 사용자 액션)**:
1. https://formspree.io/ 가입 (구글 계정 가능)
2. New Form 생성 → 폼 이름 "BNI Major - AI 문의"
3. 발급된 endpoint 복사 (예: `https://formspree.io/f/abcd1234`)
4. 클로드에게: "Formspree URL은 https://formspree.io/f/abcd1234 야"
5. 클로드가 [index.html](index.html)의 `REPLACE_WITH_FORMSPREE_ID` 부분 자동 교체 + push

**운영**:
- Formspree 대시보드에서 접수된 문의 확인 + 이메일 알림 자동 발송
- 무료 플랜: 월 50건. 더 필요하면 유료 ($10/월부터 무제한)
- 폼 필드: 성함·회사·연락처·이메일·문의 내용·개인정보 동의

**커스터마이징 필요 시**:
- 폼 필드 추가/삭제: `<input>` 추가 (name 속성만 정확히)
- 자동 답장: Formspree 대시보드 → Form Settings → Autoresponse
- 스팸 차단: 이미 honeypot (`_gotcha`) 적용됨

운영자 추가 입력이 필요한 정보(JSON에 안 들어있으면 클로드가 물어봄):
- 회사명·직함·업종·카테고리
- 태그라인 / 서브태그라인 (명함 헤드라인에서 추출 가능)
- 전문분야 3~5개 / 추천 대상 3~5개 (명함 뒷면에서 추출 가능)
- 연락처 (M / E / A)

**대부분 명함 이미지에서 OCR/시각 인식으로 추출 가능** → 클로드가 명함 읽고 채워넣음.

## 톤 가이드 (외부 PR 관점)

- 주어는 **외부 대표님** ("우리 사업의 다음", "내 얘기인지", "마음에 드는 전문가")
- 멤버 = **검증된 전문가** ("멤버" 단어 자체는 사용 OK, 다만 카피에서는 "전문가" 선호)
- 헤드라인 어조: "사업의 성공과 성장이 필요한 대표님께, 딱 맞는 전문가가 있습니다"
- "리퍼럴" 단어는 BNI 인쇄물에는 그대로(`희망 리퍼럴`), 웹 카피에는 "추천" 사용 OK

## 디렉토리 구조

```
bni-major-pr/
├── index.html              # 39명 그리드 + 피처드
├── member.html             # 멤버 상세 (?id=영문ID)
├── intro.html              # 챕터 소개
├── data/members.json       # 단일 진실 (39명 메타데이터)
├── assets/
│   ├── members/{영문ID}/    # 멤버별 자산 폴더
│   ├── share-kit.js        # 외부 공유 시스템
│   └── chapter/            # 챕터 자산
├── ADD_MEMBER.md           # 멤버 추가 상세 가이드
├── README.md
└── .github/workflows/pages.yml  # GitHub Pages 자동 배포
```

## 자주 묻는 작업 트리거

| 운영자가 말하면 | 클로드가 하는 일 |
|---|---|
| "이번 주 {이름} 대표 추가" | 위 워크플로우 1~7 자동 실행 |
| "{이름} 대표 자산 보강" | 누락된 자산 찾아서 추가 |
| "피처드만 {이름}으로 바꿔줘" | featuredId만 교체, 자산은 기존 사용 |
| "lastUpdated 오늘로" | data/members.json 날짜만 갱신 |
| "git push" | commit + push (메시지는 변경 내역으로 자동 생성) |

## 변경 금지 / 주의

- **자산 파일명**: 고정 (`digital-card.png` 등) — 다른 이름으로 저장 금지
- **39명 명단**: `data/members.json`의 `members[]` 배열 순서·ID 변경 금지 (한종태/한종희 분리됨, 동명이인 주의)
- **디지털 명함 디자인**: 39명 공통, 사용자가 별도 제작해서 전달함 (클로드가 만들지 않음)
- **상위 폴더 `bni-app/`**: 별도 프로젝트 (V/C 자기소개서 도구). 이 사이트와 무관, 혼동 금지

## 배포 (GitHub Pages)

`.github/workflows/pages.yml` 작동 중. main 브랜치에 push하면 자동 배포.
- **Remote**: `origin` → https://github.com/FutureBoy-Tim/bniseocho-major-pr.git
- **공개 URL**: https://bniseocho.kr/
- **Actions 빌드 확인**: https://github.com/FutureBoy-Tim/bniseocho-major-pr/actions

## 메모리

운영 중 변경된 사실은 사용자 글로벌 메모리 [project_bni_major_pr.md](C:/Users/adjin/.claude/projects/C--Users-adjin-OneDrive---------------/memory/project_bni_major_pr.md)에도 동기화.
