---
title: AI 協作筆記：ESP32 如何透過 Multiboot 讓 GBA SP 播放手機音訊
date: 2026-08-18
categories: maker
tags:
  - GBA
  - ESP32
  - Multiboot
  - Bluetooth
  - AI 協作
  - 技術筆記
---

> **AI 內容聲明**
>
> 本文由 OpenAI Codex 依照作者目前未公開的專案原始碼、實機測試紀錄與文末參考資料整理。文章中的架構說明、程式解讀及大部分文字由 AI 產生。
>
> 本文記錄的是 2026 年 8 月 18 日的專案狀態。部分 GBA Multiboot 資料來自社群逆向工程，早期握手時序也可能因線材、主機版本與實作方式而需要調整。請把它視為可供研究與交叉驗證的技術筆記，而不是唯一正確的規格。


如果只想看成品、接線與開發過程，可以先閱讀前一篇：{% post_link gba-sp-spotify-multiboot '讓 GBA SP 播放 Spotify：用 ESP32 與 Multiboot 打造點陣音樂播放器' %}。

這篇會沿著資料實際流動的順序，逐層拆解 GBA 啟動、Bluetooth 音訊、Link Port 封包、PCM 播放、歌曲文字、專輯封面、按鍵回傳與即時排程。部分數值直接對應目前的程式常數，後續版本若調整緩衝區或時序，本文中的數字也可能跟著改變。

## 1. 系統架構

整個系統並不是讓 GBA 或 ESP32 直接登入 Spotify。Spotify 的登入、網路串流與音訊解碼仍由手機處理，ESP32 對手機而言只是一台藍牙喇叭。

```text
手機上的 Spotify 或其他音訊 App
        │
        │ Bluetooth Classic
        │ A2DP：聲音
        │ AVRCP：歌曲資料與控制指令
        ▼
ESP32（NodeMCU-32S）
        ├─ 接收已解碼的 PCM
        ├─ 混合聲道、重新取樣與降低位元深度
        ├─ 將 UTF-8 文字畫成點陣圖
        ├─ 下載並縮小 JPEG 專輯封面
        └─ 排程所有 Link Port 封包
        │
        │ GBA Link Port，32-bit Normal Mode
        ▼
GBA SP
        ├─ 由 Multiboot 暫時執行播放器
        ├─ 使用 DMA、Timer 與 Sound FIFO 播放 PCM
        ├─ 顯示文字點陣與 64×64 封面
        └─ 將按鍵命令回傳給 ESP32
```

ESP32 使用 A2DP Sink 角色接收聲音，並使用 AVRCP 取得歌名、歌手、專輯名稱與播放狀態。A2DP 與 AVRCP 的角色和用途可以在 Espressif 的 Bluetooth Classic 文件中查到。（參考資料 5、6）

### 1.1 Link Port 的實際接線與訊號方向

目前硬體固定使用 NodeMCU-32S V1.2。GBA Link Port 六個接點中只使用四個：

| GBA 接點 | GBA 端名稱 | 資料方向 | ESP32 | 備註 |
|---:|---|---|---:|---|
| Pin 1 | VDD | GBA 輸出電源 | 不接 | 不用它替整塊開發板供電 |
| Pin 2 | SO | GBA → ESP32 | GPIO 19／MISO | 串聯 220Ω |
| Pin 3 | SI | ESP32 → GBA | GPIO 23／MOSI | 串聯 220Ω |
| Pin 4 | SD | 未使用 | 不接 | 目前協定不使用 |
| Pin 5 | SC | ESP32 → GBA | GPIO 18／SCLK | 串聯 220Ω |
| Pin 6 | GND | 共同參考 | GND | 兩邊必須共地 |

ESP32 由 USB 獨立供電。三顆 220Ω 電阻是串在 SO、SI 和 Clock 上的限流／阻尼元件，不是電壓轉換器，也不代表所有線長都一定能在同樣速度下穩定工作。副廠 Link Cable 的顏色沒有可靠標準，而且從插頭與主機插座方向看會互為鏡像，因此仍要用電表逐條確認。

ESP32 SPI Master 將 MOSI、MISO、SCLK 設定成每次 32-bit 的全雙工交換。因為 GBA Normal Mode 沒有 SPI 意義下的 CS，ESP32 設定 `spics_io_num = -1`。傳送資料時最高位元先上線，但 GBA 記憶體中的程式資料仍是 little-endian；這是「線上位元順序」和「CPU 記憶體位元組順序」兩個不同層次。（參考資料 7）

### 1.2 ESP32 與 GBA 各自的工作分工

ESP32 端沒有把所有事情塞進同一個迴圈，而是由數個 FreeRTOS task 和 callback 分工：

| 執行單元 | 主要工作 |
|---|---|
| A2DP callback | 接收 PCM、混合聲道、重新取樣後寫入 audio stream buffer |
| metadata task | 等待切歌事件穩定、查詢 title／artist／album |
| cover decode task | 在背景解碼 JPEG，避免阻塞 Link Port 傳送 |
| command task | 將 GBA 按鍵轉成 AVRCP press／release |
| sender task | Link Port 的唯一傳送者，排程音訊、文字、封面與 heartbeat |

