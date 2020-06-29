$(function () {
    //由于页面的核心是列表区，所以调用接口文档--获取文章的列表数据，先把所需要的参数定义出来
    var data = {
        pagenum: 1,       //页码值
        pagesize: 2,      //每页显示多少条数据
        cate_id: "",      //文章分类的 Id
        state: ""         //文章的状态
    }
    //渲染页面列表
    initTable()
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var str = template("article_list", res)
                template.defaults.imports.dataFormat = function (res) {
                    var date = new Date(res)
                    var y = date.getFullYear()
                    var m = String(date.getMonth() + 1).padStart(2, "0")
                    var d = String(date.getDate()).padStart(2, "0")


                    var hh = String(date.getHours()).padStart(2, "0")
                    var mm = String(date.getMinutes()).padStart(2, "0")
                    var ss = String(date.getSeconds()).padStart(2, "0")
                    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
                }
                $("tbody").html(str)
            }
        });
    }

    //获取所有分类的下拉选项框请求
    initCate()
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(res);

                var str = template("initCate", res)
                console.log(str);
                console.log($("[name=cate_id]"));

                $("[name=cate_id]").html(str)
                // 通过 layui 重新渲染表单区域的UI结构--因为这个option是后面通过请求添加过来的，当页面走完并不能获取到，所以我们需要用个layui.form.render()方法重新渲染一次
                layui.form.render()
            }
        });
    }

    //实现筛选的功能 -- 核心就在于监听提交事件，把我们最开始定义的参数data里面的cate_id和state重新赋值，再重新渲染该页面就好了！
    $("#form-search").submit(function (e) {
        e.preventDefault()
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val()
        data.cate_id = cate_id
        data.state = state
        //重新渲染页面列表
        initTable()
    })

















})