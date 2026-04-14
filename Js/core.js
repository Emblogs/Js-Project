/* 
   NAIJAFARM MANAGER — core.js
   Shared utility functions used across all pages.
   Handles: localStorage DB, toasts, age calculation,
            currency formatting, date formatting, ID gen.
    */


/*
   DATABASE HELPERS
   Thin wrapper around localStorage for typed read/write.
   All keys are prefixed with "nfm_" to avoid collisions.
    */
const DB = {
  /* Read an array from storage (returns [] if missing/corrupt) */
  get(key) {
    try { return JSON.parse(localStorage.getItem('nfm_' + key)) || []; }
    catch { return []; }
  },
  /* Write any value to storage */
  set(key, val) {
    localStorage.setItem('nfm_' + key, JSON.stringify(val));
  },
  /* Read a single object from storage (returns {} if missing) */
  getOne(key) {
    try { return JSON.parse(localStorage.getItem('nfm_' + key)) || {}; }
    catch { return {}; }
  }
};


/* 
   TOAST NOTIFICATIONS
   Shows a temporary bottom-right message. Auto-removes after 3.2s.
    */
function showToast(msg, type = 'success') {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast toast--' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}


/* 
   AGE CALCULATOR
   Returns { text: "2 yrs 3 mo", days: 820 } from a date string.
   */
function calcAge(dateStr) {
  if (!dateStr) return { text: 'N/A', days: 0 };
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000);
  if (diff < 30)  return { text: `${diff} days`, days: diff };
  if (diff < 365) return { text: `${Math.floor(diff/30)} months, ${diff%30} days`, days: diff };
  const yrs = Math.floor(diff / 365);
  const rem = Math.floor((diff % 365) / 30);
  return { text: `${yrs} yr${yrs > 1 ? 's' : ''} ${rem} mo`, days: diff };
}


/* 
   CURRENCY FORMATTER — formats number as ₦45,000
   */
function formatNaira(n) {
  return '₦' + Number(n).toLocaleString('en-NG');
}


/* 
   DATE FORMATTER — "12 Apr 2025"
   */
function formatDate(d) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}


/* 
   UNIQUE ID GENERATOR — short alphanumeric string
  */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}


/* 
   SESSION HELPERS
    */
function getSession() {
  try { return JSON.parse(localStorage.getItem('nfm_session')); } catch { return null; }
}

function logout() {
  localStorage.removeItem('nfm_session');
  window.location.href = 'landing.html';
}

/* Guard — call on any protected page to redirect if not logged in */
function requireAuth() {
  const s = getSession();
  if (!s || !s.user) { window.location.href = 'landing.html'; return null; }
  /* Show username in nav if element exists */
  const el = document.getElementById('navUser');
  if (el && s.name) el.textContent = s.name;
  return s;
}


/* 
   GO HOME
   Called when the nav logo is clicked inside the dashboard.
   - If logged in  → stay on dashboard (index.html)
   - If logged out → go to landing page
    */
function goHome(e) {
  e.preventDefault();
  const s = getSession();
  if (s && s.user) {
    window.location.href = 'index.html';
  } else {
    window.location.href = 'landing.html';
  }
}
