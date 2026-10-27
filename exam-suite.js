/**
 * I_Mentor_99 - Examination & Practice Suite Shared Engine
 * Handles questions aggregation, student session, theme, timer, and results.
 */
(function(window) {
  "use strict";

  const STORAGE_KEY = "iMentorMathProgress";
  const THEME_KEY = "iMentorTheme";
  const LATEST_RESULT_KEY = "iMentorLatestResult";
  const PLANNER_KEY = "iMentorRevisionPlanner";

  // Initialize theme
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const CHAPTER_NAMES = [
    "वास्तविक संख्याएँ (Real Numbers)",
    "बहुपद (Polynomials)",
    "दो चर वाले रैखिक समीकरण युग्म (Linear Equations in Two Variables)",
    "द्विघात समीकरण (Quadratic Equations)",
    "समांतर श्रेढियाँ (Arithmetic Progressions)",
    "त्रिभुज (Triangles)",
    "निर्देशांक ज्यामिति (Coordinate Geometry)",
    "त्रिकोणमिति का परिचय (Introduction to Trigonometry)",
    "त्रिकोणमिति के कुछ अनुप्रयोग (Applications of Trigonometry)",
    "वृत्त (Circles)",
    "रचनाएँ (Constructions)",
    "वृत्तों से संबंधित क्षेत्रफल (Areas Related to Circles)",
    "पृष्ठी groundीय क्षेत्रफल और आयतन (Surface Areas and Volumes)",
    "सांख्यिकी (Statistics)",
    "प्रायिकता (Probability)"
  ];

  // Helper to collect all questions from all loaded banks
  function getAllQuestions() {
    const list = [];
    let idCounter = 1;

    // 1. From oldPaperQuestionBank
    if (window.oldPaperQuestionBank && Array.isArray(window.oldPaperQuestionBank)) {
      window.oldPaperQuestionBank.forEach(paper => {
        const yr = paper.year;
        const sess = paper.session === "M" ? "मुख्य परीक्षा" : "पूरक परीक्षा";
        (paper.questions || []).forEach(q => {
          list.push({
            id: `board_${yr}_${paper.session}_${idCounter++}`,
            source: `RBSE ${yr} (${sess})`,
            type: "board",
            year: yr,
            session: paper.session,
            chapter: Number(q.chapter),
            chapterName: CHAPTER_NAMES[Number(q.chapter)] || `अध्याय ${Number(q.chapter) + 1}`,
            prompt: q.prompt,
            options: q.options || [],
            answer: typeof q.answer === "number" ? q.options[q.answer] : q.answer,
            answerIndex: typeof q.answer === "number" ? q.answer : (q.options ? q.options.indexOf(q.answer) : 0),
            solution: q.solution || "बोर्ड उत्तर कुंजी अनुसार सही विकल्प।",
            hint: q.hint || "अध्याय के मूल सूत्र और परिभाषा का उपयोग करें।"
          });
        });
      });
    }

    // 2. From workbookQuestionBank
    if (window.workbookQuestionBank && Array.isArray(window.workbookQuestionBank)) {
      window.workbookQuestionBank.forEach(sheet => {
        const ch = sheet.chapter;
        (sheet.questions || []).forEach(q => {
          list.push({
            id: `wb_${ch}_${idCounter++}`,
            source: `RBSE वर्कबुक (कार्यपत्रक ${sheet.sheet || sheet.worksheet || ch + 1})`,
            type: "workbook",
            year: 2024,
            chapter: Number(ch),
            chapterName: CHAPTER_NAMES[Number(ch)] || `अध्याय ${Number(ch) + 1}`,
            prompt: q.prompt,
            options: q.options || [],
            answer: typeof q.answer === "number" ? q.options[q.answer] : q.answer,
            answerIndex: typeof q.answer === "number" ? q.answer : (q.options ? q.options.indexOf(q.answer) : 0),
            solution: q.solution || "वर्कबुक आधिकारिक समाधान।",
            hint: q.hint || "कार्यपत्रक के अनुसार हल करें।"
          });
        });
      });
    }

    return list;
  }

  // Audio tone generator
  function playBeep(freq, type, duration) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  }

  const ExamSuite = {
    chapterNames: CHAPTER_NAMES,

    getAllQuestions: getAllQuestions,

    getQuestionsByChapter: function(chIndex) {
      return getAllQuestions().filter(q => q.chapter === Number(chIndex));
    },

    getQuestionsByYear: function(year) {
      return getAllQuestions().filter(q => q.year === Number(year) && q.type === "board");
    },

    getProgress: function() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { attempts: [], mistakes: [], completedSets: {} };
    },

    saveMistake: function(questionObj, chosenOption) {
      try {
        const prog = this.getProgress();
        if (!prog.mistakes) prog.mistakes = [];
        const exists = prog.mistakes.find(m => m.prompt === questionObj.prompt);
        if (!exists) {
          prog.mistakes.push({
            key: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            chapter: questionObj.chapter,
            prompt: questionObj.prompt,
            options: questionObj.options,
            answer: questionObj.answer,
            chosen: chosenOption,
            solution: questionObj.solution,
            hint: questionObj.hint,
            timestamp: Date.now()
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
        }
      } catch (e) {
        console.warn("Could not save mistake:", e);
      }
    },

    removeMistake: function(mistakeKey) {
      try {
        const prog = this.getProgress();
        if (prog.mistakes) {
          prog.mistakes = prog.mistakes.filter(m => m.key !== mistakeKey && m.prompt !== mistakeKey);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
        }
      } catch (e) {}
    },

    saveLatestResult: function(resultData) {
      try {
        sessionStorage.setItem(LATEST_RESULT_KEY, JSON.stringify(resultData));
        localStorage.setItem(LATEST_RESULT_KEY, JSON.stringify(resultData));
      } catch (e) {}
    },

    getLatestResult: function() {
      try {
        const raw = sessionStorage.getItem(LATEST_RESULT_KEY) || localStorage.getItem(LATEST_RESULT_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    },

    toggleTheme: function() {
      const cur = document.documentElement.getAttribute("data-theme") || "light";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      const icon = document.getElementById("themeIcon");
      if (icon) icon.textContent = next === "dark" ? "☀️" : "🌙";
    },

    playSound: function(type) {
      if (type === "success") {
        playBeep(523.25, "triangle", 0.1);
        setTimeout(() => playBeep(659.25, "triangle", 0.15), 90);
      } else if (type === "complete") {
        playBeep(523.25, "triangle", 0.1);
        setTimeout(() => playBeep(659.25, "triangle", 0.1), 100);
        setTimeout(() => playBeep(783.99, "triangle", 0.1), 200);
        setTimeout(() => playBeep(1046.5, "triangle", 0.25), 300);
      } else if (type === "click") {
        playBeep(440, "sine", 0.04);
      } else if (type === "warning") {
        playBeep(330, "sawtooth", 0.2);
        setTimeout(() => playBeep(330, "sawtooth", 0.2), 250);
      }
    },

    renderNavbar: function(activePage) {
      const topbar = document.getElementById("examTopNav");
      if (!topbar) return;

      const navLinks = [
        { id: "quiz-center", href: "quiz-center.html", label: "🎯 क्विज़ सेंटर" },
        { id: "chapter-tests", href: "chapter-tests.html", label: "📚 अध्याय टेस्ट" },
        { id: "mock-exams", href: "mock-exams.html", label: "📝 मॉक परीक्षा" },
        { id: "question-bank", href: "question-bank.html", label: "🔍 प्रश्न बैंक" },
        { id: "previous-papers", href: "previous-papers.html", label: "📜 बोर्ड पेपर्स" },
        { id: "sample-papers", href: "sample-papers.html", label: "📑 मॉडल पेपर्स" },
        { id: "exam-timer", href: "exam-timer.html", label: "⏱️ परीक्षा टाइमर" },
        { id: "mistake-book", href: "mistake-book.html", label: "❌ भूल सुधार" },
        { id: "revision-planner", href: "revision-planner.html", label: "📅 रिवीजन प्लानर" },
        { id: "leaderboard", href: "leaderboard.html", label: "🏆 लीडरबोर्ड" }
      ];

      const curTheme = document.documentElement.getAttribute("data-theme") || "light";

      topbar.innerHTML = `
        <div class="topbar-left">
          <a class="brand" href="index.html" aria-label="मुख्य पृष्ठ पर जाएँ">
            <span class="brand-mark logo-mark"><img src="assets/mentor-logo-header.png" alt="I_Mentor_99"></span>
            <span class="home-label">⌂ होम</span>
            <span class="brand-title">कक्षा 10 गणित</span>
          </a>
        </div>
        <div class="exam-subnav-scroll">
          ${navLinks.map(n => `
            <a class="exam-nav-pill ${activePage === n.id ? "active" : ""}" href="${n.href}">
              ${n.label}
            </a>
          `).join("")}
        </div>
        <div class="topbar-right">
          <button class="theme-toggle-btn" id="examThemeToggle" type="button" title="थीम बदलें">
            <span id="themeIcon">${curTheme === "dark" ? "☀️" : "🌙"}</span>
          </button>
        </div>
      `;

      const tBtn = document.getElementById("examThemeToggle");
      if (tBtn) tBtn.addEventListener("click", () => ExamSuite.toggleTheme());
    }
  };

  window.ExamSuite = ExamSuite;
})(window);

