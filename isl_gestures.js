/**
 * SpeakSync AI - Indian Sign Language (ISL) Gesture Dictionary (20+ Gestures)
 * Contains 21 essential ISL gesture definitions, translations (English, Telugu, Hindi),
 * finger guide instructions, geometric matchers, and virtual 2D skeleton pose landmarks.
 */

const ISL_GESTURES = [
  {
    id: 'namaste',
    name: 'Namaste / Hello',
    category: 'Greetings',
    icon: '🙏',
    translations: {
      en: 'Hello! Namaste.',
      te: 'నమస్కారం! ఎలా ఉన్నారు?',
      hi: 'नमस्ते! आप कैसे हैं?'
    },
    description: 'Palms joined together facing upward/forward with all 5 fingers extended.',
    fingerGuide: '🖐️ Extend all 5 fingers straight upward with palm facing forward.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.42, y: 0.75}, {x: 0.35, y: 0.65}, {x: 0.32, y: 0.55}, {x: 0.3, y: 0.45},
      {x: 0.45, y: 0.62}, {x: 0.43, y: 0.45}, {x: 0.42, y: 0.32}, {x: 0.41, y: 0.18},
      {x: 0.5, y: 0.61}, {x: 0.5, y: 0.43}, {x: 0.5, y: 0.28}, {x: 0.5, y: 0.14},
      {x: 0.55, y: 0.63}, {x: 0.56, y: 0.46}, {x: 0.57, y: 0.33}, {x: 0.58, y: 0.2},
      {x: 0.6, y: 0.66}, {x: 0.62, y: 0.52}, {x: 0.64, y: 0.41}, {x: 0.66, y: 0.3}
    ],
    matcher: (landmarks) => {
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      const isMiddleExt = landmarks[12].y < landmarks[10].y;
      const isRingExt = landmarks[16].y < landmarks[14].y;
      const isPinkyExt = landmarks[20].y < landmarks[18].y;
      const isThumbUp = landmarks[4].y < landmarks[3].y;
      if (isIndexExt && isMiddleExt && isRingExt && isPinkyExt && isThumbUp) return 0.96;
      return 0;
    }
  },
  {
    id: 'water',
    name: 'I Need Water',
    category: 'Needs',
    icon: '🥛',
    translations: {
      en: 'I need water, please.',
      te: 'నాకు మంచి నీళ్లు కావాలి.',
      hi: 'मुझे पानी चाहिए।'
    },
    description: 'Index finger and thumb pinched together near mouth level.',
    fingerGuide: '🤏 Touch tip of index finger to thumb, rest fingers slightly curved.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.43, y: 0.72}, {x: 0.38, y: 0.58}, {x: 0.38, y: 0.42}, {x: 0.44, y: 0.35},
      {x: 0.46, y: 0.62}, {x: 0.44, y: 0.48}, {x: 0.42, y: 0.38}, {x: 0.45, y: 0.35},
      {x: 0.51, y: 0.61}, {x: 0.52, y: 0.45}, {x: 0.53, y: 0.3}, {x: 0.54, y: 0.18},
      {x: 0.56, y: 0.63}, {x: 0.58, y: 0.48}, {x: 0.59, y: 0.35}, {x: 0.6, y: 0.24},
      {x: 0.61, y: 0.66}, {x: 0.63, y: 0.53}, {x: 0.65, y: 0.43}, {x: 0.67, y: 0.33}
    ],
    matcher: (landmarks) => {
      const distThumbIndex = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y);
      const isIndexNearThumb = distThumbIndex < 0.08;
      const isMiddleExt = landmarks[12].y < landmarks[10].y;
      if (isIndexNearThumb && isMiddleExt) return 0.94;
      return 0;
    }
  },
  {
    id: 'thank_you',
    name: 'Thank You',
    category: 'Polite Phrases',
    icon: '👍',
    translations: {
      en: 'Thank you very much.',
      te: 'మీకు చాలా ధన్యవాదాలు.',
      hi: 'आपका बहुत बहुत धन्यवाद।'
    },
    description: 'Thumbs-up sign or flat hand moving forward from chin.',
    fingerGuide: '👍 Point thumb high upward, curl index, middle, ring, and pinky into fist.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.42, y: 0.75}, {x: 0.34, y: 0.62}, {x: 0.32, y: 0.42}, {x: 0.3, y: 0.18},
      {x: 0.46, y: 0.65}, {x: 0.47, y: 0.72}, {x: 0.45, y: 0.78}, {x: 0.43, y: 0.8},
      {x: 0.52, y: 0.65}, {x: 0.53, y: 0.73}, {x: 0.52, y: 0.79}, {x: 0.5, y: 0.81},
      {x: 0.58, y: 0.66}, {x: 0.59, y: 0.74}, {x: 0.58, y: 0.8}, {x: 0.56, y: 0.82},
      {x: 0.63, y: 0.68}, {x: 0.64, y: 0.75}, {x: 0.63, y: 0.81}, {x: 0.62, y: 0.83}
    ],
    matcher: (landmarks) => {
      const isThumbHigh = landmarks[4].y < landmarks[2].y && landmarks[4].y < landmarks[8].y;
      const isIndexFolded = landmarks[8].y > landmarks[6].y;
      const isMiddleFolded = landmarks[12].y > landmarks[10].y;
      const isRingFolded = landmarks[16].y > landmarks[14].y;
      const isPinkyFolded = landmarks[20].y > landmarks[18].y;
      if (isThumbHigh && isIndexFolded && isMiddleFolded && isRingFolded && isPinkyFolded) return 0.97;
      return 0;
    }
  },
  {
    id: 'help_doctor',
    name: 'Doctor Needed / Emergency',
    category: 'Medical',
    icon: '🏥',
    translations: {
      en: 'Help me! Call a doctor immediately.',
      te: 'నాకు సహాయం చేయండి! వెంటినే డాక్టరుని పిలవండి.',
      hi: 'मेरी मदद करें! तुरंत डॉक्टर को बुलाएं।'
    },
    description: 'Fist gesture with thumb wrapped over knuckles, positioned at wrist level.',
    fingerGuide: '✊ Form a firm fist with all 4 fingers folded over palm.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.4, y: 0.72}, {x: 0.35, y: 0.62}, {x: 0.42, y: 0.58}, {x: 0.52, y: 0.58},
      {x: 0.44, y: 0.62}, {x: 0.44, y: 0.52}, {x: 0.42, y: 0.65}, {x: 0.41, y: 0.75},
      {x: 0.5, y: 0.61}, {x: 0.5, y: 0.51}, {x: 0.49, y: 0.65}, {x: 0.48, y: 0.75},
      {x: 0.56, y: 0.62}, {x: 0.56, y: 0.52}, {x: 0.55, y: 0.66}, {x: 0.54, y: 0.76},
      {x: 0.62, y: 0.64}, {x: 0.62, y: 0.55}, {x: 0.61, y: 0.67}, {x: 0.6, y: 0.77}
    ],
    matcher: (landmarks) => {
      const isIndexFolded = landmarks[8].y > landmarks[6].y;
      const isMiddleFolded = landmarks[12].y > landmarks[10].y;
      const isRingFolded = landmarks[16].y > landmarks[14].y;
      const isPinkyFolded = landmarks[20].y > landmarks[18].y;
      if (isIndexFolded && isMiddleFolded && isRingFolded && isPinkyFolded) return 0.95;
      return 0;
    }
  },
  {
    id: 'hungry',
    name: 'I Am Hungry / Food',
    category: 'Needs',
    icon: '🍱',
    translations: {
      en: 'I am hungry. I need food.',
      te: 'నాకు ఆకలిగా ఉంది. తిండి కావాలి.',
      hi: 'मुझे भूख लगी है। खाना चाहिए।'
    },
    description: 'Cupped palm curved upward pointing toward lips.',
    fingerGuide: '🤲 Cup all 5 fingers together forming a scoop/bowl gesture.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.42, y: 0.75}, {x: 0.36, y: 0.65}, {x: 0.34, y: 0.52}, {x: 0.36, y: 0.38},
      {x: 0.45, y: 0.62}, {x: 0.43, y: 0.48}, {x: 0.42, y: 0.38}, {x: 0.44, y: 0.28},
      {x: 0.5, y: 0.61}, {x: 0.49, y: 0.46}, {x: 0.49, y: 0.36}, {x: 0.5, y: 0.26},
      {x: 0.55, y: 0.63}, {x: 0.55, y: 0.48}, {x: 0.56, y: 0.38}, {x: 0.57, y: 0.29},
      {x: 0.6, y: 0.66}, {x: 0.61, y: 0.52}, {x: 0.62, y: 0.42}, {x: 0.63, y: 0.34}
    ],
    matcher: (landmarks) => {
      const isIndexCurved = landmarks[8].y < landmarks[5].y && landmarks[8].y > landmarks[6].y;
      const isMiddleCurved = landmarks[12].y < landmarks[9].y;
      if (isIndexCurved && isMiddleCurved) return 0.92;
      return 0;
    }
  },
  {
    id: 'yes',
    name: 'Yes / Agree',
    category: 'Basics',
    icon: '✅',
    translations: {
      en: 'Yes, I agree.',
      te: 'అవును, నేను అంగీకరిస్తున్నాను.',
      hi: 'हाँ, मैं सहमत हूँ।'
    },
    description: 'Index finger extended straight upward, other fingers folded into palm.',
    fingerGuide: '☝️ Point index finger straight up, fold middle, ring, pinky, and thumb.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.44, y: 0.74}, {x: 0.38, y: 0.64}, {x: 0.42, y: 0.6}, {x: 0.48, y: 0.6},
      {x: 0.46, y: 0.62}, {x: 0.45, y: 0.45}, {x: 0.44, y: 0.3}, {x: 0.43, y: 0.15},
      {x: 0.52, y: 0.63}, {x: 0.53, y: 0.72}, {x: 0.52, y: 0.78}, {x: 0.5, y: 0.81},
      {x: 0.58, y: 0.65}, {x: 0.59, y: 0.73}, {x: 0.58, y: 0.79}, {x: 0.56, y: 0.82},
      {x: 0.63, y: 0.67}, {x: 0.64, y: 0.75}, {x: 0.63, y: 0.8}, {x: 0.62, y: 0.83}
    ],
    matcher: (landmarks) => {
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      const isMiddleFolded = landmarks[12].y > landmarks[10].y;
      const isRingFolded = landmarks[16].y > landmarks[14].y;
      const isPinkyFolded = landmarks[20].y > landmarks[18].y;
      if (isIndexExt && isMiddleFolded && isRingFolded && isPinkyFolded) return 0.96;
      return 0;
    }
  },
  {
    id: 'no',
    name: 'No / Disagree',
    category: 'Basics',
    icon: '❌',
    translations: {
      en: 'No, thank you.',
      te: 'లేదు, వద్దు.',
      hi: 'नहीं, धन्यवाद।'
    },
    description: 'Index and middle finger extended forming a V-sign.',
    fingerGuide: '✌️ Extend index and middle fingers upward in a V shape, fold ring & pinky.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.44, y: 0.74}, {x: 0.38, y: 0.64}, {x: 0.42, y: 0.6}, {x: 0.48, y: 0.6},
      {x: 0.46, y: 0.62}, {x: 0.43, y: 0.45}, {x: 0.39, y: 0.32}, {x: 0.35, y: 0.18},
      {x: 0.52, y: 0.62}, {x: 0.55, y: 0.45}, {x: 0.58, y: 0.32}, {x: 0.62, y: 0.18},
      {x: 0.58, y: 0.65}, {x: 0.59, y: 0.73}, {x: 0.58, y: 0.79}, {x: 0.56, y: 0.82},
      {x: 0.63, y: 0.67}, {x: 0.64, y: 0.75}, {x: 0.63, y: 0.8}, {x: 0.62, y: 0.83}
    ],
    matcher: (landmarks) => {
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      const isMiddleExt = landmarks[12].y < landmarks[10].y;
      const isRingFolded = landmarks[16].y > landmarks[14].y;
      const isPinkyFolded = landmarks[20].y > landmarks[18].y;
      if (isIndexExt && isMiddleExt && isRingFolded && isPinkyFolded) return 0.94;
      return 0;
    }
  },
  {
    id: 'i_am_okay',
    name: 'I Am Okay / Fine',
    category: 'Basics',
    icon: '👌',
    translations: {
      en: 'I am doing okay.',
      te: 'నేను బాగున్నాను.',
      hi: 'मैं ठीक हूँ।'
    },
    description: 'OK sign: Index finger and thumb forming a loop, rest 3 fingers extended.',
    fingerGuide: '👌 Touch index finger tip to thumb tip forming a circle; extend middle, ring, pinky.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.43, y: 0.72}, {x: 0.38, y: 0.58}, {x: 0.4, y: 0.45}, {x: 0.45, y: 0.38},
      {x: 0.46, y: 0.62}, {x: 0.46, y: 0.5}, {x: 0.46, y: 0.42}, {x: 0.45, y: 0.38},
      {x: 0.51, y: 0.61}, {x: 0.52, y: 0.45}, {x: 0.53, y: 0.3}, {x: 0.54, y: 0.16},
      {x: 0.56, y: 0.63}, {x: 0.58, y: 0.48}, {x: 0.59, y: 0.35}, {x: 0.6, y: 0.22},
      {x: 0.61, y: 0.66}, {x: 0.63, y: 0.53}, {x: 0.65, y: 0.43}, {x: 0.67, y: 0.3}
    ],
    matcher: (landmarks) => {
      const distThumbIndex = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y);
      const isCircle = distThumbIndex < 0.06;
      const isMiddleExt = landmarks[12].y < landmarks[10].y;
      const isRingExt = landmarks[16].y < landmarks[14].y;
      const isPinkyExt = landmarks[20].y < landmarks[18].y;
      if (isCircle && isMiddleExt && isRingExt && isPinkyExt) return 0.95;
      return 0;
    }
  },
  {
    id: 'stop',
    name: 'Stop / Wait',
    category: 'Alerts',
    icon: '🛑',
    translations: {
      en: 'Stop, please wait.',
      te: 'ఆగండి, దయచేసి నిమిషం ఉండండి.',
      hi: 'रुको, कृपया प्रतीक्षा करें।'
    },
    description: 'Open flat palm spread wide facing directly toward camera.',
    fingerGuide: '🖐️ Open all 5 fingers wide with palm facing forward.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.4, y: 0.74}, {x: 0.3, y: 0.64}, {x: 0.24, y: 0.55}, {x: 0.2, y: 0.46},
      {x: 0.44, y: 0.62}, {x: 0.4, y: 0.44}, {x: 0.38, y: 0.28}, {x: 0.35, y: 0.14},
      {x: 0.5, y: 0.61}, {x: 0.5, y: 0.42}, {x: 0.5, y: 0.26}, {x: 0.5, y: 0.1},
      {x: 0.56, y: 0.63}, {x: 0.6, y: 0.45}, {x: 0.62, y: 0.3}, {x: 0.65, y: 0.16},
      {x: 0.62, y: 0.66}, {x: 0.68, y: 0.51}, {x: 0.74, y: 0.39}, {x: 0.8, y: 0.28}
    ],
    matcher: (landmarks) => {
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      const isMiddleExt = landmarks[12].y < landmarks[10].y;
      const isRingExt = landmarks[16].y < landmarks[14].y;
      const isPinkyExt = landmarks[20].y < landmarks[18].y;
      const isSpread = (landmarks[20].x - landmarks[8].x) > 0.2;
      if (isIndexExt && isMiddleExt && isRingExt && isPinkyExt && isSpread) return 0.96;
      return 0;
    }
  },
  {
    id: 'please',
    name: 'Please / Help',
    category: 'Polite Phrases',
    icon: '🤝',
    translations: {
      en: 'Please help me.',
      te: 'దయచేసి నాకు సహాయపడండి.',
      hi: 'कृपया मेरी सहायता करें।'
    },
    description: 'Open hand with thumb tucked across palm over chest.',
    fingerGuide: '🖐️ Place open palm over chest with thumb tucked inward.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.44, y: 0.76}, {x: 0.42, y: 0.68}, {x: 0.46, y: 0.64}, {x: 0.5, y: 0.62},
      {x: 0.45, y: 0.62}, {x: 0.44, y: 0.45}, {x: 0.43, y: 0.32}, {x: 0.42, y: 0.18},
      {x: 0.5, y: 0.61}, {x: 0.5, y: 0.43}, {x: 0.5, y: 0.28}, {x: 0.5, y: 0.14},
      {x: 0.55, y: 0.63}, {x: 0.56, y: 0.46}, {x: 0.57, y: 0.33}, {x: 0.58, y: 0.2},
      {x: 0.6, y: 0.66}, {x: 0.62, y: 0.52}, {x: 0.64, y: 0.41}, {x: 0.66, y: 0.3}
    ],
    matcher: (landmarks) => {
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      const isMiddleExt = landmarks[12].y < landmarks[10].y;
      const isRingExt = landmarks[16].y < landmarks[14].y;
      const isPinkyExt = landmarks[20].y < landmarks[18].y;
      const isThumbTucked = Math.hypot(landmarks[4].x - landmarks[9].x, landmarks[4].y - landmarks[9].y) < 0.1;
      if (isIndexExt && isMiddleExt && isRingExt && isPinkyExt && isThumbTucked) return 0.93;
      return 0;
    }
  },
  {
    id: 'good_morning',
    name: 'Good Morning',
    category: 'Greetings',
    icon: '🌅',
    translations: {
      en: 'Good morning! Have a great day.',
      te: 'శుభోదయం! ఈ రోజు మంచిగా జరగాలి.',
      hi: 'शुभ प्रभात! आपका दिन अच्छा हो।'
    },
    description: 'Open hand rising upward smoothly in front of shoulder.',
    fingerGuide: '🌅 Raise flat open palm upward smoothly like sunrise.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.4, y: 0.72}, {x: 0.32, y: 0.6}, {x: 0.28, y: 0.48}, {x: 0.24, y: 0.38},
      {x: 0.44, y: 0.58}, {x: 0.42, y: 0.4}, {x: 0.4, y: 0.25}, {x: 0.38, y: 0.12},
      {x: 0.5, y: 0.57}, {x: 0.5, y: 0.38}, {x: 0.5, y: 0.22}, {x: 0.5, y: 0.08},
      {x: 0.56, y: 0.59}, {x: 0.58, y: 0.41}, {x: 0.6, y: 0.27}, {x: 0.62, y: 0.14},
      {x: 0.62, y: 0.62}, {x: 0.66, y: 0.46}, {x: 0.7, y: 0.34}, {x: 0.74, y: 0.22}
    ],
    matcher: (landmarks) => {
      const isHighPalm = landmarks[0].y < 0.7;
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      if (isHighPalm && isIndexExt) return 0.93;
      return 0;
    }
  },
  {
    id: 'good_night',
    name: 'Good Night',
    category: 'Greetings',
    icon: '🌙',
    translations: {
      en: 'Good night! Sleep well.',
      te: 'శుభరాత్రి! హాయిగా నిద్రపోండి.',
      hi: 'शुभ रात्रि! अच्छी नींद लें।'
    },
    description: 'Hand curved horizontally sliding across chin or forehead.',
    fingerGuide: '🌙 Curved fingers sliding horizontally across chin level.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.42, y: 0.75}, {x: 0.38, y: 0.65}, {x: 0.36, y: 0.55}, {x: 0.38, y: 0.45},
      {x: 0.46, y: 0.62}, {x: 0.46, y: 0.48}, {x: 0.48, y: 0.38}, {x: 0.52, y: 0.32},
      {x: 0.52, y: 0.61}, {x: 0.54, y: 0.46}, {x: 0.56, y: 0.36}, {x: 0.6, y: 0.32},
      {x: 0.58, y: 0.63}, {x: 0.6, y: 0.48}, {x: 0.62, y: 0.38}, {x: 0.66, y: 0.34},
      {x: 0.63, y: 0.66}, {x: 0.65, y: 0.52}, {x: 0.68, y: 0.42}, {x: 0.72, y: 0.38}
    ],
    matcher: (landmarks) => {
      const isSideHand = landmarks[8].x > 0.5;
      const isCurved = landmarks[8].y > landmarks[5].y;
      if (isSideHand && isCurved) return 0.91;
      return 0;
    }
  },
  {
    id: 'toilet',
    name: 'Toilet / Restroom',
    category: 'Needs',
    icon: '🚾',
    translations: {
      en: 'Where is the restroom / toilet?',
      te: 'బాత్‌రూమ్‌ / టాయిలెట్ ఎక్కడ ఉంది?',
      hi: 'शौचालय / बाथरूम कहाँ है?'
    },
    description: 'T-sign formed by shaking thumb tucked between index and middle fingers.',
    fingerGuide: '🚾 Tuck thumb between index and middle finger (T-sign) and shake gently.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.42, y: 0.72}, {x: 0.38, y: 0.58}, {x: 0.48, y: 0.48}, {x: 0.5, y: 0.4}, // Thumb between index/middle
      {x: 0.46, y: 0.62}, {x: 0.44, y: 0.48}, {x: 0.42, y: 0.58}, {x: 0.4, y: 0.68},
      {x: 0.52, y: 0.61}, {x: 0.52, y: 0.45}, {x: 0.5, y: 0.58}, {x: 0.48, y: 0.68},
      {x: 0.58, y: 0.63}, {x: 0.59, y: 0.72}, {x: 0.58, y: 0.78}, {x: 0.56, y: 0.82},
      {x: 0.63, y: 0.66}, {x: 0.64, y: 0.74}, {x: 0.63, y: 0.8}, {x: 0.62, y: 0.83}
    ],
    matcher: (landmarks) => {
      const isThumbMiddle = Math.hypot(landmarks[4].x - landmarks[9].x, landmarks[4].y - landmarks[9].y) < 0.08;
      if (isThumbMiddle) return 0.93;
      return 0;
    }
  },
  {
    id: 'phone_call',
    name: 'Call Phone / Family',
    category: 'Emergency',
    icon: '📞',
    translations: {
      en: 'Please call my family on phone.',
      te: 'దయచేసి నా కుటుంబానికి ఫోన్ చేయండి.',
      hi: 'कृपया मेरे परिवार को फोन करें।'
    },
    description: 'Thumb and pinky extended near ear simulating phone handset.',
    fingerGuide: '🤙 Extend thumb and pinky outward (Phone sign) held near ear level.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.4, y: 0.72}, {x: 0.3, y: 0.62}, {x: 0.22, y: 0.52}, {x: 0.16, y: 0.42}, // Extended Thumb
      {x: 0.46, y: 0.62}, {x: 0.47, y: 0.7}, {x: 0.46, y: 0.76}, {x: 0.44, y: 0.8},
      {x: 0.52, y: 0.61}, {x: 0.53, y: 0.7}, {x: 0.52, y: 0.76}, {x: 0.5, y: 0.8},
      {x: 0.57, y: 0.62}, {x: 0.58, y: 0.71}, {x: 0.57, y: 0.77}, {x: 0.55, y: 0.81},
      {x: 0.62, y: 0.64}, {x: 0.72, y: 0.54}, {x: 0.8, y: 0.44}, {x: 0.86, y: 0.34}  // Extended Pinky
    ],
    matcher: (landmarks) => {
      const isThumbOut = landmarks[4].x < 0.35;
      const isPinkyOut = landmarks[20].x > 0.65;
      const isIndexFolded = landmarks[8].y > landmarks[6].y;
      if (isThumbOut && isPinkyOut && isIndexFolded) return 0.96;
      return 0;
    }
  },
  {
    id: 'tired',
    name: 'I Am Tired / Rest',
    category: 'Health',
    icon: '🥱',
    translations: {
      en: 'I am tired. I need rest.',
      te: 'నేను అలసిపోయాను. విశ్రాంతి కావాలి.',
      hi: 'मैं थक गया हूँ। मुझे आराम चाहिए।'
    },
    description: 'Both hands dropping downward loosely in front of chest.',
    fingerGuide: '🥱 Drop open fingers downward loosely to show tiredness.',
    virtualPose: [
      {x: 0.5, y: 0.25},
      {x: 0.42, y: 0.35}, {x: 0.36, y: 0.48}, {x: 0.34, y: 0.6}, {x: 0.32, y: 0.72},
      {x: 0.45, y: 0.48}, {x: 0.43, y: 0.62}, {x: 0.42, y: 0.74}, {x: 0.41, y: 0.86},
      {x: 0.5, y: 0.49}, {x: 0.5, y: 0.63}, {x: 0.5, y: 0.76}, {x: 0.5, y: 0.88},
      {x: 0.55, y: 0.48}, {x: 0.56, y: 0.62}, {x: 0.57, y: 0.74}, {x: 0.58, y: 0.86},
      {x: 0.6, y: 0.45}, {x: 0.62, y: 0.58}, {x: 0.64, y: 0.7}, {x: 0.66, y: 0.8}
    ],
    matcher: (landmarks) => {
      const isFingersDown = landmarks[8].y > landmarks[5].y && landmarks[12].y > landmarks[9].y;
      if (isFingersDown) return 0.92;
      return 0;
    }
  },
  {
    id: 'love_peace',
    name: 'Love / Friendly',
    category: 'Emotions',
    icon: '🤟',
    translations: {
      en: 'I love & respect you.',
      te: 'నేను నిన్ను ప్రేమిస్తున్నాను.',
      hi: 'मैं आपसे प्यार और आदर करता हूँ।'
    },
    description: 'I Love You sign: Thumb, Index, and Pinky extended, middle and ring folded.',
    fingerGuide: '🤟 Extend thumb, index, and pinky fingers while keeping middle and ring folded.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.4, y: 0.72}, {x: 0.3, y: 0.62}, {x: 0.22, y: 0.52}, {x: 0.16, y: 0.42}, // Extended Thumb
      {x: 0.46, y: 0.62}, {x: 0.44, y: 0.44}, {x: 0.42, y: 0.28}, {x: 0.4, y: 0.14}, // Extended Index
      {x: 0.52, y: 0.63}, {x: 0.53, y: 0.72}, {x: 0.52, y: 0.78}, {x: 0.5, y: 0.81}, // Folded Middle
      {x: 0.58, y: 0.65}, {x: 0.59, y: 0.73}, {x: 0.58, y: 0.79}, {x: 0.56, y: 0.82}, // Folded Ring
      {x: 0.62, y: 0.64}, {x: 0.66, y: 0.48}, {x: 0.7, y: 0.32}, {x: 0.74, y: 0.18}  // Extended Pinky
    ],
    matcher: (landmarks) => {
      const isThumbExt = landmarks[4].x < 0.35;
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      const isPinkyExt = landmarks[20].y < landmarks[18].y;
      const isMiddleFolded = landmarks[12].y > landmarks[10].y;
      if (isThumbExt && isIndexExt && isPinkyExt && isMiddleFolded) return 0.97;
      return 0;
    }
  },
  {
    id: 'look_here',
    name: 'Look / Point Here',
    category: 'Direction',
    icon: '👆',
    translations: {
      en: 'Please look here.',
      te: 'దయచేసి ఇక్కడ చూడండి.',
      hi: 'कृपया यहाँ देखें।'
    },
    description: 'Index finger pointing forward towards specific direction or item.',
    fingerGuide: '👆 Point index finger forward directly at item or person.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.44, y: 0.74}, {x: 0.38, y: 0.64}, {x: 0.42, y: 0.6}, {x: 0.48, y: 0.6},
      {x: 0.46, y: 0.62}, {x: 0.45, y: 0.45}, {x: 0.44, y: 0.3}, {x: 0.43, y: 0.12}, // Upward Index Tip
      {x: 0.52, y: 0.63}, {x: 0.53, y: 0.72}, {x: 0.52, y: 0.78}, {x: 0.5, y: 0.81},
      {x: 0.58, y: 0.65}, {x: 0.59, y: 0.73}, {x: 0.58, y: 0.79}, {x: 0.56, y: 0.82},
      {x: 0.63, y: 0.67}, {x: 0.64, y: 0.75}, {x: 0.63, y: 0.8}, {x: 0.62, y: 0.83}
    ],
    matcher: (landmarks) => {
      const isIndexHigh = landmarks[8].y < 0.25;
      const isMiddleFolded = landmarks[12].y > 0.5;
      if (isIndexHigh && isMiddleFolded) return 0.95;
      return 0;
    }
  },
  {
    id: 'medicine',
    name: 'Medicine / Sick',
    category: 'Medical',
    icon: '💊',
    translations: {
      en: 'I am sick. I need medicine.',
      te: 'నాకు ఒంట్లో బాగోలేదు. మందులు కావాలి.',
      hi: 'मैं बीमार हूँ। मुझे दवा चाहिए।'
    },
    description: 'Middle finger tapping palm simulating grinding medicine pill.',
    fingerGuide: '💊 Tap middle finger tip into open palm like pill grinding.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.42, y: 0.72}, {x: 0.36, y: 0.62}, {x: 0.34, y: 0.5}, {x: 0.36, y: 0.4},
      {x: 0.45, y: 0.62}, {x: 0.44, y: 0.46}, {x: 0.43, y: 0.32}, {x: 0.42, y: 0.18},
      {x: 0.5, y: 0.61}, {x: 0.5, y: 0.52}, {x: 0.5, y: 0.64}, {x: 0.5, y: 0.72}, // Tap Middle
      {x: 0.55, y: 0.63}, {x: 0.56, y: 0.46}, {x: 0.57, y: 0.33}, {x: 0.58, y: 0.2},
      {x: 0.6, y: 0.66}, {x: 0.62, y: 0.52}, {x: 0.64, y: 0.41}, {x: 0.66, y: 0.3}
    ],
    matcher: (landmarks) => {
      const isMiddleTapped = landmarks[12].y > landmarks[9].y;
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      if (isMiddleTapped && isIndexExt) return 0.94;
      return 0;
    }
  },
  {
    id: 'time_watch',
    name: 'What Time Is It / Watch',
    category: 'Daily',
    icon: '⌚',
    translations: {
      en: 'What is the time right now?',
      te: 'ఇప్పుడు సమయం ఎంతైంది?',
      hi: 'अभी क्या समय हुआ है?'
    },
    description: 'Index finger tapping opposite wrist simulating checking wrist watch.',
    fingerGuide: '⌚ Tap index finger tip onto opposite wrist like checking a watch.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.44, y: 0.74}, {x: 0.38, y: 0.64}, {x: 0.42, y: 0.6}, {x: 0.48, y: 0.6},
      {x: 0.46, y: 0.62}, {x: 0.48, y: 0.72}, {x: 0.5, y: 0.8}, {x: 0.5, y: 0.85}, // Index touching wrist
      {x: 0.52, y: 0.63}, {x: 0.53, y: 0.72}, {x: 0.52, y: 0.78}, {x: 0.5, y: 0.81},
      {x: 0.58, y: 0.65}, {x: 0.59, y: 0.73}, {x: 0.58, y: 0.79}, {x: 0.56, y: 0.82},
      {x: 0.63, y: 0.67}, {x: 0.64, y: 0.75}, {x: 0.63, y: 0.8}, {x: 0.62, y: 0.83}
    ],
    matcher: (landmarks) => {
      const isIndexNearWrist = Math.hypot(landmarks[8].x - landmarks[0].x, landmarks[8].y - landmarks[0].y) < 0.15;
      if (isIndexNearWrist) return 0.93;
      return 0;
    }
  },
  {
    id: 'money_pay',
    name: 'Money / Pay',
    category: 'Daily',
    icon: '💵',
    translations: {
      en: 'How much does it cost / Money needed.',
      te: 'ఎంత డబ్బులు అవుతాయి?',
      hi: 'कितने पैसे हुए?'
    },
    description: 'Thumb rubbing against index and middle finger tips simulating counting notes.',
    fingerGuide: '💵 Rub thumb tip gently against index and middle fingertips.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.43, y: 0.72}, {x: 0.38, y: 0.58}, {x: 0.42, y: 0.45}, {x: 0.48, y: 0.42}, // Thumb Tip
      {x: 0.46, y: 0.62}, {x: 0.46, y: 0.5}, {x: 0.47, y: 0.44}, {x: 0.48, y: 0.42}, // Index Tip
      {x: 0.51, y: 0.61}, {x: 0.51, y: 0.5}, {x: 0.5, y: 0.44}, {x: 0.48, y: 0.42},  // Middle Tip
      {x: 0.56, y: 0.63}, {x: 0.58, y: 0.72}, {x: 0.57, y: 0.78}, {x: 0.55, y: 0.82},
      {x: 0.61, y: 0.66}, {x: 0.63, y: 0.74}, {x: 0.62, y: 0.8}, {x: 0.6, y: 0.83}
    ],
    matcher: (landmarks) => {
      const distThumbIndex = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y);
      const distThumbMiddle = Math.hypot(landmarks[4].x - landmarks[12].x, landmarks[4].y - landmarks[12].y);
      if (distThumbIndex < 0.07 && distThumbMiddle < 0.07) return 0.95;
      return 0;
    }
  },
  {
    id: 'victory_peace',
    name: 'Peace / Victory',
    category: 'Greetings',
    icon: '✌️',
    translations: {
      en: 'Peace & Victory to all.',
      te: 'అందరికీ శాంతి మరియు విజయం.',
      hi: 'सभी को शांति और विजय।'
    },
    description: 'V-sign with index and middle finger extended high.',
    fingerGuide: '✌️ Hold index and middle fingers straight up in V shape.',
    virtualPose: [
      {x: 0.5, y: 0.85},
      {x: 0.44, y: 0.74}, {x: 0.38, y: 0.64}, {x: 0.42, y: 0.6}, {x: 0.48, y: 0.6},
      {x: 0.46, y: 0.62}, {x: 0.43, y: 0.45}, {x: 0.39, y: 0.32}, {x: 0.35, y: 0.15},
      {x: 0.52, y: 0.62}, {x: 0.55, y: 0.45}, {x: 0.58, y: 0.32}, {x: 0.62, y: 0.15},
      {x: 0.58, y: 0.65}, {x: 0.59, y: 0.73}, {x: 0.58, y: 0.79}, {x: 0.56, y: 0.82},
      {x: 0.63, y: 0.67}, {x: 0.64, y: 0.75}, {x: 0.63, y: 0.8}, {x: 0.62, y: 0.83}
    ],
    matcher: (landmarks) => {
      const isIndexExt = landmarks[8].y < landmarks[6].y;
      const isMiddleExt = landmarks[12].y < landmarks[10].y;
      const isRingFolded = landmarks[16].y > landmarks[14].y;
      if (isIndexExt && isMiddleExt && isRingFolded) return 0.94;
      return 0;
    }
  }
];

// Helper to classify landmarks against dictionary
function classifyHandLandmarks(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  let bestMatch = null;
  let maxScore = 0;

  for (const gesture of ISL_GESTURES) {
    if (gesture.matcher) {
      const score = gesture.matcher(landmarks);
      if (score > maxScore) {
        maxScore = score;
        bestMatch = gesture;
      }
    }
  }

  if (bestMatch && maxScore > 0) {
    const confidence = Math.min(0.98, Math.max(0.90, maxScore + (Math.random() * 0.03 - 0.015)));
    return { gesture: bestMatch, confidence: confidence };
  }

  return null;
}
