---
title: 用 ESP8266 做自動隨會議開關的OnAir燈箱
katex: true
date: 2023-08-01 15:26:14
categories: maker
tags: 
  - arduino
  - esp8266
  - Google Apps Script
  - code
  - maker
cover: OnAirDemo.webp
---
## 簡介
最近公司想要做一個裝置，是當 google 行事曆有排會議時，就會自動ON AIR的燈箱。
{% asset_img OnAirDemo.webp 燈箱的演示圖片 %}

---
### 大概的思考架構
1. 由 google apps script 生成三天內行事曆的JSON網站。
2. 接著由 ESP8266 去網站上面抓網頁的資訊。
3. ESP8266 判斷時間是否在會議的開始與結束時間，如果在這個區段內的話，進行亮燈、否則暗燈。

---
## 所需材料與架構
1. esp8266
2. 大創買的收納盒
{% asset_img box.webp 大創的收納盒 %}
3. 去文具行買玻璃紙與黑紙卡
4. 影印店印ON AIR字卡
5. 5V 燈條

## 注意事項
1. 燈條買SMD(直接焊在電路板的那種)，有嘗試使用大創賣的聖誕燈條，但是效果很醜。
2. 玻璃紙與黑紙卡可以發揮自己創意改裝。

---
## Google Apps Script 設定

### 首先進入google apps script
開一個新的檔案，將程式碼複製上去。

{% asset_img GAScode.webp 將程式貼在圖中的這個位置 %}

```javascript
function doGet(e) {
  var calendarId = 'primary'; // Replace with your calendar ID
  var now = new Date();
  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 4);

  var events = CalendarApp.getCalendarById(calendarId).getEvents(now, nextWeek);
  var output = events.map(function(event) {
    return {
      'title': event.getTitle(),
      'start': Math.floor(event.getStartTime().getTime() / 1000), // Convert to Unix timestamp
      'end': Math.floor(event.getEndTime().getTime() / 1000) // Convert to Unix timestamp
    };
  });

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}
```
1. `calendarId`可以換成你想要的日曆ID。
2. ID的位置在日曆的旁邊會看到三個點點，點進去設定。
{% asset_img setcalendar1.webp 點擊你要的日曆的點點，並且點擊設定 %}

3. 往下滑即可找到日曆ID
{% asset_img setcalendar2.webp 日曆ID在螢光筆的位置 %}

### 部屬網站
1. 按上面的【執行】，這時候可能會跳行事曆的授權，按確認即可。(如果沒有跑出來，可以再按一次執行)
2. 接著按右上角的【部屬】>【新增部屬工具】
3. 按左上角的齒輪>【網頁應用程式】
4. 執行身分 [我]
5. 誰可以存取 [所有人]
即可完成部屬

### 紀錄ID及網站
(如果不見可以從【部屬】>【管理部屬工具】找)
1. 接著會看到`部屬ID`跟網址，請將`部屬ID`記錄好。
2. 網址可以測試看看是否可以順利看到JSON檔案
3. 記得如果有跟改任何參數記得重新佈署一次

網址點進去應該會看到這樣：
{% asset_img websiteJson.webp 網址內會看到會議跟一堆時間碼 %}
note：本程式為了之後容易計算，因此時間是使用UNIX時間來表示

到目前已經完成網站端的配置了，接下來要來進行ESP32的部分。

## ESP8266 設定

### ESP8266硬體安裝
這次使用的是ESP8266上的D0腳位，將燈條的正極接在D0，負極接在GND上。

### 將程式貼進IDE

```arduino 
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>

//wifi帳號密碼
const char* ssid = "***";
const char* password = "***";

//Script ID.
const char *GScriptId = "***";

String resource = "/macros/s/" + String(GScriptId) + "/exec";
const char* host = "https://script.google.com";
const long timezoneOffset = 8 * 60 * 60;
const int ledPin = D0;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }
  configTime(timezoneOffset, 0, "pool.ntp.org");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);
    client->setInsecure();
    HTTPClient http;
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
    http.begin(*client, host + resource);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(httpCode);
      Serial.println(payload);

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      time_t now;
      time(&now);
      int nearestIndex = -1;
      time_t nearestDiff = INT_MAX;
      for (int i = 0; i < doc.size(); i++) {
        time_t start = doc[i]["start"].as<long>() + timezoneOffset;
        time_t diff = abs(now - start);
        if (diff < nearestDiff) {
          nearestIndex = i;
          nearestDiff = diff;
        }
      }

      if (nearestIndex != -1) {
        time_t start = doc[nearestIndex]["start"].as<long>();
        time_t end = doc[nearestIndex]["end"].as<long>();

        if (now >= start && now <= end) {
          digitalWrite(ledPin, HIGH);
          Serial.println("燈泡情況：ON");
        } else {
          digitalWrite(ledPin, LOW);
          Serial.println("燈泡情況：OFF");
        }
      }

      payload = "";
    }

    http.end();
  }
  
  delay(30000);
  //30秒抓一次資料
}

```

### 修改程式
將裡面的 wifi 帳號、密碼和 Script ID 改成`部屬ID`的資料。
上傳到ESP8266 即可正常執行。

如果無法正常執行可以檢查序列埠視窗，理論上應該可以看到JSON資料跟燈泡ON/OFF情況。(如下圖所示)

{% asset_img serialData.webp 序列埠視窗的資料 %}

另外提醒，本裝置是 30 秒抓一次資料，如果要及時一點，可以減少`delay time`。

## 全部組合
1. 做完以上步驟以後，會獲得一個會隨著會議時間亮燈跟暗燈的裝置。
2. 玻璃紙與黑紙卡可以發揮自己創意改裝。我目前嘗試出，前面貼印刷的ON AIR字卡，後面用厚紙板割開ON AIR字樣後黏在一起，效果還不錯。
3. 接著將大創買來的盒子挖一個洞，並且將裝置與紙卡放進去，電線拉出來。
{% asset_img box.webp 大創的收納盒 %}

4. 即可完成你的燈箱。
{% asset_img OnAirDemo2.webp 燈箱完成圖 %}