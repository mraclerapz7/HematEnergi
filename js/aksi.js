document.addEventListener('DOMContentLoaded', () => {
  initChallenge();
  initPledge();
});

function initChallenge() {
  const checkboxes = document.querySelectorAll('.challenge-checkbox');
  const progressFill = document.getElementById('challengeProgressFill');
  const progressText = document.getElementById('challengeProgressText');
  const successAlert = document.getElementById('challengeSuccessAlert');
  const resetBtn = document.getElementById('resetChallengeBtn');

  if (!checkboxes.length) return;

  checkboxes.forEach((cb, idx) => {
    const key = `energy_challenge_day_${idx + 1}`;
    if (localStorage.getItem(key) === 'true') {
      cb.checked = true;
      cb.closest('.challenge-item')?.classList.add('completed');
    }

    cb.addEventListener('change', () => {
      const parent = cb.closest('.challenge-item');
      if (cb.checked) {
        parent?.classList.add('completed');
        localStorage.setItem(key, 'true');
      } else {
        parent?.classList.remove('completed');
        localStorage.removeItem(key);
      }
      updateProgress();
    });
  });

  function updateProgress() {
    const total = checkboxes.length;
    const completed = document.querySelectorAll('.challenge-checkbox:checked').length;
    const pct = Math.round((completed / total) * 100);

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${completed} dari ${total} Selesai (${pct}%)`;

    if (successAlert) {
      successAlert.style.display = completed === total ? 'block' : 'none';
      if (completed === total && typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkboxes.forEach((cb, idx) => {
        cb.checked = false;
        cb.closest('.challenge-item')?.classList.remove('completed');
        localStorage.removeItem(`energy_challenge_day_${idx + 1}`);
      });
      updateProgress();
    });
  }

  updateProgress();
}

function initPledge() {
  const nameInput = document.getElementById('pledgeNameInput');
  const classInput = document.getElementById('pledgeClassInput');
  const actionSelect = document.getElementById('pledgeActionSelect');

  const previewName = document.getElementById('previewName');
  const previewClass = document.getElementById('previewClass');
  const previewQuote = document.getElementById('previewQuote');
  const previewDate = document.getElementById('previewDate');

  if (!nameInput || !previewName) return;

  if (previewDate) {
    previewDate.textContent = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function update() {
    previewName.textContent = nameInput.value.trim() || 'Nama Kamu';
    previewClass.textContent = classInput.value.trim() || 'Siswa Kelas XI';
    previewQuote.textContent = `"${actionSelect.value}"`;
  }

  [nameInput, classInput].forEach(el => el.addEventListener('input', update));
  actionSelect.addEventListener('change', update);
}
