document.addEventListener('DOMContentLoaded', function() {
    // API endpoints
    const BOOKS_API_URL = 'http://127.0.0.1:8080/api/books';
    const PAYMENTS_API_URL = 'http://127.0.0.1:8080/api/payments';
    
    // Get DOM elements
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const detailsPanel = document.getElementById('details-panel');
    const detailsCloseBtn = document.getElementById('details-close-btn');
    const searchInput = document.querySelector('.search-bar input[type="search"]');
    const categoryBookGrid = document.getElementById('category-book-grid');
    const categoryButtons = document.querySelectorAll('.category-filters button');
    const readNowBtn = document.querySelector('.read-now-btn');
    
    // Book details elements
    const detailsImg = document.getElementById('details-img');
    const detailsTitle = document.getElementById('details-title');
    const detailsAuthor = document.getElementById('details-author');
    const detailsRatingContainer = document.getElementById('details-rating-container');
    const detailsRating = document.getElementById('details-rating');
    const detailsPages = document.getElementById('details-pages');
    const detailsRatingsCount = document.getElementById('details-ratings-count');
    const detailsReviews = document.getElementById('details-reviews');
    const detailsDescription = document.getElementById('details-description');
    
    // State variables
    let currentSelectedBook = null;
    let recommendedBooks = [];
    let allBooks = [];
    let userBookAccess = {}; // Cache for user's book access
    
    // Function to get JWT token from localStorage
    function getAuthToken() {
        return localStorage.getItem('jwt') || localStorage.getItem('token');
    }
    
    // Function to check if user is authenticated
    function isAuthenticated() {
        const token = getAuthToken();
        if (!token) {
            showPopup('Please login to access the library.', true);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        return true;
    }
    
    // Function to show popup notification
    function showPopup(message, isError = false) {
        // Remove any existing popup
        const existingPopup = document.querySelector('.popup-notification');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `popup-notification ${isError ? 'error' : 'success'}`;
        
        // Style the popup
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.right = '20px';
        popup.style.padding = '15px 20px';
        popup.style.borderRadius = '5px';
        popup.style.color = 'white';
        popup.style.fontWeight = 'bold';
        popup.style.zIndex = '1000';
        popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        popup.style.maxWidth = '300px';
        popup.style.opacity = '0';
        popup.style.transform = 'translateX(100%)';
        popup.style.transition = 'all 0.3s ease';
        
        // Set background color based on message type
        if (isError) {
            popup.style.backgroundColor = '#e74a3b';
        } else {
            popup.style.backgroundColor = '#1cc88a';
        }
        
        // Set message content
        popup.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '18px';
        closeButton.onclick = function() {
            popup.remove();
        };
        popup.appendChild(closeButton);
        
        // Add to document
        document.body.appendChild(popup);
        
        // Animate in
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.style.opacity = '0';
                popup.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Function to create headers with authentication
    function createHeaders() {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }
    
    // Function to fetch all books (requires auth)
    async function fetchAllBooks() {
        if (!isAuthenticated()) return [];
        
        try {
            const response = await fetch(`${BOOKS_API_URL}?page=0&size=4`, {
                method: 'GET',
                headers: createHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                allBooks = data.content || [];
                return allBooks;
            } else if (response.status === 401) {
                showPopup('Session expired. Please login again.', true);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return [];
            } else {
                console.error('Failed to fetch books');
                showPopup('Failed to load books. Please try again later.', true);
                return [];
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            showPopup('Network error. Please check your connection.', true);
            return [];
        }
    }
    
    // Function to get book cover image with authentication
    async function getBookCoverUrl(bookId) {
        if (!isAuthenticated()) return './images/library-books/default-cover.jpg';
        
        try {
            const response = await fetch(`${BOOKS_API_URL}/cover/${bookId}`, {
                method: 'GET',
                headers: createHeaders()
            });
            
            if (response.ok) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } else if (response.status === 401) {
                console.error('Unauthorized: Token may have expired');
                return './images/library-books/default-cover.jpg';
            } else {
                console.error('Failed to fetch cover image');
                return './images/library-books/default-cover.jpg';
            }
        } catch (error) {
            console.error('Error fetching cover image:', error);
            return './images/library-books/default-cover.jpg';
        }
    }
    
    // Function to fetch recommended books (random selection from all books)
    async function fetchRecommendedBooks() {
        if (!isAuthenticated()) return [];
        
        try {
            const books = await fetchAllBooks();
            // Randomly shuffle and select 4 books for recommendation
            const shuffled = [...books].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, 4);
        } catch (error) {
            console.error('Error fetching recommended books:', error);
            return [];
        }
    }
    
    // Function to search books (requires auth)
    async function searchBooks(query) {
        if (!isAuthenticated()) return [];
        
        try {
            const response = await fetch(`${BOOKS_API_URL}/search?search=${encodeURIComponent(query)}&page=0&size=10`, {
                method: 'GET',
                headers: createHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.content || [];
            } else if (response.status === 401) {
                showPopup('Session expired. Please login again.', true);
                return [];
            } else {
                console.error('Failed to search books');
                return [];
            }
        } catch (error) {
            console.error('Error searching books:', error);
            return [];
        }
    }
    
    // Function to fetch books by genre (requires auth)
    async function fetchBooksByGenre(genre) {
        if (!isAuthenticated()) return [];
        
        try {
            // For "All" category, use the main books endpoint
            if (genre === 'all') {
                const response = await fetch(`${BOOKS_API_URL}?page=0&size=8`, {
                    method: 'GET',
                    headers: createHeaders()
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return data.content || [];
                }
                return [];
            }
            
            // For specific genres, use the genre endpoint
            const response = await fetch(`${BOOKS_API_URL}/genre?genre=${encodeURIComponent(genre)}&page=0&size=4`, {
                method: 'GET',
                headers: createHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.content || [];
            } else if (response.status === 401) {
                showPopup('Session expired. Please login again.', true);
                return [];
            } else {
                console.error('Failed to fetch books by genre');
                return [];
            }
        } catch (error) {
            console.error('Error fetching books by genre:', error);
            return [];
        }
    }
    
    // Function to check book access (requires auth)
    async function checkBookAccess(bookId) {
        if (!isAuthenticated()) return false;
        
        // Check cache first
        if (userBookAccess[bookId] !== undefined) {
            return userBookAccess[bookId];
        }
        
        try {
            const response = await fetch(`${PAYMENTS_API_URL}/access/${bookId}`, {
                method: 'GET',
                headers: createHeaders()
            });
            
            if (response.ok) {
                const hasAccess = await response.json();
                // Cache the result
                userBookAccess[bookId] = hasAccess;
                return hasAccess;
            } else if (response.status === 401) {
                showPopup('Session expired. Please login again.', true);
                return false;
            } else {
                console.error('Failed to check book access');
                return false;
            }
        } catch (error) {
            console.error('Error checking book access:', error);
            return false;
        }
    }
    
    // Function to initiate payment (requires auth)
   async function initiatePayment(bookId, durationDays) {
    if (!isAuthenticated()) return;
    
    // ADDED: Validate durationDays parameter
    if (!durationDays || durationDays < 1) {
        showPopup('Please enter a valid number of days.', true);
        return;
    }
    
    try {
        const response = await fetch(`${PAYMENTS_API_URL}/create`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({
                bookId: bookId,
                durationDays: durationDays
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Payment session URL:', data.sessionUrl);
            
            // Redirect to Stripe checkout
            if (data.sessionUrl) {
                window.location.href = data.sessionUrl;
            } else {
                showPopup('Payment session URL not received. Please try again.', true);
            }
        } else if (response.status === 401) {
            showPopup('Session expired. Please login again.', true);
        } else {
            const errorText = await response.text();
            console.error('Payment failed:', errorText);
            showPopup('Failed to initiate payment. Please try again.', true);
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        showPopup('Error initiating payment. Please try again.', true);
    }
}
    
    // Function to render books in the grid
    async function renderBooks(books, container) {
        container.innerHTML = '';
        
        if (books.length === 0) {
            container.innerHTML = '<p class="no-books-message">No books found.</p>';
            return;
        }
        
        for (const book of books) {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.dataset.id = book.id;
            bookCard.dataset.title = book.title;
            bookCard.dataset.author = book.author;
            bookCard.dataset.pages = book.numberOfPages;
            bookCard.dataset.rating = '4.5';
            bookCard.dataset.ratingsCount = '100';
            bookCard.dataset.accessType = book.accessType;
            bookCard.dataset.price = book.pricePerMonth;
            bookCard.dataset.description = book.description || 'No description available.';
            
            // Get cover image with authentication
            const coverUrl = await getBookCoverUrl(book.id);
            
            // Check if user has access to this book
            const hasAccess = await checkBookAccess(book.id);
            
            // Create access type badge - Updated to show user's access status
            let accessBadge = '';
            if (hasAccess) {
                accessBadge = '<span class="access-badge owned">Owned</span>';
            } else if (book.accessType === 'FREE') {
                accessBadge = '<span class="access-badge free">Free</span>';
            } else {
                accessBadge = `<span class="access-badge paid">$${book.pricePerMonth || '0'}/month</span>`;
            }
            
            bookCard.innerHTML = `
                <div class="book-card-image">
                    <img src="${coverUrl}" alt="${book.title}" onerror="this.src='./images/library-books/default-cover.jpg'">
                    ${accessBadge}
                </div>
                <h3>${book.title}</h3>
                <p>${book.author}</p>
            `;
            
            bookCard.addEventListener('click', () => {
                showBookDetails(book);
            });
            
            container.appendChild(bookCard);
        }
    }
    
    // Function to show book details
    async function showBookDetails(book) {
        currentSelectedBook = book;
        
        // Get cover image with authentication
        const coverUrl = await getBookCoverUrl(book.id);
        detailsImg.src = coverUrl;
        detailsImg.onerror = function() {
            this.src = './images/library-books/default-cover.jpg';
        };
        
        detailsTitle.textContent = book.title;
        detailsAuthor.textContent = `By ${book.author}`;
        detailsPages.textContent = book.numberOfPages || 'N/A';
        detailsRatingsCount.textContent = '100';
        
        // Check if user has access to this book
        const hasAccess = await checkBookAccess(book.id);
        
        // Update access display based on user's access status
        if (hasAccess) {
            detailsReviews.innerHTML = '<span class="access-type owned">✓ You own this book</span>';
            readNowBtn.textContent = 'Read Now';
            readNowBtn.classList.add('owned');
        } else if (book.accessType === 'FREE') {
            detailsReviews.innerHTML = '<span class="access-type free">Free Book</span>';
            readNowBtn.textContent = 'Read Now';
            readNowBtn.classList.remove('owned');
        } else {
            detailsReviews.innerHTML = `<span class="access-type paid">$${book.pricePerMonth || '0'}/month</span>`;
            readNowBtn.textContent = 'Pay to Read';
            readNowBtn.classList.remove('owned');
        }
        
        detailsDescription.textContent = book.description || 'No description available.';
        
        // Replace stars with ISBN
        detailsRatingContainer.innerHTML = `
            <div class="isbn-display">
                <strong>ISBN:</strong> ${book.isbn || 'N/A'}
            </div>
        `;
        
        // Show details panel
        if (window.innerWidth < 1280) {
            detailsPanel.classList.add('is-visible');
            overlay.classList.add('is-visible');
        }
    }
    
    // Function to handle Read Now button click
   async function handleReadNow() {
    if (!currentSelectedBook) return;
    
    if (!isAuthenticated()) {
        showPopup('Please login to read this book.', true);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    try {
        // Check if book is free or user has access
        const hasAccess = await checkBookAccess(currentSelectedBook.id);
        const isFree = currentSelectedBook.accessType === 'FREE';
        
        if (isFree || hasAccess) {
            // For free books or books with access, redirect to reading page
            window.location.href = `readings.html?bookId=${currentSelectedBook.id}`;
        } else {
            // CHANGED: Redirect to cart page instead of initiating payment directly
            redirectToCart(currentSelectedBook);
        }
    } catch (error) {
        console.error('Error handling read now:', error);
        showPopup('Error accessing book. Please try again.', true);
    }
}


// Function to redirect user to cart page for payment
function redirectToCart(book) {
    if (!book || !book.id) {
        showPopup('Error: Book information not available.', true);
        return;
    }
    
    // Show confirmation message
    showPopup(`Redirecting to purchase page for "${book.title}"`);
    
    // Redirect to cart page with book ID
    setTimeout(() => {
        window.location.href = `cart.html?bookId=${book.id}`;
    }, 1000);
}


    
    // Function to handle search
    async function handleSearch(query) {
        if (!query || query.length < 2) {
            // If search query is empty or too short, show recommended books
            const recommendedSection = document.querySelector('.book-grid');
            renderBooks(recommendedBooks, recommendedSection);
            return;
        }
        
        const searchResults = await searchBooks(query);
        const recommendedSection = document.querySelector('.book-grid');
        renderBooks(searchResults, recommendedSection);
    }
    
    // Function to handle category filter
    async function handleCategoryFilter(genre) {
        // Show loading state
        categoryBookGrid.innerHTML = '<p class="no-books-message">Loading books...</p>';
        
        const genreBooks = await fetchBooksByGenre(genre);
        renderBooks(genreBooks, categoryBookGrid);
    }
    
    // Function to check URL parameters for payment success
    function checkPaymentSuccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentSuccess = urlParams.get('payment_success');
        const bookId = urlParams.get('bookId');
        
        if (paymentSuccess === 'true' && bookId) {
            showPopup('Payment successful! You now have access to this book.');
            
            // Clear the URL parameters without reloading the page
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Clear cache for this book to force re-check
            delete userBookAccess[bookId];
            
            // If we're showing a book details panel, refresh it
            if (currentSelectedBook && currentSelectedBook.id == bookId) {
                showBookDetails(currentSelectedBook);
            }
            
            // Refresh the book grids to show updated access status
            const recommendedSection = document.querySelector('.book-grid');
            renderBooks(recommendedBooks, recommendedSection);
            handleCategoryFilter('all');
        }
    }
    
    // Initialize the page
    async function initializePage() {
        // Check authentication first
        if (!isAuthenticated()) return;
        
        // Check for payment success
        checkPaymentSuccess();
        
        // Show loading state
        document.querySelector('.book-grid').innerHTML = '<p class="no-books-message">Loading books...</p>';
        categoryBookGrid.innerHTML = '<p class="no-books-message">Loading books...</p>';
        
        // Fetch all books first
        allBooks = await fetchAllBooks();
        
        if (allBooks.length === 0) {
            // If no books were fetched (likely due to auth error), stop initialization
            return;
        }
        
        // Load recommended books (random selection from all books)
        recommendedBooks = [...allBooks].sort(() => Math.random() - 0.5).slice(0, 4);
        const recommendedSection = document.querySelector('.book-grid');
        renderBooks(recommendedBooks, recommendedSection);
        
        // Load initial category books (all)
        handleCategoryFilter('all');
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Menu toggle
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('is-open');
            overlay.classList.add('is-visible');
        });
        
        // Overlay click to close panels
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
            detailsPanel.classList.remove('is-visible');
            overlay.classList.remove('is-visible');
        });
        
        // Details panel close button
        detailsCloseBtn.addEventListener('click', () => {
            detailsPanel.classList.remove('is-visible');
            overlay.classList.remove('is-visible');
        });
        
        // Search input
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
        
        // Category filters
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                document.querySelector('.category-filters .active')?.classList.remove('active');
                button.classList.add('active');
                
                // Handle category filter
                const genre = button.textContent.toLowerCase();
                handleCategoryFilter(genre);
            });
        });
        
        // Read Now button
        readNowBtn.addEventListener('click', handleReadNow);
    }
    
    // Start initializing the page
    initializePage();
});