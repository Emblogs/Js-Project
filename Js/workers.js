/* ==========================================================
   NAIJAFARM — workers.js
   Logic for the Worker Records page.
   Handles: staff directory, payroll totals, add/delete.
   ========================================================== */

let deleteId = null;


/* ----------------------------------------------------------
   EMPLOYMENT STATUS BADGE
   ---------------------------------------------------------- */
function statusBadge(s) {
  const map = { Active: 'badge-green', 'On Leave': 'badge-gold', Resigned: 'badge-red', Terminated: 'badge-red' };
  return `<span class="badge ${map[s] || 'badge-gold'}">${s}</span>`;
}


/* ----------------------------------------------------------
   ADD WORKER
   ---------------------------------------------------------- */
function addWorker() {
  const name  = document.getElementById('wName').value.trim();
  const role  = document.getElementById('wRole').value;
  const start = document.getElementById('wStart').value;

  if (!name || !role || !start) { showToast('Please fill required fields (*)', 'error'); return; }

  const workers = DB.get('workers');
  workers.push({
    id:     uid(), name, role,
    phone:  document.getElementById('wPhone').value,
    state:  document.getElementById('wState').value,
    start,
    wage:   document.getElementById('wWage').value,
    type:   document.getElementById('wType').value,
    status: document.getElementById('wStatus').value,
    notes:  document.getElementById('wNotes').value,
    createdAt: new Date().toISOString()
  });
  DB.set('workers', workers);

  showToast(`${name} added to staff!`);
  ['wName','wPhone','wWage','wNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('wRole').value = '';
  document.getElementById('wState').value = '';
  render();
}


/* ----------------------------------------------------------
   DELETE MODAL
   ---------------------------------------------------------- */
function openDelModal(id)  { deleteId = id; document.getElementById('delModal').classList.add('open'); }
function closeDelModal()   { deleteId = null; document.getElementById('delModal').classList.remove('open'); }
function confirmDelete() {
  DB.set('workers', DB.get('workers').filter(w => w.id !== deleteId));
  closeDelModal();
  showToast('Worker removed', 'error');
  render();
}


/* ----------------------------------------------------------
   RENDER
   Updates stat cards and the staff directory table.
   ---------------------------------------------------------- */
function render() {
  const workers = DB.get('workers');
  const active  = workers.filter(w => w.status === 'Active');

  /* Monthly payroll = sum of active worker wages */
  const payroll = active.reduce((sum, w) => sum + (Number(w.wage) || 0), 0);

  document.getElementById('sTotal').textContent  = workers.length;
  document.getElementById('sActive').textContent = active.length;
  document.getElementById('sWages').textContent  = formatNaira(payroll);

  const el = document.getElementById('workersList');

  if (!workers.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i data-lucide="hard-hat"></i></div>
        <p>No workers added yet.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th><i data-lucide="user"></i> Name</th>
            <th>Role</th>
            <th><i data-lucide="phone"></i> Phone</th>
            <th>State</th>
            <th>Type</th>
            <th><i data-lucide="calendar"></i> Start Date</th>
            <th><i data-lucide="clock"></i> Tenure</th>
            <th><i data-lucide="banknote"></i> Monthly Wage</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${workers.slice().reverse().map(w => `
            <tr>
              <td>
                <strong>${w.name}</strong>
                ${w.notes ? `<div style="font-size:0.74rem;color:var(--text-muted)">${w.notes.substring(0,60)}</div>` : ''}
              </td>
              <td style="font-size:0.83rem">${w.role}</td>
              <td style="font-size:0.83rem">${w.phone || '—'}</td>
              <td style="font-size:0.83rem">${w.state || '—'}</td>
              <td><span class="badge badge-blue">${w.type}</span></td>
              <td style="font-size:0.83rem">${formatDate(w.start)}</td>
              <td><span class="badge badge-gold">${calcAge(w.start).text}</span></td>
              <td style="font-size:0.86rem;font-weight:600;color:var(--green-deep)">${w.wage ? formatNaira(w.wage) : '—'}</td>
              <td>${statusBadge(w.status)}</td>
              <td>
                <button class="btn btn-danger btn-sm" onclick="openDelModal('${w.id}')">
                  <i data-lucide="trash-2"></i>
                </button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  lucide.createIcons();
}

/* INIT */
(function init() { requireAuth(); render(); })();
