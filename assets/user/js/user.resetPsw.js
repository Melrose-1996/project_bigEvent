$(function () {
    //要使用表单验证功能就必须要先得到form模块对象
    var form = layui.form
    //要使用提示功能就必须要先获取到layer内置模块
    var layer = layui.layer
    //接下来进行表单验证功能
    form.verify({
        newPwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePsw: function (value) {
            if (value === $(".layui-form [name=oldPwd]").val()) {
                return "新旧密码不能相同！"
            }
        },
        rePsw: function (value) {
            if (value !== $(".layui-form [name=newPwd]").val()) {
                return "两次密码不一致！"
            }
        }
    });

    //为重置密码发起POST请求
    $(".layui-form").submit(function (e) {
        e.preventDefault()
        resetPsw()
    })
    function resetPsw() {
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(".layui-form").serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //把表单清空
                $(".layui-form")[0].reset()
            }
        });
    }
})