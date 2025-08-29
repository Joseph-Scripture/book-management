// Wait for the entire page to load before running the script
window.onload = function() {

    // 1. Array of image URLs
    const images = [
        // 'url("images/home-page/1984.jpeg")',
        // 'url("images/home-page/gatsby.jpeg")',
        // 'url("images/home-page/obstacle.jpeg")',
        // 'url("images/home-page/next.avif")',
        // 'url ("images/home-page/book.avif")',
         'url("images/home-page/librarian.avif")',
         'url("images/home-page/test.avif") ',
         'url("images/home-page/photo-1664882338311-12c90557892d.avif")'
        
    ];

    const header = document.getElementById('home');
    const library = document.querySelector('.browse');
    const action = document.querySelector('.action');

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
};