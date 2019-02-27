var comm = require("Comm")
var MsgIds = require("MsgIds")
cc.Class({
    extends: comm,

    properties: {
        //公告板
        lable_notice: {
            default: null,
            type: cc.Label
        },


    },
    onLoad: function () {


        var data = new Object();
        data.uid = G.myPlayerInfo.uid;

        this.send(MsgIds.NOTICE, data);
        // 监听公告信息
        this.regist(MsgIds.NOTICE, this, this.setNotice)


    },

    setNotice(msgNumber, body, target) {
        // 获取公告显示出来
        target.lable_notice.string = body.msg;
        target.lable_notice.node.parent.height = target.lable_notice.node.height;
        cc.log("公告信息：：：：：：：：：：；", target.lable_notice.node.parent.height, target.lable_notice.node.height)
    },


    OnClickClose: function () {
        this.playClickMusic()

        this.node.destroy();
    },
    // onLoad () {},

    start() {

    },

});