
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        label_ju: {
            default: null,
            type: cc.Label
        },
        content: {
            default: null,
            type: cc.Node
        },

        item: {
            default: null,
            type: cc.Node
        },

        orderdetailid: 0
    },

    onLoad() {
        this.orderid = 0
        this.data;
    },
    updateNewScore(infoScore, newOrderid) {
        this.orderid = newOrderid
        for (var i = 0; i < infoScore.length; i++) {
            var item = cc.instantiate(this.item)
            item.getChildByName("name").getComponent(cc.Label).string = this.FormatName(infoScore[i].f_nick + ":");
            item.getChildByName("score").getComponent(cc.Label).string = infoScore[i].defen;
            this.content.addChild(item)
            item.setPosition(38 + (i * (item.width + 200)), 0)
            item.active = true
            this.orderdetailid = infoScore[i].orderdetailid;
            this.label_ju.string = "第" + this.orderdetailid + "局"
        }
        this.content.width = (infoScore.length + 0.1) * 100

    },
    start() {

    },
    OnClickRePlay: function () {
        //添加音效
        this.playClickMusic()
        var urlReq = "http://" + G.IP + ":" + G.PORT + "/?reqtype=getGameRecord&uid=" + G.myPlayerInfo.uid + "&orderId=" + this.orderid + "&round=" + this.orderdetailid
        this.getHttpJson(urlReq)
    },
    getHttpJson(curUrl) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", curUrl, true);
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                try {
                    // if(callback)
                    // {
                    // var obj=JSON.parse(response);
                    // var obj=response;
                    cc.log("查看版本返回数据：", response);
                    var obj = JSON.parse(response);
                    var data = JSON.parse(obj.data)
                    var dataZi = JSON.parse(data[0][0])
                    // cc.log(dataZi,"----------------datazi----------------------")
                    cc.globalMgr.GameRePlayControl.RePlayEnterRoom(35, data)
                    // }
                }
                catch (e) {
                    cc.log(e.message);
                }
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                try {
                    cc.log("http 应答错误:" + xhr.status);
                    if (callback) {
                        callback(target, null);
                    }
                }
                catch (e) {
                    cc.log(e.message);
                }
            }

        };
        xhr.send();
        cc.log("查看强更发送数据:", curUrl);
    },

    isUpdateForVersion: function isUpdateForVersion(target, data) {
        cc.log(data, "=================")
    },

    OnClickClose: function () {
        //添加音效
        this.playClickMusic()

        this.node.destroy();
    },

});
