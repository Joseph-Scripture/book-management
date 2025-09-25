/////////////////////////// // constants
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('.toggle-password');
const form = document.querySelector('.login form');
const body = document.body;
const formContainer = document.querySelector('.login-form');
const error = document.querySelector('.Error');

// Password toggle functionality
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.querySelector('i').classList.toggle('fa-eye');
  togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
});

const NGROK_URL = "http://127.0.0.1:8080";
const apiUrl = `${NGROK_URL}/user/login`;

// Helper: decode JWT (without external libs)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid JWT", e);
    return null;
  }
}

formContainer.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const userName = document.querySelector('#user-name').value;
  const passwordValue = passwordInput.value;

  const loginData = {
    emailOrUsername: email,
    // username:userName,
    password: passwordValue
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      mode: 'cors'
    });

    console.log('Response status:', response.status);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.log('Non-JSON response:', text);

      if (response.ok) {
        window.location.href = 'index.html';
        return;
      } else {
        throw new Error(`Server error: ${response.status} - ${text}`);
      }
    }

    const data = await response.json();

    if (response.ok) {
      console.log('Success:', data);

      // Save JWT to localStorage
      if (data.token) {
        localStorage.setItem("jwt", data.token);

        //  Decode token to check roles
        const decoded = parseJwt(data.token);
        console.log("Decoded JWT:", decoded);

        // if (decoded && decoded.roles && decoded.roles.includes("ADMIN")) {
        //   window.location.href = 'http://127.0.0.1:5502/admin-panel-main22%20(6)/admin-panel-main/Dashboard.html';
        // } else {
        //   window.location.href = 'index.html';
        // }
        if (decoded && decoded.role === "ADMIN") {
    window.location.href = 'http://127.0.0.1:5502/admin-panel-main/Dashboard.html'; 
} else {
    window.location.href = 'index.html';
}
      } else {
        alert("Login successful but no token received.");
        window.location.href = 'index.html';
      }

      form.reset();
    } else {
      console.error('Error response:', data);

      if (data.message) {
        alert(`Login failed: ${data.message}`);
      } else if (data.error) {
        alert(`Login failed: ${data.error}`);
      } else {
        alert('Login failed. Please try again.');
      }
    }
  } catch (err) {
    console.error("Network error:", err);
    error.textContent = 'An error occurred, try again later';
  }
});