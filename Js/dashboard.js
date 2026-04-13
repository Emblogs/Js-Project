/* ==========================================================
   NAIJAFARM — dashboard.js
   Logic for the main dashboard / index page.
   Loads stats, recent crops, recent animals, daily tip.
   ========================================================== */


/* ----------------------------------------------------------
   NIGERIAN FARMING TIPS
   Shown randomly each time the dashboard loads.
   ---------------------------------------------------------- */
const TIPS = [
  {
    title: "Best Planting Season in Nigeria",
    body:  "The rainy season (April–October) is ideal for most crops in southern Nigeria. In the north, planting after the first rains (May–June) gives the best yields for maize and sorghum."
  },
  {
    title: "Goat Farming is Profitable",
    body:  "West African Dwarf goats are hardy, resistant to disease, and well-suited to Nigerian conditions. They breed twice a year, making them a great income source."
  },
  {
    title: "Soil Health Matters",
    body:  "Conduct annual soil tests and use organic compost alongside urea or NPK fertilizers to maintain fertility. Avoid over-reliance on chemical fertilizers alone."
  },
  {
    title: "Cassava — Nigeria's Staple Crop",
    body:  "Nigeria is the world's largest cassava producer. TMS varieties from IITA yield over 30 tonnes/hectare. Harvest within 12–18 months for best quality."
  },
  {
    title: "Poultry Biosecurity",
    body:  "Bird flu is a real threat. Keep housing clean, restrict visitors, and report unusual deaths to your State Ministry of Agriculture immediately."
  }
];


/* ----------------------------------------------------------
   LOAD DASHBOARD STATS
   Reads all data stores and updates the stat counter cards.
   ---------------------------------------------------------- */
function loadStats() {
  document.getElementById('statCrops').textContent   = DB.get('crops').length;
  document.getElementById('statAnimals').textContent = DB.get('animals').length;
  document.getElementById('statWorkers').textContent = DB.get('workers').length;
  document.getElementById('statListings').textContent = DB.get('listings').length;
  document.getElementById('statLand').textContent    = DB.get('lands').length;
}


/* ----------------------------------------------------------
   LOAD RECENT CROPS PREVIEW
   Shows the 4 most recently added crops in the dashboard card.
   ---------------------------------------------------------- */
function loadRecentCrops() {
  const crops = DB.get('crops');
  const el    = document.getElementById('recentCrops');

  if (!crops.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon"><i data-lucide="sprout"></i></div><p>No crops yet.</p></div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = crops.slice(-4).reverse().map(c => `
    <div class="recent-row">
      <div>
        <strong>${c.name}</strong>
        <div class="recent-sub">${c.type.split(' (')[0]}</div>
      </div>
      <span class="badge badge-green">${calcAge(c.planted).text}</span>
    </div>
  `).join('');
}


/* ----------------------------------------------------------
   LOAD RECENT ANIMALS PREVIEW
   Shows the 4 most recently added animals in the dashboard card.
   ---------------------------------------------------------- */
function loadRecentAnimals() {
  const animals = DB.get('animals');
  const el      = document.getElementById('recentAnimals');

  if (!animals.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon"><i data-lucide="paw-print"></i></div><p>No animals yet.</p></div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = animals.slice(-4).reverse().map(a => `
    <div class="recent-row">
      <div>
        <strong>${a.name}</strong>
        <div class="recent-sub">${a.species}</div>
      </div>
      <span class="badge badge-gold">${calcAge(a.dob).text}</span>
    </div>
  `).join('');
}


/* ----------------------------------------------------------
   SHOW RANDOM TIP
   Picks one tip at random and renders it in the tip card.
   ---------------------------------------------------------- */
function showDailyTip() {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  document.getElementById('tipTitle').textContent = tip.title;
  document.getElementById('tipBody').textContent  = tip.body;
}


/* ----------------------------------------------------------
   INIT — runs on page load
   ---------------------------------------------------------- */
(function init() {
  /* Redirect to landing if not logged in */
  requireAuth();

  /* Load all sections */
  loadStats();
  loadRecentCrops();
  loadRecentAnimals();
  showDailyTip();

  /* Re-render Lucide icons injected by JS */
  lucide.createIcons();
})();
