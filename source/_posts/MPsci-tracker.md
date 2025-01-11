---
title: 運動追蹤分析系統_MPsci
katex: true
date: 2024-11-03 22:16:33
categories: science
tags:
  - science
  - newtonian mechanics
  - physics
  - 九上
  - 直線運動
cover: analyze.webp
---

## 介紹

這個網頁主要用於國中物理九年級的教學或運動分析，可以幫助使用者分析物體的運動軌跡、速度和加速度等物理量。裡面將水平與垂直分開來，可以看到物體在水平與垂直的運動情形。裡面的圖表可以匯出成 CSV 檔案，方便使用者進行後續的數據處理。

## 軟體演示

<div style="text-align:center;position: relative;width: 100%;padding-bottom: 70%;height: 0;overflow: hidden;">

<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="https://www.youtube.com/embed/HzDPFuGm6Ck" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## 立即使用

<div style="text-align: center;">
<a href="https://michaelpig0912.github.io/sideProject/MPsci/tracker_V101.html" class="button-link_1" style="display: inline-block; padding: 10px 20px; background-color: #7272ff; color: white; text-decoration: none; border-radius: 5px;  transition: background-color 0.3s, transform 0.3s; ">
  立即使用 運動追蹤分析系統 Ver 1.0.1
</a>
</div>

## 版本更新

- 1.0.1 版本：
  - 實現基本功能，單位校正、追蹤顏色與邏輯、不同的分析模式，自動追蹤、軌跡的不同顯示方式及匯出圖片跟可以分析的數據(包含位移、速度、加速度)。

## 主要特點

1. **影片上傳與播放**
   - 可上傳本地影片檔案
   - 行動裝置可以直接拍攝影片

2. **物體追蹤功能**
   - 自動追蹤模式:根據選定的顏色自動追蹤物體
   - 手動追蹤模式:手動點選物體位置進行追蹤
   - 可調整追蹤容許誤差
   - 支援軌跡顯示/淡出/隱藏

3. **單位校正功能**
   - 可設定實際距離與單位

4. **數據分析與圖表**
   - 位置-時間圖(X-T和Y-T圖)
   - 速度-時間圖(Vx-T和Vy-T圖)
   - 加速度-時間圖(Ax-T和Ay-T圖)

5. **數據匯出**
   - 可匯出追蹤軌跡圖
   - 可匯出分析數據(CSV格式)

6. **特殊功能**
   - PWA支援，可以將網頁加入主選單，就會轉換成 APP，可以離線使用，無需網路。

## 操作說明

### 實驗場地

1. 建議在背景較為單純的環境下使用，並且拍攝範圍內不要出現相同顏色的物體，以免影響追蹤的結果

2. 請使用腳架固定裝置，避免移動造成拍攝的晃動

{% asset_img stage.webp 相對簡單的背景，特別顏色的球 (雖然這個背景有點多東西 XD) %}

### 操作介面

1. 影片上傳
   - 點擊「選擇檔案」按鈕上傳影片
   - 支援本地影片檔案或行動裝置直接拍攝

    {% asset_img Import.webp 影片上傳 (行動裝置可以直接錄影) %}

2. 單位校正
   - 點擊「長度單位校正」按鈕
   - 在影片中點選兩個點來設定參考距離
   - 輸入實際距離和單位(如 1 m、100 cm 等)
   - 點擊「OK」確認

    {% asset_img measure_1.webp 單位校正 (選擇兩個點) %}

    {% asset_img measure_2.webp 輸入實際距離，建議使用公尺為單位 %}

3. 設定追蹤顏色
   - 選擇追蹤顏色：點擊影片中要追蹤的物體，它的顏色會自動填入
    {% asset_img color.webp 選擇追蹤顏色 %}

4. 調整容許誤差
   - 使用滑桿調整追蹤的顏色的誤差，誤差越小，追蹤越精確，不過可能會有追蹤失敗的狀況
   - 建議誤差設定在 8~15 之間

5. 選擇追蹤模式
   - 自動追蹤：系統自動追蹤選定顏色的物體
   - 手動追蹤：手動點選物體位置

    | 模式 | 說明 | 示範圖 |
    |----------|------|----------|
    | 自動追蹤 | 系統自動追蹤選定顏色的物體 | {% asset_img analyze.webp %} |
    | 手動追蹤 | 需手動點選物體位置，需要自己控制時間軸 | {% asset_img manual.webp %} |

6. 「分析模式」切換精細/快速分析
    - IOS 建議使用精細模式，不然數據點會出現錯誤。
    - 電腦可以使用快速分析，可以節省比較多時間。
    - 快速分析可能會因為裝置效能，每次所出現的數據會有所不同。
    - 快速分析接近影片的 real-time 速度，精細分析可能是原影片的 1/2 速度。

7. 軌跡模式
    - 使用「軌跡模式」按鈕切換軌跡顯示方式（顯示/淡出/隱藏）

    | 軌跡模式 | 說明 | 示範圖 |
    |----------|------|----------|
    | 顯示 | 顯示軌跡 | {% asset_img all.webp %} |
    | 淡出 | 軌跡會隨著時間逐漸淡出 | {% asset_img fade.webp %} |
    | 隱藏 | 軌跡會消失，只保留一個點 | {% asset_img off.webp %} |

8. 開始追蹤
    - 點擊「開始追蹤」按鈕就會開始追蹤，並且顯示軌跡。如果追蹤效果不好，請調整誤差值或是重新點選顏色。

9. 查看分析結果
   - 切換不同的圖表頁籤查看分析結果：位置圖表、速度圖表、加速度圖表
    {% asset_img analyze.webp 分析結果 %}

10. 重新開始
    - 每次生成完數據後，請記得點擊「重新開始」按鈕來清除所有數據。不要直接按開始追蹤，不然會出現圖表重疊的異常狀況。

11. 數據匯出
    - 點擊「匯出軌跡圖」保存追蹤軌跡的圖片
    - 點擊「匯出數據」下載 CSV 格式的分析數據

## ⚠️已知問題

1. 手動追中的播放功能會在精細模式下失效，只能透過逐幀點選物體位置。如果要播放功能，請切換到快速模式。

2. IOS 使用「快速模式」會出現異常的線條 (時間會回朔)，推測可能是跟 IOS 的影片處理有關，因此建議不要使用「快速模式」。

3. 畫面中如果有相同顏色的物體，會無法正確追蹤。

4. 偶爾運行會抓不到畫面，可以重新選擇顏色再試試。

5. 如果影片是使用慢速攝影，會需要將影片的慢速攝影調整回正常速度在進行分析，不然會出現錯誤的數據。

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
