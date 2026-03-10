/* ══════════════════════════════════════════
   CONCEPT — Chat-First Healthcare
   Control panel + phone frame scaling
══════════════════════════════════════════ */

/* Scale all phone frames to 125% on load */
(function () {
  var pct = 125;
  var w = Math.round(280 * pct / 100);
  var h = Math.round(580 * pct / 100);
  document.querySelectorAll('.phone-frame').forEach(function (el) {
    el.style.width  = w + 'px';
    el.style.height = h + 'px';
    el.style.fontSize = (13 * pct / 100) + 'px';
  });
})();

/* Live CSS variable updates from color pickers */
function setVar(varName, inputEl) {
  document.documentElement.style.setProperty(varName, inputEl.value);
  var hexEl = inputEl.parentElement.querySelector('.ctrl-hex');
  if (hexEl) hexEl.textContent = inputEl.value;
}

/* Gap slider */
function updateGap(inputEl) {
  document.getElementById('gap-val').textContent = inputEl.value + 'px';
  document.getElementById('main-grid').style.gap = '32px ' + inputEl.value + 'px';
}

/* Column count select */
function updateColumns(val) {
  document.getElementById('main-grid').style.gridTemplateColumns = 'repeat(' + val + ', 1fr)';
}

/* Scale slider — resize all phone frames live */
function updateScale(inputEl) {
  var pct = parseInt(inputEl.value, 10);
  document.getElementById('scale-val').textContent = pct + '%';
  var w = Math.round(280 * pct / 100);
  var h = Math.round(580 * pct / 100);
  document.querySelectorAll('.phone-frame').forEach(function (el) {
    el.style.width  = w + 'px';
    el.style.height = h + 'px';
    el.style.fontSize = (13 * pct / 100) + 'px';
  });
}

/* Toggle control panel visibility */
function toggleControls() {
  var panel  = document.getElementById('ctrl-panel');
  var btn    = document.getElementById('ctrl-toggle');
  var lbl    = document.getElementById('ctrl-toggle-label');
  var icon   = btn.querySelector('.material-icons');
  var hidden = panel.classList.toggle('ctrl-hidden');
  document.body.classList.toggle('ctrl-hidden', hidden);
  btn.setAttribute('aria-expanded', String(!hidden));
  lbl.textContent  = hidden ? 'Show Controls' : 'Hide Controls';
  icon.textContent = hidden ? 'settings'       : 'tune';
}

document.getElementById('ctrl-toggle').addEventListener('click', toggleControls);
