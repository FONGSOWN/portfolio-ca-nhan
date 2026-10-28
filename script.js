const toggle = document.querySelector('.menu-button');
const links = document.querySelector('.navlinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  toggle.textContent = open ? '✕' : '☰';
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Mở menu');
  toggle.textContent = '☰';
}));
document.querySelector('#year').textContent = new Date().getFullYear();
