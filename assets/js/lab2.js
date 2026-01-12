/* =========================================================
   WL-Datamining Lab 2 JS - Van Gogh Sunflowers Edition
   - Van Gogh Brushstroke Canvas Animation
   - Floating particle system
   - Loader with percentage
   - Advanced cursor + ripple
   - Background crossfade + dreamy scroll
   - Reveal animations
   - Rope timeline tracker
   - PDF modal
   - Tilt.js integration
   - GSAP scroll animations
========================================================= */

(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  // Detect touch device
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)")?.matches;

  if (isTouch) document.body.classList.add("is-touch");


  /* ========== LOADER WITH PERCENTAGE ========== */
  const loader = $("#loader");
  const loaderCounter = $("#loaderCounter");
  
  if (loader && loaderCounter) {
    let progress = 0;
    const duration = 2000;
    const startTime = Date.now();

    const updateLoader = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min((elapsed / duration) * 100, 100);
      loaderCounter.textContent = Math.floor(progress) + "%";

      if (progress < 100) {
        requestAnimationFrame(updateLoader);
      } else {
        setTimeout(() => {
          loader.classList.add("is-hidden");
          document.body.classList.remove("loading");
        }, 300);
      }
    };

    window.addEventListener("load", () => {
      requestAnimationFrame(updateLoader);
    });
  }


  /* ========== VAN GOGH BRUSHSTROKE CANVAS ANIMATION ========== */
  const wheatCanvas = $("#wheatCanvas");
  
  if (wheatCanvas) {
    const ctx = wheatCanvas.getContext("2d");
    let width = (wheatCanvas.width = window.innerWidth);
    let height = (wheatCanvas.height = window.innerHeight);

    // Van Gogh Brushstroke particles with swirling motion
    class Brushstroke {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.length = Math.random() * 60 + 40;
        this.width = Math.random() * 4 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.swirl = (Math.random() - 0.5) * 0.03; // Van Gogh swirl effect
        this.speed = Math.random() * 0.5 + 0.3;
        this.opacity = Math.random() * 0.5 + 0.3;
        
        // Golden wheat colors (Van Gogh palette)
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          // Sunflower yellow
          this.color = `rgba(${242 + Math.random() * 10}, ${193 + Math.random() * 20}, ${78 + Math.random() * 20}, ${this.opacity})`;
        } else if (colorChoice < 0.7) {
          // Wheat gold
          this.color = `rgba(${230 + Math.random() * 15}, ${190 + Math.random() * 15}, ${138 + Math.random() * 15}, ${this.opacity})`;
        } else {
          // Harvest orange
          this.color = `rgba(${217 + Math.random() * 10}, ${119 + Math.random() * 10}, ${6 + Math.random() * 10}, ${this.opacity})`;
        }
      }

      update() {
        this.angle += this.swirl; // Swirling motion
        this.y -= this.speed; // Float upward
        
        // Horizontal drift (wind effect)
        this.x += Math.sin(this.angle) * 0.5;
        
        // Reset if out of bounds
        if (this.y < -100) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw curved brushstroke (impasto technique)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        // Quadratic curve for Van Gogh style
        const controlX = this.length * 0.5;
        const controlY = Math.sin(this.angle * 2) * 15;
        
        ctx.quadraticCurveTo(
          controlX,
          controlY,
          this.length,
          Math.sin(this.angle) * 10
        );
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Add highlight (impasto texture)
        ctx.beginPath();
        ctx.moveTo(this.length * 0.3, -this.width * 0.5);
        ctx.lineTo(this.length * 0.7, -this.width * 0.5);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.3})`;
        ctx.lineWidth = this.width * 0.3;
        ctx.stroke();
        
        ctx.restore();
      }
    }

    // Create brushstrokes
    const brushstrokes = [];
    const brushstrokeCount = 60;
    for (let i = 0; i < brushstrokeCount; i++) {
      brushstrokes.push(new Brushstroke());
    }

    // Background gradient (warm earth tones)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(26, 20, 16, 0.05)");
    gradient.addColorStop(1, "rgba(44, 24, 16, 0.10)");

    // Animation loop
    const animateBrushstrokes = () => {
      // Fade effect instead of clear
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      brushstrokes.forEach((stroke) => {
        stroke.update();
        stroke.draw();
      });

      requestAnimationFrame(animateBrushstrokes);
    };

    animateBrushstrokes();

    // Resize handler
    window.addEventListener("resize", () => {
      width = wheatCanvas.width = window.innerWidth;
      height = wheatCanvas.height = window.innerHeight;
      // Reset brushstrokes positions
      brushstrokes.forEach(stroke => {
        stroke.y = height + Math.random() * 100;
      });
    });
  }


  /* ========== FLOATING PARTICLES ========== */
  const particlesContainer = $("#particles");
  
  if (particlesContainer) {
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDuration = (Math.random() * 5 + 5) + "s";
      particle.style.animationDelay = Math.random() * 3 + "s";
      particlesContainer.appendChild(particle);

      setTimeout(() => particle.remove(), 10000);
    };

    // Create particles periodically
    setInterval(createParticle, 800);
    
    // Initial burst
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 300);
    }
  }


  /* ========== NAVBAR ACTIVE ========== */
  const setActiveByPath = () => {
    const path = (location.pathname.split("/").pop() || "lab2.html").toLowerCase();
    const mark = (a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      a.classList.toggle("is-active", href.endsWith(path));
    };
    $$(".nav__link").forEach(mark);
    $$(".nav__m-link").forEach(mark);
  };
  setActiveByPath();


  /* ========== MOBILE NAV TOGGLE ========== */
  const navToggle = $("#navToggle");
  const navMobile = $("#navMobile");
  
  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const hidden = navMobile.hasAttribute("hidden");
      if (hidden) navMobile.removeAttribute("hidden");
      else navMobile.setAttribute("hidden", "");
    });
    
    $$(".nav__m-link", navMobile).forEach((a) =>
      a.addEventListener("click", () => navMobile.setAttribute("hidden", ""))
    );
  }


  /* ========== SMOOTH SCROLL ========== */
  const NAV_OFFSET = 84;
  const scrollToEl = (el) => {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollToEl(el);
    });
  });


  /* ========== REVEAL ON SCROLL ========== */
  const reveals = $$(".reveal");
  
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("is-in");
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  }


  /* ========== COUNTER ANIMATION ========== */
  const counters = $$(".counter");
  
  if (counters.length) {
    const animateCounter = (counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000;
      const start = 0;
      const startTime = Date.now();

      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        const current = Math.floor(start + (target - start) * eased);

        counter.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = "true";
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }


  /* ========== BACKGROUND CROSSFADE ========== */
  const bgA = $(".bg-a");
  const bgB = $(".bg-b");
  let front = bgA;
  let back = bgB;
  let currentBg = "";

  const setBg = (url) => {
    if (!front || !back || !url || url === currentBg) return;
    currentBg = url;

    back.style.backgroundImage = `url("${url}")`;
    back.classList.add("is-on");
    front.classList.remove("is-on");

    [front, back] = [back, front];
  };

  // Initialize first background
  const firstBg = $("[data-bg]");
  if (firstBg) setBg(firstBg.getAttribute("data-bg"));

  const bgTargets = $$("[data-bg]");
  if (bgTargets.length) {
    const bgIO = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          if (!best || ent.intersectionRatio > best.intersectionRatio) best = ent;
        }
        if (best) setBg(best.target.getAttribute("data-bg"));
      },
      { threshold: [0.25, 0.45, 0.65] }
    );
    bgTargets.forEach((el) => bgIO.observe(el));
  }


  /* ========== DREAMY BACKGROUND SCROLL EFFECT (ENHANCED) ========== */
  const applyBgVars = (vars) => {
    if (bgA) for (const k in vars) bgA.style.setProperty(k, vars[k]);
    if (bgB) for (const k in vars) bgB.style.setProperty(k, vars[k]);
  };

  (() => {
    const START = 40;
    const END = 1400;

    const MAX_BLUR = 6;
    const MIN_BRIGHTNESS = 0.40;
    const MAX_BRIGHTNESS = 0.65;
    const BASE_SAT = 1.45;
    const SAT_BOOST = 0.15;
    const BASE_SCALE = 1.00;
    const SCALE_BOOST = 0.15;
    const MAX_HUE = 10; // Hue rotation for golden glow

    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const t = clamp((y - START) / (END - START), 0, 1);
      const e = easeInOutCubic(t);

      const blur = e * MAX_BLUR;
      const brightness = MIN_BRIGHTNESS + e * (MAX_BRIGHTNESS - MIN_BRIGHTNESS);
      const sat = BASE_SAT + e * SAT_BOOST;
      const scale = BASE_SCALE + e * SCALE_BOOST;
      const hue = e * MAX_HUE;

      applyBgVars({
        "--bg-blur": `${blur.toFixed(2)}px`,
        "--bg-brightness": `${brightness.toFixed(3)}`,
        "--bg-sat": `${sat.toFixed(3)}`,
        "--bg-scale": `${scale.toFixed(3)}`,
        "--bg-hue": `${hue.toFixed(0)}deg`,
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();


  /* ========== CUSTOM CURSOR (DESKTOP) ========== */
  const cursor = $("#cursor");
  const ring = $("#cursorRing");
  const glow = $("#cursorGlow");

  if (!isTouch && cursor && ring && glow) {
    let cx = innerWidth / 2;
    let cy = innerHeight / 2;
    let rx = cx;
    let ry = cy;
    let gx = cx;
    let gy = cy;

    window.addEventListener(
      "mousemove",
      (e) => {
        cx = e.clientX;
        cy = e.clientY;
        cursor.style.left = cx + "px";
        cursor.style.top = cy + "px";
      },
      { passive: true }
    );

    const tick = () => {
      rx = lerp(rx, cx, 0.22);
      ry = lerp(ry, cy, 0.22);
      gx = lerp(gx, cx, 0.10);
      gy = lerp(gy, cy, 0.10);

      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Hover effects
    const hoverables = $$("a, button, .panel__media, .panel__content, .icon-btn, .strat-node, .overview-card, .story-card, .bcg-card, .problem-card, .conclusion-card");
    for (const el of hoverables) {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "42px";
        ring.style.height = "42px";
        ring.style.borderColor = "rgba(242, 193, 78, .65)";
        ring.style.opacity = "1";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "34px";
        ring.style.height = "34px";
        ring.style.borderColor = "rgba(242, 193, 78, .48)";
        ring.style.opacity = ".96";
      });
    }
  }


  /* ========== RIPPLE CLICK EFFECT ========== */
  window.addEventListener("click", (e) => {
    if (e.target.closest?.(".modal__actions")) return;
    if (e.target.closest?.(".modal__panel")) return;

    const r = document.createElement("div");
    r.className = "ripple";
    r.style.left = e.clientX + "px";
    r.style.top = e.clientY + "px";
    r.style.background = "radial-gradient(circle, rgba(242, 193, 78, .34), rgba(217, 119, 6, .24), rgba(242, 193, 78, .18), transparent 68%)";
    r.style.boxShadow = "0 0 0 2px rgba(242, 193, 78, .10), 0 0 36px rgba(242, 193, 78, .20), 0 0 44px rgba(217, 119, 6, .18)";
    document.body.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  });

  // Add ripple animation if not exists
  if (!document.querySelector('style[data-ripple]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ripple', '');
    style.textContent = `
      .ripple {
        position: fixed;
        border-radius: 999px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple .62s ease-out forwards;
        z-index: 99996;
      }
      @keyframes ripple {
        from { width: 0; height: 0; opacity: .95; }
        to { width: 660px; height: 660px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }


  /* ========== ROPE TIMELINE TRACKER ========== */
  const panels = $$(".panel");
  const ropeDots = $("#ropeDots");
  let dots = [];

  if (ropeDots && panels.length) {
    ropeDots.innerHTML = "";
    dots = panels.map(() => {
      const d = document.createElement("div");
      d.className = "rope__dot";
      ropeDots.appendChild(d);
      return d;
    });

    let ticking = false;
    let currentIndex = 0;

    const updateRope = () => {
      ticking = false;
      
      const scrollY = window.scrollY + window.innerHeight / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;

      panels.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        const panelCenter = rect.top + window.scrollY + rect.height / 2;
        const distance = Math.abs(scrollY - panelCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });

      if (closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        dots.forEach((d, i) => {
          d.classList.toggle("is-active", i === currentIndex);
        });
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateRope);
    };

    updateRope();
    window.addEventListener("scroll", onScroll, { passive: true });
  }


  /* ========== PDF MODAL ========== */
  const modal = $("#pdfModal");
  const backdrop = modal ? $(".modal__backdrop", modal) : null;
  const frame = $("#pdfFrame");
  const titleEl = $("#pdfTitle");
  const btnOpenNew = $("#pdfOpenNew");
  const btnRepo = $("#repoOpen");
  const btnClose = $("#pdfClose");

  let currentPdf = "";
  let currentRepo = "";

  const escapeHtml = (str) =>
    String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const renderError = (t, m) => `
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body{
            margin:0;
            font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial;
            background:#2C1810;
            color:rgba(255,255,255,.92);
            display:flex; align-items:center; justify-content:center;
            height:100vh;
          }
          .box{
            width:min(760px, calc(100% - 32px));
            padding:18px;
            border-radius:16px;
            border:1px solid rgba(242, 193, 78, .16);
            background:rgba(242, 193, 78, .10);
          }
          h2{ margin:0 0 10px; font-size:18px; }
          p{ margin:0; line-height:1.6; color:rgba(255,255,255,.75); }
          code{
            display:inline-block; margin-top:10px;
            padding:6px 10px;
            border-radius:10px;
            background:rgba(242, 193, 78, .12);
            border:1px solid rgba(242, 193, 78, .20);
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
    currentRepo = repoUrl || "";
    if (currentRepo) {
      btnRepo.style.display = "inline-flex";
      btnRepo.href = currentRepo;
    } else {
      btnRepo.style.display = "none";
      btnRepo.href = "#";
    }
  };

  const openModal = async ({ pdf, title, repo }) => {
    if (!modal || !frame) return;

    currentPdf = pdf || "";
    if (titleEl) titleEl.textContent = title || "PDF Viewer";
    if (btnOpenNew) btnOpenNew.href = currentPdf || "#";
    setRepoButton(repo || "");

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    if (!currentPdf) {
      frame.srcdoc = renderError("Không có đường dẫn PDF", "Bạn chưa gán đường dẫn PDF.");
      return;
    }

    try {
      const res = await fetch(currentPdf, { method: "GET" });
      if (!res.ok) {
        frame.srcdoc = renderError(
          "Không tìm thấy PDF",
          `Cannot GET ${currentPdf}. Hãy kiểm tra: folder/tên file có đúng không?`
        );
        return;
      }
      frame.removeAttribute("srcdoc");
      frame.src = currentPdf;
    } catch {
      frame.removeAttribute("srcdoc");
      frame.src = currentPdf;
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    currentPdf = "";
    currentRepo = "";
    if (frame) {
      frame.src = "about:blank";
      frame.removeAttribute("srcdoc");
    }
    if (btnOpenNew) btnOpenNew.href = "#";
    setRepoButton("");
  };

  if (modal) {
    if (backdrop) backdrop.addEventListener("click", closeModal);
    if (btnClose)
      btnClose.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  // Hero buttons -> open Lab2 PDF
  const openLabPdf = $("#openLabPdf");
  const openLabPdf2 = $("#openLabPdf2");
  
  const pdfConfig = {
    pdf: "pdf/blog2.pdf",
    title: "Lab 2 • Market Basket Analysis - High-Utility Mining",
    repo: "https://github.com/VINH1811/shopping_cart_advanced_analysis",
  };

  if (openLabPdf) openLabPdf.addEventListener("click", () => openModal(pdfConfig));
  if (openLabPdf2) openLabPdf2.addEventListener("click", () => openModal(pdfConfig));


  /* ========== TILT.JS INTEGRATION ========== */
  if (typeof VanillaTilt !== 'undefined') {
    const tiltCards = $$(".tilt-card");
    if (tiltCards.length) {
      VanillaTilt.init(tiltCards, {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        gyroscope: false
      });
    }
  }


  /* ========== GSAP SCROLL ANIMATIONS (Lab 2 Style) ========== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal from left
    gsap.utils.toArray('.gs-reveal-left').forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        x: -100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      });
    });

    // Reveal from right
    gsap.utils.toArray('.gs-reveal-right').forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        x: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      });
    });

    // Reveal from bottom
    gsap.utils.toArray('.gs-reveal-up').forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: elem.dataset.delay || 0
      });
    });
  }


  /* ========== TO TOP ========== */
  const toTop = $("#toTop");
  if (toTop)
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));


  /* ========== YEAR ========== */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
/* ========== IMAGE EXPAND MODAL (MỚI THÊM) ========== */
const expandModal = $("#expandModal");
const expandBackdrop = expandModal ? $(".modal2__backdrop", expandModal) : null;
const expandClose = $("#expandClose");
const expandTitle = $("#expandTitle");
const expandImg = $("#expandImg");

const openExpand = (img) => {
  if (!expandModal || !expandImg || !img) return;

  const title = img.getAttribute("alt") || "Detail View";
  if (expandTitle) expandTitle.textContent = title;
  
  expandImg.src = img.getAttribute("src") || "";
  expandImg.alt = title;

  expandModal.classList.add("is-open");
  expandModal.style.display = "block";
  document.body.style.overflow = "hidden";
};

const closeExpand = () => {
  if (!expandModal) return;
  expandModal.classList.remove("is-open");
  expandModal.style.display = "none";
  document.body.style.overflow = "";
  if (expandImg) expandImg.src = "";
};

// Bind click events to all .js-expand images
$$(".js-expand").forEach((img) => {
  img.addEventListener("click", () => openExpand(img));
  img.style.cursor = "pointer";
});

if (expandBackdrop) expandBackdrop.addEventListener("click", closeExpand);
if (expandClose) expandClose.addEventListener("click", closeExpand);

// ESC key to close
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && expandModal?.classList.contains("is-open")) {
    closeExpand();
  }
});


/* ========== SMOOTH SCROLL ENHANCEMENT ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    const offset = 84; // navbar height
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});


/* ========== LAZY LOADING IMAGES ========== */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });

  $$('img[data-src]').forEach(img => imageObserver.observe(img));
}


/* ========== ENHANCED COUNTER ANIMATION ========== */
const animateValue = (element, start, end, duration) => {
  const startTime = Date.now();
  const step = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    const current = Math.floor(start + (end - start) * eased);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end.toLocaleString();
    }
  };
  step();
};


/* ========== INTERSECTION OBSERVER ENHANCEMENTS ========== */
const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      // Unobserve after revealing (better performance)
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOptions);

$$('.reveal').forEach(el => revealObserver.observe(el));


/* ========== TILT.JS AUTO-INIT ========== */
if (typeof VanillaTilt !== 'undefined') {
  const initTilt = () => {
    const tiltElements = $$('.tilt-card');
    if (tiltElements.length) {
      VanillaTilt.init(tiltElements, {
        max: 6,
        speed: 600,
        glare: true,
        'max-glare': 0.15,
        scale: 1.02,
        gyroscope: false
      });
    }
  };
  
  // Init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
}


/* ========== PERFORMANCE OPTIMIZATION ========== */
// Passive event listeners for better scroll performance
const passiveSupported = (() => {
  let passive = false;
  try {
    const options = {
      get passive() {
        passive = true;
        return false;
      }
    };
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (err) {
    passive = false;
  }
  return passive;
})();

const passiveOptions = passiveSupported ? { passive: true } : false;


/* ========== DEBOUNCE UTILITY ========== */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Apply debounce to resize events
window.addEventListener('resize', debounce(() => {
  // Trigger any resize-dependent updates here
  console.log('Window resized');
}, 250));


/* ========== CONSOLE ART (VAN GOGH EASTER EGG) ========== */
console.log('%c🌻 Welcome to Lab 2: Market Basket Analysis', 
  'color: #F2C14E; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(242, 193, 78, 0.3);');
console.log('%cInspired by Vincent van Gogh\'s "Sunflowers"', 
  'color: #E6BE8A; font-size: 14px; font-style: italic;');
console.log('%cBuilt with ❤️ by WL-Datamining Team', 
  'color: #D97706; font-size: 12px;');
