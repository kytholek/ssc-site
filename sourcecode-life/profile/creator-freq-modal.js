/* ════════════════════════════════════════════════════════════════
   CREATOR FREQUENCY MODAL
   Functions: getPlayerSigData(), showCreatorFreqModal(data),
              closeCreatorModal()
   ════════════════════════════════════════════════════════════════ */

/**
 * Returns the current player's sig data object for use in the modal.
 * Pulls from the global `playerData` set by app.js.
 */
function getPlayerSigData() {
  if (!playerData) return null;

  const _fmt = (n) => typeof fmt === 'function'
    ? fmt(n.root, n.compound)
    : String(n.root);

  return {
    name:   playerData.name   || '',
    photo:  (function() {
      try { return localStorage.getItem('scl_avatar') || null; } catch(e) { return null; }
    })(),
    lc:  _fmt(playerData.cl),
    lp:  _fmt(playerData.lp),
    ex:  _fmt(playerData.ex),
    so:  typeof playerData.so !== 'undefined' ? _fmt(playerData.so) : null,
    ou:  typeof playerData.ou !== 'undefined' ? _fmt(playerData.ou) : null,
    ac:  typeof playerData.ac !== 'undefined' ? _fmt(playerData.ac) : null,
    th:  typeof playerData.th !== 'undefined' ? _fmt(playerData.th) : null,
  };
}

/**
 * Opens the creator frequency modal and populates it with `data`.
 * @param {Object|null} data - result of getPlayerSigData() or an ally's data
 */
function showCreatorFreqModal(data) {
  const modal      = document.getElementById('creatorFreqModal');
  const nameEl     = document.getElementById('modal-name');
  const lcEl       = document.getElementById('modal-lc');
  const photoEl    = document.getElementById('modal-photo');
  const photoPlaceholder = modal.querySelector('.modal-photo-placeholder');
  const chartEl    = document.getElementById('modal-freq-chart');

  if (!modal) return;

  // Name
  if (nameEl) nameEl.textContent = (data && data.name) ? data.name : '—';

  // Life Calling badge
  if (lcEl) lcEl.textContent = (data && data.lc) ? 'CALLING · ' + data.lc : '';

  // Photo / avatar
  if (photoEl && photoPlaceholder) {
    if (data && data.photo) {
      photoEl.src = data.photo;
      photoEl.style.display = 'block';
      photoPlaceholder.style.display = 'none';
    } else {
      photoEl.style.display = 'none';
      photoPlaceholder.style.display = 'flex';
    }
  }

  // Frequency chart grid
  if (chartEl && data) {
    const freqs = [
      { label: 'CALLING',  val: data.lc,  cls: 'lc-value' },
      { label: 'LIFE PATH', val: data.lp, cls: ''  },
      { label: 'EXPR',     val: data.ex,  cls: ''  },
      { label: 'SOUL',     val: data.so,  cls: ''  },
      { label: 'OUTER',    val: data.ou,  cls: ''  },
      { label: 'ACH',      val: data.ac,  cls: ''  },
      { label: 'THEME',    val: data.th,  cls: ''  },
    ].filter(f => f.val != null);

    chartEl.innerHTML = `
      <div class="modal-freqs">
        <div class="freqs-grid" style="grid-template-columns:repeat(${Math.min(freqs.length, 4)},1fr);">
          ${freqs.map(f => `
            <div class="freq-cell">
              <div class="freq-label">${f.label}</div>
              <div class="freq-value ${f.cls}">${f.val}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // Show modal
  modal.classList.remove('hidden');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the creator frequency modal.
 */
function closeCreatorModal() {
  const modal = document.getElementById('creatorFreqModal');
  if (!modal) return;
  modal.classList.remove('show');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}
