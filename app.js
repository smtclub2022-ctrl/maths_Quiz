const chapters = [
  { title: "वास्तविक संख्याएँ", topics: ["यूक्लिड विभाजन प्रमेय", "अभाज्य गुणनखंड", "परिमेय और अपरिमेय संख्याएँ"], accent: "#6558df", type: "hcf" },
  { title: "बहुपद", topics: ["शून्यक और गुणांक", "बहुपद के शून्यक", "शून्यकों के संबंध"], accent: "#ed9a4a", type: "poly" },
  { title: "दो चरों वाले रैखिक समीकरण युग्म", topics: ["प्रतिस्थापन विधि", "विलोपन विधि", "हल और संगतता"], accent: "#36a98a", type: "linear" },
  { title: "द्विघात समीकरण", topics: ["गुणनखंड विधि", "मूल ज्ञात करना", "विविक्तकर"], accent: "#ed7184", type: "quadratic" },
  { title: "समांतर श्रेढ़ियाँ", topics: ["सार्व अंतर", "nवाँ पद", "प्रथम n पदों का योग"], accent: "#e0a932", type: "ap" },
  { title: "त्रिभुज", topics: ["समरूप त्रिभुज", "समरूपता की कसौटियाँ", "पाइथागोरस प्रमेय"], accent: "#478fc5", type: "triangle" },
  { title: "निर्देशांक ज्यामिति", topics: ["दो बिंदुओं के बीच दूरी", "मध्य-बिंदु सूत्र", "त्रिभुज का क्षेत्रफल"], accent: "#8d6bd1", type: "coordinate" },
  { title: "त्रिकोणमिति का परिचय", topics: ["त्रिकोणमितीय अनुपात", "विशेष कोण", "त्रिकोणमितीय सर्वसमिकाएँ"], accent: "#39a9a7", type: "trig" },
  { title: "त्रिकोणमिति के कुछ अनुप्रयोग", topics: ["उन्नयन कोण", "अवनमन कोण", "ऊँचाई और दूरी"], accent: "#587ed0", type: "application" },
  { title: "वृत्त", topics: ["स्पर्श रेखा", "त्रिज्या और स्पर्श रेखा", "बाह्य बिंदु से स्पर्श रेखाएँ"], accent: "#dc7955", type: "circle" },
  { title: "रचनाएँ", topics: ["रेखाखंड का विभाजन", "समरूप त्रिभुज की रचना", "वृत्त की स्पर्श रेखाएँ"], accent: "#a16bbd", type: "construction" },
  { title: "वृत्तों से संबंधित क्षेत्रफल", topics: ["वृत्त का क्षेत्रफल", "त्रिज्यखंड का क्षेत्रफल", "चाप की लंबाई"], accent: "#4b9c7c", type: "area" },
  { title: "पृष्ठीय क्षेत्रफल और आयतन", topics: ["बेलन", "शंकु", "गोला"], accent: "#cb6686", type: "volume" },
  { title: "सांख्यिकी", topics: ["माध्य", "माध्यिका", "बहुलक"], accent: "#518ec4", type: "statistics" },
  { title: "प्रायिकता", topics: ["सरल घटनाएँ", "अनुकूल परिणाम", "पूरक घटना"], accent: "#7e8c4c", type: "probability" }
];

const examQuestionBank = [
  { chapter: 0, year: 2022, prompt: "निम्नलिखित में से कौन-सी संख्या अपरिमेय है?", options: ["2", "2.232425… (असांत, अनावर्ती)", "2.23", "2.232323… (आवर्ती)"], answer: 1, solution: "2.232425… को असांत और अनावर्ती दशमलव माना गया है, इसलिए यह अपरिमेय है। बाकी विकल्प पूर्णांक, सांत दशमलव और आवर्ती दशमलव हैं; वे परिमेय हैं।", hint: "अपरिमेय संख्या का दशमलव प्रसार असांत और अनावर्ती होता है।" },
  { chapter: 1, year: 2021, prompt: "बहुपद f(x) = 6x − 2 में x = 2 रखने पर बहुपद का मान होगा—", options: ["8", "9", "10", "12"], answer: 2, solution: "f(2) = 6 × 2 − 2 = 12 − 2 = 10।", hint: "x के स्थान पर 2 रखकर पहले गुणा करें, फिर 2 घटाएँ।" },
  { chapter: 1, year: 2021, prompt: "यदि 3, बहुपद 2x² + x + k का एक शून्यक है, तो k का मान होगा—", options: ["12", "21", "24", "−21"], answer: 3, solution: "शून्यक होने के कारण 2(3)² + 3 + k = 0। अतः 18 + 3 + k = 0 और k = −21।", hint: "शून्यक x = 3 को बहुपद में रखकर उसका मान शून्य के बराबर करें।" },
  { chapter: 1, year: 2022, prompt: "बहुपद P(x) = (3 − x)(x − 4) की घात है—", options: ["2", "4", "0", "3"], answer: 0, solution: "दोनों रैखिक बहुपदों के गुणनफल की घात 1 + 1 = 2 है।", hint: "कोष्ठकों का गुणन करने पर x² का पद मिलता है।" },
  { chapter: 2, year: 2022, prompt: "k के किस मान के लिए रैखिक समीकरणों के युग्म 3x + y = 1 और (2k − 1)x + y = 2k + 1 का कोई हल नहीं है?", options: ["2", "1", "3", "4"], answer: 0, solution: "कोई हल न होने के लिए x के गुणांक समान, लेकिन नियत पद अलग होने चाहिए। 2k − 1 = 3 से k = 2 मिलता है। तब समीकरणों के नियत पद 1 और 5 अलग हैं।", hint: "दोनों समीकरणों में y का गुणांक पहले से समान है; x के गुणांक बराबर करें।" },
  { chapter: 3, year: 2022, prompt: "द्विघात समीकरण ax² + bx + c = 0 के मूल वास्तविक नहीं हैं, यदि—", options: ["b² − 4ac > 0", "b² − 4ac = 0", "b² − 4ac < 0", "b² − 4ac ≥ 0"], answer: 2, solution: "विविक्तकर D = b² − 4ac होता है। D < 0 होने पर उसके वर्गमूल का मान वास्तविक नहीं होता, इसलिए मूल वास्तविक नहीं हैं।", hint: "वास्तविक मूलों के लिए विविक्तकर का चिह्न देखें।" },
  { chapter: 4, year: 2022, prompt: "6 पदों वाली समांतर श्रेढ़ी का प्रथम पद 2 और अंतिम पद 10 है। इसका योगफल है—", options: ["72", "36", "135", "24"], answer: 1, solution: "Sₙ = n(a + l)/2 = 6(2 + 10)/2 = 36।", hint: "प्रथम और अंतिम पद दिए हों तो Sₙ = n(a + l)/2 लगाएँ।" },
  { chapter: 5, year: 2021, prompt: "DE ∥ BC, AD = 2 सेमी, DB = 3 सेमी और AE = 4 सेमी है। EC का मान होगा—", options: ["5 सेमी", "6 सेमी", "7 सेमी", "4 सेमी"], answer: 1, solution: "मूल समानुपातिकता प्रमेय से AD/DB = AE/EC। इसलिए 2/3 = 4/EC और EC = 6 सेमी।", hint: "समांतर रेखा के कारण AD/DB = AE/EC होगा।" },
  { chapter: 6, year: 2021, prompt: "मूल बिंदु के निर्देशांक हैं—", options: ["(1, 1)", "(0, 0)", "(0, 1)", "(1, 0)"], answer: 1, solution: "निर्देशांक तल के मूल बिंदु के दोनों निर्देशांक शून्य होते हैं: (0, 0)।", hint: "मूल बिंदु दोनों अक्षों का प्रतिच्छेद है।" },
  { chapter: 6, year: 2022, prompt: "बिंदु P(5, −4) की x-अक्ष से दूरी है—", options: ["5", "0", "4", "16"], answer: 2, solution: "किसी बिंदु की x-अक्ष से दूरी उसके y-निर्देशांक का परिमाण होती है। अतः |−4| = 4।", hint: "x-अक्ष से दूरी y-निर्देशांक का निरपेक्ष मान है।" },
  { chapter: 6, year: 2022, prompt: "A(x + 4, y + 5) तथा B(6 − x, 3 − y) को मिलाने वाले रेखाखंड के मध्य-बिंदु के निर्देशांक हैं—", options: ["(x, y)", "(5, 4)", "(x + 5, y + 4)", "(5/2, 4/2)"], answer: 1, solution: "मध्य-बिंदु = ((x + 4 + 6 − x)/2, (y + 5 + 3 − y)/2) = (10/2, 8/2) = (5, 4)।", hint: "मध्य-बिंदु सूत्र में दोनों x-निर्देशांकों और दोनों y-निर्देशांकों का औसत लें।" },
  { chapter: 7, year: 2021, prompt: "2 sin² 60° cos 60° का मान है—", options: ["4/3", "3/2", "3/4", "1/3"], answer: 2, solution: "sin 60° = √3/2 और cos 60° = 1/2। अतः 2 × (3/4) × (1/2) = 3/4।", hint: "पहले sin² 60° और cos 60° के मान रखें।" },
  { chapter: 7, year: 2022, prompt: "यदि sin A = 1/2 और A न्यून कोण है, तो 2 sin A cos A का मान है—", options: ["1/4", "√3/2", "1", "1/√2"], answer: 1, solution: "A न्यून कोण है, इसलिए cos A = √(1 − sin² A) = √3/2। अतः 2 × 1/2 × √3/2 = √3/2।", hint: "sin² A + cos² A = 1 का उपयोग करके cos A निकालें।" },
  { chapter: 8, year: 2021, prompt: "मीनार के पाद से 100 मीटर दूर बिंदु से शीर्ष का उन्नयन कोण 60° है। मीनार की ऊँचाई होगी—", options: ["100/√3 मीटर", "100√3 मीटर", "50√3 मीटर", "200 मीटर"], answer: 1, solution: "tan 60° = ऊँचाई/100। इसलिए ऊँचाई = 100 × √3 = 100√3 मीटर।", hint: "tan 60° = √3 का उपयोग करें।" },
  { chapter: 8, year: 2022, prompt: "2 tan 30° / (1 − tan² 30°) का मान है—", options: ["1/√3", "1", "0", "√3"], answer: 3, solution: "tan 30° = 1/√3 रखने पर अंश 2/√3 और हर 1 − 1/3 = 2/3 है। भाग देने पर √3 मिलता है।", hint: "tan 30° = 1/√3 रखें और अंश तथा हर को सरल करें।" },
  { chapter: 9, year: 2021, prompt: "तीन भिन्न संरेखीय बिंदुओं से होकर गुजरने वाले वृत्तों की संख्या है—", options: ["एक", "दो", "शून्य", "अनंत"], answer: 2, solution: "तीन भिन्न संरेखीय बिंदु किसी गैर-विकृत वृत्त पर नहीं हो सकते, इसलिए ऐसा कोई वृत्त नहीं है।", hint: "एक वृत्त के केंद्र से तीनों बिंदुओं की दूरियाँ बराबर होनी चाहिए।" },
  { chapter: 12, year: 2021, prompt: "एक बेलन की ऊँचाई 11 सेमी तथा वक्र पृष्ठीय क्षेत्रफल 968 सेमी² है। बेलन की त्रिज्या होगी—", options: ["10 सेमी", "11 सेमी", "12 सेमी", "14 सेमी"], answer: 3, solution: "वक्र पृष्ठीय क्षेत्रफल 2πrh = 968। r = 968/(22π); π = 22/7 रखने पर r = 14 सेमी।", hint: "बेलन का वक्र पृष्ठीय क्षेत्रफल 2πrh होता है।" },
  { chapter: 13, year: 2021, prompt: "आँकड़ों 5, 7, 4, 8, 6 का माध्य है—", options: ["4", "5", "6", "7"], answer: 2, solution: "माध्य = (5 + 7 + 4 + 8 + 6)/5 = 30/5 = 6।", hint: "सभी आँकड़ों का योग लेकर आँकड़ों की संख्या से भाग दें।" },
  { chapter: 13, year: 2022, prompt: "आँकड़ों 2, 0, 7, 3, 4, 8, 1 की माध्यिका है—", options: ["3", "4", "7", "2"], answer: 0, solution: "आरोही क्रम में आँकड़े 0, 1, 2, 3, 4, 7, 8 हैं। सात मानों में बीच का, अर्थात चौथा मान 3 है।", hint: "आँकड़ों को आरोही क्रम में रखें और बीच का मान चुनें।" },
  { chapter: 13, year: 2022, prompt: "वर्ग-अंतराल 0–10, 10–20, 20–30, 30–40, 40–50, 50–60 की बारंबारताएँ क्रमशः 5, x, 20, 15, 7, 5 हैं। यदि बारंबारताओं का योग 60 है, तो x का मान है—", options: ["7", "8", "15", "20"], answer: 1, solution: "5 + x + 20 + 15 + 7 + 5 = 60। अतः x + 52 = 60 और x = 8।", hint: "दी गई सभी बारंबारताओं का योग 60 के बराबर करें।" },
  { chapter: 14, year: 2022, prompt: "एक पासे को एक बार फेंकने पर अभाज्य संख्या प्राप्त होने की प्रायिकता है—", options: ["1/2", "2/3", "0", "1"], answer: 0, solution: "पासे पर अभाज्य अंक 2, 3 और 5 हैं। प्रायिकता = 3/6 = 1/2।", hint: "1 से 6 तक अभाज्य संख्याएँ गिनें।" },
  { chapter: 15, year: 2021, prompt: "14 का वर्ग है—", options: ["144", "169", "196", "225"], answer: 2, solution: "14² = 14 × 14 = 196। यह प्रश्न वैदिक गणित/वर्ग विषय से है, NCERT के 15 अध्यायों से नहीं।", hint: "14 को 14 से गुणा करें।", chapterTitle: "वैदिक गणित / वर्ग" }
].map((question, index) => ({
  ...question,
  bankId: `m-${question.year}-${index + 1}`,
  topic: question.chapterTitle || chapters[question.chapter].title,
  answer: question.options[question.answer],
  difficulty: `${question.year} परीक्षा`,
  examYear: question.year,
  marks: 1,
  sourceType: "past-paper",
  examSession: question.examSession || "M"
}));

