var chatConfig = require("ChatConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        label_msgChatNode: {
            default: null,
            type: cc.Label,
        },
        label_msgChat: {
            default: null,
            type: cc.Label,
        },
        spr_chatBox: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        this.times = 0;
        this.dir = 1;
    },


    setMsg(gameId, msgId, addName) {
        cc.log("-----查看游戏ID：", gameId);
        var msgTables = chatConfig.chatTextTable[gameId];
        if(addName != null){
            var msgStr = addName + ":" + " " + msgTables[msgId];
            // cc.log("-------名字:", msgStr);
        }
        else{
            var msgStr = msgTables[msgId];
        }
        // var msgStr = msgTables[msgId];
        cc.log("-------查看文字内容：", msgStr);
        this.label_msgChatNode.string = msgStr;
        this.label_msgChat.string = msgStr;
    },

    // dir = 1 左边  dir = -1 右边
    setDir(dir) {
        this.spr_chatBox.scale = dir;
        this.dir = dir;
    },

    setPos(pos) {
        if (this.dir == 1) {
            this.node.position = pos;
            cc.log("------定位：", pos);
        } else if (this.dir == -1) {
            var pos = cc.p(-this.node.width + pos.x, pos.y);
            this.node.position = pos;
        }
    },

    update(dt) {
        this.times += dt;
        if (this.times > 3) {
            this.node.destroy();
        }
    },
    //设置输入文字
    setMsgForInput(msgId, addName) {
        if(addName != null){
            this.label_msgChatNode.string = addName + ":" + " " + msgId;
            this.label_msgChat.string = addName + ":" + " " + msgId;
            // cc.log("-------输入加名字:", msgStr);
        }
        else{
            this.label_msgChatNode.string = msgId;
            this.label_msgChat.string = msgId;
        }
        // this.label_msgChatNode.string = msgId;
        // this.label_msgChat.string = msgId;
    },
});
