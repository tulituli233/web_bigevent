$(function () {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function (val) {
            if (val.length > 6) {
                return '昵称长度必须在1~8个字符之间！'
            }
        }
    })
    initUserInfo();
    // 获取用户信息并加载到表单
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                form.val('formUserInfo', res.data);
            }
        })
    }
    $('.layui-btn-primary').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return console.log(res.message);
                }
                layer.msg(res.message);
                window.parent.getUserInfo();//调用父页面方法
            }
        })
    })
})