const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('.toggle-password');
const form = document.querySelector('.login form');
const body = document.body;

// Password toggle functionality
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.querySelector('i').classList.toggle('fa-eye');
  togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
});
