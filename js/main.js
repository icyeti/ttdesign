// T&T Design -- Interactions

// --- Scroll progress ---
(() => {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const tick = () => {
    const h = document.documentElement;
    bar.style.width = ((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) + '%';
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

// --- Sticky header state ---
(() => {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const tick = () => {
    if (window.scrollY > 80) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

// --- Mobile menu ---
(() => {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

// --- Scroll reveal ---
(() => {
  const els = document.querySelectorAll('.reveal, .image-reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
})();

// --- Hero load animation ---
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('is-loaded'), 100);
  });
})();

// --- Hero parallax ---
(() => {
  const img = document.getElementById('heroImage');
  if (!img || window.matchMedia('(hover: none)').matches) return;
  let ticking = false;
  const tick = () => {
    const y = window.scrollY;
    if (y > 1000) { ticking = false; return; }
    img.style.transform = `translateY(${y * 0.22}px) scale(1.06)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(tick); ticking = true; }
  }, { passive: true });
})();

// --- Smooth anchor scroll ---
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '#top') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// --- Stat counter (numeric only) ---
(() => {
  const nums = document.querySelectorAll('.stat-value[data-target]');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
})();
