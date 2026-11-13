// Figure lightbox
(() => {
  const box = document.getElementById('lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  const big = box.querySelector('img');
  document.querySelectorAll('.zoom').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      box.showModal();
    });
  });
  // click on the backdrop closes
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
})();

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// YouTube movie: click-to-play facade (nothing loads from YouTube until the visitor presses play)
(() => {
  const fig = document.getElementById('movie');
  const id = fig && fig.dataset.yt.trim();
  if (!id) return;                       // no video ID yet: keep the block hidden
  fig.hidden = false;
  fig.querySelector('.yt-link').href = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
  const btn = fig.querySelector('.video-play');
  btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
    f.title = 'Voltage imaging of CA1 dendrites through a hippocampal prism';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allowFullscreen = true;
    btn.replaceWith(f);
  }, { once: true });
})();

// Mobile tab bar: bring the current tab into view
(() => {
  const tabs = document.querySelector('.tabs');
  const cur = tabs && tabs.querySelector('[aria-current="page"]');
  if (!cur || tabs.scrollWidth <= tabs.clientWidth) return;
  const offset = cur.getBoundingClientRect().left - tabs.getBoundingClientRect().left;
  tabs.scrollLeft += offset - (tabs.clientWidth - cur.offsetWidth) / 2;
})();

// Looping videos: play only while on screen; no autoplay for reduced-motion users
(() => {
  const vids = [...document.querySelectorAll('video.loop-video')];
  if (!vids.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    vids.forEach((v) => { if (reduce) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; } });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.2 });
  vids.forEach((v) => io.observe(v));
})();

// Videos marked speed-2x play at double speed
(() => {
  document.querySelectorAll('video.speed-2x').forEach((v) => {
    const set = () => { v.playbackRate = 2; };
    set();
    v.addEventListener('loadedmetadata', set);
    v.addEventListener('play', set);
  });
})();
