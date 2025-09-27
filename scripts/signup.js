// Constants
const passwordInput = document.querySelector('#password');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm');
const emailError = document.querySelector('.emailError');
const passwordError = document.querySelector('.first-passError');
const confirmError = document.querySelector('.second-passError');
const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');

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

// Function to show custom popup notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'custom-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <h3>Registration Successful!</h3>
      <p>${message}</p>
      <button id="notification-ok">OK</button>
    </div>
  `;
  
  // Add styles if not already added
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .custom-notification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .notification-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .notification-content h3 {
        color: #4CAF50;
        margin-bottom: 15px;
      }
      .notification-content p {
        margin-bottom: 20px;
        line-height: 1.5;
      }
      #notification-ok {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
      #notification-ok:hover {
        background: #45a049;
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(notification);
  
  // Add event listener to OK button
  document.getElementById('notification-ok').addEventListener('click', function() {
    document.body.removeChild(notification);
    window.location.href = 'index.html';
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log('Form submission started'); // Debug log
  
  // Validate all fields
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();

  if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
    console.log('Validation failed'); // Debug log
    return; // Stop if validation fails
  }

  const API_URL = "http://127.0.0.1:8080";
  const apiUrl = `${API_URL}/user/register`;
  
  // Get values at submission time
  const emailText = email.value;
  const passwordText = password.value;
  const userName = usernameInput.value;

  const requestBody = {
    email: emailText,
    password: passwordText,
    username: userName,
  };

  console.log('Sending request to:', apiUrl); // Debug log
  console.log('Request body:', requestBody); // Debug log

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status); // Debug log
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType); // Debug log
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('Non-JSON response:', text); // Debug log
      
      if (response.ok) {
        console.log('Success - showing notification'); // Debug log
        // Show notification and redirect after user clicks OK
        showNotification('Please check your email to confirm your account. After confirmation, you can login.');
        return;
      } else {
        throw new Error(`Server error: ${response.status} - ${text}`);
      }
    }

    const data = await response.json();
    console.log('JSON response data:', data); // Debug log
    
    if (response.ok) {
      console.log('Success - showing notification'); // Debug log
      // If you have updateNavbar function, uncomment the next line
      // updateNavbar();
      form.reset();
      
      // Show notification and redirect after user clicks OK
      showNotification('Please check your email to confirm your account. After confirmation, you can login.');
      
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