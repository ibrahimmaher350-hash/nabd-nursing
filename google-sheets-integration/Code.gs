/**
 * Google Apps Script — نبض للتمريض المنزلي (Nabd Home Nursing)
 * ─────────────────────────────────────────────────────────────
 * نظام الملف الطبي الشامل (Multi-Sheet Normalized Database)
 *
 * 1. واجهة خلفية (API) تعمل مع تطبيق الموقع.
 * 2. جداول منفصلة ومترابطة بـ (patient_id).
 * 3. إنشاء روابط Patient View مشفرة بـ public_token للقراءة فقط.
 * 4. إنشاء موعد تلقائي في تقويم جوجل عند إضافة زيارة/موعد.
 */

var SHEETS = {
  PATIENTS: "Patients",
  VISITS: "Visits",
  VITALS: "VitalSigns",
  MEDICATIONS: "Medications",
  LABS: "LabResults",
  INSTRUCTIONS: "Instructions",
  DOCUMENTS: "Documents",
  SETTINGS: "Settings"
};

var HEADERS = {
  [SHEETS.PATIENTS]: ["patient_id", "public_token", "patient_name", "phone", "whatsapp", "city", "address", "status", "registration_date", "notes", "calendar_event_id_next_visit"],
  [SHEETS.VISITS]: ["visit_id", "patient_id", "date", "time", "service", "status", "nurse", "notes", "calendar_event_id"],
  [SHEETS.VITALS]: ["vital_id", "patient_id", "date", "time", "blood_pressure", "pulse", "spo2", "temperature", "respiratory_rate", "blood_glucose", "weight", "notes"],
  [SHEETS.MEDICATIONS]: ["medication_id", "patient_id", "medicine_name", "dose", "route", "frequency", "start_date", "end_date", "notes"],
  [SHEETS.LABS]: ["lab_id", "patient_id", "date", "test_name", "result", "unit", "reference_range", "notes", "file_url"],
  [SHEETS.INSTRUCTIONS]: ["instruction_id", "patient_id", "date", "instruction", "active"],
  [SHEETS.DOCUMENTS]: ["document_id", "patient_id", "document_type", "title", "file_url", "date"],
  [SHEETS.SETTINGS]: ["key", "value"]
};

/**
 * دالة التهيئة الأولية: يتم تشغيلها مرة واحدة لبناء الهيكل
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;

  for (var sheetName in HEADERS) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Set headers if the sheet is empty or headers are missing
    var currentHeaders = sheet.getRange(1, 1, 1, HEADERS[sheetName].length).getValues()[0];
    if (currentHeaders[0] === "" || currentHeaders[0] === undefined) {
      sheet.getRange(1, 1, 1, HEADERS[sheetName].length).setValues([HEADERS[sheetName]]);
      sheet.getRange(1, 1, 1, HEADERS[sheetName].length).setFontWeight("bold").setBackground("#1B2B6B").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
  }
}

/**
 * دالة لترحيل البيانات من الشيت القديم (الملفات الطبية للمرضى) إلى النظام الجديد
 */
