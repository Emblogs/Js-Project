/* 
   NAIJAFARM — reminders.js
   Harvest date reminder system.
   Checks crops on page load and after every render.
   Shows a banner if any crop is due within 14 days or overdue.
   */


/* 
   CHECK HARVEST REMINDERS
   Safe to call at any time — waits for DOM element to exist.
 */
function checkHarvestReminders() {
  const bannerEl = document.getElementById('reminderBanner');
  if (!bannerEl) return; /* not on a page that has the banner */

  const crops     = DB.get('crops');
  const dismissed = DB.get('dismissed_reminders');
  const due       = [];

  crops.forEach(function(crop) {
    /* Skip crops without harvest date, already harvested, or dismissed */
    if (!crop.harvestDays || !crop.planted)  return;
    if (crop.status === 'Harvested')          return;
    if (dismissed.indexOf(crop.id) !== -1)    return;

    /* Work out days remaining */
    var harvestDate = new Date(crop.planted);
    harvestDate.setDate(harvestDate.getDate() + parseInt(crop.harvestDays));
    var daysLeft = Math.ceil((harvestDate - new Date()) / 86400000);

    /* Only alert if within 14 days or overdue */
    if (daysLeft <= 14) {
      due.push({ crop: crop, daysLeft: daysLeft });
    }
  });

  /* Hide banner if nothing to show */
  if (!due.length) {
    bannerEl.style.display = 'none';
    bannerEl.innerHTML = '';
    return;
  }

  /* Build reminder rows */
  bannerEl.innerHTML = due.map(function(item) {
    var crop     = item.crop;
    var daysLeft = item.daysLeft;
    var isOverdue = daysLeft < 0;
    var label = isOverdue
      ? 'Overdue by ' + Math.abs(daysLeft) + ' day' + (Math.abs(daysLeft) !== 1 ? 's' : '')
      : daysLeft === 0
        ? 'Due TODAY'
        : 'Due in ' + daysLeft + ' day' + (daysLeft !== 1 ? 's' : '');
    var colour = isOverdue ? '#c0392b' : (daysLeft <= 3 ? '#d4a017' : '#2d7a2d');

    return '<div class="reminder-item" style="border-left-color:' + colour + '">' +
      '<div class="reminder-body">' +
        '<div class="reminder-title">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="' + colour + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>' +
          '<strong>' + crop.name + '</strong>' +
        '</div>' +
        '<div class="reminder-sub">' + label + ' &nbsp;&middot;&nbsp; ' + (crop.location || 'No location set') + '</div>' +
      '</div>' +
      '<button class="reminder-dismiss" onclick="dismissReminder(\'' + crop.id + '\')" title="Dismiss">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
    '</div>';
  }).join('');

  bannerEl.style.display = 'block';
}


/* 
   DISMISS A REMINDER
    */
function dismissReminder(cropId) {
  var dismissed = DB.get('dismissed_reminders');
  if (dismissed.indexOf(cropId) === -1) {
    dismissed.push(cropId);
    DB.set('dismissed_reminders', dismissed);
  }
  /* Re-check so banner updates immediately */
  checkHarvestReminders();
}


/* 
   AUTO-RUN on DOMContentLoaded
    */
document.addEventListener('DOMContentLoaded', function() {
  checkHarvestReminders();
});