const startSensorButton = document.getElementById('startSensorButton');
const sensorStatusDiv = document.getElementById('sensorStatus');

const accelXSpan = document.getElementById('accelX');
const accelYSpan = document.getElementById('accelY');
const accelZSpan = document.getElementById('accelZ');

const gyroAlphaSpan = document.getElementById('gyroAlpha');
const gyroBetaSpan = document.getElementById('gyroBeta');
const gyroGammaSpan = document.getElementById('gyroGamma');

const orientAlphaSpan = document.getElementById('orientAlpha');
const orientBetaSpan = document.getElementById('orientBeta');
const orientGammaSpan = document.getElementById('orientGamma');
const orientAbsoluteSpan = document.getElementById('orientAbsolute');

const canvas = document.getElementById('motionBallCanvas');
const ball = document.getElementById('ball');

let accelerometer = null;
let gyroscope = null;
let isSensorActive = false;

// Ball properties
let ballX = canvas.offsetWidth / 2 - ball.offsetWidth / 2; // Center horizontally
let ballY = canvas.offsetHeight / 2 - ball.offsetHeight / 2; // Center vertically
ball.style.left = ballX + 'px';
ball.style.top = ballY + 'px';

startSensorButton.addEventListener('click', toggleSensors);

function toggleSensors() {
    if (!isSensorActive) {
        startSensors();
    } else {
        stopSensors();
    }
}

function requestPermissionAndStart() {
    // For iOS 13+ devices, we need to request permission for DeviceMotionEvent
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotionEvent);
                    window.addEventListener('deviceorientation', handleOrientationEvent);
                    sensorStatusDiv.textContent = '狀態：運動感測器權限已授予，正在監聽。';
                    isSensorActive = true;
                    startSensorButton.textContent = '停止感測器';
                } else {
                    sensorStatusDiv.textContent = '狀態：運動感測器權限被拒絕。';
                    isSensorActive = false;
                }
            })
            .catch(error => {
                sensorStatusDiv.textContent = `狀態：請求運動感測器權限時發生錯誤: ${error.message}`;
                console.error('DeviceMotionEvent.requestPermission error:', error);
                isSensorActive = false;
            });
    } else {
        // For other browsers/devices that don't require explicit permission for DeviceMotionEvent
        // or for Generic Sensor API
        window.addEventListener('devicemotion', handleMotionEvent);
        window.addEventListener('deviceorientation', handleOrientationEvent);
        sensorStatusDiv.textContent = '狀態：正在監聽運動和方向感測器。';
        isSensorActive = true;
        startSensorButton.textContent = '停止感測器';
    }

    // Try to use Generic Sensor API for Accelerometer and Gyroscope if available
    startGenericSensors();
}


function startSensors() {
    sensorStatusDiv.textContent = '狀態：正在嘗試啟動感測器...';
    requestPermissionAndStart();
}

function startGenericSensors() {
    // Accelerometer via Generic Sensor API
    if ('Accelerometer' in window) {
        try {
            accelerometer = new Accelerometer({ frequency: 60 });
            accelerometer.addEventListener('reading', () => {
                if (accelerometer) {
                    accelXSpan.textContent = accelerometer.x ? accelerometer.x.toFixed(3) : '-';
                    accelYSpan.textContent = accelerometer.y ? accelerometer.y.toFixed(3) : '-';
                    accelZSpan.textContent = accelerometer.z ? accelerometer.z.toFixed(3) : '-';
                }
            });
            accelerometer.addEventListener('error', (event) => {
                console.error('Accelerometer error:', event.error.name, event.error.message);
                if (event.error.name === 'NotAllowedError') {
                    sensorStatusDiv.textContent += ' (加速度計權限被拒絕)';
                }
            });
            accelerometer.start();
        } catch (error) {
            console.error('Failed to start accelerometer:', error);
            if (error.name === 'SecurityError') {
                 accelXSpan.textContent = "HTTPS?"
                 accelYSpan.textContent = "Error"
                 accelZSpan.textContent = error.message;
            } else {
                accelXSpan.textContent = "N/A"
            }
        }
    } else {
        accelXSpan.textContent = '瀏覽器不支援 (Generic Sensor API)';
    }

    // Gyroscope via Generic Sensor API
    if ('Gyroscope' in window) {
        try {
            gyroscope = new Gyroscope({ frequency: 60 });
            gyroscope.addEventListener('reading', () => {
                if (gyroscope) {
                    gyroAlphaSpan.textContent = gyroscope.x ? gyroscope.x.toFixed(3) : '-'; // x maps to alpha
                    gyroBetaSpan.textContent = gyroscope.y ? gyroscope.y.toFixed(3) : '-';  // y maps to beta
                    gyroGammaSpan.textContent = gyroscope.z ? gyroscope.z.toFixed(3) : '-'; // z maps to gamma
                }
            });
            gyroscope.addEventListener('error', (event) => {
                console.error('Gyroscope error:', event.error.name, event.error.message);
                 if (event.error.name === 'NotAllowedError') {
                    sensorStatusDiv.textContent += ' (陀螺儀權限被拒絕)';
                }
            });
            gyroscope.start();
        } catch (error) {
            console.error('Failed to start gyroscope:', error);
            if (error.name === 'SecurityError') {
                 gyroAlphaSpan.textContent = "HTTPS?"
                 gyroBetaSpan.textContent = "Error"
                 gyroGammaSpan.textContent = error.message;
            } else {
                 gyroAlphaSpan.textContent = "N/A"
            }
        }
    } else {
        gyroAlphaSpan.textContent = '瀏覽器不支援 (Generic Sensor API)';
    }
}


