---
title: Record Runner 和 Yoasobi 黑膠唱片開箱 |亂買二手紀錄
katex: true
date: 2025-07-01 23:21:29
categories: unbox
tags:
  - unbox
  - record player
  - vinyl
  - music
cover: RecordRunnerPlayingFrankSinatra.webp
---

## 前言

自從從日本回來以後，感覺自己喜歡上找一些以前大約 1990 ~ 2010 年代的舊東西。現在的產品感覺都沒有以前那種老東西的美感。而且尤其類比技術比現在數位的東西多了一點純粹物理跟機械的美感，尤其是之前在玩底片相機後，更有了這種感覺。而音樂方面就一直以來很想買一台黑膠唱片機來試試看，不過無奈唱片機要嘛很佔空間，就是很貴(鐵三角的 SOUND BURGER 系列)，所以一直沒有買。

然後再一次的亂逛網頁的時候發現了有 Record Runner 這種東西，雖然音質可能不是很好，也會傷害唱片，不過看著他一邊在唱片上面走來走去，還蠻療育的，因此開始在網路上找這個產品。

## 購買資訊

因為如果從蝦皮買，看到的價格幾乎都要兩、三千元，所以這次嘗試使用樂淘這個代購平台買買看，也發現日本 Yahoo 上竟然有 Hard Off 的線上商店，而且也有這台機器，競標到的價格是 3686 日幣，換算台幣大約是 784 元左右。

雖然這台上面有寫「ジャンク」(垃圾)，不過以 Hard Off 沒有經過測試的東西也會被列為是ジャンク，而且加上這台的結構和維修相對來說簡單(有在網路上看別人的拆解影片)，所以就決定買下來了。

因為是第一次使用，也有給商品價格 50 % off 的優惠，所以最後的價格是 392 元。接著再加上一堆運費，大概是 387 元左右。最終以 779 元購入。

樂淘運送的速度還滿快的，大約一個禮拜就可以收到貨了(自取)。這樣以後就可以在台灣買 Hard Off 的商品了。

|商品資訊|運費明細|
|--|--|
|{% asset_img RecordRunnerPurchasePrice.webp %}|{% asset_img RecordRunnerPurchaseCostBreakdown.webp  %}|

(題外：之前去過台灣的 Hard Off ，不過感覺沒有像日本的這麼值得去，以懷舊遊戲這個品類來說，基本上從蝦皮買好像還可能比較便宜。

而且東西拿去賣雖然會直接給你錢，但是給的金額很低，然後轉手賣很高。像是之前去賣了一個 pokemon go plus +，好像只賣了 300 多塊，但是放在架上就直接賣 900 元(親眼看到上架XD)，雖然在估價完後會確認價格是否可以接受，但是沒想到價差會有這麼大。所以也感覺在 Hard Off 應該很難撿到便宜，很難賺到店家對於物品價值的價差)

## 拿到機器與拆解

拿到這台可愛的車子後，就馬上開始測試，不過發現不管怎麼測試，發現都會一直脫離唱片的軌道上，後來仔細檢查以後才發現，原來是有一個輪子脫落了。

{% asset_img RecordRunnerWheelRepair_1.webp 600  脫落的輪子 %}

後來把整車子拆開後把輪子放回去以後，也順便研究了一下裡面的構造。整體構造其實很簡單，就是一個擴大機和一些馬達所做成的小車子。

{% asset_img DisassembledRecordRunner.webp 構造簡單的唱片機 %}
{% asset_img RecordRunnerInternalCircuitry_2.webp 電路的另一個角度 %}
{% asset_img RecordRunnerInternalCircuitry_1.webp Record Runner 外殼與喇叭 %}

### 紅外線感應器

不過在裡面很好奇的一件事情，是因為如果是以這種車子形式唱片機，因為要維持等角速度，照理來說越外圈，速度應該要越快，所以很好奇這台車子是怎麼做到線性速度改變的，原先懷疑裡面是使用可變電阻來改變速度，但是拆解後，看到了紅外線發射裝置跟接收裝置，還有一個會隨著唱針改變遮擋面積的擋板，然後當車子在唱片上移動時，前端唱針的部分會轉動，當越內圈時，紅外線的發射裝置會遮擋的越多，所以速度就會越慢。這個設計真的是非常的精妙。

{% asset_img DisassembledRecordRunner_IR.webp Record Runner 的紅外線感應器 %}


### 維修完成

維修完成後，就可以正常運作了。
{% asset_img RecordRunnerWheelRepair_2.webp 輪子組裝回去了 %}

### 播放 Frank Sinatra

來看看 Record Runner 來播放經典 Frank Sinatra 黑膠唱片的情況，會選擇 fly me to the moon 這首歌，是因為我還滿喜歡魷魚遊戲中一個片段，就是參與者玩在玩一二三木頭人時，關卡主持人優雅的放著這首歌，喝著紅酒，透過螢幕看著他們互相殘殺，造就了視覺與聽覺所造成的衝擊。

<video width="100%" controls>
  <source src="RecordRunnerPlayingFrankSinatraVideo_2.webm" type="video/webm">
  
</video>

不過聲音可能會忽大忽小 XD

<video width="100%" controls>
  <source src="RecordRunnerPlayingFrankSinatra_1.webm" type="video/webm">

</video>

|Record Runner 播放 Frank Sinatra 唱片|另一個角度的播放情況|
|--|--|
|{% asset_img RecordRunnerPlayingFrankSinatra.webp %}|{% asset_img RecordRunnerPlayingFrankSinatra_2.webp %}|

### 播放鋼琴曲

也測試了播放蕭邦的降E大調夜曲op 9~2，不過聽起來會有一點抖動感，也有一點點黑膠獨有的沙沙聲。

<video width="100%" controls>
  <source src="RecordRunnerDemo.webm" type="video/webm">
</video>

### 播放 yoasobi 的專輯

因為都買了新的唱片機，所以也想說買一張 Yoasobi 的黑膠專輯來試試看，這個也是從樂淘上面買的，大概花了 700 多元，唱片設計得很漂亮，而且本體是半透明粉紅色的，第一次看到這種唱片，感覺很特別。

|封面|唱片內部|透明唱片本體|
|--|--|--|
|{% asset_img yoasobi_Vinyl_cover.webp %}|{% asset_img yoasobi_Vinyl_2.webp %}|{% asset_img yoasobi_Vinyl.webp %}|

整個播放的感覺，因為常聽 Yoasobi 的音樂，發現這台車子的速度，可能播完一兩首歌以後，速度會比正常音樂還要快，需要再調整一下速度。

<video width="100%" controls>
  <source src="yoasobi_RecordRunner.webm" type="video/webm">
</video>

## 結語

Record Runner 更適合作為一個有趣的音樂玩具或收藏品，而不是專業的音樂播放設備。如果你喜歡新奇有趣的音樂周邊產品，或者想要一個能夠吸引注意力的聚會道具，那麼 Record Runner 會是個不錯的選擇。

但如果你追求的是高品質的音樂聆聽體驗，建議還是選擇傳統的黑膠唱盤。Record Runner 的價值更多在於它的創意和趣味性，而非音質表現。
