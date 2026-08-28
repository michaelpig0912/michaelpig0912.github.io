---
title: 讓 GBA SP 播放 Spotify：用 ESP32 與 Multiboot 打造點陣音樂播放器
date: 2026-08-11
categories: maker
tags:
  - GBA
  - ESP32
  - Spotify
  - Multiboot
  - 電子製作
  - 復古硬體
cover: gba-spotify-photo-4559.webp
---

> 這一篇以製作過程與初步原理為主。如果想繼續閱讀 Multiboot 握手、封包格式、音訊緩衝與 CRC 等細節，可以參考下一篇：{% post_link gba-sp-spotify-multiboot-ai-technical-notes 'AI 協作筆記：ESP32 如何透過 Multiboot 讓 GBA SP 播放手機音訊' %}。

最近做了一個有點荒謬，但又很想試試看的實驗：讓一台沒有改機、也沒有插燒錄卡的 GBA SP 播放手機上的 Spotify。

這當然不是為了追求音質。手機本身的喇叭和任何一副藍牙耳機都比較方便，但我就是想知道，能不能把現在的音樂，塞進 GBA 那顆有點粗糙的喇叭裡面，再替它做一個真的可以操作的播放器。

經過幾天反覆修改，目前已經可以透過 ESP32 接收手機的藍牙音訊，再從 GBA SP 播出來。畫面上也能顯示歌名、歌手、專輯名稱與專輯封面，並用 GBA 的按鍵控制 Spotify。

而且整個過程不需要拆開 GBA，也不需要把程式寫進卡帶。每次開機時，ESP32 都會透過 Link Port 把播放器暫時傳進 GBA；關機後，程式也會跟著消失。

{% asset_img gba-spotify-photo-4559.webp GBA SP 顯示 Spotify 點陣播放器、中文歌曲資料與專輯封面 %}

## 計畫是怎麼開始的？

一切的起點，是我有一天在 YouTube 看到有人把 GBA 做成汽車的速度表。看起來只要透過 Link Cable 將 GBA 連接到 MCU，就能把外部資料送到 GBA 的螢幕上顯示。覺得這件事滿有趣的，所以我也開始研究 GBA 的通訊功能。

<div style="width:min(100%,360px);aspect-ratio:9/16;margin:1.5rem auto;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/wi66iCHhRvk"
    title="使用 GBA 顯示汽車速度的示範影片"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    style="display:block;width:100%;height:100%;border:0;border-radius:8px;">
  </iframe>
</div>

查了一陣子後，才發現 GBA 有一個叫做 Multiboot 的功能。以前玩多人遊戲時，只要其中一台主機有卡帶，就能透過傳輸線把一小段遊戲程式暫時傳給其他沒有插卡帶的 GBA。我以前從來沒有用過這個功能，沒想到多年後第一次使用，竟然是為了做 Spotify 播放器 XD

最初其實是想挑戰做一個 GBA 版 YouTube。不過如果要讓 ESP32 即時處理影片，再把連續畫面傳進 GBA，不論運算效能或 Link Port 的傳輸量都不太實際。相較之下，音訊的資料量比較有機會控制，也很適合 GBA 那顆有點粗糙的喇叭，所以後來才把目標改成 Spotify 音樂播放器。

買到 Link Cable 之後，才真的開始踩接線、線色、插頭方向與通訊時序的坑。後來和 Codex 協作了一整天，一邊燒錄、一邊觀察畫面和聲音，再把每次失敗的現象整理回去修改，最後才把第一個可以播放的版本做出來。

## 整體是怎麼運作的？

整個資料流大致如下：

```text
手機 Spotify
    ↓ Bluetooth A2DP
NodeMCU-32S（ESP32）
    ├─ 接收並轉換藍牙音訊
    ├─ 接收歌名、歌手和專輯資料
    ├─ 將中文轉成 16px 點陣圖
    ├─ 下載並縮小專輯封面
    └─ 透過 Multiboot 傳送 GBA 播放器
    ↓ GBA Link Port
GBA SP
    ├─ 顯示播放器介面
    ├─ 從內建喇叭播放聲音
    └─ 將按鍵操作傳回 ESP32
```

