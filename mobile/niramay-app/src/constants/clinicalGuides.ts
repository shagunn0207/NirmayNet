export interface GuideStepData {
  stepNumber: number;
  totalSteps: number;
  icon: string;
  instruction: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  subInstruction: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
}

export interface ConditionGuide {
  id: string;
  title: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  category: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  icon: string;
  steps: GuideStepData[];
}

export const CLINICAL_GUIDES: ConditionGuide[] = [
  {
    id: 'breathlessness_pregnancy',
    icon: '🤰',
    category: {
      en: 'Breathlessness — Pregnancy',
      mr: 'श्वास घेण्यास त्रास — गर्भावस्था',
      hi: 'सांस लेने में तकलीफ — गर्भावस्था',
      kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ — ಗರ್ಭಧಾರಣೆ',
    },
    title: {
      en: 'Breathlessness (Pregnancy)',
      mr: 'श्वासोच्छवास त्रास (गर्भावस्था)',
      hi: 'सांस लेने में कठिनाई (गर्भावस्था)',
      kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ (ಗರ್ಭಧಾರಣೆ)',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🛌',
        instruction: {
          en: 'Keep patient lying on LEFT side',
          mr: 'रुग्णाला डाव्या कुशीवर झोपवून ठेवा',
          hi: 'मरीज़ को बाईं करवट लिटाकर रखें',
          kn: 'ರೋಗಿಯನ್ನು ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿಸಿ',
        },
        subInstruction: {
          en: 'Elevate head slightly and keep airway clear for proper breathing.',
          mr: 'डोके थोडे वर करा आणि श्वास घेण्यास अडथळा होणार नाही याची दक्षता घ्या.',
          hi: 'सिर थोड़ा ऊपर उठाएं और सांस का मार्ग साफ रखें।',
          kn: 'ತಲೆಯನ್ನು ಸ್ವಲ್ಪ ಎತ್ತರಿಸಿ ಮತ್ತು ಶ್ವಾಸಕೋಶದ ಹಾದಿಯನ್ನು ಸ್ವಚ್ಛವಾಗಿರಿಸಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '👕',
        instruction: {
          en: 'Loosen any tight clothing around chest and waist',
          mr: 'छाती आणि कमरेभोवतीचे घट्ट कपडे सैल करा',
          hi: 'सीने और कमर के आसपास के तंग कपड़े ढीले करें',
          kn: 'ಎದೆ ಮತ್ತು ಸೊಂಟದ ಸುತ್ತಲಿನ ಬಿಗಿಯಾದ ಬಟ್ಟೆಗಳನ್ನು ಸಡಿಲಗೊಳಿಸಿ',
        },
        subInstruction: {
          en: 'Ensure patient can breathe freely without any tight chest constriction.',
          mr: 'रुग्णाला मोकळेपणाने श्वास घेता येईल याची खात्री करा.',
          hi: 'सुनिश्चित करें कि मरीज बिना किसी जकड़न के स्वतंत्र रूप से सांस ले सके।',
          kn: 'ರೋಗಿಯು ಮುಕ್ತವಾಗಿ ಉಸಿರಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '🚫',
        instruction: {
          en: 'Do NOT give food or water',
          mr: 'अन्न किंवा पाणी अजिबात देऊ नका',
          hi: 'खाना या पानी बिल्कुल न दें',
          kn: 'ಆಹಾರ ಅಥವಾ ನೀರನ್ನು ಕೊಡಬೇಡಿ',
        },
        subInstruction: {
          en: 'Prevents choking or aspiration risk during severe breathing distress.',
          mr: 'तीव्र श्वासोच्छवासाच्या त्रासात घशात अन्न-पाणी अडकण्याचा धोका टाळण्यासाठी.',
          hi: 'सांस की गंभीर समस्या में गले में खाना अटकने से बचाएं।',
          kn: 'ಉಸಿರಾಟದ ತೊಂದರೆಯ ಸಮಯದಲ್ಲಿ ಗಂಟಲಿನಲ್ಲಿ ಆಹಾರ ಸಿಲುಕಿಕೊಳ್ಳುವುದನ್ನು ತಡೆಯಿರಿ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '⏱️',
        instruction: {
          en: 'Check breathing rate every 2 minutes — count breaths',
          mr: 'दर २ मिनिटांनी श्वासोच्छवास तपासा — श्वास मोजा',
          hi: 'हर 2 मिनट में सांस की दर जांचें — सांसें गिनें',
          kn: 'ಪ್ರತಿ 2 ನಿಮಿಷಗಳಿಗೊಮ್ಮೆ ಉಸಿರಾಟದ ದರವನ್ನು ಪರಿಶೀಲಿಸಿ — ಎಣಿಸಿ',
        },
        subInstruction: {
          en: 'Monitor chest rise and fall accurately to track respiratory rate.',
          mr: 'छातीची हालचाल पाहून दर मिनिटाचा श्वास मोजा आणि नोंद ठेवा.',
          hi: 'छाती की हलचल देखकर प्रति मिनट सांसों की गिनती करें।',
          kn: 'ಪ್ರತಿ ನಿಮಿಷದ ಉಸಿರಾಟದ ಎಣಿಕೆಯನ್ನು ನಿಖರವಾಗಿ ಗಮನಿಸಿ.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🚑',
        instruction: {
          en: 'Stay with patient until ambulance arrives',
          mr: 'रुग्णवाहिका येईपर्यंत रुग्णासोबत राहा',
          hi: 'एम्बुलेंस आने तक मरीज़ के पास ही रहें',
          kn: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಬರುವವರೆಗೆ ರೋಗಿಯ ಜೊತೆಗಿರಿ',
        },
        subInstruction: {
          en: 'Provide continuous reassurance and keep emergency medical team updated.',
          mr: 'रुग्णाला धीर द्या आणि रुग्णवाहिका पथकाशी सतत संपर्कात राहा.',
          hi: 'मरीज़ को सांत्वना दें और आपातकालीन टीम को अपडेट रखें।',
          kn: 'ರೋಗಿಗೆ ಧೈರ್ಯ ನೀಡಿ ಮತ್ತು ವೈದ್ಯಕೀಯ ತಂಡದೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ.',
        },
      },
    ],
  },
  {
    id: 'high_fever_child',
    icon: '👶',
    category: {
      en: 'High Fever — Child (Under 5)',
      mr: 'तीव्र ताप — बालक (५ वर्षांखालील)',
      hi: 'तेज बुखार — बच्चा (5 वर्ष से कम)',
      kn: 'ಹೆಚ್ಚಿನ ಜ್ವರ — ಮಗು (5 ವರ್ಷದೊಳಗಿನ)',
    },
    title: {
      en: 'High Fever (Child Under 5)',
      mr: 'तीव्र ताप (५ वर्षांखालील बालक)',
      hi: 'तेज बुखार (5 साल से कम बच्चा)',
      kn: 'ತೀವ್ರ ಜ್ವರ (5 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ಮಗು)',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '👕',
        instruction: {
          en: 'Remove excess clothing from child',
          mr: 'बालकाच्या अंगावरील अतिरिक्त कपडे काढा',
          hi: 'बच्चे के शरीर से अतिरिक्त कपड़े हटाएं',
          kn: 'ಮಗುವಿನ ಮೇಲಿನ ಹೆಚ್ಚುವರಿ ಬಟ್ಟೆಗಳನ್ನು ತೆಗೆಯಿರಿ',
        },
        subInstruction: {
          en: 'Allow heat to dissipate safely from the child’s body.',
          mr: 'शरीरातील उष्णता सहज बाहेर पडू द्या.',
          hi: 'शरीर की गर्मी को आसानी से बाहर निकलने दें।',
          kn: 'ದೇಹದಿಂದ ಶಾಖವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಹೊರಹಾಕಲು ಅನುಮತಿಸಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '💧',
        instruction: {
          en: 'Apply a damp cloth to forehead — not ice',
          mr: 'कपाळावर ओल्या कपड्याची पट्टी ठेवा — बर्फ नको',
          hi: 'माथे पर गीली पट्टी लगाएं — बर्फ नहीं',
          kn: 'ಹಣೆಯ ಮೇಲೆ ಒದ್ದೆಯಾದ ಬಟ್ಟೆಯನ್ನು ಇಡಿ — ಮಂಜುಗಡ್ಡೆ ಬೇಡ',
        },
        subInstruction: {
          en: 'Use room temperature water to cool forehead and wrists gently.',
          mr: 'साध्या पाण्याच्या पट्ट्या कपाळ आणि हातावर ठेवा.',
          hi: 'सामान्य पानी की पट्टियों से माथा और कलाइयां ठंडी करें।',
          kn: 'ಸಾಮಾನ್ಯ ನೀರಿನ ಬಟ್ಟೆಯಿಂದ ತಲೆಯನ್ನು ತಂಪಾಗಿಸಿ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '🥤',
        instruction: {
          en: 'Give ORS if child can drink and is conscious',
          mr: 'बालक शुद्धीवर असल्यास ORS द्या',
          hi: 'बच्चा होश में हो तो ORS दें',
          kn: 'ಮಗು ಪ್ರಜ್ಞೆಯಲ್ಲಿದ್ದರೆ ORS ನೀಡಿ',
        },
        subInstruction: {
          en: 'Maintains hydration and essential electrolyte balance.',
          mr: 'शरीरातील पाण्याचे प्रमाण आणि क्षार संतुलित राहण्यास मदत होते.',
          hi: 'शरीर में पानी और लवण का संतुलन बनाए रखने में मदद मिलती है।',
          kn: 'ದೇಹದ ನೀರಿನ ಪ್ರಮಾಣವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '💊',
        instruction: {
          en: 'Do NOT give aspirin to children',
          mr: 'लहान मुलांना अस्पिरीन औषध अजिबात देऊ नका',
          hi: 'छोटे बच्चों को एस्पिरिन की दवा बिल्कुल न दें',
          kn: 'ಮಕ್ಕಳಿಗೆ ಆಸ್ಪಿರಿನ್ ಔಷಧಿಯನ್ನು ಕೊಡಬೇಡಿ',
        },
        subInstruction: {
          en: 'Aspirin in young children can cause dangerous side effects.',
          mr: 'अस्पिरीनमुळे बालकांमध्ये गंभीर दुष्परिणाम होऊ शकतात.',
          hi: 'बच्चों में एस्पिरिन से गंभीर नुकसान हो सकता है।',
          kn: 'ಚಿಕ್ಕ ಮಕ್ಕಳಲ್ಲಿ ಆಸ್ಪಿರಿನ್ ಅಪಾಯಕಾರಿ ಅಡ್ಡಪರಿಣಾಮ ಬೀರಬಹುದು.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '⚡',
        instruction: {
          en: 'Monitor for convulsions — note time if they occur',
          mr: 'झटके (फिट्स) येतात का यावर लक्ष ठेवा',
          hi: 'दौरे (फिट्स) पर नज़र रखें — समय नोट करें',
          kn: 'ಫಿಟ್ಸ್ ಬರುವುದೇ ಗಮನಿಸಿ — ಸಮಯ ನೋಟ್ ಮಾಡಿ',
        },
        subInstruction: {
          en: 'Watch for sudden stiffness or twitching and inform doctor immediately.',
          mr: 'शरीर ताठ झाल्यास किंवा झटके आल्यास वेळ नोंदवून डॉक्टरांना सांगा.',
          hi: 'शरीर में अकड़न आने पर समय नोट कर डॉक्टर को सूचित करें।',
          kn: 'ದೇಹದಲ್ಲಿ ಹಠಾತ್ ಬಿಗಿತ ಕಾಣಿಸಿಕೊಂಡರೆ ಸಮಯವನ್ನು ದಾಖಲಿಸಿ.',
        },
      },
    ],
  },
  {
    id: 'convulsions_any_age',
    icon: '⚡',
    category: {
      en: 'Convulsions — Any Age',
      mr: 'झटके (फिट्स) — कोणत्याही वयात',
      hi: 'दौरे (फिट्स) — किसी भी उम्र में',
      kn: 'ಫಿಟ್ಸ್ — ಯಾವುದೇ ವಯಸ್ಸಿನಲ್ಲಿ',
    },
    title: {
      en: 'Convulsions (Fits / Seizures)',
      mr: 'झटके (फिट्स / मिरगी)',
      hi: 'दौरे (फिट्स / मिर्गी)',
      kn: 'ಫಿಟ್ಸ್ (ಅಪಸ್ಮಾರ)',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🛡️',
        instruction: {
          en: 'Move patient away from hard objects immediately',
          mr: 'रुग्णाला कठीण वस्तूंपासून ताबडतोब दूर करा',
          hi: 'मरीज़ को तुरंत कठोर वस्तुओं से दूर करें',
          kn: 'ರೋಗಿಯನ್ನು ತಕ್ಷಣ ಗಟ್ಟಿಯಾದ ವಸ್ತುಗಳಿಂದ ದೂರ ಸರಿಸಿ',
        },
        subInstruction: {
          en: 'Clear surrounding area to prevent head or physical injury.',
          mr: 'डोक्याला किंवा शरीराला दुखापत होणार नाही याची काळजी घ्या.',
          hi: 'सिर या शरीर को चोट लगने से बचाने के लिए आसपास की जगह साफ करें।',
          kn: 'ತಲೆಗೆ ಅಥವಾ ದೇಹಕ್ಕೆ ಗಾಯವಾಗದಂತೆ ಸುತ್ತಲಿನ ಜಾಗವನ್ನು ತೆರವುಗೊಳಿಸಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '🛌',
        instruction: {
          en: 'Place patient on their side — never on their back',
          mr: 'रुग्णाला कुशीवर झोपवा — पाठीवर कधीही नको',
          hi: 'मरीज़ को करवट से लिटाएं — पीठ के बल कभी नहीं',
          kn: 'ರೋಗಿಯನ್ನು ಮಲಗಿಸಿ — ಬೆನ್ನಿನ ಮೇಲೆ ಮಲಗಿಸಬೇಡಿ',
        },
        subInstruction: {
          en: 'Keeps airway open and allows fluids to drain safely.',
          mr: 'श्वासमार्ग मोकळा राहातो आणि लाळ बाहेर पडू शकते.',
          hi: 'सांस की नली खुली रहती है और लार बाहर निकल सकती है।',
          kn: 'ಉಸಿರಾಟದ ಹಾದಿ ಮುಕ್ತವಾಗಿರುತ್ತದೆ ಮತ್ತು ಜೊಲ್ಲು ಸುರಕ್ಷಿತವಾಗಿ ಹರಿಯುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '🚫',
        instruction: {
          en: 'Do NOT put anything in patient’s mouth',
          mr: 'पाटी किंवा तोंडात काहीही घालू नका',
          hi: 'मरीज़ के मुंह में कुछ भी न डालें',
          kn: 'ರೋಗಿಯ ಬಾಯಿಯಲ್ಲಿ ಏನನ್ನೂ ಇಡಬೇಡಿ',
        },
        subInstruction: {
          en: 'Never insert spoons, cloth, or fingers into teeth or mouth.',
          mr: 'चमचा, कापड किंवा बोटे तोंडात अजिबात घालू नका.',
          hi: 'चम्मच, कपड़ा या उंगलियां मुंह में कभी न डालें।',
          kn: 'ಚಮಚ, ಬಟ್ಟೆ ಅಥವಾ ಬೆರಳುಗಳನ್ನು ಬಾಯಿಯಲ್ಲಿ ಇಡಬೇಡಿ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '⏱️',
        instruction: {
          en: 'Note the time the convulsion started',
          mr: 'झटका सुरू झाल्याची वेळ नोंदवा',
          hi: 'दौरा शुरू होने का समय नोट करें',
          kn: 'ಫಿಟ್ಸ್ ಪ್ರಾರಂಭವಾದ ಸಮಯವನ್ನು ನೋಟ್ ಮಾಡಿ',
        },
        subInstruction: {
          en: 'Record exact duration to inform attending medical personnel.',
          mr: 'झटका किती वेळ चालला याची अचूक वेळ डॉक्टरांना सांगा.',
          hi: 'दौरा कितनी देर चला इसकी सटीक जानकारी डॉक्टर को दें।',
          kn: 'ಫಿಟ್ಸ್ ಎಷ್ಟು ಸಮಯ ಇತ್ತು ಎಂಬುದನ್ನು ವೈದ್ಯರಿಗೆ ತಿಳಿಸಿ.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🤝',
        instruction: {
          en: 'Stay with patient — convulsion usually stops in 2 minutes',
          mr: 'रुग्णाजवळ राहा — झटका सहसा २ मिनिटांत थांबतो',
          hi: 'मरीज़ के पास रहें — दौरा आमतौर पर 2 मिनट में रुकता है',
          kn: 'ರೋಗಿಯ ಜೊತೆಗಿರಿ — ಫಿಟ್ಸ್ ಸಾಮಾನ್ಯವಾಗಿ 2 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಲ್ಲುತ್ತದೆ',
        },
        subInstruction: {
          en: 'Remain calm and keep patient protected until seizure resolves.',
          mr: 'शांत राहा आणि झटका थांबेपर्यंत रुग्णाचे रक्षण करा.',
          hi: 'शांत रहें और दौरा ठीक होने तक मरीज की देखभाल करें।',
          kn: 'ಶಾಂತವಾಗಿರಿ ಮತ್ತು ರೋಗಿಗೆ ರಕ್ಷಣೆ ನೀಡಿ.',
        },
      },
    ],
  },
  {
    id: 'severe_bleeding',
    icon: '🩸',
    category: {
      en: 'Severe Bleeding',
      mr: 'तीव्र रक्तस्राव',
      hi: 'गंभीर रक्तस्राव',
      kn: 'ತೀವ್ರ ರಕ್ತಸ್ರಾವ',
    },
    title: {
      en: 'Severe Bleeding Management',
      mr: 'तीव्र रक्तस्राव व्यवस्थापन',
      hi: 'गंभीर रक्तस्राव प्रबंधन',
      kn: 'ತೀವ್ರ ರಕ್ತಸ್ರಾವ ನಿರ್ವಹಣೆ',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🩹',
        instruction: {
          en: 'Apply firm pressure on wound with clean cloth',
          mr: 'स्वच्छ कपड्याने जखमेवर जोरात दाब द्या',
          hi: 'साफ कपड़े से घाव पर तेज़ दबाव डालें',
          kn: 'ಬಟ್ಟೆಯಿಂದ ಗಾಯದ ಮೇಲೆ ಬಿಗಿಯಾದ ಒತ್ತಡ ಹೇರಿ',
        },
        subInstruction: {
          en: 'Hold direct continuous pressure using a clean fabric or bandage.',
          mr: 'रक्तस्राव थांबेपर्यंत स्वच्छ कापडाने दाबून ठेवा.',
          hi: 'खून बहना रुकने तक साफ कपड़े से दबाकर रखें।',
          kn: 'ರಕ್ತಸ್ರಾವ ನಿಲ್ಲುವವರೆಗೆ ಸ್ವಚ್ಛ ಬಟ್ಟೆಯಿಂದ ಒತ್ತಿ ಹಿಡಿಯಿರಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '➕',
        instruction: {
          en: 'Do NOT remove cloth — add more on top if soaked',
          mr: 'कापड काढू नका — ओले झाल्यास त्यावर दुसरे कापड टाका',
          hi: 'कपड़ा न हटाएं — भीगने पर उसके ऊपर और कपड़ा लगाएं',
          kn: 'ಬಟ್ಟೆಯನ್ನು ತೆಗೆಯಬೇಡಿ — ನೆನೆದರೆ ಅದರ ಮೇಲೆ ಮತ್ತೊಂದು ಬಟ್ಟೆ ಇಡಿ',
        },
        subInstruction: {
          en: 'Removing initial cloth disrupts crucial blood clot formation.',
          mr: 'पहिले कापड काढल्याने रक्ताची गुठळी तयार होण्यात अडथळा येतो.',
          hi: 'पहला कपड़ा हटाने से थक्का बनने की प्रक्रिया रुक जाती है।',
          kn: 'ಮೊದಲ ಬಟ್ಟೆಯನ್ನು ತೆಗೆದರೆ ರಕ್ತ ಹೆಪ್ಪುಗಟ್ಟುವಿಕೆ ಅಡಚಣೆಯಾಗುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '⬆️',
        instruction: {
          en: 'Keep injured part raised above heart level if possible',
          mr: 'शक्य असल्यास दुखापत झालेला भाग हृदयाच्या पातळीवर वर करा',
          hi: 'संभव हो तो ज़ख्मी हिस्से को दिल के स्तर से ऊपर उठाएं',
          kn: 'ಸಾಧ್ಯವಾದರೆ ಗಾಯಗೊಂಡ ಭಾಗವನ್ನು ಹೃದಯದ ಮಟ್ಟಕ್ಕಿಂತ ಎತ್ತರದಲ್ಲಿರಿಸಿ',
        },
        subInstruction: {
          en: 'Reduces blood flow and hydrostatic pressure at wound site.',
          mr: 'जखमेच्या ठिकाणी रक्ताचा प्रवाह कमी होण्यास मदत होते.',
          hi: 'घाव की जगह पर खून का बहाव कम करने में मदद मिलती है।',
          kn: 'ಗಾಯದ ಜಾಗಕ್ಕೆ ರಕ್ತದ ಹರಿವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ನೆರವಾಗುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '⚠️',
        instruction: {
          en: 'Do NOT apply tourniquet unless trained',
          mr: 'प्रशिक्षित नसल्यास आवळपट्टी (टूर्निकेट) बांधू नका',
          hi: 'प्रशिक्षित न होने पर टूर्निकेट (पट्टी) न बांधें',
          kn: 'ತರಬೇತಿ ಪಡೆಯದಿದ್ದರೆ ಬ್ಯಾಂಡೇಜ್ ಅನ್ನು ಬಿಗಿಯಾಗಿ ಕಟ್ಟಬೇಡಿ',
        },
        subInstruction: {
          en: 'Improper tourniquet use can cause severe tissue damage.',
          mr: 'चुकीच्या पद्धतीमुळे अवयवाला कायमची दुखापत होऊ शकते.',
          hi: 'गलत तरीके से बांधने पर अंग को नुकसान पहुंच सकता है।',
          kn: 'ತಪ್ಪಾದ ವಿಧಾನವು ಅಂಗಾಂಶಗಳಿಗೆ ತೀವ್ರ ಹಾನಿಯನ್ನುಂಟುಮಾಡುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🧥',
        instruction: {
          en: 'Keep patient warm and calm until help arrives',
          mr: 'मदत येईपर्यंत रुग्णाला उबदार ठेवा आणि शांत करा',
          hi: 'मदद आने तक मरीज़ को गर्म और शांत रखें',
          kn: 'ಸಹಾಯ ಬರುವವರೆಗೆ ರೋಗಿಯನ್ನು ಬೆಚ್ಚಗೆ ಮತ್ತು ಶಾಂತವಾಗಿರಿಸಿ',
        },
        subInstruction: {
          en: 'Cover with blanket to prevent shock and body temperature drop.',
          mr: 'रुग्णाला धक्का बसू नये म्हणून पांघरूण घाला.',
          hi: 'शॉक से बचाने के लिए मरीज़ को कंबल से ढकें।',
          kn: 'ಶಾಕ್ ತಡೆಯಲು ರೋಗಿಗೆ ಹೊದಿಕೆಯನ್ನು ಹೊದಿಸಿ.',
        },
      },
    ],
  },
  {
    id: 'unresponsive_patient',
    icon: '🚨',
    category: {
      en: 'Unresponsive Patient',
      mr: 'अचेत / प्रतिसाद न देणारा रुग्ण',
      hi: 'बेहोश / प्रतिक्रिया न देने वाला मरीज़',
      kn: 'ಪ್ರತಿಕ್ರಿಯಿಸದ ರೋಗಿ',
    },
    title: {
      en: 'Unresponsive Patient Emergency',
      mr: 'अचेत रुग्ण आपत्कालीन उपाय',
      hi: 'बेहोश मरीज आपातकालीन कदम',
      kn: 'ಪ್ರತಿಕ್ರಿಯಿಸದ ರೋಗಿಯ ತುರ್ತು ಕ್ರಮಗಳು',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🗣️',
        instruction: {
          en: 'Tap shoulders firmly and call patient’s name loudly',
          mr: 'खांदे हलवून मोठ्याने रुग्णाचे नाव पुकारा',
          hi: 'कंधे हिलाकर तेज़ आवाज़ में मरीज़ का नाम पुकारें',
          kn: 'ಹೆಗಲುಗಳನ್ನು ತಟ್ಟಿ ರೋಗಿಯ ಹೆಸರನ್ನು ಜೋರಾಗಿ ಕರೆ ಮಾಡಿ',
        },
        subInstruction: {
          en: 'Check for immediate verbal response or movement.',
          mr: 'रुग्ण प्रतिसाद देतो का ते ताबडतोब तपासा.',
          hi: 'जांचें कि मरीज़ कोई प्रतिक्रिया दे रहा है या नहीं।',
          kn: 'ರೋಗಿಯು ತಕ್ಷಣ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತಾನೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '🫁',
        instruction: {
          en: 'Check if patient is breathing — look for chest movement',
          mr: 'श्वास चालू आहे का तपासा — छातीची हालचाल पहा',
          hi: 'जांचें कि सांस चल रही है — सीने की हलचल देखें',
          kn: 'ಉಸಿರಾಟ ನಡೆಯುತ್ತಿದೆಯೇ ಪರೀಕ್ಷಿಸಿ — ಎದೆಯ ಚಲನೆಯನ್ನು ನೋಡಿ',
        },
        subInstruction: {
          en: 'Observe chest for 10 seconds for normal breathing movement.',
          mr: '१० सेकंद छाती वर-खाली होते का ते लक्षपूर्वक पहा.',
          hi: '10 सेकंड तक छाती की हलचल को ध्यान से देखें।',
          kn: '10 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಎದೆಯ ಉಸಿರಾಟದ ಚಲನೆಯನ್ನು ಗಮನಿಸಿ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '🫀',
        instruction: {
          en: 'If not breathing, begin CPR if trained',
          mr: 'श्वास बंद असल्यास प्रशिक्षित असल्यास CPR सुरू करा',
          hi: 'सांस न चल रही हो और प्रशिक्षित हों तो CPR शुरू करें',
          kn: 'ಉಸಿರಾಟವಿಲ್ಲದಿದ್ದರೆ, ತರಬೇತಿ ಪಡೆದಿದ್ದರೆ CPR ಪ್ರಾರಂಭಿಸಿ',
        },
        subInstruction: {
          en: 'Perform chest compressions at a steady fast rhythm.',
          mr: 'छातीवर मध्यभागी योग्य गतीने दाब द्या.',
          hi: 'सीने के बीच में सही गति से दबाव दें।',
          kn: 'ಎದೆಯ ಮಧ್ಯಭಾಗದಲ್ಲಿ ಸ್ಥಿರವಾದ ವೇಗದಲ್ಲಿ ಒತ್ತಡ ಹಾಕಿ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '🛌',
        instruction: {
          en: 'If breathing, place in recovery position on side',
          mr: 'श्वास चालू असल्यास रिकव्हरी पोझिशनमध्ये कुशीवर झोपवा',
          hi: 'सांस चल रही हो तो रिकवरी पोजीशन में करवट से लिटाएं',
          kn: 'ಉಸಿರಾಟವಿದ್ದರೆ, ಪಕ್ಕಕ್ಕೆ ಮಲಗಿಸುವ ಸ್ಥಾನದಲ್ಲಿಡಿ',
        },
        subInstruction: {
          en: 'Roll patient onto side to keep airway safe and open.',
          mr: 'श्वासमार्ग सुरक्षित ठेवण्यासाठी रुग्णाला एका बाजूला करा.',
          hi: 'सांस की नली सुरक्षित रखने के लिए मरीज को करवट दिलाएं।',
          kn: 'ಉಸಿರಾಟದ ಮಾರ್ಗವನ್ನು ಮುಕ್ತವಾಗಿಡಲು ಬದಿಗೆ ತಿರುಗಿಸಿ.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '📞',
        instruction: {
          en: 'Do not leave patient alone — send someone for help',
          mr: 'रुग्णाला एकटे सोडू नका — मदतीसाठी दुसऱ्या कोणाला पाठवा',
          hi: 'मरीज़ को अकेला न छोड़ें — मदद के लिए किसी को भेजें',
          kn: 'ರೋಗಿಯನ್ನು ಒಬ್ಬಂಟಿಯಾಗಿ ಬಿಡಬೇಡಿ — ಸಹಾಯಕ್ಕಾಗಿ ಯಾರನ್ನಾದರೂ ಕಳುಹಿಸಿ',
        },
        subInstruction: {
          en: 'Keep monitoring patient while calling 108 ambulance urgently.',
          mr: 'रुग्णावर लक्ष ठेवून १०८ रुग्णवाहिकेला तात्काळ बोलवा.',
          hi: 'मरीज पर नज़र रखते हुए 108 एम्बुलेंस तुरंत बुलाएं।',
          kn: '108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ತಕ್ಷಣ ಕರೆ ಮಾಡುವಾಗ ರೋಗಿಯನ್ನು ಗಮನಿಸಿ.',
        },
      },
    ],
  },
  {
    id: 'severe_dehydration',
    icon: '🥤',
    category: {
      en: 'Severe Dehydration / Diarrhoea',
      mr: 'तीव्र निर्जलीकरण / जुलाब',
      hi: 'गंभीर निर्जलीकरण / दस्त',
      kn: 'ತೀವ್ರ ನಿರ್ಜಲೀಕರಣ / ಭೇದಿ',
    },
    title: {
      en: 'Severe Dehydration Management',
      mr: 'तीव्र निर्जलीकरण व्यवस्थापन',
      hi: 'गंभीर निर्जलीकरण प्रबंधन',
      kn: 'ತೀವ್ರ ನಿರ್ಜಲೀಕರಣ ನಿರ್ವಹಣೆ',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '💧',
        instruction: {
          en: 'Prepare fresh ORS solution in 1 litre clean water',
          mr: '१ लिटर स्वच्छ उकळलेल्या पाण्यात ORS द्रावण तयार करा',
          hi: '1 लीटर साफ उबले पानी में ORS घोल तैयार करें',
          kn: '1 ಲೀಟರ್ ಸ್ವಚ್ಛ ನೀರಿನಲ್ಲಿ ORS ದ್ರಾವಣವನ್ನು ತಯಾರಿಸಿ',
        },
        subInstruction: {
          en: 'Ensure proper measurement and clean mixing container.',
          mr: 'योग्य प्रमाणात स्वच्छ भांड्यात ORS विरघळवून घ्या.',
          hi: 'सही मात्रा में साफ बर्तन में ORS घोलें।',
          kn: 'ಸರಿಯಾದ ಪ್ರಮಾಣದಲ್ಲಿ ORS ಕರಗಿಸಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '🥛',
        instruction: {
          en: 'Give small sips continuously after every loose stool',
          mr: 'प्रत्येक जुलाबानंतर घोट घोट ORS सतत पाजा',
          hi: 'हर दस्त के बाद थोड़ा-थोड़ा ORS लगातार पिलाएं',
          kn: 'ಪ್ರತಿ ಭೇದಿಯ ನಂತರ ಸಣ್ಣ ಪ್ರಮಾಣದ ORS ನೀಡಿ',
        },
        subInstruction: {
          en: 'Prevents sudden fluid loss and electrolyte depletion.',
          mr: 'शरीरातील पाण्याचे प्रमाण कमी होण्यापासून वाचवते.',
          hi: 'शरीर में पानी की कमी होने से बचाता है।',
          kn: 'ದೇಹದಲ್ಲಿ ನೀರು ಕಡಿಮೆಯಾಗುವುದನ್ನು ತಡೆಯುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '🍼',
        instruction: {
          en: 'Continue breastfeeding for infants under 6 months',
          mr: '६ महिन्यांखालील बालकांसाठी स्तनपान सुरू ठेवा',
          hi: '6 महीने से छोटे बच्चों को स्तनपान जारी रखें',
          kn: '6 ತಿಂಗಳೊಳಗಿನ ಮಕ್ಕಳಿಗೆ ಎದೆಹಾಲು ಮುಂದುವರಿಸಿ',
        },
        subInstruction: {
          en: 'Breastmilk provides essential nutrients and antibodies.',
          mr: 'आईचे दूध बालकास रोगप्रतिकारशक्ती आणि पोषण देते.',
          hi: 'मां का दूध बच्चे को पोषण और सुरक्षा देता है।',
          kn: 'ಎದೆಹಾಲು ಅಗತ್ಯ ಪೋಷಕಾಂಶಗಳನ್ನು ನೀಡುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '🚫',
        instruction: {
          en: 'Do NOT give anti-diarrhoeal medicines to children',
          mr: 'लहान मुलांना जुलाब थांबवण्याची औषधे अजिबात देऊ नका',
          hi: 'बच्चों को दस्त रोकने की दवाएं बिल्कुल न दें',
          kn: 'ಮಕ್ಕಳಿಗೆ ಭೇದಿ ನಿಲ್ಲಿಸುವ ಔಷಧಿಗಳನ್ನು ಕೊಡಬೇಡಿ',
        },
        subInstruction: {
          en: 'Anti-motility drugs can be harmful to young children.',
          mr: 'ही औषधे बालकांसाठी धोकादायक ठरू शकतात.',
          hi: 'ये दवाएं बच्चों के लिए हानिकारक हो सकती हैं।',
          kn: 'ಈ ಔಷಧಿಗಳು ಮಕ್ಕಳಿಗೆ ಹಾನಿಕಾರಕವಾಗಬಹುದು.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🏥',
        instruction: {
          en: 'Monitor for lethargy or no urine for 6 hours',
          mr: 'सुस्तपणा किंवा ६ तास लघवी न झाल्यास PHC ला न्या',
          hi: 'सुस्ती या 6 घंटे पेशाब न होने पर PHC ले जाएं',
          kn: '6 ಗಂಟೆಗಳ ಕಾಲ ಮೂತ್ರ ವಿಸರ್ಜನೆಯಾಗದಿದ್ದರೆ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ',
        },
        subInstruction: {
          en: 'Requires urgent IV fluids from medical officer.',
          mr: 'वैद्यकीय अधिकाऱ्यांकडून तातडीने सलाईन लावायची गरज भासू शकते.',
          hi: 'डॉक्टर द्वारा तुरंत सलाइन लगाने की आवश्यकता हो सकती है।',
          kn: 'ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿದೆ.',
        },
      },
    ],
  },
  {
    id: 'snakebite_emergency',
    icon: '🐍',
    category: {
      en: 'Snakebite Emergency',
      mr: 'सर्पदंश आपत्कालीन',
      hi: 'सांप काटने पर आपातकाल',
      kn: 'ಹಾವು ಕಡಿತ ತುರ್ತು',
    },
    title: {
      en: 'Snakebite Emergency Response',
      mr: 'सर्पदंश प्रथमोपचार',
      hi: 'सांप काटने का प्राथमिक उपचार',
      kn: 'ಹಾವು ಕಡಿತ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🧘',
        instruction: {
          en: 'Keep patient calm and immobilize bitten limb',
          mr: 'रुग्णाला शांत करा आणि चावलेला भाग अजिबात हालवू नका',
          hi: 'मरीज़ को शांत रखें और काटे गए अंग को स्थिर रखें',
          kn: 'ರೋಗಿಯನ್ನು ಶಾಂತವಾಗಿರಿಸಿ ಮತ್ತು ಗಾಯಗೊಂಡ ಭಾಗವನ್ನು ಕದಲಿಸಬೇಡಿ',
        },
        subInstruction: {
          en: 'Slowing movement delays venom absorption into circulation.',
          mr: 'हालचाल थांबवल्याने विष शरीरात पसरण्याचा वेग मंदावतो.',
          hi: 'हलचल रोकने से ज़हर फैलने की गति धीमी होती है।',
          kn: 'ಚಲನೆಯನ್ನು ತಡೆದರೆ ವಿಷ ಹರಡುವುದು ನಿಧಾನವಾಗುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '🚫',
        instruction: {
          en: 'Do NOT cut, suck, or apply ice to wound',
          mr: 'जखमेवर काप देऊ नका, चोखू नका किंवा बर्फ लावू नका',
          hi: 'घाव पर चीरा न लगाएं, न चूसें और न बर्फ लगाएं',
          kn: 'ಗಾಯವನ್ನು ಕತ್ತರಿಸಬೇಡಿ, ಹೀ ರಬೇಡಿ ಅಥವಾ ಮಂಜುಗಡ್ಡೆ ಇಡಬೇಡಿ',
        },
        subInstruction: {
          en: 'Cutting or sucking worsens tissue damage and infection.',
          mr: 'यामुळे संसर्ग वाढतो आणि ऊतींचे नुकसान होते.',
          hi: 'इससे संक्रमण और नुकसान बढ़ सकता है।',
          kn: 'ಇದು ಸೋಂಕನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '⚠️',
        instruction: {
          en: 'Do NOT apply tight tourniquets or native medicines',
          mr: 'घट्ट पट्टी बांधू नका आणि जडीबुटी लावू नका',
          hi: 'कसी हुई पट्टी न बांधें और जड़ी-बूटी न लगाएं',
          kn: 'ಬಿಗಿಯಾದ ಪಟ್ಟಿಯನ್ನು ಕಟ್ಟಬೇಡಿ',
        },
        subInstruction: {
          en: 'Tight bands block arterial blood flow leading to gangrene.',
          mr: 'घट्ट पट्टीमुळे अवयव कायमचा खराब होऊ शकतो.',
          hi: 'तंग पट्टी से अंग हमेशा के लिए खराब हो सकता है।',
          kn: 'ಬಿಗಿಯಾದ ಬ್ಯಾಂಡೇಜ್ ಅಂಗಾಂಶಗಳಿಗೆ ಹಾನಿ ಉಂಟುಮಾಡುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '🐍',
        instruction: {
          en: 'Note snake appearance and time of bite safely',
          mr: 'सापाचा रंग/प्रकार आणि चावल्याची वेळ लक्षात ठेवा',
          hi: 'सांप का रंग/प्रकार और काटने का समय नोट करें',
          kn: 'ಹಾವಿನ ಬಣ್ಣ ಮತ್ತು ಕಡಿದ ಸಮಯವನ್ನು ನೋಟ್ ಮಾಡಿ',
        },
        subInstruction: {
          en: 'Do NOT attempt to catch or kill the snake.',
          mr: 'सापाला पकडण्याचा किंवा मारण्याचा प्रयत्न करू नका.',
          hi: 'सांप को पकड़ने या मारने की कोशिश न करें।',
          kn: 'ಹಾವನ್ನು ಹಿಡಿಯಲು ಪ್ರಯತ್ನಿಸಬೇಡಿ.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🏥',
        instruction: {
          en: 'Transport immediately to anti-venom health center',
          mr: 'एंटी-वेनम (ASV) उपलब्ध असलेल्या केंद्रात तातडीने न्या',
          hi: 'एंटी-वेनम उपलब्ध स्वास्थ्य केंद्र में तुरंत ले जाएं',
          kn: 'ಆಂಟಿ-ವೆನಮ್ ಲಭ್ಯವಿರುವ ಆಸ್ಪತ್ರೆಗೆ ತಕ್ಷಣ ಕರೆದೊಯ್ಯಿರಿ',
        },
        subInstruction: {
          en: 'Antivenom is the only effective treatment for venomous bite.',
          mr: 'सर्पदंशावर केवळ एंटी-वेनम लस हेच प्रभावी औषध आहे.',
          hi: 'सांप के ज़हर का एकमात्र इलाज एंटी-वेनम ही है।',
          kn: 'ಆಂಟಿ-ವೆನಮ್ ಮಾತ್ರ ಪರಿಣಾಮಕಾರಿ ಚಿಕಿತ್ಸೆಯಾಗಿದೆ.',
        },
      },
    ],
  },
  {
    id: 'heatstroke_sunstroke',
    icon: '☀️',
    category: {
      en: 'Heatstroke / Sunstroke',
      mr: 'उष्माघात / उन्हाचा झटका',
      hi: 'लू लगना / हीटस्ट्रोक',
      kn: 'ಬಿಸಿಲ ಬೇಗೆ / ಹೀಟ್‌ಸ್ಟ್ರೋಕ್',
    },
    title: {
      en: 'Heatstroke Management',
      mr: 'उष्माघात प्रथमोपचार',
      hi: 'हीटस्ट्रोक का प्राथमिक उपचार',
      kn: 'ಹೀಟ್‌ಸ್ಟ್ರೋಕ್ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🌳',
        instruction: {
          en: 'Move patient to cool shaded ventilated area',
          mr: 'रुग्णाला ताबडतोब सावलीत, थंड हवेच्या ठिकाणी न्या',
          hi: 'मरीज़ को तुरंत छायादार, ठंडी हवा वाली जगह ले जाएं',
          kn: 'ರೋಗಿಯನ್ನು ತಕ್ಷಣ ತಂಪಾದ ನೆರಳಿರುವ ಜಾಗಕ್ಕೆ ಕರೆದೊಯ್ಯಿರಿ',
        },
        subInstruction: {
          en: 'Stop direct exposure to hot sun and heat waves.',
          mr: 'उन्हाचा थेट संपर्क त्वरित थांबवा.',
          hi: 'धूप के सीधे संपर्क को तुरंत रोकें।',
          kn: 'ನೇರ ಬಿಸಿಲಿನ ಸಂಪರ್ಕವನ್ನು ತಡೆಯಿರಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '🌀',
        instruction: {
          en: 'Remove extra clothing and fan patient continuously',
          mr: 'जाड कपडे काढा आणि सतत वारा घाला',
          hi: 'कपड़े ढीले करें और लगातार हवा करें',
          kn: 'ಹೆಚ್ಚುವರಿ ಬಟ್ಟೆಗಳನ್ನು ತೆಗೆದು ಗಾಳಿ ಹಾಕಿ',
        },
        subInstruction: {
          en: 'Accelerates cooling through air circulation.',
          mr: 'हवेच्या प्रवाहाने शरीराचे तापमान कमी होण्यास मदत होते.',
          hi: 'हवा के प्रवाह से शरीर ठंडा होता है।',
          kn: 'ಗಾಳಿಯ ಹರಿವಿನಿಂದ ತಾಪಮಾನ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '💧',
        instruction: {
          en: 'Sponge whole body with cool water cloth',
          mr: 'थंड पाण्याच्या पट्ट्यांनी संपूर्ण अंग पुसून घ्या',
          hi: 'ठंडे पानी की पट्टियों से पूरा शरीर पोंछें',
          kn: 'ತಂಪಾದ ನೀರಿನಿಂದ ಇಡೀ ದೇಹವನ್ನು ಒರೆಸಿ',
        },
        subInstruction: {
          en: 'Apply wet towels to neck, armpits, and groin.',
          mr: 'मान, काख आणि पायांच्या सांध्यावर ओले कपडे ठेवा.',
          hi: 'गर्दन और बगल में गीले तौलिए रखें।',
          kn: 'ಕುತ್ತಿಗೆ ಮತ್ತು ಕಂಕುಳಿನಲ್ಲಿ ಒದ್ದೆ ಬಟ್ಟೆಯನ್ನು ಇಡಿ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '🥛',
        instruction: {
          en: 'Give ORS or salted buttermilk if conscious',
          mr: 'शुद्धीत असल्यास ORS किंवा ताक पाजा',
          hi: 'होश में हो तो ORS या मट्ठा पिलाएं',
          kn: 'ಪ್ರಜ್ಞೆಯಲ್ಲಿದ್ದರೆ ORS ಅಥವಾ ಮಜ್ಜಿಗೆ ನೀಡಿ',
        },
        subInstruction: {
          en: 'Replenishes lost water and sodium levels.',
          mr: 'घामावाटे गेलेले पाणी आणि मीठ भरून निघते.',
          hi: 'पसीने से कम हुआ पानी और नमक पूरा होता है।',
          kn: 'ದೇಹಕ್ಕೆ ನೀರು ಮತ್ತು ಲವಣಾಂಶ ನೀಡುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🚑',
        instruction: {
          en: 'Rush to hospital if temperature stays high',
          mr: 'तापमान कमी न झाल्यास तातडीने रुग्णालयात न्या',
          hi: 'तापमान कम न होने पर तुरंत अस्पताल ले जाएं',
          kn: 'ತಾಪಮಾನ ಕಡಿಮೆಯಾಗದಿದ್ದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ',
        },
        subInstruction: {
          en: 'Severe heatstroke can impair vital internal organs.',
          mr: 'तीव्र उष्माघाताने अवयव निकामी होण्याचा धोका असतो.',
          hi: 'गंभीर हीटस्ट्रोक अंगों को नुकसान पहुंचा सकता है।',
          kn: 'ತೀವ್ರ ಹೀಟ್‌ಸ್ಟ್ರೋಕ್ ಅಪಾಯಕಾರಿಯಾಗಬಹುದು.',
        },
      },
    ],
  },
  {
    id: 'poisoning_ingestion',
    icon: '🧪',
    category: {
      en: 'Poisoning / Chemical Ingestion',
      mr: 'विषबाधा / केमिकल प्राशन',
      hi: 'विषपान / केमिकल निगलना',
      kn: 'ವಿಷಪ್ರಾಶನ / ರಾಸಾಯನಿಕ ಸೇವನೆ',
    },
    title: {
      en: 'Poisoning & Chemical Ingestion',
      mr: 'विषबाधा आपत्कालीन व्यवस्थापन',
      hi: 'विषपान आपातकालीन प्रबंधन',
      kn: 'ವಿಷಪ್ರಾಶನ ತುರ್ತು ನಿರ್ವಹಣೆ',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🔍',
        instruction: {
          en: 'Identify the chemical or poison container safely',
          mr: 'विष किंवा औषधाची बाटली/डबा सुरक्षितपणे ओळखा',
          hi: 'जहर या रसायन के डिब्बे को सुरक्षित रूप से पहचानें',
          kn: 'ವಿಷ ಅಥವಾ ರಾಸಾಯನಿಕದ ಬಾಟಲಿಯನ್ನು ಗುರುತಿಸಿ',
        },
        subInstruction: {
          en: 'Keep container or label to show hospital medical team.',
          mr: 'बाटली किंवा वेष्टन डॉक्टरांना दाखवण्यासाठी सोबत ठेवा.',
          hi: 'डॉक्टर को दिखाने के लिए बोतल या रैपर साथ रखें।',
          kn: 'ವೈದ್ಯರಿಗೆ ತೋರಿಸಲು ಬಾಟಲಿಯನ್ನು ಜೊತೆಯಲ್ಲಿಟ್ಟುಕೊಳ್ಳಿ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '🚫',
        instruction: {
          en: 'Do NOT induce vomiting unless instructed by doctor',
          mr: 'डॉक्टरांच्या सल्ल्याशिवाय उलटी करायचा प्रयत्न करू नका',
          hi: 'डॉक्टर की सलाह के बिना उल्टी कराने की कोशिश न करें',
          kn: 'ವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ವಾಂತಿ ಮಾಡಿಸಬೇಡಿ',
        },
        subInstruction: {
          en: 'Corrosive chemicals can burn oesophagus again during vomiting.',
          mr: 'उलटी करताना केमिकलमुळे अन्ननलिकेला पुन्हा तीव्र दुखापत होऊ शकते.',
          hi: 'उल्टी होने पर रसायन से भोजन नली दोबारा जल सकती है।',
          kn: 'ವಾಂತಿ ಮಾಡಿಸಿದರೆ ಆಹಾರನಾಳವು ಮತ್ತೆ ಸುಡಬಹುದು.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '🧼',
        instruction: {
          en: 'Wash lips and mouth gently with clean water if exposed',
          mr: 'ओठ आणि तोंड स्वच्छ पाण्याने हळूवार धुवून घ्या',
          hi: 'होंठ और मुंह को साफ पानी से धीरे से धोएं',
          kn: 'ತುಟಿ ಮತ್ತು ಬಾಯಿಯನ್ನು ಸ್ವಚ್ಛ ನೀರಿನಿಂದ ತೊಳೆಯಿರಿ',
        },
        subInstruction: {
          en: 'Rinse out chemical residue without swallowing water.',
          mr: 'पाणी पोटात न ढकलत तोंडातील केमिकलचे उर्वरित कण धुवून टाका.',
          hi: 'पानी निगले बिना मुंह का रसायन साफ करें।',
          kn: 'ನೀರನ್ನು ನುಂಗದೆ ಬಾಯಿಯನ್ನು ತೊಳೆಯಿರಿ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 4,
        icon: '🛌',
        instruction: {
          en: 'Keep patient on side if semi-conscious or vomiting',
          mr: 'रुग्ण अर्ध्या शुद्धीत असल्यास त्याला कुशीवर झोपवा',
          hi: 'मरीज़ अर्ध-बेहोश हो तो उसे करवट से लिटाएं',
          kn: 'ರೋಗಿ ಅರೆ-ಪ್ರಜ್ಞಾವಸ್ಥೆಯಲ್ಲಿದ್ದರೆ ಪಕ್ಕಕ್ಕೆ ಮಲಗಿಸಿ',
        },
        subInstruction: {
          en: 'Prevents chemical fluid from choking lungs and respiratory tract.',
          mr: 'केमिकल किंवा लाळ फुफ्फुसात जाण्यापासून बचाव होतो.',
          hi: 'रसायन फेफड़ों में जाने से बचता है।',
          kn: 'ವಿಷಕಾರಿ ದ್ರವ ಶ್ವಾಸಕೋಶಕ್ಕೆ ಹೋಗದಂತೆ ತಡೆಯುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🚑',
        instruction: {
          en: 'Rush to nearest PHC with poison sample immediately',
          mr: 'विषारी पदार्थाच्या नमुन्यासह तातडीने PHC मध्ये न्या',
          hi: 'जहर के नमूने के साथ तुरंत नजदीकी PHC ले जाएं',
          kn: 'ವಿಷದ ಮಾದರಿಯೊಂದಿಗೆ ತಕ್ಷಣ ಹತ್ತಿರದ PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ',
        },
        subInstruction: {
          en: 'Antidotes must be administered as early as possible.',
          mr: 'विषरोधी औषध (Antidote) लवकरात लवकर मिळणे गरजेचे असते.',
          hi: 'एंटीडोट जितनी जल्दी मिले उतना बेहतर होता है।',
          kn: 'ತಕ್ಷಣದ ಆಂಟಿಡೋಟ್ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯ.',
        },
      },
    ],
  },
  {
    id: 'burns_emergency',
    icon: '🔥',
    category: {
      en: 'Severe Burns / Scalds',
      mr: 'तीव्र भाजणे / पोळणे',
      hi: 'गंभीर जलना / झुलसना',
      kn: 'ತೀವ್ರ ಸುಟ್ಟಗಾಯಗಳು',
    },
    title: {
      en: 'Severe Thermal & Chemical Burns',
      mr: 'भाजल्यवर आपत्कालीन प्रथमोपचार',
      hi: 'जलने पर आपातकालीन प्राथमिक उपचार',
      kn: 'ಸುಟ್ಟಗಾಯಗಳ ತುರ್ತು ಚಿಕಿತ್ಸೆ',
    },
    steps: [
      {
        stepNumber: 1,
        totalSteps: 5,
        icon: '🚰',
        instruction: {
          en: 'Cool burn area immediately under clean running water for 15 mins',
          mr: 'भाजलेला भाग १५ मिनिटे सतत वाहत्या स्वच्छ पाण्याखाली ठेवा',
          hi: 'जले हुए हिस्से को 15 मिनट तक बहते ठंडे पानी के नीचे रखें',
          kn: 'ಸುಟ್ಟ ಜಾಗವನ್ನು 15 ನಿಮಿಷಗಳ ಕಾಲ ಹರಿಯುವ ನೀರಿನಲ್ಲಿ ತಂಪಾಗಿಸಿ',
        },
        subInstruction: {
          en: 'Use cool room temperature water — never ice or freezing water.',
          mr: 'साधे थंड पाणी वापरा — बर्फ अजिबात वापरू नका.',
          hi: 'सामान्य ठंडा पानी इस्तेमाल करें — बर्फ बिल्कुल नहीं।',
          kn: 'ಸಾಮಾನ್ಯ ತಣ್ಣೀರನ್ನು ಬಳಸಿ — ಮಂಜುಗಡ್ಡೆ ಬೇಡ.',
        },
      },
      {
        stepNumber: 2,
        totalSteps: 5,
        icon: '🚫',
        instruction: {
          en: 'Do NOT apply toothpaste, oil, ink, or ghee on burn',
          mr: 'जखमेवर टूथपेस्ट, तेल, शाई किंवा तूप अजिबात लावू नका',
          hi: 'जखम पर टूथपेस्ट, तेल, स्याही या घी न लगाएं',
          kn: 'ಸುಟ್ಟ ಗಾಯಕ್ಕೆ ಪೇಸ್ಟ್, ಎಣ್ಣೆ ಅಥವಾ ತುಪ್ಪ ಹಚ್ಚಬೇಡಿ',
        },
        subInstruction: {
          en: 'Home remedies trap heat and cause severe bacterial infection.',
          mr: 'यामुळे उष्णता आत अडकते आणि संसर्ग वाढतो.',
          hi: 'इससे गर्मी अंदर फंस जाती है और इन्फेक्शन होता है।',
          kn: 'ಇದು ಸೋಂಕನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.',
        },
      },
      {
        stepNumber: 3,
        totalSteps: 5,
        icon: '🩹',
        instruction: {
          en: 'Cover loosely with clean dry cloth — do not pop blisters',
          mr: 'स्वच्छ कोरड्या कपड्याने सैल झाका — फोड फोडू नका',
          hi: 'साफ सूखे कपड़े से ढीला ढकें — छाले न फोड़ें',
          kn: 'ಸ್ವಚ್ಛ ಬಟ್ಟೆಯಿಂದ ಸಡಿಲವಾಗಿ ಮುಚ್ಚಿ — ಗುಳ್ಳೆಗಳನ್ನು ಒಡೆಯಬೇಡಿ',
        },
        subInstruction: {
          en: 'Intact blisters protect deep tissue layer from airborne germs.',
          mr: 'फोड न फोडल्यास जंतूसंसर्गापासून नैसर्गिक संरक्षण मिळते.',
          hi: 'छाले न फोड़ने से त्वचा का प्राकृतिक बचाव होता है।',
          kn: 'ಗುಳ್ಳೆಗಳು ಸೋಂಕಿನಿಂದ ರಕ್ಷಿಸುತ್ತವೆ.',
        },
      },
      {
        stepNumber: 4,
        totalSteps: 5,
        icon: '💍',
        instruction: {
          en: 'Remove rings or tight items near burn before swelling',
          mr: 'सूज येण्यापूर्वी अंगावरील अंगठ्या किंवा घट्ट वस्तू काढा',
          hi: 'सूजन आने से पहले अंगूठी या तंग वस्तुएं निकाल लें',
          kn: 'ಊತ ಬರುವ ಮುನ್ನ ಉಂಗುರ ಅಥವಾ ಬಿಗಿಯಾದ ವಸ್ತುಗಳನ್ನು ತೆಗೆಯಿರಿ',
        },
        subInstruction: {
          en: 'Rapid swelling can cut off blood flow to fingers or toes.',
          mr: 'सूज आल्यावर रक्तप्रवाह खंडित होण्याचा धोका असतो.',
          hi: 'सूजन आने पर खून का बहाव रुक सकता है।',
          kn: 'ಊತದಿಂದ ರಕ್ತಸಂಚಾರ ಸ್ಥಗಿತಗೊಳ್ಳಬಹುದು.',
        },
      },
      {
        stepNumber: 5,
        totalSteps: 5,
        icon: '🚑',
        instruction: {
          en: 'Transport to hospital emergency for burn dressing',
          mr: 'ड्रेसिंग आणि उपचारासाठी रुग्णाला तातडीने रुग्णालयात न्या',
          hi: 'ड्रेसिंग और इलाज के लिए मरीज़ को तुरंत अस्पताल ले जाएं',
          kn: 'ಚಿಕಿತ್ಸೆಗೆ ರೋಗಿಯನ್ನು ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ',
        },
        subInstruction: {
          en: 'Requires specialized sterile burn care and pain control.',
          mr: 'वैद्यकीय तज्ज्ञांकडून निर्जंतुक पट्टी आणि वेदनाशामक उपचार आवश्यक.',
          hi: 'डॉक्टर द्वारा स्टेराइल पट्टी और दर्द निवारक इलाज आवश्यक है।',
          kn: 'ವಿಶೇಷ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯ.',
        },
      },
    ],
  },
];
