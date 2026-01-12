/* =========================================================
   WL-DATAMINING HOME JS
   Premium Effects + Performance Optimized
   ✅ FIXED: Modal cursor visibility, responsive height
   ========================================================= */

(() => {
  'use strict';

  /* =========================================================
     UTILITY FUNCTIONS
     ========================================================= */
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const lerp = (a, b, t) => a + (b - a) * t;

  const isTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.('(pointer: coarse)')?.matches;

  if (isTouch) document.body.classList.add('is-touch');

  /* =========================================================
     PAGE TRANSITION
     ========================================================= */
  const transition = $('#pageTransition');
  if (transition) {
    window.addEventListener('load', () => {
      transition.classList.add('is-hidden');
    });
  }

  /* =========================================================
     YEAR AUTO-UPDATE
     ========================================================= */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     NAV: ACTIVE BY PATHNAME
     ========================================================= */
  const setActiveByPath = () => {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const mark = (a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      a.classList.toggle('is-active', href.endsWith(path));
    };
    $$('.nav__link').forEach(mark);
    $$('.nav__m-link').forEach(mark);
  };
  setActiveByPath();

  /* =========================================================
     MOBILE NAV TOGGLE
     ========================================================= */
  const navToggle = $('#navToggle');
  const navMobile = $('#navMobile');
  
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const hidden = navMobile.hasAttribute('hidden');
      if (hidden) {
        navMobile.removeAttribute('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
      } else {
        navMobile.setAttribute('hidden', '');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    $$('.nav__m-link', navMobile).forEach((a) => {
      a.addEventListener('click', () => {
        navMobile.setAttribute('hidden', '');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     SMOOTH SCROLL WITH OFFSET
     ========================================================= */
  const NAV_OFFSET = 84;
  const scrollToEl = (el) => {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const openSlidesBtn = $('#openSlidesBtn');
  const slidesSection = $('#slides');
  if (openSlidesBtn && slidesSection) {
    openSlidesBtn.addEventListener('click', () => scrollToEl(slidesSection));
  }

  /* =========================================================
     REVEAL ON SCROLL
     ========================================================= */
  const reveals = $$('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const ent of entries) {
          if (ent.isIntersecting) {
            ent.target.classList.add('is-in');
            io.unobserve(ent.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* =========================================================
     VIDEO TOGGLE ON SCROLL DIRECTION CHANGE
     ========================================================= */
 /* =========================================================
   VIDEO TOGGLE ON SCROLL DIRECTION CHANGE - DEBUG VERSION
   ========================================================= */
/* =========================================================
   VIDEO TOGGLE ON SCROLL UP
   ========================================================= */
/* =========================================================
   VIDEO TOGGLE ON SCROLL UP - BULLETPROOF VERSION
   ========================================================= */
/* =========================================================
   VIDEO TOGGLE ON SCROLL UP - OPTIMIZED
   ========================================================= */
/* =========================================================
   VIDEO TOGGLE ON SCROLL UP/DOWN - TWO WAY
   ========================================================= */
/* =========================================================
   VIDEO TOGGLE - SCROLL UP = VIDEO 2, SCROLL DOWN = VIDEO 1
   ========================================================= */
/* =========================================================
   VIDEO TOGGLE - ONLY ON SCROLL UP (BIDIRECTIONAL)
   ========================================================= */
/* =========================================================
   VIDEO TOGGLE - INSTANT ON ANY SCROLL UP
   ========================================================= */
const videoA = document.querySelector('.bg-video-a');
const videoB = document.querySelector('.bg-video-b');

if (videoA && videoB) {
  let lastScrollY = window.scrollY;
  let currentVideo = 'A'; // 'A' = Video 1, 'B' = Video 2

  console.log('✅ Video Toggle (instant on scroll up) initialized');

  // Force play videos
  const playVideos = () => {
    videoA.play().catch(() => {});
    videoB.play().catch(() => {});
  };
  playVideos();
  document.addEventListener('click', playVideos, { once: true });

  const handleScroll = () => {
    const y = window.scrollY;
    const delta = y - lastScrollY;
    const indicator = document.getElementById('videoStatus');

    // Chỉ quan tâm hướng CUỘN LÊN (delta < 0)
    if (delta < 0) {
      // Toggle A ↔ B mỗi lần bắt đầu cuộn lên
      if (currentVideo === 'A') {
        // A -> B
        videoA.classList.remove('is-on');
        videoB.classList.add('is-on');
        currentVideo = 'B';
        console.log('⬆️ Scroll up → switch to Video 2');

        if (indicator) {
          indicator.innerHTML = '<span style="font-size:20px;">🎬</span><span>Video 2</span>';
          indicator.style.background = 'linear-gradient(135deg, rgba(242,193,78,.95), rgba(242,193,78,.85))';
        }
      } else {
        // B -> A
        videoB.classList.remove('is-on');
        videoA.classList.add('is-on');
        currentVideo = 'A';
        console.log('⬆️ Scroll up → switch to Video 1');

        if (indicator) {
          indicator.innerHTML = '<span style="font-size:20px;">📹</span><span>Video 1</span>';
          indicator.style.background = 'linear-gradient(135deg, rgba(39,164,242,.95), rgba(39,164,242,.85))';
        }
      }
    }

    lastScrollY = y;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}


  /* =========================================================
     DREAMY BACKGROUND EFFECT ON SCROLL
     ========================================================= */
  const videoStage = $('.bg-video-stage');

  const applyBgVars = (vars) => {
    if (videoA) for (const k in vars) videoA.style.setProperty(k, vars[k]);
    if (videoB) for (const k in vars) videoB.style.setProperty(k, vars[k]);
    if (videoStage) for (const k in vars) videoStage.style.setProperty(k, vars[k]);
  };

  const scrollFX = (() => {
    const START = 40;
    const END = 1100;

    const MAX_BLUR = 16;
    const MIN_DIM = 1.00;
    const MAX_DIM_DROP = 0.16;
    const BASE_SAT = 1.525;
    const SAT_BOOST = 0.18;
    const BASE_SCALE = 1.02;
    const SCALE_BOOST = 0.05;

    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const t = clamp((y - START) / (END - START), 0, 1);
      const e = easeInOutCubic(t);

      const blur = e * MAX_BLUR;
      const dim = MIN_DIM - e * MAX_DIM_DROP;
      const sat = BASE_SAT + e * SAT_BOOST;
      const scale = BASE_SCALE + e * SCALE_BOOST;

      applyBgVars({
        '--bg-blur': `${blur.toFixed(2)}px`,
        '--bg-dim': `${dim.toFixed(3)}`,
        '--bg-sat': `${sat.toFixed(3)}`,
        '--bg-scale': `${scale.toFixed(3)}`
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* =========================================================
     CUSTOM CURSOR (DESKTOP ONLY)
     ========================================================= */
  const cursor = $('#cursor');
  const ring = $('#cursorRing');
  const glow = $('#cursorGlow');

  if (!isTouch && cursor && ring && glow) {
    let cx = innerWidth / 2, cy = innerHeight / 2;
    let rx = cx, ry = cy;
    let gx = cx, gy = cy;
    let isMoving = false;
    let moveTimeout;

    window.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';

      if (!isMoving) {
        isMoving = true;
        tick();
      }

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    }, { passive: true });

    const tick = () => {
      if (!isMoving && Math.abs(rx - cx) < 0.5 && Math.abs(ry - cy) < 0.5) {
        return;
      }

      rx = lerp(rx, cx, 0.22);
      ry = lerp(ry, cy, 0.22);
      gx = lerp(gx, cx, 0.10);
      gy = lerp(gy, cy, 0.10);

      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';

      if (isMoving || Math.abs(rx - cx) > 0.5 || Math.abs(ry - cy) > 0.5) {
        requestAnimationFrame(tick);
      }
    };

    // Hover effects
    const hoverables = $$('a, button, .blog-card, .slide-row, .to-top, .icon-btn, .stat--float');
    for (const el of hoverables) {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '42px';
        ring.style.height = '42px';
        ring.style.borderColor = 'rgba(242,193,78,.55)';
        ring.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '34px';
        ring.style.height = '34px';
        ring.style.borderColor = 'rgba(39,164,242,.58)';
        ring.style.opacity = '.96';
      });
    }
  }

  /* =========================================================
     RIPPLE CLICK EFFECT
     ========================================================= */
  window.addEventListener('click', (e) => {
    if (e.target.closest?.('.modal__actions')) return;

    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });

  /* =========================================================
     COUNTER ANIMATION
     ========================================================= */
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target') || 0);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    update();
  };

  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  $$('.counter').forEach((el) => counterIO.observe(el));

  /* =========================================================
     3D TILT EFFECT FOR STATS
     ========================================================= */
  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `
        translateY(-12px) 
        scale(1.05)
        perspective(1000px)
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* =========================================================
     PARTICLES ANIMATION (HERO)
     ========================================================= */
  const heroParticles = $('#heroParticles');
  if (heroParticles) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    heroParticles.appendChild(canvas);

    const resize = () => {
      canvas.width = heroParticles.offsetWidth;
      canvas.height = heroParticles.offsetHeight;
    };
    resize();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    });

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 193, 78, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(39, 164, 242, ${(1 - dist / 120) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    };

    draw();
  }

  /* =========================================================
     PDF MODAL (ROBUST) - ✅ FIXED CURSOR
     ========================================================= */
  const modal = $('#pdfModal');
  const backdrop = modal ? $('.modal__backdrop', modal) : null;
  const frame = $('#pdfFrame');
  const titleEl = $('#pdfTitle');
  const btnOpenNew = $('#pdfOpenNew');
  const btnRepo = $('#repoOpen');
  const btnClose = $('#pdfClose');
  const pdfLoading = $('#pdfLoading');

  let currentPdf = '';
  let currentRepo = '';

  const escapeHtml = (str) =>
    String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const renderError = (t, m) => `
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body{
            margin:0;
            font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial;
            background:#071b35;
            color:rgba(255,255,255,.92);
            display:flex; align-items:center; justify-content:center;
            height:100vh;
          }
          .box{
            width:min(760px, calc(100% - 32px));
            padding:18px;
            border-radius:16px;
            border:1px solid rgba(255,255,255,.14);
            background:rgba(255,255,255,.06);
          }
          h2{ margin:0 0 10px; font-size:18px; }
          p{ margin:0; line-height:1.6; color:rgba(255,255,255,.75); }
          code{
            display:inline-block; margin-top:10px;
            padding:6px 10px;
            border-radius:10px;
            background:rgba(255,255,255,.08);
            border:1px solid rgba(255,255,255,.12);
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>${escapeHtml(t)}</h2>
          <p>${escapeHtml(m)}</p>
          <code>Gợi ý: kiểm tra folder/tên file đúng chưa.</code>
        </div>
      </body>
    </html>
  `;

  const setRepoButton = (repoUrl) => {
    if (!btnRepo) return;
    currentRepo = repoUrl || '';
    if (currentRepo) {
      btnRepo.style.display = 'inline-flex';
      btnRepo.href = currentRepo;
    } else {
      btnRepo.style.display = 'none';
      btnRepo.href = '#';
    }
  };

  const openModal = async ({ pdf, title, repo }) => {
    if (!modal || !frame) return;

    currentPdf = pdf || '';
    if (titleEl) titleEl.textContent = title || 'PDF Viewer';
    if (btnOpenNew) btnOpenNew.href = currentPdf || '#';
    setRepoButton(repo || '');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // ✅ FIX 3: Hide custom cursor in modal
    document.body.style.cursor = 'auto';
    if (cursor && !isTouch) cursor.style.opacity = '0';
    if (ring && !isTouch) ring.style.opacity = '0';
    if (glow && !isTouch) glow.style.opacity = '0';

    // Show loading
    if (pdfLoading) pdfLoading.classList.remove('hidden');

    if (!currentPdf) {
      frame.srcdoc = renderError('Không có đường dẫn PDF', 'Bạn chưa gán data-pdf cho item.');
      if (pdfLoading) pdfLoading.classList.add('hidden');
      return;
    }

    try {
      const res = await fetch(currentPdf, { method: 'GET' });
      if (!res.ok) {
        frame.srcdoc = renderError(
          'Không tìm thấy PDF',
          `Cannot GET ${currentPdf}. Hãy kiểm tra: folder/tên file có đúng không?`
        );
        if (pdfLoading) pdfLoading.classList.add('hidden');
        return;
      }
      frame.removeAttribute('srcdoc');
      frame.src = currentPdf;
      
      frame.onload = () => {
        if (pdfLoading) pdfLoading.classList.add('hidden');
      };
    } catch {
      frame.removeAttribute('srcdoc');
      frame.src = currentPdf;
      
      frame.onload = () => {
        if (pdfLoading) pdfLoading.classList.add('hidden');
      };
    }

    // Focus trap
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length) focusables[0].focus();
  };

  const closeModal = () => {
    if (!modal) return;
    
    modal.classList.add('is-closing');
    
    setTimeout(() => {
      modal.classList.remove('is-open', 'is-closing');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // ✅ FIX 3: Show custom cursor again
      document.body.style.cursor = 'none';
      if (cursor && !isTouch) cursor.style.opacity = '1';
      if (ring && !isTouch) ring.style.opacity = '.96';
      if (glow && !isTouch) glow.style.opacity = '.82';

      currentPdf = '';
      currentRepo = '';

      if (frame) {
        frame.src = 'about:blank';
        frame.removeAttribute('srcdoc');
        frame.onload = null;
      }
      if (btnOpenNew) btnOpenNew.href = '#';
      setRepoButton('');
      if (pdfLoading) pdfLoading.classList.remove('hidden');
    }, 250);
  };

  if (modal) {
    if (backdrop) backdrop.addEventListener('click', closeModal);

    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    if (btnOpenNew) {
      btnOpenNew.addEventListener('click', (e) => {
        if (!currentPdf || btnOpenNew.href === '#') e.preventDefault();
        e.stopPropagation();
      });
    }

    if (btnRepo) {
      btnRepo.addEventListener('click', (e) => {
        if (!currentRepo || btnRepo.href === '#') e.preventDefault();
        e.stopPropagation();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Focus trap
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;

      const focusables = Array.from(
        modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Trigger open PDF for any element with data-pdf
  $$('[data-pdf]').forEach((el) => {
    el.addEventListener('click', () => {
      const pdf = el.getAttribute('data-pdf');
      if (!pdf) return;

      const title =
        el.getAttribute('data-title') ||
        el.getAttribute('data-name') ||
        el.querySelector('.slide-row__title')?.textContent ||
        el.querySelector('.blog-card__title')?.textContent ||
        'PDF Viewer';

      const repo = el.getAttribute('data-repo') || '';

      openModal({ pdf, title: title.trim(), repo });
    });
  });

  /* =========================================================
     TO TOP BUTTON
     ========================================================= */
  const toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* =========================================================
     PERFORMANCE MONITORING
     ========================================================= */
  if (window.performance) {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`✅ Page loaded in ${pageLoadTime}ms`);
    });
  }

  console.log('🎨 WL-Datamining initialized successfully!');
})();
