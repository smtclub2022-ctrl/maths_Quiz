/**
 * iMentor 99 - Student Data API Configuration
 * Supports:
 *  1. Google Sheets Web App (via Google Apps Script Webhook)
 *  2. REST API / MongoDB Endpoint (POST /api/students)
 *  3. LocalStorage Offline Mode with full CSV Export matching login_Data_Imentor_students.xlsx
 *
 * Target Data Columns:
 *  1. S.No.
 *  2. Date
 *  3. Time
 *  4. Student Name
 *  5. Class
 *  6. Section
 *  7. School
 *  8. Mobile Number
 */

// Priority: Local override in localStorage, then window config, then empty string (offline mode)
window.STUDENT_API_BASE_URL = (function() {
  try {
    const stored = localStorage.getItem("iMentorApiUrl");
    if (stored && stored.trim()) return stored.trim();
  } catch (e) {}
  return window.STUDENT_API_BASE_URL || "";
})();

// Exact 8 Columns matching login_Data_Imentor_students.xlsx
window.STUDENT_DATA_COLUMNS = [
  "S.No.",
  "Date",
  "Time",
  "Student Name",
  "Class",
  "Section",
  "School",
  "Mobile Number"
];

// Path to sample Excel template file
window.STUDENT_DATA_TEMPLATE_FILE = "assets/login_Data_Imentor_students.xlsx";

/**
 * Get the currently configured API URL
 */
window.getStudentApiUrl = function() {
  try {
    const local = localStorage.getItem("iMentorApiUrl");
    if (local && local.trim()) return local.trim();
  } catch (e) {}
  return String(window.STUDENT_API_BASE_URL || "").trim();
};

/**
 * Set the API URL dynamically and persist it
 */
window.setStudentApiUrl = function(url) {
  const clean = String(url || "").trim();
  window.STUDENT_API_BASE_URL = clean;
  try {
    if (clean) {
      localStorage.setItem("iMentorApiUrl", clean);
    } else {
      localStorage.removeItem("iMentorApiUrl");
    }
  } catch (e) {
    console.warn("Could not save iMentorApiUrl to localStorage:", e);
  }
};

/**
 * Dispatches student login record to configured Data API or saves locally.
 * Returns a Promise<{ success: boolean, message: string, localOnly?: boolean }>
 */
window.submitStudentLoginRecord = async function(record) {
  const apiUrl = window.getStudentApiUrl();

  // Always persist locally first so no record is ever lost
  try {
    let logins = [];
    const stored = localStorage.getItem("iMentorStudentLogins");
    if (stored) logins = JSON.parse(stored);
    logins.push(record);
    localStorage.setItem("iMentorStudentLogins", JSON.stringify(logins));
    localStorage.setItem("iMentorStudentProfile", JSON.stringify(record));
  } catch (err) {
    console.warn("Local storage error:", err);
  }

  // If no external API is configured, return success with local-only notice
  if (!apiUrl) {
    return {
      success: true,
      localOnly: true,
      message: "डेटा स्थानीय रूप से सुरक्षित हो गया है (Offline / Local Mode)।"
    };
  }

  // Google Apps Script Web App Endpoint handling
  if (apiUrl.includes("script.google.com")) {
    try {
      // mode: 'no-cors' prevents browser CORS block on Google Apps Script redirects
      await fetch(apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(record)
      });
      return {
        success: true,
        message: "डेटा Google Sheets / Data API पर सफलतापूर्वक सिंक हो गया।"
      };
    } catch (error) {
      console.warn("Google Apps Script sync failed:", error);
      return {
        success: true,
        localOnly: true,
        message: "API ऑफ़लाइन है, डेटा स्थानीय रूप से सुरक्षित कर लिया गया है।"
      };
    }
  }

  // Standard REST API endpoint handling
  try {
    const endpoint = apiUrl.endsWith("/api/students") ? apiUrl : `${apiUrl.replace(/\/+$/, "")}/api/students`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });
    let result = {};
    try {
      result = await response.json();
    } catch (e) {}
    if (!response.ok) {
      throw new Error(result.message || `HTTP Server Error ${response.status}`);
    }
    return {
      success: true,
      message: "डेटा सर्वर पर सफलतापूर्वक सुरक्षित हो गया।"
    };
  } catch (error) {
    console.warn("REST API sync failed:", error);
    return {
      success: true,
      localOnly: true,
      message: "सर्वर से कनेक्ट नहीं हो सका, डेटा स्थानीय रूप से सुरक्षित कर लिया गया है।"
    };
  }
};

/**
 * Exports all stored student logins as CSV matching login_Data_Imentor_students.xlsx
 */
window.exportStudentLoginsCSV = function() {
  try {
    const raw = localStorage.getItem("iMentorStudentLogins");
    const list = raw ? JSON.parse(raw) : [];
    if (!list.length) {
      alert("अभी तक कोई विद्यार्थी डेटा पंजीकृत नहीं है।");
      return false;
    }

    const headers = [
      "S.No.",
      "Date",
      "Time",
      "Student Name",
      "Class",
      "Section",
      "School",
      "Mobile Number"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map((item, index) => {
      const sno = item.sno || item["S.No."] || (index + 1);
      const date = item.date || item["Date"] || "";
      const time = item.time || item["Time"] || "";
      const name = item.studentName || item["Student Name"] || item.name || "";
      const cls = item.class || item["Class"] || "";
      const sec = item.section || item["Section"] || "";
      const sch = item.school || item["School"] || "";
      const mob = item.mobile || item["Mobile Number"] || "";

      return [
        sno,
        escapeCsv(date),
        escapeCsv(time),
        escapeCsv(name),
        escapeCsv(cls),
        escapeCsv(sec),
        escapeCsv(sch),
        escapeCsv(mob)
      ].join(",");
    });

    // Add UTF-8 BOM so Excel opens Hindi/English characters correctly
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `login_Data_Imentor_students_${dateStamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("Export CSV failed:", err);
    alert("CSV फ़ाइल बनाने में त्रुटि: " + err.message);
    return false;
  }
};
