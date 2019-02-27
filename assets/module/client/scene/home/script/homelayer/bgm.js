
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        preafb_bgm: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        cc.log("--bgm----")
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid;
        G.socketMgr.socket.send(cc.globalMgr.msgIds.LOOK_AGENT_RESPONSE, obj);
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.LOOK_AGENT_RESPONSE, this, this.OnAgentButtonFunc); // 绑定代理
    },


    OnClickClose() {
        this.node.destroy();
    },
    copyBGType(sun, event) {
        switch (event) {
            case "copyDaili":
                var daili = this.preafb_bgm.getChildByName("spr_agenback").getChildByName("Label_wxvipcn").getChildByName("label_num").getComponent(cc.Label).string;
                cc.log("--复制代理信息---", daili)
                this.copyString(daili);
                break;
            case "copyWeixin":
                var weixin = this.preafb_bgm.getChildByName("spr_agenback").getChildByName("Label_wxgm").getChildByName("label_num").getComponent(cc.Label).string;
                cc.log("--复制微信信息---", weixin)
                this.copyString(weixin);
                break;
        }
    },
    OnAgentButtonFunc(sub, body, target) {
        cc.log("---代理信息----", body)
        target.preafb_bgm.getChildByName("spr_agenback").getChildByName("Label_wxvipcn").getChildByName("label_num").getComponent(cc.Label).string = body.keFuWxNum
        target.preafb_bgm.getChildByName("spr_agenback").getChildByName("Label_wxgm").getChildByName("label_num").getComponent(cc.Label).string = body.keFuWxNum1

    }

    // update (dt) {},
});
