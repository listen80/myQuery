
function extend(src, obj, deep) {
    each(obj, function (value, key) {
      if (deep && typeof value === "object") {
        src[key] = src[key] || {};
        extend(src[key], value, deep);
      } else {
        src[key] = value;
      }
    });
    return src;
  }