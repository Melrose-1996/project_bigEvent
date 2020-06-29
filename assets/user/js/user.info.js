$(function () {
    //要使用表单验证功能就必须要先得到form模块对象
    var form = layui.form
    //要使用提示功能就必须要先获取到layer内置模块
    var layer = layui.layer
    //接下来进行表单验证功能
    form.verify({
        nickname: [
            /^[\S]{1,6}$/
            , '昵称长度必须在 1 ~ 6 个字符之间！'
        ],
    });
    initUserInfo()
    /* 实现表单的重置效果 */
    $(".layui-form [type=reset]").on("click", function (e) {
        e.preventDefault()
        initUserInfo()
    })
    /* 发起更新用户的请求 */
    $(".layui-form").submit(function (e) {
        e.preventDefault()
        updateUserInfo()
    })
    function updateUserInfo() {
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(".layui-form").serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        });
    }
    /* 初始化用户的信息 */
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message)
                /* 通过form.val()来快速的表单赋值 */
                form.val("form-userInfo", res.data)
            }
        });
    }
})
