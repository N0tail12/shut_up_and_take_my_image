!(function () {
  let images = [];
  let image_List = document.getElementById("list_image");
  let downloadImages = document.getElementById("download_button");


  const getURL = (url) => {
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
      download: getURL(src),
    });
    const preview = createElement("img", undefined, { src });
    link.appendChild(preview);
    list.appendChild(link);
    return list;
  };


  const renderList = (images, el) => {
    el.innerHTML = "";
    const create_List = createElement("div", "list");
    images.forEach((items) => {
      const item_List = createList(items);
      create_List.appendChild(item_List);
    });
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
    if (window.confirm(`Will be downloaded ${images.length} files. Are you sure?`))  downloadAll();
  };


//   chrome.tabs.executeScript(
//     null,
//     { code: `(${getPageImages})();` },
//     (results) => {
      images = getPageImages();
      if (images.length) {
        downloadImages.style.display = "block";
        downloadImages.onclick = handleDownload;
      }
      renderList(getPageImages(), image_List);
    // }
//   );
})();
