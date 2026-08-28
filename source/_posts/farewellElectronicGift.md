---
title: 離職前做一個電子小禮物《science boy》
katex: true
date: 2026-03-09 18:00:00
categories: maker
tags:
- PCB
- Arduino
- gift
- OLED
cover: cover.webp
---

離職前想說可以做一個小禮物送給同事。  一開始有想過番茄鐘、小機器人之類的東西，不過考慮到續航、成本，還有一次要做很多組，感覺都不太適合。後來想到我本來就很喜歡復古遊戲機，就決定做一台外型有點像 Game Boy 的迷你抽籤機。這個專案也算是把我這幾年學到的東西全部塞進去，包含 3D 列印、印刷、畫電路板、焊接跟寫程式。裡面也放了一些公司的角色和只有同事才看得懂的小彩蛋。

{% asset_img farewell-electronic-gift-07.webp science boy與外盒 %}

實際使用影片：

<div class="farewell-video">
  <video controls playsinline preload="metadata" poster="farewell-electronic-gift-demo-poster.webp">
    <source src="farewell-electronic-gift-demo.m4v" type="video/mp4">
    你的瀏覽器不支援 HTML5 影片播放。
  </video>
</div>

## 成本

最後一共做了大約 30 組，整體開銷是 6,000 多元，平均一組大約 200 元左右。

## 參考資料

