/* ============================================================
   SATYAM — shared behaviour. No dependencies.
   ============================================================ */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Active nav ---------- */
  var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    var setMenu = function (open) {
      navLinks.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '✕' : '☰';
    };
    menuBtn.addEventListener('click', function () {
      setMenu(!navLinks.classList.contains('is-open'));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('is-open')) return;
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        io.observe(el);
      });
    }
  }

  /* ---------- Project filter ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var filterCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && filterCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.toggle('is-on', b === btn); });
        var cat = btn.dataset.filter;
        filterCards.forEach(function (card) {
          var cats = (card.dataset.category || '').split(' ');
          card.style.display = (cat === 'all' || cats.indexOf(cat) !== -1) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Blog topic filter ---------- */
  var topicBtns = document.querySelectorAll('[data-topic-filter]');
  var topicRows = document.querySelectorAll('[data-topic]');
  if (topicBtns.length && topicRows.length) {
    topicBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        topicBtns.forEach(function (b) { b.classList.toggle('is-on', b === btn); });
        var t = btn.dataset.topicFilter;
        topicRows.forEach(function (row) {
          row.style.display = (t === 'all' || row.dataset.topic === t) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var message = contactForm.message.value.trim();
      var status = document.getElementById('formStatus');

      if (!name || !email || !message) {
        status.className = 'form-status is-visible is-err';
        status.textContent = 'Please fill in all fields.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.className = 'form-status is-visible is-err';
        status.textContent = 'That email address does not look right.';
        return;
      }
      var subject = encodeURIComponent('Dispatch from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + '\n' + email);
      window.location.href = 'mailto:satyam.inv137@gmail.com?subject=' + subject + '&body=' + body;

      status.className = 'form-status is-visible is-ok';
      status.textContent = 'Opening your mail client…';
      contactForm.reset();
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
