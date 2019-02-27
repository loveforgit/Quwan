cc.Class({
    extends: cc.Component,

    properties: {
        spr_animFrame: {
            default: null,
            type: cc.Sprite,
        },
        atlas_anim:{
            default:null,
            type:cc.SpriteAtlas,
        },
    },

    setSpriteFrame (frameName) {
        this.spr_animFrame.spriteFrame = this.atlas_anim.getSpriteFrame(frameName);
    },
});
