/* ==========================================================
   NAIJAFARM — edit.js
   Generic edit modal system.
   Works for crops, animals, and workers.
   Injects a pre-filled modal, saves changes on submit.
   ========================================================== */

let editTarget = null; /* { type: 'crops'|'animals'|'workers', id: '...' } */


/* ----------------------------------------------------------
   OPEN EDIT MODAL
   Finds the record by ID, builds a form modal, opens it.
   type = 'crops' | 'animals' | 'workers'
   ---------------------------------------------------------- */
function openEditModal(type, id) {
  const records = DB.get(type);
  const record  = records.find(r => r.id === id);
  if (!record) return;

  editTarget = { type, id };

  const modal    = document.getElementById('editModal');
  const formWrap = document.getElementById('editFormWrap');
  const title    = document.getElementById('editModalTitle');

  /* Build the form fields based on record type */
  if (type === 'crops') {
    title.textContent = 'Edit Crop Record';
    formWrap.innerHTML = `
      <div class="form-row">
        <div class="form-group"><label>Crop Name *</label><input id="e_name" value="${record.name || ''}"/></div>
        <div class="form-group"><label>Crop Type *</label>
          <select id="e_type">
            <option ${record.type.includes('Cereal') ? 'selected' : ''}>Cereal (Maize, Sorghum, Rice)</option>
            <option ${record.type.includes('Root') ? 'selected' : ''}>Root &amp; Tuber (Yam, Cassava, Cocoyam)</option>
            <option ${record.type.includes('Legume') ? 'selected' : ''}>Legume (Cowpea, Groundnut, Soybean)</option>
            <option ${record.type.includes('Vegetable') ? 'selected' : ''}>Vegetable (Tomato, Pepper, Okra)</option>
            <option ${record.type.includes('Tree') ? 'selected' : ''}>Tree Crop (Palm, Cocoa, Cashew)</option>
            <option ${record.type.includes('Fruit') ? 'selected' : ''}>Fruit (Mango, Plantain, Banana)</option>
            <option ${record.type === 'Other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
        <div class="form-group"><label>Date Planted *</label><input id="e_planted" type="date" value="${record.planted || ''}"/></div>
        <div class="form-group"><label>Harvest (days)</label><input id="e_harvestDays" type="number" value="${record.harvestDays || ''}"/></div>
        <div class="form-group"><label>Location</label><input id="e_location" value="${record.location || ''}"/></div>
        <div class="form-group"><label>Plot Size (ha)</label><input id="e_plotSize" type="number" step="0.1" value="${record.plotSize || ''}"/></div>
        <div class="form-group"><label>Status</label>
          <select id="e_status">
            <option ${record.status === 'Growing' ? 'selected' : ''}>Growing</option>
            <option ${record.status === 'Harvested' ? 'selected' : ''}>Harvested</option>
            <option ${record.status === 'Failed' ? 'selected' : ''}>Failed</option>
            <option ${record.status === 'Dormant' ? 'selected' : ''}>Dormant</option>
          </select>
        </div>
        <div class="form-group"><label>Notes</label><input id="e_notes" value="${record.notes || ''}"/></div>
      </div>`;
  }

  else if (type === 'animals') {
    title.textContent = 'Edit Animal Record';
    const speciesList = ['Cattle (Cow/Bull)','Goat','Sheep','Pig','Chicken (Broiler)','Chicken (Layer)','Turkey','Duck','Rabbit','Fish (Catfish)','Fish (Tilapia)','Snail','Other'];
    formWrap.innerHTML = `
      <div class="form-row">
        <div class="form-group"><label>Name / ID *</label><input id="e_name" value="${record.name || ''}"/></div>
        <div class="form-group"><label>Species *</label>
          <select id="e_species">${speciesList.map(s => `<option ${record.species === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Breed</label><input id="e_breed" value="${record.breed || ''}"/></div>
        <div class="form-group"><label>DOB / Acquired *</label><input id="e_dob" type="date" value="${record.dob || ''}"/></div>
        <div class="form-group"><label>Gender</label>
          <select id="e_gender">
            <option ${record.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option ${record.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option ${record.gender === 'Unknown' ? 'selected' : ''}>Unknown</option>
          </select>
        </div>
        <div class="form-group"><label>Health Status</label>
          <select id="e_health">
            <option ${record.health === 'Healthy' ? 'selected' : ''}>Healthy</option>
            <option ${record.health === 'Sick' ? 'selected' : ''}>Sick</option>
            <option ${record.health === 'Under Treatment' ? 'selected' : ''}>Under Treatment</option>
            <option ${record.health === 'Quarantined' ? 'selected' : ''}>Quarantined</option>
            <option ${record.health === 'Deceased' ? 'selected' : ''}>Deceased</option>
          </select>
        </div>
        <div class="form-group"><label>Purchase Price (₦)</label><input id="e_price" type="number" value="${record.price || ''}"/></div>
        <div class="form-group"><label>Notes</label><input id="e_notes" value="${record.notes || ''}"/></div>
      </div>`;
  }

  else if (type === 'workers') {
    title.textContent = 'Edit Worker Record';
    const roles   = ['Farm Manager','Crop Supervisor','Animal Keeper','Driver / Logistics','Security Guard','General Farm Hand','Irrigation Technician','Tractor Operator','Accountant / Bookkeeper','Other'];
    const types   = ['Full-time','Part-time','Seasonal','Contract'];
    const statuses = ['Active','On Leave','Resigned','Terminated'];
    formWrap.innerHTML = `
      <div class="form-row">
        <div class="form-group"><label>Full Name *</label><input id="e_name" value="${record.name || ''}"/></div>
        <div class="form-group"><label>Role *</label>
          <select id="e_role">${roles.map(r => `<option ${record.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Phone</label><input id="e_phone" value="${record.phone || ''}"/></div>
        <div class="form-group"><label>Start Date *</label><input id="e_start" type="date" value="${record.start || ''}"/></div>
        <div class="form-group"><label>Monthly Wage (₦)</label><input id="e_wage" type="number" value="${record.wage || ''}"/></div>
        <div class="form-group"><label>Employment Type</label>
          <select id="e_type">${types.map(t => `<option ${record.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Status</label>
          <select id="e_status">${statuses.map(s => `<option ${record.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Notes</label><input id="e_notes" value="${record.notes || ''}"/></div>
      </div>`;
  }

  modal.classList.add('open');
}


/* ----------------------------------------------------------
   SAVE EDIT
   Reads form values, updates the record in storage, re-renders.
   ---------------------------------------------------------- */
function saveEdit() {
  if (!editTarget) return;

  const { type, id } = editTarget;
  const records      = DB.get(type);
  const idx          = records.findIndex(r => r.id === id);
  if (idx === -1) return;

  /* Merge updated fields into existing record */
  const updated = { ...records[idx] };

  if (type === 'crops') {
    const name = document.getElementById('e_name').value.trim();
    if (!name) { showToast('Crop name is required', 'error'); return; }
    updated.name        = name;
    updated.type        = document.getElementById('e_type').value;
    updated.planted     = document.getElementById('e_planted').value;
    updated.harvestDays = document.getElementById('e_harvestDays').value;
    updated.location    = document.getElementById('e_location').value;
    updated.plotSize    = document.getElementById('e_plotSize').value;
    updated.status      = document.getElementById('e_status').value;
    updated.notes       = document.getElementById('e_notes').value;
  }
  else if (type === 'animals') {
    const name = document.getElementById('e_name').value.trim();
    if (!name) { showToast('Animal name is required', 'error'); return; }
    updated.name    = name;
    updated.species = document.getElementById('e_species').value;
    updated.breed   = document.getElementById('e_breed').value;
    updated.dob     = document.getElementById('e_dob').value;
    updated.gender  = document.getElementById('e_gender').value;
    updated.health  = document.getElementById('e_health').value;
    updated.price   = document.getElementById('e_price').value;
    updated.notes   = document.getElementById('e_notes').value;
  }
  else if (type === 'workers') {
    const name = document.getElementById('e_name').value.trim();
    if (!name) { showToast('Worker name is required', 'error'); return; }
    updated.name   = name;
    updated.role   = document.getElementById('e_role').value;
    updated.phone  = document.getElementById('e_phone').value;
    updated.start  = document.getElementById('e_start').value;
    updated.wage   = document.getElementById('e_wage').value;
    updated.type   = document.getElementById('e_type').value;
    updated.status = document.getElementById('e_status').value;
    updated.notes  = document.getElementById('e_notes').value;
  }

  /* Save back to storage */
  records[idx] = updated;
  DB.set(type, records);

  closeEditModal();
  showToast(`${updated.name} updated successfully!`);

  /* Re-render the current page table */
  if (typeof render === 'function') render();
}


/* ----------------------------------------------------------
   CLOSE EDIT MODAL
   ---------------------------------------------------------- */
function closeEditModal() {
  editTarget = null;
  document.getElementById('editModal').classList.remove('open');
}
