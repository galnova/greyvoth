// Drawing descriptions shown on hover and in the modal
const THEMES = [
  "door with eyes",                    "sideways staircase",            "veined wing bat demon",         "giant cracked skull",
  "wall stitched with faces",          "changeling assassin",           "locked iron gate",              "mad mage",
  "statue with bleeding eyes",         "swinging blades",               "porcelain doll",                "staircase made of books",
  "lantern-headed warden",             "floating stone cubes",          "wax-melting priest",            "singularity",
  "eyeless deer horror",               "mouth-shaped tunnel",           "spine-whip abomination",        "pool creature",
  "hallway of shifting panels",        "axe-crowned king",              "upside down throne",            "spider webbed zombie",
  "chain-dragging penitent",           "hanging body tree",             "living doorway",                "pool of darkness",
  "many-eyed serpent",                 "caged madness",                 "cloaked figure",                "black slime"
];

// Actual image filenames — null means not yet drawn
const FILES = [
   1,  2,  3,  4,  5,  6,  7,  8,
   9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32
];

const MODAL_FILES = [
  'm-1',  'm-2',  'm-3',  'm-4',  'm-5',  'm-6',  'm-7',  'm-8',
  'm-9',  'm-10', 'm-11', 'm-12', 'm-13', 'm-14', 'm-15', 'm-16',
  'm-17', 'm-18', 'm-19', 'm-20', 'm-21', 'm-22', 'm-23', 'm-24',
  'm-25', 'm-26', 'm-27', 'm-28', 'm-29', 'm-30', 'm-31', 'm-32'
];

const DESCRIPTIONS = [
  "I didn't know what I was in for when I started. So I just rushed starting.",
  "This one was rough. It came out okay but I wasn't feeling it.",
  "I tried and tried to draw veins but it was hard with the ink to show it.",
  "The skull was when I started feeling it. I was having fun now!",
  "The faces were kind of meh but it was fun to think about it.",
  "This was very fun. A gatekeeper of sorts.",
  "Figuring out how to simplify chains is going to pay off later.",
  "Mad I visualized as upside down. I had fun with this one.",
  "The statue was tricky but I kept working at it.",
  "The swinging blades got too busy but I had fun drawing it.",
  "A creepy doll always makes a dungeon complete.",
  "The stairway of books was also challenging to conceive.",
  "The torch head gets lost a bit but I like the character.",
  "Nothing much to say about this one haha.",
  "Wax was challenging to draw but I like the priest.",
  "One of One!",
  "The no eyes part is so creepy.",
  "You can kind of see the mouth!",
  "The spine thing threw me but I tried!",
  "The creature looks too happy!!!",
  "I like how the panels came out.",
  "HE is responsible for all of this.",
  "Every king needs a throne.",
  "Gotta love a fun zombie drawing.",
  "This figure was actually the last one I drew and also the most memorable.",
  "Very creepy visual but there is a story here if you want to imagine it.",
  "Living. Alive. Creepy.",
  "This pool bleeds into the creature's pool!",
  "I took my shot at inking a serpent.",
  "Madness personified.",
  "This cloaked figure controls the serpent.",
  "Not much to say about this except I laid the ink down heavily."
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
const modalDesc  = document.getElementById('modal-desc');

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
  const day       = current + 1;
  const modalFile = MODAL_FILES[current] ?? FILES[current];
  modalDay.textContent   = `Day ${pad(day)}`;
  modalTheme.textContent = THEMES[current];
  modalImage.classList.remove('missing');
  if (modalFile !== null) {
    modalImage.src = `./_img/${modalFile}.png`;
  } else {
    modalImage.removeAttribute('src');
    modalImage.classList.add('missing');
  }
  modalImage.alt = modalFile !== null ? THEMES[current] : '';
  const desc = DESCRIPTIONS[current];
  modalDesc.textContent = desc || '';
  modalDesc.hidden = !desc;
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

/* ── Lightbox ────────────────────────────────── */
const lightbox       = document.getElementById('lightbox');
const lightboxBg     = document.getElementById('lightbox-backdrop');
const lightboxClose  = document.getElementById('lightbox-close');
const lightboxImage  = document.getElementById('lightbox-image');
let lightboxLastFocus = null;

function openLightbox(img) {
  lightboxLastFocus = document.activeElement;
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (lightboxLastFocus) lightboxLastFocus.focus();
}

document.querySelectorAll('[data-lightbox]').forEach(img => {
  img.addEventListener('click', () => openLightbox(img));
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img); }
  });
});

lightboxBg.addEventListener('click', closeLightbox);
lightboxClose.addEventListener('click', closeLightbox);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('open'))   closeModal();
    if (lightbox.classList.contains('open')) closeLightbox();
  }
  if (modal.classList.contains('open')) {
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }
});

/* ── Music player ────────────────────────────── */
const bgAudio   = document.getElementById('bg-audio');
const musicBtn  = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
musicBtn.addEventListener('click', () => {
  const playing = bgAudio.paused;
  playing ? bgAudio.play() : bgAudio.pause();
  musicBtn.setAttribute('aria-pressed', String(playing));
  musicBtn.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  musicIcon.classList.toggle('fa-play', !playing);
  musicIcon.classList.toggle('fa-pause', playing);
});

/* ── Flip grid ───────────────────────────────── */
const flipBtn   = document.getElementById('flip-btn');
const flipLabel = document.getElementById('flip-label');
flipBtn.addEventListener('click', () => {
  const flipped = grid.classList.toggle('flipped');
  flipBtn.setAttribute('aria-pressed', String(flipped));
  flipLabel.textContent = flipped
    ? 'Rotate to see 1 - 16 right side up'
    : 'Rotate to see 17 - 32 right side up';
});