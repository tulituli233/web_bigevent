$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormate = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        y = addZero(y);
        var m = dt.getMonth() + 1;
        m = addZero(m);
        var d = dt.getDate();
        d = addZero(d);

        var hh = dt.getHours();
        hh = addZero(hh);
        var mm = dt.getMinutes();
        mm = addZero(mm);
        var ss = dt.getSeconds();
        ss = addZero(ss);

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 补0
    function addZero(value) {
        return value = value < 10 ? '0' + value : value;
    }

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    };

    initTable();
    initCate();

    // // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'POST',//不要用get又传又给
            url: '/my/article/list',
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
    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                let htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render();
                layer.msg(res.message);
            }
        })
    }
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
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
            limits: [2, 3, 5, 10],
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
    //删除
    $('tbody').on('click', '.btn-delete', function () {
        let len = $('.btn-delete').length;
        let id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.close(index);
                    layer.msg(res.message);
                    if (len === 1){
                        q.pagenum=q.pagenum===1?1:q.pagenum-1;
                    }
                    initTable();
                }
            })
        });
    })
    //删除逻辑修补
})