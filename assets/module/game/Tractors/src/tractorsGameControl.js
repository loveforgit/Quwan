//by cdl
//游戏消息接收
//游戏流程控制

var GameFrame = require("GameFrame")
var cmd = require("CMD_Tractors")

cc.Class({
    extends: GameFrame,
    properties: {

    },
    //格式必须这么写
    onLoad() {
        var obj = cc.find("Canvas/tractorsGameViewLayer")
        this._gamelayer = obj.getComponent("tractorsGameViewLayer")
        this._gamelayer.setGameControl(this)
    },


    //消息监听
    onEventGameMessage(sud, dataObj) {
        cc.log("--消息id--", sud)
        switch (sud) {
            case cmd.SUB_R_USER_INFO:
                //开始游戏后清空相应图标s
                this._gamelayer.clearTable();
                var ruleObj = JSON.parse(dataObj.guize)
                var userList = dataObj.listuser
                cc.log("----初始化-----", dataObj)
                var isjinbi = ruleObj.isjinbi;
                this._gamelayer.checkGlodAndFinfe(isjinbi);
                //语音进入房间，获取房号, 如果是接入语音，必须要写
                this.voiceJoinRoom(ruleObj.roomId)
                //更新房间内基本信息
                cc.log("--房间信息---", ruleObj)
                var isReady = dataObj.isReady;
                cc.log("---准备状态--", isReady)
                this._gamelayer.updateBaseinfo(ruleObj, isReady)
                //更新玩家基本信息
                this._gamelayer.updateUsersinfo(userList)
                //离开房间
                // this._gamelayer.setReturnHomeBtnCanTouch(true)
                //断线
                this.reconnect(dataObj)
                //this._gamelayer.OnInitPoker();
                this._gamelayer.InitNewRoomJu();
                this._gamelayer.InitUserPosFunc();
                break;
            case cmd.SUB_R_RULEINFO:
                cc.log("------跟新房间规则", dataObj);
                var ruleObj = JSON.parse(dataObj.guize)
                this._gamelayer.upRoomInfo(ruleObj);
                break;
            case cmd.SUB_R_UPDATE_INFO:
                break;
            case cmd.SUB_R_USERPLAY:
                //断线
                this.reconnectPlay(dataObj)
                break;
            case cmd.SUB_R_READY:
                cc.log("---玩家准备---", dataObj);
                var wxid = dataObj.wxid
                this._gamelayer.playerReady(wxid, true)
                if (wxid == G.myPlayerInfo.wxId) {
                    this._gamelayer.showReadybtn(false)
                }
                this._gamelayer.playsoundCard(wxid, "zhunbei", 1)
                //离开房间
                // this._gamelayer.setReturnHomeBtnCanTouch(false)
                //初始化筹码
                this._gamelayer.InitClipFunc();
                this._gamelayer.InitUserPosFunc();
                break;
            case cmd.SUB_R_GETMY_CARD:
                cc.log("--手牌为--：", dataObj)
                //玩家自己的手牌数据
                //显示玩家手牌
                this._gamelayer.openAllPlayerCards();

                //清空桌面
                var listwxid = dataObj.listwxid;
                var listCards = [0, 0, 0];
                this._gamelayer.refreshMyCards(listCards, listwxid)
                //游戏开始之后，玩家准备隐藏
                this._gamelayer.allPlayerReady(false)
                //开始游戏后清空相应图标s
                this._gamelayer.clearTable(true);
                //轮数清空
                this._gamelayer.RoomWheel(0);
                this._gamelayer.isGameStart = true;
                break;
            case cmd.SUB_R_CALL_CHOSE:
                cc.log("-----轮流出牌----", dataObj)
                this._gamelayer.hitPlayRes(dataObj.wxid, true)
                //计时器开始
                this._gamelayer.startWaitTime(dataObj.wxid)
                this._gamelayer.clearTable(true);
                break;
            case cmd.SUB_R_PULL_MONEY:
                cc.log("--下注提交消息---", dataObj)
                var wxid = dataObj.wxid;
                var currentallmoney = dataObj.totalxiazhu;
                var currentType = dataObj.xuHao;
                var currentmoney = dataObj.xiazhu;
                var currentClipType = dataObj.type;
                // 玩家下注总金额显示
                this._gamelayer.getDendAlloMoney(wxid, currentallmoney);
                cc.log("---现在下注金额---", currentmoney)
                // 扔筹码动画
                this._gamelayer.spriteMoveAction(wxid, currentmoney, currentType);
                //关闭计时器
                this._gamelayer.stopWaitTime(wxid);
                //跟注情况 1,跟注 2，加注
                //音效跟显示
                this._gamelayer.playSoundType(wxid, currentClipType)

                //隐藏比牌界面
                this._gamelayer.OnClearPVPBtn();
                break;
            case cmd.SUB_R_MAX_CLIP:
                cc.log("--最大下注数ss---", dataObj)
                var currentmoney = dataObj.xiazhu;
                // 获取最高筹码数量
                this._gamelayer.getSendMoney(currentmoney);
                cc.log("--最大下注数160---", currentmoney)

                break;
            case cmd.SUB_R_LOOK_CARDS:
                cc.log("--玩家看牌--", dataObj)
                var wxid = dataObj.wxid;
                var type = dataObj.type;
                if (wxid == G.myPlayerInfo.wxId) {
                    var listCards = JSON.parse(dataObj.listpai);
                    //看牌玩家牌显示
                    this._gamelayer.refreshmycard(listCards, wxid, type)

                    cc.log("-----查看筹码显示原始数据：", this._gamelayer.AddponitNumArray);
                    //双倍显示筹码
                    this._gamelayer.UpDateDisPlayClipForDouble(this._gamelayer.AddponitNumArray);
                }
                //状态提醒
                this._gamelayer.Informothers(wxid, "看牌", true);
                this._gamelayer.playsoundCard(wxid, "lookCard", 1);
                break;
            case cmd.SUB_R_DISCARD:
                cc.log("--玩家弃牌---", dataObj)
                var wxid = dataObj.wxid;
                this._gamelayer.Informothers(wxid, "弃牌", true)
                this._gamelayer.setClockActive(false, wxid)
                this._gamelayer.playsoundCard(wxid, "fangqi", 1)
                this._gamelayer.closeAllPlayerCards(wxid);
                break;
            case cmd.SUB_R_PVP_CARD:
                cc.log("--比牌ss--", dataObj)
                //比牌输
                var losewxid = dataObj.losewxid;
                //发起比牌人
                var initiatorwxid = dataObj.bgwxid;
                //被比牌人
                var otherwxid = dataObj.otherwxid;
                //发起比牌人手牌
                var bgListpai = dataObj.bglistpai;
                //被比牌人手牌
                var otherListPai = dataObj.otherlistpai
                //发起比牌人手牌类型
                var bgpaixing = dataObj.bgpaixing;
                //被比牌人手牌类型
                var otherpaixing = dataObj.otherpaixing

                //比牌动画 
                this._gamelayer.PlayPvPAnima(losewxid, initiatorwxid, otherwxid, bgListpai, otherListPai, bgpaixing, otherpaixing);

                this._gamelayer.Informothers(losewxid, "比牌输", true, true)
                this._gamelayer.playsoundCard(initiatorwxid, "bipai", 1);
                if (initiatorwxid != losewxid)
                    this._gamelayer.Informothers(initiatorwxid, "比牌赢", true, true)
                else if (otherwxid != losewxid)
                    this._gamelayer.Informothers(otherwxid, "比牌赢", true, true)
                break;
            case cmd.SBU_R_SETTLE_ACCOUNTS:
                //小结算界面
                var listjiesuan = JSON.parse(dataObj.listjiesuan);
                cc.log("--小结算--", listjiesuan)
                //刷新玩家状态
                this._gamelayer.refreshRoom(false);
                for (var i = 0; i < listjiesuan.length; i++)
                    this._gamelayer.Informothers(listjiesuan[i].wxid, "结束", false)

                this._gamelayer.minsetClip(listjiesuan);
                this._gamelayer.MinSettleStart(listjiesuan)
                this._gamelayer.InitUserPosFunc();
                this._gamelayer.isGameStart = false;
                this._gamelayer.OnDownClipAllShow(0, false)
                break;
            case cmd.SBU_R_SETTLE_BASE:
                //结算分数

                break;
            case cmd.SUB_R_SETTLE_MAX:
                cc.log("---大结算--", dataObj)
                var listdajiesuan = JSON.parse(dataObj.listdajiesuan)
                var juLeBuId = dataObj.julebuid;
                cc.log("-----查看结算俱乐部ID:", juLeBuId);
                if(juLeBuId){
                    G.returnIdForClub = juLeBuId;
                }
                this._gamelayer.showBigResultNode(listdajiesuan)
                break;
            case cmd.SUB_R_whell:
                cc.log("---lun---", dataObj)
                var WheelNum = dataObj.lunshu;
                this._gamelayer.RoomWheel(WheelNum);
                break;
            case cmd.SUB_R_COIN_NUM:
                cc.log("---乐币更新---", dataObj)
                this._gamelayer.updateuserBase(dataObj);
                break;
            case cmd.SUB_R_ZHUANG:
                cc.log("--庄家--", dataObj)
                this._gamelayer.UpdataZhuang(dataObj.wxid, true);
                break;
            case cmd.SUB_R_END_TRUSTEESHIP:
                cc.log("--托管--", dataObj)
                var wxid = dataObj.wxid;
                this._gamelayer.TrusteeshipType(wxid, true);
                this._gamelayer.Informothers(wxid, "托管", true)
                break;
            case cmd.SUB_R_CHANE_TRUSTEESHIP:
                cc.log("--取消托管---", dataObj)
                var wxid = dataObj.wxid;
                this._gamelayer.TrusteeshipType(wxid, false);
                this._gamelayer.Informothers(wxid, "隐藏", false)
                break;
            case cmd.SUB_R_START_GAME:
                cc.log("---提示开始游戏---", dataObj);
                this._gamelayer.SprStartGameShow(true);
                break;
            case cmd.SUB_R_START_GAMEEND:
                cc.log("---开始游戏回调---", dataObj);
                this._gamelayer.SprStartGameShow(false);
                break;
            case cmd.SUB_R_LOSET:
                cc.log("---断线重连-玩家状态--- ", dataObj);
                this._gamelayer.Informothers(dataObj.wxid, "输了", true)
                break;
            case cmd.SUB_R_ALLDOWNCLIP:
                cc.log("----下注总数---", dataObj)
                this._gamelayer.OnDownClipAllShow(dataObj.allZhu, true)
                break;
            case cmd.SUB_R_SUPER:
                cc.log("超端", dataObj);
                this._gamelayer.showSuperCards(JSON.parse(dataObj.fuZhu));
                break;
        }
    },
    dealWithChatMsg(wxId, msgId) {
        var seatIndex = this._gamelayer.getTableIndex(wxId);
        var seatNode = this._gamelayer.user_node[seatIndex];
        var pos = cc.p(50, 0);
        var dir = 1;
        if (seatIndex == 0) {
            pos = cc.p(50, 0);
            dir = 1;
        } else if (seatIndex == 1 || seatIndex == 2 || seatIndex == 3) {
            pos = cc.p(-100, 0);
            dir = -1;
        }
        cc.globalMgr.globalFunc.addChatMsgTip(500, seatNode, dir, pos, msgId);
        this._gamelayer.playChatSound(msgId, wxId)
    },
    dealWithChatFace(wxId, msgId) {
        var seatIndex = this._gamelayer.getTableIndex(wxId);
        var seatNode = this._gamelayer.user_node[seatIndex];
        cc.globalMgr.globalFunc.addChatFaceTip(seatNode, cc.p(0, 0), msgId);

    },

    dealWithMagicFace(sourceWxId, targetWxId, msgId) {
        var seatIndex1 = this._gamelayer.getTableIndex(sourceWxId);
        var seatNode1 = this._gamelayer.user_node[seatIndex1];
        var seatIndex2 = this._gamelayer.getTableIndex(targetWxId);
        var seatNode2 = this._gamelayer.user_node[seatIndex2];
        var pos1 = seatNode1.parent.convertToWorldSpaceAR(seatNode1.position);
        var pos2 = seatNode2.parent.convertToWorldSpaceAR(seatNode2.position);
        cc.globalMgr.globalFunc.addMagicFace(pos1, pos2, msgId);
    },
    //断线重连消息处理
    reconnect(dataObj) {
        cc.log("----断线重连消息接受---炸金花-----", dataObj)

        var ruleObj = JSON.parse(dataObj.guize)
        var userList = dataObj.listuser
        //更新房间内基本信息
        var isReady = dataObj.isReady;
        cc.log("---准备状态-s-", isReady)
        this._gamelayer.updateBaseinfo(ruleObj, isReady)
        //更新玩家基本信息
        this._gamelayer.updateUsersinfo(userList)


    },
    reconnectPlay(dataObj) {
        cc.log("---后入者--", dataObj)

        var ruleObj = JSON.parse(dataObj.guize)
        var userList = dataObj.listuser
        //更新房间内基本信息
        this._gamelayer.updateBaseinfo(ruleObj)
        //更新玩家基本信息
        this._gamelayer.updateUsersinfo(userList)

        //玩家下注数量
        if (dataObj.listuserxiazhu) {
            var XiaAllList = dataObj.listuserxiazhu;
            for (var i = 0; i < XiaAllList.length; i++)
                this._gamelayer.getDendAlloMoney(XiaAllList[i].wxid, XiaAllList[i].sumXiaZhu)
        }

        //玩家轮流下注
        if (dataObj.listxiazhu) {
            var xiaList = dataObj.listxiazhu;
            for (var i = 0; i < xiaList.length; i++) {
                cc.log("-----轮流扔筹码---", xiaList[i].wxid)
                cc.log("-----扔筹码金额---", xiaList[i].xiazhu)
                cc.log("-----扔筹码区域---", xiaList[i].xuHao)
                this._gamelayer.spriteMoveAction(xiaList[i].wxid, xiaList[i].xiazhu, xiaList[i].xuHao)
            }
        }
        if (dataObj.listpaiuser) {
            var listpaiuser = dataObj.listpaiuser;
            var listCards = [0, 0, 0];
            this._gamelayer.refreshMyCards(listCards, listpaiuser)
        }
    },
    dealWithInputMsg(wxId, msgId) {
        cc.log("进入文字输入定位");
        var seatIndex = this._gamelayer.getTableIndex(wxId);
        var seatNode = this._gamelayer.user_node[seatIndex];
        var pos = cc.p(50, 0);
        var dir = 1;

        if (seatIndex == 0) {
            pos = cc.p(50, 0);
            dir = 1;
        } else if (seatIndex == 1 || seatIndex == 2 || seatIndex == 3) {
            pos = cc.p(-100, 0);
            dir = -1;
        }
        cc.globalMgr.globalFunc.addInputTip(seatNode, dir, pos, msgId);
        // cc.globalMgr.globalFunc.addChatMsgTip(seatNode, pos, msgId);
        // this._gamelayer.playChatSound(msgId, wxId);
    },
});
