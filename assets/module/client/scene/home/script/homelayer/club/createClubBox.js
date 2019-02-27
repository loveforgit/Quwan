var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        inputTex: {
            default: null,
            type: cc.EditBox
        },
    },

    //确定
    onSureClick: function () {
        if (this.inputTex.string != "") {
            this.sendForCreateClub();
        }
        this.node.active = false;
    },

    //发送创建俱乐部消息
    sendForCreateClub: function () {

        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_CREATE_CLUB;
        obj.clubName = this.inputTex.string;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        cc.log("创建俱乐部请求发送了");

    },

    //关闭
    onCloseClick: function () {
        this.node.active = false;
    },

});
