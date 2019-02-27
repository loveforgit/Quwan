var cmd = require("CMD_mahjong")

cc.Class({
    extends: cc.Component,

    properties: {
        layout_tip: {
            default: null,
            type: cc.Layout,
        },
        node_tip: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad () {

    },

    refreshVirtualFiveView (gangVirtualFiveArr) {
        this.layout_tip.node.removeAllChildren(true);
        for (var i = 0; i < gangVirtualFiveArr.length; i++) {
            var gangPai = gangVirtualFiveArr[i];
            var tipNode = cc.instantiate(this.node_tip);
            tipNode.active = true;
            tipNode.mjId = gangPai;
            tipNode.parent = this.layout_tip.node;
            var sprMj = tipNode.getComponent(cc.Sprite);

            sprMj.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",gangPai);

            tipNode.on('touchend', function (event) {
                console.log('click mj:',event.target.mjId);
                this.gangSend(event.target.mjId);   //提交走碰杠吃胡的消息
            }, this);
        }
    },

    gangSend (mjId) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.PENG_GANG_HU_OPT_SMALLID_SED;
        data.beiuid = "";   
        data.pai = mjId;    //杠的牌 
        data.type = 1;      //1 杠
        data.chitype = "";  

        G.socketMgr.socket.send(G.mahjongMoPingGameId, cc.globalMgr.msgObjs.pengGangHuSend(data));
    },
});
