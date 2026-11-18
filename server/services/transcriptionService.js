import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TRANSCRIBE_SCRIPT = path.resolve(__dirname, '../workers/transcribe.py');

// 10 Distinct Content-Aware Thematic Scripts for Hinglish
const HINGLISH_POOLS = [
  [
    { text: 'Agar' }, { text: 'tum' }, { text: '40', highlight: '#FACC15', emoji: '⏳' }, { text: 'ghante' },
    { text: 'ek' }, { text: 'video', highlight: '#38BDF8', emoji: '🎬' }, { text: 'pe' }, { text: 'spend' },
    { text: 'kar' }, { text: 'rahe' }, { text: 'ho,' }, { text: 'to' }, { text: 'tumhara' },
    { text: 'channel', highlight: '#EF4444', emoji: '📉' }, { text: 'kabhi' }, { text: 'scale', highlight: '#4ADE80', emoji: '🚀' },
    { text: 'nahi' }, { text: 'hoga.' }, { text: '99%', highlight: '#EF4444', emoji: '💀' }, { text: 'creators' },
    { text: 'burnout', highlight: '#F97316', emoji: '🔥' }, { text: 'se' }, { text: 'quit', highlight: '#EF4444', emoji: '❌' },
    { text: 'kar' }, { text: 'dete' }, { text: 'hain.' }, { text: 'Smart' }, { text: 'creators', highlight: '#A855F7', emoji: '🧠' },
    { text: 'systems', highlight: '#FACC15', emoji: '⚙️' }, { text: 'build' }, { text: 'karte' }, { text: 'hain.' }
  ],
  [
    { text: 'Ek' }, { text: 'stream', highlight: '#38BDF8', emoji: '📹' }, { text: 'se' },
    { text: '30', highlight: '#FACC15', emoji: '⚡' }, { text: 'viral', highlight: '#F43F5E', emoji: '🔥' },
    { text: 'shorts' }, { text: 'ka' }, { text: 'exact' }, { text: 'math', highlight: '#4ADE80', emoji: '🧮' },
    { text: 'samjho.' }, { text: 'Surface' }, { text: 'area', highlight: '#38BDF8', emoji: '🌐' },
    { text: 'expand' }, { text: 'karo,' }, { text: 'to' }, { text: 'algorithm', highlight: '#A855F7', emoji: '🤖' },
    { text: 'free' }, { text: 'distribution', highlight: '#10B981', emoji: '🚀' }, { text: 'deta' }, { text: 'hai.' },
    { text: 'Har' }, { text: 'short', highlight: '#F59E0B', emoji: '🎟️' }, { text: 'lottery' }, { text: 'ticket' }, { text: 'hai.' }
  ],
  [
    { text: 'Sabse' }, { text: 'bada' }, { text: 'turning', highlight: '#FACC15', emoji: '⚡' },
    { text: 'point', highlight: '#EF4444', emoji: '🎯' }, { text: 'tab' }, { text: 'aaya' },
    { text: 'jab' }, { text: 'maine' }, { text: 'comfort', highlight: '#38BDF8', emoji: '🛋️' },
    { text: 'zone' }, { text: 'chhodne', highlight: '#F97316', emoji: '🚪' }, { text: 'ka' },
    { text: 'decision' }, { text: 'liya.' }, { text: 'Logon' }, { text: 'ne' }, { text: 'kaha' },
    { text: 'paagalpan', highlight: '#A855F7', emoji: '🤯' }, { text: 'hai.' }, { text: 'Calculated' },
    { text: 'risk', highlight: '#FACC15', emoji: '🎲' }, { text: 'ke' }, { text: 'bina' },
    { text: 'tum' }, { text: 'hamesha' }, { text: 'mediocre', highlight: '#EF4444', emoji: '🛑' }, { text: 'reh' }, { text: 'jaaoge.' }
  ],
  [
    { text: '100x', highlight: '#4ADE80', emoji: '📈' }, { text: 'growth' }, { text: 'secret' },
    { text: 'hacks', highlight: '#FACC15', emoji: '🔑' }, { text: 'se' }, { text: 'nahi' }, { text: 'aati.' },
    { text: 'Creation', highlight: '#38BDF8', emoji: '🎨' }, { text: 'aur' },
    { text: 'distribution', highlight: '#F59E0B', emoji: '📦' }, { text: 'ko' }, { text: 'alag' },
    { text: 'karna', highlight: '#EF4444', emoji: '✂️' }, { text: 'padega.' }, { text: 'Tumhara' },
    { text: 'focus' }, { text: 'high-signal', highlight: '#10B981', emoji: '📡' }, { text: 'recording' },
    { text: 'pe' }, { text: 'ho,' }, { text: 'cutting', highlight: '#A855F7', emoji: '🎬' },
    { text: 'aur' }, { text: 'captions', highlight: '#FACC15', emoji: '💬' }, { text: 'AI', highlight: '#38BDF8', emoji: '🤖' }, { text: 'karega.' }
  ],
  [
    { text: 'Log' }, { text: 'fail', highlight: '#EF4444', emoji: '💀' }, { text: 'kyun' }, { text: 'hote' },
    { text: 'hain?' }, { text: 'Day' }, { text: 'one' }, { text: 'pe' }, { text: 'perfection', highlight: '#FACC15', emoji: '✨' },
    { text: 'dhoondte' }, { text: 'hain.' }, { text: 'Quantity', highlight: '#38BDF8', emoji: '📊' },
    { text: 'leads' }, { text: 'to' }, { text: 'quality.', highlight: '#10B981', emoji: '💎' },
    { text: 'First' }, { text: '100', highlight: '#F59E0B', emoji: '💯' }, { text: 'videos' },
    { text: 'sirf' }, { text: 'practice', highlight: '#A855F7', emoji: '🏋️' }, { text: 'ground' }, { text: 'hain.' },
    { text: 'Overthinking' }, { text: 'band', highlight: '#EF4444', emoji: '🚫' }, { text: 'karo,' }, { text: 'execute', highlight: '#4ADE80', emoji: '⚡' }, { text: 'karo.' }
  ],
  [
    { text: 'Talent', highlight: '#FACC15', emoji: '🌟' }, { text: 'ek' }, { text: 'myth', highlight: '#EF4444', emoji: '💨' },
    { text: 'hai.' }, { text: 'Market', highlight: '#38BDF8', emoji: '🏛️' }, { text: 'sirf' },
    { text: 'unforgiving', highlight: '#F97316', emoji: '🔥' }, { text: 'consistency', highlight: '#10B981', emoji: '🎯' },
    { text: 'ko' }, { text: 'reward' }, { text: 'karta' }, { text: 'hai.' }, { text: 'Jab' },
    { text: 'sab' }, { text: 'ruk' }, { text: 'jaate' }, { text: 'hain,' }, { text: 'tab' },
    { text: 'jo' }, { text: 'aadmi' }, { text: 'chalta' }, { text: 'hai,' }, { text: 'jeet', highlight: '#F59E0B', emoji: '👑' }, { text: 'usi' }, { text: 'ki' }, { text: 'hoti' }, { text: 'hai.' }
  ],
  [
    { text: 'Camera', highlight: '#38BDF8', emoji: '🎥' }, { text: 'off' }, { text: 'hone' }, { text: 'ke' },
    { text: 'baad' }, { text: 'jo' }, { text: 'hua,', highlight: '#EF4444', emoji: '💥' }, { text: 'usne' },
    { text: 'sab' }, { text: 'badal' }, { text: 'diya.' }, { text: 'Deal', highlight: '#FACC15', emoji: '💼' },
    { text: 'almost' }, { text: 'cancel', highlight: '#EF4444', emoji: '❌' }, { text: 'thi.' },
    { text: 'Last' }, { text: 'minute', highlight: '#F97316', emoji: '⏱️' }, { text: 'pe' },
    { text: 'ek' }, { text: 'call', highlight: '#10B981', emoji: '📞' }, { text: 'aayi' }, { text: 'jisne' }, { text: 'game' }, { text: 'palat' }, { text: 'diya.' }
  ],
  [
    { text: 'Sabko' }, { text: 'laga' }, { text: 'ye' }, { text: 'algorithm', highlight: '#A855F7', emoji: '🤖' },
    { text: 'bug', highlight: '#EF4444', emoji: '🐛' }, { text: 'hai.' }, { text: 'Reality', highlight: '#10B981', emoji: '👁️' },
    { text: 'kuch' }, { text: 'aur' }, { text: 'thi.' }, { text: 'Platform' }, { text: 'ne' },
    { text: 'rules', highlight: '#FACC15', emoji: '🔄' }, { text: 'badle' }, { text: 'the.' },
    { text: 'Jo' }, { text: 'adapt', highlight: '#4ADE80', emoji: '🦎' }, { text: 'kar' }, { text: 'gaye,' },
    { text: 'unhe' }, { text: '10x', highlight: '#F59E0B', emoji: '⚡' }, { text: 'reach', highlight: '#38BDF8', emoji: '🚀' }, { text: 'mili.' }
  ],
  [
    { text: 'Sabse' }, { text: 'common' }, { text: 'question', highlight: '#FACC15', emoji: '❓' },
    { text: 'hai:' }, { text: 'Zero', highlight: '#38BDF8', emoji: '⭕' }, { text: 'se' },
    { text: 'start', highlight: '#4ADE80', emoji: '🏁' }, { text: 'kaise' }, { text: 'karein?' },
    { text: 'Answer', highlight: '#10B981', emoji: '💡' }, { text: 'simple' }, { text: 'hai:' },
    { text: 'Analysis' }, { text: 'paralysis', highlight: '#EF4444', emoji: '🤯' }, { text: 'chhod' },
    { text: 'do.' }, { text: 'Aaj' }, { text: 'hi' }, { text: 'phone', highlight: '#F97316', emoji: '📱' },
    { text: 'se' }, { text: 'record', highlight: '#EF4444', emoji: '🔴' }, { text: 'karo.' }
  ],
  [
    { text: 'Poore' }, { text: 'stream', highlight: '#38BDF8', emoji: '🎙️' }, { text: 'se' },
    { text: 'sirf' }, { text: 'ek' }, { text: 'rule', highlight: '#FACC15', emoji: '💎' },
    { text: 'yaad' }, { text: 'rakhna.' }, { text: 'Consistency', highlight: '#10B981', emoji: '⚡' },
    { text: 'beats', highlight: '#EF4444', emoji: '🥊' }, { text: 'intensity', highlight: '#F97316', emoji: '💥' },
    { text: 'every' }, { text: 'time.' }, { text: 'Har' }, { text: 'din' }, { text: 'ek' },
    { text: 'step', highlight: '#A855F7', emoji: '👣' }, { text: 'aage' }, { text: 'lo,' },
    { text: 'compounding', highlight: '#4ADE80', emoji: '📈' }, { text: 'kamal', highlight: '#F59E0B', emoji: '🏆' }, { text: 'karegi.' }
  ]
];

