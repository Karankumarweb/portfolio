/* ==========================================================================
   Karan Kumar — portfolio interactions
   Vanilla JS, no dependencies. Progressive: the page works without it.
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var themeBtn = $("#theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0d17" : "#f6f7fc");
    try { localStorage.setItem("kk-theme", theme); } catch (e) {}
  }

  // Fallback to the OS preference if nothing is stored.
  var stored = null;
  try { stored = localStorage.getItem("kk-theme"); } catch (e) {}
  applyTheme(stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("#menu-btn");
  var nav = $("#nav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) closeMenu(); });
  }

  /* ---------- Header state + scroll progress ---------- */
  var header = $(".site-header");
  var progress = $("#scroll-progress");
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + "%";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Scroll spy ---------- */
  var navLinks = $$('.nav a[href^="#"]');
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = $$(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 70, 280) + "ms";
        el.classList.add("is-visible");
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  var counters = $$("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var duration = 1300, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- Typewriter ---------- */
  var typedEl = $(".typed");
  if (typedEl) {
    var phrases;
    try {
      phrases = JSON.parse(typedEl.getAttribute("data-typed"));
    } catch (e) {
      phrases = [typedEl.textContent.trim()];
    }
    if (!Array.isArray(phrases) || !phrases.length) phrases = [typedEl.textContent.trim()];

    if (reduceMotion || phrases.length === 1) {
      typedEl.textContent = phrases[0];
    } else {
      var pIndex = 0, cIndex = phrases[0].length, deleting = true, delay = 1900;
      (function tick() {
        var full = phrases[pIndex];
        if (deleting) {
          cIndex--;
          typedEl.textContent = full.slice(0, cIndex);
          if (cIndex <= 0) {
            deleting = false;
            pIndex = (pIndex + 1) % phrases.length;
            delay = 380;
          } else {
            delay = 38;
          }
        } else {
          cIndex++;
          typedEl.textContent = full.slice(0, cIndex);
          if (cIndex >= full.length) {
            deleting = true;
            delay = 1700;
          } else {
            delay = 68;
          }
        }
        window.setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- Project filters ---------- */
  var filters = $$(".filter");
  var projects = $$(".project");
  var emptyState = $("#empty-state");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      var shown = 0;
      projects.forEach(function (card) {
        var match = cat === "all" || card.getAttribute("data-cat") === cat;
        card.classList.toggle("is-hidden", !match);
        if (match) {
          shown++;
          if (!reduceMotion) {
            card.classList.remove("is-visible");
            // re-trigger the reveal transition
            void card.offsetWidth;
            card.classList.add("is-visible");
          }
        }
      });
      if (emptyState) emptyState.hidden = shown !== 0;
    });
  });

  /* ---------- Certificate lightbox ---------- */
  var lightbox = $("#lightbox");
  var lbImg = $("#lb-img");
  var lbCaption = $("#lb-caption");
  var lbClose = $("#lb-close");
  var lastFocused = null;

  function openLightbox(src, caption) {
    if (!lightbox || !lbImg) return;
    lastFocused = document.activeElement;
    lbImg.setAttribute("src", src);
    lbImg.setAttribute("alt", caption || "Certificate");
    if (lbCaption) lbCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    window.setTimeout(function () {
      lightbox.hidden = true;
      if (lbImg) lbImg.setAttribute("src", "");
    }, 260);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  $$(".cert-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(btn.getAttribute("data-lightbox"), btn.getAttribute("data-caption"));
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Contact form ---------- */
  /* Static site — no backend. We validate, then hand off to the visitor's
     mail client with everything pre-filled, and offer a copy fallback. */
  var form = $("#contact-form");
  var note = $("#form-note");

  function setNote(msg, kind) {
    if (!note) return;
    note.textContent = msg;
    note.className = "form-note" + (kind ? " is-" + kind : "");
  }

  function markField(input, bad) {
    var field = input.closest(".field");
    if (field) field.classList.toggle("has-error", !!bad);
  }

  if (form) {
    var fields = $$("input, textarea", form);
    fields.forEach(function (input) {
      input.addEventListener("input", function () { markField(input, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#cf-name"), email = $("#cf-email"), subject = $("#cf-subject"), message = $("#cf-message");
      var invalid = [];

      [name, email, subject, message].forEach(function (input) {
        var val = (input.value || "").trim();
        var bad = !val;
        if (!bad && input === email) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        markField(input, bad);
        if (bad) invalid.push(input);
      });

      if (invalid.length) {
        setNote("Please fill in every field with a valid email address.", "err");
        invalid[0].focus();
        return;
      }

      var body = "Hi Karan,\n\n" + message.value.trim() +
                 "\n\n—\n" + name.value.trim() + "\n" + email.value.trim();
      var href = "mailto:kk4447058@gmail.com" +
                 "?subject=" + encodeURIComponent(subject.value.trim()) +
                 "&body=" + encodeURIComponent(body);

      window.location.href = href;
      setNote("Opening your email app — if nothing happens, just mail kk4447058@gmail.com", "ok");
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
