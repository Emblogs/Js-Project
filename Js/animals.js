/* ==========================================================
   NAIJAFARM — animals.js
   Logic for the Animals / Livestock Manager page.
   Handles: adding, deleting, rendering, species stats.
   ========================================================== */

let deleteId = null;

/* ----------------------------------------------------------
   SPECIES ICON MAP
   Maps each species to a Lucide icon name.
   ---------------------------------------------------------- */
const SPECIES_ICON = {
  'Cattle (Cow/Bull)': 'beef',
  'Goat':              'rabbit',
  'Sheep':             'rabbit',
  'Pig':               'pig',
  'Chicken (Broiler)': 'bird',
  'Chicken (Layer)':   'bird',
  'Turkey':            'bird',
  'Duck':              'bird',
  'Rabbit':            'rabbit',
  'Fish (Catfish)':    'fish',
  'Fish (Tilapia)':    'fish',
  'Snail':             'shell',
  'Other':             'paw-print'
};


/* ----------------------------------------------------------
   HEALTH STATUS BADGE
   ---------------------------------------------------------- */
function healthBadge(h) {
  const map = {
    'Healthy':         'badge-green',
    'Sick':            'badge-red',
    'Under Treatment': 'badge-gold',
    'Quarantined':     'badge-gold',
    'Deceased':        'badge-red'
  };
  return `<span class="badge ${map[h] || 'badge-gold'}">${h}</span>`;
}


/* ----------------------------------------------------------
   ADD ANIMAL
   ---------------------------------------------------------- */
function addAnimal() {
  const name    = document.getElementById('aName').value.trim();
  const species = document.getElementById('aSpecies').value;
  const dob     = document.getElementById('aDob').value;

  if (!name || !species || !dob) {
    showToast('Please fill all required fields (*)', 'error');
    return;
  }

  const animals = DB.get('animals');
  animals.push({
    id:      uid(),
    name,
    species,
    breed:   document.getElementById('aBreed').value,
    dob,
    gender:  document.getElementById('aGender').value,
    health:  document.getElementById('aHealth').value,
    price:   document.getElementById('aPrice').value,
    notes:   document.getElementById('aNotes').value,
    createdAt: new Date().toISOString()
  });
  DB.set('animals', animals);

  showToast(`${name} added!`);
  ['aName','aBreed','aDob','aPrice','aNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('aSpecies').value = '';

  render();
}


/* ----------------------------------------------------------
   DELETE MODAL CONTROLS
   ---------------------------------------------------------- */
function openDelModal(id)  { deleteId = id; document.getElementById('delModal').classList.add('open'); }
function closeDelModal()   { deleteId = null; document.getElementById('delModal').classList.remove('open'); }
function confirmDelete() {
  DB.set('animals', DB.get('animals').filter(a => a.id !== deleteId));
  closeDelModal();
  showToast('Animal removed', 'error');
  render();
}


/* ----------------------------------------------------------
   RENDER STATS ROW
   Counts animals by species category and shows stat cards.
   ---------------------------------------------------------- */
function renderStats(animals) {
  const counts = {};
  animals.forEach(a => {
    const k = a.species.split(' (')[0];
    counts[k] = (counts[k] || 0) + 1;
  });

  const el = document.getElementById('animalStats');

  /* Total card */
  let html = `
    <div class="stat-card">
      <div class="stat-icon"><i data-lucide="paw-print"></i></div>
      <div class="stat-num">${animals.length}</div>
      <div class="stat-label">Total Animals</div>
    </div>`;

  /* Per-species cards */
  Object.entries(counts).forEach(([k, v]) => {
    const icon = SPECIES_ICON[k] || 'paw-print';
    html += `
      <div class="stat-card">
        <div class="stat-icon"><i data-lucide="${icon}"></i></div>
        <div class="stat-num">${v}</div>
        <div class="stat-label">${k}</div>
      </div>`;
  });

  el.innerHTML = html;
}


/* ----------------------------------------------------------
   RENDER TABLE
   ---------------------------------------------------------- */
function render() {
  const animals = DB.get('animals');
  renderStats(animals);

  const el = document.getElementById('animalsList');

  if (!animals.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i data-lucide="paw-print"></i></div>
        <p>No animals recorded yet. Add your first animal above!</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Animal</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Gender</th>
            <th><i data-lucide="calendar"></i> DOB / Acquired</th>
            <th><i data-lucide="clock"></i> Age</th>
            <th>Health</th>
            <th>Price Paid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${animals.slice().reverse().map(a => {
            const age  = calcAge(a.dob);
            const icon = SPECIES_ICON[a.species] || 'paw-print';
            return `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:7px">
                    <i data-lucide="${icon}" style="width:16px;height:16px;stroke:var(--green-mid)"></i>
                    <strong>${a.name}</strong>
                  </div>
                  ${a.notes ? `<div style="font-size:0.74rem;color:var(--text-muted)">${a.notes}</div>` : ''}
                </td>
                <td style="font-size:0.83rem">${a.species}</td>
                <td style="font-size:0.83rem">${a.breed || '—'}</td>
                <td style="font-size:0.83rem">${a.gender}</td>
                <td style="font-size:0.83rem">${formatDate(a.dob)}</td>
                <td><span class="badge badge-green">${age.text}</span></td>
                <td>${healthBadge(a.health)}</td>
                <td style="font-size:0.86rem;font-weight:600;color:var(--green-deep)">${a.price ? formatNaira(a.price) : '—'}</td>
                <td>
                  <div style="display:flex; gap:5px;">
                    <button class="btn btn-primary btn-sm" onclick="openEditModal('animals', '${a.id}')">
                      <i data-lucide="edit-3"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="openDelModal('${a.id}')">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;

  lucide.createIcons();
}


/* INIT */
(function init() { requireAuth(); render(); })();