讓 sender task 成為唯一操作 SPI 的工作很重要，否則兩個 task 同時傳輸，封包邊界就可能被互相插入。音訊 callback 也不直接等待 GBA，而是把資料快速放進 16,384-byte 的 ESP32 stream buffer；真正的傳送節奏由 sender task 決定。

GBA 端則分成三種執行時機：

- **Serial IRQ**：每收到一個 32-bit word 就更新封包 parser，並準備下一個回覆 word。
- **Timer 1 IRQ**：每播放完 256 個樣本，切換音訊 block 或處理 underrun。
- **VBlank 主迴圈**：讀取按鍵並在需要時重畫介面，避免在通訊中斷裡做耗時的畫圖。

這個分工的目的不是單純讓程式看起來整齊，而是避免藍牙事件、JPEG 解碼、Link Port 時序與畫面更新互相阻塞。

## 2. GBA 程式如何進入沒有卡帶的主機

### 2.1 建置 Multiboot 映像

GBA 端使用 devkitARM 與 libgba 編譯。建置目標名稱以 `_mb` 結尾，讓工具鏈產生從 EWRAM 執行的 Multiboot 映像，而不是假設程式位於卡帶 ROM 的 `0x08000000`。

產生的 `.gba` 檔會被複製到 ESP32 專案，再透過 ESP-IDF 的 `EMBED_FILES` 內嵌進 ESP32 Flash。ESP32 開機後，可以直接取得這段二進位資料的起點、終點與大小，不需要 SD 卡或額外檔案系統。

Multiboot 映像會補齊至 16-byte 邊界；目前傳送端接受約 `0x190` 至 `0x40000` bytes，也就是最大 256 KiB。實際播放器遠小於這個上限。

### 2.2 ESP32 模擬 Multiboot 主機

GBA 在沒有插卡帶時開機，或在有卡帶時按住 Start＋Select，會由內建 BIOS 進入 Multiboot 接收狀態。ESP32 則是傳送端，負責提供時鐘並發起每一次資料交換。（參考資料 2、3）

Multiboot 階段使用 256 kHz、32-bit Normal Mode。ESP32 的 SPI 周邊設定為 Mode 3、不使用 Chip Select，每次同時送出並讀回 32 bit。雖然電氣介面很像 SPI，但上層交換的內容是 GBA BIOS 規定的 Multiboot 協定。

主要流程如下：

```text
ESP32                                      GBA BIOS
  │── 0x00006202，反覆詢問 ─────────────────→│
  │←─ 0x72026202，表示已進入 Multiboot ─────│
  │── 傳送前 0xC0 bytes Header ─────────────→│
  │── 0x000063D1，傳送 palette ──────────────→│
  │←─ 回覆最高 byte 為 0x73，取得 cc ────────│
  │── 0x00006400 | hh ──────────────────────→│
  │── llll，傳送程式長度 ────────────────────→│
  │←─ 回覆中取得 rr，供最後 CRC 使用 ────────│
  │── yyyy，加密後的程式本體 ───────────────→│
  │── 0x00000065／0x00000066／CRC ──────────→│
  │←─ CRC 結果；成功後開始執行程式 ─────────│
```

前 `0xC0` bytes 是 GBA Header，未加密傳送，BIOS 會將它放到 EWRAM 的 `0x02000000`。程式本體從 `0x020000C0` 開始，必須以 EWRAM 位址為基準編譯。（參考資料 2）

目前程式的實際步驟比上圖再細一些：

1. 先檢查映像大小，再補齊到 16-byte 邊界。
2. 每隔約 2 ms 傳送 `0x00006202`，最多等待呼叫端指定的逾時時間。
3. 收到完整的 `0x72026202` 後，再送一次 `0x00006202` 和 `0x00006102`。
4. Header 共 `0xC0 / 2 = 96` 次傳輸，每次把兩個 little-endian bytes 放進低 16 bit。
5. 傳送 `0x00006200` 與 `0x00006202`，重新確認 Header 階段結束。
6. 重複傳送 `0x000063D1`，直到回覆最高 byte 成為 `0x73`；目前最多嘗試 256 次。
7. 傳送 `0x00006400 | hh`、長度 word，再開始傳加密 body。
8. body 傳完後重複 `0x00000065`，直到收到 `0x00750065`；接著送 `0x00000066` 和 CRC。

每一次 32-bit 傳輸後，ESP32 額外等待 60 µs，讓 GBA BIOS 有時間處理剛收到的資料。GBATEK 對 GBA-to-GBA 主機建議的間隔是另一個時序條件；外接 MCU 最後仍應以真機與邏輯分析儀結果調整。（參考資料 2、4）

目前這個單機版本會檢查辨識、palette 與 CRC-ready 階段是否進入預期狀態，但傳送每個加密 word 時主要以時序推進，沒有逐 word 嚴格比對所有 echo；最後的 CRC 回覆也會記錄而不是再次完整判定。若要做成可支援更多線材、不同主機或多台 GBA 的通用程式，這些回覆檢查仍可再加強。

### 2.3 種子、程式大小與 Multiboot 加密

目前只有一台接收端，另外兩個不存在的 client 以 `0xFF` 表示。ESP32 收到 GBA 的 `cc` 後，計算：

