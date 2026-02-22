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

// 배경음악
const bgm = document.getElementById('bgm');
const bgmBtn = document.getElementById('bgmBtn');
const bgmIcon = document.getElementById('bgmIcon');
let bgmPlaying = false;

function startBgm() {
  bgm.volume = 0.35;
  bgm.play().then(() => {
    bgmPlaying = true;
    bgmIcon.textContent = '🎵';
  }).catch(() => {});
}

// 첫 인터랙션 자동시작 제거 — 영상 끝난 후 bgm 시작

// 수동 토글
bgmBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgmPlaying) {
    bgm.pause();
    bgmIcon.textContent = '🔇';
  } else {
    bgm.volume = 0.35;
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
  });

  insaVideo.addEventListener('ended', () => {
    insaPlayBtn.style.display = 'flex';
    startBgm();
    // 천천히 아래로 자동 스크롤
    const startY = window.scrollY;
    const startTime = performance.now();

    function smoothScroll(now) {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const duration = (totalHeight - window.scrollY) * 6;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ((totalHeight - startY) * 10), 1);
      const ease = -(Math.cos(Math.PI * progress) - 1) / 2;
      window.scrollTo(0, startY + (totalHeight - startY) * ease);
      if (progress < 1) requestAnimationFrame(smoothScroll);
    }
    requestAnimationFrame(smoothScroll);
  });
}
