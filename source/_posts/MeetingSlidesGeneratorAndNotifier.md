---
title: 整合 google 會議簡報自動生成和slack通知自動化程式碼
katex: true
date: 2023-07-26 16:52:36
categories: code
tags:
  - javascript
  - code
  - Google Apps Script
cover: demoSlider.webp
---
## 引言
在我們日常的工作中，準備會議和記錄會議與通知是一個必要但卻耗時的任務。今天將要寫一個透過 Google Apps Script (GAS) 來每天判斷行事曆事件，並且自動生成通知及新的會議紀錄表的程式碼。

---
## 可達到的功能
1. 它能夠自動檢查你的 Google 日曆，找出預定在明天的包含特定關鍵字的會議，
2. 為這些會議自動生成 Google 簡報，
3. 然後將這次簡報與最近一次的會議紀錄文件連結透過  Slack Webhook 發送給相關人員。
4. 可以定時檢查行事曆。

---
## 如何使用

### 設定slack的webhook
在這個過程中比較特別的需要使用
1. slack webhook：https://slack.com/apps/A0F7XDUAZ-incoming-webhook?tab=more_info
2. 將內容填寫好以後，複製webhook URL到 Google Apps Script 
{% asset_img  webhookSet.webp slack webhook填寫內容 %}

### 將程式貼上GAS
將程式碼貼上Google Apps Script
{% asset_img GASdemo.webp 貼上程式碼的位置 %}

```javascript
// 你的 Slack webhook URL
var WEBHOOK_URL = 'dummy';

// 包含特定文字的事件的搜尋字串
var EVENT_KEYWORD = 'dummy';

// 生成 Google 簡報的範本 ID
var SLIDES_TEMPLATE_ID = 'dummy';

// 雲端硬碟文件夾的 ID
var FOLDER_ID = 'dummy';
var CALENDAR_IDS = ['dummy','dummy']

function checkMeetings() {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  let nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);

  Logger.log('Tomorrow: ' + tomorrow);
  Logger.log('Next Day: ' + nextDay);

  Logger.log('Checking meetings for calendars: ' + CALENDAR_IDS);

  for (let i = 0; i < CALENDAR_IDS.length; i++) {
    const calendar = CalendarApp.getCalendarById(CALENDAR_IDS[i]);
    if (calendar) {
      Logger.log('Checking calendar: ' + CALENDAR_IDS[i]);
      const events = calendar.getEvents(tomorrow, nextDay);

      Logger.log('Found ' + events.length + ' events for calendar: ' + CALENDAR_IDS[i]);

      for (let j = 0; j < events.length; j++) {
        Logger.log('Event: ' + events[j].getTitle());

        if (events[j].getTitle().includes(EVENT_KEYWORD)) {
          Logger.log('Event: ' + events[j].getTitle() + ' contains keyword: ' + EVENT_KEYWORD);
          const slidesUrl = createMeetingSlides(events[j]);

          const recentMeetingUrl = findRecentMeetingFile();
          Logger.log('Recent Meeting File: ' + recentMeetingUrl);

          sendSlackMessage(slidesUrl, recentMeetingUrl);
        }
      }
    } else {
      Logger.log('No calendar found for ID: ' + CALENDAR_IDS[i]);
    }
  }
}

function createMeetingSlides(event) {
  var date = event.getStartTime();
  var formattedDate = getFormattedDate(date);
  var title = "你想要的標題" + '_' + formattedDate;

  var file = DriveApp.getFileById(SLIDES_TEMPLATE_ID);
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var copiedFile = file.makeCopy(title, folder);

  var presentation = SlidesApp.openById(copiedFile.getId());
  var firstSlide = presentation.getSlides()[0];

  var textShape = firstSlide.getShapes()[0];
  if (textShape.getText) {
    textShape.getText().setText(title);
  }

  return 'https://docs.google.com/presentation/d/' + copiedFile.getId() + '/edit';
}

function getFormattedDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1; 
  var day = date.getDate();

  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }

  return '' + year + month + day;
}

function sendSlackMessage(slidesUrl, recentMeetingUrl) {
  const payload = {
    text: '請更新您的簡報進度，簡報連結如下：' + slidesUrl +
          (recentMeetingUrl ? '\n最近的會議紀錄可以在這裡找到：' + recentMeetingUrl : '')
  };

  const options = {
    method: 'post',
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(WEBHOOK_URL, options);
}

function findRecentMeetingFile() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.searchFiles('title contains "你想要的標題_"');

  // Add all matching files to an array.
  let fileArray = [];
  while (files.hasNext()) {
    const file = files.next();
    fileArray.push(file);
  }

  // Sort the array by creation date.
  fileArray.sort(function(a, b) {
    return b.getDateCreated() - a.getDateCreated();
  });

  // Return the URL of the second most recent file (if it exists).
  if (fileArray.length > 1) {
    return 'https://docs.google.com/presentation/d/' + fileArray[1].getId() + '/edit';
  }
  
  return null;
}
```

### 修改參數
```javascript
// 定義您的 Slack webhook URL
var WEBHOOK_URL = 'dummy';
// 包含特定文字的事件的搜尋字串
var EVENT_KEYWORD = '日曆包含的字串';
// 生成 Google 簡報的範本 ID
var SLIDES_TEMPLATE_ID = 'dummy';
// 雲端硬碟文件夾的 ID
var FOLDER_ID = 'dummy';
// 行事曆的 ID
var CALENDAR_IDS = ['dummy','dummy']
```

### 接著執行
1. 這個只需要執行，並不需要部屬
2. 過程中可能會遇到需要權限的部分

### 設定觸發器
為了要讓這個程式固定檢查時間檢查跟傳送slack訊息，
因此需要設定觸發器，這邊示範是在每天晚上6:00~7:00間會檢查明天會議的狀況。

1. 先點擊儀表左邊像鬧鐘的符號(第三個)
{% asset_img tri-0.webp 像鬧鐘的圖案 %}

2. 接著在右下角點擊"新增觸發條件"
{% asset_img tri-1.webp 這個按鈕 %}

3. 設定觸發條件如下圖所示
{% asset_img tri-2.webp 觸發條件示範 %}

note：不過比較奇怪的是無法設定準確的時間提醒，
我們測試後發現都會在設定時間的20分鐘左右才收到系統的通知。