!(function () {
  let images = [];
  let image_List = document.getElementById("list_image");
  let downloadImages = document.getElementById("download_button");
  let count = 0;
  const getName = (url) => {
    const path = url.split("/");
    return path[path.length - 1];
  };

  const createElement = (el, class_name, config = {}) => {
    const element = document.createElement(el);
    element.className = class_name || "";
    for (const prop in config) {
      element[prop] = config[prop];
    }
    return element;
  };

  const createList = (src) => {
    const list = createElement("div", "image_grid");
    const link = createElement("a", undefined, {
      href: src,
      target: "_blank",
      download: getName(src),
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

  const getPageImages = () => {
    // const images = document.body.getElementsByTagName("img");
    // console.log('images: ',images);
    // const imageSource = Array.from(images).map((el) => el.src);
    // return imageSource;
    var images = [], bgImg, src;
    const getUrls = (el) =>{
        bgImg = el.style.backgroundImage;
        if(bgImg){
            src = bgImg.replace(/^\s?url\((\'|\")/,'').replace(/(\"|\')\)\s?$/, '');
            bgImg = '';
        }else{
            src = el.src;
        }
        if(src.match(/^data\:image|\/\//)){
            return src;
        }
        return document.location.origin.replace(/\/$/, '') + '/' + src;
    }
    const reduceArray = (a,b) => {
        if(a.indexOf(b) < 0){
            a.push(b);
        }
        return a;
    }
    var img_urls = Array.prototype.map.call(document.querySelectorAll('img, [style*="background-image"]'), getUrls).reduce(reduceArray, []);
    return img_urls;
  };

  const downloadAll = () => {
    const filter = images.filter((item) => getName(item) !== "");
    filter.forEach((item) => {
      const link = createElement("a", undefined, {
        href: item,
        download: getName(item),
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleDownload = () => {
    if (window.confirm(`Will be downloaded ${count} files. Are you sure?`))
      downloadAll();
  };
  chrome.tabs.query({ active: true }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: getPageImages,
        },
        (injectionResults) => {
          images = injectionResults[0].result;
          console.log(images);
          if (images.length) {
            downloadImages.style.display = "block";
            downloadImages.onclick = handleDownload;
          }
          renderList(injectionResults[0].result, image_List);
        }
      );
    }
  });
    // images = getPageImages();
    // console.log(images);
})();
