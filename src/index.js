const { HTMLCollection } = require("./htmlCollection");
const { querySelectorAll } = require("./ext/query");

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
    return document.readyState === "complete"
      ? selector($)
      : $(document).on("DOMContentLoaded", selector);
  }
  return new HTMLCollection(selector);
}

module.exports = $;
