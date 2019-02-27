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

        lab_hint: {
            default: null,
            type: cc.Label
        },
    },

    //加载成员列表
    addItemForMember: function (body) {
        cc.log("加载成员列表:", body)
        this.dataObj = body
        this.userDataArr = []
        this.onClickIndex = 0
        var getData = body.clubUserMsg
        //数组分割为12个位一组
        for (var i = 0, len = getData.length; i < len; i += 12) {
            this.userDataArr.push(getData.slice(i, i + 12));
        }
        this.lab_hint.string = "1 / " + this.userDataArr.length
        this.loaderData(this.userDataArr[0])
    },

    //左面按钮切换
    onLeftBtnEvent() {
        var index = this.onClickIndex
        if (index > 0) {
            index--
            this.loaderData(this.userDataArr[index])
        }
        this.onClickIndex = index
        this.lab_hint.string = (index + 1) + " / " + this.userDataArr.length

    },
    //右面按钮切换
    onRightBtnEvent() {
        var index = this.onClickIndex
        if (index < this.userDataArr.length - 1) {
            index++
            this.loaderData(this.userDataArr[index])
        }
        this.onClickIndex = index
        this.lab_hint.string = (index + 1) + " / " + this.userDataArr.length
    },

    //每次加载  12个 用户
    loaderData(getData) {

        var posX = -376
        var posY = -75
        this.content.removeAllChildren()
        for (var i in getData) {
            var data = getData[i]
            var item = cc.instantiate(this.item)
            this.content.addChild(item)
            posX = -376 + (i % 4) * (item.width + 8)
            item.setPosition(cc.p(posX, posY))
            if (i % 4 == 3) {
                posY -= (item.height + 15)
            }
            var spr = item.getComponent('itemForMember');
            spr.updateItem(data.name, data.wxId, data.image, data.uid, data.rank, data.state, data.state, i)
            item.active = true
        }
    },

    onClickUserController() {
        var curView = FTools.ShowPop("runMemberBoxTwo", this.node)
        curView.getComponent("memberBoxTwo").addItemForMember(this.dataObj);
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





