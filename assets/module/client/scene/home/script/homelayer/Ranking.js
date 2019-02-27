var comm = require("Comm")
var home = require("home")
cc.Class({
    extends: comm,

    properties: {
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Node
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },

        spawnCount: 0,
        totalCount: 0, // how many items we need for the whole list
        spacing: 0, // space between each item
        bufferZone: 0, // when item is away from bufferZone, we relocate it
    },

    //设置大厅消息
    setGameHome(_setGameHome) {
        this._setGameHome = _setGameHome;
    },


    onLoad: function () {
        cc.log("---helloworld----")
        this.content = this.scrollView.content;
        this.items = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down

        var uid = G.myPlayerInfo.uid;
        var page = 1;
        G.socketMgr.socket.send(cc.globalMgr.msgIds.LEMONTY_RESPONSE, cc.globalMgr.msgObjs.LeMoneyWin(uid, page));
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.LEMONTY_RESPONSE, this, this.OnLookWinFunc); // 乐币排行榜

    },
    initialize: function () {
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        cc.log("------content.hength-----", this.content.height)
        for (let i = 0; i < this.totalCount; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            this.items.push(item);
        }
    },

    getPositionInView: function (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        // let offset =114;
        let offset = (this.itemTemplate.height + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    cc.log("----if----")
                    items[i].setPositionY(items[i].y + offset);
                    let item = items[i].getComponent('ReplayItem');
                }
            } else {
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    cc.log("----else----", items.length)
                    items[i].setPositionY(items[i].y - offset);
                    let item = items[i].getComponent('ReplayItem');
                }
            }
        }
        this.lastContentPosY = this.scrollView.content.y;
    },

    OnClickClose: function () {
        //添加音效
        this.playClickMusic()
        this.node.destroy();
        cc.log("--home---");
        this._setGameHome.node_Ranking.active = true;
    },
    OnLookWinFunc: function (msgNumber, body, target) {
        var paihang = JSON.parse(body.listpaihang)
        cc.log("---paihangbang---", paihang.length)
        target.totalCount = paihang.length;
        target.initialize();
        for (var item in paihang) {
            // 头像，姓名，金币数量,排序
            target.UpdaetRankingMessage(paihang[item].image, paihang[item].name, paihang[item].jinbi, item)
        }
    },
    UpdaetRankingMessage: function (sprite, name, money, id) {
        var items = this.items;
        var item = items[id].getComponent('RankingItem');
        cc.log("----id----", id)
        item.updateItem(sprite, name, money, id);
    },
    onDestroy: function () {
        cc.globalMgr.service.getInstance().unregist(this)

    },
});




