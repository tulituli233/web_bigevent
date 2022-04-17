$.ajaxPrefilter(function (options) {
    options.url = 'http://127.0.0.1:3007' + options.url;
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete= function (res) {//无法执行的原因可能是它之前的代码发生了错误
        // alert('no');
        if (res.responseJSON.status === 1&&res.responseJSON.message==='获取用户信息失败！') {
            localStorage.removeItem('token');
            localStorage.removeItem('leixing');
            location.href = './login.html';
        }
    }
})