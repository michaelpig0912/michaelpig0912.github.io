---
title: 用 Arduino Nano 匯出 Game Boy Camera 與《織夢島》照片【撰寫中】
date: 2026-07-23 23:19:10
categories: maker
tags:
  - Game Boy
  - Game Boy Camera
  - Nintendo
  - Arduino Nano
  - DIY
  - maker
  - game console
katex: true
cover: IMG_3219.webp
---

## 前言

之前把家裡放了許久的 Game Boy 拿出來維修，換完反光膜後，又開始研究這台老機器還可以做到哪些有趣的事情。後來去了BBB Retro Game Cafe' 玩了一些復古遊戲，看到剛他們有賣 Game Boy Camera ，所以就直接買了。這個卡帶除了可以用 Game Boy 拍照以外，卡帶裡還藏了相簿、圖片編輯、一些小遊戲跟（驚悚）的小彩蛋，內容比我原先想像中還豐富。

不過，拍完照片後遇到的第一個問題，就是要怎麼把照片傳到電腦。原本官方的方法是搭配 Game Boy Printer，將照片印在熱感紙上，但現在印表機和專用紙都不好取得，找了一下資料後，發現可以用 Arduino Nano 模擬 Game Boy Printer，把 Game Boy 傳出的圖片資料接到電腦上。

## Game Boy Camera 是什麼？

Game Boy Camera 是一張上方裝有相機模組的特殊卡帶。我手上這張是日版，所以卡帶正面寫的是 Pocket Camera。它直接插在 Game Boy 的卡帶槽中使用。

| Game Boy Camera 正面 | 卡帶背面與型號 |
| :---: | :---: |
| {% asset_img IMG_3210.webp 500 Game Boy Camera 正面，可以看到上方的旋轉鏡頭 %} | {% asset_img IMG_3207.webp 500 Game Boy Camera 背面與 MGB-006 型號標示 %} |

上方的鏡頭可以旋轉，所以既能朝外拍攝，也能轉向自己，很像現在手機前後鏡頭的概念。只是受限於 Game Boy 的螢幕，拍出來的照片是低解析度的灰階像素風格，反而有一種很特別的復古感。

### 相簿與拍攝

卡帶開機後，可以進入相簿瀏覽以前拍下的照片，也能直接進入拍攝模式。相簿會替照片編號，讓人可以逐張查看保存的內容。

| Game Boy Camera 主選單 | 相簿中的照片 |
| :---: | :---: |
| {% asset_img IMG_3175.webp 500 Game Boy Camera 主選單 %} | {% asset_img IMG_3177.webp 500 在相簿中查看保存的照片 %} |

拍攝時可以直接在螢幕上預覽畫面，拍完後還可以加入印章、文字和其他裝飾。以現在的眼光來看功能很簡單，但在 Game Boy 上直接拍照和修改圖片，還是滿有趣的。

題外話：在這個主選單中，裡面有一個選項叫 「にげろ（逃跑）」，按很多次以後會出現詭異的鬼臉，且顯示「你在逃離誰」，這個算是很早期的 jump scare 吧 XD(雖然不知道開發者是否有惡意)

| 相機拍攝畫面 | 替照片加入印章 |
| :---: | :---: |
| {% asset_img IMG_3196.webp 500 使用 Game Boy Camera 拍攝 %} | {% asset_img IMG_3198.webp 500 使用內建工具替照片加上裝飾 %} |



### 不只是相機

Game Boy Camera 除了拍照，裡面也放入了不少奇怪又有趣的小功能，例如可以把拍攝的人臉放進遊戲角色裡。整張卡帶不像單純的相機工具，比較像一款以相機為主題的小遊戲合集。

| 跑步小遊戲 | DJ 小遊戲 |
| :---: | :---: |
| {% asset_img IMG_3183.webp 500 使用照片製作角色的跑步小遊戲 %} | {% asset_img IMG_3186.webp 500 將拍攝的人臉放入 DJ 小遊戲 %} |

## 用 Arduino Nano 模擬 Game Boy Printer

Game Boy Camera 原本可以透過主機側邊的 Link Cable 連接 Game Boy Printer。當使用者在卡帶中按下列印時，Game Boy 會把圖片資料傳給印表機。

