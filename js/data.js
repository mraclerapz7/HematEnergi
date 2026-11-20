document.addEventListener('DOMContentLoaded', initDataPage);

async function initDataPage() {
  try {
    const response = await fetch('data/data-perilaku-energi.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderPage(data);
  } catch (err) {
    console.warn('Gagal memuat JSON via fetch, menggunakan dataset lokal:', err);
    loadFallbackData();
  }
}

function renderPage(data) {
  renderSummaryStats(data);
  renderCategoryChart(data.ringkasan?.kategori);
  renderItemChart(data.per_butir);
  renderDepartmentChart(data.per_jurusan);
  renderRayonChart(data.per_rayon);
  renderItemTable(data.per_butir);
}

function renderSummaryStats(data) {
  const total = document.getElementById('statTotalResponden');
  const avg = document.getElementById('statRataSkor');
  const bestPct = document.getElementById('statSangatBaik');
  const lowest = document.getElementById('statFokusKampanye');

  if (total) total.textContent = data.meta?.jumlah_responden || '636';
  if (avg) avg.textContent = `${data.ringkasan?.rata_rata_skor || 3.36}/4.0`;
  if (bestPct) bestPct.textContent = `${data.ringkasan?.kategori_persen?.['Sangat Baik'] || 59.4}%`;
  if (lowest) lowest.textContent = `${data.ringkasan?.sorotan?.butir_terendah?.[0]?.rata_rata || 3.22}`;
}

function renderCategoryChart(kategori = { 'Sangat Baik': 378, 'Baik': 234, 'Cukup': 23, 'Kurang': 1 }) {
  const ctx = document.getElementById('chartKategori');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Sangat Baik (59.4%)', 'Baik (36.8%)', 'Cukup (3.6%)', 'Kurang (0.2%)'],
      datasets: [{
        data: [kategori['Sangat Baik'], kategori['Baik'], kategori['Cukup'], kategori['Kurang']],
        backgroundColor: ['#14532D', '#166534', '#EAB308', '#EF4444'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 14, font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label.split(' ')[0]}: ${ctx.parsed} siswa (${((ctx.parsed / 636) * 100).toFixed(1)}%)`
          }
        }
      }
    }
  });
}

function renderItemChart(items = []) {
  const ctx = document.getElementById('chartButir');
  if (!ctx || !items.length) return;

  const labels = items.map(b => `${b.kode}: ${b.label}`);
  const scores = items.map(b => b.rata_rata);
  const colors = items.map(b => (b.kode === 'P04' || b.kode === 'P09') ? '#F59E0B' : (b.rata_rata >= 3.45 ? '#14532D' : '#166534'));

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Rata-Rata Skor',
        data: scores,
        backgroundColor: colors,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 2.5,
          max: 4.0,
          ticks: { stepSize: 0.25, font: { family: 'Plus Jakarta Sans' } },
          grid: { color: '#E2E8D8' },
          title: { display: true, text: 'Rata-rata Skor Likert (1 - 4)', font: { size: 11, family: 'Plus Jakarta Sans', weight: '600' } }
        },
        y: {
          ticks: { font: { size: 11, family: 'Plus Jakarta Sans', weight: '500' } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => ` Skor: ${ctx.parsed.x} / 4.00` } }
      }
    }
  });
}

function renderDepartmentChart(departments = []) {
  const ctx = document.getElementById('chartJurusan');
  if (!ctx || !departments.length) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: departments.map(j => j.kode),
      datasets: [{
        data: departments.map(j => j.rata_rata_skor),
        backgroundColor: ['#14532D', '#166534', '#22C55E', '#4ADE80', '#A3E635', '#FACC15', '#F59E0B'],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 3.0,
          max: 3.6,
          ticks: { stepSize: 0.1, font: { family: 'Plus Jakarta Sans' } },
          grid: { color: '#E2E8D8' },
          title: { display: true, text: 'Rata-rata Skor (1 - 4)', font: { size: 11, family: 'Plus Jakarta Sans', weight: '600' } }
        },
        x: {
          ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => departments[items[0].dataIndex]?.nama || '',
            label: (ctx) => ` Skor: ${ctx.parsed.y} / 4.00`
          }
        }
      }
    }
  });
}

function renderRayonChart(rayons = []) {
  const ctx = document.getElementById('chartRayon');
  if (!ctx || !rayons.length) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rayons.map(r => r.rayon),
      datasets: [{
        data: rayons.map(r => r.rata_rata_skor),
        backgroundColor: '#166534',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 3.0,
          max: 3.5,
          ticks: { stepSize: 0.1, font: { family: 'Plus Jakarta Sans' } },
          grid: { color: '#E2E8D8' },
          title: { display: true, text: 'Rata-rata Skor (1 - 4)', font: { size: 11, family: 'Plus Jakarta Sans', weight: '600' } }
        },
        x: {
          ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => ` Skor: ${ctx.parsed.y} / 4.00` } }
      }
    }
  });
}

function renderItemTable(items = []) {
  const tbody = document.getElementById('tabelDetailButir');
  if (!tbody || !items.length) return;

  tbody.innerHTML = items.map(item => {
    const badgeClass = item.rata_rata < 3.25 ? 'score-low' : (item.rata_rata < 3.40 ? 'score-med' : 'score-high');
    return `
      <tr>
        <td><strong>${item.kode}</strong></td>
        <td>
          <strong>${item.label}</strong>
          <div style="font-size: 0.8125rem; color: #6B7280; margin-top: 2px;">${item.pertanyaan}</div>
        </td>
        <td><span class="score-badge ${badgeClass}">${item.rata_rata.toFixed(2)}</span></td>
        <td><strong>${item.persen_sering}%</strong></td>
      </tr>
    `;
  }).join('');
}

function loadFallbackData() {
  const fallback = {
    meta: { jumlah_responden: 636 },
    ringkasan: {
      rata_rata_skor: 3.36,
      kategori: { 'Sangat Baik': 378, 'Baik': 234, 'Cukup': 23, 'Kurang': 1 },
      kategori_persen: { 'Sangat Baik': 59.4, 'Baik': 36.8, 'Cukup': 3.6, 'Kurang': 0.2 },
      sorotan: { butir_terendah: [{ rata_rata: 3.22 }] }
    },
    per_butir: [
      { kode: 'P01', label: 'Praktik hemat energi sehari-hari', pertanyaan: 'Secara sadar mempraktikkan tindakan pelestarian energi dalam aktivitas sehari-hari.', rata_rata: 3.51, persen_sering: 98.6 },
      { kode: 'P02', label: 'Tindakan nyata di bengkel, lab, kelas, rumah', pertanyaan: 'Melakukan tindakan nyata untuk menghemat energi di berbagai ruangan sekolah.', rata_rata: 3.46, persen_sering: 95.4 },
      { kode: 'P03', label: 'Matikan lampu/AC/kipas saat kelas kosong', pertanyaan: 'Berinisiatif mematikan lampu, AC, atau kipas angin saat jam istirahat/kelas kosong.', rata_rata: 3.37, persen_sering: 90.6 },
      { kode: 'P04', label: 'Batasi penggunaan gawai/laptop', pertanyaan: 'Membatasi pemakaian gawai/laptop untuk hal yang tidak perlu agar hemat energi.', rata_rata: 3.22, persen_sering: 86.3 },
      { kode: 'P05', label: 'Pilih fasilitas/transportasi hemat energi', pertanyaan: 'Menggunakan fasilitas transportasi umum, sepeda, atau jalan kaki jika dekat.', rata_rata: 3.30, persen_sering: 86.6 },
      { kode: 'P06', label: 'Cabut charger/steker setelah dipakai', pertanyaan: 'Mencabut kabel charger atau steker setelah selesai menggunakan peralatan listrik.', rata_rata: 3.45, persen_sering: 92.0 },
      { kode: 'P07', label: 'Manfaatkan cahaya matahari (buka jendela)', pertanyaan: 'Membuka tirai/jendela kelas pada siang hari agar lampu dapat dimatikan.', rata_rata: 3.36, persen_sering: 89.5 },
      { kode: 'P08', label: 'Atur suhu AC/kipas secukupnya', pertanyaan: 'Mengatur suhu AC secukupnya (24-25°C) atau kipas angin seperlunya.', rata_rata: 3.31, persen_sering: 90.4 },
      { kode: 'P09', label: 'Berani menegur/mengajak teman hemat listrik', pertanyaan: 'Berani menegur atau mengajak teman sekelas untuk ikut peduli energi.', rata_rata: 3.22, persen_sering: 86.8 },
      { kode: 'P10', label: 'Pastikan peralatan mati sebelum pulang', pertanyaan: 'Memastikan seluruh peralatan lab/kelas sudah mati sebelum pulang sekolah.', rata_rata: 3.41, persen_sering: 91.7 }
    ],
    per_jurusan: [
      { kode: 'PMN', nama: 'Pemasaran', rata_rata_skor: 3.51 },
      { kode: 'HTL', nama: 'Perhotelan', rata_rata_skor: 3.46 },
      { kode: 'KLN', nama: 'Kuliner', rata_rata_skor: 3.43 },
      { kode: 'TJKT', nama: 'Teknik Jaringan Komputer & Telekomunikasi', rata_rata_skor: 3.42 },
      { kode: 'DKV', nama: 'Desain Komunikasi Visual', rata_rata_skor: 3.34 },
      { kode: 'MPLB', nama: 'Manajemen Perkantoran & Layanan Bisnis', rata_rata_skor: 3.24 },
      { kode: 'PPLG', nama: 'Pengembangan Perangkat Lunak & Gim', rata_rata_skor: 3.24 }
    ],
    per_rayon: [
      { rayon: 'Tajur', rata_rata_skor: 3.41 },
      { rayon: 'Cicurug', rata_rata_skor: 3.38 },
      { rayon: 'Cibedug', rata_rata_skor: 3.37 },
      { rayon: 'Ciawi', rata_rata_skor: 3.34 },
      { rayon: 'Cisarua', rata_rata_skor: 3.34 },
      { rayon: 'Sukasari', rata_rata_skor: 3.33 },
      { rayon: 'Wikrama', rata_rata_skor: 3.31 }
    ]
  };
  renderPage(fallback);
}
