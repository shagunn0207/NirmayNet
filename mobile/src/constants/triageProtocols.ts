import type { Language } from '../types';

/**
 * Symptom-specific triage protocols based on NHM / WHO / ASHA training guidelines.
 *
 * Each symptom key maps to:
 * - priority: higher = more dangerous, used when merging multiple symptoms
 * - icon: emoji for the offline-guide step card
 * - reason: trilingual urgency reason string
 * - instructions: 4 pre-referral first-aid steps (trilingual)
 */

export interface TriageProtocol {
  priority: number;
  icon: string;
  reason: Record<Language, string>;
  instructions: Record<Language, string[]>;
}

export const TRIAGE_PROTOCOLS: Record<string, TriageProtocol> = {
  breathing: {
    priority: 10,
    icon: '🫁',
    reason: {
      mr: 'श्वास घेण्यास त्रास — वायुमार्ग मोकळा ठेवा',
      hi: 'सांस लेने में तकलीफ — वायुमार्ग खुला रखें',
      en: 'Breathing difficulty — keep airway open',
    },
    instructions: {
      mr: [
        'रुग्णाला बसवा किंवा उशीने आधार द्या — सपाट झोपवू नका',
        'घट्ट कपडे सैल करा (साडीचा पदर, बेल्ट)',
        'दर मिनिटाला श्वासांची संख्या मोजा',
        'ओठ किंवा नखे निळी पडल्यास तातडीने 108 ला कॉल करा',
      ],
      hi: [
        'मरीज़ को बैठाएं या तकिए से सहारा दें — सपाट न लिटाएं',
        'कसे हुए कपड़े ढीले करें (साड़ी का पल्लू, बेल्ट)',
        'हर मिनट सांसों की गिनती करें',
        'होंठ या नाखून नीले पड़ें तो तुरंत 108 पर कॉल करें',
      ],
      en: [
        'Sit patient upright or prop with pillows — do not lay flat',
        'Loosen tight clothing (saree pallu, belt)',
        'Count breaths per minute',
        'If lips or nails turn blue, call 108 immediately',
      ],
    },
  },

  pregnancy: {
    priority: 9,
    icon: '🤰',
    reason: {
      mr: 'गर्भावस्थेतील धोक्याची चिन्हे — तातडीने रुग्णालयात न्या',
      hi: 'गर्भावस्था में खतरे के संकेत — तुरंत अस्पताल ले जाएं',
      en: 'Pregnancy danger signs — transport to hospital immediately',
    },
    instructions: {
      mr: [
        'रुग्णाला डाव्या कुशीवर झोपवा',
        'खाणे-पिणे देऊ नका',
        'बाळाची हालचाल तपासा — हालचाल कमी असल्यास नोंद करा',
        'रक्तस्राव किंवा पाणी गेल्यास स्वच्छ कापड लावा आणि लगेच निघा',
      ],
      hi: [
        'मरीज़ को बाईं करवट लिटाएं',
        'खाना-पानी न दें',
        'बच्चे की हलचल जांचें — कम हो तो नोट करें',
        'खून बहे या पानी आए तो साफ कपड़ा लगाएं और तुरंत निकलें',
      ],
      en: [
        'Lay patient on left side',
        'Do not give food or water',
        'Check fetal movement — note if decreased',
        'If bleeding or water leaks, apply clean cloth and leave immediately',
      ],
    },
  },

  fever: {
    priority: 6,
    icon: '🌡️',
    reason: {
      mr: 'तीव्र ताप — तापमान नियंत्रित करा',
      hi: 'तेज़ बुखार — तापमान नियंत्रित करें',
      en: 'High fever — manage temperature',
    },
    instructions: {
      mr: [
        'कोमट पाण्याने अंग पुसा — थंड पाणी वापरू नका',
        'रुग्ण शुद्धीत असल्यास ORS किंवा पाणी द्या',
        'जाड कपडे-पांघरुणे काढा',
        'दर ३० मिनिटांनी तापमान तपासा',
      ],
      hi: [
        'गुनगुने पानी से शरीर पोंछें — ठंडा पानी न लगाएं',
        'मरीज़ होश में हो तो ORS या पानी दें',
        'भारी कपड़े और कंबल हटाएं',
        'हर 30 मिनट में तापमान जांचें',
      ],
      en: [
        'Sponge body with lukewarm water — do not use cold water',
        'Give ORS or water if patient is conscious',
        'Remove heavy clothing and blankets',
        'Check temperature every 30 minutes',
      ],
    },
  },

  child: {
    priority: 8,
    icon: '👶',
    reason: {
      mr: '५ वर्षांखालील आजारी बालक — धोक्याची चिन्हे तपासा',
      hi: '5 साल से छोटा बीमार बच्चा — खतरे के संकेत जांचें',
      en: 'Sick child under 5 — check for danger signs',
    },
    instructions: {
      mr: [
        'बाळाला उबदार ठेवा — कपड्यात गुंडाळा',
        'स्तनपान सुरू ठेवा किंवा ORS द्या',
        'नाक/वायुमार्ग हळुवार स्वच्छ करा',
        'झटके (आकडी) आल्यास बाजूला वळवा, तोंडात काहीही घालू नका',
      ],
      hi: [
        'बच्चे को गर्म रखें — कपड़े में लपेटें',
        'स्तनपान जारी रखें या ORS दें',
        'नाक/वायुमार्ग धीरे से साफ करें',
        'दौरे आएं तो करवट पर लिटाएं, मुंह में कुछ न डालें',
      ],
      en: [
        'Keep child warm — wrap in cloth',
        'Continue breastfeeding or give ORS',
        'Gently clear nose and airway',
        'If convulsions occur, turn on side — do not put anything in mouth',
      ],
    },
  },

  headache: {
    priority: 5,
    icon: '🤕',
    reason: {
      mr: 'तीव्र डोकेदुखी — स्ट्रोक / मेंदूज्वराचा धोका',
      hi: 'तीव्र सिरदर्द — स्ट्रोक / मेनिनजाइटिस का खतरा',
      en: 'Severe headache — stroke / meningitis risk',
    },
    instructions: {
      mr: [
        'रुग्णाला अंधाऱ्या, शांत खोलीत झोपवा',
        'ऍस्पिरिन / कोणतेही औषध देऊ नका',
        'दर ५ मिनिटांनी शुद्धी तपासा — बोलतो का, नाव सांगतो का',
        'डोकेदुखी सुरू झाल्याची वेळ नोंद करा',
      ],
      hi: [
        'मरीज़ को अंधेरे, शांत कमरे में लिटाएं',
        'एस्पिरिन / कोई भी दवा न दें',
        'हर 5 मिनट में होश जांचें — बोल रहा है, नाम बता रहा है',
        'सिरदर्द शुरू होने का समय नोट करें',
      ],
      en: [
        'Lay patient in a quiet, dark room',
        'Do not give aspirin or any medication',
        'Check consciousness every 5 minutes — is patient responsive?',
        'Note the time headache started',
      ],
    },
  },

  weakness: {
    priority: 4,
    icon: '💪',
    reason: {
      mr: 'तीव्र अशक्तपणा — रक्तक्षय / हायपोग्लायसेमियाचा धोका',
      hi: 'गंभीर कमज़ोरी — एनीमिया / हाइपोग्लाइसीमिया का खतरा',
      en: 'Severe weakness — anaemia / hypoglycaemia risk',
    },
    instructions: {
      mr: [
        'रुग्णाला झोपवा, पाय किंचित वर करा',
        'शुद्धीत असल्यास ORS किंवा साखरेचे पाणी द्या',
        'एकट्या सोडू नका — पडण्याचा धोका',
        'नाडी तपासा — खूप हळू किंवा वेगवान असल्यास नोंद करा',
      ],
      hi: [
        'मरीज़ को लिटाएं, पैर थोड़े ऊपर करें',
        'होश में हो तो ORS या शक्कर का पानी दें',
        'अकेला न छोड़ें — गिरने का खतरा',
        'नब्ज़ जांचें — बहुत धीमी या तेज़ हो तो नोट करें',
      ],
      en: [
        'Lay patient down, slightly elevate legs',
        'Give ORS or sugar water if conscious',
        'Do not leave unattended — fall risk',
        'Check pulse — note if very slow or very fast',
      ],
    },
  },

  vomiting: {
    priority: 5,
    icon: '🤢',
    reason: {
      mr: 'सतत उलटी — निर्जलीकरणाचा धोका',
      hi: 'लगातार उल्टी — निर्जलीकरण का खतरा',
      en: 'Persistent vomiting — dehydration risk',
    },
    instructions: {
      mr: [
        'रुग्णाचे डोके बाजूला वळवा — गुदमरणे टाळा',
        'उलटी थांबल्यावर थोडे-थोडे ORS द्या',
        'घन अन्न देऊ नका',
        'डोळे खोल गेले, त्वचा कोरडी पडली तर तातडीने रुग्णालयात न्या',
      ],
      hi: [
        'मरीज़ का सिर एक तरफ करें — दम घुटने से बचाएं',
        'उल्टी रुकने पर थोड़ा-थोड़ा ORS दें',
        'ठोस खाना न दें',
        'आंखें धंसी हों, त्वचा सूखी हो तो तुरंत अस्पताल ले जाएं',
      ],
      en: [
        'Turn patient\'s head to the side — prevent choking',
        'Give small sips of ORS after vomiting stops',
        'Do not give solid food',
        'If eyes are sunken or skin is dry, rush to hospital',
      ],
    },
  },

  chronic: {
    priority: 3,
    icon: '💊',
    reason: {
      mr: 'दीर्घकालीन आजाराची तीव्रता — औषधे आणि नोंदी सोबत ठेवा',
      hi: 'पुरानी बीमारी बिगड़ी — दवाइयां और रिकॉर्ड साथ रखें',
      en: 'Chronic disease flare-up — carry medicines and records',
    },
    instructions: {
      mr: [
        'सर्व सध्याची औषधे रुग्णालयात सोबत न्या',
        'शेवटचा डोस कधी घेतला ते नोंद करा',
        'रुग्णाला शांत ठेवा — घाबरू नका',
        'रक्तदाब / रक्तशर्करा (असल्यास) मोजा आणि नोंद करा',
      ],
      hi: [
        'सभी मौजूदा दवाइयां अस्पताल ले जाएं',
        'आखिरी डोज़ कब लिया, नोट करें',
        'मरीज़ को शांत रखें — घबराएं नहीं',
        'ब्लड प्रेशर / शुगर (अगर हो) नापें और नोट करें',
      ],
      en: [
        'Carry all current medicines to hospital',
        'Note when last dose was taken',
        'Keep patient calm — do not panic',
        'Measure BP / blood sugar (if available) and note readings',
      ],
    },
  },
};

