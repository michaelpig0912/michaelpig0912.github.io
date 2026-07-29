---
title: 拓竹 A1 mini 開箱紀錄與彩色浮雕測試
katex: true
date: 2024-06-29 22:59:41
categories: unbox
tags:
- 3D printer
- bambu Lab
- A1 mini 
cover: a1mini.webp 
---

## 前言

{% asset_img  a1mini_cover.webp A1 mini %}


最近幫公司選了一台 P1S，剛好自己也想換一台新的 3D 列印機。我原本使用的是 Ender 2 Pro 和 CR-10，這兩台陪我印了不少東西，但每次開印前總要花一些時間調整。因此把舊機器賣掉，換成體積比較適合房間的 A1 mini。（再見了，我的 Ender 2 Pro 和 CR-10。）

{% asset_img  a1mini.webp A1 mini %}

當初會選擇 A1 mini，主要有三個原因：

- 我想把機器放在房間裡，因此特別在意運作音量。
- 平常列印的東西不大，以前 Ender 2 Pro 的 165 × 165 mm 對我就很夠用，A1 mini 的平台尺寸也符合需求。不過 MakerWorld 上有些模型沒有 A1 mini 的列印設定，下載後仍要自己調整。
- 當時遇上週年慶，A1 mini Combo 的價格是 349 美元，剛好成為換機的最後一個理由。（結果活動結束後，價格也沒有調回去 XD）

以下記錄從開箱、AMS lite 換色，到用 MakerLab 製作彩色浮雕的過程。

## 採購過程

我買的是 A1 mini Combo，也就是本體加上 AMS lite。收到之後，大部分結構都已經完成，依照說明把零件、線材和料盤裝好，再讓機器執行校正，就可以開始列印。和以前常常要自己調平台、找首層問題相比，這次從開箱到印出第一個測試件快了不少。

AMS lite 可以同時準備多捲線材，除了自動換料，也能直接做多色列印。我先用色票模型測試不同色塊與換色結果，印出來的效果很直覺，但換色過程會產生清料廢料；顏色切換越多，耗材與列印時間通常也會跟著增加。


{% asset_img  AMSliteTest.webp AMS lite 測試 %}

## 製作浮雕效果

Bambu Lab 的 MakerLab 有提供浮雕製作工具，可以從 [Make My Lithophane](https://makerworld.com/zh/makerlab/makeMyLithophane?from=makerlab) 開始建立模型。

最後可以做出這樣的效果。一般光線下看起來像有紋理的薄板，從背後打光後，影像的明暗與顏色才會變得明顯。

{% asset_img  cover.webp A1 mini 做出的浮雕效果 %}

{% asset_img  lithophane(dark).webp A1 mini %}

製作時先上傳照片，再選擇浮雕類型、尺寸和外框。照片的主體如果清楚、背景不要太複雜，轉出來會比較容易辨識。完成設定後下載模型，用 Bambu Studio 開啟並對應 AMS lite 裡的線材顏色。

{% asset_img program_1.webp 上傳照片並開始建立浮雕 %}
{% asset_img program_2.webp 選擇浮雕的呈現方式 %}
{% asset_img program_3.webp 調整圖片裁切範圍 %}
{% asset_img program_4.webp 設定浮雕尺寸 %}
{% asset_img program_5.webp 調整圖片的顏色 %}
{% asset_img program_6.webp 預覽浮雕效果 %}
{% asset_img program_7.webp 設定要列印的機器條件 %}
{% asset_img program_8.webp 下載模型檔案 %}
{% asset_img program_9.webp 在 Bambu Studio 開啟模型 %}
{% asset_img program_10.webp 對應列印線材顏色 %}
{% asset_img program_11.webp 切片後預覽各層 %}
{% asset_img program_12.webp 準備傳送列印工作 %}

{% asset_img setting_1.webp AMS lite 線材準備 %}

彩色浮雕不是直接把墨水印在表面，而是用不同線材與厚度控制透光效果。因此線材的顏色和排列需要照產生器的設定準備，切片後也要再檢查一次，避免 AMS 料槽對錯顏色。

## 最近使用發生的問題

最近一號機偶爾會提示卡料，但實際檢查沒有看到耗材卡住。我已經把 AMS lite 拆下來檢查，暫時還找不到明確原因。因為問題尚未解決，這裡先保留紀錄，之後確認是感測器、料管還是其他地方造成，再回來更新。（更新：後來我的做法是直接到拓竹的官網重新買一組進線材的零件，結果就解決了）

## 使用心得

從舊機器換到 A1 mini，最明顯的感受不是單純印得更快，而是開印前少了很多準備。自動校正和 AMS lite 讓我更願意直接嘗試多色模型，MakerLab 這類工具也把照片轉浮雕的流程整理得很完整。

它的列印空間不算大，多色列印也要接受額外的清料與時間成本。不過以我平常製作小物、外殼和實驗模型的需求來說，這個尺寸反而剛好。至少目前不用再花一個晚上只為了調好第一層，真的輕鬆很多，拓竹的機器真的有比較穩定一點。
