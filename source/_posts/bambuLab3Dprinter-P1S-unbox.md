---
title: 拓竹 P1S 開箱與自行維修紀錄
katex: true
date: 2024-06-01 22:10:00
categories: unbox
tags:
- 3D printer
- bambu Lab
- P1S
cover: cover.webp
---

{% asset_img  cover.webp P1S %}

## 前言

最近因為公司要購買新設備，看到很多人對於拓竹的機器評價很高，有些人甚至說選擇拓竹的機器，是可以真正享受玩 3D 列印這件事，而不是玩 3D 列印機機器本身，那時候聽到別人給出這麼高的評價。後來我幫公司選了拓竹的 P1S combo，不過沒想到...

以下將會記錄我使用拓竹 P1S combo 過程，其中也踩了很多坑。

## 購買過程

老闆幫我從[拓竹的官網](https://store.bambulab.com/products/p1s)直接下單了一台 P1S combo (combo 是加上了 AMS 系統，晚一點在介紹甚麼是 AMS 系統)。

當時是在 2024 年五月中左右買的，刷卡金額是```33600 元```左右 (當時購買的價格是在 949 鎂左右，不過沒想到，再過半個月後，價格直接砍到 849 鎂，這件事我現在還不敢跟老闆講...XD) 。

不過官網雖然號稱含稅，但是運送來台灣的時候會再被抽一筆關稅，當時關稅為 ```2499 元```，其實也是不太便宜。

所以全部金額大約也要 ```36000 元``` 左右。過了兩週以後(5/21 下訂、6/1 送達)，機器終於送過來了，超滿大一箱的。

## 規格

- 用於高溫絲印的封閉腔體。
- 使用 AMS 進行高達 16 色的列印(不過一台 AMS 只能印四色，可以透過組裝多台 AMS 達到 16 色)
- 高達 20000 mm/s² 加速度，18 分鐘內列印就可印出來測試用的小船。
- 內建相機可以用於遠端監控和縮時攝影 (不過相機幀率很低，只有 0.5 fps，而且只有 720p 的畫質)

相關擷取資訊至[官方網站](https://store.bambulab.com/products/p1s)

## 開箱

整體的開箱過程，我基本上是跟著下面這個個教學做的，難度不高，大約半小時左右可以完成，不過會建議需要兩個人搬動機器會比較安全一點，我當時一個人搬動機器，感覺超重的 (大約 17 公斤左右)

{% asset_img  P1SInsite.webp P1S 的內部構造 %}

<div style="text-align:center;position: relative;width: 100%;padding-bottom: 56.25%;height: 0;overflow: hidden;">

<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="https://www.youtube.com/embed/fNz-9jZJ9ZQ?si=qpmXg_d_OMciI7rs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

在裡面有附上了三綑線材，分別是綠色的 PLA、橘色的 PLA 跟 透明的 PLA 支撐材料和一個材料包。在這台機器中，可以透過 AMS 裝高達四捆的不同顏色的線材，並且列印的時候可以切換，來達到列印多色的效果。

不過在列印多色的時候，還是有一些小缺點的，像是列印的線材溫度不能差異太大，像是不能同時列印 ABS 和 PLA，或是在換線材的過程中，會需要浪費一段線材進行換線，有時候換線的結果已經比實際列印的內容還要多了，所以一般在列印多色的時候，如果要印的內容越多越好，這樣浪費的線材相對來說會少一點。

{% asset_img  BambuLabP1SComboOfficialUnboxing.webp 三綑不同的線材 %}

這個[材料包](https://store.bambulab.com/products/boat-model-components-kit-010)，拿到的是 Kit 010 的船，裡面只有附船後面的發條馬達，這個銷售方式滿特別的，也可以讓剛接觸 3D 列印機的人有一個東西可以印印看。

{% asset_img  boat_1.webp 透過附贈線材列印出的小船 %}

透過 AMS 功能可以列印出兩種顏色的救生圈，而且效果還不錯。

{% asset_img  boat_2.webp 多色列印功能列出的救生圈 %}

嘗試列印很多簍空的大型項目，效果也不錯

{% asset_img  testP1S.webp 簍空的大型項目 %}

一切看似這麼的美好，但是....

## 惡夢_擠出機卡料

花費時間：2 小時

P1S 剛到的第一天，我用他列印了許多的東西，但是在準備列印完最後一個東西的時候，他卡料了，說好的玩 3D 列印呢，為什麼會卡料。為什麼剛買第一天就會遇到這種事情。

我只好小心翼翼的把他拆開來，我必須說拓竹的機器雖然會壞掉，但是他的說明寫得非常的詳細，大部分都可以依照所說的方式解除問題。

{% asset_img  clog_1.webp 料卡在裡面 %}

所以我花了一兩個小時熟悉這台機器是如何組裝的，以及順利的把卡住料拿掉，機器終於又可以順利的運作了。

## 錯誤提示_AMS 提示 PLA 纏繞

## 惡夢_AMS 卡料

花費時間：2 小時

這個事情發生的原因，比較是因為我自己做死，因為想說測試看看比較脆的透明 PLA 的料，沒想到一放進去，透明 PLA 就斷成了很多節，死死的卡在 AMS 內，使得機器瘋狂報錯，我只好把 AMS 全部拆開來，慢慢的把裡面的料拿出來。要處理這個的麻煩程度比傳統的 3D 列印機複雜很多，幸好最後有驚無險修好了機器。

## 惡夢_擠出機內融化卡料

花費時間：2 週

這個問題是我遇到最頭痛的，我研究了許多時間才研究出來要怎麼修理，

1. 在一開始的時候，我發現列印的 PLA 料直接融化在擠出機內部，使得擠出機無法順利地將料擠出。所以我用火加熱了六角形板手，成功的把裡面的料通出來。但是這時候還是一直報錯，主要報錯內容是：

    1. 無法偵測到料進入，請手動移除先前的料
    2. 無偵測到切刀位置，請確認切刀是否正常
    3. 擠出機卡住(但是拆開後又沒有東西)

2. 我當時一直抓不出問題，如果我強制推料進入，發現還是可以正常列印，不過這樣每次都要強迫推料真的是不太正常。因此繼續研究和拆解。後來將擠出機上方的霍爾感應器拆下來，才發現原來還有殘留一小段 PLA 融化在這邊，使得霍爾感應器無法順利地偵測到磁鐵

{% asset_img  clog_2.webp 拆除擠出機上的霍爾感應器 %}
{% asset_img  clog_3.webp 卡住的小彈片 %}

3. 發現這個問題以後，想說應該大部分問題都可以解決了吧？但是還是不行，機器還是會報錯，說"無偵測到切刀位置，請確認切刀是否正常"，這時候插拔了很多次還是不行，這時候只好報拓竹的維修工單了，必須說拓竹的回覆速度算滿快的，而且滿有誠意的。但是他跟我說，請我檢查看看線是否有插錯位置。剛開始我完全不認為這個是可能會有問題的地方，因為我有特別確認每個線都有牢牢地卡在機器上面。

但後來證明我錯了，拓竹 P1S 的霍爾感應器的接頭，並沒有防呆裝置!!!!!!!所以你在插的時候可能會插在左邊一點或右邊一點，這樣機器都會報錯，這麼細節誰會注意到!!(崩潰)，我是重複看了很多次官方文檔跟 reddit 上的網友分享，才發現有這個問題。

{% asset_img  clog_4.webp 接錯位置 %}

後來從官方文檔發現一件驚人的事情，使用 P1S 列印 PLA 材質的時候，門建議是打開的情況列印，這樣才不會發生料融化在擠出機的悲劇

{% asset_img  P1Sopen.webp 列印 PLA 的時候，門必須要開啟 %}

這個也太反直覺了吧 QQ

## 最後

後來機器修好了以後，我在它上面放了包乖乖，希望未來 P1S 可以順利的列印，

{% asset_img  P1SwithKuaiKuai.webp 用乖乖鎮壓 P1S %}