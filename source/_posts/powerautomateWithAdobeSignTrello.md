---
title: 透過 Power Automate 來自動化 Adobe Sign 的簽署流程與串聯 trello 和 slack (及踩坑紀錄)
katex: true
date: 2025-01-15 17:10:46
categories: code
tags:
  - code
  - Power Automate
  - Adobe Sign
  - Trello
  - Slack
  - Adobe Sign tags
  - google sheet
  - google drive
cover: cover.webp
---

## 目標

本次要透過 Power Automate 做到以下事情。

- 1. Trello（讀取到卡片有變更） 
- 2. Google Drive（到 google drive 取得 PDF）
- 3. Adobe Sign（上傳 pdf 到 adobe sign）
- 4. Google Sheets（讀取簽署人 Email 資料）
- 5. Adobe Sign（傳送 Adobe Sign 簽署連結）
- 6. Trello（將卡片更新為已簽署） 

## 實作

### 1. Trello（讀取到卡片有變更） 

