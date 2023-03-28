/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/
const targets = document.querySelectorAll(".target");
const workspaceDiv = document.getElementById("workspace");

workspaceDiv.addEventListener("mouseup", function () {
  targets.forEach(function (target) {
    if (target.classList.contains("selected")) {
      target.classList.remove("selected");
      target.style.backgroundColor = "red";
    }
    if (target.classList.contains("following")) {
      target.classList.remove("following");
    }
  });
});

workspaceDiv.addEventListener("touchend", function () {
  targets.forEach(function (target) {
    if (target.classList.contains("selected")) {
      target.classList.remove("selected");
      target.style.backgroundColor = "red";
    }
    if (target.classList.contains("following")) {
      target.classList.remove("following");
    }
  });
});

let currentTarget = null;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let isFollowing = false;

targets.forEach(function (target) {
  // 開始拖移
  target.addEventListener("mousedown", function (event) {
    if (event.button !== 0) return; // 如果不是左鍵，則不處理
    event.preventDefault(); // 防止文字被選取

    // 如果已經進入跟隨模式，則不處理
    if (isFollowing) return;
    // 記錄目前選取的元素
    currentTarget = target;

    // 記錄起始位置和偏移量
    console.log(event.detail);

    // 設置拖移標誌
    isDragging = true;
    // 添加拖移樣式
    target.classList.add("dragging");

    startX = event.clientX;
    startY = event.clientY;
    offsetX = target.offsetLeft;
    offsetY = target.offsetTop;
  });

  let touchStartTime = null;
  let touchCount = 0;
  // 觸控開始拖移
  target.addEventListener("touchstart", function (event) {
    event.preventDefault(); // 防止觸控滑動
    // 如果已經進入跟隨模式，則不處理
    console.log(isFollowing);
    if (isFollowing) return;

    touchCount++;
    console.log(touchCount);

    if (touchCount === 1) {
      // 如果是第一次觸控，開始計時
      touchStartTime = new Date().getTime();
    } else if (touchCount === 2) {
      // 如果是第二次觸控，檢查兩次觸控的間隔時間
      let touchEndTime = new Date().getTime();
      if (touchEndTime - touchStartTime < 300) {
        // 觸發了連續點擊事件，進入跟隨模式
        isFollowing = true;
        target.classList.add("following");
        // console.log("double tap");
      }
      touchCount = 0;
    }

    // 記錄目前選取的元素
    currentTarget = target;

    // 設置拖移標誌
    isDragging = true;
    // 添加拖移樣式
    target.classList.add("dragging");

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    offsetX = target.offsetLeft;
    offsetY = target.offsetTop;
  });

  // 拖移中
  window.addEventListener("mousemove", function (event) {
    if (!isDragging && !isFollowing) return;

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

  // 觸控拖移中
  window.addEventListener("touchmove", function (event) {
    if (!isDragging && !isFollowing) return;
    event.preventDefault(); // 防止觸控滑動

    // 計算新的位置
    let newX = offsetX + event.touches[0].clientX - startX;
    let newY = offsetY + event.touches[0].clientY - startY;

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
  target.addEventListener("mouseup", function (event) {
    event.stopPropagation();
    // 取消拖移標誌
    isDragging = false;
    isFollowing = false;
    // 移除拖移樣式
    targets.forEach(function (otherTarget) {
      otherTarget.classList.remove("dragging");
      otherTarget.classList.remove("following");
    });
    if (
      target.style.left == offsetX + "px" &&
      target.style.top == offsetY + "px"
    ) {
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

  // 觸控拖移結束
  window.addEventListener("touchend", function (event) {
    event.preventDefault(); // 防止觸控滑動
    // 取消拖移標誌
    isDragging = false;
    // 移除拖移樣式
    targets.forEach(function (otherTarget) {
      otherTarget.classList.remove("dragging");
    });

    targets.forEach(function (target) {
      if (target === event.target) {
        // 如果觸發元素是目標元素，設置為選擇狀態
        target.classList.add("selected");
        target.style.backgroundColor = "blue";
      } else {
        // 如果不是目標元素，取消選擇狀態
        target.classList.remove("selected");
        target.style.backgroundColor = "red";
      }
    });
  });

  target.addEventListener("dblclick", function (event) {
    // 雙擊事件，進入跟隨模式
    isFollowing = true;
    target.classList.add("following");
    startX = event.clientX;
    startY = event.clientY;
    offsetX = target.offsetLeft;
    offsetY = target.offsetTop;
  });

  window.addEventListener("click", function (event) {
    // 單擊事件，解除跟隨模式
    targets.forEach(function (target) {
      target.classList.remove("following");
    });
    isFollowing = false;
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
