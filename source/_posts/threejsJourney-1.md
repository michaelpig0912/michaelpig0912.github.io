---
title: 嘗試跟著 three.js Journey 學 three.js (學習紀錄)
katex: true
date: 2024-01-29 07:38:30
categories: code
tags: 
  - javascript
  - html
  - code
  - three.js
cover: pinkDemo.webp
---

## 前言 

最近與朋友討論了一些未來計畫，其中需要一個是需要讓網站可以展示 3D 模型功能。由於之前接觸過一些 AR 專案，曾經使用過 three.js，但發現我在這方面的知識還相當有限。因此，最近我開始深入研究有關 three.js。

在 three.js 的官網上有推薦 three.js Journey 的課程，結合 reddit 的網友的回饋，因此就直接買下去了。

## 基本資訊

1. 課程網址：[three.js Journey](https://threejs-journey.com/)
2. 購買價格：USD $95，實際刷卡金額為 NTD 2990 元
3. 推薦指數：8/10

### 優點

1. 淺顯易懂的說明，滿適合初學者。
2. 老師上課的方式滿有趣的，會帶著學生一步一步的操作，以及會簡單提到背後的原理。
3. 該課程中包含 react 跟 blender 的內容，不過我目前還沒上到那邊。
4. 有會員專屬的 discord 頻道，有任何問題都可以在那邊發問。
5. 課程會因應版本更新，會提醒那些地方跟以前不一樣。

### 缺點

1. 字幕有不同國家的語言，不過沒有中文，所以只能看英文的字幕，老師主要講解的語言為英文。
2. 整體速度偏慢，不過有文字版的教學內容可以看。

以下將不會將課程內容詳細放上來，只會大致說明我學到了哪些東西以及一些成果的展示。
希望這個簡單的回顧對您有所幫助。

## 課程內容
從基本的 three.js 的物件如何使用，到一些特效和物理碰撞之類的。詳細的課程可以參考 [three.js Journey](https://threejs-journey.com/)的官網，

我目前上完第一章節的基礎操作，了解基本 three.js 使用方式，及不同類型的材質會造成什麼不同的功能，還有介紹基本的網站部屬方式等，發現 three.js 可以做的事情好多，而且對於裝置的需求不高，感覺未來可以使用在開發線上教具方面，做出類似 PHET 的網站。

下面是跟著課程做的範例~

- [3D 文字效果](https://michaelpig0912.github.io/sideProject/threejs/text3D/index.html)
    {% asset_img  blueDemo.webp 結合文字與材質的文字 %}
    {% asset_img  pinkDemo.webp 重新整理會放入不同材質~ %}

- [材質測試](https://michaelpig0912.github.io/sideProject/threejs/materials/index.html)
    {% asset_img  transMat.webp 毛透明效果 %}
    {% asset_img  metalMat.webp 金屬效果 %}