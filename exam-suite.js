/**
 * I_Mentor_99 - Examination & Practice Suite Shared Engine
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
    { id: "home", href: "index.html", label: "⌂ होम (Home)", icon: "⌂", group: "main" },
    { id: "subjects", href: "subjects.html", label: "📚 विषय सूची (Subjects)", icon: "📚", group: "main" },
    { id: "quiz-center", href: "quiz-center.html", label: "🎯 क्विज़ सेंटर (Quiz Center)", icon: "🎯", group: "exam" },
    { id: "chapter-tests", href: "chapter-tests.html", label: "📚 अध्यायवार टेस्ट (Chapter Tests)", icon: "📚", group: "exam" },
    { id: "mock-exams", href: "mock-exams.html", label: "📝 संपूर्ण मॉक परीक्षा (Mock Exams)", icon: "📝", group: "exam" },
    { id: "exam-timer", href: "exam-timer.html", label: "⏱️ परीक्षा टाइमर (Timed Exam)", icon: "⏱️", group: "exam" },
    { id: "previous-papers", href: "previous-papers.html", label: "📜 बोर्ड पेपर्स (Previous Papers)", icon: "📜", group: "exam" },
    { id: "sample-papers", href: "sample-papers.html", label: "📑 मॉडल प्रश्न पत्र (Sample Papers)", icon: "📑", group: "exam" },
    { id: "workbook", href: "workbook-quiz.html", label: "📘 Workbook Quiz (कार्यपत्रक)", icon: "📘", group: "exam" },
    { id: "question-bank", href: "question-bank.html", label: "🔍 सर्च प्रश्न बैंक (Question Bank)", icon: "🔍", group: "exam" },
    { id: "mistake-book", href: "mistake-book.html", label: "❌ भूल सुधार पुस्तिका (Mistake Book)", icon: "❌", group: "tools" },
    { id: "revision-planner", href: "revision-planner.html", label: "📅 रिवीजन प्लानर (Study Planner)", icon: "📅", group: "tools" },
    { id: "leaderboard", href: "leaderboard.html", label: "🏆 लीडरबोर्ड एवं बैज (Leaderboard)", icon: "🏆", group: "tools" },
    { id: "result", href: "result.html", label: "📊 नवीनतम परिणाम (Latest Result)", icon: "📊", group: "tools" },
    { id: "answer-review", href: "answer-review.html", label: "📝 उत्तर समीक्षा (Answer Review)", icon: "📝", group: "tools" }
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
      const topbar = document.getElementById("examTopNav");
      const curTheme = document.documentElement.getAttribute("data-theme") || "light";

      // 1. Render Topbar if element exists
      if (topbar) {
        topbar.innerHTML = `
          <div class="topbar-left exam-topbar-wrap">
            <button class="exam-menu-btn" id="examMenuToggleBtn" type="button" aria-label="नेविगेशन मेनू खोलें" title="सभी पेज खोलें">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
            <a class="brand" href="index.html" aria-label="मुख्य पृष्ठ पर जाएँ">
              <span class="brand-mark logo-mark"><img src="assets/mentor-logo-header.png" alt="I_Mentor_99"></span>
              <span class="home-label">⌂ होम</span>
              <span class="brand-title">कक्षा 10 गणित</span>
            </a>
          </div>

          <div class="exam-subnav-scroll">
            ${ALL_PAGES.filter(p => p.group === "exam" || p.id === "quiz-center").map(n => `
              <a class="exam-nav-pill ${activePage === n.id ? "active" : ""}" href="${n.href}">
                ${n.label}
              </a>
            `).join("")}
          </div>

          <div class="topbar-right" style="gap:8px;">
            <select class="exam-quick-select" id="examQuickPageSelect" aria-label="त्वरित पेज चुनें" title="सीधे किसी भी पेज पर जाएँ">
              <option value="" disabled selected>📑 त्वरित पेज...</option>
              <optgroup label="मुख्य मेनू">
                <option value="index.html">⌂ मुख्य पृष्ठ (होम)</option>
                <option value="admin.html">⚙️ एडमिन पोर्टल</option>
              </optgroup>
              <optgroup label="परीक्षा एवं टेस्ट पोर्टल">
                <option value="quiz-center.html">🎯 क्विज़ सेंटर</option>
                <option value="chapter-tests.html">📚 अध्यायवार टेस्ट</option>
                <option value="mock-exams.html">📝 संपूर्ण मॉक परीक्षा</option>
                <option value="exam-timer.html">⏱️ परीक्षा टाइमर मोड</option>
                <option value="previous-papers.html">📜 विगत वर्षों के पेपर्स</option>
                <option value="sample-papers.html">📑 मॉडल प्रश्न पत्र</option>
                <option value="workbook-quiz.html">📘 Workbook Quiz</option>
                <option value="question-bank.html">🔍 सर्च प्रश्न बैंक</option>
              </optgroup>
              <optgroup label="विद्यार्थी प्रगति एवं टूल्स">
                <option value="mistake-book.html">❌ भूल सुधार पुस्तिका</option>
                <option value="revision-planner.html">📅 रिवीजन प्लानर</option>
                <option value="leaderboard.html">🏆 लीडरबोर्ड एवं बैज</option>
                <option value="result.html">📊 परीक्षा परिणाम</option>
                <option value="answer-review.html">📝 उत्तर समीक्षा</option>
              </optgroup>
            </select>

            <button class="theme-toggle-btn" id="examThemeToggle" type="button" title="थीम बदलें">
              <span class="theme-icon-indicator" id="themeIcon">${curTheme === "dark" ? "☀️" : "🌙"}</span>
            </button>
          </div>
        `;

        // Handle Quick Switcher
        const qSelect = document.getElementById("examQuickPageSelect");
        if (qSelect) {
          qSelect.addEventListener("change", (e) => {
            if (e.target.value) window.location.href = e.target.value;
          });
        }

        // Handle Theme Toggle
        const tBtn = document.getElementById("examThemeToggle");
        if (tBtn) tBtn.addEventListener("click", () => ExamSuite.toggleTheme());
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

        drawer.innerHTML = `
          <div class="sidebar-header">
            <div class="sidebar-brand">
              <span class="brand-mark logo-mark"><img src="assets/mentor-logo-header.png" alt="I_Mentor_99"></span>
              <div class="sidebar-brand-text">
                <strong>I_Mentor_99</strong>
                <span>कक्षा 10 गणित (RBSE)</span>
              </div>
            </div>
            <button class="sidebar-close-btn" id="examDrawerCloseBtn" type="button" aria-label="नेविगेशन बंद करें">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="sidebar-content">
            <!-- 1. Main Menu -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">मुख्य मेनू</span>
              <nav class="sidebar-nav">
                <a class="sidebar-nav-item ${activePage === "home" ? "active" : ""}" href="index.html">
                  <span class="nav-icon">⌂</span>
                  <span class="nav-text">मुख्य पृष्ठ (होम)</span>
                </a>
                <a class="sidebar-nav-item" href="index.html">
                  <span class="nav-icon">📐</span>
                  <span class="nav-text">गणित महत्वपूर्ण सूत्र (Formula Sheet)</span>
                </a>
                <a class="sidebar-nav-item" href="admin.html">
                  <span class="nav-icon">⚙️</span>
                  <span class="nav-text">एडमिन पोर्टल (Admin Panel)</span>
                </a>
              </nav>
            </div>

            <!-- 2. Exam Suite -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">परीक्षा एवं टेस्ट पोर्टल (Exam Suite)</span>
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

            <!-- 3. Student Progress & Tools -->
            <div class="sidebar-nav-group">
              <span class="sidebar-group-title">विद्यार्थी प्रगति एवं टूल्स</span>
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
                  <span class="nav-text">लीडरबोर्ड एवं रैंक (Leaderboard)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "result" ? "active" : ""}" href="result.html">
                  <span class="nav-icon">📊</span>
                  <span class="nav-text">परीक्षा परिणाम (Test Results)</span>
                </a>
                <a class="sidebar-nav-item ${activePage === "answer-review" ? "active" : ""}" href="answer-review.html">
                  <span class="nav-icon">📝</span>
                  <span class="nav-text">उत्तर समीक्षा (Answer Review)</span>
                </a>
              </nav>
            </div>
          </div>

          <div class="sidebar-footer">
            <span>सीखें, अभ्यास करें, आगे बढ़ें।</span>
            <span>कक्षा 10 · गणित (RBSE)</span>
          </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(drawer);

        // Open/Close Drawer Logic
        function openDrawer() {
          drawer.classList.add("open");
          backdrop.classList.add("open");
          drawer.setAttribute("aria-hidden", "false");
          document.body.classList.add("drawer-open");
        }

        function closeDrawer() {
          drawer.classList.remove("open");
          backdrop.classList.remove("open");
          drawer.setAttribute("aria-hidden", "true");
          document.body.classList.remove("drawer-open");
        }

        const menuBtn = document.getElementById("examMenuToggleBtn");
        const closeBtn = document.getElementById("examDrawerCloseBtn");

        if (menuBtn) menuBtn.addEventListener("click", openDrawer);
        if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
        backdrop.addEventListener("click", closeDrawer);

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") closeDrawer();
        });
      }

      // 3. Inject Universal Mobile Bottom Nav if not present
      if (!document.getElementById("examUniversalBottomNav")) {
        const bNav = document.createElement("nav");
        bNav.id = "examUniversalBottomNav";
        bNav.className = "bottom-nav";
        bNav.setAttribute("aria-label", "मोबाइल नेविगेशन");

        bNav.innerHTML = `
          <a class="bottom-nav-item ${activePage === "home" ? "active" : ""}" href="index.html">
            <span class="bnav-icon">⌂</span>
            <span class="bnav-label">होम</span>
          </a>
          <a class="bottom-nav-item ${activePage === "quiz-center" ? "active" : ""}" href="quiz-center.html">
            <span class="bnav-icon">🎯</span>
            <span class="bnav-label">क्विज़</span>
          </a>
          <a class="bottom-nav-item ${activePage === "chapter-tests" ? "active" : ""}" href="chapter-tests.html">
            <span class="bnav-icon">📚</span>
            <span class="bnav-label">टेस्ट</span>
          </a>
          <a class="bottom-nav-item ${activePage === "mistake-book" ? "active" : ""}" href="mistake-book.html">
            <span class="bnav-icon">❌</span>
            <span class="bnav-label">गलतियाँ</span>
          </a>
          <button class="bottom-nav-item" id="bnavMenuTrigger" type="button">
            <span class="bnav-icon">☰</span>
            <span class="bnav-label">मेनू</span>
          </button>
        `;

        document.body.appendChild(bNav);

        const bTrigger = document.getElementById("bnavMenuTrigger");
        if (bTrigger) {
          bTrigger.addEventListener("click", () => {
            const drawer = document.getElementById("examUniversalDrawer");
            const backdrop = document.getElementById("examDrawerBackdrop");
            if (drawer && backdrop) {
              drawer.classList.add("open");
              backdrop.classList.add("open");
              drawer.setAttribute("aria-hidden", "false");
              document.body.classList.add("drawer-open");
            }
          });
        }
      }

      // 4. Inject Universal Footer Hub if container exists
      const footerEl = document.querySelector(".footer");
      if (footerEl && !document.getElementById("uFooterGrid")) {
        const uGrid = document.createElement("div");
        uGrid.id = "uFooterGrid";
        uGrid.className = "universal-footer-grid";
        uGrid.innerHTML = `
          <div class="u-footer-col">
            <h4>मुख्य मेनू</h4>
            <ul>
              <li><a href="index.html">⌂ मुख्य पृष्ठ (होम)</a></li>
              <li><a href="admin.html">⚙️ एडमिन पोर्टल</a></li>
              <li><a href="leaderboard.html">🏆 लीडरबोर्ड एवं रैंकिंग</a></li>
            </ul>
          </div>
          <div class="u-footer-col">
            <h4>परीक्षा एवं टेस्ट पोर्टल</h4>
            <ul>
              <li><a href="quiz-center.html">🎯 क्विज़ सेंटर</a></li>
              <li><a href="chapter-tests.html">📚 अध्यायवार टेस्ट (1-15)</a></li>
              <li><a href="mock-exams.html">📝 संपूर्ण मॉक परीक्षा (80 अंक)</a></li>
              <li><a href="exam-timer.html">⏱️ परीक्षा टाइमर सिमुलेटर</a></li>
            </ul>
          </div>
          <div class="u-footer-col">
            <h4>बोर्ड पेपर्स व प्रश्न बैंक</h4>
            <ul>
              <li><a href="previous-papers.html">📜 विगत वर्षों के बोर्ड पेपर्स</a></li>
              <li><a href="sample-papers.html">📑 मॉडल प्रश्न पत्र 2026</a></li>
              <li><a href="workbook-quiz.html">📘 आधिकारिक वर्कबुक क्विज़</a></li>
              <li><a href="question-bank.html">🔍 300+ सर्च प्रश्न बैंक</a></li>
            </ul>
          </div>
          <div class="u-footer-col">
            <h4>विद्यार्थी सहायता एवं टूल्स</h4>
            <ul>
              <li><a href="mistake-book.html">❌ भूल सुधार पुस्तिका</a></li>
              <li><a href="revision-planner.html">📅 30-दिवसीय रिवीजन प्लानर</a></li>
              <li><a href="result.html">📊 परीक्षा परिणाम व अंकतालिका</a></li>
              <li><a href="answer-review.html">📝 उत्तर समीक्षा एवं हल</a></li>
            </ul>
          </div>
        `;
        footerEl.parentNode.insertBefore(uGrid, footerEl);
      }
    }
  };

  window.ExamSuite = ExamSuite;
})(window);
