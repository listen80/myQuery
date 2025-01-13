
function trim(str) {
  return (str + "").replace(/^\s+|\s+$/g, "");
}

module.exports = {
  trim
}