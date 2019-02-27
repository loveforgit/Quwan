var comm = require("Comm")
var cmd = require("CMD_mahjong")
cc.Class({
    extends: comm,

    properties: {

        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Node
        },
    },
    onLoad: function () {
        this.content = this.scrollView.content;
        this.items;
        this.orderids = 0;
        this.nameArray = [];
        this.scoreArray = [];
    },
    requireRePlay(gameType, orderid) {
        this.items = [];
        this.orderids = orderid;
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid
        obj.orderid = orderid
        obj.gameType = gameType
        cc.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        this.send(cmd.ROOMREPLAYINFO, obj)
        this.regist(cmd.ROOMREPLAYINFO, this, this.openResult)
    },
    openResult(msgNumber, body, target) {
        cc.log(body, "监听回放")
        target.updateSmallInfo(body.listxiao);
    },

    updateSmallInfo(body) {
        this.content.height = body.length * 80 + 10;
        for (var i = 0; i < body.length; ++i) {
            var item = cc.instantiate(this.itemTemplate);
            cc.log("--初始化--", i)
            this.content.addChild(item);
            item.setPosition(0, -60 - (i * (item.height + 2)));
            item.getComponent("RePlayNumItem").updateNewScore(body[i].listxiaojiesuan, this.orderids);
        }

    },

    updateHead(spHead, headUrl) {
        cc.loader.load({ url: headUrl, type: 'png' }, function (err, tex) {
            spHead.spriteFrame = new cc.SpriteFrame(tex)
        });
    },

    onClickShare() {
        this.playClickMusic()
        var title = "9桌棋牌";
        if (G.gameNetId === 3800) {
            title = "划水麻将";
        } else if (G.gameNetId === 3900) {
            title = "红中麻将";
        }
        this.wxShare(title, G.shareHttpServerPath, "结算", "0", 1)
    },

    onClickClose() {
        this.node.destroy()
    }
});
