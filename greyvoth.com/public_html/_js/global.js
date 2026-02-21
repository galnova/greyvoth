(() => {
  const PASSWORD = "PORT";
  const KEY = "gv_portfolio_unlocked_v1";

  const html = document.documentElement;
  const gate = document.getElementById("pwGate");
  const form = document.getElementById("pwForm");
  const input = document.getElementById("pwInput");
  const err = document.getElementById("pwErr");
  const reset = document.getElementById("pwReset");
  const content = document.getElementById("pageContent");

  if (!gate || !form || !input || !content) return;

  const isUnlocked = () => localStorage.getItem(KEY) === "1";

  const lock = () => {
    localStorage.removeItem(KEY);
    html.classList.add("pw-locked");
    gate.setAttribute("aria-hidden", "false");
    if (err) err.style.display = "none";
    input.value = "";
    setTimeout(() => input.focus(), 50);
  };

  const unlock = () => {
    localStorage.setItem(KEY, "1");
    html.classList.remove("pw-locked");
    gate.setAttribute("aria-hidden", "true");
    if (err) err.style.display = "none";
  };

  if (isUnlocked()) unlock();
  else lock();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = String(input.value || "").trim();
    if (val === PASSWORD) unlock();
    else {
      if (err) err.style.display = "block";
      input.select();
      input.focus();
    }
  });

  if (reset) reset.addEventListener("click", lock);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !html.classList.contains("pw-locked")) lock();
  });
})();

(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const backTop = document.querySelector(".back-to-top");
  if (!backTop) return;

  const onScroll = () => {
    backTop.classList.toggle("show", window.scrollY > 300);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(() => {
  const carouselEl = document.getElementById("testimonialsCarousel");
  if (!carouselEl || typeof bootstrap === "undefined") return;

  const inner = carouselEl.querySelector(".carousel-inner");
  const indicators = carouselEl.querySelector(".carousel-indicators");
  if (!inner || !indicators) return;

  const TRANSIENT_ITEM_CLASSES = [
    "active",
    "carousel-item-start",
    "carousel-item-end",
    "carousel-item-next",
    "carousel-item-prev"
  ];

  const disposeCarousel = () => {
    const inst = bootstrap.Carousel.getInstance(carouselEl);
    if (inst) inst.dispose();
  };

  const stripTransientClasses = (root) => {
    root.querySelectorAll(".carousel-item").forEach((it) => {
      TRANSIENT_ITEM_CLASSES.forEach((c) => it.classList.remove(c));
    });
  };

  const buildIndicators = (count, activeIndex) => {
    indicators.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-bs-target", "#testimonialsCarousel");
      btn.setAttribute("data-bs-slide-to", String(i));
      btn.setAttribute("aria-label", `Slide ${i + 1}`);
      if (i === activeIndex) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "true");
      }
      indicators.appendChild(btn);
    }
  };

  const getActiveIndex = () => {
    const items = Array.from(inner.querySelectorAll(".carousel-item"));
    const idx = items.findIndex((n) => n.classList.contains("active"));
    return idx >= 0 ? idx : 0;
  };

  const initCarousel = (activeIndex) => {
    const inst = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
      interval: 9000,
      ride: false,
      touch: true
    });

    if (typeof inst.to === "function") inst.to(activeIndex);
    return inst;
  };

  const normalizeInitialState = () => {
    disposeCarousel();

    stripTransientClasses(inner);

    const items = Array.from(inner.querySelectorAll(".carousel-item"));
    if (items.length) items[0].classList.add("active");

    indicators.querySelectorAll("button").forEach((b) => {
      b.classList.remove("active");
      b.removeAttribute("aria-current");
    });

    const firstBtn = indicators.querySelector("button");
    if (firstBtn) {
      firstBtn.classList.add("active");
      firstBtn.setAttribute("aria-current", "true");
    }
  };

  normalizeInitialState();

  const original = {
    innerHTML: inner.innerHTML
  };

  const snapshotCardsFromOriginal = () => {
    const temp = document.createElement("div");
    temp.innerHTML = original.innerHTML;
    stripTransientClasses(temp);

    const cols = Array.from(
      temp.querySelectorAll(".carousel-item .col-12.col-md-6.col-lg-4")
    );
    return cols.map((col) => col.innerHTML);
  };

  const setDesktopMode = (preferIndex = 0) => {
    disposeCarousel();

    inner.innerHTML = original.innerHTML;

    stripTransientClasses(inner);

    const items = Array.from(inner.querySelectorAll(".carousel-item"));
    const max = Math.max(0, items.length - 1);
    const activeIndex = Math.min(Math.max(preferIndex, 0), max);

    items.forEach((it, i) => it.classList.toggle("active", i === activeIndex));

    buildIndicators(items.length, activeIndex);
    initCarousel(activeIndex);
  };

  const setMobileMode = (preferIndex = 0) => {
    disposeCarousel();

    const cards = snapshotCardsFromOriginal();
    const max = Math.max(0, cards.length - 1);
    const activeIndex = Math.min(Math.max(preferIndex, 0), max);

    inner.innerHTML = "";

    cards.forEach((cardHTML, i) => {
      const item = document.createElement("div");
      item.className = "carousel-item" + (i === activeIndex ? " active" : "");
      item.innerHTML = `
        <div class="row g-4">
          <div class="col-12">
            ${cardHTML}
          </div>
        </div>`;
      inner.appendChild(item);
    });

    buildIndicators(cards.length, activeIndex);
    initCarousel(activeIndex);
  };

  let hasInitialized = false;

  const applyMode = () => {
    const isMobile = window.matchMedia("(max-width: 991.98px)").matches;

    if (!hasInitialized) {
      hasInitialized = true;
      if (isMobile) setMobileMode(0);
      else setDesktopMode(0);
      return;
    }

    const currentIndex = getActiveIndex();

    if (isMobile) {
      setMobileMode(currentIndex * 3);
      return;
    }

    setDesktopMode(Math.floor(currentIndex / 3));
  };

  let t = null;
  const onResize = () => {
    clearTimeout(t);
    t = setTimeout(applyMode, 120);
  };

  applyMode();
  window.addEventListener("resize", onResize, { passive: true });
})();

