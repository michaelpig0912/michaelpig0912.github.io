---
title: 設計蝕刻控制器
katex: true
date: 2023-02-14 00:32:34
categories: maker
cover: demo3.webp
tags:
  - arduino
  - code
  - maker
---
## 簡介
### 設計條件
剛好有朋友找我設計一個他們實驗要用的裝置，想要做到的效果。
1. 有一個主要迴路，上面有恆定的電壓，大約 7 V。
2. 需要用 Arduino 來測量其電流，電流值約在 10~20 mA 左右。
3. 如果蝕刻發生變化時，電流會瞬間掉到 3 mA左右，這時主要迴路要變成斷路。
4. 但蝕刻的時候電壓也會稍微變小，從 20 mA 掉落到 10 mA 左右。

### 大概的思考架構如圖所示
{% asset_img draft.webp 草稿 %}
本裝置是透過 ina219 來測量為小電流，
可以支援量測到 26 V，
並且搭配一個 5V relay，
如果電流瞬間下降時，
就透過 relay 來切斷主迴路的電源，
透過不同顏色的 LED 或 OLED 螢幕來顯示現在電路狀況。

### 實際圖片
{% asset_img demo1.webp 組合好的樣子 %}
{% asset_img demo2.webp 內部構造 %}

操作實際影片
<video width="100%" height="100%"  src="./videoDemo.mp4" controls></video>

---

## 所需材料與架構

1. Arduino UNO
2. INA219
    - 使用 I2C 介面
    - 工作電壓 +3.0 至 +5.5V 之間
    - 溫度範圍(可實現 1% 的最大誤差精度) -40C 至 +85C
    - 分辨率 12 位元
    - 電壓範圍為 0 V 至 +26 V
    - 以安培為單位讀取電流，並以瓦特為單位讀取電源
    - 對多達 128 個採樣求平均值
3. 5V relay
4. power supply (蝕刻用)
5. 不同顏色的 LED
6. 0.96 寸 OLED 螢幕
---
## 注意事項

1. 透過 INA219 測量電流。
2. 透過 Arudino 來控制 relay 是否要導通。
3. 一旦迴圈成立後， Arduino 會一直循環執行斷開 relay 。
4. 但如果電流突然 drop 很多 像一個 step function 瞬間跳掉變不同的值（不是連續變化的）這時候就瞬間不輸出電壓。
5. 全部設定好以後，再接上 Arduino 的電源。
6. 如果Arduino**未通電**時，**relay 預設為接通**。
---
## 標準流程：

1. 先將線路全部接好，先不要通電。
2. 將電源供應器打開到指定電壓。
3. 電壓和電流穩定後，再將 Arduino 通電。
4. 開始蝕刻。
5. 有大幅度電流下降， relay 跳開。
6. 將電源供應器關閉。
7. 將 Arduino 斷電。

---

