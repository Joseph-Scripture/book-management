const passwordInput = document.querySelector('#password');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm');
const emailError = document.querySelector('.emailError');
const passwordError = document.querySelector('.first-passError');
const confirmError = document.querySelector('.second-passError');
const form = document.querySelector('form');
const userName = document.querySelector('#username').value;

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


form.addEventListener('submit',async(event) => {
  event.preventDefault();
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (emailError.textContent || passwordError.textContent || confirmError.textContent) {
    event.preventDefault(); 
  }
  const NGROK_URL = 	"https://98e57cea7371.ngrok-free.app";
  const apiUrl = `${NGROK_URL}/user/register`;
  const emailText = email.value;
  const passwordText  =password.value;
  const requestBody = {
    email : emailText,
    password:passwordText,
    userName:userName,
  };
  try{
      const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                mode: 'cors' 
            }, );
            const data = await response.json();
             if (response.ok) { // Status code is 2xx
                console.log('Success:', data);
               
                console.log('message', data.message)
                form.reset(); 
            } else { 
                console.error('Error:', data);
                
                // messageDiv.textContent = `Error: ${data.error || 'Registration failed.'}`;
                // messageDiv.className = 'error';
            }

  }catch(error){
    console.log(error)

  }


});

document.querySelectorAll('.show-password').forEach(span => {
  span.addEventListener('click', () => {
    const passwordInput = span.previousElementSibling; 
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    span.querySelector('i').classList.toggle('fa-eye');
    span.querySelector('i').classList.toggle('fa-eye-slash');
  });
});



