   document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & DOM SELECTION ---
    const API_URL = "http://127.0.0.1:8080/api"; 
    const bookForm = document.getElementById('book-form');
    const booksTableBody = document.getElementById('books-table-body');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('form-submit-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const bookIdInput = document.getElementById('book-id');

    const getToken = () => localStorage.getItem('token');

    // --- READ (FETCH ALL BOOKS) ---
    const fetchAllBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/books`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (!response.ok) throw new Error('Failed to fetch books.');
            const books = await response.json();
            displayBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error);
            booksTableBody.innerHTML = `<tr><td colspan="5">Error loading books.</td></tr>`;
        }
    };

    // --- RENDER BOOKS IN TABLE ---
    const displayBooks = (books) => {
        booksTableBody.innerHTML = ''; 
        if (!books || books.length === 0) {
            booksTableBody.innerHTML = `<tr><td colspan="5">No books found.</td></tr>`;
            return;
        }
        books.forEach(book => {
            const row = `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.genre || 'N/A'}</td>
                    <td>$${book.pricePerMonth.toFixed(2)}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${book.id}">Edit</button>
                        <button class="delete-btn" data-id="${book.id}">Delete</button>
                    </td>
                </tr>
            `;
            booksTableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    // --- CREATE & UPDATE (FORM SUBMISSION) ---
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookId = bookIdInput.value;
        const isUpdating = !!bookId;

        // 1. Create the JSON part for the book metadata
        const bookRequest = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value,
            description: document.getElementById('description').value,
            genre: document.getElementById('genre').value,
            publishedDate: document.getElementById('publishedDate').value,
            pricePerMonth: parseFloat(document.getElementById('pricePerMonth').value),
            numberOfPages: parseInt(document.getElementById('numberOfPages').value)
        };

        // 2. Use FormData to handle multipart request (JSON + files)
        const formData = new FormData();
        formData.append('bookRequest', new Blob([JSON.stringify(bookRequest)], { type: 'application/json' }));
        
        const pdfFile = document.getElementById('pdf').files[0];
        const coverFile = document.getElementById('cover').files[0];

        if (pdfFile) formData.append('pdf', pdfFile);
        if (coverFile) formData.append('cover', coverFile);
        
        // In create mode, PDF and cover are required
        if (!isUpdating && (!pdfFile || !coverFile)) {
            alert('PDF and Cover Image are required to create a new book.');
            return;
        }

        const url = isUpdating ? `${API_URL}/books/${bookId}` : `${API_URL}/books`;
        const method = isUpdating ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${getToken()}` },
                body: formData
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || `Failed to ${isUpdating ? 'update' : 'create'} book.`);
            }
            
            alert(`Book successfully ${isUpdating ? 'updated' : 'created'}!`);
            resetForm();
            fetchAllBooks(); // Refresh the table
        } catch (error) {
            console.error(`Error ${isUpdating ? 'updating' : 'creating'} book:`, error);
            alert(`Error: ${error.message}`);
        }
    });

    // --- EDIT & DELETE (TABLE BUTTON CLICKS) ---
    booksTableBody.addEventListener('click', async (e) => {
        const bookId = e.target.dataset.id;
        if (!bookId) return;

        // Handle Edit Button
        if (e.target.classList.contains('edit-btn')) {
            // NOTE: Assumes a GET /api/books/{id} endpoint exists
            try {
                const response = await fetch(`${API_URL}/books/${bookId}`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                if (!response.ok) throw new Error('Failed to fetch book details.');
                const book = await response.json();
                populateFormForEdit(book);
            } catch (error) {
                 console.error('Error fetching book details for edit:', error);
                 alert('Could not load book details for editing.');
            }
        }

        // Handle Delete Button
        if (e.target.classList.contains('delete-btn')) {
            if (confirm(`Are you sure you want to delete this book?`)) {
                try {
                    const response = await fetch(`${API_URL}/books/${bookId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${getToken()}` }
                    });

                    if (response.status !== 204) throw new Error('Failed to delete book.');
                    
                    alert('Book deleted successfully.');
                    fetchAllBooks(); 
                } catch (error) {
                    console.error('Error deleting book:', error);
                    alert('Error deleting book.');
                }
            }
        }
    });

    // --- HELPER FUNCTIONS ---
    const populateFormForEdit = (book) => {
        formTitle.textContent = 'Edit Book';
        submitBtn.textContent = 'Update Book';
        cancelBtn.style.display = 'inline-block';

        bookIdInput.value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn || '';
        document.getElementById('description').value = book.description || '';
        document.getElementById('genre').value = book.genre || '';
        document.getElementById('publishedDate').value = book.publishedDate || '';
        document.getElementById('pricePerMonth').value = book.pricePerMonth;
        document.getElementById('numberOfPages').value = book.numberOfPages;

        window.scrollTo(0, 0); 
    };

    const resetForm = () => {
        bookForm.reset();
        formTitle.textContent = 'Add a New Book';
        submitBtn.textContent = 'Add Book';
        cancelBtn.style.display = 'none';
        bookIdInput.value = '';
    };

    cancelBtn.addEventListener('click', resetForm);

    fetchAllBooks();




   
    const preventNegativeNumbers = (e) => {
        if (e.target.value < 0) {
            e.target.value = ''; 
        }
    };

    const priceInput = document.getElementById('pricePerMonth');
    const pagesInput = document.getElementById('numberOfPages');

    priceInput.addEventListener('input', preventNegativeNumbers);
    pagesInput.addEventListener('input', preventNegativeNumbers);
});