Spotify 的登入、串流與音訊解碼仍由手機負責。ESP32 對手機來說，只是一個叫做 `GBA Spotify Speaker` 的藍牙喇叭，所以不需要在 ESP32 上登入 Spotify，也不用處理 Spotify 本身的串流格式。

ESP32 做的事情比較像是中間的翻譯器：一邊接收現代手機送來的藍牙音訊與歌曲資料，一邊把它們轉成二十多年前的 GBA 能夠理解的形式。

## 不用燒入卡的 Multiboot

一開始最重要的問題，是怎麼把自己寫的播放器放進沒有改機的 GBA。

最直接的方法當然是使用燒入卡，不過 GBA 本身就有一個叫做 Multiboot 的功能。以前部分多人遊戲可以透過 Link Cable，把一小段程式傳給另一台沒有插卡帶的 GBA，讓對方暫時加入遊戲。如果注意實際的開機過程，接收 Multiboot 程式時的音效和平常也不太一樣。最後會多出一小段聲音，畫面上的 Nintendo 字樣也會閃爍，表示 GBA 正在接收外部傳來的程式。

這次我讓 ESP32 扮演傳送程式的主機：

1. ESP32 開機後，先等待 GBA 進入 Multiboot 狀態。
2. GBA 沒有插卡帶時直接開機，或在有卡帶時按住 Start＋Select。
3. ESP32 經由 Link Port 傳送播放器程式。
4. GBA 驗證並執行收到的程式。
5. ESP32 切換成串流模式，開始傳送音訊、文字與封面。

GBA 端的播放器目前大約只有 9.9 KB。程式只存在暫存記憶體裡，因此關機後就會消失；下次開機時，再由 ESP32 重新傳一次。

{% asset_img gba-spotify-boot.webp 透過 Multiboot 載入後顯示的 Spotify 風格開機畫面 %}

下面是實際透過 Multiboot 啟動播放器的過程：

<video width="100%" controls preload="metadata" playsinline poster="gba-spotify-demo-4563-poster.webp">
  <source src="gba-spotify-demo-4563.m4v" type="video/mp4">
  你的瀏覽器不支援 HTML5 影片播放。
</video>

為了編譯 GBA 端的程式，我另外安裝了 devkitPro、devkitARM 和 libgba。完成的 `.gba` 檔會被包進 ESP32 韌體裡，所以實際使用時不需要再接電腦操作，只要替 ESP32 供電，再開啟 GBA 即可。這邊要非常感謝這些開源研究的大大們，有這些我才能完成這這個專案。

## 硬體與接線

這次使用的硬體不多：

- GBA SP
- NodeMCU-32S V1.2
- GBA Link Port 連接線
- 220Ω 電阻三顆
- 杜邦線與麵包板
- ESP32 的 Micro-USB 電源線
- 可以測量導通的電表

