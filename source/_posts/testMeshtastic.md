---
title: Meshtastic 測試 (撰寫中）
katex: true
date: 2025-05-16 15:11:58
categories: maker
tags:
  - maker
  - meshtastic
  - esp32
cover: cover.webp
---

## 前言

### 什麼是 Meshtastic

Meshtastic 是一個由社群驅動、完全開源的專案，目的利用廉價的 LoRa（長距離低功耗）無線電模組，實現無需傳統網路基礎設施的離網通訊。無論是在遠足、野營、災害應變或其他無法依賴手機或網路的情境中，Meshtastic 都能讓使用者間可以透過網狀網路互相傳送文字訊息，保持聯繫。

此外，Meshtastic 也有提供 Android 和 iOS 的 App，讓使用者可以透過藍芽連接裝置，更方便地發送與接收訊息。

{% asset_img lora-topology-2.webp Meshtastic 的概念圖(擷取自 Meshtastic 官網) %}

詳細內容可以參考 [Meshtastic 官網](https://meshtastic.org/docs/introduction/)

## 開箱照片

我這次嘗試所使用的 meshtastic 的開發板是 Heltec-Arduino-LoRa-32 開發板，這塊開發板是基於 ESP32 的開發板，所以相較於其他開發板來說，價格較為便宜，只需要 700 元左右就可以買到。不過要注意的是台灣可以使用的頻段是 920 MHz～925 MHz，購買的時候要注意一下頻率範圍(不要買到 433-510 MHz 的頻段的版本)。

購買原因是為測試使用，也想了解看看 meshtastic 的訊號涵蓋範圍，所以這次購買了兩塊開發版，主要是自己與自己溝通，想看看訊號涵蓋範圍可以到多遠。

話不多說，直接開箱~

{% asset_img unbox_1.webp 外包裝 %}
{% asset_img unbox_2.webp 我其中一台有多買一個 2000mAh 的電池，作為隨身攜帶 %}
{% asset_img unbox_4.webp 內容物長這樣，注意買的時候就會有副一隻天線了，我看到蝦皮很多人都在抱怨多買了一支天線 %}

本體是基於 ESP32 的開發板，長的樣子很像以前有買過的 TTGO 的開發板，另外要注意螢幕很脆弱，在安裝殼的時候要特別小心，我有一台在安裝殼的時候，不小心搞爆了。

{% asset_img unbox_5.webp 內容物分開擺放 %}

## 3D列印外殼

另外，我也用 3D 列印對於戶外用的裝置與家裡用的裝置做了不同外殼，這邊有推薦一些我覺得蠻不錯的設計，可以參考看看~

### 戶外用的裝置

- 隨身攜帶的可以下載[這個由 TonyG 設計的外殼](https://www.printables.com/model/466818-heltec-v3-mini-case-for-meshtastic/files)
- 不過要另外購買四個螺絲與螺帽。(我在家裡只有找的兩個適合的螺絲，所以就將就著用了)
- 這個外殼有許多不同的造型可以選擇，我選擇的是六角形的造型。
- 他還有很多細項可以選擇
    - 有沒有gps
    - 有沒有開關
    - 天線外置或內置
    - 有沒有按鈕
    - 不同大小的按鈕
    - 不同的厚度(2000mAh 的電池我選擇背板是 11 mm的版本)
- 不過我做的時候有遇到一個 bug ，不知道為什麼我按殼的時候，會觸發到按鈕，所以我後來手動把按鈕削薄一點，才解決了這個問題。

{% asset_img 3Dcase_1.webp 安裝 3D 外殼後的樣子 %}

| 正面 | 背面 |
| :---: | :---: |
| {% asset_img 3Dcase_P_3.webp 600%} | {% asset_img 3Dcase_P_2.webp 600 %} |

### 家裡用的裝置

因為我有一台會放在家裡，固定有電源，所以不需要電池，相關設計圖可以參考[這個由 Tai Robotik 設計的外殼](https://makerworld.com/zh/models/416199-heltec-v3-case-running-meshtastic?from=search#profileId-318468)。這個設計很緊湊，基本上沒辦法再放入其他模組(我後來放了氣壓計模組是直接貼在外面)。

這個外殼，如果沒有螺絲固定也可以很堅固。

{% asset_img 3Dcase_2.webp 將開發版裝在 3D 外殼中 %}

為了防水，所以我把這個裝置，再跟一個 18650 的電池莊再一起，放在在大創買的盒子中。

{% asset_img set.webp 放在大創買的盒子中 %}

## 感測器模組

在 meshtastic 中，我們可以安裝不同的模組上去，就可以讓這個裝置變成不同的功能。我買了一個 GPS 模組跟一個氣壓計模組，分別安裝在戶外用的裝置跟居家的裝置上。

### GPS 模組
另外，我在戶外的裝置上裝了 GPS 模組 ATGM336h ，因為想說如果在外面遇到迷路，至少可以知道自己的位置。

{% asset_img GPS_ATGM336.webp GPS 模組安裝 %}

#### 安裝方式

這個模組從淘寶買的時候，大約 200 元左右。
ATGM336h 對應 heltec v3 的接線方式如下：

- 模組上的 VCC 接開發板的 5V
- 模組上的 GND 接開發板的 GND
- 模組上的 TXD 接開發板的 48
- 模組上的 RXD 接開發板的 47
- 模組上的 PPS 不用接

手機上需要再設定一下才能使用。

不過我遇到一個很奇怪的事情，似乎我的 GPS 模組模組需要接上電源的時候才會供電，所以如果我沒有接上電源，模組就會斷線，這個問題我還在研究中。

### 氣壓計模組

另外，我在居家的裝置上裝了氣壓計模組 BMP280 ，讓這個裝置也可當作一個小型的氣象站，監控著我家附近的氣壓與溫度。

#### 安裝方式

BMP280 對應 heltec v3 的接線方式如下：

- 模組上的 VCC 接開發板的 5V(或 3.3 V ，依照模組而定)
- 模組上的 GND 接開發板的 GND
- 模組上的 SCL 接開發板的 42
- 模組上的 SDA 接開發板的 41
- 模組上的 CSB 不用接
- 模組上的 SDO 不用接

詳細接法可以參考這篇[文章](https://adrelien.com/how-to-add-telemetry-sensor-to-heltec-lora-v3-meshtastic-node/)

{% asset_img bmp280_1.webp BMP280 模組安裝 %}
{% asset_img bmp280_2.webp BMP280 模組安裝 %}

## 換天線

後來換了一根天線試試看，訊號涵蓋範圍有比較廣一點，可以接收到比較遠的訊號。
{% asset_img 3Dcase_P.webp 換天線後的樣子 %}

## 成品展示

{% asset_img portable.webp %}


## 實際上使用

1. 目前嘗試過純粹 LORA 訊號，不經過 hop 訊號，訊號涵蓋範圍大概在 200 公尺左右，還可以收到，但是再遠就收不到了。可能是附近太多大樓的關係，訊號涵蓋範圍比較小。
2. LORA 經過 hop 訊號，訊號涵蓋範圍可以從大都會公園到台北橋。
3. meshtastic 的訊號傳遞很吃是否在『視線範圍』內，如果視線範圍內有阻擋物，訊號涵蓋範圍會變小。
