/* ==========================================================================
   Karan Kumar — Portfolio  ·  main.js
   No dependencies. Everything degrades gracefully if an element is missing.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var root        = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------------------------------------------------------- theme */
  var modeBtn = $('#modeBtn');

  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    store.set('kk-theme', mode);
    if (modeBtn) {
      modeBtn.setAttribute('aria-label',
        mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#05070e' : '#f6f7fc');
  }

  setTheme(root.getAttribute('data-theme') || 'dark');

  if (modeBtn) {
    modeBtn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* --------------------------------------------------------------- accent */
  var swatches = $$('.swatch');

  function setAccent(name) {
    root.setAttribute('data-accent', name);
    store.set('kk-accent', name);
    swatches.forEach(function (s) {
      s.setAttribute('aria-pressed', String(s.dataset.accent === name));
    });
  }

  setAccent(root.getAttribute('data-accent') || 'indigo');

  swatches.forEach(function (s) {
    s.addEventListener('click', function () { setAccent(s.dataset.accent); });
  });

  /* --------------------------------------------------------- theme popover */
  var themeBtn = $('#themeBtn');
  var themePop = $('#themePop');

  function closePop() {
    if (!themePop) return;
    themePop.classList.remove('open');
    if (themeBtn) themeBtn.setAttribute('aria-expanded', 'false');
  }

  if (themeBtn && themePop) {
    themeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = themePop.classList.toggle('open');
      themeBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!themePop.contains(e.target) && e.target !== themeBtn) closePop();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePop();
    });
  }

  /* ------------------------------------------------------------ nav / menu */
  var nav       = $('#nav');
  var navLinks  = $('#navLinks');
  var burger    = $('#burger');
  var links     = navLinks ? $$('a', navLinks) : [];
  var toTop     = $('#toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle('stuck', y > 12);
    if (toTop) toTop.classList.toggle('show', y > 620);

    // active section
    var pos = y + window.innerHeight * 0.32;
    var current = links.length ? links[0] : null;
    links.forEach(function (a) {
      var id = a.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var sec = document.querySelector(id);
      if (sec && sec.offsetTop <= pos) current = a;
    });
    links.forEach(function (a) { a.classList.toggle('active', a === current); });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  onScroll();

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------- typing */
  var typedEl = $('#typed');

  if (typedEl) {
    var phrases = [
      'Java Backend Developer',
      'Spring Boot Engineer',
      'REST API & Microservices Dev',
      'QA Automation Engineer'
    ];

    if (reduceMotion) {
      typedEl.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;

      (function tick() {
        var word = phrases[pi];

        typedEl.textContent = word.slice(0, ci);

        if (!deleting && ci < word.length) {
          ci++;
          setTimeout(tick, 62 + Math.random() * 45);
        } else if (!deleting && ci === word.length) {
          deleting = true;
          setTimeout(tick, 1900);
        } else if (deleting && ci > 0) {
          ci--;
          setTimeout(tick, 28);
        } else {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 320);
        }
      })();
    }
  }

  /* ------------------------------------------------------- code-card lines */
  $$('.code-body .ln').forEach(function (line, i) {
    line.style.animationDelay = (i * 95) + 'ms';
  });

  /* ------------------------------------------------------ reveal on scroll */
  var revealables = $$('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var siblings = el.parentElement ? $$('.reveal', el.parentElement) : [el];
        var idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
        el.classList.add('in');
        revealObs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* -------------------------------------------------------------- counters */
  var counters = $$('[data-count]');

  function runCounter(el) {
    var target = parseFloat(el.dataset.count) || 0;
    var suffix = el.dataset.suffix || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var dur = 1500;
    var t0 = performance.now();

    (function frame(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }

  if ('IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        runCounter(en.target);
        countObs.unobserve(en.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { countObs.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ------------------------------------------------------------ skill bars */
  var bars = $$('.bar i[data-w]');

  function fillBars(scope) {
    $$('.bar i[data-w]', scope).forEach(function (bar) {
      bar.style.width = bar.dataset.w + '%';
    });
  }

  if ('IntersectionObserver' in window) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        fillBars(en.target);
        barObs.unobserve(en.target);
      });
    }, { threshold: 0.25 });

    bars.forEach(function (bar) {
      var host = bar.closest('.card') || bar;
      barObs.observe(host);
    });
  } else {
    fillBars(document);
  }

  /* -------------------------------------------------------- project filter */
  var filterBtns = $$('.filter');
  var projects   = $$('.proj');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;

      filterBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      projects.forEach(function (card) {
        var show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hide', !show);
        if (show) {
          card.classList.add('in');
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
        }
      });
    });
  });

  /* -------------------------------------------------------------- lightbox */
  var lb      = $('#lightbox');
  var lbImg   = $('#lbImg');
  var lbCap   = $('#lbCap');
  var lbClose = $('#lbClose');
  var lastFocus = null;

  if (lb) {
    lb.removeAttribute('hidden'); // visibility handles it; keeps the transition

    function openLb(src, caption, alt, trigger) {
      lastFocus = trigger || document.activeElement;
      lbImg.src = src;
      lbImg.alt = alt || '';
      lbCap.textContent = caption || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    $$('.cert').forEach(function (card) {
      card.addEventListener('click', function () {
        var img = $('img', card);
        openLb(card.dataset.full, card.dataset.caption, img ? img.alt : '', card);
      });
    });

    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
    });
  }

  /* ---------------------------------------------------------- contact form */
  var form = $('#contactForm');

  if (form) {
    var status = $('#formStatus');

    function fieldOf(input) { return input.closest('.field'); }

    function validate(input) {
      var field = fieldOf(input);
      if (!field) return true;

      var v = input.value.trim();
      var ok = v.length > 0;

      if (ok && input.type === 'email') {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      }
      if (ok && input.name === 'message') {
        ok = v.length >= 10;
      }

      field.classList.toggle('invalid', !ok);
      return ok;
    }

    $$('input, textarea', form).forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('invalid')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var inputs = $$('input, textarea', form);
      var firstBad = null;

      inputs.forEach(function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });

      if (firstBad) {
        firstBad.focus();
        if (status) {
          status.style.color = '#fb7185';
          status.textContent = 'Please fix the highlighted fields.';
        }
        return;
      }

      var name    = $('#cf-name').value.trim();
      var email   = $('#cf-email').value.trim();
      var subject = $('#cf-subject').value.trim();
      var message = $('#cf-message').value.trim();

      var body = message + '\n\n—\n' + name + '\n' + email;

      var href = 'mailto:kk4447058@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (status) {
        status.style.color = '';
        status.textContent = 'Opening your mail app…';
      }
    });
  }

  /* ------------------------------------------------------------- portrait */
  (function portrait() {
    var frame = $('#portraitFrame');
    if (!frame) return;

    // First one that exists wins; otherwise the monogram stays on screen.
    var candidates = [
      'assets/img/karan.webp',
      'assets/img/karan.jpg',
      'assets/img/karan.jpeg',
      'assets/img/karan.png'
    ];

    function tryNext(i) {
      if (i >= candidates.length) return;

      var probe = new Image();

      probe.onload = function () {
        var img = document.createElement('img');
        img.src = candidates[i];
        img.alt = 'Portrait of Karan Kumar';
        img.width = 900;
        img.height = 1125;
        frame.appendChild(img);

        var mono = $('.monogram', frame);
        if (mono) mono.remove();
      };

      probe.onerror = function () { tryNext(i + 1); };

      probe.src = candidates[i];
    }

    tryNext(0);
  })();

  /* ----------------------------------------------------------------- year */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
