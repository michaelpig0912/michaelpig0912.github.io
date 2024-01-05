---
title: Wonder Studio 簡單說明與自定義角色注意事項
katex: true
date: 2023-08-31 17:45:36
categories: animation
tags:
    - blender
    - wonderStudio
    - 3D
    - animation
    - motion Capture
cover: output.webp

---

## 前言

Wonder Studio 是一個分析影片中真實人物的動作，然後可以做動態追蹤到指定的 3D 模型的服務，可以將影片中的人物轉換成 3D 人物，並且可以自定義角色，並且可以輸出 Blender 檔案，以及可以自動合成背景，這邊將簡單說明如何使用，以及講解該網站的自定義角色規範。
{% asset_img output.webp  合成完成的結果%}

---

## 註冊及付費

1. 先在 Wonder Studio 辦一個帳號，網址： [請點我](https://wonderdynamics.com/)

{% asset_img main.webp 左側選單 %}

2. 在左邊選單選 Upgrade Plan，記得注意上面是 Annual (年繳) ，還是 Monthly (月繳)，這次使用 lite 的方案就好。
	{% asset_img pay.webp 方案頁面 %}

3. lite 帳號每個月大約要 20 鎂，大約是 600 元台幣，可以享有以下的功能：
	- 可以生成 150 秒的影片
	- 六個自定義角色 
	- 兩個人的影片 

4. 輸入信用卡號即可完成付費。

---

## 建立專案 

1. 按左邊的 Create New Project，並且選擇 Live Action Easy 的分頁按 Contunue。
	{% asset_img main.webp 左側選單 %}

2. 上傳一段影片到左邊的影片區。
	{% asset_img interface.webp 主要頁面 %}

3. 影片上傳完成後，將影片拉置中心，接著按上方的 Next 即可分析。
	{% asset_img uploadVideo.webp 上傳完成 %}

4. 接著可以將你要角色拉入畫面中的方框處，右邊可以選擇要用預設的角色檔案，還是自定義角色檔案。
	{% asset_img character.webp 分析影片 %}

5. 按下上面的 Next，會需要選擇要產生的檔案。 (這邊能勾選的全部都勾選)
	{% asset_img setting.webp 選擇要產生的檔案 %}

    - AI MoCap：會生成AI的骨架檔，但不包含臉臉部表情。格式是FBX。
    - Blender Scence ：全部運算的資料，但不包含背景，這個包含角色的shapeKey的表情。格式是Blender。
    - Clean Plate：生成空白的背景。格式為JPG。

6. 按下 Start Processing 就會開始運算，測試 10 秒的影片大約要跑 1~2 小時，不過運算時間計算似乎不是線性，不管幾秒幾乎都要一個小時以上。

7. 完成以後在主畫面上面就會出現剛剛運算的影片，並且可以點選要下載的選項。
	{% asset_img output.webp 分析完成，可以要下載的內容 %}

---

## 自定義角色建立與規範

1. [官方的規範](https://wonderdynamics.notion.site/Wonder-Dynamics-Character-Creation-Guidelines-4e7a932d2ffd49a89723e8ea80ba307d)，如果有任何問題可以看一下，不過有點小複雜，當初看有一點久。
2. [官方的快速開始文檔](https://wonderdynamics.notion.site/Quick-Start-Guide-for-Blender-ccf6968493f64a39b55cbc93c635839b)
3. 這邊已經假設你的角色已經是T pose，並且已經綁上所有骨架了。

### 以下將簡單講解 Blender 的規範

1. 官方最建議的版本為 `3.3.1` 版本，用其他版本很容易出錯。
	{% asset_img verOfBlender.webp 官方版本推薦 %}

### 命名規範

1. 請建立一個 Collection 像圖片一樣，並命名為 `character`。
	{% asset_img settingName.webp 命名規則 %}

2. `角色`和`骨架`檔案請命名為 `角色名_BODY`
3. 骨骼的命名規範請依以下方式命名，以免進入軟體後偵測不到動作，如果有多出的骨骼名稱不用理會沒關係。

    <details>
    <summary style="color:#F66"> 點我看骨架結構 </summary>
    ```text
    - Hips
        - Spine
            - Spine1
                - Spine2
                    - Neck
                        - Head
                    - LeftShoulder
                        - LeftArm
                            - LeftForeArm
                                - LeftHand
                                    - LeftHandThumb1
                                        - LeftHandThumb2
                                            - LeftHandThumb3
                                    - LeftHandIndex1
                                        - LeftHandIndex2
                                            - LeftHandIndex3
                                    - LeftHandMiddle1
                                        - LeftHandMiddle2
                                            - LeftHandMiddle3
                                    - LeftHandRing1
                                        - LeftHandRing2
                                            - LeftHandRing3
                                    - LeftHandPinky1
                                        - LeftHandPinky2
                                            - LeftHandPinky3
                    - RightShoulder
                        - RightArm
                            - RightForeArm
                                - RightHand
                                    - RightHandThumb1
                                        - RightHandThumb2
                                            - RightHandThumb3
                                    - RightHandIndex1
                                        - RightHandIndex2
                                            - RightHandIndex3
                                    - RightHandMiddle1
                                        - RightHandMiddle2
                                            - RightHandMiddle3
                                    - RightHandRing1
                                        - RightHandRing2
                                            - RightHandRing3
                                    - RightHandPinky1
                                        - RightHandPinky2
                                            - RightHandPinky3
        - LeftUpLeg
            - LeftLeg
                - LeftFoot
                    - LeftToeBase
        - RightUpLeg
            - RightLeg
                - RightFoot
                    - RightToeBase
    ```
    </details>

4. 臉部需要 shapeKeys 控制，請命名內容需要包含 `_FACE`，例如 `dummy_FACE` 
5. 命名請勿使用 `.`，例如：`dummy.001`，請把 `.` 換成 `_`
6. 材質需要有 `_MAT`，例如：`colt_MAT`
	{% asset_img matSetting.webp 材質的命名規則 %}

    1. 如果在材質裡面有用到圖片或紋理之類的，請至少按照`[matName]_TEX_[type].[ext]` ，matName可以不用跟MAT一樣，另外要避免使用相同的名稱命名不同材質。
        - [官方的說明文檔](https://wonderdynamics.notion.site/Shading-Texturing-220ac163b959401c921a0859795b7b8d)
        - 例如：一個衣服的材質圖片：`colt01_TEX_DIFF.png`
        - 以下是針對不同的材質命名規範
            <details>
            <summary style="color:#F66"> 點我看詳細的材質規則 </summary>
            ```text
            - Ambient Oclussion map → _TEX_AO
            - Anisotropy rotation map → _TEX_ANITROPROT
            - Anisotropy weight map → _TEX_ANITROP
            - Bump/Height map → _TEX_BUMP
            - Clearcoat weight map → TEX_COATWEIGHT
            - Diffuse map → _TEX_DIFF
            - Displacement map → _TEX_DISPLACE
            - Emission map → _TEX_EMISSION
            - Emission mask → _TEX_EMISSIONWEIGHT
            - Index of reflection map → _TEX_IOR
            - Metalness map → _TEX_METAL
            - Normal map → _TEX_NORM
            - Opacity/Alpha map → _TEX_OPAC
            - Roughness map → _TEX_ROUGH
            - Specular map → _TEX_SPEC
            - Subsurface Scattering map → _TEX_SSS
            - Thickness (SSS weight) map → _TEX_THICK
            - Transmission weight map → _TEX_TRANSWEIGHT
            ```
            </details>


### 臉部規範
1. [官方的臉部說明檔案](https://wonderdynamics.notion.site/Creating-Facial-for-Characters-6b938279399a4541914bccb5ba993436)
2. 命名規則是根據 `Facial Action Coding System (FACS)` 搭配 `shapeKey` 達成。
3. 總共有 52 種，不一定每一種表情都要對到，可以挑幾個比較重要的做。
4. 將 `ShapeKeys` 命名成官方文件上的名稱，就可讓角色有表情變化。
    - 例如下圖的：`jawIn` 或 `eyeBlinkR`
	{% asset_img facerig.webp 臉部命名 %}

### 清理孤立數據

1. 將 Display mode 改成 Orphan data 
2. 並且按下 Purge
3. 存檔即可準備上傳。
{% asset_img purge.webp 清理孤立數據 %}

---

## 自定義角色上傳

1. 到編輯畫面的右邊，按下加號。
{% asset_img ownCharacter.webp 新增自定義角色 %}

2. 為角色取名並且繼續。
{% asset_img uploadName.webp 為角色取名 %}

3. 接下來準備好檔案，丟上依照規範做的 blender 檔案跟材質，拖上去上傳即可，接著等待上傳及驗證。
{% asset_img uploadFile.webp 上傳資料 %}

4. 不過如果模型有問題，會很容易卡在這一步。

5. <p style=color:#F66>請注意 lite 帳號只能上傳 6 次角色，之後就要再等一個月才能上傳</p>

---

## 遇過的問題解法

Q1：object scale should be applied on Mesh as it currently is (1.0 1.0 1.000000516516)
<p style=color:#F55>解法：輸入指定物件的 scale ，即使在blender上看到已經是 1 ，還是重新輸入設定為 1，記得要 apply scale。</p>

Q2：object mesh has no parent armature blender
<p style=color:#F55>解法：將指定的 mesh 透過 Modifiers 加入 Armature，並且 Object 選擇你的主要骨架。(請參考下圖)</p>
{% asset_img settingArmature.webp Armature設定 %}

Q3：如果上傳後發現角色材質怪怪的，一片黑或一片白。
<p style=color:#F55>解法：可能是材質命名錯誤，或是部分的功能不支援，先前有遇過如果在 blender 3.6 使用顏色的運算 (下方的黃色框框的內容) 會出錯，因為blender 3.6 已經將 mixRGB 刪除，建議使用blneder 3.4 版本以前的 mixRGB 運算上就不會出錯。</p>
{% asset_img mixRGB.webp 不支援問題 %}

Q4：下載下來材質遺失
<p style=color:#F55>去 File > Extremal Data > Find Missing Files ，選擇材質就會回來了。</p>
{% asset_img missingFile.webp 重新連結素材 %}