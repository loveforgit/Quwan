var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        inputEditBox: {
            default: null,
            type: cc.EditBox
        },
    },


    onClickSendNoticeEvent() {
        var str = this.inputEditBox.string
    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
