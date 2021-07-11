!(function () {
  let images = [];
  let image_List = document.getElementById("list_image");
  let downloadImages = document.getElementById("download_button");
  let count = 0;
  let test;
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
    const link = createElement("a", undefined, {
      href: src,
      target: "_blank",
      download: "",
    });
    const preview = createElement("img", undefined, { src });
    // console.log(link);
    link.appendChild(preview);
    list.appendChild(link);
    return list;
    // return '<div class="image_grid">' +
    // '<a href="' + src + '" target="_blank" download>' +
    // '<img class="image" src="' + src + '" />' +
    // '</a>' +
    // '</div>';
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
    var images = [],
      bgImg,
      src;
    const getUrls = (el) => {
      bgImg = el.style.backgroundImage;
      if (bgImg) { // if the image is background.;
        src = bgImg
          .replace(/^\s?url\((\'|\")/, "")
          .replace(/(\"|\')\)\s?$/, "");
        bgImg = "";
      } else {
        src = el.src;
      }
      if (src.match(/^data\:image|\/\//)) { // if source is data:image type or contains "//";
        return src;
      }
      return document.location.origin.replace(/\/$/, "") + "/" + src; // if source other type. for example "/img/img.png";
    };

    const reduceArray = (a, b) => { // if 2 images are the same source;
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

  // download
  const downloadAll = () => {
    const filter = images.filter((item) => getName(item) !== "");
    filter.forEach((item) => {
      // chrome.downloads.download({
      //   url: item,
      // });
      downloadResource(item);
      // const link = createElement("a", undefined, {
      //   href: item,
      //   download: getName(item),
      // });
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    });
  };
  // handle download
  const handleDownload = () => {
    if (window.confirm(`Will be downloaded ${count} files. Are you sure?`)){
      // let length = Math.ceil(count / 10);
      // let start = 0;
      // let end_arr = 10;
      // for (let i = 0; i < length; ++i) {
      //   if(end_arr >= count){
      //     end_arr = count;
      //   }
      //   test = images.slice(start, end_arr);
        downloadAll();
      //   console.log('img2', images);
      //   console.log('test', test);
      //   start = start + 10;
      //   end_arr = end_arr + 10;
      // }
      
    }
  };


  // force to download image by change header to allow cross-origin
  function forceDownload(blob, filename) {
    var a = document.createElement("a");
    a.download = filename;
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
      .catch((e) => console.error(e));
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
            console.log('img1', images);
            if (images.length) {
              downloadImages.style.display = "block";
              downloadImages.onclick = handleDownload;
              renderList(images, image_List);
            }
          }
        );
      }
    });
  };
})();
