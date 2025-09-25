document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & DOM SELECTION ---
    const API_URL = "http://127.0.0.1:8080/api"; 
    const bookForm = document.getElementById('book-form');
    const booksTableBody = document.getElementById('books-table-body');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('form-submit-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const bookIdInput = document.getElementById('book-id');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Get JWT token from localStorage
    const getToken = () => localStorage.getItem('jwt');

    // Show popup message function
    const showPopupMessage = (message, type = 'success') => {
        // Remove existing popups
        const existingPopups = document.querySelectorAll('.popup-message');
        existingPopups.forEach(popup => popup.remove());
        
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `popup-message ${type}`;
        popup.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <p>${message}</p>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#popup-styles')) {
            const styles = document.createElement('style');
            styles.id = 'popup-styles';
            styles.textContent = `
                .popup-message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideIn 0.3s ease-out;
                }
                .popup-content {
                    background: white;
                    padding: 15px 20px;
                    border-radius: 5px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    position: relative;
                    border-left: 4px solid #4CAF50;
                }
                .popup-message.error .popup-content {
                    border-left-color: #f44336;
                }
                .popup-message.info .popup-content {
                    border-left-color: #2196F3;
                }
                .popup-close {
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(popup);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 5000);
        
        // Close button functionality
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            popup.remove();
        });
    };

    // --- READ (FETCH ALL BOOKS) ---
    const fetchAllBooks = async (searchTerm = '') => {
        try {
            booksTableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading books...</td></tr>';
            
            let url = `${API_URL}/books`;
            if (searchTerm) {
                url = `${API_URL}/books/search?search=${encodeURIComponent(searchTerm)}`;
            }
            
            const response = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Access denied. Admin privileges required.');
                } else if (response.status === 404) {
                    // No books found - this is okay
                    booksTableBody.innerHTML = '<tr><td colspan="5">No books found.</td></tr>';
                    return;
                } else {
                    throw new Error(`Failed to fetch books. Status: ${response.status}`);
                }
            }
            
            const data = await response.json();
            
            // Check if we have a paginated response or direct array
            const books = data.content || data;
            
            // Debug log to check book structure
            console.log('Books data:', books);
            
            displayBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error);
            booksTableBody.innerHTML = `<tr><td colspan="5">Error loading books: ${error.message}</td></tr>`;
            showPopupMessage(`Error loading books: ${error.message}`, 'error');
        }
    };

    // --- RENDER BOOKS IN TABLE ---
    const displayBooks = (books) => {
        booksTableBody.innerHTML = ''; 
        
        if (!books || books.length === 0) {
            booksTableBody.innerHTML = '<tr><td colspan="5">No books found.</td></tr>';
            return;
        }
        
        books.forEach(book => {
            // Debug each book to see its structure
            console.log('Book object:', book);
            
            // Ensure we're using the correct property names
            const genre = book.genre || book.genreType || 'N/A';
            const price = book.pricePerMonth || book.price || 0;
            
            const row = `
                <tr>
                    <td>${book.title || 'N/A'}</td>
                    <td>${book.author || 'N/A'}</td>
                    <td>${book.genre}</td>
                    <td>${price ? `$${parseFloat(price).toFixed(2)}` : 'Free'}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${book.id}">Edit</button>
                        <button class="delete-btn" data-id="${book.id}">Delete</button>
                    </td>
                </tr>
            `;
            booksTableBody.insertAdjacentHTML('beforeend', row);
        });

        // Add event listeners to the new buttons
        attachEditButtonListeners();
        attachDeleteButtonListeners();
    };

    // --- ATTACH EDIT BUTTON LISTENERS ---
    const attachEditButtonListeners = () => {
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            // Remove any existing listeners to prevent duplicates
            button.replaceWith(button.cloneNode(true));
        });
        
        // Re-select the buttons after cloning
        const newEditButtons = document.querySelectorAll('.edit-btn');
        newEditButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = e.target.getAttribute('data-id');
                handleEditBook(bookId);
            });
        });
    };

    // --- ATTACH DELETE BUTTON LISTENERS ---
    const attachDeleteButtonListeners = () => {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            // Remove any existing listeners to prevent duplicates
            button.replaceWith(button.cloneNode(true));
        });
        
        // Re-select the buttons after cloning
        const newDeleteButtons = document.querySelectorAll('.delete-btn');
        newDeleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const bookId = e.target.getAttribute('data-id');
                
                if (confirm(`Are you sure you want to delete this book? This action cannot be undone.`)) {
                    try {
                        const response = await fetch(`${API_URL}/books/${bookId}`, {
                            method: 'DELETE',
                            headers: { 
                                'Authorization': `Bearer ${getToken()}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Failed to delete book.');
                        }
                        
                        showPopupMessage('Book deleted successfully!', 'success');
                        fetchAllBooks(); 
                    } catch (error) {
                        console.error('Error deleting book:', error);
                        showPopupMessage('Error deleting book.', 'error');
                    }
                }
            });
        });
    };

    // --- HANDLE EDIT BOOK ---
    const handleEditBook = async (bookId) => {
        try {
            showPopupMessage('Loading book details...', 'info');
            
            const response = await fetch(`${API_URL}/books/${bookId}`, {
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch book details.');
            }
            
            const book = await response.json();
            populateFormForEdit(book);
            showPopupMessage('Book data loaded successfully!', 'success');
        } catch (error) {
            console.error('Error fetching book details for edit:', error);
            showPopupMessage('Could not load book details for editing.', 'error');
            
            // Fallback: try to get data from table row
            const bookRow = document.querySelector(`.edit-btn[data-id="${bookId}"]`)?.closest('tr');
            if (bookRow) {
                const bookCells = bookRow.querySelectorAll('td');
                const partialBook = {
                    id: bookId,
                    title: bookCells[0].textContent,
                    author: bookCells[1].textContent,
                    genre: bookCells[2].textContent,
                    pricePerMonth: bookCells[3].textContent.replace('$', '') || '0'
                };
                populateFormForEdit(partialBook);
                showPopupMessage('Loaded partial book data from table.', 'info');
            }
        }
    };

    // --- POPULATE FORM FOR EDITING ---
    const populateFormForEdit = (book) => {
        // Update form title and button
        formTitle.textContent = 'Edit Book';
        submitBtn.textContent = 'Update Book';
        cancelBtn.style.display = 'inline-block';
        
        // Fill form fields with book data
        bookIdInput.value = book.id || '';
        document.getElementById('title').value = book.title || '';
        document.getElementById('author').value = book.author || '';
        document.getElementById('isbn').value = book.isbn || '';
        document.getElementById('description').value = book.description || '';
        document.getElementById('genre').value = book.genre || '';
        
        // Format date for input field (YYYY-MM-DD)
        if (book.publishedDate) {
            const date = new Date(book.publishedDate);
            if (!isNaN(date.getTime())) {
                document.getElementById('publishedDate').value = date.toISOString().split('T')[0];
            }
        } else {
            document.getElementById('publishedDate').value = '';
        }
        
        document.getElementById('pricePerMonth').value = book.pricePerMonth || '';
        document.getElementById('numberOfPages').value = book.numberOfPages || '';
        
        // For file inputs, we can't pre-populate due to security restrictions
        // But we can indicate that they're optional during edit
        document.getElementById('pdf').required = false;
        document.getElementById('cover').required = false;
        
        // Add a note about files being optional during edit
        const pdfLabel = document.querySelector('label[for="pdf"]');
        const coverLabel = document.querySelector('label[for="cover"]');
        
        // Remove existing notes
        const existingNotes = document.querySelectorAll('.optional-note');
        existingNotes.forEach(note => note.remove());
        
        const pdfNote = document.createElement('span');
        pdfNote.className = 'optional-note';
        pdfNote.textContent = ' (Optional for update)';
        pdfNote.style.color = '#666';
        pdfNote.style.fontSize = '0.9em';
        pdfLabel.appendChild(pdfNote);
        
        const coverNote = document.createElement('span');
        coverNote.className = 'optional-note';
        coverNote.textContent = ' (Optional for update)';
        coverNote.style.color = '#666';
        coverNote.style.fontSize = '0.9em';
        coverLabel.appendChild(coverNote);
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- CREATE & UPDATE (FORM SUBMISSION) ---
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookId = bookIdInput.value;
        const isUpdating = !!bookId;

        // Validate required fields
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pricePerMonth = document.getElementById('pricePerMonth').value;
        const numberOfPages = document.getElementById('numberOfPages').value;
        const pdfFile = document.getElementById('pdf').files[0];
        const coverFile = document.getElementById('cover').files[0];

        if (!title || !author || !pricePerMonth || !numberOfPages) {
            showPopupMessage('Please fill in all required fields.', 'error');
            return;
        }

        // In create mode, PDF and cover are required
        if (!isUpdating && (!pdfFile || !coverFile)) {
            showPopupMessage('PDF and Cover Image are required to create a new book.', 'error');
            return;
        }

        // Create the JSON part for the book metadata
        const bookRequest = {
            title: title,
            author: author,
            isbn: document.getElementById('isbn').value,
            description: document.getElementById('description').value,
            genre: document.getElementById('genre').value,
            publishedDate: document.getElementById('publishedDate').value,
            pricePerMonth: parseFloat(pricePerMonth),
            numberOfPages: parseInt(numberOfPages)
        };

        // Use FormData to handle multipart request (JSON + files)
        const formData = new FormData();
        
        // Append the bookRequest as a JSON string with the correct field name
        formData.append('bookRequest', new Blob([JSON.stringify(bookRequest)], { 
            type: 'application/json' 
        }));
        
        if (pdfFile) formData.append('pdf', pdfFile);
        if (coverFile) formData.append('cover', coverFile);

        const url = isUpdating ? `${API_URL}/books/${bookId}` : `${API_URL}/books`;
        const method = isUpdating ? 'PUT' : 'POST';

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = isUpdating ? 'Updating...' : 'Creating...';

            const response = await fetch(url, {
                method: method,
                headers: { 
                    'Authorization': `Bearer ${getToken()}`
                    // Don't set Content-Type for FormData - browser will set it with boundary
                },
                body: formData
            });

            if (!response.ok) {
                let errorMessage = `Failed to ${isUpdating ? 'update' : 'create'} book. Status: ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If we can't parse JSON error, use default message
                }
                
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            showPopupMessage(`Book successfully ${isUpdating ? 'updated' : 'created'}!`, 'success');
            
            // Reset form to create mode after successful update
            resetForm();
            fetchAllBooks(); // Refresh the table
        } catch (error) {
            console.error(`Error ${isUpdating ? 'updating' : 'creating'} book:`, error);
            showPopupMessage(`Error: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isUpdating ? 'Update Book' : 'Add Book';
        }
    });

    // --- SEARCH FUNCTIONALITY ---
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        fetchAllBooks(searchTerm);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            fetchAllBooks(searchTerm);
        }
    });

    // --- RESET FORM FUNCTION ---
    const resetForm = () => {
        bookForm.reset();
        formTitle.textContent = 'Add a New Book';
        submitBtn.textContent = 'Add Book';
        cancelBtn.style.display = 'none';
        bookIdInput.value = '';
        
        // Reset file requirements
        document.getElementById('pdf').required = true;
        document.getElementById('cover').required = true;
        
        // Remove optional notes
        const optionalNotes = document.querySelectorAll('.optional-note');
        optionalNotes.forEach(note => note.remove());
    };

    cancelBtn.addEventListener('click', resetForm);

    // --- PREVENT NEGATIVE NUMBERS ---
    const preventNegativeNumbers = (e) => {
        if (e.target.value < 0) {
            e.target.value = ''; 
        }
    };

    const priceInput = document.getElementById('pricePerMonth');
    const pagesInput = document.getElementById('numberOfPages');

    priceInput.addEventListener('input', preventNegativeNumbers);
    pagesInput.addEventListener('input', preventNegativeNumbers);

    // --- INITIALIZE THE PAGE ---
    fetchAllBooks();
});