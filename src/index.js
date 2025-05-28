const array = require("./utils/array");
const object = require("./utils/object");
const string = require("./utils/string");
const type = require("./utils/type");

const ajax = require("./ext/func/ajax");
const cookie = require("./ext/func/cookie");
const { myQuery } = require("./myQuery");

Object.assign(myQuery, array, object, string, type, ajax, cookie, {
  version: "0.0.1",
  noConflict: function () {
    var old = window.$;
    window.$ = $;
    return old;
  },
})

module.exports = myQuery;
