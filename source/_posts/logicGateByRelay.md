---
title: 第一台計算機 model K，是如何用繼電器來達到計算？
katex: true
date: 2023-11-19 12:04:05
categories: technology
tags:
    - technology
    - circuit
    - computer
    - history
cover: threeLight.webp
---

## 前言
最近在研究半導體相關的活動，研究到邏輯閘的部分，看到了一個滿有趣的故事，看到當時貝爾實驗室的 George Stibitz 用繼電器開發出了第一台計算機 model K，聽說會取這個名字是因為 George Stibitz 是利用空閒時間，在廚房裡面所組裝出這個計算機。

讓我想到先前老黃在開箱新一代的 nvidia 顯卡，也是從在廚房裡面拿出新的顯示卡，似乎有致敬的感覺。

## 簡介
後來在研究這段歷史，其實 George Stibitz 做的事情，核心是將二進位的數學，轉換成邏輯的方式呈現，像是 George Stibitz 做出的二進位半加法器，其實是用電路的邏輯閘組出將和 (Sum) 跟 進位 (Carry) 的功能的電路。

像是：在兩個一位元二進位數相加時，總共會有四種可能，三個結果

$$
0+0=0 \\
1+0=1 \\
0+1=1 \\
1+1=2 \\
$$

如果換成二進位的話，可以表示成：

$$
0+0=00 \\
1+0=01 \\
0+1=01 \\
1+1=10 \\
$$

從中會發現其規律，二進位的 Curry (進位) 則是兩個數字都要為 1 時，才會輸出 1，不然其他情況下都是 0，

$$
0+0=\boxed{0}0 \\
1+0=\boxed{0}1 \\
0+1=\boxed{0}1 \\
1+1=\boxed{1}0 \\
$$
這個就是邏輯閘中的 AND，真值表如下所示。

$$
\def\arraystretch{1.5}
   \begin{array}{c:c:c}
    & 1 & 0 \\ \hline
   1 & 1 & 0 \\
   \hdashline
   0 & 0 & 0
\end{array}
$$

這邊可以看成是兩個繼電器串聯，就可以要兩個繼電器都打開，才能讓店通過，因此透過兩個繼電器就可以達成通電的效果。

---
而 Sum (第一個位數) ，如果如果兩個一位元的數字中，有任何一個數字是 1 的話，則這個位數會出現 1 ；或者是只要有兩個位數相同時就會出現 0，
$$
0+0=0\boxed{0}  \\
1+0=0\boxed{1} \\
0+1=0\boxed{1} \\
1+1=1\boxed{0} \\
$$

這個就是邏輯閘中的 XOR，真值表如下所示。

$$
\def\arraystretch{1.5}
   \begin{array}{c:c:c}
    & 1 & 0 \\ \hline
   1 & 0 & 1 \\
   \hdashline
   0 & 1 & 0
\end{array}
$$

透過繼電器的交錯的連接方式，就可以達到這個效果。

從上面的例子，可以知道電腦的計算核心，是透過不同邏輯閘的電路(不同邏輯閘的組合方式)，來達到計算的功能。後續也可以用相同的邏輯方法，組出來特定功能的計算機電路。

## 構造

這次也趁著假日，透過繼電器組出了三個一位元二進位數的全加法器，總共使用了八個繼電器，

全加法器的邏輯閘如下所示，其實就是兩個半加法器，再透過並聯達到 OR 的效果。

### 全加法器的邏輯閘
{% asset_img fulladderLogicgate.webp 全加器的邏輯閘構造 %}

### 全加法器的電路圖
{% asset_img FulladderCircuit.webp 全加器的電路圖 %}

### 全加法器的實際電路演示
實際做到的效果：

這個裝置上面有兩個燈，綠燈代表 2<sup>0</sup> ，藍燈代表 2<sup>1</sup>

- 當只有打開一個開關的時候，綠燈會發光，代表是 2<sup>0</sup>，也就代表是 1。

{% asset_img oneLight.webp 開一個開關，會只亮綠色的燈 %}

- 當打開兩個開關的時候，藍燈會發光，代表是 2<sup>1</sup>，也就代表是 2。

{% asset_img twoLight.webp 開兩個開關，會只亮藍色的燈 %}

- 最後三個開關都打開時，綠燈與藍燈都會發光，代表是 2<sup>0</sup>+2<sup>1</sup>，也就代表是 3。

{% asset_img threeLight.webp 開三個開關，兩個燈都會亮起來 %}

下面是實際的演示影片。
<div style="text-align:center;position: relative;width: 100%;padding-bottom: 56.25%;height: 0;overflow: hidden;">
<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="https://www.youtube.com/embed/7vHLpLg-dAI?si=q0xzSsVtU6YzyOK7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<div>

<div style="text-align:left">

## 後續
剛開始接觸這個專案覺得滿有趣的，只不過目前遇到一個很大的難關是要如何將這個內容帶給學生，因為當初 George Stibitz 所做的 model K 對於學生而言，可能很難理解為甚麼簡單的事情要搞成這麼複雜，希望未來有辦法可以決這個問題。

</div>