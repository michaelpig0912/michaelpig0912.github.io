---
title: Asus TUF F15 FX506HM 升級 SSD：簡單步驟就可以升級 SSD ！
katex: true
date: 2023-04-05 15:46:19
categories: unbox
tags:
  - unbox
  - pc
cover: pcOverviwe.webp
---
最近因為 AI 的各種應用的興起，像是 stable diffusion 或是聲音模仿的 AI 程式，但由於訓練 AI 模型時通常需要大量的數據儲存和高速讀取，再加上最近 SSD 價格有變得先前比較便宜一點，因此我決定將筆電來升級一下。在本文中將重點介紹 FX506HM 要如何升級 SSD 和注意事項。

## 筆電與 SSD 規格
1. 筆電：Asus TUF F15 FX506HM (i7-11800版本)
2. SSD：美光Micron Crucial P5 Plus 1TB
  a. 價格：2450 元 (原價屋)
  b. 規格：M.2 PCIe 2280、TLC顆粒
  c. 讀: 6600 MB/s / 寫: 5000 MB/s{% asset_img cover.webp SSD 外盒 %}{% asset_img SSD.webp SSD 本體 %}

<font color=#F55>※ 請注意：雖然此 SSD 支援 PCIe 4.0，但 Asus TUF F15 FX506HM 只支援到 PCIe 3.0，因此在後面的測試中會看到這個硬碟的速度讀取會卡在 3000 MB/s 左右，因此建議可以選擇 PCIe 3.0 SSD 就可以了。</font>

## 警語
在進行筆電拆機升級時，請確保您具備相關經驗和技能。如若不熟悉硬體操作，建議尋求專業人士的幫助，以免對筆電造成損壞。請謹慎操作，確保升級過程安全無虞。

## 步驟
1. 為了拆開筆電背蓋，請先將電腦關機，並拔掉電源。
2. 筆電背蓋共有11個螺絲，並且長短不一。{% asset_img pcCover.webp 筆電的螺絲孔位置，請注意左上角的螺絲是拆不下來的 %}{% asset_img screw.webp 螺絲長短不一 %}
3. 位於左上角的螺絲是固定在蓋板上的，可以轉鬆但拆不下來。{% asset_img screwIn.webp 拆不下來的螺絲內部 %}{% asset_img screwOut.webp 拆不下來的螺絲外部 %}
4. 使用塑膠的撬棒等工具，沿著筆電機殼邊緣輕輕撬開，直至取下蓋板。{% asset_img pcOverviwe.webp 拆開背蓋後會看到裡面的電路板 %}
5. 在安裝新 SSD 之前，務必先確保筆電已斷電，因此要先拔掉筆電的電池。{% asset_img power.webp 請先取下這邊的電源排線 %}
6. 找到 SSD 的插槽，但可能會需要先把附近的喇叭排線拔掉，接著再將 SSD 螺絲取下。
7. 安裝 SSD 時確保其與插槽對齊，然後用螺絲將其鎖緊。{% asset_img pcWithSSD.webp SSD 安裝 %}
8. 接著將剛剛移除的喇叭排線與電源插上，在這個過程中請小心，可能會產生火花。
9. 重新將蓋板蓋上，並將之前拆下的螺絲依順序鎖回原位。
10. 開機後，進入「磁碟管理」，將看到一個全新未分割的 SSD ，接著就是做磁碟分割跟格式化後，就完成安裝了。{% asset_img SSDintall.webp 「磁碟管理」中看到有讀取到 %}

## 參數
這邊使用 CrystalDiskMark 來測試硬碟速度，但讀取速度都卡在 3000 MB/s，但是理論上這個 SSD 讀取是可以跑到 6600 MB/s，這個差別可能是因為這台筆電只能支援到 PCIe 3.0，所以限縮了這個 SSD 的速度。
{% asset_img CrystalDiskMark.webp 用CrystalDiskMark看硬碟跑分 %}
