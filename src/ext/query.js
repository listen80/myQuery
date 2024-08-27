const { each } = require("./array");

function AnalysisCss(css) {
  var cssObj = [];
  var matched = css.match(
    /^(\w+)?((?:\.\w+){0,})(\#\w+)?(\[\s*\w+\s*(?:=\s*\w+\s*)?\])?(:\w+)?$/
  );
  if (matched) {
    matched.splice(0, 1);
    cssObj[0] = matched[0] || "*";
    if (matched[1]) {
      cssObj[1] = map(matched[1].substr(1).split("."), function (className) {
        return new RegExp("(?:\\s|^)" + className + "(?:\\s|$)");
      });
    }
    if (matched[2]) {
      cssObj[2] = { id: matched[2].substr(1) };
    }
    if (matched[3]) {
      cssObj[2] = cssObj[2] || {};
      var attributes = matched[3]
        .match(/\[\s*(\w+)\s*=\s*(\w+)\s*?\]/)
        .slice(1);
      cssObj[2][attributes[0]] = attributes[1];
    }
    if (matched[4]) {
      cssObj[3] = matched[4].substr(1);
    }
  } else {
    throw new Error("unknow css selector");
  }
  return cssObj;
}

function checkElementCss(element, css) {
  if (css[0] !== "*" && css[0] !== element.nodeName.toLowerCase()) return;
  if (
    css[1] &&
    !every(css[1], function (className) {
      return className.test(element.className);
    })
  ) {
    return;
  }
  if (
    css[2] &&
    !every(css[2], function (attrValue, attrName) {
      return attrValue == null
        ? element.hasAttribute(attrName)
        : element.getAttribute(attrName) === attrValue;
    })
  ) {
    return;
  }
  if (css[3] && !(element[css[3]] === true)) return;
  return true;
}

function checkElementCssChain(element, css, last) {
  var i = 0,
    len = css.length;
  while (element && element !== last) {
    if (checkElementCss(element, css[i])) {
      if (++i === len) {
        return true;
      }
    } else {
      if (i === 0) {
        return false;
      }
    }
    element = element.parentNode;
  }
}

function arrayIndex(arr, value) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === value) {
      return i;
    }
  }
  return -1;
}

function querySelectorAll(css, parents) {
  var elements = [];
  parents = parents || [document];
  if (document.querySelectorAll) {
    each(parents, function (parent) {
      each(parent.querySelectorAll(css), function (element) {
        elements.push(element);
      });
    });
  } else {
    each(css.split(","), function (css) {
      css = trim(css).split(/\s+/).reverse();
      for (var i = 0, len = css.length; i < len; i++) {
        css[i] = AnalysisCss(css[i]);
      }
      each(parents, function (parent) {
        var all = parent.getElementsByTagName(css[0][0]);
        for (var x = 0, len = all.length; x < len; x++) {
          var now = all[x];
          arrayIndex(elements, now) === -1 &&
            checkElementCssChain(now, css, parent) &&
            elements.push(now);
        }
      });
    });
  }
  return elements;
}

module.exports = { querySelectorAll };
