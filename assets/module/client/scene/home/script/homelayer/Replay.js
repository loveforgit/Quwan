
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        node_item: {
            default: null,
            type: cc.Node
        },
        spawnCount: 0,
        totalCount: 0,
        spacing: 0,
        bufferZone: 0
    },

    onLoad: function () {
        //默认显示麻将
        this._selGame = 3;
        G.socketMgr.socket.send(cc.globalMgr.msgIds.REPLAY_RESPONSE, cc.globalMgr.msgObjs.RePlay(G.myPlayerInfo.uid, G.MahjongType));//战绩回访 大窗
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_RESPONSE, this, this.OnLookReplayFunc); // 战绩

        this.content = this.scrollView.content;
        this.items = [];
        // this.updateTimer = 0;
        // this.updateInterval = 0.2;
        // this.lastContentPosY = 0;
        // this.curItem = 0;
        //item项
        // this._curItem = null;
    },

    initialize: function (index) {
        var _curItemP = this.node_item;
        cc.log("列表项高度+++++++", _curItemP.height);

        this.content.height = this.totalCount * (_curItemP.height + this.spacing) + this.spacing;
        var itemsLen = this.items.length;
        if (itemsLen > 0) {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].destroy();
            }
            this.items.length = 0;
        }

        for (let i = 0; i < this.spawnCount; ++i) {
            var curItem = cc.instantiate(_curItemP);
            this.content.addChild(curItem);
            curItem.setPosition(0, - curItem.height * (0.5 + i) - this.spacing * (i + 1));
            this.items.push(curItem);
        }

        if (this.spawnCount > 0) {
            this.content.active = true;
        }
        else {
            this.content.active = false;
        }
    },

    //选择查询不同游戏的战绩
    OnClickSelectGameReply: function (event, customEventData) {
        switch (customEventData) {
            case "zhaJinHua": {
                this._selGame = 1;
                G.socketMgr.socket.send(cc.globalMgr.msgIds.REPLAY_RESPONSE, cc.globalMgr.msgObjs.RePlay(G.myPlayerInfo.uid, G.ZhaJinHuaType));//战绩回访 大窗
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_RESPONSE, this, this.OnLookReplayFunc); // 战绩
            }
                break

            case "cow": {
                this._selGame = 2;
                G.socketMgr.socket.send(cc.globalMgr.msgIds.REPLAY_RESPONSE, cc.globalMgr.msgObjs.RePlay(G.myPlayerInfo.uid, G.CowType));//战绩回访 大窗
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_RESPONSE, this, this.OnLookReplayFunc); // 战绩
            }
                break
            case "mahjong": {
                this._selGame = 3;
                G.socketMgr.socket.send(cc.globalMgr.msgIds.REPLAY_RESPONSE, cc.globalMgr.msgObjs.RePlay(G.myPlayerInfo.uid, G.MahjongType));//战绩回访 大窗
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_RESPONSE, this, this.OnLookReplayFunc); // 战绩
            }
        }
    },

    OnLookReplayFunc(msgNumber, body, target) {
        cc.log("-----战绩原始数据:", body);
        var curList = JSON.parse(body.listdajiesuan);

        cc.log("------战绩数据:", curList)
        // var len = curList.length;
        // cc.log("---数据长度:", len);
        // if (len > 0) {
        //     target.RecordListShow(curList)
        // }
        // else {
        //     cc.log("---没有战绩数据");
        // }

        target.RecordListShow(curList)

        // target.RecordListShow(listDaJieSuan.listdajiesuan)
    },

    //战绩显示
    RecordListShow(obj) {
        cc.log("---战绩列表数据：", obj);
        this.spawnCount = obj.length;
        this.totalCount = obj.length;
        //添加默认战绩项
        this.initialize(this._selGame);
        // cc.log("---长度---", obj.length)
        // cc.log("---长度-s--", this.spawnCount)
        var len = obj.length;
        cc.log("---数据长度:", len);
        if (len <= 0) {
            return;
            cc.log("---没有战绩数据");
        }

        for (var i = 0; i < this.items.length; i++) {
            //获取单个房间数据
            var curData = obj[i];
            cc.log("---设置房间号，时间：", curData.roomid, curData.bgdate);
            this.items[i].getChildByName("roomId_L").getComponent(cc.Label).string = "房间号：" + curData.roomid;
            this.items[i].getChildByName("tiem_L").getComponent(cc.Label).string = "时间：" + curData.bgdate;

            //获取单个房间内玩家数据列表
            var palyerListData = curData.listfenshu;
            cc.log("------单个房间玩家数据：", palyerListData);
            if(this._selGame == 1){
                cc.log("------金花");
                this.items[i].getChildByName("xq_Button").active = false;

                // this.setPlayerDataForEachRoom(palyerListData);
            }
            else if(this._selGame == 2){
                cc.log("------牛牛");
                this.items[i].getChildByName("xq_Button").active = false;

                // this.setPlayerDataForEachRoom(palyerListData);
            }
            else if(this._selGame == 3){
                cc.log("------麻将");
                this.items[i].getChildByName("xq_Button").active = true;

                //如果是麻将,设置orderid 
                cc.log("----设置麻将orderid:", obj[i].orderid);
                this.items[i].getComponent("ReplayMjItem").setIdForItem(obj[i].orderid);
                // this.setPlayerDataForEachRoom(palyerListData);
            }

            var len = palyerListData.length;
            for (var j = 0; j < len; j++) {
                var curUserNode = this.items[i].getChildByName("user_node_" + j);
                curUserNode.active = true;
    
                //获取单个玩家信息
                var curPlayData = palyerListData[j];
                //序号
                var index = j;
    
                //设置单个房间玩家信息
                this.items[i].getComponent("ReplayMjItem").updateItem(curPlayData, index);
            }
        }
    },

    // //设置单个房间玩家信息
    // setPlayerDataForEachRoom(listData){
    //     var len = listData.length;
    //     for (var j = 0; j < len; j++) {
    //         var curUserNode = this.items[i].getChildByName("user_node_" + j);
    //         curUserNode.active = true;

    //         //获取单个玩家信息
    //         var curPlayData = listData[j];
    //         //序号
    //         var index = j;

    //         //设置单个房间玩家信息
    //         this.items[i].getComponent("ReplayMjItem").updateItem(curPlayData, index);
    //     }
    // },

    OnClickClose: function () {
        this.playClickMusic()

        this.node.destroy();
    },
});
