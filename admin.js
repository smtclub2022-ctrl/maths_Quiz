/**
 * SchoolBrain - Owner Administration Console Engine
 * Secure multi-card management for Files, Question Bank, Student Registrations & Backups.
 */

(function() {
  "use strict";

  // --- Theme Management in Admin ---
  const THEME_KEY = "iMentorTheme";
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeToggleBtn = document.getElementById("adminThemeToggleBtn");
  const themeIcon = document.getElementById("adminThemeIcon");
  if (themeToggleBtn) {
    if (themeIcon) themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
    themeToggleBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "light";
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      if (themeIcon) themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
    });
  }

  // --- Toast Notification Helper ---
  const toast = document.getElementById("adminToast");
  const toastMsg = document.getElementById("toastMsg");
  const toastIcon = document.getElementById("toastIcon");
  let toastTimer = null;

  function showToast(message, isError = false) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toastIcon.textContent = isError ? "⚠️" : "✓";
    toast.style.background = isError ? "#be123c" : "#0f172a";
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  // --- Owner Authentication Gate ---
  const authGate = document.getElementById("ownerAuthGate");
  const dashboardWrap = document.getElementById("ownerDashboardWrap");
  const authForm = document.getElementById("ownerAuthForm");
  const authMessage = document.getElementById("authGateMessage");
  const lockBtn = document.getElementById("adminLockBtn");

  const MASTER_CREDENTIALS = [
    { user: "admin", pass: "admin@2026" },
    { user: "admin", pass: "admin123" },
    { user: "schoolbrain", pass: "admin123" },
    { user: "imentor99", pass: "admin123" }
  ];

  function getCustomPassword() {
    return localStorage.getItem("schoolbrain_admin_custom_pass") || "";
  }

  function isAuthenticated() {
    return sessionStorage.getItem("schoolbrain_owner_session") === "active";
  }

  function verifyLogin(username, password) {
    const u = String(username || "").trim().toLowerCase();
    const p = String(password || "").trim();

    // Check custom saved password
    const customPass = getCustomPassword();
    if (customPass && (u === "admin" || u === "owner" || u === "schoolbrain") && p === customPass) {
      return true;
    }

    // Check master fallback credentials
    return MASTER_CREDENTIALS.some(c => c.user.toLowerCase() === u && c.pass === p);
  }

  function setAuthenticatedState(active) {
    if (active) {
      sessionStorage.setItem("schoolbrain_owner_session", "active");
      authGate.style.display = "none";
      dashboardWrap.style.display = "flex";
      lockBtn.style.display = "inline-flex";
      loadAllModules();
    } else {
      sessionStorage.removeItem("schoolbrain_owner_session");
      authGate.style.display = "block";
      dashboardWrap.style.display = "none";
      lockBtn.style.display = "none";
      authForm.reset();
    }
  }

  authForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const u = document.getElementById("adminUsername").value;
    const p = document.getElementById("adminPassword").value;

    if (verifyLogin(u, p)) {
      authMessage.style.display = "none";
      setAuthenticatedState(true);
      showToast("Owner console unlocked successfully.");
    } else {
      authMessage.textContent = "Invalid username or master password. Access denied.";
      authMessage.style.display = "block";
      showToast("Invalid credentials", true);
    }
  });

  lockBtn.addEventListener("click", function() {
    setAuthenticatedState(false);
    showToast("Owner console locked.");
  });


  // --- Tab Switching Navigation ---
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  const tabContents = document.querySelectorAll(".admin-tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.style.display = "none");

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.style.display = "block";
    });
  });


  // ============================================================
  // MODULE 1: FILE REPOSITORY & UPLOADS
  // ============================================================
  const FILES_KEY = "iMentorAdminFiles";
  const dropzone = document.getElementById("uploadDropzone");
  const fileInput = document.getElementById("adminFileInput");
  const filesTableBody = document.getElementById("filesTableBody");
  const filesCountBadge = document.getElementById("filesCountBadge");
  const searchFilesInput = document.getElementById("searchFilesInput");
  const refreshFilesBtn = document.getElementById("refreshFilesBtn");
  const kpiFilesCount = document.getElementById("kpiFilesCount");

  function getLocalFiles() {
    try {
      const raw = localStorage.getItem(FILES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocalFiles(list) {
    try {
      localStorage.setItem(FILES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Storage quota exceeded or error:", e);
      showToast("Storage quota notice: file metadata saved", true);
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return "📄";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
    if (["png", "jpg", "jpeg", "svg"].includes(ext)) return "🖼️";
    if (ext === "json") return "⚙️";
    return "📁";
  }

  function renderFilesList(filterQuery = "") {
    const allFiles = getLocalFiles();
    const query = filterQuery.trim().toLowerCase();
    const files = query ? allFiles.filter(f => f.name.toLowerCase().includes(query)) : allFiles;

    if (filesCountBadge) filesCountBadge.textContent = allFiles.length;
    if (kpiFilesCount) kpiFilesCount.textContent = allFiles.length;

    filesTableBody.innerHTML = "";
    if (!files.length) {
      filesTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--admin-muted); padding: 32px;">
            ${query ? "No files matching search." : "No files uploaded yet. Drag files above or click to browse."}
          </td>
        </tr>
      `;
      return;
    }

    files.forEach(f => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-size: 22px; text-align: center;">${getFileIcon(f.name)}</td>
        <td>
          <strong style="color: var(--admin-ink); display: block;">${escapeHtml(f.name)}</strong>
          <span style="font-size: 11px; color: var(--admin-muted);">${f.type || "Document"}</span>
        </td>
        <td>${formatBytes(f.size)}</td>
        <td style="font-size: 12px; color: var(--admin-muted);">
          ${f.uploadedAt ? new Date(f.uploadedAt).toLocaleString() : "Recently"}
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px; justify-content: flex-end;">
            ${f.dataUrl ? `<a href="${f.dataUrl}" download="${escapeHtml(f.name)}" class="action-chip-btn btn-download">📥 Download</a>` : ''}
            <button type="button" class="action-chip-btn btn-del" data-del-file="${f.id}">🗑️ Delete</button>
          </div>
        </td>
      `;
      filesTableBody.appendChild(tr);
    });

    // Bind delete buttons
    filesTableBody.querySelectorAll("[data-del-file]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del-file");
        deleteFile(id);
      });
    });
  }

  function deleteFile(fileId) {
    if (!confirm("Are you sure you want to remove this file permanently?")) return;
    let files = getLocalFiles();
    files = files.filter(f => f.id !== fileId);
    saveLocalFiles(files);
    renderFilesList(searchFilesInput.value);
    showToast("File removed successfully.");
  }

  function handleUploadedFiles(fileListItems) {
    if (!fileListItems || !fileListItems.length) return;
    const currentFiles = getLocalFiles();
    let processed = 0;

    Array.from(fileListItems).forEach(file => {
      if (file.size > 25 * 1024 * 1024) {
        showToast(`${file.name} exceeds 25 MB limit`, true);
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const newRecord = {
          id: "file_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
          name: file.name,
          size: file.size,
          type: file.type || file.name.split(".").pop().toUpperCase(),
          uploadedAt: new Date().toISOString(),
          dataUrl: e.target.result
        };
        currentFiles.unshift(newRecord);
        processed++;

        if (processed === fileListItems.length) {
          saveLocalFiles(currentFiles);
          renderFilesList();
          showToast(`Uploaded ${processed} file(s) successfully!`);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Dropzone events
  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      handleUploadedFiles(e.target.files);
      fileInput.value = "";
    });

    ["dragenter", "dragover"].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files) handleUploadedFiles(dt.files);
    });
  }

  if (searchFilesInput) {
    searchFilesInput.addEventListener("input", (e) => renderFilesList(e.target.value));
  }
  if (refreshFilesBtn) {
    refreshFilesBtn.addEventListener("click", () => {
      renderFilesList();
      showToast("Files list refreshed");
    });
  }


  // ============================================================
  // MODULE 2: QUESTION BANK MANAGER (ADD, EDIT, REMOVE)
  // ============================================================
  const QUESTIONS_KEY = "schoolbrain_custom_questions";
  const questionsTableBody = document.getElementById("questionsTableBody");
  const filterQuestionChapter = document.getElementById("filterQuestionChapter");
  const searchQuestionInput = document.getElementById("searchQuestionInput");
  const openAddQuestionBtn = document.getElementById("openAddQuestionBtn");
  const exportQuestionsBtn = document.getElementById("exportQuestionsBtn");
  const questionModal = document.getElementById("questionModalBackdrop");
  const questionForm = document.getElementById("questionForm");
  const questionModalTitle = document.getElementById("questionModalTitle");
  const closeQuestionModalBtn = document.getElementById("closeQuestionModalBtn");
  const cancelQuestionBtn = document.getElementById("cancelQuestionBtn");
  const kpiQuestionsCount = document.getElementById("kpiQuestionsCount");

  function getCustomQuestions() {
    try {
      const raw = localStorage.getItem(QUESTIONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // Initial default seed bank if none stored
    const seed = [
      { id: "q1", class: "10", chapter: "1", text: "140 के अभाज्य गुणनखंडों के गुणनफल के रूप में व्यक्त कीजिए।", a: "2² × 5 × 7", b: "2³ × 5", c: "2 × 5² × 7", d: "2² × 7²", correct: "A", marks: 1, explanation: "140 = 2 × 70 = 2 × 2 × 35 = 2² × 5 × 7" },
      { id: "q2", class: "10", chapter: "1", text: "संख्याओं 6 और 20 के अभाज्य गुणनखंडन विधि से HCF और LCM ज्ञात कीजिए।", a: "HCF = 2, LCM = 60", b: "HCF = 4, LCM = 30", c: "HCF = 6, LCM = 120", d: "HCF = 2, LCM = 40", correct: "A", marks: 1, explanation: "6 = 2×3, 20 = 2²×5. HCF = 2, LCM = 2²×3×5 = 60" },
      { id: "q3", class: "10", chapter: "8", text: "यदि sin A = 3/4 हो, तो cos A का मान होगा:", a: "√7/4", b: "4/3", c: "3/√7", d: "1/2", correct: "A", marks: 1, explanation: "cos² A = 1 - sin² A = 1 - 9/16 = 7/16, cos A = √7/4" },
      { id: "q4", class: "10", chapter: "4", text: "द्विघात समीकरण 2x² - 4x + 3 = 0 का विविक्तकर (Discriminant) क्या होगा?", a: "-8", b: "8", c: "-16", d: "0", correct: "A", marks: 1, explanation: "D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8" }
    ];
    saveCustomQuestions(seed);
    return seed;
  }

  function saveCustomQuestions(list) {
    try {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function renderQuestionsList() {
    const all = getCustomQuestions();
    const chFilter = filterQuestionChapter ? filterQuestionChapter.value : "all";
    const qQuery = searchQuestionInput ? searchQuestionInput.value.trim().toLowerCase() : "";

    let filtered = all;
    if (chFilter !== "all") {
      filtered = filtered.filter(q => String(q.chapter) === chFilter);
    }
    if (qQuery) {
      filtered = filtered.filter(q => q.text.toLowerCase().includes(qQuery));
    }

    if (kpiQuestionsCount) kpiQuestionsCount.textContent = all.length;

    questionsTableBody.innerHTML = "";
    if (!filtered.length) {
      questionsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--admin-muted); padding: 30px;">
            No questions matching criteria. Click 'Add New Question' to create one.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(q => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span style="font-weight: 700; color: var(--admin-pink);">${escapeHtml(String(q.id))}</span></td>
        <td><span class="course-tag" style="font-size: 11px;">Ch ${escapeHtml(String(q.chapter))}</span></td>
        <td>
          <div style="font-weight: 600; color: var(--admin-ink); max-width: 320px; line-height: 1.5;">
            ${escapeHtml(q.text)}
          </div>
        </td>
        <td style="font-size: 12px; color: var(--admin-muted);">
          A: ${escapeHtml(q.a)} | B: ${escapeHtml(q.b)}
        </td>
        <td style="text-align: center;">
          <strong style="color: #16a34a; background: #f0fdf4; padding: 2px 8px; border-radius: 6px; font-size: 12px;">
            ${escapeHtml(q.correct)}
          </strong>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px; justify-content: flex-end;">
            <button type="button" class="action-chip-btn btn-edit" data-edit-q="${q.id}">✏️ Edit</button>
            <button type="button" class="action-chip-btn btn-del" data-del-q="${q.id}">🗑️ Del</button>
          </div>
        </td>
      `;
      questionsTableBody.appendChild(tr);
    });

    // Bind Edit
    questionsTableBody.querySelectorAll("[data-edit-q]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit-q");
        openEditQuestionModal(id);
      });
    });

    // Bind Delete
    questionsTableBody.querySelectorAll("[data-del-q]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del-q");
        deleteQuestion(id);
      });
    });
  }

  function openEditQuestionModal(qId = "") {
    questionForm.reset();
    if (qId) {
      const all = getCustomQuestions();
      const item = all.find(q => q.id === qId);
      if (item) {
        document.getElementById("qEditId").value = item.id;
        document.getElementById("qClass").value = item.class || "10";
        document.getElementById("qChapter").value = item.chapter || "1";
        document.getElementById("qText").value = item.text || "";
        document.getElementById("qOptA").value = item.a || "";
        document.getElementById("qOptB").value = item.b || "";
        document.getElementById("qOptC").value = item.c || "";
        document.getElementById("qOptD").value = item.d || "";
        document.getElementById("qCorrect").value = item.correct || "A";
        document.getElementById("qMarks").value = item.marks || 1;
        document.getElementById("qExplanation").value = item.explanation || "";
        questionModalTitle.textContent = "✏️ Update Question #" + item.id;
      }
    } else {
      document.getElementById("qEditId").value = "";
      questionModalTitle.textContent = "➕ Add New Question";
    }
    questionModal.classList.add("active");
  }

  function closeQuestionModal() {
    questionModal.classList.remove("active");
  }

  function deleteQuestion(qId) {
    if (!confirm("Are you sure you want to remove this question?")) return;
    let all = getCustomQuestions();
    all = all.filter(q => q.id !== qId);
    saveCustomQuestions(all);
    renderQuestionsList();
    showToast("Question removed from bank.");
  }

  questionForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const editId = document.getElementById("qEditId").value;
    const questions = getCustomQuestions();

    const record = {
      id: editId || ("q_" + Date.now()),
      class: document.getElementById("qClass").value,
      chapter: document.getElementById("qChapter").value,
      text: document.getElementById("qText").value.trim(),
      a: document.getElementById("qOptA").value.trim(),
      b: document.getElementById("qOptB").value.trim(),
      c: document.getElementById("qOptC").value.trim(),
      d: document.getElementById("qOptD").value.trim(),
      correct: document.getElementById("qCorrect").value,
      marks: parseInt(document.getElementById("qMarks").value, 10) || 1,
      explanation: document.getElementById("qExplanation").value.trim()
    };

    if (editId) {
      const idx = questions.findIndex(q => q.id === editId);
      if (idx !== -1) questions[idx] = record;
      showToast("Question updated successfully!");
    } else {
      questions.unshift(record);
      showToast("New question added to bank!");
    }

    saveCustomQuestions(questions);
    renderQuestionsList();
    closeQuestionModal();
  });

  if (openAddQuestionBtn) openAddQuestionBtn.addEventListener("click", () => openEditQuestionModal());
  if (closeQuestionModalBtn) closeQuestionModalBtn.addEventListener("click", closeQuestionModal);
  if (cancelQuestionBtn) cancelQuestionBtn.addEventListener("click", closeQuestionModal);

  if (filterQuestionChapter) filterQuestionChapter.addEventListener("change", () => renderQuestionsList());
  if (searchQuestionInput) searchQuestionInput.addEventListener("input", () => renderQuestionsList());

  if (exportQuestionsBtn) {
    exportQuestionsBtn.addEventListener("click", () => {
      const data = getCustomQuestions();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SchoolBrain_Questions_Export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Question bank exported.");
    });
  }


  // ============================================================
  // MODULE 3: STUDENT REGISTRATIONS (8 COLUMNS)
  // ============================================================
  const STUDENT_KEY = "iMentorStudentLogins";
  const studentTableBody = document.getElementById("studentTableBody");
  const searchStudentInput = document.getElementById("searchStudentInput");
  const exportStudentCsvBtn = document.getElementById("exportStudentCsvBtn");
  const addNewStudentBtn = document.getElementById("addNewStudentBtn");
  const clearAllStudentsBtn = document.getElementById("clearAllStudentsBtn");
  const syncWebhookBtn = document.getElementById("syncWebhookBtn");
  const studentModal = document.getElementById("studentModalBackdrop");
  const studentEditForm = document.getElementById("studentEditForm");
  const studentModalTitle = document.getElementById("studentModalTitle");
  const closeStudentModalBtn = document.getElementById("closeStudentModalBtn");
  const cancelStudentBtn = document.getElementById("cancelStudentBtn");
  const kpiStudentsCount = document.getElementById("kpiStudentsCount");

  function getStudentRecords() {
    try {
      const raw = localStorage.getItem(STUDENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStudentRecords(list) {
    try {
      localStorage.setItem(STUDENT_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function renderStudentTable(filterQuery = "") {
    const all = getStudentRecords();
    const query = filterQuery.trim().toLowerCase();
    const list = query 
      ? all.filter(s => (s.name || "").toLowerCase().includes(query) || (s.mobile || "").includes(query) || (s.school || "").toLowerCase().includes(query))
      : all;

    if (kpiStudentsCount) kpiStudentsCount.textContent = all.length;

    studentTableBody.innerHTML = "";
    if (!list.length) {
      studentTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: var(--admin-muted); padding: 30px;">
            ${query ? "No student records matched search." : "No student records found. New logins will appear automatically."}
          </td>
        </tr>
      `;
      return;
    }

    list.forEach((st, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--admin-pink);">${idx + 1}</td>
        <td>${escapeHtml(st.date || new Date().toISOString().slice(0, 10))}</td>
        <td>${escapeHtml(st.time || "10:00 AM")}</td>
        <td><strong style="color: var(--admin-ink);">${escapeHtml(st.name || "N/A")}</strong></td>
        <td><span class="course-tag" style="font-size: 11px;">${escapeHtml(st.class || "CLASS 10")}</span></td>
        <td>${escapeHtml(st.section || "A")}</td>
        <td><span style="font-size: 12px; color: var(--admin-muted);">${escapeHtml(st.school || "N/A")}</span></td>
        <td><code style="font-weight: 700; color: var(--admin-pink);">${escapeHtml(st.mobile || "N/A")}</code></td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 4px;">
            <button type="button" class="action-chip-btn btn-edit" data-edit-st="${idx}">✏️</button>
            <button type="button" class="action-chip-btn btn-del" data-del-st="${idx}">🗑️</button>
          </div>
        </td>
      `;
      studentTableBody.appendChild(tr);
    });

    studentTableBody.querySelectorAll("[data-edit-st]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.getAttribute("data-edit-st"), 10);
        openStudentModal(i);
      });
    });

    studentTableBody.querySelectorAll("[data-del-st]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.getAttribute("data-del-st"), 10);
        deleteStudent(i);
      });
    });
  }

  function openStudentModal(index = -1) {
    studentEditForm.reset();
    document.getElementById("studentEditIndex").value = index;

    if (index >= 0) {
      const all = getStudentRecords();
      const st = all[index];
      if (st) {
        document.getElementById("stName").value = st.name || "";
        document.getElementById("stClass").value = st.class || "CLASS 10";
        document.getElementById("stSection").value = st.section || "A";
        document.getElementById("stSchool").value = st.school || "";
        document.getElementById("stMobile").value = st.mobile || "";
        studentModalTitle.textContent = "✏️ Edit Student #" + (index + 1);
      }
    } else {
      studentModalTitle.textContent = "➕ Add Student Record";
    }
    studentModal.classList.add("active");
  }

  function deleteStudent(index) {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    const all = getStudentRecords();
    all.splice(index, 1);
    saveStudentRecords(all);
    renderStudentTable();
    showToast("Student record removed.");
  }

  studentEditForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById("studentEditIndex").value, 10);
    const all = getStudentRecords();
    const now = new Date();

    const record = {
      date: (idx >= 0 && all[idx] && all[idx].date) ? all[idx].date : now.toLocaleDateString(),
      time: (idx >= 0 && all[idx] && all[idx].time) ? all[idx].time : now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      name: document.getElementById("stName").value.trim().toUpperCase(),
      class: document.getElementById("stClass").value,
      section: document.getElementById("stSection").value,
      school: document.getElementById("stSchool").value.trim().toUpperCase(),
      mobile: document.getElementById("stMobile").value.trim()
    };

    if (idx >= 0) {
      all[idx] = record;
      showToast("Student record updated!");
    } else {
      all.unshift(record);
      showToast("Student record created!");
    }

    saveStudentRecords(all);
    renderStudentTable();
    studentModal.classList.remove("active");
  });

  if (addNewStudentBtn) addNewStudentBtn.addEventListener("click", () => openStudentModal(-1));
  if (closeStudentModalBtn) closeStudentModalBtn.addEventListener("click", () => studentModal.classList.remove("active"));
  if (cancelStudentBtn) cancelStudentBtn.addEventListener("click", () => studentModal.classList.remove("active"));

  if (searchStudentInput) {
    searchStudentInput.addEventListener("input", (e) => renderStudentTable(e.target.value));
  }

  if (clearAllStudentsBtn) {
    clearAllStudentsBtn.addEventListener("click", () => {
      if (confirm("DANGER: Are you sure you want to clear ALL student records? This cannot be undone.")) {
        saveStudentRecords([]);
        renderStudentTable();
        showToast("All student records cleared.", true);
      }
    });
  }

  // Export 8-Column CSV
  if (exportStudentCsvBtn) {
    exportStudentCsvBtn.addEventListener("click", () => {
      const records = getStudentRecords();
      if (!records.length) {
        showToast("No student records to export", true);
        return;
      }
      const headers = ["S.No.", "Date", "Time", "Student Name", "Class", "Section", "School", "Mobile Number"];
      const rows = records.map((r, i) => [
        i + 1,
        `"${r.date || ''}"`,
        `"${r.time || ''}"`,
        `"${r.name || ''}"`,
        `"${r.class || ''}"`,
        `"${r.section || ''}"`,
        `"${r.school || ''}"`,
        `"${r.mobile || ''}"`
      ]);
      const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\r\n");
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SchoolBrain_Students_8Col_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("CSV downloaded successfully.");
    });
  }

  // Sync to Webhook
  if (syncWebhookBtn) {
    syncWebhookBtn.addEventListener("click", async () => {
      const url = window.STUDENT_API_BASE_URL || localStorage.getItem("schoolbrain_custom_webhook");
      if (!url) {
        showToast("Please configure Google Sheets Webhook URL first in Settings", true);
        return;
      }
      showToast("Pinging Google Sheets Webhook...");
      try {
        const records = getStudentRecords();
        const testPayload = records[0] || {
          name: "ADMIN TEST SYNC",
          class: "CLASS 10",
          section: "A",
          school: "SYSTEM VERIFICATION",
          mobile: "9999999999",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        };
        await fetch(url, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testPayload)
        });
        showToast("Sync ping dispatched to Google Sheets!");
      } catch (e) {
        showToast("Webhook sync error: " + e.message, true);
      }
    });
  }


  // ============================================================
  // MODULE 4: SETTINGS, MASTER PASS & BACKUPS
  // ============================================================
  const changePasswordForm = document.getElementById("changePasswordForm");
  const saveWebhookForm = document.getElementById("saveWebhookForm");
  const webhookUrlInput = document.getElementById("webhookUrlInput");
  const downloadBackupBtn = document.getElementById("downloadBackupBtn");
  const restoreBackupInput = document.getElementById("restoreBackupInput");

  if (webhookUrlInput) {
    webhookUrlInput.value = window.STUDENT_API_BASE_URL || localStorage.getItem("schoolbrain_custom_webhook") || "";
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const p1 = document.getElementById("newMasterPass").value.trim();
      const p2 = document.getElementById("confirmMasterPass").value.trim();
      if (p1 !== p2) {
        showToast("Passwords do not match", true);
        return;
      }
      if (p1.length < 6) {
        showToast("Password must be at least 6 characters", true);
        return;
      }
      localStorage.setItem("schoolbrain_admin_custom_pass", p1);
      changePasswordForm.reset();
      showToast("Master Admin Password changed successfully!");
    });
  }

  if (saveWebhookForm) {
    saveWebhookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = webhookUrlInput.value.trim();
      window.STUDENT_API_BASE_URL = val;
      localStorage.setItem("schoolbrain_custom_webhook", val);
      showToast("Webhook URL saved successfully!");
    });
  }

  // Backup System
  if (downloadBackupBtn) {
    downloadBackupBtn.addEventListener("click", () => {
      const backupData = {
        meta: {
          app: "SchoolBrain",
          version: "5.0",
          exportDate: new Date().toISOString()
        },
        files: getLocalFiles(),
        questions: getCustomQuestions(),
        students: getStudentRecords(),
        settings: {
          webhookUrl: window.STUDENT_API_BASE_URL || localStorage.getItem("schoolbrain_custom_webhook") || "",
          theme: localStorage.getItem(THEME_KEY) || "light"
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SchoolBrain_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Complete system backup downloaded!");
    });
  }

  // Restore Backup
  if (restoreBackupInput) {
    restoreBackupInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (!parsed.meta || parsed.meta.app !== "SchoolBrain") {
            if (!confirm("This file does not appear to be an official SchoolBrain backup. Continue anyway?")) return;
          }

          if (parsed.files) saveLocalFiles(parsed.files);
          if (parsed.questions) saveCustomQuestions(parsed.questions);
          if (parsed.students) saveStudentRecords(parsed.students);
          if (parsed.settings && parsed.settings.webhookUrl) {
            window.STUDENT_API_BASE_URL = parsed.settings.webhookUrl;
            localStorage.setItem("schoolbrain_custom_webhook", parsed.settings.webhookUrl);
            if (webhookUrlInput) webhookUrlInput.value = parsed.settings.webhookUrl;
          }

          loadAllModules();
          showToast("System restored successfully from backup!");
        } catch (err) {
          showToast("Invalid backup JSON file: " + err.message, true);
        }
      };
      reader.readAsText(file);
      restoreBackupInput.value = "";
    });
  }


  // --- Helper to escape HTML ---
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- Initial Loader ---
  function loadAllModules() {
    renderFilesList();
    renderQuestionsList();
    renderStudentTable();
  }

  // Check existing session
  if (isAuthenticated()) {
    setAuthenticatedState(true);
  } else {
    setAuthenticatedState(false);
  }

})();
