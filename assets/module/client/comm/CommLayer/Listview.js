var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        node_item: {
            default: null,
            type: cc.Node
        },
        spawnCount: 0,
        totalCount: 0, // how many items we need for the whole list
        spacing: 0, // space between each item
        bufferZone: 0, // when item is away from bufferZone, we relocate it
    },

    // use this for initializationP
    onLoad: function () {
        this.GameType = {
            yantaiMethod: 1,    //烟台
            moupingMethod: 2, // 某平
            ddzMethod: 3,       //斗地主
            tljMethod: 5,        //炸金花
        }
        this.content = this.scrollView.content;
        this.items = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
        var uid = G.myPlayerInfo.uid;
        this.ietmitem = 0;
        this.RePlayType = false;

        G.socketMgr.socket.send(cc.globalMgr.msgIds.REPLAY_RESPONSE, cc.globalMgr.msgObjs.RePlay(uid, this.GameType.moupingMethod));//战绩回访 大窗
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_RESPONSE, this, this.OnLookReplayFunc); // 战绩
    },
    initialize: function () {
        this.content.height = this.totalCount * (this.node_item.height + this.spacing) + this.spacing; // get total content height
        if (this.spawnCount > 0) {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].destroy();
            }
            this.items.length = 0;
        }
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            this.ietmitem = cc.instantiate(this.itemTemplate);
            cc.log("--初始化--", i)
            this.content.addChild(this.ietmitem);
            this.ietmitem.setPosition(0, -this.ietmitem.height * (0.5 + i) - this.spacing * (i + 1));
            this.items.push(this.ietmitem)
        }
        if (this.spawnCount > 0) {
            this.content.active = true;
        } else {
            this.content.active = false;
        }
    },
    getPositionInView: function (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos; // let worldPos = item.parent.convertToWorldSpaceAR(item.position);
    },

    update: function (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        let offset = (this.node_item.height + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].setPositionY(items[i].y + offset);
                    // let item = items[i].getComponent('ReplayItem');
                    // let itemId = item.itemID - items.length; // update item id
                }
            } else {
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].setPositionY(items[i].y - offset);
                    // let item = items[i].getComponent('ReplayItem');
                    // let itemId = item.itemID + items.length;
                }
            }
        }
        this.lastContentPosY = this.scrollView.content.y;
    },
    OnLookReplayFunc: function (msgNumber, body, target) {
        cc.log("--回调--")
        var replayArray = JSON.parse(body.listdajiesuan);


        var listfenshu;
        var bgdate = 0;
        var gametype = 0;
        var roomId = 0;
        var type = "";
        var orderid = 0;
        for (var item in replayArray) {
            var replayArr = replayArray[item];
            target.totalCount = replayArr.length;
            target.spawnCount = replayArr.length;
            if (target.spawnCount > 20) {
                target.spawnCount = 20;
            }
        }
        target.initialize();
        for (var item in replayArray) {
            var replayArr = replayArray[item];
            for (var iten in replayArr) {
                bgdate = replayArr[iten].bgdate;
                gametype = replayArr[iten].gametype;
                listfenshu = replayArr[iten].listfenshu;
                roomId = replayArr[iten].roomid;
                type = replayArr[iten].gametype;
                orderid = replayArr[iten].orderid;
                var NameArray = [];
                var BaseArray = [];
                for (var i in listfenshu) {
                    NameArray.push(listfenshu[i].f_nick);
                    BaseArray.push(listfenshu[i].fenshu)
                }
                var item = target.items[iten].getComponent('ReplayItem');
                cc.log("---回放类型能否显示-----", target.RePlayType)
                item.CheckLookReplay(target.RePlayType);
                if (target.RePlayType) {
                    item.updateItemtlj(roomId, bgdate, NameArray[0], BaseArray[0], NameArray[1], BaseArray[1], NameArray[2], BaseArray[2], NameArray[3], BaseArray[3], NameArray[4], BaseArray[4], NameArray[5], BaseArray[5], NameArray[6], BaseArray[6], NameArray[7], BaseArray[7], orderid)
                } else {
                    item.updateItemrest(roomId, bgdate, NameArray[0], BaseArray[0], NameArray[1], BaseArray[1], NameArray[2], BaseArray[2], NameArray[3], BaseArray[3], orderid)
                }
            }
        }
    },

    onDestroy: function () {
        cc.globalMgr.service.getInstance().unregist(this)

    },
    OnClickReplayMethod: function (sub, eve) {
        var uid = G.myPlayerInfo.uid;

        var gametype = 0;
        switch (eve) {
            case "moPingMethod":
                gametype = this.GameType.moupingMethod
                this.RePlayType = false;
                cc.log("--某平回放---")
                break;
            case "yanTaiMethod":
                gametype = this.GameType.yantaiMethod
                this.RePlayType = false;
                cc.log("--烟台回放---")
                break;
            case "jdddzreplay":
                gametype = this.GameType.ddzMethod
                this.RePlayType = false;
                cc.log("--斗地主回放---")
                break;
            case "tljMethod":
                gametype = this.GameType.tljMethod
                this.RePlayType = true;
                cc.log("--炸金花回放---", this.RePlayType)
                break;

        }
        cc.log("--发消息---")

        cc.log("--item---", this.items)
        G.socketMgr.socket.send(cc.globalMgr.msgIds.REPLAY_RESPONSE, cc.globalMgr.msgObjs.RePlay(uid, gametype));//战绩回访 大窗
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_RESPONSE, this, this.OnLookReplayFunc); // 战绩

    },
    OnClickClose() {
        this.node.destroy();
    }


});
