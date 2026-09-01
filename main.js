(() => {
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  };

  onReady(() => {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    const header = document.querySelector(".site-header");
    const offset = () => (header ? header.getBoundingClientRect().height : 0);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - offset() - 14;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.pushState(null, "", href);
      });
    });
  });
})();
