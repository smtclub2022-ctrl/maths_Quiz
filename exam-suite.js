/**
 * SchoolBrain - Examination & Educational Portal Shared Engine
 * Provides Universal Inter-Page Navigation, Drawer, Question Bank Engine, Audio & Theming.
 */
(function(window) {
  "use strict";

  const STORAGE_KEY = "iMentorMathProgress";
  const THEME_KEY = "iMentorTheme";
  const LATEST_RESULT_KEY = "iMentorLatestResult";

  // Initialize theme immediately
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
    "पृष्ठीय क्षेत्रफल और आयतन (Surface Areas and Volumes)",
    "सांख्यिकी (Statistics)",
    "प्रायिकता (Probability)"
  ];

  const ALL_PAGES = [
    // 1. Public Website
    { id: "landing", href: "landing.html", label: "🌟 लैंडिंग पेज (Landing Page)", icon: "🌟", group: "public" },
    { id: "home", href: "index.html", label: "⌂ होम (Home)", icon: "⌂", group: "public" },
    { id: "courses", href: "courses.html", label: "📚 पाठ्यक्रम (Courses)", icon: "📚", group: "public" },
    { id: "about", href: "about.html", label: "ℹ️ हमारे बारे में (About)", icon: "ℹ️", group: "public" },
    { id: "contact", href: "contact.html", label: "📞 संपर्क (Contact)", icon: "📞", group: "public" },
    { id: "login", href: "login.html", label: "🔐 छात्र लॉगिन (Login)", icon: "🔐", group: "public" },

    // 2. Student Portal & Study Material
    { id: "dashboard", href: "dashboard.html", label: "👨‍🎓 डैशबोर्ड (Dashboard)", icon: "👨‍🎓", group: "student" },
    { id: "subjects", href: "subjects.html", label: "📖 विषय सूची (Subjects)", icon: "📖", group: "student" },
    { id: "notes", href: "notes.html", label: "📑 नोट्स व सूत्र (Notes & PDFs)", icon: "📑", group: "student" },
    { id: "videos", href: "videos.html", label: "🎥 वीडियो लेक्चर्स (Videos)", icon: "🎥", group: "student" },

    // 3. Examination & Test Suite
    { id: "quiz-center", href: "quiz-center.html", label: "🎯 क्विज़ सेंटर (Quiz Center)", icon: "🎯", group: "exam" },
    { id: "chapter-tests", href: "chapter-tests.html", label: "📚 अध्यायवार टेस्ट (Chapter Tests)", icon: "📚", group: "exam" },
    { id: "mock-exams", href: "mock-exams.html", label: "📝 संपूर्ण मॉक परीक्षा (Mock Exams)", icon: "📝", group: "exam" },
    { id: "exam-timer", href: "exam-timer.html", label: "⏱️ परीक्षा टाइमर (Timed Exam)", icon: "⏱️", group: "exam" },
    { id: "previous-papers", href: "previous-papers.html", label: "📜 बोर्ड पेपर्स (Previous Papers)", icon: "📜", group: "exam" },
    { id: "sample-papers", href: "sample-papers.html", label: "📑 मॉडल प्रश्न पत्र (Sample Papers)", icon: "📑", group: "exam" },
    { id: "workbook", href: "workbook-quiz.html", label: "📘 Workbook Quiz (कार्यपत्रक)", icon: "📘", group: "exam" },
    { id: "question-bank", href: "question-bank.html", label: "🔍 सर्च प्रश्न बैंक (Question Bank)", icon: "🔍", group: "exam" },

    // 4. Student Tools & Progress
    { id: "mistake-book", href: "mistake-book.html", label: "❌ भूल सुधार पुस्तिका (Mistake Book)", icon: "❌", group: "tools" },
    { id: "revision-planner", href: "revision-planner.html", label: "📅 रिवीजन प्लानर (Study Planner)", icon: "📅", group: "tools" },
    { id: "leaderboard", href: "leaderboard.html", label: "🏆 लीडरबोर्ड एवं बैज (Leaderboard)", icon: "🏆", group: "tools" },
    { id: "result", href: "result.html", label: "📊 नवीनतम परिणाम (Latest Result)", icon: "📊", group: "tools" },
    { id: "answer-review", href: "answer-review.html", label: "📝 उत्तर समीक्षा (Answer Review)", icon: "📝", group: "tools" },

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
        if (paper.sections) {
          Object.keys(paper.sections).forEach(secKey => {
            const sec = paper.sections[secKey];
            if (sec.questions && Array.isArray(sec.questions)) {
              sec.questions.forEach((q, qIdx) => {
                list.push({
                  id: `old_${yr}_${secKey}_${qIdx}`,
                  globalId: idCounter++,
                  source: `RBSE ${yr} (${sess}) - खण्ड ${secKey}`,
                  year: yr,
                  chapter: (q.chapter !== undefined && q.chapter !== null) ? Number(q.chapter) : -1,
                  prompt: q.prompt || "",
                  options: q.options || [],
                  answer: (q.answer !== undefined && q.answer !== null) ? Number(q.answer) : 0,
                  solution: q.solution || "समाधान उत्तर कुंजी में उपलब्ध है।",
                  hint: q.hint || "प्रश्नावली के मूल सूत्रों का स्मरण करें।",
                  marks: q.marks || 1,
                  type: "board"
                });
              });
            }
          });
        }
      });
    }

    // 2. From workbookQuestionBank
    if (window.workbookQuestionBank && Array.isArray(window.workbookQuestionBank)) {
      window.workbookQuestionBank.forEach((ws, wsIdx) => {
        const wsName = ws.name || `कार्यपत्रक ${ws.worksheet || wsIdx + 1}`;
        if (ws.questions && Array.isArray(ws.questions)) {
          ws.questions.forEach((q, qIdx) => {
            list.push({
              id: `wb_${ws.worksheet || wsIdx}_${qIdx}`,
              globalId: idCounter++,
              source: `उपचारात्मक शिक्षण कार्यपुस्तिका (${wsName})`,
              year: 2026,
              chapter: (q.chapter !== undefined && q.chapter !== null) ? Number(q.chapter) : (ws.chapter !== undefined ? Number(ws.chapter) : -1),
              prompt: q.prompt || "",
              options: q.options || [],
              answer: (q.answer !== undefined && q.answer !== null) ? Number(q.answer) : 0,
              solution: q.solution || "हल कार्यपुस्तिका में दिया गया है।",
              hint: q.hint || "कार्यपुस्तिका के उदाहरण देखें।",
              marks: 1,
              type: "workbook"
            });
          });
        }
      });
    }

    return list;
  }

  // Audio Synthesizer
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playBeep(freq, type, duration) {
    if (localStorage.getItem("iMentorSound") === "off") return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  }

  const ExamSuite = {
    chapterNames: CHAPTER_NAMES,
    allPages: ALL_PAGES,

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
      const icons = document.querySelectorAll(".theme-icon-indicator");
      icons.forEach(icon => {
        icon.textContent = next === "dark" ? "☀️" : "🌙";
      });
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

    // Injects Universal Navigation Bar, Sidebar Drawer, Bottom Nav, and Footer
    renderNavbar: function(activePage) {

  // Page Flow Definition for Forward & Backward Navigation
  const PAGE_FLOW = {
    "landing": { prev: null, next: { title: "मुख्य पृष्ठ (Home)", url: "index.html" } },
    "home": { prev: { title: "लैंडिंग पेज (Landing)", url: "landing.html" }, next: { title: "पाठ्यक्रम (Courses)", url: "courses.html" } },
    "courses": { prev: { title: "मुख्य पृष्ठ (Home)", url: "index.html" }, next: { title: "विषय सूची (Subjects)", url: "subjects.html" } },
    "subjects": { prev: { title: "पाठ्यक्रम (Courses)", url: "courses.html" }, next: { title: "छात्र डैशबोर्ड (Dashboard)", url: "dashboard.html" } },
    "dashboard": { prev: { title: "विषय सूची (Subjects)", url: "subjects.html" }, next: { title: "क्विज़ सेंटर (Quiz Hub)", url: "quiz-center.html" } },
    "quiz-center": { prev: { title: "छात्र डैशबोर्ड (Dashboard)", url: "dashboard.html" }, next: { title: "अध्यायवार टेस्ट (Chapter Tests)", url: "chapter-tests.html" } },
    "chapter-tests": { prev: { title: "क्विज़ सेंटर (Quiz Hub)", url: "quiz-center.html" }, next: { title: "मॉक परीक्षा (Mock Exams)", url: "mock-exams.html" } },
    "mock-exams": { prev: { title: "अध्यायवार टेस्ट (Chapter Tests)", url: "chapter-tests.html" }, next: { title: "बोर्ड पेपर्स (Previous Papers)", url: "previous-papers.html" } },
    "previous-papers": { prev: { title: "मॉक परीक्षा (Mock Exams)", url: "mock-exams.html" }, next: { title: "मॉडल पेपर्स (Sample Papers)", url: "sample-papers.html" } },
    "sample-papers": { prev: { title: "बोर्ड पेपर्स (Previous Papers)", url: "previous-papers.html" }, next: { title: "कार्यपत्रक (Workbook Quiz)", url: "workbook-quiz.html" } },
    "workbook": { prev: { title: "मॉडल पेपर्स (Sample Papers)", url: "sample-papers.html" }, next: { title: "सर्च प्रश्न बैंक (Question Bank)", url: "question-bank.html" } },
    "question-bank": { prev: { title: "कार्यपत्रक (Workbook Quiz)", url: "workbook-quiz.html" }, next: { title: "नोट्स एवं सूत्र (Notes & PDFs)", url: "notes.html" } },
    "notes": { prev: { title: "सर्च प्रश्न बैंक (Question Bank)", url: "question-bank.html" }, next: { title: "वीडियो लेक्चर्स (Videos)", url: "videos.html" } },
    "videos": { prev: { title: "नोट्स एवं सूत्र (Notes & PDFs)", url: "notes.html" }, next: { title: "भूल सुधार पुस्तिका (Mistake Book)", url: "mistake-book.html" } },
    "mistake-book": { prev: { title: "वीडियो लेक्चर्स (Videos)", url: "videos.html" }, next: { title: "रिवीजन प्लानर (Planner)", url: "revision-planner.html" } },
    "revision-planner": { prev: { title: "भूल सुधार (Mistake Book)", url: "mistake-book.html" }, next: { title: "लीडरबोर्ड एवं रैंक (Leaderboard)", url: "leaderboard.html" } },
    "leaderboard": { prev: { title: "रिवीजन प्लानर (Planner)", url: "revision-planner.html" }, next: { title: "छात्र डैशबोर्ड (Dashboard)", url: "dashboard.html" } },
    "result": { prev: { title: "क्विज़ सेंटर (Quiz Hub)", url: "quiz-center.html" }, next: { title: "भूल सुधार पुस्तिका (Mistake Book)", url: "mistake-book.html" } },
    "answer-review": { prev: { title: "परीक्षा परिणाम (Result)", url: "result.html" }, next: { title: "भूल सुधार (Mistake Book)", url: "mistake-book.html" } },
    "about": { prev: { title: "मुख्य पृष्ठ (Home)", url: "index.html" }, next: { title: "संपर्क एवं सहायता (Contact)", url: "contact.html" } },
    "contact": { prev: { title: "हमारे बारे में (About Us)", url: "about.html" }, next: { title: "पाठ्यक्रम (Courses)", url: "courses.html" } },
    "login": { prev: { title: "मुख्य पृष्ठ (Home)", url: "index.html" }, next: { title: "छात्र डैशबोर्ड (Dashboard)", url: "dashboard.html" } },
    
  };

      const topbar = document.getElementById("examTopNav");
      const curTheme = document.documentElement.getAttribute("data-theme") || "light";
      const curLang = getLanguage();

      // 1. Render Topbar if element exists
      if (topbar) {
        if (activePage === "landing") {
          // Dedicated Clean Landing Page Topbar
          // (No dropdown menu, no landing page button, no dashboard, no quiz hub, no notes/formula, no Ctrl+K)
          // Replaced with: About, Login, Sign Up, Language
          topbar.innerHTML = `
            <div class="topbar-left exam-topbar-wrap">
              <a class="brand" href="landing.html" aria-label="SchoolBrain">
                <span class="brand-title">SchoolBrain</span>
              </a>
            </div>

            <div class="exam-subnav-scroll">
              <a class="exam-nav-pill" href="courses.html">📚 कोर्सेज</a>
              <a class="exam-nav-pill" href="about.html">ℹ️ About</a>
              <a class="exam-nav-pill" href="contact.html">📞 Contact</a>
            </div>

            <div class="topbar-right" style="gap:8px;">
              <button class="lang-toggle-btn" id="examLangToggleBtn" type="button" title="भाषा बदलें / Switch Language (Hindi / English)" aria-label="भाषा बदलें">
                <span class="lang-icon">🌐</span>
                <span class="lang-badge">
                  <span class="lang-opt ${curLang === 'hi' ? 'active' : ''}">HI</span>
                  <span class="lang-divider">|</span>
                  <span class="lang-opt ${curLang === 'en' ? 'active' : ''}">EN</span>
                </span>
              </button>
              <button class="theme-toggle-btn" id="examThemeToggle" type="button" title="थीम बदलें">
                <span class="theme-icon-indicator" id="themeIcon">${curTheme === "dark" ? "☀️" : "🌙"}</span>
              </button>
              <a href="login.html" class="secondary-button" style="font-size: 13px; font-weight: 700; padding: 7px 16px; border-radius: 999px; text-decoration: none; white-space: nowrap;">
                🔐 Login
              </a>
              <a href="login.html" class="primary-button" style="font-size: 13px; font-weight: 800; padding: 7px 18px; border-radius: 999px; text-decoration: none; white-space: nowrap;">
                ✨ Sign Up
              </a>
            </div>
          `;
        } else {
          // Standard Application Topbar
          topbar.innerHTML = `
            <div class="topbar-left exam-topbar-wrap">
              <button class="exam-menu-btn" id="examMenuToggleBtn" type="button" aria-label="नेविगेशन मेनू खोलें" title="सभी पेज खोलें">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
              </button>
              <a class="brand" href="index.html" aria-label="SchoolBrain">
                <span class="brand-title">SchoolBrain</span>
              </a>
            </div>

            <div class="exam-subnav-scroll">
              <a class="exam-nav-pill ${activePage === "courses" ? "active" : ""}" href="courses.html">📚 कोर्सेज</a>
              <a class="exam-nav-pill ${activePage === "dashboard" ? "active" : ""}" href="dashboard.html">👨‍🎓 डैशबोर्ड</a>
              <a class="exam-nav-pill ${activePage === "quiz-center" ? "active" : ""}" href="quiz-center.html">🎯 क्विज़ हब</a>
              <a class="exam-nav-pill ${activePage === "notes" ? "active" : ""}" href="notes.html">📑 नोट्स व सूत्र</a>
              <a class="exam-nav-pill ${activePage === "videos" ? "active" : ""}" href="videos.html">🎥 वीडियो</a>
            </div>

            <div class="topbar-right" style="gap:8px;">
              <button class="lang-toggle-btn" id="examLangToggleBtn" type="button" title="भाषा बदलें / Switch Language (Hindi / English)" aria-label="भाषा बदलें">
                <span class="lang-icon">🌐</span>
                <span class="lang-badge">
                  <span class="lang-opt ${curLang === 'hi' ? 'active' : ''}">HI</span>
                  <span class="lang-divider">|</span>
                  <span class="lang-opt ${curLang === 'en' ? 'active' : ''}">EN</span>
                </span>
              </button>
              <button class="theme-toggle-btn" id="examSpotlightToggle" type="button" title="त्वरित खोज (Ctrl+K)" aria-label="खोजें" style="display:inline-flex; align-items:center; justify-content:center; gap:4px; padding:0 10px; font-weight:700; font-size:12px;">
                <span>🔍</span><span class="spotlight-kbd" style="font-size:10px; padding:1px 5px;">Ctrl+K</span>
              </button>
              <button class="theme-toggle-btn" id="examThemeToggle" type="button" title="थीम बदलें">
                <span class="theme-icon-indicator" id="themeIcon">${curTheme === "dark" ? "☀️" : "🌙"}</span>
              </button>
            </div>
          `;
        }



        // Handle Theme Toggle
        const tBtn = document.getElementById("examThemeToggle");
        if (tBtn) tBtn.addEventListener("click", () => ExamSuite.toggleTheme());
        const lBtn = document.getElementById("examLangToggleBtn");
        if (lBtn) lBtn.addEventListener("click", () => toggleLanguage());

        // Handle Forward and Backward Buttons
        const backBtn = document.getElementById("topbarBackBtn");
        const fwdBtn = document.getElementById("topbarFwdBtn");
        const curFlow = PAGE_FLOW[activePage] || { prev: { title: "डैशबोर्ड", url: "dashboard.html" }, next: { title: "क्विज़ सेंटर", url: "quiz-center.html" } };

        if (backBtn) {
          if (!curFlow.prev) {
            backBtn.title = "पीछे (इतिहास)";
            backBtn.addEventListener("click", () => {
              if (window.history.length > 1) window.history.back();
              else window.location.href = "index.html";
            });
          } else {
            backBtn.title = `पीछे: ${curFlow.prev.title}`;
            backBtn.addEventListener("click", () => {
              window.location.href = curFlow.prev.url;
            });
          }
        }

        if (fwdBtn) {
          if (!curFlow.next) {
            fwdBtn.disabled = true;
          } else {
            fwdBtn.title = `आगे: ${curFlow.next.title}`;
            fwdBtn.addEventListener("click", () => {
              window.location.href = curFlow.next.url;
            });
          }
        }
      }

      // 2. Inject Universal Sidebar Drawer if not already on page
      if (!document.getElementById("examUniversalDrawer")) {
        const backdrop = document.createElement("div");
        backdrop.id = "examDrawerBackdrop";
        backdrop.className = "sidebar-backdrop";
        backdrop.setAttribute("aria-hidden", "true");

        const drawer = document.createElement("aside");
        drawer.id = "examUniversalDrawer";
        drawer.className = "sidebar-drawer";
        drawer.setAttribute("aria-label", "यूनिवर्सल नेविगेशन");
        drawer.setAttribute("aria-hidden", "true");

        let studentName = "विद्यार्थी";
        let studentSchool = "कक्षा 9 व 10 · RBSE";
        try {
          const prof = JSON.parse(localStorage.getItem("iMentorStudentProfile") || "{}");
          if (prof.name || prof.studentName) studentName = prof.name || prof.studentName;
          if (prof.school) studentSchool = prof.school;
        } catch (e) {}

        drawer.innerHTML = `
          <div class="sidebar-header">
            <div class="sidebar-brand">
              <span class="brand-mark logo-mark"><img src="assets/mentor-logo-header.png" alt="SchoolBrain"></span>
              <div class="sidebar-brand-text">
                <strong>SchoolBrain</strong>
                <span>कक्षा 9 व 10 ई-लर्निंग</span>
              </div>
            </div>
            <button class="sidebar-close-btn" id="closeExamDrawerBtn" type="button" aria-label="मेनू बंद करें">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="sidebar-profile" style="margin: 12px 16px;">
            <div class="profile-avatar">👨‍🎓</div>
            <div class="profile-details">
              <strong>${studentName}</strong>
              <span style="font-size: 11px; color: var(--muted);">${studentSchool}</span>
            </div>
            <a href="login.html" class="profile-switch-btn" style="text-decoration: none; display: inline-block;">बदलें</a>
          </div>

          <div class="sidebar-content">
            <!-- 1. Public Website -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">🌐 सार्वजनिक वेबसाइट (Public)</span>
              <nav class="sidebar-nav">
                <a class="sidebar-nav-item ${activePage === "home" ? "active" : ""}" href="index.html">
                  <span class="nav-icon">⌂</span>
                  <span class="nav-text">मुख्य पृष्ठ (Home)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "courses" ? "active" : ""}" href="courses.html">
                  <span class="nav-icon">📚</span>
                  <span class="nav-text">पाठ्यक्रम (Courses)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "about" ? "active" : ""}" href="about.html">
                  <span class="nav-icon">ℹ️</span>
                  <span class="nav-text">हमारे बारे में (About Us)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "contact" ? "active" : ""}" href="contact.html">
                  <span class="nav-icon">📞</span>
                  <span class="nav-text">संपर्क एवं सहायता (Contact)</span>
                </a>
              </nav>
            </div>

            <!-- 2. Student Portal -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">👨‍🎓 विद्यार्थी कार्यक्षेत्र (Student Dashboard)</span>
              <nav class="sidebar-nav">
                <a class="sidebar-nav-item ${activePage === "dashboard" ? "active" : ""}" href="dashboard.html">
                  <span class="nav-icon">👨‍🎓</span>
                  <span class="nav-text">छात्र डैशबोर्ड (Dashboard)</span>
                  <span class="nav-badge-pill">हब</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "subjects" ? "active" : ""}" href="subjects.html">
                  <span class="nav-icon">📖</span>
                  <span class="nav-text">कक्षा 9 व 10 सभी विषय</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "notes" ? "active" : ""}" href="notes.html">
                  <span class="nav-icon">📑</span>
                  <span class="nav-text">नोट्स एवं सूत्र (Notes & PDFs)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "videos" ? "active" : ""}" href="videos.html">
                  <span class="nav-icon">🎥</span>
                  <span class="nav-text">वीडियो लेक्चर्स (Videos)</span>
                </a>
              </nav>
            </div>

            <!-- 3. Exam Suite -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">🎯 परीक्षा एवं टेस्ट पोर्टल (Exam Suite)</span>
              <nav class="sidebar-nav">
                <a class="sidebar-nav-item ${activePage === "quiz-center" ? "active" : ""}" href="quiz-center.html">
                  <span class="nav-icon">🎯</span>
                  <span class="nav-text">क्विज़ सेंटर (Quiz Center)</span>
                  <span class="nav-badge-pill">हब</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "chapter-tests" ? "active" : ""}" href="chapter-tests.html">
                  <span class="nav-icon">📚</span>
                  <span class="nav-text">अध्यायवार टेस्ट (Chapter Tests)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "mock-exams" ? "active" : ""}" href="mock-exams.html">
                  <span class="nav-icon">📝</span>
                  <span class="nav-text">संपूर्ण मॉक परीक्षा (Mock Exams)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "exam-timer" ? "active" : ""}" href="exam-timer.html">
                  <span class="nav-icon">⏱️</span>
                  <span class="nav-text">परीक्षा टाइमर मोड (Timed Exam)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "previous-papers" ? "active" : ""}" href="previous-papers.html">
                  <span class="nav-icon">📜</span>
                  <span class="nav-text">विगत वर्षों के पेपर्स (2021-26)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "sample-papers" ? "active" : ""}" href="sample-papers.html">
                  <span class="nav-icon">📑</span>
                  <span class="nav-text">मॉडल प्रश्न पत्र (Sample Papers)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "workbook" ? "active" : ""}" href="workbook-quiz.html">
                  <span class="nav-icon">📘</span>
                  <span class="nav-text">Workbook Quiz (कार्यपत्रक)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "question-bank" ? "active" : ""}" href="question-bank.html">
                  <span class="nav-icon">🔍</span>
                  <span class="nav-text">सर्च प्रश्न बैंक (Question Bank)</span>
                </a>
              </nav>
            </div>

            <!-- 4. Student Progress & Tools -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">📊 विद्यार्थी प्रगति एवं टूल्स</span>
              <nav class="sidebar-nav">
                <a class="sidebar-nav-item ${activePage === "mistake-book" ? "active" : ""}" href="mistake-book.html">
                  <span class="nav-icon">❌</span>
                  <span class="nav-text">भूल सुधार पुस्तिका (Mistake Book)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "revision-planner" ? "active" : ""}" href="revision-planner.html">
                  <span class="nav-icon">📅</span>
                  <span class="nav-text">रिवीजन प्लानर (Study Planner)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "leaderboard" ? "active" : ""}" href="leaderboard.html">
                  <span class="nav-icon">🏆</span>
                  <span class="nav-text">लीडरबोर्ड एवं बैज (Leaderboard)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "result" ? "active" : ""}" href="result.html">
                  <span class="nav-icon">📊</span>
                  <span class="nav-text">नवीनतम परिणाम (Latest Result)</span>
                </a>
              </nav>
            </div>

            <!-- 5. Admin & Logout -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">⚙️ प्रबंधन एवं लॉगआउट</span>
              <nav class="sidebar-nav">

                <a class="sidebar-nav-item" href="login.html">
                  <span class="nav-icon">🔄</span>
                  <span class="nav-text">विद्यार्थी बदलें / लॉगिन</span>
                </a>
              </nav>
            </div>
          </div>
          
          <div class="sidebar-footer">
            <span>SchoolBrain</span>
            <span>कक्षा 9 व 10</span>
          </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(drawer);

        function openDrawer() {
          drawer.classList.add("open");
          backdrop.classList.add("open");
          drawer.setAttribute("aria-hidden", "false");
          backdrop.setAttribute("aria-hidden", "false");
        }

        function closeDrawer() {
          drawer.classList.remove("open");
          backdrop.classList.remove("open");
          drawer.setAttribute("aria-hidden", "true");
          backdrop.setAttribute("aria-hidden", "true");
        }

        backdrop.addEventListener("click", closeDrawer);
        const closeBtn = document.getElementById("closeExamDrawerBtn");
        if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

        const openBtn = document.getElementById("examMenuToggleBtn");
        if (openBtn) openBtn.addEventListener("click", openDrawer);
      }

      // 3. Inject Mobile Bottom Navigation Bar if not already present
      if (!document.getElementById("examBottomNav")) {
        const bNav = document.createElement("nav");
        bNav.id = "examBottomNav";
        bNav.className = "bottom-nav";
        bNav.setAttribute("aria-label", "मोबाइल नेविगेशन");
        bNav.innerHTML = `
          <a class="bottom-nav-item ${activePage === "home" ? "active" : ""}" href="index.html">
            <span class="bnav-icon">⌂</span>
            <span class="bnav-label">होम</span>
          </a>
          <a class="bottom-nav-item ${activePage === "courses" ? "active" : ""}" href="courses.html">
            <span class="bnav-icon">📚</span>
            <span class="bnav-label">कोर्सेज</span>
          </a>
          <a class="bottom-nav-item ${activePage === "quiz-center" ? "active" : ""}" href="quiz-center.html">
            <span class="bnav-icon">🎯</span>
            <span class="bnav-label">क्विज़</span>
          </a>
          <a class="bottom-nav-item ${activePage === "notes" ? "active" : ""}" href="notes.html">
            <span class="bnav-icon">📑</span>
            <span class="bnav-label">नोट्स</span>
          </a>
          <a class="bottom-nav-item ${activePage === "dashboard" ? "active" : ""}" href="dashboard.html">
            <span class="bnav-icon">👨‍🎓</span>
            <span class="bnav-label">डैशबोर्ड</span>
          </a>
        `;
        document.body.appendChild(bNav);
      }

      // 4. Inject Universal Forward/Backward Navigation Strip and Footer
      const footerContainer = document.getElementById("uFooterContainer");
      if (footerContainer) {
        const curFlow = PAGE_FLOW[activePage] || { prev: { title: "डैशबोर्ड", url: "dashboard.html" }, next: { title: "क्विज़ सेंटर", url: "quiz-center.html" } };
        
        const navStripHtml = `
          <div class="page-navigation-strip">
            ${curFlow.prev ? `
              <a href="${curFlow.prev.url}" class="page-nav-link prev-link">
                <span class="nav-dir">◀ पिछला पृष्ठ (Previous)</span>
                <strong class="nav-title">${curFlow.prev.title}</strong>
              </a>
            ` : `
              <div style="visibility:hidden;" class="page-nav-link"></div>
            `}
            <a href="dashboard.html" class="page-nav-home" title="छात्र डैशबोर्ड">
              <span>👨‍🎓 डैशबोर्ड</span>
            </a>
            ${curFlow.next ? `
              <a href="${curFlow.next.url}" class="page-nav-link next-link">
                <span class="nav-dir">अगला कदम (Next Step) ▶</span>
                <strong class="nav-title">${curFlow.next.title}</strong>
              </a>
            ` : `
              <div style="visibility:hidden;" class="page-nav-link"></div>
            `}
          </div>
        `;
        
        footerContainer.insertAdjacentHTML("beforebegin", navStripHtml);
        footerContainer.innerHTML = `
          <footer class="universal-footer" style="margin-top: 40px; padding: 40px 24px 24px; border-top: 1px solid var(--line); background: var(--paper);">
            <div class="u-footer-grid" style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px;">
              <div class="u-footer-col">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                  <img src="assets/mentor-logo-header.png" alt="Logo" style="height: 32px;">
                  <strong style="font-size: 16px; color: var(--ink);">SchoolBrain</strong>
                </div>
                <p style="font-size: 13px; color: var(--muted); line-height: 1.6;">
                  कक्षा 9 और 10 के विद्यार्थियों के लिए समर्पित ई-लर्निंग एवं परीक्षा पोर्टल। RBSE एवं CBSE बोर्ड के नवीनतम NCERT पाठ्यक्रम के अनुसार तैयारी।
                </p>
              </div>

              <div class="u-footer-col">
                <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px;">🌐 मुख्य पृष्ठ</h4>
                <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; font-size: 13px;">
                  <li><a href="index.html" style="color: var(--muted); text-decoration: none;">⌂ मुख्य पृष्ठ (Home)</a></li>
                  <li><a href="courses.html" style="color: var(--muted); text-decoration: none;">📚 पाठ्यक्रम (Courses)</a></li>
                  <li><a href="about.html" style="color: var(--muted); text-decoration: none;">ℹ️ हमारे बारे में (About Us)</a></li>
                  <li><a href="contact.html" style="color: var(--muted); text-decoration: none;">📞 संपर्क (Contact & Help)</a></li>
                  <li><a href="login.html" style="color: var(--muted); text-decoration: none;">🔐 छात्र लॉगिन (Student Login)</a></li>
                </ul>
              </div>

              <div class="u-footer-col">
                <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px;">🎯 परीक्षा एवं क्विज़ हब</h4>
                <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; font-size: 13px;">
                  <li><a href="quiz-center.html" style="color: var(--muted); text-decoration: none;">🎯 क्विज़ सेंटर (All Quizzes)</a></li>
                  <li><a href="chapter-tests.html" style="color: var(--muted); text-decoration: none;">📚 अध्यायवार टेस्ट</a></li>
                  <li><a href="mock-exams.html" style="color: var(--muted); text-decoration: none;">📝 संपूर्ण मॉक परीक्षा</a></li>
                  <li><a href="previous-papers.html" style="color: var(--muted); text-decoration: none;">📜 बोर्ड पेपर्स (2021-2026)</a></li>
                  <li><a href="question-bank.html" style="color: var(--muted); text-decoration: none;">🔍 सर्च प्रश्न बैंक</a></li>
                </ul>
              </div>

              <div class="u-footer-col">
                <h4 style="font-size: 14px; margin-bottom: 12px; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px;">👨‍🎓 विद्यार्थी कार्यक्षेत्र</h4>
                <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; font-size: 13px;">
                  <li><a href="dashboard.html" style="color: var(--muted); text-decoration: none;">👨‍🎓 छात्र डैशबोर्ड</a></li>
                  <li><a href="subjects.html" style="color: var(--muted); text-decoration: none;">📖 विषय सूची (Subjects)</a></li>
                  <li><a href="notes.html" style="color: var(--muted); text-decoration: none;">📑 नोट्स एवं सूत्र (Notes & PDFs)</a></li>
                  <li><a href="videos.html" style="color: var(--muted); text-decoration: none;">🎥 वीडियो लेक्चर्स</a></li>
                  
                </ul>
              </div>
            </div>

            <div style="max-width: 1100px; margin: 30px auto 0; padding-top: 18px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 12px; color: var(--muted);">
              <span>© 2026 SchoolBrain. सर्वाधिकार सुरक्षित।</span>
              <span>RBSE & CBSE Class 9 & 10 E-Learning Suite</span>
            </div>
          </footer>
        `;
      }
    }
  };

  window.ExamSuite = ExamSuite;

  // Secret Owner Access Shortcut: Ctrl + Shift + Alt + A
  document.addEventListener("keydown", function(e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.altKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      window.location.href = "admin.html";
    }
  });



  // ============================================================
  // UNIVERSAL BILINGUAL ENGINE (HINDI / ENGLISH SWITCHER)
  // ============================================================
  const LANG_STORAGE_KEY = "schoolbrain_lang";
  let currentLang = "hi";
  try {
    currentLang = localStorage.getItem(LANG_STORAGE_KEY) || "hi";
  } catch (e) {}

  const UI_DICTIONARY = {
    "🌟 लैंडिंग पेज": "🌟 Landing Page",
    "📚 कोर्सेज": "📚 Courses",
    "📚 पाठ्यक्रम": "📚 Courses",
    "👨‍🎓 डैशबोर्ड": "👨‍🎓 Dashboard",
    "🎯 क्विज़ हब": "🎯 Quiz Hub",
    "🎯 क्विज़ सेंटर": "🎯 Quiz Center",
    "📑 नोट्स व सूत्र": "📑 Notes & Formulas",
    "📑 नोट्स": "📑 Notes",
    "🎥 वीडियो": "🎥 Videos",
    "🎥 वीडियो लेक्चर्स": "🎥 Video Lectures",
    "📜 बोर्ड परीक्षा पेपर्स": "📜 Board Exam Papers",
    "📘 Workbook Quiz": "📘 Workbook Quiz",
    "🏛️ बोर्ड क्विज़": "🏛️ Board Quiz",
    "📐 सूत्र": "📐 Formulas",
    "कक्षा 10 गणित सूत्र": "Class 10 Math Formulas",
    "RBSE अध्यायवार बोर्ड क्विज़": "RBSE Chapterwise Board Quiz",
    "विद्यार्थी बदलें": "Switch Student",
    "त्वरित खोज (Ctrl+K)": "Search (Ctrl+K)",
    "सभी पेज खोलें": "Open Navigation Menu",
    "नेविगेशन मेनू खोलें": "Open Menu",
    "थीम बदलें": "Switch Theme",
    "ध्वनि चालू/बंद करें": "Toggle Sound",
    "मुख्य पृष्ठ पर जाएँ": "Go to Home",
    "मुख्य पृष्ठ": "Home Page",
    "हमारे बारे में": "About Us",
    "संपर्क एवं सहायता": "Contact & Support",
    "छात्र लॉगिन": "Student Login",
    "भूल सुधार": "Mistake Book",
    "रिवीजन प्लानर": "Revision Planner",
    "लीडरबोर्ड एवं रैंक": "Leaderboard & Rank",
    "परीक्षा परिणाम": "Exam Result",
    "उत्तर समीक्षा": "Answer Review",
    "अध्यायवार टेस्ट": "Chapter Tests",
    "सैंपल पेपर्स": "Sample Papers",
    "बोर्ड पेपर्स": "Board Papers",
    "पुराने पेपर्स": "Previous Papers",
    "प्रश्न बैंक": "Question Bank",
    "अभ्यास क्विज़": "Practice Quiz",
    "कक्षा 9 व 10 ई-लर्निंग": "Class 9 & 10 E-Learning",
    "कक्षा 10 गणित": "Class 10 Mathematics",
    "कक्षा 9 गणित": "Class 9 Mathematics",
    "कक्षा 10 विज्ञान": "Class 10 Science",
    "कक्षा 9 विज्ञान": "Class 9 Science",
    "शुरू करें": "Start Now",
    "जारी रखें": "Continue",
    "अभ्यास शुरू करें": "Start Practice"
  };

  const REVERSE_UI_DICTIONARY = {};
  Object.keys(UI_DICTIONARY).forEach(k => {
    REVERSE_UI_DICTIONARY[UI_DICTIONARY[k]] = k;
  });

  function getLanguage() {
    return currentLang;
  }

  function setLanguage(lang, triggerTranslate = true) {
    currentLang = (lang === "en") ? "en" : "hi";
    try {
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    } catch (e) {}

    document.documentElement.setAttribute("lang", currentLang);

    // Synchronize all language toggle buttons
    document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
      const opts = btn.querySelectorAll(".lang-opt");
      if (opts.length >= 2) {
        opts[0].classList.toggle("active", currentLang === "hi");
        opts[1].classList.toggle("active", currentLang === "en");
      }
      btn.title = currentLang === "hi" 
        ? "Switch to English / अंग्रेज़ी में बदलें" 
        : "हिन्दी में बदलें / Switch to Hindi";
    });

    // Apply fast client UI translations
    applyNavTranslations(currentLang);

    // Apply Google Translate integration
    if (triggerTranslate) {
      applyGoogleTranslate(currentLang);
    }

    // Emit event
    try {
      window.dispatchEvent(new CustomEvent("schoolbrain-lang-change", { detail: { lang: currentLang } }));
    } catch (e) {}
  }

  function toggleLanguage() {
    setLanguage(currentLang === "hi" ? "en" : "hi", true);
  }

  function applyNavTranslations(lang) {
    const targets = document.querySelectorAll(".exam-nav-pill, .board-chip, .topbar-desktop-link, .topbar-btn, .sidebar-link-title, .brand-title, .section-title, .cta-button");
    targets.forEach(el => {
      const text = el.textContent.trim();
      if (lang === "en") {
        if (!el.getAttribute("data-hi-text")) {
          el.setAttribute("data-hi-text", text);
        }
        if (UI_DICTIONARY[text]) {
          el.textContent = UI_DICTIONARY[text];
        }
      } else {
        const orig = el.getAttribute("data-hi-text");
        if (orig) {
          el.textContent = orig;
        } else if (REVERSE_UI_DICTIONARY[text]) {
          el.textContent = REVERSE_UI_DICTIONARY[text];
        }
      }
    });
  }

  function applyGoogleTranslate(lang) {
    try {
      const targetTrans = (lang === "en") ? "/auto/en" : "/auto/hi";
      document.cookie = `googtrans=${targetTrans}; path=/;`;
      if (window.location.hostname) {
        document.cookie = `googtrans=${targetTrans}; path=/; domain=${window.location.hostname};`;
      }

      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        return;
      }

      if (!window.google || !window.google.translate) {
        loadGoogleTranslate(lang);
      }
    } catch (e) {
      console.warn("Language switcher notice:", e);
    }
  }

  function loadGoogleTranslate(targetLang) {
    if (document.getElementById("googleTranslateScript")) return;

    if (!document.getElementById("google_translate_element")) {
      const gDiv = document.createElement("div");
      gDiv.id = "google_translate_element";
      gDiv.style.display = "none";
      document.body.appendChild(gDiv);
    }

    window.googleTranslateElementInit = function() {
      try {
        new window.google.translate.TranslateElement({
          pageLanguage: "hi",
          includedLanguages: "hi,en",
          autoDisplay: false
        }, "google_translate_element");

        if (targetLang === "en") {
          setTimeout(() => {
            const select = document.querySelector(".goog-te-combo");
            if (select) {
              select.value = "en";
              select.dispatchEvent(new Event("change"));
            }
          }, 350);
        }
      } catch (err) {}
    };

    const script = document.createElement("script");
    script.id = "googleTranslateScript";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }

  function setupLanguageSwitcher() {
    // Synchronize initial state
    setLanguage(currentLang, currentLang === "en");

    // Bind all buttons present in DOM
    document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
      btn.removeEventListener("click", toggleLanguage);
      btn.addEventListener("click", toggleLanguage);
    });

    const indexBtn = document.getElementById("indexLangToggleBtn");
    if (indexBtn) {
      indexBtn.removeEventListener("click", toggleLanguage);
      indexBtn.addEventListener("click", toggleLanguage);
    }

    // Also bind spotlight button on index if not bound
    const idxSpotlight = document.getElementById("indexSpotlightBtn");
    if (idxSpotlight && ExamSuite.openSpotlight) {
      idxSpotlight.addEventListener("click", () => ExamSuite.openSpotlight());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupLanguageSwitcher);
  } else {
    setupLanguageSwitcher();
  }

  // Expose to ExamSuite
  ExamSuite.getLanguage = getLanguage;
  ExamSuite.setLanguage = setLanguage;
  ExamSuite.toggleLanguage = toggleLanguage;

})(window);


  // Global Spotlight / Command Palette implementation
  function setupSpotlightSearch() {
    let backdrop = document.getElementById("spotlightBackdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "spotlightBackdrop";
      backdrop.className = "spotlight-backdrop";
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");
      backdrop.innerHTML = `
        <div class="spotlight-modal">
          <div class="spotlight-header">
            <div class="spotlight-input-wrap">
              <span style="font-size: 18px;">🔍</span>
              <input type="text" id="spotlightInput" class="spotlight-input" placeholder="अध्याय, सूत्र, विषय या टेस्ट खोजें... (उदा. त्रिकोणमिति, द्विघात, Mock, Notes)" autocomplete="off">
            </div>
            <button type="button" id="closeSpotlightBtn" style="background:none; border:none; cursor:pointer; font-size:18px; color:var(--muted); padding:4px 8px;">✕</button>
          </div>
          <div class="spotlight-tags">
            <button type="button" class="spotlight-tag-btn" data-search="त्रिकोणमिति">📐 त्रिकोणमिति</button>
            <button type="button" class="spotlight-tag-btn" data-search="द्विघात">🔢 द्विघात समीकरण</button>
            <button type="button" class="spotlight-tag-btn" data-search="मॉक">📝 मॉक परीक्षा</button>
            <button type="button" class="spotlight-tag-btn" data-search="नोट्स">📑 नोट्स व सूत्र</button>
            <button type="button" class="spotlight-tag-btn" data-search="बोर्ड पेपर">📜 बोर्ड पेपर्स</button>
            <button type="button" class="spotlight-tag-btn" data-search="विज्ञान">🔬 विज्ञान</button>
          </div>
          <ul class="spotlight-results" id="spotlightResults"></ul>
          <div class="spotlight-footer">
            <span>💡 <strong>↑↓</strong> नेविगेट करें &nbsp;|&nbsp; <strong>Enter</strong> खोलें &nbsp;|&nbsp; <strong>Esc</strong> बंद करें</span>
            <span>SchoolBrain Spotlight</span>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    const input = document.getElementById("spotlightInput");
    const resultsList = document.getElementById("spotlightResults");
    const closeBtn = document.getElementById("closeSpotlightBtn");

    const SEARCH_INDEX = [
      // Quick Navigation
      { title: "लैंडिंग पेज (SchoolBrain Landing Page)", sub: "Smarter learning platform, 1000+ courses & tracks", icon: "🌟", url: "landing.html", tag: "Showcase" },
      { title: "मुख्य पृष्ठ (Home Portal)", sub: "वेबसाइट का मुख्य द्वार एवं माइंड मैप", icon: "⌂", url: "index.html", tag: "Public" },
      { title: "पाठ्यक्रम (Courses Overview)", sub: "कक्षा 9 व 10 संपूर्ण कोर्स विवरण", icon: "📚", url: "courses.html", tag: "Public" },
      { title: "विषय सूची (All Subjects)", sub: "गणित, विज्ञान, सामाजिक विज्ञान, हिंदी, अंग्रेजी", icon: "📖", url: "subjects.html", tag: "Student" },
      { title: "छात्र डैशबोर्ड (Student Dashboard)", sub: "व्यक्तिगत प्रगति, स्कोर व विश्लेषण", icon: "👨‍🎓", url: "dashboard.html", tag: "Student" },
      { title: "क्विज़ सेंटर हब (Quiz Center)", sub: "अध्यायवार अभ्यास व वस्तुनिष्ठ प्रश्नोत्तरी", icon: "🎯", url: "quiz-center.html", tag: "Exam" },
      { title: "अध्यायवार टेस्ट (Chapter Speed Tests)", sub: "15-20 मिनट त्वरित अध्याय टेस्ट", icon: "📚", url: "chapter-tests.html", tag: "Exam" },
      { title: "संपूर्ण मॉक परीक्षा (Full Length Mock Exam)", sub: "80 अंक 3 घंटे बोर्ड परीक्षा पैटर्न", icon: "📝", url: "mock-exams.html", tag: "Exam" },
      { title: "परीक्षा टाइमर मोड (Timed Examination)", sub: "स्टॉपवॉच व रियल-टाइम काउंटडाउन टेस्ट", icon: "⏱️", url: "exam-timer.html", tag: "Exam" },
      { title: "विगत वर्षों के बोर्ड पेपर्स (Past Papers)", sub: "2015-2024 हल सहित प्रश्न पत्र", icon: "📜", url: "previous-papers.html", tag: "Exam" },
      { title: "मॉडल प्रश्न पत्र (Sample Papers)", sub: "नवीनतम बोर्ड ब्लूप्रिंट आधारित मॉडल पेपर्स", icon: "📑", url: "sample-papers.html", tag: "Exam" },
      { title: "Workbook Quiz (कार्यपत्रक)", sub: "वर्कबुक प्रश्नोत्तरी एवं अभ्यास", icon: "📘", url: "workbook-quiz.html", tag: "Exam" },
      { title: "सर्च प्रश्न बैंक (Question Bank)", sub: "सभी प्रश्नों में खोजें व फ़िल्टर करें", icon: "🔍", url: "question-bank.html", tag: "Exam" },
      { title: "नोट्स एवं सूत्र (Formula Sheets & PDFs)", sub: "अध्यायवार त्वरित पुनरावृत्ति नोट्स व सचित्र आरेख", icon: "📑", url: "notes.html", tag: "Material" },
      { title: "वीडियो लेक्चर्स (Video Lectures)", sub: "कठिन अवधारणाओं के एनिमेटेड वीडियो पाठ", icon: "🎥", url: "videos.html", tag: "Material" },
      { title: "मेरी भूल सुधार पुस्तिका (Mistake Book)", sub: "गलत प्रश्नों का व्यक्तिगत संग्रह व अभ्यास", icon: "❌", url: "mistake-book.html", tag: "Tools" },
      { title: "रिवीजन प्लानर (30/60 Day Study Planner)", sub: "बोर्ड परीक्षा टाइमटेबल व दैनिक चेकलिस्ट", icon: "📅", url: "revision-planner.html", tag: "Tools" },
      { title: "लीडरबोर्ड एवं रैंक (State Leaderboard)", sub: "राज्य स्तरीय छात्र रैंकिंग व बैज", icon: "🏆", url: "leaderboard.html", tag: "Tools" },
      { title: "छात्र लॉगिन एवं पंजीकरण (Student Login)", sub: "8 कॉलम डेटा व Google Sheets सिंक", icon: "🔐", url: "login.html", tag: "Account" },
      

      // Chapters (Class 10 Maths)
      { title: "वास्तविक संख्याएँ (Real Numbers)", sub: "यूक्लिड प्रमेय, अपरिमेयता प्रमाण, अभाज्य गुणनखंड", icon: "📐", url: "notes.html?ch=1", tag: "कक्षा 10 गणित" },
      { title: "बहुपद (Polynomials)", sub: "शून्यकों का ज्यामितीय अर्थ, द्विघात बहुपद के संबंध", icon: "📐", url: "notes.html?ch=2", tag: "कक्षा 10 गणित" },
      { title: "दो चरों वाले रैखिक समीकरण (Linear Equations)", sub: "विलोपन, प्रतिस्थापन व ग्राफीय विधि", icon: "📈", url: "notes.html?ch=3", tag: "कक्षा 10 गणित" },
      { title: "द्विघात समीकरण (Quadratic Equations)", sub: "गुणनखंड विधि, श्रीधराचार्य सूत्र x = (-b ± √D)/2a", icon: "🔢", url: "notes.html?ch=4", tag: "कक्षा 10 गणित" },
      { title: "समांतर श्रेढ़ियाँ (Arithmetic Progressions - AP)", sub: "nवाँ पद an = a+(n-1)d, योगफल Sn = n/2(2a+(n-1)d)", icon: "➕", url: "notes.html?ch=5", tag: "कक्षा 10 गणित" },
      { title: "त्रिभुज (Triangles & Thales Theorem)", sub: "थेल्स प्रमेय BPT, समरूपता कसौटियाँ (AAA, SSS, SAS)", icon: "📐", url: "notes.html?ch=6", tag: "कक्षा 10 गणित" },
      { title: "निर्देशांक ज्यामिति (Coordinate Geometry)", sub: "दूरी सूत्र √((x2-x1)²+(y2-y1)²), विभाजन सूत्र", icon: "📍", url: "notes.html?ch=7", tag: "कक्षा 10 गणित" },
      { title: "त्रिकोणमिति का परिचय (Trigonometry)", sub: "sin, cos, tan, cot, sec, cosec व सर्वसमिकाएँ", icon: "📐", url: "notes.html?ch=8", tag: "कक्षा 10 गणित" },
      { title: "त्रिकोणमिति के अनुप्रयोग (Heights & Distances)", sub: "उन्नयन कोण, अवनमन कोण एवं भवन/मीनार ऊँचाई", icon: "🏔️", url: "notes.html?ch=9", tag: "कक्षा 10 गणित" },
      { title: "वृत्त (Circles & Tangents)", sub: "स्पर्श रेखा प्रमेय 10.1 व 10.2 (PA = PB)", icon: "⭕", url: "notes.html?ch=10", tag: "कक्षा 10 गणित" },
      { title: "वृत्तों से संबंधित क्षेत्रफल (Areas Related to Circles)", sub: "त्रिज्यखंड का क्षेत्रफल (θ/360)×πr², वृत्तखंड", icon: "🍕", url: "notes.html?ch=11", tag: "कक्षा 10 गणित" },
      { title: "पृष्ठीय क्षेत्रफल एवं आयतन (Surface Areas & Volumes)", sub: "बेलन, शंकु, गोला, अर्द्धगोला के सूत्र", icon: "🧊", url: "notes.html?ch=12", tag: "कक्षा 10 गणित" },
      { title: "सांख्यिकी (Statistics)", sub: "प्रत्यक्ष, कल्पित माध्य विधि, माध्यक व बहुलक", icon: "📊", url: "notes.html?ch=13", tag: "कक्षा 10 गणित" },
      { title: "प्रायिकता (Probability)", sub: "P(E) = अनुकूल परिणाम / कुल परिणाम", icon: "🎲", url: "notes.html?ch=14", tag: "कक्षा 10 गणित" },

      // Science Chapters
      { title: "रासायनिक अभिक्रियाएँ एवं समीकरण (Reactions)", sub: "संयोजन, वियोजन, विस्थापन, अपचयन-उपचयन", icon: "⚗️", url: "notes.html?subject=science&ch=1", tag: "कक्षा 10 विज्ञान" },
      { title: "अम्ल, क्षारक एवं लवण (Acids, Bases & Salts)", sub: "pH मान, सूचक, बेकिंग सोडा, विरंजक चूर्ण", icon: "🧪", url: "notes.html?subject=science&ch=2", tag: "कक्षा 10 विज्ञान" },
      { title: "जैव प्रक्रम (Life Processes)", sub: "पोषण, श्वसन, मानव हृदय परिसंचरण, उत्सर्जन", icon: "🫀", url: "notes.html?subject=science&ch=6", tag: "कक्षा 10 विज्ञान" },
      { title: "प्रकाश: परावर्तन एवं अपवर्तन (Optics)", sub: "दर्पण सूत्र 1/f = 1/v + 1/u, लेंस सूत्र, अपवर्तनांक", icon: "🔦", url: "notes.html?subject=science&ch=10", tag: "कक्षा 10 विज्ञान" },
      { title: "विद्युत (Electricity & Circuits)", sub: "ओम का नियम V = IR, प्रतिरोधों का संयोजन", icon: "⚡", url: "notes.html?subject=science&ch=12", tag: "कक्षा 10 विज्ञान" }
    ];

    let highlightedIndex = 0;

    function renderResults(query = "") {
      const q = query.trim().toLowerCase();
      let matched = SEARCH_INDEX;
      if (q) {
        matched = SEARCH_INDEX.filter(item => 
          item.title.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          item.tag.toLowerCase().includes(q)
        );
      }
      matched = matched.slice(0, 8); // Top 8 results
      highlightedIndex = 0;

      if (!matched.length) {
        resultsList.innerHTML = `
          <li style="padding: 24px; text-align: center; color: var(--muted); font-size: 14px;">
            🔍 "<strong>${query}</strong>" से संबंधित कोई परिणाम नहीं मिला।<br>
            <span style="font-size:12px; margin-top:6px; display:inline-block;">अन्य शब्द जैसे 'गणित', 'त्रिकोणमिति', 'मॉक' या 'नोट्स' खोजें।</span>
          </li>
        `;
        return;
      }

      resultsList.innerHTML = matched.map((item, idx) => `
        <li class="spotlight-item ${idx === 0 ? 'highlighted' : ''}" data-url="${item.url}" data-idx="${idx}">
          <div class="spotlight-item-left">
            <span class="spotlight-item-icon">${item.icon}</span>
            <div>
              <strong class="spotlight-item-title">${item.title}</strong>
              <span class="spotlight-item-sub">${item.sub}</span>
            </div>
          </div>
          <span class="spotlight-item-tag">${item.tag}</span>
        </li>
      `).join("");

      // Add click listeners to items
      resultsList.querySelectorAll(".spotlight-item").forEach(el => {
        el.addEventListener("click", () => {
          const url = el.getAttribute("data-url");
          if (url) window.location.href = url;
        });
      });
    }

    function openSpotlight(initialQuery = "") {
      backdrop.classList.add("active");
      document.body.style.overflow = "hidden";
      input.value = initialQuery;
      renderResults(initialQuery);
      setTimeout(() => input.focus(), 50);
    }

    function closeSpotlight() {
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (closeBtn) closeBtn.addEventListener("click", closeSpotlight);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeSpotlight();
    });

    input.addEventListener("input", (e) => {
      renderResults(e.target.value);
    });

    input.addEventListener("keydown", (e) => {
      const items = resultsList.querySelectorAll(".spotlight-item");
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        highlightedIndex = (highlightedIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle("highlighted", i === highlightedIndex));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle("highlighted", i === highlightedIndex));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cur = items[highlightedIndex];
        if (cur) {
          const url = cur.getAttribute("data-url");
          if (url) window.location.href = url;
        }
      } else if (e.key === "Escape") {
        closeSpotlight();
      }
    });

    // Tag click listeners
    backdrop.querySelectorAll(".spotlight-tag-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const term = btn.getAttribute("data-search") || "";
        input.value = term;
        renderResults(term);
        input.focus();
      });
    });

    // Global Keyboard Shortcut: Ctrl + K or Cmd + K
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (backdrop.classList.contains("active")) {
          closeSpotlight();
        } else {
          openSpotlight();
        }
      } else if (e.key === "Escape" && backdrop.classList.contains("active")) {
        closeSpotlight();
      }
    });

    // Bind Spotlight button in topbar if present
    const spotlightBtn = document.getElementById("examSpotlightToggle");
    if (spotlightBtn) {
      spotlightBtn.addEventListener("click", () => openSpotlight());
    }

    ExamSuite.openSpotlight = openSpotlight;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSpotlightSearch);
  } else {
    setupSpotlightSearch();
  }


// Global Water Button Ripple Engine
document.addEventListener("click", function(e) {
  const btn = e.target.closest("button, .primary-button, .secondary-button, .subject-tile-btn, .exam-nav-pill, .board-chip.topbar-btn, .topbar-arrow-btn, .class-tab-btn, .page-nav-home");
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const ripple = document.createElement("span");
  ripple.className = "water-ripple-wave";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  btn.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 700);
});
