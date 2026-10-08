const dock = document.querySelector('.dock');
const items = [...dock.querySelectorAll('.dock-item')];
function resetDock() {
  items.forEach(item => { item.style.setProperty('--magnify', 1); item.style.setProperty('--lift', '0px'); });
}
function magnifyAt(x) {
  items.forEach(item => {
    const bounds = item.getBoundingClientRect();
    const distance = Math.abs(x - bounds.left - bounds.width / 2);
    const influence = Math.max(0, 1 - distance / (bounds.width * 2.2));
    item.style.setProperty('--magnify', 1 + .26 * influence * influence);
    item.style.setProperty('--lift', `${-9 * influence}px`);
  });
}
dock.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') magnifyAt(event.clientX); });
dock.addEventListener('pointerleave', () => {
  resetDock();
  const active = items.find(item => item === document.activeElement);
  if (active) { const bounds = active.getBoundingClientRect(); magnifyAt(bounds.left + bounds.width / 2); }
});
items.forEach(item => {
  item.addEventListener('focus', () => { const bounds = item.getBoundingClientRect(); magnifyAt(bounds.left + bounds.width / 2); });
  item.addEventListener('blur', resetDock);
});
const points = [...document.querySelectorAll('.career-point')];
points.forEach(point => {
  point.setAttribute('aria-expanded', 'false');
  point.addEventListener('click', () => {
    const expanded = point.getAttribute('aria-expanded') === 'true';
    points.forEach(other => other.setAttribute('aria-expanded', 'false'));
    point.setAttribute('aria-expanded', String(!expanded));
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { points.forEach(point => point.setAttribute('aria-expanded', 'false')); document.activeElement?.blur(); }
});
const workToggle = document.querySelector('#work-toggle');
const workReveal = document.querySelector('#work-projects');
function setWork(open) {
  workToggle.setAttribute('aria-expanded', String(open));
  workReveal.classList.toggle('open', open);
  workReveal.inert = !open;
}
workToggle.addEventListener('click', () => setWork(workToggle.getAttribute('aria-expanded') !== 'true'));
let swipeStart = null;
workToggle.addEventListener('touchstart', event => { swipeStart = event.touches[0].clientY; }, {passive:true});
workToggle.addEventListener('touchend', event => {
  if (swipeStart !== null && event.changedTouches[0].clientY - swipeStart > 35) setWork(true);
  swipeStart = null;
}, {passive:true});
document.querySelectorAll('[data-project]').forEach(button => {
  const dialog = document.querySelector(`#project-${button.dataset.project}`);
  button.addEventListener('click', () => { dialog.showModal(); dialog.scrollTop = 0; });
  dialog.querySelectorAll('.project-close').forEach(close => close.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => button.focus({preventScroll:true}));
  const pause = dialog.querySelector('.gallery-pause');
  pause.addEventListener('click', () => {
    const paused = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Resume slideshow' : 'Pause slideshow';
    dialog.querySelector('.gallery-track').classList.toggle('paused', paused);
  });
});
function resizeProjects() {
  document.querySelectorAll('.project-dialog').forEach(dialog => {
    dialog.style.setProperty('--case-scale', (dialog.clientWidth || document.documentElement.clientWidth) / 1920);
  });
}
resizeProjects();
addEventListener('resize', resizeProjects);
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', resizeProjects));
