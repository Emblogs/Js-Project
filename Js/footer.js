

function insertFooter() {
  const target = document.getElementById('site-footer');
  if (!target) return;

  target.innerHTML = `
  <div class="footer-grid">

    <!-- ABOUT COLUMN -->
    <div class="footer-brand">
      <div class="brand-logo">
        <i data-lucide="wheat"></i>
        <span class="brand-name">NaijaFarm</span>
      </div>
      <p>Your complete Nigerian farm management system. Track crops, animals, workers, buy or sell land, and access FGN agricultural support — all saved in your browser. No server. No fees.</p>
      <div class="footer-socials">
        <!-- Facebook official brand SVG -->
        <a href="#" title="Facebook">
          <svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        <!-- WhatsApp official brand SVG -->
        <a href="#" title="WhatsApp">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path fill="#fff" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.95-1.418A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 0 1-4.046-1.107l-.29-.172-3.007.862.842-3.093-.189-.302A7.946 7.946 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
          </svg>
        </a>
        <!-- X (Twitter) official brand SVG -->
        <a href="#" title="X (Twitter)">
          <svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <!-- Email -->
        <a href="mailto:hello@naijafarm.ng" title="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- QUICK LINKS COLUMN -->
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="index.html"><i data-lucide="layout-dashboard"></i> Dashboard</a></li>
        <li><a href="crops.html"><i data-lucide="sprout"></i> Crops Tracker</a></li>
        <li><a href="animals.html"><i data-lucide="beef"></i> Animals</a></li>
        <li><a href="workers.html"><i data-lucide="hard-hat"></i> Workers</a></li>
        <li><a href="market.html"><i data-lucide="shopping-cart"></i> Market</a></li>
        <li><a href="government.html"><i data-lucide="landmark"></i> Govt Support</a></li>
      </ul>
    </div>

    <!-- GOVERNMENT AGENCIES COLUMN -->
    <div class="footer-col">
      <h4>Govt Agencies</h4>
      <ul>
        <li><a href="https://fma.gov.ng" target="_blank"><i data-lucide="external-link"></i> FMA&amp;RD</a></li>
        <li><a href="https://cbn.gov.ng" target="_blank"><i data-lucide="external-link"></i> CBN (ABP)</a></li>
        <li><a href="https://nafdac.gov.ng" target="_blank"><i data-lucide="external-link"></i> NAFDAC</a></li>
        <li><a href="https://naic.gov.ng" target="_blank"><i data-lucide="external-link"></i> NAIC</a></li>
        <li><a href="https://bankofagriculture.gov.ng" target="_blank"><i data-lucide="external-link"></i> Bank of Agric</a></li>
        <li><a href="https://iita.org" target="_blank"><i data-lucide="external-link"></i> IITA</a></li>
      </ul>
    </div>

    <!-- CONTACT COLUMN -->
    <div class="footer-col">
      <h4>Contact Us</h4>
      <div class="footer-contact">
        <div class="footer-contact-item">
          <i data-lucide="map-pin"></i>
          <span>Abuja, FCT — Serving all 36 States</span>
        </div>
        <div class="footer-contact-item">
          <i data-lucide="mail"></i>
          <a href="mailto:hello@naijafarm.ng">hello@naijafarm.ng</a>
        </div>
        <div class="footer-contact-item">
          <i data-lucide="phone"></i>
          <a href="tel:+2348000000000">+234 800 000 0000</a>
        </div>
        <div class="footer-contact-item">
          <i data-lucide="message-circle"></i>
          <span>WhatsApp support available</span>
        </div>
      </div>
    </div>

  </div>

  <div class="footer-divider"></div>

  <div class="footer-bottom">
    <span>&copy; 2025 NaijaFarm Manager. All rights reserved. Your data stays on your device — never collected or shared.</span>
    <span class="footer-love">
      Made mainly for Nigerian Farmers &nbsp;&#127475;&#127468;
    </span>
  </div>
  `;

  /* Re-render Lucide icons inside the injected footer */
  lucide.createIcons();
}

/* Auto-run when DOM is ready */
document.addEventListener('DOMContentLoaded', insertFooter);