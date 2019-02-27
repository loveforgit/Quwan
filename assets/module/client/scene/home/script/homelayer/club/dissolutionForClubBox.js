var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        dissolveEditBox: {
            default: null,
            type: cc.EditBox
        },

        dissolveNode: {
            default: null,
            type: cc.Node
        },
        quitNode: {
            default: null,
            type: cc.Node
        },

    },
    onLoad() {
    },

    selectFun(isBool) {
        this.isFunction = isBool  // true  解散    false   退出
        this.dissolveNode.active = isBool
        this.quitNode.active = !isBool
    },

    //确定
    onSureClick: function () {
        if (this.isFunction == true) {
            this.onDissolution()
        } else {
            this.onQuitClub()
        }
    },
    //确定 解散俱乐部
    onDissolution() {
        if (this.dissolveEditBox.string == "同意") {
            var obj = new Object();
            obj.uid = G.myPlayerInfo.uid;
            obj.zinetid = cc.globalMgr.msgIds.SMALL_DISSOLUTION_CLUB;
            obj.clubId = G.saveClubID
            this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
            this.node.destroy();
        }
    },

    //确定 退出俱乐部
    onQuitClub() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SAMLL_EXIT_CLUB;
        obj.clubId = G.saveClubID
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        this.node.destroy();
    },

    //关闭
    onCloseClick: function () {
        this.node.destroy();
    },

});
