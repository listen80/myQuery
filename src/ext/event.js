function event() {
  this.lists = [];
}
event.prototype.fire = function (data) {
  each(this.lists, function (callback) {
    callback(data);
  });
};
event.prototype.on = function (callback) {
  this.lists.push(callback);
};
event.prototype.off = function (callback) {
  callback
    ? each(this.lists, function (argument, index) {
        if (callback === argument) {
          this.lists.splice(index, 1);
          return false;
        }
      })
    : (this.lists = []);
};

module.exports = event;
