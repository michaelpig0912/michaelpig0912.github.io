const startCameraButton = document.getElementById('startCameraButton');
const switchCameraButton = document.getElementById('switchCameraButton');
const videoPreview = document.getElementById('videoPreview');
const sensorStatusDiv = document.getElementById('sensorStatus');
const errorMessageDiv = document.getElementById('errorMessage');

let currentStream = null;
let cameras = [];
let currentCameraIndex = 0;
let isCameraActive = false;

startCameraButton.addEventListener('click', toggleCamera);
switchCameraButton.addEventListener('click', switchCamera);

async function getCameras() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return [];
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
}

async function startCamera(deviceId = null) {
    if (currentStream) {
        stopCameraStream(); // Stop existing stream before starting a new one
    }

    const constraints = {
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
        // audio: false // No audio needed for this test
    };

    if (deviceId) {
        constraints.video.deviceId = { exact: deviceId };
    }

    try {
        sensorStatusDiv.textContent = '狀態：正在請求相機權限...';
        errorMessageDiv.textContent = '';
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoPreview.srcObject = currentStream;
        videoPreview.play(); // Ensure video plays on all browsers
        isCameraActive = true;
        startCameraButton.textContent = '停止相機';
        sensorStatusDiv.textContent = '狀態：相機已啟動。';

        cameras = await getCameras();
        if (cameras.length > 1) {
            switchCameraButton.style.display = 'inline-block';
        } else {
            switchCameraButton.style.display = 'none';
        }

        // Find current camera index if a specific deviceId was used
        if (deviceId) {
            currentCameraIndex = cameras.findIndex(cam => cam.deviceId === deviceId);
            if(currentCameraIndex === -1) currentCameraIndex = 0; // Fallback
        }

    } catch (err) {
        console.error("相機錯誤:", err);
        errorMessageDiv.textContent = `錯誤: ${err.name} - ${err.message}`;
        sensorStatusDiv.textContent = `狀態：錯誤 - ${err.message}`;
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            errorMessageDiv.textContent = '您拒絕了相機權限。';
            sensorStatusDiv.textContent = '狀態：錯誤 - 相機權限被拒絕。';
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            errorMessageDiv.textContent = '找不到相機設備。';
            sensorStatusDiv.textContent = '狀態：錯誤 - 找不到相機設備。';
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError"){
            errorMessageDiv.textContent = '相機已被其他應用程式使用或硬體錯誤。';
            sensorStatusDiv.textContent = '狀態：錯誤 - 相機無法讀取。';
        }
        isCameraActive = false;
        startCameraButton.textContent = '啟動相機';
    }
}

function stopCameraStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
        currentStream = null;
        videoPreview.srcObject = null; // Clear the video element
    }
}

function stopCamera() {
    stopCameraStream();
    isCameraActive = false;
    startCameraButton.textContent = '啟動相機';
    switchCameraButton.style.display = 'none';
    sensorStatusDiv.textContent = '狀態：相機已停止。';
    errorMessageDiv.textContent = '';
}

function toggleCamera() {
    if (!isCameraActive) {
        // If cameras array is empty or not populated, start with default
        if (cameras.length === 0) {
             startCamera();
        } else {
            // Try to start with the current selected camera or the first one
            startCamera(cameras[currentCameraIndex]?.deviceId);
        }
    } else {
        stopCamera();
    }
}

async function switchCamera() {
    if (cameras.length > 1) {
        currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
        await startCamera(cameras[currentCameraIndex].deviceId);
        sensorStatusDiv.textContent = `狀態：已切換到相機 ${cameras[currentCameraIndex].label || ('相機 ' + (currentCameraIndex + 1))}`;
    } else {
        sensorStatusDiv.textContent = '狀態：只有一個相機可用。';
    }
}

// Initial check for camera availability to potentially show switch button early
async function initialCameraCheck() {
    try {
        cameras = await getCameras();
        if (cameras.length > 1) {
            // Don't show yet, only after camera starts
            // switchCameraButton.style.display = 'inline-block'; 
        } else if (cameras.length === 1){
             // console.log("Single camera found: ", cameras[0].label);
        } else {
            // console.log("No cameras found initially.");
        }
    } catch(e) {
        console.error("Error during initial camera check: ", e);
    }
}

// Stop camera when navigating away
window.addEventListener('beforeunload', () => {
    stopCamera();
});

initialCameraCheck();
console.log("camera script loaded"); 