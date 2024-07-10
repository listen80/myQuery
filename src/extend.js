function callback() {
    this.lists = [];
}
callback.prototype.fire = function(data) {
    each(this.lists, function(callback) {
        callback(data);
    })
}
callback.prototype.on = function(callback) {
    this.lists.push(callback);
}
callback.prototype.off = function(callback) {
    callback ? each(this.lists, function(argument, index) {
        if (callback === argument) {
            this.lists.splice(index, 1);
            return false;
        }
    }) : (this.lists = []);
}