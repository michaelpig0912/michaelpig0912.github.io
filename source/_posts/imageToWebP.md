---
title: 如何使用 Python 將圖片轉換成 WebP
katex: true
date: 2023-04-04 15:38:22
categories: code
tags:
  - python
  - code
  - SEO
cover: sit.webp
---
## 使用 Python 快速輕鬆地將 HEIC、JPG、PNG 轉換為 WebP
當我們在製作網頁時，通常需要大量的圖片，但是網頁的載入速度會因為圖片的大小而變慢，進而導致 SEO 的分數變差。 WebP 是一種由 Google 推出的圖片格式，可以有效地減小圖片的大小，同時也保持了圖片的品質。在這篇文章中，我們會使用 Python 來將 HEIC、JPG、JPEG 和 PNG 格式的照片轉換成 WebP 格式，並且移除其中的照片資訊，以保護個人隱私。

## 安裝依賴庫
 Pillow 是一個 Python 圖像處理庫，而 pillow-heif 是一個 Pillow 套件，可以處理 HEIF 格式的圖片。要使用這個套件，請在命令行中輸入以下指令：
```bash
pip install pillow pillow-heif
```
## 程式
這個程式會先從指定的目錄中，尋找 HEIC、JPG、JPEG 和 PNG 格式的照片，並且使用 Pillow 來將它們轉換成 WebP 格式。
也會同時移除照片中的 EXIF 資訊。

這個程式的主要要達到的功能有三個：

1. 想要將 HEIC、JPG、JPEG 轉換為 WebP ，並且解析度不更改，檔名也維持一樣。
2. 將想要轉換的 HEIC、JPG、JPEG 檔案放在與程式相同位置的 `/image` 資料夾下，並且輸出的檔案在同一資料夾內。
3. 移除其中的 EXIF 資訊。

接下來是程式碼的說明，
1. 程式的主要流程是使用`os.walk`函數遍歷圖片資料夾中的所有檔案，判斷檔案類型是否為 heic、jpg、jpeg 或 png，如果是就呼叫 convert_to_webp 函數進行轉換。
2. `convert_to_webp`函數中，我們首先使用Pillow套件的`Image.open`函數讀取圖片檔案，然後將其轉換為 RGB 模式，因為 WebP 不支援其他模式的圖片。
3. 接著，我們使用`Image.getexif`函數獲取圖片的exif資訊，如果有 EXIF 資訊，則轉換為 bytes 類型，否則為空 bytes。
4. 最後，我們使用`Image.save`函數將轉換後的圖片儲存為 WebP 格式，設置品質為 80，並移除 EXIF 資訊。
5. 如果轉換成功，就輸出成功訊息，否則輸出錯誤訊息。
6. 最後加上判斷程式是否作為主程式執行的判斷，如果是，就呼叫`main`函數，這樣在執行這個程式的時候，就可以自動遍歷指定的資料夾，並轉換所有符合條件的圖片檔案了。

```python
import os
import sys
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

def convert_to_webp(input_file, output_file):
    try:
        img = Image.open(input_file)
        img = img.convert("RGB")
        exif_data = img.getexif()
        if exif_data:
            exif_bytes = exif_data.tobytes()
        else:
            exif_bytes = b''
        img.save(output_file, "webp", quality=80, exif=exif_bytes)
        print(f"Successfully converted {input_file} to {output_file}")
    except Exception as e:
        print(f"Error converting {input_file} to {output_file}: {e}")

def main():
    script_directory = os.path.dirname(os.path.abspath(__file__))
    input_directory = os.path.join(script_directory, "image")

    for root, _, files in os.walk(input_directory):
        for file in files:
            file_ext = os.path.splitext(file.lower())[1]
            if file_ext in ('.heic', '.jpg', '.jpeg', '.png'):
                input_file = os.path.join(root, file)
                output_file = os.path.splitext(input_file)[0] + ".webp"
                convert_to_webp(input_file, output_file)

if __name__ == "__main__":
    main()
```

## 運行程式
要使用此程式，請按照以下步驟操作：

1. 確保已經安裝了 Python 以及 Pillow 和 pillow-heif 。
2. 將上述程式儲存為名為 `convert_to_webp.py`。
3. 在程式所在的目錄下創建一個名為 image 的文件夾，將想要轉換的圖片放入該文件夾中。
4. 打開命令列 ( CMD )，進入至程式所在的目錄，然後運行以下命令：
```bash
python heic_to_jpg.py
```
5. 程式將自動尋找` /image `文件夾中的所有圖片，並將其轉換為 WebP 。
6. 轉換後的 WebP 文件將與原來的 HEIC 圖片的相同的文件夾中。

## 結論
總結來說，這個程式可以幫助想要使用 WebP 來縮小網頁圖片的人，並且移除其中的照片資訊，避免暴露個資的需求。使用這個程式，讀者可以輕鬆地將自己的圖片轉換為 WebP 格式，從而提升網頁載入速度和用戶體驗。注意，這個程式僅支援HEIC、JPG、JPEG 和 PNG 格式的圖片，如果要轉換其他格式的圖片，需要修改程式碼。希望這篇說明文能夠幫助讀者理解這個程式的作用和使用方法，如果有任何問題或建議，歡迎在下方留言。

## Windows可直接用的exe檔案
本次的內容有打包好的檔案，因此就不用額外用 Python 和安裝東西，下載[此github上的內容](https://github.com/michaelpig0912/image2WebP/releases)，並且解壓縮。接著會看到裡面有幾個檔案，如下圖所示。
{% asset_img Packageimage2WebP.webp 打包好的檔案 %}

1. 將 HEIC 圖片放入`/image`的資料夾內。
2. 點擊"image2WebP.exe"
3. 再進入`/image`的資料夾內，即可看到轉成 WebP 的檔案。