function migrateOldData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var oldSheet = ss.getSheetByName("الملفات الطبية للمرضى");
  var newPatientsSheet = ss.getSheetByName(SHEETS.PATIENTS);
  
  if (!oldSheet) {
    showAlertSafely("الشيت القديم 'الملفات الطبية للمرضى' غير موجود!");
    return;
  }
  
  if (!newPatientsSheet) {
    setupDatabase();
    newPatientsSheet = ss.getSheetByName(SHEETS.PATIENTS);
  }
  
  var oldData = oldSheet.getDataRange().getValues();
  if (oldData.length <= 1) {
    showAlertSafely("الشيت القديم فارغ!");
    return;
  }
  
  var migratedCount = 0;
  for (var i = 1; i < oldData.length; i++) {
    var row = oldData[i];
    var oldId = row[0]; // Patient ID
    var oldName = row[1]; // Name
    var oldPhone = row[3]; // Phone
    
    // Check if patient already migrated
    var existing = getRecordsByField(SHEETS.PATIENTS, "patient_id", oldId);
    if (existing.length === 0 && oldId && oldName) {
      var publicToken = Utilities.getUuid().replace(/-/g, '').substring(0, 16);
      
      var newPatient = {
        patient_id: oldId,
        public_token: publicToken,
        patient_name: oldName,
        phone: oldPhone || "",
        whatsapp: row[4] || oldPhone || "",
        city: row[5] || "دمياط",
        address: row[6] || "",
        status: row[7] || "نشط",
        registration_date: row[8] || Utilities.formatDate(new Date(), "GMT+2", "yyyy-MM-dd"),
        notes: "تم ترحيله من النظام القديم",
        calendar_event_id_next_visit: ""
      };
      
      insertRecord(SHEETS.PATIENTS, newPatient);
      migratedCount++;
    }
  }
  
  showAlertSafely("تم بنجاح ترحيل " + migratedCount + " مريض إلى النظام الجديد.");
}

function showAlertSafely(message) {
  try {
    var ui = SpreadsheetApp.getUi();
    if (ui) {
      ui.alert(message);
      return;
    }
  } catch (e) {}
  Logger.log(message);
}

/**
 * دالة معالجة طلبات الـ HTTP GET & POST
 */
