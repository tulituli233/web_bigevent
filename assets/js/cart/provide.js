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
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cart/getprovide',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // layer.msg(res.message);
            }
        })
    }

    let indexAdd = null;//记录弹出层索引
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '490px'],
            title: '添加零件',
            content: $('#dialog-add').html(),
        });
    })

    //添加零件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/cart/addprovide',
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
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/cart/istrading/' + id,
            success: function (res) {
                if (res.status === 0) {
                    layer.open({
                        title: '提示'
                        , content: '该零件正在进行交易，暂时无法修改！'
                    });
                } else if (res.status === 1) {
                    $.ajax({
                        method: 'GET',
                        url: '/my/cart/getprovide/' + id,
                        success: function (res) {
                            let htmlStr = template('dialog-edit', res);
                            indexEdit = layer.open({
                                type: 1,
                                area: ['500px', '490px'],
                                title: '修改零件属性',
                                content: htmlStr,
                            });
                        }
                    })
                }
            }
        })
    })

    //一般不绑定提交按钮，而是监控表单的提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/cart/updateprovide',
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
                url: '/my/cart/deleteprovide/' + id,
                success: function (res) {
                    if (res.status !== 0) {
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