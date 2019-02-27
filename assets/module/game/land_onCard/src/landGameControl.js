//by yky
//游戏消息接收
//游戏流程控制

var GameFrame = require("GameFrame")
var cmd = require("CMD_land")

cc.Class({
    extends: GameFrame,
    properties: {
    },
    //格式必须这么写
    onLoad() {
        var obj = cc.find("Canvas/landGameVieweLayer")
        this._gamelayer = obj.getComponent("landGameVieweLayer")
        this._gamelayer.setGameControl(this)

        this.rule = {}
    },

    //消息监听
    onEventGameMessage(sub, dataObj) {
        cc.log("子消息id ", sub)
        //玩家消息
        if (sub == cmd.SUB_R_USER_INFO) {
            cc.log(dataObj, "============================")
            var ruleObj = JSON.parse(dataObj.guize)
            this.rule = ruleObj
            var userList = dataObj.listuser
            //清空界面
            this._gamelayer.clearTable()
            //显示准备按钮
            if (dataObj.isReady == false) {
                this._gamelayer.showReadybtn(true)
                // this._gamelayer.moveReadyBtn(ruleObj.isjinbi)
                if (ruleObj.isjinbi == true) {
                    //this._gamelayer.setCopyBtnCanTouch(false)
                    if (ruleObj.isbegin == false)
                        this._gamelayer.setChangeTableBtnCanTouch(true)
                }
                else {
                    // this._gamelayer.setCopyBtnCanTouch(true)
                    this._gamelayer.setChangeTableBtnCanTouch(false)
                }
            }
            if (G.isRePlay == true) {
                this._gamelayer.showReadybtn(false)
            }
            this._gamelayer.isShowCardNums(ruleObj.cardNum) //是否显示剩余牌数
            //语音进入房间，获取房号, 如果是接入语音，必须要写
            this.voiceJoinRoom(ruleObj.roomId)
            //更新局数
            this._gamelayer.updateGamesNumber(1, ruleObj.jushu)
            //更新房间内基本信息
            //this._gamelayer.updateBaseinfo(ruleObj)
            //更新倍数底分
            this._gamelayer.refreshBaseScore(ruleObj.difen, 0)
            //更新玩家基本信息
            cc.log(userList, ruleObj.isjinbi, "userList======================")
            if (ruleObj.isjinbi == true) {
                G.isCoinRoom = true;
            }
            else {
                G.isCoinRoom = false;
            }
            this._gamelayer.updateUsersinfo(userList)

            //是否是金币场或者房卡场 界面显示
            this.setGoldRoomOrCardRoom(ruleObj.isjinbi)
            //如果玩家在未开始状态，离开房间能点击，如果在开始状态，离开房间无法点击
            if (ruleObj.isbegin == false) {
                this._gamelayer.setGameIsStart(false)
                // this._gamelayer.setReturnHomeBtnCanTouch(true)
                this._gamelayer.setChangeTableBtnCanTouch(true)
            }
            else {
                this._gamelayer.setGameIsStart(true)
                //如果是金币场，离开按钮一直可以点击
                // if(ruleObj.isjinbi == true)
                // {
                //     this._gamelayer.setReturnHomeBtnCanTouch(true)
                // }
                // else{
                //     this._gamelayer.setReturnHomeBtnCanTouch(false)
                // }

                this._gamelayer.setChangeTableBtnCanTouch(false)
            }
            //刷新玩家是否是房主图片
            // this._gamelayer.judegeUserIsRoomOwner(ruleObj.fzwxid)
            //收到消息，隐藏背景遮罩
            this._gamelayer.hideMaskBg()
            //断线重连消息初始化
            this.reconnect(dataObj)
        }
        else if (sub == cmd.SUB_R_PLAYER_SCORE) {
            //刷新玩家分数
            cc.log("刷新玩家分数")
            this._gamelayer.updateUserScore(JSON.parse(dataObj.listfen))
        }
        else if (sub == cmd.SUB_R_GAMES_COUNT) {
            //刷新游戏局数
            cc.log("刷新游戏局数")
            this._gamelayer.updateGamesNumber(dataObj.jushu, this.rule.jushu)
        }

        else if (sub == cmd.SUB_R_READY) {
            cc.log("--玩家准备----")
            var wxid = dataObj.wxid
            this._gamelayer.playerReady(wxid, true)
            if (wxid == G.myPlayerInfo.wxId) {
                //清空桌面
                this._gamelayer.clearTable()
                this._gamelayer.showReadybtn(false)
                this._gamelayer.setCopyBtnCanTouch(false)
                this._gamelayer.setChangeTableBtnCanTouch(false)
            }
        }
        //获取自己手牌, 游戏开始，一局游戏只会执行一次
        //牌值计算
        //h 字段 a 方块 b 黑桃 c 红桃 d 梅花
        //v 字段 14 == 1 15 == 2 53 == 小王 54 == 大王
        else if (sub == cmd.SUB_R_GETMY_CARD) {
            cc.log("获取自己手牌")
            //清空桌面
            this._gamelayer.nextClearTable()
            //隐藏小结算面板
            this._gamelayer.showResultNode(false)
            //玩家自己的手牌数据
            var listCards = dataObj.listpai
            if (G.isRePlay == true) {
                cc.log(listCards, dataObj.wxId, G.myPlayerInfo.wxId, "-------------------刷新")
                this._gamelayer.refreshMyCards(listCards, dataObj.wxId)
            }
            else {
                cc.log("-------------------bu刷新")
                this._gamelayer.refreshMyCards(listCards)
            }

            //游戏开始之后，玩家准备隐藏
            this._gamelayer.allPlayerReady(false)
            //游戏刚开始，每人玩家剩余牌17
            this._gamelayer.setGameStartSurplusCardNums()
            //隐藏邀请好友按钮
            this._gamelayer.showInvitation(false)
            //播放游戏开始音效
            this._gamelayer.playSound("start")
            //游戏开始后，返回大厅按钮不能点击
            this._gamelayer.setGameIsStart(true)
            //如果是金币场，返回按钮可以点击
            // this._gamelayer.setReturnHomeBtnCanTouch(this.rule.isjinbi)
            this._gamelayer.setCopyBtnCanTouch(false)
            this._gamelayer.setChangeTableBtnCanTouch(false)
            //隐藏所有玩家不出提示
            this._gamelayer.showNotSendspAll()
        }
        //提示叫地主
        else if (sub == cmd.SUB_R_CALL_LAND) {
            cc.log(dataObj, "提示叫地主")
            this._gamelayer.callLand(dataObj.wxid, dataObj.difen)
            this._gamelayer.startWaitTime(dataObj.wxid, dataObj.seconds)
        }
        //提交叫地主返回结果
        else if (sub == cmd.SUB_S_CALL_LAND) {
            //隐藏抢地主按钮
            this._gamelayer.showCallLandMenu(false);
            //隐藏定时器
            this._gamelayer.stopWaitTime(dataObj.wxid)
            //显示抢庄倍数
            this._gamelayer.showCallLandScore(dataObj.wxid, dataObj.fen)
            //保存上局玩家抢庄的分数
            this._gamelayer.saveOtherCallScore(dataObj.fen)
        }
        //拿到地主
        else if (sub == cmd.SUB_R_GET_LAND) {
            cc.log("拿到地主")
            this._gamelayer.showLandImg(dataObj.wxid, true)
            //隐藏叫分
            this._gamelayer.hideAllPlayerScore()
            //设置地主剩余牌 20 ，农民 17
            this._gamelayer.setLandSurplusCardNums(dataObj.wxid)
        }
        else if (sub == cmd.SUB_R_REFRESH_BASE_SCORE) {
            cc.log("刷新倍数底分")
            this._gamelayer.refreshBaseScore(this.rule.difen, dataObj.beishu)
        }
        //三张底牌
        else if (sub == cmd.SUB_R_THREE_CARD) {
            cc.log("三张底牌")
            this._gamelayer.createThreeCards(dataObj.listpai)
        }
        else if (sub == cmd.SUB_S_TIP_ADDBEI) {
            cc.log(dataObj, "是否加倍")

            //this._gamelayer.isAddBei()
            //this._gamelayer.startJiaBeiWaitTime(dataObj.wxid, dataObj.time)
        }
        else if (sub == cmd.SUB_S_SEND_JIABEI) {
            cc.log(dataObj, "加倍的回调")
            //this._gamelayer.addBeiInfo(dataObj)
        }
        //提示出牌
        else if (sub == cmd.SUB_R_PROMPT_SEND_CARD) {
            cc.log("提示出牌")
            this._gamelayer.clearMySendCards(dataObj.wxid);

            //显示出牌按钮
            this._gamelayer.showSendCardMenu(dataObj.wxid, true, dataObj.type, dataObj.isCanGuan)
            //如果type == 0， 相当于过了一圈，把桌面上所有出的牌，清空掉
            if (dataObj.type == 0) {
                this._gamelayer.clearAllSendPoker()
            }
            //移除玩家出的牌
            this._gamelayer.clearSendCards(dataObj.wxid)
            //开启定时器
            this._gamelayer.startWaitTime(dataObj.wxid, dataObj.seconds)
            //隐藏不出提示
            this._gamelayer.showNotSendSp(dataObj.wxid, false)
            //初始化之前存储的提示牌列表
            this._gamelayer.initTipsPokersList()
        }
        //玩家出牌消息接收
        else if (sub == cmd.SUB_S_PLAY_CARDS) {
            cc.log("玩家出牌")
            //清空上把牌数据
            this._gamelayer.clearSendCards(dataObj.wxid)
            //展现这把牌数据
            this._gamelayer.playerSendCard(dataObj.wxid, dataObj.listpai)
            //隐藏定时器
            this._gamelayer.stopWaitTime(dataObj.wxid)
            //隐藏按钮
            this._gamelayer.showSendCardMenu(dataObj.wxid, false)
            //隐藏提示文字
            this._gamelayer.showTipsLabel("", false)
            //隐藏不出提示
            this._gamelayer.showNotSendSp(dataObj.wxid, false)
            //重新设置剩余牌书
            this._gamelayer.setSurplusCardNums(dataObj.wxid, dataObj.paicount)
            //播放动画特效
            this._gamelayer.playAnimation(dataObj.paixing)

            //根据牌型判断播放音效
            // this._gamelayer.playSendPokerSound(dataObj.listpai, dataObj.wxid)
        }
        //出牌后刷新自己手牌
        else if (sub == cmd.SUB_R_MYSELF_CARDS) {
            cc.log("出牌后刷新自己的手牌")
            //玩家自己的手牌数据
            var listCards = dataObj.listpai
            if (G.isRePlay == true) {
                this._gamelayer.refreshMyCards(listCards, dataObj.wxId)
            }
            else {
                this._gamelayer.refreshMyCards(listCards)
            }
        }
        //提示管牌/出牌
        else if (sub == cmd.SUB_R_TIPS_SEND_CARD) {
            cc.log("提示管牌/出牌")
            var tipsPokerList = JSON.parse(dataObj.listpai)
            this._gamelayer.saveTipsPokersList(tipsPokerList)
            this._gamelayer.promptSendCards(tipsPokerList, 0)
        }
        //玩家不出
        else if (sub == cmd.SUB_R_NOT_SEND) {
            cc.log("玩家不出")
            //隐藏出牌不合法
            this._gamelayer.showTipsLabel("", false)
            //显示不出
            this._gamelayer.showNotSendSp(dataObj.wxid, true)
            //隐藏出牌界面
            this._gamelayer.showSendCardMenu(dataObj.wxid, false)
            //清空上把出的牌
            this._gamelayer.clearSendCards(dataObj.wxid)
            //取消定时器
            this._gamelayer.stopWaitTime(dataObj.wxid)
            // if(dataObj.wxid != G.myPlayerInfo.wxId)
            // {
            //     this._gamelayer.setAllMyPokerNotSelect()
            // }

            //播放不要音效
            // this._gamelayer.playerSound("voicebuyao", dataObj.wxid)
        }
        //出牌不合法
        else if (sub == cmd.SUB_R_SEND_ERROR) {
            cc.log("出牌不合法")
            this._gamelayer.showTipsLabel("出牌不合法", true)

            // this._gamelayer.setAllMyPokerNotSelect()
            //隐藏不出
            this._gamelayer.showNotSendSp(dataObj.wxid, false)
        }
        else if (sub == cmd.SUB_R_SEND_CANOT) {
            cc.log("管不住")
            this._gamelayer.showTipsLabel("管不住", true)
            // this._gamelayer.setAllMyPokerNotSelect()
            //隐藏不出
            this._gamelayer.showNotSendSp(dataObj.wxid, false)
        }
        //小结算消息接收
        else if (sub == cmd.SUB_R_LIT_RESULT) {
            cc.log("小结算")
            //隐藏所有玩家不出提示
            this._gamelayer.showNotSendspAll()
            //隐藏警告按钮
            this._gamelayer.showEarnTipsAll(false)
            //显示结算界面
            // this._gamelayer.showResultNode(true)
            this._gamelayer.showResultWaitTime()
            //设置结算界面
            this._gamelayer.setResultNode(JSON.parse(dataObj.listjiesuan))
            //显示结算后玩家剩余的手牌
            this._gamelayer.showResultPlayersPokers(JSON.parse(dataObj.listjiesuan))
            //播放春天动画
            this._gamelayer.playSpringAnimation(JSON.parse(dataObj.listjiesuan))
            //播放反春动画
            this._gamelayer.playNotSpringAnimation(JSON.parse(dataObj.listjiesuan))

        }
        //大结算消息接收
        else if (sub == cmd.SUB_R_BIG_RESULT) {
            cc.log("大结算")
            //延迟显示结算界面
            this._gamelayer.showBigResultNode(JSON.parse(dataObj.listdajiesuan))
        }
        //接收牌型音效
        else if (sub == cmd.SUB_S_POKER_TYPE_SOUNDE) {
            this._gamelayer.playerSound(dataObj.name, dataObj.wxid)
        }
    },

    //金币场显示隐藏
    setGoldRoomOrCardRoom(bGold) {
        this._gamelayer.setGoldRoomOrCardRoom(bGold)
    },

    //断线重连消息处理
    reconnect(dataObj) {
        if (dataObj.lastdapaiwxid != undefined && dataObj.lastdapai != undefined) {
            cc.log("last send cards")
            this._gamelayer.playerSendCard(dataObj.lastdapaiwxid, dataObj.lastdapai)
        }

        if (dataObj.listpaicount != undefined) {
            cc.log("剩余牌")
            for (var i = 0; i < dataObj.listpaicount.length; i++) {
                this._gamelayer.setSurplusCardNums(dataObj.listpaicount[i].wxid, dataObj.listpaicount[i].count)
            }
        }

        if (dataObj.mypailist != undefined) {
            cc.log("refresh my cards")
            this._gamelayer.showReadybtn(false)
            this._gamelayer.setCopyBtnCanTouch(false)
            this._gamelayer.setChangeTableBtnCanTouch(false)
            //隐藏邀请好友按钮
            this._gamelayer.showInvitation(false)
            this._gamelayer.refreshMyCards(dataObj.mypailist)
        }

        if (dataObj.diZhuWxid != undefined) {
            cc.log("显示斗地主")
            if (dataObj.diZhuWxid != 0)
                this._gamelayer.showLandImg(dataObj.diZhuWxid, true)
        }
    },

    dealWithChatMsg(wxId, msgId) {
        var seatIndex = this._gamelayer.getTableIndex(wxId);
        var seatNode = this._gamelayer.user_node[seatIndex];
        var pos = cc.p(50, 0);
        var dir = 1;
        if (seatIndex == 0 || seatIndex == 2) {
            pos = cc.p(50, 0);
            dir = 1;
        } else if (seatIndex == 1) {
            pos = cc.p(-100, 0);
            dir = -1;
        }
        cc.globalMgr.globalFunc.addChatMsgTip(300, seatNode, dir, pos, msgId);
        this._gamelayer.playChatSound(msgId, wxId)
    },

    dealWithChatFace(wxId, msgId) {
        var seatIndex = this._gamelayer.getTableIndex(wxId);
        var seatNode = this._gamelayer.user_node[seatIndex];
        cc.globalMgr.globalFunc.addChatFaceTip(seatNode, cc.p(-60, 0), msgId);

    },

    dealWithMagicFace(sourceWxId, targetWxId, msgId) {
        var seatIndex1 = this._gamelayer.getTableIndex(sourceWxId);
        var seatNode1 = this._gamelayer.user_node[seatIndex1];
        var seatIndex2 = this._gamelayer.getTableIndex(targetWxId);
        var seatNode2 = this._gamelayer.user_node[seatIndex2];
        var pos1 = seatNode1.parent.convertToWorldSpaceAR(seatNode1.position);
        var pos2 = seatNode2.parent.convertToWorldSpaceAR(seatNode2.position);
        pos2.x = pos2.x - 60
        cc.globalMgr.globalFunc.addMagicFace(pos1, pos2, msgId);
    },
    dealWithInputMsg(wxId, msgId) {
        cc.log("进入文字输入定位");
        var seatIndex = this._gamelayer.getTableIndex(wxId);
        var seatNode = this._gamelayer.user_node[seatIndex];
        var pos = cc.p(50, 0);
        var dir = 1;

        if (seatIndex == 0 || seatIndex == 2) {
            pos = cc.p(50, 0);
            dir = 1;
        } else if (seatIndex == 1) {
            pos = cc.p(-100, 0);
            dir = -1;
        }
        cc.globalMgr.globalFunc.addInputTip(seatNode, dir, pos, msgId);
        // cc.globalMgr.globalFunc.addChatMsgTip(seatNode, pos, msgId);
        // this._gamelayer.playChatSound(msgId, wxId);
    },
});
