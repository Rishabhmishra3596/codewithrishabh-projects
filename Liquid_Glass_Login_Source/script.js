const $ = (id) => document.getElementById(id);
const form = $('login');
const button = $('submit');
let timer;
function state(value) {
  $('loader').hidden = value !== 'loading';
  $('check').hidden = value !== 'success';
  button.disabled = value !== 'idle';
  button.textContent = value === 'loading' ? 'Signing in…' :
    value === 'success' ? 'Success ✓' : 'Log in →';
  $('message').textContent = value === 'success' ?
    'Demo complete — welcome aboard!' : 'Interactive UI demo';
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (button.disabled || !form.reportValidity()) return;
  state('loading');
  // UI animation only — no real authentication.
  timer = setTimeout(() => state('success'), 1500);
});
$('reset').addEventListener('click', () => {
  clearTimeout(timer);
  form.reset();
  $('password').type = 'password';
  $('eye').setAttribute('aria-pressed', 'false');
  $('eye').setAttribute('aria-label', 'Show password');
  state('idle');
  $('email').focus();
});
$('eye').addEventListener('click', () => {
  const visible = $('password').type === 'password';
  $('password').type = visible ? 'text' : 'password';
  $('eye').setAttribute('aria-pressed', String(visible));
  $('eye').setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
});
// Deterministic timeline used by the reel presentation.
window.seekVideo = (t) => {
  const u = ((t % 9) + 9) % 9;
  const email = 'rishabh@gmail.com';
  const password = 'demo12345';
  const count = (start, end, length) =>
    Math.floor(Math.min(1, Math.max(0, (u - start) / (end - start))) * length);
  $('email').value = email.slice(0, count(.85, 2.6, email.length));
  $('password').value = password.slice(0, count(3.1, 4.2, password.length));
  state(u < 5 ? 'idle' : u < 6.5 ? 'loading' : 'success');
  const cursor = $('cursor');
  const segment = u < .85 ? [0, .65, 65, 60, 23, 40.5] :
    u < 3.1 ? [2.6, 3, 23, 40.5, 23, 46] :
    [4.2, 4.9, 23, 46, 47, 53];
  cursor.hidden = (u > .85 && u < 2.6) ||
    (u > 3.1 && u < 4.2) || u > 5.4;
  const q = Math.min(1, Math.max(0, (u - segment[0]) / (segment[1] - segment[0])));
  const p = q * q * (3 - 2 * q);
  cursor.style.left = (segment[2] + (segment[4] - segment[2]) * p) + '%';
  cursor.style.top = (segment[3] + (segment[5] - segment[3]) * p) + '%';
  cursor.style.transform = u > 4.95 && u < 5.1 ? 'scale(.84)' : 'scale(1)';
  if (u > .85 && u < 2.6) $('email').focus();
  else if (u > 3.1 && u < 4.2) $('password').focus();
  else { $('email').blur(); $('password').blur(); }
  $('loader').style.animation = 'none';
  $('loader').style.transform = `rotate(${t * 300}deg)`;
};
