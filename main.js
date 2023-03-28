// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let initProducts = () => {
  // To see the shirts object, run:
  // 從JSON檔案獲取數據
  // 獲取容器元素
  const container = document.getElementById("products-container");

  // 創建區塊
  for (let i = 0; i < shirts.length; i++) {
    // 創建一個新的區塊元素
    const block = document.createElement("div");
    block.className = "block";
    var colorsArray = shirts[i].colors ? Object.values(shirts[i].colors) : [];

    // 添加圖片元素
    const img = document.createElement("img");
    imgsrc = productimg(shirts[i]);
    //img.src = colorsArray[0].front;
    img.src = imgsrc;
    img.id = "img_" + i;
    img.onclick = function () {
      location.href = `details.html?bid=${i}`;
    };
    block.appendChild(img);

    // 添加標題元素
    const title = document.createElement("h2");
    title.textContent = shirts[i].name ? shirts[i].name : "data lost";
    title.id = "title_" + i;
    block.appendChild(title);

    // 添加文字元素
    const avaliable = document.createElement("p");
    avaliable.textContent = "Avaliable in " + colorsArray.length + " colors";
    avaliable.id = "avaliable_" + i;
    block.appendChild(avaliable);

    // 添加兩個按鈕元素
    const button1 = document.createElement("button");
    button1.textContent = "Quick View";
    button1.id = "button1_" + i;
    button1.onclick = function () {
      location.href = `not_implemented.html`;
    };
    block.appendChild(button1);

    const button2 = document.createElement("button");
    button2.textContent = "See Page";
    button2.id = "button2_" + i;
    button2.onclick = function () {
      location.href = `details.html?bid=${i}`;
    };
    block.appendChild(button2);
    // 將區塊添加到容器中
    container.appendChild(block);
  }

  // Your Code Here
};

let initDetails = () => {
  // To see the shirts object, run:
  // console.log(shirts);
  // Your Code Here
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var bid = parseInt(url.searchParams.get("bid"));
  var colorsArray = shirts[bid].colors ? Object.values(shirts[bid].colors) : [];
  var colorsKeyArray = shirts[bid].colors
    ? Object.keys(shirts[bid].colors)
    : [];
  var current_color = 0;
  var sideArray = colorsArray[current_color]
    ? Object.values(colorsArray[current_color])
    : [];
  //var sideKeyArray = Object.keys(colorsArray[current_color]);

  var title = document.getElementById("details-title");
  title.innerHTML = shirts[bid].name ? shirts[bid].name : "data lost";

  var img = document.getElementById("details-img");
  let whiteFrontImage = productimg(shirts[bid]);
  img.setAttribute("src", whiteFrontImage);

  var price = document.getElementById("details-price");
  price.innerHTML = shirts[bid].price ? shirts[bid].price : "data lost";

  var description = document.getElementById("details-description");
  description.innerHTML = shirts[bid].description
    ? shirts[bid].description
    : "data lost";

  let refresh_sidebtn = () => {
    var sidebtn_block = document.getElementById("details-side-button");
    //clear original button
    var buttons = sidebtn_block.querySelectorAll("button");
    buttons.forEach(function (button) {
      sidebtn_block.removeChild(button);
    });

    for (let i = 0; i < sideArray.length; i++) {
      let sideArray = Object.values(colorsArray[current_color]);
      let sideKeyArray = Object.keys(colorsArray[current_color]);
      let button = document.createElement("button");
      button.textContent = sideKeyArray[i];
      button.id = "side_button_" + i;
      button.onclick = function () {
        let img = document.getElementById("details-img");
        let new_src = sideArray[i];
        img.setAttribute("src", new_src);
      };
      sidebtn_block.appendChild(button);
    }
  };
  refresh_sidebtn();
  var colorbtn_block = document.getElementById("details-color-button");

  for (let i = 0; i < colorsArray.length; i++) {
    let button = document.createElement("button");
    button.textContent = colorsKeyArray[i];
    button.id = "color_button_" + i;
    button.style.backgroundColor = colorsKeyArray[i];
    button.onclick = function () {
      current_color = i;
      let img = document.getElementById("details-img");
      let new_src = colorsArray[i].front;
      img.setAttribute("src", new_src);
      refresh_sidebtn();
    };
    colorbtn_block.appendChild(button);
  }
};

var productimg = (obj) => {
  if (obj.colors) {
    let colorsArray = Object.values(obj.colors);
    return Object.values(colorsArray[0])[0];
  } else if (obj.default) {
    let defaultArray = Object.values(obj.default);
    return Object.values(defaultArray)[0];
  } else {
    return "./shirt_images/not-found.png";
  }
};
