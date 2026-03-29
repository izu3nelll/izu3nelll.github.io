/* ============================================
   izumiemi portfolio — Main JS
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // --- Nav scroll state ---
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // --- Mobile hamburger ---
  const hamburger = document.querySelector(".nav__hamburger");
  const overlay = document.querySelector(".nav__overlay");

  if (hamburger && overlay) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      overlay.classList.toggle("open");
      document.body.style.overflow = overlay.classList.contains("open")
        ? "hidden"
        : "";
    });

    overlay.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // --- Fade-in on scroll ---
  const faders = document.querySelectorAll(".fade-in");
  if (faders.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    faders.forEach((el) => observer.observe(el));
  }

  // --- Stagger fade-in delays ---
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const children = group.querySelectorAll(".fade-in");
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });
});
