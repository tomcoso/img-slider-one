namespace Slider {
  export const create = function (
    imagArray: Array<string>,
    parentSelector: string
  ) {
    const imageArray: string[] = imagArray;

    const style = document.createElement("style");
    style.classList.add("image-slider-style");
    const head = document.querySelector("head");
    style.textContent = `.slider-box {
            grid-column: 2/4;
            grid-row: 2;
            box-shadow: 0px 0px 15px #000;
            overflow: hidden;
            height: 100%;
            width: 100%;
            position: relative;
        }
        .slider-box > .images {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
            right: 100%;
        }
        .slider-box > .images > div {
            min-width: 100%;
            background-clip: border-box;
            background-size: cover;
            background-position: center;
        }
        .slider-box > .images > .main {
            transition-property: background-image;
            transition-delay: 500ms;
            z-index: 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .slider-box > .images > .main > div {
            opacity: .7;
            height: 100%;
            width: min-content;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
        }
        .slider-box > .images > .main > div > img {
            width: 48px;
            height: 48px;
        }
        .slider-box > .images > .main > .prev-btn:hover {
            box-shadow: inset 10px 0px 10px -8px;
        }
        .slider-box > .images > .main > .next-btn:hover {
            box-shadow: inset -10px 0px 10px -8px;
        }
        .slider-box > .index-btns {
            height: min-content;
            display: flex;
            align-items: flex-end;
            gap: min(10px, .5vw);
            padding: 10px;
            position: absolute;
            z-index: 2;
            left: 50%;
            transform: translate(-50%, -100%);
        }
        .slider-box > .index-btns > div {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid white;
            opacity: .5;
            transition-delay: 500ms;
        }
        .slider-box > .index-btns > .current {
            border: 2px solid white;
            opacity: 1;
        }
        .slider-box > .images > div:not(.main) {
            transition: transform 500ms ease-out;
            box-shadow: 0px 0px 20px 10px #000;
            opacity: 0;
            position: relative;
            z-index: 1;
        }`;

    if (head === null) {
      return;
    }
    head.append(style);

    const images = document.createElement("div");
    images.classList.add("images");
    const sliderBox = document.createElement("div");
    sliderBox.classList.add("slider-box");
    sliderBox.append(images);
    const parent = document.querySelector(parentSelector);
    if (parent === null) {
      throw new Error("Slider parent selector has to be a valid delector.");
    }
    parent.append(sliderBox);

    const main = document.createElement("div");
    main.classList.add("main");
    main.setAttribute("style", `background-image: url('${imageArray[0]}')`);

    const prevBtn = document.createElement("div");
    prevBtn.classList.add("prev-btn");
    const prevBtnImg = document.createElement("img");
    prevBtnImg.setAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/512/860/860790.png"
    );
    prevBtnImg.setAttribute("alt", "previous picture");
    prevBtn.append(prevBtnImg);

    const nextBtn = document.createElement("div");
    nextBtn.classList.add("next-btn");
    const nextBtnImg = document.createElement("img");
    nextBtnImg.setAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/512/860/860828.png"
    );
    nextBtnImg.setAttribute("alt", "next picture");
    nextBtn.append(nextBtnImg);

    const indexBtns = document.createElement("div");
    indexBtns.classList.add("index-btns");
    for (const x of imageArray) {
      const item = document.createElement("div");
      indexBtns.append(item);
    }
    indexBtns.children[0].classList.add("current");
    sliderBox.append(indexBtns);
    main.append(prevBtn, nextBtn);

    const prev = document.createElement("div");
    prev.classList.add("prev");
    const next = document.createElement("div");
    next.classList.add("next");
    images.append(prev, main, next);

    const indexBtnsArray: Element[] = [...indexBtns.children];

    const getCurrentIndex = function () {
      let matchArray = main.style
        .getPropertyValue("background-image")
        .match(/\.\S*(?=")/);
      if (matchArray === null) {
        throw new Error("Can't find current image.");
      }
      const url: string = matchArray[0];

      return imageArray.findIndex((x) => x === url);
    };

    const advanceSlider = function (optIndex?: number) {
      clearTimeout(currentTimeout);
      if (imageArray.length < 2) return;
      const currentIndex = getCurrentIndex();
      let nextPic: number;
      optIndex || optIndex === 0
        ? (nextPic = optIndex)
        : (nextPic =
            currentIndex !== imageArray.length - 1 ? currentIndex + 1 : 0);

      indexBtnsArray.forEach((each) => each.classList.remove("current"));
      indexBtnsArray[nextPic].classList.add("current");

      next.setAttribute(
        "style",
        `background-image: url('${imageArray[nextPic]}')`
      );
      next.animate(
        [
          { transform: "translateX(0%)", opacity: 1 },
          { transform: "translateX(-100%)", opacity: 1, offset: 1 },
          { opacity: 0 },
        ],
        500
      );
      main.setAttribute(
        "style",
        `background-image: url('${imageArray[nextPic]}')`
      );
      currentTimeout = setTimeout(advanceSlider, 5000);
    };

    const reverseSlider = function (optIndex?: number) {
      clearTimeout(currentTimeout);
      if (imageArray.length < 2) return;
      const currentIndex = getCurrentIndex();
      let nextPic: number;
      optIndex || optIndex === 0
        ? (nextPic = optIndex)
        : (nextPic =
            currentIndex !== 0 ? currentIndex - 1 : imageArray.length - 1);

      indexBtnsArray.forEach((each) => each.classList.remove("current"));
      indexBtnsArray[nextPic].classList.add("current");

      prev.setAttribute(
        "style",
        `background-image: url('${imageArray[nextPic]}')`
      );
      prev.animate(
        [
          { transform: "translateX(0%)", opacity: 1 },
          { transform: "translateX(100%)", opacity: 1, offset: 1 },
          { opacity: 0 },
        ],
        500
      );
      main.setAttribute(
        "style",
        `background-image: url('${imageArray[nextPic]}')`
      );
      currentTimeout = setTimeout(advanceSlider, 5000);
    };

    const gotoSlide = function (e: Event) {
      if (imageArray.length < 2) return;
      let element = e.target as Element;
      const target = indexBtnsArray.indexOf(element);

      const currentIndex = getCurrentIndex();
      if (currentIndex < target) {
        advanceSlider(target);
      } else if (currentIndex > target) {
        reverseSlider(target);
      }
      return;
    };

    prevBtn.addEventListener("click", () => reverseSlider());
    nextBtn.addEventListener("click", () => advanceSlider());
    indexBtnsArray.forEach((each) => each.addEventListener("click", gotoSlide));
    var currentTimeout = setTimeout(advanceSlider, 5000);
  };
}

export default Slider.create;
