# iMentor 99 - Student Login Data API & Google Sheets Integration Guide

This guide explains how student login data is captured, formatted, and connected to **Google Sheets**, **REST APIs**, or exported directly to **Excel/CSV**.

---

## 1. Target Data Schema (8 Columns)
The login system captures exactly 8 fields matching `login_Data_Imentor_students.xlsx`:

| Column # | Column Name | Format / Sample Value | Auto/User Input |
|---|---|---|---|
| **Column 1** | `S.No.` | `1, 2, 3...` | Auto-incremented sequence |
| **Column 2** | `Date` | `28/10/2026` (DD/MM/YYYY) | Auto-captured at login |
| **Column 3** | `Time` | `07:30:15 AM` (hh:mm:ss AM/PM) | Auto-captured at login |
| **Column 4** | `Student Name` | `RAHUL SHARMA` | Student input (uppercase) |
| **Column 5** | `Class` | `CLASS 10` | Student selection (1 to 12) |
| **Column 6** | `Section` | `A` (A, B, C, D, E, OTHER) | Student selection |
| **Column 7** | `School` | `GOVT SR SEC SCHOOL JAIPUR` | Student input (uppercase) |
| **Column 8** | `Mobile Number` | `9876543210` (10 digits) | Student input |

---

## 2. Option A: Connecting Google Sheets (No Coding Required)

You can connect any Google Sheet to automatically receive new student logins in real time.

### Step 1: Create or Open Your Google Sheet
1. Go to [Google Sheets](https://sheets.new).
2. Set the 8 column headers in Row 1:
   `S.No.` | `Date` | `Time` | `Student Name` | `Class` | `Section` | `School` | `Mobile Number`
   *(Or simply upload the template file `assets/login_Data_Imentor_students.xlsx`)*

### Step 2: Add Google Apps Script
1. In your Google Sheet, click **Extensions (एक्सटेंशन)** ➔ **Apps Script**.
2. Replace whatever is in `Code.gs` with the following code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "S.No.", "Date", "Time", "Student Name", "Class", "Section", "School", "Mobile Number"
      ]);
    }
    
    var data = JSON.parse(e.postData.contents);
    var nextSno = sheet.getLastRow(); // Serial number based on row count
    
    var date = data["Date"] || data.date || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy");
    var time = data["Time"] || data.time || Utilities.formatDate(new Date(), "Asia/Kolkata", "hh:mm:ss a");
    var studentName = data["Student Name"] || data.studentName || data.name || "";
    var studentClass = data["Class"] || data.class || "";
    var section = data["Section"] || data.section || "";
    var school = data["School"] || data.school || "";
    var mobile = data["Mobile Number"] || data.mobile || "";
    
    sheet.appendRow([nextSno, date, time, studentName, studentClass, section, school, "'" + mobile]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "विद्यार्थी लॉगिन सफलतापूर्वक दर्ज किया गया।"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy as Web App
1. Click **Deploy (तैनात करें)** ➔ **New deployment (नया डिप्लॉयमेंट)**.
2. Select type: **Web app (वेब ऐप्लिकेशन)**.
3. Configure:
   - **Execute as**: `Me` (आपका गूगल खाता)
   - **Who has access**: `Anyone` (कोई भी)
4. Click **Deploy** and copy the **Web app URL** (e.g. `https://script.google.com/macros/s/.../exec`).

### Step 4: Link URL in the App
- In the browser on the Student Login page, click **⚙️ डेटा API लिंक व एक्सेल रिकॉर्ड्स (Data API & Records)**.
- Paste your Web App URL into the input field and click **सेव करें (Save)**.
- *Alternatively*: open `api-config.js` and set:
  ```javascript
  window.STUDENT_API_BASE_URL = "https://script.google.com/macros/s/AKfycbyjOs5M0iRvTGdcr91pQWqRsJ_yO0sgPQRqAy1mJp0bBStsIHx4VXKtLKtnyLj2UAud/exec";
  ```

---

## 3. Option B: Custom REST API (Node.js, Express, Flask, FastAPI, MongoDB)

When configured with a custom API URL (e.g. `https://api.yourdomain.com`), the app will send a `POST /api/students` request with JSON:

```json
{
  "sno": 1,
  "date": "28/10/2026",
  "time": "07:30:00 AM",
  "studentName": "RAHUL SHARMA",
  "class": "CLASS 10",
  "section": "A",
  "school": "GOVT SR SEC SCHOOL",
  "mobile": "9876543210",
  "S.No.": 1,
  "Date": "28/10/2026",
  "Time": "07:30:00 AM",
  "Student Name": "RAHUL SHARMA",
  "Class": "CLASS 10",
  "Section": "A",
  "School": "GOVT SR SEC SCHOOL",
  "Mobile Number": "9876543210"
}
```

---

## 4. Option C: Offline & Local Export Mode (No Server Needed)

- If no API URL is configured or if the student has no internet, all login records are automatically stored in browser storage (`localStorage`).
- Teachers and admins can click **📥 डाउनलोड डेटा (Excel/CSV)** on the Login page or in the Admin Dashboard to download the complete CSV file with UTF-8 BOM encoding for seamless opening in Microsoft Excel.
- The template file is always accessible at `assets/login_Data_Imentor_students.xlsx`.

