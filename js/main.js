/**
 * Konserter i Norge – felles script
 * Mobilmeny, tema (lys/mørk), ingen avhengigheter
 */
(function () {
  'use strict';

  var THEME_KEY = 'konserterinorge-theme';

  /* Tema fra localStorage så fort scriptet lastes (reduserer blink) */
  (function applySavedTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  })();

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema');
      btn.textContent = theme === 'dark' ? '☀' : '☾';
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  /* Tema-knapp i header (vises på alle sider) */
  function initThemeToggle() {
    var header = document.querySelector('.site-header .container');
    var navToggle = document.querySelector('.nav-toggle');
    if (!header) return;
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', current === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema');
    btn.textContent = current === 'dark' ? '☀' : '☾';
    btn.addEventListener('click', toggleTheme);
    if (navToggle && navToggle.parentNode === header) {
      header.insertBefore(btn, navToggle);
    } else {
      header.appendChild(btn);
    }
  }

  var nav = document.querySelector('.nav-main');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
    });
  }

  /* FAQ accordion – åpne/lukk spørsmål */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.toggle('is-open');
      this.setAttribute('aria-expanded', isOpen);
    });
  });

  /* FAQ temaer – bytt panel når tema velges */
  document.querySelectorAll('.faq-theme').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var theme = this.getAttribute('data-theme');
      if (!theme) return;
      document.querySelectorAll('.faq-theme').forEach(function (b) {
        b.classList.remove('is-active');
        b.removeAttribute('aria-current');
      });
      this.classList.add('is-active');
      this.setAttribute('aria-current', 'true');
      document.querySelectorAll('.faq-panel').forEach(function (panel) {
        if (panel.getAttribute('data-theme') === theme) {
          panel.classList.add('is-visible');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('is-visible');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });

  /* FAQ mobil: Vis temaer / Lukk temaer */
  var faqThemesToggle = document.getElementById('faq-themes-toggle');
  var faqThemesNav = document.getElementById('faq-themes-nav');
  if (faqThemesToggle && faqThemesNav) {
    faqThemesToggle.addEventListener('click', function () {
      var open = faqThemesNav.classList.toggle('is-open');
      faqThemesToggle.setAttribute('aria-expanded', open);
      faqThemesToggle.textContent = open ? 'Lukk temaer' : 'Vis temaer';
    });
  }

  /* Scroll til topp – vis knapp når bruker har scrollet */
  var scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    function onScroll() {
      if (window.pageYOffset > 400) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
