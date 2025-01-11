---
title: 物體軌跡記錄器_MPsci
katex: true
date: 2024-10-19 12:37:47
categories: science
tags:
  - science
  - newtonian mechanics
  - physics
  - 九上
  - 直線運動
cover: result_2.webp
---

## 介紹

很久以前跟輔導團的老師的共備會議中，討論到如何讓學生理解物體的運動軌跡。老師提出在課堂實驗中，會讓學生用相機拍攝物體的運動軌跡，然後用 APP 將照片疊加起來，這樣就可以看到物體的運動軌跡。

不過聽到這個使用方法後，我想到的是因為很多學校會因為安全性的考量，會將平板中下載 APP 的權限關閉，這樣一來，學生就無法使用 APP 進行拍攝，因此我就想說來寫一個網頁版的物體軌跡記錄器，學生就可以在課堂上直接使用瀏覽器進行拍攝與紀錄。

這個程式碼的由來是使用 cursor 與 claude 3.5 模型進行撰寫。

## 軟體演示

<div style="text-align:center;position: relative;width: 100%;padding-bottom: 70%;height: 0;overflow: hidden;">

<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="https://www.youtube.com/embed/r-qy2Qy-qJU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## 立即使用
<div style="text-align: center;">
<a href="https://michaelpig0912.github.io/sideProject/MPsci/persistenceVision_V101.html" class="button-link_1" style="display: inline-block; padding: 10px 20px; background-color: #7272ff; color: white; text-decoration: none; border-radius: 5px;  transition: background-color 0.3s, transform 0.3s; ">
  立即使用 物體軌跡記錄器 Ver 1.0.1
</a>
</div>
<br>

<div style="text-align: center;">

<a href="https://michaelpig0912.github.io/sideProject/MPsci/persistenceVision_beta.html" class="button-link_2" style="display: inline-block;  padding: 10px 93px; background-color: #333333; color: white; text-decoration: none; border-radius: 5px;  transition: background-color 0.3s, transform 0.3s;">
  🌙  beta 版本
</a>
</div>


## 版本更新

- 1.0.1 版本：
  - 實現基本功能，包括多重曝光拍攝、自定義倒計時、相機選擇、畫面旋轉、即時預覽、疊加圖像生成、測量工具和圖像下載。

## 主要特點

1. **物理實驗**：記錄和分析物體的運動軌跡，如自由落體、拋物線運動等。

2. **隱私安全**：本程式不會收集任何個人資料，也不會將資料傳送到任何伺服器。

3. **多重曝光拍攝**：通過設定連拍張數和間隔時間，捕捉物體的運動軌跡。

3. **自定義倒計時**：為每次拍攝設置倒計時，確保單人的情況下也可以順利操作。

4. **相機選擇**：包括前置和後置攝像頭，適用於各種裝置。

5. **畫面旋轉**：提供 0°、90°、180° 和 270° 四種旋轉選項，滿足不同的拍攝角度需求。

6. **即時預覽**：拍攝完成後，可以立即在照片條中查看所有捕獲的圖像。

7. **測量工具**：在查看圖片時，可以使用內置的測量工具來計算圖像中的像素距離。

8. **疊加圖像下載**：測量完畢後，可以下載自動生成一張包含完整運動軌跡的疊加圖像。，方便後續分析和分享

9. **跨平台使用**：基於 HTML5 和 JavaScript 開發，無需安裝，跨平台兼容。

10. **PWA 支援**：支援 PWA 功能，可以安裝到手機或平板的桌面，並在離線情況下使用。

## 操作說明

### 實驗場地

1. 讓物體與背景有明顯的對比，白球配黑色背景或是黑色球配白色背景等，這樣比較容易判斷物體的軌跡。
2. 請使用腳架固定裝置，避免移動造成拍攝的晃動。

{% asset_img stage.webp 白球配黑色背景 %}

### 操作介面

0. 給予拍攝的權限
1. 設定相機：可以選擇前置或後置相機
2. 設定連拍張數
3. 設定拍攝間隔時間
4. 設定倒數計時
5. 設定畫面旋轉：可以選擇 0°、90°、180°、270°
6. 點擊開始拍攝：就會開始倒數，倒數完後就會開始拍攝。

   {% asset_img cover.webp 操作介面 %}

### 看拍攝的結果

1. 可以點擊下方的圖片，查看拍攝的結果。最後一張圖片會是包含所有軌跡的圖片。
   {% asset_img result_1.webp 拍攝的結果 %}
2. 可以看到連拍的結果。
   {% asset_img result_4.webp 連拍結果 %}
3. 疊圖效果會是這樣，
   {% asset_img result_2.webp 疊圖結果，會看到灰白的軌跡 %}
4. 點擊兩個點會自動出現量測的線，單位是 px ，透過這個就可以換算成實際的比例。
   {% asset_img result_3.webp 點擊兩個點會自動出現量測的線 %}
5. 按右上角的按鈕可以下載疊圖完後的圖片。

### 設定離線使用

#### iPad 

1. 按右上角有一個箭頭向上的按鈕
   {% asset_img PWA_1.webp 右上角有一個箭頭向上的按鈕 %}
2. 選擇加入主畫面
   {% asset_img PWA_2.webp 選擇加入主畫面 %}
3. 點選加入主畫面。
   {% asset_img PWA_3.webp 加入桌面 %}
4. 回到桌面就可以看到一個相關的捷徑，這個捷徑就可以離線使用。
   {% asset_img PWA_4.webp 離線使用 %}

#### iPhone

|1. 手機版的畫面|2. 加入主畫面|3. 手機桌面新增捷徑|
| :----: | :----: | :----: |
|{% asset_img PWA_5.webp %}|{% asset_img PWA_6.webp %}|{% asset_img PWA_7.webp%}|

## 疊加原理

1. **自動透明度調整**
   - 系統會根據拍攝張數自動計算每張圖像的透明度。
   - 透明度 = min(0.3, 1 / (總張數 - 當前張數 + 1))
   - 這確保了即使在大量圖像疊加時，也能清晰地顯示運動軌跡。

2. **差分圖像技術**
   - 通過比較相鄰兩幀圖像的差異，突出顯示運動物體。
   - 差分閾值設置為 25，有效過濾微小變化和噪聲。
   - 結果是一個清晰的運動軌跡，同時減少了背景干擾。

3. **最終合成圖像處理**
   - 在疊加過程完成後，系統會生成一張不透明的最終圖像。
   - 首先繪製白色背景，然後將多重曝光圖像疊加其上。

## ⚠️已知問題

1. 發現在拍照的間隔時間會有 100 ms 左右的誤差。

2. 在 iOS 裝置上，如果沒有給予相機權限，會無法使用。

3. 在 PC 上，如果沒有給予相機權限，請依照以下步驟：

   {% asset_img ban_1.webp 出現這個錯誤的選項 %}
   {% asset_img ban_2.webp 按左上角的按鈕 > 網站設定 %}
   {% asset_img ban_3.webp 給予攝影機權限 %}

## 回饋

如果您在使用過程中遇到任何問題或有任何建議，歡迎在下方留言區與我們分享。盡快進行修正或改進。同時，如果您有新功能的想法或需求，也請不吝告訴我們。您的意見對我們來說非常寶貴，我們將努力使這個工具變得更加完善和實用。

這個程式更新的時候，會保留舊的版本，所以不用擔心以後的版本會不會壞掉。


<style>
.button-link_1:hover {
  background-color: #3030AA !important;
  transform: scale(1.05);
}

.button-link_2:hover {
  background-color: #222 !important;
  transform: scale(1.05);
}
</style>