這次使用開源的 [Arduino Game Boy Printer Emulator](https://mofosyne.github.io/arduino-gameboy-printer-emulator/) 專案，讓 Arduino Nano 假裝成一台 Game Boy Printer。Game Boy 仍然照正常流程「列印」，但 Arduino 收到資料後，會改由 USB 序列埠傳到電腦，再透過解碼工具還原成圖片。

### 準備材料

這次使用的材料不多：

1. Arduino Nano
2. Game Boy／Game Boy Color 的 Link Cable 接頭
3. 四條杜邦線
4. USB 傳輸線
5. 電腦

我使用可以直接插進 Game Boy 連線孔的接頭，再用杜邦線連到 Arduino Nano。這樣不用拆開 Game Boy，也不用對主機本身焊接。

| Link Cable 接頭與杜邦線 | 接頭內部接線 |
| :---: | :---: |
| {% asset_img IMG_3211.webp 500 Game Boy 連線孔接頭與四條杜邦線 %} | {% asset_img IMG_3212.webp 500 從接頭背面確認四條線的位置 %} |

### 接線方式

依照專案文件，Game Boy Link Cable 與 Arduino Nano 的接線如下：

| Game Boy Link 接腳 | 功能 | Arduino Nano |
|---|---|---|
| Pin 2 | Serial OUT（SOUT） | D4 |
| Pin 3 | Serial IN（SIN） | D3 |
| Pin 5 | Clock | D2 |
| Pin 6 | GND | GND |

Pin 1 的 5V 和 Pin 4 在這個做法中不需要接。接線時也不能只相信線材顏色，最好使用三用電表的導通功能確認每條線實際對應的接腳。部分連接線內部會把 SIN 和 SOUT 交叉，如果列印時完全收不到資料，可以再檢查 D3、D4 是否需要對調。

{% asset_img IMG_3215.webp 500 將四條杜邦線接上 Arduino Nano %}

> 接線和拔線前建議先把 Game Boy 與 Arduino 的電源關閉，並再次確認 GND 與訊號腳位，避免接錯電源腳位。

### 寫入模擬器程式

Arduino Game Boy Printer Emulator 可以使用網頁燒錄工具，或透過 Arduino IDE 把專案中的程式寫入 Arduino Nano。我這次使用網頁燒錄工具，先上傳 Test Blink Firmware，確認開發板上的 LED 可以正常閃爍，再寫入 Game Boy Printer Emulator。

{% asset_img arduino-nano-web-flasher.webp 800 使用 WebSerial Arduino Nano Flasher 寫入 Game Boy Printer Emulator %}

有些 Arduino Nano 相容板使用的是舊版 bootloader。如果選擇 Newer Arduino Nano 時出現 Error，可以改用 Older Arduino Nano 的選項再試一次。

寫入完成後，再用 USB 線把 Arduino 接到電腦。我使用 [Game Boy Printer Web](https://herrzatacke.github.io/gb-printer-web/) 接收資料，第一次使用時需要到 Settings 開啟 **Enable WebUSB / Serial ports**。

{% asset_img gb-printer-web-settings.webp 800 在 Game Boy Printer Web 設定中開啟 WebUSB 與 Serial ports %}

接著點選右上角的 USB 圖示，選擇 **Open Web Serial device**。瀏覽器會跳出裝置選擇視窗，這時選擇 Arduino Nano 對應的 USB Serial 裝置並按下連線。

| 選擇 Arduino Nano 的序列裝置 | 成功辨識模擬器 |
| :---: | :---: |
| {% asset_img gb-printer-webserial-select.webp 450 在瀏覽器中選擇 Arduino Nano 的 USB 序列裝置 %} | {% asset_img gb-printer-web-connected-device.webp 450 Arduino Gameboy Printer Emulator 已經以 115200 baud 連線 %} |

專案預設的序列傳輸速度是 115200 baud。畫面顯示 Arduino Gameboy Printer Emulator 後，就代表電腦已經讀到 Arduino，可以把另一端接上 Game Boy 的 Link 連接孔。

{% asset_img IMG_3217.webp 600 Game Boy Camera、Arduino Nano 與電腦完成連接 %}

## 把 Game Boy Camera 的照片傳到電腦

硬體連接完成後，操作方式跟使用真正的 Game Boy Printer 很接近：

1. 在 Game Boy Camera 中選擇要輸出的照片。
2. 進入列印功能並開始列印。
3. Arduino Nano 接收 Game Boy 傳出的資料。
4. 電腦端將收到的列印封包解碼成圖片。
5. 最後把圖片下載並保存成一般圖片檔。

因為 Game Boy 以為自己連接的是印表機，所以主機畫面上仍然會出現資料傳輸和列印中的動畫。Arduino Nano 則會把原本應該送去熱感印表機的資料轉送到電腦。

| 確認連線並選擇照片 | Game Boy 傳送圖片資料 |接收圖片資料|
| :---: | :---: |:---: |
| {% asset_img IMG_3218.webp 500 連接 Arduino 後選擇要輸出的照片 %} | {% asset_img IMG_3221.webp 500 Game Boy 顯示資料傳輸中的畫面 %} |{% asset_img IMG_3222.webp 500 Game Boy Camera 顯示列印中的動畫，此時 Arduino 正在接收圖片資料 %}|

### 在電腦上調整與下載照片

圖片傳輸完成後，照片會直接出現在 Game Boy Printer Web 的 Gallery 中。這邊可以替照片更換色盤、保留或移除原本的邊框，也能加上標籤方便整理。

| 替照片更換色盤 | 選擇輸出尺寸與格式 |
| :---: | :---: |
| {% asset_img gb-printer-web-palette.webp 600 在 Gallery 中替照片套用不同的 Game Boy 色盤 %} | {% asset_img gb-printer-web-download.webp 600 下載時可以選擇放大倍率、圖片格式與是否保留邊框 %} |

下載時可以選擇 JPEG、PNG、WebP 等格式，也能把原始像素整數倍放大。這樣放大後依然會保持清楚的像素邊緣，不會因為縮放而變得模糊。

以下就是從 Game Boy Camera 實際傳到電腦的圖片。原本在 Game Boy 螢幕上只能看到偏綠的畫面，傳到電腦後就能保留完整像素，也可以嘗試不同的配色。

{% asset_img gb-camera-output-pikachu.webp 600 從 Game Boy Camera 匯出的皮卡丘照片，保留卡帶內建的相框 %}

| 綠色系輸出 | 橘色系輸出 |
| :---: | :---: |
| {% asset_img gb-camera-output-green.webp 500 套用綠色系色盤的 Game Boy Camera 輸出照片 %} | {% asset_img gb-camera-output-orange.webp 500 套用橘色系色盤的 Game Boy Camera 輸出照片 %} |

這個做法的好處是不需要拆開 Game Boy Camera 卡帶。只要利用卡帶原本就有的列印功能，就可以把相簿裡的照片保存到現代電腦中。

## 《薩爾達傳說 織夢島》的照片也能輸出

Arduino 模擬的是 Game Boy Printer，而不是只針對 Game Boy Camera 做資料擷取，所以只要遊戲本身支援 Game Boy Printer，也能使用相同方法輸出圖片。

我另外拿《薩爾達傳說 織夢島 DX》測試。遊戲中有攝影師和相簿功能，可以記錄林克冒險途中發生的特別事件，進入相片畫面後，同樣可以透過 Link Cable 將圖片送到 Arduino Nano。

| 遊戲中的攝影事件 | 相簿裡保存的照片 |
| :---: | :---: |
| {% asset_img IMG_3223.webp 500 《織夢島》中的攝影事件 %} | {% asset_img IMG_3225.webp 500 查看《織夢島》相簿中的照片 %} |

{% asset_img IMG_3231.webp 600 使用相同的 Arduino Nano 接線測試《薩爾達傳說 織夢島 DX》 %}

傳輸完成後，遊戲中的照片同樣會出現在電腦的 Gallery 中，並且可以下載成一般圖片檔。下面就是從《織夢島 DX》實際輸出的林克照片：

{% asset_img links-awakening-output.webp 600 從《薩爾達傳說 織夢島 DX》匯出到電腦的林克照片 %}

這也代表這組簡單的 Arduino Nano 轉接器，不只能救出 Game Boy Camera 裡的老照片，還能保存其他支援 Game Boy Printer 遊戲中的圖像。比起尋找已經停產的原廠印表機和熱感紙，用幾條杜邦線就能把內容留成數位檔案，實用許多。

## 心得

一開始只是想看看 Game Boy Camera 的照片導出方式，沒想到最後變成用 Arduino Nano 模擬一台 Game Boy Printer。整個製作不需要複雜的電路，主要工作就是準備連接頭、確認四條訊號線的位置，再把模擬器程式寫進 Arduino。

最讓我意外的是，這個方法並不只適用於相機卡帶。《織夢島 DX》這類支援 Game Boy Printer 的遊戲也能使用同一套硬體輸出圖片，讓三十年前設計的列印功能，在現在變成保存遊戲內容的方法，感覺滿有趣的。

## 參考資料

1. [Arduino Game Boy Printer Emulator 專案與接線說明](https://mofosyne.github.io/arduino-gameboy-printer-emulator/)
2. [Arduino Game Boy Printer Emulator 原始碼](https://github.com/mofosyne/arduino-gameboy-printer-emulator)
