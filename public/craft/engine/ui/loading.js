// One loading screen for startup, world selection and return journeys.
let dismissTimer = null;

// `image` is a picture of where a portal leads (the destination's preview),
// shown above the bar while the next world loads; a broken one just goes.
export function showLoading(label = '', fraction = .08, image = null) {
  clearTimeout(dismissTimer);
  let root = document.getElementById('loading');
  if (!root) {
    root = document.createElement('div'); root.id = 'loading';
    root.innerHTML = '<div class="bar"><i></i></div>';
    document.body.append(root);
  }
  root.classList.remove('done');
  let status = root.querySelector('.loading-label');
  if (label && !status) {
    status = document.createElement('p'); status.className = 'loading-label';
    status.setAttribute('role', 'status'); root.append(status);
  }
  if (status) { status.textContent = label; status.hidden = !label; }
  let picture = root.querySelector('.loading-preview');
  if (image) {
    if (!picture) {
      picture = Object.assign(new Image(), { className: 'loading-preview', alt: '', decoding: 'async', referrerPolicy: 'no-referrer' });
      picture.addEventListener('error', () => picture.remove());
      root.prepend(picture);
    }
    picture.src = image;
  } else picture?.remove();
  setLoadingProgress(fraction);
}

export function setLoadingProgress(fraction) {
  const bar = document.querySelector('#loading .bar');
  if (!bar) return;
  const value = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  bar.querySelector('i').style.width = `${value}%`;
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Loading world' : '加载世界');
  bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100');
  bar.setAttribute('aria-valuenow', String(value));
}

export function finishLoading() {
  clearTimeout(dismissTimer);
  const root = document.getElementById('loading');
  if (!root) return;
  setLoadingProgress(1);
  root.classList.add('done');
  dismissTimer = setTimeout(() => root.remove(), 600);
}

export function hideLoading() {
  clearTimeout(dismissTimer);
  document.getElementById('loading')?.remove();
}
