document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const detailsPanel = document.getElementById('details-panel');
    const detailsCloseBtn = document.getElementById('details-close-btn');

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

    // --- Category Filter Logic ---
    const categoryButtons = document.querySelectorAll('.category-filters button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.category-filters .active')?.classList.remove('active');
            button.classList.add('active');
        });
    });

    // --- Book Details Panel Logic ---
    const bookCards = document.querySelectorAll('.book-card');
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
        const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                starsHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            } else {
                starsHTML += `<svg class="dimmed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            }
        }
        starsHTML += '</div>';
        return starsHTML;
    };

    bookCards.forEach(card => {
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
    function updateUserProfile(name) {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');

        if (userNameElement && userAvatarElement) {
            // 1. Update the name
            userNameElement.textContent = name;

            // 2. Get the first initial for the avatar
            const initial = name ? name.charAt(0).toUpperCase() : '?';
            
            // 3. Update the avatar image source
            userAvatarElement.src = `https://placehold.co/40x40/E2E8F0/475569?text=${initial}`;
            userAvatarElement.alt = `${name}'s avatar`;
        }
    };
    updateUserProfile("Emma");

  
    }
);