var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {
        playing: {
            default: null,
            type: cc.Label
        },
        Fee: {
            default: null,
            type: cc.Label
        },
        juShu: {
            default: null,
            type: cc.Label
        },
        beiShuShangXian: {
            default: null,
            type: cc.Label
        },
        kaiShiXuanXian: {
            default: null,
            type: cc.Label
        },
        moShiXuanXian: {
            default: null,
            type: cc.Label
        },

        teShu: {
            default: null,
            type: cc.Label
        },
    },






   onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
