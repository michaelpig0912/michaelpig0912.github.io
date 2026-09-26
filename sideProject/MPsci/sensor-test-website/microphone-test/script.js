const startMicButton = document.getElementById('startMicButton');
const statusDiv = document.getElementById('status');
const waveformCanvas = document.getElementById('waveformCanvas');
const volumeValueSpan = document.getElementById('volumeValue');
const decibelValueSpan = document.getElementById('decibelValue');
const clapStatusSpan = document.getElementById('clapStatus');
const decibelBar = document.getElementById('decibelBar');

let audioContext;
let analyser;
let microphone;
let animationId;
let dataArray;
let bufferLength;
let canvasContext;

let isMicActive = false;
let stream = null;

// 動畫控制相關
let lastUpdateTime = 0;
const UPDATE_INTERVAL = 100; // 每100毫秒更新一次（10 FPS），讓波形更新更慢

// 拍手偵測相關
const CLAP_THRESHOLD = 50; // 降低分貝閾值，因為現在分貝數是正值
const CLAP_MIN_INTERVAL = 500; // 最小間隔時間
let lastClapTime = 0;

// 分貝計算相關
const REFERENCE_PRESSURE = 20e-6; // 參考聲壓 (20 μPa)

startMicButton.addEventListener('click', toggleMicrophone);

function toggleMicrophone() {
    if (!isMicActive) {
        startMicrophone();
    } else {
        stopMicrophone();
    }
}

async function startMicrophone() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        statusDiv.textContent = '狀態：錯誤 - 您的瀏覽器不支援麥克風存取。';
        return;
    }

    try {
        statusDiv.textContent = '狀態：正在請求麥克風權限...';
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }, 
            video: false 
        });
        
        isMicActive = true;
        startMicButton.textContent = '停止麥克風測試';
        statusDiv.textContent = '狀態：麥克風已啟動並正在分析音頻...';

        // 設置音頻上下文
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);

        // 配置分析器
        analyser.fftSize = 2048; // 更高的解析度
        analyser.smoothingTimeConstant = 0.5; // 增加平滑處理，讓波形更穩定
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        microphone.connect(analyser);

        // 設置Canvas
        setupCanvas();
        
        // 開始動畫循環
        animate();

    } catch (err) {
        console.error("麥克風錯誤:", err);
        handleMicrophoneError(err);
        isMicActive = false;
        startMicButton.textContent = '開始麥克風測試';
    }
}

function handleMicrophoneError(err) {
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        statusDiv.textContent = '狀態：錯誤 - 您拒絕了麥克風權限。';
    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        statusDiv.textContent = '狀態：錯誤 - 找不到麥克風設備。';
    } else {
        statusDiv.textContent = `狀態：錯誤 - ${err.message}`;
    }
}

function stopMicrophone() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(e => console.error("Error closing AudioContext:", e));
        audioContext = null;
    }

    isMicActive = false;
    statusDiv.textContent = '狀態：麥克風已停止。';
    startMicButton.textContent = '開始麥克風測試';
    
    // 清除顯示
    clearCanvas();
    volumeValueSpan.textContent = '-';
    decibelValueSpan.textContent = '-';
    clapStatusSpan.textContent = '-';
    decibelBar.style.width = '0%';
}

function setupCanvas() {
    const rect = waveformCanvas.getBoundingClientRect();
    waveformCanvas.width = rect.width * window.devicePixelRatio;
    waveformCanvas.height = rect.height * window.devicePixelRatio;
    
    canvasContext = waveformCanvas.getContext('2d');
    canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // 設置繪圖樣式
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = '#1abc9c';
    canvasContext.fillStyle = '#34495e';
}

function clearCanvas() {
    if (canvasContext) {
        const rect = waveformCanvas.getBoundingClientRect();
        canvasContext.fillRect(0, 0, rect.width, rect.height);
    }
}

