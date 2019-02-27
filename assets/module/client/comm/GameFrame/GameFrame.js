//by yky 2018/4/2
//游戏消息父类
var Comm = require("Comm")
var msgIds = require("MsgIds");
cc.Class({
    extends: Comm,

    properties: {

    },
    //设置游戏消息引擎
    setGameFrameEngine(_gameFrameEngine) {
        this._gameFrameEngine = _gameFrameEngine;
        cc.log("-----设置游戏消息引擎----", this._gameFrameEngine)
    },

    //回到大厅
    enterHome(type) {
        cc.log("回到大厅")
        if (type == "EndGame") {
            this.enterHomeEvent()
        } else {
            this.addMessageBox("确定回到大厅？", this, function (target) {
                target.enterHomeEvent()
            }, 3)
        }
    },

    //

    //回到大厅事件
    enterHomeEvent() {
        if (this._gameFrameEngine != undefined) {
            this._gameFrameEngine.enterHome()
        }
        cc.log("---离开房间---", this._gameFrameEngine)
        //调用语音离开房间消息
        cc.log("语音离开房间")
        cc.globalMgr.voiceFrame.LeaveRoom()
        G.currentRoomId = 0
    },

    //牛牛暂离房间
    NnentHome(str, roomid) {
        cc.log("回到大厅")
        this.addMessageBox(str, this, function (target) {
            var obj = new Object()
            obj.uid = G.myPlayerInfo.uid;
            obj.roomId = roomid;
            target.send(msgIds.REPLACE_NN_GOHOME, obj)
        }, 3)
    },

    //绑定玩家头像
    bindUsersBox(usersBox) {
        this.usersBox = usersBox

    },

    //判断玩家在房间内是否断线
    onlineInRoom(body) {
        if (this.usersBox == undefined) {
            cc.log("请绑定头像框")
            return
        }
        for (let i = 0; i < body.listOnLine.length; i++) {
            const element = body.listOnLine[i];
            for (let j = 0; j < this.usersBox.length; j++) {
                if (element.wxid == this.usersBox[j].wxId) {
                    this.usersBox[j].getChildByName("online").active = !element.isOnLine
                    break;
                }
            }
        }
    },

    //绑定语音按钮, 头像框
    bindVoiceBtnAndUsersBox(voiceBtn, usersBox) {
        cc.globalMgr.voiceFrame.setVoiceEvent(voiceBtn)
        cc.globalMgr.voiceFrame.bindUserBox(usersBox)
    },

    //语音--加入房间
    voiceJoinRoom(roomid) {
        //保存游戏房间
        if (G.currentRoomId == 0 || G.currentRoomId != roomid) {
            G.currentRoomId = roomid
            cc.log("语音加入房间", G.currentRoomId)
            cc.globalMgr.voiceFrame.JoinRoom(roomid, G.myPlayerInfo.wxId)
        }
    },

    //添加聊天弹窗
    addChatLayer(gameid) {
        cc.globalMgr.globalFunc.addChatLayer(gameid);
    },

    //申请解散
    applyDissolution() {
        this.addMessageBox("确定申请解散房间？", this, function (target) {
            var obj = new Object()
            obj.uid = G.myPlayerInfo.uid;
            obj.zinetid = msgIds.PLAYER_APPLY_DISSOLUTION
            target.send(msgIds.LEAVE_ROOM_MAIN_ID, obj)
        }, 3)
    },

    //金币场返回房间
    goldRoomReturnHome(isStart) {
        cc.log("游戏是否开始", isStart)
        if (isStart) {
            this.addMessageBox("中途退出将会受到处罚，确认离开房间吗 ？", this, function (target) {
                var obj = new Object()
                obj.uid = G.myPlayerInfo.uid;
                obj.zinetid = msgIds.PLAYER_APPLY_DISSOLUTION
                target.send(msgIds.LEAVE_ROOM_MAIN_ID, obj)
            }, 3)
        }
        else {
            var obj = new Object()
            obj.uid = G.myPlayerInfo.uid;
            obj.zinetid = msgIds.PLAYER_APPLY_DISSOLUTION
            this.send(msgIds.LEAVE_ROOM_MAIN_ID, obj)
        }
    },

    //游戏内消息监听
    onEventGameMessage(sub, dataObj) {
        cc.log("消息监听 ")
    },
    //申请解散消息接收 , 默认支持二人， 三人，四人的解散面板，如进行解散面板修改，可在gameControl文件，重实现onDissolution
    onDissolution(sub, dataObj) {
        cc.log("--解散房间dataobg--", dataObj)
        cc.log("--解散房间sub--", sub)
        cc.log("玩家申请解散界面")
        //当游戏未开始，房间解散了，直接返回 可以离开到大厅
        if (sub == msgIds.PLAYER_APPLY_DISSOLUTION) {
            this._gameFrameEngine.enterHome()
            if(dataObj.julebuid != 0){
                G.returnIdForClub = dataObj.julebuid;
            }
        }
        //当游戏已开始，房间申请解散，需要弹出解散面板
        else if (sub == msgIds.POP_DISSOLUTION) {
            this.dissolution = cc.instantiate(cc.globalRes["dissolution"]);
            var curScene = cc.director.getScene();
            this.dissolution.parent = curScene
            //设置解散信息
            this.dissolution.getComponent("dissolution").setDissolutionInfo(dataObj.listuser, dataObj.wxid)
            //设置玩家同意或者失败
            this.dissolution.getComponent("dissolution").setPlayerAgreeStatus(dataObj.wxid, 0)
            //开始定时器
            this.dissolution.getComponent("dissolution").setTipsLabel(dataObj.name)
            //提示信息
            this.dissolution.getComponent("dissolution").startWaitTime(dataObj.seconds)
        }
        //广播 提交解散信息
        else if (sub == msgIds.CALL_ALLPLAYER_DISSOLUTION) {
            if (this.dissolution != undefined) {
                this.dissolution.getComponent("dissolution").setPlayerAgreeStatus(dataObj.wxid, dataObj.reqresult)
            }
        }
        //当有人拒绝或者所有人同意时，发送处理结果
        else if (sub == msgIds.RESULT_DISSOLUTION) {
            cc.log(dataObj.result)
            //0 代表退出房间 1代表继续游戏
            if (dataObj.result == 0) {
                if (this.dissolution != undefined) {
                    this.dissolution.destroy()
                    this.dissolution = undefined
                }
            }
            else {
                if (this.dissolution != undefined) {
                    this.dissolution.destroy()
                    this.dissolution = undefined
                }
                this.addMessageBox("有玩家拒绝解散，请继续游戏")
            }
        }
        //长时间为准备，弹框，确定跳出大厅
        else if (sub == msgIds.LONG_TIME_NOT_READY) {
            this.addMessageBox("超时未准备，已被系统踢出房间", this, function (target) {
                target.enterHomeEvent()
            }, 1)
        }
    },
    //聊天消息监听
    onChatMsgFaceMessage(sub, dataObj) {
        cc.log("chat message dispatch!");
        var wxId = dataObj.wxid;    // 发送消息人的微信ID
        var msgId = dataObj.idx;   // 消息对应的编码
        cc.log("---聊天消息：", dataObj)
        var sex = dataObj.sex;
        var name = dataObj.name;
        var gameType = dataObj.gameType;

        if (sub == msgIds.SMALL_MSG_ID) { // 文字
            if (gameType != null && gameType == 310) {
                this.dealWithChatMsg(wxId, msgId, name, sex);
                cc.log("------百人推筒子文字消息回调");
            }
            else {
                this.dealWithChatMsg(wxId, msgId);
            }
            // this.dealWithChatMsg(wxId, msgId);
        } else if (sub == msgIds.SMALL_FACE_ID) { // 表情
            this.dealWithChatFace(wxId, msgId);
        } else if (sub == msgIds.SMALL_MAGIC_FACE_ID) { // 魔法表情
            var sourceWxId = wxId;
            var targetWxId = dataObj.sendwxid;
            this.dealWithMagicFace(sourceWxId, targetWxId, msgId);
        } else if (sub == msgIds.SMALL_MSGINPUT_ID) {   // 聊天文字
            if (gameType != null && gameType == 310) {
                this.dealWithInputMsg(wxId, msgId, name);
                cc.log("------百人推筒子输入文字消息回调");
            }
            else {
                this.dealWithInputMsg(wxId, msgId);
            }
            // this.dealWithInputMsg(wxId, msgId);
        }
    },

    //销毁的时候，没写onDestroy，会自动销毁监听事件
    onDestroy() {
        this.uneventRegist(this)
        this.unregist(this)
    },
});
