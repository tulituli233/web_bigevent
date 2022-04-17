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
            url: '/my/home/allneedeslist',
            data: q,
            success: function (res) {
                // console.log(res);
                // console.log(q);
                if (res.status !== 0) {
                    // $('.nds').click();
                    return layer.msg(res.message+'请点击首页刷新数据！');
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
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }
    let indexEdit = null;
    $('tbody').on('click', '.btn-buy', function () {
        let id = $(this).attr('data-id');
        let sid = $(this).attr('data-sid');
        $.ajax({
            method: 'POST',
            url: '/my/home/getxiangn/' + id,
            data: { sid },
            success: function (res) {
                let htmlStr = template('dialog-buy', res);
                indexEdit = layer.open({
                    type: 1,
                    area: ['500px', '490px'],
                    title: '提供零件',
                    content: htmlStr,
                });
            }
        })
    })


    //一般不绑定提交按钮，而是监控表单的提交
    $('body').on('submit', '#form-buy', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/home/addtradingn',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.close(indexEdit);
                layer.msg(res.message);
                initTable();
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
            url: '/my/home/getxiangn/' + id,
            data: { sid },
            success: function (res) {
                // console.log(1);
                // console.log(res.data[0].supBrief);
                let htmlStr = template('dialog-xi', res);
                indexxi = layer.open({
                    type: 1,
                    area: ['600px', '600px'],
                    title: '零件详情',
                    content: htmlStr,
                });
                $('.supBrief').html(res.data[0].supBrief);
            }
        })
    })

})