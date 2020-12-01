// 引入express
const express = require("express")

// 创建应用对象
const app = express()

const MAXNUM = 10

var award = []

var content = []

var count_award = 0, count_content = 0

app.get('/award', (req, res) => {//添加奖品
    var chance_total = 0
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 设置响应
    if (count_award == MAXNUM)
        res.send("警告<br>(已达到最大限制)")
    award[count_award] = req.query
    if (award[count_award].content == "" || award[count_award].chance == "")
        res.send("警告<br>(缺少内容或概率)")
    else if (award[count_award].chance >= 100)
        res.send("警告<br>(概率不能等于或超过1)")
    else if ((function () {
        if (award[0].content == "")
            return 'false'
        for (var i = 0; i < award.length; i++)
            chance_total += parseFloat(award[i].chance)
        console.log(chance_total)
        if (chance_total > 100)
            return 'true'
        else
            return 'false'
    })() == 'true') {
        res.send("警告<br>(概率总和超过一)")
    }
    else {
        res.send("提示<br>(添加成功)")
        console.log(award[count_award])
        count_award++
    }

})

app.get('/content', (req, res) => {//添加参与人（稀烂的变量名）
    // 设置响应
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (count_content == MAXNUM)
        res.send("警告<br>(已达到最大限制)")
    content[count_content] = req.query
    if (content[count_content].people == "")
        res.send("警告<br>(参与者不能为空)")
    else {
        res.send("提示<br>(添加成功)")
        console.log(content[count_content])
        count_content++

    }

})

app.get('/clear', (req, res) => {//清除所有数据
    // 设置响应
    res.setHeader('Access-Control-Allow-Origin', '*');
    award = []
    content = []
    count_award = 0
    count_content = 0
    res.send("提示<br>(清除成功)")
})

app.get('/start', (req, res) => {//开始抽奖
    // 设置响应
    res.setHeader('Access-Control-Allow-Origin', '*');
    // if (count_content != count_award)
    //     res.send("警告<br>(参与者与奖品数量不匹配)")
    if (count_award == 0 || count_content == 0)
        res.send("警告<br>(参与者或奖品为空)")
    else {
        var localaward = JSON.parse(JSON.stringify(award))//目的时为了对localaward操作时不会影响到award
        for (var i = 0; i < count_content; i++) {
            var picked = getResult(localaward)
            if (picked != -1) {
                content[i]['ispicked'] = localaward[picked]['content']
                for (var j = picked; j < localaward.length - 1; j++)//去掉已经抽到的奖品
                    localaward[j] = localaward[j + 1]
                if (localaward.length != 0)
                    localaward.length--
            }
            else
                content[i]['ispicked'] = "未中奖"
            console.log(localaward.length)
        }
        res.send("提示<br>(抽签结束)")
    }
})

function getResult(arr_origin) {//根据概率抽取随机数
    var leng = 100;
    var arr = JSON.parse(JSON.stringify(arr_origin))
    console.log(arr)
    for (var i = 0; i < arr.length; i++) {
        var random_ = parseInt(Math.random() * leng);
        if (random_ < arr[i]['chance']) {
            return i
        }
        else {
            leng -= arr[i]['chance']
        }
    }
    return -1
}

app.get('/update', (req, res) => {//拼接html内容发给前端让其显示
    res.setHeader('Access-Control-Allow-Origin', '*');
    var send_content = "<tr><th>参与者</th><th>中奖</th></tr>"
    for (var i = 0; i < count_content; i++) {
        send_content += '<tr> <th><i id="people-' + i + '" onclick="Del(this)" title="删除">x</i>' + content[i].people + '</th><th>' + content[i].ispicked + '</th></tr>'
    }
    send_content += "@<tr><th>内容</th><th>概率</th><th>标签</th></tr>"
    for (var i = 0; i < count_award; i++) {
        send_content += '<tr> <th><i id="award-' + i + '" onclick="Del(this)" title="删除">x</i>' + award[i]['content'] + '</th><th>' + award[i].chance + '</th><th>' + award[i].tag + '</th></tr>'
    }
    res.send(send_content)
})

app.get('/del', (req, res) => {//删除功能
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.query.type == "people") {
        for (var i = parseInt(req.query.id); i < count_content - 1; i++)
            content[i] = content[i + 1]
        if (content.length > 0) {
            count_content--
            content.length--
        }
        res.send("提示<br>(删除成功)")
    }
    else if (req.query.type == "award") {
        for (var i = parseInt(req.query.id); i < count_award - 1; i++)
            award[i] = award[i + 1]
        if (award.length > 0) {
            count_award--
            award.length--
        }
        res.send("提示<br>(删除成功)")
    }
    else
        res.send("警告<br>(删除出错)")
})

// 监听端口启动服务
app.listen(8000, () => {
    console.log("服务启动，8000端口监听ing...");
})


//for test
/*
    for(var i=0;i<count_award;i++)
        console.log(content[i])
*/
