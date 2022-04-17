$(function () {
    let layer = layui.layer;
    let form = layui.form;
    form.verify({
        price: [/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, '零件价格格式错误！'],
        quantity: [/^[1-9][0-9]*$/, '零件数量格式错误！'],
        cate: function (value) {
            if (value !== '电阻' && value !== '电容' && value !== '电感') {
                return '零件分类不符合要求!';
            }
        }
    })
    var q = {
        // pagenum: 1,
        // pagesize: 2,
        // cate_id: '',
        state: '',
    };
    initArtCateList();

    //筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // q.cate_id = cate_id;
        q.state = state;
        // q.pagenum = 1;
        initArtCateList();
    })
    //加载
    function initArtCateList() {
        $.ajax({
            method: 'POST',
            url: '/my/cart/getneedes',
            data: q,
            success: function (res) {
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
            }
        })
    }

    let indexAdd = null;//记录弹出层索引
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '490px'],
            title: '自定义需求零件',
            content: $('#dialog-add').html(),
        });
    })

    //自定义零件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/cart/addneedes',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.close(indexAdd);
                initArtCateList();
                layer.msg(res.message);
            }
        })
    })

    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        let id = $(this).attr('data-id');
        let isc = $(this).attr('data-isc');
        if(isc==='1'){//注意数据类型，对自定义零件的修改
            $.ajax({
                method: 'GET',
                url: '/my/cart/getneedes/' + id,
                success: function (res) {
                    // console.log(res);
                    let htmlStr = template('dialog-edit', res);
                    // console.log(htmlStr);
                    // form.val('form-edit',res.data);
                    indexEdit = layer.open({
                        type: 1,
                        area: ['500px', '490px'],
                        title: '修改零件属性',
                        // content: $('#dialog-edit').html(),
                        content: htmlStr,
                    });
                    // form.render();
                }
            })
        }
        else if(isc==='0'){//对非自定义零件的修改
            $.ajax({
                method: 'GET',
                url: '/my/cart/getneedes/' + id,
                success: function (res) {
                    let htmlStr = template('dialog-edit1', res);
                    indexEdit = layer.open({
                        type: 1,
                        area: ['500px', '250px'],
                        title: '修改零件数量',
                        content: htmlStr,
                    });
                }
            })
        }
        
    })
    //购买数量变化绑定
    $('body').on('input', '#quantity', function () {
        let num = $(this).val();
        let qua = $('#form-edit1 [name=price]').val();
        $('[name=allquantity]').val((num * qua).toFixed(2));
    })

    //一般不绑定提交按钮，而是监控表单的提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/cart/updateneedes',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.close(indexEdit);
                initArtCateList();
                layer.msg(res.message);
            }
        })
    })
    //修改非自定义零件
    $('body').on('submit', '#form-edit1', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/cart/fupdateneedes',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.close(indexEdit);
                initArtCateList();
                layer.msg(res.message);
            }
        })
    })


    //删除
    $('tbody').on('click', '.byn-delete', function () {
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/cart/deleteneedes/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.close(index);
                    initArtCateList();
                    layer.msg(res.message);
                    console.log('ok');
                },
                // complete:function(){
                //     initArtCateList();
                // }
            })
        });
    })

})