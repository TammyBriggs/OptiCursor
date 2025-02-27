// src/content/tracker.js
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';

let calibrationData = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  points: []
};

export async function startTracking() {
  const video = document.createElement('video');
  video.style.display = 'none';
  document.body.appendChild(video);

  const model = await facemesh.load();
  console.log('Facemesh model loaded.');

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  const trackEyes = async () => {
    const predictions = await model.estimateFaces({ input: video });

    if (predictions.length > 0) {
      const landmarks = predictions[0].scaledMesh;
      const leftEyeInner = landmarks[133];
      const leftEyeOuter = landmarks[33];
      const rightEyeInner = landmarks[362];
      const rightEyeOuter = landmarks[263];

      // Calculate gaze direction
      const gazeX = (leftEyeInner[0] + leftEyeOuter[0] + rightEyeInner[0] + rightEyeOuter[0]) / 4;
      const gazeY = (leftEyeInner[1] + leftEyeOuter[1] + rightEyeInner[1] + rightEyeOuter[1]) / 4;

      // Map to screen coordinates using calibration data
      const cursorX = (gazeX / video.width) * calibrationData.screenWidth;
      const cursorY = (gazeY / video.height) * calibrationData.screenHeight;

      // Move cursor
      moveCursor(cursorX, cursorY);
    }
    requestAnimationFrame(trackEyes);
  };
  trackEyes();
}

// Virtual cursor element
const cursor = document.createElement('div');
cursor.style.position = 'absolute';
cursor.style.width = '10px';
cursor.style.height = '10px';
cursor.style.backgroundColor = 'red';
cursor.style.borderRadius = '50%';
cursor.style.pointerEvents = 'none';
document.body.appendChild(cursor);

function moveCursor(x, y) {
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
}