---
title: 如何使用 Google Apps Script 和 Google Sheets 做可以自動完成的表單
katex: true
date: 2023-06-09 20:38:20
categories: code
tags: 
  - javascript
  - html
  - code
  - Google Apps Script
cover: cover.webp
---

## 引言：
最近公司想要製作一個表單，但是裡面有一欄是有關於各個學校的名稱，但是請使用者輸入可能會有不符合規定的學校名稱，因此希望有一下功能：

1. 可以有自動完成的表單，讓使用者可以選擇學校名稱。
2. 要自動傳資料到 Google Sheets。
3. 如果有沒有填的資料會提示被提示要填寫資料。
4. 結束以後要有感謝語。

但礙於 Google Form 沒有自動完成的功能，訪間的表單也大多數要付費，所以想說可以自己透過Google Apps Script來串 Google Sheets，做一個有自動完成的表單。

---
### Google Apps Script (GAS) 是什麼？
Google Apps Script (GAS) 是一種用於在 Google 平台上自動化和擴展 Google 應用程序的編程語言和執行環境。它是由 Google 開發，並可用於在 Google Sheets、Google Docs、Google Forms、Google Slides 和其他 Google 應用程序中編寫腳本。

使用 Google Apps Script，您可以根據自己的需求自動執行各種任務，包括生成報告、自動填寫表單、處理電子郵件、操縱數據等。它與 Google Drive 集成緊密，並且可以輕鬆訪問和操作 Google 雲端存儲中的文件和資料。

Google Apps Script 使用 JavaScript 語言，並提供了一個簡單而強大的 API 集合，用於訪問 Google應用程序的各種功能和服務。您可以通過編寫腳本來處理事件觸發、創建自定義功能、自動化工作流程等。腳本可以在瀏覽器中直接編寫和執行，也可以通過在 Google Sheets 中使用內置的腳本編輯器進行開發。

Google Apps Script 可以與 Google App Engine 配合使用，以建立更複雜的 Web 應用程序和服務。它還可以通過將腳本封裝為 Google 插件，與其他 Google 應用程序和服務進行整合。

總之，Google Apps Script 是一個方便的工具，可以通過編寫腳本來自動化和擴展 Google 應用程序的功能，使您能夠更有效地處理各種任務和自定義需求。

---

### Google Apps Script (GAS) 需要付費嗎？
原則上進行一些小程式免費的應該就可以應付了，但是如果量大到一定以上的可能就需要付費購買，請見下面的連結。[Google Apps Script 額度](https://developers.google.com/apps-script/guides/services/quotas?hl=zh-tw "點我知道更多")

---

## 步驟
接下來將會介紹如何使用 Google Apps Script 建立一個具有自動完成功能的表單，讓你能夠輕鬆收集使用者的資訊。這個表單應用程式不僅能夠減輕資料輸入的負擔，還能提供一個更好的使用者體驗，有 HTML 跟 javascript 的開發經驗的人應該可以很快上手，下面將會直接展示程式碼結構，不會一步一步建立。

---

### 第一步、建立 Google Sheets
首先先在 Google 雲端硬碟裡面建立一個 Google Sheets，並且點擊 `擴充功能` 裡的 `Apps Script`。

{% asset_img 01.webp Google Sheets %}

---

### 第二步、新增一個 HTML 檔案
點擊左上角的加號，新增 HTML 的檔案。
{% asset_img 03.webp 新增html檔案 %}

<b style='color:red;'>並且將 HTML 重新命名成 Form.html (這個步驟會跟後面的程式碼有關)</b>

---

### 第三步、將下方的 HTML 貼入
{% asset_img 04.webp 貼上 HTML %}

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
      }
      form {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      input[type="text"],
      input[type="email"],
      input[type="tel"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
      }
      input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        float: right;
      }
      input[type="submit"]:hover {
        background-color: #45a049;
      }
      #message {
        display: none;
        background-color: #dff0d8;
        color: #3c763d;
        padding: 10px;
        margin-top: 20px;
        border-radius: 5px;
      }
    </style>
    <script>
      function loadSchools() {
        google.script.run.withSuccessHandler(fillSchools).getSchools();
      }

      function fillSchools(schools) {
        $(function() {
          $("#school").autocomplete({
            source: schools
          });
        });
      }

      function submitForm() {
        var data = {
          lastName: document.getElementById('lastName').value,
          firstName: document.getElementById('firstName').value,
          city: document.getElementById('city').value,
          school: document.getElementById('school').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          subject: getSelectedCheckboxes('subject'),
          orderLunch: document.getElementById('orderLunch').checked
        };


        // 驗證至少選一個科目
        var checkboxes = document.getElementsByName('subject');
        var isChecked = false;
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            isChecked = true;
            break;
          }
        }
        if (!isChecked) {
          alert('請至少選一個科目');
          return false;
        }

        google.script.run.submitForm(data);
        document.getElementById('form').style.display = 'none';
        document.getElementById('message').innerText = '感謝您的填寫！';
        document.getElementById('message').style.display = 'block';
        return false;  // prevent form from submitting normally
  
      }

      function getSelectedCheckboxes(name) {
        var selectedCheckboxes = [];
        var checkboxes = document.getElementsByName(name);
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            selectedCheckboxes.push(checkboxes[i].value);
          }
        }
        return selectedCheckboxes.join(', '); // 用逗號分開科目
      }
    </script>
  </head>
  <body onload="loadSchools()">
    <div id="form">
      <form onsubmit="return submitForm();">
        您的姓氏：<input type="text" id="lastName" required><br>
        您的名字：<input type="text" id="firstName" required><br>
        老師服務的單位縣市：
        <select id="city" required>
          <option value="" selected disabled hidden>請選擇縣市</option>
          <option value="台北市">台北市</option>
          <option value="新北市">新北市</option>
          <option value="桃園市">桃園市</option>
          <!-- 添加其他縣市選項 -->
        </select><br>
        您服務的單位名稱：<input type="text" id="school" required><br>
        您的聯絡信箱：<input type="email" id="email" required><br>
        連絡電話：<input type="tel" id="phone" required><br>
        任教科目：<br>
        <input type="checkbox" name="subject" value="數學">數學<br>
        <input type="checkbox" name="subject" value="科學">科學<br>
        <input type="checkbox" name="subject" value="語文">國文<br>
        <input type="checkbox" name="subject" value="英文">英文<br>
        <!-- 添加其他科目選項 -->
        是否訂便當：<input type="checkbox" id="orderLunch"><br>
        <input type="submit" value="提交">
      </form>
    </div>
    <div id="message"></div>
  </body>
