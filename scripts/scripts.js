// Wait for the entire page to load before running the script
window.onload = function() {
    // const open = document.querySelector('#sidebar-toggle');

    const header = document.getElementById('home');
    const library = document.querySelector('.browse');
    const action = document.querySelector('.action'); 
    const changeDefault = document.querySelector('.default-change')


    // 1. Array of image URLs
    const images = [
      
         'url("images/home-page/librarian.avif")',
         'url("images/home-page/test.avif") ',
         'url("images/home-page/photo-1664882338311-12c90557892d.avif")'
        
    ];
    
 // Select elements
const toggleBtn = document.getElementById('sidebar-toggle');
const nav = document.querySelector('nav');
const overlay = document.getElementById('overlay');
const hamburger = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

// Check if elements exist to prevent errors
if (!toggleBtn || !nav || !overlay || !hamburger || !closeIcon) {
  console.error('One or more required elements are missing from the DOM');
} else {
  function openSidebar() {
    nav.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open'); // Prevent body scrolling
    hamburger.style.display = 'none';
    closeIcon.style.display = 'block';
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close sidebar');
  }

  function closeSidebar() {
    nav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open'); // Restore body scrolling
    hamburger.style.display = 'block';
    closeIcon.style.display = 'none';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open sidebar');
  }

  // Toggle button click handler
  toggleBtn.addEventListener('click', () => {
    if (nav.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  // Overlay click closes sidebar
  overlay.addEventListener('click', closeSidebar);

  // Initialize button state
  closeIcon.style.display = 'none'; // Ensure close icon is hidden on load
}

    library.addEventListener('click', () => {
        window.location.href = 'library.html';
    });

    action.addEventListener ('click', () =>{
        window.location.href = 'login.html';
    });
    


    let currentIndex = 0;

    header.style.backgroundImage = images[currentIndex];

    setInterval(function() {
       
        currentIndex = (currentIndex + 1) % images.length;
        
        header.style.backgroundImage = images[currentIndex];

    }, 5000); 







    function loadBooks(){
          const allBooks = [
            {
                title: "The Bees",
                author: "Ryan Holiday",
                cover: "images/library-books/the_bees.jpg"
            },
            {
                title: "The Let Them Theory",
                author: "Mel Robbins",
                cover: "images/home-page/letthem.jpeg"
            },
            {
                title: "Fourth Wing",
                author: "Rebecca Yarros",
                cover: "images/home-page/fourth.jpeg"
            },
            {
                title: "Crime and Punishment",
                author: "Fyodor Dostoevsky",
                cover: "images/home-page/Crime and Punishment.jpeg"
            },
            {
                title: "The Midnight Library",
                author: "Matt Haig",
                cover: "images/home-page/midnight.jpeg" 
            },
            {
                title: "Dune",
                author: "Frank Herbert",
                cover: "images/home-page/dune.jpeg" 
            }
        
        ];

        for (let i = allBooks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allBooks[i], allBooks[j]] = [allBooks[j], allBooks[i]];
        }

    
        const bookElements = [
            document.querySelector('.first-book'),
            document.querySelector('.second-book'),
            document.querySelector('.third-book'),
            document.querySelector('.fourth-book')
        ];

        bookElements.forEach((element, index) => {
            const book = allBooks[index];

            const img = element.querySelector('img');
            const authorP = element.querySelector('.author');

            img.src = book.cover;
            img.alt = book.title;
            authorP.textContent = book.author;
        });


    }
    changeDefault.addEventListener('click', loadBooks)
   
};