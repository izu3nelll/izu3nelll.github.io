/* ============================================
   izumiemi portfolio — Main JS
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile hamburger ---
  const hamburger = document.querySelector(".nav__hamburger");
  const overlay = document.querySelector(".nav__overlay");

  if (hamburger && overlay) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      overlay.classList.toggle("open");
      document.body.style.overflow = overlay.classList.contains("open") ? "hidden" : "";
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
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    faders.forEach((el) => observer.observe(el));
  }

  // --- Stagger delays ---
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const children = group.querySelectorAll(".fade-in");
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // --- Inner page subtle background canvas ---
  const canvas = document.getElementById("bg-canvas-inner");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h, time = 0, animId;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  // Subtle ambient glow spots
  const glows = [
    { x: 0.2, y: 0.3, r: 400, hue: 250, alpha: 0.04 },
    { x: 0.8, y: 0.6, r: 350, hue: 230, alpha: 0.03 },
    { x: 0.5, y: 0.8, r: 300, hue: 260, alpha: 0.025 },
  ];

  function animate() {
    time++;
    ctx.clearRect(0, 0, w, h);

    glows.forEach((g, i) => {
      const ox = Math.sin(time * 0.003 + i * 2) * 60;
      const oy = Math.cos(time * 0.004 + i * 1.5) * 40;
      const grd = ctx.createRadialGradient(
        w * g.x + ox, h * g.y + oy, 0,
        w * g.x + ox, h * g.y + oy, g.r
      );
      grd.addColorStop(0, `hsla(${g.hue}, 40%, 50%, ${g.alpha})`);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    });

    animId = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
});
