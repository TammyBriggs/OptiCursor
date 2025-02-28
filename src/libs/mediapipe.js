// src/libs/mediapipe.js

const faceMeshScript = document.createElement('script');
faceMeshScript.src = chrome.runtime.getURL('../src/libs/face_mesh.js');
document.head.appendChild(faceMeshScript);

const cameraUtilsScript = document.createElement('script');
cameraUtilsScript.src = chrome.runtime.getURL('../src/libs/camera_utils.js');
document.head.appendChild(cameraUtilsScript);
