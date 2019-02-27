
cc.Class({
    extends: cc.Component,

    properties: {
        spr_card: {
            default: null,
            type: cc.Sprite
        },
        spr_currentCard: {
            default: null,
            type: cc.Sprite
        }
    },
    onLoad() {
        this.currentCard = null;
        this.InitDrawCard();
    },
    InitDrawCard() {
        cc.log("---播放翻牌动画--")
        var anima = this.spr_card.getComponent(cc.Animation);
        anima.play("nnFanCard");
        this.scheduleOnce(function () {
            this.OnChangeCard();
        }, 0.2)
        this.schedule(this.GetAnimaIsStopfunc, 1);
    },
    //替换牌面
    OnChangeCard() {
        this.spr_card.spriteFrame = this.spr_currentCard.spriteFrame
    },
    SetDrawCardGameLayer(card, poker) {
        cc.log("----翻牌card---", card)
        cc.log("----翻牌poker--", poker)
        if (card != null || card != undefined) {
            this.spr_card.node.width = card.width;
            this.spr_card.node.height = card.height;
            this.currentCard = card;
            this.currentCard.active = false;
            this.spr_currentCard.spriteFrame = card.getComponent(cc.Sprite).spriteFrame
        }
    },
    //动画播放完毕 一系列处理
    AnimaIsStopfunc() {
        cc.log("---动画播放完毕=")
        this.unschedule(this.GetAnimaIsStopfunc)
        if (this.currentCard) {
            this.currentCard.active = true;
        }
        //this.node.destroy();
    },
    //判断动画是否播放完毕
    GetAnimaIsStopfunc() {
        var anima = this.spr_card.getComponent(cc.Animation);
        if (anima.stop) {
            this.AnimaIsStopfunc()
        }
        cc.log("---正在播放--")
    },
});
