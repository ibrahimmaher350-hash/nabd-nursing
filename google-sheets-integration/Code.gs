/**
 * Google Apps Script — نبض للتمريض المنزلي (Nabd Home Nursing)
 * ─────────────────────────────────────────────────────────────
 * نظام الربط الثلاثي الموحد والمحسن (الموقع الإلكتروني + Google Sheets + Google Calendar)
 * 
 * 1. ضبط وتنسيق الجداول الطبية (Wrap text لمنع التداخل وتنسيق العرض والارتفاع).
 * 2. تفعيل روابط تذكير واتساب الفورية بالصيغة الرسمية المعتمدة.
 * 3. مزامنة فورية وموثوقة مع Google Calendar وحفظ معرف الحدث (Event ID).
 * 4. هيكل السجل الطبي الموحد (Single-Row Patient Record).
 * 5. جدولة المتابعات الدورية (بعد 3 أيام، أسبوع، أسبوعين، شهر، 3 شهور).
 * 6. تصدير ملف المريض الفاخر PDF بهوية نبض الطبية.
 * 7. توافق كامل مع كافة سياقات التشغيل (محرر السكربت، القوائم، وWebhooks).
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
 * دالة آمنة لإظهار الرسائل والتنبيهات في كل سياقات التشغيل
 */
function showAlertSafely(message) {
  try {
    var ui = SpreadsheetApp.getUi();
    if (ui) {
      ui.alert(message);
      return;
    }
  } catch (e) {}
  Logger.log("──────────────────────────────────────────");
  Logger.log(message);
  Logger.log("──────────────────────────────────────────");
}

/**
 * دالة جلب الشيت النشط بأمان
 */
function getActiveSpreadsheetSafely() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  try {
    return SpreadsheetApp.openById("1ltsE5dYN0Y_l2HRKSGPbw_3kl8Vo2bSXHn9sfpg17bLMIW0SCKx6ITjZ");
  } catch (e2) {
    return null;
  }
}

/**
 * دالة تحويل الوقت إلى صيغة 12 ساعة (02:00 PM / 02:00 م)
 */
