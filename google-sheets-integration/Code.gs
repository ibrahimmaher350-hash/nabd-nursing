/**
 * Google Apps Script — نبض للتمريض المنزلي
 * حفظ طلبات الحجز تلقائياً في Google Sheets
 * 
 * طريقة التركيب (في دقيقة واحدة):
 * 1. افتح جدول بيانات Google جديد (Google Sheets).
 * 2. اضغط من القائمة العلوية على: Extensions (الإضافات) -> Apps Script.
 * 3. امسح أي كود موجود والصق هذا الكود كاملاً.
 * 4. اضغط على Deploy (نشر) -> New deployment (نشر جديد).
 * 5. اختر النوع: Web app (تطبيق ويب).
 * 6. في خانة "Who has access" (من يملك حق الوصول) اختر: "Anyone" (أي شخص).
 * 7. اضغط Deploy وانسخ الرابط الناتج (Web app URL).
 * 8. ضع الرابط في متغيرات بيئة Vercel أو .env باسم:
 *    GOOGLE_SHEETS_WEBHOOK_URL=رابط_تطبيق_الويب_هنا
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // إنشاء العناوين تلقائياً إذا كان الشيت فارغاً
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "رقم الحجز",
        "تاريخ وساعة الطلب",
        "اسم الخدمة",
        "اسم العميل",
        "هاتف العميل",
        "واتساب العميل",
        "اسم المريض",
        "المحافظة",
        "المدينة / المنطقة",
        "العنوان",
        "علامة مميزة",
        "تاريخ الموعد المطلوب",
        "وقت الموعد المطلوب",
        "ملاحظات",
        "الحالة"
      ]);
      
      // تنسيق شريط العناوين
      var headerRange = sheet.getRange(1, 1, 1, 15);
      headerRange.setBackground("#1B2B6B");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // إضافة صف الحجز الجديد
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
      data.status || "قيد الانتظار"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Sheets Webhook for Nabd Nursing is active.");
}
