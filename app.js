/**
 * SpeakSync AI - Mobile & Laptop PWA App Engine
 * Features:
 * - Mobile & Laptop PWA App Install Banner
 * - Front / Back Camera Switcher for Mobile Phones
 * - Anti-jitter landmark smoothing & 3-frame debouncer
 */

// Application State
const appState = {
  currentScreen: 'home',
  currentLanguage: 'en',
  autoSpeakEnabled: true,
  fontSize: 'medium',
  hapticEnabled: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  cameraActive: false,
  cameraFacingMode: 'user', // 'user' (Front Selfie Cam) or 'environment' (Rear Main Cam)
  mediaStream: null,
  currentDetectedGesture: null,
  lastSpokenGestureId: null,
  lastSpokenTime: 0,
  history: JSON.parse(localStorage.getItem('speaksync_history') || '[]'),
  useMediaPipe: false,
  audioUnlocked: false,
  selectedAudioDeviceId: 'default',
  audioOutputDevices: [],
  mobileShareUrl: 'http://10.0.41.192:8000',
  deferredPwaPrompt: null,
  
  // High-Precision Stability Filters
  recentMatchesBuffer: [],
  smoothedLandmarks: null,

  userProfile: JSON.parse(localStorage.getItem('speaksync_user_profile') || JSON.stringify({
    name: 'Sivakasi',
    email: 'sivakasi@gmail.com',
    role: 'Speech Assistive ISL Communicator',
    emergencyContactName: 'Dr. Sharma (Family Doctor)',
    emergencyContactPhone: '+91 98765 43210',
    memberSince: 'August 2026',
    customNotes: 'Uses Indian Sign Language (ISL) for daily communication.'
  }))
};

// DOM Elements
const elements = {
  screens: document.querySelectorAll('.screen-view'),
  navItems: document.querySelectorAll('.nav-item'),
  cameraFeed: document.getElementById('cameraFeed'),
  canvasOverlay: document.getElementById('canvasOverlay'),
  cameraMessage: document.getElementById('cameraMessage'),
  detectedPhrase: document.getElementById('detectedPhrase'),
  detectedSubtext: document.getElementById('detectedSubtext'),
  autoSpokenPill: document.getElementById('autoSpokenPill'),
  btnSpeak: document.getElementById('btnSpeak'),
  cameraLangSelect: document.getElementById('cameraLangSelect'),
  settingLangSelect: document.getElementById('settingLangSelect'),
  historyList: document.getElementById('historyList'),
  gesturesList: document.getElementById('gesturesList'),
  toggleAutoSpeak: document.getElementById('toggleAutoSpeak'),
  toggleHaptic: document.getElementById('toggleHaptic'),
  fontSizeSelect: document.getElementById('fontSizeSelect'),
  speechRateInput: document.getElementById('speechRateInput'),
  speechPitchInput: document.getElementById('speechPitchInput'),
  activeLangBadge: document.getElementById('activeLangBadge'),
  btnEnableAudio: document.getElementById('btnEnableAudio'),
  btnInstallPwa: document.getElementById('btnInstallPwa'),
  btnToggleCameraFacing: document.getElementById('btnToggleCameraFacing'),
  btnSelectBluetooth: document.getElementById('btnSelectBluetooth'),
  audioOutputSelect: document.getElementById('audioOutputSelect'),
  btnTestBluetooth: document.getElementById('btnTestBluetooth'),
  bluetoothStatusPill: document.getElementById('bluetoothStatusPill'),
  profileNameInput: document.getElementById('profileNameInput'),
  profileEmailInput: document.getElementById('profileEmailInput'),
  profilePhoneInput: document.getElementById('profilePhoneInput'),
  profileRoleDisplay: document.getElementById('profileRoleDisplay'),
  profileHeaderName: document.getElementById('profileHeaderName'),
  profileHeaderEmail: document.getElementById('profileHeaderEmail'),
  btnSaveProfile: document.getElementById('btnSaveProfile')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initSettings();
  initProfileUI();
  initNavigation();
  renderGesturesList();
  renderHistory();
  setupSimulationButtons();
  initMediaPipeHands();
  initBluetoothAudio();
  initPwaInstaller();
  initCameraFacingToggle();

  document.addEventListener('click', unlockAudioPolicy);
  document.addEventListener('touchstart', unlockAudioPolicy);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('Speech Voices Ready:', window.speechSynthesis.getVoices().length);
    };
  }
});

