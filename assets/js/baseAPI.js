// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (value) {
    value.url = "http://ajax.frontend.itheima.net" + value.url

    // 统一为有权限的接口，设置 headers 请求头
    if (value.url.indexOf("/my/") != -1) {
        value.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    value.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //强制清空token--防止有人输入假token！
            localStorage.removeItem("token")
            //不允许页面跳转
            location.href = "login.html"
        }
    }
})