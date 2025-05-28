const { HTMLCollection } = require("./Collection");
const { querySelectorAll } = require("./utils/query");

function myQuery(selector) {
    if (selector == null) {
        selector = [];
    } else if (selector[0] === "<") {
        selector = parseHTML(selector);
    } else if (typeof selector === "object") {
        if (selector instanceof Node) {
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

module.exports = { myQuery };