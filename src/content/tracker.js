// src/content/tracker.js

(async () => {
    console.log('Initializing MediaPipe FaceMesh...');

    const videoElement = document.createElement('video');
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    console.log('Video element created.');

    // Wait for scripts to load before accessing the classes
    await new Promise((resolve) => {
        const checkReady = () => {
            if (window.FaceMesh && window.Camera) {
                console.log('MediaPipe classes are ready.');
                resolve();
            } else {
                console.log('Waiting for MediaPipe scripts to load...');
                setTimeout(checkReady, 100);
            }
        };
        checkReady();
    });

    console.log('Creating FaceMesh instance...');
    const faceMesh = new window.FaceMesh.FaceMesh({
        locateFile: (file) => chrome.runtime.getURL(`libs/${file}`)
    });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    console.log('Creating Camera instance...');
    const camera = new window.Camera.Camera(videoElement, {
        onFrame: async () => {
            console.log('Sending frame to FaceMesh...');
            await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    camera.start();

    console.log('Camera started.');

    faceMesh.onResults((results) => {
        console.log('FaceMesh results received:', results);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            console.log('Face landmarks detected.');
            const landmarks = results.multiFaceLandmarks[0];
            const leftEyeInner = landmarks[133];
            const leftEyeOuter = landmarks[33];
            const rightEyeInner = landmarks[362];
            const rightEyeOuter = landmarks[263];

            // Calculate gaze direction
            const gazeX = (leftEyeInner.x + leftEyeOuter.x + rightEyeInner.x + rightEyeOuter.x) / 4;
            const gazeY = (leftEyeInner.y + leftEyeOuter.y + rightEyeInner.y + rightEyeOuter.y) / 4;

            console.log('Gaze coordinates:', gazeX, gazeY);

            // Map to screen coordinates
            const cursorX = gazeX * window.innerWidth;
            const cursorY = gazeY * window.innerHeight;

            // Move cursor
            moveCursor(cursorX, cursorY);
        }
    });

    // Virtual cursor element
    const cursor = document.createElement('div');
    cursor.style.position = 'absolute';
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursor.style.backgroundColor = 'red';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    document.body.appendChild(cursor);

    console.log('Virtual cursor created.');

    function moveCursor(x, y) {
        console.log('Moving cursor to:', x, y);
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    }
})();
