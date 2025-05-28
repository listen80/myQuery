module.exports = {
    html: function (html) {
        return html == null
            ? this.map(function (element) {
                return element.innerHTML;
            }) + ""
            : this.each(function (element) {
                element.innerHTML = html;
            });
    },
    text: function (text) {
        return text == null
            ? this.map(function (element) {
                return element.textContent;
            }).join('')
            : this.each(function (element) {
                element.textContent = text;
            });
    }
}