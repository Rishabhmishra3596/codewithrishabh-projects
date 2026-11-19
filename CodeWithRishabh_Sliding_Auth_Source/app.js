const card = document.querySelector('#auth');
const login = document.querySelector('#login');
const signup = document.querySelector('#signup');
const toggle = document.querySelector('#toggle');
function showSignup(open) {
  card.classList.toggle('signup', open);
  login.hidden = open;
  signup.hidden = !open;
  toggle.textContent = open ? 'SIGN IN' : 'SIGN UP';
  document.querySelector('#greeting').textContent = open ? 'Welcome Back!' : 'Hello World';
  document.querySelector('#intro').textContent = open ? 'Sign in and continue your journey' : 'Sign up now and enjoy our site';
  document.querySelector('#status').textContent = '';
}
toggle.addEventListener('click', () => {
  showSignup(!card.classList.contains('signup'));
});
[login, signup].forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#status').textContent = 'Demo only: connect your backend to authenticate.';
}));
document.querySelector('#help').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#status').textContent = 'Connect your password reset endpoint here.';
});
