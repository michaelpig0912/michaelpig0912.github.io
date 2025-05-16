---
title: 加熱鋁棒來展示熱的固體膨脹(熱漲冷縮)|熱
katex: true
date: 2025-05-16 15:15:38
categories:
tags:
  - science
  - 熱漲冷縮
  - heat
cover: thermal_1.webp
---

<span style="color: #f44;">注意：本實驗有點危險，實驗中會使用到酒精燈等加熱裝置，以及鋁棒加熱以後會變很燙，請勿直接用手拿取，並在老師的指導下進行。</span>

## 熱漲冷縮實驗

先前工作的關係，在研究固體的熱漲冷縮，最常看到的例子是銅球加熱後會卡在鐵環中，或是橋梁的伸縮縫。不過這幾種方法，很難讓學生看到固體的熱漲冷縮的變化過程。網路上有做固體的熱漲冷縮通常又會放一個指針，但是這個指針對於學生的理解上可能會造成負擔，因此我們想做做看是否可以透過更直接的方法來展示固體的熱漲冷縮。

固體的熱漲冷縮之所以難做，是因為固體的膨脹係數非常小，很難用肉眼看到。跟主管討論以後，嘗試看看兩根鋁管中間留一個小縫隙，並且加熱兩端的鋁管，直到膨脹後中間的縫隙消失，來展示固體的熱漲冷縮。

## 實驗效果

實驗效果意外的好，以下是實驗過程影片，放了兩個酒精燈來加熱，燒了大概五分鐘左右。

### 影片版本

<div style="text-align:center">
<iframe width="100%" height="440" src="https://www.youtube.com/embed/XVYLJl_4OUQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### 圖片版本

|剛開始|5分鐘|
|---|---|
|{% asset_img thermal_1.webp %} | {% asset_img thermal_2.webp %} |

縫隙真的不見了~

## 計算固體膨脹(實驗前估算)

### 條件

- 鋁管的線膨脹係數為 23 × 10⁻⁶ /K (在 20 °C 時)
    - 會選擇鋁管，是因為鋁的膨脹係數較大，膨脹較明顯。
    - 其他各明顯的可能會是一些重金屬類的材料，例如鉛、鉻等。
    - 常見的銅、鐵膨脹技術又比較低一點，所以才沒有選用。
- 鋁管的原始長度為 30 公分
- 鋁管的溫度變化為 80°C (從 20°C 到 100°C)

### 熱脹冷縮公式

$$\Delta L = \alpha \cdot L \cdot \Delta T$$

    其中：

    - ΔL：長度變化（單位：公尺，m）
    - α ：線膨脹係數，鋁為 23 × 10⁻⁶ /K (在 20 °C 時)
    - L = 0.3 m（原始長度，30 公分）
    - ΔT = 80°C（溫度變化從 20°C 到 100°C）

$$\Delta L = (23 \times 10^{-6}) \cdot 0.3 \cdot 80 $$
$$\Delta L = 0.000552 \, \text{m} = 0.552 \, \text{mm}$$
$$\Delta L = 0.552 \, \text{mm}$$

將整個鋁管加熱 80 度，其長度變化為 0.055 公分而已，這個膨脹量其實很小，真的很難用肉眼看到。因此我們使用了兩根，並且兩端都加熱，這樣膨脹的量就可以變成兩倍，也就是 0.11 公分左右。
