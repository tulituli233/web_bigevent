$(function () {
    let layer = layui.layer;
    let form = layui.form;
    //剪裁
    let $image = $('#image');
    let options = {
        aspectRatio: 400 / 300,
        preview: '.img-preview'
    }
    $image.cropper(options);
    initEditor();
    initCate();
    //加载文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-table', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //监听图片选择
    $('#coverFile').on('change', function (e) {
        let filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片');
        }
        let file = filelist[0];
        let newImgURL = URL.createObjectURL(file);
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);
    })

    let art_state = '已发布';
    $('#btnSave2').on('click', function (e) {
        //    e.preventDefault();
        art_state = '草稿'
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();//阻止表单默认提交
        var fd=new FormData($(this)[0]);
        fd.append('state',art_state);
        $image.cropper('getCroppedCanvas',{
            width:400,
            heigth:280
        }).toBlob(function(blob){//回调函数
            fd.append('cover_img',blob);
            // fd.forEach((v,k)=>{
            //     console.log(k,v);
            // })
            publishArt(fd);
        })
    })
    //发布文章
    function publishArt(fd){
        $.ajax({
            method:'POST',
            url: '/my/article/add',
            data:fd,
            //FormData格式数据需要加一下配置
            contentType:false,
            processData:false,
            success:function(res){
               alert(res.message+'即将回到首页。');
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // location.href='../../../article/art_list.html'
            }
        })
    }

})