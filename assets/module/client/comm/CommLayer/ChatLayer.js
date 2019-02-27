var chatConfig = require("ChatConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        scroll_msg: {
            default: null,
            type: cc.ScrollView,
        },
        scroll_face: {
            default: null,
            type: cc.ScrollView,
        },
        scroll_msgContent: {
            default: null,
            type: cc.Node,
        },
        scroll_faceContent: {
            default: null,
            type: cc.Node,
        },
        node_msgItem: {
            default: null,
            type: cc.Node,
        },
        node_faceItem: {
            default: null,
            type: cc.Node,
        },
        altas_face: {
            default: null,
            type: cc.SpriteAtlas,
        },
        node_faceRowItem: {
            default: null,
            type: cc.Node,
        },
        node_input: {
            default: null,
            type: cc.EditBox
        }
    },

    onLoad() {
        this.scrollWidth = 302;
        this.msgItemHeight = 50;
        this.faceWidth = 100;
        this.faceItemHeight = 100;
        this.gameId = 0;
        this._str = 0;
    },

    refreshView(gameId) {
        this.gameId = gameId;
        this.initMsgScrollView();
        this.initFaceScrollView();
    },

    initMsgScrollView() {
        var totolHeight = 0;
        var msgTables = chatConfig.chatTextTable[this.gameId];
        var self = this;
        Object.keys(msgTables).forEach(function (key) {
            var msgItem = cc.instantiate(self.node_msgItem);
            msgItem.parent = self.scroll_msgContent;
            msgItem.active = true;
            msgItem.position = cc.p(0, -i * self.msgItemHeight);
            msgItem.msgId = key;
            totolHeight += self.msgItemHeight;

            var msgText = msgItem.getChildByName("label_msg").getComponent(cc.Label);
            msgText.string = msgTables[key];
        })
        this.scroll_msgContent.setContentSize(this.scrollWidth, totolHeight);
    },

    initFaceScrollView() {
        var totalHeight = 0;
        var index = 0;
        var rowCount = 3;
        var rowIndex = 0;
        var lineIndex = 0;
        var self = this;

        var faceRowNode = cc.instantiate(this.node_faceRowItem);
        faceRowNode.parent = self.scroll_faceContent;
        faceRowNode.active = true;
        faceRowNode.position = cc.p(-this.scrollWidth / 2, -rowIndex * self.faceItemHeight);
        totalHeight += self.faceItemHeight;
        rowIndex++;

        Object.keys(chatConfig.faceTables).forEach(function (key) {
            var faceName = chatConfig.faceTables[key];
            var faceItem = cc.instantiate(self.node_faceItem);
            var faceSpr = faceItem.getChildByName("spr_face").getComponent(cc.Sprite);
            faceSpr.spriteFrame = self.altas_face.getSpriteFrame(faceName);
            faceItem.faceKey = key;
            faceItem.parent = faceRowNode;
            faceItem.active = true;
            faceItem.position = cc.p(lineIndex * self.faceWidth, 0);
            lineIndex++;
            index++;

            if (index % rowCount === 0) {
                faceRowNode = cc.instantiate(self.node_faceRowItem);
                faceRowNode.parent = self.scroll_faceContent;
                faceRowNode.active = true;
                faceRowNode.position = cc.p(-self.scrollWidth / 2, -rowIndex * self.faceItemHeight);
                totalHeight += self.faceItemHeight;
                rowIndex++;
                lineIndex = 0;
            }
        })
        this.scroll_faceContent.setContentSize(this.scrollWidth, totalHeight);
    },

    onTouchLayer() {
        this.node.destroy();
    },

    btnOnSend() {

    },

    btnOnMsg(event) {
        var msgId = event.target.msgId;
        cc.log(msgId);
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = cc.globalMgr.msgIds.SMALL_MSG_ID;
        data.idx = msgId;
        G.socketMgr.socket.send(cc.globalMgr.msgIds.CHAT_MSG_FACE_MAIN_ID, cc.globalMgr.msgObjs.chatMsgFace(data));
        this.node.destroy();
    },

    btnOnFace(event) {
        var faceKey = event.target.faceKey;
        cc.log(faceKey);

        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = cc.globalMgr.msgIds.SMALL_FACE_ID;
        data.idx = faceKey;

        G.socketMgr.socket.send(cc.globalMgr.msgIds.CHAT_MSG_FACE_MAIN_ID, cc.globalMgr.msgObjs.chatMsgFace(data));
        this.node.destroy();
    },

    btnOnLeftMsg() {
        this.scroll_msg.node.active = true;
        this.scroll_face.node.active = false;
    },

    btnOnLeftFace() {
        this.scroll_msg.node.active = false;
        this.scroll_face.node.active = true;
    },
    inputBegan() {
        this._str = this.node_input.string;
        // cc.log("查看开始输入字符：", this._str);
    },
    iuputChange() {
        this._str = this.node_input.string;
        // cc.log("查看改变输入字符：", this._str);
    },
    inputEnded() {
        this._str = this.node_input.string;
        // cc.log("查看结束输入字符：", this._str);
    },
    sendInput() {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = cc.globalMgr.msgIds.SMALL_MSGINPUT_ID;
        data.idx = this._str;

        G.socketMgr.socket.send(cc.globalMgr.msgIds.CHAT_MSG_FACE_MAIN_ID, cc.globalMgr.msgObjs.chatMsgFace(data));
        this.node.destroy();
        cc.log("文字已发送");
    }

});
