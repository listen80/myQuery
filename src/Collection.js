
const base = require("./chain/base");
const on = require("./chain/bind");
const attr = require("./chain/attr")
const klass = require("./chain/klass")
const insert = require("./chain/insert")
const html = require("./chain/html")
function HTMLCollection(source) {
  for (var x = 0, len = source.length; x < len; x++) {
    this[x] = source[x];
  }
  this.length = len;
  return this;
}

HTMLCollection.prototype = {
  ...base,
  ...on,
  ...attr,
  ...klass,
  ...insert,
  ...html,
};


module.exports = { HTMLCollection };
