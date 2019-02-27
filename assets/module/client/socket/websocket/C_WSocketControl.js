var comm = require("Comm")
var MsgIds = require("MsgIds")
var MsgObjs = require("MsgObjs")
cc.Class({
    extends: comm,

    properties: {

    },

    initControl(msgNumber, body) {
        // cc.log("initcontorl start", body)
        //开启监听登录事件
        if (msgNumber == MsgIds.LOGIN_REQUEST) {
            this.onLoginFunc(msgNumber, body, this)
        }
        else if (msgNumber == MsgIds.SOCKET_CLOSE_RECONTIN_CONNECT) {
            cc.log("开启断线重连消息")
            cc.globalMgr.EventManager.getInstance().fireEvent("GameReConnect", body)
        }
        else if (msgNumber == MsgIds.ERROR_RESPONSE) {
            this.removeWaittingConnection()
            this.addMessageBox(body.msg)
        }
        else if (msgNumber == MsgIds.MYPLAYER_INFO_RESPONSE) {
            cc.log("接收来自服务器个人信息推送")
            G.copyObject(G.myPlayerInfo, body.player)
            cc.globalMgr.EventManager.getInstance().fireEvent("UPDATEUSERINFO", body)
        }
        else if (msgNumber === MsgIds.COIN_INSUFFICIENT) {
            cc.log("金币不足提示消息");
            this.addMessageBox("点击确定领取补助？", this, function (target) {
                cc.globalMgr.GameFrameEngine.coinSubsidySend();
            }, 1);

            this.removeWaittingConnection();
        }
        else if (msgNumber === MsgIds.CHARGE_SHOW_RET) {
            var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
            var size = cc.director.getWinSize();
            nodeCreateRoom.parent = cc.director.getScene();
            nodeCreateRoom.position = cc.p(size.width / 2, size.height / 2);
        }
    },

    //消息登录回调
    onLoginFunc: function (msgNumber, body, target) {

        G.mylog.push(" --app登录成功----")
        G.copyObject(G.myPlayerInfo, body.player)
        //当前场景名字
        target.removeWaittingConnection();
        var currentSceneName = cc.globalMgr.SceneManager.getInstance().currentSceneName
        if (currentSceneName == "Logon") {

            //登录成功之后开启心跳检测
            cc.globalMgr.socketControl.startHeartCheck()
            target.removeWaittingConnection();
            //登录成功之后, 如果是断线重连状态，不处理。否则，进入大厅
            if (body.ischonglian == false) {
                cc.globalMgr.SceneManager.getInstance().preloadScene("home")
            }

        }
        //在home界面暂时不做任何处理
        else if (currentSceneName == "home") {

        }
        else {
            //如果在游戏界面重连
            var isReconnect = body.ischonglian
            if (isReconnect == false) {
                cc.globalMgr.voiceFrame.LeaveRoom()
                cc.globalMgr.SceneManager.getInstance().preloadScene("home")
            }
        }
    },


    //消息分发
    startService() {
        cc.log("开始消息分发");
        this.schedule(this.gameLogic, 0.01);
        //注册检测网络错误
        cc.globalMgr.EventManager.getInstance().regist("SOCKET_CLOSE_EVENT", this, this.socketError);

    },

    //开启心跳检测
    startHeartCheck: function () {
        cc.log("开启心跳检测")
        this.schedule(this.checkHeart, 0.01)
    },

    //网络错误消息处理
    socketError: function () {
        cc.log("网络错误消息处理，重新连接初始化")
        G.finishState = 2;
        var sE = require("C_WSocketError")
        var socketError = new sE()
        socketError.init()
    },
    checkHeart: function (dt) {
        var socket = G.socketMgr.socket

        if (socket != null && socket.isConnected) {
            if (socket.hasSendHeart) {
                socket.waitTime -= dt;
                if (socket.waitTime <= 0) {
                    cc.log("心跳超时!");
                    socket.close();
                }
            }
            else {
                if (socket.waitSendTime == undefined) {
                    socket.waitSendTime = 0;
                }
                socket.waitSendTime += dt;

                if (socket.waitSendTime > 10) {
                    socket.send(cc.globalMgr.msgIds.HEART_CLIENT_TO_SERVER_REQUEST, cc.globalMgr.msgObjs.heartCheck(G.myPlayerInfo.uid));
                    socket.hasSendHeart = true;
                    socket.waitTime = 10;
                    socket.waitSendTime = 0;
                }
            }
        }
    },
    gameLogic: function (dt) {
        this.checkSocketQueue(G.socketMgr.socket, dt);
    },
    checkSocketQueue: function (socket, dt) {
        if (socket != null && socket.isConnected) {
            var len = socket.msgQueue.length;
            //消息分发
            if (len > 0) {
                // cc.log("queue############:"+len);
                var obj = socket.msgQueue[0];
                socket.msgQueue.splice(0, 1);
                cc.globalMgr.service.getInstance().excute(obj.msgNumber, obj.body);
            }
        }
    }



    // update (dt) {},
});