const examQuestionHints = [
  "अभाज्य गुणनखंडों और उनके घातों का उपयोग करें।",
  "बहुपद के शून्यकों तथा गुणांकों के संबंध का उपयोग करें।",
  "दिए गए कथन को दो चरों वाला समीकरण बनाकर लिखें।",
  "विविक्तकर b² − 4ac या मूलों की प्रकृति जाँचें।",
  "समांतर श्रेढ़ी के nवें पद या योगफल का सूत्र लगाएँ।",
  "संगत कोणों और भुजाओं के अनुपात की तुलना करें।",
  "दूरी या मध्य-बिंदु का निर्देशांक सूत्र लगाएँ।",
  "उचित त्रिकोणमितीय अनुपात या सर्वसमिका चुनें।",
  "tan θ = ऊँचाई/क्षैतिज दूरी का उपयोग करें।",
  "स्पर्श रेखा, त्रिज्या और केंद्र कोण के गुण याद करें।",
  "वृत्त, त्रिज्यखंड या चाप के क्षेत्रफल/लंबाई का सूत्र लगाएँ।",
  "ठोस आकृति के पृष्ठीय क्षेत्रफल या आयतन का सूत्र लगाएँ।",
  "माध्य, माध्यिका या बहुलक की परिभाषा के अनुसार गणना करें।",
  "आँकड़ों को क्रमबद्ध करके या वर्ग-चिह्न/माध्य का सूत्र लगाएँ।",
  "संभाव्यता और उसकी पूरक घटना के नियम का उपयोग करें।"
];

const additionalExamQuestionBank = window.oldPaperQuestionBank.flatMap(paper =>
  paper.questions.map((question, index) => ({
    ...question,
    bankId: `${paper.session}${paper.year}-${index + 1}`,
    topic: chapters[question.chapter].title,
    year: paper.year,
    examYear: paper.year,
    examSession: paper.session,
    answer: question.options[question.answer],
    hint: question.hint || examQuestionHints[question.chapter],
    difficulty: `${paper.session}${paper.year} परीक्षा`,
    marks: 1,
    sourceType: "past-paper"
  }))
);

const workbookQuestionBank = window.uploadedQuestionBank.map(question => {
  const options = ["A", "B", "C", "D"].map(letter => question[`Option ${letter}`]);
  const correctOptionIndex = ["A", "B", "C", "D"].indexOf(question["Correct Option"]);
  return {
    chapter: Number(question["Chapter No"]) - 1,
    topic: question.Chapter,
    prompt: question.Question,
    options,
    answer: options[correctOptionIndex],
    solution: `अपलोड की गई प्रश्न-फ़ाइल की उत्तर-कुंजी में विकल्प ${question["Correct Option"]} सही चिह्नित है।`,
    hint: "अध्याय के संबंधित नियम या सूत्र का उपयोग करके विकल्प जाँचें।",
    difficulty: "Workbook Quiz",
    marks: 1,
    sourceType: "workbook",
    bankId: `workbook-${question["Question ID"]}`,
    sourceId: question["Question ID"]
  };
});

const partNotes = [
  "मूल अवधारणाओं को समझें और हल करने की शुरुआत करें।",
  "सीखे हुए सूत्रों का इस्तेमाल करके अभ्यास करें।",
  "मिश्रित सवालों से अपनी तैयारी परखें।"
];
const letters = ["अ", "ब", "स", "द"];
const app = document.getElementById("app");
let screen = "home";
let selectedChapter = 0;
let selectedPart = 0;
let questionCount = 10;
let questions = [];
let questionIndex = 0;
let selectedOption = null;
let answers = [];
let message = "";
let selectedSet = 0;
let quizStartedAt = 0;
let quizElapsed = 0;
let timerHandle = null;
let quizMode = "set";
let bankSourceFilter = "all";
let bankYearFilter = "all";
let bankSessionFilter = "all";
let bankChapterFilter = "all";
let editingQuestionId = null;
let storageWarning = "";
let progress = loadProgress();

const defaultQuestionBank = [...examQuestionBank, ...additionalExamQuestionBank, ...workbookQuestionBank];
const bankEditStorageKey = "iMentorMathQuestionBankEdits";
let bankHasLocalEdits = false;
let bankQuestions = loadQuestionBank();

function isValidQuestionBank(value) {
  if (!Array.isArray(value) || value.length === 0) return false;
  const ids = new Set();
  return value.every(question => {
    if (!question || typeof question.bankId !== "string" || ids.has(question.bankId)
      || !Number.isInteger(question.chapter) || question.chapter < 0 || question.chapter > 15
      || typeof question.prompt !== "string" || !question.prompt.trim()
      || !Array.isArray(question.options) || question.options.length !== 4
      || question.options.some(option => typeof option !== "string" || !option.trim())
      || !question.options.includes(question.answer)
      || typeof question.solution !== "string" || !question.solution.trim()
      || typeof question.hint !== "string" || !question.hint.trim()
      || !["past-paper", "workbook"].includes(question.sourceType)) return false;
    ids.add(question.bankId);
    return true;
  });
}

function loadQuestionBank() {
  try {
    const saved = localStorage.getItem(bankEditStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!isValidQuestionBank(parsed)) throw new Error("Saved question-bank edits have an invalid format.");
      bankHasLocalEdits = true;
      return parsed;
    }
  } catch (error) {
    console.error("Saved question-bank edits could not be read:", error);
    storageWarning = "स्थानीय प्रश्न-बैंक बदलाव पढ़े नहीं जा सके। प्रकाशित प्रश्न-बैंक दिखाया गया है।";
  }

  const publishedOverrides = window.questionBankOverrides;
  if (publishedOverrides !== null && publishedOverrides !== undefined) {
    if (isValidQuestionBank(publishedOverrides)) return publishedOverrides;
    const error = new Error("The published question-bank override has an invalid format.");
    console.error("Published question-bank edits could not be loaded:", error);
    storageWarning = "प्रकाशित प्रश्न-बैंक फ़ाइल का प्रारूप अमान्य है। मूल प्रश्न-बैंक दिखाया गया है।";
  }
  return defaultQuestionBank;
}

function saveQuestionBank() {
  try {
    localStorage.setItem(bankEditStorageKey, JSON.stringify(bankQuestions));
    bankHasLocalEdits = true;
    storageWarning = "";
    return true;
  } catch (error) {
    console.error("Question-bank edits could not be saved in this browser:", error);
    storageWarning = "बदलाव इस ब्राउज़र में सेव नहीं हुए। GitHub के लिए फ़ाइल डाउनलोड करके उन्हें सुरक्षित रखें।";
    return false;
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("iMentorMathProgress") || "{}");
    return {
      attempts: Array.isArray(saved.attempts) ? saved.attempts : [],
      mistakes: Array.isArray(saved.mistakes) ? saved.mistakes : []
    };
  } catch (error) {
    console.error("Saved learning progress could not be read:", error);
    storageWarning = "पिछली प्रगति पढ़ी नहीं जा सकी; इस सत्र की प्रगति फिर भी उपलब्ध रहेगी।";
    return { attempts: [], mistakes: [] };
  }
}

