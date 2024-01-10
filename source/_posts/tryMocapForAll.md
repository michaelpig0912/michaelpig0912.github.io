---
title: MocapForAll 動態追蹤軟體測試！
katex: true
date: 2023-12-29 16:56:38
categories: animation
tags:
  - MoCapForALL
  - animation
  - motion Capture
  - VRM
  - software
cover: startCapture.webp
---

## 前言
先前找到的 freemocap 雖然是免費，而且開源的，但沒辦法做到影像的即時分析，而且 blender 可能會需要比較繁瑣的設定，因此我開始尋找其他的解決方案。後來就找到了這款 MocapForAll，這次來測試看看這款動態追蹤軟體。

---

## 軟體簡介

### 軟體下載

下載連結：[steam 下載連結](https://store.steampowered.com/app/1759710/MocapForAll/?l=tchinese)

費用：1699 NTD (有試用版)

Note：可以免費試用，但在輸出動做到其他軟體的時候 (例如透過 VMC 傳遞資料到的動態捕捉的軟體時，會只能運行十秒，然後中斷捕捉十秒，再開始運作時秒)

{% asset_img steamDownload.webp Steam的下載頁面 %}

### 效果

測試追蹤的效果如下：

<video width="100%" height="100%"  src="./demo.mp4" controls></video>

### 優點

1. 即時的反應追蹤情況。
1. 可以透過 ChArUco 紙板校正攝影機的位置。
2. 不用穿裝備就可以做動態捕捉，身體、手部、臉部可以同時記錄。
3. 多個的視訊鏡頭同時捕捉，讓位置訊息更準確。
5. 安裝方便，不用自己設定許多東西
6. 支持 VRM 格式，可以直接把 VRM 的模型丟進來。
7. 可以透過 VMC 協議傳遞資料，並且可以串多個軟體使用。


### 缺點

1. 有一些功能需要付費 (NTD 1699 元) 才能達成。
2. 只能分析單人動作，多人動作系統會無法判別。
3. 一定需要兩個攝影機以上才能操作。
4. 稍微有點吃電腦效能，實際使用 4060 來跑順上很多。
5. blender 要轉出來需要另外一個外掛才能進行 (VMC4B)。

---

## 硬體設置 (事前準備)

### 相機準備

我這次是透過兩台手機 (一隻是 Android，另一隻是 iphone ) 作為IP 攝影機，兩台攝影機的位置夾角為九十度(一個拍正面，一個拍側面)。

並且用了兩個不同的軟體，這兩個軟體都有分為電腦端跟手機端，會選擇這兩個軟體是因為這兩套軟體都可以在電腦上面產生一個虛擬鏡頭，讓 MocapForAll 可以追蹤。

{% asset_img ipcam.webp IP 攝影機設定 %}

- Camo (左)：

    - PC端下載：[下載](https://reincubate.com/camo/downloads/)
    - 手機端下載：[Android 下載](https://play.google.com/store/apps/details?id=com.reincubate.camo&utm_source=reincubate&utm_medium=site&pli=1)、[IOS 下載](https://apps.apple.com/us/app/camo-webcam-for-mac-and-pc/id1514199064)
    - 費用：大部分功能免費，高畫質功能需要收費。
    - 特點：功能滿強大的，可以遠端操作手機的相機，也可以使用類似face center 功能，不過實際使用發現 wifi 環境下傳輸可能會比較不穩定，因此我是使用 USB 連手機使用。

- Droid (右)：

    - PC端下載：[下載](https://www.dev47apps.com/droidcam/windows/)
    - 手機端下載：[Android 下載](https://play.google.com/store/apps/details?id=com.dev47apps.droidcam)、[IOS 下載](https://apps.apple.com/us/app/droidcam-webcam-obs-camera/id1510258102)
    - 費用：大部分功能免費，高畫質功能需要收費 (NTD 170 元)，但可以透過觀看廣告，解鎖一小時的高畫質模式。
    - 特點：操作簡單，無線傳輸的狀況出乎意料的穩定。

### 紙板準備

我依照[官方校正教學](https://akiya-research-institute.github.io/MocapForAll-Manual/en/how-to-capture/calibrate-cameras/prepare-markers/)，官方有多種校正方式，而我採用的是 ChArUco 板法。校正要做相機的內部校正跟位置校正的紙卡(ChArUco 板法)，因此需要準備兩個不同的紙板。

- 相機內部校正的紙卡
  - 印刷 A4 大小以上( 我印的大小是 A3)，並且黏在瓦楞板上。
  - [檔案下載](https://raw.githubusercontent.com/Akiya-Research-Institute/MocapForAll-Wiki/main/resources/calibration/IntrinsicCalibration.png)

{% asset_img camCalibration.webp 相機校正 %}

- 位置校正的紙卡(ChArUco 板法)
  - 印刷 A2 大小的紙卡，並且黏在瓦楞板上。
  - [檔案下載](https://raw.githubusercontent.com/Akiya-Research-Institute/MocapForAll-Wiki/main/resources/calibration/ExtrinsicCalibration.png)

{% asset_img posCalibration.webp 位置校正 %}

---

## 軟體設置

可以參考官方的教學手冊，相關的設定以及建議的定位方式都有說明。

[官方的操作手冊](https://akiya-research-institute.github.io/MocapForAll-Manual/)

### 開啟軟體

首先，先打開軟體，接著在旁邊的 setting 選擇 Calibration，選擇我們所要使用的 ChArUco board，接著改變下面的 ChArUco board [m] 的大小，這邊要用尺量出你的 ChArUco board 的一格有多大，我這邊量出來為 13 公分。

{% asset_img CebSetting.webp 校正模式選擇 %}

### 新增相機

接著新增相機，選擇要使用的相機，並且選擇方向及解析度。

{% asset_img camSetting.webp 相機設定 %}

### 相機內部校正

接著按下面的 Calibration 中的 intrinsic 的 Start，這時將相機內部校正的紙卡放在相機前即可，過一陣子會聽到一聲"叮"，並且狀態改為 Calibrated 即為校正完成。

{% asset_img camCC.webp 校正內部相機 %}

接著在校正另外一台相機，直到所有相機都呈現 Calibrated。

### 相機位置校正

先將 ChArUco board 放在兩台相機都可以清楚看到的位置的地板上，接著按下面的 Calibration 中的 Extrinsic 的 Start，電腦就會開始校正相機的位置。

{% asset_img camPC.webp 校正相機的位置 %}

完成後會聽到一聲"叮"，並且狀態改為 Calibrated 即為校正完成，上面也會改顯示為 Ready 。

接著在校正另外一台相機，直到所有相機都呈現 Calibrated。

如此一來相機的校正就都完成了。

### 設定 VRM 模型

接下來要將 VRM 模型放入軟體中，以下是簡單的說明。

#### 下載 VRM 模型

VRM 的模型可以在 [booth](https://booth.pm/en/search/VRM) 中找到，其中有免費跟付費的可以選擇，使用時也要注意模型的使用規範。

另外提醒一下，本示範中所使用的模型也是從這邊找到的，並非我自己製作的。

#### 匯入 VRM 模型

直接把 VRM 的模型拖入軟體的畫面中間，這時候會跳出一個詢問追蹤方式的視窗，直接選擇上面的選項即可。

{% asset_img inputVRM-1.webp 匯入 VRM 的詢問 %}

{% asset_img inputVRM-2.webp 接著就會看到你的模型在畫面中間了 %}

---

## 開始追蹤

接著按下左上角的 "Start Capture"，就可以開始追蹤了。

{% asset_img startCapture.webp 開始追蹤 %}

## 問題排除

- 如果發現人物會有漂浮的感覺，可以按上面的 "find Ground"，然後在陸地上走一走，就會自動校正好位置。

- 如果發現人物的上肢或下肢與追蹤的人物位置有落差時，可以在 Setting > Coordinates > Scales 來校正角色的上肢與下肢的位置。

{% asset_img CebSetting.webp 校正模式選擇 %}

- 電腦跑起來效率太差，跑起來太卡的話：
   - 如果你有 Nvidia 的險卡，可以在 "Setting > General > RunDNN on ，改成 "GPU_DirectML"。
   - 改變追蹤精度 Capture body 改成 speed ++。
   - 改變追蹤精度 Capture hand 改成 Lite。

以上方法都可以增加跑起來的 FPS，個人測試 3060 筆電顯卡，可以跑到大約 20 幀左右，桌電 4070 可以跑到 60 幀左右，不過不同的動作也會影響到幀率的高低。

---

## 效果影片

最終追蹤出來的效果如下：

<video width="100%" height="100%"  src="./demo.mp4" controls></video>

---

## 結語

這個軟體追蹤的效果比我預期的好很多，並且像是坐下等複雜且手腳交錯的情境，這個軟體都可以很好的追蹤到動作。

不過表情部分可能會因為臉部離手機太遠，有時候會追蹤不到，但這個軟體可以結合 VMC 的其他軟體來補齊這個問題，像是可以透過 vseeface 來進行表情的判定，未來也可以綁一台手機在臉部的位置，就可以做到比較精緻的臉部追蹤。
