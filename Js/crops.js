/* ==========================================================
   NAIJAFARM — crops.js
   All logic for the Crops Tracker page.
   Handles: adding, deleting, rendering crop records.
   ========================================================== */

/* Track which record is pending deletion */
let deleteId = null;


/* ----------------------------------------------------------
   STATUS BADGE HELPER
   Returns a colour-coded badge HTML string for a crop status.
   ---------------------------------------------------------- */
function statusBadge(s) {
  const map = {
    'Growing':   'badge-green',
    'Harvested': 'badge-blue',
    'Failed':    'badge-red',
    'Dormant':   'badge-gold'
  };
  return `<span class="badge ${map[s] || 'badge-gold'}">${s}</span>`;
}


/* ----------------------------------------------------------
   HARVEST COUNTDOWN
   Calculates days remaining to harvest and returns a badge.
   Returns empty string if harvestDays is not set.
   ---------------------------------------------------------- */
function getHarvestBadge(planted, harvestDays) {
  if (!harvestDays || !planted) return '';

  const harvestDate = new Date(planted);
  harvestDate.setDate(harvestDate.getDate() + parseInt(harvestDays));

  const daysLeft = Math.ceil((harvestDate - new Date()) / 86400000);

  if (daysLeft < 0)  return `<span class="badge badge-blue">Overdue ${Math.abs(daysLeft)}d</span>`;
  if (daysLeft === 0) return `<span class="badge badge-green">Harvest Today!</span>`;
  return `<span class="badge badge-gold">${daysLeft}d to harvest</span>`;
}


/* ----------------------------------------------------------
   GROWTH PROGRESS PERCENTAGE
   Returns 0–100 based on how far through the growing cycle the crop is.
   ---------------------------------------------------------- */
function growthPercent(planted, harvestDays) {
  if (!harvestDays || !planted) return 0;
  return Math.min(100, Math.round((calcAge(planted).days / parseInt(harvestDays)) * 100));
}


/* ----------------------------------------------------------
   ADD CROP
   Reads the form, validates, saves to DB, resets form, re-renders.
   ---------------------------------------------------------- */
function addCrop() {
  const name    = document.getElementById('cName').value.trim();
  const type    = document.getElementById('cType').value;
  const planted = document.getElementById('cPlanted').value;

  /* Basic validation */
  if (!name || !type || !planted) {
    showToast('Please fill all required fields (*)', 'error');
    return;
  }

  /* Build record and save */
  const crops = DB.get('crops');
  crops.push({
    id:          uid(),
    name,
    type,
    planted,
    harvestDays: document.getElementById('cHarvestDays').value || '',
    location:    document.getElementById('cLocation').value,
    plotSize:    document.getElementById('cPlotSize').value,
    status:      document.getElementById('cStatus').value,
    notes:       document.getElementById('cNotes').value,
    createdAt:   new Date().toISOString()
  });
  DB.set('crops', crops);

  showToast(`${name} added successfully!`);

  /* Reset form fields */
  ['cName','cPlanted','cHarvestDays','cLocation','cPlotSize','cNotes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('cType').value = '';
  document.getElementById('cStatus').value = 'Growing';

  render();
}


/* ----------------------------------------------------------
   DELETE MODAL CONTROLS
   ---------------------------------------------------------- */
function openDelModal(id) {
  deleteId = id;
  document.getElementById('delModal').classList.add('open');
}

function closeDelModal() {
  deleteId = null;
  document.getElementById('delModal').classList.remove('open');
}

function confirmDelete() {
  const crops = DB.get('crops').filter(c => c.id !== deleteId);
  DB.set('crops', crops);
  closeDelModal();
  showToast('Crop record deleted', 'error');
  render();
}


/* ----------------------------------------------------------
   RENDER — builds the crops table from stored data
   ---------------------------------------------------------- */
function render() {
  const crops = DB.get('crops');
  const el    = document.getElementById('cropsList');

  if (!crops.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i data-lucide="sprout"></i></div>
        <p>No crops recorded yet. Add your first crop above!</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th><i data-lucide="sprout"></i> Crop</th>
            <th>Type</th>
            <th><i data-lucide="calendar"></i> Planted</th>
            <th><i data-lucide="clock"></i> Age</th>
            <th>Growth</th>
            <th><i data-lucide="timer"></i> Harvest</th>
            <th><i data-lucide="map-pin"></i> Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${crops.slice().reverse().map(c => {
            const age = calcAge(c.planted);
            const pct = growthPercent(c.planted, c.harvestDays);
            return `
              <tr>
                <td>
                  <strong>${c.name}</strong>
                  ${c.plotSize ? `<div style="font-size:0.76rem;color:var(--text-muted)">${c.plotSize} ha</div>` : ''}
                </td>
                <td style="font-size:0.83rem">${c.type.split(' (')[0]}</td>
                <td style="font-size:0.83rem">${formatDate(c.planted)}</td>
                <td><span class="badge badge-green">${age.text}</span></td>
                <td style="min-width:100px">
                  <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:3px">${pct}%</div>
                  <div class="age-bar"><div class="age-bar-fill" style="width:${pct}%"></div></div>
                </td>
                <td>${getHarvestBadge(c.planted, c.harvestDays) || '<span style="color:var(--text-muted);font-size:0.8rem">—</span>'}</td>
                <td style="font-size:0.83rem">${c.location || '—'}</td>
                <td>${statusBadge(c.status)}</td>
                <td>
                  <button class="btn btn-danger btn-sm" onclick="openDelModal('${c.id}')">
                    <i data-lucide="trash-2"></i> Delete
                  </button>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;

  lucide.createIcons();
}


/* ----------------------------------------------------------
   INIT
   ---------------------------------------------------------- */
(function init() {
  requireAuth();
  render();
})();
