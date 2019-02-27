var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        node_ex: {
            default: null,
            type: cc.Node
        },
        node_bt: {
            default: null,
            type: cc.Node
        },
        node_lab: {
            default: null,
            type: cc.Node
        },
        // node_bangAgent: {
        //     default: null,
        //     type: cc.Node
        // }

    },

    onLoad() {
        this.AgentNum = 0;
        this.AgentInit();
    },
    AgentInit: function () {
        cc.log("---推荐码-sss--", G.myPlayerInfo.tuijianma)
        if (G.myPlayerInfo.tuijianma > 0) {
            cc.log("---有推荐码---", G.myPlayerInfo.tuijianma)
            this.node_ex.active = false;
            this.node_bt.active = false;
            this.node_lab.active = true;
            // this.node_clearAgent.active = true;
            this.node_lab.getComponent(cc.Label).string = G.myPlayerInfo.tuijianma;
        }
        else {
            cc.log("---没有推荐码---", G.myPlayerInfo.tuijianma)
            this.node_ex.active = true;
            this.node_bt.active = true;
            this.node_lab.active = false;
            this.node_lab.getComponent(cc.Label).string = G.myPlayerInfo.tuijianma;
        }

    },

    start() {

    },
    OnClickClose: function () {
        this.playClickMusic()
        this.node.destroy();
    },

    ///输入代理商
    onEditDidEnded: function (editbox, customEventData) {
        this.AgentNum = editbox;
    },
    OnClickBangAgent: function () {
        this.playClickMusic()
        var uid = G.myPlayerInfo.uid;
        var agetn = this.AgentNum
        cc.log("----绑定代理----", this.AgentNum)
        G.socketMgr.socket.send(cc.globalMgr.msgIds.BINGDING_AGENT_RESPONSE, cc.globalMgr.msgObjs.BingDingAgent(uid, agetn));
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.BINGDING_AGENT_RESPONSE, this, this.OnAgentButtonFunc); // 绑定代理
    },
    OnAgentButtonFunc(msgNumber, body, target) {
        if (body.msg) {
            target.AgentInit();
            cc.globalMgr.globalFunc.addMessageBox(body.msg);
        }
    },
    // //解除绑定
    // OnClickchaneAgent: function () {
    //     var uid = G.myPlayerInfo.uid;
    //     G.socketMgr.socket.send(cc.globalMgr.msgIds.CHANE_AGENT_RESPONSE, cc.globalMgr.msgObjs.SingInDay(uid));
    //     cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.CHANE_AGENT_RESPONSE, this, this.OnChaneAgentButtonFunc); // 解除代理
    // },
    // OnChaneAgentButtonFunc(msgNumber, body, target) {
    //     if (body.msg) {
    //         target.AgentInit();
    //         cc.globalMgr.globalFunc.addMessageBox(body.msg);
    //     }
    // },

    onDestroy: function () {
        cc.globalMgr.service.getInstance().unregist(this)

    },
});
