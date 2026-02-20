(() => {
  const MANIFEST_URL = "/nu_images/manifest.json";
  const IMAGE_BASE = "/nu_images/";

  const grid = document.getElementById("galleryGrid");
  const statusEl = document.getElementById("galleryStatus");
  const searchEl = document.getElementById("gallerySearch");
  const shuffleBtn = document.getElementById("galleryShuffle");
  const resetBtn = document.getElementById("galleryReset");

  const modalEl = document.getElementById("lightboxModal");
  const titleEl = document.getElementById("lightboxTitle");
  const imgEl = document.getElementById("lightboxImg");

  if (!grid || !statusEl) return;

  let allItems = [];
  let viewItems = [];

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const setStatus = (msg) => {
    statusEl.textContent = msg;
  };

  const normalizeManifest = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map((x) => (typeof x === "string" ? { file: x } : x)).filter(Boolean);
    }
    if (Array.isArray(data.images)) {
      return data.images.map((x) => (typeof x === "string" ? { file: x } : x)).filter(Boolean);
    }
    return [];
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const buildCard = (item) => {
    const file = String(item.file || "").trim();
    if (!file) return null;

    const src = IMAGE_BASE + file;
    const title = String(item.title || file);

    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3 portfolio-item";

    col.innerHTML = `
      <div class="portfolio-card h-100">
        <button type="button"
          class="portfolio-media js-lightbox"
          data-src="${esc(src)}"
          data-title="${esc(title)}"
          aria-label="Open image ${esc(title)}">
          <img src="${esc(src)}" alt="${esc(title)}" loading="lazy" decoding="async">
        </button>
        <div class="card-body">
          <h4 class="mb-1">${esc(item.name || title)}</h4>
          <p class="mb-0">${esc(item.subtitle || file)}</p>
        </div>
      </div>
    `;
    return col;
  };

  const render = (items) => {
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    let count = 0;

    items.forEach((it) => {
      const card = buildCard(it);
      if (card) {
        frag.appendChild(card);
        count++;
      }
    });

    grid.appendChild(frag);
    setStatus(`${count} image${count === 1 ? "" : "s"} shown`);
  };

  const applySearch = () => {
    const q = String(searchEl?.value || "").trim().toLowerCase();
    if (!q) {
      viewItems = allItems.slice();
      render(viewItems);
      return;
    }

    viewItems = allItems.filter((it) => {
      const file = String(it.file || "").toLowerCase();
      const name = String(it.name || "").toLowerCase();
      const title = String(it.title || "").toLowerCase();
      const subtitle = String(it.subtitle || "").toLowerCase();
      return file.includes(q) || name.includes(q) || title.includes(q) || subtitle.includes(q);
    });

    render(viewItems);
  };

  const openLightbox = (src, title) => {
    if (!modalEl || !imgEl || typeof bootstrap === "undefined") return;

    titleEl.textContent = title || "";
    imgEl.src = src || "";
    imgEl.alt = title || "";

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  };

  const wireLightbox = () => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".js-lightbox");
      if (!btn) return;

      const src = btn.getAttribute("data-src") || "";
      const title = btn.getAttribute("data-title") || "";
      if (!src) return;

      e.preventDefault();
      openLightbox(src, title);
    });

    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", () => {
        imgEl.removeAttribute("src");
        imgEl.setAttribute("alt", "");
        titleEl.textContent = "";
      });
    }
  };

  const loadManifest = async () => {
    setStatus("Loading...");
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Manifest request failed: ${res.status}`);
    const data = await res.json();
    return normalizeManifest(data);
  };

  const init = async () => {
    try {
      allItems = await loadManifest();
      viewItems = allItems.slice();
      render(viewItems);
      wireLightbox();

      if (searchEl) {
        searchEl.addEventListener("input", applySearch, { passive: true });
      }

      if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
          viewItems = shuffle(viewItems);
          render(viewItems);
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (searchEl) searchEl.value = "";
          viewItems = allItems.slice();
          render(viewItems);
        });
      }
    } catch (err) {
      setStatus("Could not load images. Check /nu_images/manifest.json exists and is valid JSON.");
    }
  };

  init();
})();