$(function () {
    let layer = layui.layer;
    let form=layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr= template('tpl-table',res);
                $('tbody').html(htmlStr);
                // layer.msg(res.message);
            }
        })
    }

    let indexAdd=null;//记录弹出层索引
    $('#btnAddCate').on('click',function(){
        indexAdd=layer.open({
            type:1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
          });               
    })

    //添加分类
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.close(indexAdd);
                initArtCateList();
                layer.msg(res.message);
            }
        })
    })

    let indexEdit=null;
    $('tbody').on('click','.btn-edit',function(){
        indexEdit=layer.open({
            type:1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
          });  
        let id=$(this).attr('data-id')
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
                form.val('form-edit',res.data)
            }
        })             
    })

    //一般不绑定提交按钮，而是监控表单的提交
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.close(indexEdit);
                initArtCateList();
                layer.msg(res.message);
            }
        })
    })

    //删除
    $('tbody').on('click','.byn-delete',function(){
        let id=$(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg(res.message);
                    }
                    layer.close(index);
                    initArtCateList();
                    layer.msg(res.message);
                }
            })
          });
    })

})