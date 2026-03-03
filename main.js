// main.js
(() => {
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    // 1) Year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // 2) Respect reduced motion
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // 3) Panels: animate only when entering viewport (quiet + performance)
    const panels = Array.from(document.querySelectorAll(".panel-inner"));
    if (!panels.length) return;

    // If user prefers reduced motion, mount immediately without float/enter effects
    if (reduceMotion) {
      panels.forEach((panel) => panel.classList.add("panel-mounted"));
      return;
    }

    // IntersectionObserver: mount when visible
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const panel = entry.target;

            // Stagger based on DOM order
            const index = panels.indexOf(panel);
            panel.style.setProperty("--delay", `${index * 60}ms`);

            panel.classList.add("panel-mounted");
            io.unobserve(panel); // animate once
          });
        },
        {
          root: null,
          threshold: 0.12,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      panels.forEach((panel) => io.observe(panel));
    } else {
      // Fallback: old browsers
      panels.forEach((panel, index) => {
        panel.style.setProperty("--delay", `${index * 60}ms`);
        panel.classList.add("panel-mounted");
      });
    }

    // 4) Smooth anchor scroll with header offset (if you have sticky header)
    const header = document.querySelector(".site-header");
    const getHeaderOffset = () => (header ? header.getBoundingClientRect().height : 0);

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();

        const y = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - 12;
        window.scrollTo({ top: y, behavior: "smooth" });

        // Optional: update URL hash without jumping
        history.pushState(null, "", id);
      });
    });
  });
})();

lucide.createIcons();