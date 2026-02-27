# 🐹 푸딩이를 기억하며

드워프 햄스터 푸딩이(2024.12.28 — 2025.03.24)를 추모하는 정적 웹사이트입니다.

## 주요 기능

- 인사 영상 재생 (클릭 시 pop 애니메이션, 영상 종료 후 자동 스크롤 + BGM 시작)
- 프로필 카드, 성격 소개, 사진 갤러리, 사진첩, 인터뷰, 편지 섹션
- 갤러리 이미지 라이트박스 (클릭 시 전체화면 확대)
- 스크롤 페이드인 애니메이션
- 별 반짝이는 배경 (랜덤 생성)
- 배경음악 수동 토글

## 기술 스택

- HTML / CSS / Vanilla JS (프레임워크 없음)
- Google Fonts: Gowun Dodum, Noto Sans KR
- IntersectionObserver API (스크롤 애니메이션)
- requestAnimationFrame (자동 스크롤)

## 파일 구조

```
index.html          # 메인 페이지
style.css           # 전체 스타일
script.js           # 인터랙션 로직
assets/
  puding.png              # 푸딩이 일러스트
  puding_insa.mp4         # 인사 영상
  bgm2.mp3                # 배경음악
  20241230_212558.jpg     # 갤러리 사진들
  20250105_195155.jpg
  20250105_195156.jpg
  20250105_200022.jpg
  20250108_192344.jpg
  20250202-181452_kNEDqGY3.mp4
  먹방.mp4
  picture_book/           # 서현이의 사진첩
    20260222_171029.jpg
    171054_left.jpg
    171054_right.jpg
    171104_left.jpg
    171104_right.jpg
    171111_left.jpg
    171111_right.jpg
    20260222_171119.jpg
puding.md           # 푸딩이 정보 원본 메모
```

## 배포 방법 (GitHub Pages)

1. GitHub에서 새 repository 만들기
2. 이 폴더 전체를 push
3. repository Settings → Pages → Source: `main` branch → Save
4. 잠시 후 `https://[username].github.io/[repo-name]` 으로 접속 가능
