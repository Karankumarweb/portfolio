/* ==========================================================================
   Karan Kumar — portfolio interactions
   Theme & accent switching, nav, scroll effects, typing, counters,
   certificate lightbox, copy-to-clipboard and the contact form.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  window.__kkReady = true;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- toast ---------- */
  var toastEl = document.getElementById("toast");
  var toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2600);
  }

  /* ---------- theme (dark / light) ---------- */
  var themeButtons = document.querySelectorAll('[data-action="theme"]');

  function paintTheme(theme) {
    root.setAttribute("data-theme", theme);
    store.set("kk-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#070b16" : "#f6f7fc");
    themeButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      paintTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });
  paintTheme(root.getAttribute("data-theme") || "dark");

  /* ---------- accent colour ---------- */
  var dots = document.querySelectorAll(".swatch__dot");

  function paintAccent(accent) {
    root.setAttribute("data-accent", accent);
    store.set("kk-accent", accent);
    dots.forEach(function (dot) {
      dot.setAttribute("aria-pressed", dot.dataset.accent === accent ? "true" : "false");
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      paintAccent(dot.dataset.accent);
      toast("Theme colour updated");
    });
  });
  paintAccent(root.getAttribute("data-accent") || "indigo");

  /* ---------- header, scroll progress, back-to-top ---------- */
  var header = document.getElementById("header");
  var bar = document.getElementById("scrollBar");
  var toTop = document.getElementById("toTop");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (bar) bar.style.width = (height > 0 ? Math.min(y / height, 1) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- mobile navigation ---------- */
  var nav = document.getElementById("nav");
  var navToggle = document.querySelector(".nav-toggle");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* ---------- active section highlighting ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav > a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    root.classList.remove("js-io");
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- typing effect ---------- */
  var typing = document.getElementById("typing");
  if (typing) {
    var phrases = [
      "Java Backend Developer",
      "Spring Boot Engineer",
      "REST API Builder",
      "Microservices Enthusiast"
    ];

    if (reducedMotion) {
      typing.textContent = phrases[0];
    } else {
      var phraseIndex = 0, charIndex = 0, deleting = false;
      (function tick() {
        var phrase = phrases[phraseIndex];
        charIndex += deleting ? -1 : 1;
        typing.textContent = phrase.slice(0, charIndex);

        var delay = deleting ? 38 : 74;
        if (!deleting && charIndex === phrase.length) { deleting = true; delay = 1900; }
        else if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 320; }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll(".count");
  function runCounter(el) {
    var target = parseFloat(el.dataset.to);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    if (isNaN(target)) return;
    if (reducedMotion) { el.textContent = target.toFixed(decimals); return; }

    var start = performance.now();
    var duration = 1400;
    (function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    })(start);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- certificate lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = lightbox ? lightbox.querySelector(".lightbox__close") : null;
  var lastFocused = null;

  function openLightbox(src, caption) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "Certificate";
    lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(trigger.dataset.lightbox, trigger.dataset.caption);
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target === lightboxClose) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
    });
  }

  /* ---------- copy to clipboard ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy") ? resolve() : reject(); }
      catch (e) { reject(e); }
      document.body.removeChild(area);
    });
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.dataset.copy;
      copyText(value).then(
        function () { toast("Copied: " + value); },
        function () { toast("Couldn't copy — please select it manually"); }
      );
    });
  });

  /* ---------- contact form → mailto ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var errorBox = document.getElementById("cf-error");

    function setError(field, message) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("has-error", Boolean(message));
      return message;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = document.getElementById("cf-name");
      var email = document.getElementById("cf-email");
      var subject = document.getElementById("cf-subject");
      var message = document.getElementById("cf-message");

      var errors = [];
      errors.push(setError(name, name.value.trim() ? "" : "Please add your name."));
      errors.push(setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Please add a valid email address."));
      errors.push(setError(subject, subject.value.trim() ? "" : "Please add a subject."));
      errors.push(setError(message, message.value.trim().length >= 10 ? "" : "Please write a slightly longer message."));
      errors = errors.filter(Boolean);

      if (errors.length) {
        if (errorBox) { errorBox.textContent = errors[0]; errorBox.hidden = false; }
        var firstInvalid = form.querySelector(".has-error input, .has-error textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (errorBox) { errorBox.hidden = true; errorBox.textContent = ""; }

      var body = [
        message.value.trim(),
        "",
        "—",
        name.value.trim(),
        email.value.trim()
      ].join("\n");

      var url = "mailto:kk4447058@gmail.com" +
        "?subject=" + encodeURIComponent(subject.value.trim()) +
        "&body=" + encodeURIComponent(body);

      window.location.href = url;
      toast("Opening your email app…");
      form.reset();
    });

    form.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        var wrap = field.closest(".field");
        if (wrap && wrap.classList.contains("has-error")) wrap.classList.remove("has-error");
        if (errorBox) errorBox.hidden = true;
      });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
