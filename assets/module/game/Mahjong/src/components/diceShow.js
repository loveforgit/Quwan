
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //筛子点数
        atlas_dice: {
            default: null,
            type: cc.SpriteAtlas
        },

        sp_dice_1: {
            default: null,
            type: cc.Sprite
        },

        sp_dice_2: {
            default: null,
            type: cc.Sprite
        },
    },

    onLoad () {
        this._diceValue01 = 0;
        this._diceValue02 = 0;
    },


    start () {

    },

    //设置点数
    setPoint(data01, data02){
        this._diceValue01 = data01;
        this._diceValue02 = data02;

        this.diceShow();
    },

    diceShow:function(){
        if(this._diceValue01 == 0 || this._diceValue02 == 0){
            return;
        }
        
        cc.log("-----点数显示:", this.node, this._anim)
        var dice_01 = this.sp_dice_1;
        var dice_02 = this.sp_dice_2;
        dice_01.getComponent(cc.Sprite).node.active = true
        dice_02.getComponent(cc.Sprite).node.active = true
        dice_01.spriteFrame = this.atlas_dice.getSpriteFrame("sp_tz" + this._diceValue01)
        dice_02.spriteFrame = this.atlas_dice.getSpriteFrame("sp_tz" + this._diceValue02)
        this.scheduleOnce(function () {
            dice_01.getComponent(cc.Sprite).node.active = false
            dice_02.getComponent(cc.Sprite).node.active = false

            this.node.destroy();
        }, 2)
    },

    OnDestroySelf:function(){
        cc.log("------销毁动画");
        this.node.destroy();
    },

});
