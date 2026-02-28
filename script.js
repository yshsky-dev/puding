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
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --duration: ${duration}s;
      --max-opacity: ${opacity};
      animation-delay: ${delay}s;
    `;

    container.appendChild(star);
  }
}

// 스크롤 페이드인
function initScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
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
    item.addEventListener('click', () => {
      img.src = item.src;
      overlay.style.display = 'flex';
    });
  });

  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
}

// CSS 페이드인 추가
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

createStars();
initScrollAnimation();
initLightbox();

// 갤러리 동영상 화면 진입 시 자동재생
function initVideoAutoplay() {
  const videos = document.querySelectorAll('.gallery-item video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 });

  videos.forEach(v => observer.observe(v));
}
initVideoAutoplay();

// 배경음악
const bgmBtn = document.getElementById('bgmBtn');
const bgmIcon = document.getElementById('bgmIcon');
let bgmPlaying = false;

const bgmPlaylist = [
  'assets/bgm/Echoes_in_the_Linen.mp3',
  'assets/bgm/My_Little_Star.mp3',
];
const bgmLoop = 'assets/bgm/bgm2.mp3';

const bgm = new Audio();
bgm.volume = 0.35;
let bgmIndex = 0;

function playNext() {
  if (bgmIndex < bgmPlaylist.length) {
    bgm.src = bgmPlaylist[bgmIndex++];
    bgm.loop = false;
    bgm.play().catch(() => {});
  } else {
    bgm.src = bgmLoop;
    bgm.loop = true;
    bgm.play().catch(() => {});
  }
}

bgm.addEventListener('ended', () => {
  if (!bgm.loop) playNext();
});

function startBgm() {
  bgmIndex = 0;
  playNext();
  bgmPlaying = true;
  bgmIcon.textContent = '🎵';
}

// 수동 토글
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
const insaVideo = document.getElementById('insaVideo');
const insaPlayBtn = document.getElementById('insaPlayBtn');

if (insaPlayBtn && insaVideo) {
  insaPlayBtn.addEventListener('click', () => {
    insaPlayBtn.style.display = 'none';
    insaVideo.play();
    // 클릭 시 pop 애니메이션
    const wrap = document.getElementById('insaWrap');
    wrap.classList.remove('pop');
    void wrap.offsetWidth; // reflow
    wrap.classList.add('pop');
    wrap.addEventListener('animationend', () => wrap.classList.remove('pop'), { once: true });
  });

  insaVideo.addEventListener('ended', () => {
    insaPlayBtn.style.display = 'flex';
    startBgm();

    // 멈출 구간: 인터뷰 섹션, 편지 섹션
    const pauseConfig = [
      { sel: '.interview-section', duration: 27000 },
      { sel: '.letter-section',    duration: 20000 },
    ];
    let pausePoints = [];
    let pausedSet = new Set();
    let isPaused = false;
    let rafId = null;

    function buildPausePoints() {
      pausePoints = pauseConfig.map(({ sel, duration }) => {
        const el = document.querySelector(sel);
        return el ? { y: el.getBoundingClientRect().top + window.scrollY, sel, duration } : null;
      }).filter(Boolean);
    }
    buildPausePoints();

    function resumeScroll(fromY) {
      isPaused = false;
      const startTime = performance.now();
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const remaining = totalHeight - fromY;

      function step(now) {
        if (isPaused) return;
        const elapsed = now - startTime;
        const duration = Math.max(remaining * 20, 3000);
        const progress = Math.min(elapsed / duration, 1);
        const ease = -(Math.cos(Math.PI * progress) - 1) / 2;
        const nextY = fromY + remaining * ease;
        window.scrollTo(0, nextY);
        if (checkPause(nextY)) return;
        if (progress < 1) rafId = requestAnimationFrame(step);
      }
      rafId = requestAnimationFrame(step);
    }

    function checkPause(currentY) {
      for (const point of pausePoints) {
        // 섹션 상단이 화면 상단에 닿을 때 멈춤 (scrollY >= 섹션 top)
        if (!pausedSet.has(point.y) && currentY >= point.y - 10) {
          pausedSet.add(point.y);
          isPaused = true;
          cancelAnimationFrame(rafId);
          // 인터뷰 섹션 진입 시 음악 교체
          if (point.sel === '.interview-section') {
            bgm.src = 'assets/bgm/mommy.mp3';
            bgm.loop = false;
            bgm.play().catch(() => {});
          }
          // 편지 섹션 진입 시 음악 교체
          if (point.sel === '.letter-section') {
            bgm.src = 'assets/bgm/Hamster_s_Farewell_Overture.mp3';
            bgm.loop = false;
            bgm.play().catch(() => {});
          }
          const waitDuration = point.duration;
          setTimeout(() => resumeScroll(window.scrollY), waitDuration);
          return true;
        }
      }
      return false;
    }

    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const startY = window.scrollY;
    const startTime = performance.now();

    function smoothScroll(now) {
      if (isPaused) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ((totalHeight - startY) * 20), 1);
      const ease = -(Math.cos(Math.PI * progress) - 1) / 2;
      const nextY = startY + (totalHeight - startY) * ease;
      window.scrollTo(0, nextY);
      if (checkPause(nextY)) return;
      if (progress < 1) {
        rafId = requestAnimationFrame(smoothScroll);
      }
    }
    rafId = requestAnimationFrame(smoothScroll);
  });
}
