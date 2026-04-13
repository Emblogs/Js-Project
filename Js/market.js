/* ==========================================================
   NAIJAFARM — market.js
   Logic for the Buy & Sell Market page.
   Handles: posting listings, filtering, rendering cards.
   ========================================================== */

let deleteId     = null;
let activeFilter = 'all'; /* current category filter */


/* ----------------------------------------------------------
   CATEGORY DETECTION
   Maps a listing type string to a broad category.
   ---------------------------------------------------------- */
function getCategory(type) {
  if (!type) return 'Other';
  const animalTypes = ['Cattle for Sale','Goats for Sale','Sheep for Sale','Pigs for Sale',
                       'Poultry (Broiler)','Poultry (Layers)','Fish Stock','Other Animals'];
  const landTypes   = ['Farm Land for Sale','Farm Land for Lease'];
  if (animalTypes.includes(type)) return 'Animals';
  if (landTypes.includes(type))   return 'Land';
  return 'Equipment';
}


/* ----------------------------------------------------------
   SHOW / HIDE LAND SIZE FIELD
   Called when the listing type select changes.
   ---------------------------------------------------------- */
function toggleLandFields() {
  const t    = document.getElementById('lType').value;
  const show = t === 'Farm Land for Sale' || t === 'Farm Land for Lease';
  document.getElementById('landSizeGroup').style.display = show ? '' : 'none';
}


/* ----------------------------------------------------------
   ADD LISTING
   intent: 'sell' or 'buy'
   ---------------------------------------------------------- */
function addListing(intent) {
  const type     = document.getElementById('lType').value;
  const title    = document.getElementById('lTitle').value.trim();
  const price    = document.getElementById('lPrice').value;
  const location = document.getElementById('lLocation').value.trim();
  const phone    = document.getElementById('lPhone').value.trim();

  if (!type || !title || !price || !location || !phone) {
    showToast('Please fill all required fields (*)', 'error');
    return;
  }

  const listings = DB.get('listings');
  listings.push({
    id:       uid(), type, title, price,
    qty:      document.getElementById('lQty').value,
    location, phone,
    landSize: document.getElementById('lLandSize').value,
    details:  document.getElementById('lDetails').value,
    intent,
    category: getCategory(type),
    createdAt: new Date().toISOString()
  });
  DB.set('listings', listings);
  showToast('Listing posted!');

  /* Reset form */
  ['lTitle','lPrice','lQty','lLocation','lPhone','lLandSize','lDetails'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('lType').value = '';
  document.getElementById('landSizeGroup').style.display = 'none';

  render();
}


/* ----------------------------------------------------------
   FILTER TABS
   ---------------------------------------------------------- */
function filterListings(f) {
  activeFilter = f;
  /* Update tab active states */
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === f);
  });
  render();
}


/* ----------------------------------------------------------
   DELETE MODAL
   ---------------------------------------------------------- */
function openDelModal(id)  { deleteId = id; document.getElementById('delModal').classList.add('open'); }
function closeDelModal()   { deleteId = null; document.getElementById('delModal').classList.remove('open'); }
function confirmDelete() {
  DB.set('listings', DB.get('listings').filter(l => l.id !== deleteId));
  closeDelModal();
  showToast('Listing removed', 'error');
  render();
}


/* ----------------------------------------------------------
   CATEGORY ICON MAP
   Maps listing type to a Lucide icon name.
   ---------------------------------------------------------- */
const TYPE_ICON = {
  'Cattle for Sale':'beef', 'Goats for Sale':'rabbit', 'Sheep for Sale':'rabbit',
  'Pigs for Sale':'pig', 'Poultry (Broiler)':'bird', 'Poultry (Layers)':'bird',
  'Fish Stock':'fish', 'Other Animals':'paw-print',
  'Farm Land for Sale':'land-plot', 'Farm Land for Lease':'file-text',
  'Tractor for Sale':'tractor', 'Farm Tools':'wrench',
  'Irrigation Equipment':'droplets', 'Other Equipment':'settings'
};


/* ----------------------------------------------------------
   RENDER LISTING CARDS
   ---------------------------------------------------------- */
function render() {
  let listings = DB.get('listings');

  /* Apply category filter */
  if (activeFilter !== 'all') {
    listings = listings.filter(l => l.category === activeFilter);
  }

  const el = document.getElementById('listingGrid');

  if (!listings.length) {
    el.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon"><i data-lucide="shopping-cart"></i></div>
        <p>No listings yet. Post your first listing above!</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = listings.slice().reverse().map(l => {
    const icon = TYPE_ICON[l.type] || 'package';
    return `
      <div class="listing-card">
        <div class="listing-img">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="listing-body">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <span class="badge ${l.intent === 'sell' ? 'badge-green' : 'badge-blue'}">${l.intent === 'sell' ? 'For Sale' : 'Wanted'}</span>
            <span class="badge badge-gold">${l.category}</span>
          </div>
          <div class="listing-title">${l.title}</div>
          <div class="listing-price">${formatNaira(l.price)}</div>
          <div class="listing-meta">
            <i data-lucide="map-pin"></i> ${l.location}
            ${l.qty ? ` &nbsp;·&nbsp; <i data-lucide="package"></i> ${l.qty}` : ''}
            ${l.landSize ? ` &nbsp;·&nbsp; <i data-lucide="ruler"></i> ${l.landSize} ha` : ''}
          </div>
          ${l.details ? `<div class="listing-details">${l.details}</div>` : ''}
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
            <a href="tel:${l.phone}" class="btn btn-primary btn-sm">
              <i data-lucide="phone"></i> ${l.phone}
            </a>
            <button class="btn btn-danger btn-sm" onclick="openDelModal('${l.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
          <div style="font-size:0.73rem;color:var(--text-muted);margin-top:8px">${formatDate(l.createdAt)}</div>
        </div>
      </div>`;
  }).join('');

  lucide.createIcons();
}

/* INIT */
(function init() { requireAuth(); render(); })();
