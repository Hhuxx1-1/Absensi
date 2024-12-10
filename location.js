const locationBtn = document.getElementById('getLocationBtn');
const locationResult = document.getElementById('locationResult');

locationBtn.addEventListener('click', () => {
// Check if Geolocation API is supported
if (!navigator.geolocation) {
    locationResult.textContent = "Geolocation is not supported by your browser.";
    return;
}

// Get the user's location
navigator.geolocation.getCurrentPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        locationResult.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
    },
    (error) => {
        locationResult.textContent = `Error: ${error.message}`; 
    }
);
});