// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            const sectionName = this.querySelector('span').textContent;
            
            // Handle navigation based on sidebar item clicked
            if (sectionName === 'Parking Lots') {
                // Already on profile page, no need to navigate
                console.log('Selected section:', sectionName);
            } else if (sectionName === 'Bookings' || sectionName === 'Past Bookings') {
                // Navigate to bookings page
                window.location.href = 'bookings.html';
            }
        });
    });
    
    // Vehicle Type Selection
    const vehicleButtons = document.querySelectorAll('.vehicle-btn');
    
    vehicleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            vehicleButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update dropdown options based on vehicle type
            const vehicleType = this.textContent.trim();
            updateVehicleDropdown(vehicleType);
        });
    });
    
    // Save Changes Button for Profile
    const profileSaveBtn = document.querySelector('.profile-form-section .save-btn');
    if (profileSaveBtn) {
        profileSaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            // Validate form (simple validation)
            if (!firstName || !lastName || !email || !phone) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would typically send data to backend
            // For now, we'll just show a success message
            alert('Profile updated successfully!');
        });
    }
    
    // Save Changes Button for Password
    const passwordSaveBtn = document.querySelector('.password-form .save-btn');
    if (passwordSaveBtn) {
        passwordSaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get password values
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Please fill in all password fields');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('New password and confirm password do not match');
                return;
            }
            
            // Here you would typically verify current password and update with new one
            // For now, we'll just show a success message
            alert('Password updated successfully!');
            
            // Clear password fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        });
    }
    
    // Add Vehicle Button
    const addVehicleBtn = document.querySelector('.add-vehicle-btn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', function() {
            const vehicleInput = document.querySelector('.vehicle-input').value;
            const vehicleType = document.querySelector('.vehicle-dropdown').value;
            
            if (!vehicleInput) {
                alert('Please enter a vehicle registration plate');
                return;
            }
            
            // Here you would typically add the vehicle to user's profile
            // For now, we'll just show a success message
            alert(`Vehicle added successfully! Plate: ${vehicleInput}, Type: ${vehicleType}`);
            
            // Clear input field
            document.querySelector('.vehicle-input').value = '';
        });
    }
    
    // Function to update vehicle dropdown options based on selected vehicle type
    function updateVehicleDropdown(vehicleType) {
        const dropdown = document.querySelector('.vehicle-dropdown');
        
        // Clear existing options
        dropdown.innerHTML = '';
        
        // Add new options based on vehicle type
        if (vehicleType.includes('Car')) {
            addOption(dropdown, 'car', 'Car');
            addOption(dropdown, 'suv', 'SUV');
            addOption(dropdown, 'sedan', 'Sedan');
            addOption(dropdown, 'hatchback', 'Hatchback');
        } else if (vehicleType.includes('Bike')) {
            addOption(dropdown, 'motorcycle', 'Motorcycle');
            addOption(dropdown, 'scooter', 'Scooter');
            addOption(dropdown, 'electric', 'Electric Bike');
        }
    }
    
    // Helper function to add options to dropdown
    function addOption(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
    }
    
    // Initialize the page with sample data (for demonstration)
    function initializeProfilePage() {
        // Set sample user data
        document.getElementById('firstName').value = 'John';
        document.getElementById('lastName').value = 'Doe';
        document.getElementById('email').value = 'john.doe@example.com';
        document.getElementById('phone').value = '+91 98765 43210';
        
        // Set Car as default vehicle type
        document.querySelector('.car-btn').classList.add('active');
        updateVehicleDropdown('Car');
    }
    
    // Call initialization function
    initializeProfilePage();
});
