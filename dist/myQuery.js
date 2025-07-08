(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.$ = factory());
})(this, (function () { 'use strict';

  function each$4(obj, fn) {
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
  var array$1 = {
    map: map$2,
    filter,
    each: each$4,
    every: every$1,
    some
  };

  const {
    each: each$3
  } = array$1;
  function extend(src, obj, deep) {
    each$3(obj, function (value, key) {
      if (deep && typeof value === "object") {
        src[key] = src[key] || {};
        extend(src[key], value, deep);
      } else {
        src[key] = value;
      }
    });
    return src;
  }
  var object$1 = {
    extend
  };

  function trim$1(str) {
    return (str + "").replace(/^\s+|\s+$/g, "");
  }
  var string$1 = {
    trim: trim$1
  };

  function type$1(obj) {
    return Object.prototype.toString.call(obj).replace(/^\[object |\]$/g, "").toLowerCase();
  }
  function isNull(obj) {
    return obj === null;
  }
  function isUndef(obj) {
    return obj === undefined;
  }
  var type_1 = {
    type: type$1,
    isNull,
    isUndef
  };

  // 手写 Promise 实现
  class Deferred$1 {
    constructor(executor) {
      // 初始化状态为 pending
      this.state = 'pending';
      // 存储成功的值
      this.value = undefined;
      // 存储失败的原因
      this.reason = undefined;
      // 存储成功的回调函数数组
      this.onResolvedCallbacks = [];
      // 存储失败的回调函数数组
      this.onRejectedCallbacks = [];
      const resolve = value => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          // 依次执行成功回调
          this.onResolvedCallbacks.forEach(fn => fn());
        }
      };
      const reject = reason => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.reason = reason;
          // 依次执行失败回调
          this.onRejectedCallbacks.forEach(fn => fn());
        }
      };
      try {
        // 执行 executor 函数，并传入 resolve 和 reject
        executor(resolve, reject);
      } catch (error) {
        // 捕获异常并调用 reject
        reject(error);
      }
    }
    then(onFulfilled, onRejected) {
      // 处理 onFulfilled 和 onRejected 为可选参数
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
      onRejected = typeof onRejected === 'function' ? onRejected : err => {
        throw err;
      };
      let newPromise = new Deferred$1((resolve, reject) => {
        if (this.state === 'fulfilled') {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }
        if (this.state === 'rejected') {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }
        if (this.state === 'pending') {
          this.onResolvedCallbacks.push(() => {
            setTimeout(() => {
              try {
                let x = onFulfilled(this.value);
                resolvePromise(newPromise, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
          this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              try {
                let x = onRejected(this.reason);
                resolvePromise(newPromise, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
        }
      });
      return newPromise;
    }
    catch(onRejected) {
      return this.then(null, onRejected);
    }
  }

  // 解析 then 方法返回值的函数
  function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }
    let called;
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        let then = x.then;
        if (typeof then === 'function') {
          then.call(x, y => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          }, r => {
            if (called) return;
            called = true;
            reject(r);
          });
        } else {
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  // 导出 Deferred
  var deferred = {
    Deferred: Deferred$1
  };

  const {
    Deferred
  } = deferred;
  function ajax$1(options) {
    // 检查必要的参数是否存在
    const deferred = new Deferred(function (resolve, reject) {
      if (!options.url) {
        throw new Error('URL is required for ajax request.');
      }
      var xhr = new XMLHttpRequest();
      var method = options.method || 'GET';
      var url = options.url;
      var async = options.async !== undefined ? options.async : true;
      var data = options.data || null;
      var successCallback = options.success || function () {};
      var errorCallback = options.error || function () {};
      var contentType = options.contentType || 'application/x-www-form-urlencoded';
      xhr.open(method, url, async);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
            successCallback(xhr.responseText);
          } else {
            reject(xhr.statusText);
            errorCallback(xhr.statusText);
          }
        }
      };
      if (data) {
        if (contentType === 'application/json') {
          xhr.send(JSON.stringify(data));
        } else {
          var encodedData = '';
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              if (encodedData !== '') {
                encodedData += '&';
              }
              encodedData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }
          }
          xhr.send(encodedData);
        }
      } else {
        xhr.send();
      }
    });
    return deferred;
  }
  function get(url, data) {
    return ajax$1({
      method: "GET",
      url,
      data
    });
  }
  var ajax_1 = {
    ajax: ajax$1,
    get
  };

  function cookie$1() {
    const args = Array.from(arguments);
    switch (args.length) {
      case 2:
        setCookie(args[0], args[1]);
        break;
      case 3:
        setCookie(args[0], args[1], args[2]);
        break;
      case 1:
        const getResult = getCookie(args[0]);
        if (getResult !== null) {
          return getResult;
        } else {
          deleteCookie(args[0]);
        }
        break;
      default:
        console.error('传入的参数数量不支持，请检查。');
    }
  }
  /**
   * 设置cookie
   * @param {string} name - cookie的名称
   * @param {string} value - cookie的值
   * @param {number} [days] - cookie的过期天数，可选参数
   */
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  /**
   * 获取cookie
   * @param {string} name - cookie的名称
   * @returns {string|null} - 返回cookie的值，如果不存在则返回null
   */
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /**
   * 删除cookie
   * @param {string} name - cookie的名称
   */
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
  }
  var cookie_1 = {
    cookie: cookie$1
  };

  const arrPrototype = Array.prototype;
  const {
    each: each$2,
    map: map$1
  } = array$1;
  var base$1 = {
    pop: arrPrototype.pop,
    push: arrPrototype.push,
    sort: arrPrototype.sort,
    splice: arrPrototype.splice,
    slice: arrPrototype.slice,
    each: function (fn) {
      return each$2(this, fn);
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
    hide: function () {
      return this.each(function (element) {
        element.style.display = "none";
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
        each$2(cssObj, function (cssValue, cssName) {
          element.style[cssName.replace(/-([a-z])/g, function (match, letter) {
            return letter.toUpperCase();
          })] = cssValue;
        });
      });
    },
    find: function (selector) {
      return new HTMLCollection(querySelectorAll(selector, this));
    },
    eq: function (index) {
      index = index < 0 ? index + this.length : index;
      return new HTMLCollection([this[index]]);
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
      return new HTMLCollection(collect);
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
      return new HTMLCollection(collect);
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
      return new HTMLCollection(collect);
    }
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

  var attr$1 = {
    attr: function (attrName, attrValue) {
      return attrName == null ? this[0].attributes : attrValue == null ? this[0].getAttribute(attrName) : this.each(function (element) {
        element.setAttribute(attrName, attrValue);
      });
    },
    removeAttr: function (attrName) {
      return this.each(function (element) {
        element.removeAttribute(attrName);
      });
    },
    prop: function (propName, propValue) {
      return propValue == null ? this[0][propName] : this[0][propName] = propValue;
    },
    val: function (value) {
      return value == null ? this[0].value : this.each(function (element) {
        element.value = value;
      });
    }
  };

  var klass$1 = {
    hasClass: function (className) {
      return className == null ? !!this[0].className : this[0] ? RegExp("\\b" + className + "\\b").test(this[0].className) : false;
    },
    addClass: function (className) {
      var reg = RegExp("\\b" + className + "\\b");
      return this.each(function (element) {
        if (!reg.test(element.className)) {
          element.className = trim((element.className + " " + className).replace(/\s+/, " "));
        }
      });
    },
    removeClass: function (className) {
      if (null == className) {
        return this.each(function (element) {
          element.className = "";
        });
      } else {
        var reg = RegExp("\\b" + className + "\\b");
        return this.each(function (element) {
          element.className = trim(element.className.replace(reg, "").trim().replace(/\s+/, " "));
        });
      }
    }
  };

  const createTextNode = document.createTextNode;
  var insert$1 = {
    before: function (text) {
      return this.each(function (element) {
        element.parentNode.insertBefore(createTextNode(text), element);
      });
    },
    after: function (text) {
      return this.each(function (element) {
        element.parentNode.insertBefore(createTextNode(text), element.nextSibling);
      });
    },
    insertAfter: function (text) {
      return this.each(function (element) {
        element.parentNode.insertBefore(createTextNode(text), element.nextSibling);
      });
    },
    append: function (text) {
      var element = this[0];
      text.each(function (e) {
        element.insertBefore(e, null);
      });
      // return this.each(function(element) {
      //     element.insertBefore(createTextNode(text), null);
      // })

      return this;
    },
    prepend: function (text) {
      return this.each(function (element) {
        element.insertBefore(createTextNode(text), element.firstChild);
      });
    },
    appendTo: function (cssSelector) {
      var dist = $(cssSelector)[0];
      if (dist) {
        each(this, function (element) {
          dist.appendChild(element);
        });
      }
      return this;
    }
  };

  var html$2 = {
    html: function (html) {
      return html == null ? this.map(function (element) {
        return element.innerHTML;
      }) + "" : this.each(function (element) {
        element.innerHTML = html;
      });
    },
    text: function (text) {
      return text == null ? this.map(function (element) {
        return element.textContent;
      }).join('') : this.each(function (element) {
        element.textContent = text;
      });
    }
  };

  const base = base$1;
  const on = bind;
  const attr = attr$1;
  const klass = klass$1;
  const insert = insert$1;
  const html$1 = html$2;
  function HTMLCollection$3(source) {
    for (var x = 0, len = source.length; x < len; x++) {
      this[x] = source[x];
    }
    this.length = len;
    return this;
  }
  HTMLCollection$3.prototype = {
    ...base,
    ...on,
    ...attr,
    ...klass,
    ...insert,
    ...html$1
  };
  var Collection = {
    HTMLCollection: HTMLCollection$3
  };

  const {
    each: each$1
  } = array$1;
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
      each$1(parents, function (parent) {
        each$1(parent.querySelectorAll(css), function (element) {
          elements.push(element);
        });
      });
    } else {
      each$1(css.split(","), function (css) {
        css = trim(css).split(/\s+/).reverse();
        for (var i = 0, len = css.length; i < len; i++) {
          css[i] = AnalysisCss$1(css[i]);
        }
        each$1(parents, function (parent) {
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

  function parseHTML$1(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.children;
  }
  var html = {
    parseHTML: parseHTML$1
  };

  const {
    HTMLCollection: HTMLCollection$2
  } = Collection;
  const {
    querySelectorAll: querySelectorAll$1
  } = query;
  const {
    parseHTML
  } = html;
  function myQuery$1(selector) {
    if (selector == null) {
      selector = [];
    } else if (selector[0] === "<") {
      selector = parseHTML(selector);
    } else if (typeof selector === "object") {
      if (selector instanceof Node) {
        selector = [selector];
      } else if (selector instanceof HTMLCollection$2) {
        return selector;
      } else {
        throw "$: error selector" + selector;
      }
    } else if (typeof selector === "string") {
      selector = querySelectorAll$1(selector) || [];
    } else if (typeof selector === "function") {
      return document.readyState === "complete" ? selector($) : $(document).on("DOMContentLoaded", selector);
    }
    return new HTMLCollection$2(selector);
  }
  var myQuery_1 = {
    myQuery: myQuery$1
  };

  const array = array$1;
  const object = object$1;
  const string = string$1;
  const type = type_1;
  const ajax = ajax_1;
  const cookie = cookie_1;
  const {
    myQuery
  } = myQuery_1;
  const {
    HTMLCollection: HTMLCollection$1
  } = Collection;
  Object.assign(myQuery, array, object, string, type, ajax, cookie, {
    version: "0.0.1",
    noConflict: function () {
      var old = window.$;
      window.$ = $;
      return old;
    },
    fn: HTMLCollection$1.prototype
  });
  var src = myQuery;

  return src;

}));
//# sourceMappingURL=myQuery.js.map
