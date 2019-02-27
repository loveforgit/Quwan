var cmd = require("CMD_mahjong")

cc.Class({
    extends: cc.Component,

    properties: {
        node_myTip: {
            default: null,
            type: cc.Node,
        },
        spr_dingqueLeft: {
            default: null,
            type: cc.Node,
        },
        spr_dingqueRight: {
            default: null,
            type: cc.Node,
        },
        spr_dingqueUp: {
            default: null,
            type: cc.Node,
        },
        node_tongSelectBg: {
            default: null,
            type: cc.Node,
        },
        node_tiaoSelectBg: {
            default: null,
            type: cc.Node,
        },
        node_wanSelectBg: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad () {
        
    },

    refreshView (flag) {
        this.node_tongSelectBg.active = flag;
        this.node_tiaoSelectBg.active = flag;
        this.node_wanSelectBg.active = flag;
        this.node_myTip.active = !flag;
        this.spr_dingqueLeft.active = !flag;
        this.spr_dingqueRight.active = !flag;
        this.spr_dingqueUp.active = !flag;
    },

    btnTongSelected () {
        this.dingQueSend(1);
    },

    btnTiaoSelected () {
        this.dingQueSend(2);
    },

    btnWanSelected () {
        this.dingQueSend(3);
    },

    dingQueSend (type) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.DING_QUE_SEND;
        data.dingQueType = type;       //提交 定缺 1.筒 2. 条 3.万

        G.socketMgr.socket.send(G.gameNetId, data);
    },

    refreshDingQueView (seat) {
        if (seat === 0) {
            this.node_myTip.active = false;
        } else if (seat === 1) {
            this.spr_dingqueRight.active = false;
        } else if (seat === 2) {
            this.spr_dingqueUp.active = false;
        } else if (seat === 3) {
            this.spr_dingqueLeft.active = false;
        } 
        this.refreshDingQueNode();
    },

    refreshDingQueNode () {
        if (!this.node_myTip.active && !this.spr_dingqueRight.active && !this.spr_dingqueUp.active && !this.spr_dingqueLeft.active) {
            this.node.active = false;
        }
    },

    refreshBestDingQue (data) {
        if (data.zuiJiaDingQue === 1) {
            this.node_tongSelectBg.active = true;
        } else if (data.zuiJiaDingQue === 2) {
            this.node_tiaoSelectBg.active = true;
        } else if (data.zuiJiaDingQue === 3) {
            this.node_wanSelectBg.active = true;
        }
    },
});
