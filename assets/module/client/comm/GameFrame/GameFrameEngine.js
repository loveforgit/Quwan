//by yky
//游戏消息框架处理，所有的游戏消息都走这里

var comm = require("Comm")
var msgIds = require("MsgIds");

cc.Class({
    extends: comm,

    properties: {

    },

    ctor() {
        //游戏框架引擎启动
        cc.log("游戏框架引擎启动")
        this.eventRegist("GameReConnect", this, this.reconnect)
        this._gameControl = null;

    },

    //进入游戏房间
    //暂时不做热更新处理
    enterRoom(gameID) {
        //切换游戏场景
        cc.log("----游戏内game----", gameID)
        cc.log("game id list", G.gameIdList, gameID);
        var sceneName = G.gameIdList[gameID + ""][0];
        cc.log("sceneName " + sceneName);
        G.gameNetId = parseInt(G.gameIdList[gameID + ""][1]);
        G.RequireGameGoldType = gameID
        cc.globalMgr.SceneManager.getInstance().preloadScene(sceneName, this, function (target) {
            cc.log("enter room")
            target.sendLocation();
            //创建游戏控制层
            target.createGameControl(G.gameIdList[gameID + ""][0]);
            //注册游戏内消息监听事件
            target.regist(G.gameIdList[gameID + ""][1], target, target.onEventGameMessage);
            //注册进入金币场监听事件
            target.regist(msgIds.ENTER_GOLD_ROOM, target, target.enterGoldRoomSuccess)
            //注册解散消息消息监听事件
            target.regist(msgIds.LEAVE_ROOM_MAIN_ID, target, target.onDissolution)
            //注册聊天消息监听事件
            target.regist(msgIds.CHAT_MSG_FACE_MAIN_ID, target, target.onChatMsgFaceMessage);
            //注册玩家在游戏内是否断线消息监听
            target.regist(msgIds.PLAYER_IN_ROOM_IS_ONLINE, target, target.onlineInRoom)
            //发送进入游戏消息
            target.send(G.gameIdList[gameID + ""][1], cc.globalMgr.msgObjs.enterRoom(G.myPlayerInfo.uid, 1));


        });
    },

    //检测玩家是否在房间内
    requestPlayerInRoom(funcTarget, func) {
        this.addWaittingConnection("正在请求数据，请稍后")
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid
        this.send(cc.globalMgr.msgIds.REQUEST_PLAYER_IN_ROOM, obj)
        this.regist(cc.globalMgr.msgIds.REQUEST_PLAYER_IN_ROOM, this, function (msgNumber, body, target) {
            cc.log("查询玩家是否在房间内消息回调");
            target.removeWaittingConnection()
            //移除监听
            target.unregist(target, cc.globalMgr.msgIds.REQUEST_PLAYER_IN_ROOM);

            //如果没有在房间内。请求创建房间消息
            //如果在房间内，直接进入房间
            if (body.gameid != 0) {
                target.enterRoom(body.gameid)
            }
            else {
                if (funcTarget != undefined && func != undefined) {
                    func(funcTarget)
                }
                else {
                    cc.log("target or func undefined")
                }
            }
        })
    },

    //请求金币场数据
    requsetGoldRoomInfo(gameType, funcTarget, func) {
        this.addWaittingConnection("正在请求数据，请稍后")
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid
        obj.gametype = gameType
        this.send(cc.globalMgr.msgIds.REQUEST_GOLD_ROOM_INFO, obj)
        this.regist(cc.globalMgr.msgIds.REQUEST_GOLD_ROOM_INFO, this, function (msgNumber, body, target) {
            cc.log("请求金币场数据")
            target.removeWaittingConnection()
            //移除监听
            target.unregist(target, cc.globalMgr.msgIds.REQUEST_GOLD_ROOM_INFO)
            //返回金币场房间信息
            if (funcTarget != undefined && func != undefined) {
                func(funcTarget, body)
            }
            else {
                cc.log("target or func undefined")
            }
        })
    },

    //创建房间
    createRoom(obj) {
        this.addWaittingConnection("正在创建房间，请稍后")
        //监听创建房间事件
        this.regist(cc.globalMgr.msgIds.CREATE_ROOM_REQUEST, this, this.onCreateRoomFunc);
        //监听乐币是否充足
        // this.regist(cc.globalMgr.msgIds.COIN_INSUFFICIENT, this, this.onCoinInsufficientFunc);
        //发送创建房间消息
        this.send(cc.globalMgr.msgIds.CREATE_ROOM_REQUEST, obj);
    },

    //加入房间
    joinRoom(uid, roomid) {
        // this.addWaittingConnection("正在请求数据，请稍后");
        // var obj =  new Object()
        // obj.uid = G.myPlayerInfo.uid
        // this.send(cc.globalMgr.msgIds.REQUEST_PLAYER_IN_ROOM,obj)
        // this.regist(cc.globalMgr.msgIds.REQUEST_PLAYER_IN_ROOM, this, this.requestJoinRoomPlayerInRoom)
        this.addWaittingConnection("正在加入房间，请稍后")
        //加入房间消息监听
        this.regist(cc.globalMgr.msgIds.JOIN_ROONID_RESPONSE, this, this.onJoinRoomFunc);
        //发送加入房间消息
        this.send(cc.globalMgr.msgIds.JOIN_ROONID_RESPONSE, cc.globalMgr.msgObjs.JoinRoom(uid, roomid));
    },

    //进入金币场
    enterGoldRoom(Grade, gametype) {
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid
        obj.roomdengji = Grade
        obj.gametype = gametype
        this.send(cc.globalMgr.msgIds.ENTER_GOLD_ROOM, obj)
        //监听金币场创建成功消息
        this.addWaittingConnection("正在加入房间，请稍后")
        this.regist(cc.globalMgr.msgIds.ENTER_GOLD_ROOM, this, this.enterGoldRoomSuccess)
        //监听乐币是否充足
        // this.regist(cc.globalMgr.msgIds.COIN_INSUFFICIENT, this, this.onCoinInsufficientFunc);
    },

    //进入金币场房间成功
    enterGoldRoomSuccess(msgNumber, body, target) {
        //金币场，在home界面，进入游戏。 在游戏界面，新匹配

        var currentSceneName = cc.globalMgr.SceneManager.getInstance().currentSceneName
        cc.log("---进入金币场---", currentSceneName);
        if (currentSceneName == "home" || currentSceneName == "arrangeCard" || currentSceneName == "cardsGameSelect" || currentSceneName == "landSelectList" || currentSceneName == "mahjongGameSelect" || currentSceneName == "zhaJinHuaGame" || currentSceneName == "pushBobbinGame") {
            target.enterRoom(body.gameid)
        }
        else {
            //发送进入游戏消息
            target.send(G.gameIdList[body.gameid + ""][1], cc.globalMgr.msgObjs.enterRoom(G.myPlayerInfo.uid, 1));
        }

        target.removeWaittingConnection()
        // target.unregist(target, cc.globalMgr.msgIds.COIN_INSUFFICIENT);
    },

    //返回大厅
    enterHome() {
        cc.log("返回大厅")

        // cc.globalMgr.SceneManager.getInstance().loadScene("arrangeCard")
        cc.globalMgr.SceneManager.getInstance().loadScene("home");
        //移除游戏内事件监听
        this.unregist(this)
    },

    //断线重连消息处理
    reconnect(body, target) {
        cc.log("游戏断线重连")
        target.enterRoom(body.gameid)
    },

    //创建游戏控制层
    createGameControl(gamename) {
        var scene = cc.director.getScene();
        console.assert(scene, "createGameControl get curScene failed!");
        var node = scene.getChildByName("Canvas");
        console.assert(node, "createGameControl get node failed!");
        var scriptName = gamename + "GameControl";

        var script = node.getComponent(scriptName);
        console.assert(node, "createGameControl get script component failed!");
        cc.log("--gamecre---", scriptName)

        this._gameControl = script;
        this._gameControl.setGameFrameEngine(this)
        cc.log("----创建控制层----", this)
        cc.log("oneventGameMessage one:" + gamename + " " + scriptName);


    },

    //游戏内消息监听事件
    onEventGameMessage(msgNumber, body, target) {
        if (target._gameControl != null) {
            target._gameControl.onEventGameMessage(body.zinetid, body)
        }
        else {
            cc.log("gameControl is null")
        }
    },

    //玩家解散消息监听
    onDissolution(msgNumber, body, target) {
        if (target._gameControl != null) {
            target._gameControl.onDissolution(body.zinetid, body)
        }
        else {
            cc.log("gameControl is null")
        }
    },

    //聊天消息监听
    onChatMsgFaceMessage(msgNumber, body, target) {
        if (target._gameControl != null) {
            target._gameControl.onChatMsgFaceMessage(body.zinetid, body);
        }
        else {
            cc.log("gameControl is null");
        }
    },

    //玩家在房间内是否断线消息监听
    onlineInRoom(msgNumber, body, target) {
        if (target._gameControl != null) {
            target._gameControl.onlineInRoom(body)
        }
        else {
            cc.log("gameControl is null")
        }
    },

    //创建房间消息成功
    onCreateRoomFunc(msgNumber, body, target) {
        cc.log("onCreateRoomFunc success ID", body.gameid);
        target.removeWaittingConnection()
        //进入房间
        target.enterRoom(body.gameid)
        //创建成功，移除创建房间消息监听
        target.unregist(target, cc.globalMgr.msgIds.CREATE_ROOM_REQUEST);
        // target.unregist(target, cc.globalMgr.msgIds.COIN_INSUFFICIENT);
    },

    //加入房间消息回调
    onJoinRoomFunc: function (msgNumber, body, target) {
        cc.log("Join room success,ID", body);
        target.removeWaittingConnection()
        cc.log("---111--gameid-", body.gameid)
        target.enterRoom(body.gameid)
        //加入房间成功，移除加入房间消息监听
        target.unregist(target, cc.globalMgr.msgIds.JOIN_ROONID_RESPONSE);
        target.unregist(target, cc.globalMgr.msgIds.HUNDRED_JOIN_ROOM);
    },


    //根据netid确定key值
    getGameNameByNetId(netid) {
        var that = this;
        that.gamename = ""
        Object.keys(G.gameIdList).forEach(function (key) {
            if (G.gameIdList[key][1] == netid) {
                gamename = G.gameIdList[key][0]
                cc.log("fuck game name " + gamename)
                return;
            }
        })
        return that.gamename;
    },

    //乐币不足提示
    onCoinInsufficientFunc(msgNumber, body, target) {
        cc.log("乐币不足")
        target.addMessageBox("点击确定领取补助？", target, function (target) {
            target.coinSubsidySend();
        }, 1)

        target.removeWaittingConnection();
        // target.unregist(target, cc.globalMgr.msgIds.COIN_INSUFFICIENT);
    },

    //获取乐币补助
    coinSubsidySend() {
        this.regist(cc.globalMgr.msgIds.COIN_SUBSIDY, this, this.onCoinSubsidyFunc);

        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        this.send(cc.globalMgr.msgIds.COIN_SUBSIDY, obj);
    },

    onCoinSubsidyFunc(msgNumber, body, target) {
        var tip = "恭喜获得" + body.leBi + "乐币";

        target.addMessageBox(tip, target, null, 1);
        target.unregist(target, cc.globalMgr.msgIds.COIN_SUBSIDY);
    },
    //发送加入百人场消息  
    OnHundredRoom(uid, msgids) {
        this.addWaittingConnection("正在加入房间，请稍后")
        var obj = new Object();
        obj.uid = uid;
        this.regist(msgids, this, this.onJoinRoomFunc);
        this.send(msgids, obj);
    },


    sendLocation() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;                        //用户id
        if (cc.sys.OS_ANDROID === cc.sys.os) {
            obj.weiDu = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLatitude", "()F");    //纬度
            obj.jingDu = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLongitude", "()F");  //经度
            obj.city = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getCity", "()Ljava/lang/String;");  //城市  //()Ljava/lang/String;   括号 里  是参数  有参数 写参数 ，无参数 不写
        } else if (cc.sys.OS_IOS === cc.sys.os) {
            obj.weiDu = jsb.reflection.callStaticMethod("AppController", "getLatitude");    //纬度
            obj.jingDu = jsb.reflection.callStaticMethod("AppController", "getLonggitude");  //经度
            obj.city = jsb.reflection.callStaticMethod("AppController", "getCity");  //城市
        }
        this.send(cc.globalMgr.msgIds.LOCATION_SEND, obj);
    },
});