// PWA Service Worker & Installation Handler
function initPwaInstaller() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      console.log('SpeakSync PWA ServiceWorker registered:', reg.scope);
    }).catch((err) => {
      console.warn('PWA ServiceWorker error:', err);
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    appState.deferredPwaPrompt = e;
    if (elements.btnInstallPwa) {
      elements.btnInstallPwa.style.display = 'flex';
      elements.btnInstallPwa.addEventListener('click', () => {
        if (appState.deferredPwaPrompt) {
          appState.deferredPwaPrompt.prompt();
          appState.deferredPwaPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User installed SpeakSync AI App!');
              elements.btnInstallPwa.style.display = 'none';
            }
            appState.deferredPwaPrompt = null;
          });
        }
      });
    }
  });
}

// Mobile Front/Back Camera Switcher
function initCameraFacingToggle() {
  if (!elements.btnToggleCameraFacing) return;

  elements.btnToggleCameraFacing.addEventListener('click', async () => {
    unlockAudioPolicy();
    appState.cameraFacingMode = (appState.cameraFacingMode === 'user') ? 'environment' : 'user';
    const camName = (appState.cameraFacingMode === 'user') ? 'Front Selfie Cam' : 'Rear Camera';
    elements.btnToggleCameraFacing.innerText = `📷 ${camName}`;
    
    if (appState.cameraActive) {
      stopCamera();
      await startCamera();
    }
  });
}

// Share Application Link Function
async function shareApplicationLink() {
  unlockAudioPolicy();
  const shareData = {
    title: 'SpeakSync AI App',
    text: 'Open SpeakSync AI on mobile or laptop for ISL hand gesture detection & instant speech!',
    url: appState.mobileShareUrl
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') copyShareLinkToClipboard();
    }
  } else {
    copyShareLinkToClipboard();
  }
}

function copyShareLinkToClipboard() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(appState.mobileShareUrl).then(() => {
      alert(`SpeakSync AI App link copied to clipboard:\n${appState.mobileShareUrl}\n\nOpen on any mobile phone or laptop on your Wi-Fi!`);
    }).catch(() => fallbackPromptCopy());
  } else {
    fallbackPromptCopy();
  }
}

function fallbackPromptCopy() {
  prompt('Copy this link to open SpeakSync AI App on mobile or laptop:', appState.mobileShareUrl);
}

// Unlock Browser Autoplay Audio Policy
function unlockAudioPolicy() {
  if (appState.audioUnlocked) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
    const silentTest = new SpeechSynthesisUtterance(' ');
    silentTest.volume = 0.01;
    window.speechSynthesis.speak(silentTest);
    appState.audioUnlocked = true;
    if (elements.btnEnableAudio) {
      elements.btnEnableAudio.style.display = 'none';
    }
  }
}

// Profile Management
function initProfileUI() {
  if (elements.profileNameInput) elements.profileNameInput.value = appState.userProfile.name;
  if (elements.profileEmailInput) elements.profileEmailInput.value = appState.userProfile.email;
  if (elements.profilePhoneInput) elements.profilePhoneInput.value = appState.userProfile.emergencyContactPhone;
  if (elements.profileHeaderName) elements.profileHeaderName.innerText = appState.userProfile.name;
  if (elements.profileHeaderEmail) elements.profileHeaderEmail.innerText = appState.userProfile.email;
  if (elements.profileRoleDisplay) elements.profileRoleDisplay.innerText = appState.userProfile.role;

  elements.btnSaveProfile?.addEventListener('click', () => {
    appState.userProfile.name = elements.profileNameInput.value || 'User';
    appState.userProfile.email = elements.profileEmailInput.value || 'user@gmail.com';
    appState.userProfile.emergencyContactPhone = elements.profilePhoneInput.value || '';

    localStorage.setItem('speaksync_user_profile', JSON.stringify(appState.userProfile));

    if (elements.profileHeaderName) elements.profileHeaderName.innerText = appState.userProfile.name;
    if (elements.profileHeaderEmail) elements.profileHeaderEmail.innerText = appState.userProfile.email;

    alert('Profile updated successfully!');
    speakText(`Profile saved for ${appState.userProfile.name}`, appState.currentLanguage);
  });
}

