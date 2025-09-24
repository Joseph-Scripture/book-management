document.addEventListener('DOMContentLoaded', function() {
    // API endpoints
    const MAILING_API_URL = 'http://127.0.0.1:8080/api/mailing';
    
    // Get form elements
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('footer-email');
    const submitButton = document.getElementById('footer-submit');
    
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
        
        // Get email value
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email) {
            showPopup('Please enter your email address.', true);
            return;
        }
        
        // Validate email format
        if (!isValidEmail(email)) {
            showPopup('Please enter a valid email address.', true);
            return;
        }
        
        // Create request data object
        const mailingData = {
            email: email
        };
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            // Send POST request to the API
            const response = await fetch(`${MAILING_API_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mailingData)
            });
            
            if (response.ok) {
                const data = await response.json();
                // Success - clear form and show success message
                newsletterForm.reset();
                showPopup(data.message || 'Thanks for subscribing! Please check your email to confirm.');
            } else {
                // Handle server errors
                const errorData = await response.json();
                showPopup(`Error: ${errorData.error || errorData.message || 'Failed to subscribe. Please try again.'}`, true);
            }
        } catch (error) {
            // Handle network errors
            console.error('Network error:', error);
            showPopup('Network error. Please check your connection and try again.', true);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = 'Subscribe';
        }
    }
    
    // Function to handle email verification from URL parameters
    function checkEmailVerification() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            verifyEmail(token);
        }
    }
    
    // Function to verify email with token
    async function verifyEmail(token) {
        try {
            const response = await fetch(`${MAILING_API_URL}/verify-email?token=${encodeURIComponent(token)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                showPopup(data.message || 'Email verified successfully! You are now subscribed.');
            } else {
                const errorData = await response.json();
                showPopup(`Error: ${errorData.error || 'Invalid verification token.'}`, true);
            }
        } catch (error) {
            console.error('Verification error:', error);
            showPopup('Error verifying email. Please try again.', true);
        }
    }
    
    // Add event listener to form submission
    newsletterForm.addEventListener('submit', handleSubmit);
    
    // Check for email verification on page load
    checkEmailVerification();
});