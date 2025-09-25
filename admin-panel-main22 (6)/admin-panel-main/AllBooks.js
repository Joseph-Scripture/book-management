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
const booksTableBody = document.getElementById("books-table-body");
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
let currentBook = null;

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

// Search button event listener
searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    currentPage = 0;
    loadBooks();
});

// Enter key support for search
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        currentPage = 0;
        loadBooks();
    }
});

// Pagination event listeners
firstPageBtn.addEventListener("click", function() {
    if (currentPage > 0) {
        currentPage = 0;
        loadBooks();
    }
});

prevPageBtn.addEventListener("click", function() {
    if (currentPage > 0) {
        currentPage--;
        loadBooks();
    }
});

nextPageBtn.addEventListener("click", function() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        loadBooks();
    }
});

lastPageBtn.addEventListener("click", function() {
    if (currentPage < totalPages - 1) {
        currentPage = totalPages - 1;
        loadBooks();
    }
});

// Modal event listeners
modalCancel.addEventListener("click", function() {
    confirmationModal.style.display = "none";
    currentAction = null;
    currentBook = null;
});

modalConfirm.addEventListener("click", function() {
    if (currentAction && currentBook) {
        confirmationModal.style.display = "none";
        executeAction(currentAction, currentBook);
        currentAction = null;
        currentBook = null;
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
function showConfirmation(action, book) {
    currentAction = action;
    currentBook = book;
    
    if (action === "delete") {
        modalTitle.textContent = "Delete Book";
        modalMessage.textContent = `Are you sure you want to delete book "${book.title}"? This action cannot be undone.`;
        modalConfirm.style.background = "#dc3545";
    } else if (action === "edit") {
        modalTitle.textContent = "Edit Book";
        modalMessage.textContent = `You will be redirected to edit book "${book.title}".`;
        modalConfirm.style.background = "#36b9cc";
    }
    
    confirmationModal.style.display = "flex";
}

// Function to load books from the API
async function loadBooks() {
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
        booksTableBody.innerHTML = "<tr><td colspan='8' style='text-align: center; padding: 20px;'>Loading books...</td></tr>";
        
        // Get search term from input
        const searchTerm = searchInput.value.trim();
        
        // Build URL - Use regular books endpoint when no search term, search endpoint when there is a term
        let url;
        if (searchTerm) {
            url = `${API_URL}/api/books/search?page=${currentPage}&size=${pageSize}&search=${encodeURIComponent(searchTerm)}`;
        } else {
            url = `${API_URL}/api/books?page=${currentPage}&size=${pageSize}`;
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
            } else if (response.status === 404) {
                throw new Error('No books found matching your search criteria.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
        
        // Extract pagination info
        totalPages = data.totalPages;
        totalElements = data.totalElements;
        
        // Update pagination controls
        updatePaginationControls();
        
        // Render books table
        renderBooksTable(data.content);
        hideError();

    } catch (error) {
        console.error("Error loading books:", error);
        showError(error.message);
        booksTableBody.innerHTML = "<tr><td colspan='8' style='text-align: center; padding: 20px; color: #dc3545;'>Error loading books. Please try again.</td></tr>";
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

// Function to render books table
function renderBooksTable(books) {
    if (books.length === 0) {
        booksTableBody.innerHTML = "<tr><td colspan='8' style='text-align: center; padding: 20px;'>No books found.</td></tr>";
        return;
    }

    booksTableBody.innerHTML = books.map(book => {
        // Determine access type styling
        const accessClass = book.accessType === 'FREE' ? 'access-free' : 'access-premium';
        
        // Fix price display - properly handle BigDecimal values
        let priceDisplay = 'Free';
        if (book.pricePerMonth !== null && book.pricePerMonth !== undefined && book.pricePerMonth !== 0) {
            // Convert to number and format as currency
            const price = parseFloat(book.pricePerMonth);
            if (!isNaN(price)) {
                priceDisplay = `$${price.toFixed(2)}`;
            }
        }
        
        return `
            <tr>
                <td>${book.id || 'N/A'}</td>
                
                <td>${book.title || 'N/A'}</td>
                <td>${book.author || 'N/A'}</td>
                <td>${book.genre || 'N/A'}</td>
                <td class="${accessClass}">${book.accessType || 'N/A'}</td>
                <td>${priceDisplay}</td>
                <td>
                    <div class="btn-opsi">
                        <div class="btn-edit-book">
                            <a href="#" onclick="showConfirmation('edit', ${JSON.stringify(book).replace(/"/g, '&quot;')})">
                                <i class="bx bx-edit"></i>
                            </a>
                        </div>
                        <div class="btn-del-book">
                            <a href="#" onclick="showConfirmation('delete', ${JSON.stringify(book).replace(/"/g, '&quot;')})">
                                <i class="bx bx-trash"></i>
                            </a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Function to execute action after confirmation
async function executeAction(action, book) {
    const token = getToken();
    if (!token) {
        showError("Please login first");
        return;
    }

    try {
        if (action === "delete") {
            const response = await fetch(`${API_URL}/api/books/${book.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Action failed with status: ${response.status}`);
            }

            // Reload books after successful action
            loadBooks();
            alert(`Book "${book.title}" deleted successfully!`);
        } else if (action === "edit") {
            alert(`Edit functionality for "${book.title}" would be implemented here.`);
        }

    } catch (error) {
        console.error(`Error ${action}ing book:`, error);
        showError(`Failed to ${action} book: ${error.message}`);
    }
}

// Make functions available globally for onclick events
window.showConfirmation = showConfirmation;

// Initialize page when loaded - Add slight delay to prevent blinking
document.addEventListener('DOMContentLoaded', function() {
    // Hide body initially to prevent blinking :cite[4]:cite[10]
    document.body.style.visibility = 'hidden';
    
    // Load books after a short delay
    setTimeout(() => {
        loadBooks();
        // Show body after content is loaded
        document.body.style.visibility = 'visible';
    }, 100);
});