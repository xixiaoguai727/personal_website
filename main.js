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

    const lastUpdated = document.querySelector("[data-last-updated]");
    if (lastUpdated) {
      const showModifiedDate = (value) => {
        const modified = new Date(value);
        if (Number.isNaN(modified.getTime())) return;

        const year = modified.getFullYear();
        const month = String(modified.getMonth() + 1).padStart(2, "0");
        lastUpdated.dateTime = `${year}-${month}`;
        lastUpdated.textContent = modified.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      };

      if (window.location.protocol === "file:") {
        showModifiedDate(document.lastModified);
      } else {
        // Missing server metadata must not turn the visit date into an update date.
        fetch(window.location.href, { method: "HEAD", cache: "no-cache" })
          .then((response) => {
            const modified = response.headers.get("Last-Modified");
            if (response.ok && modified) showModifiedDate(modified);
          })
          .catch(() => {});
      }
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
