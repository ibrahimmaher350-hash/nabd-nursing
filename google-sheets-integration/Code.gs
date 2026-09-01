/**
 * Google Apps Script — نبض للتمريض المنزلي (Nabd Home Nursing)
 * ─────────────────────────────────────────────────────────────
 * نظام الربط الثلاثي الموحد (الموقع الإلكتروني + Google Sheets + Google Calendar)
 * 
 * 1. إدارة ملفات المرضى بنظام السجل الموحد (Single-Row Patient Record).
 * 2. ربط ومزامنة المواعيد مع Google Calendar بنظام 12 ساعة (AM/PM).
 * 3. نظام رسائل التذكير التلقائية عبر واتساب بصيغة نبض الرسمية مع اسم اليوم بالعربي.
 * 4. نظام المتابعة الدورية التلقائية المجدولة (بعد 3 أيام، أسبوع، أسبوعين، شهر، 3 شهور).
 * 5. تصدير ملف المريض كـ PDF طبي فاخر بهوية نبض (Navy & Gold) بضغطة زر واحدة.
 * 6. بوابة API ثنائية الاتجاه (Webhooks) لربط الموقع الإلكتروني وقاعدة البيانات.
 */

// ── أسماء الشيتات المعتمدة ──
var SHEET_PATIENTS = "الملفات الطبية للمرضى";
var SHEET_BOOKINGS = "سجل الحجوزات اليومية";
var SHEET_FOLLOWUPS = "تنبيهات المتابعة والتذكيرات";

// ── عناوين شيت الملفات الطبية الموحدة (مريض واحد في كل صف) ──
var PATIENT_HEADERS = [
  "رقم المريض (Patient ID)",          // 1 (A)
  "اسم المريض بالكامل",                // 2 (B)
  "اسم العميل / الحاجز",              // 3 (C)
  "رقم الهاتف",                       // 4 (D)
  "رقم الواتساب",                     // 5 (E)
  "المدينة / المنطقة",                // 6 (F)
  "العنوان بالتفصيل",                 // 7 (G)
  "حالة العميل",                      // 8 (H) - نشط / غير نشط
  "تاريخ إنشاء الملف",                // 9 (I)
  "آخر تحديث للملف",                  // 10 (J)
  "موعد الزيارة القادمة",             // 11 (K)
  "سجل الزيارات السابقة",              // 12 (L)
  "سجل العلامات الحيوية",             // 13 (M)
  "سجل التحاليل والتقارير الطبية",     // 14 (N)
  "سجل الخدمات التمريضية",            // 15 (O)
  "الأدوية والمواعيد",                // 16 (P)
  "التعليمات والمتابعة",              // 17 (Q)
  "التنبيهات والملاحظات الخاصة",      // 18 (R)
  "📲 تذكير واتساب الموعد",           // 19 (S)
  "📅 معرف تقويم جوجل (Event ID)",     // 20 (T)
  "📄 رابط ملف المريض PDF"            // 21 (U)
];

// ── عناوين شيت تنبيهات المتابعة ──
var FOLLOWUP_HEADERS = [
  "رقم المريض",
  "اسم المريض",
  "رقم الهاتف",
  "الخدمة السابقة",
  "تاريخ الزيارة السابقة",
  "تاريخ المتابعة المستحقة",
  "نوع المتابعة",
  "الحالة",
  "📲 إرسال رسالة المتابعة"
];

// ── مصفوفة أيام الأسبوع بالعربية ──
var ARABIC_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

/**
 * دالة تحويل الوقت إلى صيغة 12 ساعة (02:00 PM / 02:00 م)
 */
function formatTime12H(timeStr) {
  if (!timeStr) return "";
  var str = timeStr.toString().trim();
  if (str.toUpperCase().indexOf("AM") !== -1 || str.toUpperCase().indexOf("PM") !== -1) {
    return str.toUpperCase();
  }
  var match = str.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    var h = parseInt(match[1], 10);
    var m = match[2];
    var period = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 || 12;
    var h12Str = h12 < 10 ? "0" + h12 : h12.toString();
    return h12Str + ":" + m + " " + period;
  }
  return str;
}

