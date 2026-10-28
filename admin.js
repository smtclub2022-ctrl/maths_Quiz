const loginPanel = document.getElementById("adminLoginPanel");
const dashboard = document.getElementById("adminDashboard");
const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("adminLoginMessage");
const uploadForm = document.getElementById("adminUploadForm");
const uploadMessage = document.getElementById("adminUploadMessage");
const listMessage = document.getElementById("adminListMessage");
const fileList = document.getElementById("adminFileList");
const studentTableContainer = document.getElementById("adminStudentTableContainer");

let csrfToken = "";
const MASTER_CREDENTIALS = [
  { user: "schoolbrain", pass: "admin123" },
  { user: "schoolbrain.in", pass: "admin123" },
  { user: "admin", pass: "admin123" },
  { user: "admin", pass: "admin@2026" },
  { user: "imentor99", pass: "admin123" },
,
  { user: "admin", pass: "admin" },
  { user: "admin", pass: "password" },
  { user: "imentor99", pass: "imentor99" }
];

function getApiBase() {
  const base = String(window.STUDENT_API_BASE_URL || "").trim().replace(/\/+$/, "");
  // Don't treat Google Apps Script webhook as a REST admin backend
  if (base.includes("script.google.com")) {
    return "";
  }
  return base;
}

function setMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
}

function showLogin(message = "") {
  csrfToken = "";
  sessionStorage.removeItem("adminSessionActive");
  dashboard.hidden = true;
  loginPanel.hidden = false;
  setMessage(loginMessage, message, Boolean(message));
}

