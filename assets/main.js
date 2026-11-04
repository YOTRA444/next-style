(function () {
  'use strict';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- menú móvil ---------- */
  var header = $('.nav');
  var toggle = $('#navToggle');
  var navLinks = $('#navLinks');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () { setMenu(!header.classList.contains('is-open')); });
  navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });

  /* ---------- sección actual en el menú ---------- */
  if ('IntersectionObserver' in window) {
    var linkFor = {};
    $$('.nav-links a[href^="#"]').forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$('.nav-links a.is-current').forEach(function (a) { a.classList.remove('is-current'); });
        var a = linkFor[en.target.id];
        if (a) a.classList.add('is-current');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(linkFor).forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });
  }

  /* ---------- aparición al hacer scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) {
      var siblings = el.parentElement ? $$('.reveal', el.parentElement) : [];
      var i = Math.max(siblings.indexOf(el), 0);
      el.style.setProperty('--d', ((i % 3) * 0.09) + 's');
      revObs.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- colores de la polera básica ---------- */
  var photo = $('#basicaPhoto');
  var zoomBtn = $('#basicaZoom');
  var colorName = $('#colorName');
  var orderBtn = $('#basicaOrder');
  var swatches = $$('.swatch');
  var swapToken = 0;

  function selectSwatch(sw, focus) {
    swatches.forEach(function (s) {
      var on = s === sw;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-checked', String(on));
      s.tabIndex = on ? 0 : -1;
    });
    if (focus) sw.focus();

    var color = sw.getAttribute('data-color');
    var url = sw.getAttribute('data-img');
    var alt = 'Polera básica ' + color.toLowerCase() + ' NEXT STYLE';
    colorName.textContent = color;
    orderBtn.href = 'https://wa.me/59162185788?text=' +
      encodeURIComponent('Hola, quiero una polera básica color ' + color);
    zoomBtn.setAttribute('data-full', url);
    zoomBtn.setAttribute('data-alt', alt);

    var token = ++swapToken;
    photo.style.opacity = '0';
    var im = new Image();
    im.onload = im.onerror = function () {
      if (token !== swapToken) return;
      photo.src = url;
      photo.alt = alt;
      photo.style.opacity = '1';
    };
    im.src = url;
  }

  swatches.forEach(function (sw, i) {
    sw.tabIndex = sw.classList.contains('is-active') ? 0 : -1;
    sw.addEventListener('click', function () { selectSwatch(sw, false); });
    sw.addEventListener('keydown', function (e) {
      var d = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') d = 1;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') d = -1;
      if (!d) return;
      e.preventDefault();
      selectSwatch(swatches[(i + d + swatches.length) % swatches.length], true);
    });
  });

  // precarga los demás colores cuando el navegador está libre
  (window.requestIdleCallback || function (f) { setTimeout(f, 1800); })(function () {
    swatches.forEach(function (s) { (new Image()).src = s.getAttribute('data-img'); });
  });

  /* ---------- visor de fotos ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCaption');
  var lbPrev = $('#lbPrev');
  var lbNext = $('#lbNext');
  var lbClose = $('#lbClose');
  var list = [];
  var idx = 0;
  var lastFocus = null;

  function show() {
    var b = list[idx];
    var alt = b.getAttribute('data-alt') || '';
    lbImg.src = b.getAttribute('data-full');
    lbImg.alt = alt;
    lbCap.textContent = list.length > 1 ? alt + '  ·  ' + (idx + 1) + ' / ' + list.length : alt;
    lbPrev.hidden = lbNext.hidden = list.length < 2;
    if (list.length > 1) {
      (new Image()).src = list[(idx + 1) % list.length].getAttribute('data-full');
      (new Image()).src = list[(idx - 1 + list.length) % list.length].getAttribute('data-full');
    }
  }
  function openLb(btn) {
    list = $$('[data-zoom][data-group="' + btn.getAttribute('data-group') + '"]');
    idx = Math.max(list.indexOf(btn), 0);
    lastFocus = btn;
    show();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLb() {
    if (lb.hidden) return;
    lb.hidden = true;
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }
  function step(d) {
    if (list.length < 2) return;
    idx = (idx + d + list.length) % list.length;
    show();
  }

  document.addEventListener('click', function (e) {
    var z = e.target.closest('[data-zoom]');
    if (z) openLb(z);
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-fig')) closeLb(); });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { step(-1); });
  lbNext.addEventListener('click', function () { step(1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); closeLb(); return; }
    if (lb.hidden) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'Tab') { // mantiene el foco dentro del visor
      var f = [lbClose, lbPrev, lbNext].filter(function (b) { return !b.hidden; });
      var i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // deslizar para cambiar de foto en el celular
  var sx = 0, sy = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
