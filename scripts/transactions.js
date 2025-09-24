// API Configuration
        const API_BASE_URL = 'http://localhost:8080/api/payments'; // Update with your actual API base URL
        const TRANSACTIONS_ENDPOINT = `${API_BASE_URL}/transactions`;

        // DOM Elements
        const transactionsContent = document.getElementById('transactionsContent');
        const statusFilter = document.getElementById('statusFilter');
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        const applyFilters = document.getElementById('applyFilters');
        const logoutBtn = document.getElementById('logoutBtn');
        const usernameElement = document.getElementById('username');

        // State
        let allTransactions = [];
        let filteredTransactions = [];

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Check if user is authenticated
            const token = localStorage.getItem('jwt');
            if (!token || isTokenExpired(token)) {
                redirectToLogin();
                return;
            }

            // Try to extract username from token (if available)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.sub) {
                    usernameElement.textContent = payload.sub;
                }
            } catch (e) {
                console.error('Error parsing JWT token:', e);
            }

            // Load transactions
            loadTransactions();

            // Set up event listeners
            applyFilters.addEventListener('click', applyTransactionFilters);
            logoutBtn.addEventListener('click', handleLogout);

            // Set default date range to last 30 days
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            
            dateFrom.valueAsDate = thirtyDaysAgo;
            dateTo.valueAsDate = today;
        });

        // Function to check if JWT token is expired
        function isTokenExpired(token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp) {
                    // JWT exp is in seconds, Date.now() is in milliseconds
                    return Date.now() >= payload.exp * 1000;
                }
            } catch (e) {
                console.error('Error checking token expiration:', e);
            }
            return true; // If we can't parse, assume expired
        }

        // Function to load transactions from the API
        async function loadTransactions() {
            try {
                const token = localStorage.getItem('jwt');
                if (!token || isTokenExpired(token)) {
                    redirectToLogin();
                    return;
                }

                const response = await fetch(TRANSACTIONS_ENDPOINT, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    // Unauthorized - token might be expired
                    localStorage.removeItem('jwt');
                    redirectToLogin();
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const transactions = await response.json();
                allTransactions = transactions;
                filteredTransactions = [...allTransactions];
                
                displayTransactions(filteredTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                transactionsContent.innerHTML = `
                    <div class="error-message">
                        Failed to load transactions. Please try again later.
                    </div>
                `;
            }
        }

        // Function to display transactions in a table
        function displayTransactions(transactions) {
            if (transactions.length === 0) {
                transactionsContent.innerHTML = `
                    <div class="no-transactions">
                        No transactions found matching your criteria.
                    </div>
                `;
                return;
            }

            // Format date for display
            const formatDate = (dateString) => {
                if (!dateString) return 'N/A';
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });
            };

            // Format currency
            const formatCurrency = (amount, currency) => {
                if (!amount) return 'N/A';
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency || 'USD'
                }).format(amount);
            };

            // Create table HTML
            let tableHTML = `
                <table class="transactions-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Book Title</th>
                            <th>Amount</th>
                            <th>Duration (Days)</th>
                            <th>Status</th>
                            <th>Transaction Date</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            transactions.forEach(transaction => {
                const statusClass = `status-${transaction.paymentStatus.toLowerCase()}`;
                
                tableHTML += `
                    <tr>
                        <td>${transaction.transactionId}</td>
                        <td>${transaction.bookTitle}</td>
                        <td>${formatCurrency(transaction.amount, transaction.currency)}</td>
                        <td>${transaction.durationDays || 'N/A'}</td>
                        <td><span class="status ${statusClass}">${transaction.paymentStatus}</span></td>
                        <td>${formatDate(transaction.transactionDate)}</td>
                        <td>${formatDate(transaction.startDate)}</td>
                        <td>${formatDate(transaction.endDate)}</td>
                    </tr>
                `;
            });

            tableHTML += `
                    </tbody>
                </table>
            `;

            transactionsContent.innerHTML = tableHTML;
        }

        // Function to apply filters to transactions
        function applyTransactionFilters() {
            const statusFilterValue = statusFilter.value;
            const dateFromValue = dateFrom.value ? new Date(dateFrom.value) : null;
            const dateToValue = dateTo.value ? new Date(dateTo.value) : null;

            filteredTransactions = allTransactions.filter(transaction => {
                // Filter by status
                if (statusFilterValue !== 'all' && transaction.paymentStatus !== statusFilterValue) {
                    return false;
                }

                // Filter by date range
                if (dateFromValue || dateToValue) {
                    const transactionDate = new Date(transaction.transactionDate);
                    
                    if (dateFromValue && transactionDate < dateFromValue) {
                        return false;
                    }
                    
                    if (dateToValue && transactionDate > dateToValue) {
                        return false;
                    }
                }

                return true;
            });

            displayTransactions(filteredTransactions);
        }

        // Function to handle logout
        function handleLogout() {
            localStorage.removeItem('jwt');
            // Redirect to home page instead of login page
            window.location.href = 'index.html'; // Update with your actual home page URL
        }

        // Function to redirect to login page
        function redirectToLogin() {
            // Store the current page URL to return after login
            sessionStorage.setItem('returnUrl', window.location.href);
            window.location.href = 'login.html'; // Update with your actual login page URL
        }