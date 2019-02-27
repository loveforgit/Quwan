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
        this.nodeWidth = 160;
        this.nodeHeight = 113;
    },

    refreshView (tingPaiDatas) {
        cc.log(tingPaiDatas,"tingpaile----------------")
        for (var i = 0; i < tingPaiDatas.length; i++) {
            var tingPaiData = tingPaiDatas[i];
            var tipNode = cc.instantiate(this.node_tip);
            tipNode.active = true;
            tipNode.parent = this.layout_tip.node;
            var sprMj = tipNode.getChildByName("spr_pai").getComponent(cc.Sprite);
            var rtextPaiCount = tipNode.getChildByName("rtext_paiCount").getComponent(cc.RichText);
            var rtextFanShu = tipNode.getChildByName("rtext_fanShu").getComponent(cc.RichText);
           if(tingPaiData.pai == 55){
                sprMj.spriteFrame =cc.globalMgr.mahjongmgr.getSpriteAnyByMJID()
           }
           else{
                sprMj.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",tingPaiData.pai);
           }
            rtextPaiCount.string = tingPaiData.zhang + "张";
            rtextFanShu.string = tingPaiData.fanshu + "番";

            
        }
    },
});