// Bluetooth Audio Devices
async function initBluetoothAudio() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;

  try {
    await updateAudioOutputDeviceList();
    navigator.mediaDevices.ondevicechange = async () => {
      await updateAudioOutputDeviceList();
    };
  } catch (err) {
    console.warn('Bluetooth audio enumeration error:', err);
  }
}

async function updateAudioOutputDeviceList() {
  if (!navigator.mediaDevices.enumerateDevices) return;

  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
  appState.audioOutputDevices = audioOutputs;

  if (elements.audioOutputSelect) {
    elements.audioOutputSelect.innerHTML = '';
    
    const defaultOpt = document.createElement('option');
    defaultOpt.value = 'default';
    defaultOpt.innerText = '🔊 Default Phone/Computer Speakers';
    elements.audioOutputSelect.appendChild(defaultOpt);

    audioOutputs.forEach(device => {
      if (device.deviceId !== 'default') {
        const opt = document.createElement('option');
        opt.value = device.deviceId;
        const isBluetooth = device.label.toLowerCase().includes('bluetooth') || device.label.toLowerCase().includes('wireless') || device.label.toLowerCase().includes('headset');
        opt.innerText = `${isBluetooth ? '🎧 Bluetooth' : '🔊'} ${device.label || `Audio Device (${device.deviceId.slice(0, 5)}...)`}`;
        elements.audioOutputSelect.appendChild(opt);
      }
    });

    elements.audioOutputSelect.value = appState.selectedAudioDeviceId;
  }
}

async function selectBluetoothAudioDevice() {
  unlockAudioPolicy();

  if (navigator.mediaDevices && navigator.mediaDevices.selectAudioOutput) {
    try {
      const audioDevice = await navigator.mediaDevices.selectAudioOutput();
      appState.selectedAudioDeviceId = audioDevice.deviceId;
      await updateAudioOutputDeviceList();
      if (elements.audioOutputSelect) elements.audioOutputSelect.value = audioDevice.deviceId;
      updateBluetoothStatus(audioDevice.label || 'Bluetooth Device');
      speakText('Bluetooth audio device connected.', appState.currentLanguage);
    } catch (err) {
      if (err.name !== 'NotAllowedError') console.warn(err);
    }
  } else {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await updateAudioOutputDeviceList();
      alert('Audio devices updated! Choose your Bluetooth device in the Default Audio dropdown.');
    } catch (err) {
      alert('Please connect your Bluetooth headset in system settings and select it in Default Audio dropdown.');
    }
  }
}

function updateBluetoothStatus(deviceName) {
  if (elements.bluetoothStatusPill) {
    elements.bluetoothStatusPill.innerHTML = `🎧 ${deviceName}`;
    elements.bluetoothStatusPill.className = 'pill active';
  }
}

// Navigation Setup
function initNavigation() {
  elements.navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      unlockAudioPolicy();
      const targetScreen = btn.dataset.screen;
      switchScreen(targetScreen);
    });
  });
}

function switchScreen(screenId) {
  if (appState.currentScreen === 'camera' && screenId !== 'camera') {
    stopCamera();
  }

  appState.currentScreen = screenId;

  elements.screens.forEach(screen => {
    if (screen.id === `screen-${screenId}`) {
      screen.classList.add('active');
    } else {
      screen.classList.remove('active');
    }
  });

  elements.navItems.forEach(item => {
    if (item.dataset.screen === screenId) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });

  if (screenId === 'camera') {
    startCamera();
  }
}

