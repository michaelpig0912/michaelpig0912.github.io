---
title: 如何使用 Python 將 HEIC 轉換為 JPG
katex: true
date: 2023-04-03 21:28:14
categories: code
cover: sea.webp
tags:
  - python
  - code
---
## 使用 Python 快速輕鬆地將 HEIC 轉換為 JPG
HEIC 格式是一種由 Apple 推廣的高效圖像格式，它具有更好的壓縮效果和更高的影像品質。但儘管 HEIC 格式在 Apple 設備上廣泛使用，但在其他平台（如 Windows 和 Android）上仍然存在一些兼容性問題，這使得許多用戶在想要分享 HEIC 圖片時感到困擾。

本文將介紹如何使用 Python 編寫一個簡單的程式，將 HEIC 格式的圖片輕鬆快速地轉換為更通用的 JPG 格式。我們將使用 Pillow 和 pillow-heif 來解決這個問題。而會選擇 pillow-heif 的原因，是因為原先想要在 windows 系統安裝 pyheif ，但是發現很多問題導致裝不起來，因此才會改用 pillow-heif 。

## 安裝依賴庫
首先，我們需要安裝 Pillow 和 pillow-heif ，打開命令列並運行以下命令：

```bash
pip install Pillow pillow-heif
```

## 程式
這個程式的主要要達到的功能有兩個
1. 想要將 HEIC 轉換為 JPG ，並且解析度不更改，檔名也維持一樣。
2. 將想要轉換的 HEIC 檔案放在與程式相同位置的 `/image` 資料夾下。

接下來，請參考以下的 Python 程式碼。該程式中，
1. 包含一個名為 `convert_to_jpg` 的函數，用於將 HEIC 文件轉換為 JPG 文件。
2. 另一個 `main` 函數負責查找 image 文件夾中的所有 HEIC 文件並對其進行轉換。

```python
import os
import sys
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

def convert_to_jpg(input_file, output_file):
    try:
        img = Image.open(input_file)
        img = img.convert("RGB")
        img.save(output_file, "JPEG", quality=95)
        print(f"Successfully converted {input_file} to {output_file}")
    except Exception as e:
        print(f"Error converting {input_file} to {output_file}: {e}")

def main():
    script_directory = os.path.dirname(os.path.abspath(__file__))
    input_directory = os.path.join(script_directory, "image")

    for root, _, files in os.walk(input_directory):
        for file in files:
            file_ext = os.path.splitext(file.lower())[1]
            if file_ext == '.heic':
                input_file = os.path.join(root, file)
                output_file = os.path.splitext(input_file)[0] + ".jpg"
                convert_to_jpg(input_file, output_file)

if __name__ == "__main__":
    main()
```

## 運行程式
要使用此程式，請按照以下步驟操作：

1. 確保已經安裝了 Python 以及 Pillow 和 pillow-heif 庫。
2. 將上述程式儲存為名為 heic_to_jpg.py 的文件。
3. 在程式所在的目錄下創建一個名為 image 的文件夾，將想要轉換的 HEIC 圖片放入該文件夾中。
4. 打開命令列 ( CMD )，進入至程式所在的目錄，然後運行以下命令：

```bash
python heic_to_jpg.py
```

程式將自動尋找 `/image` 文件夾中的所有 HEIC 文件並將其轉換為 JPG 文件。轉換後的 JPG 文件將與原來的 HEIC 圖片的相同的文件夾中。

## 結論
這次我們介紹如何使用 Python 和 Pillow，將 HEIC 圖片轉換為 JPG 格式。這是一個簡單但實用的程式，可以方便地將 HEIC 圖片轉換為更通用的 JPG 格式。如果您有任何問題或想了解更多關於 Python 圖像處理的信息，請隨時在評論區提問！

## 擴展功能
雖然我們在這篇文章中主要關注將 HEIC 轉換為 JPG，但您還可以使用類似的方法將 HEIC 文件轉換為其他圖像格式，如 webp。您還可以使用 Pillow 庫進行更高級的影像處理，例如調整影像大小、應用濾鏡和編輯影像的資料數據等。

## Windows可直接用的exe檔案
本次的內容有打包好的檔案，因此就不用額外用 python 和安裝東西，下載[此 github 上的內容](https://github.com/michaelpig0912/heic2jpg/releases)，並且解壓縮。接著會看到裡面有幾個檔案，如下圖所示。
{% asset_img PackageHeic2Jpg.webp 打包好的檔案 %}

接著按照底下步驟操作：
1. 將 HEIC 圖片放入`/image`的資料夾內。
2. 點擊"heic2jpg.exe"
3. 再進入`/image`的資料夾內，即可看到轉成 JPG 的檔案。
