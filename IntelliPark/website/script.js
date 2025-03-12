function updateDisplay() {
    fetch('http://localhost:5000/status')
        .then(response => response.json())
        .then(data => {
            // Update numbers
            document.getElementById('total').textContent = data.total;
            document.getElementById('occupied').textContent = data.occupied;
            document.getElementById('free').textContent = data.free;
            
            // Update grid
            const grid = document.getElementById('grid');
            grid.innerHTML = '';
            
            for(let i = 0; i < data.total; i++) {
                const spot = document.createElement('div');
                spot.className = `parking-spot ${data.spaces[i] ? 'occupied' : 'free'}`;
                spot.textContent = i + 1;
                grid.appendChild(spot);
            }
        });
}

// Update every second
setInterval(updateDisplay, 1000);
updateDisplay();  // Initial update