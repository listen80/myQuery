function each(obj, fn) {
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

function map(obj, fn) {
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

function every(obj, fn) {
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

module.exports = {
  map,
  filter,
  each,
  every,
  some,
};
