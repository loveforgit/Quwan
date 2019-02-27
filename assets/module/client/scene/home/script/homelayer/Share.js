
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {

    },

    // onLoad () {},

    //分享朋友圈
    OnClickWXpyq: function () {
        //添加音效
        this.playClickMusic()
        cc.log("--分享微信朋友圈--")
        var posterUrl = G.myPlayerInfo.shareImageUrl
        cc.log("分享链接 :" + posterUrl)
        cc.globalMgr.XlSDK.getInstance().shareDownloadPic(posterUrl, "欢乐棋牌", G.shareHttpServerPath, "", "1");
    },

    //分享微信好友
    OnClickWXhy: function () {
        //添加音效
        this.playClickMusic()
        cc.log("--分享微信好友--")
        this.wxShare("欢乐棋牌", G.shareHttpServerPath, "郑州本地特色麻将，炸金花，牛牛，好友约牌都可以，快来一起玩吧。", "0", "2")

    },
    start() {

    },
    OnClickClose: function () {
        //添加音效
        this.playClickMusic()

        this.node.destroy();
    },

});