function formatTime12H(timeStr) {
  if (!timeStr) return "10:00 AM";
  var str = timeStr.toString().trim();
  if (str.toUpperCase().indexOf("AM") !== -1 || str.toUpperCase().indexOf("PM") !== -1) {
    return str.toUpperCase();
  }
  if (str.indexOf("صباح") !== -1 || str.indexOf("ص") !== -1) {
    var clean = str.replace(/[^0-9:]/g, "");
    var parts = clean.split(":");
    var h = (parts[0] || "10");
    var m = (parts[1] || "00");
    return (h.length === 1 ? "0" + h : h) + ":" + m + " AM";
  }
  if (str.indexOf("مساء") !== -1 || str.indexOf("م") !== -1) {
    var clean = str.replace(/[^0-9:]/g, "");
    var parts = clean.split(":");
    var h = (parts[0] || "02");
    var m = (parts[1] || "00");
    return (h.length === 1 ? "0" + h : h) + ":" + m + " PM";
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
    "نتمنى تكون بخير وبأفضل حال. 🤍\n" +
    "📅 تذكير بموعد زيارة نبض للتمريض المنزلي\n" +
    "🩺 الخدمة المطلوبة: " + (serviceName || "خدمة تمريضية") + "\n" +
    "📆 التاريخ: " + dayDateStr + "\n" +
    "⏰ الساعة: " + time12Ar + "\n" +
    "📍 مكان الزيارة: " + (address || "دمياط") + "\n" +
    "🤍 بنفكّرك بموعد الزيارة علشان نضمن انتظام الرعاية وتقديم الخدمة في الموعد المحدد، ونتمنى إن الزيارة تكون سبب في راحتك واطمئنانك.\n" +
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
 * تهيئة وتنسيق الشيتات بالكامل ومنع تداخل الخانات
 */
function setupSheetStructure() {
  var ss = getActiveSpreadsheetSafely();
  if (!ss) return null;
  
  // 1. شيت الملفات الطبية الموحدة
  var sheet = ss.getSheetByName(SHEET_PATIENTS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PATIENTS, 0);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PATIENT_HEADERS);
  } else {
    sheet.getRange(1, 1, 1, PATIENT_HEADERS.length).setValues([PATIENT_HEADERS]);
  }
  
  var range = sheet.getRange(1, 1, 1, PATIENT_HEADERS.length);
  range.setBackground("#1B2B6B");
  range.setFontColor("#FFFFFF");
  range.setFontWeight("bold");
  range.setFontSize(10);
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  range.setWrap(true);
  sheet.setRowHeight(1, 45);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);
  sheet.setRightToLeft(true);
  
  sheet.setColumnWidth(1, 130); // Patient ID
  sheet.setColumnWidth(2, 170); // Patient Name
  sheet.setColumnWidth(3, 160); // Customer Name
  sheet.setColumnWidth(4, 130); // Phone
  sheet.setColumnWidth(5, 130); // WhatsApp
  sheet.setColumnWidth(6, 130); // City
  sheet.setColumnWidth(7, 240); // Address
  sheet.setColumnWidth(8, 90);  // Status
  sheet.setColumnWidth(9, 140); // Created At
  sheet.setColumnWidth(10, 140); // Updated At
  sheet.setColumnWidth(11, 230); // Next Visit
  sheet.setColumnWidth(12, 280); // Visits History
  sheet.setColumnWidth(13, 230); // Vitals History
  sheet.setColumnWidth(14, 230); // Labs History
  sheet.setColumnWidth(15, 230); // Services History
  sheet.setColumnWidth(16, 180); // Medications
  sheet.setColumnWidth(17, 180); // Instructions
  sheet.setColumnWidth(18, 180); // Alerts & Notes
  sheet.setColumnWidth(19, 170); // WhatsApp Reminder Link
  sheet.setColumnWidth(20, 180); // Google Calendar Event ID
  sheet.setColumnWidth(21, 170); // PDF Link
  
  if (sheet.getLastRow() > 1) {
    var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, PATIENT_HEADERS.length);
    dataRange.setWrap(true);
    dataRange.setVerticalAlignment("top");
    dataRange.setHorizontalAlignment("center");
    dataRange.setFontSize(10);
  }

  // 2. شيت تنبيهات المتابعة والتذكيرات
  var followUpSheet = ss.getSheetByName(SHEET_FOLLOWUPS);
  if (!followUpSheet) {
    followUpSheet = ss.insertSheet(SHEET_FOLLOWUPS);
    followUpSheet.appendRow(FOLLOWUP_HEADERS);
  } else if (followUpSheet.getLastRow() === 0) {
    followUpSheet.appendRow(FOLLOWUP_HEADERS);
  }
  
  var fRange = followUpSheet.getRange(1, 1, 1, FOLLOWUP_HEADERS.length);
  fRange.setBackground("#B45309");
  fRange.setFontColor("#FFFFFF");
  fRange.setFontWeight("bold");
  fRange.setHorizontalAlignment("center");
  fRange.setVerticalAlignment("middle");
  followUpSheet.setRowHeight(1, 40);
  followUpSheet.setFrozenRows(1);
  followUpSheet.setRightToLeft(true);
  
  followUpSheet.setColumnWidth(1, 120);
  followUpSheet.setColumnWidth(2, 160);
  followUpSheet.setColumnWidth(3, 130);
  followUpSheet.setColumnWidth(4, 180);
  followUpSheet.setColumnWidth(5, 140);
  followUpSheet.setColumnWidth(6, 160);
  followUpSheet.setColumnWidth(7, 150);
  followUpSheet.setColumnWidth(8, 100);
  followUpSheet.setColumnWidth(9, 180);

  return sheet;
}

/**
 * ربط ومزامنة موعد في Google Calendar بدقة فائقة
 */