此次專案主要參考 [lonesoulsurfer 的專案內容](https://www.instructables.com/Tiny-Arcade-Game-Attiny85/)

這個是很多國外玩家滿喜歡做的 attiny85 的迷你遊戲機專案，不過我在電路板的 layout 跟軟體都有改過跟重寫。

|{% asset_img farewell-electronic-gift-03.webp 抽籤測試 %}|{% asset_img farewell-electronic-gift-04.webp 搭配 3D 列印的小底座 %}|
|:--:|:--:|

## 包裝

外盒是用 AI 生成的復古的掌機風格，不過要自己剪裁跟黏貼花了不少時間。也有想過直接請廠商製作，不過我要製作的量都太小，做下去不太划算。

{% asset_img farewell-electronic-gift-22.webp 紙盒展開圖與復古掌機風格的包裝設計 %}

## 3D 列印底座

為了這個裝置，我也做了一個 3d 列印的底座，其中這個底座有設計一些小巧思在裡面，裡面故意做中空的，這樣只要別人在照光的時候，就可以發現裡面的隱藏訊息（我塞了一些工作常用的迷因在裡面），實際測試的時候，建議列印使用 0.2mm 的噴頭，這樣文字內容才會比較清楚，字體是使用開源的點陣圖字體。

{% asset_img farewell-electronic-gift-11.webp 400 this is fine 的小彩蛋 %}

## 電路圖

這次的專案也是透過 Kicad 來製作完成的，然後再由 JLCPC 制作 PCB。核心使用 ATtiny85，搭配 128×64 的 SSD1306 OLED、三顆按鍵、蜂鳴器和 CR2032 鈕扣電池。ATtiny85 的腳位不多，所以 OLED、按鍵和蜂鳴器幾乎把能使用的腳位都用完了，電路圖可以參考下圖。

{% asset_img farewell-electronic-gift-16.webp ATtiny85、OLED、按鍵與蜂鳴器的電路圖 %}

在正式做成 pcb 之前，有先用麵包版搭建一組測試，測試後成功可以運行，才將電路圖送給廠商製作。

{% asset_img farewell-electronic-gift-19.webp 在 KiCad 裡安排電路板走線 %}

| {% asset_img farewell-electronic-gift-18.webp 400 電路板正面 %}|{% asset_img farewell-electronic-gift-17.webp 500 電路板背面 %}|
|:--:|:--:|

## ATtiny85 燒入方式

因為 ATtiny85 本身沒有像 Arduino Uno 一樣的 USB 接頭，所以需要另外準備燒錄器。這次我直接使用手邊的 Arduino Uno，先把它變成一台 ISP 燒錄器，再透過麵包板和杜邦線把程式寫進 ATtiny85。

首先把 Arduino Uno 接上電腦，在 Arduino IDE 選擇 `File → Examples → 11.ArduinoISP → ArduinoISP`，確認開發板和連接埠都是 Uno 後，先把這個 [Arduino 內建範例](https://docs.arduino.cc/built-in-examples/) 上傳到 Uno。完成後，Uno 就可以拿來替其他 AVR 晶片燒錄。

接著需要讓 Arduino IDE 認得 ATtiny85。我使用的是 [David A. Mellis 的 attiny 核心](https://github.com/damellis/attiny)，先在 Arduino IDE 的偏好設定裡，把下面的網址加入「Additional Boards Manager URLs」：

```text
https://raw.githubusercontent.com/damellis/attiny/ide-1.6.x-boards-manager/package_damellis_attiny_index.json
```

再到 Boards Manager 搜尋並安裝 `attiny by David A. Mellis`。

Arduino Uno 和 ATtiny85 的接線如下。以下是把 ATtiny85 單獨放在麵包板上，並由 Uno 供電的接法：

| Arduino Uno | ATtiny85 |
|---|---|
| 5V | Pin 8（VCC） |
| GND | Pin 4（GND） |
| D10 | Pin 1（RESET／PB5） |
| D11 | Pin 5（MOSI／PB0） |
| D12 | Pin 6（MISO／PB1） |
| D13 | Pin 7（SCK／PB2） |

ATtiny85 上方的半圓缺口朝上時，左上角是 Pin 1，腳位會沿著晶片外圍逆時針編號。接線前最好再對照一次，因為晶片轉錯方向時，所有腳位都會跟著顛倒。

接好之後，在 Arduino IDE 選擇：

- Board：`ATtiny25/45/85`
- Processor：`ATtiny85`
- Clock：`Internal 1 MHz`（這次專案使用的設定）
- Programmer：`Arduino as ISP`

第一次使用或更改時脈設定時，要先按一次 `Burn Bootloader`。這裡不是真的替 ATtiny85 安裝一般 Arduino 那種開機程式，主要是在寫入 Fuse，讓晶片使用選定的時脈設定。

最後使用 `Sketch → Upload Using Programmer` 上傳，不能直接按平常的 Upload 按鈕。看到完成訊息後，就可以先斷開電源，再拔下 ATtiny85 放進電路板測試。

如果出現 `invalid device signature` 或一直找不到晶片，通常是晶片方向、D10～D13 接線、共地或 Programmer 選項有問題。如果程式可以運作，但動畫和聲音速度明顯不對，則多半是 Clock 選項和 Fuse 不一致，可以重新確認時脈後再執行一次 `Burn Bootloader`。（這步驟很重要，因為我前幾個晶片不知道為什麼運行速度都超慢，但是重新刷過一次以後，顯示速度會恢復正常了）

這個裝置使用 CR2032 供電，因此燒錄時不要同時裝著電池又接 Uno 的電源。如果要直接在完成的電路板上燒錄，也要先確認板上的其他元件能不能承受 Uno 的 5V；不確定時，先燒錄單獨的 ATtiny85 會比較安全。另外 PB0、PB1、PB2 同時也是 ISP 訊號腳，如果外接的按鍵或蜂鳴器影響通訊，也可以先暫時斷開，燒錄完成後再接回去。

## 程式與功能

這次的程式也是由 AI 輔助完成的，總共花費大概 4 小時左右。
不過起初不知道為什麼一直會破版，後來發現應該解析度調錯了，所以才會一直破版。後來修正後就正常了。

{% asset_img farewell-electronic-gift-09.webp 400 錯位的訊息 %}

三顆按鍵分別用來抽籤、切換聲音，以及我想要給同事的訊息。抽籤共有大吉、中吉、小吉和凶（老闆頭像 XD ）四種結果，每種結果都有不同的貓咪圖案與音效。聲音設定會寫入 EEPROM，所以重新開機之後還會保留上一次的設定。給同事的訊息則是每個同事都會拿到我離職想要給他的話之類的。

{% asset_img farewell-electronic-gift-02.webp 400 science boy %}

## 難題：只有 8 KB 的空間

原本以為圖片轉成黑白點陣圖以後，應該不會占太多空間，結果實際放進去才發現完全不是這回事 XD  

ATtiny85 只有 8 KB，光是一張 128×64 的黑白圖片就要 1 KB，放個幾張程式就塞不下了。但我又不太想把圖片、音效或抽籤功能拿掉，只好開始想辦法省空間。  

後來把一些圖片縮小，顯示時再放大；重複出現的文字跟圖案也拆開來用。雖然處理起來比較麻煩，但最後有成功把原本想要的功能塞進去。

為了處理這些圖，我另外寫了一個瀏覽器版的 [OLED 點陣圖工具](/sideProject/oledPixelTool/)。裡面有 16×16、64×64 和自訂尺寸三種模式，可以直接畫圖，也能匯入圖片後調整黑白門檻。

如果只需要畫面中的一小部分，也可以先選取範圍，再用 2% 為單位縮放和拼貼。工具同時支援復原、重做、反相，以及載入字型來產生文字。完成後會自動整理成 Arduino 可以使用的 `PROGMEM` 位元陣列，也能把原本的 Hex 資料貼回去繼續修改。

[開啟 OLED 點陣圖工具](/sideProject/oledPixelTool/)

## 畫圖

最後這個是我做的其中幾個給同事的訊息～畫圖部分總共有 20 位同事，大概花了兩三個小時完成這個部分。

{% asset_img farewell-electronic-gift-15.webp 訊息＿1 %}
{% asset_img farewell-electronic-gift-20.webp 訊息＿2 %}
{% asset_img farewell-electronic-gift-21.webp 訊息＿3 %}

## 電路板焊接

為了讓後續製作比較容易，這次的元件幾乎都選擇 THT 插件式封裝。這樣除了比較好焊，也能讓收到的人直接看到每個零件和中間那顆八隻腳的 ATtiny85。

一次製作大約 30 組，實際焊接花了八小時左右。因為前面已經先在麵包板確認過電路，PCB 送出前也有完整檢查，所以組裝時沒有遇到太多需要修改的地方。不過完成後還是有殘留一些助焊劑，讓部分電路板表面看起來有一點髒。

<div class="farewell-video">
  <video controls playsinline preload="metadata">
    <source src="farewell-electronic-gift-soldering.m4v" type="video/mp4">
    你的瀏覽器不支援 HTML5 影片播放。
  </video>
</div>

<style>
.farewell-video {
  width: min(100%, 520px);
  margin: 20px auto 28px;
}
.farewell-video video {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: 6px;
}
</style>

## 小彩蛋

除了先前說的那個 3D 列印底座有藏小彩蛋外，也在裡面塞了許多小彩蛋。

{% asset_img farewell-electronic-gift-01.webp 電子小禮物與外盒 %}

像是前面有 `while(true){keep curious();}` 就是希望收到的同事可以以直保持好奇心～
或是如果把 oled 拆掉後，下面就會露「出你為什麼要拆掉螢幕 ＱＱ」的字樣。

另外，為什麼這個裝置是把電路板直接顯露在外面，主要原因是因為之前在開發有關於晶片有關的課程，因此想說把 IC 露在外面，可以讓大家比較了解內部的結構。

{% asset_img farewell-electronic-gift-12.webp 400 電路板正面的元件 %}

背面也有放一些內容，像是有經典的邏輯閘笑話（?），2B or not 2B 是呼應到以前開發的跟半導體相關的課程有關的內容，所以也一並放進去了。另外我覺得也滿符合我離職的心態，也是處於一個 to be or not to be 的抉擇中。在左上角也畫了一隻我們公司的吉祥物。

{% asset_img farewell-electronic-gift-13.webp 400 電路板背面的線路與電池 %}

此外，在程式裡面，也偷偷加入了摩斯密碼跟小片段的音樂與摩斯密碼，只要在特定頁面開啟聲音，再按特定的按鈕就可以聽到。

{% asset_img farewell-electronic-gift-08.webp 400 3d列印打樣測試 %}
