cc.Class({
    extends: cc.Component,

    properties: {
        spr_arrowMy: {
            default: null,
            type: cc.Sprite,
        },
        spr_arrowRight: {
            default: null,
            type: cc.Sprite,
        },
        spr_arrowUp: {
            default: null,
            type: cc.Sprite,
        },
        spr_arrowLeft: {
            default: null,
            type: cc.Sprite,
        },
        label_time: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad () {
        this.refreshAllArrowActive(false);
        this._countDown = false;
        this._lastTime = 15;
        this._countTime = 0;
    },

    refreshAllArrowActive (flag) {
        this.spr_arrowMy.node.active = flag;
        this.spr_arrowRight.node.active = flag;
        this.spr_arrowUp.node.active = flag;
        this.spr_arrowLeft.node.active = flag;
    },

    refreshArrow (seatIndex) {
        this.refreshAllArrowActive(false);
        this._countDown = true;
        this._lastTime = 15;
        this._countTime = 0;
        this.label_time.string = this._lastTime;

        switch(seatIndex) {
            case cc.globalMgr.seatIndexType.seatIndexType_me: {
                this.spr_arrowMy.node.active = true;
            }
                break;
            case cc.globalMgr.seatIndexType.seatIndexType_right: {
                this.spr_arrowRight.node.active = true;
            }
                break;
            case cc.globalMgr.seatIndexType.seatIndexType_up: {
                this.spr_arrowUp.node.active = true;
            }
                break;
            case cc.globalMgr.seatIndexType.seatIndexType_left: {
                this.spr_arrowLeft.node.active = true;
            }
                break;
            default:
                break;
        }
    },

    update (dt) {
        if (this._countDown) {
            this._countTime += dt;
            if (this._countTime >= 1) {
                this._countTime = 0;
                this._lastTime -= 1;
                this.label_time.string = this._lastTime;
                if (this._lastTime === 0) {
                    this._countDown = false;
                }
            }
        }
    },
});