</html>
```

#### 程式碼解釋
這段程式碼是一個簡單的 HTML 網頁表單，用於收集使用者的基本資訊和相關選項。讓我們一步一步解釋它的結構和功能。

#### `<head>` 區段：

1. `<base target="_top">`：設置基礎目標為 "_top"，這表示所有的連結點擊將在整個頁面中顯示，而不是在嵌入框架中顯示。
2. 引入 jQuery 和 jQuery UI 的 JavaScript 檔案，以及 jQuery UI 的 CSS 樣式。

#### `<style>` 區段：

1. 定義了一些 CSS 樣式，用於設計表單和頁面的外觀，包括字型、邊距、背景顏色等。

#### `<script>` 區段：

1. `loadSchools()` 函式：在頁面載入完成後，呼叫 `google.script.run` 的 `getSchools()` 方法，並將 `fillSchools` 函式設置為成功回調函式。
2. `fillSchools(schools)` 函式：將 `schools` 參數作為自動完成插件 `(autocomplete)` 的資料來源，並將其綁定到 id 為 "school" 的輸入框。
3. `submitForm()` 函式：獲取表單中的各個輸入欄位的值，並將其組成一個 JavaScript 物件 data。然後，它驗證是否至少選擇了一個科目，如果沒有則顯示警示框。最後，它將 data 傳遞給 `google.script.run` 的 `submitForm` 方法，以提交表單。並隱藏表單並顯示一個感謝訊息。
4. `getSelectedCheckboxes(name)` 函式：獲取具有指定名稱的所有被選中的核取方塊 `(checkbox)` 的值，並將其作為用逗號分隔的字符串返回。

#### `<body>` 區段：

1. `onload="loadSchools()"`：在頁面載入完成後，呼叫 `loadSchools()` 函式，以初始化表單。
2. 表單部分：包括姓名、所在縣市、所在學校、聯絡信箱、連絡電話、任教科目和是否訂便當的輸入欄位。其中，聯絡信箱和連絡電話欄位有 required 屬性，表示這些欄位必填。
3. `<input type="submit" value="提交">`：提交按鈕，點擊後會觸發 `submitForm()` 函式。
4. `<div id="message"></div>`：用於顯示提交表單後的感謝訊息。

---

### 第四步、將程式貼上程式碼.gs內

刪除一開始的 myFunction，以免報錯

```javascript
function myFunction() {
  
}
```

接下來將以下的程式碼貼上`程式碼.gs`內

{% asset_img 05.webp 貼上 程式碼.gs %}


```javascript
function doGet() {
  //這邊的 Form 要記得跟前面的 HTML 取一樣的名稱
  return HtmlService.createHtmlOutputFromFile('Form');
}

function getSchools() {
  // 這裡是一個示例數據，實際情況你可能需要從 Google Sheets 或其他地方獲取學校列表
  var schools = [
    '學校A',
    '學校B',
    '學校C',
    '學校D'
];
  return schools;
}

