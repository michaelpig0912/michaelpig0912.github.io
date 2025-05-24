const startLightSensorButton = document.getElementById('startLightSensorButton');
const sensorStatusDiv = document.getElementById('sensorStatus');
const lightValueSpan = document.getElementById('lightValue');
const lightIndicatorDiv = document.getElementById('lightIndicator');
const indicatorTextSpan = document.getElementById('indicatorText');

let lightSensor = null;
let isSensorActive = false;

startLightSensorButton.addEventListener('click', toggleLightSensor);

function toggleLightSensor() {
    if (!isSensorActive) {
        startSensor();
    } else {
        stopSensor();
    }
}

function startSensor() {
    if ('AmbientLightSensor' in window) {
        navigator.permissions.query({ name: 'ambient-light-sensor' })
            .then(permissionStatus => {
                if (permissionStatus.state === 'denied') {
                    sensorStatusDiv.textContent = '狀態：錯誤 - 環境光感測器權限已被拒絕。';
                    lightValueSpan.textContent = '權限被拒';
                    return;
                }
                // No need to explicitly call permissionStatus.request() as the constructor will trigger it.
                
                try {
                    lightSensor = new AmbientLightSensor({ frequency: 1 }); // Read data once per second
                    lightSensor.addEventListener('reading', () => {
                        if (lightSensor && lightSensor.illuminance !== null) {
                            const illuminance = lightSensor.illuminance;
                            lightValueSpan.textContent = illuminance.toFixed(2) + ' lux';
                            updateIndicator(illuminance);
                        } else {
                            lightValueSpan.textContent = '讀取中...';
                        }
                    });
                    lightSensor.addEventListener('error', (event) => {
                        console.error('AmbientLightSensor error:', event.error.name, event.error.message);
                        lightValueSpan.textContent = `錯誤: ${event.error.name}`;
                        sensorStatusDiv.textContent = `狀態：錯誤 - ${event.error.message}`;
                        if (event.error.name === 'NotReadableError') {
                             sensorStatusDiv.textContent = '狀態：錯誤 - 感測器不可讀。請檢查硬體或驅動程式。';
                        } else if (event.error.name === 'NotAllowedError') {
                            sensorStatusDiv.textContent = '狀態：錯誤 - 存取環境光感測器的權限未被授予。';
                        } else if (event.error.name === 'SecurityError') {
                            sensorStatusDiv.textContent = '狀態：錯誤 - 存取環境光感測器僅限於安全上下文 (HTTPS)。';
                        }
                        stopSensorOnError(); 
                    });
                    lightSensor.start();
                    sensorStatusDiv.textContent = '狀態：環境光感測器已啟動，正在監聽...';
                    startLightSensorButton.textContent = '停止光感測器';
                    isSensorActive = true;
                } catch (error) {
                    console.error('Failed to initialize AmbientLightSensor:', error);
                    sensorStatusDiv.textContent = `狀態：錯誤 - 初始化失敗: ${error.message}`;
                    lightValueSpan.textContent = '初始化失敗';
                    if (error.name === 'SecurityError') {
                        sensorStatusDiv.textContent = '狀態：錯誤 - 環境光感測器僅限於安全上下文 (HTTPS)。';
                    } else if (error.name === 'ReferenceError') {
                         sensorStatusDiv.textContent = '狀態：錯誤 - 瀏覽器不支援 AmbientLightSensor API。';
                    }
                    isSensorActive = false;
                    startLightSensorButton.textContent = '開始光感測器';
                }
            })
            .catch(err => {
                console.error('Error querying permission for ambient-light-sensor:', err);
                sensorStatusDiv.textContent = `狀態：查詢權限時發生錯誤: ${err.message}`;
                lightValueSpan.textContent = '權限錯誤';
            });
    } else {
        sensorStatusDiv.textContent = '狀態：錯誤 - 您的瀏覽器不支援 AmbientLightSensor API。';
        lightValueSpan.textContent = '不支援';
        isSensorActive = false;
    }
}

function stopSensor() {
    if (lightSensor) {
        lightSensor.stop();
        lightSensor = null;
    }
    isSensorActive = false;
    sensorStatusDiv.textContent = '狀態：環境光感測器已停止。';
    startLightSensorButton.textContent = '開始光感測器';
    lightValueSpan.textContent = '-';
    lightIndicatorDiv.style.backgroundColor = '#f0f0f0'; // Reset indicator
    indicatorTextSpan.textContent = '將手機置於不同光線環境下觀察變化';
}

function stopSensorOnError() {
    if (lightSensor) {
        lightSensor.stop();
        lightSensor = null;
    }
    isSensorActive = false;
    startLightSensorButton.textContent = '開始光感測器';
    // Do not reset statusDiv here as it might contain error message.
}

function updateIndicator(illuminance) {
    let bgColor = '#ffffff'; // Default bright
    let textColor = '#000000';

    if (illuminance < 50) { // Very dark
        bgColor = '#2c3e50'; // Dark blue/grey
        textColor = '#ecf0f1'; // Light grey/white text
        indicatorTextSpan.textContent = "非常暗";
    } else if (illuminance < 200) { // Dim
        bgColor = '#34495e'; // Darker blue
        textColor = '#ecf0f1';
        indicatorTextSpan.textContent = "昏暗";
    } else if (illuminance < 1000) { // Normal indoor light
        bgColor = '#ecf0f1'; // Light grey
        textColor = '#2c3e50';
        indicatorTextSpan.textContent = "室內正常光線";
    } else if (illuminance < 5000) { // Bright indoor / Overcast outdoor
        bgColor = '#f1c40f'; // Yellow
        textColor = '#2c3e50';
        indicatorTextSpan.textContent = "明亮";
    } else { // Very bright / Direct sunlight
        bgColor = '#e67e22'; // Orange
        textColor = '#ffffff';
        indicatorTextSpan.textContent = "非常明亮 (陽光直射)";
    }
    lightIndicatorDiv.style.backgroundColor = bgColor;
    lightIndicatorDiv.style.color = textColor;
}

// Make sure to stop the sensor when the user navigates away
window.addEventListener('beforeunload', () => {
    stopSensor();
});

console.log("light sensor script loaded"); 