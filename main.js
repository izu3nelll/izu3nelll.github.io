/* ============================================================
   izumiemi Portfolio — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 要素取得 ─────────────────────────────── */
  const nav           = document.getElementById('nav');
  const navList       = document.getElementById('navList');
  const navLinks      = document.querySelectorAll('.nav__link');
  const hamburger     = document.getElementById('navHamburger');
  const sections      = document.querySelectorAll('section[id]');
  const fadeEls       = document.querySelectorAll(
    '.sec__header, .strengths-grid, .works-list, .skills-grid, .skills-note, ' +
    '.mindset-lead, .mindset-articles, .contact-layout'
  );
  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');
  const formError     = document.getElementById('formError');

  /* ── スクロール時の Nav スタイル ──────────── */
  function onScroll() {
    // scrolled クラス（背景ぼかし）
    nav.classList.toggle('is-scrolled', window.scrollY > 20);

    // アクティブリンクのハイライト
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初期実行

  /* ── ハンバーガーメニュー ─────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    // メニューが開いている間はスクロール禁止
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // リンクをクリックしたらメニューを閉じる
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    });
  });

  // Escape キーでメニューを閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('is-open')) {
      navList.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  /* ── スクロールアニメーション（Intersection Observer）── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // フォールバック：Observer未対応の場合は即表示
    fadeEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── お問い合わせフォーム ─────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // リセット
      formSuccess.classList.remove('is-visible');
      formError.classList.remove('is-visible');

      const name    = document.getElementById('fname').value.trim();
      const email   = document.getElementById('femail').value.trim();
      const subject = document.getElementById('fsubject').value.trim();
      const message = document.getElementById('fmessage').value.trim();

      // バリデーション
      let hasError = false;
      [
        { id: 'fname',    val: name },
        { id: 'femail',   val: email },
        { id: 'fmessage', val: message }
      ].forEach(({ id, val }) => {
        const el = document.getElementById(id);
        if (!val) {
          el.classList.add('is-error');
          hasError = true;
          el.addEventListener('input', () => el.classList.remove('is-error'), { once: true });
        }
      });

      // メールアドレス形式チェック
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('femail').classList.add('is-error');
        hasError = true;
      }

      if (hasError) {
        formError.classList.add('is-visible');
        formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // mailto で送信（バックエンドなし対応）
      const mailSubject = subject || 'ポートフォリオサイトよりお問い合わせ';
      const mailBody =
        `お名前: ${name}\n` +
        `メールアドレス: ${email}\n` +
        `件名: ${mailSubject}\n\n` +
        `${message}`;

      const mailto =
        `mailto:copy.con.file.txt@gmail.com` +
        `?subject=${encodeURIComponent(mailSubject)}` +
        `&body=${encodeURIComponent(mailBody)}`;

      window.location.href = mailto;

      // 成功メッセージ
      formSuccess.classList.add('is-visible');
      const submitBtn = contactForm.querySelector('.btn--submit');
      if (submitBtn) submitBtn.style.display = 'none';
    });
  }

  /* ── Smooth scroll — href="#id" のリンク ──── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();