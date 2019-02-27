var comm = require("Comm")
var msgIds = require("MsgIds")
cc.Class({
    extends: comm,

    properties: {
        node_suggest: {
            default: null,
            type: cc.Node
        },
        node_feedback: {
            default: null,
            type: cc.Node
        },
        editBox_suggest: {
            default: null,
            type: cc.EditBox
        },
        editBox_feedback: {
            default: null,
            type: cc.EditBox
        },
        editBox_relation: {
            default: null,
            type: cc.EditBox
        },
    },

    onLoad() {

    },

    start() {

    },

    //关闭窗口
    OnClickClose() {
        this.node.destroy();
    },

    //选择投诉还是提建议
    OnClickSelect: function (event, customEventData) {
        switch (customEventData) {
            case "1":
                this.node_suggest.active = true;
                this.node_feedback.active = false;
                break
            case "2":
                this.node_suggest.active = false;
                this.node_feedback.active = true;
        }
    },

    //提交
    OnClickRefer: function () {
        if (this.node_suggest.active == true && this.node_feedback.active == false) {
            var obj = new Object();
            obj.uid = G.myPlayerInfo.uid;
            obj.fankui = this.editBox_suggest.string;
            obj.phoneNum = this.editBox_relation.string;
            obj.zinetid1 = cc.globalMgr.msgIds.WRITE_FEEDBACK_SUGGEST;
            this.send(cc.globalMgr.msgIds.WRITE_FEEDBACK, obj)
        }
        else {
            var obj = new Object();
            obj.uid = G.myPlayerInfo.uid;
            obj.fankui = this.editBox_feedback.string;
            obj.phoneNum = this.editBox_relation.string;
            obj.zinetid2 = cc.globalMgr.msgIds.WRITE_FEEDBACK_QUESTION;
            this.send(cc.globalMgr.msgIds.WRITE_FEEDBACK, obj)
        }
    },
});
