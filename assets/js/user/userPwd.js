$(function () {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        oldPwd: [/^[\S]{6,12}$/, '密码必须在6到12位之间，且不能出现空格'],
        newPwd: function (value) {
            let oldPwd = $('.layui-form [name=oldPwd]').val();
            if (oldPwd === value) {
                return '原密码与新密码不能相同!';
            }
        },
        rePwd: function (value) {
            let newPwd = $('.layui-form [name=newPwd]').val();
            if (newPwd !== value) {
                return '两次密码不一致!';
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:{oldpwd:$('.layui-form [name=oldPwd]').val(),
            newpwd:$('.layui-form [name=newPwd]').val()},
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $('.layui-form')[0].reset();//重置表单 [0] jq对象--->do对象
                // $('.layui-btn-primary').click();
            }
        })
    })
})