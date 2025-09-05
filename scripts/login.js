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
  const NGROK_URL = 	"https://98e57cea7371.ngrok-free.app";
  const apiUrl = `${NGROK_URL}/user/register`;

formContainer.addEventListener('submit', async(event)=> {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const userName = document.querySelector('#user-name').value
  const passwordValue = passwordInput.value;
  
  const loginData ={
    email:email,
    userName:userName,
    passwordValue:passwordValue


  };
  try{
    const response = await fetch(apiUrl,  {method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                mode: 'cors' 
            },);
            const data = await response.json();
            if(response.ok){
                localStorage.setItem('jwtToken', data.token);

              window.location.href= 'index.html';
            }else{
              error.textContent = data.error||'Invalid credentials'
            }
  }catch{
    // alert('Network error try again later')
    error.textContent = 'An error occured try again later';

  }

})
