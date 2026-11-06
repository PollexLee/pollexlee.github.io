// Diary Chest decryption and interactive letter system.
// Fully compatible with Astro's AES-256-GCM + PBKDF2 scheme.

const STORAGE_KEY = 'diary-answer';
const DIARY_INDEX_URL = 'data/diary/_index.json';
const DIARY_DOC_BASE = 'data/diary/';

// Decode base64 to Uint8Array
const B64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const normalize = s => s.replace(/[\s　]/g, '');

export async function decryptPayload(payload, answer) {
  const salt = B64(payload.salt);
  const iv = B64(payload.iv);
  const cipher = B64(payload.data);
  const iterations = Number(payload.iterations);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(normalize(answer)),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return new TextDecoder().decode(plain);
}

let cachedLetters = null;
let isUnlocking = false;

function getAllContainers() {
  return document.querySelectorAll('.chest-container');
}

function showError(msg) {
  getAllContainers().forEach(c => {
    const errorMsg = c.querySelector('.chest-error-msg');
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
    }
  });
}

function clearError() {
  getAllContainers().forEach(c => {
    const errorMsg = c.querySelector('.chest-error-msg');
    if (errorMsg) {
      errorMsg.textContent = '';
      errorMsg.style.display = 'none';
    }
  });
}

function renderLettersToAll(letters) {
  getAllContainers().forEach(container => {
    const lettersList = container.querySelector('.chest-letters-list');
    if (!lettersList) return;

    lettersList.innerHTML = '';
    if (!letters || letters.length === 0) {
      lettersList.innerHTML = '<p class="empty-hint">宝箱里暂时空空如也…</p>';
      return;
    }

    letters.forEach(item => {
      const slug = item.url.replace(/^\/diary\//, '').replace(/\/$/, '');
      const li = document.createElement('li');
      li.className = 'letter-card-item';
      li.setAttribute('data-slug', slug);
      li.setAttribute('data-title', item.title);
      li.setAttribute('data-date', item.date);
      li.innerHTML = `
        <div class="letter-stamp">✉️</div>
        <div class="letter-info">
          <div class="letter-title">${item.title}</div>
          <div class="letter-meta">
            <span class="letter-date">📅 ${item.date}</span>
          </div>
        </div>
        <button type="button" class="mc-button letter-open-btn" data-slug="${slug}">拆开信件</button>
      `;
      lettersList.appendChild(li);
    });

    const lockedView = container.querySelector('.chest-locked-view');
    const unlockedView = container.querySelector('.chest-unlocked-view');
    const letterDetailView = container.querySelector('.chest-letter-detail');
    if (lockedView) lockedView.style.display = 'none';
    if (unlockedView) unlockedView.style.display = 'block';
    if (letterDetailView) letterDetailView.style.display = 'none';
  });
}

export async function attemptUnlock(answer) {
  if (isUnlocking) return false;
  clearError();
  const cleanAns = normalize(answer || '');
  if (!cleanAns) {
    showError('请输入密码后再解锁');
    return false;
  }

  isUnlocking = true;
  getAllContainers().forEach(c => {
    const btn = c.querySelector('.chest-unlock-btn');
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('data-original-text', btn.textContent);
      btn.textContent = '正在开启宝箱…';
    }
  });

  try {
    const res = await fetch(DIARY_INDEX_URL);
    if (!res.ok) throw new Error('无法读取日记密文');
    const payload = await res.json();
    const plainJson = await decryptPayload(payload, cleanAns);
    const items = JSON.parse(plainJson);

    sessionStorage.setItem(STORAGE_KEY, cleanAns);
    cachedLetters = items;

    // Render letters to all current containers
    renderLettersToAll(items);

    // Open 3D chest in scene
    if (window.__chest?.open) {
      window.__chest.open();
    }
    return true;
  } catch (err) {
    console.warn('Unlock failed:', err);
    showError('密码不对，箱锁纹丝不动。再想想？');
    return false;
  } finally {
    isUnlocking = false;
    getAllContainers().forEach(c => {
      const btn = c.querySelector('.chest-unlock-btn');
      if (btn) {
        btn.disabled = false;
        const orig = btn.getAttribute('data-original-text');
        if (orig) btn.textContent = orig;
      }
    });
  }
}

