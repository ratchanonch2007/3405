function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // ตรวจสอบพารามิเตอร์
  if (!e || !e.parameter) {
    return createJsonResponse({
      status: "error",
      message: "No parameters provided"
    });
  }

  var action = e.parameter.action;
  
  try {
    switch(action) {
      case "getPhone":
        return handleGetPhone(e.parameter);
      case "saveOrder":
        return handleSaveOrder(e.parameter);
      default:
        return createJsonResponse({
          status: "error",
          message: "Invalid action"
        });
    }
  } catch(error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

function handleGetPhone(params) {
  if (!params.studentId) {
    throw new Error("Student ID is required");
  }

  var phone = findPhoneNumber(params.studentId);
  
  if (!phone) {
    throw new Error("Phone number not found for student ID: " + params.studentId);
  }

  return createJsonResponse({
    status: "success",
    phone: phone
  });
}

function handleSaveOrder(params) {
  // ตรวจสอบข้อมูลที่จำเป็น
  if (!params.room || !params.total || !params.studentId || !params.items) {
    throw new Error("Missing required fields");
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    throw new Error("Orders sheet not found");
  }

  var phone = findPhoneNumber(params.studentId);
  if (!phone) {
    throw new Error("Phone number not found for student ID: " + params.studentId);
  }

  // เพิ่มข้อมูลลงในชีต
  sheet.appendRow([
    new Date(), // วันที่ปัจจุบัน
    params.room,
    params.total,
    params.studentId,
    phone,
    params.items
  ]);

  return createJsonResponse({
    status: "success",
    message: "Order saved successfully"
  });
}

function findPhoneNumber(studentId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  if (!sheet) {
    throw new Error("Users sheet not found");
  }

  var data = sheet.getDataRange().getValues();
  
  // ค้นหาเบอร์โทรจาก studentId
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === studentId) {
      return data[i][1] || ''; // คืนค่าเบอร์โทรหรือค่าว่างถ้าไม่มีข้อมูล
    }
  }
  
  return ''; // ถ้าไม่พบข้อมูล
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
