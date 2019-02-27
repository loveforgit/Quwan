var chatConfig = require("ChatConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        label_msgChat: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad() {
        this.times = 0;
    },


    setMsg(gameId, msgId) {
        this.times = 0;
        var msgTables = chatConfig.chatTextTable[gameId];
        var msgStr = msgTables[msgId];
        this.label_msgChat.string = msgStr;
    },

    update(dt) {
        this.times += dt;
        if (this.times > 3) {
            this.node.active = false
        }
    },

});
