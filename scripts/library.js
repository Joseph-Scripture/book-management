document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const detailsPanel = document.getElementById('details-panel');
    const detailsCloseBtn = document.getElementById('details-close-btn');
    
   
    const allCategoryBooks = [
        // Sci-Fi
        { 
            category: "sci-fi", 
            title: "Dune", 
            author: "Frank Herbert", 
            img: "images/home-page/dune.jpeg", 
            rating: "4.8", 
            pages: "412", 
            ratingsCount: "12,450",
            reviews: "2,180", 
            description: "A landmark of science fiction, Dune is set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs." },
        { 
            category: "sci-fi", 
            title: "Project Hail Mary", 
            author: "Andy Weir", 
            img: "images/home-page/hail.jpeg", 
            rating: "4.9", 
            pages: "496", 
            ratingsCount: "25,300", 
            reviews: "4,500", 
            description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish." 
        },
            
        {
            category:"sci-fi", 
            title:"1984", 
            author:"George Orwell", 
            img:"images/home-page/1984.jpeg",
            ratingsCount:"50, 001", 
            reviews:"6000", 
            rating:"5",
            description:"Nineteen Eighty-Four is a dystopian novel by the English writer George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final completed book",pages:"320" 
        },
        {
            category:"sci-fi",
            title:"Neuromancer",
            author:"William Gibson",
            ratingsCount:"5000",
            img:"images/home-page/neuromancer.jpeg",
            reviews:"7000",
            description:"Neuromancer is a 1984 science fiction novel by American-Canadian author William Gibson. Set in a near-future dystopia, the narrative follows Case, a computer hacker enlisted into a crew by a powerful artificial intelligence and a traumatised former soldier to complete a high-stakes heis",
            pages:"384"
         },
        
        // Fantasy
        { 
            category: "fantasy", 
            title: "The Hobbit", 
            author: "J.R.R. Tolkien", 
            img: "images/home-page/hobbit.jpeg", 
            rating: "4.7", 
            pages: "310", 
            ratingsCount: "35,100", 
            reviews: "5,200", 
            description: "A classic fantasy adventure, The Hobbit follows the journey of Bilbo Baggins as he is swept into an epic quest to reclaim a lost Dwarf Kingdom." 
        },
        { 
            category: "fantasy", 
            title: "The Name of the Wind", 
            author: "Patrick Rothfuss", 
            img: "images/home-page/name_of_the_wind.jpeg", 
            rating: "4.8", 
            pages: "662", 
            ratingsCount: "28,900", 
            reviews: "4,800",
             description: "The story of Kvothe, a magically gifted young man who grows to be the most notorious wizard his world has ever seen." 
        },
        {
            category:"fantasy",
            title: "city of brass",
            author:"S.A Chakraborty",
            img:"images/home-page/brass.jpeg",
            rating:"4.9",
            pages:"544",
            ratingsCount:"4, 900",
            reviews:"4000",
            description:"The City of Brass by S. A. Chakraborty is the first book in the critically acclaimed fantasy series The Daevabad Trilogy. Set in a richly detailed, 18th-century Middle Eastern world, the novel blends Islamic folklore with a political intrigue-filled narrative."
        },

        // Drama
        { 
            category: "drama", 
            title: "The Great Gatsby",
             author: "F. Scott Fitzgerald", 
             img: "images/library-books/gatsby.jpeg", 
             rating: "4.5", 
             pages: "180", 
             ratingsCount: "40,500", 
             reviews: "6,300", 
             description: "A novel about the American dream, decadence, and the roaring twenties, centered on the mysterious millionaire Jay Gatsby." 
        },

        // Business
        { 
            category: "business", 
            title: "The Lean Startup", 
            author: "Eric Ries", 
            img: "images/home-page/bingo.jpeg", 
            rating: "4.6", 
            pages: "336", 
            ratingsCount: "15,800", 
            reviews: "1,900", 
            description: "A methodology for developing businesses and products, which aims to shorten product development cycles and rapidly discover if a proposed business model is viable."
         },
         {
            category:"business",
            title:"The Intelligent Investor",
            img:"images/home-page/investor.jpeg",
            author:"Warren Buffett",
            rating:"4.8",
            pages:"638",
            ratingsCount:"1,000",
            reviews:"3,000",
            description:"The Intelligent Investor by Benjamin Graham is a cornerstone of value investing, first published in 1949 and celebrated as one of the most influential finance books ever written. Rather than focusing on how to 'beat the market' the book offers a framework for safeguarding one's investments and achieving solid, long-term returns through rational and disciplined financial decisions."


         }

    ];

    const categoryBookGrid = document.getElementById('category-book-grid');
    const initialCategoryGridHTML = categoryBookGrid.innerHTML;

    const renderBooks = (booksToRender) => {
        categoryBookGrid.innerHTML = ''; 

        if (booksToRender.length === 0) {
            categoryBookGrid.innerHTML = '<p class="no-books-message">No books found in this category.</p>';
            return;
        }

        booksToRender.forEach(book => {
            // Create the book card HTML dynamically
            const bookCardHTML = `
                <div class="book-card" 
                    data-img="${book.img}" 
                    data-title="${book.title}" 
                    data-author="${book.author}" 
                    data-pages="${book.pages}" 
                    data-rating="${book.rating}" 
                    data-ratings-count="${book.ratingsCount}" 
                    data-reviews="${book.reviews}" 
                    data-description="${book.description}">
                    <img src="${book.img}" alt="Cover of ${book.title}">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </div>
            `;
            // Add the new card to the grid
            categoryBookGrid.insertAdjacentHTML('beforeend', bookCardHTML);
        });

        // IMPORTANT: Re-attach event listeners to the new book cards
        updateBookCardListeners();
    };

    const categoryButtons = document.querySelectorAll('.category-filters button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button style
            document.querySelector('.category-filters .active')?.classList.remove('active');
            button.classList.add('active');

            const selectedCategory = button.textContent.toLowerCase();

            if (selectedCategory === 'all') {
                // If "All" is clicked, restore the initial books
                categoryBookGrid.innerHTML = initialCategoryGridHTML;
                // Re-attach listeners to the restored initial books
                updateBookCardListeners();
            } else {
                // Otherwise, filter the master list and render the results
                const filteredBooks = allCategoryBooks.filter(book => book.category === selectedCategory);
                renderBooks(filteredBooks);
            }
        });
    });



    const closeAllPanels = () => {
        sidebar.classList.remove('is-open');
        detailsPanel.classList.remove('is-visible');
        overlay.classList.remove('is-visible');
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.add('is-open');
        overlay.classList.add('is-visible');
    });

    overlay.addEventListener('click', closeAllPanels);
    detailsCloseBtn.addEventListener('click', closeAllPanels);
    
    // --- Book Details Panel Logic ---
    const detailsImg = document.getElementById('details-img');
    const detailsTitle = document.getElementById('details-title');
    const detailsAuthor = document.getElementById('details-author');
    const detailsRatingContainer = document.getElementById('details-rating-container');
    const detailsRating = document.getElementById('details-rating');
    const detailsPages = document.getElementById('details-pages');
    const detailsRatingsCount = document.getElementById('details-ratings-count');
    const detailsReviews = document.getElementById('details-reviews');
    const detailsDescription = document.getElementById('details-description');
    
    const generateStars = (rating) => {
        let starsHTML = '<div class="stars">';
        const roundedRating = Math.round(rating * 2) / 2;
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            } else {
                starsHTML += `<svg class="dimmed" xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            }
        }
        starsHTML += '</div>';
        return starsHTML;
    };

    function updateBookCardListeners() {
        const allBookCards = document.querySelectorAll('.book-card');
        allBookCards.forEach(card => {
            // To prevent adding multiple listeners, we first remove any that might exist
            card.replaceWith(card.cloneNode(true));
        });
        
        // Now query for them again and add the listener
        document.querySelectorAll('.book-card').forEach(card => {
             card.addEventListener('click', () => {
                const bookData = card.dataset;
                
                detailsImg.src = bookData.img;
                detailsTitle.textContent = bookData.title;
                detailsAuthor.textContent = bookData.author;
                detailsPages.textContent = bookData.pages;
                detailsRatingsCount.textContent = bookData.ratingsCount;
                detailsReviews.textContent = bookData.reviews;
                detailsDescription.textContent = bookData.description;
                
                const ratingValue = parseFloat(bookData.rating);
                detailsRatingContainer.innerHTML = generateStars(ratingValue);
                detailsRating.textContent = ratingValue.toFixed(1);

                if (window.innerWidth < 1280) {
                    detailsPanel.classList.add('is-visible');
                    overlay.classList.add('is-visible');
                }
            });
        });
    }

    // Call the function once for the initially loaded books
    updateBookCardListeners();


    function updateUserProfile(name) {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');

        if (userNameElement && userAvatarElement) {
            userNameElement.textContent = name;
            const initial = name ? name.charAt(0).toUpperCase() : '?';
            userAvatarElement.src = `https://placehold.co/40x40/E2E8F0/475569?text=${initial}`;
            userAvatarElement.alt = `${name}'s avatar`;
        }
    };
    updateUserProfile("Emma");
});

document.getElementById('read-now-btn').addEventListener('click', () => {
    window.location.href = 'Reading page for RQ.html';
});

document.getElementById('reserve-btn').addEventListener('click', () => {
    window.location.href = 'cart.html';
});

document.getElementById('home-index-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});