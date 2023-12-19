title: 不知道要吃什麼嗎？做一個食物的選擇小工具吧!
cover: food.webp
categories: code
tags:
  - javascript
  - html
  - code

date: 2023-02-11 02:30:00
---
## 先來看一下效果吧
<style>
  #random-button {
    background-color: #06C167;
    border: none;
    color: black;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
  }
</style>

<p>點擊下面的按鈕以獲取一個隨機店家：</p>
<div><button id="random-button">今天我想來點</button></div>
<div id="name-display"></div>

<script>
  var names = ["便當店", "吃麵", "吃早餐店"];
  var randomButton = document.getElementById("random-button");
  var nameDisplay = document.getElementById("name-display");

  randomButton.addEventListener("click", function() {
    var randomName = names[Math.floor(Math.random() * names.length)];
    nameDisplay.textContent = randomName;
  });
</script>

## 接下來看程式碼內容

這個網址使用 JavaScript 隨機選擇現有名單中的一個店家。

```javascript=
// 將店家列表保存在一個陣列中
var names = ["名字1", "名字2", "名字3", "名字4", "名字5"];

// 在按鈕點擊時選擇一個隨機店家
document.getElementById("random-button").addEventListener("click", function() {
  // 從店家列表中選擇一個隨機店家
  var randomName = names[Math.floor(Math.random() * names.length)];

  // 在網頁上顯示所選店家
  document.getElementById("name-display").textContent = randomName;
});
```

在HTML中，要添加一個按鈕來顯示所選店家：
```html=
<button id="random-button">隨機選擇</button>
<div id="name-display"></div>
```
這樣，當點擊按鈕時，JavaScript代碼會從店家列表中選擇一個隨機名字並顯示在網頁上。

## 完整程式碼範例
以下可以自己用記事本做的小網站

```html=
<!DOCTYPE html>
<html>
<head>
  <title>隨機店家產生器</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    #random-button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 10px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>隨機店家產生器</h1>
  <p>點擊下面的按鈕以獲取一個隨機店家：</p>
  <button id="random-button">選擇店家</button>
  <p>所選店家：</p>
  <div id="name-display"></div>

  <script>
    var names = ["名字1", "名字2", "名字3", "名字4", "名字5"];
    var randomButton = document.getElementById("random-button");
    var nameDisplay = document.getElementById("name-display");

    randomButton.addEventListener("click", function() {
      var randomName = names[Math.floor(Math.random() * names.length)];
      nameDisplay.textContent = randomName;
    });
  </script>
</body>
</html>
```
