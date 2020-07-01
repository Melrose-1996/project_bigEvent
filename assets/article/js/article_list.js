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
                $("tbody").html(str)

                renderPage(res.total)
            }
        });
    }
    template.defaults.imports.changtime = function (res) {
        const date = new Date(res)
        var y = date.getFullYear()
        var m = String(date.getMonth() + 1).padStart(2, "0")
        var d = String(date.getDate()).padStart(2, "0")


        var hh = String(date.getHours()).padStart(2, "0")
        var mm = String(date.getMinutes()).padStart(2, "0")
        var ss = String(date.getSeconds()).padStart(2, "0")
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
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
                var str = template("initCate", res)
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

    //实现分页的函数
    function renderPage(res) {
        // 调用 laypage.render() 方法来渲染分页的结构
        layui.laypage.render({
            elem: "pageBox",
            count: res,
            limit: data.pagesize,
            curr: data.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //当页面切换的时候，触发jump回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 把最新的页码值，赋值到 data 这个查询参数对象中
                data.pagenum = obj.curr
                // 把最新的条目数，赋值到 data 这个查询参数对象的 pagesize 属性中
                data.pagesize = obj.limit
                if (!first) {
                    //重新渲染页面列表
                    initTable()
                }
            }
        })

    }




    //实现编辑功能---这个是额外自己写的！！

    //表单里面触发编辑点击事件
    var close1 = null
    $("body").on("click", "#article_edit", function (e) {
        e.preventDefault()
        close1 = layui.layer.open({
            type: 1,      //选1的话是页面层
            area: ['100%', '100%'],   //弹出层的宽高
            title: '修改文章分类',
            content: $("#dialog_edit").html()
        });
        // 初始化富文本编辑器
        initEditor()

        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options)

        //在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
        var id = $(this).attr("data-id")
        // $.ajax({
        //     type: "GET",
        //     url: "/my/article/list",
        //     data: data,
        //     success: function (value) {
        //         $.ajax({
        //             type: "GET",
        //             url: "/my/article/" + id,
        //             success: function (res) {
        //                 if (res.status !== 0) {
        //                     return layui.layer.msg(res.message)
        //                 }
        //                 res.data.cate_id = value.data[0].cate_name
        //                 //这个把cate_id变成cate_name
        //                 layui.form.val("article_form", res.data)
        //                 var str = template("initCate", res)
        //                 $("[name=cate_id]").html(str)
        //                 // 通过 layui 重新渲染表单区域的UI结构--因为这个option是后面通过请求添加过来的，当页面走完并不能获取到，所以我们需要用个layui.form.render()方法重新渲染一次
        //                 layui.form.render()
        //             }
        //         });
        //     }
        // });

        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                $.ajax({
                    type: "GET",
                    url: "/my/article/list",
                    data: data,
                    success: function (value) {
                        res.data.cate_id = value.data[0].cate_name
                        layui.form.val("article_form", res.data)
                        var str = template("initCate", res)
                        $("[name=cate_id]").html(str)
                        // 通过 layui 重新渲染表单区域的UI结构--因为这个option是后面通过请求添加过来的，当页面走完并不能获取到，所以我们需要用个layui.form.render()方法重新渲染一次
                        layui.form.render()
                    }
                });
            }
        });

        //点击上传默认点击文件
        $("#uploading").click(function (e) {
            e.preventDefault();
            $("#file").click()
        });
        $("#file").change(function (e) {
            e.preventDefault();
            var filelist = e.target.files
            if (filelist.length === 0) {
                return layer.msg("请选择图片！")
            }
            //1. 拿到用户选择的文件
            var file = e.target.files[0]
            //2. 根据选择的文件，创建一个对应的 URL 地址：
            var newImgURL = URL.createObjectURL(file)
            //3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        });

        //定义文章的发布状态
        var art_state = "已发布"
        $("#btnSave2").click(function () {
            art_state = "草稿"
        })

        //监听修改弹出层提交事件，然后修改
        $("body").on("submit", "#makeSure", function (e) {
            e.preventDefault()
            //基于Form表单添加id属性
            var fd = new FormData($(this)[0])
            fd.append("state", art_state)
            $image
                .cropper('getCroppedCanvas', {
                    // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function (blob) {
                    // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 5. 将文件对象，存储到 fd 中
                    fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                    $.ajax({
                        type: "POST",
                        url: "/my/article/edit",
                        data: fd,
                        contentType: false,
                        processData: false,
                        success: function (res) {
                            if (res.status !== 0) {
                                return layui.layer.msg(res.message)
                            }
                            layui.layer.msg(res.message)
                            //重新渲染页面列表
                            initTable()
                            layui.layer.msg(res.message)
                            // 根据索引，关闭对应的弹出层
                            layui.layer.close(close1)
                        }
                    });
                })
        })


    })

    //删除点击触发事件
    $("body").on("click", "#article_del", function (e) {
        e.preventDefault();
        // 获取到文章的 id
        var id = $(this).siblings("#article_edit").attr("data-id")
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(id);
        layui.layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    //重新渲染页面
                    initTable()
                }
            });
            layer.close(index);
        });
    })













})