/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/
const targets = document.querySelectorAll(".target");
const workspaceDiv = document.getElementById("workspace");

workspaceDiv.addEventListener("click", function () {
  targets.forEach(function (target) {
    if (!event.target.classList.contains("target")) {
      // 點擊到目標元素
      target.classList.remove("selected");
      target.style.backgroundColor = "red";
    }
    if (target.classList.contains("following")) {
      target.classList.remove("following");
    }
  });
});

workspaceDiv.addEventListener("touchstart", function (event) {
  console.log(event.touches.length);
  //縮放
  let selectedElement = document.querySelector(".selected");

  if (event.touches.length === 3 && isPinching) {
    if (selectedElement) pichTarget = selectedElement;
    else return;
    console.log("還原 by 3 fingers");
    isPinching = false;
    targets.forEach(function (otherTarget) {
      //otherTarget.classList.remove("d");
    });
    pinchTarget.style.left = offsetX + "px";
    pinchTarget.style.top = offsetY + "px";
    pinchTarget.style.width = pinchStartWidth + "px";
    pinchTarget.style.height = pinchStartHeight + "px";
    return;
  }
  if (event.touches.length === 2 && !isDragging && !isFollowing) {
    if (selectedElement) pinchTarget = selectedElement;
    else return;
    isPinching = true;
    // 記錄開始縮放時的兩指距離、div 大小和中心座標
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    pinchStartDistance = getDistance(
      { x: touch1.clientX, y: touch1.clientY },
      { x: touch2.clientX, y: touch2.clientY }
    );
    pinchStartWidth = pinchTarget.offsetWidth;
    pinchStartHeight = pinchTarget.offsetHeight;
    console.log(pinchStartWidth);
    pinchStartX = pinchTarget.offsetLeft + pinchTarget.offsetWidth / 2;
    pinchStartY = pinchTarget.offsetTop + pinchTarget.offsetHeight / 2;
  }
});
workspaceDiv.addEventListener("touchmove", function (event) {
  if (!isDragging && !isFollowing && !isPinching) return;
  //縮放
  if (!isDragging && !isFollowing && isPinching) {
    if (event.touches.length === 2) {
      // 計算兩指距離和比例
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = getDistance(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
      );
      const scale = distance / pinchStartDistance;

      // 計算新的 div 寬度、高度和中心座標
      const newWidth = pinchStartWidth * scale;
      const newHeight = pinchStartHeight * scale;
      const newCenterX =
        pinchStartX - (newWidth - currentTarget.offsetWidth) / 2;
      const newCenterY =
        pinchStartY - (newHeight - currentTarget.offsetHeight) / 2;

      // 更新元素大小和位置
      currentTarget.style.width = newWidth + "px";
      currentTarget.style.height = newHeight + "px";
      currentTarget.style.left =
        newCenterX - currentTarget.offsetWidth / 2 + "px";
      currentTarget.style.top =
        newCenterY - currentTarget.offsetHeight / 2 + "px";
    } else {
      isPinching = false;
    }
  }
});

