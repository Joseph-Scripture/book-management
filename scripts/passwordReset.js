// API Configuration
        const API_BASE_URL = 'http://localhost:8080/user';
        const REDEEM_PASSWORD_ENDPOINT = `${API_BASE_URL}/redeem-password`;
        const RESET_PASSWORD_ENDPOINT = `${API_BASE_URL}/reset-password`;

        // DOM Elements
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');
        
        const step1Form = document.getElementById('step1Form');
        const step2Form = document.getElementById('step2Form');
        const step3Form = document.getElementById('step3Form');
        
        const emailInput = document.getElementById('email');
        const tokenInput = document.getElementById('token');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        const sendResetLinkBtn = document.getElementById('sendResetLink');
        const resetPasswordBtn = document.getElementById('resetPassword');
        const backToStep1Btn = document.getElementById('backToStep1');
        const goToLoginBtn = document.getElementById('goToLogin');
        
        const messageContainer = document.getElementById('messageContainer');
        const passwordStrengthBar = document.getElementById('passwordStrengthBar');
        const passwordMatch = document.getElementById('passwordMatch');
        
        // Password requirement elements
        const reqLength = document.getElementById('reqLength');
        const reqUppercase = document.getElementById('reqUppercase');
        const reqLowercase = document.getElementById('reqLowercase');
        const reqNumber = document.getElementById('reqNumber');

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Check if there's a token in the URL (from email link)
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            
            if (token) {
                // If token is in URL, skip to step 2 and prefill the token
                tokenInput.value = token;
                goToStep(2);
            }
            
            // Set up event listeners
            sendResetLinkBtn.addEventListener('click', sendResetLink);
            resetPasswordBtn.addEventListener('click', resetPassword);
            backToStep1Btn.addEventListener('click', () => goToStep(1));
            goToLoginBtn.addEventListener('click', () => window.location.href = 'login.html');
            
            // Password validation
            newPasswordInput.addEventListener('input', validatePassword);
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        });

        // Function to navigate between steps
        function goToStep(stepNumber) {
            // Hide all steps
            step1Form.classList.remove('active');
            step2Form.classList.remove('active');
            step3Form.classList.remove('active');
            
            // Remove active class from all steps
            step1.classList.remove('active', 'completed');
            step2.classList.remove('active', 'completed');
            step3.classList.remove('active', 'completed');
            
            // Show the selected step
            if (stepNumber === 1) {
                step1Form.classList.add('active');
                step1.classList.add('active');
            } else if (stepNumber === 2) {
                step2Form.classList.add('active');
                step1.classList.add('completed');
                step2.classList.add('active');
            } else if (stepNumber === 3) {
                step3Form.classList.add('active');
                step1.classList.add('completed');
                step2.classList.add('completed');
                step3.classList.add('active');
            }
            
            // Clear any messages
            clearMessage();
        }

        // Function to send password reset link
        async function sendResetLink() {
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            try {
                sendResetLinkBtn.disabled = true;
                sendResetLinkBtn.textContent = 'Sending...';
                
                const response = await fetch(REDEEM_PASSWORD_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });
                
                if (response.ok) {
                    showMessage('Password reset link has been sent to your email', 'success');
                    setTimeout(() => goToStep(2), 2000);
                } else {
                    const errorData = await response.json();
                    showMessage(errorData.message || 'Failed to send reset link', 'error');
                }
            } catch (error) {
                console.error('Error sending reset link:', error);
                showMessage('Network error. Please try again.', 'error');
            } finally {
                sendResetLinkBtn.disabled = false;
                sendResetLinkBtn.textContent = 'Send Reset Link';
            }
        }

        // Function to reset password
        async function resetPassword() {
            const token = tokenInput.value.trim();
            const password = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (!token) {
                showMessage('Please enter the token from your email', 'error');
                return;
            }
            
            // if (!validatePassword()) {
            //     showMessage('Please fix password requirements', 'error');
            //     return;
            // }
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            try {
                resetPasswordBtn.disabled = true;
                resetPasswordBtn.textContent = 'Resetting...';
                
                const response = await fetch(RESET_PASSWORD_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        token: token,
                        password: password
                    })
                });
                
                if (response.ok) {
                    goToStep(3);
                } else {
                    const errorData = await response.json();
                    showMessage(errorData.message || 'Failed to reset password', 'error');
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                showMessage('Network error. Please try again.', 'error');
            } finally {
                resetPasswordBtn.disabled = false;
                resetPasswordBtn.textContent = 'Reset Password';
            }
        }

        // Function to validate password strength
        // function validatePassword() {
        //     const password = newPasswordInput.value;
        //     let strength = 0;
        //     let isValid = true;
            
            // // Check length
            // if (password.length >= 8) {
            //     reqLength.classList.remove('invalid');
            //     reqLength.classList.add('valid');
            //     reqLength.querySelector('.requirement-icon').textContent = '✓';
            //     strength += 25;
            // } else {
            //     reqLength.classList.remove('valid');
            //     reqLength.classList.add('invalid');
            //     reqLength.querySelector('.requirement-icon').textContent = '✗';
            //     isValid = false;
            // }
            
            // Check uppercase
            // if (/[A-Z]/.test(password)) {
            //     reqUppercase.classList.remove('invalid');
            //     reqUppercase.classList.add('valid');
            //     reqUppercase.querySelector('.requirement-icon').textContent = '✓';
            //     strength += 25;
            // } else {
            //     reqUppercase.classList.remove('valid');
            //     reqUppercase.classList.add('invalid');
            //     reqUppercase.querySelector('.requirement-icon').textContent = '✗';
            //     isValid = false;
            // }
            
            // Check lowercase
            // if (/[a-z]/.test(password)) {
            //     reqLowercase.classList.remove('invalid');
            //     reqLowercase.classList.add('valid');
            //     reqLowercase.querySelector('.requirement-icon').textContent = '✓';
            //     strength += 25;
            // } else {
            //     reqLowercase.classList.remove('valid');
            //     reqLowercase.classList.add('invalid');
            //     reqLowercase.querySelector('.requirement-icon').textContent = '✗';
            //     isValid = false;
            // }
            
            // Check number
            // if (/[0-9]/.test(password)) {
            //     reqNumber.classList.remove('invalid');
            //     reqNumber.classList.add('valid');
            //     reqNumber.querySelector('.requirement-icon').textContent = '✓';
            //     strength += 25;
            // } else {
            //     reqNumber.classList.remove('valid');
            //     reqNumber.classList.add('invalid');
            //     reqNumber.querySelector('.requirement-icon').textContent = '✗';
            //     isValid = false;
            // }
            
            // Update strength bar
        //     passwordStrengthBar.style.width = `${strength}%`;
            
        //     if (strength < 50) {
        //         passwordStrengthBar.style.background = '#e74c3c';
        //     } else if (strength < 75) {
        //         passwordStrengthBar.style.background = '#f39c12';
        //     } else {
        //         passwordStrengthBar.style.background = '#2ecc71';
        //     }
            
        //     return isValid;
        // }

        // Function to check if passwords match
        function checkPasswordMatch() {
            const password = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword && password !== confirmPassword) {
                passwordMatch.classList.remove('hidden');
                return false;
            } else {
                passwordMatch.classList.add('hidden');
                return true;
            }
        }

        // Function to validate email format
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Function to show message
        function showMessage(message, type) {
            clearMessage();
            const messageEl = document.createElement('div');
            messageEl.className = `message ${type}`;
            messageEl.textContent = message;
            messageContainer.appendChild(messageEl);
        }

        // Function to clear message
        function clearMessage() {
            messageContainer.innerHTML = '';
        }