const locations = [
    { image: 'assets/img/localizacao1.png', coords: { lat: -29.6834813, lng: -53.85655299 } }, 
    { image: 'assets/img/localizacao2.png', coords: { lat: -29.701601, lng: -53.8431684 } }, 
    { image: 'assets/img/localizacao4.png', coords: { lat: -29.706964, lng: -53.829359 } }, 
    { image: 'assets/img/localizacao5.png', coords: { lat: -29.713287, lng: -53.7176128 } }
];

let currentLocationIndex = 0;
let userGuess = null;
let score = 0;
let guessMade = false;  

var map = L.map('map').setView([-29.6914, -53.8008], 10); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function loadRandomLocation() {
    currentLocationIndex = Math.floor(Math.random() * locations.length);
    const location = locations[currentLocationIndex];

    document.getElementById('location-image').src = location.image;
}

loadRandomLocation();

map.on('click', function (e) {
    if (guessMade) {
        alert('Você já fez o seu palpite.');
        return;
    }

    if (userGuess) {
        map.removeLayer(userGuess);
    }

    userGuess = L.marker(e.latlng).addTo(map);
    console.log('Posição do clique: ', e.latlng);
});

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function calculatePoints(distance) {
    const maxPoints = 5000;
    const decayRate = 0.0003;  // Quanto menor o valor, mais rápido os pontos decaem
    const points = maxPoints * Math.exp(-decayRate * distance);
    return Math.max(0, Math.floor(points));
}

document.getElementById('guess-btn').addEventListener('click', function() {
    if (userGuess && !guessMade) {
        const userLatLng = userGuess.getLatLng();  
        const correctLocation = locations[currentLocationIndex].coords;  

        const distance = calculateDistance(userLatLng.lat, userLatLng.lng, correctLocation.lat, correctLocation.lng);

        let points = calculatePoints(distance);
        score += points;

        alert(`Distância: ${distance.toFixed(2)} km. Você ganhou ${points} pontos!`);

        document.getElementById('score-display').textContent = `Pontuação: ${score}`;

        guessMade = true;

        map.off('click');
    } else if (!userGuess) {
        alert('Clique no mapa para fazer um palpite.');
    } else {
        alert('Você já fez o seu palpite.');
    }
});