// Speech Synthesizer
function speakText(text, language = appState.currentLanguage) {
  if (!('speechSynthesis' in window)) return;

  unlockAudioPolicy();
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = 1.0;
  utterance.rate = parseFloat(appState.speechRate || 1.0);
  utterance.pitch = parseFloat(appState.speechPitch || 1.0);

  const voiceLangMap = {
    'en': ['en-IN', 'en-US', 'en-GB', 'en'],
    'te': ['te-IN', 'te', 'hi-IN', 'en-IN', 'en-US'],
    'hi': ['hi-IN', 'hi', 'en-IN', 'en-US']
  };

  const candidates = voiceLangMap[language] || ['en-US', 'en'];
  const availableVoices = window.speechSynthesis.getVoices();

  let selectedVoice = null;
  if (availableVoices && availableVoices.length > 0) {
    for (const tag of candidates) {
      selectedVoice = availableVoices.find(v => v.lang.toLowerCase().includes(tag.toLowerCase()));
      if (selectedVoice) break;
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (elements.btnSpeak) {
    elements.btnSpeak.classList.add('speaking');
    elements.btnSpeak.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M11 5L6 9H2V15H6L11 19V5Z"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </svg>
      🔊 Speaking...
    `;
  }

  utterance.onend = () => {
    if (elements.btnSpeak) {
      elements.btnSpeak.classList.remove('speaking');
      elements.btnSpeak.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M11 5L6 9H2V15H6L11 19V5Z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
        Speak Text
      `;
    }
  };

  utterance.onerror = () => {
    if (elements.btnSpeak) elements.btnSpeak.classList.remove('speaking');
  };

  window.speechSynthesis.speak(utterance);

  if (appState.hapticEnabled && navigator.vibrate) {
    navigator.vibrate(60);
  }
}

// MediaPipe Hands AI Setup
let handsInstance = null;

function initMediaPipeHands() {
  if (window.Hands) {
    try {
      handsInstance = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      handsInstance.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65
      });

      handsInstance.onResults(onHandResults);
      appState.useMediaPipe = true;
    } catch (e) {
      console.warn('MediaPipe Hands init fallback:', e);
    }
  }
}

// Camera Engine (Supports Front Selfie and Rear Main Mobile Cameras)
let animationFrameId = null;

async function startCamera() {
  try {
    const videoConstraints = {
      facingMode: appState.cameraFacingMode, // 'user' (Front) or 'environment' (Rear)
      width: { ideal: 640 },
      height: { ideal: 480 }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints
    });

    appState.mediaStream = stream;
    elements.cameraFeed.srcObject = stream;
    appState.cameraActive = true;
    const modeLabel = (appState.cameraFacingMode === 'user') ? 'Front' : 'Rear';
    elements.cameraMessage.innerHTML = `<span class="pulse-dot"></span> ${modeLabel} Mobile Camera Active! Show gesture`;

    requestAnimationFrame(processVideoFrame);
  } catch (err) {
    console.error('Camera access error:', err);
    elements.cameraMessage.innerHTML = `❌ Camera access unavailable. Tap test buttons below to trigger voice!`;
  }
}

function stopCamera() {
  appState.cameraActive = false;
  if (appState.mediaStream) {
    appState.mediaStream.getTracks().forEach(track => track.stop());
    appState.mediaStream = null;
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

async function processVideoFrame() {
  if (!appState.cameraActive) return;

  const video = elements.cameraFeed;
  const canvas = elements.canvasOverlay;

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    if (handsInstance && appState.useMediaPipe) {
      await handsInstance.send({ image: video });
    } else {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const simulatedLandmarks = generateSimulatedLandmarks();
      drawHandSkeleton(ctx, simulatedLandmarks);
      const match = classifyHandLandmarks(simulatedLandmarks);
      if (match) {
        processDebouncedMatch(match.gesture);
      }
    }
  }

  animationFrameId = requestAnimationFrame(processVideoFrame);
}

function onHandResults(results) {
  if (!appState.cameraActive) return;

  const canvas = elements.canvasOverlay;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const rawLandmarks = results.multiHandLandmarks[0];
    const smoothedLandmarks = smoothHandLandmarks(rawLandmarks);
    drawHandSkeleton(ctx, smoothedLandmarks);
    
    elements.cameraMessage.innerHTML = `<span class="pulse-dot"></span> Hand Detected! Instant Voice Active`;

    const match = classifyHandLandmarks(smoothedLandmarks);
    if (match) {
      processDebouncedMatch(match.gesture);
    }
  } else {
    appState.recentMatchesBuffer = [];
    elements.cameraMessage.innerHTML = `<span class="pulse-dot"></span> Show your hand gesture in front of camera`;
  }
}