function saveProgress() {
  try {
    localStorage.setItem("iMentorMathProgress", JSON.stringify(progress));
    storageWarning = "";
    return true;
  } catch (error) {
    console.error("Learning progress could not be saved:", error);
    storageWarning = "प्रगति इस डिवाइस पर सेव नहीं हो सकी। ब्राउज़र की स्टोरेज सेटिंग जाँचें।";
    return false;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function stopQuizTimer() {
  if (timerHandle !== null) {
    window.clearInterval(timerHandle);
    timerHandle = null;
  }
}

function beginQuizTimer() {
  stopQuizTimer();
  quizStartedAt = Date.now();
  quizElapsed = 0;
  timerHandle = window.setInterval(() => {
    quizElapsed = Math.floor((Date.now() - quizStartedAt) / 1000);
    const timer = app.querySelector("#quizTimer");
    if (timer) timer.textContent = formatTime(quizElapsed);
  }, 1000);
}

function getChapterAttempts(chapterIndex) {
  return progress.attempts.filter(attempt => attempt.chapter === chapterIndex);
}

function getChapterAccuracy(chapterIndex) {
  const attempts = getChapterAttempts(chapterIndex);
  const answered = attempts.reduce((sum, attempt) => sum + attempt.answered, 0);
  const correct = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  return answered ? Math.round(correct / answered * 100) : 0;
}

function saveQuizResult() {
  const answered = answers.filter(answer => answer !== null).length;
  const correct = answers.reduce((sum, answer, index) => sum + (answer === questions[index].answer ? 1 : 0), 0);
  const topicTotals = new Map();
  questions.forEach((question, index) => {
    const topic = topicTotals.get(question.topic) || { total: 0, correct: 0 };
    topic.total += 1;
    if (answers[index] === question.answer) topic.correct += 1;
    topicTotals.set(question.topic, topic);
  });
  progress.attempts.push({
    chapter: selectedChapter,
    set: selectedSet,
    mode: quizMode,
    correct,
    answered,
    total: questions.length,
    elapsed: quizElapsed,
    topics: [...new Set(questions.map(question => question.topic))],
    topicResults: [...topicTotals].map(([topic, result]) => ({ topic, ...result })),
    missedTopics: [...new Set(questions
      .filter((question, index) => answers[index] !== question.answer)
      .map(question => question.topic))],
    completedAt: new Date().toISOString()
  });
  questions.forEach((question, index) => {
    if (answers[index] !== null && answers[index] !== question.answer) {
      const key = `${selectedChapter}:${question.prompt}`;
      if (!progress.mistakes.some(mistake => mistake.key === key)) {
        progress.mistakes.push({
          key,
          chapter: selectedChapter,
          part: selectedPart,
          prompt: question.prompt,
          answer: question.answer,
          solution: question.solution,
          hint: question.hint
        });
      }
    }
  });
  saveProgress();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

function goHome() {
  stopQuizTimer();
  screen = "home";
  render();
  window.scrollTo(0, 0);
}

function setScreen(next) {
  screen = next;
  message = "";
  render();
  window.scrollTo(0, 0);
}

function breadcrumb(current) {
  return `<nav class="breadcrumb"><button data-action="home">कक्षा 10 गणित</button><span>›</span><span>${escapeHTML(chapters[selectedChapter].title)}</span>${current ? `<span>›</span><span>${current}</span>` : ""}</nav>`;
}

function bankBreadcrumb(current = "") {
  return `<nav class="breadcrumb"><button data-action="home">कक्षा 10 गणित</button><span>›</span><span>पिछले वर्षों के प्रश्न</span>${current ? `<span>›</span><span>${escapeHTML(current)}</span>` : ""}</nav>`;
}

function renderHome() {
  const totalAttempts = progress.attempts.length;
  const attemptedQuestions = progress.attempts.reduce((sum, attempt) => sum + attempt.answered, 0);
  const correctAnswers = progress.attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const averageScore = totalAttempts
    ? Math.round(progress.attempts.reduce((sum, attempt) => sum + attempt.correct / attempt.total, 0) / totalAttempts * 100)
    : 0;
  const topicTotals = new Map();
  progress.attempts.forEach(attempt => (attempt.topicResults || []).forEach(result => {
    const topic = topicTotals.get(result.topic) || { total: 0, correct: 0 };
    topic.total += result.total;
    topic.correct += result.correct;
    topicTotals.set(result.topic, topic);
  }));
  const rankedTopics = [...topicTotals].map(([topic, result]) => ({
    topic,
    accuracy: Math.round(result.correct / result.total * 100)
  }));
  const weakTopics = rankedTopics.filter(topic => topic.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const strongTopics = rankedTopics.filter(topic => topic.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">आपका गणित अभ्यास साथी</p><h1>नमस्ते विद्यार्थी 👋<br>मज़बूत करें अपनी तैयारी।</h1><p>अभ्यास करें, समाधान समझें और अपनी प्रगति देखें।</p></div>
      <div class="hero-art" aria-hidden="true"><span>π</span></div>
    </section>
    <section class="dashboard-stats" aria-label="आपकी प्रगति">
      <article class="dashboard-stat"><strong>${totalAttempts}</strong><span>कुल क्विज़</span></article>
      <article class="dashboard-stat"><strong>${attemptedQuestions}</strong><span>दिए गए प्रश्न</span></article>
      <article class="dashboard-stat"><strong>${averageScore}%</strong><span>औसत स्कोर</span></article>
      <article class="dashboard-stat"><strong>${attemptedQuestions ? Math.round(correctAnswers / attemptedQuestions * 100) : 0}%</strong><span>सटीकता</span></article>
      <button class="secondary-button dashboard-link" data-action="mistakes">मेरी गलतियाँ (${progress.mistakes.length})</button>
    </section>
    ${storageWarning ? `<p class="storage-warning" role="status">${escapeHTML(storageWarning)}</p>` : ""}
    <section class="dashboard-progress">
      <div class="section-heading"><div><h2>आपकी अध्याय प्रगति</h2><p>हर अध्याय का अभ्यास स्कोर</p></div></div>
      <div class="chapter-progress-list">${chapters.map((chapter, index) => {
        const accuracy = getChapterAccuracy(index);
        const attempts = getChapterAttempts(index).length;
        return `<div class="chapter-progress-row"><span>${escapeHTML(chapter.title)}</span><div class="mini-progress"><i style="width:${accuracy}%"></i></div><strong>${attempts ? `${accuracy}%` : "—"}</strong></div>`;
      }).join("")}</div>
    </section>
    ${rankedTopics.length ? `<section class="topic-insights">
      <article><h2>अभ्यास की ज़रूरत</h2>${weakTopics.length ? weakTopics.map(topic => `<p><span>${escapeHTML(topic.topic)}</span><strong>${topic.accuracy}%</strong></p>`).join("") : "<p>अभी कोई कमजोर विषय नहीं। अभ्यास जारी रखें!</p>"}</article>
      <article><h2>मज़बूत विषय</h2>${strongTopics.length ? strongTopics.map(topic => `<p><span>${escapeHTML(topic.topic)}</span><strong>${topic.accuracy}%</strong></p>`).join("") : "<p>अभ्यास के बाद आपके मज़बूत विषय यहाँ दिखेंगे।</p>"}</article>
    </section>` : ""}
    <section class="upload-card" aria-labelledby="uploadTitle">
      <div class="upload-icon" aria-hidden="true">↑</div>
      <div class="upload-copy">
        <h2 id="uploadTitle">प्रश्न-उत्तर अपलोड करें</h2>
        <p>अपनी प्रश्न फ़ाइल चुनें — PDF, Word, Excel या CSV।</p>
        <p class="upload-note">प्रश्न बैंक में फ़ाइल आयात सुविधा उपलब्ध नहीं है।</p>
        <p id="uploadStatus" class="upload-status" role="status" aria-live="polite">कोई फ़ाइल नहीं चुनी गई</p>
      </div>
      <label class="primary-button upload-button" for="questionFile">फ़ाइल चुनें</label>
      <input id="questionFile" class="file-input" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv">
    </section>
    <section class="exam-bank-card" aria-labelledby="examBankTitle">
      <div class="upload-icon" aria-hidden="true">✓</div>
      <div><h2 id="examBankTitle">गणित वस्तुनिष्ठ प्रश्न बैंक</h2><p>M2021–M2026 और S2024–S2026 के 136 प्रश्न तथा Workbook Quiz के 75 प्रश्न — अध्याय, वर्ष और परीक्षा सत्र के अनुसार।</p></div>
      <button class="primary-button" id="openExamBank">प्रश्न बैंक खोलें →</button>
    </section>
    <section>
      <div class="section-heading"><div><h2>अपना अध्याय चुनें</h2><p>अपनी गति से सीखें और अभ्यास करें</p></div><span class="count-label">कुल ${chapters.length} अध्याय</span></div>
      <div class="chapter-grid">${chapters.map((chapter, index) => `
        <button class="chapter-card" style="--accent:${chapter.accent}" data-chapter="${index}">
          <span class="card-top"><span class="chapter-number">${String(index + 1).padStart(2, "0")}</span><span class="card-arrow">↗</span></span>
          <h3>${escapeHTML(chapter.title)}</h3><p>10 अभ्यास सेट <span>·</span> अपनी तैयारी जाँचें</p>
        </button>`).join("")}
      </div>
    </section>`;
  app.querySelectorAll("[data-chapter]").forEach(button => button.addEventListener("click", () => {
    selectedChapter = Number(button.dataset.chapter);
    setScreen("chapter");
  }));
  app.querySelector('[data-action="mistakes"]').addEventListener("click", () => setScreen("mistakes"));
  app.querySelector("#openExamBank").addEventListener("click", () => setScreen("bank"));
  app.querySelector("#questionFile").addEventListener("change", event => {
    const file = event.target.files[0];
    app.querySelector("#uploadStatus").textContent = file
      ? `${file.name} चुनी गई (${formatFileSize(file.size)})`
      : "कोई फ़ाइल नहीं चुनी गई";
  });
}

function getFilteredExamQuestions() {
  return bankQuestions.filter(question =>
    (bankSourceFilter === "all" || question.sourceType === bankSourceFilter)
    && (bankYearFilter === "all" || question.year === Number(bankYearFilter))
    && (bankSessionFilter === "all" || question.examSession === bankSessionFilter)
    && (bankChapterFilter === "all" || question.chapter === Number(bankChapterFilter))
  );
}

function renderQuestionEditor(question) {
  const chapterOptions = chapters.map((chapter, index) =>
    `<option value="${index}" ${question.chapter === index ? "selected" : ""}>अध्याय ${index + 1} — ${escapeHTML(chapter.title)}</option>`
  ).join("");
  const specialChapterOption = `<option value="15" ${question.chapter === 15 ? "selected" : ""}>वैदिक गणित / वर्ग (विशेष)</option>`;
  const yearOptions = [2021, 2022, 2023, 2024, 2025, 2026].map(year =>
    `<option value="${year}" ${question.year === year ? "selected" : ""}>${year}</option>`
  ).join("");
  const correctOption = question.options.indexOf(question.answer);
  return `<form class="question-editor" data-editor="${escapeHTML(question.bankId)}">
    <label class="editor-wide">प्रश्न<textarea name="prompt" rows="3" required>${escapeHTML(question.prompt)}</textarea></label>
    <label>अध्याय<select name="chapter" required>${chapterOptions}${specialChapterOption}</select></label>
    <label>परीक्षा वर्ष<select name="year" ${question.sourceType === "workbook" ? "disabled" : ""}>${yearOptions}</select></label>
    <label>परीक्षा सत्र<select name="session" ${question.sourceType === "workbook" ? "disabled" : ""}><option value="M" ${question.examSession !== "S" ? "selected" : ""}>मुख्य (M)</option><option value="S" ${question.examSession === "S" ? "selected" : ""}>पूरक (S)</option></select></label>
    ${question.options.map((option, index) => `<label>विकल्प ${letters[index]}<input name="option${index}" value="${escapeHTML(option)}" required></label>`).join("")}
    <label>सही विकल्प<select name="answer" required>${question.options.map((option, index) => `<option value="${index}" ${correctOption === index ? "selected" : ""}>${letters[index]}</option>`).join("")}</select></label>
    <label class="editor-wide">हल / उत्तर-कुंजी<textarea name="solution" rows="3" required>${escapeHTML(question.solution)}</textarea></label>
    <label class="editor-wide">संकेत<textarea name="hint" rows="2" required>${escapeHTML(question.hint)}</textarea></label>
    <div class="editor-actions editor-wide"><button class="primary-button" type="submit">बदलाव सेव करें</button><button class="secondary-button" type="button" data-cancel-edit>रद्द करें</button></div>
  </form>`;
}

function downloadQuestionBank() {
  const source = `window.questionBankOverrides = ${JSON.stringify(bankQuestions, null, 2).replace(/</g, "\\u003c")};\n`;
  const blob = new Blob([source], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "question-bank-overrides.js";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  const status = app.querySelector("#bankEditStatus");
  if (status) status.textContent = "फ़ाइल डाउनलोड हो गई। इसे question-bank-overrides.js के रूप में app की फ़ाइल से बदलें, फिर GitHub पर commit/push करें।";
}

function resetQuestionBankEdits() {
  if (!window.confirm("इस ब्राउज़र में किए गए सभी प्रश्न-बैंक बदलाव हटाकर प्रकाशित प्रश्न-बैंक फिर से लोड करें?")) return;
  try {
    localStorage.removeItem(bankEditStorageKey);
    bankQuestions = isValidQuestionBank(window.questionBankOverrides) ? window.questionBankOverrides : defaultQuestionBank;
    bankHasLocalEdits = false;
    editingQuestionId = null;
    storageWarning = "";
    renderExamBank();
  } catch (error) {
    console.error("Local question-bank edits could not be reset:", error);
    storageWarning = "इस ब्राउज़र के स्थानीय बदलाव नहीं हटाए जा सके।";
    renderExamBank();
  }
}

function renderExamBank() {
  const filteredQuestions = getFilteredExamQuestions();
  const chapterOptions = chapters.map((chapter, index) =>
    `<option value="${index}" ${bankChapterFilter === String(index) ? "selected" : ""}>अध्याय ${index + 1} — ${escapeHTML(chapter.title)}</option>`
  ).join("");
  const specialChapterSelected = bankChapterFilter === "15";
  app.innerHTML = `${bankBreadcrumb()}
    <div class="section-heading exam-bank-heading"><div><p class="eyebrow">M2021–M2026 · S2024–S2026 · Workbook Quiz</p><h1>वस्तुनिष्ठ प्रश्न बैंक</h1><p>स्रोत, परीक्षा वर्ष, सत्र और अध्याय चुनें; उत्तर व हल देखने के लिए प्रश्न खोलें।</p></div><span class="count-label">${filteredQuestions.length} प्रश्न</span></div>
    <section class="bank-publish-tools" aria-label="प्रश्न बैंक संपादन और प्रकाशन">
      <p id="bankEditStatus" role="status" aria-live="polite">${bankHasLocalEdits ? "स्थानीय बदलाव इस ब्राउज़र में सेव हैं। GitHub पर दिखाने के लिए अद्यतन बैंक फ़ाइल डाउनलोड करें।" : "प्रश्न संपादित/हटाने के बाद बदलाव पहले इसी ब्राउज़र में सेव होंगे; GitHub पर प्रकाशित करने के लिए बैंक फ़ाइल डाउनलोड करें।"}</p>
      <div><button class="secondary-button" id="downloadQuestionBank">GitHub के लिए प्रश्न बैंक डाउनलोड करें</button>${bankHasLocalEdits ? '<button class="secondary-button" id="resetQuestionBank">स्थानीय बदलाव हटाएँ</button>' : ""}</div>
      ${storageWarning ? `<p class="storage-warning" role="alert">${escapeHTML(storageWarning)}</p>` : ""}
    </section>
    <section class="exam-bank-filters" aria-label="प्रश्न छाँटें">
      <label>प्रश्न स्रोत<select id="bankSourceFilter"><option value="all" ${bankSourceFilter === "all" ? "selected" : ""}>सभी स्रोत</option><option value="past-paper" ${bankSourceFilter === "past-paper" ? "selected" : ""}>बोर्ड प्रश्नपत्र</option><option value="workbook" ${bankSourceFilter === "workbook" ? "selected" : ""}>Workbook Quiz</option></select></label>
      <label>${bankSourceFilter === "workbook" ? "परीक्षा वर्ष (फ़ाइल में उपलब्ध नहीं)" : "परीक्षा वर्ष"}<select id="bankYearFilter" ${bankSourceFilter === "workbook" ? "disabled" : ""}><option value="all" ${bankYearFilter === "all" ? "selected" : ""}>${bankSourceFilter === "workbook" ? "उपलब्ध नहीं" : "सभी वर्ष"}</option>${bankSourceFilter === "workbook" ? "" : [2021, 2022, 2023, 2024, 2025, 2026].map(year => `<option value="${year}" ${bankYearFilter === String(year) ? "selected" : ""}>${year}</option>`).join("")}</select></label>
      <label>परीक्षा सत्र<select id="bankSessionFilter" ${bankSourceFilter === "workbook" ? "disabled" : ""}><option value="all" ${bankSessionFilter === "all" ? "selected" : ""}>सभी सत्र</option><option value="M" ${bankSessionFilter === "M" ? "selected" : ""}>मुख्य (M)</option><option value="S" ${bankSessionFilter === "S" ? "selected" : ""}>पूरक (S)</option></select></label>
      <label>अध्याय<select id="bankChapterFilter"><option value="all" ${bankChapterFilter === "all" ? "selected" : ""}>सभी अध्याय</option>${chapterOptions}<option value="15" ${specialChapterSelected ? "selected" : ""}>वैदिक गणित / वर्ग (विशेष)</option></select></label>
      ${filteredQuestions.length ? `<button class="primary-button" id="startExamQuiz">इन ${filteredQuestions.length} प्रश्नों का क्विज़ शुरू करें →</button>` : ""}
    </section>
    ${filteredQuestions.length ? `<section class="exam-question-list" aria-label="प्रश्न सूची">${filteredQuestions.map((question, index) => `<details class="exam-question-card" ${editingQuestionId === question.bankId ? "open" : ""}>
      <summary><span class="exam-question-number">${index + 1}</span><span class="exam-question-heading"><span class="exam-question-meta">${question.year ? `${question.examSession === "S" ? "पूरक" : "मुख्य"} ${question.year} परीक्षा` : "Workbook Quiz"} · ${escapeHTML(question.topic)}</span><strong>${escapeHTML(question.prompt)}</strong></span><span class="card-arrow" aria-hidden="true">⌄</span></summary>
      <ol class="exam-options">${question.options.map((option, optionIndex) => `<li><span>${letters[optionIndex]}.</span> ${escapeHTML(option)}</li>`).join("")}</ol>
      <div class="exam-answer"><p><strong>सही उत्तर:</strong> ${letters[question.options.indexOf(question.answer)]}. ${escapeHTML(question.answer)}</p><p><strong>${question.sourceType === "workbook" ? "उत्तर-कुंजी:" : "हल:"}</strong> ${escapeHTML(question.solution)}</p></div>
      <div class="bank-question-actions"><button class="secondary-button" type="button" data-edit-question="${escapeHTML(question.bankId)}">संपादित करें</button><button class="secondary-button" type="button" data-delete-question="${escapeHTML(question.bankId)}">हटाएँ</button></div>
      ${editingQuestionId === question.bankId ? renderQuestionEditor(question) : ""}
    </details>`).join("")}</section>` : `<div class="empty-state">इस अध्याय और वर्ष के लिए कोई MCQ उपलब्ध नहीं है। कोई दूसरा फ़िल्टर चुनें।</div>`}`;
  app.querySelector('[data-action="home"]').addEventListener("click", goHome);
  app.querySelector("#downloadQuestionBank").addEventListener("click", downloadQuestionBank);
  const resetButton = app.querySelector("#resetQuestionBank");
  if (resetButton) resetButton.addEventListener("click", resetQuestionBankEdits);
  app.querySelector("#bankSourceFilter").addEventListener("change", event => {
    bankSourceFilter = event.target.value;
    bankYearFilter = "all";
    bankSessionFilter = "all";
    renderExamBank();
  });
  app.querySelector("#bankYearFilter").addEventListener("change", event => {
    bankYearFilter = event.target.value;
    renderExamBank();
  });
  app.querySelector("#bankSessionFilter").addEventListener("change", event => {
    bankSessionFilter = event.target.value;
    renderExamBank();
  });
  app.querySelector("#bankChapterFilter").addEventListener("change", event => {
    bankChapterFilter = event.target.value;
    renderExamBank();
  });
  app.querySelectorAll("[data-edit-question]").forEach(button => button.addEventListener("click", () => {
    editingQuestionId = button.dataset.editQuestion;
    renderExamBank();
  }));
  app.querySelectorAll("[data-delete-question]").forEach(button => button.addEventListener("click", () => {
    if (!window.confirm("क्या आप इस प्रश्न को प्रश्न-बैंक से हटाना चाहते हैं?")) return;
    bankQuestions = bankQuestions.filter(question => question.bankId !== button.dataset.deleteQuestion);
    editingQuestionId = null;
    saveQuestionBank();
    renderExamBank();
  }));
  app.querySelectorAll("[data-cancel-edit]").forEach(button => button.addEventListener("click", () => {
    editingQuestionId = null;
    renderExamBank();
  }));
  app.querySelectorAll("[data-editor]").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(form);
    const bankId = form.dataset.editor;
    const currentQuestion = bankQuestions.find(question => question.bankId === bankId);
    if (!currentQuestion) {
      const error = new Error(`Question ${bankId} no longer exists in the bank.`);
      console.error("Question-bank edit could not be applied:", error);
      storageWarning = "यह प्रश्न अब बैंक में नहीं है; पृष्ठ को फिर से खोलकर बदलाव करें।";
      renderExamBank();
      return;
    }
    const chapter = Number(formData.get("chapter"));
    const options = [0, 1, 2, 3].map(index => String(formData.get(`option${index}`)).trim());
    if (!Number.isInteger(chapter) || chapter < 0 || chapter > 15 || options.some(option => !option)) {
      storageWarning = "अध्याय और चारों विकल्प जाँचकर फिर सेव करें।";
      renderExamBank();
      return;
    }
    const answerIndex = Number(formData.get("answer"));
    const updatedQuestion = {
      ...currentQuestion,
      chapter,
      topic: chapter === 15 ? "वैदिक गणित / वर्ग" : chapters[chapter].title,
      prompt: String(formData.get("prompt")).trim(),
      options,
      answer: options[answerIndex],
      solution: String(formData.get("solution")).trim(),
      hint: String(formData.get("hint")).trim()
    };
    if (currentQuestion.sourceType === "past-paper") {
      updatedQuestion.year = Number(formData.get("year"));
      updatedQuestion.examYear = updatedQuestion.year;
      updatedQuestion.examSession = String(formData.get("session"));
      updatedQuestion.difficulty = `${updatedQuestion.examSession}${updatedQuestion.year} परीक्षा`;
    }
    if (!updatedQuestion.prompt || !updatedQuestion.solution || !updatedQuestion.hint
      || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3
      || (currentQuestion.sourceType === "past-paper" && (![2021, 2022, 2023, 2024, 2025, 2026].includes(updatedQuestion.year)
        || !["M", "S"].includes(updatedQuestion.examSession)))) {
      storageWarning = "प्रश्न, उत्तर, हल, संकेत और परीक्षा विवरण जाँचकर फिर सेव करें।";
      renderExamBank();
      return;
    }
    bankQuestions = bankQuestions.map(question => question.bankId === bankId ? updatedQuestion : question);
    editingQuestionId = null;
    saveQuestionBank();
    renderExamBank();
  }));
  const startButton = app.querySelector("#startExamQuiz");
  if (startButton) startButton.addEventListener("click", startExamQuiz);
}

function startExamQuiz() {
  questions = getFilteredExamQuestions().map(question => ({ ...question }));
  if (!questions.length) return;
  quizMode = "bank";
  questionCount = questions.length;
  selectedChapter = questions[0].chapter < chapters.length ? questions[0].chapter : 0;
  startQuiz();
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderChapter() {
  const chapter = chapters[selectedChapter];
  const attempts = getChapterAttempts(selectedChapter);
  const completedSets = new Set(attempts.filter(attempt => attempt.mode === "set").map(attempt => attempt.set));
  app.innerHTML = `${breadcrumb("")}
    <div class="page-title-row">
      <div class="chapter-title"><span class="chapter-number" style="--accent:${chapter.accent}">${String(selectedChapter + 1).padStart(2, "0")}</span><div><h1>${escapeHTML(chapter.title)}</h1><p>अवधारणा से अभ्यास तक — अपनी तैयारी के अनुसार आगे बढ़ें।</p></div></div>
      <div class="stats-card"><span class="stats-symbol">✓</span><span><strong>${completedSets.size}/10 सेट पूरे</strong><br>${attempts.length ? `औसत स्कोर ${getChapterAccuracy(selectedChapter)}%` : "हर सेट में 10 प्रश्न"}</span></div>
    </div>
    <div class="section-heading"><div><h2>अध्याय के 10 अभ्यास सेट</h2><p>आसान अभ्यास से HOTS और बोर्ड स्तर तक</p></div></div>
    <section class="part-list">${Array.from({ length: 10 }, (_, index) => {
      const difficulty = getDifficulty(index);
      const topicIndex = index % chapter.topics.length;
      const latestAttempt = attempts.filter(attempt => attempt.set === index && attempt.mode === "set").slice(-1)[0];
      return `<article class="part-card"><span class="part-icon">सेट ${index + 1}</span>
        <div><h3>${escapeHTML(chapter.topics[topicIndex])}</h3><p>${partNotes[index % partNotes.length]}</p><div class="part-meta"><span class="difficulty-tag ${difficulty.className}">${difficulty.icon} ${difficulty.label}</span><span>·</span><span>10 प्रश्न</span>${latestAttempt ? `<span>·</span><span>पिछला स्कोर ${Math.round(latestAttempt.correct / latestAttempt.total * 100)}%</span>` : ""}</div></div>
        <button class="primary-button" data-set="${index}">${completedSets.has(index) ? "फिर अभ्यास करें" : "अभ्यास शुरू करें"} <span aria-hidden="true">→</span></button>
      </article>`}).join("")}
    </section>
    <section class="chapter-test-card"><div><h2>अध्याय मास्टर टेस्ट</h2><p>30 प्रश्नों से पूरे अध्याय की तैयारी जाँचें।</p></div><button class="primary-button" id="chapterTest">टेस्ट शुरू करें →</button></section>`;
  app.querySelector('[data-action="home"]').addEventListener("click", goHome);
  app.querySelectorAll("[data-set]").forEach(button => button.addEventListener("click", () => {
    selectedSet = Number(button.dataset.set);
    selectedPart = selectedSet % chapter.topics.length;
    questionCount = 10;
    quizMode = "set";
    startQuiz();
  }));
  app.querySelector("#chapterTest").addEventListener("click", () => {
    selectedSet = 9;
    selectedPart = 0;
    questionCount = 30;
    quizMode = "chapter";
    startQuiz();
  });
}

function getDifficulty(setIndex) {
  if (setIndex < 2) return { label: "आसान", icon: "🟢", className: "easy" };
  if (setIndex < 5) return { label: "मध्यम", icon: "🟡", className: "medium" };
  if (setIndex < 7) return { label: "कठिन", icon: "🔴", className: "hard" };
  if (setIndex < 9) return { label: "HOTS", icon: "⭐", className: "hots" };
  return { label: "बोर्ड स्तर", icon: "🏆", className: "board" };
}

function renderCountPicker() {
  app.innerHTML = `${breadcrumb("अभ्यास")}
    <section class="quiz-layout">
      <div class="question-card">
        <p class="eyebrow">भाग ${selectedPart + 1} · ${escapeHTML(chapters[selectedChapter].topics[selectedPart])}</p>
        <h1 style="font-size:25px">कितने प्रश्नों का अभ्यास करना चाहेंगे?</h1>
        <p class="subheading">प्रश्नों के बाद आपको परिणाम, उत्तर-पत्रिका और हर सवाल का हल मिलेगा।</p>
        <div class="count-options">
          ${[10, 20, 30].map(count => `<button class="count-option ${count === 10 ? "active" : ""}" data-count="${count}"><strong>${count}</strong><span>प्रश्न</span></button>`).join("")}
        </div>
        <div class="quiz-actions"><span class="hint">बाद में उत्तर-पत्रिका देख सकते हैं</span><button id="startQuiz" class="primary-button">क्विज़ शुरू करें →</button></div>
      </div>
    </section>`;
  app.querySelector('[data-action="home"]').addEventListener("click", goHome);
  app.querySelectorAll("[data-count]").forEach(button => button.addEventListener("click", () => {
    questionCount = Number(button.dataset.count);
    app.querySelectorAll("[data-count]").forEach(item => item.classList.toggle("active", item === button));
  }));
  app.querySelector("#startQuiz").addEventListener("click", startQuiz);
}

function makeQuestion(chapterIndex, part, n) {
  const chapter = chapters[chapterIndex];
  const level = part + 1;
  const i = n + 1;
  let prompt, answer, solution;
  switch (chapter.type) {
    case "hcf": {
      const a = 24 + i * (level + 1), b = 12 + i * level;
      const gcd = (x, y) => y ? gcd(y, x % y) : x;
      answer = gcd(a, b);
      prompt = `${a} और ${b} का महत्तम समापवर्तक (म.स.) क्या है?`;
      const divisions = [];
      let dividend = a, divisor = b;
      while (divisor !== 0) {
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;
        divisions.push(`${dividend} = ${divisor} × ${quotient}${remainder ? ` + ${remainder}` : ""}`);
        dividend = divisor;
        divisor = remainder;
      }
      solution = `यूक्लिड विभाजन एल्गोरिथ्म से: ${divisions.join("; ")}। अंतिम गैर-शून्य शेषफल ${answer} है, इसलिए म.स. = ${answer}।`;
      break;
    }
    case "poly": {
      const r1 = i + level, r2 = r1 + 2;
      const sum = r1 + r2;
      prompt = `यदि द्विघात बहुपद के शून्यक ${r1} और ${r2} हैं, तो शून्यकों का योग कितना है?`;
      answer = sum;
      solution = `शून्यकों का योग = ${r1} + ${r2} = ${sum}। गुणांकों के रूप में, यदि बहुपद ax² + bx + c है तो योग −b/a होता है।`;
      break;
    }
    case "linear": {
      const x = i + level, y = i + 2;
      const sum = x + y, diff = x - y;
      prompt = `समीकरण x + y = ${sum} और x − y = ${diff} का हल क्या है?`;
      answer = `x = ${x}, y = ${y}`;
      solution = `दोनों समीकरण जोड़ें: 2x = ${sum + diff}, अतः x = ${x}। अब x + y = ${sum} में रखें: y = ${sum} − ${x} = ${y}।`;
      break;
    }
    case "quadratic": {
      const r1 = i + 1, r2 = i + level + 2, sum = r1 + r2, product = r1 * r2;
      prompt = `x² − ${sum}x + ${product} = 0 के मूल क्या हैं?`;
      answer = `${r1} और ${r2}`;
      solution = `ऐसी दो संख्याएँ खोजें जिनका योग ${sum} और गुणनफल ${product} हो: ${r1}, ${r2}। इसलिए (x − ${r1})(x − ${r2}) = 0 और x = ${r1} या x = ${r2}।`;
      break;
    }
    case "ap": {
      const first = 3 + level, d = 2 + (i % 4), term = first + (i + 2) * d;
      prompt = `समांतर श्रेढ़ी ${first}, ${first + d}, ${first + 2 * d}, … का ${i + 3}वाँ पद ज्ञात करें।`;
      answer = term;
      solution = `यहाँ प्रथम पद a = ${first}, सार्व अंतर d = ${d}, n = ${i + 3}। aₙ = a + (n − 1)d = ${first} + ${i + 2} × ${d} = ${term}।`;
      break;
    }
    case "triangle": {
      const ratio = 2 + (i % 3), small = i + 2, large = small * ratio;
      prompt = `दो समरूप त्रिभुजों की संगत भुजाओं का अनुपात 1:${ratio} है। छोटे त्रिभुज की भुजा ${small} cm हो, तो संगत बड़ी भुजा कितनी होगी?`;
      answer = `${large} cm`;
      solution = `समरूप त्रिभुजों में संगत भुजाओं का अनुपात समान रहता है। बड़ी भुजा = ${small} × ${ratio} = ${large} cm।`;
      break;
    }
    case "coordinate": {
      const x1 = i, x2 = x1 + 3 + level, y = i % 5;
      const d = x2 - x1;
      prompt = `बिंदुओं (${x1}, ${y}) और (${x2}, ${y}) के बीच की दूरी कितनी है?`;
      answer = `${d} इकाई`;
      solution = `दूरी सूत्र से d = √[(${x2} − ${x1})² + (${y} − ${y})²] = √(${d}²) = ${d} इकाई।`;
      break;
    }
    case "trig": {
      const values = [["0°", "0"], ["30°", "1/2"], ["45°", "1/√2"], ["60°", "√3/2"]];
      const [angle, val] = values[(i + part) % values.length];
      prompt = `sin ${angle} का मान क्या है?`;
      answer = val;
      solution = `विशेष कोणों के त्रिकोणमितीय मानों की सारणी के अनुसार sin ${angle} = ${val}।`;
      break;
    }
    case "application": {
      const dist = 5 + i, height = dist;
      prompt = `किसी बिंदु से मीनार के पाद की दूरी ${dist} m है और उन्नयन कोण 45° है। मीनार की ऊँचाई (आँख की ऊँचाई छोड़कर) क्या होगी?`;
      answer = `${height} m`;
      solution = `tan 45° = ऊँचाई/दूरी = 1। इसलिए ऊँचाई = ${dist} × 1 = ${height} m।`;
      break;
    }
    case "circle": {
      prompt = `वृत्त की स्पर्श रेखा, स्पर्श बिंदु पर खींची गई त्रिज्या के साथ कौन-सा कोण बनाती है?`;
      answer = "90°";
      solution = `स्पर्श रेखा का प्रमेय: वृत्त के स्पर्श बिंदु पर त्रिज्या और स्पर्श रेखा परस्पर लंबवत होते हैं। अतः कोण 90° है।`;
      break;
    }
    case "construction": {
      const division = [2, 3, 4, 5][i % 4];
      prompt = `किसी रेखाखंड को ${division} बराबर भागों में बाँटने की रचना में सहायक किरण पर कितने समान अंतराल लेने चाहिए?`;
      answer = division;
      solution = `रेखाखंड को n बराबर भागों में बाँटने के लिए सहायक किरण पर n समान अंतराल लेते हैं। यहाँ n = ${division}, इसलिए ${division} अंतराल चाहिए।`;
      break;
    }
    case "area": {
      const r = i + level;
      if (part === 0) {
        prompt = `त्रिज्या ${r} cm वाले वृत्त का क्षेत्रफल (π के रूप में) कितना होगा?`;
        answer = `${r * r}π cm²`;
        solution = `वृत्त का क्षेत्रफल = πr² = π × ${r}² = ${r * r}π cm²।`;
      } else if (part === 1) {
        prompt = `त्रिज्या ${r} cm और केंद्रीय कोण 90° वाले त्रिज्यखंड का क्षेत्रफल (π के रूप में) कितना है?`;
        answer = `${r * r}π/4 cm²`;
        solution = `त्रिज्यखंड का क्षेत्रफल = (θ/360°) × πr² = (90°/360°) × π × ${r}² = ${r * r}π/4 cm²।`;
      } else {
        prompt = `त्रिज्या ${r} cm और केंद्रीय कोण 90° वाले चाप की लंबाई (π के रूप में) कितनी है?`;
        answer = `${r}π/2 cm`;
        solution = `चाप की लंबाई = (θ/360°) × 2πr = (90°/360°) × 2π × ${r} = ${r}π/2 cm।`;
      }
      break;
    }
    case "volume": {
      const r = i + 1;
      if (part === 0) {
        const h = level + 2, v = r * r * h;
        prompt = `त्रिज्या ${r} cm और ऊँचाई ${h} cm वाले बेलन का आयतन (π के रूप में) कितना है?`;
        answer = `${v}π cm³`;
        solution = `बेलन का आयतन = πr²h = π × ${r}² × ${h} = ${v}π cm³।`;
      } else if (part === 1) {
        const h = 3 * (level + 1), v = r * r * (level + 1);
        prompt = `त्रिज्या ${r} cm और ऊँचाई ${h} cm वाले शंकु का आयतन (π के रूप में) कितना है?`;
        answer = `${v}π cm³`;
        solution = `शंकु का आयतन = (1/3)πr²h = (1/3) × π × ${r}² × ${h} = ${v}π cm³।`;
      } else {
        const numerator = 4 * r ** 3;
        prompt = `त्रिज्या ${r} cm वाले गोले का आयतन (π के रूप में) कितना है?`;
        answer = `${numerator}π/3 cm³`;
        solution = `गोले का आयतन = (4/3)πr³ = (4/3) × π × ${r}³ = ${numerator}π/3 cm³।`;
      }
      break;
    }
    case "statistics": {
      const a = i + 2, b = a + level + 1, c = b + 2;
      if (part === 0) {
        const mean = (a + b + c) / 3;
        prompt = `${a}, ${b} और ${c} का माध्य ज्ञात करें।`;
        answer = mean;
        solution = `माध्य = प्रेक्षणों का योग ÷ प्रेक्षणों की संख्या = (${a} + ${b} + ${c}) ÷ 3 = ${mean}।`;
      } else if (part === 1) {
        prompt = `${a}, ${b} और ${c} की माध्यिका ज्ञात करें।`;
        answer = b;
        solution = `आँकड़े पहले से आरोही क्रम में हैं। तीन प्रेक्षणों में बीच का मान माध्यिका होता है, इसलिए माध्यिका = ${b}।`;
      } else {
        prompt = `${a}, ${b}, ${b} और ${c} का बहुलक ज्ञात करें।`;
        answer = b;
        solution = `बहुलक सबसे अधिक बार आने वाला मान है। ${b} दो बार आता है, जबकि ${a} और ${c} एक-एक बार आते हैं। इसलिए बहुलक = ${b}।`;
      }
      break;
    }
    case "probability": {
      const total = 6 + i, favorable = 1 + (i % 3);
      const divisor = (a, b) => b ? divisor(b, a % b) : a;
      const g = divisor(favorable, total);
      const fraction = `${favorable / g}/${total / g}`;
      prompt = `कुल ${total} समान संभावित परिणामों में ${favorable} अनुकूल परिणाम हैं। घटना की प्रायिकता क्या है?`;
      answer = fraction;
      solution = `प्रायिकता = अनुकूल परिणामों की संख्या ÷ कुल समान संभावित परिणाम = ${favorable}/${total} = ${fraction}।`;
      break;
    }
  }
  const correct = String(answer);
  const distractors = buildDistractors(chapter.type, correct, i);
  const options = [...new Set([correct, ...distractors])].slice(0, 4);
  while (options.length < 4) options.push(String(Number(i + options.length + 6)));
  const offset = (i + part) % options.length;
  const shuffled = options.slice(offset).concat(options.slice(0, offset));
  const hints = {
    hcf: "यूक्लिड विभाजन प्रमेय लगाएँ; भाग देते रहें जब तक शेषफल शून्य न हो।",
    poly: "द्विघात बहुपद ax² + bx + c के शून्यकों का योग −b/a होता है।",
    linear: "समीकरणों को जोड़ने या घटाने से एक चर हटाएँ।",
    quadratic: "ऐसे दो गुणनखंड खोजें जिनका गुणनफल स्थिर पद और योग x का गुणांक हो।",
    ap: "nवें पद का सूत्र aₙ = a + (n − 1)d है।",
    triangle: "समरूप त्रिभुजों की संगत भुजाओं का अनुपात समान होता है।",
    coordinate: "दूरी सूत्र: d = √[(x₂ − x₁)² + (y₂ − y₁)²]।",
    trig: "विशेष कोणों के sin मान याद करें: 0°, 30°, 45° और 60°।",
    application: "tan θ = लंब / आधार का उपयोग करें।",
    circle: "स्पर्श बिंदु पर त्रिज्या, स्पर्श रेखा पर लंब होती है।",
    construction: "n बराबर भागों के लिए सहायक किरण पर n समान अंतराल लें।",
    area: "वृत्त का क्षेत्रफल πr² है; त्रिज्यखंड के लिए θ/360 से गुणा करें।",
    volume: "बेलन: πr²h, शंकु: ⅓πr²h, गोला: ⁴⁄₃πr³।",
    statistics: "माध्य = योग/संख्या; माध्यिका बीच का मान; बहुलक सबसे अधिक बार आने वाला मान।",
    probability: "प्रायिकता = अनुकूल परिणाम / कुल समान संभावित परिणाम।"
  };
  return {
    prompt,
    answer: correct,
    solution,
    options: shuffled,
    hint: hints[chapter.type],
    chapter: chapter.title,
    topic: chapter.topics[part],
    difficulty: getDifficulty(selectedSet).label,
    marks: 1
  };
}

function buildDistractors(type, answer, i) {
  if (["linear", "quadratic"].includes(type)) return ["1 और 2", `${i + 2} और ${i + 4}`, `${i + 3} और ${i + 5}`];
  if (type === "trig") return ["0", "1/2", "1", "√3/2"].filter(item => item !== answer);
  if (type === "circle") return ["45°", "60°", "180°"];
  if (type === "area" || type === "volume") return [`${i + 2}π`, `${(i + 2) ** 2}π`, `${i + 3}π`].filter(item => item !== answer);
  if (type === "probability") return ["1/2", "1/3", "2/3"].filter(item => item !== answer);
  if (type === "coordinate" || type === "triangle") return [`${i + 2} इकाई`, `${i + 4} इकाई`, `${i + 5} इकाई`].filter(item => item !== answer);
  return [String(Number(answer) + 1), String(Math.max(0, Number(answer) - 1)), String(Number(answer) + 2)].filter(item => item !== answer);
}

function buildShareableQuiz() {
  const chapterTitle = chapters[selectedChapter].title;
  const partTitle = chapters[selectedChapter].topics[selectedPart];
  const quizData = JSON.stringify(questions).replace(/</g, "\\u003c");
  const title = `${chapterTitle} — भाग ${selectedPart + 1}`;
  return `<!doctype html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHTML(title)} | I_Mentor_99</title>
  <style>
    *{box-sizing:border-box}body{margin:0;padding:24px 16px;background:#f6f7fb;color:#19223a;font-family:Arial,"Noto Sans Devanagari",sans-serif;line-height:1.65}
    main{max-width:760px;margin:0 auto}.header,.question,.result{padding:22px;margin-bottom:14px;border:1px solid #e8eaf1;border-radius:15px;background:#fff}
    .header{color:#fff;background:linear-gradient(115deg,#6457df,#8176ed);border:0}.brand{margin:0 0 5px;font-size:13px;color:#e4e2ff}.header h1{margin:0;font-size:24px}.header p{margin:7px 0 0;color:#eeeaff;font-size:13px}
    .student{width:100%;margin:3px 0 17px;padding:11px;border:1px solid #e1e3ec;border-radius:9px;font:inherit}.question h2{margin:0 0 12px;font-size:16px}.choice{display:flex;align-items:flex-start;gap:9px;padding:8px 10px;margin:6px 0;border:1px solid #ececf2;border-radius:9px;cursor:pointer}.choice input{margin-top:6px;accent-color:#6558df}.actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.actions button{padding:11px 17px;border:0;border-radius:9px;color:white;background:#6558df;font:inherit;font-weight:bold;cursor:pointer}.actions button.secondary{color:#596176;background:#eceef5}.hint{color:#737c91;font-size:13px}.result[hidden]{display:none}.score{font-size:19px;font-weight:bold;color:#5043c8}.answer{padding:12px 0;border-top:1px solid #ececf2}.answer strong{display:block}.solution{margin:8px 0;padding:10px 12px;border-left:3px solid #cbc7ff;background:#f8f7ff}.footer{text-align:center;color:#888fa1;font-size:12px;margin-top:20px}
    @media(max-width:480px){body{padding:14px 10px}.header,.question,.result{padding:17px}.header h1{font-size:21px}}
  </style>
</head>
<body>
  <main>
    <header class="header"><p class="brand">I_Mentor_99 · कक्षा 10 गणित</p><h1>${escapeHTML(chapterTitle)}</h1><p>भाग ${selectedPart + 1}: ${escapeHTML(partTitle)} · ${questions.length} प्रश्न</p></header>
    <form id="quiz"><section class="question"><label for="studentName"><strong>विद्यार्थी का नाम (वैकल्पिक)</strong></label><input class="student" id="studentName" type="text" autocomplete="name" placeholder="अपना नाम लिखें"></section><div id="questionList"></div><section class="question actions"><button type="submit">उत्तर जाँचें</button><span id="hint" class="hint" role="status">सभी प्रश्नों के उत्तर चुनें।</span></section></form>
    <section id="result" class="result" hidden aria-live="polite"></section>
    <p class="footer">यह ऑफ़लाइन अभ्यास फ़ॉर्म I_Mentor_99 से बनाया गया है।</p>
  </main>
  <script>
    const questions = ${quizData};
    const letters = ["अ", "ब", "स", "द"];
    const list = document.getElementById("questionList");
    const form = document.getElementById("quiz");
    const result = document.getElementById("result");
    questions.forEach((question, index) => {
      const fieldset = document.createElement("section");
      fieldset.className = "question";
      const heading = document.createElement("h2");
      heading.textContent = "प्रश्न " + (index + 1) + ". " + question.prompt;
      fieldset.append(heading);
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "choice";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "question-" + index;
        input.value = option;
        const text = document.createElement("span");
        text.textContent = letters[optionIndex] + ". " + option;
        label.append(input, text);
        fieldset.append(label);
      });
      list.append(fieldset);
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      const missing = questions.findIndex((question, index) => !form.querySelector('input[name="question-' + index + '"]:checked'));
      const hint = document.getElementById("hint");
      if (missing !== -1) {
        hint.textContent = "कृपया प्रश्न " + (missing + 1) + " का उत्तर चुनें।";
        form.querySelector('input[name="question-' + missing + '"]').focus();
        return;
      }
      const correct = questions.reduce((score, question, index) => score + (form.querySelector('input[name="question-' + index + '"]:checked').value === question.answer ? 1 : 0), 0);
      result.replaceChildren();
      const score = document.createElement("p");
      score.className = "score";
      score.textContent = (document.getElementById("studentName").value.trim() ? document.getElementById("studentName").value.trim() + " — " : "") + "आपका स्कोर: " + correct + "/" + questions.length;
      result.append(score);
      questions.forEach((question, index) => {
        const item = document.createElement("div");
        item.className = "answer";
        const heading = document.createElement("strong");
        heading.textContent = (index + 1) + ". " + question.prompt;
        const answer = document.createElement("p");
        answer.textContent = "सही उत्तर: " + question.answer;
        const solution = document.createElement("p");
        solution.className = "solution";
        solution.textContent = "हल: " + question.solution;
        item.append(heading, answer, solution);
        result.append(item);
      });
      result.hidden = false;
      hint.textContent = "उत्तर जाँचे गए — नीचे समाधान देखें।";
      result.scrollIntoView({behavior:"smooth", block:"start"});
    });
  </script>
</body>
</html>`;
}

function downloadShareableQuiz() {
  const blob = new Blob([buildShareableQuiz()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `I_Mentor_99_Quiz_Chapter_${selectedChapter + 1}_Part_${selectedPart + 1}.html`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function isPubliclyHosted() {
  return (window.location.protocol === "https:" || window.location.protocol === "http:")
    && !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function getQuizShareUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("quiz", "1");
  url.searchParams.set("chapter", String(selectedChapter + 1));
  url.searchParams.set("part", String(selectedPart + 1));
  url.searchParams.set("count", String(questionCount));
  url.searchParams.set("set", String(selectedSet + 1));
  return url.href;
}

async function copyQuizLink() {
  const status = app.querySelector("#shareStatus");
  if (!isPubliclyHosted()) {
    status.textContent = "लाइव क्विज़ लिंक के लिए पहले ऐप को GitHub Pages पर प्रकाशित करें। तब तक HTML फ़ाइल डाउनलोड करके भेजें।";
    return;
  }
  try {
    await navigator.clipboard.writeText(getQuizShareUrl());
    status.textContent = "क्विज़ लिंक कॉपी हो गया। इसे WhatsApp में पेस्ट करके भेजें।";
  } catch (error) {
    console.error("Quiz link copy failed:", error);
    status.textContent = "लिंक कॉपी नहीं हो सका। कृपया ब्राउज़र की clipboard अनुमति जाँचें।";
  }
}

function shareQuizLinkOnWhatsApp() {
  if (!isPubliclyHosted()) {
    shareQuizOnWhatsApp();
    return;
  }
  const text = `कक्षा 10 गणित क्विज़: ${chapters[selectedChapter].title} — भाग ${selectedPart + 1}\n${getQuizShareUrl()}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

async function shareQuizOnWhatsApp() {
  const blob = new Blob([buildShareableQuiz()], { type: "text/html;charset=utf-8" });
  const filename = `I_Mentor_99_Quiz_Chapter_${selectedChapter + 1}_Part_${selectedPart + 1}.html`;
  const file = new File([blob], filename, { type: "text/html" });
  const shareText = `कक्षा 10 गणित क्विज़: ${chapters[selectedChapter].title} — भाग ${selectedPart + 1}`;
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: shareText, text: shareText });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Quiz file sharing failed:", error);
    }
  }
  downloadShareableQuiz();
  const note = `क्विज़ फ़ाइल डाउनलोड हो गई है। कृपया इसे WhatsApp में Document के रूप में जोड़कर भेजें: ${shareText}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(note)}`, "_blank", "noopener");
  const status = app.querySelector("#shareStatus");
  if (status) status.textContent = "फ़ाइल डाउनलोड हुई। WhatsApp में इसे Document के रूप में अटैच करें।";
}

function startQuiz() {
  stopQuizTimer();
  if (quizMode !== "bank") {
    questions = Array.from({ length: questionCount }, (_, index) => makeQuestion(selectedChapter, selectedPart, index + selectedSet * 10));
  }
  questionIndex = 0;
  selectedOption = null;
  answers = Array(questions.length).fill(null);
  message = "";
  beginQuizTimer();
  setScreen("quiz");
}

function finishQuiz() {
  stopQuizTimer();
  quizElapsed = Math.floor((Date.now() - quizStartedAt) / 1000);
  if (quizMode !== "bank") saveQuizResult();
  setScreen("result");
}

function startWrongQuiz() {
  const wrongQuestions = questions.filter((question, index) => answers[index] !== null && answers[index] !== question.answer);
  if (!wrongQuestions.length) return;
  questions = wrongQuestions;
  questionCount = questions.length;
  questionIndex = 0;
  answers = Array(questions.length).fill(null);
  selectedOption = null;
  quizMode = "mistakes";
  beginQuizTimer();
  setScreen("quiz");
}

function startHardQuiz() {
  selectedSet = 6;
  questionCount = 10;
  quizMode = "set";
  startQuiz();
}

function renderQuiz() {
  const question = questions[questionIndex];
  const answeredCount = answers.filter(answer => answer !== null).length;
  const percent = (answeredCount / questions.length) * 100;
  const isChapterTest = quizMode === "chapter";
  const isExamBankQuiz = quizMode === "bank";
  const examBankSource = question.year ? `${question.year} परीक्षा` : "Workbook Quiz";
  app.innerHTML = `${isExamBankQuiz ? bankBreadcrumb("क्विज़") : breadcrumb("क्विज़")}
    <section class="quiz-layout">
      <div class="quiz-top"><span>${isExamBankQuiz ? `${examBankSource} · ${escapeHTML(question.topic)}` : isChapterTest ? "अध्याय मास्टर टेस्ट" : `${escapeHTML(question.topic)} · ${escapeHTML(question.difficulty)}`}</span><span class="quiz-timer" id="quizTimer" aria-label="बीता समय">${formatTime(quizElapsed)}</span><span class="quiz-count">प्रश्न ${questionIndex + 1} <span style="font-weight:400;color:#9ba1af">/ ${questions.length}</span></span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
      <article class="question-card">
        <p class="question-kicker">${isExamBankQuiz ? `${examBankSource} · ${escapeHTML(question.topic)}` : isChapterTest ? "अध्याय टेस्ट" : `सेट ${selectedSet + 1}`} · प्रश्न ${questionIndex + 1} · ${question.marks} अंक</p>
        <h2 class="question-text">${escapeHTML(question.prompt)}</h2>
        <div class="options">${question.options.map((option, index) => `
          <button class="option ${selectedOption === option ? "selected" : ""}" data-option="${escapeHTML(option)}"><span class="option-mark">${letters[index]}</span><span>${escapeHTML(option)}</span></button>`).join("")}
        </div>
        <details class="hint-panel"><summary>छोटा संकेत देखें</summary><p>${escapeHTML(question.hint)}</p></details>
        ${message ? `<div class="quiz-feedback error" role="alert">${message}</div>` : ""}
        <nav class="question-jump" aria-label="प्रश्न चुनें">${questions.map((item, index) => `<button class="${index === questionIndex ? "current" : ""} ${answers[index] !== null ? "answered" : ""}" data-jump="${index}" aria-label="प्रश्न ${index + 1}${answers[index] !== null ? ", उत्तर दिया गया" : ", छोड़ा गया"}">${index + 1}</button>`).join("")}</nav>
        <div class="quiz-actions"><button class="secondary-button" id="previousQuestion" ${questionIndex === 0 ? "disabled" : ""}>← पिछला</button><span class="hint">${answeredCount}/${questions.length} उत्तर दिए · बिना उत्तर छोड़ सकते हैं</span><div class="quiz-next-actions"><button class="secondary-button" id="skipQuestion">छोड़ें</button><button class="primary-button" id="submitAnswer">${questionIndex === questions.length - 1 ? "परिणाम देखें" : "अगला →"}</button></div></div>
      </article>
    </section>`;
  app.querySelector('[data-action="home"]').addEventListener("click", goHome);
  app.querySelectorAll("[data-option]").forEach(button => button.addEventListener("click", () => {
    selectedOption = button.dataset.option;
    answers[questionIndex] = selectedOption;
    message = "";
    renderQuiz();
  }));
  const moveToQuestion = nextIndex => {
    if (selectedOption !== null) answers[questionIndex] = selectedOption;
    questionIndex = nextIndex;
    selectedOption = answers[questionIndex];
    message = "";
    renderQuiz();
  };
  app.querySelector("#previousQuestion").addEventListener("click", () => {
    if (questionIndex > 0) moveToQuestion(questionIndex - 1);
  });
  app.querySelector("#skipQuestion").addEventListener("click", () => {
    answers[questionIndex] = null;
    selectedOption = null;
    if (questionIndex + 1 === questions.length) finishQuiz();
    else moveToQuestion(questionIndex + 1);
  });
  app.querySelector("#submitAnswer").addEventListener("click", () => {
    if (selectedOption !== null) answers[questionIndex] = selectedOption;
    if (questionIndex + 1 === questions.length) finishQuiz();
    else moveToQuestion(questionIndex + 1);
  });
  app.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => {
    moveToQuestion(Number(button.dataset.jump));
  }));
}

