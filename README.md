# 賽親官網樣式檔

本 repo 放的是 https://www.kindredplus.org 改版用的樣式與程式，透過 GitHub Pages 對外提供：

- https://kindredplus.github.io/kp.js
- https://kindredplus.github.io/kp.css
- https://kindredplus.github.io/img/（照片、LOGO、首頁海報）
- https://kindredplus.github.io/pages/（各頁內容的原稿；預約諮詢頁的說明內容也由這裡讀取）

官網後台「關於賽親 → 關於賽親列表」排序第一筆（關於賽親，原標題「緣起」）的標題後面，接了一段：

```
<script src="https://kindredplus.github.io/kp.js"></script>
```

官網每一頁的選單都會出現這個標題，所以每一頁都會載入 kp.js，再由 kp.js 載入 kp.css。

各頁內容（pages/ 裡除了 home.html 以外的檔）最前面另有一行 `<link rel="stylesheet" href="https://kindredplus.github.io/kp.css" />`，讓後台編輯器的一般模式也套用新版面。前台與 kp.js 載入的是同一個網址，只下載一次。這一行被刪掉，前台不受影響，只是編輯畫面變回素的。

## 檔案

| 檔案 | 用途 |
|---|---|
| kp.js | 換掉頁首、頁尾、選單；各頁瀏覽器標題；首頁海報輪播；首頁自動帶入最新消息；預約諮詢頁插入說明內容；最新消息列表頁加標題區；舊網址轉址；預覽模式 |
| kp.css | 全站樣式，依「設計規則 v1.3（115/10/27）」與「頁首選單（115/10/30）」 |
| img/ | 網站用照片、LOGO、首頁海報（已壓縮） |
| pages/ | 各頁內容原稿，與後台貼上的內容相同；pages/contact.html 由 kp.js 讀取，插在預約諮詢頁的表單上方 |

## 常見修改

1. 改電話、地址、LINE、臉書連結、立案字號：改 kp.js 的 `SITE`。
2. 改頁首選單項目、順序、下拉項目：改 kp.js 的 `MENU`；頁尾欄位跟著 `MENU` 與 `FOOTER_COLS`，連結在 `LINKS`。
3. 獨居陪伴計畫（caring_methods&id=22）、樂齡共學計畫（caring_methods&id=23）已填入 kp.js 的 `LINKS.alone`、`LINKS.learning`（115/10/30）。
4. 改各頁瀏覽器標題與搜尋說明：改 kp.js 的 `PAGES`。
5. 舊網址轉址（115/10/30 開啟）：單一舊頁寫在 kp.js 的 `REDIRECTS`；整個不再使用的單元（專家講座、相關連結）寫在 `REDIRECT_ACTIONS`。列在這裡的舊頁，在後台重新啟用也會被轉走；要恢復某一頁，先從這裡拿掉那一筆。`REDIRECTS_ON` 改成 `false` 即全部停止轉址。
6. 改預約諮詢頁的說明文字：改 pages/contact.html。
7. 改顏色、字級：改 kp.css 最上面的 `:root`。

在 GitHub 網頁上直接編輯檔案、按 Commit，約 1 至 10 分鐘後官網就會更新（GitHub Pages 快取 10 分鐘）。要馬上看到，瀏覽器按 Ctrl＋Shift＋R 強制重新整理。

## 預覽

任何一頁的網址最後加上 `#kp-preview`，會把 pages/ 裡的新內容暫時套進該頁，只在自己的瀏覽器顯示，不會改到網站。還沒建立的兩頁，可在「生活陪跑教練」頁網址最後加 `#kp-preview=alone` 或 `#kp-preview=learning` 預覽。

## 還原

到官網後台，把那一筆標題後面的 `<script ...></script>` 刪掉、存檔，官網就回到原本的樣子。
