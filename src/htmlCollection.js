function HTMLCollection(source) {
  for (var x = 0, len = source.length; x < len; x++) {
    this[x] = source[x];
  }
  this.length = len;
  return this;
}

HTMLCollection.prototype = {
  pop: [].pop,
  push: [].push,
  sort: [].sort,
  splice: [].splice,
  slice: [].slice,
  each: function (fn) {
    return each(this, fn);
  },
  map: function (fn) {
    return map(this, fn);
  },
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
  },
  html: function (html) {
    return html == null
      ? this.map(function (element) {
          return element.innerHTML;
        }) + ""
      : this.each(function (element) {
          element.innerHTML = html;
        });
  },
  attr: function (attrName, attrValue) {
    return attrName == null
      ? this[0].attributes
      : attrValue == null
      ? this[0].getAttribute(attrName)
      : this.each(function (element) {
          element.setAttribute(attrName, attrValue);
        });
  },
  removeAttr: function (attrName) {
    return this.each(function (element) {
      element.removeAttribute(attrName);
    });
  },
  prop: function (propName, propValue) {
    return propValue == null ? this[0][propName] : (this[0][propName] = propValue);
  },
  val: function (value) {
    return value == null
      ? this[0].value
      : this.each(function (element) {
          element.value = value;
        });
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
      each(cssObj, function (cssValue, cssName) {
        element.style[
          cssName.replace(/-([a-z])/g, function (match, letter) {
            return letter.toUpperCase();
          })
        ] = cssValue;
      });
    });
  },
  find: function (selector) {
    return new HTMLCollection(querySelectorAll(selector, this));
  },
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
  },
  before: function (text) {
    if (typeof text === "object") {
    } else {
    }
    return this.each(function (element) {
      element.parentNode.insertBefore(createTextNode(text), element);
    });
  },
  after: function (text) {
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
  eq: function (index) {
    index = index < 0 ? index + this.length : index;
    return new HTMLCollection([this[index]]);
  },
  cssText: function (cssText) {
    return this.each(function (element) {
      cssText == null ? (element.style.cssText = "") : (element.style.cssText += ";" + cssText);
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
  },
};
