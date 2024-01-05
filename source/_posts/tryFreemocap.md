---
title: 免費動態捕捉軟體，嘗試使用 freemocap 來做動作捕捉
katex: true
date: 2023-11-02 15:30:27
categories: animation
tags:
  - freemocap
  - animation
  - motion Capture
  - blender
  - software
cover: cover.webp
---
## 簡介
先前有使用過 wonderStudio 的動態捕捉，但是會卡在一些問題，像是運算速度比較慢，且需要付滿貴的費用，因此後來持續研究是否有免費的動態補捉軟體。

---
## 軟體介紹

[FreeMoCap](https://freemocap.org/) 一個開源且免費的動態追蹤軟體，這套軟體可以運用到要做動態捕捉的遊戲，並且透過普通的網路攝影機就可以做到動態追蹤的效果，而不用買高昂的追蹤設備。

### 效果

測試動態追蹤的效果如下：

<video width="100%" height="100%"  src="./blenderMocap.mp4" controls></video>

### 優點
1. 免費開源的動態捕捉方案。
2. 不用穿裝備就可以做動態捕捉，可以透過 ChArUco 紙板校正。
3. 可以單個或多個的視訊鏡頭同時捕捉，讓位置訊息更準確。
4. 對於電腦的效能要求不會很高。
5. 活躍的 discord 社群，有問題可以去那邊問。
6. 身體、手部、臉部可以同時記錄。
7. 可以傳遞資料到 blender。

### 缺點
1. 分析需要一段時間，並非及時演算。
2. 只能分析單人動作。
3. 似乎只能支援 CPU 分析， GPU 不知道要怎麼啟動。
4. blender 要轉出來需要另外一個外掛。

---

## 如何使用

### 相機設置
我在我的房間裝了三台視訊鏡頭，型號是：KTNET 的 C990，實際拍攝時會保持房間的燈光充足，避免造成動態捕捉的效果不好。

{% asset_img roomset.webp 我在房間裝了三台視訊鏡頭 %}

不過不推薦用這一個品牌的視訊鏡頭，開高畫質的情況下，跑下來會 LAG，而且有一些小問題，建議可以找多支手機連接到電腦做視訊鏡頭效果會比較好。

---

### 軟體設置
可以參考官方的教學手冊，裡面說明的滿清楚的。<br>
[官方的操作手冊](https://freemocap.github.io/documentation/getting_started/)

#### 安裝會使用到的軟體

1. 安裝 Anaconda 環境，避免以前 python 安裝的東西造成程式衝突。

2. 會使用到 `git clone` ，因此也要先安裝git (但好像也可以直接用 pip install freemocap 安裝)

3. 因為動態追蹤完以後可以導入 blender，因此需要安裝 blender。

4. 如果要導入 blender 可以使用 ajc27 所寫的 blender addon。在使用軟體前記得先將外掛安裝好。
[點我進入外掛的 github](https://github.com/freemocap/ajc27_freemocap_blender_addon)

#### 建立電腦環境
官方建議使用3.9 ~ 3.11 之間的 python，所以建立的環境是 3.11 版的。這邊安裝可能要跑一下下。

{% asset_img conda.webp 環境安裝 %}

```python
conda create -n freemocap python=3.11
```

接著進入到剛剛設定好的環境。

```python
conda activate freemocap
```

<p style="font-size:0.8rem;color:#F55">(不過先前使用的時候，會沒辦法直接輸入指令就可以進入到環境，需要重新開 terminal 才能使用)</p>

---

### 軟體安裝

#### 第一種安裝方式
進入到環境以後，用 git 複製 freemocap 的程式。

```python
git clone https://github.com/freemocap/freemocap
```
{% asset_img clone.webp git 複製 %}

進入 freemocap 的資料夾。
```python
cd freemocap
```

進入 freemocap 安裝 freemocap 所需的程式。
```python
pip install -e .   
```
{% asset_img install.webp 安裝相關的依賴包 %}

輸入`python -m freemocap` 執行 GUI 程式，
這時候應該會看到圖形介面會跑出來。
{% asset_img cover.webp 執行完應該會看到 GUI 的介面 %}

#### 第二種安裝方式
同樣進入到環境以後，直接執行 `pip install freemocap` 安裝全部的內容。(不過我沒嘗試過這種方式安裝，所以不知道會發生什麼問題。)

輸入`freemocap` 執行 GUI 程式。
這時候應該會看到圖形介面會跑出來。

---

### 使用freemocap
這邊示範將示範多個攝影機的情況，下面說明硬體跟軟體要怎麼準備。

#### 硬體方面

接著準備好 ChArUco 紙板，紙板圖檔可以在他們的 [github](https://github.com/freemocap/freemocap/tree/main/freemocap/assets/charuco) 上面找到。

{% asset_img ChArUc.webp ChArUc紙板 %}

我是印出來 A3 大小的紙板，後面黏上珍珠板，這樣會比較平整且好拿。

#### 軟體方面

首先先點選這個首頁上方的 cameras 書籤
{% asset_img cover.webp 點選這頁中的cameras %}

#### 設定相機

按下 Detect Available Cameras 的按鈕，

{% asset_img detect.webp 按下本頁中最大的按鈕 %}

這時候會看到你有的相機都會到中間的窗格上，可以透過右邊的窗格調整解析度、曝光度及方向。

{% asset_img setCam.webp 按下本頁中最大的按鈕 %}
<p style="font-size:0.8rem;color:#F55">(不過先前測試的時候，發現我的攝影機沒辦法開到 1080p，所以都開 960*540 左右而已。 )</p>

#### 校正

接著將 Record Motion capture 的選項改為 Record Calibration Video 的選項，並且輸入 ChArUco 板中的一個格子的大小為幾 mm。

{% asset_img Calibration.webp 校正設定 %}

接著就直接按下 Start Calibration Recording

接著拿起準備好的 ChArUco 板，在鏡頭前面左右晃動，
必須要同時讓兩個攝影機都可以看到紙板的正面。

可以參考官方的校正教學。

[官方校正示範](https://www.youtube.com/watch?v=GxKmyKdnTy0&t=1786s)

按暫停以後，後續會跳出電腦分析後的結果。

{% asset_img CalibrationCam.webp 校正的數據 %}

#### 正式開始的動態追蹤

將選項改為 Record Motion Capture ，並且按下 Start Motion Capture Recording，

{% asset_img recMotionCapture.webp 開始做動態追蹤 %}

接著，就可以做動態追蹤，接著按下 Stop Recording 就會暫停追蹤。接著程式就會自動進行分析動作，這邊需要一段時間來分析。(會因為因片的長短，分析所需的時間也會不一樣)

{% asset_img runMocap.webp 電腦正在跑分析 %}

- 如果追蹤效果不如預期可以在 Control > process Data 的地方改變追蹤的效果及穩定度。

{% asset_img recSetting.webp 修改追蹤的效果 %}

如果先前電腦有安裝好 blender 及外掛，應該會自動跳出來。如果沒有可以在 Export Data 的地方做 blender 的路徑設定。

{% asset_img blenderSetting.webp blender設定 %}

<p style="font-size:0.8rem;color:#F55"> 另外，設定的時候有遇到一個小問題，就是 blender 一直抓不到路徑，後來調整為舊版的就可以了。</p>

#### blender 設定

前面跑完以後，應該會自動開啟 blender，這時你會看到你拍的影片及預設的骨架位置。

1. 安裝 freemocap 的外掛，另外還要安裝 rigify，並且在 blender 中啟用外掛。

   [freemocap 的 blender 外掛](https://github.com/freemocap/ajc27_freemocap_blender_addon)

   {% asset_img blenderAddon.webp blender 外掛 %}

2. 找到旁邊的工具欄 (快捷鍵 n)，找到剛剛安裝的外掛，依序上面的編號按下來，
   1. 先按 1.Adjust Empties。
   2. 再調整骨頭長度，再按 2. Reduce Bone Length Dispersion
   3. 再按 3. Add Finger Rotation Limits (不過實測好像會出 bug，我是直接跳過這一步)
   4. 接著 4. Add Rig 就會看到骨架了。
   {% asset_img blenderAddonSetting.webp 外掛設定 %}

   5. 選擇要使用的身體骨架，這邊採用預設的 Skelly，並且按下 Add Body Mesh
   6. 現在會出現一個骷髏頭的 Mesh ，展示剛剛你做的動作了。

    {% asset_img blenderAddRig.webp 動態追蹤的效果 %}

### 效果影片

<video width="100%" height="100%"  src="./blenderMocap.mp4" controls></video>

---

## 結語
Freemocap 是一款強大的動態追蹤軟體，不過目前使用起來可能還是需要花一些時間來研究，才能使用的起來，而且我目前還在研究要怎麼換模型。不過這款軟體的 discord 滿活躍的，很多問題都可以問到，而且外掛方面有持續更新，期待未來這個軟體的表現。