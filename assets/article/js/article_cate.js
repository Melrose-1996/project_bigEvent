$(function () {
    //渲染页面
    initArtCateList()

    //预先保存弹出层的索引，方便进行关闭
    var close = null
    //添加类别点击事件
    $("#add_articleCate").click(function (e) {
        e.preventDefault();
        console.log();

        close = layui.layer.open({
            type: 1,      //选1的话是页面层
            area: ['500px', '300px'],   //弹出层的宽高
            title: '添加文章分类',
            content: $("#dialog_add").html()
        });
    });

    //添加类型中确认提交监听事件
    $("body").on("submit", "#form_add", function (e) {
        e.preventDefault()
        addArtCateList()
    })

    //表单里面触发编辑点击事件
    var close1 = null
    $("body").on("click", "#article_edit", function (e) {
        e.preventDefault()
        close1 = layui.layer.open({
            type: 1,      //选1的话是页面层
            area: ['500px', '300px'],   //弹出层的宽高
            title: '修改文章分类',
            content: $("#dialog_edit").html()
        });
        //在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
        var id = $(this).attr("data-id")
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.form.val("dialog_edit", res.data)
            }
        });

    })
    //监听修改弹出层提交事件，然后修改
    $("body").on("submit", "#form_edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //重新渲染页面
                initArtCateList()
                layui.layer.msg(res.message)
                // 根据索引，关闭对应的弹出层
                layui.layer.close(close1)
            }
        });
    })

    //删除点击触发事件
    $("body").on("click", "#article_del", function (e) {
        e.preventDefault();
        var id = $(this).siblings("#article_edit").attr("data-id")
        console.log(id);
        layui.layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    //重新渲染页面
                    initArtCateList()
                    layui.layer.msg(res.message)
                }
            });
            layer.close(index);
        });
    })



    //渲染页面列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var str = template("article_list", res)
                $("tbody").html(str)
            }
        });
    }
    function addArtCateList() {
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $("#form_add").serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //重新渲染页面
                initArtCateList()
                layui.layer.msg(res.message)
                // 根据索引，关闭对应的弹出层
                layui.layer.close(close)
            }
        });
    }
















})