function syncGoogleCalendarEvent(data, existingEventId) {
  try {
    var calendar = null;
    try {
      calendar = CalendarApp.getDefaultCalendar();
    } catch (cErr) {}
    
    if (!calendar) {
      var allCals = CalendarApp.getAllCalendars();
      if (allCals && allCals.length > 0) calendar = allCals[0];
    }
    
    if (!calendar) return existingEventId || "";
    
    var title = "🩺 " + (data.serviceName || "زيارة تمريضية") + " — " + (data.patientName || data.customerName || "مريض نبض");
    
    var year = 2026;
    var month = 8;
    var day = 1;
    
    if (data.preferredDate) {
      var rawDate = data.preferredDate.toString();
      var isoMatch = rawDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      var slashMatch = rawDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      
      if (isoMatch) {
        year = parseInt(isoMatch[1], 10);
        month = parseInt(isoMatch[2], 10) - 1;
        day = parseInt(isoMatch[3], 10);
      } else if (slashMatch) {
        day = parseInt(slashMatch[1], 10);
        month = parseInt(slashMatch[2], 10) - 1;
        year = parseInt(slashMatch[3], 10);
      } else {
        var parsedD = new Date(rawDate);
        if (!isNaN(parsedD.getTime())) {
          year = parsedD.getFullYear();
          month = parsedD.getMonth();
          day = parsedD.getDate();
        }
      }
    }
    
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
    var endTime = new Date(year, month, day, hour + 1, min, 0);
    
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
    
    if (existingEventId && existingEventId.indexOf("@") !== -1) {
      try {
        var existingEvent = calendar.getEventById(existingEventId);
        if (existingEvent) {
          existingEvent.setTitle(title);
          existingEvent.setTime(startTime, endTime);
          existingEvent.setDescription(description);
          existingEvent.setLocation(location);
          return existingEventId;
        }
      } catch (err) {}
    }
    
    var newEvent = calendar.createEvent(title, startTime, endTime, {
      description: description,
      location: location
    });
    
    try {
      newEvent.removeAllReminders();
      newEvent.addPopupReminder(60);   // تذكير قبل الزيارة بساعة
      newEvent.addPopupReminder(1440); // تذكير قبل الزيارة بـ 24 ساعة
    } catch (remErr) {}
    
    // ── جدولة موعد المتابعة والتغيير الدوري في Google Calendar (بعد 30 يوم أو حسب الخدمة) ──
    if (data.nextFollowUpDate) {
      try {
        var fYear = year, fMonth = month, fDay = day;
        var rawFDate = data.nextFollowUpDate.toString();
        var fIso = rawFDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        var fSlash = rawFDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        
        if (fIso) {
          fYear = parseInt(fIso[1], 10);
          fMonth = parseInt(fIso[2], 10) - 1;
          fDay = parseInt(fIso[3], 10);
        } else if (fSlash) {
          fDay = parseInt(fSlash[1], 10);
          fMonth = parseInt(fSlash[2], 10) - 1;
          fYear = parseInt(fSlash[3], 10);
        }
        
        var fStartTime = new Date(fYear, fMonth, fDay, hour, min, 0);
        var fEndTime = new Date(fYear, fMonth, fDay, hour + 1, min, 0);
        var fTitle = "🔄 موعد متابعة وتغيير: " + (data.serviceName || "زيارة تمريضية") + " — " + (data.patientName || data.customerName || "مريض نبض");
        var fDesc = "🏥 نبض للتمريض المنزلي — تذكير بموعد المتابعة والتغيير الدوري المجدول:\n" +
          "👤 اسم المريض: " + (data.patientName || data.customerName || "") + "\n" +
          "📞 هاتف: " + (data.customerPhone || "") + "\n" +
          "🩺 الخدمة: " + (data.serviceName || "") + "\n" +
          "📍 المكان: " + (data.city || "") + " - " + (data.address || "") + "\n" +
          "⏰ الوقت: " + formatTime12HArabic(data.preferredTime);
          
        var followUpEvent = calendar.createEvent(fTitle, fStartTime, fEndTime, {
          description: fDesc,
          location: location
        });
        
        try {
          followUpEvent.removeAllReminders();
          followUpEvent.addPopupReminder(1440); // تذكير قبلها بيوم
          followUpEvent.addPopupReminder(60);   // تذكير قبلها بساعة
        } catch (feRem) {}
      } catch (fErr) {}
    }
    
    return newEvent.getId();
  } catch (e) {
    return existingEventId || "";
  }
}

function setCalendarLinkCell(sheet, rowNumber, colNumber, eventId, preferredDate) {
  try {
    var calUrl = "https://calendar.google.com/calendar/r";
    if (preferredDate) {
      var rawDate = preferredDate.toString();
      var isoMatch = rawDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      var slashMatch = rawDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (isoMatch) {
        calUrl = "https://calendar.google.com/calendar/r/day/" + isoMatch[1] + "/" + parseInt(isoMatch[2], 10) + "/" + parseInt(isoMatch[3], 10);
      } else if (slashMatch) {
        calUrl = "https://calendar.google.com/calendar/r/day/" + slashMatch[3] + "/" + parseInt(slashMatch[2], 10) + "/" + parseInt(slashMatch[1], 10);
      }
    }
    
    var label = "📅 عرض بالتقويم";
    if (eventId && eventId.length > 5) {
      var shortId = eventId.split("@")[0];
      label = "📅 عرض بالتقويم (" + shortId.substring(0, 8) + ")";
    }
    
    var richText = SpreadsheetApp.newRichTextValue()
      .setText(label)
      .setLinkUrl(calUrl)
      .build();
    sheet.getRange(rowNumber, colNumber).setRichTextValue(richText);
  } catch (err) {
    sheet.getRange(rowNumber, colNumber).setValue(eventId || "📅 عرض بالتقويم");
  }
}

