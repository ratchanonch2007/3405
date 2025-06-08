// Google Apps Script code
function doGet(e) {
  return handleResponse(e);
}

function doPost(e) {
  return handleResponse(e);
}

function handleResponse(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Sheet1');
    
    // ตั้งค่าให้ทุกคอลัมน์เป็นรูปแบบข้อความ
    sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).setNumberFormat('@');
    
    var action = e.parameter.action;
    
    if (action === 'login') {
      return handleLogin(e, sheet);
    } else if (action === 'register') {
      return handleRegister(e, sheet);
    } else if (action === 'checkDuplicate') {
      return checkDuplicate(e, sheet);
    }
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ฟังก์ชันสำหรับจัดการเลข 0 นำหน้า
function padZero(value, length) {
  return String(value).padStart(length, '0');
}

function handleLogin(e, sheet) {
  var studentId = padZero(e.parameter.studentId, 10);
  var password = e.parameter.password;
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rowStudentId = padZero(data[i][0], 10);
    var rowPassword = String(data[i][1]);
    
    Logger.log('Comparing - Input: ' + studentId + ' with DB: ' + rowStudentId); // เพิ่ม log เพื่อตรวจสอบ
    
    if (rowStudentId === studentId && rowPassword === password) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'เข้าสู่ระบบสำเร็จ'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'error',
    'message': 'รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง'
  })).setMimeType(ContentService.MimeType.JSON);
}

function checkDuplicate(e, sheet) {
  var studentId = e.parameter.studentId ? padZero(e.parameter.studentId, 10) : '';
  var phone = e.parameter.phone ? padZero(e.parameter.phone, 10) : '';
  var field = e.parameter.field;
  
  var data = sheet.getDataRange().getValues();
  var isDuplicate = false;
  var message = '';
  
  for (var i = 1; i < data.length; i++) {
    var rowStudentId = padZero(data[i][0], 10);
    var rowPhone = padZero(data[i][2], 10);
    
    Logger.log('Checking duplicate - Field: ' + field); // เพิ่ม log เพื่อตรวจสอบ
    Logger.log('Input StudentID: ' + studentId + ' DB StudentID: ' + rowStudentId); // เพิ่ม log
    Logger.log('Input Phone: ' + phone + ' DB Phone: ' + rowPhone); // เพิ่ม log
    
    if (field === 'studentId' && rowStudentId === studentId) {
      isDuplicate = true;
      message = 'รหัสนักศึกษานี้ถูกใช้งานแล้ว';
      break;
    }
    if (field === 'phone' && rowPhone === phone) {
      isDuplicate = true;
      message = 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว';
      break;
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    'status': isDuplicate ? 'error' : 'success',
    'message': message
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleRegister(e, sheet) {
  var studentId = padZero(e.parameter.studentId, 10);
  var password = e.parameter.password;
  var phone = padZero(e.parameter.phone, 10);
  
  Logger.log('Registration attempt - StudentID: ' + studentId + ' Phone: ' + phone); // เพิ่ม log
  
  // ตรวจสอบรหัสนักศึกษาซ้ำ
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rowStudentId = padZero(data[i][0], 10);
    var rowPhone = padZero(data[i][2], 10);
    
    if (rowStudentId === studentId) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'รหัสนักศึกษานี้ถูกใช้งานแล้ว'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    if (rowPhone === phone) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // เพิ่มข้อมูลผู้ใช้ใหม่
  var newRow = sheet.getLastRow() + 1;
  
  // ตั้งค่ารูปแบบเซลล์เป็นข้อความก่อนใส่ค่า
  var range = sheet.getRange(newRow, 1, 1, 3);
  range.setNumberFormat('@');
  
  // ใส่ข้อมูลโดยใช้ setValues เพื่อใส่ข้อมูลทั้งแถวในครั้งเดียว
  range.setValues([[studentId, password, phone]]);
  
  Logger.log('New registration - Row: ' + newRow + ' StudentID: ' + studentId + ' Phone: ' + phone); // เพิ่ม log
  
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'สมัครสมาชิกสำเร็จ'
  })).setMimeType(ContentService.MimeType.JSON);
}