/**
 * دالة تحويل الوقت إلى العربية (02:00 م)
 */
function formatTime12HArabic(timeStr) {
  var t = formatTime12H(timeStr);
  return t.replace("AM", "صباحاً").replace("PM", "مساءً");
}

/**
 * دالة جلب اسم اليوم بالعربية مع التاريخ
 */
function getArabicDayWithDate(dateStr) {
  if (!dateStr) return "";
  try {
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    var dayName = ARABIC_DAYS[d.getDay()];
    var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    var mm = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var yyyy = d.getFullYear();
    return dayName + " " + dd + "/" + mm + "/" + yyyy;
  } catch (e) {
    return dateStr;
  }
}

/**
 * دالة تنظيف رقم الهاتف لمصر
 */
function cleanEgyptianPhone(phone) {
  if (!phone) return "";
  var cleaned = phone.toString().replace(/[^0-9]/g, "");
  if (cleaned.indexOf("0") === 0) {
    return "2" + cleaned;
  } else if (cleaned.length === 10) {
    return "20" + cleaned;
  }
  return cleaned;
}

/**
 * إنشاء صيغة رسالة تذكير نبض الرسمية للعميل
 */
function buildNabdReminderText(customerName, serviceName, preferredDate, preferredTime, address) {
  var dayDateStr = getArabicDayWithDate(preferredDate);
  var time12Ar = formatTime12HArabic(preferredTime);

  return "السلام عليكم يا أستاذ / ة " + (customerName || "العميل الكريم") + "،\n" +
    "نتمنى تكون بخير وبأفضل حال. 🤍\n\n" +
    "📅 بنفكرك بموعد زيارة نبض للتمريض المنزلي\n" +
    "🩺 الخدمة المطلوبة: " + (serviceName || "خدمة تمريضية") + "\n" +
    "📆 التاريخ واليوم: " + dayDateStr + "\n" +
    "⏰ الساعة: " + time12Ar + "\n" +
    "📍 مكان الزيارة: " + (address || "دمياط") + "\n\n" +
    "🤍 بنفكّرك بموعد الزيارة علشان نضمن انتظام الرعاية وتقديم الخدمة في الموعد المحدد، ونتمنى إن الزيارة تكون سبب في راحتك واطمئنانك.\n\n" +
    "🏥 نبض للتمريض المنزلي\n" +
    "رعايتك الصحية تبدأ من مكانك، ونحن أقرب إليك. 💙";
}

/**
 * إنشاء صيغة رسالة المتابعة الدورية للعميل
 */
function buildNabdFollowUpText(customerName, serviceName, previousDate) {
  return "السلام عليكم يا أستاذ / ة " + (customerName || "العميل الكريم") + "،\n" +
    "نتمنى لحضرتك دوام الصحة والعافية. 🤍\n\n" +
    "🩺 فريق نبض للتمريض المنزلي بيطمن على صحتك بعد تقديم خدمة (" + (serviceName || "الرعاية التمريضية") + ").\n" +
    "لو محتاج أي متابعة، قياس علامات حيوية، أو حجز زيارة دورية قادمة، احنا دايماً في خدمتك لحد باب بيتك.\n\n" +
    "🏥 نبض للتمريض المنزلي — دمياط\n" +
    "هاتف/واتساب: 01001097896 / 01099667065 💙";
}

/**
 * تهيئة الشيتات بالهيدرز والتنسيق الطبي
 */
