$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    const leixing=localStorage.getItem('leixing');

    // $('#dialog-buy [name=quantity]').attr('data-num')
    var q = {
        pagenum: 1,
        pagesize: 5,
    };

    initTable();
    // // 获取文章列表数据的方法
    function initTable() {
        if(leixing==='1'){
            $.ajax({
                method: 'POST',//不要用get又传又给
                url: '/my/orders/allorders',
                data: q,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message + '请点击首页刷新数据！');
                    }
                    var htmlStr = template('tpl-table', res);
                    $('tbody').html(htmlStr);
                    renderPage(res.total);
                }
            })
        }
        else if(leixing==='2'){
            $.ajax({
                method: 'POST',//不要用get又传又给
                url: '/my/orders/allorderc',
                data: q,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message + '请点击首页刷新数据！');
                    }
                    var htmlStr = template('tpl-table', res);
                    $('tbody').html(htmlStr);
                    renderPage(res.total);
                }
            })
        }
        else if(leixing==='3'){
            $.ajax({
                method: 'POST',//不要用get又传又给
                url: '/my/orders/allordert',
                data: q,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message + '请点击首页刷新数据！');
                    }
                    var htmlStr = template('tpl-table', res);
                    $('tbody').html(htmlStr);
                    renderPage(res.total);
                }
            })
        }
        
    }
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
    //详情
    let indexxi = null;
    $('tbody').on('click', '.btn-xi', function () {
        let cid = $(this).attr('data-cid');
        let sid = $(this).attr('data-sid');
        let pid = $(this).attr('data-pid');
        $.ajax({
            method: 'POST',
            url: '/my/orders/getxiango',
            data: { sid, cid, pid },
            success: function (res) {
                // console.log(1);
                // console.log(res.data[0].supBrief);
                console.log(res);
                let htmlStr = template('dialog-xi', res);
                indexxi = layer.open({
                    type: 1,
                    area: ['600px', '600px'],
                    title: '订单详情',
                    content: htmlStr,
                });
                $('.supBrief').html(res.data[0].supBrief);
            }
        })
    })

})