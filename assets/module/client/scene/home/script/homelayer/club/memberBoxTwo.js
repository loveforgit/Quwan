var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        //表模板项
        item: { // item template to instantiate other items
            default: null,
            type: cc.Node
        },

        //列表
        content: {
            default: null,
            type: cc.Node
        },

        //用户总数
        userTotal: {
            default: null,
            type: cc.Label
        },

        //积分总数
        integrationTotal: {
            default: null,
            type: cc.Label
        },
    },

    //加载成员列表
    addItemForMember: function (body) {
        cc.log("加载成员列表:", body)
        var getData = body.clubUserMsg
        this.content.removeAllChildren()
        for (var i in getData) {
            var data = getData[i]
            var item = cc.instantiate(this.item)
            this.content.addChild(item)
            item.setPosition(cc.p(0, -110 - (i * (item.height + 5))))
            var spr = item.getComponent('itemForMemberTwo');
            spr.updateItem(data.name, data.wxId, data.image, data.uid, data.rank, data.state, data.state, i)
            item.active = true
        }
        this.content.height = getData.length * (this.item.height + 10)
        this.userTotal.string = "玩家总数: " + getData.length
        this.integrationTotal.string = "积分总数: " + 12
    },

    //成员的搜索
    onClickSeekUserEvent() {
        let node = FTools.ShowPop("runSeekUser", cc.director.getScene())
        node.setPosition(640, 360);
    },


    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});





