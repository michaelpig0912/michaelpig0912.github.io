---
title: 用 GAS 與 Trello 複製清單
katex: true
date: 2025-01-25 17:28:59
categories: code
tags:
  - trello
  - gas
cover: cover.webp
---

寫一個用 Google Apps Script 與 Trello 複製清單的工具，可以複製卡片、成員、標籤、待辦清單。

```javascript
// 設置你的 Trello API 金鑰和令牌
const TRELLO_KEY = '';
const TRELLO_TOKEN = '';

// 創建菜單
function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet()
    .addMenu('Trello工具', [
      {name: '複製列表', functionName: 'showTrelloCopyDialog'}
    ]);
}

// 顯示對話框
function showTrelloCopyDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(400)
    .setHeight(500);
  SpreadsheetApp.getUi().showModelessDialog(html, '複製 Trello 列表');
}

// 從 URL 提取看板 ID
function getBoardIdFromUrl(url) {
  try {
    // Trello URL 格式: https://trello.com/b/BOARD_ID/board-name
    const matches = url.match(/trello\.com\/b\/([a-zA-Z0-9]+)/);
    if (matches && matches[1]) {
      return matches[1];
    }
    throw new Error('無效的 Trello 看板網址');
  } catch (error) {
    throw new Error('解析看板網址時發生錯誤：' + error.message);
  }
}

// 修改 getBoardLists 函數以接受 URL
function getBoardLists(boardUrl) {
  try {
    const boardId = getBoardIdFromUrl(boardUrl);
    const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const response = UrlFetchApp.fetch(url);
    return JSON.parse(response.getContentText());
  } catch (error) {
    throw new Error('獲取列表失敗：' + error.message);
  }
}

// 獲取使用者的所有看板
function getUserBoards() {
  try {
    const url = `https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const response = UrlFetchApp.fetch(url);
    const boards = JSON.parse(response.getContentText());
    return boards.map(board => ({
      id: board.id,
      name: board.name
    }));
  } catch (error) {
    throw new Error('獲取看板失敗：' + error.message);
  }
}

// 根據看板ID獲取列表
function getListsByBoardId(boardId) {
  try {
    const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const response = UrlFetchApp.fetch(url);
    const lists = JSON.parse(response.getContentText());
    return lists.map(list => ({
      id: list.id,
      name: list.name
    }));
  } catch (error) {
    throw new Error('獲取列表失敗：' + error.message);
  }
}

