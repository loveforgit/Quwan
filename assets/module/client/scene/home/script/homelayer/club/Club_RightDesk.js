
var comm = require("Comm");
var Dictionary = require("Dictionary")
cc.Class({
    extends: comm,

    properties: {
        item: {
            default: null,
            type: cc.Node
        },

        content: {
            default: null,
            type: cc.Node
        },
    },
    onLoad() {

    },

    //在 club 脚本中初始化
    initDictionary() {
        this.dic = new Dictionary()
        this.dic.Dictionary()
    },

    //生成 桌子
    createDesktop() {
        var posX = -250
        var posY = -177
        this.content.removeAllChildren()
        for (let i = 0; i < 12; i++) {
            let item = cc.instantiate(this.item)
            item.index = i + 1
            item.getChildByName("index").getComponent(cc.Label).string = i + 1 + ""
            this.content.addChild(item)
            posX = -250 + (i % 2) * (item.width + 130)
            item.setPosition(cc.p(posX, posY))
            if (i % 2 == 1) {
                posY -= (item.height + 160)
            }
            // item.getComponent("Club_DesktopInfo").setDesktopInfo()
            item.active = true
            this.dic.add(item.index, item)
        }
        this.content.height = 11 * this.item.height - 20
    },




    //查找单个桌子 并修改 这个桌子的值
    findDesktopSetting(index) {
        var item = this.dic.find(index)
        // item.getComponent("Club_DesktopInfo").setDesktopInfo()
    },


});




