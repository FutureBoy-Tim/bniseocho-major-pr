# BNI 서초 메이저 챕터 · 멤버 PR

> 39명의 대표를 **매주 한 명씩** 깊이 있게 소개하는 정적 웹사이트.
> 디지털 명함 · 실물 명함 앞/뒤 · 인포그래픽 · 상세 PPT 4종 자산을 한 페이지에서 보여주고,
> 카톡·SNS·메일로 누구나 공유할 수 있게 만들었습니다.

---

## 한눈에 보는 구조

```
bni-major-pr/
├── index.html              # 메인 그리드 (39명) + 이번 주 피처드 + 검색·업종 필터
├── member.html             # 개별 대표 상세 (URL: member.html?id=lee-woochang)
├── data/
│   └── members.json        # 39명 메타데이터 (이름·회사·업종·연락처·리퍼럴타깃·자산경로)
├── assets/
│   └── members/
│       └── lee-woochang/
│           ├── digital-card.png       # 디지털 명함 (BNI 카드형)
│           ├── card-front.png         # 실물 명함 앞면
│           ├── card-back.png          # 실물 명함 뒷면
│           ├── infographic.png        # 한 장 인포그래픽
│           ├── presentation.pptx      # 상세 PPT
│           └── profile.jpg            # (옵션) 프로필 사진
├── ADD_MEMBER.md           # 매주 새 멤버 추가하는 방법
└── README.md               # 이 파일
```

기술 스택: **순수 HTML + CSS + Vanilla JS**. 빌드 단계 없음, 프레임워크 없음.
폰트는 Pretendard CDN. 한 번 클론하면 누구나 수정·배포 가능.

---

## 로컬에서 열어보기

```bash
cd bni-major-pr
python -m http.server 8765
```

브라우저에서 **http://localhost:8765/** 접속.

> ⚠️ `index.html`을 더블클릭으로 열면 `fetch("data/members.json")`이 CORS 정책에 막힙니다. 반드시 위처럼 로컬 서버로 띄우거나 GitHub Pages에서 보세요.

---

## 매주 1명씩 추가하기

[ADD_MEMBER.md](./ADD_MEMBER.md) 한 페이지면 끝납니다. 요약하면:

1. `assets/members/{영문ID}/` 폴더 만들기
2. 자산 4종(+프로필) 파일을 정해진 이름으로 넣기
3. `data/members.json`에서 해당 멤버 객체 업데이트 (`tagline`, `expertise`, `referralTargets`, `assets` 채우기)
4. `featuredId`를 새 멤버 ID로 변경, 기존 멤버는 `status: "archived"`로
5. `git commit && git push` → GitHub Pages가 자동으로 반영

---

## 현재 상태

- ✅ 1주차: **이우창 대표** (더파운트 / 병원 절세 컨설팅) — 피처드
- ⏳ 2~39주차: 38명 공개 예정

---

## 디자인 원칙

- **BNI 공식 컬러** (오렌지 `#FF8200` + 네이비 `#0E1F5C`) 베이스
- **디지털 명함 = 영웅 자산** — 모든 화면에서 가장 크게 노출
- **리퍼럴 타깃 명시** — 보는 사람이 "누구를 소개해야 할지" 즉시 판단되게
- **공유 친화적** — OG 메타태그 / 공유 링크 복사 버튼 / 모바일 우선 반응형

---

## 기여 환영

이 페이지는 **BNI 서초 메이저 챕터 모두의 자산**입니다.

- 자기 정보 수정: PR 또는 [Issues](../../issues)에 요청
- 새 멤버 추가: [ADD_MEMBER.md](./ADD_MEMBER.md) 따라하면 됩니다
- 디자인 개선 제안: 환영합니다

---

## 연락 · 문의

**이형진** (한국AI마케팅협회 / BNI 서초 메이저)
adjinpr@naver.com
