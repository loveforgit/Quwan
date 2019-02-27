var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //界面属性定义
        roomId: {
            default: null,
            type: cc.Label
        },

        listUserGrid: {
            default: null,
            type: cc.Node
        }

    },
    updateResultInfo(roomid, listUserInfo) {
        this.roomId.string = "房间号：" + roomid.string
        for (var i in listUserInfo) {
            var userinfo = listUserInfo[i]
            this.listUserGrid.children[i].getComponent("nn_MinResult_item").updateItem(userinfo)
        }

    },

    onClickShare() {
        this.wxShare("805娱乐 牛牛", G.shareHttpServerPath, "结算", "0", 1)
    },

    // update (dt) {},
});