(() => {
  const filters = document.getElementById("portfolio-flters");
  if (!filters) return;

  const items = document.querySelectorAll(".portfolio-item");

  filters.addEventListener("click", (e) => {
    const target = e.target.closest("li");
    if (!target) return;

    const filter = target.getAttribute("data-filter");
    if (!filter) return;

    filters.querySelectorAll("li").forEach((li) =>
      li.classList.remove("filter-active")
    );
    target.classList.add("filter-active");

    items.forEach((item) => {
      if (filter === "*") {
        item.style.display = "";
        return;
      }

      if (item.matches(filter)) item.style.display = "";
      else item.style.display = "none";
    });
  });
})();

(() => {
  if (typeof bootstrap === "undefined") return;

  const modalEl = document.getElementById("lightboxModal");
  const imgEl = document.getElementById("lightboxImg");
  const titleEl = document.getElementById("lightboxTitle");
  if (!modalEl || !imgEl || !titleEl) return;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  const escHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const setImage = (src, title) => {
    const safeTitle = escHtml(title || "");
    titleEl.innerHTML = safeTitle;
    imgEl.setAttribute("alt", title || "Full image");

    imgEl.removeAttribute("src");
    imgEl.setAttribute("src", src);
  };

  const clearImage = () => {
    imgEl.removeAttribute("src");
    imgEl.setAttribute("alt", "");
    titleEl.textContent = "";
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-lightbox");
    if (!btn) return;

    const src = btn.getAttribute("data-src");
    if (!src) return;

    const title =
      btn.getAttribute("data-title") ||
      btn.getAttribute("aria-label") ||
      "";

    setImage(src, title);
    modal.show();
  });

  modalEl.addEventListener("hidden.bs.modal", clearImage);
})();