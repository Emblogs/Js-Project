/* ==========================================================
   NAIJAFARM — reminders.js
   Harvest date reminder system.
   - Checks all crops on page load
   - Shows a banner if any crop is due within 14 days
   - Stores dismissed reminders so they don't re-appear
   ========================================================== */


/* ----------------------------------------------------------
   CHECK HARVEST REMINDERS
   Call this on the dashboard and crops page.
   Injects a reminder banner above the page content.
   ---------------------------------------------------------- */
function checkHarvestReminders() {
  const crops     = DB.get('crops');
  const dismissed = DB.get('dismissed_reminders'); /* array of crop IDs user dismissed */
  const due       = [];

  crops.forEach(crop => {
    /* Skip if no harvest days set, already harvested, or already dismissed */
    if (!crop.harvestDays || !crop.planted)          return;
    if (crop.status === 'Harvested')                  return;
    if (dismissed.includes(crop.id))                  return;

    /* Calculate days remaining */
    const harvestDate = new Date(crop.planted);
    harvestDate.setDate(harvestDate.getDate() + parseInt(crop.harvestDays));
    const daysLeft = Math.ceil((harvestDate - new Date()) / 86400000);

    /* Alert if harvest is within 14 days or overdue */
    if (daysLeft <= 14) {
      due.push({ crop, daysLeft });
    }
  });

  if (!due.length) return;

  /* Build banner HTML */
  const bannerEl = document.getElementById('reminderBanner');
  if (!bannerEl) return;

  bannerEl.innerHTML = due.map(({ crop, daysLeft }) => {
    const isOverdue = daysLeft < 0;
    const label     = isOverdue
      ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}`
      : daysLeft === 0
        ? 'Due TODAY'
        : `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
    const colour = isOverdue ? '#c0392b' : daysLeft <= 3 ? '#d4a017' : '#2d7a2d';

    return `
      <div class="reminder-item" style="border-left-color:${colour}">
        <div class="reminder-body">
          <div class="reminder-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${colour}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <strong>${crop.name}</strong>
          </div>
          <div class="reminder-sub">${label} &nbsp;&middot;&nbsp; ${crop.location || 'No location set'}</div>
        </div>
        <button class="reminder-dismiss" onclick="dismissReminder('${crop.id}')" title="Dismiss">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>`;
  }).join('');

  bannerEl.style.display = 'block';
}


/* ----------------------------------------------------------
   DISMISS A REMINDER
   Saves the crop ID to dismissed list and removes from banner.
   ---------------------------------------------------------- */
function dismissReminder(cropId) {
  const dismissed = DB.get('dismissed_reminders');
  if (!dismissed.includes(cropId)) {
    dismissed.push(cropId);
    DB.set('dismissed_reminders', dismissed);
  }

  /* Re-check — if no reminders left, hide banner */
  checkHarvestReminders();
  const items = document.querySelectorAll('.reminder-item');
  if (!items.length) {
    const banner = document.getElementById('reminderBanner');
    if (banner) banner.style.display = 'none';
  }
}
