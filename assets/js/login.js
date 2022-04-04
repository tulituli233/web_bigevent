$(function(){
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
        console.log('1');//Live server禁用了控制台
    });

    $('#link_login').on('click',function(){
        $('.login-box').show();
        $('.reg-box').hide();
    });

    let form=layui.form;
    form.verify({
        password:[/^[\S]{6,12}$/,'密码必须在6到12位之间，且不能出现空格'],
        repassword:function(value){
            let password= $('.reg-box [name=password]').val();
            if(password!==value){
                return '两次密码不一致!';
            }
        }
    })

    $('#form_reg').on('submit',function(e){
        // console.log('1');//Live server禁用了控制台
        // alert('123');
        e.preventDefault();
        let data={username:$('#form_reg [name=username]').val(),
                  password:$('#form_reg [name=password]').val()}     
        $.post('/api/reguser',
        // $.post('http://ajax.frontend.itheima.net/api/reguser',
        data,
        function(res){
            if(res.status!==0){
                // return alert('注册失败！'+res.message);
                return layer.msg(res.message);
            }
            // alert('注册成功！');
            layer.msg(res.message);
            $('#link_login').click();
        })
    })

    $('#form_login').on('submit',function(e){
        e.preventDefault();
        let data={username:$('#form_login [name=username]').val(),
                  password:$('#form_login [name=password]').val()}
        $.post('/api/login',data,
        function(res){
            if(res.status!==0){
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            localStorage.setItem('token',res.token);
            location.href='./index.html';
        })
    })

    // $('#form_login').submit(function(){
    //     alert(2);
    //     e.preventDefault();
    //     $.ajax({
    //         url:'http://127.0.0.1:3007/api/login',
    //         method:'POST',
    //         data:$(this).serialize(),
    //         success:function(res){
    //             alert(3);
    //             if(res.status!==0) return layer.msg(res.message);
    //             layer.msg(res.message);
    //             // location.href='./index.html';
    //             alert(1);
    //         },
    //         error:function(res,excp){
    //             alert(4);
    //         }
    //     })
    // })

})