// 自定义的 Deferred 函数
function Deferred() {
    let doneCallbacks = [];
    let failCallbacks = [];
    let state = 'pending';
    let result;

    // 定义 resolve 函数
    function resolve(value) {
        if (state === 'pending') {
            state = 'resolved';
            result = value;
            doneCallbacks.forEach(function (callback) {
                callback(value);
            });
        }
    }

    // 定义 reject 函数
    function reject(reason) {
        if (state === 'pending') {
            state = 'rejected';
            result = reason;
            failCallbacks.forEach(function (callback) {
                callback(reason);
            });
        }
    }

    // 定义 done 方法，用于添加成功回调
    function done(callback) {
        if (state === 'resolved') {
            callback(result);
        } else {
            doneCallbacks.push(callback);
        }
        return this;
    }

    // 定义 fail 方法，用于添加失败回调
    function fail(callback) {
        if (state === 'rejected') {
            callback(result);
        } else {
            failCallbacks.push(callback);
        }
        return this;
    }

    // 定义 promise 方法，返回一个安全的 promise 对象
    function promise() {
        return {
            done: done,
            fail: fail
        };
    }

    return {
        resolve: resolve,
        reject: reject,
        done: done,
        fail: fail,
        promise: promise
    };
}

module.exports = { Deferred }