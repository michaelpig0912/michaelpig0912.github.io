---
title: (尚未完成) 如何設計一張具有 NFC 功能的 PCB 名片，從 kicad 到 JLCPCB 製作
katex: true
date: 2024-04-15 00:32:34
categories: maker
cover: cover.webp
tags:
  - maker
  - pcb
---

最近在研究電路板要如何送廠商製作，剛好看到在 instructables 上一個電路板的專案：[PCB Business Card With NFC](https://www.instructables.com/PCB-Business-Card-With-NFC/)，所以就參考了他的接線邏輯，再透過 kicad 自己規劃設計圖與給廠商製作。

下面是成品的名片：

{% asset_img cover.webp 名片外觀 %}

{% asset_img ledLight.webp 具有 NFC 跟 LED 發光功能的名片(部分資訊模糊處理)%}

## 匯入相關會使用到的圖檔

## 繪製電路圖

用其他的天線(antenna Loop)取代 NFC 天線
{% asset_img 1_schematic.webp 用其他的天線(antenna Loop)取代 %}

裡面所有使用的物料表，這邊要選好，之後做 PCB Layout 才會有接點可以使用
{% asset_img 2_element.webp 使用這些元件，天線是用別人現成的天線 footprint %}

## 修改天線定義

{% asset_img 3_1_antennaSet.webp 對天線按右鍵 %}
{% asset_img 3_2_antennaSet.webp 修改引腳名稱為P$1、P$2 %}

DMC 檢查

## 畫 layout

{% asset_img 4_toPCB.webp 進入 PCB 模式，將元件放上 %}
{% asset_img 4_2_pcbElement.webp 將元件放上 %}
{% asset_img 4_3_pcbElement.webp 將元件放上 %}

|圖示|說明|
|---|-------------|
|{% asset_img 5_layer.webp 許多層 %} | F_Cu ：正面的銅層 <br> B_Cu ：背面的銅層 <br>|


## 畫切割層，並且畫出圓角

{% asset_img 6_2_cutEdge.webp 將元件放上 %}
{% asset_img 6_3_cutEdge.webp 將元件放上 %}
{% asset_img 6_4_cutEdge.webp 將元件放上 %}
{% asset_img 6_5_cutEdge.webp 將元件放上 %}
{% asset_img 6_6_cutEdge.webp 將元件放上 %}

## 正面絲娟層增加LOGO跟圖案

{% asset_img 7_1_LOGOText.webp 輸入LOGO名稱 %}
{% asset_img 7_2_LOGOText.webp 輸入LOGO名稱 %}
{% asset_img 7_3_LOGOText.webp 輸入LOGO名稱 %}

## 調整元件放置的位置

{% asset_img 8_1_putElement.webp 將元件放上 %}
{% asset_img 9_1_putLine.webp 將元件放上 %}
{% asset_img 9_2_putLine.webp 將元件放上 %}

## 放置圖案
{% asset_img 10_1_putIcon.webp 將元件放上 %}
{% asset_img 10_2_putIcon.webp 將元件放上 %}
{% asset_img 10_3_putIcon.webp 將元件放上 %}
{% asset_img 10_4_putIcon.webp 將元件放上 %}
{% asset_img 10_5_putIcon.webp 將元件放上 %}
{% asset_img 10_6_putIcon.webp 將元件放上 %}

## 裝飾與預覽

{% asset_img 11_1_decorate.webp 將元件放上 %}
{% asset_img 11_2_decorate.webp 將元件放上 %}
{% asset_img 11_3_decorate.webp 將元件放上 %}
{% asset_img 11_4_decorate.webp 將元件放上 %}
{% asset_img 11_5_decorate.webp 將元件放上 %}
{% asset_img 11_6_decorate.webp 將元件放上 %}
{% asset_img 11_7_decorate.webp 將元件放上 %}
{% asset_img 11_8_decorate.webp 將元件放上 %}

## 安裝外掛

{% asset_img 12_1_plugin.webp 將元件放上 %}
{% asset_img 12_2_plugin.webp 將元件放上 %}
{% asset_img 12_3_plugin.webp 將元件放上 %}
{% asset_img 12_4_plugin.webp 將元件放上 %}

## 上傳 JLCPCB

{% asset_img 13_1_JLCPCB.webp 將元件放上 %}
{% asset_img 13_2_JLCPCB.webp 將元件放上 %}
{% asset_img 13_3_JLCPCB.webp 將元件放上 %}

## 上傳 SMT 資料

{% asset_img 14_1_SMT.webp 將元件放上 %}
{% asset_img 14_2_SMT.webp 將元件放上 %}
{% asset_img 14_3_SMT.webp 將元件放上 %}
{% asset_img 14_4_SMT.webp 將元件放上 %}
{% asset_img 14_5_SMT.webp 將元件放上 %}
{% asset_img 14_6_SMT.webp 將元件放上 %}
{% asset_img 14_7_SMT.webp 將元件放上 %}
{% asset_img 14_8_SMT.webp 將元件放上 %}
{% asset_img 14_9_SMT.webp 將元件放上 %}
{% asset_img 14_10_SMT.webp 將元件放上 %}


## 參考資料：
1. 本設計參考：[PCB Business Card With NFC](https://www.instructables.com/PCB-Business-Card-With-NFC/)
2. 天線電路圖：[Where to find NFC Class 6 antenna PCB Schematic for KiCad](https://forum.kicad.info/t/where-to-find-nfc-class-6-antenna-pcb-schematic-for-kicad/30212/2)，使用 albin 網友所改良的設計。