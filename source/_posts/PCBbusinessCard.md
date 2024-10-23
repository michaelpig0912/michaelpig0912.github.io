---
title: 如何設計一張具有 NFC 功能的 PCB 名片，從 kicad 到 JLCPCB 製作
katex: true
date: 2024-04-15 00:32:34
categories: maker
cover: 15_15_blender.webp
tags:
  - maker
  - pcb
---

最近在研究電路板要如何送廠商製作，剛好看到在 instructables 上一個電路板的專案：[PCB Business Card With NFC](https://www.instructables.com/PCB-Business-Card-With-NFC/)，所以就參考了他的接線邏輯，再透過 kicad 自己規劃設計圖與給廠商製作。

下面是成品的名片：

{% asset_img cover.webp 名片外觀 %}

{% asset_img ledLight.webp 具有 NFC 跟 LED 發光功能的名片(部分資訊模糊處理)%}

## 繪製電路圖

### 放置元件

1. 參考 [PCB Business Card With NFC](https://www.instructables.com/PCB-Business-Card-With-NFC/) 的接線邏輯，不過因為 kicad 沒有 NFC 天線的 footprint，所以用其他的天線(antenna Loop)取代 NFC 天線。
   {% asset_img 1_schematic.webp 用其他的天線(antenna Loop)取代 %}

2. 接著選擇所有使用的元件，這邊要選好，之後做 PCB Layout 才會有接點可以使用。
   {% asset_img 2_element.webp 使用這些元件，天線是用別人現成的天線 footprint %}

### 修改天線定義

1. 對天線按右鍵
{% asset_img 3_1_antennaSet.webp 對天線按右鍵 %}

2. 修改引腳名稱為P$1、P$2
{% asset_img 3_2_antennaSet.webp 修改引腳名稱為P$1、P$2 %}

3. 進行 DRC 檢查以確保設計符合製造規範。

## 畫 layout

1. 進入 PCB 模式，將元件放上
{% asset_img 4_1_toPCB.webp 進入 PCB 模式，將元件放上 %}

2. 將原理圖更新到 PCB 上
{% asset_img 4_2_pcbElement.webp 將原理圖更新到 PCB 上 %}

3. 調整元件位置
{% asset_img 4_3_pcbElement.webp 調整元件位置 %}

|電路板層圖示|說明|
|---|-------------|
|{% asset_img 5_layer.webp %} | 1. F_Cu：正面的銅層 <br> 2. B_Cu：背面的銅層 <br> 3. F.Silkscreen：正面的絲印層，用於印刷文字和圖案 <br> 4. B.Silkscreen：背面的絲印層 <br> 5. F.Mask：正面的阻焊層，用於防止不需要焊接的區域被焊錫覆蓋 <br> 6. B.Mask：背面的阻焊層 <br> 7. Edge.Cuts：電路板的外形切割線 <br> 8. F.Paste：正面的錫膏層，用於 SMT 元件的焊接 <br> 9. B.Paste：背面的錫膏層 | 


### 畫切割層，並且畫出圓角

1. 選擇切割層 Edge.Cuts

   {% asset_img 6_2_cutEdge.webp 切換成切割層 %}

2. 用圓形工具畫出圓角
   {% asset_img 6_3_cutEdge.webp 用圓形工具畫出圓角 %}

3. 調整元件的位置，將天線放成直的，這樣比較好看一點。
   {% asset_img 6_6_cutEdge.webp 稍微調整天線的位置 %}

### 正面絲印層增加LOGO跟圖案

現在要來在正面絲印層增加LOGO跟圖案。

1. 選擇正面絲印層 F.Silkscreen
   {% asset_img 7_1_LOGOText.webp 將文字添加在 F.Silkscreen 上 %}

2. 輸入LOGO名稱
   {% asset_img 7_3_LOGOText.webp 輸入LOGO名稱 %}

### 調整元件放置的位置

1. 接下來，要進行拉線，會看到白色的線，這是預設的線，我們要用快捷鍵 `X` 來畫線。

   {% asset_img 8_1_putElement.webp 畫上線 %}

2. 劃出的線盡量不要有太大的彎折，可能會影響到電路的功能。此外，因為我做的是雙層電路板，所以如果遇到走不過去的線路，可以按"V" 來製作通孔，讓線路可以從另一面穿過去。
   
   {% asset_img 9_1_putLine.webp 畫出線 %}

3. 拉好線跟製作好通孔後，目前完成的樣子
   {% asset_img 9_2_putLine.webp 目前完成的樣子 %}

### 放置圖案

1.接下來放置 QRcode，這邊是用 kicad 的內建的圖片轉換器來幫忙達成。
  {% asset_img 10_1_putIcon.webp 圖片轉換器 %}

2. 選擇圖片，調整黑白選項(只能使用黑白的)，並且將 PCB 層改成頂層絲印，輸出格式改成 .kicad_mod 檔案，最後按下匯出到剪貼簿。
{% asset_img 10_2_putIcon.webp 圖片設定 %}

3. 接著在 PCB 模式下，直接 Ctrl+V，就會看到圖片出現在 PCB 畫面上。(如果層放錯位置，可以點兩下圖片，進行絲印層的調整)
   {% asset_img 10_3_putIcon.webp 將圖片放在 PCB 上 %}

4. 調整圖片位置，並且放大到適合的大小
   {% asset_img 10_4_putIcon.webp 將元件放上 %}

### 裝飾與預覽

1. 預覽完成後，可以進行預覽，檢查是否有錯誤。
   {% asset_img 11_2_decorate.webp 將元件放上 %}

2. 這邊有用直線工具畫出一把尺，不過我想要讓尺的刻度是金屬的，所以可以先在銅層上面畫尺，然後將mask層刪除，只保留底下的銅層。
   {% asset_img 11_1_decorate.webp 請注意背面會看起來是反的 %}

3. 預覽完成後，可以進行可以進入 "3D" 模式，檢查是否有錯誤。
   {% asset_img 11_3_decorate.webp 將元件放上 %}

4. 接著就會看到你的電路板成品，不過現在想要將電路板改成黑色的。
   
   {% asset_img 11_4_decorate.webp 電路板預覽 %}
   {% asset_img 11_5_decorate.webp 在右邊選單，改變電路板顏色為黑色的 %}

5. 現在電路板看起來很有暗暗的很有質感，而且可以看到 LOGO 的地方還有一顆 LED。
   {% asset_img 11_7_decorate.webp 名片正面 %}
   {% asset_img 10_5_putIcon.webp 名片背面 %}

## 安裝外掛與上傳到 JLCPCB

### 安裝外掛

1. 接著要安裝外掛，請點"外掛和工具管理器"
   {% asset_img 12_1_plugin.webp 外掛和工具管理器 %}

2. 因為我們預計要使用的是 JLCPCB 的服務，所以在外掛的地方找到 Fabrication Tookit ，並且安裝。

   {% asset_img 12_2_plugin.webp 將元件放上 %}

3. 安裝完成後，回到 PCB 模式，請點右上角的 "Fabrication toolkit"。
   {% asset_img 12_3_plugin.webp 將元件放上 %}

4. 請點" Generate "。
   {% asset_img 12_4_plugin.webp 產生工廠用的圖檔 %}

5. 接著會看到生成許多的檔案，請點入 bom.csv
   {% asset_img 12_5_plugin.webp 接著會看到生成許多的檔案，請點入 bom.csv %}

6. 可以從 [LCSC](https://jlcpcb.com/parts) 找到使用的元件的編號，並且填入 bom.csv 中。
   {% asset_img 12_6_plugin.webp 接著到 LCSC 找到使用元件的編號，與看 JLCPCB 的價格與庫存 %}

### 上傳 JLCPCB

1. 到 [JLCPCB 的官方網站](https://jlcpcb.com/)上傳檔案
   {% asset_img 13_1_JLCPCB.webp 到 JLCPCB 的官方網站上傳檔案 %}

2. 選擇要製作的電路板類型規格，這邊我會習慣把移除訂單號碼的選項勾起來，這樣就不會有訂單號碼印在電路板上。
   {% asset_img 13_3_JLCPCB.webp 選擇要製作的電路板的規格 %}

3. 右邊會計算大概的金額，但是目前還沒有計算 SMT 的費用。我這邊 SMT 選擇 Econmic PCBA price。不過這個選項對於材質有很多限制，可以實際調整看看。之前測試大約 10 片加 SMT 費用大約一千多台幣，平均下來一片大約 100 台幣。不過做的量越多，平均下來越便宜。

   {% asset_img 13_2_JLCPCB.webp 計算大概的金額 %}

### 上傳 SMT 資料

1. 接著進入到 SMT 的頁面，選擇要放元件的面，這邊選擇正面。
   {% asset_img 14_1_SMT.webp 將元件放上 %}

2. 下面有一些 SMT 的進階選項。
   {% asset_img 14_2_SMT.webp 進階選項 %}

3. 再次確認你的電路板的狀況，如果都沒問題，就可以按下"next"。
   {% asset_img 14_3_SMT.webp 將元件放上 %}

4. 請你上傳剛剛的 bom.csv 檔案到 Add BOM file 跟生成的 position.csv 檔案到 Add CPL file。
   {% asset_img 14_4_SMT.webp 上傳 bom.csv 檔案 %}
   {% asset_img 14_5_SMT.webp 選擇檔案 %}

5. 接著會看到請你確認元件規格、庫存與價格，如果都沒問題，按旁邊的 Select，就可以按下"next"。
   {% asset_img 14_6_SMT.webp 確認元件規格 %}

6. 不過這邊可能會跳一個錯誤訊息，因為我們的天線雖然是一個元件，但是他是直接印在電路板上，因此不會有額外的元件。
   {% asset_img 14_7_SMT.webp 因此可以直接跳過選擇 Do not place %}

7. 接著你會看到元件擺放在你做的電路板上面了，請注意元件的方向是否正確，可以用上方的工具旋轉。
   {% asset_img 14_8_SMT.webp 元件擺放在電路板上 %}
   {% asset_img 14_9_SMT.webp 請注意元件的方向是否正確。 %}

8. 最後確認電路板的金額，如果都沒問題，選擇此電路板的功能後，就可以按下"save to cart"。
   {% asset_img 14_10_SMT.webp 訂單確認 %}

9. 接著可以會到付款頁面，運費寄來台灣大約是 20 鎂，大約一個禮拜左右就會到貨了，寄送地址可以填寫中文。然後目前貨物的狀況都會很清楚的顯示在網站上。
   {% asset_img 14_11_SMT.webp 物流狀態 %}

## 額外：電路板轉進 blender

接下來，講解如何將電路板的 3D 模型轉進 blender 中。

1. 首先到外掛和工具管理器，下載外掛
   {% asset_img 15_1_blender.webp 下載外掛 %}

2. 接著回到 kicad 的 PCB 模式，選擇上方 "Blender" 的圖示，點入後選擇匯出路徑，按下 Export。
   {% asset_img 15_2_blender.webp 選擇上方 "Blender" %}
   {% asset_img 15_3_blender.webp 選擇匯出路徑，按下 Export %}

3. 到 [pcb2blender](https://github.com/30350n/pcb2blender) 下載 blender 的外掛檔案。

4. 進入到 blender 後，選擇"preferences"，選擇"get extensions"，在右上角選擇"install from disk"，選擇剛剛下載的 pcb2blender 壓縮檔。
   {% asset_img 15_5_blender.webp 選擇 preferences %}
   {% asset_img 15_6_blender.webp 選擇 get extensions > install from disk %}
   {% asset_img 15_7_blender.webp 安裝好 PCB 3D Importer 後就會在這邊看到%}

5. 接著選擇"PCB 3D Importer"，匯入".pcb3d"，選擇剛剛匯出的 pcb 檔案，按下"import"。
   {% asset_img 15_8_blender.webp 匯入 pcb 檔案 %}

6. 接著把中間的方塊刪除後，就可以看到電路板已經匯入到 blender 中。
   {% asset_img 15_9_blender.webp 匯入 pcb 檔案 %}

7. 進到渲染模式，就可以看到電路板已經匯入到 blender 中，不過這時候電路板還是綠色的，需要調整顏色。
   {% asset_img 15_10_blender.webp 渲染模式 %}

8. 接著進入 shader 模式，點選"電路板"，下方有一個選項可以改變電路板顏色。
   {% asset_img 15_11_blender.webp 改變電路板顏色 %}
   {% asset_img 15_12_blender.webp 改成黑色 %}

9. 回到 layout 模式，現在來改 LED 的材質與發光。PCB 3D Importer 中提供了多種材質可以選擇。
   {% asset_img 15_13_blender.webp 將外殼可以調成透明的 %}

10. 將 LED 的材質改成透明的，內部改成發光模式，然後稍微調整一下光源，就可以得到以下的成品圖。我覺得渲染的效果很好，電路板上的痕跡都清楚的呈現出來。
    {% asset_img 15_15_blender.webp 成品圖 %}

## 參考資料

1. 本設計參考：[PCB Business Card With NFC](https://www.instructables.com/PCB-Business-Card-With-NFC/)

2. 天線電路圖：[Where to find NFC Class 6 antenna PCB Schematic for KiCad](https://forum.kicad.info/t/where-to-find-nfc-class-6-antenna-pcb-schematic-for-kicad/30212/2)，使用 albin 網友所改良的設計。