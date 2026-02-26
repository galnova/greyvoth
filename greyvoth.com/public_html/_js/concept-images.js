(() => {
  const GRID_ID = "galleryGrid";
  const STATUS_ID = "galleryStatus";
  const MODAL_ID = "lightboxModal";
  const MODAL_TITLE_ID = "lightboxTitle";
  const MODAL_IMG_ID = "lightboxImg";

  const IMAGES_URL = "_js/concept-images.json";
  const IMAGE_BASE = "concept_images/";

  const grid = document.getElementById(GRID_ID);
  const status = document.getElementById(STATUS_ID);

  if (!grid) return;

  const setStatus = (msg) => {
    if (status) status.textContent = msg || "";
  };

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const normalize = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.images)) return data.images;
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

  const prettyTitle = (filename) =>
    String(filename || "")
      .split("?")[0]
      .split("#")[0]
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const loadImages = async () => {
    const res = await fetch(IMAGES_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = await res.json();
    const list = normalize(data);
    if (!Array.isArray(list) || list.length === 0)
      throw new Error("concept-images.json is empty or not an array");
    return list
      .map((x) => (typeof x === "string" ? x : x?.file))
      .filter((x) => typeof x === "string" && x.trim().length)
      .map((x) => x.trim());
  };

  const cardHTML = (filename) => {
    const src = IMAGE_BASE + filename;
    const title = prettyTitle(filename);

    return `
      <div class="col-6 col-md-4 col-lg-3 portfolio-item">
        <div class="portfolio-card h-100">
          <button type="button"
                  class="portfolio-media js-lightbox"
                  data-src="${esc(src)}"
                  data-name="${esc(filename)}"
                  aria-label="Open ${esc(title)}">
            <img src="${esc(src)}"
                 alt="${esc(title)}"
                 loading="lazy"
                 decoding="async">
          </button>
          <div class="card-body">
            <h4 class="mb-0">${esc(title)}</h4>
          </div>
        </div>
      </div>
    `;
  };

  const render = (files) => {
    grid.innerHTML = files.map(cardHTML).join("");
    setStatus(`${files.length} images loaded`);
  };

  const initLightbox = () => {
    const modalEl = document.getElementById(MODAL_ID);
    if (!modalEl || typeof bootstrap === "undefined") return;

    const titleEl = document.getElementById(MODAL_TITLE_ID);
    const imgEl = document.getElementById(MODAL_IMG_ID);
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".js-lightbox");
      if (!btn) return;

      const src = btn.getAttribute("data-src") || "";
      const originalName = btn.getAttribute("data-name") || src;
      const title = prettyTitle(originalName);

      if (titleEl) titleEl.textContent = title;

      if (imgEl) {
        imgEl.src = src;
        imgEl.alt = title;
      }

      modal.show();
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
      if (imgEl) {
        imgEl.removeAttribute("src");
        imgEl.setAttribute("alt", "");
      }
      if (titleEl) titleEl.textContent = "";
    });
  };

  (async () => {
    try {
      setStatus("Loading images...");
      const files = await loadImages();
      const randomFiles = shuffle(files);
      render(randomFiles);
      initLightbox();
    } catch (err) {
      setStatus(
        `Could not load images. Check ${IMAGES_URL} exists + is valid JSON. (${err?.message || err})`
      );
    }
  })();
})();