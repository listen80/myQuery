module.exports = {
    before: function (text) {
        if (typeof text === "object") {
        } else {
        }
        return this.each(function (element) {
            element.parentNode.insertBefore(createTextNode(text), element);
        });
    },
    after: function (text) {
        return this.each(function (element) {
            element.parentNode.insertBefore(
                createTextNode(text),
                element.nextSibling
            );
        });
    },
    append: function (text) {
        var element = this[0];
        text.each(function (e) {
            element.insertBefore(e, null);
        });
        // return this.each(function(element) {
        //     element.insertBefore(createTextNode(text), null);
        // })

        return this;
    },
    prepend: function (text) {
        return this.each(function (element) {
            element.insertBefore(createTextNode(text), element.firstChild);
        });
    },
    appendTo: function (cssSelector) {
        var dist = $(cssSelector)[0];
        if (dist) {
            each(this, function (element) {
                dist.appendChild(element);
            });
        }

        return this;
    },
}