function smoothHandLandmarks(rawLandmarks) {
  if (!appState.smoothedLandmarks) {
    appState.smoothedLandmarks = rawLandmarks.map(p => ({ ...p }));
    return appState.smoothedLandmarks;
  }

  const alpha = 0.65;
  appState.smoothedLandmarks = rawLandmarks.map((p, i) => ({
    x: appState.smoothedLandmarks[i].x * (1 - alpha) + p.x * alpha,
    y: appState.smoothedLandmarks[i].y * (1 - alpha) + p.y * alpha,
    z: (appState.smoothedLandmarks[i].z || 0) * (1 - alpha) + (p.z || 0) * alpha
  }));

  return appState.smoothedLandmarks;
}

function processDebouncedMatch(gesture) {
  if (!gesture) return;

  appState.recentMatchesBuffer.push(gesture.id);
  if (appState.recentMatchesBuffer.length > 3) {
    appState.recentMatchesBuffer.shift();
  }

  const allMatch = appState.recentMatchesBuffer.length === 3 &&
    appState.recentMatchesBuffer.every(id => id === gesture.id);

  if (allMatch) {
    updateDetectionUI(gesture);
  }
}

function drawHandSkeleton(ctx, landmarks) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20]
  ];

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 8;

  connections.forEach(([i, j]) => {
    ctx.beginPath();
    ctx.moveTo(landmarks[i].x * w, landmarks[i].y * h);
    ctx.lineTo(landmarks[j].x * w, landmarks[j].y * h);
    ctx.stroke();
  });

  landmarks.forEach((p, idx) => {
    ctx.fillStyle = idx % 4 === 0 ? '#3b82f6' : '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, idx % 4 === 0 ? 7 : 4.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

let simFrameCounter = 0;
function generateSimulatedLandmarks() {
  simFrameCounter += 0.05;
  const cx = 0.5 + Math.sin(simFrameCounter) * 0.04;
  const cy = 0.5 + Math.cos(simFrameCounter * 0.8) * 0.03;

  const landmarks = [];
  landmarks[0] = { x: cx, y: cy + 0.25 };
  landmarks[1] = { x: cx - 0.06, y: cy + 0.18 };
  landmarks[2] = { x: cx - 0.10, y: cy + 0.10 };
  landmarks[3] = { x: cx - 0.12, y: cy + 0.04 };
  landmarks[4] = { x: cx - 0.13, y: cy - 0.05 };
  landmarks[5] = { x: cx - 0.05, y: cy + 0.08 };
  landmarks[6] = { x: cx - 0.06, y: cy - 0.02 };
  landmarks[7] = { x: cx - 0.07, y: cy - 0.10 };
  landmarks[8] = { x: cx - 0.08, y: cy - 0.18 };
  landmarks[9] = { x: cx, y: cy + 0.08 };
  landmarks[10] = { x: cx, y: cy - 0.03 };
  landmarks[11] = { x: cx, y: cy - 0.12 };
  landmarks[12] = { x: cx, y: cy - 0.20 };
  landmarks[13] = { x: cx + 0.05, y: cy + 0.09 };
  landmarks[14] = { x: cx + 0.06, y: cy - 0.01 };
  landmarks[15] = { x: cx + 0.07, y: cy - 0.09 };
  landmarks[16] = { x: cx + 0.08, y: cy - 0.17 };
  landmarks[17] = { x: cx + 0.10, y: cy + 0.11 };
  landmarks[18] = { x: cx + 0.11, y: cy + 0.03 };
  landmarks[19] = { x: cx + 0.12, y: cy - 0.04 };
  landmarks[20] = { x: cx + 0.13, y: cy - 0.12 };
  return landmarks;
}

function updateDetectionUI(gesture) {
  if (!gesture) return;

  appState.currentDetectedGesture = gesture;

  const lang = appState.currentLanguage;
  const translatedText = gesture.translations[lang] || gesture.translations['en'];

  elements.detectedPhrase.innerText = translatedText;
  elements.detectedSubtext.innerText = `Sign: ${gesture.name} ${gesture.icon}`;

  const now = Date.now();

  elements.autoSpokenPill.style.display = 'inline-block';
  elements.autoSpokenPill.innerHTML = '🔊 AUTO SPOKEN!';

  const isNewGesture = (appState.lastSpokenGestureId !== gesture.id);
  const isCooldownElapsed = (now - appState.lastSpokenTime > 3000);

  if (appState.autoSpeakEnabled && (isNewGesture || isCooldownElapsed)) {
    appState.lastSpokenGestureId = gesture.id;
    appState.lastSpokenTime = now;

    speakText(translatedText, lang);
    addToHistory(gesture, translatedText);
  }
}

function setupSimulationButtons() {
  const container = document.getElementById('simButtonsFlex');
  if (!container) return;

  container.innerHTML = '';
  ISL_GESTURES.slice(0, 10).forEach(gesture => {
    const btn = document.createElement('button');
    btn.className = 'sim-btn';
    btn.innerHTML = `${gesture.icon} ${gesture.name.split('/')[0]}`;
    btn.addEventListener('click', () => {
      unlockAudioPolicy();
      appState.lastSpokenGestureId = null;
      updateDetectionUI(gesture);
      switchScreen('camera');
    });
    container.appendChild(btn);
  });
}

elements.btnSpeak.addEventListener('click', () => {
  unlockAudioPolicy();
  if (appState.currentDetectedGesture) {
    const lang = appState.currentLanguage;
    const text = appState.currentDetectedGesture.translations[lang] || appState.currentDetectedGesture.translations['en'];
    speakText(text, lang);
    addToHistory(appState.currentDetectedGesture, text);
  } else {
    const defaultGesture = ISL_GESTURES[0];
    const text = defaultGesture.translations[appState.currentLanguage];
    speakText(text);
    addToHistory(defaultGesture, text);
  }
});

elements.btnEnableAudio?.addEventListener('click', () => {
  unlockAudioPolicy();
  speakText('Voice audio activated. SpeakSync is ready.', appState.currentLanguage);
});

elements.btnSelectBluetooth?.addEventListener('click', selectBluetoothAudioDevice);

elements.audioOutputSelect?.addEventListener('change', (e) => {
  appState.selectedAudioDeviceId = e.target.value;
  const selectedText = e.target.options[e.target.selectedIndex].text;
  updateBluetoothStatus(selectedText);
  speakText(`Audio output changed to ${selectedText}`, appState.currentLanguage);
});

elements.btnTestBluetooth?.addEventListener('click', () => {
  speakText('Testing default audio output. Voice connected successfully.', appState.currentLanguage);
});

[elements.cameraLangSelect, elements.settingLangSelect].forEach(select => {
  if (!select) return;
  select.addEventListener('change', (e) => {
    appState.currentLanguage = e.target.value;
    if (elements.cameraLangSelect) elements.cameraLangSelect.value = appState.currentLanguage;
    if (elements.settingLangSelect) elements.settingLangSelect.value = appState.currentLanguage;
    if (elements.activeLangBadge) elements.activeLangBadge.innerText = appState.currentLanguage.toUpperCase();
    
    if (appState.currentDetectedGesture) {
      appState.lastSpokenGestureId = null;
      updateDetectionUI(appState.currentDetectedGesture);
    }
  });
});

function renderGesturesList() {
  if (!elements.gesturesList) return;
  elements.gesturesList.innerHTML = '';

  ISL_GESTURES.forEach(gesture => {
    const card = document.createElement('div');
    card.className = 'gesture-item-card';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'stretch';
    card.style.gap = '10px';

    const lang = appState.currentLanguage;
    const currentTrans = gesture.translations[lang];

    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="gesture-icon-circle">${gesture.icon}</div>
          <div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${gesture.name}</h4>
            <p style="font-size: 0.82rem; color: #38bdf8; font-weight: 600;">${currentTrans}</p>
          </div>
        </div>
        <button class="btn-speak-icon" title="Listen Gesture Voice">🔊</button>
      </div>

      <div style="display: flex; gap: 12px; background: #0b0f19; padding: 10px; border-radius: 12px; border: 1px solid rgba(6, 182, 212, 0.25); align-items: center;">
        <canvas id="virtualCanvas_${gesture.id}" width="90" height="90" style="border-radius: 8px; background: #0f172a; border: 1px solid #1e293b; flex-shrink: 0;"></canvas>
        <div style="flex: 1;">
          <span style="font-size: 0.72rem; font-weight: 700; color: #06b6d4; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">🖐️ ISL Hand Sign Pose Guide</span>
          <p style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.3;">${gesture.fingerGuide || gesture.description}</p>
          <div class="translations-badges" style="margin-top: 6px;">
            <span class="trans-tag">🇬🇧 ${gesture.translations.en}</span>
            <span class="trans-tag">🇮🇳 TEL: ${gesture.translations.te}</span>
            <span class="trans-tag">🇮🇳 HIN: ${gesture.translations.hi}</span>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.btn-speak-icon').addEventListener('click', (e) => {
      e.stopPropagation();
      unlockAudioPolicy();
      speakText(gesture.translations[appState.currentLanguage]);
    });

    elements.gesturesList.appendChild(card);

    setTimeout(() => {
      const canvasEl = document.getElementById(`virtualCanvas_${gesture.id}`);
      if (canvasEl && gesture.virtualPose) {
        renderVirtualHandPoseCanvas(canvasEl, gesture.virtualPose);
      }
    }, 0);
  });
}

