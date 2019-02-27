var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        preafb_bgm: {
            default: null,
            type: cc.Node
        }

    },


    start() {

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
    }

    // update (dt) {},
});
