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

  const original = {
    innerHTML: inner.innerHTML,
    indicatorsHTML: indicators.innerHTML
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

  const disposeCarousel = () => {
    const inst = bootstrap.Carousel.getInstance(carouselEl);
    if (inst) inst.dispose();
  };

  const initCarousel = () => {
    bootstrap.Carousel.getOrCreateInstance(carouselEl);
  };

  const snapshotCardsFromOriginal = () => {
    const temp = document.createElement("div");
    temp.innerHTML = original.innerHTML;
    const cols = Array.from(temp.querySelectorAll(".carousel-item .col-12.col-md-6.col-lg-4"));
    return cols.map((col) => col.innerHTML);
  };

  const setDesktopMode = (preferIndex = null) => {
    disposeCarousel();

    inner.innerHTML = original.innerHTML;

    const items = Array.from(inner.querySelectorAll(".carousel-item"));
    let activeIndex = preferIndex ?? 0;
    if (activeIndex >= items.length) activeIndex = 0;

    items.forEach((it, i) => it.classList.toggle("active", i === activeIndex));

    buildIndicators(items.length, activeIndex);
    initCarousel();
  };

  const setMobileMode = () => {
    disposeCarousel();

    const activeDesktopIndex = getActiveIndex();

    const cards = snapshotCardsFromOriginal();
    const perDesktopSlide = 3;
    const startIndex = Math.min(activeDesktopIndex * perDesktopSlide, Math.max(0, cards.length - 1));

    inner.innerHTML = "";

    cards.forEach((cardHTML, i) => {
      const item = document.createElement("div");
      item.className = "carousel-item" + (i === startIndex ? " active" : "");
      item.innerHTML =
        `<div class="row g-4">
          <div class="col-12">
            ${cardHTML}
          </div>
        </div>`;
      inner.appendChild(item);
    });

    buildIndicators(cards.length, startIndex);
    initCarousel();
  };

  const applyMode = () => {
    const isMobile = window.matchMedia("(max-width: 991.98px)").matches;

    if (isMobile) {
      setMobileMode();
      return;
    }

    const currentIndex = getActiveIndex();
    const desktopIndex = Math.floor(currentIndex / 3);
    setDesktopMode(desktopIndex);
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

    // Active state
    filters.querySelectorAll("li").forEach(li =>
      li.classList.remove("filter-active")
    );
    target.classList.add("filter-active");

    // Filtering logic
    items.forEach(item => {
      if (filter === "*") {
        item.style.display = "";
        return;
      }

      if (item.matches(filter)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
})();