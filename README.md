# I_Mentor_99 — कक्षा 10 गणित

यह बिना build step वाला static web app है। इसे GitHub Pages पर प्रकाशित करने के बाद quiz links WhatsApp में भेजे जा सकते हैं।

## GitHub Pages पर प्रकाशित करना

1. इस repository को GitHub पर `main` branch में push करें। GitHub Pages के मुफ्त hosting के लिए repository public होनी चाहिए; private repository का source और commit history सार्वजनिक करने से पहले उसकी सामग्री जाँचें।
2. Repository में **Settings → Pages → Build and deployment → Source** खोलें और **GitHub Actions** चुनें।
3. **Actions** टैब में **Deploy static quiz to GitHub Pages** workflow सफल होने दें। प्रकाशित साइट का URL workflow के deployment environment में दिखेगा।
4. प्रकाशित साइट खोलें, quiz पूरा करें और परिणाम स्क्रीन से **क्विज़ लिंक कॉपी करें** या **WhatsApp पर लिंक भेजें** चुनें।

Workflow केवल app की HTML, CSS, JavaScript, icon और आवश्यक images प्रकाशित करता है। `Student_Answers_Tracker.xlsx`, `.venv/` और repository की अन्य फ़ाइलें वेबसाइट में शामिल नहीं होतीं।

## अभ्यास और प्रगति

- 15 अध्यायों में आसान से बोर्ड स्तर तक 10 अभ्यास सेट और 30 प्रश्नों का अध्याय टेस्ट उपलब्ध है।
- क्विज़ में समय, प्रगति, प्रश्नों पर आगे-पीछे जाना, प्रश्न छोड़ना और संकेत शामिल हैं।
- परिणाम में स्कोर, सही/गलत/छोड़े प्रश्न, समय और चरण-दर-चरण समाधान दिखते हैं। गलत प्रश्नों को दोबारा हलने और कठिन सेट आज़माने के विकल्प भी हैं।
- डैशबोर्ड अध्यायवार प्रगति दिखाता है और गलत प्रश्नों को “मेरी गलतियाँ” में सेव करता है।
- “गणित वस्तुनिष्ठ प्रश्न बैंक” में M2021–M2026 और S2024–S2026 के 136 प्रश्न तथा अपलोड की गई Workbook Quiz फ़ाइल के 75 MCQ स्रोत, परीक्षा-वर्ष, मुख्य/पूरक सत्र और अध्याय फ़िल्टर तथा क्विज़ सहित उपलब्ध हैं। वैदिक गणित का वर्ग-प्रश्न अलग विशेष इकाई में रखा गया है। Workbook फ़ाइल में वर्ष और हल उपलब्ध नहीं हैं; क्विज़ उत्तर और दी गई answer key दिखाता है।
- प्रश्न बैंक के प्रश्नों के विकल्प देखने के बाद फ़िल्टर किए गए प्रश्नों का क्विज़ शुरू करें। क्विज़ पूरा होने तक सही उत्तर और हल छिपे रहते हैं; परिणाम में उत्तर-पत्रिका और समाधान दिखते हैं। प्रश्न बैंक और क्विज़ स्क्रीन के **⌂ होम** बटन से मुख्य पृष्ठ पर लौटें।
- ऐप को HTTPS पर पहली बार खोलने के बाद इसका shell offline उपलब्ध रहता है। Android Chrome में ब्राउज़र मेन्यू से **Add to Home screen** चुनें।

प्रगति और गलतियाँ उसी ब्राउज़र के `localStorage` में रहती हैं; वे दूसरे डिवाइस पर sync नहीं होतीं। विद्यार्थी का नाम, कक्षा, विद्यालय और मोबाइल नंबर अलग MongoDB API में सहेजे जाते हैं। GitHub Pages static hosting है, इसलिए MongoDB credentials केवल backend में रखें—कभी frontend में नहीं।

### विद्यार्थी विवरण और MongoDB API

