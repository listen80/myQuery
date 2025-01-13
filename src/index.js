const { HTMLCollection } = require("./base/htmlCollection");
const { querySelectorAll } = require("./dom/query");
const { type } = require('./utils/object');

function $(selector) {
  if (selector == null) {
    selector = [];
  } else if (selector[0] === "<") {
    selector = parseHTML(selector);
  } else if (type(selector) === "Object") {
    if (selector instanceof Element) {
      selector = [selector];
    } else if (selector instanceof HTMLCollection) {
      return selector
    } else {
      throw "$: error selector" + selector
    }
  } else if (typeof selector === "string") {
    selector = querySelectorAll(selector) || [];
  } else if (typeof selector === "function") {
    return document.readyState === "complete"
      ? selector($)
      : $(document).on("DOMContentLoaded", selector);
  }
  return new HTMLCollection(selector);
}

module.exports = $;
