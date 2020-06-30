$(function () {
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
                $("[name=cate_id]").html(str)
                // 通过 layui 重新渲染表单区域的UI结构--因为这个option是后面通过请求添加过来的，当页面走完并不能获取到，所以我们需要用个layui.form.render()方法重新渲染一次
                layui.form.render()
            }
        });
    }

    //更换头像的js
    //要使用提示功能就必须要先获取到layer内置模块
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.3 创建裁剪区域
    $image.cropper(options)

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
    $("#btnSave2").click(function name(params) {
        art_state = "草稿"
    })

    //开始发布文章！
    $("#makeSure").submit(function (e) {
        e.preventDefault();
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
                    url: "/my/article/add",
                    data: fd,
                    // 必须添加以下两个配置项
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        console.log(res);
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        console.log(res);
                        layer.msg(res.message)
                        location.href = '/article/article_list.html'
                    }
                });
            })
    });
























})

