---
title: 【撰寫中】ComfyUI 初步嘗試與紀錄|從安裝到使用
katex: true
date: 2025-02-12 02:58:50
categories: AI
tags:
- ComfyUI
- AI 繪圖
- stable-diffusion
cover: cover.webp
---

## 前言
最近因為工作關係，又開始玩起 AI 繪圖，先前使用的是 automatic1111，前陣子看到有人推薦 ComfyUI，看起來介面跟 blender 的 node 邏輯很像，而且聽說可以做到許多的功能，所以這次嘗試使用 ComfyUI 來繪圖，並且記錄一下安裝過程和使用心得。

## 安裝 ComfyUI

現在 ComfyUI 已經有提供 windows 的安裝包，所以安裝上非常方便，只要下載安裝包並且解壓縮就可以使用。安裝的速度也非常快，大約 10 分鐘左右就可以完成安裝。比起以前用 automatic1111 還要自己安裝一堆東西，ComfyUI 的安裝方式真的方便很多。

下方是 ComfyUI 的安裝包 [下載連結](https://github.com/comfyanonymous/ComfyUI/releases/)，選擇 ComfyUI_windows_portable_nvidia.7z 這個檔案就可以了。不過可能要另外下載 7z 來解壓縮。解壓縮後會看到一個兩個 bat 檔案，因為我現在用的是 NVIDIA 的顯卡，所以選擇 `run_nvidia_gpu.bat` 這個檔案。點兩下後，會自動安裝一些東西，安裝完成後，就會自動開啟一個網站，這時候就可以開始使用 ComfyUI 了。

## 區域網路設定

ComfyUI 預設是使用本機的網路，所以只能在同一台電腦上使用。如果想要在其他電腦上使用，需要設定區域網路。只需要在 bat 改成 

```bash
.\python_embeded\python.exe -s ComfyUI\main.py --listen --windows-standalone-build
pause
```

這樣就可以在其他電腦上使用 ComfyUI 了。

## 安裝插件

ComfyUI 的插件非常多，可以到 [ComfyUI-Manager](https://github.com/Comfy-Manager/ComfyUI-Manager) 這個網站下載。

## ComfyUI 使用

1. UI 介紹
2. workflow 邏輯

## 資源

1. 資源如何下載 (Civitai)

## 模型簡介
1. stable-diffusion 模型簡介

SD1.5
flux
3. flux 模型簡介
4. flux 模型特性

## 提示詞如何透過 chatGPT 協助

## LoRA 模型

1. LoRA 模型與 comfyUI 共同使用
2. 套用 LoRA 與參數調整
3. LoRA 模型訓練方式 (線上訓練資源)
4. LoRA 模型 與 controlnet 和 comfyUI 共同使用

## controlnet

1. 不同 contronlnet 的效果
2. canny、depth、openpose、scribble