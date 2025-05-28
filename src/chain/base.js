const arrPrototype = Array.prototype;
const { each, map } = require("../utils/array");
module.exports = {
    pop: arrPrototype.pop,
    push: arrPrototype.push,
    sort: arrPrototype.sort,
    splice: arrPrototype.splice,
    slice: arrPrototype.slice,
    each: function (fn) {
        return each(this, fn);
    },
    map: function (fn) {
        return map(this, fn);
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
    eq: function (index) {
        index = index < 0 ? index + this.length : index;
        return new HTMLCollection([this[index]]);
    },
    cssText: function (cssText) {
        return this.each(function (element) {
            cssText == null
                ? (element.style.cssText = "")
                : (element.style.cssText += ";" + cssText);
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
}