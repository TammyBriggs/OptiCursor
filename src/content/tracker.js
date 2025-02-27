// src/content/tracker.js
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';

export async function startTracking() {
  const video = document.createElement('video');
  video.style.display = 'none';
  document.body.appendChild(video);

  // Load Facemesh model
  const model = await facemesh.load();
  console.log('Facemesh model loaded.');

  // Start webcam stream
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  // Track eye movements
  const trackEyes = async () => {
    const predictions = await model.estimateFaces({ input: video });

    if (predictions.length > 0) {
      const landmarks = predictions[0].scaledMesh;
      const leftEye = landmarks[133];
      const rightEye = landmarks[362];
      console.log('Left Eye:', leftEye);
      console.log('Right Eye:', rightEye);
    }

    requestAnimationFrame(trackEyes);
  };
  trackEyes();
}
