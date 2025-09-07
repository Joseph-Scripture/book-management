// Constants
const passwordInput = document.querySelector('#password');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm');
const emailError = document.querySelector('.emailError');
const passwordError = document.querySelector('.first-passError');
const confirmError = document.querySelector('.second-passError');
const form = document.querySelector('form');
const usernameInput = document.querySelector('#username'); // Changed to get the element, not value

// Email validation
function validateEmail() {
  if (email.validity.valueMissing) {
    emailError.textContent = 'Enter an email';
    return false;
  } else if (email.validity.typeMismatch) {
    emailError.textContent = 'Please enter a valid email (e.g., user@example.com)';
    return false;
  } else {
    emailError.textContent = '';
    return true;
  }
}

function validatePassword() {
  if (password.validity.valueMissing) {
    passwordError.textContent = 'Enter a password';
    return false;
  } else if (password.validity.tooShort) {
    passwordError.textContent = 'Password must be at least 8 characters';
    return false;
  } else {
    passwordError.textContent = '';
    return true;
  }
}

function validateConfirmPassword() {
  if (confirmPassword.validity.valueMissing) {
    confirmError.textContent = 'Confirm your password';
    return false;
  } else if (confirmPassword.value !== password.value) {
    confirmError.textContent = 'Passwords do not match';
    return false;
  } else {
    confirmError.textContent = '';
    return true;
  }
}

email.addEventListener('input', validateEmail);
password.addEventListener('input', validatePassword);
confirmPassword.addEventListener('input', validateConfirmPassword);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Validate all fields
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();

  if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
    return; // Stop if validation fails
  }

  const API_URL = "https://53911fcfda7e.ngrok-free.app";
  const apiUrl = `${API_URL}/user/register`;
  
  // Get values at submission time
  const emailText = email.value;
  const passwordText = password.value;
  const userName = usernameInput.value; // Get value when form is submitted

  const requestBody = {
    email: emailText,
    password: passwordText,
    username: userName,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('Non-JSON response:', text);
      
      if (response.ok) {
        // Success but no JSON - redirect
        window.location.href = 'index.html';
        return;
      } else {
        throw new Error(`Server error: ${response.status} - ${text}`);
      }
    }

    const data = await response.json();
    
    if (response.ok) {
      console.log('Success:', data);
      updateNavbar(); // Uncomment if you have this function
      form.reset();
      window.location.href = 'index.html';
    } else {
      console.error('Error response:', data);
      
      // Display error message to user
      if (data.message) {
        alert(`Registration failed: ${data.message}`);
      } else if (data.error) {
        alert(`Registration failed: ${data.error}`);
      } else {
        alert('Registration failed. Please try again.');
      }
    }

  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please check your connection and try again.');
  }
});

// Password visibility toggle
document.querySelectorAll('.show-password').forEach(span => {
  span.addEventListener('click', () => {
    const passwordInput = span.previousElementSibling; 
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    span.querySelector('i').classList.toggle('fa-eye');
    span.querySelector('i').classList.toggle('fa-eye-slash');
  });
});