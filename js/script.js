document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  initMobileNav();
  initScrollReveal();
  initAnimatedCounters();
  initEnergyCalculator();
  initTipsTabs();
});

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const linksContainer = document.getElementById('navLinks');
  if (!toggle || !linksContainer) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = linksContainer.classList.toggle('show');
    toggle.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', (e) => {
    if (!linksContainer.contains(e.target) && !toggle.contains(e.target)) {
      linksContainer.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  linksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      linksContainer.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-value[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => observer.observe(counter));

  function animate(el) {
    const target = parseFloat(el.dataset.target);
    const isFloat = el.dataset.float === 'true';
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      el.textContent = `${prefix}${isFloat ? current.toFixed(1) : Math.round(current).toLocaleString('id-ID')}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}

function initEnergyCalculator() {
  const sliderRooms = document.getElementById('calcRooms');
  const sliderComputers = document.getElementById('calcComputers');
  const sliderHours = document.getElementById('calcHours');

  if (!sliderRooms || !sliderComputers || !sliderHours) return;

  const valRooms = document.getElementById('valRooms');
  const valComputers = document.getElementById('valComputers');
  const valHours = document.getElementById('valHours');

  const outKwh = document.getElementById('calcOutKwh');
  const outCost = document.getElementById('calcOutCost');
  const outCarbon = document.getElementById('calcOutCarbon');

  const TARIF_PLN = 1445;
  const FAKTOR_EMISI_CO2 = 0.85;
  const HARI_SEKOLAH = 22;

  function update() {
    const rooms = parseInt(sliderRooms.value, 10);
    const pcs = parseInt(sliderComputers.value, 10);
    const hours = parseFloat(sliderHours.value);

    if (valRooms) valRooms.textContent = `${rooms} Ruang`;
    if (valComputers) valComputers.textContent = `${pcs} Unit PC`;
    if (valHours) valHours.textContent = `${hours} Jam / Hari`;

    const kwh = Math.round(
      (rooms * 0.144 * 1.5 * HARI_SEKOLAH) +
      (pcs * 0.150 * 1.0 * HARI_SEKOLAH) +
      (rooms * 0.600 * hours * HARI_SEKOLAH)
    );

    if (outKwh) outKwh.textContent = `${kwh.toLocaleString('id-ID')} kWh`;
    if (outCost) outCost.textContent = `Rp ${Math.round(kwh * TARIF_PLN).toLocaleString('id-ID')}`;
    if (outCarbon) outCarbon.textContent = `${Math.round(kwh * FAKTOR_EMISI_CO2).toLocaleString('id-ID')} kg`;
  }

  [sliderRooms, sliderComputers, sliderHours].forEach(input => input.addEventListener('input', update));
  update();
}

function initTipsTabs() {
  const tabs = document.querySelectorAll('[data-tip-tab]');
  const panels = document.querySelectorAll('[data-tip-panel]');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.tipTab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(panel => {
        panel.style.display = (category === 'all' || panel.dataset.tipPanel === category) ? 'flex' : 'none';
      });
    });
  });
}
