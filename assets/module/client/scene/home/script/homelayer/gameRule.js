var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        toggle_Method: {
            default: null,
            type: cc.ToggleContainer,
        },
        node_playMethod: {
            default: [],
            type: cc.Node,
        }
    },
    checkPlayMtehod(node) {
        for (var i = 0; i < this.node_playMethod.length; i++) {
            this.node_playMethod[i].active = false;
        }
        node.active = true;
        node.parent.height = node.height;
        // cc.log("-高度为----------", node.height, node.parent.height)
    },

    toggleOn(event, customEventData) {
        switch (customEventData) {
            case "maJiangMethod":
                this.checkPlayMtehod(this.node_playMethod[0])
                break;
            case "zhaJinHuaMethod":
                this.checkPlayMtehod(this.node_playMethod[2])
                break;
            case "niuNiuMethod":
                this.checkPlayMtehod(this.node_playMethod[1])
                break;
            case "ddzMethod":
                this.checkPlayMtehod(this.node_playMethod[3])
                break;

        }
    },
    OnClickClose: function () {
        this.playClickMusic()

        this.node.destroy();
    },
    // onLoad () {},

    start() {

    },

});