export async function openLetter(slug, title, date) {
  const savedAnswer = sessionStorage.getItem(STORAGE_KEY);
  if (!savedAnswer) {
    showError('会话已失效，请重新输入密码');
    return;
  }

  getAllContainers().forEach(c => {
    const lockedView = c.querySelector('.chest-locked-view');
    const unlockedView = c.querySelector('.chest-unlocked-view');
    const letterDetailView = c.querySelector('.chest-letter-detail');
    const titleEl = c.querySelector('.letter-view-title');
    const dateEl = c.querySelector('.letter-view-date');
    const bodyEl = c.querySelector('.letter-view-content');

    if (lockedView) lockedView.style.display = 'none';
    if (unlockedView) unlockedView.style.display = 'none';
    if (letterDetailView) letterDetailView.style.display = 'block';

    if (titleEl) titleEl.textContent = title;
    if (dateEl) dateEl.textContent = date;
    if (bodyEl) bodyEl.innerHTML = '<div class="letter-loading">正在小心拆阅信件…</div>';
  });

  try {
    const res = await fetch(`${DIARY_DOC_BASE}${slug}.json`);
    if (!res.ok) throw new Error('无法获取信件内容');
    const payload = await res.json();
    const html = await decryptPayload(payload, savedAnswer);

    getAllContainers().forEach(c => {
      const bodyEl = c.querySelector('.letter-view-content');
      if (bodyEl) bodyEl.innerHTML = html;
    });
  } catch (err) {
    getAllContainers().forEach(c => {
      const bodyEl = c.querySelector('.letter-view-content');
      if (bodyEl) bodyEl.innerHTML = '<p class="letter-error">信件纸张泛黄磨损，无法完整解开内容。</p>';
    });
  }
}

function relockChest() {
  sessionStorage.removeItem(STORAGE_KEY);
  cachedLetters = null;
  if (window.__chest?.close) {
    window.__chest.close();
  }

  getAllContainers().forEach(c => {
    const lockedView = c.querySelector('.chest-locked-view');
    const unlockedView = c.querySelector('.chest-unlocked-view');
    const letterDetailView = c.querySelector('.chest-letter-detail');
    const input = c.querySelector('.chest-pw-input');

    if (lockedView) lockedView.style.display = 'block';
    if (unlockedView) unlockedView.style.display = 'none';
    if (letterDetailView) letterDetailView.style.display = 'none';
    if (input) input.value = '';
  });
  clearError();
}

function backToLetters() {
  getAllContainers().forEach(c => {
    const lockedView = c.querySelector('.chest-locked-view');
    const unlockedView = c.querySelector('.chest-unlocked-view');
    const letterDetailView = c.querySelector('.chest-letter-detail');

    if (lockedView) lockedView.style.display = 'none';
    if (unlockedView) unlockedView.style.display = 'block';
    if (letterDetailView) letterDetailView.style.display = 'none';
  });
}

export function initDiaryChest() {
  // 1. Prevent form submit refresh
  document.addEventListener('submit', (e) => {
    if (e.target.closest('#chest-password-form') || e.target.closest('.chest-container')) {
      e.preventDefault();
      e.stopPropagation();
      const form = e.target.closest('.chest-container') || document;
      const input = form.querySelector('.chest-pw-input');
      if (input) attemptUnlock(input.value);
      return false;
    }
  }, true);

  // 2. Click delegation
  document.addEventListener('click', (e) => {
    // Unlock button
    const unlockBtn = e.target.closest('.chest-unlock-btn');
    if (unlockBtn) {
      e.preventDefault();
      e.stopPropagation();
      const container = unlockBtn.closest('.chest-container') || document;
      const input = container.querySelector('.chest-pw-input');
      if (input) attemptUnlock(input.value);
      return;
    }

    // Re-lock button
    const relockBtn = e.target.closest('#chest-relock-btn');
    if (relockBtn) {
      e.preventDefault();
      e.stopPropagation();
      relockChest();
      return;
    }

    // Back to letter list button
    const backBtn = e.target.closest('#chest-back-to-list');
    if (backBtn) {
      e.preventDefault();
      e.stopPropagation();
      backToLetters();
      return;
    }

    // Letter item click
    const letterItem = e.target.closest('.letter-card-item');
    if (letterItem) {
      e.preventDefault();
      e.stopPropagation();
      const slug = letterItem.getAttribute('data-slug');
      const title = letterItem.getAttribute('data-title');
      const date = letterItem.getAttribute('data-date');
      if (slug) openLetter(slug, title, date);
      return;
    }
  });

  // 3. Keydown delegation (Enter key inside password input)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = e.target.closest('.chest-pw-input');
      if (input) {
        e.preventDefault();
        e.stopPropagation();
        attemptUnlock(input.value);
      }
    }
  }, true);

  // 4. Initial check if session has answer
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved) {
    attemptUnlock(saved);
  }
}
