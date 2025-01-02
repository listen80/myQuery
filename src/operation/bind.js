module.exports = {
    on: function (type, css, callback) {
        var simple;
        if (typeof css === "function") {
            simple = true;
            callback = css;
        } else {
            css = trim(css).split(/\s+/).reverse();
            for (var i = 0, len = css.length; i < len; i++) {
                css[i] = AnalysisCss(css[i]);
            }
        }
        return this.each(function (element) {
            addEventListener(element, type, function (e) {
                if (simple) {
                    callback.call(element, e);
                } else {
                    e = e || event;
                    target = e.target || e.srcElement;
                    while (target && element !== target) {
                        checkElementCssChain(target, css, element) &&
                            callback.call(element, e, target);
                        target = target.parentNode;
                    }
                }
            });
        });
    },
}