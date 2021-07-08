!(function () {
  let images = [];
  let image_List = document.getElementById("list_image");
  let downloadImages = document.getElementById("download_button");
  let count = 0;
  const getURL = (url) => {
    const path = url.split("/");
    console.log(path[path.length - 1]);
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
      download: getURL(src),
    });
    const preview = createElement("img", undefined, { src });
    link.appendChild(preview);
    list.appendChild(link);
    return list;
  };

  const renderList = (images, el) => {
    el.innerHTML = "";
    // <div class="found_images">
    //     <span>She found 2 photos. Can't run from her now XD</span>
    //     <img src="images/found_images.png" alt="she_saw_it"style="width: 46px; height: 36px">
    // </div>
    const create_List = createElement("div", "list");
    images.forEach((items) => {
      count = items.result.length;
      //   console.log(items.result instanceof Array)
      for (let i = 0; i < items.result.length; ++i) {
        const item_List = createList(items.result[i]);
        create_List.appendChild(item_List);
      }
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
    span_in.appendChild(text_span);
    found_images.appendChild(span_in);
    found_images.appendChild(img);
    el.appendChild(found_images);
    el.appendChild(create_List);
  };

  const getPageImages = () => {
    const images = document.body.getElementsByTagName("img");
    const imageSource = Array.from(images).map((el) => el.src);
    return imageSource;
  };

  const downloadAll = () => {
    images.forEach((item) => {
      const link = createElement("a", undefined, {
        href: item,
        download: getURL(item),
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleDownload = () => {
    if (
      window.confirm(`Will be downloaded ${images.length} files. Are you sure?`)
    )
      downloadAll();
  };

  //   const tabId = getTabId();
  //   chrome.scripting.executeScript(
  //     {
  //       target: {tabId: 0, allFrames: true},
  //       function: getPageImages
  //     },
  //     (injectionResults) => {
  //         images = injectionResults[0];
  //         if (images.length) {
  //           downloadImages.style.display = "block";
  //           downloadImages.onclick = handleDownload;
  //         }
  //         renderList(injectionResults[0], image_List);
  //     });
  //   chrome.tabs.executeScript({ code: `(${getPageImages})();` }, (results) => {
  //     if (images.length) {
  //       downloadImages.style.display = "block";
  //       downloadImages.onclick = handleDownload;
  //     }
  //     renderList(injectionResults[0], image_List);
  //   });
  chrome.tabs.query({ active: true }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: getPageImages,
        },
        (injectionResults) => {
          //   console.log('result' ,injectionResults[0].result.length)
          //   console.log('type result', injectionResults[0].result instanceof Array )
          images = injectionResults[0].result;
          if (images.length) {
            downloadImages.style.display = "block";
            downloadImages.onclick = handleDownload;
          }
          renderList(injectionResults, image_List);
        }
      );
    }
  });
})();
