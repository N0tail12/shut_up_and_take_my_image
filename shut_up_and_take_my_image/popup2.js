var images = [];
let image_List = document.getElementById("list_image");
let downloadImages = document.getElementById("download_button");

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
// create list of image
const createList = (src) => {
  const list = createElement("div", "image_grid");
  const link = createElement("a", undefined, {
    href: src,
    download: "",
  });
  const preview = createElement("img", undefined, { src });
  //preview.onclick = downloadResource(src);
  // console.log(link);
  link.appendChild(preview);
  // list.onclick = downloadResource(src);
  list.appendChild(link);
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

function pause(msec) {
    return new Promise(
        (resolve, reject) => {
            setTimeout(resolve, msec || 1000);
        }
    );
}
  // download
  async function downloadAll() {
    const filter = images.filter((item) => getName(item) !== "");
    let limited = 0;
    for(var i = 0; i < filter.length; ++i) {
      // chrome.downloads.download({
      //   url: item,
      // });
      downloadResource(filter[i]);
      if (limited >= 10) {
        await pause(3000);
        limited = 0;
    }
      limited ++;
      // const link = createElement("a", undefined, {
      //   href: item,
      //   download: getName(item),
      // });
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    };
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
       'access-control-allow-origin' : '*',
        // 'content-disposition': 'attachment,'
      }),
      mode: 'cors',
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch((e) =>
      console.log(e.error)
       );
  }

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action === "getImages") {
    images = request.resources;
    console.log(images);
    if (images.length) {
      console.log("oke");
      downloadImages.style.display = "block";
      downloadImages.onclick = handleDownload;
      renderList(images, image_List);
    }

    //   for (var i = 0, len = resources.length; i < len; i++) {
    //     str += setTemplate(resources[i]);
    //   }
    //   container.innerHTML = str;
    //   console.log(container);
  }
});

window.onload = function () {
  injectScript();
};

function injectScript() {
  chrome.tabs.query({ active: true }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ["getImages.js"],
        },
        (injectionResults) => {
          if (images.length) {
            console.log("script is oke");
            //downloadImages.style.display = "block";
            //downloadImages.onclick = handleDownload;
            //renderList(images, image_List);
          }
        }
      );
    }
  });
}