function renderResult() {
  const correct = answers.reduce((sum, answer, index) => sum + (answer === questions[index].answer ? 1 : 0), 0);
  const answered = answers.filter(answer => answer !== null).length;
  const skipped = questions.length - answered;
  const percent = Math.round((correct / questions.length) * 100);
  const accuracy = answered ? Math.round(correct / answered * 100) : 0;
  const hosted = isPubliclyHosted();
  const wrongCount = answers.reduce((sum, answer, index) => sum + (answer !== null && answer !== questions[index].answer ? 1 : 0), 0);
  const bankSources = new Set(questions.map(question => question.sourceType));
  const bankYears = [...new Set(questions.map(question => question.year).filter(Boolean))].sort();
  const bankSessions = new Set(questions.map(question => question.examSession).filter(Boolean));
  const bankSessionTitle = bankSessions.size > 1 ? "मुख्य + पूरक" : bankSessions.has("S") ? "पूरक" : "मुख्य";
  const bankTitle = bankSources.size > 1
    ? "पिछले वर्ष + Workbook Quiz प्रश्न बैंक"
    : bankSources.has("workbook")
      ? "Workbook Quiz प्रश्न बैंक"
      : `${bankYears.join(" + ")} ${bankSessionTitle} परीक्षा प्रश्न बैंक`;
  const quizTitle = quizMode === "bank"
    ? bankTitle
    : quizMode === "chapter"
      ? "अध्याय मास्टर टेस्ट"
      : quizMode === "mistakes"
        ? "गलत प्रश्नों का अभ्यास"
        : `सेट ${selectedSet + 1}`;
  app.innerHTML = `${quizMode === "bank" ? bankBreadcrumb("परिणाम") : breadcrumb("परिणाम")}
    <section class="quiz-layout">
      <div class="result-hero"><span class="result-icon">✦</span><h1>${percent >= 80 ? "शानदार प्रदर्शन!" : percent >= 50 ? "अच्छी कोशिश!" : "अभ्यास जारी रखें!"}</h1><p>${quizMode === "bank" ? "कक्षा 10 गणित" : escapeHTML(chapters[selectedChapter].title)} · ${quizTitle}</p>
        <div class="score-row"><div class="score-stat"><strong>${correct}/${questions.length}</strong><span>सही उत्तर</span></div><div class="score-stat"><strong>${percent}%</strong><span>स्कोर</span></div><div class="score-stat"><strong>${wrongCount}</strong><span>गलत</span></div><div class="score-stat"><strong>${skipped}</strong><span>छोड़े</span></div><div class="score-stat"><strong>${formatTime(quizElapsed)}</strong><span>समय</span></div></div>
      </div>
      ${storageWarning ? `<p class="storage-warning" role="status">${escapeHTML(storageWarning)}</p>` : ""}
      <p class="result-accuracy">उत्तर दिए गए ${answered}/${questions.length} · उत्तर दिए गए प्रश्नों में सटीकता ${accuracy}%</p>
      <div class="result-actions"><button id="retryQuiz" class="secondary-button">${quizMode === "bank" ? "प्रश्न फिर से हल करें" : "फिर से अभ्यास करें"}</button>${wrongCount && quizMode !== "bank" ? '<button id="retryWrong" class="secondary-button">केवल गलत प्रश्न</button>' : ""}${quizMode === "bank" ? "" : '<button id="hardQuiz" class="secondary-button">कठिन प्रश्न करें</button>'}<button id="backChapter" class="secondary-button">${quizMode === "bank" ? "प्रश्न बैंक पर लौटें" : "अध्याय पर लौटें"}</button>${quizMode === "bank" ? "" : `<button id="downloadQuiz" class="secondary-button">Quiz फ़ाइल डाउनलोड करें</button>${hosted ? '<button id="copyQuizLink" class="secondary-button">क्विज़ लिंक कॉपी करें</button>' : ""}<button id="shareQuiz" class="primary-button">${hosted ? "WhatsApp पर लिंक भेजें" : "WhatsApp पर फ़ाइल शेयर करें"}</button>`}</div>
      ${quizMode === "bank" ? "" : `<p id="shareStatus" class="share-status" role="status" aria-live="polite">${hosted ? "लिंक पाने वाला सीधे ब्राउज़र में यह क्विज़ दे सकेगा। उसके जवाब आपके पास जमा नहीं होंगे।" : "लाइव क्विज़ लिंक के लिए ऐप को GitHub Pages पर प्रकाशित करें; अभी HTML फ़ाइल भेज सकते हैं।"}</p>`}
      <div class="section-heading"><div><h2>उत्तर-पत्रिका और समाधान</h2><p>किसी प्रश्न पर टैप करके उसका चरण-दर-चरण हल देखें</p></div></div>
      <div class="answer-list">${questions.map((question, index) => {
        const isCorrect = answers[index] === question.answer;
        const status = answers[index] === null ? "• छोड़ा" : isCorrect ? "✓ सही" : "• गलत";
        const statusClass = answers[index] === null ? "skipped" : isCorrect ? "correct" : "incorrect";
        return `<details class="answer-card"><summary class="answer-summary"><span class="answer-number">${index + 1}</span><p>${escapeHTML(question.prompt)}</p><span class="answer-status ${statusClass}">${status}</span></summary>
          <div class="answer-detail"><div>आपका उत्तर: <strong>${answers[index] === null ? "उत्तर नहीं दिया" : escapeHTML(answers[index])}</strong></div><div>सही उत्तर: <strong>${escapeHTML(question.answer)}</strong></div><div class="solution-step"><strong>हल:</strong> ${escapeHTML(question.solution)}</div><div class="solution-step"><strong>सूत्र / संकेत:</strong> ${escapeHTML(question.hint)}</div></div></details>`;
      }).join("")}</div>
    </section>`;
  app.querySelector('[data-action="home"]').addEventListener("click", goHome);
  app.querySelector("#retryQuiz").addEventListener("click", startQuiz);
  if (wrongCount && quizMode !== "bank") app.querySelector("#retryWrong").addEventListener("click", startWrongQuiz);
  if (quizMode === "bank") {
    app.querySelector("#backChapter").addEventListener("click", () => setScreen("bank"));
  } else {
    app.querySelector("#hardQuiz").addEventListener("click", startHardQuiz);
    app.querySelector("#backChapter").addEventListener("click", () => setScreen("chapter"));
    app.querySelector("#downloadQuiz").addEventListener("click", downloadShareableQuiz);
    app.querySelector("#shareQuiz").addEventListener("click", shareQuizLinkOnWhatsApp);
    if (hosted) app.querySelector("#copyQuizLink").addEventListener("click", copyQuizLink);
  }
}

