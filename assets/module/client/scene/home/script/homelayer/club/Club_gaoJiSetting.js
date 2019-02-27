var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {

    },


    onToggleEvent(event, parame) {
        var isChecked = event.isChecked
        let togName = event.node.name
        cc.log("点击 ", togName, isChecked)
        if (parame == "Fee") {

        } else if (parame == "Fund") {

        }
        else if (parame == "Check") {

        }

    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
