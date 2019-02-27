var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {

        text: {
            default: null,
            type: cc.Label
        },

        inputTex: {
            default: null,
            type: cc.EditBox
        },
    },

    onEnable() {
        var str = G.saveClubThis.readClubInfo(G.saveClubID)
        this.text.string = "您当前俱乐部的名称是：" + str
    },

    //确定
    onSureClick: function () {
        cc.log("确定被点击了-----------------------------------------");
        if (this.inputTex.string != "") {
            var obj = new Object();
            obj.uid = G.myPlayerInfo.uid;
            obj.zinetid = cc.globalMgr.msgIds.SMALL_RESET_CLUB;
            obj.clubId = G.saveClubID;
            obj.clubName = this.inputTex.string;
            this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        }
        this.node.destroy();
    },

    //关闭
    onCloseClick: function () {
        this.node.destroy();
    },

});
