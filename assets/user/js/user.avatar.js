$(function () {
    //要使用提示功能就必须要先获取到layer内置模块
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

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
    $("#makeSure").click(function (e) {
        e.preventDefault();
        //3. 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);

                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        });
    });

})