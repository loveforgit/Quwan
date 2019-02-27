
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {

        content: {
            default: null,
            type: cc.Node
        },

        item: {
            default: null,
            type: cc.Node
        }
    },
    onLoad() {

    },

    //更新信息
    updateInfo(body) {
        var userData = body.clubUserList
        var clubid = body.clubId
        var length = userData.length
        this.content.height = (this.item.height + 8) * length
        this.content.removeAllChildren() //清除所有子节点
        for (var i = 0; i < length; i++) {
            var item = cc.instantiate(this.item)
            this.content.addChild(item);
            item.getComponent('Club_partner_item').getParent(this)
            item.getComponent('Club_partner_item').itemInfo(clubid, userData[i].headimgurl, userData[i].username, userData[i].wxid, userData[i].uid)
            item.setPosition(0, -45 - (this.item.height + 8) * i)
        }
    },

    //关闭
    onCloseClick: function () {
        FTools.HidePop(this.node)
    },
});
