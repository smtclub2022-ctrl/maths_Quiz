const loginPanel = document.getElementById("adminLoginPanel");
const dashboard = document.getElementById("adminDashboard");
const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("adminLoginMessage");
const uploadForm = document.getElementById("adminUploadForm");
const uploadMessage = document.getElementById("adminUploadMessage");
const listMessage = document.getElementById("adminListMessage");
const fileList = document.getElementById("adminFileList");
let csrfToken = "";

function getApiBase() {
  return String(window.STUDENT_API_BASE_URL || "").trim().replace(/\/+$/, "");
}

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

async function parseResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("THE SERVER RETURNED AN UNREADABLE RESPONSE.");
  }
  if (!response.ok) throw new Error(data.message || "THE REQUEST COULD NOT BE COMPLETED.");
  return data;
}

async function apiRequest(path, options = {}) {
  const base = getApiBase();
  if (!base) throw new Error("ADMIN API IS NOT CONFIGURED. CONTACT THE SITE ADMINISTRATOR.");
  let response;
  try {
    response = await fetch(`${base}${path}`, { ...options, credentials: "include" });
  } catch (error) {
    throw new Error("COULD NOT CONNECT TO THE ADMIN SERVER. PLEASE TRY AGAIN.");
  }
  return parseResponse(response);
}

function showLogin(message = "") {
  csrfToken = "";
  dashboard.hidden = true;
  loginPanel.hidden = false;
  setMessage(loginMessage, message, Boolean(message));
}

function showDashboard() {
  loginPanel.hidden = true;
  dashboard.hidden = false;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    const download = document.createElement("a");
    download.href = `${getApiBase()}/api/admin/files/${encodeURIComponent(file.id)}`;
    download.textContent = "DOWNLOAD";
    download.rel = "noopener";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "DELETE";
    remove.addEventListener("click", () => deleteFile(file.id));
    actions.append(download, remove);
    row.append(info, actions);
    fileList.append(row);
  });
}

async function loadFiles() {
  setMessage(listMessage, "LOADING FILES…");
  try {
    const result = await apiRequest("/api/admin/files");
    renderFiles(result.files);
    setMessage(listMessage, "");
  } catch (error) {
    if (/admin login is required/i.test(error.message)) {
      showLogin("YOUR ADMIN SESSION HAS ENDED. PLEASE SIGN IN AGAIN.");
      return;
    }
    setMessage(listMessage, error.message, true);
  }
}

async function deleteFile(fileId) {
  if (!window.confirm("DELETE THIS UPLOADED FILE?")) return;
  setMessage(listMessage, "DELETING FILE…");
  try {
    await apiRequest(`/api/admin/files/${encodeURIComponent(fileId)}`, {
      method: "DELETE",
      headers: { "X-CSRF-Token": csrfToken }
    });
    await loadFiles();
  } catch (error) {
    setMessage(listMessage, error.message, true);
  }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  const submit = loginForm.querySelector('[type="submit"]');
  const formData = new FormData(loginForm);
  submit.disabled = true;
  setMessage(loginMessage, "SIGNING IN…");
  try {
    const result = await apiRequest("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(formData.get("username") || ""),
        password: String(formData.get("password") || "")
      })
    });
    csrfToken = result.csrfToken;
    loginForm.reset();
    showDashboard();
    await loadFiles();
  } catch (error) {
    setMessage(loginMessage, error.message, true);
  } finally {
    submit.disabled = false;
  }
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
  const body = new FormData();
  body.append("file", file);
  submit.disabled = true;
  setMessage(uploadMessage, "UPLOADING FILE…");
  try {
    const result = await apiRequest("/api/admin/files", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
      body
    });
    input.value = "";
    setMessage(uploadMessage, `${result.name} UPLOADED SUCCESSFULLY.`);
    await loadFiles();
  } catch (error) {
    setMessage(uploadMessage, error.message, true);
  } finally {
    submit.disabled = false;
  }
});

document.getElementById("refreshAdminFiles").addEventListener("click", loadFiles);

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
document.getElementById("adminLogout").addEventListener("click", async () => {
  try {
    await apiRequest("/api/admin/logout", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken }
    });
    showLogin("SIGNED OUT.");
  } catch (error) {
    setMessage(listMessage, error.message, true);
  }
});

async function initializeAdminPage() {
  try {
    const result = await apiRequest("/api/admin/session");
    csrfToken = result.csrfToken;
    showDashboard();
    await loadFiles();
  } catch (error) {
    showLogin(/admin login is required/i.test(error.message) ? "" : error.message);
  }
}

initializeAdminPage();
