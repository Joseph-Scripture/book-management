
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm');
const emailError = document.querySelector('.emailError');
const passwordError = document.querySelector('.first-passError');
const confirmError = document.querySelector('.second-passError');
const form = document.querySelector('form');

// Email validation
function validateEmail() {
  if (email.validity.valueMissing) {
    emailError.textContent = 'Enter an email';
  } else if (email.validity.typeMismatch) {
    emailError.textContent = 'Please enter a valid email (e.g., user@example.com)';
  } else {
    emailError.textContent = '';
  }
}


function validatePassword() {
  if (password.validity.valueMissing) {
    passwordError.textContent = 'Enter a password';
  } else if (password.validity.tooShort) {
    passwordError.textContent = 'Password must be at least 8 characters';
  } else {
    passwordError.textContent = '';
  }
}


function validateConfirmPassword() {
  if (confirmPassword.validity.valueMissing) {
    confirmError.textContent = 'Confirm your password';
  } else if (confirmPassword.value !== password.value) {
    confirmError.textContent = 'Passwords do not match';
  } else {
    confirmError.textContent = '';
  }
}


email.addEventListener('input', validateEmail);
password.addEventListener('input', validatePassword);
confirmPassword.addEventListener('input', validateConfirmPassword);


form.addEventListener('submit', (event) => {
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (emailError.textContent || passwordError.textContent || confirmError.textContent) {
    event.preventDefault(); 
  }
});