let currentTarget = null;
let pinchTarget = null;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let isFollowing = false;
let touchTimer = null;
//縮放
let isPinching = false; // 是否正在縮放
let pinchStartDistance = 0; // 開始縮放時兩指距離
let pinchStartWidth = 0; // 開始縮放時 div 寬度
let pinchStartHeight = 0; // 開始縮放時 div 高度
let pinchStartX = 0; // 開始縮放時 div 中心 X 座標
let pinchStartY = 0; // 開始縮放時 div 中心 Y 座標
// 判斷兩點之間距離
function getDistance(point1, point2) {
  const xDistance = point2.x - point1.x;
  const yDistance = point2.y - point1.y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

targets.forEach(function (target) {
  // 開始拖移
  target.addEventListener("pointerdown", function (event) {
    console.log("pointer down");
    if (event.button !== 0) return; // 如果不是左鍵，則不處理
    //event.preventDefault(); // 防止文字被選取

    // 如果已經進入跟隨模式，則不處理
    if (isFollowing) return;

    // 記錄目前選取的元素
    currentTarget = target;

    // 設置拖移標誌
    isDragging = true;
    // 添加拖移樣式
    target.classList.add("dragging");

    startX = event.clientX;
    startY = event.clientY;
    offsetX = target.offsetLeft;
    offsetY = target.offsetTop;
  });

  // 拖移中
  window.addEventListener("pointermove", function (event) {
    if (!isDragging && !isFollowing) return;

    //在拖移時如果按下第二隻手指則取消
    if (!event.isPrimary && (isDragging || isFollowing)) {
      console.log("還原 by 2 fingers");
      isDragging = false;
      isFollowing = false;
      targets.forEach(function (otherTarget) {
        otherTarget.classList.remove("dragging");
        otherTarget.classList.remove("following");
      });
      currentTarget.style.left = offsetX + "px";
      currentTarget.style.top = offsetY + "px";
      return;
    }

    // 計算新的位置
    let newX = offsetX + event.clientX - startX;
    let newY = offsetY + event.clientY - startY;

    // 確保不超出邊界
    let maxX = window.innerWidth - target.offsetWidth;
    let maxY = window.innerHeight - target.offsetHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    // 更新元素位置
    targets.forEach(function (target) {
      if (
        target.classList.contains("dragging") ||
        target.classList.contains("following")
      ) {
        target.style.left = newX + "px";
        target.style.top = newY + "px";
      }
    });
  });

  // 結束拖移
  target.addEventListener("pointerup", function (event) {
    console.log("pointer up");
    event.stopPropagation();
    // 取消拖移標誌
    isDragging = false;
    isFollowing = false;
    isPinching = false;
    // 移除拖移樣式
    targets.forEach(function (otherTarget) {
      otherTarget.classList.remove("dragging");
      otherTarget.classList.remove("following");
    });
    if (event.clientX === startX && event.clientY === startY) {
      targets.forEach(function (otherTarget) {
        if (
          otherTarget !== target &&
          otherTarget.classList.contains("selected")
        ) {
          otherTarget.classList.remove("selected");
          otherTarget.style.backgroundColor = "red";
        } else if (!target.classList.contains("selected")) {
          console.log("select");
          target.classList.toggle("selected");
          target.style.backgroundColor = "blue";
        }
      });
    }
  });

  target.addEventListener("dblclick", function (event) {
    console.log("dbclick");
    // 雙擊事件，進入跟隨模式

    isFollowing = true;
    target.classList.add("following");
    startX = event.clientX;
    startY = event.clientY;
    offsetX = target.offsetLeft;
    offsetY = target.offsetTop;
  });

  target.addEventListener("click", function (event) {
    // 單擊事件，解除跟隨模式
    event.stopPropagation();
    console.log("click");
    if (target.classList.contains("following")) {
      target.classList.remove("following");
      isFollowing = false;
    }

    if (touchTimer == null) {
      // 設置計時器
      touchTimer = setTimeout(function () {
        touchTimer = null;
      }, 300);
    } else {
      // 清除計時器
      clearTimeout(touchTimer);
      touchTimer = null;
      // 觸發連續觸控點擊事件
      console.log("dbclick by timer");
      // 雙擊事件，進入跟隨模式

      isFollowing = true;
      target.classList.add("following");
      startX = event.clientX;
      startY = event.clientY;
      offsetX = target.offsetLeft;
      offsetY = target.offsetTop;
    }
  });

  // 按下 ESC 鍵
  window.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      (isDragging || isFollowing) &&
      currentTarget
    ) {
      currentTarget.style.left = offsetX + "px";
      currentTarget.style.top = offsetY + "px";
      isDragging = false;
      isFollowing = false;
      currentTarget.classList.remove("dragging");
      currentTarget.classList.remove("following");
    }
  });
});