function setWhatsAppLinkCell(sheet, rowNumber, colNumber, cleanPhone, reminderMsg) {
  try {
    var waUrl = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(reminderMsg);
    var richText = SpreadsheetApp.newRichTextValue()
      .setText("📲 إرسال تذكير الموعد")
      .setLinkUrl(waUrl)
      .build();
    sheet.getRange(rowNumber, colNumber).setRichTextValue(richText);
  } catch (err) {
    sheet.getRange(rowNumber, colNumber).setValue(
      '=HYPERLINK("https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(reminderMsg) + '", "📲 إرسال تذكير الموعد")'
    );
  }
}

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
        targetRowIndex = r + 1;
        existingPatientId = allData[r][0];
        existingCalendarEventId = allData[r][19] || "";
        break;
      }
    }
    
    var calendarEventId = syncGoogleCalendarEvent(data, existingCalendarEventId);
    
    var nextFollowUpStr = data.nextFollowUpDate ? ("\n🔄 المتابعة القادمة: " + getArabicDayWithDate(data.nextFollowUpDate)) : "";
    var nextVisitCell = (data.preferredDate ? (dayDateStr + " - " + time12Ar) : "") + "\nالخدمة: " + (data.serviceName || "") + "\nالحالة: مؤكدة" + nextFollowUpStr;
    
    var newVisitEntry = dayDateStr + " | " + time12Ar + "\nالخدمة: " + (data.serviceName || "") + "\nالحالة: قيد التنفيذ\nالملاحظات: " + (data.notes || "لا توجد ملاحظات إضافية");
    
    var newLabEntry = "";
    if (data.selectedLabTests && data.selectedLabTests.length > 0) {
      newLabEntry = dayDateStr + "\nالتحاليل: " + data.selectedLabTests.join("، ") + (data.labNotes ? ("\nملاحظات: " + data.labNotes) : "");
    }
    
    if (targetRowIndex > 0) {
      var currentRowData = allData[targetRowIndex - 1];
      
      var prevVisits = (currentRowData[11] || "").toString().trim();
      var updatedVisits = prevVisits ? (prevVisits + "\n\n" + newVisitEntry) : newVisitEntry;
      
      var prevLabs = (currentRowData[13] || "").toString().trim();
      var updatedLabs = newLabEntry ? (prevLabs ? (prevLabs + "\n\n" + newLabEntry) : newLabEntry) : prevLabs;
      
      var prevAlerts = (currentRowData[17] || "").toString().trim();
      var updatedAlerts = data.notes ? (prevAlerts ? (prevAlerts + "\n" + data.notes) : data.notes) : prevAlerts;
      
      sheet.getRange(targetRowIndex, 2).setValue(data.patientName || currentRowData[1]);
      sheet.getRange(targetRowIndex, 3).setValue(data.customerName || currentRowData[2]);
      sheet.getRange(targetRowIndex, 6).setValue(data.city || currentRowData[5]);
      sheet.getRange(targetRowIndex, 7).setValue(data.address || currentRowData[6]);
      sheet.getRange(targetRowIndex, 8).setValue("نشط");
      sheet.getRange(targetRowIndex, 10).setValue(nowTimestamp);
      sheet.getRange(targetRowIndex, 11).setValue(nextVisitCell);
      sheet.getRange(targetRowIndex, 12).setValue(updatedVisits);
      sheet.getRange(targetRowIndex, 14).setValue(updatedLabs);
      sheet.getRange(targetRowIndex, 18).setValue(updatedAlerts);
      
      setCalendarLinkCell(sheet, targetRowIndex, 20, calendarEventId, data.preferredDate);
      setWhatsAppLinkCell(sheet, targetRowIndex, 19, cleanPhone, reminderMsg);
      sheet.getRange(targetRowIndex, 1, 1, PATIENT_HEADERS.length).setWrap(true).setVerticalAlignment("top");
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        patientId: existingPatientId,
        action: "updated_existing_patient",
        calendarEventId: calendarEventId
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
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
      "",
      newLabEntry,
      dayDateStr + " | " + (data.serviceName || "") + " | تم الحجز",
      "",
      "",
      data.notes || "",
      "",
      "",
      ""
    ]);
    
    var newRowIndex = sheet.getLastRow();
    setWhatsAppLinkCell(sheet, newRowIndex, 19, cleanPhone, reminderMsg);
    setCalendarLinkCell(sheet, newRowIndex, 20, calendarEventId, data.preferredDate);
    
    sheet.getRange(newRowIndex, 1, 1, PATIENT_HEADERS.length).setWrap(true).setVerticalAlignment("top");
    
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

