var comm = require("Comm");
var MsgIds = require("MsgIds");
cc.Class({
    extends: comm,

    properties: {
        //金币场场次
        gold_match_items: {
            default: [],
            type: cc.Node
        }
    },

    onLoad() {
        this.fangfei = 1;
        this.jushu = 1;
        this.diFen = 100;
        this.isfangzuobi = false;
        this.isbegin = false;
        this.isjinbi = true;
        //发送获取金币场信息
        this.addWaittingConnection("")
        this.sendGetGoldMatchInfo()
        this.regist(MsgIds.SUB_REQUEST_MATCH_INFO, this, this.goldMatchCallFunc)
        this.goldRoomList = []
    },

    //金币场信息
    goldMatchCallFunc(msgNumber, body, target) {
        target.removeWaittingConnection()

        target.goldRoomList = body.listRoom;
        for (var i = 0; i < target.goldRoomList.length; i++) {
            var gold_room_name = target.goldRoomList[i].changCi
            var baseScore = target.goldRoomList[i].diFen
            var peopleNum = target.goldRoomList[i].renShu
            var goldRange = target.goldRoomList[i].xianZhi
            target.gold_match_items[i].getChildByName("spr_people").getChildByName("l_peopleNum").getComponent(cc.Label).string = peopleNum
            target.gold_match_items[i].getChildByName("spr_gold").getChildByName("l_goldNum").getComponent(cc.Label).string = goldRange
            target.gold_match_items[i].getChildByName("spr_score").getChildByName("l_scoreNum").getComponent(cc.Label).string = baseScore
        }
    },

    //发送获取金币场数据消息
    sendGetGoldMatchInfo() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.gametype = G.ZhaJinHuaType;
        this.send(MsgIds.SUB_REQUEST_MATCH_INFO, obj);
        cc.log("获取金币场数据")
    },

    //点击退出
    OnClickClose: function () {
        this.playClickMusic();
        this.node.destroy();
    },

    //点击金币场场次
    onClickGoldMatch(event, customEventData) {
        this.playClickMusic()
        var baseScore = this.goldRoomList[customEventData - 1].roomdengji
        cc.globalMgr.GameFrameEngine.enterGoldRoom(baseScore, G.ZhaJinHuaType)
    },

    //创建房间
    OnClickCreateRoom: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createZhaJinHuaRoom']);
        nodeCreateRoom.parent = this.node;
    },

    //加入房间
    OnClickJoinRoom: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = this.node;
    },

    // update (dt) {},
});
