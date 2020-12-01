var isclick = 0;
var setting = document.getElementsByClassName("setting-interface");
var xhr;

window.onload = () => {

    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xhr = new XMLHttpRequest();
    }
    else {
        // IE6, IE5 浏览器执行代码
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    Update()//防止用户f5之后数据与后端不同步
}

function start() {//请求开始抽奖
    xhr.open('get', 'http://127.0.0.1:8000/start')
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText.search("警告") != -1)
                    Notice(xhr.responseText, "red")
                else {
                    Notice(xhr.responseText, "green")
                    setTimeout(() => {
                        Update()
                    }, 50);
                }
            }
        }
    }
}

function clearall() {//请求清除所有数据
    xhr.open('get', 'http://127.0.0.1:8000/clear')
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText.search("警告") != -1)
                    Notice(xhr.responseText, "red")
                else {
                    Notice(xhr.responseText, "green")
                    setTimeout(() => {
                        Update()
                    }, 50);
                }
            }
        }
    }
}

function Setting_btn() {//控制添加页面的效果（同样奇葩的变量名= =）
    if (isclick) {
        // setting[0].style.display="none"
        var opacity_ = 1
        var id = setInterval(setnone, 20)
        function setnone() {
            if (opacity_ <= 0) {
                clearInterval(id)
                setting[0].style.display = "none"
            }
            else {
                setting[0].style.opacity = opacity_
                opacity_ -= 0.1
            }
        }
        isclick = 0
    }
    else {
        var opacity_ = 0
        var id = setInterval(setdisplay, 20)
        function setdisplay() {
            if (opacity_ > 1) {
                clearInterval(id)
            }
            else {
                setting[0].style.display = "inline-block"
                setting[0].style.opacity = opacity_
                opacity_ += 0.1
            }
        }
        isclick = 1
    }
}

function Award_S() {//添加奖品
    var content = document.getElementById('award').value
    var chance = document.getElementById('chance').value
    var tag = document.getElementById('tag').value
    xhr.open('get', 'http://127.0.0.1:8000/award?content=' + content + '&chance=' + chance + '&tag=' + tag)
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText.search("警告") != -1)
                    Notice(xhr.responseText, "red")
                else {
                    Notice(xhr.responseText, "green")
                    setTimeout(() => {
                        Update()
                    }, 50);
                }
            }
        }
    }

}

function Del(e) {//请求删除某个东西
    var type = e.id.split("-")
    xhr.open('get', 'http://127.0.0.1:8000/del?id=' + type[1] + '&type=' + type[0])
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText.search("警告") != -1)
                    Notice(xhr.responseText, "red")
                else {
                    Notice(xhr.responseText, "green")
                    setTimeout(() => {
                        Update()
                    }, 50);
                }
            }
        }
    }
}

function Content_S() {//添加参与人发送给后端
    var people = document.getElementById('content').value
    xhr.open('get', 'http://127.0.0.1:8000/content?people=' + people+'&ispicked='+'')
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.responseText.search("警告") != -1)
                    Notice(xhr.responseText, "red")

                else {
                    Notice(xhr.responseText, "green")
                    Update()
                }

            }
        }
    }
}
// //测试，未启用
// var iTime

// function Notice_bak(text, color) {
//     clearTimeout(iTime);
//     iTime = setTimeout(() => {
//         var opacity_ = 0
//         var Ctext = document.getElementsByClassName('text')[0]
//         Ctext.innerHTML = text
//         Ctext.style.color = color
//         var id = setInterval(() => {
//             opacity_ += 0.08
//             document.getElementsByClassName('notice')[0].style.opacity = opacity_
//             if (opacity_ > 0.8)
//                 clearInterval(id)
//         }, 10)
//         setTimeout(() => {
//             var id2 = setInterval(() => {
//                 opacity_ -= 0.1
//                 document.getElementsByClassName('notice')[0].style.opacity = opacity_
//                 if (opacity_ <= 0)
//                     clearInterval(id2)
//             }, 15)
//         }, 1300);
//     }, 200);
// }//测试，未启用

function Notice(text, color) {//提示模块
    var opacity_ = 0
    var Ctext = document.getElementsByClassName('text')[0]
    Ctext.innerHTML = text
    Ctext.style.color = color
    var id = setInterval(() => {
        opacity_ += 0.08
        document.getElementsByClassName('notice')[0].style.opacity = opacity_
        if (opacity_ > 0.8)
            clearInterval(id)
    }, 10)
        setTimeout(() => {
            var id2 = setInterval(() => {
                opacity_ -= 0.1
                document.getElementsByClassName('notice')[0].style.opacity = opacity_
                if (opacity_ <= 0)
                    clearInterval(id2)
            }, 15)
        }, 1300);
}

function Update() {//请求更新内容
    var content
    xhr.open('get', 'http://127.0.0.1:8000/update')
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                content = xhr.responseText
                content = content.split("@")
                document.getElementById('left-table').innerHTML = content[0]
                document.getElementById('right-table').innerHTML = content[1]
            }
        }
    }

}