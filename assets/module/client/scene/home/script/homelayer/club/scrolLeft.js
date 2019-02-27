var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {

        item: {
            default: null,
            type: cc.Node
        },

        //左列表
        content: {
            default: null,
            type: cc.Node
        },
    },

    onLoad: function () {

    },

    GetView(target) {
        this.target = target
    },

    //加载左列表项
    addItemForLeft: function (body) {
        cc.log("加载左列表项", body)
        this.items = []; // 保存生成的列表项
        this.content.removeAllChildren()
        var getData = body.clubList;
        for (let i = 0; i < getData.length; i++) {
            var data = getData[i]
            var item = cc.instantiate(this.item)
            this.content.addChild(item)
            item.index = i
            item.name = data.clubId + ""
            item.setPosition(cc.p(0, -60 - (i * (item.height + 5))))
            item.getComponent("itemForLeft").updateItem(data.clubName, data.clubId, data.roomCount, data.userCount, data.clubImage, i)
            item.getComponent("itemForLeft").saveOtherScript(this)
            item.active = true
            this.items.push(item)
        }
        this.content.height = getData.length * (this.item.height + 10) + this.item.height
        this.itemRestoration(0) //默认选择第一个
    },

    //item复位
    itemRestoration(index) {
        var items = this.items
        var length = items.length

        for (let i = 0; i < length; i++) {
            var node = items[i]
            node.setPosition(cc.p(0, -60 - (i * (node.height + 5))))
        }

        for (let i = index + 1; i < length; i++) {
            var node = items[i]
            node.setPosition(cc.p(0, node.getPositionY() - (node.height + 25)))
        }
    },
});




