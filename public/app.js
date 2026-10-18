const sidebar = document.querySelector('[data-sidebar]');
const toggles = document.querySelectorAll('[data-menu-toggle]');

function setMenu(open) {
  if (!sidebar) return;
  sidebar.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  for (const toggle of toggles) {
    if (toggle.matches('button')) toggle.setAttribute('aria-expanded', String(open));
  }
}

for (const toggle of toggles) {
  toggle.addEventListener('click', () => setMenu(!sidebar?.classList.contains('is-open')));
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) setMenu(false);
});