```c
hh = (cc + 0x0F) & 0xFF;

seed = 0xFFFF0000 |
       (cc << 8) |
       0xD1;
```

其中 `0xD1` 是這次選用的 palette data。`hh` 的一般定義是 `0x11 + client[1] + client[2] + client[3]`；把兩個缺席 client 的 `0xFF` 代入並只保留低 8 bit，就會得到 `cc + 0x0F`。

如果用 little-endian 的記憶體位元組順序看，初始 seed 是：

```text
最低位元組                                  最高位元組
┌────────────┬────────────┬────────────┬────────────┐
│ palette D1 │ client cc  │ absent FF  │ absent FF  │
└────────────┴────────────┴────────────┴────────────┘
```

所以 `0xFFFF0000 | (cc << 8) | 0xD1` 不是任意拼出的常數，而是把本次 palette、唯一一台 GBA 的 client data，以及兩個缺席 client 組成同一個 32-bit seed。

傳送的長度欄位寫成：

```c
length_word = (aligned_size - 0x190) / 4;
```

它與常見文件中的 `main_data_length / 4 - 0x34` 是同一件事，因為 main data 不包含前面的 `0xC0` bytes Header。

完整換算如下：

```text
main_data_length = aligned_size - 0xC0

main_data_length / 4 - 0x34
= (aligned_size - 0xC0) / 4 - 0x34
= aligned_size / 4 - 0x30 - 0x34
= aligned_size / 4 - 0x64
= (aligned_size - 0x190) / 4
```

Header 之後每次讀取一個 little-endian 32-bit word。傳送前先更新 rolling seed，再把原始資料、目的位址與固定常數 XOR 在一起：

```c
seed = 0x6F646573 * seed + 1;
destination = 0x02000000 + offset;

encrypted = plain
          ^ (0u - destination)
          ^ seed
          ^ 0x43202F2F;
```

這裡的 `0u - destination` 是 32-bit two's complement，也就是文件中常寫的 `(-0x02000000 - offset)`。把目的位址加入計算後，同一個明文 word 放在不同位置會得到不同密文，因此 body 不能任意交換順序。

C 語言的 unsigned 32-bit 乘法會自然只保留低 32 bit，所以 seed 更新可以直接寫成乘法，不需要另外做 `% 2^32`。如果改用不會自動 overflow 的語言重新實作，就必須明確遮罩 `& 0xFFFFFFFF`。

這不是專案自行設計的保密機制，而是 GBA BIOS Multiboot 格式的一部分。接收端會用相同規則還原資料；少做任何一步，BIOS 都不會正常啟動程式。（參考資料 2、3、4）

### 2.4 CRC 與 Kawasedo 彩蛋

ESP32 會對未加密的程式內容計算 BIOS 規定的 CRC，Normal 32-bit 模式使用初始值 `0xC387` 與 polynomial `0xC37B`。傳送完畢後，雙方透過 `0x65`、`0x66` 和 CRC 結果完成驗證。

每個 32-bit 明文 word 都由最低位元開始逐 bit 更新：

```c
for (unsigned bit = 0; bit < 32; ++bit) {
    if ((crc ^ word) & 1) {
        crc = (crc >> 1) ^ 0xC37B;
    } else {
        crc >>= 1;
    }
    word >>= 1;
}
```

CRC 計算的是 **plain data**，不是已經 XOR 過的 encrypted data。最後還要把 `hh`、長度階段收到的 `rr`，以及兩個缺席 client 的 `0xFF` 組成 final CRC word，再跑一次相同的 32-bit 更新。這讓主機與 BIOS 不只確認程式內容，也確認先前握手得到的狀態一致。

Multiboot 使用的數個常數來自 GBA BIOS 裡的字串：

```text
// Coded by Kawasedo
```

公開研究普遍將 Kawasedo 對應為任天堂工程師川瀬智広（Tomohiro Kawase）的暱稱。不過這只能支持他與這段程式有關，不能據此認定整套 GBA BIOS 都由他一個人完成。（參考資料 3、8）

## 3. Multiboot 完成後的自訂串流協定

GBA 開始執行播放器後，就不再使用 BIOS Multiboot 封包。ESP32 將 Link Port 時鐘切換為 512 kHz，雙方改用這個專案自行設計的串流協定。

每個 ESP32 → GBA 封包由以下欄位構成：

```text
Magic    0x47424131，也就是 ASCII "GBA1"
Header   type[31:24] | payload_words[23:16] | sequence[15:0]
Payload  最多 64 個 32-bit words
CRC-32   對 Header 與 Payload 計算 CRC-32/ISO-HDLC
```

目前的封包類型包括：

| Type | 內容 |
|---:|---|
| 1 | 256 個 signed 8-bit PCM 樣本 |
| 2 | 舊版文字 metadata，編號保留但目前不使用 |
| 3 | 啟動同步封包 |
| 4 | 16px 高的 1-bit 文字點陣分段 |
| 5 | 64×64 RGB332 專輯封面分段 |
| 6 | 播放／暫停狀態 |

此外，sender 會傳送 `type = 0`、payload 為空的 heartbeat。它沒有承載媒體資料，主要用途是讓 ESP32 在暫停時仍持續讀回按鍵與 ACK，也能在文字或封面最後一段完成後，多做一次交換取得更新後的狀態。

