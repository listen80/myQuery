(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.$ = factory());
})(this, (function () { 'use strict';

  function each$2(obj, fn) {
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
  function map$2(obj, fn) {
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
  function every$1(obj, fn) {
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
  var array = {
    map: map$2,
    filter,
    each: each$2,
    every: every$1,
    some
  };

  function addEventListener(element, type, back) {
    element.addEventListener(type, back);
  }
  var bind = {
    on: function (type, css, callback) {
      var simple;
      if (typeof css === "function") {
        simple = true;
        callback = css;
      } else {
        css = trim(css).split(/\s+/).reverse();
        for (var i = 0, len = css.length; i < len; i++) {
          css[i] = AnalysisCss(css[i]);
        }
      }
      return this.each(function (element) {
        addEventListener(element, type, function (e) {
          if (simple) {
            callback.call(element, e);
          } else {
            e = e || event;
            target = e.target || e.srcElement;
            while (target && element !== target) {
              checkElementCssChain(target, css, element) && callback.call(element, e, target);
              target = target.parentNode;
            }
          }
        });
      });
    }
  };

  const {
    each: each$1,
    map: map$1
  } = array;
  const on = bind;
  function HTMLCollection$1(source) {
    for (var x = 0, len = source.length; x < len; x++) {
      this[x] = source[x];
    }
    this.length = len;
    return this;
  }
  const arrPrototype = Array.prototype;
  HTMLCollection$1.prototype = {
    pop: arrPrototype.pop,
    push: arrPrototype.push,
    sort: arrPrototype.sort,
    splice: arrPrototype.splice,
    slice: arrPrototype.slice,
    each: function (fn) {
      return each$1(this, fn);
    },
    map: function (fn) {
      return map$1(this, fn);
    },
    empty: function () {
      return this.each(function (element) {
        element.innerHTML = "";
      });
    },
    remove: function () {
      return this.each(function (element) {
        element.parentNode.removeChild(element);
      });
    },
    css: function (cssName, cssValue) {
      var cssObj = {};
      if (cssName == null) {
        return this;
      } else if (typeof cssName === "object") {
        cssObj = cssName;
      } else if (!cssValue) {
        return this[0].style[cssName];
      } else {
        cssObj[cssName] = cssValue;
      }
      return this.each(function (element) {
        each$1(cssObj, function (cssValue, cssName) {
          element.style[cssName.replace(/-([a-z])/g, function (match, letter) {
            return letter.toUpperCase();
          })] = cssValue;
        });
      });
    },
    find: function (selector) {
      return new HTMLCollection$1(querySelectorAll(selector, this));
    },
    eq: function (index) {
      index = index < 0 ? index + this.length : index;
      return new HTMLCollection$1([this[index]]);
    },
    cssText: function (cssText) {
      return this.each(function (element) {
        cssText == null ? element.style.cssText = "" : element.style.cssText += ";" + cssText;
      });
    },
    then: function (fn) {
      fn && fn.call(this, this);
      return this;
    },
    children: function () {
      var collect = [];
      this.each(function (parent) {
        if (parent.children) {
          $.each(parent.children, function (child) {
            collect.push(child);
          });
        }
      });
      return new HTMLCollection$1(collect);
    },
    next: function () {
      var collect = [];
      this.each(function (element) {
        while (element.nextSibling) {
          if (element.nextSibling.nodeType === 1) {
            collect.push(element.nextSibling);
            break;
          }
          element = element.nextSibling;
        }
      });
      return new HTMLCollection$1(collect);
    },
    index: function () {
      var el = this[0];
      var children = el.parentNode.children;
      for (var i = 0, len = children.length; i < len; i++) {
        if (el === children[i]) {
          return i;
        }
      }
      return -1;
    },
    parent: function () {
      var collect = [];
      this.each(function (element) {
        if (element.parentNode) {
          collect.push(element.parentNode);
        }
      });
      return new HTMLCollection$1(collect);
    },
    ...on
  };
  var Collection = {
    HTMLCollection: HTMLCollection$1
  };

  const {
    each
  } = array;
  function AnalysisCss$1(css) {
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
        cssObj[2] = {
          id: matched[2].substr(1)
        };
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
    if (css[1] && !every(css[1], function (className) {
      return className.test(element.className);
    })) {
      return;
    }
    if (css[2] && !every(css[2], function (attrValue, attrName) {
      return attrValue == null ? element.hasAttribute(attrName) : element.getAttribute(attrName) === attrValue;
    })) {
      return;
    }
    if (css[3] && !(element[css[3]] === true)) return;
    return true;
  }
  function checkElementCssChain$1(element, css, last) {
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
  function querySelectorAll$2(css, parents) {
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
          css[i] = AnalysisCss$1(css[i]);
        }
        each(parents, function (parent) {
          var all = parent.getElementsByTagName(css[0][0]);
          for (var x = 0, len = all.length; x < len; x++) {
            var now = all[x];
            arrayIndex(elements, now) === -1 && checkElementCssChain$1(now, css, parent) && elements.push(now);
          }
        });
      });
    }
    return elements;
  }
  var query = {
    querySelectorAll: querySelectorAll$2
  };

  const {
    HTMLCollection
  } = Collection;
  const {
    querySelectorAll: querySelectorAll$1
  } = query;
  function $$1(selector) {
    if (selector == null) {
      selector = [];
    } else if (selector[0] === "<") {
      selector = parseHTML(selector);
    } else if (typeof selector === "object") {
      if (selector instanceof Node) {
        selector = [selector];
      } else if (selector instanceof HTMLCollection) {
        return selector;
      } else {
        throw "$: error selector" + selector;
      }
    } else if (typeof selector === "string") {
      selector = querySelectorAll$1(selector) || [];
    } else if (typeof selector === "function") {
      return document.readyState === "complete" ? selector($$1) : $$1(document).on("DOMContentLoaded", selector);
    }
    return new HTMLCollection(selector);
  }
  var src = $$1;

  return src;

}));
//# sourceMappingURL=myQuery.js.map
