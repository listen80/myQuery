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
