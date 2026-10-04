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
let storageWarning = "";
let progress = loadProgress();

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
  app.querySelector("#questionFile").addEventListener("change", event => {
    const file = event.target.files[0];
    app.querySelector("#uploadStatus").textContent = file
      ? `${file.name} चुनी गई (${formatFileSize(file.size)})`
      : "कोई फ़ाइल नहीं चुनी गई";
  });
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
  questions = Array.from({ length: questionCount }, (_, index) => makeQuestion(selectedChapter, selectedPart, index + selectedSet * 10));
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
  saveQuizResult();
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
  app.innerHTML = `${breadcrumb("क्विज़")}
    <section class="quiz-layout">
      <div class="quiz-top"><span>${isChapterTest ? "अध्याय मास्टर टेस्ट" : escapeHTML(question.topic)} · ${escapeHTML(question.difficulty)}</span><span class="quiz-timer" id="quizTimer" aria-label="बीता समय">${formatTime(quizElapsed)}</span><span class="quiz-count">प्रश्न ${questionIndex + 1} <span style="font-weight:400;color:#9ba1af">/ ${questions.length}</span></span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
      <article class="question-card">
        <p class="question-kicker">${isChapterTest ? "अध्याय टेस्ट" : `सेट ${selectedSet + 1}`} · प्रश्न ${questionIndex + 1} · ${question.marks} अंक</p>
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
  const quizTitle = quizMode === "chapter"
    ? "अध्याय मास्टर टेस्ट"
    : quizMode === "mistakes"
      ? "गलत प्रश्नों का अभ्यास"
      : `सेट ${selectedSet + 1}`;
  app.innerHTML = `${breadcrumb("परिणाम")}
    <section class="quiz-layout">
      <div class="result-hero"><span class="result-icon">✦</span><h1>${percent >= 80 ? "शानदार प्रदर्शन!" : percent >= 50 ? "अच्छी कोशिश!" : "अभ्यास जारी रखें!"}</h1><p>${escapeHTML(chapters[selectedChapter].title)} · ${quizTitle}</p>
        <div class="score-row"><div class="score-stat"><strong>${correct}/${questions.length}</strong><span>सही उत्तर</span></div><div class="score-stat"><strong>${percent}%</strong><span>स्कोर</span></div><div class="score-stat"><strong>${wrongCount}</strong><span>गलत</span></div><div class="score-stat"><strong>${skipped}</strong><span>छोड़े</span></div><div class="score-stat"><strong>${formatTime(quizElapsed)}</strong><span>समय</span></div></div>
      </div>
      ${storageWarning ? `<p class="storage-warning" role="status">${escapeHTML(storageWarning)}</p>` : ""}
      <p class="result-accuracy">उत्तर दिए गए ${answered}/${questions.length} · उत्तर दिए गए प्रश्नों में सटीकता ${accuracy}%</p>
      <div class="result-actions"><button id="retryQuiz" class="secondary-button">फिर से अभ्यास करें</button>${wrongCount ? '<button id="retryWrong" class="secondary-button">केवल गलत प्रश्न</button>' : ""}<button id="hardQuiz" class="secondary-button">कठिन प्रश्न करें</button><button id="backChapter" class="secondary-button">अध्याय पर लौटें</button><button id="downloadQuiz" class="secondary-button">Quiz फ़ाइल डाउनलोड करें</button>${hosted ? '<button id="copyQuizLink" class="secondary-button">क्विज़ लिंक कॉपी करें</button>' : ""}<button id="shareQuiz" class="primary-button">${hosted ? "WhatsApp पर लिंक भेजें" : "WhatsApp पर फ़ाइल शेयर करें"}</button></div>
      <p id="shareStatus" class="share-status" role="status" aria-live="polite">${hosted ? "लिंक पाने वाला सीधे ब्राउज़र में यह क्विज़ दे सकेगा। उसके जवाब आपके पास जमा नहीं होंगे।" : "लाइव क्विज़ लिंक के लिए ऐप को GitHub Pages पर प्रकाशित करें; अभी HTML फ़ाइल भेज सकते हैं।"}</p>
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
  if (wrongCount) app.querySelector("#retryWrong").addEventListener("click", startWrongQuiz);
  app.querySelector("#hardQuiz").addEventListener("click", startHardQuiz);
  app.querySelector("#backChapter").addEventListener("click", () => setScreen("chapter"));
  app.querySelector("#downloadQuiz").addEventListener("click", downloadShareableQuiz);
  app.querySelector("#shareQuiz").addEventListener("click", shareQuizLinkOnWhatsApp);
  if (hosted) app.querySelector("#copyQuizLink").addEventListener("click", copyQuizLink);
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
