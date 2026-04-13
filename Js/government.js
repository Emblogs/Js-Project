/* ==========================================================
   NAIJAFARM — government.js
   Logic for the Government Support page.
   Handles: eligibility checker, personalized recommendations.
   ========================================================== */


/* ----------------------------------------------------------
   ELIGIBILITY CHECKER
   Reads the form values and generates a personalised list of
   FGN programme recommendations based on the farmer's profile.
   ---------------------------------------------------------- */
function checkEligibility() {
  const state   = document.getElementById('eState').value;
  const farming = document.getElementById('eFarming').value;
  const size    = document.getElementById('eFarmSize').value;
  const youth   = document.getElementById('eYouth').value;

  if (!state || !farming) {
    showToast('Please select your state and farming activity', 'error');
    return;
  }

  /* Build recommendations array based on farmer profile */
  const recs = [];

  /* --- Always recommended --- */
  recs.push({
    icon: 'landmark',
    title: 'Anchor Borrowers Programme (ABP)',
    body: `As a ${size.toLowerCase()} farmer in ${state}, you may qualify for the CBN ABP loan for ${farming.toLowerCase()} input financing. Visit your nearest commercial bank with your BVN and farmland documents.`
  });

  recs.push({
    icon: 'leaf',
    title: 'Presidential Fertilizer Initiative (PFI)',
    body: `Subsidised NPK and Urea fertilisers are available at your ${state} State ADP office. Register your farm with the ADP to access discounted inputs.`
  });

  recs.push({
    icon: 'shield',
    title: 'NAIC Agricultural Insurance',
    body: `Protect your ${farming.toLowerCase()} investment with subsidised crop/livestock insurance from NAIC. Smallholder premiums are heavily discounted when applied through your state ADP.`
  });

  /* --- Youth-specific programmes --- */
  if (youth === 'Yes') {
    recs.push({
      icon: 'users',
      title: 'Youth in Agriculture (YAGEP)',
      body: `As a youth farmer in ${state}, you qualify for YAGEP startup grants and mentorship. Apply through the Federal Ministry of Youth and Sports Development with your farm business plan.`
    });
    recs.push({
      icon: 'lightbulb',
      title: 'YouWin Connect Agriculture',
      body: `FGN's YouWin programme provides grants up to ₦10 million for youth agribusinesses. Prepare a strong business plan for your ${farming} enterprise and apply online.`
    });
  }

  /* --- Sector-specific programmes --- */
  if (farming.includes('Fish')) {
    recs.push({
      icon: 'fish',
      title: 'FADAMA III (World Bank / FGN)',
      body: `Fish farmers in ${state} can access FADAMA III grants for pond construction, fingerlings, and feed. Contact your State FADAMA Coordination Office (SFCO) to register your cooperative.`
    });
  }

  if (farming.includes('Cocoa') || farming.includes('Palm') || farming.includes('Cashew')) {
    recs.push({
      icon: 'tree-pine',
      title: 'Tree Crop Development Programme (TCDP)',
      body: `FGN's TCDP provides free/subsidised seedlings and rehabilitation grants for tree crop farmers. Contact the FMA&RD field office in ${state}.`
    });
  }

  if (farming.includes('Poultry')) {
    recs.push({
      icon: 'bird',
      title: 'NAFDAC Registration for Poultry Products',
      body: `To legally sell eggs, frozen chicken, or poultry products commercially in ${state}, register with NAFDAC. Start at nafdac.gov.ng or your local NAFDAC office.`
    });
  }

  if (size === 'Large (10+ ha)') {
    recs.push({
      icon: 'tractor',
      title: 'AgriSME Mechanisation Loan (BOA)',
      body: `As a large-scale farmer in ${state}, you qualify for Bank of Agriculture mechanisation loans to purchase tractors and equipment at single-digit interest rates.`
    });
  }

  /* --- Render results --- */
  document.getElementById('recList').innerHTML = recs.map(r => `
    <div class="rec-item">
      <div class="rec-icon"><i data-lucide="${r.icon}"></i></div>
      <div class="rec-body">
        <h4>${r.title}</h4>
        <p>${r.body}</p>
      </div>
    </div>
  `).join('');

  document.getElementById('recommendations').style.display = '';
  document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth', block: 'start' });

  showToast(`${recs.length} recommendations found for you!`);
  lucide.createIcons();
}


/* INIT */
(function init() { requireAuth(); lucide.createIcons(); })();
