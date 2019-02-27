//by cdl
//游戏消息接收
//游戏流程控制

var GameFrame = require("GameFrame")
var cmd = require("CMD_NN")

cc.Class({
    extends: GameFrame,
    properties: {

    },
    //格式必须这么写
    onLoad() {
        var obj = cc.find("Canvas/nnGameViewLayer")
        this._gamelayer = obj.getComponent("nnGameViewLayer")
        this._gamelayer.setGameControl(this)
    },

    //消息监听
    onEventGameMessage(sud, dataObj) {
        cc.log("--消息id--", sud)
        this._gamelayer.SprGPSCardPosShow();  //定位扑克牌位置
        switch (sud) {
            case cmd.SUB_SI_DOWN:
                cc.log("---坐下--消息--", dataObj);
                var wxid = dataObj.wxid
                if (wxid == G.myPlayerInfo.wxId) {
                    this._gamelayer.showReadybtn(false)
                }
                break;
            case cmd.SUB_R_READY:
                cc.log("--准备-ssssss--", dataObj);
                var wxid = dataObj.wxid
                this._gamelayer.SprReadyStateShow(wxid, true)
                if (wxid == G.myPlayerInfo.wxId) {
                    this._gamelayer.SprReadyShow(false);
                    this._gamelayer.SetActionNnClose("jiesuan")
                    this._gamelayer.UpdateCardGoHome();
                    //this._gamelayer.showWaitTxt("请等待其他玩家准备", true)
                }
                this._gamelayer.SprMinResultShow(false);
                break;
            case cmd.SUB_R_USER_INFO:
                cmd.isGameBegin = dataObj.gameBegin // 游戏是否开始
                var ruleObj = JSON.parse(dataObj.guize)
                var userList = dataObj.listuser
                G.isClubRoomId = dataObj.clubId;
                cc.log("----初始化-----", dataObj)
                var isjinbi = ruleObj.isjinbi;
                //语音进入房间，获取房号, 如果是接入语音，必须要写
                this.voiceJoinRoom(ruleObj.roomId)
                cc.log("--房间信息---", ruleObj)
                this._gamelayer.updateBaseinfo(ruleObj)
                this._gamelayer.ruleSave(ruleObj)
                cc.log("--jserList---玩家人数---", userList.length)
                this._gamelayer.updateUsersinfo(userList)
                this.reconnect(dataObj)
                if (cmd.isGameBegin == true) {
                    this._gamelayer.UpdateCardGoHome()
                    this._gamelayer.clearCacheCard() //清理桌面上的牌
                    this._gamelayer.zhuangShangEndAnim_1() //隐藏抢庄动画
                }
                this._gamelayer.showWaitTxt("坐下", false)

                break;
            case cmd.SUB_SHOW_STATE:
                cc.log("----显示开始按钮---", dataObj)
                var wxid = dataObj.wxid
                this._gamelayer.ShowStartBtn(wxid)
            case cmd.SUB_STATE_GAME:

                cc.log("-----开始游戏----", dataObj)
                var wxid = dataObj.wxid
                this._gamelayer.ShowStartBtn(wxid)
                this._gamelayer.showWaitTxt("可以开始游戏", false)

                break;
            case cmd.SUB_R_GETMY_CARD:

                cc.log("开始发牌", dataObj)
                this._gamelayer.ShowStartBtn(123)
                var listwxid = dataObj.sitPlayerId;
                var listCards = JSON.parse(dataObj.listpai);

                this._gamelayer.refreshMyCards_1(listCards, listwxid, false, true)
                this._gamelayer.SprReadyShow(false);

                for (var i = 0; i < listwxid.length; i++) {
                    this._gamelayer.playsoundCard(listwxid[i], "fapai"); //音效处理
                    this._gamelayer.SprReadyStateShow(listwxid[i], false) ///准备状态显示
                    this._gamelayer.showWaitTxt("开始发牌", true)
                }
                break;
            case cmd.SUB_R_QIANGZUANG:
                cc.log("-----提示抢庄----", dataObj)
                // this._gamelayer.SprMingCardShow()
                // this._gamelayer.SprQiangZhuangMaxShou(dataObj.qiangZhuList)
                this._gamelayer.SprQiangZhuangShow(dataObj.wanfa, true);
                var qiangZhuangTime = dataObj.qiangZhuangTime;
                cc.log("----提示抢庄时间倒计时---", qiangZhuangTime)
                this._gamelayer.SprCountDownShow("选择抢庄:", qiangZhuangTime)
                break;
            case cmd.SUB_R_TUIZHU:
                var ketuichus = dataObj.data;  //可推注人的列表
                cc.log("可推注人的列表  ++++ ", dataObj)
                // this._gamelayer.TuiZhuStart(1, ketuichus)

                break;
            case cmd.SUB_R_SBUMIT:
                cc.log("-----提交抢庄----", dataObj)
                var wxid = dataObj.wxid;
                var beishu = dataObj.beishu;

                this._gamelayer.ActionNnShow("zhuang", beishu, wxid, true)
                if (dataObj.beishu == 2) {
                    this._gamelayer.playsoundCard(wxid, "qiangzhuang");
                }
                if (wxid == G.myPlayerInfo.wxId) {
                    this._gamelayer.SprCountDownShow("抢庄完成：", cmd.HINT_END)
                    this._gamelayer.showWaitTxt("请等待其他玩家抢庄", true)
                    this._gamelayer.SprQiangZhuangHide();
                }
                break;
            case cmd.SUB_R_SBUMIT_RESULT:

                cc.log("-----抢庄结果----", dataObj, "玩法： ", this._gamelayer._roomList.wanfa)
                this._gamelayer.reconnectionInit()
                var zhuangwxid = dataObj.zhuangwxid;
                var maxbeishu = dataObj.maxbeishu;
                //抢庄动画开始
                var listwxid = dataObj.listwxid;
                if (listwxid) {
                    if (listwxid.length >= 2) {
                        this._gamelayer.zhuangAnimationPlay(listwxid, true, zhuangwxid, maxbeishu)
                    } else {
                        this._gamelayer.UpdataZhuang(zhuangwxid, true)
                        this._gamelayer.ActionNnShow("xiazhu", maxbeishu, zhuangwxid, true)
                    }
                }
                this._gamelayer.SetActionNnClose("node_Qiang")
                if (zhuangwxid != G.myPlayerInfo.wxId) {
                    this._gamelayer.showWaitTxt("准备下注", true)
                } else {
                    this._gamelayer.showWaitTxt("请等待其他玩家下注", true)
                }
                break;
            case cmd.SUB_R_HINT_XIAZHU:
                cc.log("----提示下注----", dataObj)
                var listxiazhu = dataObj.listxiazhu;
                var xiazhuTime = dataObj.xiazhuTime;

                cc.log("----提示下注时间倒计时---", xiazhuTime)
                this._gamelayer.SprCountDownShow("请选择下注:", xiazhuTime)
                this._gamelayer.SprXiaZhuShow(listxiazhu, true)

                break;
            case cmd.SUB_R_SUBMIT_XIAZHU:
                cc.log("----下注提交结果----", dataObj)
                this._gamelayer.AnimaDingZhuangSetPos(false);
                var wxid = dataObj.wxid;
                var xiazhu = dataObj.xiazhu;
                // var yituizhus = dataObj.yituizhus; // 已推注人的列表
                // this._gamelayer.TuiZhuStart(2, yituizhus)
                this._gamelayer.playNNEffectMusic('chips_to_table', wxid, true)  //游戏音效
                this._gamelayer.CopyFoundClip(wxid, "xiazhu")
                if (wxid == G.myPlayerInfo.wxId) {
                    this._gamelayer.SprCountDownShow("下注完成：", cmd.HINT_END)
                    this._gamelayer.SprXiaZhuShow("notdisPlay", false)
                    this._gamelayer.showWaitTxt("请等待其他玩家下注", true)
                }
                this._gamelayer.SprXiaZhuClipShow(true, xiazhu, wxid);
                break;
            case cmd.SUB_R_XIAZHU_RESULT:
                this._gamelayer.TuiZhuOver()
                cc.log("----下注结束----", dataObj)
                if (this._gamelayer._roomList.wanfa <= 3) {
                    this._gamelayer.SprLookCardShow(true, true, false);
                } else {
                    this._gamelayer.SprLookCardShow(true, false, true);
                }
                this._gamelayer.SprCountDownShow("查看手牌:", 10)
                break;
            case cmd.SUB_R_LOOK_FIRECARD:

                cc.log("----第五张牌----", dataObj)
                var listpai = [0, 0];
                this._gamelayer.refreshMyCards_1(listpai, dataObj.listwxid, true, false)

                break;
            case cmd.SUB_S_LOOK_MYTOSHOWCARD: //搓牌 亮牌给自己
                cc.log('搓牌 亮牌给自己 == 》190', dataObj)
                var wxid = dataObj.wxid;
                var zhuangWxId = dataObj.zhuangWxId
                var cardtypeNum = dataObj.type;
                var fiveCard = dataObj.fiveCard; //第 五 张 牌  操作
                this._gamelayer.LookCardCloseMingCard(wxid)

                this._gamelayer.refreshLiangMyCards(dataObj.listpai, wxid, cardtypeNum, fiveCard)

                this._gamelayer.LiangPaiCardTypeShow(cardtypeNum, dataObj.bei, wxid)//赋值牌型

                this._gamelayer.playsoundCard(wxid, dataObj.typeBei, true);
                this._gamelayer.SetActionNnClose("node_XiaZhu")

                this._gamelayer.DelCuoCard();

                if (zhuangWxId == G.myPlayerInfo.wxId) {
                    this._gamelayer.SprLookCardShow(false, false, false);
                }
                else {
                    this._gamelayer.SprLookCardShow(true, false, false);
                }
                break;
            case cmd.SUB_R_DISCARD:
                cc.log("---亮牌---", dataObj)
                this.showCard(dataObj)
                break;
            case cmd.SUB_R_ALLSHOWCARD:
                this.allPlayersShowCard(dataObj)
                break;
            case cmd.SUB_R_DISCARDINFO:
                cc.log("--看牌人 立即--", dataObj)
                this._gamelayer.LookCardCloseMingCard(dataObj.wxid)

                break;
            case cmd.SUB_R_MIN_RESULT:
                cc.log("----小结算----", dataObj)
                var jiesuan = JSON.parse(dataObj.jiesuan);
                var zhuangwxid = dataObj.zhuangWxId;
                this._gamelayer.playNNEffectMusic('chips_to_table', zhuangwxid, true)
                this._gamelayer.UpdateResurMoney(zhuangwxid, jiesuan, true);
                this._gamelayer.showWaitTxt("下一局即将开始", true)
                break;
            case cmd.SUB_R_HINT_READY:
                cc.log("---提示准备", dataObj);

                var arr = this._gamelayer._userList.some(function (userData) {
                    return userData.wxId == G.myPlayerInfo.wxId && userData.sit == true;
                })
                if (arr == true) {
                    this._gamelayer.SprReadyShow(true);
                }
                this._gamelayer.SetActionNnClose("jiesuan")
                this._gamelayer.UpdateCardGoHome();
                //this._gamelayer.showWaitTxt("可以开始游戏", false)
                break;
            case cmd.SUB_R_JIANGCHI:
                cc.log("--奖池--", dataObj);
                var num = dataObj.jiangchi;
                this._gamelayer.JiangNum(num);
                break;
            case cmd.SUB_R_JIANGCHI_NAME:
                cc.log("--爆将人----", dataObj)
                this._gamelayer.setZJHNotice(dataObj.baoJiang)
                break;
            case cmd.SUB_R_MAX_RESULT:
                cc.log("---大结算---", dataObj);
                var listdajiesuan = JSON.parse(dataObj.listdajiesuan);
                var juLeBuId = dataObj.julebuid;
                cc.log("-----查看结算俱乐部ID:", juLeBuId);
                if(juLeBuId){
                    G.returnIdForClub = juLeBuId;
                }
                
                this._gamelayer.SprMaxResultShow(true, listdajiesuan);
                break;
            case cmd.SUB_R_UPDATE_COIN:
                cc.log("---更新玩家金币/分数---", dataObj);
                this._gamelayer.updateuserBase(dataObj);
                break;
            case cmd.SUB_CLEARZHU:
                cc.log("---清除没坐下的玩家的下注信息---", dataObj)
                this._gamelayer.SetActionNnClose("node_XiaZhu")
                break;
            case cmd.SUB_R_READY_SUER:
                cc.log("---420--准备过的人----", dataObj);
                var wxid = dataObj.wxid
                this._gamelayer.SprReadyStateShow(wxid, true)
                if (wxid == G.myPlayerInfo.wxId) {
                    this._gamelayer.SprReadyShow(false);
                    this._gamelayer.SetActionNnClose("jiesuan")
                    this._gamelayer.UpdateCardGoHome();
                    //this._gamelayer.showWaitTxt("请等待其他玩家准备", true)
                }
                this._gamelayer.SprMinResultShow(false);
                break;
            case cmd.SUB_R_CLEAR_DESKTOP_CARD:
                cc.log('牛牛小消息 ==》 430', "清理桌面的牌数据")
                this._gamelayer.clearCacheCard() //清理桌面上的牌
                this._gamelayer.SetActionNnClose("jiesuan")
                this._gamelayer.UpdateCardGoHome()
                this._gamelayer.SprXiaZhuClipHide()
                break;
            case cmd.SUB_R_CUOCARD:
                cc.log("---搓牌---", dataObj);
                this._gamelayer.GetCuoCardFunc(dataObj);
                break;
            case cmd.MAIN_MSG_ID:
                cc.log("消息 400 ==》》", dataObj)
                this._gamelayer.updateBaseJuShuInfo(dataObj.round, dataObj.number)
                break;
            case cmd.SUB_SHOWCORDNODE:

                this._gamelayer.showSelectPokerWindow()
                break;
            case cmd.SUB_QX:
                this._gamelayer.closeSelectPokerWindow()
                break;
            case cmd.SUB_SHANGJUHUIGU:
                //上局回顾
                this._gamelayer.shangJuHuiGu(dataObj)
                break;

            // default:
            //     cc.log("---找不到消息---", sub, "内容为：", dataObj)
            //     break;
        }
    },

    //统一亮牌处理
    allPlayersShowCard(param) {
        var data = JSON.parse(param.data)
        for (let i = 0; i < data.length; i++) {
            this.showCard(data[i])
        }
    },

    //单一的亮牌
    showCard(dataObj) {
        var wxid = dataObj.wxid;
        var cardtypeNum = dataObj.type;
        var fiveCard = dataObj.fiveCard; //第 五 张 牌  操作
        this._gamelayer.LookCardCloseMingCard(wxid)
        this._gamelayer.refreshLiangMyCards(dataObj.listpai, wxid, cardtypeNum, fiveCard)
        this._gamelayer.LiangPaiCardTypeShow(cardtypeNum, dataObj.bei, wxid)  //赋值牌型
        this._gamelayer.playsoundCard(wxid, dataObj.typeBei, true);
        this._gamelayer.SetActionNnClose("node_XiaZhu")
        if (wxid == G.myPlayerInfo.wxId) {
            this._gamelayer.DelCuoCard();
            this._gamelayer.SprLookCardShow(false, false, false);
            this._gamelayer.SprCountDownShow("亮牌完成:", cmd.HINT_END)
            this._gamelayer.showWaitTxt("请等待其他玩家亮牌", true)
        }
        this._gamelayer.RecycleMoney()
        // this._gamelayer.SprXiaZhuClipShow(false, 0, wxid);
    },


    dealWithChatMsg(wxId, msgId) {
        cc.log("------wxId----", wxId)
        cc.log("------msgId----", msgId)
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
        cc.globalMgr.globalFunc.addChatMsgTip(400, seatNode, dir, pos, msgId);
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
        cc.log("----断线重连消息接受---拖拉机-----", dataObj)
        G.isClubRoomId = dataObj.clubId;
        var ruleObj = JSON.parse(dataObj.guize)
        var userList = dataObj.listuser
        //更新房间内基本信息
        this._gamelayer.updateBaseinfo(ruleObj)
        //更新玩家基本信息
        this._gamelayer.updateUsersinfo(userList)
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
    },
});