function renderVirtualHandPoseCanvas(canvas, virtualPose) {
  if (!canvas || !virtualPose || virtualPose.length < 21) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = 90;
  const h = canvas.height = 90;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20]
  ];

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;

  connections.forEach(([i, j]) => {
    ctx.beginPath();
    ctx.moveTo(virtualPose[i].x * w, virtualPose[i].y * h);
    ctx.lineTo(virtualPose[j].x * w, virtualPose[j].y * h);
    ctx.stroke();
  });

  virtualPose.forEach((p, idx) => {
    ctx.fillStyle = idx % 4 === 0 ? '#3b82f6' : '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, idx % 4 === 0 ? 4 : 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function addToHistory(gesture, spokenText) {
  const item = {
    id: Date.now(),
    gestureName: gesture.name,
    icon: gesture.icon,
    text: spokenText,
    lang: appState.currentLanguage,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  appState.history.unshift(item);
  if (appState.history.length > 30) appState.history.pop();
  localStorage.setItem('speaksync_history', JSON.stringify(appState.history));
  renderHistory();
}

function renderHistory() {
  if (!elements.historyList) return;

  if (appState.history.length === 0) {
    elements.historyList.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 8px;">📜</p>
        <p>No spoken phrases recorded yet.</p>
        <p style="font-size: 0.8rem;">ISL gestures detected by camera will be spoken automatically and logged here.</p>
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = '';
  appState.history.forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="history-info">
        <h4>${item.icon} ${item.text}</h4>
        <time>${item.time} • ${item.lang.toUpperCase()}</time>
      </div>
      <button class="btn-speak-icon">🔊</button>
    `;

    card.querySelector('.btn-speak-icon').addEventListener('click', () => {
      unlockAudioPolicy();
      speakText(item.text, item.lang);
    });

    elements.historyList.appendChild(card);
  });
}

document.getElementById('btnClearHistory')?.addEventListener('click', () => {
  if (confirm('Clear all speech history?')) {
    appState.history = [];
    localStorage.removeItem('speaksync_history');
    renderHistory();
  }
});

function initSettings() {
  elements.toggleAutoSpeak?.addEventListener('change', (e) => {
    appState.autoSpeakEnabled = e.target.checked;
  });

  elements.toggleHaptic?.addEventListener('change', (e) => {
    appState.hapticEnabled = e.target.checked;
  });

  elements.fontSizeSelect?.addEventListener('change', (e) => {
    appState.fontSize = e.target.value;
    applyFontSize(appState.fontSize);
  });

  elements.speechRateInput?.addEventListener('input', (e) => {
    appState.speechRate = e.target.value;
    document.getElementById('speechRateVal').innerText = `${e.target.value}x`;
  });

  elements.speechPitchInput?.addEventListener('input', (e) => {
    appState.speechPitch = e.target.value;
    document.getElementById('speechPitchVal').innerText = `${e.target.value}x`;
  });
}

function applyFontSize(size) {
  document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
  document.body.classList.add(`font-${size}`);
}
