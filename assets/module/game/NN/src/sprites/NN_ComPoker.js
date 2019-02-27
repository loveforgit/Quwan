
cc.Class({
    extends: cc.Component,

    properties: {

        pokerWidth: 45,
        normal: {
            default: null,
            type: cc.Node
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        maskLayout: {
            default: null,
            type: cc.Node
        },
        maskLayoutbg: {
            default: null,
            type: cc.Node
        },

    },
    setPoker: function (pokerValue, pokerColor) {
        var pok = pokerValue + pokerColor
        this.normal.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(pok);
    },

    
    biaoEnabeld()
    {

    },

});
