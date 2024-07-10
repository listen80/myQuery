function AnalysisCss(css) {
  var cssObj = [];
  var matched = css.match(/^(\w+)?((?:\.\w+){0,})(\#\w+)?(\[\s*\w+\s*(?:=\s*\w+\s*)?\])?(:\w+)?$/);
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
      var attributes = matched[3].match(/\[\s*(\w+)\s*=\s*(\w+)\s*?\]/).slice(1);
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
      return attrValue == null ? element.hasAttribute(attrName) : element.getAttribute(attrName) === attrValue;
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
  if (false && document.querySelectorAll) {
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
          arrayIndex(elements, now) === -1 && checkElementCssChain(now, css, parent) && elements.push(now);
        }
      });
    });
  }
  return elements;
}

function $(selector) {
  if (selector == null) {
    selector = [];
  } else if (selector[0] === "<") {
    selector = parseHTML(selector);
  } else if (typeof selector === "object") {
    selector = [selector];
  } else if (typeof selector === "string") {
    selector = querySelectorAll(selector);
  } else if (typeof selector === "function") {
    return document.readyState === "complete" ? selector($) : $(document).on("DOMContentLoaded", selector);
  }
  return new HTMLCollection(selector);
}

function each(obj, fn) {
  if (typeof obj.length === "number") {
    for (var i = 0, len = obj.length; i < len; i++) {
      if (fn.call(obj[i], obj[i], i, obj) === false) {
        break;
      }
    }
  } else {
    for (var i in obj) {
      if (obj.hasOwnProperty(i) && fn.call(obj[i], obj[i], i, obj) === false) {
        break;
      }
    }
  }
  return obj;
}

function map(obj, fn) {
  var clone = {};
  for (var x in obj) {
    if (obj.hasOwnProperty(x)) {
      clone[x] = fn.call(obj[x], obj[x], x, obj);
    }
  }
  return clone;
}

function filter(obj, fn) {
  var clone = [];
  for (var x in obj) {
    if (obj.hasOwnProperty(x)) {
      fn.call(obj[x], obj[x], x, obj) && clone.push(obj[x]);
    }
  }
  return clone;
}

function every(obj, fn) {
  for (var x in obj) {
    if (obj.hasOwnProperty(x) && fn.call(obj[x], obj[x], x, obj) === false) {
      return false;
    }
  }
  return true;
}

function some(obj, fn) {
  for (var x in obj) {
    if (obj.hasOwnProperty(x) && fn.call(obj[x], obj[x], x, obj) === true) {
      return true;
    }
  }
  return false;
}

function type(obj) {
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object |\]$/g, "")
    .toLowerCase();
}

function isNull(obj) {
  return obj === null;
}

function isUndef(obj) {
  return obj === undefined;
}

function json(obj) {
  if (typeof obj === "object") {
    return JSON.stringify(obj);
  } else if (typeof obj === "string") {
    return JSON.parse(obj);
  } else {
    return obj;
  }
}

function addEventListener(element, type, back) {
  element.addEventListener(type, back);
}

function trim(str) {
  return (str + "").replace(/^\s+|\s+$/g, "");
}

function parseHTML(html) {
  var element = document.createElement("div");
  element.innerHTML = html;
  return element.children;
}

$.parseHTML = function (html, wrap) {
  var div = document.createElement("div");
  div.innerHTML = html;
  var fragment = document.createDocumentFragment();
  if (wrap) {
    while (div.firstChild) {
      fragment.appendChild(div.firstChild);
    }
    return fragment;
  }
  console.log(div);
  return div.childNodes;
};

function createTextNode(text) {
  var textNode = document.createTextNode("text");
  textNode.nodeValue = text;
  return textNode;
}

$.each = each;
$.type = type;
$.json = json;

function get(data) {
  var arr = [];
  each(data, function (value, key) {
    find(value, key);
  });

  function find(data, str) {
    var type = $.type(data);
    if (type === "object") {
      each(data, function (value, key) {
        find(value, str + "[" + key + "]");
      });
    } else if (type === "array") {
      each(data, function (value, key) {
        var type = $.type(value);
        if (type !== "object" && type !== "array") {
          arr.push(str + "[]=" + value);
        } else {
          find(value, str + "[" + key + "]");
        }
      });
    } else {
      arr.push(encodeURIComponent(str) + "=" + encodeURIComponent(data));
    }
  }
  return arr.join("&");
}

var s = get({ a: 3, b: 444, c: { d: 33, e: [{ b: "&dds?=dd" }] } });

function query(search) {
  var data = {};
  search = search || location.search;
  if (search[0] === "?") {
    search = search.substr(1);
  }
  each(search.split("&"), function (value) {
    if (value) {
      value = value.split("=", 2);
      data[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
    }
  });
  each(data, function (value, key) {
    key.replace(/\w+(\[(\w+)\])*/, function () {
      console.log(arguments);
    });
  });
  return data;
}

function extend(src, obj, deep) {
  each(obj, function (value, key) {
    if (deep && typeof value === "object") {
      src[key] = src[key] || {};
      extend(src[key], value, deep);
    } else {
      src[key] = value;
    }
  });
  return src;
}

$.extend = function () {
  var out = {};
  each(arguments, function (argument) {
    extend(out, argument);
  });
  return out;
};

module.exports = $