var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        lab_input: {
            default: null,
            type: cc.EditBox
        },

        image: {
            default: null,
            type: cc.Sprite
        },

        userName: {
            default: null,
            type: cc.Label
        },

        userId: {
            default: null,
            type: cc.Label
        }
    },

    onClickSengEvent() {
        cc.log(this.userName instanceof Object)
    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
