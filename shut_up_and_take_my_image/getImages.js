var src,
  bgImg,
  urls = Array.prototype.map
    .call(
      document.querySelectorAll('img, [style*="background-image"]'),
      getUrls
    ).reduce(reduceArray, []),
  frameChildren = Array.prototype.map
    .call(
      document.querySelectorAll('frame'),
      function (el, i) {
        return Array.prototype.map
          .call(
            window.frames[i].document.querySelectorAll('img, [style*="background-image"]'),
            getUrls
          ).reduce(reduceArray, []);
      }
    ).reduce(reduceArray, []),
  innerUrls = [];
  console.log(urls);
for (var i = 0, len = frameChildren.length; i < len; i++) {
  var frameChild = frameChildren[i];
  for (var j = 0, len2 = frameChild.length; j < len2; j++) {
    innerUrls.push(frameChild[j]);
  }
}

chrome.runtime.sendMessage({
  action: 'getImages',
  resources: urls,
});

function getUrls(el) {
  //console.log('el',el);
  bgImg = el.style.backgroundImage;
  //console.log('bgImg:',bgImg);
  if (bgImg) {
    src = bgImg.replace(/^\s?url\((\"|\')/, '').replace(/(\"|\')\)\s?$/, '')
    bgImg = '';
  } else {
    src = el.src;
  }
  //console.log('src',src)

  if (src.match(/^data\:image|\/\//)) {
    return src;
  }
  return document.location.origin.replace(/\/$/, '') + '/' + src;
}

function reduceArray(a, b) {
  if (a.indexOf(b) < 0) {
    a.push(b);
  }

  return a;
}

