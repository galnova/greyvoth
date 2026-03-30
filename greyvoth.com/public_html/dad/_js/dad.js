// Drawing descriptions shown on hover and in the modal
const THEMES = [
  "door with eyes",                    "sideways staircase",            "veined wing bat demon",         "giant cracked skull",
  "wall stitched with faces",          "changeling assassin",           "locked iron gate",              "mad mage",
  "statue with bleeding eyes",         "swinging blades",               "porcelain doll",                "staircase made of books",
  "lantern-headed warden",             "floating stone cubes",          "wax-melting priest",            "singularity",
  "eyeless deer horror",               "mouth-shaped tunnel",           "spine-whip abomination",        "pool creature",
  "hallway of shifting panels",        "axe-crowned king",              "upside down throne",            "spider webbed zombie",
  "chain-dragging penitent",           "hanging body tree",             "living doorway",                "pool of darkness",
  "many-eyed serpent",                 "cloaked figure",                "caged madness",                 "black slime"
];

// Actual image filenames — null means not yet drawn
const FILES = [
    1,    2,   61,    3,   17,   85,   73,   79,
   14,   60,   57,   20,    9,   10,   33,   56,
   41,   42,   77,   62,   87,   88,   16,   22,
  null, null,    7,   37,  100,   64, null,   92
];

const grid       = document.getElementById('grid');
const modal      = document.getElementById('modal');
const modalBg    = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalDay   = document.getElementById('modal-day');
const modalTheme = document.getElementById('modal-theme');
const modalImage = document.getElementById('modal-image');
const modalPrev  = document.getElementById('modal-prev');
const modalNext  = document.getElementById('modal-next');

let current   = 0;
let lastFocus = null;

function pad(n) {
  return String(n).padStart(2, '0');
}

/* ── Build grid ──────────────────────────────── */
THEMES.forEach((theme, i) => {
  const day  = i + 1;
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.setAttribute('role', 'listitem');

  const btn = document.createElement('button');
  btn.className = 'tile-btn';
  btn.setAttribute('aria-label', `Day ${pad(day)}: ${theme}`);

  const dayLabel = document.createElement('span');
  dayLabel.className = 'tile-day';
  dayLabel.textContent = pad(day);
  dayLabel.setAttribute('aria-hidden', 'true');

  const img = document.createElement('img');
  img.className = 'tile-img';
  if (FILES[i] !== null) {
    img.src = `./_img/${FILES[i]}.png`;
  } else {
    img.classList.add('missing');
  }
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.addEventListener('error', function () {
    this.classList.add('missing');
  });

  const overlay = document.createElement('div');
  overlay.className = 'tile-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.className = 'tile-theme';
  label.textContent = theme;
  overlay.appendChild(label);

  btn.appendChild(img);
  btn.appendChild(overlay);
  btn.appendChild(dayLabel);
  btn.addEventListener('click', () => openModal(i));

  tile.appendChild(btn);
  grid.appendChild(tile);
});

/* ── Modal logic ─────────────────────────────── */
function openModal(index) {
  current   = index;
  lastFocus = document.activeElement;
  applyModal();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (lastFocus) lastFocus.focus();
}

function applyModal() {
  const day = current + 1;
  modalDay.textContent   = `Day ${pad(day)}`;
  modalTheme.textContent = THEMES[current];
  modalImage.classList.remove('missing', 'rotated');
  if (FILES[current] !== null) {
    modalImage.src = `./_img/${FILES[current]}.png`;
  } else {
    modalImage.removeAttribute('src');
    modalImage.classList.add('missing');
  }
  modalImage.alt = FILES[current] !== null ? THEMES[current] : '';
  if (day >= 17) {
    modalImage.classList.add('rotated');
  }
}

function navigate(dir) {
  current = (current + dir + THEMES.length) % THEMES.length;
  applyModal();
}

modalImage.addEventListener('error', function () {
  this.classList.add('missing');
});

modalBg.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => navigate(-1));
modalNext.addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape')     closeModal();
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

/* ── Flip grid ───────────────────────────────── */
const flipBtn   = document.getElementById('flip-btn');
const flipLabel = document.getElementById('flip-label');
flipBtn.addEventListener('click', () => {
  const flipped = grid.classList.toggle('flipped');
  flipBtn.setAttribute('aria-pressed', String(flipped));
  flipLabel.textContent = flipped
    ? 'Rotate to see 1\u2009\u20131\u20096 right side up'
    : 'Rotate to see 17\u2009\u201332 right side up';
});