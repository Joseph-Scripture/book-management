document.addEventListener('DOMContentLoaded', function() {
    // API endpoints
    const CONTACT_API_URL = 'http://127.0.0.1:8080/api/contact';
    
    // Get form elements
    const contactForm = document.querySelector('form');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageTextarea = document.querySelector('textarea');
    const submitButton = document.getElementById('button');
    
    // Function to get JWT token from localStorage
    function getAuthToken() {
        return localStorage.getItem('jwt') || localStorage.getItem('token');
    }
    
    // Function to check if user is authenticated
    function isAuthenticated() {
        const token = getAuthToken();
        return !!token; // Returns true if token exists, false otherwise
    }
    
    // Function to redirect to login page
    function redirectToLogin() {
        // Store the current page to return after login
        sessionStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'login.html';
    }
    
    // Function to show popup notification
    function showPopup(message, isError = false) {
        // Remove any existing popup
        const existingPopup = document.querySelector('.popup-notification');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `popup-notification ${isError ? 'error' : 'success'}`;
        
        // Style the popup
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.right = '20px';
        popup.style.padding = '15px 20px';
        popup.style.borderRadius = '5px';
        popup.style.color = 'white';
        popup.style.fontWeight = 'bold';
        popup.style.zIndex = '1000';
        popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        popup.style.maxWidth = '300px';
        popup.style.opacity = '0';
        popup.style.transform = 'translateX(100%)';
        popup.style.transition = 'all 0.3s ease';
        
        // Set background color based on message type
        if (isError) {
            popup.style.backgroundColor = '#e74a3b'; // Red for error
        } else {
            popup.style.backgroundColor = '#1cc88a'; // Green for success
        }
        
        // Set message content
        popup.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '18px';
        closeButton.onclick = function() {
            popup.remove();
        };
        popup.appendChild(closeButton);
        
        // Add to document
        document.body.appendChild(popup);
        
        // Animate in
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.style.opacity = '0';
                popup.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Function to handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Check if user is authenticated
        if (!isAuthenticated()) {
            showPopup('Please login first to send a message.', true);
            setTimeout(redirectToLogin, 2000);
            return;
        }
        
        // Get JWT token
        const token = getAuthToken();
        
        // Get form values
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageTextarea.value.trim();
        
        // Validate required fields
        if (!email || !message) {
            showPopup('Email and message are required fields.', true);
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showPopup('Please enter a valid email address.', true);
            return;
        }
        
        // Create request data object
        const contactData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            subject: subject,
            message: message
        };
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.value = 'Sending...';
            
            // Send POST request to the API with authentication
            const response = await fetch(CONTACT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(contactData)
            });
            
            if (response.ok) {
                // Success - clear form and show success message
                contactForm.reset();
                showPopup('Your message has been sent successfully! We will get back to you soon.');
            } else if (response.status === 401) {
                // Unauthorized - token might be expired or invalid
                showPopup('Your session has expired. Please login again.', true);
                setTimeout(redirectToLogin, 2000);
            } else {
                // Handle other server errors
                const errorText = await response.text();
                showPopup(`Error: ${errorText || 'Failed to send message. Please try again.'}`, true);
            }
        } catch (error) {
            // Handle network errors
            console.error('Network error:', error);
            showPopup('Network error. Please check your connection and try again.', true);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.value = 'Send';
        }
    }
    
    // Check authentication status when page loads
    function checkAuthStatus() {
        if (!isAuthenticated()) {
            showPopup('Please login to use the contact form.', true);
        }
    }
    
    // Add event listener to form submission
    contactForm.addEventListener('submit', handleSubmit);
    
    // Check authentication status on page load
    checkAuthStatus();
});