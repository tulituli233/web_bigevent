$(function () {
    getUserInfo();
    $('#btnLogout').on('click', function () {
        layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token');//删除token
            location.href = './login.html';//跳回登录页面
            layer.close(index);
        });
    })
})
//获取头像
function getUserInfo() {
    let layer = layui.layer;
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            // alert(res.status);
            if (res.status !== 0) layer.msg(res.message);
            renderAvatar(res.data);
        },
        // complete: function (res) {//无法执行的原因可能是它之前的代码发生了错误
        //     // alert('no');
        //     if (res.responseJSON.status === 1) {
        //         localStorage.removeItem('token');
        //         location.href = './login.html';
        //     }
        // }
    })
}
//渲染头像
function renderAvatar(user) {
    try {//捕获错误防止崩溃
        let name = user.nickname || user.username;
        $('#welcome').html('欢迎&nbsp;&nbsp;&nbsp;' + name);
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show();//显示头像
            $('.text-avatar').hide();//隐藏文本头像
        } else {
            $('.layui-nav-img').hide();
            $('.text-avatar').html(name[0].toUpperCase()).show();
        }
    } catch (e) {
        // localStorage.removeItem('token');
        // location.href = './login.html';
        // alert(e);
    }

}