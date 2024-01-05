---
title: 如何透過 Google Apps Script 來計算 google 文件中特定格子內的字數與秒數呢？
katex: true
date: 2023-11-17 22:05:41
categories: code
tags: 
  - javascript
  - code
  - Google Apps Script
cover: code.webp
---

## 前言

最近公司同事許願做出 google 文件的一個功能，因為在寫分鏡時，會需要方式可以統計分鏡的字數和分鏡持續的秒數。以便做後續的的影片製作。

## 要求

分鏡如下圖所示，是會有一個表格。

{% asset_img form.webp 文件的模樣 %}

需求是：

1. 在表格中需要一個打勾的欄位，程式會計算打勾的欄位，並統計分鏡所需的時間。

1. 在表格的最後兩行會計算字數與分鏡秒數，並且顯示有打勾欄位的字數與整體的字數與分鏡秒數。

     {% asset_img count.webp 計算字數 %}

2. 不要計算"冒號前的人名"和"標點符號"字數。
3. 在 google 文件中，可以有一個按鈕更新字數及分鏡秒數。

## 設計理念

基於以上的要求，因此我和 chatGPT 寫了一個程式，這個程式會透過 GAS 讀取 Google 文件中的分鏡表格，並且在表格的最後兩行添加統計訊息，包括打勾數量、對白字數和總秒數。

而使用者只需要在分鏡表格的特定欄位填入 V 或 v，表示這個分鏡是你想要保留的，然後執行程式碼，就可以看到統計結果了。

## 程式使用步驟

### 啟動 Google Apps Script

{% asset_img gasIni.webp 啟動 %}

### 輸入程式碼，並且執行

{% asset_img code.webp 輸入程式碼 %}

執行的過程中會要求權限，直接接受即可。

### 程式碼

``` javaScript
//onOpen 函數，用於在文件打開時，添加一個自定義的選項「劇本統計」，並綁定一個子選項「統計打勾數量、旁白字數和時長」，該子選項對應一個 countWordsAndTime 函數。
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('劇本統計')
      .addItem('統計打勾數量、旁白字數和時長', 'countWordsAndTime')
      .addToUi();
}

//cleanDialogue 函數用於清理分鏡表格中的對白文本，去除冒號前的角色名和非字母數字的字符，並返回清理後的文字。
function cleanDialogue(dialogue) {
  if (dialogue == null) {
    return '';
  }

  // 分割對白為多段，每段可能包含角色名和對白
  var parts = dialogue.split('\n');
  var cleanText = '';

  for (var i = 0; i < parts.length; i++) {
    // 尋找每段對白中的全形冒號並去除冒號前的文本
    var colonIndex = parts[i].indexOf('：');
    if (colonIndex !== -1) {
      cleanText += parts[i].substring(colonIndex + 1);
    }
  }

  // 正則表達式匹配任何非字母數字的字符，包括空格和標點
  return cleanText.replace(/[^\w\u4e00-\u9fa5]/g, '');
}


function countWordsAndTime() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var tables = body.getTables();
  var totalCharacters = 0;
  var totalTime = 0;
  var totalCharactersUnchecked = 0;
  var totalTimeUnchecked = 0;
  var checkedCount = 0;
  var scriptTable = tables[2];

  // 遍歷分鏡表格的每一行，並判斷是否是統計行，如果是，則移除該行，以便重新添加新的統計行。

  var numRows = scriptTable.getNumRows();
  for (var i = numRows - 1; i >= 0; i--) {
    var row = scriptTable.getRow(i);
    var cellText = row.getCell(1).getText().trim();
    if (cellText.startsWith('打勾數量') || cellText.startsWith('全部對白字數')) {
      scriptTable.removeRow(i);
      scriptTable.removeRow(i);
    }
  }

  // 遍歷分鏡表格的每一行，並從第四列獲取對白文本，從第五列獲取時長文本，從第六列獲取是否打勾的標記。將對白文本傳入。

  for (var i = 1; i < scriptTable.getNumRows(); i++) {
    var row = scriptTable.getRow(i);
    var hasActor = row.getCell(5).getText().trim();
    var dialogue = row.getCell(3).getText();
    var duration = row.getCell(4).getText().trim(); 

    var durationInt = (duration === '' || isNaN(parseInt(duration))) ? 0 : parseInt(duration);

    var dialogueClean = cleanDialogue(dialogue);
    totalCharactersUnchecked += dialogueClean.length;
    totalTimeUnchecked += durationInt;

    if (hasActor.toLowerCase() === 'v') {
      totalCharacters += dialogueClean.length;
      totalTime += durationInt;
      checkedCount++;
    }
  }

  // 在分鏡表格的末尾，添加兩行新的統計行，分別顯示打勾的統計訊息和全部的統計訊息，並保持與原表格的列數一致。

  var statsRow = scriptTable.appendTableRow();
  statsRow.appendTableCell('');
  statsRow.appendTableCell('打勾數量: ' + checkedCount);
  statsRow.appendTableCell('對白字數: ' + totalCharacters);
  statsRow.appendTableCell('總秒數: ' + totalTime);

  var totalStatsRow = scriptTable.appendTableRow();
  totalStatsRow.appendTableCell('');
  totalStatsRow.appendTableCell('');
  totalStatsRow.appendTableCell('全部對白字數: ' + totalCharactersUnchecked);
  totalStatsRow.appendTableCell('全部時長: ' + totalTimeUnchecked);

  while (statsRow.getNumCells() < scriptTable.getRow(0).getNumCells()) {
    statsRow.appendTableCell('');
  }
  while (totalStatsRow.getNumCells() < scriptTable.getRow(0).getNumCells()) {
    totalStatsRow.appendTableCell('');
  }
}

```

### 回到文件內

這時會發現文件上面的導覽列多出了一個選項，按該選項即可更新字數。

{% asset_img UI.webp 更新字數按鈕 %}
