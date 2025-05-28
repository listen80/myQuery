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

// 手写 Promise 实现
class MyPromise {
    constructor(executor) {
        // 初始化状态为 pending
        this.state = 'pending';
        // 存储成功的值
        this.value = undefined;
        // 存储失败的原因
        this.reason = undefined;
        // 存储成功的回调函数数组
        this.onResolvedCallbacks = [];
        // 存储失败的回调函数数组
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                // 依次执行成功回调
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                // 依次执行失败回调
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

        try {
            // 执行 executor 函数，并传入 resolve 和 reject
            executor(resolve, reject);
        } catch (error) {
            // 捕获异常并调用 reject
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        // 处理 onFulfilled 和 onRejected 为可选参数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };

        let newPromise = new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(newPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.state === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(newPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.state === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });

                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });

        return newPromise;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
}

// 解析 then 方法返回值的函数
function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }
    let called;
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise, y, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

// 导出 MyPromise
module.exports = {
    Deferred : MyPromise,
    MyPromise
};