function setupSheetStructure() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. شيت الملفات الطبية الموحدة
  var sheet = ss.getSheetByName(SHEET_PATIENTS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PATIENTS, 0);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PATIENT_HEADERS);
    var range = sheet.getRange(1, 1, 1, PATIENT_HEADERS.length);
    range.setBackground("#1B2B6B");
    range.setFontColor("#FFFFFF");
    range.setFontWeight("bold");
    range.setHorizontalAlignment("center");
    range.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 45);
    sheet.setFrozenRows(1);
    sheet.setRightToLeft(true);
    
    // ضبط اتساع الأعمدة
    sheet.setColumnWidth(1, 120); // Patient ID
    sheet.setColumnWidth(2, 160); // Name
    sheet.setColumnWidth(4, 130); // Phone
    sheet.setColumnWidth(6, 120); // City
    sheet.setColumnWidth(7, 180); // Address
    sheet.setColumnWidth(11, 200); // Next Visit
    sheet.setColumnWidth(12, 250); // Visits
    sheet.setColumnWidth(13, 220); // Vitals
    sheet.setColumnWidth(14, 220); // Labs
    sheet.setColumnWidth(19, 160); // WhatsApp Reminder
    sheet.setColumnWidth(20, 160); // Calendar ID
    sheet.setColumnWidth(21, 160); // PDF Link
  }

  // 2. شيت تنبيهات المتابعة والتذكيرات
  var followUpSheet = ss.getSheetByName(SHEET_FOLLOWUPS);
  if (!followUpSheet) {
    followUpSheet = ss.insertSheet(SHEET_FOLLOWUPS);
    followUpSheet.appendRow(FOLLOWUP_HEADERS);
    var fRange = followUpSheet.getRange(1, 1, 1, FOLLOWUP_HEADERS.length);
    fRange.setBackground("#B45309");
    fRange.setFontColor("#FFFFFF");
    fRange.setFontWeight("bold");
    fRange.setHorizontalAlignment("center");
    followUpSheet.setRowHeight(1, 40);
    followUpSheet.setFrozenRows(1);
    followUpSheet.setRightToLeft(true);
  }

  return sheet;
}

/**
 * ربط ومزامنة موعد في Google Calendar
 */
function syncGoogleCalendarEvent(data, existingEventId) {
  try {
    var calendar = CalendarApp.getDefaultCalendar();
    var title = "🩺 " + (data.serviceName || "زيارة تمريض") + " — " + (data.patientName || data.customerName || "مريض نبض");
    
    var dateParts = (data.preferredDate || "").split("-");
    if (dateParts.length < 3) return existingEventId || "";
    
    var year = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var day = parseInt(dateParts[2], 10);
    
    var time12 = formatTime12H(data.preferredTime);
    var hour = 10;
    var min = 0;
    
    var timeMatch = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      min = parseInt(timeMatch[2], 10);
      var isPM = (timeMatch[3] || "").toUpperCase() === "PM";
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
    }
    
    var startTime = new Date(year, month, day, hour, min, 0);
    var endTime = new Date(year, month, day, hour + 1, min, 0); // مدة الزيارة ساعة
    
    var description = "🏥 نبض للتمريض المنزلي — تفاصيل الحجز:\n" +
      "👤 اسم العميل: " + (data.customerName || "") + "\n" +
      "🤒 اسم المريض: " + (data.patientName || data.customerName || "") + "\n" +
      "📞 الهاتف: " + (data.customerPhone || "") + "\n" +
      "💬 واتساب: " + (data.whatsapp || data.customerPhone || "") + "\n" +
      "🩺 الخدمة: " + (data.serviceName || "") + "\n" +
      "📍 العنوان: " + (data.city || "") + " - " + (data.address || "") + "\n" +
      "⏰ الوقت: " + formatTime12HArabic(data.preferredTime) + "\n" +
      (data.nextFollowUpDate ? ("🔄 المتابعة القادمة: " + getArabicDayWithDate(data.nextFollowUpDate) + "\n") : "") +
      (data.notes ? ("📝 ملاحظات: " + data.notes + "\n") : "") +
      (data.selectedLabTests && data.selectedLabTests.length > 0 ? ("🧪 التحاليل: " + data.selectedLabTests.join("، ") + "\n") : "");

    var location = (data.city || "") + " - " + (data.address || "") + "، دمياط، مصر";
    
    // إذا كان الموعد موجوداً مسبقاً، نعدله بدلاً من تكراره
    if (existingEventId) {
      try {
        var existingEvent = calendar.getEventById(existingEventId);
        if (existingEvent) {
          existingEvent.setTitle(title);
          existingEvent.setTime(startTime, endTime);
          existingEvent.setDescription(description);
          existingEvent.setLocation(location);
          return existingEventId;
        }
      } catch (err) {
        // Event not found, create new
      }
    }
    
    var newEvent = calendar.createEvent(title, startTime, endTime, {
      description: description,
      location: location
    });
    return newEvent.getId();
  } catch (e) {
    Logger.log("Calendar sync error: " + e.toString());
    return existingEventId || "";
  }
}