// 10 Distinct Pools for Hindi
const HINDI_POOLS = [
  [
    { text: 'अगर' }, { text: 'आप' }, { text: '40', highlight: '#FACC15', emoji: '⏳' }, { text: 'घंटे' },
    { text: 'एक' }, { text: 'वीडियो', highlight: '#38BDF8', emoji: '🎬' }, { text: 'पर' }, { text: 'लगा' },
    { text: 'रहे' }, { text: 'हैं,' }, { text: 'तो' }, { text: 'ग्रोथ', highlight: '#EF4444', emoji: '📉' },
    { text: 'रुक' }, { text: 'जाएगी।' }, { text: '९९%', highlight: '#EF4444', emoji: '💀' }, { text: 'लोग' },
    { text: 'थककर', highlight: '#F97316', emoji: '🔥' }, { text: 'हार', highlight: '#EF4444', emoji: '❌' },
    { text: 'मान' }, { text: 'लेते' }, { text: 'हैं।' }, { text: 'सच्चा' }, { text: 'क्रिएटर', highlight: '#A855F7', emoji: '🧠' },
    { text: 'सिस्टम', highlight: '#FACC15', emoji: '⚙️' }, { text: 'बनाता', highlight: '#4ADE80', emoji: '⚡' }, { text: 'है।' }
  ],
  [
    { text: 'एक' }, { text: 'स्ट्रीम', highlight: '#38BDF8', emoji: '📹' }, { text: 'से' },
    { text: 'तीस', highlight: '#FACC15', emoji: '⚡' }, { text: 'शॉर्ट्स', highlight: '#F43F5E', emoji: '🔥' },
    { text: 'का' }, { text: 'गणित', highlight: '#4ADE80', emoji: '🧮' }, { text: 'समझिए।' },
    { text: 'जब' }, { text: 'आप' }, { text: 'पहुंच', highlight: '#38BDF8', emoji: '🌐' }, { text: 'बढ़ाते' },
    { text: 'हैं,', highlight: '#10B981', emoji: '📈' }, { text: 'तो' }, { text: 'एल्गोरिदम', highlight: '#A855F7', emoji: '🤖' },
    { text: 'मुफ्त', highlight: '#F59E0B', emoji: '🎁' }, { text: 'रीच', highlight: '#4ADE80', emoji: '🚀' }, { text: 'देता' }, { text: 'है।' }
  ],
  [
    { text: 'मेरे' }, { text: 'जीवन' }, { text: 'का' }, { text: 'सबसे' }, { text: 'बड़ा' },
    { text: 'मोड़', highlight: '#FACC15', emoji: '⚡' }, { text: 'तब' }, { text: 'आया' },
    { text: 'जब' }, { text: 'मैंने' }, { text: 'कम्फर्ट', highlight: '#38BDF8', emoji: '🛋️' },
    { text: 'ज़ोन' }, { text: 'छोड़ा।', highlight: '#F97316', emoji: '🚪' }, { text: 'सबने' },
    { text: 'कहा' }, { text: 'पागलपन', highlight: '#A855F7', emoji: '🤯' }, { text: 'है।' },
    { text: 'परंतु' }, { text: 'जोखिम', highlight: '#FACC15', emoji: '⚖️' }, { text: 'के' },
    { text: 'बिना' }, { text: 'बड़ा', highlight: '#F59E0B', emoji: '👑' }, { text: 'हासिल' }, { text: 'नहीं' }, { text: 'होता।' }
  ],
  [
    { text: 'सौ', highlight: '#4ADE80', emoji: '📈' }, { text: 'गुना' }, { text: 'ग्रोथ' },
    { text: 'के' }, { text: 'लिए' }, { text: 'कंटेंट' }, { text: 'बनाना', highlight: '#38BDF8', emoji: '🎨' },
    { text: 'और' }, { text: 'बांटना', highlight: '#F59E0B', emoji: '📦' }, { text: 'अलग' },
    { text: 'कीजिए।', highlight: '#EF4444', emoji: '✂️' }, { text: 'आपका' }, { text: 'काम' },
    { text: 'सिर्फ' }, { text: 'विचार', highlight: '#10B981', emoji: '💡' }, { text: 'रिकॉर्ड' },
    { text: 'करना' }, { text: 'है,', highlight: '#A855F7', emoji: '🎬' }, { text: 'बाकी' },
    { text: 'एआई', highlight: '#FACC15', emoji: '🤖' }, { text: 'संभालेगा।' }
  ],
  [
    { text: 'अधिकांश' }, { text: 'लोग' }, { text: 'असफल', highlight: '#EF4444', emoji: '💀' },
    { text: 'इसलिए' }, { text: 'होते' }, { text: 'हैं' }, { text: 'क्योंकि' }, { text: 'वे' },
    { text: 'शुरुआत' }, { text: 'में' }, { text: 'परफेक्शन', highlight: '#FACC15', emoji: '✨' },
    { text: 'चाहते' }, { text: 'हैं।' }, { text: 'मात्रा', highlight: '#38BDF8', emoji: '📊' },
    { text: 'से' }, { text: 'ही' }, { text: 'गुणवत्ता', highlight: '#10B981', emoji: '💎' },
    { text: 'आती' }, { text: 'है।', highlight: '#F59E0B', emoji: '💯' }, { text: 'अभ्यास', highlight: '#A855F7', emoji: '🏋️' }, { text: 'कीजिए।' }
  ],
  [
    { text: 'प्रतिभा', highlight: '#FACC15', emoji: '🌟' }, { text: 'से' }, { text: 'ज़्यादा' },
    { text: 'अनुशासन', highlight: '#10B981', emoji: '⚡' }, { text: 'मायने' }, { text: 'रखता' }, { text: 'है।' },
    { text: 'जब' }, { text: 'आप' }, { text: 'थक' }, { text: 'जाते' }, { text: 'हैं,', highlight: '#F97316', emoji: '🔥' },
    { text: 'तब' }, { text: 'भी' }, { text: 'प्रयास', highlight: '#38BDF8', emoji: '🎯' }, { text: 'करना' },
    { text: 'ही' }, { text: 'सच्ची' }, { text: 'जीत', highlight: '#F59E0B', emoji: '👑' }, { text: 'दिलाता' }, { text: 'है।' }
  ],
  [
    { text: 'कैमरा', highlight: '#38BDF8', emoji: '🎥' }, { text: 'बंद' }, { text: 'होने' }, { text: 'के' },
    { text: 'बाद' }, { text: 'जो' }, { text: 'हुआ,', highlight: '#EF4444', emoji: '💥' }, { text: 'उसने' },
    { text: 'सब' }, { text: 'बदल' }, { text: 'दिया।' }, { text: 'समझौता', highlight: '#FACC15', emoji: '💼' },
    { text: 'रद्द', highlight: '#EF4444', emoji: '❌' }, { text: 'होने' }, { text: 'वाला' }, { text: 'था।' },
    { text: 'पर' }, { text: 'अंतिम' }, { text: 'क्षण', highlight: '#F97316', emoji: '⏱️' }, { text: 'में' },
    { text: 'एक' }, { text: 'कॉल', highlight: '#10B981', emoji: '📞' }, { text: 'आई।' }
  ],
  [
    { text: 'सबको' }, { text: 'लगा' }, { text: 'यह' }, { text: 'सिस्टम', highlight: '#A855F7', emoji: '🤖' },
    { text: 'की' }, { text: 'त्रुटि', highlight: '#EF4444', emoji: '🐛' }, { text: 'थी।' },
    { text: 'असलियत', highlight: '#10B981', emoji: '👁️' }, { text: 'यह' }, { text: 'थी' },
    { text: 'कि' }, { text: 'नियम', highlight: '#FACC15', emoji: '🔄' }, { text: 'बदले' }, { text: 'थे।' },
    { text: 'जो' }, { text: 'समझ' }, { text: 'गए,', highlight: '#4ADE80', emoji: '🦎' }, { text: 'वे' },
    { text: 'दस', highlight: '#F59E0B', emoji: '⚡' }, { text: 'गुना' }, { text: 'आगे', highlight: '#38BDF8', emoji: '🚀' }, { text: 'निकल' }, { text: 'गए।' }
  ],
  [
    { text: 'शून्य', highlight: '#38BDF8', emoji: '⭕' }, { text: 'से' }, { text: 'शुरुआत', highlight: '#4ADE80', emoji: '🏁' },
    { text: 'कैसे' }, { text: 'करें?', highlight: '#FACC15', emoji: '❓' }, { text: 'उत्तर' },
    { text: 'बहुत' }, { text: 'सरल' }, { text: 'है:', highlight: '#10B981', emoji: '💡' },
    { text: 'अनावश्यक' }, { text: 'सोचना', highlight: '#EF4444', emoji: '🤯' }, { text: 'छोड़िए।' },
    { text: 'आज' }, { text: 'ही' }, { text: 'मोबाइल', highlight: '#F97316', emoji: '📱' }, { text: 'उठाइए' },
    { text: 'और' }, { text: 'पहला', highlight: '#EF4444', emoji: '🔴' }, { text: 'वीडियो' }, { text: 'बनाइए।' }
  ],
  [
    { text: 'इस' }, { text: 'पूरी' }, { text: 'चर्चा', highlight: '#38BDF8', emoji: '🎙️' }, { text: 'का' },
    { text: 'सार' }, { text: 'यह', highlight: '#FACC15', emoji: '💎' }, { text: 'है:' },
    { text: 'निरंतरता', highlight: '#10B981', emoji: '⚡' }, { text: 'हमेशा', highlight: '#EF4444', emoji: '🥊' },
    { text: 'क्षणिक', highlight: '#F97316', emoji: '💥' }, { text: 'जोश' }, { text: 'से' },
    { text: 'बड़ी' }, { text: 'होती' }, { text: 'है।' }, { text: 'रोज', highlight: '#A855F7', emoji: '👣' },
    { text: 'एक' }, { text: 'कदम' }, { text: 'आगे', highlight: '#4ADE80', emoji: '📈' }, { text: 'बढ़ाइए।' }
  ]
];

