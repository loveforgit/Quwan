cc.Class({
    extends: cc.Component,

    properties: {
        btnNodes: {  //按钮数组顺序按碰，杠，吃，胡
            default: [],
            type: cc.Node,
        },
        spr_mj: {
            default: null,
            type: cc.Sprite,
        },
    },

    refreshBtnView (mjArr, index) {
        for (var i = 0; i < this.btnNodes.length; i++) {
            var node = this.btnNodes[i];
            if (index === i) {
                node.active = true;
            } else {
                node.active = false;
            }
        }

        if (mjArr == null) {
            this.spr_mj.node.active = false;
        } else {
            this.spr_mj.node.active = true;
            for (var i = 0; i < mjArr.length; i++) {
                var mjId = mjArr[i];
                this.spr_mj.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",mjId);
            }
        }
    },
});
