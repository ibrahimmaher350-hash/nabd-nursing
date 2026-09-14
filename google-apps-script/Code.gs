/**
 * ==============================================================================
 * منصة نبض للتمريض المنزلي — كود التجهيز والمزامنة التلقائية (Google Apps Script)
 * ==============================================================================
 * 
 * هذا الكود يوضع في جدول جوجل الخاص بالعيادة:
 * (الإضافات Extensions -> تطبيقات البرمجة Apps Script -> الصق هذا الكود -> حفظ 💾)
 */

/**
 * 1. دالة تظهر قائمة علوية مخصصة في جدول جوجل بمجرد فتحه
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('نبض للتمريض المنزلي 🩺')
    .addItem('⚙️ إنشاء وتنسيق الخانات والتابات الخمسة تلقائياً', 'setupSheet')
    .addSeparator()
    .addItem('🔄 اختبار الاتصال بالموقع', 'testConnection')
    .addToUi();
}

/**
 * 2. دالة بناء وتنسيق الخانات والتابات الخمسة بالكامل بنقرة زر واحدة
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var tabsConfig = [
    {
      name: 'الحجوزات',
      color: '#07132B', // كحلي نبض
      headers: [
        'رقم_الحجز',
        'اسم_المريض',
        'الهاتف',
        'البريد',
        'التاريخ',
        'الوقت',
        'نوع_الزيارة',
        'الحالة',
        'ملاحظات',
        'رابط_الموعد',
        'آخر_تحديث'
      ]
    },
    {
      name: 'ملفات المرضى',
      color: '#0D9488', // تيل / زمردي
      headers: [
        'رقم_المريض',
        'الاسم_الكامل',
        'الهاتف',
        'البريد',
        'تاريخ_الميلاد',
        'الجنس',
        'فصيلة_الدم',
        'الحساسية',
        'أمراض_مزمنة',
        'أدوية_حالية',
        'آخر_زيارة',
        'عدد_الزيارات',
        'ملاحظات_طبية',
        'تاريخ_إنشاء_الملف'
      ]
    },
    {
      name: 'بنك الدم',
      color: '#DC2626', // أحمر دم
      headers: [
        'رقم_الطلب',
        'اسم_المتبرع/المحتاج',
        'الهاتف',
        'فصيلة_الدم',
        'النوع_(طلب/تبرع)',
        'الموقع',
        'الحالة',
        'التاريخ',
        'ملاحظات'
      ]
    },
    {
      name: 'التذكيرات',
      color: '#D97706', // عنبري / ذهبي
      headers: [
        'رقم_التذكير',
        'رقم_الحجز',
        'اسم_المريض',
        'البريد',
        'نوع_التذكير_(24h/1h)',
        'موعد_الإرسال',
        'الحالة_(pending/sent/failed)',
        'وقت_الإرسال_الفعلي',
        'خطأ_(إن_وجد)'
      ]
    },
    {
      name: 'الإعدادات',
      color: '#475569', // رمادي داكن
      headers: [
        'المفتاح',
        'القيمة'
      ],
      initialData: [
        ['ساعات_العمل_بداية', '09:00'],
        ['ساعات_العمل_نهاية', '21:00'],
        ['تذكير_24_ساعة', 'true'],
        ['تذكير_1_ساعة', 'true'],
        ['بريد_المالك', 'ibrahim.maher350@gmail.com'],
        ['اسم_العيادة', 'نبض للتمريض المنزلي'],
        ['المنطقة_الزمنية', 'Africa/Cairo'],
        ['مزامنة_تلقائية', 'true']
      ]
    }
  ];

  tabsConfig.forEach(function(config) {
    var sheet = ss.getSheetByName(config.name);
    if (!sheet) {
      sheet = ss.insertSheet(config.name);
    }

    // ضبط اتجاه الورقة من اليمين لليسار (RTL)
    sheet.setRightToLeft(true);

    // كتابة سطر العناوين (Headers)
    var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setValues([config.headers]);
    headerRange.setFontWeight('bold');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setBackground(config.color);
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 38);

    // تجميد الصف الأول ليظل ظاهراً أثناء التمرير
    sheet.setFrozenRows(1);

    // تعبئة البيانات الأولية لتاب الإعدادات إن وجدت
    if (config.initialData && sheet.getLastRow() <= 1) {
      var dataRange = sheet.getRange(2, 1, config.initialData.length, 2);
      dataRange.setValues(config.initialData);
      dataRange.setHorizontalAlignment('center');
      sheet.getRange(2, 1, config.initialData.length, 1).setFontWeight('bold');
    }

    // ضبط تلقائي لعرض الأعمدة
    for (var col = 1; col <= config.headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  });

  // حذف "الورقة1" أو "Sheet1" الافتراضية الفارغة إن وجدت
  var defaultSheet1 = ss.getSheetByName('الورقة1') || ss.getSheetByName('Sheet1');
  if (defaultSheet1 && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet1);
    } catch(e) {}
  }

  // تنشيط تاب الحجوزات كأول تاب
  var firstTab = ss.getSheetByName('الحجوزات');
  if (firstTab) {
    ss.setActiveSheet(firstTab);
  }

  ui.alert('تم بنجاح! 🎉\nتم إنشاء وتنسيق كافة الخانات والتابات الخمسة بنجاح في جدولك.');
}

/**
 * 3. دالة التقاط أي تعديل باليد في الشيت وإرساله فوراً للموقع
 */
function onEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var tabName = sheet.getName();
  var rowNumber = e.range.getRow();

  // تجاهل سطر العناوين
  if (rowNumber === 1) return;

  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return;

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
 * 4. دالة اختبار الاتصال
 */
function testConnection() {
  var ui = SpreadsheetApp.getUi();
  try {
    var response = UrlFetchApp.fetch("https://nabd-nursing.vercel.app/api/sync/sheets", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ action: "ping" }),
      muteHttpExceptions: true
    });
    ui.alert('حالة الاتصال بموقع نبض:\n' + response.getContentText());
  } catch (err) {
    ui.alert('تعذر الاتصال بالموقع: ' + err);
  }
}
