/**
 * Library Management System API Client
 * 
 * This module provides a clean, promise-based interface for interacting with the
 * Library Management System API. It handles authentication, request/response
 * formatting, and error handling.
 */

const API_BASE_URL = 'https://your-api-domain.com/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Set the authentication token
   * @param {string} token - JWT token for authentication
   */
  setAuthToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear the authentication token
   */
  clearAuth() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Make an authenticated API request
   * @private
   */
  async _fetch(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred');
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // ===== BOOK ENDPOINTS =====

  /**
   * Get all books with optional pagination and search
   * @param {Object} params - Query parameters
   * @param {number} [params.page=0] - Page number (0-indexed)
   * @param {number} [params.size=10] - Number of items per page
   * @param {string} [params.search] - Search term
   * @returns {Promise<Object>} Paginated list of books
   */
  async getBooks({ page = 0, size = 10, search } = {}) {
    const params = new URLSearchParams({
      page,
      size,
      ...(search && { search }),
    });

    return this._fetch(`/books?${params}`);
  }

  /**
   * Get a single book by ID
   * @param {number} id - Book ID
   * @returns {Promise<Object>} Book details
   */
  async getBook(id) {
    return this._fetch(`/books/bookDetails/${id}`);
  }

  /**
   * Create a new book (Admin only)
   * @param {Object} bookData - Book data
   * @param {File} pdfFile - PDF file
   * @param {File} coverImage - Cover image file
   * @returns {Promise<Object>} Created book details
   */
  async createBook(bookData, pdfFile, coverImage) {
    const formData = new FormData();
    formData.append('bookRequest', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
    formData.append('pdf', pdfFile);
    formData.append('cover', coverImage);

    return this._fetch('/books', {
      method: 'POST',
      body: formData,
      headers: {
        // Let the browser set the Content-Type with the boundary
        'Authorization': `Bearer ${this.token}`,
      },
    });
  }

  /**
   * Update a book (Admin only)
   * @param {number} id - Book ID
   * @param {Object} updates - Book data to update
   * @param {File} [pdfFile] - Optional new PDF file
   * @param {File} [coverImage] - Optional new cover image
   * @returns {Promise<Object>} Updated book details
   */
  async updateBook(id, updates, pdfFile, coverImage) {
    const formData = new FormData();
    formData.append('bookRequest', new Blob([JSON.stringify(updates)], { type: 'application/json' }));
    
    if (pdfFile) formData.append('pdf', pdfFile);
    if (coverImage) formData.append('cover', coverImage);

    return this._fetch(`/books/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
  }

  /**
   * Delete a book (Admin only)
   * @param {number} id - Book ID to delete
   */
  async deleteBook(id) {
    return this._fetch(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get book reading URL and metadata
   * @param {number} id - Book ID
   * @returns {Promise<Object>} Book reading information
   */
  async getBookReadInfo(id) {
    return this._fetch(`/books/read/url/${id}`);
  }

  /**
   * Get book cover image URL
   * @param {number} id - Book ID
   * @returns {string} URL to the book cover image
   */
  getBookCoverUrl(id) {
    return `${API_BASE_URL}/books/cover/${id}`;
  }

  /**
   * Get PDF stream URL for a book
   * @param {number} id - Book ID
   * @returns {string} URL to stream the PDF
   */
  getBookPdfUrl(id) {
    return `${API_BASE_URL}/books/pdf-stream/${id}`;
  }

  // ===== PAYMENT ENDPOINTS =====

  /**
   * Initiate a payment for book access
   * @param {Object} paymentData - Payment data
   * @param {number} paymentData.bookId - ID of the book to purchase access for
   * @param {number} paymentData.durationDays - Number of days of access
   * @returns {Promise<Object>} Payment information including redirect URL
   */
  async initiatePayment({ bookId, durationDays }) {
    return this._fetch('/payments/create', {
      method: 'POST',
      body: JSON.stringify({ bookId, durationDays }),
    });
  }

  /**
   * Get transaction history for the current user
   * @returns {Promise<Array>} List of transactions
   */
  async getTransactionHistory() {
    return this._fetch('/payments/transactions');
  }

  /**
   * Check if the current user has access to a book
   * @param {number} bookId - Book ID to check access for
   * @returns {Promise<boolean>} Whether the user has access
   */
  async checkBookAccess(bookId) {
    return this._fetch(`/payments/access/${bookId}`);
  }

  /**
   * Get total number of transactions (Admin only)
   * @returns {Promise<number>} Total transaction count
   */
  async getTotalTransactionsCount() {
    return this._fetch('/payments/countTotalTransactions');
  }

  // ===== HELPER METHODS =====

  /**
   * Format a price with currency
   * @param {number} amount - Amount to format
   * @param {string} [currency='USD'] - Currency code
   * @returns {string} Formatted price string
   */
  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Format a date string
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

// Create a singleton instance
// export const apiClient = new ApiClient();

