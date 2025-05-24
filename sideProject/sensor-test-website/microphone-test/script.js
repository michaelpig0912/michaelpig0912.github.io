const startMicButton = document.getElementById('startMicButton');
const statusDiv = document.getElementById('status');
const visualizerDiv = document.getElementById('visualizer');
const clapStatusP = document.getElementById('clapStatus');

let audioContext;
let analyser;
let microphone;
let javascriptNode;
let dataArray;
let bufferLength;

let isMicActive = false;
let stream = null;

const CLAP_THRESHOLD = 100; // Adjust this based on testing
const CLAP_MIN_INTERVAL = 500; // Minimum milliseconds between claps
let lastClapTime = 0;

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
        statusDiv.textContent = '狀態：錯誤 - 您的瀏覽器不支援麥克風存取 (getUserMedia)。';
        return;
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        isMicActive = true;
        statusDiv.textContent = '狀態：麥克風已啟動。請授權。';
        startMicButton.textContent = '停止麥克風測試';

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1); // For custom audio processing

        analyser.fftSize = 256; // Smaller FFT size for faster response, less detail
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
            analyser.getByteFrequencyData(dataArray); // Frequency data for visualization
            // analyser.getByteTimeDomainData(dataArray); // Time domain data for volume/clap detection

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            let averageVolume = sum / bufferLength;

            drawVisualizer(dataArray); // Visualize frequency
            detectClap(averageVolume); // Detect clap based on overall volume
        }
        statusDiv.textContent = '狀態：麥克風已啟動並正在監聽。';

    } catch (err) {
        console.error("麥克風錯誤:", err);
        statusDiv.textContent = `狀態：錯誤 - ${err.name}: ${err.message}`;
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            statusDiv.textContent = '狀態：錯誤 - 您拒絕了麥克風權限。';
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            statusDiv.textContent = '狀態：錯誤 - 找不到麥克風設備。';
        }
        isMicActive = false;
    }
}

function stopMicrophone() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close().catch(e => console.error("Error closing AudioContext:", e));
    }
    if (javascriptNode) {
        javascriptNode.onaudioprocess = null; // Remove the processing event
        javascriptNode.disconnect();
    }
     if (microphone) microphone.disconnect();
     if (analyser) analyser.disconnect();


    isMicActive = false;
    statusDiv.textContent = '狀態：麥克風已停止。';
    startMicButton.textContent = '開始麥克風測試';
    visualizerDiv.innerHTML = ''; // Clear visualizer
    clapStatusP.textContent = '拍手偵測：-';
    stream = null;
    audioContext = null;
}

function drawVisualizer(data) {
    visualizerDiv.innerHTML = ''; // Clear previous bars
    const barWidth = (visualizerDiv.offsetWidth / bufferLength) * 2.5; // Calculate bar width dynamically
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (data[i] / 255) * visualizerDiv.offsetHeight; // Scale height to visualizer height
        const bar = document.createElement('div');
        bar.style.height = barHeight + 'px';
        bar.style.width = barWidth + 'px';
        bar.style.backgroundColor = `rgb(50, ${data[i]}, 180)`; // Color based on intensity
        bar.classList.add('bar');
        visualizerDiv.appendChild(bar);
    }
}

function detectClap(volume) {
    const currentTime = Date.now();
    if (volume > CLAP_THRESHOLD && (currentTime - lastClapTime) > CLAP_MIN_INTERVAL) {
        clapStatusP.textContent = '拍手偵測：偵測到拍手！';
        lastClapTime = currentTime;
        // You can add more actions here, like playing a sound or animation
        setTimeout(() => {
            clapStatusP.textContent = '拍手偵測：-';
        }, 2000); // Reset message after 2 seconds
    }
}

// Make sure to stop the microphone when the user navigates away
window.addEventListener('beforeunload', () => {
    stopMicrophone();
});

console.log("microphone script loaded"); 