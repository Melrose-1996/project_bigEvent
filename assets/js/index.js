$(function () {
    getUserInfo()
    $("#close").click(function () {
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清除本地存储的token
            localStorage.removeItem("token")
            //跳转回登录页面
            location.href = "/login.html"
            layer.close(index);
        });
    });
})

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function (res) {
            console.log(res);
            if (res.status != 0) return layui.layer.msg(res.message)
            //调用renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    });
}

function renderAvatar(user) {
    //获取用户名
    var name = user.nickname || user.username
    //渲染欢迎的文本
    $("#welcome").html("欢迎&nbsp;&nbsp;&nbsp;" + name)
    //判断用户是否有头像，如果有的话就显示头像--根据头像的根路径，如果没有的话则渲染用户名的名字的一个大写
    if (user.user_pic !== null) {
        $(".text-avater").hide()
        $(".layui-nav-img").attr("src", user.user_pic).show()

    } else {
        $(".layui-nav-img").hide()
        $(".text-avater").html(name[0].toUpperCase()).show()
    }
}