var cmd = require("CMD_mahjong")

cc.Class({
    extends: cc.Component,

    properties: {
        node_btnNoPao: {
            default: null,
            type: cc.Node,
        },
    },

    btnOnNoPao () {
        this.paoFenSend(0);
    },

    btnOnPaoOne () {
        this.paoFenSend(1);
    },

    btnOnPaoTwo () {
        this.paoFenSend(2);
    },

    btnOnPaoThr () {
        this.paoFenSend(3);
    },

    paoFenSend (paoFen) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.PAOFEN_NETID;
        data.paoFen = paoFen;

        G.socketMgr.socket.send(G.gameNetId, data);
    },

    refreshBtnView (flag) {
        this.node_btnNoPao.active = flag;
    },
});
