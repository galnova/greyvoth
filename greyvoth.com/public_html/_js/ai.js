const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

const qrEl = document.getElementById('qr-postcard');
if (qrEl) {
  new QRCode(qrEl, {
    text: 'https://greyvoth.com/about',
    width: 110,
    height: 110,
    colorDark: '#14224a',
    colorLight: '#f0f4fa',
    correctLevel: QRCode.CorrectLevel.H
  });
}

const qrPrint = document.getElementById('qr-print');
if (qrPrint) {
  new QRCode(qrPrint, {
    text: 'https://greyvoth.com/about',
    width: 80,
    height: 80,
    colorDark: '#f6f7fb',
    colorLight: '#14224a',
    correctLevel: QRCode.CorrectLevel.H
  });
}

const qrBizcard = document.getElementById('qr-bizcard');
if (qrBizcard) {
  new QRCode(qrBizcard, {
    text: 'https://greyvoth.com/about',
    width: 60,
    height: 60,
    colorDark: '#f6f7fb',
    colorLight: '#14224a',
    correctLevel: QRCode.CorrectLevel.H
  });
}