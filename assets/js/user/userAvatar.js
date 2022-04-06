$(function () {
    let $image = $('#image');
    let layer=layui.layer;

    const options = {
        // 裁剪框横纵比
        aspectRatio: 1,
        // 指定预览图片区域
        preview: '.img-preview'
    }
    $image.cropper(options);//创建剪裁区域


    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    $('#file').on('change', function (e) {
        let filelist= e.target.files;
        if(filelist.length===0){
            return layer.msg('请选择图片');
        }
        let file=filelist[0];
        let newImgURL=URL.createObjectURL(file);
        $image.cropper('destroy').attr('src',newImgURL).cropper(options);
    })

    $('#btnUpload').on('click', function () {
        let dataURL=$image.cropper('getCroppedCanvas',{
            width:100,
            heigth:100
        }).toDataURL('image/png');
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                window.parent.getUserInfo();//调用父页面方法
            }
        })
    })
})