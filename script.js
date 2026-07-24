// ─── DATA ────────────────────────────────────────────────
const servicesData = [
  { id: 'resume', icon: 'fa-file-alt', name: 'Resume/CV', desc: 'ATS-optimized, professional' },
  { id: 'mobile', icon: 'fa-mobile-alt', name: 'Mobile app development', desc: 'iOS · Android · Flutter' },
  { id: 'database', icon: 'fa-database', name: 'Database management', desc: 'SQL, NoSQL, tuning' },
  { id: 'cyber', icon: 'fa-shield-alt', name: 'Cybersecurity consulting', desc: 'Audit, pentest, zero‑trust' },
  { id: 'project', icon: 'fa-tasks', name: 'Project management', desc: 'Agile, scrum, delivery' },
  { id: 'research', icon: 'fa-search', name: 'Online research', desc: 'Data‑driven insights' },
  { id: 'tutoring', icon: 'fa-chalkboard-teacher', name: 'Online tutoring', desc: 'STEM, languages, coding' },
  { id: 'business', icon: 'fa-chart-line', name: 'Business consulting', desc: 'Strategy, ops, growth' },
  { id: 'data', icon: 'fa-chart-pie', name: 'Data analysis', desc: 'Python, BI, dashboards' }
];

// Pricing tiers (KSh) – realistic estimates
const pricingTiers = [
  { label: 'Basic', duration: '1 week', cost: 15000 },
  { label: 'Standard', duration: '2 weeks', cost: 30000 },
  { label: 'Premium', duration: '1 month', cost: 65000 }
];

// ─── DOM refs ────────────────────────────────────────────
const grid = document.getElementById('serviceGrid');
const estimatorCard = document.getElementById('estimatorCard');
const estimatorTitle = document.getElementById('estimatorTitle');
const estimatorDesc = document.getElementById('estimatorDesc');
const estimatorOptions = document.getElementById('estimatorOptions');
const totalPriceEl = document.getElementById('totalPrice');
const closeEstimator = document.getElementById('closeEstimator');
const estimatorContactBtn = document.getElementById('estimatorContactBtn');
const toast = document.getElementById('toastMessage');
const toastText = document.getElementById('toastText');
const serviceSelect = document.getElementById('serviceSelect');

let selectedService = null;       // currently selected service object
let selectedTierIndex = 0;        // default tier
let selectedServiceName = '';

// ─── build service cards ─────────────────────────────────
function buildCards() {
  grid.innerHTML = '';
  servicesData.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = svc.id;
    card.innerHTML = `
      <i class="fas ${svc.icon}"></i>
      <h3>${svc.name}</h3>
      <p>${svc.desc}</p>
    `;
    card.addEventListener('click', () => selectService(svc, card));
    grid.appendChild(card);
  });
}

// ─── select service ──────────────────────────────────────
function selectService(svc, cardEl) {
  // remove previous selection
  document.querySelectorAll('.service-card.selected').forEach(el => el.classList.remove('selected'));
  if (cardEl) cardEl.classList.add('selected');

  selectedService = svc;
  selectedServiceName = svc.name;

  // update estimator
  estimatorTitle.textContent = svc.name;
  estimatorDesc.textContent = `Choose a package for "${svc.name}" – estimated costs in Kenyan Shillings.`;

  // build options
  renderTiers();

  // update form select
  serviceSelect.value = svc.name;

  // show estimator
  estimatorCard.style.display = 'block';
  estimatorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  showToast(`Selected: ${svc.name}`);
}

// ─── render pricing tiers ───────────────────────────────
function renderTiers() {
  estimatorOptions.innerHTML = '';
  pricingTiers.forEach((tier, index) => {
    const div = document.createElement('div');
    div.className = `estimator-option ${index === selectedTierIndex ? 'active' : ''}`;
    div.innerHTML = `
      <span class="duration">${tier.duration}</span>
      <span class="cost">KSh ${tier.cost.toLocaleString()}</span>
    `;
    div.addEventListener('click', () => {
      selectedTierIndex = index;
      renderTiers();
      updateTotal();
    });
    estimatorOptions.appendChild(div);
  });
  updateTotal();
}

// ─── update total ────────────────────────────────────────
function updateTotal() {
  const tier = pricingTiers[selectedTierIndex];
  if (tier) {
    totalPriceEl.textContent = `KSh ${tier.cost.toLocaleString()}`;
  } else {
    totalPriceEl.textContent = 'KSh 0';
  }
}

// ─── close estimator ─────────────────────────────────────
closeEstimator.addEventListener('click', () => {
  estimatorCard.style.display = 'none';
  document.querySelectorAll('.service-card.selected').forEach(el => el.classList.remove('selected'));
  selectedService = null;
});

// ─── toast ───────────────────────────────────────────────
function showToast(msg) {
  toastText.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ─── estimator "Proceed to contact" ─────────────────────
estimatorContactBtn.addEventListener('click', () => {
  if (!selectedService) {
    showToast('Please select a service first.');
    return;
  }
  const tier = pricingTiers[selectedTierIndex];
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  serviceSelect.value = selectedService.name;
  const msg = document.getElementById('message');
  msg.value = `I'm interested in "${selectedService.name}" (${tier.duration}, estimated KSh ${tier.cost.toLocaleString()}). Please provide more details.`;
  showToast(`Ready to contact about ${selectedService.name}`);
});

// ─── form submission feedback ───────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  // Formspree handles submission; we just show a toast.
  // The form will redirect to Formspree's thank-you page by default.
  // We'll keep it native – but we can show a toast before redirect.
  showToast('Sending your message...');
  // Allow native submission.
});

// ─── init ────────────────────────────────────────────────
buildCards();
estimatorCard.style.display = 'none'; // hidden initially
selectedTierIndex = 0;
renderTiers();

// Also update estimator when dropdown changes (for manual selection)
serviceSelect.addEventListener('change', function() {
  const val = this.value;
  if (!val) return;
  const found = servicesData.find(s => s.name === val);
  if (found) {
    const card = document.querySelector(`.service-card[data-id="${found.id}"]`);
    if (card) selectService(found, card);
  }
});