### 3.1 Header、序號與 CRC-32

Header 的位元配置是：

```text
31                     24 23                    16 15                     0
┌────────────────────────┬────────────────────────┬────────────────────────┐
│ packet type：8 bits    │ payload words：8 bits │ sequence：16 bits      │
└────────────────────────┴────────────────────────┴────────────────────────┘
```

`payload_words` 最大是 64，所以接收端最多需要暫存 256 bytes payload。`sequence` 每包加一，用於觀察封包順序；目前接收端主要依 Magic 與 CRC 判斷封包，尚未把 sequence gap 當成必然錯誤，因為遺失非音訊資料會由 generation ACK／retry 處理。

CRC 使用 CRC-32/ISO-HDLC 的 reflected polynomial `0xEDB88320`。初始值是 `0xFFFFFFFF`，依照線上 byte 順序處理 Header 與 Payload，送出前再反相：

```c
crc = 0xFFFFFFFF;
crc = crc32_word(crc, header);
for each payload word:
    crc = crc32_word(crc, payload_word);
send(~crc);
```

Magic 本身不納入 CRC。它只負責讓接收狀態機在雜訊或掉字後重新找到封包起點。

### 3.2 文字與封面的分段格式

Type 4 文字封包的前三個 payload words 是：

| Word | 位元內容 |
|---:|---|
| 0 | `field[31:24] | transfer_id[23:16] | chunk_index[15:8] | chunk_count[7:0]` |
| 1 | `width_pixels[31:16] | total_bytes[15:0]` |
| 2 | `byte_offset[31:16] | chunk_bytes[15:0]` |
| 3… | 最多 48 bytes 的 1-bit 點陣資料 |

Type 5 封面封包則使用：

| Word | 位元內容 |
|---:|---|
| 0 | `transfer_id[31:24] | chunk_index[23:16] | chunk_count[15:8]` |
| 1 | `byte_offset[31:16] | chunk_bytes[15:0]` |
| 2… | 最多 192 bytes 的 RGB332 像素 |

GBA 不只檢查 `chunk_index < chunk_count`，也會重新計算每段應有的 offset 與 length，拒絕範圍超出緩衝區或位置不符的 payload。已收過的 chunk 以 bitmap 記錄，重複封包不會再次增加完成數。

### 3.3 GBA 回覆 word 的位元配置

GBA → ESP32 狀態固定以最高 nibble `0xC` 開頭：

```text
31  28 27  24 23              16 15  12 11   8 7                 0
┌──────┬──────┬─────────────────┬──────┬──────┬───────────────────┐
│ 0xC  │文字  │ command seq／   │封面  │命令  │ ready audio      │
│      │ ACK  │ underflow count │ ACK  │      │ blocks            │
└──────┴──────┴─────────────────┴──────┴──────┴───────────────────┘
```

- 沒有按鍵命令時，中間 8 bit 回報 underrun counter 的低 8 bit。
- 有命令時，同一欄改成 command sequence，讓 ESP32 判斷是不是新的按鍵事件。
- 文字與封面 ACK 只傳 transfer ID 的低 4 bit，因此 ESP32 配發新 ID 時會避開 `0` 和目前仍被 ACK 的 nibble。
- `ready_audio_blocks` 合法範圍是 0 至 16，超過就視為雜訊資料而忽略。

全雙工交換有一個容易忽略的細節：GBA 在收到「目前這個 word」之前，就必須先把回覆放進 SIO register，所以 ESP32 讀到的狀態通常反映前一個傳輸完成時的狀況。這也是文字與封面傳完後要再送 heartbeat 才能穩定讀到最新 ACK 的原因。

GBA 接收端是一個簡單的狀態機，依序尋找 Magic、Header、Payload 和 CRC。只有 CRC 正確時，才把資料交給音訊、文字或封面模組；錯誤封包則整包丟棄，重新等待下一個 Magic。

Link Port 是全雙工的。ESP32 送出每個 word 時，也會收到 GBA 事先準備好的狀態 word，其中包含：

- GBA 已準備好的音訊區塊數量
- 文字與封面的完成代號
- 按鍵命令及其序號
- 音訊 underrun 計數的低 8 bit

因此 ESP32 不需要額外增加一條回傳線，就能同時知道 GBA 的緩衝狀態並接收按鍵。

## 4. 從 Bluetooth PCM 轉成 GBA 聲音

### 4.1 ESP32 不是在解碼 Spotify

手機先完成 Spotify 串流與音訊解碼，再透過 Bluetooth A2DP 將 SBC 音訊送給 ESP32。ESP-IDF 的藍牙堆疊負責 SBC，應用程式收到的是已解碼 PCM。（參考資料 5、6）

來源通常是 44.1 kHz 或 48 kHz、16-bit、雙聲道。ESP32 依序進行：

1. 將左右聲道平均成單聲道。
2. 以 phase accumulator 將來源取樣率轉成 16,384 Hz。
3. 對被合併的來源樣本取平均，降低直接丟點產生的失真。
4. 目前將振幅放大三倍，再進行飽和限制。
5. 取 16-bit PCM 的高 8 bit，形成 signed 8-bit PCM。

最後的音訊資料率是：