這個專案需要 Bluetooth Classic 的 A2DP Sink，因此目前使用的是原版 ESP32。依照 Espressif 的官方資料，[原版 ESP32 支援 Bluetooth Classic 與 Bluetooth LE](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/ble/overview.html)；[ESP32-C3](https://docs.espressif.com/projects/esp-idf/en/latest/esp32c3/api-guides/ble/overview.html)與 [ESP32-S3](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-guides/ble/overview.html)只支援 Bluetooth LE，ESP32-S2 則沒有藍牙，因此都不能直接取代這裡的 ESP32。

接線方式如下：

| GBA Link Port | 功能 | ESP32 |
|:---|---|:---|
| Pin 2 | SO | GPIO 19，中間串聯 220Ω |
| Pin 3 | SI | GPIO 23，中間串聯 220Ω |
| Pin 5 | SC | GPIO 18，中間串聯 220Ω |
| Pin 6 | GND | GND |

Pin 1 的 VDD 和 Pin 4 的 SD 沒有使用。ESP32 由 USB 獨立供電，兩邊只需要共地，不要直接使用 GBA Link Port 替整塊開發板供電。

接線看起來很簡單，實際上卻卡了我一段時間。網路上買到的副廠連接線，線材顏色不一定有固定規則。有些接點甚至沒有拉出線材，所以不能直接照著顏色接。

第一點是普通的聯機線有分大小頭，然後兩個頭的線接位置都不太一樣，而且不是每個頭都有電線，所以我只好把線整個拆掉後自己重裝。

|原本的 GBA Link Cable|剪開後露出的四條線|拆掉後的端子|
|---|---|---|
|{% asset_img gba-spotify-photo-4546.webp %}|{% asset_img gba-spotify-photo-4548.webp %}|{% asset_img gba-spotify-photo-4550.webp Link Cable %}|

一開始接完完全沒有反應，後來試了幾次才發現應該是自製的端子接觸不良，原本心灰意冷，不過多嘗試幾次後就突然成功了，超開心的。

## 把 Spotify 的聲音塞進 GBA

手機傳來的音訊通常是 44.1 kHz 或 48 kHz、16-bit 的立體聲 PCM，但 GBA 不需要也沒有餘裕再處理 Spotify、SBC 或 MP3。因此，音訊會先在 ESP32 上完成混音與重新取樣：

```text
44.1／48 kHz、16-bit、立體聲
              ↓ ESP32
16,384 Hz、signed 8-bit、單聲道
              ↓ Link Port
GBA Sound FIFO
```

轉換後的音質當然不會太好，不過資料量變得小很多，也保留了我想要的 GBA 味道。目前另外在 ESP32 端把振幅放大三倍，讓 GBA SP 的小喇叭不會太小聲。

每個音訊封包放入 256 個樣本，相當於 15.625 毫秒，因此正常播放時每秒需要傳送 64 個音訊封包。GBA 端準備了 16 個音訊區塊，一邊經由 Link Port 收資料，一邊用 DMA 把聲音送進 Sound FIFO。開始播放前會先累積 8 個區塊，大約是 125 毫秒的緩衝。

### 一開始只聽得到波波聲

第一次成功把聲音送進 GBA 時，雖然可以勉強聽出歌曲，但大部分都是斷斷續續的波波聲。畫面上的緩衝區也一直處於不穩定的狀態。我原本以為是封包太多，所以曾經嘗試降低傳送次數、切小緩衝區，或調整每包的資料量。不過後來發現，問題不只是速度，而是生產資料和播放資料的節奏沒有對上。

Link Port 傳送一包資料的速度，比播放一包音訊還快。如果 ESP32 一收到資料就全速塞進去，GBA 的環形緩衝會先被填滿，後面的 PCM 被丟掉，接著又因為缺資料而斷音。所以正常狀態下必須依照播放時間送出，只有剛開始或斷流後，才可以暫時加速填滿緩衝。

另一個更不容易發現的問題，是環形緩衝區繞回開頭後，程式會挑「編號最前面的空位」，而不是時間順序上的下一格。結果明明還有資料，播放游標前面卻可能出現一個洞，造成固定週期的卡頓。最後把讀寫位置都改成依序前進，並替緩衝區補上測試後，聲音才真正穩定下來。

### 為什麼切歌後又開始卡？

歌曲切換時，手機會短暫停止舊音訊，再開始傳送下一首歌。舊版本在資料用完後，仍會繼續播放一小段靜音。問題是後來送進來的新資料，也會立刻被消耗掉，緩衝區永遠補不回安全水位，於是切歌後就一直卡下去。目前的做法是：發生斷流時先停下音訊計時器，等重新累積 8 個連續區塊後再開始播放。切歌後可能會先安靜很短的一段時間，但比持續斷斷續續自然很多。

## 中文歌名不是直接傳文字

歌曲可以播放後，下一個問題是中文。

GBA 無法直接把 UTF-8 字串畫到螢幕上。如果把整套中文字型塞進 GBA 程式，Multiboot 檔案又會變得太大。所以我把字型放在空間比較充裕的 ESP32：

1. 手機透過 AVRCP 傳來歌名、歌手與專輯名稱。
2. ESP32 使用 16px 高的字型，先把 UTF-8 文字畫成 1-bit 點陣圖。
3. 點陣圖切成數個封包傳給 GBA。
4. GBA 不需要理解 Unicode，只要照著收到的像素顯示。

目前使用 [GNU Unifont Traditional 17.0.04](https://unifoundry.com/pub/unifont/unifont-17.0.04/font-builds/) 的子集，支援繁體中文、英文、日文假名、注音、標點和常見符號，授權則是 [SIL Open Font License 1.1](https://unifoundry.com/OFL-1.1.txt)。

字型子集大約 974 KB，放在 ESP32 的 Flash 裡不是太大的問題。每段文字最高會先轉成 512×16 的黑白圖，不過目前播放器為了減少畫面閃爍，只會在內容改變時重畫，因此長文字的連續捲動還沒有真正啟用；超出欄位寬度的部分暫時不會顯示。罕見的 CJK Extension B 字元與 Emoji，目前仍會顯示成方框。

## 歌名、歌手和專輯為什麼會對不上？

實機測試時還發生過一個滿奇怪的問題：換歌後，歌名、歌手與專輯會來自不同首歌。有時甚至要先按暫停，畫面才會更新。原因是手機送來的歌曲資料不是同一時間抵達。切歌的瞬間可能先收到新歌名，接著還殘留上一首的專輯名稱；如果每收到一個欄位就立刻更新，畫面就會拼出一組不存在的歌曲資訊。

後來我改成收到換歌通知後先等一下，讓手機端的事件穩定，再把歌名、歌手和專輯組成同一個版本一起傳送。GBA 會先在背景組合完整資料，三個欄位都收到後才一次換上畫面；ESP32 也會等待完成代號，如果傳輸不完整就重新送一次。

## 用 GBA 按鍵控制 Spotify

Link Port 的資料交換是雙向的，所以 ESP32 傳送聲音時，也能讀回 GBA 的按鍵狀態，再轉成手機可以理解的 AVRCP 指令。

目前的操作如下：

| GBA 按鍵 | 功能 |
|---|---|
| A／B | 播放與暫停切換 |
| L | 上一首 |
| R | 下一首 |
| 方向鍵上／下 | 音量增加／降低 |
| 方向鍵左／右 | 倒退／快轉約 10 秒 |

快轉與倒退使用藍牙的 Rewind／Fast Forward 媒體指令。AVRCP 沒有直接指定「目前時間加減 10 秒」的通用指令，所以最後跳多少秒仍會依手機系統與 Spotify 的處理方式而有些差異。

實機測試時還曾經發生沒有按鍵，Spotify 卻自己跳到下一首的狀況。這是因為 Link Port 上偶發的錯誤資料剛好被辨識成按鍵命令。現在 GBA 會重複送出同一個按鍵版本，而 ESP32 必須連續收到三次相同內容才會接受，再用序號避免同一次按鍵被執行很多次。

實際播放與使用 GBA 按鍵操作 Spotify 的效果如下：

<video width="100%" controls preload="metadata" playsinline poster="gba-spotify-demo-4565-poster.webp">
  <source src="gba-spotify-demo-4565.m4v" type="video/mp4">
  你的瀏覽器不支援 HTML5 影片播放。
</video>

## 這個專案最麻煩的地方

原本以為最難的是 Multiboot，實際做完才發現，真正花時間的是讓好幾種不同速度、不同性質的資料共用同一條 Link Port。

音訊必須準時而且連續；文字可以慢一點，但三個欄位要屬於同一首歌；封面很大，可以最後再處理；按鍵資料量很小，卻不能被雜訊誤觸。它們全部放在同一條連線上時，就不能只是「收到什麼就傳什麼」，而是要決定誰先、誰後，以及失敗時怎麼恢復。為了比較容易找問題，我也把幾個容易出錯的部分拆成測試，包括封包與 CRC、接收端模擬、封面縮圖、音訊環形緩衝，以及按鍵雜訊過濾。很多問題在畫面上只會表現成「聲音卡住」或「封面沒換」，但實際原因可能是在完全不同的地方。目前 ESP32 韌體約 1.95 MB，GBA Multiboot 播放器約 9.9 KB。前者主要容納藍牙功能、中文字型與封面解碼；後者則盡量只保留顯示、音訊緩衝和 Link Port 通訊。

## 大部分程式是透過 Vibe Coding 完成的

這個專案的大部分程式碼，其實是透過 AI 輔助開發的方式完成。從 ESP32 的藍牙接收、GBA Multiboot、Link Port 通訊、音訊緩衝，到中文點陣字型與播放器介面，都是先把想做的功能、使用的硬體和實際遇到的現象描述給 AI，再由 AI 協助搜尋方向、撰寫程式、編譯、分析紀錄並反覆修改。

如果完全從 GBA 通訊協定、ESP32 藍牙堆疊和音訊處理開始研究，我想可能要花上幾個月才有辦法做到現在的程度。AI 讓嘗試的速度快了很多，也讓我可以從「我想讓 GBA 播 Spotify」這個想法出發，一步一步把它變成真的能運作的東西。

對我來說，這次最大的收穫不只是完成播放器，也是在過程中逐漸理解 Multiboot、音訊緩衝與資料傳輸為什麼要這樣設計。雖然我不會說自己已經完全掌握每一行程式，但能夠透過測試、提問和修改把原本不熟悉的硬體做出成果，正是這種開發方式最有趣的地方。

## 目前成果與限制

目前已經完成的功能包括：

- ESP32 透過 Multiboot 啟動未改機的 GBA SP
- 接收手機的 Bluetooth A2DP 音訊
- 從 GBA SP 內建喇叭播放 Spotify
- 顯示中、英、日文歌名、歌手與專輯名稱
- 顯示 64×64 點陣專輯封面
- 使用 GBA 按鍵控制播放、切歌、音量與快轉倒退
- 切歌後重新累積音訊緩衝
- 文字、封面完成確認與失敗重送
- 減少畫面閃爍與按鍵誤觸

它當然還有一些限制。音質固定是 16,384 Hz、8-bit 單聲道，不可能變成 Hi-Fi；專輯封面要看手機是否支援 AVRCP Cover Art；快轉秒數也由手機端決定；長文字目前也還不會持續捲動。另外，目前若 GBA 在串流途中重新開機，ESP32 也要一起重新啟動，才能重新走一次 Multiboot。

## 之後還能拿來做什麼？

目前的裝置還很粗糙。雖然 GBA 不需要插卡帶，但仍要接著 Link Cable、ESP32，還要另外處理供電。ESP32 目前也還沒有藏起來，處於一種工業極簡風 XD。之後如果繼續做，應該可以把電路整合得更小，變成比較方便攜帶的模組。

不過目前至少已經確認，這種方式不只可以控制 GBA 的螢幕，也能接收按鍵操作。未來不一定只能拿來播放音樂，例如讓 MCU 連上網路，顯示 ChatGPT、Claude 的使用量或其他服務狀態，就可以把 GBA 變成一台復古風格的資訊顯示器。若先把多幀畫面轉成適合 GBA 的低解析度資料，也許還能做成簡單的動畫或低幀率影片播放器。

另一條路則是直接製作可以連 Wi-Fi 的特殊卡帶。這樣不需要每次開機都重新執行 Multiboot，也不用在外面掛著 Link Cable，會更接近一個完整的裝置。這個方向也很值得之後繼續研究看看。

不過對我來說，這個專案最好玩的地方本來就不是實用性。

看到 Spotify 的開機畫面真的出現在 GBA SP 上，接著從那顆二十多年前的小喇叭播出手機裡的歌曲，還是有一種很奇怪的成就感，類似於很多人喜歡在奇怪的裝置上面安裝 DOOM 一樣。原本只為多人遊戲設計的 Link Port，最後同時傳了程式、聲音、中文字、封面與控制指令，讓這台老掌機暫時變成了一台現代的串流音樂播放器。

這大概就是我喜歡玩舊硬體的原因：它們的限制很多，但也正因為有限制，才會逼著人想出一些平常根本不會用到的方法。

## （後續）沒想到貼文飄出去了

完成第一個可以運作的版本後，我把測試影片放到了 Threads。當時只是很隨意地寫了一段：

> 用 Codex 和 ESP32 寫了 GBA 版本的 Spotify 播放器 XDD（其實本質是藍牙接收器）。可以做基本的音樂控制，還有很多 bug，且目前還是要依賴手機取得音源，不過感覺未來可以玩的東西變多了。

原本只是想記錄一下這個有點荒謬的實驗，沒想到貼文很快就被轉出去，也有不少人好奇這到底是怎麼做的。
原始貼文在這裡：[用 Codex 和 ESP32 寫了 GBA 版本的 Spotify 播放器](https://www.threads.com/@michaelpig912/post/Db8ud2qD6Ky)。
