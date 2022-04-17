$(function () {
    initEditor();

    // var indexs;
    // layui.use('layedit', function(){
    //     var layedit = layui.layedit;
    //     indexs = layedit.build('brief_rish', {
    //         height: 300,
    //     }); //建立编辑器
    //   });
    // layedit.setContent(indexs,'123');

    getBrief();
    function getBrief(){
        $.ajax({
            method:'GET',
            url:'/my/getBrief',
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                console.log(res);
                $('.form-brief .oldBrief').html(res.data.brief);
                layer.msg(res.message);
            }
        })
    }

    $('.form-brief').on('submit', function (e) {
        e.preventDefault();
        const brief = $('.form-brief [name=content]').val();
        $.ajax({
            method: 'POST',
            url: '/my/setBrief',
            data: { brief },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                getBrief();
            }
        })
    })
})