function showDashboard() {
  sessionStorage.setItem("adminSessionActive", "true");
  loginPanel.hidden = true;
  dashboard.hidden = false;
  loadFiles();
  renderStudentTable();
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Local file storage helper for client-side mode
function getLocalFiles() {
  try {
    const raw = localStorage.getItem("iMentorAdminFiles");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalFiles(files) {
  try {
    localStorage.setItem("iMentorAdminFiles", JSON.stringify(files));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

function renderFiles(files) {
  fileList.replaceChildren();
  if (!files.length) {
    const empty = document.createElement("li");
    empty.className = "admin-empty";
    empty.textContent = "NO FILES HAVE BEEN UPLOADED.";
    fileList.append(empty);
    return;
  }

  files.forEach(file => {
    const row = document.createElement("li");
    row.className = "admin-file";
    const info = document.createElement("div");
    info.className = "admin-file-info";
    const name = document.createElement("strong");
    name.textContent = file.name;
    const metadata = document.createElement("span");
    metadata.textContent = `${formatSize(file.size)} · ${new Date(file.uploadedAt).toLocaleString()}`;
    info.append(name, metadata);

    const actions = document.createElement("div");
    actions.className = "admin-file-actions";

    if (file.dataUrl) {
      const download = document.createElement("a");
      download.href = file.dataUrl;
      download.download = file.name;
      download.textContent = "DOWNLOAD";
      actions.append(download);
    } else if (getApiBase()) {
      const download = document.createElement("a");
      download.href = `${getApiBase()}/api/admin/files/${encodeURIComponent(file.id)}`;
      download.textContent = "DOWNLOAD";
      download.rel = "noopener";
      actions.append(download);
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "DELETE";
    remove.addEventListener("click", () => deleteFile(file.id));
    actions.append(remove);

    row.append(info, actions);
    fileList.append(row);
  });
}

async function loadFiles() {
  setMessage(listMessage, "LOADING FILES…");
  const base = getApiBase();
  if (!base) {
    // Client-side local storage mode
    const files = getLocalFiles();
    renderFiles(files);
    setMessage(listMessage, "");
    return;
  }

  try {
    const response = await fetch(`${base}/api/admin/files`, { credentials: "include" });
    if (!response.ok) throw new Error("Could not load files from server.");
    const data = await response.json();
    renderFiles(data.files || []);
    setMessage(listMessage, "");
  } catch (error) {
    // Fall back to local files
    const files = getLocalFiles();
    renderFiles(files);
    setMessage(listMessage, "");
  }
}

async function deleteFile(fileId) {
  if (!window.confirm("DELETE THIS UPLOADED FILE?")) return;
  setMessage(listMessage, "DELETING FILE…");

  const base = getApiBase();
  if (!base) {
    let files = getLocalFiles();
    files = files.filter(f => f.id !== fileId);
    saveLocalFiles(files);
    await loadFiles();
    return;
  }

  try {
    await fetch(`${base}/api/admin/files/${encodeURIComponent(fileId)}`, {
      method: "DELETE",
      headers: { "X-CSRF-Token": csrfToken },
      credentials: "include"
    });
    await loadFiles();
  } catch (error) {
    let files = getLocalFiles();
    files = files.filter(f => f.id !== fileId);
    saveLocalFiles(files);
    await loadFiles();
  }
}

function renderStudentTable() {
  if (!studentTableContainer) return;
  try {
    const raw = localStorage.getItem("iMentorStudentLogins");
    const list = raw ? JSON.parse(raw) : [];

    if (!list || !list.length) {
      studentTableContainer.innerHTML = `
        <div style="padding: 16px; background: var(--bg-card, #ffffff); border: 1px solid var(--line, #e2e8f0); border-radius: 8px; color: var(--text-muted, #64748b); font-size: 13px;">
          ℹ️ कोई नया स्थानीय छात्र पंजीकरण उपलब्ध नहीं है। छात्र पंजीकरण स्वचालित रूप से Google Sheets और यहाँ सिंक होते हैं।
        </div>
      `;
      return;
    }

    const rowsHtml = list.map((item, idx) => {
      const sno = item.sno || item["S.No."] || (idx + 1);
      const date = item.date || item["Date"] || "-";
      const time = item.time || item["Time"] || "-";
      const name = item.studentName || item["Student Name"] || item.name || "-";
      const cls = item.class || item["Class"] || "-";
      const sec = item.section || item["Section"] || "-";
      const sch = item.school || item["School"] || "-";
      const mob = item.mobile || item["Mobile Number"] || "-";

      return `
        <tr style="border-bottom: 1px solid var(--line, #e2e8f0);">
          <td style="padding: 8px 12px; font-weight: 600;">${sno}</td>
          <td style="padding: 8px 12px; white-space: nowrap;">${date}</td>
          <td style="padding: 8px 12px; white-space: nowrap;">${time}</td>
          <td style="padding: 8px 12px; font-weight: 600; color: var(--primary, #094067);">${name}</td>
          <td style="padding: 8px 12px;">कक्षा ${cls}</td>
          <td style="padding: 8px 12px;">${sec}</td>
          <td style="padding: 8px 12px;">${sch}</td>
          <td style="padding: 8px 12px; font-family: monospace;">${mob}</td>
        </tr>
      `;
    }).join("");

    studentTableContainer.innerHTML = `
      <div style="background: var(--bg-card, #ffffff); border: 1px solid var(--line, #e2e8f0); border-radius: 8px; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background: var(--bg-subtle, #f8fafc); border-bottom: 2px solid var(--line, #cbd5e1); font-weight: 700;">
              <th style="padding: 10px 12px;">क्र.सं. (S.No.)</th>
              <th style="padding: 10px 12px;">दिनांक (Date)</th>
              <th style="padding: 10px 12px;">समय (Time)</th>
              <th style="padding: 10px 12px;">विद्यार्थी नाम (Name)</th>
              <th style="padding: 10px 12px;">कक्षा (Class)</th>
              <th style="padding: 10px 12px;">वर्ग (Section)</th>
              <th style="padding: 10px 12px;">विद्यालय (School)</th>
              <th style="padding: 10px 12px;">मोबाइल नं. (Mobile)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      <p style="font-size: 12px; color: var(--text-muted, #64748b); margin-top: 8px;">कुल पंजीकृत विद्यार्थी: <strong>${list.length}</strong> | Google Sheets और CSV में यह डेटा 8 कॉलम में उपलब्ध रहता है।</p>
    `;
  } catch (err) {
    console.error("renderStudentTable error:", err);
  }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  const submit = loginForm.querySelector('[type="submit"]');
  const formData = new FormData(loginForm);
  const inputUser = String(formData.get("username") || "").trim().toLowerCase();
  const inputPass = String(formData.get("password") || "").trim();

  submit.disabled = true;
  setMessage(loginMessage, "SIGNING IN…");

  // Check master credentials
  const isMaster = MASTER_CREDENTIALS.some(
    cred => cred.user.toLowerCase() === inputUser && cred.pass === inputPass
  );

  if (isMaster) {
    loginForm.reset();
    showDashboard();
    submit.disabled = false;
    return;
  }

  // If not master credentials and a server backend is configured, attempt backend login
  const base = getApiBase();
  if (base) {
    try {
      const response = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: inputUser, password: inputPass })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid credentials.");
      csrfToken = data.csrfToken || "";
      loginForm.reset();
      showDashboard();
    } catch (error) {
      setMessage(loginMessage, error.message || "INVALID ADMIN CREDENTIALS.", true);
    } finally {
      submit.disabled = false;
    }
    return;
  }

  // Invalid master credentials
  setMessage(loginMessage, "INVALID USERNAME OR PASSWORD. PLEASE CHECK CREDENTIALS.", true);
  submit.disabled = false;
});

uploadForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!uploadForm.reportValidity()) return;
  const input = document.getElementById("adminFile");
  const file = input.files[0];
  if (!file) return;
  if (file.size > 25 * 1024 * 1024) {
    setMessage(uploadMessage, "EACH FILE MUST BE 25 MB OR SMALLER.", true);
    return;
  }

  const submit = uploadForm.querySelector('[type="submit"]');
  submit.disabled = true;
  setMessage(uploadMessage, "UPLOADING FILE…");

  const base = getApiBase();
  if (base) {
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${base}/api/admin/files`, {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
        credentials: "include",
        body
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Upload failed.");
      input.value = "";
      setMessage(uploadMessage, `${result.name || file.name} UPLOADED SUCCESSFULLY.`);
      await loadFiles();
    } catch (error) {
      setMessage(uploadMessage, error.message, true);
    } finally {
      submit.disabled = false;
    }
    return;
  }

  // Client-side local storage fallback
  try {
    const reader = new FileReader();
    reader.onload = function(e) {
      const files = getLocalFiles();
      const newFile = {
        id: "file_" + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        dataUrl: e.target.result
      };
      files.unshift(newFile);
      saveLocalFiles(files);
      input.value = "";
      setMessage(uploadMessage, `${file.name} UPLOADED SUCCESSFULLY.`);
      loadFiles();
      submit.disabled = false;
    };
    reader.onerror = function() {
      setMessage(uploadMessage, "FILE COULD NOT BE READ.", true);
      submit.disabled = false;
    };
    reader.readAsDataURL(file);
  } catch (err) {
    setMessage(uploadMessage, "UPLOAD FAILED.", true);
    submit.disabled = false;
  }
});

const refreshBtn = document.getElementById("refreshAdminFiles");
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    loadFiles();
    renderStudentTable();
  });
}

const exportAdminBtn = document.getElementById("exportAdminLoginsBtn");
if (exportAdminBtn) {
  exportAdminBtn.addEventListener("click", () => {
    if (typeof window.exportStudentLoginsCSV === "function") {
      window.exportStudentLoginsCSV();
    } else {
      alert("CSV Export is not available.");
    }
  });
}

const logoutBtn = document.getElementById("adminLogout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("adminSessionActive");
    showLogin("SIGNED OUT.");
  });
}

function initializeAdminPage() {
  const activeSession = sessionStorage.getItem("adminSessionActive");
  if (activeSession === "true") {
    showDashboard();
  } else {
    showLogin("");
  }
}

initializeAdminPage();