function doGet(e) {
  var action = e.parameter.action;
  
  if (action === "getPatientByToken") {
    return jsonResponse(getPatientByToken(e.parameter.token));
  } else if (action === "getAllPatients") {
    return jsonResponse(getAllPatients());
  } else if (action === "getPatientById") {
    return jsonResponse(getPatientById(e.parameter.patient_id));
  }
  
  return jsonResponse({ success: false, message: "Invalid action" });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;

    switch (action) {
      case 'create_patient':
        return jsonResponse(createPatient(payload.data));
      case 'update_patient':
        return jsonResponse(updatePatient(payload.data));
      case 'delete_patient':
        return jsonResponse(deletePatient(payload.patient_id));
      case 'add_visit':
        return jsonResponse(addVisit(payload.data));
      case 'add_vital':
        return jsonResponse(addRecord(SHEETS.VITALS, payload.data));
      case 'add_medication':
        return jsonResponse(addRecord(SHEETS.MEDICATIONS, payload.data));
      case 'add_instruction':
        return jsonResponse(addRecord(SHEETS.INSTRUCTIONS, payload.data));
      case 'add_lab':
        return jsonResponse(addRecord(SHEETS.LABS, payload.data));
      case 'delete_record':
        return jsonResponse(deleteRecord(payload.sheet, payload.id_field, payload.id_value));
      default:
        return jsonResponse({ success: false, message: "Invalid action" });
    }
  } catch (err) {
    return jsonResponse({ success: false, message: err.message, stack: err.stack });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────
// دوال قراءة البيانات
// ─────────────────────────────────────────────────────────────

function getAllPatients() {
  var patients = getRecords(SHEETS.PATIENTS);
  return { success: true, data: patients };
}

function getPatientByToken(token) {
  if (!token) return { success: false, message: "Token missing" };
  
  var patients = getRecords(SHEETS.PATIENTS);
  var patient = patients.find(p => p.public_token === token);
  
  if (!patient) return { success: false, message: "Patient not found" };
  
  // Fetch related records
  var patientId = patient.patient_id;
  
  return {
    success: true,
    data: {
      patient: patient,
      visits: getRecordsByField(SHEETS.VISITS, "patient_id", patientId),
      vitals: getRecordsByField(SHEETS.VITALS, "patient_id", patientId),
      medications: getRecordsByField(SHEETS.MEDICATIONS, "patient_id", patientId),
      labs: getRecordsByField(SHEETS.LABS, "patient_id", patientId),
      instructions: getRecordsByField(SHEETS.INSTRUCTIONS, "patient_id", patientId),
      documents: getRecordsByField(SHEETS.DOCUMENTS, "patient_id", patientId),
    }
  };
}

function getPatientById(patientId) {
  if (!patientId) return { success: false, message: "Patient ID missing" };
  
  var patients = getRecords(SHEETS.PATIENTS);
  var patient = patients.find(p => p.patient_id === patientId);
  
  if (!patient) return { success: false, message: "Patient not found" };
  
  return {
    success: true,
    data: {
      patient: patient,
      visits: getRecordsByField(SHEETS.VISITS, "patient_id", patientId),
      vitals: getRecordsByField(SHEETS.VITALS, "patient_id", patientId),
      medications: getRecordsByField(SHEETS.MEDICATIONS, "patient_id", patientId),
      labs: getRecordsByField(SHEETS.LABS, "patient_id", patientId),
      instructions: getRecordsByField(SHEETS.INSTRUCTIONS, "patient_id", patientId),
      documents: getRecordsByField(SHEETS.DOCUMENTS, "patient_id", patientId),
    }
  };
}

// ─────────────────────────────────────────────────────────────
// دوال كتابة وتعديل البيانات
// ─────────────────────────────────────────────────────────────

function createPatient(data) {
  var patientId = "NABD-" + Utilities.getUuid().substring(0,8).toUpperCase();
  var publicToken = Utilities.getUuid().replace(/-/g, '').substring(0, 16);
  var dateStr = Utilities.formatDate(new Date(), "GMT+2", "yyyy-MM-dd");
  
  var newPatient = {
    patient_id: patientId,
    public_token: publicToken,
    patient_name: data.patient_name || "بدون اسم",
    phone: data.phone || "",
    whatsapp: data.whatsapp || data.phone || "",
    city: data.city || "دمياط",
    address: data.address || "",
    status: data.status || "نشط",
    registration_date: dateStr,
    notes: data.notes || "",
    calendar_event_id_next_visit: ""
  };
  
  insertRecord(SHEETS.PATIENTS, newPatient);
  
  return { success: true, message: "Patient created successfully", data: newPatient };
}

function updatePatient(data) {
  if (!data.patient_id) return { success: false, message: "patient_id required" };
  
  var updated = updateRecord(SHEETS.PATIENTS, "patient_id", data.patient_id, data);
  if (updated) {
    return { success: true, message: "Patient updated successfully" };
  } else {
    return { success: false, message: "Patient not found" };
  }
}

function deletePatient(patientId) {
  if (!patientId) return { success: false, message: "patient_id required" };
  
  // Delete from all sheets
  var deletedPatient = deleteRecord(SHEETS.PATIENTS, "patient_id", patientId);
  deleteRecordsByField(SHEETS.VISITS, "patient_id", patientId);
  deleteRecordsByField(SHEETS.VITALS, "patient_id", patientId);
  deleteRecordsByField(SHEETS.MEDICATIONS, "patient_id", patientId);
  deleteRecordsByField(SHEETS.LABS, "patient_id", patientId);
  deleteRecordsByField(SHEETS.INSTRUCTIONS, "patient_id", patientId);
  deleteRecordsByField(SHEETS.DOCUMENTS, "patient_id", patientId);
  
  return { success: deletedPatient, message: deletedPatient ? "Patient and all related records deleted" : "Patient not found" };
}

function addVisit(data) {
  var visitId = "VISIT-" + Utilities.getUuid().substring(0,8).toUpperCase();
  var newVisit = {
    visit_id: visitId,
    patient_id: data.patient_id,
    date: data.date,
    time: data.time || "",
    service: data.service || "",
    status: data.status || "مجدولة",
    nurse: data.nurse || "",
    notes: data.notes || "",
    calendar_event_id: ""
  };
  
  // Google Calendar Integration
  if (newVisit.status === "مجدولة" && newVisit.date && newVisit.time) {
    try {
      // Find patient details for calendar event
      var patients = getRecords(SHEETS.PATIENTS);
      var patient = patients.find(p => p.patient_id === data.patient_id);
      var patientName = patient ? patient.patient_name : "مريض غير معروف";
      
      var eventTitle = "موعد تمريض: " + newVisit.service + " — " + patientName;
      var eventDesc = "رقم الملف: " + data.patient_id + "\nالعنوان: " + (patient ? patient.city + " - " + patient.address : "") + "\nرقم التواصل: " + (patient ? patient.phone : "") + "\nالملاحظات: " + newVisit.notes;
      
      // Parse date and time
      // Assume date is YYYY-MM-DD and time is HH:MM in 24h format
      var dateParts = newVisit.date.split("-");
      var timeParts = newVisit.time.split(":");
      
      if (dateParts.length === 3 && timeParts.length >= 2) {
        var startTime = new Date(dateParts[0], parseInt(dateParts[1])-1, dateParts[2], timeParts[0], timeParts[1], 0);
        // Default duration 1 hour
        var endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        
        var calendar = CalendarApp.getDefaultCalendar();
        var event = calendar.createEvent(eventTitle, startTime, endTime, { description: eventDesc });
        newVisit.calendar_event_id = event.getId();
      }
    } catch (e) {
      Logger.log("Calendar creation failed: " + e.message);
    }
  }
  
  insertRecord(SHEETS.VISITS, newVisit);
  
  return { success: true, message: "Visit added successfully", data: newVisit };
}

function addRecord(sheetName, data) {
  var idField = HEADERS[sheetName][0]; // first header is always ID
  var prefix = sheetName.substring(0,3).toUpperCase();
  data[idField] = prefix + "-" + Utilities.getUuid().substring(0,8).toUpperCase();
  
  insertRecord(sheetName, data);
  
  return { success: true, message: "Record added to " + sheetName, data: data };
}

// ─────────────────────────────────────────────────────────────
// دوال قاعدة البيانات المساعدة (Database Helpers)
// ─────────────────────────────────────────────────────────────

function getRecords(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only headers or empty
  
  var headers = data[0];
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = data[i][j];
    }
    records.push(record);
  }
  
  return records;
}