function renderMistakes() {
  app.innerHTML = `<nav class="breadcrumb"><button data-action="home">कक्षा 10 गणित</button><span>›</span><span>मेरी गलतियाँ</span></nav>
    <div class="section-heading"><div><h1>मेरी गलतियाँ</h1><p>गलत उत्तरों को फिर से समझें और अभ्यास करें।</p></div></div>
    ${storageWarning ? `<p class="storage-warning" role="status">${escapeHTML(storageWarning)}</p>` : ""}
    ${progress.mistakes.length ? `<div class="answer-list">${progress.mistakes.map((mistake, index) => `<details class="answer-card"><summary class="answer-summary"><span class="answer-number">${index + 1}</span><p>${escapeHTML(mistake.prompt)}</p><span class="answer-status incorrect">${escapeHTML(chapters[mistake.chapter].title)}</span></summary><div class="answer-detail"><div>सही उत्तर: <strong>${escapeHTML(mistake.answer)}</strong></div><div class="solution-step"><strong>संकेत:</strong> ${escapeHTML(mistake.hint)}</div><div class="solution-step"><strong>हल:</strong> ${escapeHTML(mistake.solution)}</div><button class="secondary-button remove-mistake" data-remove="${escapeHTML(mistake.key)}">गलती सूची से हटाएँ</button></div></details>`).join("")}</div>` : `<div class="empty-state">अभी कोई गलती सेव नहीं है। अभ्यास के बाद गलत प्रश्न यहाँ दिखेंगे।</div>`}`;
  app.querySelector('[data-action="home"]').addEventListener("click", goHome);
  app.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => {
    progress.mistakes = progress.mistakes.filter(mistake => mistake.key !== button.dataset.remove);
    saveProgress();
    renderMistakes();
  }));
}

