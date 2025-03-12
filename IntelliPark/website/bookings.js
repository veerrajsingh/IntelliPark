// Bookings Page JavaScript

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
                window.location.href = 'profile.html';
            } else if (sectionName === 'Bookings' || sectionName === 'Past Bookings') {
                // Already on bookings page, scroll to relevant section
                const targetSection = sectionName === 'Bookings' ? 
                    document.querySelector('.bookings-section-container:first-of-type') : 
                    document.querySelector('.bookings-section-container:last-of-type');
                
                if (targetSection) {
                    // Scroll to the section
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Pagination Dots
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            // Remove active class from all dots
            paginationDots.forEach(d => d.classList.remove('active'));
            // Add active class to clicked dot
            this.classList.add('active');
            
            // Here you would typically implement pagination logic
            console.log('Pagination page selected:', index + 1);
            
            // For demo purposes, we'll just show a message
            if (index > 0) {
                alert('This is a demo. Additional booking history would be shown on page ' + (index + 1));
            }
        });
    });
});
