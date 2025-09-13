---
title: PSP_2007 左邊肩鍵壞掉|維修紀錄
katex: true
date: 2025-08-23 21:14:54
categories: maker
tags:
  - PSP
  - fix
  - maker
  - game console
cover: psp_01.webp
---

## 前言

最近在福和橋下的二手市集買到一台二手的 PSP，只要 600 元，但是不確定是否好壞，而且賣這麼便宜感覺有鬼，不過還是買回來了，想說如果是簡單的壞掉，就自己修修看。

{% asset_img pspFix_01.webp 機器剛買回來的樣子 %}

買到機器以後，就馬上到附近的跳蚤市場商店買二手的遊戲片來測試，每片只需要 50 元左右，就隨便挑了幾片。

{% asset_img psp_06.webp 在跳蚤市場買的遊戲片 %}

在插上電源後，發現這台的電池無法充電，而且電池的背蓋也壞掉，不過可以正常開機，畫面也很漂亮，很難相信這是一台將近 15 年的機器。

{% asset_img psp_05.webp 遊戲測試 %}

不過放入遊戲片以後，就發現左(L)邊肩鍵壞掉，無法操作，所以就決定拆機看看。

## 拆機

上網要找 PSP 的拆機教學，不過好像找不到專門換 L 肩鍵的教學，連找 ifixit 都找不到。

後來發現要參考 [ifixit 拆 PSP 記憶卡槽](https://zh.ifixit.com/Guide/PSP+2000++Memory+Stick+Slot+Replacement/1273?lang=en) 的教學。拆得過程中，發現 PSP 的記憶卡槽是跟左邊的按鈕的零件在一起的，所以可以直接參考記憶卡槽的拆解教學。

一開始就是把電池拔掉，並且要把一個保固貼紙撕掉，接著拆螺絲，就可以把機殼拆開。

{% asset_img pspFix_02.webp 拔掉電池和撕開保固貼紙 %}

在拆的過程中遇到第二個問題，就是螺絲崩牙生鏽，所以拆到一半就拆不下去了。

{% asset_img pspFix_06.webp 螺絲崩牙生鏽 %}

無奈只好直接凹塑膠殼，強迫把機殼打開，不過幸好機殼沒有任何電線，不會用壞機器。

{% asset_img pspFix_03.webp 直接凹塑膠殼 %}


接著就是照著 ifixit 的教學，把 L 肩鍵拆下來、把前排按鈕拆下來，跟把螢幕拆開。就可以拆下記憶卡槽跟左邊按鈕了。

{% asset_img pspFix_04.webp 把記憶卡槽拆下來 %}

接著就慢慢的把薄膜拆下來，然後換上新買的薄膜就可以了，淘寶大約賣 50 元台幣。
(題外：沒想到 PSP 原來是用薄膜開關的)

{% asset_img pspFix_05.webp 記憶卡槽拆下來的樣子 %}

接著就組裝回去，就可以完成維修了。

## 小測試

修完以後，也買了新的記憶卡跟電池，前前後後大概又多花了 400 元台幣來維修，裝入記憶卡跟電池後，就可以正常使用了。

{% asset_img psp_02.webp 經典的PSP畫面 %}

接著就是放一些以前會看的動畫或音樂，桌面也換成 rella 老師畫的初音，以前很喜歡他的作品，一下子就回到 10 年前的感覺了。

{% asset_img psp_01.webp 初音的桌布 %}

音樂的部分放了以前手機都會有的音樂，主要應該是以一些 vocaloid、動畫、遊戲的歌曲，還有就是楓之谷的歌，一下子回憶都回來了。

{% asset_img psp_04.webp 未聞花名的 OP %}

## 影片與轉檔

影片只有放一些 YouTube 上面有的影片，不過這台 PSP 的螢幕真的很大，很難想像這個機器的解析度只有 480x272，看起來很舒服。

{% asset_img psp_03.webp internet overdose 主題曲 MV %}

另外，遇到 PSP 的影片格式與字幕的問題，因此就請了 chatGPT 幫我寫一個轉檔跟加字幕在影片上的 python 程式，以下是程式碼：

``` python
import argparse
import subprocess
from pathlib import Path

def convert_video(input_file, output_file, subs_mode, force_style, use_gpu):
    # 使用 scale2ref 確保縮放後的尺寸適合 PSP 規格 (480x272)
    vf_filters = [
        "scale=480:272:force_original_aspect_ratio=decrease",
        "pad=480:272:(480-iw)/2:(272-ih)/2"
    ]

    # 檢查字幕
    subs_file = input_file.with_suffix(".ass")
    if subs_mode == "burn" and subs_file.exists():
        subs_filter = f"subtitles='{subs_file.as_posix()}'"
        if force_style:
            subs_filter += f":force_style='{force_style}'"
        vf_filters.append(subs_filter)

    vf = ",".join(vf_filters)

    # 決定編碼器 - 使用更好的壓縮設置
    if use_gpu == "nvidia":
        vcodec = ["-c:v", "h264_nvenc", "-preset", "p6", "-rc", "vbr", "-cq", "28"]
    else:
        vcodec = ["-c:v", "libx264", "-preset", "medium", "-crf", "23"]

    cmd = [
        "ffmpeg", "-y", "-i", str(input_file),
        "-vf", vf,
        *vcodec,
        "-profile:v", "baseline",
        "-level", "3.0",
        "-maxrate", "1200k", "-bufsize", "2400k",
        "-c:a", "aac", "-b:a", "96k", "-ar", "48000", "-ac", "2",
        str(output_file)
    ]

    print("執行指令:", " ".join(cmd))
    subprocess.run(cmd, check=True)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="輸入影片資料夾")
    parser.add_argument("--output", required=True, help="輸出資料夾")
    parser.add_argument("--subs", choices=["none", "burn"], default="none", help="字幕模式")
    parser.add_argument("--force-style", help="ASS 字幕樣式，例如 FontName=Arial,FontSize=18")
    parser.add_argument("--gpu", choices=["cpu", "nvidia"], default="cpu", help="是否啟用 GPU 加速 (NVENC)")
    args = parser.parse_args()

    input_dir = Path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    for mp4_file in input_dir.glob("*.mp4"):
        output_file = output_dir / mp4_file.name
        try:
            convert_video(mp4_file, output_file, args.subs, args.force_style, args.gpu)
            print(f"✅ 轉換完成: {output_file}")
        except subprocess.CalledProcessError as e:
            print(f"❌ 轉換失敗: {mp4_file}, 錯誤: {e}")

if __name__ == "__main__":
    main()
```

新建一個 videos 資料夾，把要轉換的影片放進去，然後新建一個 out 資料夾，就會把轉換後的影片放進去。

如果不要加字幕，只要下：

``` bash
python convert_video.py --input ./videos --output ./out --subs none --force-style FontName=Arial,FontSize=18 --gpu cpu
```
如果要加字幕，就下：

``` bash
python psp_batch_convert.py --input ./videos --output ./out --subs burn --force-style "FontName=Arial,FontSize=50" --gpu nvidia
```