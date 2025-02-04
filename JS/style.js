document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpList = document.getElementById('rsvpList');
    const rsvpResponse = document.getElementById('rsvpResponse');
    let rsvps = JSON.parse(localStorage.getItem('bowlingRSVPs')) || [];

    function animatePin() {
        const pin = document.createElement('div');
        pin.className = 'bowling-pin';
        pin.textContent = '🎳';
        document.body.appendChild(pin);
        setTimeout(() => pin.remove(), 1000);
    }

    function updateRSVPList() {
        rsvpList.innerHTML = rsvps
            .filter(rsvp => rsvp.attendance === 'Attending')
            .map(rsvp => `
                <div class="show">
                    🎳 ${rsvp.name} 
                    (Size ${rsvp.shoeSize}) 
                    - ${rsvp.timestamp}
                </div>
            `).join('');
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(rsvpForm);
        const { name, email, shoeSize, attendance } = Object.fromEntries(formData);

        if (!validateEmail(email)) {
            alert('Please use your company email address');
            return;
        }

        const existingIndex = rsvps.findIndex(rsvp => rsvp.email === email);
        if (existingIndex > -1) {
            if (!confirm('Update existing RSVP?')) return;
            rsvps[existingIndex] = {
                name,
                email,
                shoeSize,
                attendance,
                timestamp: new Date().toLocaleString()
            };
        } else {
            rsvps.push({
                name,
                email,
                shoeSize,
                attendance,
                timestamp: new Date().toLocaleString()
            });
        }

        localStorage.setItem('bowlingRSVPs', JSON.stringify(rsvps));
        updateRSVPList();
        animatePin();
        
        rsvpResponse.textContent = "STRIKE! RSVP RECORDED 🎳";
        rsvpForm.reset();
        setTimeout(() => {
            rsvpResponse.textContent = "";
        }, 4000);
    });

    // Initialize list and animations
    updateRSVPList();
    setTimeout(() => {
        document.querySelectorAll('#rsvpList div').forEach(div => {
            div.classList.add('show');
        });
    }, 500);
});
// Replace with your Apps Script URL
const SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL';

function displayResponses() {
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('rsvpList');
            list.innerHTML = data
                .map(user => `
                    <div class="bowler">
                        <span class="bowling-ball">🎳</span>
                        ${user['Your Name']} 
                        <span class="timestamp">${new Date(user.Timestamp).toLocaleDateString()}</span>
                    </div>
                `)
                .join('');
        })
        .catch(error => console.error('Error:', error));
}

// Refresh every 30 seconds
displayResponses();
setInterval(displayResponses, 30000);