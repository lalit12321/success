const socket = io('socket.io-client');

const map = L.map('map').setView([0, 0], 13);
//let path = L.polyline([], { color: 'blue' }).addTo(map);
// Set up the Leaflet tile layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a marker with an initial position
//let marker = L.marker([0, 0]).addTo(map);

// Track the user's location
function updateLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    socket.emit("send-location", { lat, lon });
 //  path.addLatLng([lat, lon]);
}
    // Update the map center
    // map.setView([lat, lon], 13);
    
    // // Move the marker to the new position
    // marker.setLatLng([lat, lon]);
    
    // console.log(`Lat  ${lat}, Lon: ${lon}`);
    const markers = {};
    socket.on("receive-location", (data) => {
        const { id, lat, lon } = data;
        alert(lat);
        map.setView([lat, lon], 25);
        //L.marker([lat, lon]);
        if (markers[id]) {
          markers[id].setLatLng([lat, lon]);
        } else {
          markers[id] = L.marker([lat, lon]).addTo(map);
        }
      });

      socket.on("user-disconnect", (id) => {
        map.removeLayar(markers[id]);
        delete markers[id];
      });

// Handle error in case geolocation fails
function handleError(error) {
    console.error('Geolocation error:', error);
}

// Watch the user's position in real time
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateLocation, handleError, {
        enableHighAccuracy: true,  // Use high accuracy for more precise location tracking
        timeout: 10000,            // Maximum time to wait for a location
        maximumAge: 0              // Do not use cached positions
    });
} else {
    alert('Geolocation is not supported by your browser.');
}
