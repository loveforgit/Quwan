cc.Class({
    extends: cc.Component,

    properties: {
        rtext_name: {
            default: null,
            type: cc.RichText,
        },
        rtext_id: {
            default: null,
            type: cc.RichText,
        },
        rtext_winTimes: {
            default: null,
            type: cc.RichText,
        },
        rtext_zimoTimes: {
            default: null,
            type: cc.RichText,
        },
        rtext_dianpaoTimes: {
            default: null,
            type: cc.RichText,
        },
        rtext_totalResult: {
            default: null,
            type: cc.RichText,
        },
        node_head: {
            default: null,
            type: cc.Node,
        },
        spr_owner: {
            default: null,
            type: cc.Sprite,
        },
        spr_winner: {
            default: null,
            type: cc.Sprite,
        },
        spr_head: {
            default: null,
            type: cc.Sprite,
        },
        spr_bg: {
            default: null,
            type: cc.Sprite,
        },
        spr_bgFrame: {
            default: [],
            type: cc.SpriteFrame,
        },
        spr_add: {
            default: null,
            type: cc.Sprite,
        },
        spr_reduce: {
            default: null,
            type: cc.Sprite,
        },
        label_totalResult1: {
            default: null,
            type: cc.Label,
        },
        label_totalResult2: {
            default: null,
            type: cc.Label,
        },
        label_dianPao: {
            default: null,
            type: cc.RichText,
        }, 
        label_jiePao: {
            default: null,
            type: cc.RichText,
        },
    },

    refreshView (info) {
        this.rtext_id.string = "ID:" + info.wxid;
        this.rtext_winTimes.string = info.gangcountan + "";
        this.rtext_zimoTimes.string = info.zimocount + "";
        this.rtext_dianpaoTimes.string = info.gangcountming + "";
        this.rtext_name.string = info.name;
        this.label_dianPao.string = info.dianpaocount + "";
        this.label_jiePao.string = info.jiepaocount + "";
        cc.log(info,"大结算信息")
        // if (info.zongdefen > 0) {
        //     this.rtext_totalResult.string = "+" + info.zongdefen;
        //     this.rtext_totalResult.node.color = new cc.Color(255, 0, 0);
        // } else if (info.zongdefen <= 0) {
        //     this.rtext_totalResult.string = info.zongdefen + "";
        //     this.rtext_totalResult.node.color = new cc.Color(0, 255, 0);
        // }
        if (info.zongdefen > 0) {
            this.spr_add.node.active = true;
            this.label_totalResult1.node.active = true;
            this.label_totalResult1.string = info.zongdefen;
        } else if (info.zongdefen <= 0) {
            this.spr_reduce.node.active = true;
            this.label_totalResult2.node.active = true;
            this.label_totalResult2.string = info.zongdefen;
        }
    },

    refreshName (name) {
        //this.rtext_name.string = cc.globalMgr.globalFunc.FormatName(name);
        if(name != undefined){
            this.rtext_name.string = this.FormatName(name);
        }
    },
     //格式化名字
     FormatName(name) {
        var tempName = name
        if (!tempName) {
            return;
        }
        if (name.length > 5) {
            tempName = name.substring(0, 5)
            tempName = tempName + "..."
        }

        return tempName + ''
    },
    refreshHead (image) {
        if(image != undefined){
            cc.globalMgr.globalFunc.getUrlHead(this.spr_head, image, 70);
        }
    },

    refreshOwner (flag) {
        this.spr_owner.node.active = flag;
    },

    refreshWin (flag) {
        this.spr_winner.node.active = flag;
    },

    refreshItem (index) {
        if (index === 0 || index === 2) {
            this.spr_bg.spriteFrame = this.spr_bgFrame[0];
        } else {
            this.spr_bg.spriteFrame = this.spr_bgFrame[1];
        }
    },
});
