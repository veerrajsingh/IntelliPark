// Parking Search Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Parking Complex Selection
    const complexCards = document.querySelectorAll('.parking-complex-card');
    const proceedToBookBtn = document.querySelector('.parking-complex-section .btn-proceed');
    const parkingPlotSection = document.querySelector('.parking-plot-section');
    
    let selectedComplex = null;
    
    complexCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            complexCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Store selected complex name
            selectedComplex = this.querySelector('.complex-name').textContent;
            
            // Enable proceed button
            proceedToBookBtn.removeAttribute('disabled');
        });
    });
    
    // Proceed to Book button
    if (proceedToBookBtn) {
        proceedToBookBtn.addEventListener('click', function() {
            if (selectedComplex) {
                // Scroll to parking plot section
                parkingPlotSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update plot section title to include selected complex
                document.querySelector('.parking-plot-section .section-title').textContent = 
                    `Choose your Parking Plot at ${selectedComplex}`;
            } else {
                alert('Please select a parking complex first');
            }
        });
    }
    
    // Parking Plot Selection
    const plotButtons = document.querySelectorAll('.plot-btn:not(.booked)');
    const proceedToCheckoutBtn = document.querySelector('.parking-plot-section .btn-proceed');
    
    let selectedPlot = null;
    
    plotButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all plot buttons
            plotButtons.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Store selected plot
            selectedPlot = this.textContent;
            
            // Get the section title (for pricing info)
            const sectionTitle = this.closest('.plot-section').querySelector('.plot-section-title').textContent;
            const priceMatch = sectionTitle.match(/₹(\d+\.\d+)\/hour/);
            const pricePerHour = priceMatch ? priceMatch[1] : '0.00';
            
            // Enable proceed to checkout button
            proceedToCheckoutBtn.removeAttribute('disabled');
            
            // Update button text with selected plot and price
            proceedToCheckoutBtn.textContent = `BOOK ${selectedPlot} - ₹${pricePerHour}/hour`;
        });
    });
    
    // Proceed to Checkout button
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', function() {
            if (selectedPlot) {
                // Get booking details from the summary section
                const city = document.querySelector('.summary-selectors .summary-select:first-child').textContent.trim();
                const area = document.querySelector('.summary-selectors .summary-select:last-child').textContent.trim();
                const checkInDate = document.querySelector('.summary-group:nth-child(2) .summary-datetime span:first-child').textContent.trim();
                const checkInTime = document.querySelector('.summary-group:nth-child(2) .summary-datetime span:last-child').textContent.trim();
                const checkOutDate = document.querySelector('.summary-group:nth-child(3) .summary-datetime span:first-child').textContent.trim();
                const checkOutTime = document.querySelector('.summary-group:nth-child(3) .summary-datetime span:last-child').textContent.trim();
                
                // Create booking summary
                const bookingSummary = {
                    complex: selectedComplex,
                    plot: selectedPlot,
                    location: `${city}, ${area}`,
                    checkIn: `${checkInDate} ${checkInTime}`,
                    checkOut: `${checkOutDate} ${checkOutTime}`
                };
                
                // Store booking details in localStorage for checkout page
                localStorage.setItem('bookingSummary', JSON.stringify(bookingSummary));
                
                // For demo purposes, show an alert
                alert(`Booking confirmed for ${selectedPlot} at ${selectedComplex}!`);
                
                // In a real application, you would redirect to a checkout or confirmation page
                // window.location.href = 'checkout.html';
            } else {
                alert('Please select a parking plot first');
            }
        });
    }
    
    // Initialize the page with URL parameters (if any)
    function initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const city = urlParams.get('city') || 'Guwahati';
        const area = urlParams.get('area') || 'Six Mile';
        const checkInDate = urlParams.get('checkInDate') || '2025-03-06';
        const checkInTime = urlParams.get('checkInTime') || '09:45 AM';
        const checkOutDate = urlParams.get('checkOutDate') || '2025-03-06';
        const checkOutTime = urlParams.get('checkOutTime') || '11:45 AM';
        
        // Set summary values
        document.querySelector('.summary-selectors .summary-select:first-child').textContent = city;
        document.querySelector('.summary-selectors .summary-select:last-child').textContent = area;
        document.querySelector('.summary-group:nth-child(2) .summary-datetime span:first-child').textContent = checkInDate;
        document.querySelector('.summary-group:nth-child(2) .summary-datetime span:last-child').textContent = checkInTime;
        document.querySelector('.summary-group:nth-child(3) .summary-datetime span:first-child').textContent = checkOutDate;
        document.querySelector('.summary-group:nth-child(3) .summary-datetime span:last-child').textContent = checkOutTime;
    }
    
    // Call initialization function
    initializeFromURL();
});
