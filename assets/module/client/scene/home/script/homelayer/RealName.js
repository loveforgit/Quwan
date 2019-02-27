
var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        editbox_name: {
            default: null,
            type: cc.EditBox
        },
        editbox_SFZ: {
            default: null,
            type: cc.EditBox
        },
        label_name: {
            default: null,
            type: cc.Label
        },
        label_SFZ: {
            default: null,
            type: cc.Label
        },
        node_ok: {
            default: null,
            type: cc.Node
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.userinfo();
    },

    start() {

    },
    OnClicKEndReal: function () {
        this.playClickMusic()

        this.node.destroy();
        cc.log("--点击关闭--")

    },
    //提交认证
    OnClickEndRealTO: function () {
        cc.log("---id---", this.realName)
        cc.log("---name---", this.realSfz)
        var uid = G.myPlayerInfo.uid;
        G.socketMgr.socket.send(cc.globalMgr.msgIds.RESAL_NAME, cc.globalMgr.msgObjs.realName(uid, this.realSfz, this.realName));
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.RESAL_NAME, this, this.onRealNameButtonFunc);
    },
    ///输入身份证
    onEditDiSfz: function (editbox, customEventData) {
        cc.log("---editbox-11111--", editbox)
        cc.log("---customEventData---", customEventData)
        this.realName = editbox;
    },
    onEditClickSfz: function (editbox, customEventData) {
        this.editbox_SFZ.string = "";

    },
    onEditClickName: function (editbox, customEventData) {
        this.editbox_name.string = "";

    },
    OnEditName: function (editbox, customEventData) {
        this.realSfz = editbox;
    },
    //信息
    userinfo() {
        this.realName = 0;
        this.realSfz = 0;
        if (G.myPlayerInfo.isrenzheng) {

            this.label_name.node.active = true;
            this.label_SFZ.node.active = true;
            this.label_name.string = this.FormatName(G.myPlayerInfo.realname);
            this.label_SFZ.string = G.myPlayerInfo.cardid;
            this.editbox_name.node.active = false;
            this.editbox_SFZ.node.active = false;
            this.node_ok.active = false;
            // cc.log("--name--", G.myPlayerInfo.realname)
            // cc.log("--id--", G.myPlayerInfo.cardid)
            // this.node_end.active = false;

        }

    },
    onRealNameButtonFunc: function (msgNumber, body, target) {
        if (body.msg == "认证成功") {
            cc.log("--认证成功，可以关闭面板---")
            target.node.destroy();
        }
    },

    // btnOnSupplement() {
    //     var stringForTips = "待开发，敬请期待。。。";
    //     var parent = this.node;
    //     cc.globalMgr.globalFunc.addTips(stringForTips, parent);
    // },

});
