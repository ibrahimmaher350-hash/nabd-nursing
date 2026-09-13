/**
 * ==============================================================================
 * منصة نبض للتمريض المنزلي — كود الربط التلقائي لجدول جوجل (Google Apps Script)
 * ==============================================================================
 * 
 * هذا الكود يوضع في جدول جوجل الخاص بالعيادة:
 * (امتدادات / Extensions -> تطبيقات البرمجة / Apps Script -> الصق هذا الكود -> حفظ)
 * 
 * وظيفته:
 * بمجرد أن يقوم صاحب العيادة بتعديل أي خلية في أي ورقة من الأوراق الخمسة:
 * (الحجوزات، ملفات المرضى، بنك الدم، التذكيرات، الإعدادات)
 * يقوم هذا السكربت بإرسال التعديل فوراً للموقع السحابي وتحديث قاعدة البيانات وتقويم جوجل تلقائياً.
 */

function onEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var tabName = sheet.getName();
  var rowNumber = e.range.getRow();

  // تجاهل الصف الأول (عناوين الأعمدة)
  if (rowNumber === 1) return;

  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return;

  // قراءة كامل بيانات الصف الذي تم تعديله
  var rowData = sheet.getRange(rowNumber, 1, 1, lastCol).getValues()[0];

  var webhookUrl = "https://nabd-nursing.vercel.app/api/sync/sheets";

  var payload = {
    action: "sheet_cell_edited",
    tabName: tabName,
    rowNumber: rowNumber,
    editedCol: e.range.getColumn(),
    newValue: e.value,
    rowData: rowData
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    UrlFetchApp.fetch(webhookUrl, options);
  } catch (err) {
    Logger.log("خطأ أثناء المزامنة: " + err);
  }
}

/**
 * دالة تجريبية لاختبار الاتصال
 */
function testConnection() {
  var response = UrlFetchApp.fetch("https://nabd-nursing.vercel.app/api/sync/sheets", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ action: "ping" }),
    muteHttpExceptions: true
  });
  Logger.log("نتيجة الاختبار: " + response.getContentText());
}