function animate() {
    if (!isMicActive) return;
    
    animationId = requestAnimationFrame(animate);
    
    // 控制更新頻率，讓波形更新更慢
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
        return;
    }
    lastUpdateTime = currentTime;
    
    // 獲取時域數據（用於波形顯示）
    const timeDataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeDataArray);
    
    // 獲取頻域數據（用於音量計算）
    analyser.getByteFrequencyData(dataArray);
    
    // 繪製波形
    drawWaveform(timeDataArray);
    
    // 計算音量和分貝
    const volume = calculateVolume(timeDataArray);
    const decibels = calculateDecibels(volume);
    
    // 更新顯示
    updateDisplay(volume, decibels);
    
    // 偵測拍手
    detectClap(decibels);
}

function drawWaveform(dataArray) {
    const rect = waveformCanvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // 清除畫布
    canvasContext.fillRect(0, 0, width, height);
    
    // 繪製中線
    canvasContext.strokeStyle = '#7f8c8d';
    canvasContext.lineWidth = 1;
    canvasContext.beginPath();
    canvasContext.moveTo(0, height / 2);
    canvasContext.lineTo(width, height / 2);
    canvasContext.stroke();
    
    // 繪製波形
    canvasContext.strokeStyle = '#1abc9c';
    canvasContext.lineWidth = 2;
    canvasContext.beginPath();
    
    const sliceWidth = width / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0; // 正規化到 0-2
        const y = (v * height) / 2;
        
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    canvasContext.stroke();
}

function calculateVolume(dataArray) {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const sample = (dataArray[i] - 128) / 128; // 轉換為 -1 到 1
        sum += sample * sample;
    }
    return Math.sqrt(sum / dataArray.length);
}

function calculateDecibels(volume) {
    if (volume === 0) return 0;
    
    // 修正分貝計算公式，讓結果為正值
    // 使用更合適的參考值和計算方式
    let db = 20 * Math.log10(volume * 100); // 乘以100讓數值更合理
    
    // 確保分貝值在合理範圍內 (0-100)
    db = Math.max(0, Math.min(100, db + 40)); // 加40讓數值偏移到正值範圍
    
    return db;
}

function updateDisplay(volume, decibels) {
    // 更新音量顯示（百分比）
    const volumePercent = Math.round(volume * 100);
    volumeValueSpan.textContent = `${volumePercent}%`;
    
    // 更新分貝顯示
    if (volume === 0) {
        decibelValueSpan.textContent = '0 dB';
    } else {
        decibelValueSpan.textContent = `${Math.round(decibels)} dB`;
    }
    
    // 更新分貝條
    updateDecibelBar(decibels);
}

function updateDecibelBar(decibels) {
    // 將 0-100dB 映射到 0-100%
    const percentage = Math.max(0, Math.min(100, decibels));
    decibelBar.style.width = `${percentage}%`;
}

function detectClap(decibels) {
    const currentTime = Date.now();
    
    if (decibels > CLAP_THRESHOLD && (currentTime - lastClapTime) > CLAP_MIN_INTERVAL) {
        clapStatusSpan.textContent = '偵測到！';
        clapStatusSpan.style.color = '#28a745';
        lastClapTime = currentTime;
        
        // 2秒後重置顯示
        setTimeout(() => {
            if (isMicActive) {
                clapStatusSpan.textContent = '監聽中...';
                clapStatusSpan.style.color = '#007bff';
            }
        }, 2000);
    } else if (isMicActive && clapStatusSpan.textContent === '-') {
        clapStatusSpan.textContent = '監聽中...';
        clapStatusSpan.style.color = '#007bff';
    }
}

// 視窗大小改變時重新設置Canvas
window.addEventListener('resize', () => {
    if (isMicActive) {
        setupCanvas();
    }
});

// 頁面離開時停止麥克風
window.addEventListener('beforeunload', () => {
    stopMicrophone();
});

console.log("improved microphone script loaded"); 