```text
16,384 samples/s × 1 channel × 1 byte = 16,384 bytes/s
```

這種做法運算量不大，很適合 ESP32，但它不是高品質的重取樣器，也沒有完整的低通濾波，所以音質與抗混疊效果都有明顯限制。

### 4.2 為什麼每包是 256 個樣本

每個音訊封包放入 256 個樣本：

```text
256 / 16,384 = 0.015625 秒
```

也就是每包 15.625 ms、每秒 64 包。這個大小同時是 GBA 環形緩衝區的一個 block，方便接收端直接管理。

ESP32 不能因為 Link Port 有空就把所有音訊一次送完。若傳輸速度比播放速度快，GBA 緩衝區會先被填滿並丟掉後續資料，之後反而因缺少連續資料而產生週期性斷音。因此正常播放時，ESP32 依照 15.625 ms 的絕對時間表送包；只有剛開始或 underrun 後，才暫時快速補滿緩衝。

### 4.3 Link Port 的頻寬預算

一個 Type 1 音訊封包包含：

```text
1 word Magic
1 word Header
64 words PCM Payload
1 word CRC
────────────────────
共 67 個 32-bit words
```

純位元資料是 `67 × 32 = 2144 bits`。在 512 kHz 時，實際 clock shifting 約需：

```text
2144 / 512,000 ≈ 4.19 ms
```

目前每個 word 後還保留 40 µs 間隔，整包後再等待 500 µs。只看程式設定，一個音訊封包大約占：

```text
4.19 ms + 67 × 0.04 ms + 0.50 ms ≈ 7.37 ms
```

它仍小於每包所代表的 15.625 ms 音訊時間，理論上約留下 8 ms 給 metadata、封面、heartbeat 與 task scheduling。不過這只是由設定值算出的預算，還沒有包含 SPI driver、FreeRTOS 喚醒與中斷延遲，因此實機仍必須保留安全餘裕。

ESP32 的輸出 audio queue 是 16,384 bytes，剛好約一秒 8-bit PCM；GBA 端則保留約 250 ms。前者吸收 Bluetooth callback 與 Link sender 的短期速度差，後者吸收 Link Port 傳輸與實際播放之間的抖動。

### 4.4 GBA 的 DMA、Timer 與 Sound FIFO

GBA 端準備 16 個 block，每個 256 bytes，共 4096 bytes，約等於 250 ms 音訊。開始播放前先累積 8 個連續 block，也就是約 125 ms。

Timer 0 使用 GBA 的 16.777216 MHz 系統時鐘：

```text
16,777,216 / 1024 = 16,384 Hz
```

每次 Timer 0 overflow，Sound FIFO 取出下一個 8-bit 樣本；DMA 1 則持續把環形緩衝區的資料補進 FIFO A。Timer 1 以 cascade 方式計算 256 個樣本，完成一個 block 時觸發中斷，釋放舊 block 並切換至下一個。

如果下一個 block 尚未準備完成，程式不會一直播放靜音並立即耗掉後來收到的新資料，而是停止 DMA 與 Timer。等重新累積 8 個連續 block 後才再次開始，讓緩衝區有機會恢復。

每個 block 有四種狀態：

```text
FREE → FILLING → READY → PLAYING → FREE
```

接收音訊時只允許依 `next_fill_block` 的環形順序填入；播放也只從 `next_play_block` 前進。這個限制很重要：如果單純搜尋「編號最小的 FREE block」，緩衝區繞回後就可能把新資料放到播放游標後方，造成前面有洞、後面有資料的假象。

DMA 從記憶體搬資料到固定目的地 FIFO A，並使用 repeat、32-bit 與 special timing。Sound FIFO 實際以 byte 為樣本消耗資料；32-bit DMA 只是每次替 FIFO 補四個連續 8-bit 樣本。環形緩衝額外保留 32-byte lookahead，處理 block 0 與 FIFO 預先讀取跨界時的連續性。

## 5. 歌曲文字為什麼要先畫成圖片

AVRCP 可以提供 title、artist 和 album 等 metadata，但手機切歌時，三個欄位不一定同時更新。以目前測試的手機行為來說，切歌通知後可能短暫出現「新歌名配舊專輯」的過渡狀態，因此不能收到一個欄位就立刻送到畫面。（參考資料 5）

### 5.1 先把切歌事件合併成一份快照

收到 `TRACK_CHANGE` 後，ESP32 會先保留 1.5 秒給音訊，並通知 metadata task 更新資料。task 的流程是：

1. 收到通知後先等待 550 ms，讓手機端的歌曲資訊趨於穩定。
2. 一次要求 title、artist、album；若 Cover Art 通道可用，也同時要求封面 handle。
3. 再等待 350 ms 收集 AVRCP 回覆。
4. 如果等待期間又收到一次切歌通知，就捨棄這次過渡查詢，重新回到 550 ms 等待。
5. 沒有新通知後，才把目前資料發布為同一份 snapshot。

目前 title 是唯一必要欄位。部分手機不一定會回覆 artist 或 album，如果強迫三欄都收到才更新，畫面可能永遠停在上一首歌。因此只要 title 已取得，缺少的欄位就以空白點陣送出，三欄仍共用同一個 transfer ID。

