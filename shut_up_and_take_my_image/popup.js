!(function () {
  let images = [];
  let image_List = document.getElementById("list_image");
  let downloadImages = document.getElementById("download_button");
  let count = 0;
  let testing;
  let images_selector = [];
  let list = [];
  const getName = (url) => {
    const path = url.split("/");
    return path[path.length - 1];
  };
  // create element with class and config
  const createElement = (el, class_name, config = {}) => {
    const element = document.createElement(el);
    element.className = class_name || "";
    for (const prop in config) {
      element[prop] = config[prop];
    }
    return element;
  };
  // create list of image
  const createList = (src) => {
    const list = createElement("div", "image_grid");
    const a = createElement("a", "pop-up", {
      href: src,
      target: "_blank"
    })
    const popup = createElement("img", undefined, {
      src: "images/pop-up.png",
      style: "width: 30px; height: 30px;"
    })
    a.appendChild(popup);
    const preview = createElement("img", "stupid", { src });
    list.appendChild(a);
    list.appendChild(preview);
    return list;
  };
  // render list of image
  const renderList = (images, el) => {
    el.innerHTML = "";
    const create_List = createElement("div", "list");
    const filter_images = images.filter((item) => getName(item) !== "");
    count = filter_images.length;
    filter_images.forEach((items) => {
      const item_List = createList(items);
      create_List.appendChild(item_List);
    });
    const found_images = createElement("div", "found_images");
    const span_in = createElement("span", undefined);
    const text_span = document.createTextNode(
      "She found " + count + " photos. Can't run from her now."
    );
    const img = createElement("img", undefined, {
      src: "images/found_images.png",
      style: "width: 46px; height: 36px",
    });
    const option = createElement("div", "option");
    const selectAll = createElement("button", "select_all");
    const textSelect = document.createTextNode("Select All");
    selectAll.appendChild(textSelect);
    const deselectAll = createElement("button", "deselect_all", {
      disabled: true,
    });
    const textDeselect = document.createTextNode("Deselect All");
    deselectAll.appendChild(textDeselect);
    const pText = document.createTextNode(" or maybe ");
    option.appendChild(selectAll);
    option.appendChild(pText);
    option.appendChild(deselectAll);
    console.log(create_List);
    span_in.appendChild(text_span);
    found_images.appendChild(span_in);
    found_images.appendChild(img);
    el.appendChild(found_images);
    el.appendChild(option);
    el.appendChild(create_List);

    // fixed selectAll and deselectAll
    window.onscroll = function () {
      myFunction();
    };
    var option_fix = document.getElementsByClassName("option");
    console.log(option_fix[0].offsetTop);
    var sticky = option_fix[0].offsetTop;
    function myFunction() {
      if (window.pageYOffset > sticky) {
        option_fix[0].classList.add("sticky");
      } else {
        option_fix[0].classList.remove("sticky");
      }
    }
  };

  //get images on page
  const getPageImages = () => {
    // const images = document.body.getElementsByTagName("img");
    // console.log('images: ',images);
    // const imageSource = Array.from(images).map((el) => el.src);
    // return imageSource;
    var bgImg, src;
    const getUrls = (el) => {
      bgImg = el.style.backgroundImage;
      origin = document.location.origin;
      if (bgImg) {
        // if the image is background.;
        src = bgImg
          .replace(/^\s?url\((\'|\")/, "")
          .replace(/(\"|\')\)\s?$/, "");
        bgImg = "";
      } else {
        src = el.src;
      }
      if (src.match(/^data\:image|\/\//)) {
        // if source is data:image type or contains "//";
        return src;
      }
      return document.location.origin.replace(/\/$/, "") + "/" + src; // if source other type. for example "/img/img.png";
    };

    const reduceArray = (a, b) => {
      // if 2 images are the same source;
      if (a.indexOf(b) < 0) {
        a.push(b);
      }
      return a;
    };

    var img_urls = Array.prototype.map
      .call(
        document.querySelectorAll('img, [style*="background-image"]'),
        getUrls
      )
      .reduce(reduceArray, []);
    return img_urls;
  };

  //
  function pause(msec) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, msec || 1000);
    });
  }
  // download
  async function downloadAll() {
    const filter = images.filter((item) => getName(item) !== "");
    let limited = 0;
    for (var i = 0; i < filter.length; ++i) {
      downloadResource(filter[i]);
      if (limited >= 10) {
        await pause(3000);
        limited = 0;
      }
      limited++;
    }
  }
  // handle download
  const handleDownload = () => {
    if (!images.length) {
      window.alert(`You haven't choice any file/files to download`);
    } else if (
      window.confirm(`Will be downloaded ${images.length} files. Are you sure?`)
    ) {
      downloadAll();
    }
  };

  // force to download image by change header to allow cross-origin
  function forceDownload(blob, filename) {
    var a = document.createElement("a");
    a.download = "";
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function downloadResource(url, filename) {
    if (!filename) filename = url.split("\\").pop().split("/").pop();
    fetch(url, {
      headers: new Headers({
        Origin: location.origin,
      }),
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch((e) => console.log(e));
  }
  // handleOnclick
  const handleOnclick = () => {
    images_selector = [];
    for (
      var i = 0;
      i < list.item(0).getElementsByClassName("mark").length;
      ++i
    ) {
      images_selector.push(
        list
          .item(0)
          .getElementsByClassName("mark")
          [i].getElementsByClassName("stupid")[0].src
      );
    }
    images = images_selector;
    if (images.length) {
      downloadImages.textContent = "Download " + images.length + " images";
    } else {
      downloadImages.textContent = "Download ";
    }
    console.log(images);
  };
  // Deselect
  const deselectAll = () => {
    let Deselect = document.getElementsByClassName("deselect_all")[0];
    console.log(Deselect);
    if (images.length > 0) {
      Deselect.disabled = false;
      Deselect.style.cursor = "pointer";
      Deselect.style.backgroundColor = "#212121";
    }
    if(images.length === 0){
      Deselect.disabled = true;
      Deselect.style.cursor = null;
      Deselect.style.backgroundColor = "#7a7a7a";
    }
    Deselect.addEventListener("click", function () {
      for (let index = 0; index < testing.length; index++) {
        if (testing[index].classList.length === 2) {
          testing[index].className = testing[index].classList[0];
        }
      }
      Deselect.disabled = true;
      Deselect.style.cursor = null;
      Deselect.style.backgroundColor = "#7a7a7a";
      handleOnclick();
    });
  };
  // execute Script;
  window.onload = function () {
    chrome.tabs.query({ active: true }, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: getPageImages,
          },
          (injectionResults) => {
            images = injectionResults[0].result;
            console.log("img1", images);
            if (images.length) {
              downloadImages.style.display = "block";
              renderList(images, image_List);
              images = [];
              testing = document.body.getElementsByClassName("image_grid");
              list = document.body.getElementsByClassName("list");
              let selectAll =
                document.body.getElementsByClassName("select_all")[0];
              selectAll.addEventListener("click", function () {
                for (let index = 0; index < testing.length; index++) {
                  if (testing[index].classList.length === 1) {
                    testing[index].className += " mark";
                  }
                }
                handleOnclick();
                deselectAll();
              });
              for (let index = 0; index < testing.length; index++) {
                testing[index].addEventListener("click", function () {
                  if (testing[index].classList.length === 2) {
                    testing[index].className = testing[index].classList[0];
                  } else {
                    testing[index].className += " mark";
                  }
                  handleOnclick();
                  deselectAll();
                });
              }
              downloadImages.onclick = handleDownload;
            }
          }
        );
      }
    });
  };
})();
