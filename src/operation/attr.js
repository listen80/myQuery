module.exports = {

    attr: function (attrName, attrValue) {
        return attrName == null
            ? this[0].attributes
            : attrValue == null
                ? this[0].getAttribute(attrName)
                : this.each(function (element) {
                    element.setAttribute(attrName, attrValue);
                });
    },
    removeAttr: function (attrName) {
        return this.each(function (element) {
            element.removeAttribute(attrName);
        });
    },
    prop: function (propName, propValue) {
        return propValue == null
            ? this[0][propName]
            : (this[0][propName] = propValue);
    },
    val: function (value) {
        return value == null
            ? this[0].value
            : this.each(function (element) {
                element.value = value;
            });
    },
}