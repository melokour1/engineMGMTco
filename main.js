/* ============================================================
   EngineMgmt — Shared JS
   ============================================================ */

const WEBHOOK_URL = 'https://mohammedelokour.app.n8n.cloud/webhook/emc-form-submission';

function getUTMs() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    referrer: document.referrer || ''
  };
}

// Homepage email signup
async function submitHomepageForm(e) {
  e.preventDefault();
  const form = e.target;
  const msgEl = form.querySelector('.form-message');
  const btn = form.querySelector('button[type="submit"]');
  const origBtnText = btn.textContent;

  msgEl.className = 'form-message';
  msgEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const payload = {
    form_type: 'homepage',
    name: form.name.value.trim() || 'Subscriber',
    email: form.email.value.trim(),
    website: form.website.value,
    ...getUTMs()
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({ success: false }));

    if (data.success) {
      msgEl.className = 'form-message success';
      msgEl.textContent = '✓ Check your email — your video link is on the way.';
      form.reset();
    } else {
      msgEl.className = 'form-message error';
      msgEl.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    msgEl.className = 'form-message error';
    msgEl.textContent = 'Network error. Please try again.';
  } finally {
    btn.disabled = false;
    btn.textContent = origBtnText;
  }
}

// Watch page intake form — unlocks video on success
async function submitIntakeForm(e) {
  e.preventDefault();
  const form = e.target;
  const msgEl = form.querySelector('.form-message');
  const btn = form.querySelector('button[type="submit"]');
  const origBtnText = btn.textContent;

  msgEl.className = 'form-message';
  msgEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Unlocking...';

  const payload = {
    form_type: 'strategy',  // sends to Applications sheet (hot leads)
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    industry: form.industry.value.trim(),
    current_marketing_spend: form.current_marketing_spend.value.trim() || 'not_provided',
    message: form.message.value.trim() || 'Requested free video via watch page intake',
    website: form.website.value,
    ...getUTMs()
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({ success: false }));

    if (data.success) {
      // Hide intake, show video + offer
      document.getElementById('intakeSection').style.display = 'none';
      document.getElementById('videoSection').style.display = 'block';
      document.getElementById('offerSection').style.display = 'block';
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      msgEl.className = 'form-message error';
      msgEl.textContent = 'Something went wrong. Please try again.';
      btn.disabled = false;
      btn.textContent = origBtnText;
    }
  } catch (err) {
    msgEl.className = 'form-message error';
    msgEl.textContent = 'Network error. Please try again.';
    btn.disabled = false;
    btn.textContent = origBtnText;
  }
}

// Strategy page application form
async function submitStrategyForm(e) {
  e.preventDefault();
  const form = e.target;
  const msgEl = form.querySelector('.form-message');
  const btn = form.querySelector('button[type="submit"]');
  const origBtnText = btn.textContent;

  msgEl.className = 'form-message';
  msgEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const payload = {
    form_type: 'strategy',
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    industry: form.industry.value.trim(),
    current_marketing_spend: form.current_marketing_spend.value.trim(),
    message: form.message.value.trim(),
    website: form.website.value,
    ...getUTMs()
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({ success: false }));

    if (data.success) {
      msgEl.className = 'form-message success';
      msgEl.textContent = '✓ Application received. We\'ll be in touch within 24 hours.';
      form.reset();
    } else {
      msgEl.className = 'form-message error';
      msgEl.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    msgEl.className = 'form-message error';
    msgEl.textContent = 'Network error. Please try again.';
  } finally {
    btn.disabled = false;
    btn.textContent = origBtnText;
  }
}

// Tips page form — sends lead and shows success message
async function submitTipsForm(e) {
  e.preventDefault();
  const form = e.target;
  const msgEl = form.querySelector('.form-message');
  const btn = form.querySelector('button[type="submit"]');
  const origBtnHTML = btn.innerHTML;

  msgEl.className = 'form-message';
  msgEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const timeline = form.querySelector('input[name="timeline"]:checked');

  const payload = {
    form_type: 'tips',
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    business_name: form.business_name.value.trim(),
    business_website: form.business_website.value.trim() || 'not_provided',
    google_maps_url: form.google_maps_url.value.trim() || 'not_provided',
    timeline: timeline ? timeline.value : 'not_provided',
    honeypot: form.website.value,
    ...getUTMs()
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({ success: false }));

    if (data.success) {
      msgEl.className = 'form-message success';
      msgEl.textContent = '✓ Done! Check your email — your free video is on the way.';
      form.reset();
    } else {
      msgEl.className = 'form-message error';
      msgEl.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    msgEl.className = 'form-message error';
    msgEl.textContent = 'Network error. Please try again.';
  } finally {
    btn.disabled = false;
    btn.innerHTML = origBtnHTML;
  }
}

// Before/After map toggle
function initMapToggle() {
  const toggleBtns = document.querySelectorAll('.map-toggle button');
  if (!toggleBtns.length) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const state = btn.dataset.state;
      document.querySelectorAll('.map-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateMapVisual(state);
    });
  });
  updateMapVisual('before');
}

function updateMapVisual(state) {
  const mapEl = document.getElementById('mapVisual');
  const stats = {
    before: { rank: '86', share: '1%', clicks: '5', clients: '1-2', color: '#d33939' },
    after:  { rank: '2',  share: '82%', clicks: '80', clients: '15+', color: '#22c55e' }
  };
  const s = stats[state];
  const rankEl = document.getElementById('statRank');
  if (rankEl) rankEl.textContent = s.rank;
  const shareEl = document.getElementById('statShare');
  if (shareEl) shareEl.textContent = s.share;
  const clicksEl = document.getElementById('statClicks');
  if (clicksEl) clicksEl.textContent = s.clicks;
  const clientsEl = document.getElementById('statClients');
  if (clientsEl) clientsEl.textContent = s.clients;
  if (mapEl) mapEl.innerHTML = generateMapSVG(s.color, state);
}

function generateMapSVG(color, state) {
  const rows = 11, cols = 14;
  const cellW = 640 / cols, cellH = 360 / rows;
  let dots = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = cellW * c + cellW / 2;
      const cy = cellH * r + cellH / 2;
      const label = state === 'after' ? '1' : (Math.random() > 0.88 ? (Math.floor(Math.random()*15)+1) : '20');
      dots += `<g><circle cx="${cx}" cy="${cy}" r="14" fill="${color}" opacity="0.9"/><text x="${cx}" y="${cy+4}" text-anchor="middle" fill="white" font-size="11" font-weight="700" font-family="Inter">${label}</text></g>`;
    }
  }
  return `<svg viewBox="0 0 640 360" class="map-grid-svg"><rect width="640" height="360" fill="#f0ebe0"/>${dots}</svg><div class="sample-tag">Sample data</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const homeForm = document.getElementById('homepageForm');
  if (homeForm) homeForm.addEventListener('submit', submitHomepageForm);

  const intakeForm = document.getElementById('intakeForm');
  if (intakeForm) intakeForm.addEventListener('submit', submitIntakeForm);

  const stratForm = document.getElementById('strategyForm');
  if (stratForm) stratForm.addEventListener('submit', submitStrategyForm);

  const tipsForm = document.getElementById('tipsForm');
  if (tipsForm) tipsForm.addEventListener('submit', submitTipsForm);

  initMapToggle();
});
