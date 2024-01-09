---
title: 可以快速下載網站中所有圖片的 chrome 擴充功能
katex: true
date: 2023-11-28 23:04:54
categories: code
tags:
  - javascript
  - html
  - code
  - chrome extension
cover: install-4.webp
---

## 前言

先前有同事想要一個可以自由下載網站圖片的程式，因此我做了一個 chrome 擴充功能。這個擴充功能可以讓一鍵下載網站中的所有圖片，並且可以下載到你要的資料夾內，並且可以透過圖片的最小尺寸作為篩選。

在這篇文章中，我會介紹這個擴充功能的安裝方式、使用方式及程式碼。

---

## 安裝方式

因為目前這個程式還沒上到 google 的商店上面，因此要使用手動的安裝方式，以下將講解如何裝這個擴充功能。

未來如果有機會申請 google 商城上去，讓大家可以更方便的安裝。

### 下載文件

先下載下面的文件，並且解壓縮。
- [程式下載(github)](https://github.com/michaelpig0912/webImageDownloader/releases/tag/release)

### 開啟擴充功能選單

點選 "擴充功能" > "管理擴充功能"

{% asset_img install-1.webp 點選 "擴充功能" > "管理擴充功能" %}

### 開啟開發人員選項

打開網頁右上方的"開發人員選項"，並且會看到下面多一欄選項

{% asset_img install-2.webp 打開"開發人員選項" %}

### 載入未封裝項目

點選 "載入未封裝項目"，選擇剛剛下載後，解壓縮的資料夾。

{% asset_img install-3.webp 點選 "載入未封裝項目" %}

### 安裝完成

安裝完成就會看到下面的這個擴充程式

{% asset_img install-4.webp 安裝完成 %}

---

## 使用方式

你可以在彈出視窗中輸入你想要的資料夾名稱，以及最小的圖片寬度（以像素為單位），這個是避免載到一些網站的 ICON，建議可以調到 600 px 以上，然後點擊下載按鈕，就可以開始下載圖片了。

{% asset_img use-1.webp 輸入資料 %}

{% asset_img use-2.webp 開始下載 %}

然後從 chrome 預設下載的路徑中就可以看到剛剛下載的資料夾。

{% asset_img use-3.webp 下載的資料夾 %}

---

## 程式碼

圖片下載器的程式碼主要由以下幾個部分組成：
```
|-- webImageDownloader
    |-- background.js
    |-- content.js
    |-- manifest.json
    |-- popup.html
    |-- popup.js
    |-- images
        |-- icon16.png
        |-- icon48.png
        |-- icon128.png
```

### popup.html

這個html，定義了擴充功能的彈出視窗的內容和樣式，包括一個文本框，一個數字框，和一個按鈕，用於讓用戶輸入資料夾名稱和最小的圖片寬度，然後下載圖片。這個檔案也引用了一個 popup.js ，用於處理用戶的操作和與其他部分溝通。

```html
<!doctype html>
<html>
<meta charset="utf-8">
<style>

html, body {
  width: 400px; 
  height: 170px; 
  overflow: auto; 
}

  body {
  font-family: 'Arial', sans-serif;
  margin: 10px;
  background-color: #555;
  color: #aaa;
}

input[type=text], input[type=number] {
  width: calc(100% - 22px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #aaa;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #eee;
}

button {
  width: calc(100% - 22px);
  padding: 10px;
  background-color: rgb(46, 69, 107);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #194ca0;
}

button:active {
  background-color: #1e3f86;
}

#download {
  margin-top: 10px;
}

</style>

  <head><title>Image Downloader</title></head>
  <body>
    <input type="text" id="folderName" placeholder="Enter folder name">
    <input type="number" id="minWidth" placeholder="Minimum image width (px)">
    <button id="download">download Image</button>
    <script src="popup.js"></script>
  </body>
</html>
```
### manifest.json
這個 JSON 定義了擴充功能的基本資訊，如名稱，版本，權限，圖示，動作，背景服務，和內容腳本等。

```JSON
{
  "manifest_version": 3,
  "name": "webImageDownloader",
  "version": "1.0",
  "permissions": ["activeTab", "downloads", "scripting"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}

```

### content.js

這個 JavaScript 是擴充功能的內容腳本，它負責在每個網頁中執行一些操作，如監聽來自背景服務的訊息，並且根據用戶設定的最小尺寸，過濾和收集網頁中的圖片的網址，然後回傳給背景服務。

```JavaScript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractImages") {
    const minSize = request.minSize;
    const images = Array.from(document.querySelectorAll('img')).filter(img => {
      return img.naturalWidth >= minSize && img.naturalHeight >= minSize;
    }).map(img => img.src);
    chrome.runtime.sendMessage({action: "downloadImages", images: images});
  }
});

```

### popup.js

這個 javaScript 是擴充功能的彈出視窗的邏輯，它負責監聽用戶的點擊事件，並且向背景服務或內容腳本發送訊息，請求執行下載圖片的動作。

```JavaScript
document.getElementById('download').addEventListener('click', () => {
  const folderName = document.getElementById('folderName').value;
  const minWidth = document.getElementById('minWidth').value;
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0];
    chrome.runtime.sendMessage({
      action: "downloadImages",
      tabId: activeTab.id,
      folderName: folderName,
      minWidth: minWidth
    });
  });
});
```

### background.js

這個 JavaScript 檔案，是擴充功能的背景服務，它負責在背景中執行一些持續性或事件驅動的任務，如監聽來自彈出視窗或內容腳本的訊息，並且調用 chrome API 來下載圖片，或者向內容腳本發送訊息，請求提取圖片的網址。

```JavaScript
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed and running.');
});

// 監聽來自popup.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadImages") {
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      function: findImages
    }, (results) => {
      // results[0].result 是所有圖片的URL數據
      for (const url of results[0].result) {
        chrome.downloads.download({ url: url });
      }
    });
  }
});

// 在頁面上執行以找到所有的圖片
function findImages(minWidth) {
  const images = document.querySelectorAll('img');
  return Array.from(images)
    .filter(img => img.naturalWidth >= minWidth)
    .map(img => img.src);
}

// 監聽來自popup.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadImages") {
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      func: findImages,
      args: [parseInt(request.minWidth)]
    }, (results) => {
      if (results && results[0] && results[0].result) {
        for (const url of results[0].result) {
          chrome.downloads.download({
            url: url,
            filename: request.folderName ? `${request.folderName}/${url.split('/').pop()}` : url.split('/').pop()
          });
        }
      }
    });
  }
});
```