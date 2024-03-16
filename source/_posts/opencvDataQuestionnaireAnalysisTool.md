---
title: 研究問卷小工具，基於 openCV 的簡易數劇判別工具
katex: true
date: 2024-03-16 00:10:27
categories: code
tags: 
- python
- code
- openCV
cover: cover.webp
---

## 前言

最近組織要做有關於科學影片對於學生的學習成效的相關內容，因此在過程中會使用到一些問卷的東西，不過問卷內容一個一個分析實在是有點花時間，所以就簡單的跟 chatGPT 一起合作，寫了一個簡單的小程式，是透過 openCV 和 python 來對掃描後的PDF檔進行判別。

## 需求

1. 需要可以判別打勾的位置。
     1. 區分同一行的不同區域有不同得分。
     2. 區分不同行的題目位置。

1. 因為問卷是掃描成 PDF，所以需要可以連續判讀資料，並且可以輸出一個 CVS 檔案。

2. 如果有亂填答或重複的選項的項目，可以把 CVS 中的數據，改成 ??? 來提示，後續可以藉由人工確認。

3. 掃描位置大致上不會差太多，因此可以使用一個固定的位置進行判別。

## 邏輯

1. 我們問卷長的是這個樣子，一開始會有一個框框詢問要分析哪份檔案。

     {% asset_img data.webp 問卷形式 %}

     分析的方式是採用比較不優雅的方式進行，是直接將格子內不同位置的座標與大小都找出來，建立出一個分數區。所以在程式碼會看到大量的座標位置，如下圖所示。

     {% asset_img cover.webp 分析的位置(舊版) %}

     (在程式碼中的 color 參數是原先用來區分不同得分位置用，但後續沒有使用到)

2. 接著透過 openCV 把框線用掉。

3. 再透過 `if 0.3 < aspect_ratio < 2.5 and 3 < cv2.contourArea(contour) < 500:` 這段程式碼，控制物件的大小及比例，選出最符合打勾形狀的物件。

4. 檢查打勾區域與分數區是否重疊，並且打上分數。

     {% asset_img analysis.webp 數劇分析 %}

5. 將數據輸入到 CSV 中，把每一行的數據輸入到 CSV 中。如果發現一行中有兩個答案，將 CSV 中的數據改成 ??? ，再進行人工判別。

    最後生成的 CSV 如下圖所示，準確率滿高的，只不過如果有些勾勾，勾得太大，或是學生有塗改的東西，可能會造成判讀錯誤，這時需要人工再介入。

     {% asset_img csv.webp 分析後生成的 CSV 檔案 %}

## 程式碼

0. 安裝基本的程式庫

```python
pip install PyMuPDF ,Opencv-python ,numpy ,matplotlib
```

1. 以下是完整的程式碼

