function EventBus() {
  this.lists = [];
}

EventBus.prototype.fire = function (data) {
  each(this.lists, function (callback) {
    callback(data);
  });
};

EventBus.prototype.on = function (callback) {
  this.lists.push(callback);
};

EventBus.prototype.off = function (callback) {
  callback
    ? each(this.lists, function (argument, index) {
      if (callback === argument) {
        this.lists.splice(index, 1);
        return false;
      }
    })
    : (this.lists = []);
};

module.exports = { EventBus };
