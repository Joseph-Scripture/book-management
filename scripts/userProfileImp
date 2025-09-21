document.addEventListener('DOMContentLoaded', function() {
      // API Base URL
      const API_BASE_URL = 'http://127.0.0.1:8080/user';
      
      // Get DOM elements
      const editProfileBtn = document.getElementById('edit-profile-btn');
      const profileForm = document.getElementById('profile-form');
      const formInputs = profileForm.querySelectorAll('input, textarea');
      const formButtons = document.getElementById('form-buttons');
      const cancelEditBtn = document.getElementById('cancel-edit');
      const uploadImageBtn = document.getElementById('upload-image-btn');
      const profileImageInput = document.getElementById('profile-image-input');
      const deleteImageBtn = document.getElementById('delete-image-btn');
      const profileImage = document.getElementById('profile-image');
      const navProfileImage = document.getElementById('nav-profile-image');
      const headerUsername = document.getElementById('header-username');
      const navUsername = document.getElementById('nav-username');
      const logoutBtn = document.getElementById('logout-btn');
      const uploadStatus = document.getElementById('upload-status');
      
      // Store original values for cancel operation
      let originalValues = {};
      let userProfileData = null;
      
      // Get JWT token from localStorage
      function getAuthToken() {
        return localStorage.getItem('jwt') || localStorage.getItem('token');
      }
      
      // Check if user is authenticated
      function isAuthenticated() {
        const token = getAuthToken();
        if (!token) {
          alert('Please login first');
          window.location.href = 'login.html';
          return false;
        }
        return true;
      }
      
      // Logout function
      function logout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      }
      
      // Show status message
      function showStatus(message, isError = false) {
        uploadStatus.textContent = message;
        uploadStatus.style.color = isError ? '#e74a3b' : '#1cc88a';
        
        // Clear status after 5 seconds
        setTimeout(() => {
          uploadStatus.textContent = '';
        }, 5000);
      }
      
            // Convert server file path to URL path
          function convertFilePathToUrl(filePath) {
        if (!filePath) return null;
       
        // If it's already a URL, return it
        if (filePath.startsWith('http')) {
          return filePath;
        }
       
        // Construct full URL using API_BASE_URL
        const uploadsIndex = filePath.indexOf('uploads');
        let relativePath;
        if (uploadsIndex !== -1) {
          relativePath = filePath.substring(uploadsIndex - 1); // Include leading slash
        } else {
          // Fallback: use the filename only
          const parts = filePath.split('/');
          relativePath = '/' + parts[parts.length - 1];
        }
        return `${API_BASE_URL}${relativePath}`;
      }

      // Fetch user profile data
      async function fetchUserProfile() {
        if (!isAuthenticated()) return;
        
        try {
          const token = getAuthToken();
          const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            userProfileData = data;
            populateProfileData(data);
          } else if (response.status === 401) {
            // Token might be expired or invalid
            alert('Session expired. Please login again.');
            logout();
          } else {
            console.error('Failed to fetch profile data');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      
      // Populate form with user data
      function populateProfileData(data) {
        document.getElementById('input-username').value = data.username || '';
        document.getElementById('input-email').value = data.email || '';
        document.getElementById('input-first-name').value = data.firstName || '';
        document.getElementById('input-last-name').value = data.lastName || '';
        document.getElementById('input-address').value = data.address || '';
        document.getElementById('input-country').value = data.country || '';
        document.getElementById('input-phone').value = data.phoneNumber || '';
        document.getElementById('input-bio').value = data.bio || '';
        
        // Update profile image
        updateProfileImage(data.profileImageUrl);
        
        // Update usernames
        const displayName = data.firstName || data.username || 'User';
        headerUsername.textContent = displayName;
        navUsername.textContent = displayName;
      }
      
      // Update profile image with cache busting
      // Update profile image with cache busting & JWT fetch
        async function updateProfileImage(imagePath) {
        if (imagePath) {
            try {
            const token = getAuthToken();
            if (!token) {
                console.error("No JWT found for fetching profile picture");
                return;
            }

            // Fetch the image with Authorization header
            const response = await fetch(`${API_BASE_URL}/profile/picture`, {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                profileImage.src = imageUrl;
                navProfileImage.src = imageUrl;
                return;
            } else if (response.status === 401) {
                console.error("Unauthorized: token may have expired");
                logout();
                return;
            } else {
                console.error("Failed to fetch profile picture:", response.status);
            }
            } catch (err) {
            console.error("Error loading profile picture:", err);
            }
        }

        // If no valid image path or fetch failed → reset to default image
        profileImage.src = './images/profile-pic/profile-pic.jpg';
        navProfileImage.src = './images/profile-pic/profile-pic.jpg';
        }

      
      // Enable edit mode
      function enableEditMode() {
        formInputs.forEach(input => {
          if (input.id !== 'input-username' && input.id !== 'input-email') {
            // Store original values
            originalValues[input.id] = input.value;
            // Enable inputs
            input.disabled = false;
          }
        });
        
        // Show form buttons
        formButtons.classList.remove('d-none');
        
        // Change button text
        editProfileBtn.textContent = 'Editing...';
        editProfileBtn.classList.remove('btn-info');
        editProfileBtn.classList.add('btn-warning');
      }
      
      // Disable edit mode
      function disableEditMode() {
        formInputs.forEach(input => {
          input.disabled = true;
        });
        
        // Hide form buttons
        formButtons.classList.add('d-none');
        
        // Restore button
        editProfileBtn.textContent = 'Edit profile';
        editProfileBtn.classList.remove('btn-warning');
        editProfileBtn.classList.add('btn-info');
      }
      
      // Cancel edit and restore original values
      function cancelEdit() {
        formInputs.forEach(input => {
          if (originalValues[input.id] !== undefined) {
            input.value = originalValues[input.id];
          }
        });
        disableEditMode();
      }
      
      // Upload profile image
      async function uploadProfileImage(file) {
        if (!isAuthenticated()) return;
        
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          // Show loading state
          uploadImageBtn.classList.add('btn-loading');
          uploadImageBtn.disabled = true;
          showStatus('Uploading image...');
          
          const response = await fetch(`${API_BASE_URL}/profile/picture`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            showStatus('Image uploaded successfully!');
            
            // Update the profile image
            updateProfileImage(data.profileImageUrl);
            
            // Refresh the profile data to get all updated information
            setTimeout(() => {
              fetchUserProfile();
            }, 1000);
          } else if (response.status === 401) {
            showStatus('Session expired. Please login again.', true);
            setTimeout(() => {
              logout();
            }, 2000);
          } else {
            const errorText = await response.text();
            console.error('Upload failed:', errorText);
            showStatus('Failed to upload image. Please try again.', true);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          showStatus('Error uploading image. Please try again.', true);
        } finally {
          // Reset button state
          uploadImageBtn.classList.remove('btn-loading');
          uploadImageBtn.disabled = false;
          // Clear the file input
          profileImageInput.value = '';
        }
      }
      
      // Delete profile image
      async function deleteProfileImage() {
        if (!isAuthenticated()) return;
        
        if (!confirm('Are you sure you want to remove your profile image?')) {
          return;
        }
        
        const token = getAuthToken();
        
        try {
          // Show loading state
          deleteImageBtn.classList.add('btn-loading');
          deleteImageBtn.disabled = true;
          showStatus('Removing image...');
          
          const response = await fetch(`${API_BASE_URL}/profile/picture`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            showStatus('Image removed successfully!');
            
            // Reset to default image
            updateProfileImage(null);
            
            // Refresh the profile data
            setTimeout(() => {
              fetchUserProfile();
            }, 1000);
          } else if (response.status === 401) {
            showStatus('Session expired. Please login again.', true);
            setTimeout(() => {
              logout();
            }, 2000);
          } else {
            showStatus('Failed to remove profile image', true);
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          showStatus('Error deleting image', true);
        } finally {
          // Reset button state
          deleteImageBtn.classList.remove('btn-loading');
          deleteImageBtn.disabled = false;
        }
      }
      
      // Handle form submission
      profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!isAuthenticated()) return;
        
        const token = getAuthToken();
        const updateData = {
          firstName: document.getElementById('input-first-name').value,
          lastName: document.getElementById('input-last-name').value,
          country: document.getElementById('input-country').value,
          address: document.getElementById('input-address').value,
          bio: document.getElementById('input-bio').value,
          phoneNumber: document.getElementById('input-phone').value
        };
        
        try {
          const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
          });
          
          if (response.ok) {
            const data = await response.json();
            userProfileData = data;
            disableEditMode();
            alert('Profile updated successfully!');
            
            // Refresh the profile data to get all updated information
            fetchUserProfile();
          } else if (response.status === 401) {
            alert('Session expired. Please login again.');
            logout();
          } else {
            alert('Failed to update profile');
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Error updating profile');
        }
      });
      
      // Event listeners
      editProfileBtn.addEventListener('click', enableEditMode);
      cancelEditBtn.addEventListener('click', cancelEdit);
      
      uploadImageBtn.addEventListener('click', function() {
        profileImageInput.click();
      });
      
      profileImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          // Validate file type
          const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!validImageTypes.includes(this.files[0].type)) {
            showStatus('Please select a valid image file (JPEG, PNG, GIF, or WebP).', true);
            this.value = '';
            return;
          }
          
          // Validate file size (max 5MB)
          if (this.files[0].size > 5 * 1024 * 1024) {
            showStatus('Image must be less than 5MB.', true);
            this.value = '';
            return;
          }
          
          uploadProfileImage(this.files[0]);
        }
      });
      
      deleteImageBtn.addEventListener('click', deleteProfileImage);
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
      
      // Initialize page
      fetchUserProfile();
    });