// 獲取看板成員
function getBoardMembers(boardId) {
  try {
    const url = `https://api.trello.com/1/boards/${boardId}/members?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const response = UrlFetchApp.fetch(url);
    const members = JSON.parse(response.getContentText());
    return members.map(member => ({
      id: member.id,
      fullName: member.fullName,
      username: member.username
    }));
  } catch (error) {
    throw new Error('獲取成員失敗：' + error.message);
  }
}

// 修改複製列表函數，添加 labelFilterSettings 參數
function copyTrelloList(sourceBoardId, sourceListId, targetBoardId, targetListId, 
                       searchText, replaceText, options, selectedMembers, dateSettings, labelFilterSettings) {
  try {
    // 修改 API 請求，移除不需要的參數
    const cardsUrl = `https://api.trello.com/1/lists/${sourceListId}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&checklists=all`;
    const cardsResponse = UrlFetchApp.fetch(cardsUrl);
    const cards = JSON.parse(cardsResponse.getContentText());
    
    let skippedCards = 0;
    let copiedCards = 0;
    
    // 解析日期設定
    let dateOffsets = [];
    if (dateSettings && dateSettings.enabled && dateSettings.baseDate) {
      dateOffsets = dateSettings.offsets.split(',').map(offset => offset.trim());
    }
    
    // 2. 複製卡片到目標列表
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      
      // 檢查卡片是否有要過濾的標籤
      if (labelFilterSettings && labelFilterSettings.enabled && card.labels) {
        const shouldSkip = card.labels.some(label => 
          labelFilterSettings.labels.includes(label.name)
        );
        
        if (shouldSkip) {
          Logger.log(`跳過具有過濾標籤的卡片：${card.name}`);
          skippedCards++;
          continue;
        }
      }
      
      Logger.log(`正在處理第 ${i + 1}/${cards.length} 張卡片：${card.name}`);
      
      const searchRegex = searchText ? new RegExp(searchText, 'g') : null;
      const newCardName = searchText ? card.name.replace(searchRegex, replaceText) : card.name;
      
      // 計算日期
      let dueDate = null;
      if (dateSettings.enabled && dateSettings.baseDate && 
          i < dateOffsets.length && dateOffsets[i] !== 'x') {
        const baseDate = new Date(dateSettings.baseDate);
        const offsetDays = parseInt(dateOffsets[i]);
        if (!isNaN(offsetDays)) {
          dueDate = new Date(baseDate.getTime());
          dueDate.setDate(baseDate.getDate() + offsetDays);
        }
      }
      
      // 獲取卡片的詳細資訊（包含活動）
      const cardDetailUrl = `https://api.trello.com/1/cards/${card.id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&actions=commentCard`;
      const cardDetailResponse = UrlFetchApp.fetch(cardDetailUrl);
      const cardDetail = JSON.parse(cardDetailResponse.getContentText());
      
      let cardDesc = card.desc || '';
      
      // 處理附件
      if (options.copyAttachments && card.attachments && card.attachments.length > 0) {
        let attachmentsText = '\n\n=== 原始卡片的附件 ===\n';
        card.attachments.forEach(attachment => {
          // 根據附件類型添加不同的格式
          if (attachment.isUpload) {
            attachmentsText += `- 📎 [${attachment.name}](${attachment.url})\n`;
          } else {
            attachmentsText += `- 🔗 [${attachment.name}](${attachment.url})\n`;
          }
        });
        cardDesc += attachmentsText;
      }
      
      // 創建新卡片
      const createCardUrl = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
      const createCardPayload = {
        'name': newCardName,
        'desc': card.desc || '',
        'idList': targetListId,
        'pos': 'bottom'
      };
      
      // 如果有日期，添加到卡片設定中
      if (dueDate) {
        createCardPayload.due = dueDate.toISOString();
      }
      
      const newCardResponse = UrlFetchApp.fetch(createCardUrl, {
        method: 'POST',
        payload: createCardPayload
      });
      
      const newCard = JSON.parse(newCardResponse.getContentText());
      
      // 複製成員
      if (options.copyMembers && card.idMembers && card.idMembers.length > 0) {
        try {
          card.idMembers.forEach(memberId => {
            const memberUrl = `https://api.trello.com/1/cards/${newCard.id}/idMembers?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
            UrlFetchApp.fetch(memberUrl, {
              method: 'POST',
              payload: {
                'value': memberId
              }
            });
          });
          Logger.log(`已複製卡片 "${card.name}" 的成員`);
        } catch (memberError) {
          Logger.log(`複製卡片 "${card.name}" 的成員時發生錯誤: ${memberError}`);
        }
      }
      
      // 複製標籤
      if (options.copyLabels && card.labels && card.labels.length > 0) {
        card.labels.forEach(label => {
          const labelUrl = `https://api.trello.com/1/cards/${newCard.id}/labels?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
          UrlFetchApp.fetch(labelUrl, {
            method: 'POST',
            payload: {
              'color': label.color,
              'name': label.name
            }
          });
        });
      }
      
      // 複製代辦清單
      if (options.copyChecklists && card.checklists && card.checklists.length > 0) {
        card.checklists.forEach(checklist => {
          const checklistUrl = `https://api.trello.com/1/cards/${newCard.id}/checklists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
          UrlFetchApp.fetch(checklistUrl, {
            method: 'POST',
            payload: {
              'name': checklist.name,
              'idChecklistSource': checklist.id
            }
          });
        });
      }
      
      copiedCards++;
    }
    
    return {
      success: true,
      message: `成功複製 ${copiedCards} 張卡片！${skippedCards > 0 ? `（已跳過 ${skippedCards} 張卡片）` : ''}`
    };
    
  } catch (error) {
    return {
      success: false,
      message: `發生錯誤：${error.toString()}`
    };
  }
}

// 添加新函數來處理進度通知
function notifyProgress(message) {
  return message;
}

// 處理網頁請求
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Trello 列表複製工具')
    .setFaviconUrl('https://trello.com/favicon.ico');
}
```

```html
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 20px;
      background-color: #f9fafc;
      color: #172b4d;
      line-height: 1.5;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 20px;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }

    label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #172b4d;
    }

    select, input {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      border: 2px solid #dfe1e6;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    select:focus, input:focus {
      outline: none;
      border-color: #0079BF;
      box-shadow: 0 0 0 2px rgba(0,121,191,0.2);
    }

    button {
      background-color: #0079BF;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.2s ease;
      width: 100%;
    }

    button:hover {
      background-color: #026AA7;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    button:active {
      transform: translateY(0);
      box-shadow: none;
    }

    .checkbox-group {
      margin-top: 10px;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      font-weight: normal;
      margin-bottom: 8px;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .checkbox-group label:hover {
      background-color: #f4f5f7;
    }

    .checkbox-group input[type="checkbox"] {
      margin-right: 10px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    #membersList label {
      display: flex;
      align-items: center;
      padding: 8px;
      margin-bottom: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    #membersList label:hover {
      background-color: #f4f5f7;
    }

    .member-checkbox {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }

    /* 載入指示器樣式優化 */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(3px);
    }

    .loading-content {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0079BF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    #processingStatus {
      color: #0079BF;
      font-size: 14px;
      margin-top: 10px;
      font-weight: 500;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* 響應式設計 */
    @media (max-width: 600px) {
      body {
        padding: 10px;
      }
      
      .form-group {
        padding: 12px;
      }
      
      button {
        padding: 10px 20px;
      }
    }

    /* 添加標題樣式 */
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }

    .header h1 {
      color: #0079BF;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .header p {
      color: #5E6C84;
      margin: 10px 0 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div id="loadingOverlay" class="loading-overlay">
    <div class="loading-content">
      <div class="spinner"></div>
      <div id="processingStatus">載入中...</div>
    </div>
  </div>
  
  <!-- 添加標題區域 -->
  <div class="header">
    <h1>Trello 列表複製工具 Ver 1.0.0 </h1>
    <p>輕鬆複製看板列表及其內容到其他位置</p>
    <p>update at 2025/01/22</p>
  </div>
  
  <div class="form-group">
    <label>來源看板：</label>
    <select id="sourceBoard" onchange="loadSourceLists()">
      <option value="">請選擇看板</option>
    </select>
  </div>
  
  <div class="form-group">
    <label>來源列表：</label>
    <select id="sourceList">
      <option value="">請先選擇看板</option>
    </select>
  </div>
  
  <div class="form-group">
    <label>目標看板：</label>
    <select id="targetBoard" onchange="loadTargetLists()">
      <option value="">請選擇看板</option>
    </select>
  </div>
  
  <div class="form-group">
    <label>目標列表：</label>
    <select id="targetList">
      <option value="">請先選擇看板</option>
    </select>
  </div>
  
  <div class="form-group">
    <label>選擇成員：</label>
    <div id="membersList" class="checkbox-group">
      <!-- 成員選項將在這裡動態添加 -->
    </div>
  </div>
  
  <div class="form-group">
    <label>搜尋文字（選填）：</label>
    <input type="text" id="searchText">
  </div>
  
  <div class="form-group">
    <label>替換文字（選填）：</label>
    <input type="text" id="replaceText">
  </div>
  
  <div class="form-group">
    <label>其他功能：</label>
    <div class="checkbox-group">
      <label>
        <input type="checkbox" id="enableLabelFilter" onchange="toggleLabelFilterInput()">
        過濾特定標籤
      </label>
      
      <div id="labelFilterContainer" style="display: none; margin-top: 10px;">
        <div>
          <label>要過濾的標籤名稱（以逗號分隔）：</label>
          <input type="text" 
                 id="labelFilter" 
                 placeholder="例如: 不複製,Done,完成"
                 title="具有這些標籤的卡片將不會被複製">
        </div>
      </div>

      <label>
        <input type="checkbox" id="enableDates" onchange="toggleDateInputs()">
        添加到期日
      </label>
      
      <div id="dateInputsContainer" style="display: none; margin-top: 10px;">
        <div style="margin-bottom: 10px;">
          <label>基準日期：</label>
          <input type="date" id="baseDate" style="margin-bottom: 10px;">
        </div>
        
        <div>
          <label>日期偏移（以逗號分隔，使用x表示跳過）：</label>
          <input type="text" 
                 id="dateOffsets" 
                 placeholder="例如: -5,-2,-1,x,1,5"
                 title="請輸入以逗號分隔的數字，使用x表示跳過該卡片的日期設定">
        </div>
      </div>

      <label>
        <input type="checkbox" id="copyMembers">
        複製成員
      </label>
      
      <label>
        <input type="checkbox" id="copyLabels">
        複製標籤
      </label>
      
      <label>
        <input type="checkbox" id="copyChecklists">
        複製待辦清單
      </label>
    </div>
  </div>
  
  <button onclick="copyList()">複製列表</button>

  <script>
    // 修改顯示載入狀態的函數
    function showLoading(message = '載入中...') {
      document.getElementById('loadingOverlay').style.display = 'flex';
      document.getElementById('processingStatus').textContent = message;
    }
    
    function hideLoading() {
      document.getElementById('loadingOverlay').style.display = 'none';
    }

    // 載入頁面時獲取所有看板
    function loadBoards() {
      showLoading(); // 顯示載入指示器
      const sourceBoard = document.getElementById('sourceBoard');
      const targetBoard = document.getElementById('targetBoard');
      
      google.script.run
        .withSuccessHandler(function(boards) {
          sourceBoard.innerHTML = '<option value="">請選擇看板</option>';
          targetBoard.innerHTML = '<option value="">請選擇看板</option>';
          
          boards.forEach(function(board) {
            const option = new Option(board.name, board.id);
            sourceBoard.add(option.cloneNode(true));
            targetBoard.add(option);
          });
          hideLoading(); // 隱藏載入指示器
        })
        .withFailureHandler(function(error) {
          sourceBoard.innerHTML = '<option value="">載入失敗</option>';
          targetBoard.innerHTML = '<option value="">載入失敗</option>';
          alert('載入看板失敗：' + error.message);
          hideLoading(); // 隱藏載入指示器
        })
        .getUserBoards();
    }

    // 載入來源列表
    function loadSourceLists() {
      const boardId = document.getElementById('sourceBoard').value;
      const sourceList = document.getElementById('sourceList');
      sourceList.innerHTML = '<option value="">載入中...</option>';
      
      google.script.run.withSuccessHandler(function(lists) {
        sourceList.innerHTML = '<option value="">請選擇列表</option>';
        lists.forEach(function(list) {
          sourceList.add(new Option(list.name, list.id));
        });
      }).withFailureHandler(function(error) {
        sourceList.innerHTML = '<option value="">載入失敗</option>';
        alert('載入列表失敗：' + error.message);
      }).getListsByBoardId(boardId);
    }

    // 載入目標列表和成員
    function loadTargetLists() {
      const boardId = document.getElementById('targetBoard').value;
      const targetList = document.getElementById('targetList');
      const membersList = document.getElementById('membersList');
      
      // 添加載入中提示
      targetList.innerHTML = '<option value="">載入中...</option>';
      membersList.innerHTML = '載入中...';
      
      // 載入列表
      google.script.run.withSuccessHandler(function(lists) {
        targetList.innerHTML = '<option value="">請選擇列表</option>';
        lists.forEach(function(list) {
          targetList.add(new Option(list.name, list.id));
        });
      }).withFailureHandler(function(error) {
        targetList.innerHTML = '<option value="">載入失敗</option>';
        alert('載入列表失敗：' + error.message);
      }).getListsByBoardId(boardId);
      
      // 載入成員
      google.script.run.withSuccessHandler(function(members) {
        membersList.innerHTML = '';
        if (members.length === 0) {
          membersList.innerHTML = '<div>此看板沒有成員</div>';
          return;
        }
        members.forEach(function(member) {
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = 'member-' + member.id;
          checkbox.value = member.id;
          checkbox.className = 'member-checkbox';
          
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(
            `${member.fullName} (${member.username})`
          ));
          membersList.appendChild(label);
        });
      }).withFailureHandler(function(error) {
        membersList.innerHTML = '載入成員失敗';
        alert('載入成員失敗：' + error.message);
      }).getBoardMembers(boardId);
    }

    // 添加切換日期輸入區域的函數
    function toggleDateInputs() {
      const dateInputsContainer = document.getElementById('dateInputsContainer');
      const enableDates = document.getElementById('enableDates');
      dateInputsContainer.style.display = enableDates.checked ? 'block' : 'none';
    }

    // 添加標籤過濾輸入框的切換函數
    function toggleLabelFilterInput() {
      const labelFilterContainer = document.getElementById('labelFilterContainer');
      const enableLabelFilter = document.getElementById('enableLabelFilter');
      labelFilterContainer.style.display = enableLabelFilter.checked ? 'block' : 'none';
    }

    // 修改 copyList 函數
    function copyList() {
      const sourceBoardId = document.getElementById('sourceBoard').value;
      const sourceListId = document.getElementById('sourceList').value;
      const targetBoardId = document.getElementById('targetBoard').value;
      const targetListId = document.getElementById('targetList').value;
      const searchText = document.getElementById('searchText').value;
      const replaceText = document.getElementById('replaceText').value;

      // 獲取複製選項
      const options = {
        copyLabels: document.getElementById('copyLabels').checked,
        copyChecklists: document.getElementById('copyChecklists').checked,
        copyMembers: document.getElementById('copyMembers').checked
      };

      // 獲取選中的成員
      const selectedMembers = Array.from(document.querySelectorAll('.member-checkbox:checked'))
        .map(checkbox => checkbox.value);

      // 獲取日期相關設定
      const dateSettings = {
        enabled: document.getElementById('enableDates').checked,
        baseDate: document.getElementById('baseDate').value,
        offsets: document.getElementById('dateOffsets').value
      };

      // 獲取標籤過濾設定
      const labelFilterSettings = {
        enabled: document.getElementById('enableLabelFilter').checked,
        labels: document.getElementById('labelFilter').value
          .split(',')
          .map(label => label.trim())
          .filter(label => label !== '')
      };

      if (!sourceListId || !targetListId) {
        alert('請選擇來源和目標列表');
        return;
      }

      showLoading('開始複製卡片...'); 
      
      google.script.run
        .withSuccessHandler(function(result) {
          hideLoading();
          if (result.success) {
            alert(result.message);
          } else {
            alert('錯誤：' + result.message);
          }
        })
        .withFailureHandler(function(error) {
          hideLoading();
          alert('發生錯誤：' + error.message);
        })
        .copyTrelloList(sourceBoardId, sourceListId, targetBoardId, targetListId, 
                       searchText, replaceText, options, selectedMembers, dateSettings, labelFilterSettings);
    }

    // 頁面載入時執行
    window.onload = loadBoards;
  </script>
</body>
</html> 
```