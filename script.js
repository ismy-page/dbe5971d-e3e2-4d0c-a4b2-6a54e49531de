(() => {
  // Utilities
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Current year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Smooth scroll for internal anchors
  $$("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.getElementById(id.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      }
    });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      primaryNav.classList.toggle("open", !open);
    });

    // Close nav when clicking a link (mobile)
    primaryNav.addEventListener("click", (ev) => {
      const t = ev.target;
      if (t && t instanceof HTMLElement && t.matches("a")) {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("open");
      }
    });
  }

  // Section observer for nav highlighting
  const navLinks = $$('[data-nav]');
  const sections = navLinks
    .map((l) => document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = navLinks.find((l) => l.getAttribute('href') === `#${id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((n) => n.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  // About: counter-up animation
  const counters = $$(".num");
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count"));
        const dur = 900; // ms
        const start = performance.now();
        const from = 0;
        const step = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = t * (2 - t); // easeOutQuad
          const val = Math.floor(from + (target - from) * eased);
          el.textContent = val.toLocaleString();
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObs.observe(c));

  // Services: subtle reveal on hover via CSS; JS not required

  // Portfolio: CSS 3D cubes change detail text
  const detailBody = document.getElementById("detailBody");
  $$(".cube").forEach((cube) => {
    cube.addEventListener("click", () => {
      const ev = cube.getAttribute("data-event");
      if (!detailBody) return;
      const texts = {
        "Summit 2025": "2.5k attendees • 98% CSAT • 3 stages — Orchestrated keynotes, lounges, and a talent program.",
        "Launch Night": "Blended light choreography + timed reveals • 900 guests • 1M social reach.",
        "Pop‑up Tour": "Six-city sprint with modular staging • 15 days • 96% venue turnaround score.",
        "Festival A/V": "Four-day multi‑stage festival • 60 crew • zero‑downtime showcalling.",
      };
      detailBody.textContent = texts[ev] || "Select an event cube to preview metrics and quotes.";
    });
  });

  // Carousel (Portfolio)
  const slides = $$(".slide");
  const prev = $(".carousel-controls .prev");
  const next = $(".carousel-controls .next");
  let idx = 0;
  const show = (i) => {
    slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
  };
  const go = (d) => {
    idx = (idx + d + slides.length) % slides.length;
    show(idx);
  };
  if (prev && next) {
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    setInterval(() => go(1), 6000);
  }

  // Modals
  const openBtns = $$(".detail-open");
  const closeModal = (m) => {
    m.hidden = true;
    document.body.style.overflow = "";
  };
  openBtns.forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-modal");
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      const closer = modal.querySelector(".modal-close");
      if (closer) closer.focus();
      const esc = (ev) => {
        if (ev.key === "Escape") {
          closeModal(modal);
          document.removeEventListener("keydown", esc);
        }
      };
      document.addEventListener("keydown", esc);
      modal.addEventListener("click", (ev) => {
        if (ev.target === modal) closeModal(modal);
      });
      modal.querySelectorAll(".modal-close").forEach((x) => x.addEventListener("click", () => closeModal(modal)));
    });
  });

  // Testimonials slider
  const tSlides = $$(".t-slide");
  const tPrev = $(".t-prev");
  const tNext = $(".t-next");
  let ti = 0;
  const tShow = (i) => {
    tSlides.forEach((s, n) => s.classList.toggle("is-active", n === i));
  };
  const tGo = (d) => {
    ti = (ti + d + tSlides.length) % tSlides.length;
    tShow(ti);
  };
  if (tPrev && tNext) {
    tPrev.addEventListener("click", () => tGo(-1));
    tNext.addEventListener("click", () => tGo(1));
    setInterval(() => tGo(1), 7000);
  }

  // Checklist chips
  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const on = chip.getAttribute("aria-pressed") === "true";
      chip.setAttribute("aria-pressed", String(!on));
    });
  });

  // Contact form validation (light)
  const form = document.getElementById("contactForm");
  const result = document.getElementById("formResult");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form && result) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
      let ok = true;
      if (!name.value.trim()) { ok = false; $("#err-name").textContent = "Please enter your name."; } else { $("#err-name").textContent = ""; }
      if (!emailRe.test(email.value)) { ok = false; $("#err-email").textContent = "Enter a valid email."; } else { $("#err-email").textContent = ""; }
      if (!message.value.trim()) { ok = false; $("#err-message").textContent = "Tell me a bit about your event."; } else { $("#err-message").textContent = ""; }
      if (ok) {
        result.textContent = "Thanks! I’ll reach out to schedule a call.";
        form.reset();
      } else {
        result.textContent = "Please correct the highlighted fields.";
      }
    });
  }

  // Ambient audio: generate a short silent WAV at runtime and loop it (placeholder for real ambience)
  const audioEl = document.getElementById("ambience");
  const audioToggle = document.getElementById("audioToggle");

  function makeSilentWav(seconds = 2, sampleRate = 44100) {
    const numSamples = seconds * sampleRate;
    const bytesPerSample = 2; // 16-bit PCM
    const blockAlign = bytesPerSample * 1; // mono
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    let p = 0;
    const writeStr = (s) => { for (let i = 0; i < s.length; i++) view.setUint8(p++, s.charCodeAt(i)); };
    const writeU32 = (v) => { view.setUint32(p, v, true); p += 4; };
    const writeU16 = (v) => { view.setUint16(p, v, true); p += 2; };

    // RIFF header
    writeStr('RIFF');
    writeU32(36 + dataSize);
    writeStr('WAVE');
    // fmt chunk
    writeStr('fmt ');
    writeU32(16); // PCM
    writeU16(1); // audio format
    writeU16(1); // channels
    writeU32(sampleRate);
    writeU32(byteRate);
    writeU16(blockAlign);
    writeU16(16); // bits per sample
    // data chunk
    writeStr('data');
    writeU32(dataSize);
    // samples (silence)
    for (let i = 0; i < numSamples; i++) { view.setInt16(p, 0, true); p += 2; }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  if (audioEl) {
    try {
      const blob = makeSilentWav(2);
      const url = URL.createObjectURL(blob);
      audioEl.src = url;
    } catch (err) {
      // Fallback: do nothing; control will stay inactive
    }
  }

  if (audioEl && audioToggle) {
    audioToggle.addEventListener("click", async () => {
      const pressed = audioToggle.getAttribute("aria-pressed") === "true";
      if (pressed) {
        audioEl.pause();
      } else {
        try { await audioEl.play(); } catch (_) { /* ignore */ }
      }
      audioToggle.setAttribute("aria-pressed", String(!pressed));
    });
  }

  // HERO: lightweight particle canvas (no external deps)
  const canvas = document.getElementById('heroCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.clientWidth;
    let h = canvas.height = canvas.clientHeight;

    const particleCount = 80;
    const parts = new Array(particleCount).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      hue: 220 + Math.random() * 120
    }));

    let mx = 0, my = 0;
    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5;
      my = (e.clientY - rect.top) / rect.height - 0.5;
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx + mx * 0.6;
        p.y += p.vy + my * 0.6;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 0.7)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    const onResize = () => {
      w = canvas.width = canvas.clientWidth;
      h = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', onResize);
    draw();
  }
})();

