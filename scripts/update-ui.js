function updateNavbar() {
    const loginLink = document.querySelector('.login');
    const signupLink = document.querySelector('.signup');

    // Check if a JWT exists in localStorage
    const token = localStorage.getItem('jwtToken');

    if (token) {
        // --- User is LOGGED IN ---

        // Change "Login" to "Profile"
        loginLink.textContent = 'Profile';
        loginLink.href = 'profile.html';

        // Change "Sign Up" to "Logout"
        signupLink.textContent = 'Logout';
        signupLink.href = '#'; // Set href to '#' as it will be handled by JS

        // Add a click event for logging out
        signupLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the link from navigating
            
            // Remove the token to log the user out
            localStorage.removeItem('jwtToken');
            
            // Announce logout and redirect to the home page
            alert('You have been successfully logged out.');
            window.location.href = 'index.html';
        });

    } else {
        // --- User is LOGGED OUT ---

        // Ensure links are in their default state
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';

        signupLink.textContent = 'Sign Up';
        signupLink.href = 'signup.html';
    }
}