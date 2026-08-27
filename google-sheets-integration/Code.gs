/**
 * Google Apps Script — نبض للتمريض المنزلي
 * 1. تسجيل الحجوزات والملفات الطبية
 * 2. تذكير المريض بموعد الزيارة عبر واتساب بنقرة واحدة
 * 3. بوابة استعلام المريض عن ملفه الطبي وقياساته وتحاليله
 */

// إعداد عناوين الجدول
var HEADERS = [
  "رقم الحجز",                // 1 (A)
  "تاريخ وساعة الطلب",         // 2 (B)
  "اسم الخدمة",               // 3 (C)
  "اسم العميل",               // 4 (D)
  "هاتف العميل",              // 5 (E)
  "واتساب العميل",            // 6 (F)
  "اسم المريض",               // 7 (G)
  "المحافظة",                 // 8 (H)
  "المدينة / المنطقة",         // 9 (I)
  "العنوان",                  // 10 (J)
  "علامة مميزة",              // 11 (K)
  "تاريخ الموعد المطلوب",     // 12 (L)
  "وقت الموعد المطلوب",       // 13 (M)
  "ملاحظات العميل",           // 14 (N)
  "حالة الطلب",               // 15 (O)
  "📲 تذكير واتساب (اضغط هنا)", // 16 (P)
  "ضغط الدم",                 // 17 (Q)
  "السكر mg/dL",              // 18 (R)
  "الأكسجين SpO2%",           // 19 (S)
  "النبض bpm",                // 20 (T)
  "الحرارة °C",               // 21 (U)
  "موعد الزيارة القادمة",     // 22 (V)
  "رابط التحاليل والملفات (Drive)", // 23 (W)
  "توصيات وملاحظات التمريض"    // 24 (X)
];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // إنشاء العناوين تلقائياً إذا كان الشيت فارغاً أو جديداً
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground("#1B2B6B");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 40);
      sheet.setFrozenRows(1);
    }
    
    var nextRow = sheet.getLastRow() + 1;
    var phone = data.customerPhone || "";
    // تنظيف رقم الهاتف لمصر
    var cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.indexOf("0") === 0) {
      cleanPhone = "2" + cleanPhone;
    } else if (cleanPhone.length === 10) {
      cleanPhone = "20" + cleanPhone;
    }

    // رسالة التذكير بالموعد بنقرة واحدة عبر واتساب
    var reminderMsg = "مرحباً أستاذ " + (data.customerName || "") + "، نود تذكيرك بموعد زيارة نبض للتمريض المنزلي لخدمة (" + (data.serviceName || "") + ") يوم " + (data.preferredDate || "") + " في تمام الساعة " + (data.preferredTime || "") + ". نتمنى لك دوام الصحة والعافية 💙 نبض للتمريض المنزلي دمياط.";
    var whatsappReminderFormula = '=HYPERLINK("https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(reminderMsg) + '", "📲 إرسال تذكير واتساب")';

    // إضافة صف الحجز
    sheet.appendRow([
      data.bookingId || "",
      data.timestamp || new Date().toLocaleString("ar-EG"),
      data.serviceName || "",
      data.customerName || "",
      data.customerPhone || "",
      data.whatsapp || "",
      data.patientName || "",
      data.governorate || "دمياط",
      data.city || "",
      data.address || "",
      data.landmark || "",
      data.preferredDate || "",
      data.preferredTime || "",
      data.notes || "",
      data.status || "قيد الانتظار",
      whatsappReminderFormula,
      data.bloodPressure || "",
      data.bloodSugar || "",
      data.oxygen || "",
      data.pulse || "",
      data.temperature || "",
      data.nextVisit || "",
      data.medicalFilesUrl || "",
      data.medicalNotes || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success", bookingId: data.bookingId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet: يستقبل استعلامات الموقع (مثل البحث عن ملف المريض برقم الهاتف)
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "";
    var query = (e && e.parameter && (e.parameter.phone || e.parameter.query || e.parameter.bookingId)) || "";

    if (action === "getPatient" || action === "search") {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, message: "لا توجد بيانات مسجلة بعد" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var cleanQuery = query.toString().replace(/[^0-9a-zA-Z]/g, "").toLowerCase();
      var patientRows = [];

      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var rowId = (row[0] || "").toString().toLowerCase();
        var rowPhone = (row[4] || "").toString().replace(/[^0-9]/g, "");
        var rowWa = (row[5] || "").toString().replace(/[^0-9]/g, "");

        if (
          (cleanQuery && (rowPhone.indexOf(cleanQuery) !== -1 || cleanQuery.indexOf(rowPhone) !== -1)) ||
          (cleanQuery && (rowWa.indexOf(cleanQuery) !== -1 || cleanQuery.indexOf(rowWa) !== -1)) ||
          (cleanQuery && rowId.indexOf(cleanQuery) !== -1)
        ) {
          patientRows.push({
            bookingId: row[0],
            requestDate: row[1],
            serviceName: row[2],
            customerName: row[3],
            customerPhone: row[4],
            whatsapp: row[5],
            patientName: row[6],
            governorate: row[7],
            city: row[8],
            address: row[9],
            preferredDate: row[11],
            preferredTime: row[12],
            status: row[14],
            vitals: {
              bloodPressure: row[16] || "",
              bloodSugar: row[17] || "",
              oxygen: row[18] || "",
              pulse: row[19] || "",
              temperature: row[20] || ""
            },
            nextVisit: row[21] || "",
            medicalFilesUrl: row[22] || "",
            medicalNotes: row[23] || ""
          });
        }
      }

      if (patientRows.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, message: "لم يتم العثور على سجل بهذا الرقم" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // تجهيز أحدث بيانات للمريض وجمع تاريخ الزيارات
      var latest = patientRows[patientRows.length - 1];
      var visits = patientRows.map(function(r) {
        return {
          bookingId: r.bookingId,
          serviceName: r.serviceName,
          date: r.preferredDate || r.requestDate,
          time: r.preferredTime || "",
          status: r.status,
          city: r.city
        };
      });

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        patient: {
          name: latest.patientName || latest.customerName,
          customerName: latest.customerName,
          phone: latest.customerPhone,
          whatsapp: latest.whatsapp,
          city: latest.city,
          address: latest.address,
          nextVisit: latest.nextVisit || (latest.preferredDate ? (latest.preferredDate + " " + latest.preferredTime) : ""),
          nextService: latest.serviceName,
          vitals: latest.vitals,
          medicalFilesUrl: latest.medicalFilesUrl,
          medicalNotes: latest.medicalNotes,
          visits: visits
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "active",
      service: "Nabd Home Nursing API",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
