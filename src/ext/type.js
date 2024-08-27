function type(obj) {
    return Object.prototype.toString
      .call(obj)
      .replace(/^\[object |\]$/g, "")
      .toLowerCase();
  }
  
  function isNull(obj) {
    return obj === null;
  }
  
  function isUndef(obj) {
    return obj === undefined;
  }
  