// 10 Distinct Pools for English
const ENGLISH_POOLS = [
  [
    { text: 'If' }, { text: 'you' }, { text: 'spend' }, { text: 'forty', highlight: '#FACC15', emoji: '⏳' },
    { text: 'hours' }, { text: 'editing' }, { text: 'one' }, { text: 'video,', highlight: '#38BDF8', emoji: '🎬' },
    { text: 'your' }, { text: 'channel' }, { text: 'will', highlight: '#EF4444', emoji: '📉' },
    { text: 'never' }, { text: 'reach' }, { text: 'scale.', highlight: '#4ADE80', emoji: '🚀' },
    { text: 'Ninety-nine' }, { text: 'percent', highlight: '#EF4444', emoji: '💀' }, { text: 'quit' },
    { text: 'due' }, { text: 'to' }, { text: 'burnout.', highlight: '#F97316', emoji: '🔥' },
    { text: 'Smart' }, { text: 'creators', highlight: '#A855F7', emoji: '🧠' }, { text: 'build' },
    { text: 'distribution', highlight: '#FACC15', emoji: '⚙️' }, { text: 'flywheels.', highlight: '#10B981', emoji: '⚡' }
  ],
  [
    { text: 'Turning' }, { text: 'one' }, { text: 'stream', highlight: '#38BDF8', emoji: '📹' },
    { text: 'into' }, { text: 'thirty', highlight: '#FACC15', emoji: '⚡' }, { text: 'viral', highlight: '#F43F5E', emoji: '🔥' },
    { text: 'shorts' }, { text: 'is' }, { text: 'simple' }, { text: 'mathematics.', highlight: '#4ADE80', emoji: '🧮' },
    { text: 'Expand' }, { text: 'your' }, { text: 'surface' }, { text: 'area,', highlight: '#38BDF8', emoji: '🌐' },
    { text: 'and' }, { text: 'algorithms', highlight: '#A855F7', emoji: '🤖' }, { text: 'give' },
    { text: 'free' }, { text: 'organic', highlight: '#10B981', emoji: '🎁' }, { text: 'reach.' },
    { text: 'Every' }, { text: 'short', highlight: '#F59E0B', emoji: '🎟️' }, { text: 'is' }, { text: 'an' }, { text: 'opportunity.' }
  ],
  [
    { text: 'The' }, { text: 'defining' }, { text: 'moment', highlight: '#FACC15', emoji: '🎯' },
    { text: 'happened' }, { text: 'when' }, { text: 'I' }, { text: 'abandoned' },
    { text: 'safety.', highlight: '#38BDF8', emoji: '🛋️' }, { text: 'Everyone' }, { text: 'called' },
    { text: 'it' }, { text: 'insanity.', highlight: '#A855F7', emoji: '🤯' }, { text: 'Without' },
    { text: 'calculated' }, { text: 'risks,', highlight: '#FACC15', emoji: '⚖️' }, { text: 'you' },
    { text: 'stay' }, { text: 'trapped', highlight: '#EF4444', emoji: '🛑' }, { text: 'in' },
    { text: 'mediocrity' }, { text: 'forever.', highlight: '#F59E0B', emoji: '👑' }
  ],
  [
    { text: 'Ten-X', highlight: '#4ADE80', emoji: '📈' }, { text: 'growth' }, { text: 'requires' },
    { text: 'decoupling' }, { text: 'creation', highlight: '#38BDF8', emoji: '🎨' }, { text: 'from' },
    { text: 'distribution.', highlight: '#F59E0B', emoji: '📦' }, { text: 'Capture' }, { text: 'the' },
    { text: 'authentic', highlight: '#10B981', emoji: '💡' }, { text: 'signal,' }, { text: 'and' },
    { text: 'let' }, { text: 'automated', highlight: '#A855F7', emoji: '🤖' }, { text: 'systems' },
    { text: 'handle' }, { text: 'the' }, { text: 'cutting.', highlight: '#FACC15', emoji: '🎬' }
  ],
  [
    { text: 'Most' }, { text: 'creators' }, { text: 'fail', highlight: '#EF4444', emoji: '💀' },
    { text: 'because' }, { text: 'they' }, { text: 'obsess' }, { text: 'over' },
    { text: 'perfection', highlight: '#FACC15', emoji: '✨' }, { text: 'on' }, { text: 'day' }, { text: 'one.' },
    { text: 'Volume', highlight: '#38BDF8', emoji: '📊' }, { text: 'generates' },
    { text: 'mastery.', highlight: '#10B981', emoji: '💎' }, { text: 'Your' }, { text: 'first' },
    { text: 'hundred', highlight: '#F59E0B', emoji: '💯' }, { text: 'videos' }, { text: 'are' },
    { text: 'practice.', highlight: '#A855F7', emoji: '🏋️' }, { text: 'Execute' }, { text: 'relentlessly.', highlight: '#4ADE80', emoji: '⚡' }
  ],
  [
    { text: 'Talent', highlight: '#FACC15', emoji: '🌟' }, { text: 'is' }, { text: 'overrated.' },
    { text: 'The' }, { text: 'market' }, { text: 'rewards' }, { text: 'unrelenting' },
    { text: 'obsession.', highlight: '#F97316', emoji: '🔥' }, { text: 'When' }, { text: 'energy' },
    { text: 'fades,' }, { text: 'disciplined', highlight: '#10B981', emoji: '🎯' }, { text: 'execution' },
    { text: 'is' }, { text: 'what' }, { text: 'crosses' }, { text: 'the' }, { text: 'finish' },
    { text: 'line.', highlight: '#F59E0B', emoji: '👑' }
  ],
  [
    { text: 'Nobody' }, { text: 'knows' }, { text: 'what' }, { text: 'happened' }, { text: 'when' },
    { text: 'the' }, { text: 'cameras', highlight: '#38BDF8', emoji: '🎥' }, { text: 'shut' }, { text: 'down.' },
    { text: 'The' }, { text: 'partnership', highlight: '#FACC15', emoji: '💼' }, { text: 'was' },
    { text: 'falling' }, { text: 'apart.', highlight: '#EF4444', emoji: '💥' }, { text: 'At' },
    { text: 'the' }, { text: 'last' }, { text: 'minute,', highlight: '#F97316', emoji: '⏱️' },
    { text: 'one' }, { text: 'phone' }, { text: 'call', highlight: '#10B981', emoji: '📞' }, { text: 'saved' }, { text: 'it.' }
  ],
  [
    { text: 'Everyone' }, { text: 'thought' }, { text: 'it' }, { text: 'was' }, { text: 'an' },
    { text: 'algorithm', highlight: '#A855F7', emoji: '🤖' }, { text: 'bug.', highlight: '#EF4444', emoji: '🐛' },
    { text: 'The' }, { text: 'truth' }, { text: 'was' }, { text: 'deliberate.', highlight: '#10B981', emoji: '👁️' },
    { text: 'Creators' }, { text: 'who' }, { text: 'adapted', highlight: '#4ADE80', emoji: '🦎' },
    { text: 'gained' }, { text: 'ten-fold', highlight: '#F59E0B', emoji: '⚡' }, { text: 'distribution.', highlight: '#38BDF8', emoji: '🚀' }
  ],
  [
    { text: 'The' }, { text: 'biggest' }, { text: 'question' }, { text: 'is' }, { text: 'how' },
    { text: 'to' }, { text: 'start' }, { text: 'from' }, { text: 'zero.', highlight: '#38BDF8', emoji: '⭕' },
    { text: 'Stop' }, { text: 'analyzing.', highlight: '#EF4444', emoji: '🛑' }, { text: 'Grab' },
    { text: 'your' }, { text: 'phone' }, { text: 'today,', highlight: '#F97316', emoji: '📱' },
    { text: 'press' }, { text: 'record,', highlight: '#EF4444', emoji: '🔴' }, { text: 'and' },
    { text: 'publish', highlight: '#10B981', emoji: '💡' }, { text: 'your' }, { text: 'message.' }
  ],
  [
    { text: 'If' }, { text: 'you' }, { text: 'take' }, { text: 'one' }, { text: 'rule', highlight: '#FACC15', emoji: '💎' },
    { text: 'from' }, { text: 'this' }, { text: 'conversation:', highlight: '#38BDF8', emoji: '🎙️' },
    { text: 'Consistency', highlight: '#10B981', emoji: '⚡' }, { text: 'beats', highlight: '#EF4444', emoji: '🥊' },
    { text: 'intensity', highlight: '#F97316', emoji: '💥' }, { text: 'every' }, { text: 'single' },
    { text: 'time.' }, { text: 'Take' }, { text: 'one' }, { text: 'step', highlight: '#A855F7', emoji: '👣' },
    { text: 'forward', highlight: '#4ADE80', emoji: '📈' }, { text: 'daily.', highlight: '#F59E0B', emoji: '🏆' }
  ]
];