ESP32 端比較新舊 snapshot；內容完全相同時不重傳。內容改變時，title、artist、album 會先複製成不可變的同一批資料，再交給 sender task。即使下一首歌在傳送途中抵達，也不會覆蓋到已經送了一半的 artist 或 album。

### 5.2 為什麼中文也能顯示

GBA Multiboot 程式必須保持小巧，不適合放入完整中文字型。因此 UTF-8 解碼與字型查找都在 ESP32 進行：

```text
UTF-8 歌名
   ↓ ESP32 查詢 GNU Unifont Traditional
最高 512×16、1-bit 點陣圖
   ↓ 分段傳送
GBA 只畫像素，不處理 Unicode
```

目前每個欄位最多保留 60 bytes。這是 byte 限制，不是 60 個字；UTF-8 中文通常一字占 3 bytes，所以實際可容納的中文字會比較少。若第 60 byte 剛好落在多位元組字元中間，程式會往前退到合法 UTF-8 邊界，避免送出半個中文字。

字型查找完成後，每個字元被畫進最高 512×16 的 1-bit bitmap。每 8 個水平像素共用 1 byte，因此最大大小為：

```text
512 pixels ÷ 8 × 16 rows = 1024 bytes
```

每個 Type 4 封包最多帶 48 bytes 圖像，所以最長文字最多需要：

```text
ceil(1024 / 48) = 22 chunks
```

GBA 為 title、artist、album 各準備 staging buffer。只有三個欄位都完整、transfer ID 相同時，才一起交換成正在顯示的版本，避免新歌名配到上一首的歌手。每段用 bitmap 記錄，重複的 chunk 不會被重算。

### 5.3 文字遺失時如何重送

GBA 完成整批 metadata 後，會在狀態 word 的 metadata ACK 欄位回傳 transfer ID 的低 4 bit。ESP32 傳完三欄後會多送一次 heartbeat，讀取這個延遲一個 word 才能看到的 ACK。

若 ACK 未出現，整個 generation 仍保留為 pending，至少間隔 500 ms 才再次完整傳送。傳每個文字 chunk 之後，sender 也會檢查 GBA 的音訊存量；播放中低於 4 blocks 時先補音訊，再繼續送文字。這種做法不是最省流量，但比替每個小 chunk 設計獨立的選擇性重送簡單，也能保證三個欄位最後屬於同一首歌。

字型使用 GNU Unifont Traditional 17.0.04 的子集。Unifont 是 16px 高的泛 Unicode 點陣字型，專案同時保留其授權資訊。（參考資料 9、10）

## 6. 專輯封面如何縮成 4096 bytes

如果手機與 ESP32 都支援 AVRCP Cover Art，ESP32 可以透過 Cover Art 使用的 BIP／OBEX 通道取得 JPEG 縮圖。（參考資料 5）

### 6.1 JPEG 下載與記憶體控制

Cover Art 不是包含在一般 metadata 字串裡。手機先回覆一組 image handle，ESP32 再透過 Cover Art 的 BIP／OBEX 連線取得 linked thumbnail。下載資料可能分成許多 callback 抵達，因此程式用動態緩衝區累積：第一次配置 4 KiB，不足時倍增，最大接受 128 KiB。超過上限就放棄，避免一張異常圖片吃完 ESP32 記憶體。

切歌時會增加 cover generation，並使舊 handle 失效。下載佇列深度只有 1；有更新的封面抵達時，尚未解碼的舊工作會被丟棄。即使 JPEG 已經開始解碼，完成後也要再次確認 generation，舊歌封面才不會蓋到新歌畫面。

### 6.2 解碼時直接縮成 64×64

目前流程是：

1. 最多接收 128 KiB JPEG。
2. 使用 ESP32 ROM 中的 Tiny JPEG Decoder，配置 4096-byte 工作區。
3. 先利用 decoder 的 1／2、1／4、1／8 縮放，直到長或寬不超過約 128 pixels，降低後續運算量。
4. 取縮放結果中央的正方形範圍，捨棄左右或上下多出的部分。
5. decoder 每輸出一小塊 RGB888，就直接取樣到最後的 64×64 緩衝區，不保存一張完整的中間圖片。
6. 將每個像素轉成 RGB332：紅 3 bit、綠 3 bit、藍 2 bit。

所以一張封面固定為：

```text
64 × 64 × 1 byte = 4096 bytes
```

RGB332 的組合方式是保留紅色與綠色的最高 3 bit，以及藍色的最高 2 bit：

```text
RRRGGGBB
```

藍色只有 2 bit，是因為人眼通常對綠色亮度變化較敏感；這也是許多 8-bit 像素格式常見的取捨。這裡的「8-bit」指每個像素的色彩資料，不等於把音樂變成 chiptune。

### 6.3 封面分段、限速與雙緩衝

封面每段最多攜帶 192 bytes，因此一張圖片需要：

```text
4096 ÷ 192 = 21 段，餘 64 bytes
總共 22 chunks
```

播放期間 sender 最多每兩個音訊週期傳一段，也就是約每 31.25 ms 一段，而且 GBA 至少要保有 6 個 ready audio blocks，約 93.75 ms 的聲音存量。這會讓封面慢慢出現於背景傳輸，不會一次占滿 Link Port。

