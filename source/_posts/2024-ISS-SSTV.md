---
title: ARISS SSTV 實驗 (Expedition 72 - ARISS Series 21 SSTV Experiment)
katex: true
date: 2024-10-13 21:43:05
categories: radio
tags: 
- radio
- ISS
- SSTV
cover: SSTV_4.jpg
---

## 前言

最近在 FB 的無線電社團看到了有關於 ARISS(Amateur Radio on the International Space Station) 在做有關於 SSTV (慢掃描電視)的活動，想說買了無線電買這麼久，一直都沒有好好的使用它，就趁這個機會，研究了一下 SSTV 要怎麼接收。本次活動時間是 2024年10月09日 至 10月14日( UTC +8 )

{% asset_img 24_ISS_SSTV.webp 2024 ARISS 的 SSTV 活動 %}

這個活動目的是為了要幫助 ISS 研究無線電的通訊能力，有另外一部分是可以推廣相關的科學概念，因此偶爾會舉辦這樣的活動，讓世界各地的火腿族可以共襄盛舉。

## 事前準備

我習慣是使用 [Gpredict](https://oz9aec.dk/gpredict/) 來計算預估的路徑時間。使用這個軟體記得設置好自己的經緯度，一旦設定完以後就可以看到衛星未來經過的時間與位置，如果在經過的時候，也會出現衛星位置的提示。

{% asset_img Gpredict.webp 使用 Gpredict 預測 ISS 經過的時間 %}

如果想要輕鬆一點，可以直接用 APP 或網站來查詢相關資訊，像是 ios 可以使用 Satellite Tracker (須付費) 來追蹤，也有免費的 APP 可以用，不過可能需要自己找一下。

{% asset_img satelliteTracker_2.webp 400 使用 Satellite Tracker 預測 ISS 經過的時間 %}

## 接收地點

我到新北市的鴨鴨公園，因為這邊場地寬敞，而且人也偏少，應該不會影響到別人。

{% asset_img duckPark_1.webp 今天天氣真好~ %}
{% asset_img duckPark_2.webp 鴨鴨公園 %}
{% asset_img duckPark_3.webp 鴨鴨公園的擺飾 %}
{% asset_img duckPark_4.webp 在河堤上看，根本看不出來是鴨子 %}
{% asset_img duckPark_5.webp 鴨鴨公園要用衛星看才看得出來是鴨子 %}

## 使用設備

1. 一隻 iphone：
作為追蹤 ISS 的位置，還有側錄聲音訊號。
使用的軟體是付費的 satellite Tracker (可以試用一個月)

    ⚠️注意：這個軟體預設是白天的 ISS 不會通知，因為這個軟體是觀星軟體，所以不會通知，也會自動略過它下次經過的時間。但是還是可以看的到 ISS 的位置(將手機抬起，即可透過陀螺儀知道位置)，跟什麼時候會升起與高度角。

|衛星升起位置|ISS 現在位置|
| :----: | :----: |
|{% asset_img satelliteTracker_1.webp 600 %}|{% asset_img satelliteTracker_3.webp 600  %}|

2. 一支 無線電：
使用的是 adi AQ-50 原廠的天線，可以依照需要更換天線。

    - 頻率調整為 145.8 Mhz
    - SQL 設定為 0 (以免微小訊號丟失)

3. 一隻 Android 手機
為了可以解碼 SSTV ，需要安裝 robot36 ，而且 Android 上的是免費可以使用的。請將模式調整為 PD120

|使用 robot36 來解碼|按右上角的三條線|將軟體的模式改成 PD120|
| :----: | :----: | :----: |
|{% asset_img robot36_1.webp 550 %}|{% asset_img robot36_2.webp 600 %}|{% asset_img robot36_3.webp 560 %}|

- 錄製完成後，就按上面看起來像下載的符號就好了。
- 軟體除非收到結束訊號，否則不會自動暫停，會一直錄下去，所以可能要自己截斷。
    - 提醒：截圖只會節到畫面內的範圍，如果超出範圍，資料就會消失了。
- 每次重開 APP 都要重新調整一次設定。

### 設備合影

{% asset_img radioAndPhone_1.webp 600 我的設備 %}

## 握持方式

1. 手持無線電用橫拿的方式，然後對準 ISS 的位置。

{% asset_img radioAndPhone_2.webp 600 握持方式 %}

{% asset_img RX.webp 對準方式 %}

## 接收結果

### 24/10/13 下午 03:06 測試

這次很可惜，太早放棄了，回過神在開無線電就來不及了 QQ

{% asset_img SSTV_2.jpg 500 24.10.13 下午 03:06 接收到的畫面 %}

{% asset_img SSTV_1.webp 500 24.10.13 下午 03:11 接收到的畫面 %}

### 24/10/14 下午 02:18 測試

這天是平日要上班，因此跟公司請了兩個小時的假，去接收無線電訊號。這大概是有史以來最奇怪的請假原因了吧 XD

{% asset_img SSTV_3.jpg 500 24.10.14 下午 02:18 接收到的畫面 %}

{% asset_img SSTV_4.jpg 500 24.10.14 下午 02:24 接收到的畫面(這次的就比較完整了) %}

<br>

### 24/10/14 下午 02:18 的錄音檔案

> 測試圖片與圖片中間會間隔大約兩分鐘(不過可能會受到地點影響)，每張完整的圖片需要大約 130 秒左右

<div style="text-align:center;position: relative;width: 100%;padding-bottom: 56.25%;height: 0;overflow: hidden;">

<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="https://www.youtube.com/embed/xVkpKNw0KCQ?si=XFpGYtA5F8KrJEnK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## 上傳檔案

- [ARISS SSTV 的相冊](https://www.spaceflightsoftware.com/ARISS_SSTV/)
  可以看到不同人上傳的檔案，如果擷取得很好，有機會可以登上首頁。  

- [ARISS SSTV Award](https://ariss.pzk.org.pl/sstv/)
  這邊可以將你記錄好的圖片上傳上去，並填寫資料
  
  上傳完圖片以後，就可以去申請證書~實測申請完大約 3 小時左右會收到ARISS SSTV Award 的 email 與證書。

<div style="display: flex; border: 2px solid white;">
  <div style="flex: 1; padding: 10px;">
{% asset_img email.webp 收到的 email %}
  </div>
  <div style="flex: 1; padding: 10px; font-size: 10px;">
你好，<br>感謝你寄來的報告。在長時間的中斷後，我們再次享受來自國際太空站的影像傳輸。這些影像是為了測試俄羅斯模組上的業餘無線電傳輸設備而進行的實驗性傳輸。<br><br>這些影像與正在進行的國際太空週（10月4日至10日）有關。1957年10月4日，第一顆人造衛星「史普尼克1號」被發射到地球軌道，1967年10月10日，《外太空條約》正式生效。這次慶祝的目的是表彰科學家和太空研究對於人類發展的貢獻。<br><br>第21系列的影像包括俄羅斯科學家康斯坦丁·齊奧爾科夫斯基（1857-1935）的照片，他是太空飛行理論和火箭建造理論的創立者。幾張影像顯示了第一顆地球衛星——史普尼克1號。還展示了位於庫爾斯克的西南國立大學（SWSU）科學家和學生對於太空技術發展的貢獻。<br><br>這次的證書展示了康斯坦丁·齊奧爾科夫斯基的照片、史普尼克1號衛星，以及由SWSU的科學家和學生與RSC Energa合作設計和建造的SWSU-55衛星。<br><br>ARISS SSTV活動得以實現，歸功於ARISS俄羅斯的Sergey Samburov RV3DR和ARISS國際主席Frank Bauer KA3HDO的努力，還有其他許多人的貢獻。官方的ARISS獎項由ARISS臨時獎項委員會提供：主席Oliver DG6BCE、Armand SP3QFE、Francesco IK0WGF、Bruce W6WW、Shizuo JE1MUI、Darin VE3OIJ、Ian VE9IM。<br><br>國際太空站的業餘無線電（ARISS）是一個由國際業餘無線電協會和支持國際太空站的太空機構共同合作的計畫。ARISS的主要目標是促進對科學、技術、工程、藝術和數學領域的探索。ARISS通過安排業餘無線電連接，讓國際太空站的宇航員與學生進行聯絡，來實現這一目標。在這些聯絡的前後，學生、教育者、家長和社區都會參與與太空、太空技術和業餘無線電相關的實踐學習活動。
  </div>
</div>

<br><br>

{% asset_img Diploma.webp 600 參加的證書~ %}