var comm = require("Comm")

cc.Class({

    extends: comm,
    properties: {

    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
