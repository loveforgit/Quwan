var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {

    },

    onLoad() {
        // this.gameType = 40;   // 百人牛牛游戏类型
    },

    start() {

    },
    //创建房间
    OnClickCreateRoom: function () {
        //添加音效
        this.playClickMusic()
        cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestPlayerInRoomCallFunc)
    },
    //查询有没有在房间内，回调
    requestPlayerInRoomCallFunc(target) {
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createNNRoom']);
        nodeCreateRoom.parent = target.node;
    },
    //加入房间
    OnClickJoinRoom: function () {
        //添加音效
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = this.node;
    },

    // //进入百人牛牛
    // OnClickHundredRoom: function () {
    //     cc.log("---进入百人牛牛---")
    //     cc.globalMgr.GameFrameEngine.OnHundredRoom(G.myPlayerInfo.uid, cc.globalMgr.msgIds.HUNDRED_JOIN_ROOM)
    // },
    // update (dt) {},
});