function render() {
  if (screen === "home") renderHome();
  else if (screen === "chapter") renderChapter();
  else if (screen === "bank") renderExamBank();
  else if (screen === "quiz") renderQuiz();
  else if (screen === "result") renderResult();
  else if (screen === "mistakes") renderMistakes();
}

document.getElementById("homeButton").addEventListener("click", goHome);
const sharedQuizParams = new URLSearchParams(window.location.search);
if (sharedQuizParams.get("quiz") === "1") {
  const chapter = Number(sharedQuizParams.get("chapter")) - 1;
  const part = Number(sharedQuizParams.get("part")) - 1;
  const count = Number(sharedQuizParams.get("count"));
  const set = Number(sharedQuizParams.get("set") || 1) - 1;
  if (Number.isInteger(chapter) && chapter >= 0 && chapter < chapters.length
    && Number.isInteger(part) && part >= 0 && part < chapters[chapter].topics.length
    && [10, 20, 30].includes(count)
    && Number.isInteger(set) && set >= 0 && set < 10) {
    selectedChapter = chapter;
    selectedPart = part;
    questionCount = count;
    selectedSet = set;
    quizMode = "set";
    questions = Array.from({ length: questionCount }, (_, index) => makeQuestion(selectedChapter, selectedPart, index + selectedSet * 10));
    questionIndex = 0;
    selectedOption = null;
    answers = Array(questions.length).fill(null);
    screen = "quiz";
    beginQuizTimer();
  }
}
render();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("./sw.js").catch(error => {
    console.error("Offline app support could not be enabled:", error);
  });
}