## 程式碼與邏輯
### 程式碼邏輯
[https://whimsical.com/arduino-6houbpN4HPXpyc9pzqHUbs](https://whimsical.com/arduino-6houbpN4HPXpyc9pzqHUbs)

### 無螢幕版本

需要下載 Adafruit_INA219 庫

```arduino
#include <Wire.h>
#include <Adafruit_INA219.h>

float lastCurrent_mA= 0 ;
//上一次的電流值(全域變數)，注意：一開始是設定為0，因此當有電流值時(假設 20 mA)，
//下面會執行 20-0=20 ，因此不會斷路，但如果是突然斷路大於 3 mA 時，relay 會保持斷路。
float currentSub = 0;
//這個變數是本次與上次電流相減的值
Adafruit_INA219 ina219;

void setup(void)
{
  Serial.begin(9600);

  uint32_t currentFrequency;

  Serial.println("Hello!");
  pinMode(4, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  digitalWrite(4, LOW);
  digitalWrite(2, LOW);
  digitalWrite(3, LOW);

  Wire.begin();
  ina219.begin();
  //ina219.setCalibration_32V_1A();
  ina219.setCalibration_16V_400mA();
  Serial.println("Measuring voltage and current with INA219 ...");
}

void loop(void)
{
  float shuntvoltage = 0;
  float busvoltage = 0;
  float current_mA = 0;
  float loadvoltage = 0;
  float power_mW = 0;

  shuntvoltage = ina219.getShuntVoltage_mV();
  busvoltage = ina219.getBusVoltage_V();
  current_mA = ina219.getCurrent_mA();
  power_mW = ina219.getPower_mW();
  loadvoltage = busvoltage + (shuntvoltage / 1000);

  Serial.print("Bus Voltage:   "); Serial.print(busvoltage); Serial.println(" V");
  Serial.print("Shunt Voltage: "); Serial.print(shuntvoltage); Serial.println(" mV");
  Serial.print("Load Voltage:  "); Serial.print(loadvoltage); Serial.println(" V");
  Serial.print("Current:       "); Serial.print(current_mA); Serial.println(" mA");
  Serial.print("Power:         "); Serial.print(power_mW); Serial.println(" mW");

  currentSub = current_mA-lastCurrent_mA;

  Serial.print("CurrentSub:         "); Serial.print(currentSub); Serial.println(" mA");
  Serial.println("");

  while(currentSub < -3)                //如果本次電流減上次電流，數值小於-3 mA時
  {
    digitalWrite(4, LOW);               //D4 relay打開 (斷開線路)
    digitalWrite(2, HIGH);              //D2 LED發光 (提醒線路斷開)
    digitalWrite(3, LOW);               //D3 LED不發光
    delay(1000);                        //成立時會卡在這邊循環
  }

//如果要精準的話，或許可以多次數值的平均數，再看差異。
//怕目前這種程式寫法，只要有突然間斷掉一下，就會relay斷開!!

lastCurrent_mA = current_mA;            //將保存這次的電流值
digitalWrite(4, HIGH);                   //D4 relay關閉 (不斷開線路)
digitalWrite(2, LOW);                   //D2 LED不發光
digitalWrite(3, HIGH);                  //D3 LED發光 (提醒線路正常)
delay(1000);                            
//1000 ms 檢查一次(這邊時間拉長也可以幫助偵測drop的準確度，可以加長這次與下次的偵測時間，更不會受到干擾就斷開relay)
}
```
### 有螢幕版本
需要下載 Adafruit_INA219、Adafruit_GFX、SSD1306 庫
```arduino
#include <Wire.h>
#include <Adafruit_INA219.h> //1.1.1
#include <Adafruit_GFX.h>    //1.10.12
#include <Adafruit_SSD1306.h>//2.5.0

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET     4 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

float lastCurrent_mA= 0 ;
//上一次的電流值(全域變數)，注意：一開始是設定為 0，因此當有電流值時(假設 20 mA)，
//下面會執行 20-0=20 ，因此不會斷路，但如果是突然斷路大於3 mA時，relay會保持斷路。
float currentSub = 0;
//這個變數是本次與上次電流相減的值
Adafruit_INA219 ina219;

void setup(void)
{
  Serial.begin(9600);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);   
  display.clearDisplay();

  uint32_t currentFrequency;

  pinMode(4, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  digitalWrite(4, LOW);
  digitalWrite(2, LOW);
  digitalWrite(3, LOW);

  Wire.begin();
  ina219.begin();
  //ina219.setCalibration_32V_1A();
  ina219.setCalibration_16V_400mA();
  Serial.println("Measuring voltage and current with INA219 ...");
}

void loop(void)
{
  float shuntvoltage = 0;
  float busvoltage = 0;
  float current_mA = 0;
  float loadvoltage = 0;
  float power_mW = 0;

  shuntvoltage = ina219.getShuntVoltage_mV();
  busvoltage = ina219.getBusVoltage_V();
  current_mA = ina219.getCurrent_mA();
  power_mW = ina219.getPower_mW();
  loadvoltage = busvoltage + (shuntvoltage / 1000);

  Serial.print("Bus Voltage:   "); Serial.print(busvoltage); Serial.println(" V");
  Serial.print("Shunt Voltage: "); Serial.print(shuntvoltage); Serial.println(" mV");
  Serial.print("Load Voltage:  "); Serial.print(loadvoltage); Serial.println(" V");
  Serial.print("Current:       "); Serial.print(current_mA); Serial.println(" mA");
  Serial.print("Power:         "); Serial.print(power_mW); Serial.println(" mW");

  currentSub = current_mA-lastCurrent_mA;

  Serial.print("CurrentSub:         "); Serial.print(currentSub); Serial.println(" mA");
  Serial.println("");

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(1,5);
  display.print(F("Bus Voltage:   "));
  display.setCursor(85,5);
  display.print(busvoltage);
  display.setCursor(115,5);
  display.print(F(" V"));

  display.setCursor(1,15);
  display.print(F("Shunt Voltage:"));
  display.setCursor(85,15);
  display.print(shuntvoltage);
  display.setCursor(115,15);
  display.print(F("mV"));

  display.setCursor(1,25);
  display.print(F("Load Voltage: "));
  display.setCursor(85,25);
  display.print(loadvoltage);
  display.setCursor(115,25);
  display.print(F(" V"));

  display.setCursor(1,35);
  display.print(F("Current:"));
  display.setCursor(85,35);
  display.print(current_mA);
  display.setCursor(115,35);
  display.print(F("mA"));

  display.setCursor(1,45);
  display.print(F("Power:"));
  display.setCursor(85,45);
  display.print(power_mW);
  display.setCursor(115,45);
  display.print(F("mW"));

  display.setCursor(1,55);
  display.print(F("CurrentSub:"));
  display.setCursor(85,55);
  display.print(currentSub);
  display.setCursor(115,55);
  display.print(F("mA"));

  display.display();

  while(currentSub < -1)                //如果本次電流減上次電流，數值小於 -3 mA 時
  {
    digitalWrite(4, LOW);              //D1 relay 打開 (斷開線路)
    digitalWrite(2, HIGH);              //D2 LED 發光 (提醒線路斷開)
    digitalWrite(3, LOW);               //D3 LED 不發光
    shuntvoltage = ina219.getShuntVoltage_mV();
    busvoltage = ina219.getBusVoltage_V();
    current_mA = ina219.getCurrent_mA();
    power_mW = ina219.getPower_mW();
    loadvoltage = busvoltage + (shuntvoltage / 1000);
    Serial.print("Bus Voltage:   "); Serial.print(busvoltage); Serial.println(" V");
    Serial.print("Shunt Voltage: "); Serial.print(shuntvoltage); Serial.println(" mV");
    Serial.print("Load Voltage:  "); Serial.print(loadvoltage); Serial.println(" V");
    Serial.print("Current:       "); Serial.print(current_mA); Serial.println(" mA");
    Serial.print("Power:         "); Serial.print(power_mW); Serial.println(" mW");
    Serial.print("CurrentSub:         "); Serial.print(currentSub); Serial.println(" mA");

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(BLACK);
  display.fillScreen(WHITE);
  display.setCursor(1,5);
  display.print(F("Bus Voltage:   "));
  display.setCursor(85,5);
  display.print(busvoltage);
  display.setCursor(115,5);
  display.print(F(" V"));

  display.setCursor(1,15);
  display.print(F("Shunt Voltage:"));
  display.setCursor(85,15);
  display.print(shuntvoltage);
  display.setCursor(115,15);
  display.print(F("mV"));

  display.setCursor(1,25);
  display.print(F("Load Voltage: "));
  display.setCursor(85,25);
  display.print(loadvoltage);
  display.setCursor(115,25);
  display.print(F(" V"));

  display.setCursor(1,35);
  display.print(F("Current:"));
  display.setCursor(85,35);
  display.print(current_mA);
  display.setCursor(115,35);
  display.print(F("mA"));

  display.setCursor(1,45);
  display.print(F("Power:"));
  display.setCursor(85,45);
  display.print(power_mW);
  display.setCursor(115,45);
  display.print(F("mW"));

  display.setCursor(1,55);
  display.print(F("CurrentSub:"));
  display.setCursor(85,55);
  display.print(currentSub);
  display.setCursor(115,55);
  display.print(F("mA"));

  display.display();
    delay(200);                        //成立時會卡在這邊循環
  }

//如果要精準的話，或許可以多次數值的平均數，再看差異。
//怕目前這種程式寫法，只要有突然間斷掉一下，就會 relay 斷開!!

lastCurrent_mA = current_mA;            //將保存這次的電流值
digitalWrite(4, HIGH);                   //D1 relay 關閉 (不斷開線路)
digitalWrite(2, LOW);                   //D2 LED 不發光
digitalWrite(3, HIGH);                  //D3 LED 發光 (提醒線路正常)
delay(200);                            
//200 ms 檢查一次(這邊時間拉長也可以幫助偵測drop的準確度，可以加長這次與下次的偵測時間，更不會受到干擾就斷開 relay )
}
```
## 參考資料：
1. [Arduino筆記(63)：1.77" TFT LCD顯示INA219電流傳感器電壓值](https://atceiling.blogspot.com/2019/09/arduino63177-tft-lcdina219.html)
