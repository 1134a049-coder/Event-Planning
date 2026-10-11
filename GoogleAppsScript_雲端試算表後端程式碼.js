// ==============================================================================
// Google Apps Script (GAS) 雲端試算表後端程式碼
// 部署方式：
// 1. 打開 Google 雲端硬碟，新增一份「Google 試算表」
// 2. 點擊頂部選單「擴充功能」 -> 「Apps Script」
// 3. 清空原有代碼，將本檔案所有內容貼上
// 4. 點擊右上角「部署」 -> 「新增部署作業」
//    - 種類選擇「網頁應用程式 (Web app)」
//    - 執行身分選擇「我 (Me)」
//    - 誰可以存取選擇「所有人 (Anyone)」
// 5. 點擊「部署」並複製產生的「網頁應用程式網址 (Web App URL)」
// 6. 在網站的「社團活動分享中心」點擊「設定雲端網址」貼上即可！
// ==============================================================================

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "read";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  
  if (rows.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      count: 0,
      data: [] 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var members = [];
  // 第一列為標題，從第二列開始讀取
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue; // 無 deviceId 則跳過
    
    var deviceId = String(r[0]);
    var name = String(r[1] || "社員");
    var games = [];
    try { games = r[2] ? JSON.parse(r[2]) : []; } catch(e) { games = String(r[2] || "").split(/[,，、\s]+/).filter(Boolean); }
    var interests = [];
    try {
      interests = r[2] ? JSON.parse(r[2]) : [];
    } catch(err) {
      interests = String(r[2] || "").split(/[,，、\s]+/).filter(Boolean);
    }
    var specialties = String(r[4] || "");
    var expectation = String(r[5] || "");
    var selectedIds = [];
    try {
      selectedIds = r[6] ? JSON.parse(r[5]) : [];
    } catch(err) {
      selectedIds = [];
    }
    var time = String(r[6] || "");
    var updatedAt = String(r[7] || "");
    
    members.push({
      id: "cloud-" + deviceId,
      deviceId: deviceId,
      name: name,
      games: games,
      interests: interests,
      specialties: specialties,
      expectation: expectation,
      selectedIds: selectedIds,
      time: time,
      updatedAt: updatedAt
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "success", 
    count: members.length,
    data: members 
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var rawText = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(rawText);
    
    if (!data.deviceId) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "缺少裝置識別碼 (deviceId)" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    // 若表單為空，自動建立表頭
    if (rows.length === 0 || rows[0].length === 0 || rows[0][0] === "") {
      sheet.appendRow([
        "裝置識別碼 (DeviceID)", 
        "社員姓名 (Name)", 
        "常玩遊戲 (Games JSON)", 
        "興趣愛好 (Interests JSON)", 
        "個人專長 (Specialties)", 
        "入社期望 (Expectation)", 
        "勾選活動代碼 (SelectedIDs JSON)", 
        "提交時間 (Time)", 
        "最後更新時間戳 (UpdatedAt)"
      ]);
      rows = sheet.getDataRange().getValues();
    }
    
    var targetDeviceId = String(data.deviceId);
    var existingRowIndex = -1; // 1-indexed for Sheet
    
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === targetDeviceId) {
        existingRowIndex = i + 1;
        break;
      }
    }
    
    var rowData = [
      targetDeviceId,
      data.name || "社員",
      JSON.stringify(data.games || []), 
      JSON.stringify(data.interests || []), 
      data.specialties || "",
      data.expectation || "",
      JSON.stringify(data.selectedIds || []),
      data.time || new Date().toLocaleString(),
      new Date().toISOString()
    ];
    
    var isUpdate = false;
    if (existingRowIndex > 0) {
      // 限制一個裝置只能傳送一份檔案：覆蓋更新該列（修改回覆）
      sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
      isUpdate = true;
    } else {
      // 首次提交：新增一列
      sheet.appendRow(rowData);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      isUpdate: isUpdate,
      message: isUpdate ? "已成功修改並覆蓋本裝置之回覆！" : "已成功新增並上傳回覆至雲端！"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