GBA 使用兩個封面緩衝區：一個正在顯示，另一個接收新封面。所有分段都完成後才交換，避免畫面出現半張舊圖與半張新圖。若 ESP32 收不到完成 ACK，會延後重傳。

ESP32 最多連續送完整封面 3 輪；每輪最後再用 heartbeat 取得 ACK。三輪仍未完成時，等待 500 ms 後從第一段重來。和文字相同，ACK 只使用 transfer ID 的低 4 bit，因此新 ID 會避開 `0` 和目前正在被回覆的 nibble。

Cover Art 並不是所有手機都保證提供，因此拿不到封面時，播放器仍會顯示預設圖案。

## 7. GBA 按鍵如何控制手機

GBA 偵測到按鍵後，不會直接操作 Spotify，而是把命令放進全雙工 Link Port 的狀態 word。ESP32 再轉成 AVRCP pass-through command 傳給手機。

| GBA 按鍵 | 專案命令 |
|---|---|
| A／B | 播放與暫停切換 |
| L／R | 上一首／下一首 |
| 上／下 | 音量增加／降低 |
| 左／右 | 倒退／快轉 |

Link Port 若受到雜訊干擾，單一錯誤 word 可能剛好看起來像有效命令。為降低誤觸，GBA 會重複送出同一命令，ESP32 必須連續取得三次相同的 command 與 sequence 才接受；執行後再以 sequence 去重，避免一次按鍵被觸發多次。

目前 GBA 會把同一命令放進接下來 12 個 response words。ESP32 的 filter 必須看到相同的 command 與 sequence 連續 3 次才交給 command task；已接受過的 sequence 直接忽略。這同時處理了兩個問題：一個是全雙工交換時命令可能沒有立刻被讀到，另一個是雜訊不能只靠一次看似有效的值就觸發播放控制。

ESP32 對應的 AVRCP pass-through key 如下：

| 專案命令 | AVRCP key |
|---|---:|
| Play | `0x44` |
| Pause | `0x46` |
| Previous | `0x4C` |
| Next | `0x4B` |
| Volume Up | `0x41` |
| Volume Down | `0x42` |
| Seek Backward | `REWIND` |
| Seek Forward | `FAST FORWARD` |

command queue 可暫存 8 筆操作。每一筆命令會先送 `PRESSED`，等待 40 ms，再用同一個 transaction label 送 `RELEASED`，模擬一顆完整按鍵，而不是只送按下卻沒有放開。

AVRCP 有 Rewind／Fast Forward 操作，但沒有保證所有手機都把它解讀成固定的十秒跳轉，所以實際行為仍取決於手機系統與播放器。（參考資料 5）

## 8. 畫面與更新策略

播放器使用 GBA 的 Mode 3，解析度為 240×160，每個像素是 15-bit RGB。介面中的面板、圖示、進度條和啟動畫面都由 C 程式直接寫入 framebuffer。

64×64 RGB332 封面在顯示時以 nearest-neighbor 放大到 80×80，再轉成 GBA 的 RGB15。歌曲文字則直接畫出 ESP32 傳來的 1-bit 點陣。

Mode 3 沒有使用雙緩衝；如果每一幀先清除文字區再重畫，使用者會看見清除過程而產生閃爍。因此目前程式只在 metadata、封面、播放狀態或錯誤狀態改變時更新畫面。

程式雖然已經有計算長文字捲動位置的函式，但主迴圈不會為了動畫定期重畫，所以目前版本並沒有真正持續捲動，超出欄位寬度的文字會被裁掉。若之後要啟用捲動，需要替文字區安排固定更新時機，並同時處理 Mode 3 重畫造成的閃爍。

## 9. 為什麼需要排程與回覆機制

音訊、文字、封面和按鍵都共用同一條 Link Port，但需求完全不同：

| 資料 | 特性 | 策略 |
|---|---|---|
| 音訊 | 必須準時、持續 | 最高優先，依播放時間送包 |
| 播放狀態 | 很小但要快速反映 | 重複傳送數次 |
| 歌曲文字 | 可以稍慢，但三欄必須一致 | generation、staging、ACK |
| 封面 | 容量最大 | 分段、限速、雙緩衝、失敗重傳 |
| 按鍵 | 資料很小，但不能誤觸 | 重複確認與序號去重 |

sender task 的實際優先順序大致如下：

```text
音訊到期且 queue 內有完整 256 bytes？
  ├─ 是：送音訊
  │      └─ 接著嘗試播放狀態 → metadata → 封面
  └─ 否：播放狀態 → metadata → 封面 → heartbeat
```

如果沒有任何資料可送，就傳空 heartbeat，再等待約 15 ms。這讓暫停時仍能讀到 GBA 按鍵與 ACK。播放／暫停狀態每次改變會排入 8 次傳送，以降低小封包遺失造成 UI 與手機狀態不一致的機率。

切歌後，ESP32 會先保留約 1.5 秒給新音訊建立緩衝，這段期間暫停傳新文字與封面。傳送非音訊資料時，也持續讀取 GBA 回報的 ready block 數量：

- metadata 至少保留 4 blocks，約 62.5 ms 音訊。
- cover 至少保留 6 blocks，約 93.75 ms 音訊。
- underrun 發生後，ESP32 取消原本的即時節拍，快速補到重新可播放的水位。

