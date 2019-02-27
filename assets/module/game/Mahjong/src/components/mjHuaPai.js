cc.Class({
    extends: cc.Component,

    properties: {
        layout_tip: {
            default: null,
            type: cc.Layout,
        },
        spr_pai: {
            default: null,
            type: cc.Node,
        },
    },

    refreshView (huaPaiArrs, seatIndex) {
        this.layout_tip.node.removeAllChildren(true);
        var pre = cc.globalMgr.mahjongmgr.getFoldPre(seatIndex);
        for (var i = 0; i < huaPaiArrs.length; i++) {
            var mjId = huaPaiArrs[i];
            var mjNode = cc.instantiate(this.spr_pai);  // 直接绑定精灵好像不行
            mjNode.active = true;
            mjNode.parent = this.layout_tip.node;

            var mjSprite = mjNode.getComponent(cc.Sprite);
            mjSprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre, mjId);
            mjSprite.node.pre = pre;
            mjSprite.node.mjId = mjId;
        }
    },
});
