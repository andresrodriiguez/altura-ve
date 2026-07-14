/* ═══════════════════════════════════════════
   ALTURA — interacciones
   ═══════════════════════════════════════════ */
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─── Preloader con contador ─── */
  const pre = document.getElementById("preloader");
  const bar = pre.querySelector(".preloader__bar i");
  const count = document.getElementById("preCount");

  const finish = () => {
    pre.classList.add("done");
    document.body.classList.add("loaded");
    setTimeout(() => pre.remove(), 1100);
  };

  if (reduced) {
    finish();
  } else {
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + Math.random() * 16 + 5);
      bar.style.width = p + "%";
      count.textContent = Math.floor(p);
      if (p < 100) setTimeout(tick, 90 + Math.random() * 110);
      else setTimeout(finish, 350);
    };
    tick();
  }

  /* ─── Cursor personalizado ─── */
  const dot = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });
  }

  /* ─── Nav: ocultar al bajar, mostrar al subir ─── */
  const nav = document.getElementById("nav");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("hidden", y > 140 && y > lastY);
    lastY = y;
  }, { passive: true });

  /* ─── Menú móvil ─── */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      menu.classList.remove("open");
    })
  );

  /* ─── Split de palabras (manifiesto) ─── */
  document.querySelectorAll(".split-words").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="w"><span style="--i:${i}">${w}</span></span>`)
      .join(" ");
  });

  /* ─── Reveals con IntersectionObserver ─── */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll(".reveal-up, .split-words").forEach((el) => io.observe(el));

  /* ─── Contadores animados ─── */
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        counterIO.unobserve(e.target);
        const target = +e.target.dataset.count;
        if (reduced) { e.target.textContent = target; return; }
        const t0 = performance.now();
        const dur = 1600;
        const step = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 4);
          e.target.textContent = Math.round(target * eased);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

  /* ─── Tilt 3D en tarjetas ─── */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const stage = card.querySelector(".card__stage");
      card.addEventListener("mousemove", (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        stage.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
      });
    });
  }

  /* ─── Botones magnéticos ─── */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ─── Parallax sutil del título hero ─── */
  const heroTitle = document.querySelector(".hero__title");
  const heroBg = document.querySelector(".hero__big-bg");
  if (!reduced) {
    addEventListener("scroll", () => {
      const y = scrollY;
      if (y < innerHeight) {
        heroTitle.style.transform = `translateY(${y * 0.18}px)`;
        heroBg.style.transform = `translateX(-50%) translateY(${y * -0.08}px)`;
      }
    }, { passive: true });
  }

  /* ─── Año dinámico ─── */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