這些門檻不是 Link Port 規格，而是目前實機調整出的排程參數。線材、SPI driver 或 UI 工作量改變後，也可能需要重新量測。

這套排程是專案中最重要的部分之一。Link Port 的理論速度足夠，不代表把所有資料照順序塞進去就能穩定播放；真正的問題是不同資料的期限、容量、重試方式與狀態切換。

## 10. 測試、限制與尚未確定的地方

目前專案另外以主機端 C 測試覆蓋以下部分：

- 串流 Header 與 CRC-32
- GBA 接收狀態機模擬
- 音訊環形緩衝區繞回與 underrun
- 封面縮圖與 RGB332 轉換
- 按鍵命令的三次確認與 sequence 去重

但單元測試不能取代實機。Link Cable 接點、線長、串聯電阻、主機版本、手機 AVRCP 行為與藍牙堆疊事件順序，都必須在真實硬體上確認。

目前已知限制包括：

- 音訊固定為 16,384 Hz、8-bit、單聲道。
- 重取樣方式偏向低成本，並非高品質音訊演算法。
- 專輯封面依賴手機是否支援 AVRCP Cover Art。
- 文字受 60-byte UTF-8 輸入與 512px 點陣寬度限制。
- ESP32-C3、S2、S3 不適用目前的 Bluetooth Classic A2DP 方案。
- GBA 在串流途中重開機時，目前需要讓 ESP32 重新走一次 Multiboot 流程。
- 本文記錄的是單一 NodeMCU-32S 與 GBA SP 實作，不代表所有線材與主機都能使用完全相同時序。

### 10.1 藍牙配對與安全性

目前 ESP32 對外名稱是 `GBA Spotify Speaker`，以 Bluetooth Classic A2DP Sink 被手機搜尋。原型為了簡化配對，使用沒有輸入／輸出能力的設定與固定 legacy PIN `1234`。

這適合個人實驗，但不應視為強安全性。若要公開展示、販售或長期放在公共空間，至少應重新設計配對流程、限制可連線時機、處理已綁定裝置，並檢查使用的 Bluetooth、字型與第三方元件授權。

## 附註與參考資料

1. **本專案未公開原始碼與測試紀錄**：本文中的 GPIO、時鐘、封包格式、緩衝區大小、重試策略與 2026-08-18 實作狀態，主要依據作者本機專案。這部分不是外部公開規格。
2. **GBATEK：GBA 技術文件**：[BIOS Multi Boot、SIO、記憶體與聲音硬體](https://rust-console.github.io/gbatek-gbaonly/)。這是社群長期使用的逆向技術資料，不是任天堂官方文件。
3. **GBA BIOS Reference**：[Multiboot Protocol — Host / Master Perspective](https://retrointernals.github.io/gba-bios-reference/multiboot_protocol/)。包含 BIOS 反編譯確認的加密與 CRC，以及仍標示需要實機交叉驗證的早期握手流程。
4. **ARM Mbed 範例**：[GameBoy Advance Multiboot](https://os.mbed.com/users/kek/notebook/gameboy-advance-multiboot/)。可對照 `0x63D1`、長度欄位、rolling seed、XOR 常數與最終 CRC 的 C 實作。
5. **Espressif ESP-IDF 5.5 文件**：[Bluetooth Classic Profiles and Protocols](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-guides/classic-bt/profiles-protocols.html)。說明 A2DP、AVRCP、metadata、pass-through command 與 Cover Art 使用的 BIP／OBEX。
6. **Espressif ESP-IDF 文件**：[Bluetooth A2DP API](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/bluetooth/esp_a2dp.html)。包含 A2DP Sink 應用與音訊串流 API。
7. **Espressif ESP-IDF 文件**：[SPI Master Driver](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/spi_master.html)。專案使用 ESP32 SPI Master 周邊產生 GBA Link Port 時鐘與進行全雙工交換。
8. **Dolphin Emulator 技術文章**：[mGBA Integration: Introducing the Integrated GBA](https://dolphin-emu.org/blog/2021/07/21/integrated-gba/)。討論 GBA Multiboot cipher 與 Kawasedo 名稱的關聯。
9. **GNU Unifont 17.0.04**：[字型建置檔案](https://unifoundry.com/pub/unifont/unifont-17.0.04/font-builds/)。本專案使用 Traditional 版本的子集。
10. **GNU Unifont 授權**：[Unifont 官方頁面](https://www.unifoundry.com/unifont/index.html)。Unifont 自 13.0.04 起提供 SIL Open Font License 1.1 與含字型嵌入例外的 GPL 2+ 雙重授權；專案採用並保留 OFL 1.1 資訊。

## 最後再次說明

這一篇的技術文字由 AI 根據程式碼與外部資料整理。它的價值在於把分散於原始碼、實機紀錄和逆向文件中的資訊組成一個可閱讀的架構，但 AI 仍可能誤解程式、忽略硬體差異，或引用後來被修正的社群資料。

若要依本文製作硬體，建議同時查看原始參考資料、用電表確認接腳，並從低速與可觀察的測試開始。任何與實機結果不一致的地方，都應以量測和可重現的測試為準。
