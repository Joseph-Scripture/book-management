// window.onload = function() {

//     const header = document.getElementById('home');
//     const library = document.querySelector('.browse');
//     const action = document.querySelector('.action'); 
//     const changeDefault = document.querySelector('.default-change')

//      const loginLink = document.querySelector('.login');
//     const signupLink = document.querySelector('.signup');
//     const navList = document.querySelector('#navbar ul');

//     const token = localStorage.getItem('token');


//     const images = [
      
//          'url("images/home-page/librarian.avif")',
//          'url("images/home-page/test.avif") ',
//          'url("images/home-page/photo-1664882338311-12c90557892d.avif")'
        
//     ];
    
//   // Select elements
//   const toggleBtn = document.getElementById('sidebar-toggle');
//   const nav = document.querySelector('nav');
//   const overlay = document.getElementById('overlay');
//   const hamburger = document.getElementById('hamburger-icon');
//   const closeIcon = document.getElementById('close-icon');



//     // / Toggle nav items based on login state
//     function updateNav() {
//         if (localStorage.getItem('token')) {
//             // Hide login/signup
//             if (loginLink) loginLink.style.display = 'none';
//             if (signupLink) signupLink.style.display = 'none';

//             // Add profile + logout if not already added
//             if (!document.querySelector('.profile')) {
//                 const profileItem = document.createElement('li');
//                 profileItem.innerHTML = `<a href="profile.html" class="nav-link profile">Profile</a>`;
//                 navList.appendChild(profileItem);
//             }
//             if (!document.querySelector('.logout')) {
//                 const logoutItem = document.createElement('li');
//                 logoutItem.innerHTML = `<a href="#" class="nav-link logout">Logout</a>`;
//                 navList.appendChild(logoutItem);

//                 // Attach logout handler
//                 logoutItem.querySelector('.logout').addEventListener('click', function (e) {
//                     e.preventDefault();
//                     localStorage.removeItem('token');
//                     location.reload();
//                 });
//             }
//         } else {
//             // Show login/signup
//             if (loginLink) loginLink.style.display = 'inline-block';
//             if (signupLink) signupLink.style.display = 'inline-block';

//             // Remove profile + logout if they exist
//             const profile = document.querySelector('.profile');
//             const logout = document.querySelector('.logout');
//             if (profile) profile.parentElement.remove();
//             if (logout) logout.parentElement.remove();
//         }
//     }

//     updateNav();


//   // Check if elements exist to prevent errors
//   if (!toggleBtn || !nav || !overlay || !hamburger || !closeIcon) {
//     console.error('One or more required elements are missing from the DOM');
//   } else {
//     function openSidebar() {
//       nav.classList.add('active');
//       overlay.classList.add('active');
//       document.body.classList.add('sidebar-open'); // Prevent body scrolling
//       hamburger.style.display = 'none';
//       closeIcon.style.display = 'block';
//       toggleBtn.setAttribute('aria-expanded', 'true');
//       toggleBtn.setAttribute('aria-label', 'Close sidebar');
//     }

//     function closeSidebar() {
//       nav.classList.remove('active');
//       overlay.classList.remove('active');
//       document.body.classList.remove('sidebar-open'); // Restore body scrolling
//       hamburger.style.display = 'block';
//       closeIcon.style.display = 'none';
//       toggleBtn.setAttribute('aria-expanded', 'false');
//       toggleBtn.setAttribute('aria-label', 'Open sidebar');
//     }

//     // Toggle button click handler
//     toggleBtn.addEventListener('click', () => {
//       if (nav.classList.contains('active')) {
//         closeSidebar();
//       } else {
//         openSidebar();
//       }
//     });

//   // Overlay click closes sidebar
//   overlay.addEventListener('click', closeSidebar);

//   // Initialize button state
//   closeIcon.style.display = 'none'; 
// }

//     library.addEventListener('click', () => {
//         window.location.href = 'library.html';
//     });

//     action.addEventListener ('click', () =>{
//         window.location.href = 'login.html';
//     });
    


//     let currentIndex = 0;

//     header.style.backgroundImage = images[currentIndex];

//     setInterval(function() {
       
//         currentIndex = (currentIndex + 1) % images.length;
        
//         header.style.backgroundImage = images[currentIndex];

//     }, 5000); 







//     function loadBooks(){
//           const allBooks = [
//             {
//                 title: "The Bees",
//                 author: "Ryan Holiday",
//                 cover: "images/library-books/the_bees.jpg"
//             },
//             {
//                 title: "The Let Them Theory",
//                 author: "Mel Robbins",
//                 cover: "images/home-page/letthem.jpeg"
//             },
//             {
//                 title: "Fourth Wing",
//                 author: "Rebecca Yarros",
//                 cover: "images/home-page/fourth.jpeg"
//             },
//             {
//                 title: "Crime and Punishment",
//                 author: "Fyodor Dostoevsky",
//                 cover: "images/home-page/Crime and Punishment.jpeg"
//             },
//             {
//                 title: "The Midnight Library",
//                 author: "Matt Haig",
//                 cover: "images/home-page/midnight.jpeg" 
//             },
//             {
//                 title: "Dune",
//                 author: "Frank Herbert",
//                 cover: "images/home-page/dune.jpeg" 
//             },  
//             {
//               title:"La Casa De Suenos",
//               author: "Pauline Gedge",
//               cover: "images/home-page/suenos.jpg"
//             }
        
