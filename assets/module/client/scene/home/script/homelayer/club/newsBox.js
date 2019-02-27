var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        //表模板项
        item: {
            default: null,
            type: cc.Node
        },
        //列表
        content: {
            default: null,
            type: cc.Node
        },
    },

    getInfo(userList, clubID) {
        cc.log("消息 ", userList)
        var con = this.content
        con.height = (this.item.height + 3) * userList.length
        if (con.childrenCount > 0) {
            con.removeAllChildren()
        }
        for (var i = 0; i < userList.length; i++) {
            var item = cc.instantiate(this.item)
            con.addChild(item)
            var uid = userList[i].uid;
            var wxid = userList[i].wxId
            var name = userList[i].username;
            var imageURL = userList[i].headimgurl;
            item.getComponent('itemForNews').updateItem(name, wxid, imageURL, uid, clubID)
            item.setPosition(0, -50 * (i + 1) - (i * 45))
        }

    },
    onClickDestroy() {
        FTools.HidePop(this.node)
    },

});





