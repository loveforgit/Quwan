//by yky
cc.Class({
    extends: cc.Component,

    properties: {
        label_tips:{
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    setTips(str){
        this.label_tips.string = str;
    },

    start () {

    },

    // update (dt) {},
});
