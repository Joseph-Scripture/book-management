const API_URL = "http://127.0.0.1:8080/user";
      
      // DOM Elements
      const menuBar = document.querySelector("#main-content nav .bx.bx-menu");
      const sidebar = document.getElementById("sidebar");
      const notification = document.querySelector(".bell-dropdown");
      const activenav = document.querySelector(".dropdown-notification");
      const dropdownaccount = document.querySelector(".account-dropdown");
      const activedropdown = document.querySelector(".dropdown-account");
      const logoutLinks = document.querySelectorAll("#logout-link, #logout-link-dropdown");
      const usersTableBody = document.getElementById("users-table-body");
      const searchInput = document.getElementById("search-input");
      const searchBtn = document.getElementById("search-btn");
      const errorMessage = document.getElementById("error-message");
      
      // Pagination Elements
      const firstPageBtn = document.getElementById("first-page");
      const prevPageBtn = document.getElementById("prev-page");
      const nextPageBtn = document.getElementById("next-page");
      const lastPageBtn = document.getElementById("last-page");
      const pageInfo = document.getElementById("page-info");
      
      // Modal Elements
      const confirmationModal = document.getElementById("confirmation-modal");
      const modalTitle = document.getElementById("modal-title");
      const modalMessage = document.getElementById("modal-message");
      const modalCancel = document.getElementById("modal-cancel");
      const modalConfirm = document.getElementById("modal-confirm");
      
      // Pagination State
      let currentPage = 0;
      let totalPages = 0;
      let totalElements = 0;
      let pageSize = 10;
      let currentAction = null;
      let currentUser = null;

      // Event Listeners
      menuBar.addEventListener("click", function () {
        sidebar.classList.toggle("hide");
      });

      notification.addEventListener("click", function () {
        activenav.classList.toggle("visible-notification");
      });

      dropdownaccount.addEventListener("click", function () {
        activedropdown.classList.toggle("visible-account");
      });

      logoutLinks.forEach(link => {
        link.addEventListener("click", function(e) {
          e.preventDefault();
          localStorage.removeItem("jwt");
          window.location.href = "login.html";
        });
      });

      searchBtn.addEventListener("click", function() {
        currentPage = 0;
        loadUsers();
      });

      searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          currentPage = 0;
          loadUsers();
        }
      });

      // Pagination event listeners
      firstPageBtn.addEventListener("click", function() {
        if (currentPage > 0) {
          currentPage = 0;
          loadUsers();
        }
      });

      prevPageBtn.addEventListener("click", function() {
        if (currentPage > 0) {
          currentPage--;
          loadUsers();
        }
      });

      nextPageBtn.addEventListener("click", function() {
        if (currentPage < totalPages - 1) {
          currentPage++;
          loadUsers();
        }
      });

      lastPageBtn.addEventListener("click", function() {
        if (currentPage < totalPages - 1) {
          currentPage = totalPages - 1;
          loadUsers();
        }
      });

      // Modal event listeners
      modalCancel.addEventListener("click", function() {
        confirmationModal.style.display = "none";
        currentAction = null;
        currentUser = null;
      });

      modalConfirm.addEventListener("click", function() {
        if (currentAction && currentUser) {
          confirmationModal.style.display = "none";
          executeAction(currentAction, currentUser);
          currentAction = null;
          currentUser = null;
        }
      });

      // Function to get JWT token
      function getToken() {
        return localStorage.getItem("jwt");
      }

      // Function to check if user is admin
      function isAdmin() {
        const token = getToken();
        if (!token) return false;
        
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          return decoded && decoded.role === "ADMIN";
        } catch (e) {
          console.error("Invalid JWT", e);
          return false;
        }
      }

      // Function to show error message
      function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
      }

      // Function to hide error message
      function hideError() {
        errorMessage.style.display = "none";
      }

      // Function to show confirmation modal
      function showConfirmation(action, user) {
        currentAction = action;
        currentUser = user;
        
        if (action === "delete") {
          modalTitle.textContent = "Delete User";
          modalMessage.textContent = `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`;
          modalConfirm.style.background = "#dc3545";
        } else if (action === "suspend") {
          modalTitle.textContent = "Suspend User";
          modalMessage.textContent = `Are you sure you want to suspend user "${user.username}"?`;
          modalConfirm.style.background = "#ffc107";
          modalConfirm.style.color = "#000";
        } else if (action === "activate") {
          modalTitle.textContent = "Activate User";
          modalMessage.textContent = `Are you sure you want to activate user "${user.username}"?`;
          modalConfirm.style.background = "#28a745";
          modalConfirm.style.color = "#fff";
        }
        
        confirmationModal.style.display = "flex";
      }

      // Function to load users from the API
      async function loadUsers() {
        // Check if user is admin
        if (!isAdmin()) {
          showError("Access denied. Admin privileges required.");
          return;
        }

        const token = getToken();
        if (!token) {
          showError("Please login first");
          return;
        }

        try {
          // Show loading state
          usersTableBody.innerHTML = "<tr><td colspan='7' style='text-align: center; padding: 20px;'>Loading users...</td></tr>";
          
          // Build URL with pagination and search parameters
          let url = `${API_URL}/admin/users/getAllUsers?page=${currentPage}&size=${pageSize}`;
          const searchTerm = searchInput.value.trim();
          if (searchTerm) {
            // a search endpoint for getAllUsers
            // We'll filter after receiving all data
          }

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            if (response.status === 403) {
              throw new Error('Access denied. Admin privileges required.');
            } else {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          }

          const data = await response.json();
          
          // Extract pagination info
          totalPages = data.totalPages;
          totalElements = data.totalElements;
          
          // Filter data if search term exists
          let users = data.content;
          if (searchTerm) {
            users = users.filter(user => 
              user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          // Update pagination controls
          updatePaginationControls();
          
          // Render users table
          renderUsersTable(users);
          hideError();

        } catch (error) {
          console.error("Error loading users:", error);
          showError(error.message);
          usersTableBody.innerHTML = "<tr><td colspan='7' style='text-align: center; padding: 20px; color: #dc3545;'>Error loading users. Please try again.</td></tr>";
        }
      }

      // Function to update pagination controls
      function updatePaginationControls() {
        // Update page info
        pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages || 1}`;
        
        // Update button states
        firstPageBtn.disabled = currentPage === 0;
        prevPageBtn.disabled = currentPage === 0;
        nextPageBtn.disabled = currentPage >= totalPages - 1;
        lastPageBtn.disabled = currentPage >= totalPages - 1;
      }

      // Function to render users table
      function renderUsersTable(users) {
        if (users.length === 0) {
          usersTableBody.innerHTML = "<tr><td colspan='7' style='text-align: center; padding: 20px;'>No users found.</td></tr>";
          return;
        }

        usersTableBody.innerHTML = users.map(user => `
          <tr>
            <td>${user.id || 'N/A'}</td>
            <td class="image-user-tab">
              <img src="${user.profileImageUrl || 'user.png'}" alt="${user.username}" onerror="this.src='user.png'">
            </td>
            <td>${user.username || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.role || 'N/A'}</td>
            <td class="status-active">Active</td>
            <td>
              <div class="btn-opsi">
                <div class="btn-setting-pet">
                  <a href="#" onclick="showConfirmation('suspend', ${JSON.stringify(user).replace(/"/g, '&quot;')})">
                    <i class="bx bx-pause"></i>
                  </a>
                </div>
                <div class="btn-del-pet">
                  <a href="#" onclick="showConfirmation('delete', ${JSON.stringify(user).replace(/"/g, '&quot;')})">
                    <i class="bx bx-trash"></i>
                  </a>
                </div>
              </div>
            </td>
          </tr>
        `).join('');
      }

      // Function to execute action after confirmation
      async function executeAction(action, user) {
        const token = getToken();
        if (!token) {
          showError("Please login first");
          return;
        }

        try {
          let endpoint = '';
          let method = '';

          if (action === "delete") {
            endpoint = `${API_URL}/admin/users/${user.username}`;
            method = 'DELETE';
          } else if (action === "suspend") {
            endpoint = `${API_URL}/admin/users/${user.username}/suspend`;
            method = 'PATCH';
          } else if (action === "activate") {
            endpoint = `${API_URL}/admin/users/${user.username}/activate`;
            method = 'PATCH';
          }

          const response = await fetch(endpoint, {
            method: method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Action failed with status: ${response.status}`);
          }

          // Reload users after successful action
          loadUsers();
          alert(`User ${user.username} ${action}ed successfully!`);

        } catch (error) {
          console.error(`Error ${action}ing user:`, error);
          showError(`Failed to ${action} user: ${error.message}`);
        }
      }

      // Make functions available globally for onclick events
      window.showConfirmation = showConfirmation;

      // Initialize page when loaded
      document.addEventListener('DOMContentLoaded', function() {
        loadUsers();
      });