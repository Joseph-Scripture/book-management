 // API Configuration
      const API_URL = "http://127.0.0.1:8080";
      
      // DOM Elements
      const menuBar = document.querySelector("#main-content nav .bx.bx-menu");
      const sidebar = document.getElementById("sidebar");
      const notification = document.querySelector(".bell-dropdown");
      const activenav = document.querySelector(".dropdown-notification");
      const dropdownaccount = document.querySelector(".account-dropdown");
      const activedropdown = document.querySelector(".dropdown-account");
      const logoutLinks = document.querySelectorAll("#logout-link, #logout-link-dropdown");
      
      // Statistics Elements
      const totalUsersElement = document.getElementById("total-users");
      const totalBooksElement = document.getElementById("total-books");
      const totalTransactionsElement = document.getElementById("total-transactions");
      const systemStatusElement = document.getElementById("system-status");

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

      // Function to fetch statistics from the backend
      async function fetchStatistics() {
        // Check if user is admin
        if (!isAdmin()) {
          alert("Access denied. Admin privileges required.");
          window.location.href = "index.html";
          return;
        }

        const token = getToken();
        if (!token) {
          alert("Please login first");
          window.location.href = "login.html";
          return;
        }

        try {
          // Fetch total users
          const usersResponse = await fetch(`${API_URL}/user/countUsers`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (usersResponse.ok) {
            const totalUsers = await usersResponse.json();
            totalUsersElement.textContent = totalUsers;
          } else {
            console.error("Failed to fetch users count");
            totalUsersElement.textContent = "Error";
          }

          // Fetch total books
          const booksResponse = await fetch(`${API_URL}/api/books/countBooks`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (booksResponse.ok) {
            const totalBooks = await booksResponse.json();
            totalBooksElement.textContent = totalBooks;
          } else {
            console.error("Failed to fetch books count");
            totalBooksElement.textContent = "Error";
          }

          // Fetch total transactions
          const transactionsResponse = await fetch(`${API_URL}/api/payments/countTotalTransactions`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (transactionsResponse.ok) {
            const totalTransactions = await transactionsResponse.json();
            totalTransactionsElement.textContent = totalTransactions;
          } else {
            console.error("Failed to fetch transactions count");
            totalTransactionsElement.textContent = "Error";
          }

          // Update system status
          systemStatusElement.textContent = "Online";
          systemStatusElement.style.color = "#1cc88a";

        } catch (error) {
          console.error("Error fetching statistics:", error);
          systemStatusElement.textContent = "Offline";
          systemStatusElement.style.color = "#e74a3b";
        }
      }

      // Auto-refresh statistics every 30 seconds
      function startAutoRefresh() {
        setInterval(fetchStatistics, 30000);
      }

      // Initialize dashboard when page loads
      document.addEventListener('DOMContentLoaded', function() {
        fetchStatistics();
        startAutoRefresh();
      });