पहली बार ऐप खोलने पर विद्यार्थी विवरण फ़ॉर्म आता है। फ़ॉर्म अंग्रेज़ी में है; नाम और विद्यालय के नाम uppercase में MongoDB में सहेजे जाते हैं और कक्षा `CLASS 1` से `CLASS 12` तक रखी जाती है। OTP नहीं है; इसलिए मोबाइल नंबर सत्यापित नहीं होता और यह पहचान-सुरक्षित authentication नहीं है। समान मोबाइल नंबर से जमा की गई जानकारी उसी विद्यार्थी रिकॉर्ड को अपडेट करती है। फॉर्म में अभिभावक/विद्यार्थी अनुमति की पुष्टि आवश्यक है।

1. MongoDB Atlas में database बनाकर `students` collection के लिए backend को access देने वाला database user और network access सेट करें।
2. Render (या किसी Python web-service host) पर `backend` फ़ोल्डर को अलग Web Service की तरह deploy करें। Build command `pip install -r requirements.txt`, start command `gunicorn app:app`, और health-check path `/api/health` रखें।
3. Backend service के environment में `MONGODB_URI`, वैकल्पिक `MONGODB_DATABASE` (डिफ़ॉल्ट `i_mentor`) और `ALLOWED_ORIGINS` सेट करें। `ALLOWED_ORIGINS` में प्रकाशित frontend का पूरा origin रखें, जैसे `https://<account>.github.io` (repository path शामिल न करें)। लोकल परीक्षण के लिए `http://localhost:8000` भी जोड़ें।
4. `api-config.js` में `window.STUDENT_API_BASE_URL` को backend का HTTPS origin दें, जैसे `https://<service>.onrender.com`। यह URL सार्वजनिक है; MongoDB URI/पासवर्ड नहीं।
5. Backend के `/api/health` पर `{"status":"ok"}` जाँचने के बाद static site फिर से deploy करें। लोकल परीक्षण में repository root पर `python -m http.server 8000` और `backend` फ़ोल्डर में `python app.py` चलाएँ।

MongoDB रिकॉर्ड में मोबाइल नंबर unique key है। OTP/authentication न होने के कारण मोबाइल नंबर रखने वाला कोई भी व्यक्ति उस नंबर का रिकॉर्ड अपडेट कर सकता है; वास्तविक सुरक्षित login के लिए verified sign-in जोड़ना होगा। सार्वजनिक रूप से खोलने से पहले MongoDB Atlas की network access सीमित करें और लागू गोपनीयता/अभिभावक-सहमति नियमों की समीक्षा करें। साझा लिंक चुने गए अध्याय, सेट और प्रश्न संख्या का क्विज़ खोलता है, लेकिन विद्यार्थी के उत्तर साझा नहीं करता।

### Admin uploads

Question-file uploads are available only at `/admin.html`, not on the student dashboard. Configure backend environment variables `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a long random `SECRET_KEY`; keep them private and use HTTPS. Set `ALLOWED_ORIGINS` to the exact GitHub Pages origin and `SESSION_COOKIE_SECURE=true`. For local HTTP-only testing set `SESSION_COOKIE_SECURE=false` and include `http://localhost:8000` in `ALLOWED_ORIGINS`. The admin API uses an HTTP-only signed session cookie plus a CSRF token. Login is required to list, upload, download, or delete files. Files are kept in MongoDB GridFS (`admin_uploads` bucket), limited to 25 MB each, and restricted by extension to PDF, Word, Excel, and CSV. They are stored privately, but are **not automatically parsed or added to the quiz question bank**.

अध्याय अभ्यास के प्रश्न नियम-आधारित हैं। प्रश्न-बैंक उपलब्ध कराए गए प्रश्नपत्रों के वस्तुनिष्ठ प्रश्नों और Workbook Quiz की अपलोड की गई CSV फ़ाइल पर आधारित है; इसे आधिकारिक या सम्पूर्ण NCERT प्रश्न-बैंक न मानें। ऑनलाइन leaderboard, प्रमाणपत्र, फ़ाइल से प्रश्न आयात और Class 10 का 80-अंकों वाला full mock इस static संस्करण में शामिल नहीं हैं।

GitHub Pages उपलब्ध होने और repository की visibility पर निर्भर करते हुए प्रकाशित साइट सार्वजनिक हो सकती है। सार्वजनिक रूप से उपलब्ध करने से पहले repository और उसमें रखी सामग्री की visibility जाँचें।
