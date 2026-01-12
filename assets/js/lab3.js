/* =========================================================
   WL-Datamining Lab 3 JS - Potato Eaters Theme (FIXED)
   - Warm candlelight canvas animation
   - Floating ember particles
   - Counter animation on scroll
   - Loader with percentage
   - Advanced cursor + ripple (warm colors)
   - Background crossfade + dreamy scroll
   - Reveal animations
   - Rope timeline tracker
   - PDF + Image modals
   - FIX: Button click events
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

  /* ========== CANDLELIGHT CANVAS ANIMATION (POTATO EATERS) ========== */
  const starryCanvas = $("#starryCanvas");
  
  if (starryCanvas) {
    const ctx = starryCanvas.getContext("2d");
    let width = (starryCanvas.width = window.innerWidth);
    let height = (starryCanvas.height = window.innerHeight);

    // Warm candlelight particles
    class Ember {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.6 + 0.15;
        this.twinkleSpeed = Math.random() * 0.015 + 0.008;
        this.phase = Math.random() * Math.PI * 2;
        this.angle = Math.random() * Math.PI * 2;
        this.flickerSpeed = (Math.random() - 0.5) * 0.008;
      }

      update() {
        this.angle += this.flickerSpeed;
        const flicker = Math.sin(this.angle) * 0.3;
        
        this.x += this.speedX + flicker;
        this.y += this.speedY;

        this.phase += this.twinkleSpeed;
        this.opacity = 0.3 + Math.sin(this.phase) * 0.3;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 205, ${this.opacity})`;
        ctx.fill();

        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `rgba(212, 167, 106, ${this.opacity * 0.35})`);
        gradient.addColorStop(1, "rgba(212, 167, 106, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const embers = [];
    const emberCount = 120;
    for (let i = 0; i < emberCount; i++) {
      embers.push(new Ember());
    }

    const animateEmbers = () => {
      ctx.fillStyle = "rgba(28, 21, 16, 0.08)";
      ctx.fillRect(0, 0, width, height);

      embers.forEach((ember) => {
        ember.update();
        ember.draw();
      });

      requestAnimationFrame(animateEmbers);
    };

    animateEmbers();

    window.addEventListener("resize", () => {
      width = starryCanvas.width = window.innerWidth;
      height = starryCanvas.height = window.innerHeight;
    });
  }

  /* ========== FLOATING PARTICLES (WARM TONE) ========== */
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

    setInterval(createParticle, 900);
    
    for (let i = 0; i < 8; i++) {
      setTimeout(createParticle, i * 300);
    }
  }

  /* ========== NAVBAR ACTIVE ========== */
  const setActiveByPath = () => {
    const path = (location.pathname.split("/").pop() || "lab3.html").toLowerCase();
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

  /* ========== DREAMY BACKGROUND SCROLL EFFECT ========== */
  const applyBgVars = (vars) => {
    if (bgA) for (const k in vars) bgA.style.setProperty(k, vars[k]);
    if (bgB) for (const k in vars) bgB.style.setProperty(k, vars[k]);
  };

  (() => {
    const START = 40;
    const END = 1400;

    const MAX_BLUR = 4;
    const MIN_DIM = 0.75;
    const MAX_DIM_DROP = 0.08;
    const BASE_SAT = 1.10;
    const SAT_BOOST = 0.08;
    const BASE_SCALE = 1.02;
    const SCALE_BOOST = 0.03;

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
        "--bg-blur": `${blur.toFixed(2)}px`,
        "--bg-dim": `${dim.toFixed(3)}`,
        "--bg-sat": `${sat.toFixed(3)}`,
        "--bg-scale": `${scale.toFixed(3)}`,
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

  /* ========== CUSTOM CURSOR (WARM COLORS) ========== */
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

    // Hover effects (warm gold)
    const hoverables = $$("a, button, .panel__media, .panel__content, .icon-btn");
    for (const el of hoverables) {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "42px";
        ring.style.height = "42px";
        ring.style.borderColor = "rgba(212,167,106,.60)";
        ring.style.opacity = "1";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "34px";
        ring.style.height = "34px";
        ring.style.borderColor = "rgba(212,167,106,.50)";
        ring.style.opacity = ".96";
      });
    }
  }

  /* ========== RIPPLE CLICK EFFECT (WARM) ========== */
  window.addEventListener("click", (e) => {
    if (e.target.closest?.(".modal__actions")) return;
    if (e.target.closest?.(".modal2__panel")) return;

    const r = document.createElement("div");
    r.className = "ripple";
    r.style.left = e.clientX + "px";
    r.style.top = e.clientY + "px";
    document.body.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  });

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

  /* ========== IMAGE EXPAND MODAL ========== */
  const expandModal = $("#expandModal");
  const expandBackdrop = expandModal ? $(".modal2__backdrop", expandModal) : null;
  const expandClose = $("#expandClose");
  const expandTitle = $("#expandTitle");
  const expandImg = $("#expandImg");

  const openExpand = (panel) => {
    if (!expandModal || !expandImg) return;
    const img = $("img", panel);
    if (!img) return;

    const title = panel.getAttribute("data-title") || "Detail";
    if (expandTitle) expandTitle.textContent = title;
    expandImg.src = img.getAttribute("src") || "";
    expandImg.alt = img.getAttribute("alt") || "Expanded figure";

    expandModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeExpand = () => {
    if (!expandModal) return;
    expandModal.classList.remove("is-open");
    document.body.style.overflow = "";
    if (expandImg) expandImg.src = "";
  };

  $$(".js-expand").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const panel = btn.closest(".panel__media, .panel__media-large");
      if (panel) openExpand(panel);
    });
  });

  if (expandBackdrop) expandBackdrop.addEventListener("click", closeExpand);
  if (expandClose) expandClose.addEventListener("click", closeExpand);

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
            background:#1C1510;
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
      if (e.key === "Escape" && expandModal?.classList.contains("is-open")) closeExpand();
    });
  }

  /* ========== PDF BUTTON EVENT LISTENERS (FIXED) ========== */
  const openLabPdf = $("#openLabPdf");
  const openLabPdf2 = $("#openLabPdf2");
  
  const pdfConfig = {
    pdf: "pdf/blog3.pdf",
    title: "Lab 3 • SARIMA Time Series Analysis",
    repo: "https://github.com/VINH1811/air_quality_timeseries-lab4",
  };

  // ⬅️ FIX: Thêm preventDefault và stopPropagation
  if (openLabPdf) {
    openLabPdf.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("PDF button clicked!"); // Debug log
      openModal(pdfConfig);
    });
  }

  if (openLabPdf2) {
    openLabPdf2.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("PDF button 2 clicked!"); // Debug log
      openModal(pdfConfig);
    });
  }

  /* ========== TO TOP (FIXED) ========== */
  const toTop = $("#toTop");
  if (toTop) {
    toTop.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("To top clicked!"); // Debug log
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========== YEAR ========== */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ⬅️ DEBUG: Log tất cả buttons để kiểm tra
  console.log("=== LAB 3 JS LOADED ===");
  console.log("PDF Button:", openLabPdf);
  console.log("To Top Button:", toTop);
  console.log("Modal:", modal);
  console.log("All buttons:", $$(".btn"));
})();
