document.addEventListener('DomContentLoaded', ()=>{

const div = document.querySelector('.clear'); 
const idValue = document.querySelector('.idValue');
const userName = document.querySelector('.name'); 
const searchBtn = document.querySelector('.search-btn');
const searchInp = document.getElementById('search'); 


function getToken() {
  return localStorage.getItem('token');
}


async function getSingle(username) {
  const token = getToken();
  if (!token) {
    div.innerHTML = `<span>Error: You are not logged in.</span>`;
    return;
  }
  
  if (!username) {
    div.innerHTML = `<span>Please enter a username to search.</span>`;
    return;
  }

  const API_URL = "https://53911fcfda7e.ngrok-free.app";

  try {
    const response = await fetch(`${API_URL}/user/admin/users/${username}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

  
    if (!response.ok) {
      const errorData = await response.json(); 
      div.innerHTML = `<span>Error: ${errorData.error || response.statusText}</span>`;
      return;
    }

    const user = await response.json();

    div.innerHTML = ''; 

    idValue.textContent = user.id;
    userName.textContent = user.username;

  } catch (error) {
    console.error("Failed to fetch user:", error);
    div.innerHTML = `<span>A network error occurred. Please try again.</span>`;
  }
}


searchBtn.addEventListener('click', () => {
  const usernameToSearch = searchInp.value.trim(); 

  getSingle(usernameToSearch);
});

})