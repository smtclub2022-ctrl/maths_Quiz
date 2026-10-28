(function () {
  "use strict";

  // --- Curriculum & Class/Subject State ---
  const CLASS_KEY = "iMentorClass";
  const SUBJECT_KEY = "iMentorSubject";

  let currentClassId = localStorage.getItem(CLASS_KEY) || "class10";
  let currentSubjectId = localStorage.getItem(SUBJECT_KEY) || "maths";
  let currentChapterIdx = null; // null means subject overview

  function getActiveCurriculum() {
    if (!window.curriculumData) return null;
    const cls = window.curriculumData[currentClassId] || window.curriculumData.class10;
    const subj = cls.subjects.find((s) => s.id === currentSubjectId) || cls.subjects[0];
    return { classInfo: cls, subject: subj };
  }

  function setClass(classId) {
    if (!window.curriculumData || !window.curriculumData[classId]) return;
    currentClassId = classId;
    currentChapterIdx = null;
    try {
      localStorage.setItem(CLASS_KEY, classId);
    } catch (e) {
      console.warn("Could not save class preference:", e);
    }
    updateClassAndSubjectUI();
    renderMainApp();
  }

  function setSubject(subjectId) {
    currentSubjectId = subjectId;
    currentChapterIdx = null;
    try {
      localStorage.setItem(SUBJECT_KEY, subjectId);
    } catch (e) {
      console.warn("Could not save subject preference:", e);
    }
    updateClassAndSubjectUI();
    renderMainApp();
  }

  // --- Theme Management ---
  const THEME_KEY = "iMentorTheme";
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      console.warn("Could not save theme preference:", e);
    }
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    const isDark = theme === "dark";
    btn.setAttribute("title", isDark ? "लाइट मोड पर स्विच करें (D)" : "डार्क मोड पर स्विच करें (D)");
    btn.setAttribute("aria-label", isDark ? "लाइट मोड पर स्विच करें" : "डार्क मोड पर स्विच करें");
  }

  // --- Sound & Audio Effects (Web Audio API Synthesizer) ---
  const SOUND_KEY = "iMentorSound";
  let soundEnabled = localStorage.getItem(SOUND_KEY) !== "off";
  if (!soundEnabled) document.body.classList.add("muted");

  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    try {
      localStorage.setItem(SOUND_KEY, soundEnabled ? "on" : "off");
    } catch (e) {
      console.warn("Could not save sound preference:", e);
    }
    document.body.classList.toggle("muted", !soundEnabled);
    updateSoundIcon();
    if (soundEnabled) playSuccessChime();
  }

  function updateSoundIcon() {
    const btn = document.getElementById("soundToggleBtn");
    if (!btn) return;
    btn.setAttribute("title", soundEnabled ? "ध्वनि बंद करें" : "ध्वनि चालू करें");
    btn.setAttribute("aria-label", soundEnabled ? "ध्वनि बंद करें" : "ध्वनि चालू करें");
  }

  function playTone(freq, type, duration, gainVal) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal || 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio restriction errors
    }
  }

  function playSuccessChime() {
    playTone(523.25, "triangle", 0.1, 0.08); // C5
    setTimeout(() => playTone(659.25, "triangle", 0.18, 0.07), 80); // E5
  }

  function playClickSound() {
    playTone(440, "sine", 0.04, 0.04);
  }

  function playCompleteFanfare() {
    if (!soundEnabled) return;
    playTone(523.25, "triangle", 0.1, 0.08);
    setTimeout(() => playTone(659.25, "triangle", 0.1, 0.08), 100);
    setTimeout(() => playTone(783.99, "triangle", 0.1, 0.08), 200);
    setTimeout(() => playTone(1046.5, "triangle", 0.3, 0.1), 300);
  }

  window.iMentorSound = {
    playSuccess: playSuccessChime,
    playClick: playClickSound,
    playComplete: playCompleteFanfare,
    isEnabled: () => soundEnabled
  };

  // --- Sidebar Drawer Management ---
  const drawer = document.getElementById("sidebarDrawer");
  const backdrop = document.getElementById("sidebarBackdrop");
  const toggleBtn = document.getElementById("sidebarToggleBtn");
  const closeBtn = document.getElementById("sidebarCloseBtn");

  function openSidebar() {
    if (!drawer || !backdrop) return;
    drawer.classList.add("open");
    backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
  }

  function closeSidebar() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
  // Topbar Back and Forward Button Handlers
  const idxBack = document.getElementById("indexBackBtn");
  const idxFwd = document.getElementById("indexFwdBtn");
  if (idxBack) {
    idxBack.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "dashboard.html";
      }
    });
  }
  if (idxFwd) {
    idxFwd.addEventListener("click", () => {
      window.location.href = "courses.html";
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (backdrop) backdrop.addEventListener("click", closeSidebar);

  // Global Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
      closeFormulaModal();
      closeRbseHub();
      return;
    }
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "select" || tag === "textarea") return;

    if (e.key === "/" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      openSidebar();
      setTimeout(() => {
        const input = document.getElementById("sidebarSearchInput");
        if (input) input.focus();
      }, 180);
    } else if (e.key === "d" || e.key === "D") {
      toggleTheme();
    } else if (e.key === "f" || e.key === "F") {
      openFormulaModal("algebra");
    } else if (e.key === "m" || e.key === "M") {
      if (drawer && drawer.classList.contains("open")) closeSidebar();
      else openSidebar();
    }
  });

  // --- Formula Modal Management ---
  const formulaModal = document.getElementById("formulaModal");
  const formulaBackdrop = document.getElementById("formulaBackdrop");
  const formulaCloseBtn = document.getElementById("formulaCloseBtn");

  function openFormulaModal(tabId) {
    if (!formulaModal) return;
    formulaModal.classList.add("open");
    if (formulaBackdrop) formulaBackdrop.classList.add("open");
    formulaModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (tabId) switchFormulaTab(tabId);
  }

  function closeFormulaModal() {
    if (!formulaModal) return;
    formulaModal.classList.remove("open");
    if (formulaBackdrop) formulaBackdrop.classList.remove("open");
    formulaModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  if (formulaCloseBtn) formulaCloseBtn.addEventListener("click", closeFormulaModal);
  if (formulaBackdrop) formulaBackdrop.addEventListener("click", closeFormulaModal);

  // --- RBSE Board Quiz Hub Modal Management ---
  const rbseHubModal = document.getElementById("rbseHubModal");
  const rbseHubBackdrop = document.getElementById("rbseHubBackdrop");
  const closeRbseHubBtn = document.getElementById("closeRbseHubBtn");

  function openRbseHub() {
    if (!rbseHubModal) return;
    renderRbseHubGrid();
    rbseHubModal.classList.add("open");
    if (rbseHubBackdrop) rbseHubBackdrop.classList.add("open");
    rbseHubModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeRbseHub() {
    if (!rbseHubModal) return;
    rbseHubModal.classList.remove("open");
    if (rbseHubBackdrop) rbseHubBackdrop.classList.remove("open");
    rbseHubModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  if (closeRbseHubBtn) closeRbseHubBtn.addEventListener("click", closeRbseHub);
  if (rbseHubBackdrop) rbseHubBackdrop.addEventListener("click", closeRbseHub);

  function renderRbseHubGrid() {
    const grid = document.getElementById("rbseHubGrid");
    if (!grid) return;
    const mathsCurriculum = window.curriculumData && window.curriculumData.class10 ? 
      window.curriculumData.class10.subjects.find(s => s.id === "maths") : null;
    const chList = (mathsCurriculum && mathsCurriculum.chapters) || (window.iMentor ? window.iMentor.getChapters() : []);

    grid.innerHTML = "";
    chList.forEach((ch, idx) => {
      const qCount = window.iMentor && typeof window.iMentor.getBoardQuestionsCount === "function" 
        ? window.iMentor.getBoardQuestionsCount(idx) 
        : 0;
      
      const card = document.createElement("div");
      card.className = "rbse-hub-card";
      card.innerHTML = `
        <div class="rbse-hub-card-header">
          <span class="rbse-hub-num">${idx + 1}</span>
          <div>
            <h4>${ch.title}</h4>
            <span style="font-size:11px; color:var(--muted);">${ch.englishTitle || ""}</span>
          </div>
        </div>
        <div class="rbse-hub-meta">
          <span>उपलब्ध बोर्ड प्रश्न:</span>
          <span class="rbse-hub-pill">${qCount} प्रश्न</span>
        </div>
        <button class="rbse-hub-btn" type="button" data-chapter="${idx}">
          अध्याय ${idx + 1} बोर्ड क्विज़ हल करें →
        </button>
      `;

      const btn = card.querySelector(".rbse-hub-btn");
      if (btn) {
        btn.addEventListener("click", () => {
          playClickSound();
          closeRbseHub();
          closeSidebar();
          if (currentClassId !== "class10" || currentSubjectId !== "maths") {
            currentClassId = "class10";
            currentSubjectId = "maths";
            updateClassAndSubjectUI();
          }
          if (window.iMentor && typeof window.iMentor.startBoardQuiz === "function") {
            window.iMentor.startBoardQuiz(idx);
          }
        });
      }
      grid.appendChild(card);
    });
  }

  function switchFormulaTab(tabId) {
    const tabs = document.querySelectorAll(".formula-tab");
    const panes = document.querySelectorAll(".formula-pane");
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabId);
    });
    panes.forEach((pane) => {
      pane.classList.toggle("active", pane.id === `formulaPane-${tabId}`);
    });
  }

  document.querySelectorAll(".formula-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchFormulaTab(tab.dataset.tab);
    });
  });

  // --- Sidebar Subject Pills & Chapters Population ---
  function populateSidebarSubjects() {
    const container = document.getElementById("sidebarSubjectPills");
    if (!container || !window.curriculumData) return;
    const curr = getActiveCurriculum();
    if (!curr) return;

    container.innerHTML = "";
    curr.classInfo.subjects.forEach((subj) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `subject-pill-btn ${subj.id === currentSubjectId ? "active" : ""}`;
      btn.innerHTML = `<span>${subj.icon}</span><span>${subj.name}</span>`;
      btn.addEventListener("click", () => {
        playClickSound();
        setSubject(subj.id);
      });
      container.appendChild(btn);
    });
  }

  function populateSidebarChapters() {
    const list = document.getElementById("sidebarChaptersList");
    if (!list) return;
    const curr = getActiveCurriculum();
    if (!curr) return;

    list.innerHTML = "";
    const chapters = curr.subject.chapters || [];

    chapters.forEach((ch, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `sidebar-chapter-item ${currentChapterIdx === idx ? "active" : ""}`;
      btn.dataset.chapter = idx;
      const exCount = (ch.exercises || []).length;
      btn.innerHTML = `
        <span class="sch-num" style="background:${curr.subject.accent}18; color:${curr.subject.accent};">${ch.number || idx + 1}</span>
        <div style="flex:1; min-width:0;">
          <span class="sch-title">${ch.title}</span>
          <span style="font-size:10px; color:var(--muted); display:block;">${exCount} अभ्यास / प्रश्नावली</span>
        </div>
      `;
      btn.addEventListener("click", () => {
        closeSidebar();
        playClickSound();
        if (currentClassId === "class10" && currentSubjectId === "maths" && window.iMentor) {
          window.iMentor.goToScreen("chapter", idx);
        } else {
          currentChapterIdx = idx;
          renderMainApp();
        }
      });
      list.appendChild(btn);
    });

    // Reset search box if open
    const searchInput = document.getElementById("sidebarSearchInput");
    if (searchInput) searchInput.value = "";
    const noMatch = document.getElementById("sidebarNoMatches");
    if (noMatch) noMatch.style.display = "none";
  }

  function updateClassAndSubjectUI() {
    const curr = getActiveCurriculum();
    if (!curr) return;

    // Update Class Tabs in Sidebar
    document.querySelectorAll(".class-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.class === currentClassId);
    });

    // Update Topbar
    const topClassLabel = document.getElementById("topbarClassLabel");
    if (topClassLabel) topClassLabel.textContent = curr.classInfo.name;

    const brandTitle = document.getElementById("topbarBrandTitle");
    if (brandTitle) brandTitle.textContent = `${curr.classInfo.name} ${curr.subject.name}`;

    const studentMeta = document.getElementById("sidebarStudentMeta");
    if (studentMeta) studentMeta.textContent = `राजस्थान बोर्ड · ${curr.classInfo.name}`;

    populateSidebarSubjects();
    populateSidebarChapters();
  }

  // --- Curriculum Renderer for Main Content (#app) ---
  function renderMainApp() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    // If Class 10 Maths is selected, let app.js handle the interactive quiz system!
    if (currentClassId === "class10" && currentSubjectId === "maths") {
      if (window.iMentor) {
        if (currentChapterIdx !== null) {
          window.iMentor.goToScreen("chapter", currentChapterIdx);
        } else {
          window.iMentor.goToScreen("home");
        }
      }
      return;
    }

    const curr = getActiveCurriculum();
    if (!curr) return;

    // If a specific chapter is open in explorer mode
    if (currentChapterIdx !== null && curr.subject.chapters[currentChapterIdx]) {
      renderCurriculumChapterDetail(appEl, curr, currentChapterIdx);
    } else {
      renderCurriculumSubjectOverview(appEl, curr);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCurriculumSubjectOverview(container, curr) {
    const subj = curr.subject;
    const chapters = subj.chapters || [];
    const totalExercises = chapters.reduce((sum, ch) => sum + (ch.exercises ? ch.exercises.length : 0), 0);

    const subjectStrip = curr.classInfo.subjects
      .map(
        (s) => `
      <button class="subject-strip-btn ${s.id === currentSubjectId ? "active" : ""}" data-subject="${s.id}" type="button">
        <span>${s.icon}</span>
        <span>${s.name}</span>
      </button>
    `
      )
      .join("");

    container.innerHTML = `
      <div class="subject-switch-strip" aria-label="विषय चुनें">${subjectStrip}</div>

      <section class="subject-banner" style="--accent:${subj.accent};">
        <div class="subject-banner-copy">
          <span class="subject-badge-pill">${curr.classInfo.name} · NCERT / RBSE</span>
          <h1>${subj.icon} ${subj.name}</h1>
          <p>${subj.description}</p>
        </div>
        <div class="subject-icon-art">${subj.icon}</div>
      </section>

      <section class="subject-stats-bar">
        <article class="subj-stat-card">
          <span>कुल अध्याय</span>
          <strong>${chapters.length}</strong>
        </article>
        <article class="subj-stat-card">
          <span>कुल अभ्यास / प्रश्नावली</span>
          <strong>${totalExercises}</strong>
        </article>
        <article class="subj-stat-card">
          <span>पाठ्यक्रम स्थिति</span>
          <strong style="color:var(--green);">100% पूर्ण</strong>
        </article>
      </section>

      <section>
        <div class="section-heading">
          <div>
            <h2>अध्याय एवं अभ्यास सूची</h2>
            <p>किसी अध्याय पर टैप करके उसकी सभी प्रश्नावली एवं मुख्य बिंदु देखें</p>
          </div>
          <span class="count-label">कुल ${chapters.length} अध्याय</span>
        </div>

        <div class="chapter-grid">
          ${chapters
            .map(
              (ch, idx) => `
            <button class="chapter-card" style="--accent:${subj.accent};" data-ch="${idx}" type="button">
              <span class="card-top">
                <span class="chapter-number">${ch.number || idx + 1}</span>
                <span class="card-arrow">↗</span>
              </span>
              <h3>${ch.title}</h3>
              <p style="font-size:11px; color:var(--muted); margin-bottom:6px;">${ch.englishTitle || ""}</p>
              <span class="chapter-card-exercises">📑 ${(ch.exercises || []).length} अभ्यास / प्रश्नावली</span>
            </button>
          `
            )
            .join("")}
        </div>
      </section>
    `;

    // Attach subject strip clicks
    container.querySelectorAll(".subject-strip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        playClickSound();
        setSubject(btn.dataset.subject);
      });
    });

    // Attach chapter card clicks
    container.querySelectorAll("[data-ch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        playClickSound();
        currentChapterIdx = Number(btn.dataset.ch);
        renderMainApp();
      });
    });
  }

  function renderCurriculumChapterDetail(container, curr, chIdx) {
    const subj = curr.subject;
    const ch = subj.chapters[chIdx];
    if (!ch) return;

    container.innerHTML = `
      <nav class="breadcrumb">
        <button id="backToSubjectHome" type="button">${curr.classInfo.name} ${subj.name}</button>
        <span>›</span>
        <span>अध्याय ${ch.number || chIdx + 1}: ${ch.title}</span>
      </nav>

      <article class="chapter-detail-hero">
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <div>
            <span class="eyebrow" style="color:${subj.accent};">अध्याय ${ch.number || chIdx + 1} · ${subj.name}</span>
            <h1>${ch.title}</h1>
            <p>${ch.englishTitle || ""}</p>
          </div>
          <span class="chapter-number" style="width:48px; height:48px; font-size:18px; border-radius:14px; background:${subj.accent}15; color:${subj.accent};">
            ${ch.number || chIdx + 1}
          </span>
        </div>
      </article>

      <section class="exercises-section">
        <div class="section-heading">
          <div>
            <h2>प्रश्नावली एवं अभ्यास (Exercises)</h2>
            <p>इस अध्याय के अंतर्गत आने वाले सभी अभ्यास</p>
          </div>
          <span class="count-label">${(ch.exercises || []).length} अभ्यास</span>
        </div>

        <div class="exercise-list">
          ${(ch.exercises || [])
            .map(
              (ex, i) => `
            <div class="exercise-card">
              <span class="exercise-icon" style="background:${subj.accent}15; color:${subj.accent};">${i + 1}</span>
              <div class="exercise-info">
                <strong>${ex}</strong>
                <span style="font-size:11px; color:var(--muted);">अभ्यास एवं समाधान</span>
              </div>
              <span style="font-size:12px; color:var(--muted); font-weight:700;">✓ NCERT</span>
            </div>
          `
            )
            .join("")}
        </div>
      </section>

      ${
        ch.keyPoints && ch.keyPoints.length
          ? `
        <section class="keypoints-section">
          <h3>📌 मुख्य अवधारणाएँ एवं सूत्र (Key Revision Points)</h3>
          <ul class="keypoints-list">
            ${ch.keyPoints.map((kp) => `<li><strong>${kp}</strong></li>`).join("")}
          </ul>
        </section>
      `
          : ""
      }

      <div class="chapter-actions-row">
        <button class="primary-button" id="startChapterExerciseBtn" type="button">
          अभ्यास प्रारंभ करें →
        </button>
        <button class="secondary-button" id="backToChaptersBtn" type="button">
          ← सभी अध्याय देखें
        </button>
      </div>
    `;

    const backHome = container.querySelector("#backToSubjectHome");
    const backBtn = container.querySelector("#backToChaptersBtn");
    const startBtn = container.querySelector("#startChapterExerciseBtn");

    if (backHome) backHome.addEventListener("click", () => { currentChapterIdx = null; renderMainApp(); });
    if (backBtn) backBtn.addEventListener("click", () => { currentChapterIdx = null; renderMainApp(); });
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        playSuccessChime();
        alert(`अध्याय: ${ch.title} का अभ्यास शुरू किया जा रहा है।`);
      });
    }
  }

  // --- UI Sync Function ---
  window.syncNavUI = function () {
    const active = window.iMentor ? window.iMentor.isSessionActive() : false;
    const currentScreen = window.iMentor ? window.iMentor.getCurrentScreen() : "home";
    const mistakesCount = window.iMentor ? window.iMentor.getMistakesCount() : 0;

    // Update Mistake Badges
    const badges = [
      document.getElementById("topbarMistakeBadge"),
      document.getElementById("sidebarMistakeBadge"),
      document.getElementById("bnavMistakeBadge")
    ];
    badges.forEach((b) => {
      if (!b) return;
      if (mistakesCount > 0) {
        b.textContent = mistakesCount;
        b.removeAttribute("hidden");
        b.style.display = "inline-flex";
      } else {
        b.setAttribute("hidden", "");
        b.style.display = "none";
      }
    });

    // Update Student Profile in Sidebar
    let studentName = "विद्यार्थी";
    let studentMeta = `राजस्थान बोर्ड · ${currentClassId === "class9" ? "कक्षा 9" : "कक्षा 10"}`;
    try {
      const savedProfile = localStorage.getItem("iMentorStudentProfile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name || parsed.studentName) studentName = parsed.name || parsed.studentName;
        const clsSec = (parsed.class ? parsed.class : "कक्षा 10") + (parsed.section ? `-${parsed.section}` : "");
        if (parsed.school) {
          studentMeta = `${clsSec} · ${parsed.school}`;
        } else {
          studentMeta = `राजस्थान बोर्ड · ${clsSec}`;
        }
      }
    } catch (e) {
      console.warn("Could not parse student profile:", e);
    }

    const nameEl = document.getElementById("sidebarStudentName");
    const metaEl = document.getElementById("sidebarStudentMeta");
    const switchBtn = document.getElementById("sidebarStudentSwitch");

    if (nameEl) nameEl.textContent = active ? studentName : "अतिथि विद्यार्थी";
    if (metaEl) metaEl.textContent = active ? studentMeta : `राजस्थान बोर्ड · ${currentClassId === "class9" ? "कक्षा 9" : "कक्षा 10"}`;
    if (switchBtn) {
      switchBtn.style.display = active ? "inline-block" : "none";
      switchBtn.onclick = () => {
        closeSidebar();
        if (window.iMentor) window.iMentor.switchStudent();
      };
    }

    // Update active states on sidebar nav items
    document.querySelectorAll(".sidebar-nav-item[data-nav]").forEach((item) => {
      item.classList.toggle("active", item.dataset.nav === currentScreen);
    });

    // Update active states on bottom nav
    const bnavItems = {
      home: document.getElementById("bnavHome"),
      mistakes: document.getElementById("bnavMistakes"),
      chapters: document.getElementById("bnavChapters")
    };
    Object.keys(bnavItems).forEach((key) => {
      if (bnavItems[key]) {
        bnavItems[key].classList.toggle("active", currentScreen === key);
      }
    });
  };

  // --- Attach Event Handlers on DOM Ready ---
  document.addEventListener("DOMContentLoaded", () => {
    // Theme button
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      updateThemeIcon(document.documentElement.getAttribute("data-theme") || "light");
      themeBtn.addEventListener("click", toggleTheme);
    }

    // Sound button
    const soundBtn = document.getElementById("soundToggleBtn");
    if (soundBtn) {
      updateSoundIcon();
      soundBtn.addEventListener("click", toggleSound);
    }

    // Class Selector Tabs in Sidebar
    document.querySelectorAll(".class-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        playClickSound();
        setClass(btn.dataset.class);
      });
    });

    // Class Toggle Button in Topbar
    const topClassBtn = document.getElementById("topbarClassToggleBtn");
    if (topClassBtn) {
      topClassBtn.addEventListener("click", () => {
        playClickSound();
        const nextClass = currentClassId === "class10" ? "class9" : "class10";
        setClass(nextClass);
      });
    }

    // Formulas buttons
    // RBSE Board Quiz Hub Buttons
    const topRbseBtn = document.getElementById("topbarRbseHubBtn");
    const sideRbseBtn = document.getElementById("sidebarRbseHubBtn");
    if (topRbseBtn) topRbseBtn.addEventListener("click", openRbseHub);
    if (sideRbseBtn) {
      sideRbseBtn.addEventListener("click", () => {
        closeSidebar();
        openRbseHub();
      });
    }

    const fTopBtn = document.getElementById("topbarFormulaBtn");
    const fSideBtn = document.getElementById("sidebarFormulaBtn");
    if (fTopBtn) fTopBtn.addEventListener("click", () => openFormulaModal("algebra"));
    if (fSideBtn) {
      fSideBtn.addEventListener("click", () => {
        closeSidebar();
        openFormulaModal("algebra");
      });
    }

    // Mistake buttons
    const topMistakeBtn = document.getElementById("topbarMistakesBtn");
    if (topMistakeBtn) {
      topMistakeBtn.addEventListener("click", () => {
        if (window.iMentor) window.iMentor.goToScreen("mistakes");
      });
    }

    // Home button in Topbar
    const homeBtn = document.getElementById("homeButton");
    if (homeBtn) {
      homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        currentChapterIdx = null;
        if (currentClassId === "class10" && currentSubjectId === "maths" && window.iMentor && window.iMentor.isSessionActive()) {
          window.iMentor.goToScreen("home");
        } else {
          renderMainApp();
        }
      });
    }

    // Sidebar navigation buttons
    document.querySelectorAll(".sidebar-nav-item[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const navTarget = btn.dataset.nav;
        closeSidebar();
        if (navTarget === "home") {
          currentChapterIdx = null;
          if (currentClassId === "class10" && currentSubjectId === "maths" && window.iMentor) {
            window.iMentor.goToScreen("home");
          } else {
            renderMainApp();
          }
        } else if (window.iMentor) {
          window.iMentor.goToScreen(navTarget);
        }
      });
    });

    // Sidebar live search input
    const searchInput = document.getElementById("sidebarSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        const items = document.querySelectorAll(".sidebar-chapter-item");
        let matches = 0;
        items.forEach((item) => {
          const num = item.dataset.chapter ? (Number(item.dataset.chapter) + 1).toString() : "";
          const title = item.textContent.toLowerCase();
          const isMatch = !q || title.includes(q) || num === q;
          item.style.display = isMatch ? "flex" : "none";
          if (isMatch) matches++;
        });

        let noMatch = document.getElementById("sidebarNoMatches");
        if (matches === 0) {
          if (!noMatch) {
            noMatch = document.createElement("p");
            noMatch.id = "sidebarNoMatches";
            noMatch.className = "sidebar-no-matches";
            noMatch.textContent = "कोई अध्याय नहीं मिला";
            document.getElementById("sidebarChaptersList")?.appendChild(noMatch);
          }
          noMatch.style.display = "block";
        } else if (noMatch) {
          noMatch.style.display = "none";
        }
      });
    }

    // Bottom Navigation Buttons
    const bHome = document.getElementById("bnavHome");
    const bChapters = document.getElementById("bnavChapters");
    const bMistakes = document.getElementById("bnavMistakes");
    const bMenu = document.getElementById("bnavMenu");

    if (bHome) {
      bHome.addEventListener("click", () => {
        currentChapterIdx = null;
        if (currentClassId === "class10" && currentSubjectId === "maths" && window.iMentor) {
          window.iMentor.goToScreen("home");
        } else {
          renderMainApp();
        }
      });
    }
    if (bChapters) {
      bChapters.addEventListener("click", () => {
        openSidebar();
        setTimeout(() => {
          const input = document.getElementById("sidebarSearchInput");
          if (input) input.focus();
        }, 150);
      });
    }
    if (bMistakes) {
      bMistakes.addEventListener("click", () => {
        if (window.iMentor) window.iMentor.goToScreen("mistakes");
      });
    }
    if (bMenu) {
      bMenu.addEventListener("click", openSidebar);
    }

    // Initial setup
    updateClassAndSubjectUI();
    window.syncNavUI();
    if (currentClassId !== "class10" || currentSubjectId !== "maths") {
      renderMainApp();
    }
  });

  setTimeout(() => {
    updateClassAndSubjectUI();
    window.syncNavUI();
  }, 100);
})();
