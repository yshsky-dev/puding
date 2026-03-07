// 새로고침 시 맨 위로
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// 별 생성
function createStars() {
  const container = document.getElementById('stars');
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 4 + 2;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.7 + 0.3;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}%; top: ${y}%;
      --duration: ${duration}s; --max-opacity: ${opacity};
      animation-delay: ${delay}s;
    `;
    container.appendChild(star);
  }
}

// 스크롤 페이드인
function initScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.profile-card, .p-card, .gallery-item, .picbook-item, .letter-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// 갤러리 라이트박스
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item img, .picbook-item img');
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92);
    z-index:1000; align-items:center; justify-content:center; cursor:pointer;
  `;
  const img = document.createElement('img');
  img.style.cssText = `max-width:90vw; max-height:90vh; border-radius:12px; object-fit:contain;`;
  overlay.appendChild(img);
  document.body.appendChild(overlay);
  items.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => { img.src = item.src; overlay.style.display = 'flex'; });
  });
  overlay.addEventListener('click', () => { overlay.style.display = 'none'; });
}

// CSS 페이드인
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

createStars();
initScrollAnimation();
initLightbox();

// 갤러리 동영상 자동재생
function initVideoAutoplay() {
  const videos = document.querySelectorAll('.gallery-item video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.play().catch(() => {});
      else entry.target.pause();
    });
  }, { threshold: 0.5 });
  videos.forEach(v => observer.observe(v));
}
initVideoAutoplay();

// ── BGM ──────────────────────────────────────────────
const bgm = new Audio();
bgm.volume = 0.35;
let bgmPlaying = false;

// 기본 BGM: Title_ 2곡 반복
const defaultPlaylist = [
  { src: 'assets/bgm/Title_ Little Pudding Star.mp3',   label: '🎵 Little Pudding Star' },
  { src: 'assets/bgm/Title_ Little Pudding Star_1.mp3', label: '🎵 Little Pudding Star 2' },
];

// 전체 음악 목록 (메뉴용)
const allTracks = [
  { src: 'assets/bgm/Title_ Little Pudding Star.mp3',   label: '🎵 Little Pudding Star' },
  { src: 'assets/bgm/Title_ Little Pudding Star_1.mp3', label: '🎵 Little Pudding Star 2' },
  { src: 'assets/bgm/mommy.mp3',                        label: '🎵 Mommy' },
  { src: 'assets/bgm/편지.mp3',  label: '🎵 Farewell Overture' },
  { src: 'assets/bgm/Echoes_in_the_Linen.mp3',          label: '🎵 Echoes in the Linen' },
  { src: 'assets/bgm/My_Little_Star.mp3',               label: '🎵 My Little Star' },
  { src: 'assets/bgm/조선힙합.mp3',    label: '🎵 조선힙합' },
  { src: 'assets/bgm/bgm.mp3',                         label: '🎵 BGM' },
];

let defaultIndex = 0;
let isDefaultMode = true; // 기본 BGM 모드 여부

function playDefaultBgm() {
  isDefaultMode = true;
  bgm.src = defaultPlaylist[defaultIndex % defaultPlaylist.length].src;
  bgm.loop = false;
  bgm.play().catch(() => {});
  updateNowPlaying();
}

function startBgm() {
  defaultIndex = 0;
  bgmPlaying = true;
  bgmIcon.textContent = '🎵';
  playDefaultBgm();
}

bgm.addEventListener('ended', () => {
  if (isDefaultMode) {
    defaultIndex = (defaultIndex + 1) % defaultPlaylist.length;
    playDefaultBgm();
  }
  // 트리거 곡이 끝나면 기본 BGM으로 복귀
  else {
    isDefaultMode = true;
    defaultIndex = 0;
    playDefaultBgm();
  }
});

// 특정 트리거 곡 재생 후 기본 BGM 복귀
function playTriggerTrack(src) {
  isDefaultMode = false;
  bgm.pause();
  bgm.src = src;
  bgm.loop = false;
  bgm.play().catch(() => {});
  bgmPlaying = true;
  bgmIcon.textContent = '🎵';
  updateNowPlaying();
}

// 현재 재생 중 표시 업데이트
function updateNowPlaying() {
  const el = document.getElementById('nowPlaying');
  if (!el) return;
  const match = allTracks.find(t => bgm.src.endsWith(encodeURIComponent(t.src.split('/').pop())) ||
    bgm.src.includes(t.src.split('/').pop().replace(/ /g, '%20')));
  el.textContent = match ? match.label : '';
}

// BGM 토글 버튼
const bgmBtn = document.getElementById('bgmBtn');
const bgmIcon = document.getElementById('bgmIcon');

bgmBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgmPlaying) {
    bgm.pause();
    bgmIcon.textContent = '🔇';
  } else {
    bgm.play().catch(() => {});
    bgmIcon.textContent = '🎵';
  }
  bgmPlaying = !bgmPlaying;
});

// ── 인사 영상 ─────────────────────────────────────────
const insaVideo = document.getElementById('insaVideo');
const insaPlayBtn = document.getElementById('insaPlayBtn');

if (insaPlayBtn && insaVideo) {
  insaPlayBtn.addEventListener('click', () => {
    insaPlayBtn.style.display = 'none';
    insaVideo.play();
    const wrap = document.getElementById('insaWrap');
    wrap.classList.add('playing');
    wrap.classList.remove('pop');
    void wrap.offsetWidth;
    wrap.classList.add('pop');
    wrap.addEventListener('animationend', () => wrap.classList.remove('pop'), { once: true });
  });

  insaVideo.addEventListener('ended', () => {
    insaPlayBtn.style.display = 'flex';
    const wrap = document.getElementById('insaWrap');
    wrap.classList.remove('playing');
    startBgm();
    // 영상 끝나면 천천히 자동 스크롤
    const startY = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const startTime = performance.now();
    function smoothScroll(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ((totalHeight - startY) * 20), 1);
      const ease = -(Math.cos(Math.PI * progress) - 1) / 2;
      window.scrollTo(0, startY + (totalHeight - startY) * ease);
      if (progress < 1) requestAnimationFrame(smoothScroll);
    }
    requestAnimationFrame(smoothScroll);
  });
}

// ── 플로팅 메뉴 ───────────────────────────────────────
const floatMenuPanel = document.getElementById('floatMenuPanel');

// 메뉴 아이템 클릭
document.querySelectorAll('.float-menu-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.section;
    const track   = btn.dataset.track;

    // 바로가기: 섹션으로 스크롤
    if (section) {
      const el = document.querySelector(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    // 트리거 곡 재생
    if (track) {
      playTriggerTrack(track);
    }

    // 활성 표시
    document.querySelectorAll('.float-menu-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 현재 재생 곡 표시 갱신
bgm.addEventListener('play', updateNowPlaying);
