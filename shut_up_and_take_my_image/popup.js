!(function () {
  let images = [];
  let image_List = document.getElementById("list_image");
  let downloadImages = document.getElementById("download_button");
  let count = 0;
  let testing;
  let images_selector = [];
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
    // const link = createElement("a", undefined, {
    //   href: src,
    //   download: "",
    // });
    const preview = createElement("img", undefined, { src });
    // preview.onclick = downloadResource(src);
    // console.log(link);
    // link.appendChild(preview);
    // list.onclick = downloadResource(src);
    list.appendChild(preview);
    // list.appendChild(preview);
    return list;
  };
  // render list of image
  const renderList = (images, el) => {
    el.innerHTML = "";
    const create_List = createElement("div", "list");
    const filter_images = images.filter((item) => getName(item) !== "");
    count = filter_images.length;
    // console.log(filter_images);
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
    console.log(create_List);
    span_in.appendChild(text_span);
    found_images.appendChild(span_in);
    found_images.appendChild(img);
    el.appendChild(found_images);
    el.appendChild(create_List);
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
    if (window.confirm(`Will be downloaded ${images.length} files. Are you sure?`)) {
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
  const handleOnclick = (index) =>{
      if(testing[index].classList.length === 2){
        testing[index].className = testing[index].classList[0];
      }else{
        testing[index].className += " mark";
      }
  }
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
              //downloadImages.onclick = handleDownload;
              renderList(images, image_List);
              testing = document.body.getElementsByClassName("image_grid");
              let list = document.body.getElementsByClassName("list");
              for (let index = 0; index < testing.length; index++) {
                testing[index].addEventListener('click', function (){
                  if(testing[index].classList.length === 2){
                    testing[index].className = testing[index].classList[0];
                  }else{
                    testing[index].className += " mark";
                  }
                  images_selector = [];
                  for(var i = 0; i < list.item(0).getElementsByClassName("mark").length; ++i){
                    images_selector.push(list.item(0).getElementsByClassName("mark")[i].getElementsByTagName('img')[0].src);
                  }
                  images = images_selector;
                  downloadImages.onclick = handleDownload;
                });
              }
            }
          }
        );
      }
    });
  };
})();
