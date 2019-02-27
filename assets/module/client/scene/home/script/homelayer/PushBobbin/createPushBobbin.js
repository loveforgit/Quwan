var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {
        
    },

    //创建房间
    OnClickCreateRoom: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createPushBubbinRoom']);
        nodeCreateRoom.parent = this.node;
    },

    //加入房间
    OnClickJoinRoom: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = this.node;
    },

    start() {

    },

    onHundredWarClick:function(){
        cc.log("---进入百人推筒子---")
        // cc.globalMgr.GameFrameEngine.OnHundredRoom(G.myPlayerInfo.uid, cc.globalMgr.msgIds.TUITONGZI_JOIN_ROOM);
        cc.globalMgr.GameFrameEngine.enterGoldRoom(1, 310);
    },

    // update (dt) {},
});