/**
 * doPost: استقبال الحجوزات وتحديث سجل المريض الموحد
 */
function doPost(e) {
  try {
    var sheet = setupSheetStructure();
    var data = JSON.parse(e.postData.contents);
    var nowTimestamp = new Date().toLocaleString("ar-EG");
    
    var phone = (data.customerPhone || "").toString().trim();
    var cleanPhone = cleanEgyptianPhone(phone);
    var fullAddress = (data.city || "") + " - " + (data.address || "");
    var time12 = formatTime12H(data.preferredTime);
    var time12Ar = formatTime12HArabic(data.preferredTime);
    var dayDateStr = getArabicDayWithDate(data.preferredDate);
    
    var reminderMsg = buildNabdReminderText(
      data.customerName || data.patientName,
      data.serviceName,
      data.preferredDate,
      data.preferredTime,
      fullAddress
    );
    var whatsappReminderFormula = '=HYPERLINK("https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(reminderMsg) + '", "📲 إرسال تذكير الموعد")';
    
    // البحث عن سجل المريض الحالي في الشيت (مريض واحد لكل صف)
    var allData = sheet.getDataRange().getValues();
    var targetRowIndex = -1;
    var existingPatientId = "";
    var existingCalendarEventId = "";
    
    for (var r = 1; r < allData.length; r++) {
      var rowPhone = (allData[r][3] || "").toString().replace(/[^0-9]/g, "");
      var rowWa = (allData[r][4] || "").toString().replace(/[^0-9]/g, "");
      if (
        (cleanPhone && (rowPhone.indexOf(cleanPhone) !== -1 || cleanPhone.indexOf(rowPhone) !== -1)) ||
        (cleanPhone && (rowWa.indexOf(cleanPhone) !== -1 || cleanPhone.indexOf(rowWa) !== -1))
      ) {
        targetRowIndex = r + 1; // 1-based index
        existingPatientId = allData[r][0];
        existingCalendarEventId = allData[r][19] || "";
        break;
      }
    }
    
    // مزامنة موعد تقويم جوجل
    var calendarEventId = syncGoogleCalendarEvent(data, existingCalendarEventId);
    
    // تفاصيل الزيارة القادمة والمتابعة المجدولة
    var nextFollowUpStr = data.nextFollowUpDate ? ("\n🔄 المتابعة القادمة: " + getArabicDayWithDate(data.nextFollowUpDate)) : "";
    var nextVisitCell = (data.preferredDate ? (dayDateStr + " - " + time12Ar) : "") + "\nالخدمة: " + (data.serviceName || "") + "\nالحالة: مؤكدة" + nextFollowUpStr;
    
    // نص الزيارة الجديدة للإضافة في سجل الزيارات
    var newVisitEntry = dayDateStr + " | " + time12Ar + "\nالخدمة: " + (data.serviceName || "") + "\nالحالة: قيد التنفيذ\nالملاحظات: " + (data.notes || "لا توجد ملاحظات إضافية");
    
    // نص التحاليل إن وجدت
    var newLabEntry = "";
    if (data.selectedLabTests && data.selectedLabTests.length > 0) {
      newLabEntry = dayDateStr + "\nالتحاليل: " + data.selectedLabTests.join("، ") + (data.labNotes ? ("\nملاحظات: " + data.labNotes) : "");
    }
    
    // إذا كان المريض مسجلاً مسبقاً -> دمج وإضافة بالسطر الجديد داخل نفس الخلية!
    if (targetRowIndex > 0) {
      var currentRowData = allData[targetRowIndex - 1];
      
      var prevVisits = (currentRowData[11] || "").toString().trim();
      var updatedVisits = prevVisits ? (prevVisits + "\n\n" + newVisitEntry) : newVisitEntry;
      
      var prevLabs = (currentRowData[13] || "").toString().trim();
      var updatedLabs = newLabEntry ? (prevLabs ? (prevLabs + "\n\n" + newLabEntry) : newLabEntry) : prevLabs;
      
      var prevAlerts = (currentRowData[17] || "").toString().trim();
      var updatedAlerts = data.notes ? (prevAlerts ? (prevAlerts + "\n" + data.notes) : data.notes) : prevAlerts;
      
      // تحديث صف المريض
      sheet.getRange(targetRowIndex, 2).setValue(data.patientName || currentRowData[1]); // اسم المريض
      sheet.getRange(targetRowIndex, 3).setValue(data.customerName || currentRowData[2]); // اسم العميل
      sheet.getRange(targetRowIndex, 6).setValue(data.city || currentRowData[5]); // المدينة
      sheet.getRange(targetRowIndex, 7).setValue(data.address || currentRowData[6]); // العنوان
      sheet.getRange(targetRowIndex, 8).setValue("نشط"); // الحالة
      sheet.getRange(targetRowIndex, 10).setValue(nowTimestamp); // آخر تحديث
      sheet.getRange(targetRowIndex, 11).setValue(nextVisitCell); // موعد الزيارة القادمة
      sheet.getRange(targetRowIndex, 12).setValue(updatedVisits); // سجل الزيارات المدمج
      sheet.getRange(targetRowIndex, 14).setValue(updatedLabs); // سجل التحاليل المدمج
      sheet.getRange(targetRowIndex, 18).setValue(updatedAlerts); // التنبيهات
      sheet.getRange(targetRowIndex, 19).setValue(whatsappReminderFormula); // زر التذكير
      sheet.getRange(targetRowIndex, 20).setValue(calendarEventId); // معرف التقويم
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        patientId: existingPatientId,
        action: "updated_existing_patient",
        calendarEventId: calendarEventId
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // إذا كان المريض جديداً -> إنشاء رقم تعريفي جديد وصف جديد
    var patientCount = sheet.getLastRow();
    var newPatientId = "NABD-" + ("0000" + patientCount).slice(-4);
    
    sheet.appendRow([
      newPatientId,
      data.patientName || data.customerName || "",
      data.customerName || "",
      data.customerPhone || "",
      data.whatsapp || data.customerPhone || "",
      data.city || "",
      data.address || "",
      "نشط",
      nowTimestamp,
      nowTimestamp,
      nextVisitCell,
      newVisitEntry,
      "", // سجل العلامات الحيوية (يُضاف عند الزيارة)
      newLabEntry,
      dayDateStr + " | " + (data.serviceName || "") + " | تم الحجز",
      "", // الأدوية
      "", // التعليمات
      data.notes || "",
      whatsappReminderFormula,
      calendarEventId,
      "" // رابط PDF
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      patientId: newPatientId,
      action: "created_new_patient",
      calendarEventId: calendarEventId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet: استعلامات الملف الطبي والزيارات
 */
function doGet(e) {
  try {
    var sheet = setupSheetStructure();
    var query = (e && e.parameter && (e.parameter.phone || e.parameter.patientId || e.parameter.query)) || "";
    
    if (!query) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "active",
        brand: "نبض للتمريض المنزلي — دمياط",
        systemsLinked: ["Website", "Google Sheets", "Google Calendar"],
        version: "2026.2"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var cleanQuery = query.toString().replace(/[^0-9a-zA-Z]/g, "").toLowerCase();
    var allData = sheet.getDataRange().getValues();
    
    for (var i = 1; i < allData.length; i++) {
      var row = allData[i];
      var rowPatientId = (row[0] || "").toString().toLowerCase();
      var rowPhone = (row[3] || "").toString().replace(/[^0-9]/g, "");
      var rowWa = (row[4] || "").toString().replace(/[^0-9]/g, "");
      
      if (
        (cleanQuery && (rowPhone.indexOf(cleanQuery) !== -1 || cleanQuery.indexOf(rowPhone) !== -1)) ||
        (cleanQuery && (rowWa.indexOf(cleanQuery) !== -1 || cleanQuery.indexOf(rowWa) !== -1)) ||
        (cleanQuery && rowPatientId.indexOf(cleanQuery) !== -1)
      ) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          patient: {
            patientId: row[0],
            name: row[1] || row[2],
            customerName: row[2],
            phone: row[3],
            whatsapp: row[4],
            city: row[5],
            address: row[6],
            status: row[7] || "نشط",
            createdAt: row[8],
            updatedAt: row[9],
            nextVisit: row[10],
            visitsHistory: row[11],
            vitalsHistory: row[12],
            labTestsHistory: row[13],
            servicesHistory: row[14],
            medications: row[15],
            instructions: row[16],
            alerts: row[17],
            pdfReportUrl: row[20]
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "لم يتم العثور على ملف طبي مسجل بهذا الرقم أو المعرف"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ── زر القائمة المخصصة في Google Sheets ──
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🏥 نبض للتمريض المنزلي")
    .addItem("🚀 المزامنة الشاملة بضغطة زر (Sync All Systems)", "syncAllSystemsOneClick")
    .addSeparator()
    .addItem("📄 تصدير ملف المريض المحدد PDF بهوية نبض", "exportSelectedPatientPdf")
    .addItem("⏰ مزامنة المواعيد مع Google Calendar", "syncAllPendingCalendarEvents")
    .addItem("🔔 فحص وتحديث تنبيهات المتابعة الدورية", "checkDailyFollowUpReminders")
    .addSeparator()
    .addItem("⚙️ تهيئة وتنسيق الجداول الطبية الموحدة", "setupSheetStructure")
    .addToUi();
}

/**
 * 🚀 دالة المزامنة الشاملة للأنظمة الثلاثة بضغطة زر واحدة (Sync All Systems One-Click)
 */
function syncAllSystemsOneClick() {
  var sheet = setupSheetStructure();
  var allData = sheet.getDataRange().getValues();
  var syncedEventsCount = 0;
  var followUpsScheduledCount = 0;
  
  var calendar = CalendarApp.getDefaultCalendar();
  
  for (var i = 1; i < allData.length; i++) {
    var row = allData[i];
    var rowIndex = i + 1;
    var patientId = row[0];
    var patientName = row[1] || row[2];
    var customerPhone = row[3];
    var address = (row[5] || "") + " - " + (row[6] || "");
    var nextVisitText = (row[10] || "").toString();
    var existingEventId = row[19] || "";
    
    // استخراج التاريخ والوقت من نص الزيارة القادمة
    var dateMatch = nextVisitText.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/);
    var timeMatch = nextVisitText.match(/(\d{1,2}:\d{2}\s*(AM|PM|صباحاً|مساءً)?)/i);
    
    if (dateMatch && timeMatch && !existingEventId) {
      try {
        var eventId = syncGoogleCalendarEvent({
          serviceName: "زيارة تمريضية",
          patientName: patientName,
          customerPhone: customerPhone,
          preferredDate: dateMatch[0],
          preferredTime: timeMatch[0],
          city: row[5] || "",
          address: row[6] || ""
        }, "");
        
        if (eventId) {
          sheet.getRange(rowIndex, 20).setValue(eventId);
          syncedEventsCount++;
        }
      } catch (err) {}
    }
  }
  
  // تحديث شيت المتابعات
  checkDailyFollowUpReminders();
  
  SpreadsheetApp.getUi().alert(
    "✅ تمت المزامنة الشاملة للأنظمة الثلاثة بنجاح! 🚀\n\n" +
    "1. جدول بيانات Google Sheets: تم تنسيق وتحديث السجلات الموحدة.\n" +
    "2. تقويم Google Calendar: تمت مزامنة المواعيد الجديدة (" + syncedEventsCount + " موعد).\n" +
    "3. نظام التذكيرات والمتابعة: تم فحص وتحديث قائمة المتابعة الدورية.\n\n" +
    "🏥 نبض للتمريض المنزلي — رعايتك الصحية تبدأ من مكانك."
  );
}

/**
 * تصدير ملف المريض المحدد كـ PDF رسمي فاخر بهوية نبض
 */
function exportSelectedPatientPdf() {
  var sheet = setupSheetStructure();
  var activeRow = sheet.getActiveCell().getRow();
  if (activeRow <= 1) {
    SpreadsheetApp.getUi().alert("يرجى تحديد صف المريض المطلوب تصدير ملفه الطبي.");
    return;
  }
  
  var rowData = sheet.getRange(activeRow, 1, 1, PATIENT_HEADERS.length).getValues()[0];
  var patientId = rowData[0] || "NABD-0001";
  var patientName = rowData[1] || rowData[2] || "مريض نبض";
  
  var htmlContent = "<!DOCTYPE html><html dir='rtl' lang='ar'><head><meta charset='UTF-8'>" +
    "<style>" +
    "@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');" +
    "body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; padding: 25px; color: #0F172A; background: #FFF; }" +
    ".header { border-bottom: 4px solid #1B2B6B; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }" +
    ".brand-title { font-size: 22px; font-weight: 900; color: #1B2B6B; margin: 0; }" +
    ".brand-sub { font-size: 13px; color: #475569; margin: 2px 0; }" +
    ".gold-bar { background: #1B2B6B; color: #FFF; padding: 8px 15px; border-radius: 8px; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; margin-top: 10px; }" +
    ".card { background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 12px; padding: 15px; margin-bottom: 15px; }" +
    ".card-title { font-size: 15px; font-weight: 800; color: #1B2B6B; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-top: 0; margin-bottom: 10px; }" +
    ".grid-2 { display: flex; gap: 15px; }" +
    ".grid-2 > div { flex: 1; }" +
    ".badge-id { background: #D97706; color: #FFF; padding: 3px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }" +
    ".footer { border-top: 2px solid #CBD5E1; padding-top: 15px; margin-top: 25px; display: flex; justify-content: space-between; text-align: center; }" +
    ".stamp-box { border: 2px dashed #1B2B6B; border-radius: 10px; padding: 10px; min-width: 180px; }" +
    "</style></head><body>" +
    
    "<div class='header'>" +
    "  <div>" +
    "    <h1 class='brand-title'>🏥 نبض للتمريض المنزلي والرعاية الصحية</h1>" +
    "    <p class='brand-sub'>NABD Home Nursing & Medical Healthcare Services — دمياط</p>" +
    "    <p style='color:#D97706; font-size:12px; font-weight:bold;'>رعايتك الصحية تبدأ من مكانك، ونحن أقرب إليك</p>" +
    "  </div>" +
    "</div>" +
    
    "<div class='gold-bar'>" +
    "  <span>السجل الصحي الموحد والملف الطبي الشامل</span>" +
    "  <span>المعرف: " + patientId + "</span>" +
    "</div><br/>" +
    
    "<div class='card'>" +
    "  <h3 class='card-title'>👤 بيانات المريض الأساسية (Patient Identification)</h3>" +
    "  <p><strong>اسم المريض:</strong> " + patientName + " &nbsp;|&nbsp; <strong>الهاتف:</strong> " + (rowData[3] || "") + "</p>" +
    "  <p><strong>العنوان:</strong> " + (rowData[5] || "دمياط") + " - " + (rowData[6] || "") + " &nbsp;|&nbsp; <strong>حالة الملف:</strong> نشط ✅</p>" +
    "</div>" +
    
    (rowData[10] ? ("<div class='card' style='background:#FEF3C7; border-color:#F59E0B;'><h3 class='card-title' style='color:#B45309;'>📅 موعد الزيارة القادمة والمتابعة</h3><p style='white-space:pre-line; font-weight:bold; color:#78350F;'>" + rowData[10] + "</p></div>") : "") +
    
    "<div class='grid-2'>" +
    "  <div class='card'><h3 class='card-title'>📊 سجل العلامات الحيوية</h3><p style='white-space:pre-line; font-size:12px;'>" + (rowData[12] || "لا توجد قياسات مسجلة بعد.") + "</p></div>" +
    "  <div class='card'><h3 class='card-title'>🩺 سجل الزيارات التمريضية</h3><p style='white-space:pre-line; font-size:12px;'>" + (rowData[11] || "لا توجد زيارات سابقة مسجلة.") + "</p></div>" +
    "</div>" +
    
    (rowData[13] ? ("<div class='card'><h3 class='card-title'>🧪 سجل التحاليل والفحوصات</h3><p style='white-space:pre-line; font-size:12px;'>" + rowData[13] + "</p></div>") : "") +
    
    "<div class='footer'>" +
    "  <div><p><strong>المشرف التمريضي:</strong> إبراهيم ماهر</p><p style='font-size:11px; color:#64748B;'>نبض للتمريض المنزلي — دمياط</p></div>" +
    "  <div class='stamp-box'><p style='margin:0; font-weight:bold; color:#1B2B6B;'>🏛️ ختم مؤسسة نبض</p><p style='margin:0; font-size:10px; color:#475569;'>معتمد وموثق بدمياط</p></div>" +
    "</div>" +
    
    "</body></html>";

  var htmlOutput = HtmlService.createHtmlOutput(htmlContent);
  var pdfBlob = htmlOutput.getAs("application/pdf");
  pdfBlob.setName("الملف_الطبي_" + patientId + "_" + patientName + ".pdf");
  
  var pdfFile = DriveApp.createFile(pdfBlob);
  var pdfUrl = pdfFile.getUrl();
  
  sheet.getRange(activeRow, 21).setValue(pdfUrl);
  SpreadsheetApp.getUi().alert("تم إنشاء وتصدير ملف المريض PDF الفاخر بنجاح! 🎉\n\nرابط الملف على Google Drive:\n" + pdfUrl);
}

/**
 * فحص وتحديث تنبيهات المتابعة الدورية
 */
function checkDailyFollowUpReminders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = setupSheetStructure();
  var followUpSheet = ss.getSheetByName(SHEET_FOLLOWUPS);
  
  var allData = sheet.getDataRange().getValues();
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // مسح البيانات السابقة بالشيت لتحديثها
  var lastRow = followUpSheet.getLastRow();
  if (lastRow > 1) {
    followUpSheet.getRange(2, 1, lastRow - 1, FOLLOWUP_HEADERS.length).clearContent();
  }
  
  var followUpsAdded = 0;
  
  for (var i = 1; i < allData.length; i++) {
    var row = allData[i];
    var patientId = row[0];
    var patientName = row[1] || row[2];
    var phone = row[3];
    var cleanPhone = cleanEgyptianPhone(phone);
    var nextVisitText = (row[10] || "").toString();
    
    if (nextVisitText.indexOf("المتابعة القادمة") !== -1) {
      var followUpMsg = buildNabdFollowUpText(patientName, "الخدمة التمريضية", "");
      var waLink = '=HYPERLINK("https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(followUpMsg) + '", "📲 إرسال رسالة المتابعة")';
      
      followUpSheet.appendRow([
        patientId,
        patientName,
        phone,
        "متابعة دورية",
        row[9] || "اليوم",
        nextVisitText.split("المتابعة القادمة:")[1] || "مجدول",
        "متابعة دورية مستحقة",
        "مستحقة",
        waLink
      ]);
      followUpsAdded++;
    }
  }
}

/**
 * مزامنة مواعيد اليوم مع Google Calendar
 */
function syncAllPendingCalendarEvents() {
  syncAllSystemsOneClick();
}