```python
import fitz  # PyMuPDF
import cv2
import numpy as np
import matplotlib.pyplot as plt
import csv
import os

# 題目的 Y 軸位置
question_intervals = [
        (380, 403),  # 第1題
        (404, 439),  # 第2題
        (440, 466),  # 第3題
        (467, 495),  # 第4題
        (496, 525),  # 第5題 
        #...略
    ]

# 題目的配分與判別位置
score_zones = [
    {'x1': 380, 'y1': 380, 'x2': 405, 'y2': 403, 'color': (255, 0, 0), 'score': 1},
    {'x1': 420, 'y1': 380, 'x2': 435, 'y2': 403, 'color': (0, 255, 0), 'score': 2},
    {'x1': 450, 'y1': 380, 'x2': 465, 'y2': 403, 'color': (0, 0, 255), 'score': 3},
    {'x1': 480, 'y1': 380, 'x2': 495, 'y2': 403, 'color': (255, 255, 0), 'score': 4},
    {'x1': 510, 'y1': 380, 'x2': 534, 'y2': 403, 'color': (0, 255, 255), 'score': 5},
    {'x1': 380, 'y1': 404, 'x2': 405, 'y2': 439, 'color': (255, 0, 0), 'score': 1},
    {'x1': 420, 'y1': 404, 'x2': 435, 'y2': 439, 'color': (0, 255, 0), 'score': 2},
    {'x1': 450, 'y1': 404, 'x2': 465, 'y2': 439, 'color': (0, 0, 255), 'score': 3},
    {'x1': 480, 'y1': 404, 'x2': 495, 'y2': 439, 'color': (255, 255, 0), 'score': 4},
    {'x1': 510, 'y1': 404, 'x2': 534, 'y2': 439, 'color': (0, 255, 255), 'score': 5},
    {'x1': 380, 'y1': 440, 'x2': 405, 'y2': 466, 'color': (255, 0, 0), 'score': 1},
    {'x1': 420, 'y1': 440, 'x2': 435, 'y2': 466, 'color': (0, 255, 0), 'score': 2},
    {'x1': 450, 'y1': 440, 'x2': 465, 'y2': 466, 'color': (0, 0, 255), 'score': 3},
    {'x1': 480, 'y1': 440, 'x2': 495, 'y2': 466, 'color': (255, 255, 0), 'score': 4},
    {'x1': 510, 'y1': 440, 'x2': 534, 'y2': 466, 'color': (0, 255, 255), 'score': 5},
    {'x1': 380, 'y1': 467, 'x2': 405, 'y2': 495, 'color': (255, 0, 0), 'score': 1},
    {'x1': 420, 'y1': 467, 'x2': 435, 'y2': 495, 'color': (0, 255, 0), 'score': 2},
    {'x1': 450, 'y1': 467, 'x2': 465, 'y2': 495, 'color': (0, 0, 255), 'score': 3},
    {'x1': 480, 'y1': 467, 'x2': 495, 'y2': 495, 'color': (255, 255, 0), 'score': 4},
    {'x1': 510, 'y1': 467, 'x2': 534, 'y2': 495, 'color': (0, 255, 255), 'score': 5},
    {'x1': 380, 'y1': 496, 'x2': 405, 'y2': 525, 'color': (255, 0, 0), 'score': 1},
    {'x1': 420, 'y1': 496, 'x2': 435, 'y2': 525, 'color': (0, 255, 0), 'score': 2},
    {'x1': 450, 'y1': 496, 'x2': 465, 'y2': 525, 'color': (0, 0, 255), 'score': 3},
    {'x1': 480, 'y1': 496, 'x2': 495, 'y2': 525, 'color': (255, 255, 0), 'score': 4},
    {'x1': 510, 'y1': 496, 'x2': 534, 'y2': 525, 'color': (0, 255, 255), 'score': 5},
    #...略

]

def process_page(page, csv_writer, question_intervals, score_zones):

    
    # 獲取圖片
    pix = page.get_pixmap()
    output_image_path = f"page_{page.number}.png"
    pix.save(output_image_path)

    # 使用OpenCV讀取影像
    image = cv2.imread(output_image_path)

    # 將圖轉成灰階
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 調整取的二值圖
    binary_image = cv2.adaptiveThreshold(
        gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 19, 2)

    # 使用形態學與去除格線
    kernel_length = max(binary_image.shape[1] // 100, binary_image.shape[0] // 100)
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, kernel_length))
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_length, 1))

    vertical_lines_img = cv2.morphologyEx(binary_image, cv2.MORPH_OPEN, vertical_kernel, iterations=2)
    horizontal_lines_img = cv2.morphologyEx(binary_image, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)

    binary_image_no_lines = cv2.subtract(binary_image, horizontal_lines_img)
    binary_image_no_lines = cv2.subtract(binary_image_no_lines, vertical_lines_img)

    # 尋找二值圖中的勾勾位置
    contours, _ = cv2.findContours(binary_image_no_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 尋找特定比例的物件
    filtered_contours = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = float(w) / h
        if 0.3 < aspect_ratio < 2.5 and 3 < cv2.contourArea(contour) < 500:
            filtered_contours.append(contour)

    # 紀錄每個答案
    question_scores = ["" for _ in range(len(question_intervals))]
    # 定義區分與分數
    total_score = 0

    image_with_scores_and_boxes = cv2.cvtColor(binary_image_no_lines, cv2.COLOR_GRAY2BGR)

    # 檢查是否有重複的位置
     
    for contour in filtered_contours:
        x, y, w, h = cv2.boundingRect(contour)
        contour_center_x = x + w // 2
        contour_center_y = y + h // 2 
        
     #提示中心點位置
        cv2.circle(image_with_scores_and_boxes, (contour_center_x, contour_center_y), 3, (0, 255, 0), -1)
        

     # 繪製偵測到的數劇點位置
        cv2.rectangle(image_with_scores_and_boxes, (x, y), (x+w, y+h), (0, 255, 0), 2)

        # 確定輪廓與範圍
        
        for idx, interval in enumerate(question_intervals, start=1):
            start_y, end_y = interval
            if start_y <= contour_center_y <= end_y:
                # 檢查分區與勾選的位置
                for zone in score_zones:
                    zone_rect = (zone['x1'], zone['y1'], zone['x2'], zone['y2'])
                    if (x < zone_rect[2] and x+w > zone_rect[0] and y < zone_rect[3] and y+h > zone_rect[1]):
                        # 判定分數
                        score = zone['score']                        
                        if question_scores[idx-1] == "":
                            question_scores[idx-1] = score
                        elif question_scores[idx-1] != score:  # 如果有重複計分，將輸出的 CSV 的數值改成 ???
                            question_scores[idx-1] = "???"
                        
                        # 在圖片中繪製的分
                        cv2.putText(image_with_scores_and_boxes, str(score), (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)
                        break

    # 紀錄到 CSV
    page_data = [page.number] + question_scores

    # 寫入 CSV
    csv_writer.writerow(page_data)
    cv2.imwrite(f"page_{page.number}_with_scores.png", image_with_scores_and_boxes)


# 搜尋 PDF 位置
pdf_path = input("請輸入完整的PDF名稱(需要放在同一個目錄下)")

# 寫入 CSV
with open('scores_data.csv', 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    headers = ['第幾頁'] + [f'Q{i}' for i in range(1, 15)]  # 假設有 14 個問題
    csv_writer.writerow(headers)

    # 打開 PDF 每頁檢查
    doc = fitz.open(pdf_path)
    for page_number in range(len(doc)):
        page = doc.load_page(page_number)
        process_page(page, csv_writer, question_intervals, score_zones)
```