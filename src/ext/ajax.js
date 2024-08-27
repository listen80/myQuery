
function ajax(url) {
    this.url = url;
}
ajax.prototype.data = function(data) {
    this.data = data;
    return this;
}
ajax.prototype.header = function(header) {
    this.header = header;
    return this;
}
ajax.prototype.then = function(callback) {
    this.callback = callback;
    var self = this;
    setTimeout(function(argument) {
        self.callback.call(this)
    })
    return this;
}

module.exports = ajax
