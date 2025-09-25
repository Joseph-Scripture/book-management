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

// DOM elements
const searchBtn = document.getElementById('search-btn');
const usernameInput = document.getElementById('username');
const tbody = document.querySelector('tbody');

// Base API URL
const API_URL = "http://127.0.0.1:8080/user";

// Function to get JWT token from localStorage
function getToken() {
    return localStorage.getItem('jwt');
}

// Function to show confirmation dialog
function showConfirmation(message) {
    return confirm(message);
}

// Function to show alert message
function showAlert(message, type = 'info') {
    alert(message);
}

// Function to update user table row
function updateUserTable(userData) {
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Create new row
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${userData.id || 'N/A'}</td>
        <td>${userData.username || 'N/A'}</td>
        <td>${userData.email || 'N/A'}</td>
        <td>
            <div class="btn-opsi">
                <button class="btn-suspend" onclick="suspendUser('${userData.username}')">
                    <i class="bx bx-pause"></i> Suspend
                </button>
                <button class="btn-activate" onclick="activateUser('${userData.username}')">
                    <i class="bx bx-play"></i> Activate
                </button>
                <button class="btn-del-pet" onclick="deleteUser('${userData.username}')">
                    <i class="bx bx-trash"></i> Delete
                </button>
            </div>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Function to search user
async function searchUser(username) {
    const token = getToken();
    
    if (!token) {
        showAlert('Please login first');
        return null;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            } else if (response.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Search error:", error);
        showAlert(error.message);
        return null;
    }
}

// Function to delete user
async function deleteUser(username) {
    if (!showConfirmation(`Are you sure you want to delete user: ${username}? This action cannot be undone.`)) {
        return;
    }
    
    const token = getToken();
    
    if (!token) {
        showAlert('Please login first');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            } else if (response.status === 404) {
                throw new Error('User not found');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
        showAlert(`User ${username} deleted successfully!`, 'success');
        
        // Clear the search results
        tbody.innerHTML = '';
        usernameInput.value = '';

    } catch (error) {
        console.error("Delete error:", error);
        showAlert(error.message);
    }
}

// Function to suspend user
async function suspendUser(username) {
    if (!showConfirmation(`Are you sure you want to suspend user: ${username}?`)) {
        return;
    }
    
    const token = getToken();
    
    if (!token) {
        showAlert('Please login first');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${username}/suspend`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            } else if (response.status === 404) {
                throw new Error('User not found');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
        showAlert(`User ${username} suspended successfully!`, 'success');

    } catch (error) {
        console.error("Suspend error:", error);
        showAlert(error.message);
    }
}

// Function to activate user
async function activateUser(username) {
    if (!showConfirmation(`Are you sure you want to activate user: ${username}?`)) {
        return;
    }
    
    const token = getToken();
    
    if (!token) {
        showAlert('Please login first');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${username}/activate`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            } else if (response.status === 404) {
                throw new Error('User not found');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
        showAlert(`User ${username} activated successfully!`, 'success');

    } catch (error) {
        console.error("Activate error:", error);
        showAlert(error.message);
    }
}

// Search button event listener
searchBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();

    if (!username) {
        showAlert('Please enter a username to search for.');
        return;
    }

    const userData = await searchUser(username);

    if (userData) {
        updateUserTable(userData);
    } else {
        tbody.innerHTML = '';
        showAlert(`User '${username}' does not exist or an error occurred.`);
    }
});

// Enter key support for search
usernameInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchBtn.click();
    }
});

// Make functions available globally for onclick events
window.deleteUser = deleteUser;
window.suspendUser = suspendUser;
window.activateUser = activateUser;