function stopSensors() {
    window.removeEventListener('devicemotion', handleMotionEvent);
    window.removeEventListener('deviceorientation', handleOrientationEvent);

    if (accelerometer && typeof accelerometer.stop === 'function') {
        accelerometer.stop();
        accelerometer = null;
    }
    if (gyroscope && typeof gyroscope.stop === 'function') {
        gyroscope.stop();
        gyroscope = null;
    }

    isSensorActive = false;
    sensorStatusDiv.textContent = '狀態：感測器已停止。';
    startSensorButton.textContent = '開始感測器';
    // Reset display values
    accelXSpan.textContent = '-';
    accelYSpan.textContent = '-';
    accelZSpan.textContent = '-';
    gyroAlphaSpan.textContent = '-';
    gyroBetaSpan.textContent = '-';
    gyroGammaSpan.textContent = '-';
    orientAlphaSpan.textContent = '-';
    orientBetaSpan.textContent = '-';
    orientGammaSpan.textContent = '-';
    orientAbsoluteSpan.textContent = '-';
    // Reset ball to center
    ballX = canvas.offsetWidth / 2 - ball.offsetWidth / 2;
    ballY = canvas.offsetHeight / 2 - ball.offsetHeight / 2;
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

function handleMotionEvent(event) {
    // Fallback for accelerometer data if Generic Sensor API is not available or fails
    if (!accelerometer) {
        const { accelerationIncludingGravity } = event;
        if (accelerationIncludingGravity) {
            accelXSpan.textContent = accelerationIncludingGravity.x ? accelerationIncludingGravity.x.toFixed(3) : '-';
            accelYSpan.textContent = accelerationIncludingGravity.y ? accelerationIncludingGravity.y.toFixed(3) : '-';
            accelZSpan.textContent = accelerationIncludingGravity.z ? accelerationIncludingGravity.z.toFixed(3) : '-';
        }
    }
     // Fallback for gyroscope data (rotationRate)
    if (!gyroscope) {
        const { rotationRate } = event;
        if (rotationRate) {
            gyroAlphaSpan.textContent = rotationRate.alpha ? rotationRate.alpha.toFixed(3) : '-';
            gyroBetaSpan.textContent = rotationRate.beta ? rotationRate.beta.toFixed(3) : '-';
            gyroGammaSpan.textContent = rotationRate.gamma ? rotationRate.gamma.toFixed(3) : '-';
        }
    }
}

function handleOrientationEvent(event) {
    const { alpha, beta, gamma, absolute } = event;
    orientAlphaSpan.textContent = alpha ? alpha.toFixed(3) : '-';
    orientBetaSpan.textContent = beta ? beta.toFixed(3) : '-';
    orientGammaSpan.textContent = gamma ? gamma.toFixed(3) : '-';
    orientAbsoluteSpan.textContent = absolute ? '是' : '否';

    // Control the ball based on beta (front-back tilt) and gamma (left-right tilt)
    // Beta: -90 (face up) to 90 (face down) relative to gravity for many devices
    // Gamma: -90 (left side up) to 90 (right side up)

    // Normalize beta and gamma to a range (e.g., -1 to 1 or pixel displacement)
    // The exact mapping might need calibration depending on the device and desired sensitivity.
    // Beta controls Y position, Gamma controls X position.

    if (beta !== null && gamma !== null) {
        // Sensitivity factor - adjust as needed
        const sensitivity = 2;

        // Calculate change in ball position
        // For gamma (left/right tilt): positive gamma tilts right, negative tilts left
        let dx = (gamma / 90) * (canvas.offsetWidth / 2) * sensitivity;
        // For beta (front/back tilt): positive beta tilts back (screen towards user), negative tilts forward
        let dy = (beta / 90) * (canvas.offsetHeight / 2) * sensitivity;

        // Update ball position
        // Initial position is center, so we adjust from there
        ballX = (canvas.offsetWidth / 2 - ball.offsetWidth / 2) + dx;
        ballY = (canvas.offsetHeight / 2 - ball.offsetHeight / 2) + dy;

        // Constrain ball within canvas boundaries
        ballX = Math.max(0, Math.min(canvas.offsetWidth - ball.offsetWidth, ballX));
        ballY = Math.max(0, Math.min(canvas.offsetHeight - ball.offsetHeight, ballY));

        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }
}

// Make sure to stop sensors when the user navigates away
window.addEventListener('beforeunload', () => {
    stopSensors();
});

console.log("accelerometer script loaded"); 