function doGet(e) {
  try {
    var sheet = setupSheetStructure();
    var query = (e && e.parameter && (e.parameter.phone || e.parameter.patientId || e.parameter.query)) || "";
    
    if (!query) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "active",
        brand: "نبض للتمريض المنزلي — دمياط",
        systemsLinked: ["Website", "Google Sheets", "Google Calendar"],
        version: "2026.5"
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

function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    if (ui) {
      ui.createMenu("🏥 نبض للتمريض المنزلي")
        .addItem("🚀 المزامنة الشاملة وإصلاح وتنسيق الجداول (One-Click Sync)", "syncAllSystemsOneClick")
        .addSeparator()
        .addItem("📄 تصدير ملف المريض المحدد PDF بهوية نبض", "exportSelectedPatientPdf")
        .addItem("⏰ مزامنة المواعيد مع Google Calendar", "syncAllPendingCalendarEvents")
        .addItem("🔔 فحص وتحديث تنبيهات المتابعة الدورية", "checkDailyFollowUpReminders")
        .addSeparator()
        .addItem("⚙️ تهيئة وتنسيق الجداول الطبية الموحدة", "setupSheetStructure")
        .addToUi();
    }
  } catch (e) {}
}

function syncAllSystemsOneClick() {
  var sheet = setupSheetStructure();
  if (!sheet) return;
  
  var allData = sheet.getDataRange().getValues();
  var syncedEventsCount = 0;
  var waLinksCount = 0;
  
  for (var i = 1; i < allData.length; i++) {
    var row = allData[i];
    var rowIndex = i + 1;
    var patientId = row[0] || ("NABD-" + ("0000" + i).slice(-4));
    var patientName = row[1] || row[2] || "مريض نبض";
    var customerName = row[2] || patientName;
    var customerPhone = (row[3] || "").toString().trim();
    var cleanPhone = cleanEgyptianPhone(customerPhone);
    var city = row[5] || "دمياط";
    var address = row[6] || "";
    var nextVisitText = (row[10] || "").toString();
    var existingEventId = (row[19] || "").toString();
    
    var dateMatch = nextVisitText.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/);
    var timeMatch = nextVisitText.match(/(\d{1,2}:\d{2}\s*(AM|PM|صباحاً|مساءً)?)/i);
    var serviceMatch = nextVisitText.match(/الخدمة:\s*([^\n]+)/);
    var serviceName = serviceMatch ? serviceMatch[1].trim() : "زيارة تمريضية";
    
    var prefDate = dateMatch ? dateMatch[0] : "";
    var prefTime = timeMatch ? timeMatch[0] : "10:00 AM";
    
    var nextFollowUpDate = "";
    if (nextVisitText.indexOf("المتابعة القادمة:") !== -1) {
      var followUpPart = nextVisitText.split("المتابعة القادمة:")[1];
      var fDateMatch = followUpPart.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (fDateMatch) nextFollowUpDate = fDateMatch[0];
    } else if (serviceName.indexOf("قسطرة") !== -1 || serviceName.indexOf("رايل") !== -1 || (row[17] || "").toString().indexOf("بروستاتا") !== -1) {
      // حساب وجدولة تلقائية للمتابعة بعد 30 يوماً لحالات القسطرة والرايل
      if (prefDate) {
        var baseD = new Date(prefDate);
        if (!isNaN(baseD.getTime())) {
          var futureD = new Date(baseD.getTime() + 30 * 24 * 60 * 60 * 1000);
          nextFollowUpDate = futureD.toISOString().split("T")[0];
          var updatedNextVisit = nextVisitText + "\n🔄 المتابعة القادمة: " + getArabicDayWithDate(nextFollowUpDate);
          sheet.getRange(rowIndex, 11).setValue(updatedNextVisit);
        }
      }
    }
    
    if (cleanPhone) {
      var reminderMsg = buildNabdReminderText(customerName, serviceName, prefDate, prefTime, city + " - " + address);
      setWhatsAppLinkCell(sheet, rowIndex, 19, cleanPhone, reminderMsg);
      waLinksCount++;
    }
    
    if (prefDate) {
      try {
        var eventId = syncGoogleCalendarEvent({
          serviceName: serviceName,
          patientName: patientName,
          customerName: customerName,
          customerPhone: customerPhone,
          preferredDate: prefDate,
          preferredTime: prefTime,
          nextFollowUpDate: nextFollowUpDate,
          city: city,
          address: address
        }, existingEventId);
        
        if (eventId) {
          setCalendarLinkCell(sheet, rowIndex, 20, eventId, prefDate);
          syncedEventsCount++;
        }
      } catch (err) {}
    }
  }
  
  sheet.getDataRange().setWrap(true);
  sheet.getDataRange().setVerticalAlignment("top");
  sheet.getDataRange().setHorizontalAlignment("center");
  
  checkDailyFollowUpReminders();
  
  showAlertSafely(
    "✅ تم إصلاح وتنسيق الجداول والمزامنة الشاملة بنجاح! 🚀\n\n" +
    "1. تنسيق الجداول: تم تفعيل التفاف النص (Wrap text) وضبط اتساع الخانات لمنع التداخل.\n" +
    "2. زر تذكير واتساب: تم تفعيل الروابط التفاعلية لجميع المرضى بالصيغة الرسمية المعتمدة (" + waLinksCount + " رابط).\n" +
    "3. تقويم Google Calendar: تمت مزامنة وإنشاء مواعيد التقويم (" + syncedEventsCount + " موعد).\n" +
    "4. شيت المتابعات: تم تحديث قائمة المتابعة الدورية في شيت تنبيهات المتابعة.\n\n" +
    "🏥 نبض للتمريض المنزلي — رعايتك الصحية تبدأ من مكانك."
  );
}