//         ];

//         for (let i = allBooks.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [allBooks[i], allBooks[j]] = [allBooks[j], allBooks[i]];
//         }

    
//         const bookElements = [
//             document.querySelector('.first-book'),
//             document.querySelector('.second-book'),
//             document.querySelector('.third-book'),
//             document.querySelector('.fourth-book'),
//             document.querySelector('.fifth-book')
//         ];

//         bookElements.forEach((element, index) => {
//             const book = allBooks[index];

//             const img = element.querySelector('img');
//             const authorP = element.querySelector('.author');

//             img.src = book.cover;
//             img.alt = book.title;
//             authorP.textContent = book.author;
//         });


//     }
//     changeDefault.addEventListener('click', loadBooks);


//     const libraryPage = document.querySelector('.library');
//     libraryPage.addEventListener('click', () =>{
//       const token = localStorage.getItem('token');
//       if(!token){
//         window.location.href = 'signup.html';
//       }else{
//         window.location.href = 'library.html'
//       }
//     })
   
// };


window.onload = function() {
    const header = document.getElementById('home');
    const library = document.querySelector('.browse');
    const action = document.querySelector('.action'); 
    const changeDefault = document.querySelector('.default-change');

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

    // Navigation elements
    const profileLi = document.getElementById('profile-li');
    const logoutLi = document.getElementById('logout-li');
    const loginLi = document.getElementById('login-li');
    const signupLi = document.getElementById('signup-li');
    const logoutLink = document.getElementById('logout-link');

    // Function to check if user is logged in and update navigation
    function updateNavigationState() {
        const token = localStorage.getItem('jwt');
        const isLoggedIn = !!token;
        
        console.log('Navigation update - Logged in:', isLoggedIn); // Debug log
        
        if (isLoggedIn) {
            // User is logged in - show profile and logout, hide login/signup
            if (profileLi) profileLi.style.display = 'list-item';
            if (logoutLi) logoutLi.style.display = 'list-item';
            if (loginLi) loginLi.style.display = 'none';
            if (signupLi) signupLi.style.display = 'none';
        } else {
            // User is not logged in - show login/signup, hide profile and logout
            if (profileLi) profileLi.style.display = 'none';
            if (logoutLi) logoutLi.style.display = 'none';
            if (loginLi) loginLi.style.display = 'list-item';
            if (signupLi) signupLi.style.display = 'list-item';
        }
    }

    // Function to handle logout
    async function handleLogout() {
        const token = localStorage.getItem('jwt');
        
        if (token) {
            try {
                // Call your backend logout endpoint to blacklist the JWT
                const response = await fetch('http://127.0.0.1:8080/user/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Logout API response:', response.status);
            } catch (error) {
                console.error('Error during logout API call:', error);
            }
        }
        
        // Always clear the token from localStorage
        localStorage.removeItem('jwt');
        
        // Update the navigation state
        updateNavigationState();
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    // Add event listener to logout link
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Update navigation state when page loads
    updateNavigationState();

    // Also update navigation state periodically in case of state changes
    setInterval(updateNavigationState, 1000); // Check every second

    // Rest of your existing code...
    if (!toggleBtn || !nav || !overlay || !hamburger || !closeIcon) {
        console.error('One or more required elements are missing from the DOM');
    } else {
        function openSidebar() {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-open');
            hamburger.style.display = 'none';
            closeIcon.style.display = 'block';
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.setAttribute('aria-label', 'Close sidebar');
        }

        function closeSidebar() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            hamburger.style.display = 'block';
            closeIcon.style.display = 'none';
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-label', 'Open sidebar');
        }

        toggleBtn.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        overlay.addEventListener('click', closeSidebar);
        closeIcon.style.display = 'none'; 
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
            },  
            {
                title:"La Casa De Suenos",
                author: "Pauline Gedge",
                cover: "images/home-page/suenos.jpg"
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
            document.querySelector('.fourth-book'),
            document.querySelector('.fifth-book')
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
    
    changeDefault.addEventListener('click', loadBooks);

    const libraryPage = document.querySelector('.library');
    libraryPage.addEventListener('click', () =>{
        const token = localStorage.getItem('jwt');
        if(!token){
            window.location.href = 'signup.html';
        }else{
            window.location.href = 'library.html'
        }
    });
};