function getRecordsByField(sheetName, fieldName, fieldValue) {
  var records = getRecords(sheetName);
  return records.filter(function(r) { return r[fieldName] === fieldValue; });
}

function insertRecord(sheetName, dataObj) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return;
  
  var headers = HEADERS[sheetName];
  var row = [];
  
  for (var i = 0; i < headers.length; i++) {
    row.push(dataObj[headers[i]] !== undefined ? dataObj[headers[i]] : "");
  }
  
  sheet.appendRow(row);
}

function updateRecord(sheetName, idField, idValue, dataObj) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return false;
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;
  
  var headers = data[0];
  var idColIndex = headers.indexOf(idField);
  if (idColIndex === -1) return false;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][idColIndex] === idValue) {
      // Found the row, update fields
      for (var j = 0; j < headers.length; j++) {
        var h = headers[j];
        if (dataObj[h] !== undefined) {
          // Update the cell directly (+1 because rows are 1-indexed)
          sheet.getRange(i + 1, j + 1).setValue(dataObj[h]);
        }
      }
      return true;
    }
  }
  return false;
}

function deleteRecord(sheetName, idField, idValue) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return false;
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;
  
  var headers = data[0];
  var idColIndex = headers.indexOf(idField);
  if (idColIndex === -1) return false;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][idColIndex] === idValue) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function deleteRecordsByField(sheetName, fieldName, fieldValue) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return;
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;
  
  var headers = data[0];
  var fieldColIndex = headers.indexOf(fieldName);
  if (fieldColIndex === -1) return;
  
  // Go backwards when deleting multiple rows to avoid shifting indices
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][fieldColIndex] === fieldValue) {
      sheet.deleteRow(i + 1);
    }
  }
}