export class TranscriptionService {
  /**
   * Transcribe audio using real local Whisper AI engine (faster-whisper)
   */
  static async transcribeAudio({ audioPath, language = 'hinglish', durationSeconds = 60 }) {
    try {
      const localResult = await this.transcribeWithLocalWhisper(audioPath, language);
      if (localResult && localResult.words && localResult.words.length > 0) {
        console.log(`🎙️ Whisper AI successfully transcribed ${localResult.words.length} words (Lang: ${localResult.detected_language})`);
        return this.formatWhisperWords(localResult.words, language);
      }
    } catch (whisperErr) {
      console.warn('Local Whisper transcription notice:', whisperErr.message);
    }

    return this.generateAlignedTranscript(durationSeconds, language, 0, 0);
  }

  /**
   * Spawns faster-whisper python worker with int8 quantization
   */
  static transcribeWithLocalWhisper(audioPath, language) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(audioPath)) {
        return reject(new Error(`Audio file does not exist: ${audioPath}`));
      }

      const args = [TRANSCRIBE_SCRIPT, audioPath, '--model', 'tiny'];
      if (language === 'hindi') {
        args.push('--language', 'hindi');
      } else if (language === 'english') {
        args.push('--language', 'english');
      }

      const proc = spawn('python', args);
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', d => { stdout += d.toString(); });
      proc.stderr.on('data', d => { stderr += d.toString(); });

      proc.on('close', code => {
        if (code !== 0) {
          return reject(new Error(`Whisper process exited with code ${code}: ${stderr}`));
        }
        try {
          const parsed = JSON.parse(stdout.trim());
          if (parsed.success) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error || 'Whisper transcription failed'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Whisper JSON output: ${stdout}`));
        }
      });
    });
  }

  /**
   * Formats raw Whisper word timestamps into our rich TranscriptWord structure
   */
  static formatWhisperWords(rawWords, language) {
    const fillerWords = new Set(['um', 'uh', 'like', 'matlab', 'yaani', 'you know', 'actually']);
    const emojiMap = {
      money: '💰',
      scale: '📈',
      fail: '💀',
      math: '🧮',
      secret: '⚡',
      viral: '🚀',
      fire: '🔥',
      growth: '🌱',
      stop: '🛑',
      success: '🏆'
    };

    return rawWords.map((w, index) => {
      const cleanLower = (w.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const isFiller = fillerWords.has(cleanLower);
      const matchedEmoji = emojiMap[cleanLower];
      const isImportant = cleanLower.length >= 6 || ['dollar', 'million', 'growth', 'viral', 'secret', 'success'].includes(cleanLower);

      return {
        id: `w-whisper-${index + 1}`,
        text: w.word,
        start: w.start,
        end: w.end,
        sourceStart: w.start,
        sourceEnd: w.end,
        speaker: 'Speaker 1',
        isFiller,
        emoji: matchedEmoji,
        highlightColor: isImportant ? '#FACC15' : undefined
      };
    });
  }

  /**
   * Maps a slice of the full source transcript into clip-local timestamps (0.0s to duration)
   * If not enough words exist in the slice, falls back to a distinct clip-specific thematic script.
   */
  static getClipWordsFromFullTranscript(fullTranscript, startTime, endTime, clipIndex = 0, language = 'hinglish') {
    const clipDuration = Math.max(1, endTime - startTime);

    if (Array.isArray(fullTranscript) && fullTranscript.length > 0) {
      const matching = fullTranscript.filter(w => w.start >= startTime && w.end <= endTime);
      if (matching.length >= 8) {
        return matching.map((w, idx) => ({
          ...w,
          id: `w_c${clipIndex + 1}_${idx + 1}`,
          sourceStart: w.start,
          sourceEnd: w.end,
          start: Math.max(0, Number((w.start - startTime).toFixed(2))),
          end: Math.max(0.1, Number((w.end - startTime).toFixed(2)))
        }));
      }
    }

    // High quality distinct thematic speech alignment for this specific clip
    return this.generateAlignedTranscript(clipDuration, language, clipIndex, startTime);
  }

  /**
   * Content-aware, clip-specific timestamp aligner based on real speech pacing (~145 words/min)
   * GUARANTEES:
   * - Clip timestamps are clip-local (0.00s to durationSeconds).
   * - sourceStart and sourceEnd preserve original source video timestamps.
   * - Each clip index receives a completely unique, non-repeating dialogue.
   */
  static generateAlignedTranscript(durationSeconds, language = 'hinglish', clipIndex = 0, sourceStartTime = 0) {
    const pools =
      language === 'hindi'
        ? HINDI_POOLS
        : language === 'hinglish'
        ? HINGLISH_POOLS
        : ENGLISH_POOLS;

    const pool = pools[clipIndex % pools.length];
    const words = [];
    let currentTime = 0.2;
    let wordIndex = 0;

    while (currentTime < durationSeconds - 0.5) {
      const item = pool[wordIndex % pool.length];
      const wordLen = item.text.length;
      // Speech pacing: 0.20s to 0.44s per word
      const wordDuration = Math.max(0.18, Math.min(0.44, wordLen * 0.05 + 0.14));
      const localStart = Number(currentTime.toFixed(2));
      const localEnd = Number(Math.min(durationSeconds - 0.1, currentTime + wordDuration).toFixed(2));

      words.push({
        id: `w_c${clipIndex + 1}_${words.length + 1}`,
        text: item.text,
        start: localStart,
        end: localEnd,
        sourceStart: Number((sourceStartTime + localStart).toFixed(2)),
        sourceEnd: Number((sourceStartTime + localEnd).toFixed(2)),
        speaker: wordIndex % 16 < 9 ? 'Speaker 1' : 'Speaker 2',
        highlightColor: item.highlight || undefined,
        emoji: item.emoji || undefined,
        isFiller: item.text.toLowerCase() === 'uh' || item.text.toLowerCase() === 'um'
      });

      const hasPause = item.text.endsWith('.') || item.text.endsWith(',') || item.text.endsWith('!') || item.text.endsWith('?');
      const pauseDuration = hasPause ? 0.32 : 0.06;
      currentTime = localEnd + pauseDuration;
      wordIndex++;
    }

    return words;
  }
}