/**
 * Given a set of selected symptom keys and a language, returns:
 * - reason: the urgency reason string from the highest-priority symptom
 * - instructions: merged unique instructions from all selected symptoms,
 *   ordered by priority (highest first), capped at 5
 * - dominantIcon: the icon of the highest-priority symptom
 * - dominantKey: the key of the highest-priority symptom
 */
export function getTriageGuidance(
  selectedKeys: string[],
  language: Language
): {
  reason: string;
  instructions: string[];
  dominantIcon: string;
  dominantKey: string;
} {
  if (selectedKeys.length === 0) {
    return { reason: '', instructions: [], dominantIcon: '🏥', dominantKey: '' };
  }

  // Sort by priority descending
  const sorted = selectedKeys
    .filter(k => k in TRIAGE_PROTOCOLS)
    .sort((a, b) => TRIAGE_PROTOCOLS[b].priority - TRIAGE_PROTOCOLS[a].priority);

  if (sorted.length === 0) {
    return { reason: '', instructions: [], dominantIcon: '🏥', dominantKey: '' };
  }

  const dominant = TRIAGE_PROTOCOLS[sorted[0]];

  // Merge instructions from all selected, in priority order, removing duplicates
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const key of sorted) {
    const protocol = TRIAGE_PROTOCOLS[key];
    for (const inst of protocol.instructions[language]) {
      if (!seen.has(inst)) {
        seen.add(inst);
        merged.push(inst);
      }
    }
  }

  return {
    reason: dominant.reason[language],
    instructions: merged.slice(0, 5),
    dominantIcon: dominant.icon,
    dominantKey: sorted[0],
  };
}
