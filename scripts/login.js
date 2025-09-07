
// import { updateNavbar } from "./update-ui";

// constants
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('.toggle-password');
const form = document.querySelector('.login form');
const body = document.body;
const formContainer = document.querySelector('.login-form');
const error = document.querySelector('.Error')

// Password toggle functionality
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.querySelector('i').classList.toggle('fa-eye');
  togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
});
  const NGROK_URL = 	"https://53911fcfda7e.ngrok-free.app";
  const apiUrl = `${NGROK_URL}/user/login`;

formContainer.addEventListener('submit', async(event)=> {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const userName = document.querySelector('#user-name').value
  const passwordValue = passwordInput.value;
  
  const loginData ={
    emailOrUsername:email,
    // username:userName,
    password:passwordValue


  };
  try{
    const response = await fetch(apiUrl,  {
      method: 'POST',
      headers: {
                  'Content-Type': 'application/json',
              },
                credentials: 'include',
                body: JSON.stringify(loginData),
                mode: 'cors' 
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

     
  }catch{
    // alert('Network error try again later')
    error.textContent = 'An error occured try again later';

  }

})
