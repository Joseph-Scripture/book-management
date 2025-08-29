// Wait for the entire page to load before running the script
window.onload = function() {

    // 1. Array of image URLs
    const images = [
        'url("images/home-page/1984.jpeg")',
        'url("images/home-page/gatsby.jpeg")',
        'url("images/home-page/obstacle.jpeg")',
    ];

    // 2. Get the header element
    const header = document.getElementById('home');

    let currentIndex = 0;

    header.style.backgroundImage = images[currentIndex];

    setInterval(function() {
       
        currentIndex = (currentIndex + 1) % images.length;
        
        header.style.backgroundImage = images[currentIndex];

    }, 5000); 
};