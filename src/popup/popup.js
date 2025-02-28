// src/popup/popup.js
document.getElementById('calibrate').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: startCalibration
        });
    });
});

function startCalibration() {
    const calibrationPoints = [
        { x: 50, y: 50 },
        { x: window.innerWidth - 50, y: 50 },
        { x: window.innerWidth - 50, y: window.innerHeight - 50 },
        { x: 50, y: window.innerHeight - 50 },
        { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    ];

    let index = 0;
    const point = document.createElement('div');
    point.style.position = 'absolute';
    point.style.width = '20px';
    point.style.height = '20px';
    point.style.backgroundColor = 'blue';
    point.style.borderRadius = '50%';
    point.style.pointerEvents = 'none';
    point.style.zIndex = '9999';
    document.body.appendChild(point);

    const nextPoint = () => {
        if (index < calibrationPoints.length) {
            const { x, y } = calibrationPoints[index];
            point.style.left = `${x}px`;
            point.style.top = `${y}px`;

            setTimeout(() => {
                // Collect data (to be implemented)
                console.log('Collecting gaze data for:', x, y);
                index++;
                nextPoint();
            }, 2000);
        } else {
            point.remove();
            alert('Calibration complete!');
        }
    };

    nextPoint();
}
