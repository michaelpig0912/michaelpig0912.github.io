const startCameraButton = document.getElementById('startCameraButton');
const switchCameraButton = document.getElementById('switchCameraButton');
const videoPreview = document.getElementById('videoPreview');
const sensorStatusDiv = document.getElementById('sensorStatus');
const errorMessageDiv = document.getElementById('errorMessage');

// 光線分析相關元素
const startLightAnalysisButton = document.getElementById('startLightAnalysisButton');
const lightSensorStatusDiv = document.getElementById('lightSensorStatus');
const lightValueSpan = document.getElementById('lightValue');
const brightnessValueSpan = document.getElementById('brightnessValue');
const lightIndicator = document.getElementById('lightIndicator');
const indicatorText = document.getElementById('indicatorText');
const lightErrorMessageDiv = document.getElementById('lightErrorMessage');
const analysisCanvas = document.getElementById('analysisCanvas');

let currentStream = null;
let cameras = [];
let currentCameraIndex = 0;
let isCameraActive = false;

// 光線分析相關變數
let isLightAnalysisActive = false;
let analysisInterval = null;
let canvasContext = null;

startCameraButton.addEventListener('click', toggleCamera);
switchCameraButton.addEventListener('click', switchCamera);
startLightAnalysisButton.addEventListener('click', toggleLightAnalysis);

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

        // 初始化canvas用於影像分析
        setupAnalysisCanvas();

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
    
    // 停止光線分析
    if (isLightAnalysisActive) {
        stopLightAnalysis();
    }
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

// 光線分析相關函數
function setupAnalysisCanvas() {
    analysisCanvas.width = 160; // 較小的解析度用於分析，提高效能
    analysisCanvas.height = 120;
    canvasContext = analysisCanvas.getContext('2d');
}

function analyzeFrameBrightness() {
    if (!canvasContext || !isCameraActive) return;
    
    try {
        // 將video畫面繪製到canvas上
        canvasContext.drawImage(videoPreview, 0, 0, analysisCanvas.width, analysisCanvas.height);
        
        // 獲取像素數據
        const imageData = canvasContext.getImageData(0, 0, analysisCanvas.width, analysisCanvas.height);
        const data = imageData.data;
        
        let totalBrightness = 0;
        let pixelCount = 0;
        
        // 計算每個像素的亮度
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];     // Red
            const g = data[i + 1]; // Green
            const b = data[i + 2]; // Blue
            
            // 使用加權平均計算亮度 (人眼對綠色最敏感)
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            totalBrightness += brightness;
            pixelCount++;
        }
        
        const averageBrightness = totalBrightness / pixelCount;
        
        // 將亮度值轉換為估算的光線強度 (模擬lux值)
        const estimatedLux = Math.round(averageBrightness * averageBrightness / 10);
        
        // 更新顯示
        brightnessValueSpan.textContent = Math.round(averageBrightness);
        lightValueSpan.textContent = `${estimatedLux} lux`;
        
        updateLightIndicator(estimatedLux, averageBrightness);
        
    } catch (error) {
        console.error('影像分析錯誤:', error);
        lightErrorMessageDiv.textContent = '影像分析錯誤，請重新啟動相機';
    }
}

function startLightAnalysis() {
    if (!isCameraActive) {
        lightErrorMessageDiv.textContent = '請先啟動相機才能進行光線分析';
        return;
    }
    
    lightSensorStatusDiv.textContent = '狀態：正在啟動光線分析...';
    lightErrorMessageDiv.textContent = '';
    
    // 等待video元素準備就緒
    if (videoPreview.readyState >= 2) {
        startAnalysisLoop();
    } else {
        videoPreview.addEventListener('loadeddata', startAnalysisLoop, { once: true });
    }
}

function startAnalysisLoop() {
    isLightAnalysisActive = true;
    startLightAnalysisButton.textContent = '停止光線分析';
    lightSensorStatusDiv.textContent = '狀態：光線分析已啟動';
    
    // 每秒分析3次
    analysisInterval = setInterval(analyzeFrameBrightness, 333);
}

function stopLightAnalysis() {
    if (analysisInterval) {
        clearInterval(analysisInterval);
        analysisInterval = null;
    }
    isLightAnalysisActive = false;
    startLightAnalysisButton.textContent = '開始光線分析';
    lightSensorStatusDiv.textContent = '狀態：光線分析已停止';
    brightnessValueSpan.textContent = '-';
    lightValueSpan.textContent = '-';
    lightIndicator.style.backgroundColor = '#f8f9fa';
    lightIndicator.style.color = '#000000';
    indicatorText.textContent = '啟動相機後開始光線分析';
    lightErrorMessageDiv.textContent = '';
}

function toggleLightAnalysis() {
    if (!isLightAnalysisActive) {
        startLightAnalysis();
    } else {
        stopLightAnalysis();
    }
}

function updateLightIndicator(estimatedLux, brightness) {
    let backgroundColor, textColor, description;
    
    if (brightness < 30) {
        backgroundColor = '#1a1a1a';
        textColor = '#ffffff';
        description = '極暗環境';
    } else if (brightness < 60) {
        backgroundColor = '#404040';
        textColor = '#ffffff';
        description = '暗環境';
    } else if (brightness < 100) {
        backgroundColor = '#808080';
        textColor = '#ffffff';
        description = '室內一般光線';
    } else if (brightness < 150) {
        backgroundColor = '#c0c0c0';
        textColor = '#000000';
        description = '室內明亮光線';
    } else if (brightness < 200) {
        backgroundColor = '#e0e0e0';
        textColor = '#000000';
        description = '很亮的室內或陰天戶外';
    } else if (brightness < 230) {
        backgroundColor = '#f0f0f0';
        textColor = '#000000';
        description = '戶外陰天';
    } else {
        backgroundColor = '#ffffff';
        textColor = '#000000';
        description = '戶外晴天';
    }
    
    lightIndicator.style.backgroundColor = backgroundColor;
    lightIndicator.style.color = textColor;
    indicatorText.textContent = `${description}\n亮度: ${Math.round(brightness)}`;
}

// 初始化檢查
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

function initialLightAnalysisCheck() {
    // 檢查是否支援Canvas API
    if (!analysisCanvas.getContext) {
        lightSensorStatusDiv.textContent = '狀態：此瀏覽器不支援影像分析';
        startLightAnalysisButton.disabled = true;
        lightErrorMessageDiv.textContent = '提示：請使用支援 Canvas API 的現代瀏覽器';
    }
}

// Stop all sensors when navigating away
window.addEventListener('beforeunload', () => {
    stopCamera();
    stopLightAnalysis();
});

// 初始化
initialCameraCheck();
initialLightAnalysisCheck();
console.log("camera and light analysis script loaded"); 