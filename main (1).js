/* ============================================================
   ENGINE MANAGEMENT CO — main.js
   Drop-in replacement — handles:
   - UTM capture
   - FAQ button accordion (replaces <details> pattern)
   - Before/After map toggle
   - Homepage form
   - Strategy application form
   - Tips form
   ============================================================ */

const WEBHOOK_URL = 'https://mohammedelokour.app.n8n.cloud/webhook/emc-form-submission';

/* ── UTM capture ── */
(function () {
  const p = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => {
    if (p.get(k)) sessionStorage.setItem(k, p.get(k));
  });
})();

function getUTMs() {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const out = {};
  keys.forEach(k => { const v = sessionStorage.getItem(k); if (v) out[k] = v; });
  return out;
}

/* ── Generic submit helper ── */
async function submitForm(formEl, msgEl, payload) {
  if (formEl.querySelector('[name="website"]')?.value) return; // honeypot

  const btn = formEl.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, ...getUTMs(), page: window.location.pathname }),
    });

    if (res.ok) {
      msgEl.style.display = 'block';
      msgEl.style.color = 'var(--ink)';
      msgEl.textContent = '✓ Got it! Check your inbox shortly.';
      formEl.reset();
    } else {
      throw new Error('non-2xx');
    }
  } catch {
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.color = '#b00020';
      msgEl.textContent = 'Something went wrong — please email mohammed@enginemanagement.co directly.';
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

/* ── FAQ button accordion ── */
/* Works on both strategy.html and tips.html */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');
  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.faq-item').forEach(other => {
      const otherBtn = other.querySelector('.faq-q');
      const otherAns = other.querySelector('.faq-a');
      if (otherBtn && otherAns) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAns.hidden = true;
      }
    });

    // Toggle this one
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});

/* ── Before/After map toggle ── */
const mapToggle = document.querySelector('.map-toggle');
if (mapToggle) {
  const statRank   = document.getElementById('statRank');
  const statShare  = document.getElementById('statShare');
  const statClicks = document.getElementById('statClicks');
  const statClients = document.getElementById('statClients');
  const mapVisual  = document.getElementById('mapVisual');

  const states = {
    before: { rank: '86', share: '1%', clicks: '5', clients: '1–2', color: '#e5e0d8' },
    after:  { rank: 'Top 3', share: '40%+', clicks: '200+', clients: '15–20', color: '#0a0a0a' },
  };

  mapToggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      mapToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const s = states[btn.dataset.state];
      if (statRank)    statRank.textContent   = s.rank;
      if (statShare)   statShare.textContent  = s.share;
      if (statClicks)  statClicks.textContent = s.clicks;
      if (statClients) statClients.textContent = s.clients;
      if (mapVisual)   mapVisual.style.background = s.color;
    });
  });
}

/* ── Homepage email form ── */
const homepageForm = document.getElementById('homepageForm');
if (homepageForm) {
  const msgEl = homepageForm.querySelector('.form-message');
  homepageForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!homepageForm.checkValidity()) { homepageForm.reportValidity(); return; }
    submitForm(homepageForm, msgEl, {
      form_type: 'homepage',
      email: homepageForm.email.value,
    });
  });
}

/* ── Strategy application form ── */
const strategyForm = document.getElementById('strategyForm');
if (strategyForm) {
  const msgEl = strategyForm.querySelector('.form-message');
  strategyForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!strategyForm.checkValidity()) { strategyForm.reportValidity(); return; }
    const fd = new FormData(strategyForm);
    submitForm(strategyForm, msgEl, {
      form_type:               'strategy',
      first_name:              fd.get('first_name'),
      last_name:               fd.get('last_name'),
      phone:                   fd.get('phone'),
      email:                   fd.get('email'),
      industry:                fd.get('industry'),
      current_marketing_spend: fd.get('current_marketing_spend'),
      message:                 fd.get('message'),
    });
  });
}

/* ── Tips form ── */
const tipsForm = document.getElementById('tipsForm');
if (tipsForm) {
  const msgEl = tipsForm.querySelector('.form-message');
  tipsForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!tipsForm.checkValidity()) { tipsForm.reportValidity(); return; }
    const fd = new FormData(tipsForm);
    submitForm(tipsForm, msgEl, {
      form_type:       'tips',
      first_name:      fd.get('first_name'),
      last_name:       fd.get('last_name'),
      email:           fd.get('email'),
      phone:           fd.get('phone'),
      business_name:   fd.get('business_name'),
      business_website: fd.get('business_website'),
      google_maps_url: fd.get('google_maps_url'),
      timeline:        fd.get('timeline'),
    });
  });
}
