module.exports = {
    hasClass: function (className) {
        return className == null
            ? !!this[0].className
            : this[0]
                ? RegExp("\\b" + className + "\\b").test(this[0].className)
                : false;
    },
    addClass: function (className) {
        var reg = RegExp("\\b" + className + "\\b");
        return this.each(function (element) {
            if (!reg.test(element.className)) {
                element.className = trim(
                    (element.className + " " + className).replace(/\s+/, " ")
                );
            }
        });
    },
    removeClass: function (className) {
        if (null == className) {
            return this.each(function (element) {
                element.className = "";
            });
        } else {
            var reg = RegExp("\\b" + className + "\\b");
            return this.each(function (element) {
                element.className = trim(
                    element.className.replace(reg, "").trim().replace(/\s+/, " ")
                );
            });
        }
    },
}