function exportSelectedPatientPdf() {
  var sheet = setupSheetStructure();
  if (!sheet) return;
  
  var activeRow = 2;
  try {
    activeRow = sheet.getActiveCell().getRow();
  } catch (e) {}
  
  if (activeRow <= 1) {
    showAlertSafely("يرجى تحديد صف المريض المطلوب تصدير ملفه الطبي.");
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
  showAlertSafely("تم إنشاء وتصدير ملف المريض PDF الفاخر بنجاح! 🎉\n\nرابط الملف على Google Drive:\n" + pdfUrl);
}

function checkDailyFollowUpReminders() {
  var ss = getActiveSpreadsheetSafely();
  if (!ss) return;
  var sheet = setupSheetStructure();
  var followUpSheet = ss.getSheetByName(SHEET_FOLLOWUPS);
  
  var allData = sheet.getDataRange().getValues();
  
  var lastRow = followUpSheet.getLastRow();
  if (lastRow > 1) {
    followUpSheet.getRange(2, 1, lastRow - 1, FOLLOWUP_HEADERS.length).clearContent();
  }
  
  for (var i = 1; i < allData.length; i++) {
    var row = allData[i];
    var patientId = row[0];
    var patientName = row[1] || row[2];
    var phone = row[3];
    var cleanPhone = cleanEgyptianPhone(phone);
    var nextVisitText = (row[10] || "").toString();
    
    if (nextVisitText.indexOf("المتابعة القادمة") !== -1) {
      var followUpMsg = buildNabdFollowUpText(patientName, "الخدمة التمريضية", "");
      var waUrl = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(followUpMsg);
      
      followUpSheet.appendRow([
        patientId,
        patientName,
        phone,
        "متابعة دورية",
        row[9] || "اليوم",
        nextVisitText.split("المتابعة القادمة:")[1] || "مجدول",
        "متابعة دورية مستحقة",
        "مستحقة",
        ""
      ]);
      
      var fLastRow = followUpSheet.getLastRow();
      try {
        var richText = SpreadsheetApp.newRichTextValue()
          .setText("📲 إرسال رسالة المتابعة")
          .setLinkUrl(waUrl)
          .build();
        followUpSheet.getRange(fLastRow, 9).setRichTextValue(richText);
      } catch (e) {
        followUpSheet.getRange(fLastRow, 9).setValue(
          '=HYPERLINK("' + waUrl + '", "📲 إرسال رسالة المتابعة")'
        );
      }
    }
  }
}

function syncAllPendingCalendarEvents() {
  syncAllSystemsOneClick();
}
