$(function () {
    //要使用表单验证功能就必须要先得到form模块对象
    var form = layui.form
    //要使用提示功能就必须要先获取到layer内置模块
    var layer = layui.layer
    $("#link_reg").click(function () {
        $(".register").hide().siblings(".Login").show()
    });
    $("#link_log").click(function () {
        $(".Login").hide().siblings(".register").show()
    });
    //接下来进行表单验证功能
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            var pass = $(".Login [name=password]").val()
            if (value != pass) return "两次密码不一致"
        }
    });
    //现在发起注册的post请求
    $("#form-log").submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message)
                layer.msg("注册成功，请登录！")
                //模拟登录表单点击事件
                $("#link_log").click()
            }
        });
    });
    //现在发起登陆的POST请求
    $("#form-reg").submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message)
                layer.msg("登录成功！")
                //把登录令牌token存在本地存储里面
                localStorage.setItem("token", res.token)
                //登录成功后跳转到index页面
                location.href = "/index.html"
            }
        });
    });
})