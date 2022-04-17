$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    form.verify({
        price: [/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, '零件价格格式错误！'],
        quantity: [/^[1-9][0-9]*$/, '零件数量格式错误！'],
        cate: function (value) {
            if (value !== '电阻' && value !== '电容' && value !== '电感') {
                return '零件分类不符合要求!';
            }
        }
    })
    // $('#dialog-buy [name=quantity]').attr('data-num')
    var q = {
        pagenum: 1,
        pagesize: 5,
        search: '',
        cate: '',
    };

    initTable();
    // // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'POST',//不要用get又传又给
            url: '/my/home/allprovidelist',
            data: q,
            success: function (res) {
                // console.log(res);
                // console.log(q);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                // 渲染页面
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    // //初始化文章分类
    // function initCate() {
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/cates',
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg(res.message);
    //             }
    //             // console.log(res);
    //             let htmlStr = template('tpl-cate', res);
    //             // console.log(htmlStr);
    //             $('[name=search]').html(htmlStr);
    //             form.render();
    //             layer.msg(res.message);
    //         }
    //     })
    // }
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        let search = $('[name=search]').val();
        let cate = $('[name=cate]').val();
        q.search = search;
        q.cate = cate;
        q.pagenum = 1;
        initTable();
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的id  
            count: total, //总数据总数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [5, 10, 15, 20],
            // 分页发生切换的时候触发 jump回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            // 因此用jump方法的第二个参数first判断jump回调的方式是哪一种
            jump: function (obj, first) {
                // 可以通过first的值，来判断是通过哪种方式，触发的jump回调
                // 如果first的值为true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染
                // 直接在这里写这行，陷入死循环
                if (!first) {
                    initTable();
                }
            }
        });
    }
    let indexEdit = null;
    $('tbody').on('click', '.btn-buy', function () {
        let id = $(this).attr('data-id');
        let sid=$(this).attr('data-sid');
        $.ajax({
            method: 'GET',
            url: '/my/cart/getneedes/' + id,
            success: function (res) {
                if (res.status === 0) {
                    layer.open({
                        title: '提示'
                        , content: '该零件已加入购物车，如需更改请前往购物车！'
                    });
                } else {
                    $.ajax({
                        method: 'POST',
                        url: '/my/home/getoneprovide/' + id,
                        data:{sid},
                        success: function (res) {
                            let htmlStr = template('dialog-buy', res);
                            indexEdit = layer.open({
                                type: 1,
                                area: ['500px', '490px'],
                                title: '购买零件',
                                content: htmlStr,
                            });
                        }
                    })
                }
            }
        })
    })

    //一般不绑定提交按钮，而是监控表单的提交
    $('body').on('submit', '#form-buy', function (e) {
        e.preventDefault();
        let all = $('#form-buy [name=quantity]').attr('data-num');
        let news = $('#form-buy [name=quantity]').val();
        all = Number(all);
        news = Number(news);
        if (all < news) {
            layer.msg('购买数量过多，零件数量不足！');
            return;
        }
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/home/addtrading',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.close(indexEdit);
                layer.msg(res.message);
            }
        })
    })
    //购买数量变化绑定
    $('body').on('input', '#quantity', function () {
        let num = $(this).val();
        let qua = $('#form-buy [name=price]').val();
        $('[name=allquantity]').val((num * qua).toFixed(2));
    })
    //详情
    let indexxi = null;
    $('tbody').on('click', '.btn-xi', function () {
        let id = $(this).attr('data-id');
        let sid = $(this).attr('data-sid');
        $.ajax({
            method: 'POST',
            url: '/my/home/getxiang/' + id,
            data: { sid },
            success: function (res) {
                // console.log(1);
                // console.log(res.data[0].supBrief);
                let htmlStr = template('dialog-xi', res);
                indexxi = layer.open({
                    type: 1,
                    area: ['600px', '700px'],
                    title: '零件详情',
                    content: htmlStr,
                });
                $('.supBrief').html(res.data[0].supBrief);
            }
        })
    })

})