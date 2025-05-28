const { Deferred } = require("../klass/deferred");

function encodeQuery(search) {
    var data = {};
    search = search || location.search;
    if (search[0] === "?") {
        search = search.substr(1);
    }
    each(search.split("&"), function (value) {
        if (value) {
            value = value.split("=", 2);
            data[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
        }
    });
    each(data, function (value, key) {
        key.replace(/\w+(\[(\w+)\])*/, function () {
            console.log(arguments);
        });
    });
    return data;
}


function ajax(options) {
    // 检查必要的参数是否存在
    const deferred = new Deferred(function (resolve, reject) {
        if (!options.url) {
            throw new Error('URL is required for ajax request.');
        }
        var xhr = new XMLHttpRequest();
        var method = options.method || 'GET';
        var url = options.url;
        var async = options.async !== undefined ? options.async : true;
        var data = options.data || null;
        var successCallback = options.success || function () { };
        var errorCallback = options.error || function () { };
        var contentType = options.contentType || 'application/x-www-form-urlencoded';

        xhr.open(method, url, async);
        xhr.setRequestHeader('Content-Type', contentType);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                    successCallback(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                    errorCallback(xhr.statusText);
                }
            }
        };

        if (data) {
            if (contentType === 'application/json') {
                xhr.send(JSON.stringify(data));
            } else {
                var encodedData = '';
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (encodedData !== '') {
                            encodedData += '&';
                        }
                        encodedData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                    }
                }
                xhr.send(encodedData);
            }
        } else {
            xhr.send();
        }
    });

    return deferred
}

function get(url, data) {
    return ajax({ method: "GET", url, data })
}

module.exports = { ajax, get }
