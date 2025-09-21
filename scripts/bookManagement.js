class LibraryManagementSystem {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('jwtToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }

    // Authentication methods
    setAuthToken(token) {
        this.token = token;
        localStorage.setItem('jwtToken', token);
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    getAuthHeadersMultipart() {
        return {
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Book Controller Methods
    async createBook(bookData, pdfFile, coverImage) {
        try {
            const formData = new FormData();
            formData.append('bookRequest', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
            formData.append('pdf', pdfFile);
            formData.append('cover', coverImage);

            const response = await fetch(`${this.baseURL}/books`, {
                method: 'POST',
                headers: this.getAuthHeadersMultipart(),
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    }

    async getAllBooks() {
        try {
            const response = await fetch(`${this.baseURL}/books`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    }

    async getBookById(bookId) {
        try {
            const response = await fetch(`${this.baseURL}/books/${bookId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    }

    async updateBook(bookId, bookData, pdfFile = null, coverImage = null) {
        try {
            const formData = new FormData();
            formData.append('bookRequest', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
            if (pdfFile) formData.append('pdf', pdfFile);
            if (coverImage) formData.append('cover', coverImage);

            const response = await fetch(`${this.baseURL}/books/${bookId}`, {
                method: 'PUT',
                headers: this.getAuthHeadersMultipart(),
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }

    async deleteBook(bookId) {
        try {
            const response = await fetch(`${this.baseURL}/books/${bookId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }

    async getBookPdf(bookId) {
        try {
            const response = await fetch(`${this.baseURL}/books/${bookId}/pdf`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.blob();
        } catch (error) {
            console.error('Error fetching PDF:', error);
            throw error;
        }
    }

    async readBook(bookId) {
        try {
            const response = await fetch(`${this.baseURL}/books/read/url/${bookId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (response.status === 403) {
                throw new Error('Access denied: You need to purchase this book first');
            }

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error reading book:', error);
            throw error;
        }
    }

    async streamBookPdf(bookId) {
        try {
            const response = await fetch(`${this.baseURL}/books/pdf-stream/${bookId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.blob();
        } catch (error) {
            console.error('Error streaming PDF:', error);
            throw error;
        }
    }

    async searchBooks(searchTerm, page = 0, size = 10) {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                ...(searchTerm && { search: searchTerm })
            });

            const response = await fetch(`${this.baseURL}/books/search?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error searching books:', error);
            throw error;
        }
    }

    async getBooksByGenre(genre, page = 0, size = 10) {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                genre: genre
            });

            const response = await fetch(`${this.baseURL}/books/genre?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching books by genre:', error);
            throw error;
        }
    }

    async getTotalBooksCount() {
        try {
            const response = await fetch(`${this.baseURL}/books/countBooks`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching book count:', error);
            throw error;
        }
    }

    // Payment Controller Methods
    async initiatePayment(paymentRequest) {
        try {
            const response = await fetch(`${this.baseURL}/payments/create`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(paymentRequest)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error initiating payment:', error);
            throw error;
        }
    }

    async getTransactionHistory() {
        try {
            const response = await fetch(`${this.baseURL}/payments/transactions`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            throw error;
        }
    }

    async checkBookAccess(bookId) {
        try {
            const response = await fetch(`${this.baseURL}/payments/access/${bookId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error checking book access:', error);
            throw error;
        }
    }

    async getTotalTransactionsCount() {
        try {
            const response = await fetch(`${this.baseURL}/payments/countTotalTransactions`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching transaction count:', error);
            throw error;
        }
    }
}

// Global instance
const librarySystem = new LibraryManagementSystem();