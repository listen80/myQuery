
function cookie() {
    const args = Array.from(arguments);
    switch (args.length) {
        case 2:
            setCookie(args[0], args[1]);
            break;
        case 3:
            setCookie(args[0], args[1], args[2]);
            break;
        case 1:
            const getResult = getCookie(args[0]);
            if (getResult !== null) {
                return getResult;
            } else {
                deleteCookie(args[0]);
            }
            break;
        default:
            console.error('传入的参数数量不支持，请检查。');
    }
}
/**
 * 设置cookie
 * @param {string} name - cookie的名称
 * @param {string} value - cookie的值
 * @param {number} [days] - cookie的过期天数，可选参数
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * 获取cookie
 * @param {string} name - cookie的名称
 * @returns {string|null} - 返回cookie的值，如果不存在则返回null
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * 删除cookie
 * @param {string} name - cookie的名称
 */
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
}

module.exports = { cookie }