function submitForm(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([data.lastName, data.firstName, data.city, data.school, data.email, data.phone, data.subject, data.orderLunch]);
}
```

#### 程式碼解釋
這是一個 Google Apps Script 程式碼的範例，用於建立一個網頁應用程式 (Web App)。以下是程式碼中的幾個函式的解釋：

#### `doGet()` 函式：
當 Web App 收到 GET 請求時，將執行 doGet() 函式。
這個函式使用 `HtmlService.createHtmlOutputFromFile('Form')` 建立並返回一個 HTML 輸出物件，該物件會顯示名為 'Form' 的 HTML 檔案的內容。

#### `getSchools()` 函式：
這是一個自訂函式，被用作在網頁表單中的學校自動完成 (autocomplete) 功能中提供學校列表的資料來源。

#### `submitForm(data)` 函式：
這個函式用於處理表單的提交，將表單數據儲存到 Google Sheets 中。

1. 首先，它使用 `SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()` 獲取目前的 Google Sheets 活頁簿和工作表。
2. 然後，它使用 `sheet.appendRow()` 將表單數據作為一列添加到工作表中，每個數據項目對應一個欄位。
3. data 參數是一個包含表單數據的 JavaScript 物件，它包含姓氏、名字、城市、學校、電子郵件、電話、科目和是否訂便當的值。

---

### 第五步、執行
1. 接下來點執行，這時候可能會跳一些需要授權或安全性的訊息，不過按繼續即可
{% asset_img 06.webp 點擊"執行" %}
{% asset_img 07.webp 點擊"審查授權" %}
{% asset_img 08.webp 點擊"允許" %}

接下來下面應該會看到完成的執行記錄
{% asset_img 09.webp 完成的執行記錄 %}

---

### 第六步、部屬
1. 點擊"部屬">"新增部屬作業"
{% asset_img 10.webp "部屬">"新增部屬作業" %}

2. 點擊"齒輪">"網頁應用程式"
{% asset_img 11.webp 網頁應用程式 %}

3. 接下來設定，這邊設定成執行身份設為"我"
誰可以存取，可以依照是否要google登入之類的來決定，這邊示範是"所有人"都可以存取。
{% asset_img 12.webp 設定 %}

4. 成功部屬以後就會看到一個網址，這個網址就會顯示剛剛做的網站。
{% asset_img 13.webp 成功部屬 %}

---

### 第七步、網站完成驗收
1. 點擊網址會看到剛剛做好的網站。
{% asset_img 14.webp 成功設定好的網站 %}

2. 服務單位有做自動完成的效果。
{% asset_img 15.webp 自動完成效果 %}

3. 少填表單會出現警示框。
(其他部分是使用required來強迫填寫表單)
{% asset_img 17.webp 少填入任教科目 %}
{% asset_img 18.webp 跳出警示框 %}

4. 填寫完表單會出現"感謝語"
{% asset_img 19.webp 感謝語 %}

5. 在原本的 Google Sheets 也會看到剛剛填寫的資料
{% asset_img 20.webp Google Sheets 完成效果 %}

---

### 網站更新與測試
如果要更新表單，請按照以下步驟
1. 先"儲存" (ctrl + s)
2. 按執行
3. 點擊剛剛的"部屬">"管理部屬作業"
{% asset_img 10.webp "管理部屬作業" %}
4. 按鉛筆"編輯"> 建立新版本
5. 就會部屬新的版本囉~

---

如果單純只是要測試
如果要更新表單，請按照以下步驟
1. 先"儲存" (ctrl + s)
2. 按執行
3. 點擊剛剛的"部屬">"測試部屬作業"
{% asset_img 10.webp "測試部屬作業" %}
4. 就可以看到測試的結果囉~

---

### BUG
先前在製作的時候，遇到一個奇怪的 BUG，如果 Google 內有多個帳戶登入的時候，表單就會開不起來，必須使用無痕模式才開得起來。

後來嘗試調整"執行身份的設定"就可以使用了。
{% asset_img 12.webp 設定 %}

---

## 結語：
通過這個表單的例子，我們介紹了如何使用 Google Apps Script 建立一個具有自動完成功能的表單應用程式。這個應用程式不僅能夠讓你輕鬆收集群眾的資訊，還提供了良好的使用者體驗和資料管理功能。無論你是需要舉辦活動、進行調查，還是收集任何類型的資料，只要稍微修改這個表單應用程式都能夠滿足你的需求。讓我們利用自動完成功能的便利，提升資料收集的效率和準確性吧！

## 宣傳：

<p style="font-size:1.1rem;color:#5ff;text-align:center">
如果有自動化流程的需求，歡迎寄信到 <a href="mailto:michaelink24@gmail.com" style="color:#5ff;text-decoration:underline">michaelink24@gmail.com</a>
</p>