const getLocationButton = document.getElementById('getLocationButton');
const watchLocationButton = document.getElementById('watchLocationButton');
const sensorStatusDiv = document.getElementById('sensorStatus');

const latitudeSpan = document.getElementById('latitude');
const longitudeSpan = document.getElementById('longitude');
const accuracySpan = document.getElementById('accuracy');
const altitudeSpan = document.getElementById('altitude');
const altitudeAccuracySpan = document.getElementById('altitudeAccuracy');
const headingSpan = document.getElementById('heading');
const speedSpan = document.getElementById('speed');
const timestampSpan = document.getElementById('timestamp');
const mapContainer = document.getElementById('mapContainer');

let watchId = null;
let map = null;
let marker = null;

getLocationButton.addEventListener('click', getLocation);
watchLocationButton.addEventListener('click', toggleWatchLocation);

function getLocation() {
    if (navigator.geolocation) {
        sensorStatusDiv.textContent = '狀態：正在獲取位置資訊...';
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds
            maximumAge: 0 // Do not use a cached position
        });
    } else {
        sensorStatusDiv.textContent = '狀態：錯誤 - 您的瀏覽器不支援地理位置功能。';
    }
}

function toggleWatchLocation() {
    if (!navigator.geolocation) {
        sensorStatusDiv.textContent = '狀態：錯誤 - 您的瀏覽器不支援地理位置功能。';
        return;
    }

    if (watchId === null) {
        // Start watching
        sensorStatusDiv.textContent = '狀態：開始持續監控位置...';
        watchLocationButton.textContent = '停止持續監控位置';
        watchId = navigator.geolocation.watchPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 30000, // Update could take up to 30 seconds
            maximumAge: 0
        });
    } else {
        // Stop watching
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        sensorStatusDiv.textContent = '狀態：已停止持續監控位置。';
        watchLocationButton.textContent = '開始持續監控位置';
    }
}

function showPosition(position) {
    const coords = position.coords;
    const timestamp = new Date(position.timestamp);

    latitudeSpan.textContent = coords.latitude !== null ? coords.latitude.toFixed(6) : 'N/A';
    longitudeSpan.textContent = coords.longitude !== null ? coords.longitude.toFixed(6) : 'N/A';
    accuracySpan.textContent = coords.accuracy !== null ? coords.accuracy.toFixed(1) : 'N/A';
    altitudeSpan.textContent = coords.altitude !== null ? coords.altitude.toFixed(1) : 'N/A';
    altitudeAccuracySpan.textContent = coords.altitudeAccuracy !== null ? coords.altitudeAccuracy.toFixed(1) : 'N/A';
    headingSpan.textContent = coords.heading !== null ? coords.heading.toFixed(1) : 'N/A';
    speedSpan.textContent = coords.speed !== null ? coords.speed.toFixed(2) : 'N/A';
    timestampSpan.textContent = timestamp.toLocaleString();

    sensorStatusDiv.textContent = '狀態：成功獲取位置資訊。';

    // Initialize or update map
    if (typeof L !== 'undefined') { // Check if Leaflet is loaded
        if (!map) {
            mapContainer.textContent = ''; // Clear placeholder text
            map = L.map(mapContainer).setView([coords.latitude, coords.longitude], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            marker = L.marker([coords.latitude, coords.longitude]).addTo(map);
            marker.bindPopup(`<b>您的位置</b><br>緯度: ${coords.latitude.toFixed(4)}<br>經度: ${coords.longitude.toFixed(4)}`).openPopup();
        } else {
            map.setView([coords.latitude, coords.longitude], map.getZoom());
            marker.setLatLng([coords.latitude, coords.longitude]);
            marker.setPopupContent(`<b>您的位置</b><br>緯度: ${coords.latitude.toFixed(4)}<br>經度: ${coords.longitude.toFixed(4)}`).openPopup();
        }
    } else {
        mapContainer.textContent = "地圖庫 (Leaflet) 未載入。";
    }
}

function showError(error) {
    let message = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "使用者拒絕了地理位置請求。";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "位置資訊不可用。 (例如：GPS無訊號)";
            break;
        case error.TIMEOUT:
            message = "獲取使用者位置的請求已超時。";
            break;
        case error.UNKNOWN_ERROR:
            message = "發生未知錯誤。";
            break;
    }
    sensorStatusDiv.textContent = `狀態：錯誤 - ${message}`;
    console.warn(`GEOLOCATION ERROR(${error.code}): ${error.message}`);

    // Clear previous data if error occurs
    latitudeSpan.textContent = '-';
    longitudeSpan.textContent = '-';
    accuracySpan.textContent = '-';
    altitudeSpan.textContent = '-';
    altitudeAccuracySpan.textContent = '-';
    headingSpan.textContent = '-';
    speedSpan.textContent = '-';
    timestampSpan.textContent = '-';
}

// Clean up watch if user navigates away
window.addEventListener('beforeunload', () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }
});

console.log("geolocation script loaded"); 