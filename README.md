[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/vtMjwcap)
# hw2-handling-input-events
This is the starter code of [2023-Programming User Interface Homework](https://hackmd.io/@akairisu/HkUibgmx3)
## 姓名
薛佳哲
## deploy 的網站連結
[連結](https://fluffy-horse-c1d8ee.netlify.app/)
## 設計說明
主要透過pointer event同時handle滑鼠跟觸控
* pointerdown
當長按target 0.5秒後設定isDragging，允許拖移
* pointerup
清除所有狀態(拖移、跟隨、縮放)，並重新設定target的選取狀態
* pointermove
處理target拖移跟跟隨的位置變化，並在第二隻手指觸控時還原
* click
透過計時器判斷，單擊解除跟隨狀態，連擊兩下進入跟隨狀態
* dblclick
進入跟隨狀態 (滑鼠專用，已經被click的部分handle住，可移除)
* keydown
按下esc還原
* touchstart
因為pointer沒辦法判斷同時多少手指，因此另外用touch event處理縮放
1隻手指時: 設定計時器

2隻手指時: 檢查計時器是否小於100ms (同時點擊)，若小於，則進入縮放狀態

3隻手指時: 結束縮放並還原
* touchmove
處理縮放變化
## 加分作業
* 垂直縮放
