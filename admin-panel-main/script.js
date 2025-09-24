
// notification
const notification = document.querySelector(".bell-dropdown");
const activenav = document.querySelector(".dropdown-notification");

notification.addEventListener("click", function () {
  activenav.classList.toggle("visible-notification");
});

// profile account
const dropdownaccount = document.querySelector(".account-dropdown");
const activedropdown = document.querySelector(".dropdown-account");

dropdownaccount.addEventListener("click", function () {
  activedropdown.classList.toggle("visible-account");
});

// sidebar
const menuBar = document.querySelector("#main-content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
 
});






const inputValue = document.getElementById('username');
const searchBtn = document.getElementById('search-btn');
const userId = document.getElementById('userId');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('email');
const deleteBtn = document.querySelector('.bx-wrench');

const clear = document.querySelector('.clear')



// Getting User Data
async function getUser(inputValue) { 
  const API_URL = "http://127.0.0.1:8080";
  const apiUrl = `${API_URL}/user/${inputValue}`;
  
  try {
    const token = localStorage.getItem('token'); 

    if (token) {
      const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      // Check if the server responded with a success status (e.g., 200)
      if (!response.ok) {
        
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User data:", data);
      return data; 

    } else {
      alert("An error occurred. Please try again later"); 
      return null; 
    }
  } catch (error) {
    console.error("Fetch error:", error); 
    alert("An error occurred. Please try again later.");
    return null; 
  }
}
// Clear input text
clear.addEventListener('click', ()=> {
  usernameInput.value = '';
})


const usernameInput = document.getElementById('username');

searchBtn.addEventListener('click', async () => { 

  const inputValue = usernameInput.value.trim(); 

  if (!inputValue) {
    alert('Please enter a username to search for.');
    return; 
  }

  const userData = await getUser(inputValue);

  if (userData) {
    
    userId.textContent = userData.id || 'N/A';
    userName.textContent = userData.name || 'N/A';
    userEmail.textContent = userData.email || 'N/A';
  } else {
    alert(`User with name '${inputValue}' does not exist or an error occurred.`);
    userId.textContent = '';
    userName.textContent = '';
    userEmail.textContent = '';
  }
});

// Logout
const logout = document.querySelector('.logout')
logout.addEventListener('click', ()=>{
  localStorage.removeItem('token');
  alert('Successfully logged out');
  window.location.href = '../signup.html';
})