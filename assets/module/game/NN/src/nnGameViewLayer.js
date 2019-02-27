//by cdl
var GameFrame = require("GameFrame")
var cmd = require("CMD_NN")
var MsgIds = require("MsgIds")
var comm = require("Comm")
var roomCache = require("NN_RoomCache")
cc.Class({
    extends: comm,

    properties: {
        Node_meun: {
            default: null,
            type: cc.Node
        },
        top_node: {
            default: null,
            type: cc.Node
        },
        user_node: {
            default: [],
            type: cc.Node
        },
        btn_voice: {
            default: null,
            type: cc.Button
        },
        poker_cards: {
            default: null,
            type: cc.Prefab
        },
        node_ClipEndMove: {
            default: null,
            type: cc.Node
        },
        node_CardMove: {
            default: [],
            type: cc.Node
        },
        card_node: {
            default: [],
            type: cc.Node
        },
        Button_XiaNum: {
            default: [],
            type: cc.Node
        },
        prefab_notice: {
            default: null,
            type: cc.Node
        },
        node_cardHome: {
            default: null,
            type: cc.Node
        },
        //结算界面 金币目的地
        node_clipRuselMove: {
            default: [],
            type: cc.Node
        },
        ResultAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        Anima_EndPos: {
            default: [],
            type: cc.Node
        },
        desktopFrame: {
            default: [],
            type: cc.SpriteFrame,
        },
        NN_Desktop: {
            default: null,
            type: cc.Sprite,
        },

        cardFrame: {
            default: [],
            type: cc.SpriteFrame,
        },

        cardMoveParent: {
            default: null,
            type: cc.Node
        },

        liangPaicardMoveParent: {
            default: null,
            type: cc.Node
        },
    },
    onLoad() {
        //绑定语音按钮 和头像框
        this.OnInitPoker();
        this.initPublicParm()
        this.initRoom();
        // this.OnInitJieSuanClipFunc();
        this.cardFrameName = this.cardFrame[1];
        this.cardScale = 0.6;    //别人手牌的缩放
        this.MyCardScale = 0.7;  //自己手牌的缩放
        this.MyLiangCardInterval = 102;  //自己手牌的间隔
        this.MyCardMovePos = 522 //自己手牌挪移的位置
        this.cardOffset = 80
    },

    //初始化扑克
    OnInitPoker() {
        this.CardPool = new cc.NodePool();
        for (var z = 0; z < 100; z++) {
            this.CardPool.put(cc.instantiate(this.node_cardHome))
        }
    },
    setGameControl(gameControl) {
        this._gameControl = gameControl
        //绑定语音按钮 和头像框
        this._gameControl.bindVoiceBtnAndUsersBox(this.btn_voice, this.user_node)

        //绑定头像框
        this._gameControl.bindUsersBox(this.user_node)

    },
    //初始化公有参数
    initPublicParm() {
        //存储房间信息
        this._roomList = {};
        // 存储玩家信息
        this._userList = {};

        //存储玩家对象
        this._userNodeList = [];

        //我的手牌数据
        this.myPokers = [[], [], [], [], [], [], [], [], [], []]

        this.Cards = []
    },
    //初始化房间信息
    initRoom() {
        //桌面上的钻石
        this.roomclip = []
        //桌面上开局发的手牌
        this.PokerItem = [[], [], [], [], [], [], [], [], [], []]
        //看牌
        this.lookCardArray = [[], [], [], [], [], [], [], [], [], []]
        this.MingCardArray = []
        //统一处理桌面上的扑克牌
        this.CommPoker = []
        //保存搓牌预制体
        this.cuoCardArr = []
    },
    start() {
        this.playTractorBgMusic();
    },

    //六人定位系统
    OnInitGpsUserFunc_6() {
        cmd.playerCount = 6;
        this._userNodeList = []
        for (var i = 0; i < 6; i++) {
            var userNode = this.user_node[i]
            var chatNode = userNode.getChildByName("chat")
            userNode.setPosition(NNPos.UserPos_6[i + ""])
            this.node_clipRuselMove[i].setPosition(NNPos.UserPos_6[i + ""])
            this.card_node[i].setPosition(NNPos.CardPos_6[i + ""])
            userNode.getChildByName("node_XiaNum").setPosition(NNPos.xiaZhuPos_6[i + ""])
            this.cardTypePos_6(userNode, i)
            if (i == 0 || i == 1 || i == 3 || i == 5) {
                chatNode.setPosition(NNPos.chatNodePos["1"])
            } else {
                chatNode.setPosition(NNPos.chatNodePos["2"])
                chatNode.getChildByName("spr_chatbox").setScale(-1, 1)
            }
            this._userNodeList.push(userNode)
        }
        this.LiangPaiPos = NNPos.liangPaiCardPos_6  //有牛位置
        this.NoLiangPaiPos = NNPos.liangPaiNoCardPos_6 //无牛位置
        this.cardScale = 0.6 //扑克的缩放
        this.MyCardScale = 0.7
        this.MyLiangCardInterval = 102
        this.MyCardMovePos = 487
        this.cardOffset = 80  //亮牌有牛的间隔

        this.zhuangAnimCircle = NNPos.zhuangAnim_6

        // var spr_difen = this.top_node.getChildByName("spr_difen") // 规则显示的位置设置
        // spr_difen.setPosition(cc.p(60, -200))
    },

    cardTypePos_6(userNode, i) {
        userNode.getChildByName("cardType").setPosition(NNPos.paiXingGridPos_6[i + ""])
        var cardType = userNode.getChildByName("cardType")
        cardType.getChildByName("wn_type").setPosition(NNPos.paiXingWuNiuGridPos_6[i + ""])
        cardType.getChildByName("A").setPosition(NNPos.paiXingOneGridPos_6[i + ""])
        cardType.getChildByName("B").setPosition(NNPos.paiXingTwoGridPos_6[i + ""])
    },
    //八人定位系统
    OnInitGpsUserFunc_8() {
        cc.log("---八人名牌---")
        cmd.playerCount = 8;
        this._userNodeList = []
        for (var i = 0; i < 8; i++) {
            var userNode = this.user_node[i]
            var chatNode = userNode.getChildByName("chat")
            userNode.setPosition(NNPos.UserPos_8[i + ""])
            this.node_clipRuselMove[i].setPosition(NNPos.UserPos_8[i + ""])
            this.card_node[i].setPosition(NNPos.CardPos_8[i + ""])
            userNode.getChildByName("node_XiaNum").setPosition(NNPos.xiaZhuPos_8[i + ""])

            this.cardTypePos_8(userNode, i)

            if (i == 0 || i == 1 || i == 3 || i == 5 || i == 7) {
                chatNode.setPosition(NNPos.chatNodePos["1"])
            } else {
                chatNode.setPosition(NNPos.chatNodePos["2"])
                chatNode.getChildByName("spr_chatbox").setScale(-1, 1)
            }
            this._userNodeList.push(userNode)
        }
        this.LiangPaiPos = NNPos.liangPaiCardPos_8  //有牛位置
        this.NoLiangPaiPos = NNPos.liangPaiNoCardPos_8 //无牛位置
        this.cardScale = 0.5 //扑克的缩放
        this.MyCardScale = 0.7
        this.MyLiangCardInterval = 102
        this.MyCardMovePos = 487
        this.cardOffset = 60  //亮牌有牛的间隔

        this.zhuangAnimCircle = NNPos.zhuangAnim_8
        // var spr_difen = this.top_node.getChildByName("spr_difen") // 规则显示的位置设置
        // spr_difen.setPosition(cc.p(60, -200))
    },

    cardTypePos_8(userNode, i) {
        userNode.getChildByName("cardType").setPosition(NNPos.paiXingGridPos_8[i + ""])
        var cardType = userNode.getChildByName("cardType")
        cardType.getChildByName("wn_type").setPosition(NNPos.paiXingWuNiuGridPos_8[i + ""])
        cardType.getChildByName("A").setPosition(NNPos.paiXingOneGridPos_8[i + ""])
        cardType.getChildByName("B").setPosition(NNPos.paiXingTwoGridPos_8[i + ""])
    },

    //十人定位系统
    OnInitGpsUserFunc_10() {
        cc.log("---10人游戏---")
        cmd.playerCount = 10;
        this._userNodeList = []
        for (var i = 0; i < 10; i++) {
            var userNode = this.user_node[i]
            var chatNode = userNode.getChildByName("chat")
            userNode.setPosition(NNPos.UserPos_10[i + ""])
            this.node_clipRuselMove[i].setPosition(NNPos.UserPos_10[i + ""])
            this.card_node[i].setPosition(NNPos.CardPos_10[i + ""])
            userNode.getChildByName("node_XiaNum").setPosition(NNPos.xiaZhuPos_10[i + ""])
            this.cardTypePos_10(userNode, i)

            if (i == 0 || i == 1 || i == 3 || i == 5 || i == 7 || i == 9) {
                chatNode.setPosition(NNPos.chatNodePos["1"])
            } else {
                chatNode.setPosition(NNPos.chatNodePos["2"])
                chatNode.getChildByName("spr_chatbox").setScale(-1, 1)
            }
            this._userNodeList.push(this.user_node[i])
        }
        this.LiangPaiPos = NNPos.liangPaiCardPos_10  //有牛位置
        this.NoLiangPaiPos = NNPos.liangPaiNoCardPos_10 //无牛位置
        this.cardScale = 0.5 //扑克的缩放
        this.MyCardScale = 0.6
        this.MyLiangCardInterval = 90
        this.MyCardMovePos = 432
        this.cardOffset = 60  //亮牌有牛的间隔
        this.zhuangAnimCircle = NNPos.zhuangAnim_10
        // var spr_difen = this.top_node.getChildByName("spr_difen") // 规则显示的位置设置
        // spr_difen.setPosition(cc.p(-486, -40))
    },

    cardTypePos_10(userNode, i) {
        userNode.getChildByName("cardType").setPosition(NNPos.paiXingGridPos_10[i + ""])
        var cardType = userNode.getChildByName("cardType")
        cardType.getChildByName("wn_type").setPosition(NNPos.paiXingWuNiuGridPos_10[i + ""])
        cardType.getChildByName("A").setPosition(NNPos.paiXingOneGridPos_10[i + ""])
        cardType.getChildByName("B").setPosition(NNPos.paiXingTwoGridPos_10[i + ""])
    },


    //结算筹码定位
    OnInitJieSuanClipFunc() {
        for (var i = 0; i < this.user_node.length; i++) {
            this.node_clipRuselMove[i].setPosition(this.user_node[i].getPosition())
        }
    },
    //匹配位置
    getTableIndex(wxId) {
        //查找自己的位置
        var myIndex = -1
        //wxid 对应的位置
        var wxidIndex = -1
        for (var i = 0; i < this._userList.length; i++) {
            if (this._userList[i].wxId == G.myPlayerInfo.wxId) {
                myIndex = i;
            }
            if (this._userList[i].wxId == wxId) {
                wxidIndex = i;
            }
        }
        var TableIndex = (wxidIndex - myIndex + cmd.playerCount) % cmd.playerCount;
        return TableIndex
    },
    //更新规则
    updateBaseinfo(obj) {

        cc.log("//更新规则", obj)
        this._roomList = obj;
        if (obj.renShu == 6) {
            this.OnInitGpsUserFunc_6()
        } else if (obj.renShu == 8) {
            this.OnInitGpsUserFunc_8()
        } else if (obj.renShu == 10) {
            this.OnInitGpsUserFunc_10()
        }

        var wanfa = "自由抢庄";
        if (obj.wanfa == 1) {
            wanfa = "牛牛上庄";
        } else if (obj.wanfa == 2) {
            wanfa = "固定庄家";
        } else if (obj.wanfa == 3) {
            wanfa = "自由抢庄";
        } else if (obj.wanfa == 4) {
            wanfa = "明牌抢庄";
        } else if (obj.wanfa == 5) {
            wanfa = "八人明牌";
        }
        var spr_difen = this.top_node.getChildByName("spr_difen")
        var label_RoomID = spr_difen.getChildByName("label_RoomID").getComponent(cc.Label);
        var label_PlayIn = spr_difen.getChildByName("label_PlayIn").getComponent(cc.Label);
        // var label_difen = spr_difen.getChildByName("label_difen").getComponent(cc.Label);

        // var label_TuiZhu = spr_difen.getChildByName("label_TuiZhu").getComponent(cc.Label);
        label_RoomID.string = "房号:" + obj.roomid;
        label_PlayIn.string = "玩法:" + wanfa;
        // label_difen.string = "底分:" + obj.difen + ' / ' + (obj.difen * 2);
        // var tuizhu = NNRoomRule.NNRoomBolus[obj.tuizhu]
        // label_TuiZhu.string = "推注:" + tuizhu
        this._roomNum = obj.roomid;
    },

    //更新局数
    updateBaseJuShuInfo(info, number) {
        var label_JuShu = this.top_node.getChildByName("spr_difen").getChildByName("label_JuShu").getComponent(cc.Label);
        label_JuShu.string = "局数:" + info + "/" + number + "局";
    },
    //更新玩家信息
    updateUsersinfo(obj) {
        //把坐下的人保存起来
        var sitplay = [];
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].sit == true) {
                sitplay.push(obj[i]);
            }
        }
        this._userList = sitplay

        for (var i = 0; i < this.user_node.length; i++) {
            this.user_node[i].active = false;
        }
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].sit == true) {
                var user = this.user_node[this.getTableIndex(obj[i].wxId)]
                this.updateUserItem(user, obj[i])
                user.wxId = obj[i].wxId;
                user.getChildByName("btn_seat").wxId = obj[i].wxId;
                user.getChildByName("label_wxid").getComponent(cc.Label).string = obj[i].wxId;
                user.name = obj[i].wxId + ""
            }
        }
        if (obj.length == 1) {
            cc.log("---人数不足 开始不了游戏--")
            this.ShowStartBtn(666);
        }

    },
    //更新个人基本信息
    updateUserItem(head, obj) {
        head.active = true;
        //显示乐币
        head.getChildByName("lebel_name").getComponent(cc.Label).string = this.FormatName(obj.name);
        head.getChildByName("lebel_name").active = true;
        if (obj.image !== "") {
            cc.loader.load({ url: obj.image, type: 'png' }, function (err, tex) {
                head.getChildByName("mask_head").getChildByName("sp_head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
            });
        }
        head.getChildByName("label_wxid").getComponent(cc.Label).string = obj.wxId;
        head.getChildByName("roomone").active = false;
        head.getChildByName("spe_points").getChildByName("Label").getComponent(cc.Label).string = "0";
        // 倒计时
        head.getChildByName("sp_clockbg").active = false;
        //玩家状态 显示
        head.getChildByName("spr_state").active = false;
        head.getChildByName("spr_chat").active = false;
    },
    //玩家分数
    updateuserBase(obj) {
        cc.log("---玩家：" + obj.wxid + "所带金币：" + obj.jinbi)
        // this.user_node[this.getTableIndex(obj.wxid)].getChildByName("spr_meney").getChildByName("label_money").getComponent(cc.Label).string = this.FormatGold(obj.jinbi)
        for (var i = 0; i < this.user_node.length; i++) {
            var user = this.user_node[i]
            if (user.name == obj.wxid + "") {
                user.getChildByName("spr_meney").getChildByName("label_money").getComponent(cc.Label).string = this.FormatGold(obj.jinbi)
            }
        }

    },
    //准备按钮
    showReadybtn(active) {
        this.Node_meun.getChildByName("node_botton").active = true
        var btn_sitdown = this.Node_meun.getChildByName("start_menu_node").getChildByName("btn_sitdown");
        btn_sitdown.active = active;
    },
    //开始按钮显示
    ShowStartBtn(wxid) {
        var btn_start = this.Node_meun.getChildByName("start_menu_node").getChildByName("btn_start");
        if (wxid == G.myPlayerInfo.wxId) {
            btn_start.active = true;
        } else {
            btn_start.active = false;
        }
    },

    //创建扑克列
    createPokers(node, PokerList, offerx, mycard) {
        var offerx = offerx
        var AllPokersWidth = PokerList.length * offerx
        var tempPokers = []
        for (var i = 0; i < PokerList.length; i++) {
            var poker = cc.instantiate(this.poker_cards)
            tempPokers.push(poker)
            this.Cards.push(poker)
            poker.parent = node
            if (mycard) {
                poker.setScale(this.MyCardScale, this.MyCardScale)  //设置扑克的大小
            } else {
                poker.setScale(this.cardScale, this.cardScale)
            }
            poker.setPosition((i - 1) * offerx + (AllPokersWidth / 10), 0)
            if (PokerList[i].v != undefined && PokerList[i].h != undefined) {
                poker.getComponent("NN_ComPoker").setPoker(PokerList[i].v, PokerList[i].h)
            }
            else {
                poker.getComponent("NN_ComPoker").setPoker("spBigBg", "")
            }
        }
        this.CommPoker.push(tempPokers)
        return tempPokers
    },

    //房间按钮
    OnClickBtttonFunc(sub, event) {
        this.playClickMusic()
        switch (event) {
            case "reader":
                cc.log("---准备----");
                this.OnPlayReadyFunc();
                break;
            case "sitdown":
                cc.log("----坐下----");
                this.OnPlaySitDownfunc();
                break;
            case "start":
                cc.log("---开始游戏点击---");
                this.OnPlayStartGameFucn();
                break;
            case "exitroom":
                cc.log("--退出房间--")
                this._gameControl.applyDissolution()
                break;
            case "gohome":
                cc.log("--离开房间暂离--")
                // this.OnGoHomeFunc();
                this.sendForZanLi()
                break;
            case "MaxGoHome":
                cc.log("---结算回到大厅---");
                cc.log("G.isClubRoomId" + G.isClubRoomId)
                if (G.isClubRoomId != 0 && G.isClubRoomId != undefined) {
                    G.isClubRoomId = 0
                    cc.log("----要跳转俱乐部界面了");
                    cc.globalMgr.GameFrameEngine.enterClub()
                }
                else {
                    cc.log("----要跳转大厅界面了");
                    this._gameControl.enterHomeEvent()
                }
                // this._gameControl.enterHomeEvent()
                break;
            case "chat":
                cc.log("--聊天--", cmd.MAIN_MSG_ID)
                cc.globalMgr.globalFunc.addChatLayer(cmd.MAIN_MSG_ID);
                break;
            case "share":
                cc.log("--分享---")
                var rule = this.gameRule
                var userinfo = undefined
                var userNum = cmd.playerCount - this._userList.length
                if (userNum > 0) {
                    if (this._userList != undefined) {
                        userinfo = " (" + this._userList.length + " 缺 " + userNum + ") "
                    }
                } else {
                    userinfo = " "
                }
                // var fir = 'http://www.5008008.cn/?name=' + this._roomNum + '&type=abc'
                this.wxShare("欢乐棋牌 牛牛 " + userinfo + "【" + this._roomNum + "】房间等你来战", G.shareHttpServerPath, rule, "0", "2")
                break;
            case "maxshare":
                cc.log("--结算分享---")

                this.wxShare("欢乐棋牌 牛牛", G.shareHttpServerPath, "结算", "0", 1)
                break;
            case "setting":
                cc.log("--设置--")
                var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Setting']);
                nodeCreateRoom.parent = this.node.parent;
                nodeCreateRoom.getComponent("Setting").setBgMusicId(this.gameBgMusicId)
                nodeCreateRoom.getComponent("Setting").refreshBtnView(false);
                break;
            case "ontopmeun":
                cc.log("---开启顶部菜单栏--")
                this.Node_meun.getChildByName("start_menu_node").getChildByName("top_menu").getChildByName("node_no").active = false;
                this.Node_meun.getChildByName("start_menu_node").getChildByName("top_menu").getChildByName("node_yes").active = true;
                break;
            case "offtopmeun":
                cc.log("---关闭顶部菜单栏--")
                this.Node_meun.getChildByName("start_menu_node").getChildByName("top_menu").getChildByName("node_no").active = true;
                this.Node_meun.getChildByName("start_menu_node").getChildByName("top_menu").getChildByName("node_yes").active = false;

                break;
            case "qiangzhuang":
                cc.log("----抢庄---")
                this.OnPlayQiangFunc(2);
                break;
            case "notzhuang":
                cc.log("----不抢庄---")
                this.OnPlayQiangFunc(1);
                break;
            case "xiazhu0":
                cc.log("----下注结果---", this.XiaZhuArray[0]);
                this.OnPlayXiaZhuFunc(this.XiaZhuArray[0])
                break;
            case "xiazhu1":
                cc.log("----下注结果---", this.XiaZhuArray[1]);
                this.OnPlayXiaZhuFunc(this.XiaZhuArray[1])
                break;
            case "xiazhu2":
                cc.log("----下注结果---", this.XiaZhuArray[2]);
                this.OnPlayXiaZhuFunc(this.XiaZhuArray[2])
                break;
            case "xiazhu3":
                cc.log("----下注结果---", this.XiaZhuArray[3]);
                this.OnPlayXiaZhuFunc(this.XiaZhuArray[3])
                break;
            case "xiazhu4":
                cc.log("----下注结果---", this.XiaZhuArray[4]);
                this.OnPlayXiaZhuFunc(this.XiaZhuArray[4])
                break;
            case "xiazhu5":
                cc.log("----下注结果---", this.XiaZhuArray[5]);
                this.OnPlayXiaZhuFunc(this.XiaZhuArray[5])
                break;
            case "lookcard":
                cc.log("---看牌----");
                this.OnPlayLookCardFunc();
                break;
            case "CuoCard1":
                cc.log("---移动牌1---");
                this.OnCuoCardFunc(1);
                break;
            case "CuoCard2":
                cc.log("---搓牌2---");
                this.OnCuoCardFunc(2);
                break;
            case "qiangZhuang":
                var name = sub.target.name
                this.OnPlayQiangFunc(parseInt(name));
                break;
        }
    },
    //暂里清除玩家在房间内的数据
    OnGoHomeFunc() {
        cc.log("回到大厅")
        this._gameControl.NnentHome("确认回到大厅？", this._roomNum)
        this.regist(MsgIds.REPLACE_NN_GOHOME, this, this.onReplaceRoomFunc)
    },
    //暂离消息
    sendForZanLi() {
        var obj = new Object()
        obj.zinetid = cc.globalMgr.msgIds.SUB_S_ZI_ZANLI;
        obj.uid = G.myPlayerInfo.uid;
        this.send(cc.globalMgr.msgIds.SUB_S_ZANLI, obj);
        cc.log("------暂离消息:", obj);
    },
    onReplaceRoomFunc(sub, body, target) {
        target._gameControl.enterHomeEvent();
    },
    //准备显示
    SprReadyShow(active) {
        this.Node_meun.getChildByName("node_ready").active = active;
        this.DelActionClip();
    },
    //准备状态显示
    SprReadyStateShow(wxid, active) {
        cc.log("---准备的人微信id---座位号", "    ", wxid, "   ", this.getTableIndex(wxid))
        var sp_ok = this.user_node[this.getTableIndex(wxid)].getChildByName("sp_ok")
        sp_ok.setScale(cc.v2(4, 4));
        sp_ok.active = active;
        var actionBy2 = cc.scaleBy(1, 1, 1);
        var actionTo2 = cc.scaleTo(0.5, 1, 1);
        sp_ok.runAction(actionTo2);
    },
    //看牌显示
    SprLookCardShow(active, isCuoPai, isCuoPai1) {

        var node_LiangCard = this.Node_meun.getChildByName("node_LiangCard")
        node_LiangCard.active = active;

    },
    //回收桌面上下注钻石
    RecycleMoney() {
        this.DelActionClip();
    },
    //下注筹码显示
    SprXiaZhuClipShow(active, CanNum, wxid) {
        var node_XiaNum = this.user_node[this.getTableIndex(wxid)].getChildByName("node_XiaNum");
        node_XiaNum.active = active
        if (CanNum != 0) {
            var xiazhu = CanNum;
            node_XiaNum.getChildByName("label_xiazhuNum").getComponent(cc.Label).string = xiazhu;
        }
    },

    SprXiaZhuClipHide() {
        for (let i = 0; i < this.user_node.length; i++) {
            var node_XiaNum = this.user_node[i].getChildByName("node_XiaNum");
            node_XiaNum.active = false
        }
    },
    //抢庄显示
    SprQiangZhuangShow(wanfa, active) {
        if (wanfa >= 4) {
            this.Node_meun.getChildByName("node_mingZhuang").active = active;
        } else {
            this.Node_meun.getChildByName("node_zhuang").active = active;
        }
    },

    //抢庄隐藏
    SprQiangZhuangHide() {
        this.Node_meun.getChildByName("node_mingZhuang").active = false;
        this.Node_meun.getChildByName("node_zhuang").active = false;
    },
    //抢庄分数显示
    SprQiangZhuangMaxShou(_Num) {
        cc.log("---抢庄界面显示出来--sss--")
        var MaxZhuang = this.Node_meun.getChildByName("node_mingZhuang").getChildByName("MingZhuangLayout").children;
        for (var i = 0; i < MaxZhuang.length; i++) {
            MaxZhuang[i].active = false;
        }
        for (var i = 0; i < _Num.length; i++) {
            MaxZhuang[i].active = true;
            MaxZhuang[i].getChildByName("label_bei").getComponent(cc.Label).string = _Num[i] + "倍";
        }
    },
    //下注分数显示（除庄外）
    SprXiaZhuShow(_Num, active) {
        cc.log("---下注界面显示出来--sss--")
        //下注数量
        this.XiaZhuArray = _Num;
        this.Node_meun.getChildByName("node_XiaZhu").active = active;
        var btn_xiazhu = this.Button_XiaNum;
        for (var i = 0; i < btn_xiazhu.length; i++) {
            btn_xiazhu[i].active = false;
        }
        if (_Num != "notdisPlay") {
            for (var i = 0; i < _Num.length; i++) {
                btn_xiazhu[i].active = true;
                btn_xiazhu[i].getChildByName("label_xiazhuNum").getComponent(cc.Label).string = _Num[i] + "分";
            }
        }
    },

    //庄家
    UpdataZhuang(wxid, avtive) {
        this.user_node[this.getTableIndex(wxid)].getChildByName("roomone").active = avtive;
    },
    //准备前把牌归位
    UpdateCardGoHome() {

        for (var i = 0; i < this.node_CardMove.length; i++) {
            var pai = this.node_CardMove[i];
            if (pai.childrenCount > 0) {
                pai.removeAllChildren()
            }
            pai.active = false;
            pai.x = this.node_cardHome.x;
            pai.y = this.node_cardHome.y;
        }
        cc.log("人数： ", cmd.playerCount)
        //清空桌面上显示的牌
        for (var i = 0; i < cmd.playerCount; i++) {
            for (var j = 0; j < this.lookCardArray[i].length; j++) {
                if (this.lookCardArray[i].length != 0) {
                    this.CardPool.put(this.lookCardArray[i][j])
                }
            }
            this.lookCardArray[i].length = 0;
        }
    },
    //提交准备
    OnPlayReadyFunc() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_READY
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //提交看牌
    OnPlayLookCardFunc() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_DISCARD
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //搓牌回调
    GetCuoCardFunc(obj) {
        //亮牌搓牌显示按钮关闭
        this.SprLookCardShow(false);
        //搓牌特效
        this.SprCuoCardShow(obj);
    },
    //搓牌效果
    SprCuoCardShow(obj) {
        if (obj.cuoCardType == 1) {
            //移动五张牌
            var nodeTwis = cc.instantiate(cc.globalRes['prefabs_TwistCard']);
            nodeTwis.parent = this.node;
            nodeTwis.getComponent("CommTwistCards").setPoker(obj.listPai, this, 1)
            this.cuoCardArr.push(nodeTwis);
        } else {
            //搓牌

            var listpai = obj.listPai[obj.listPai.length - 1]
            cc.log("--搓牌为---", listpai)
            var nodeTwis = cc.instantiate(cc.globalRes['prefabs_RubbingCard']);
            nodeTwis.parent = this.node;
            nodeTwis.getComponent("RubbingPoker").setGameLayer(this)
            nodeTwis.getComponent("RubbingPoker").setPoker(listpai.v, listpai.h)
            this.cuoCardArr.push(nodeTwis);

        }

    },
    //搓牌
    OnCuoCardFunc(value) {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_CUOCARD
        obj.cuoCardType = value;
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //销毁搓牌
    DelCuoCard() {
        for (var i = 0; i < this.cuoCardArr.length; i++) {
            this.cuoCardArr[i].destroy();
        }
        this.cuoCardArr.length = 0;
    },
    //提交下注
    OnPlayXiaZhuFunc(num) {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_SUBMIT_XIAZHU
        obj.uid = G.myPlayerInfo.uid
        obj.xiazhu = num;
        this.send(cmd.MAIN_MSG_ID, obj)
    },

    //提交抢庄
    OnPlayQiangFunc(qiangNum) {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_SBUMIT
        obj.uid = G.myPlayerInfo.uid
        obj.beishu = qiangNum;
        this.send(cmd.MAIN_MSG_ID, obj)
    },

    //玩家坐下
    OnPlaySitDownfunc() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_SI_DOWN
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)

    },
    //玩家点击开始
    OnPlayStartGameFucn() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_STATE_GAME
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
    },

    //刷新自己手牌
    refreshMyCards_1(PokerList, listwxid, fiveCard, isone) {

        cc.log('刷新自己的手牌', PokerList, "\nlistWxid: " + listwxid, " \n fivecard: " + fiveCard, "\n isone" + isone)
        var btn_ready = this.Node_meun.getChildByName("start_menu_node").getChildByName("btn_share");
        btn_ready.active = false;
        this.OnInitPoker();
        var PokerList = PokerList
        this.listwxid = listwxid;
        var time = 3000;
        var deltime = 0.1;
        var cardNum = 5
        if (isone == true) {
            // if (this._roomList.wanfa <= 3) {
            //     cardNum = 5
            // } else {
            cardNum = 3
            // }
        } else {
            cardNum = 2
        }
        //给点击准备的人发牌
        for (var i = 0; i < listwxid.length; i++) {
            var posx = -86;
            var userIndex = this.getTableIndex(listwxid[i])
            var cardMove = this.cardMoveParent.children[userIndex]

            if (userIndex == 0) {
                posx = -26;
            } else if (userIndex == 1) {
                posx = -51;
            } else if (userIndex == 2) {
                posx = -51;
            } else if (userIndex == 3) {
                posx = -30;
            } else if (userIndex == 4) {
                posx = -30;
            }
            this.node_CardMove[userIndex].active = true;

            //区分一下游戏规则 用在显示牌面上
            // 3 抢庄 4，名牌抢庄
            cc.log("发牌里的玩法： ", this._roomList.wanfa)
            // if (this._roomList.wanfa <= 3) {
            //     PokerList = [0, 0, 0, 0, 0]
            // } else {
            if (PokerList.length == 3) {
                this.MingCardArray = PokerList;
            }
            // }

            for (var j = 0; j < cardNum; j++) {
                time += 200;
                deltime += 0.05;
                this.pokers = this.CardPool.get();
                this.pokers.parent = cardMove
                if (listwxid[i] == G.myPlayerInfo.wxId) {
                    var pokerlist = [];
                    if (this._roomList.wanfa > 3) {
                        pokerlist.push(0)
                    } else {
                        pokerlist.push(PokerList[j])
                    }
                    if (fiveCard) {
                        // posx += this.MyCardMovePos
                        posx += j == 0 ? 408 : 103
                    } else {
                        posx += this.MyLiangCardInterval
                    }
                    this.myPokers[userIndex] = this.createPokers(this.pokers, pokerlist, 98, true, cardNum)
                } else {
                    var pokerlist = [0];
                    if (fiveCard) {
                        posx += j == 0 ? 220 : 55
                    } else {
                        posx += 55;
                    }
                    this.myPokers[userIndex] = this.createPokers(this.pokers, pokerlist, 45, false, cardNum)
                }
                this.cardMovePlay(this.pokers, this.card_node[userIndex], time, posx, deltime);
                this.PokerItem[userIndex].push(this.pokers)
            }
        }

        if (fiveCard == false) {
            this.SprMingCardShow()
        }
    },

    //移动动画
    cardMovePlay(moveStart, moveEnd, time, posx, delayTime) {

        ///随机取值范围
        var endposx = Math.round(Math.random() * 40 - 40);
        ///随机取值范围
        var endposy = Math.round(Math.random() * 40 - 40);
        var startposx = Math.round(Math.random() * 40 - 40);
        var startposy = Math.round(Math.random() * 40 - 40);
        if (posx == null) {
            posx = 0;
        }
        if (delayTime == null) {
            delayTime = 0;
        }
        var nodeclip;
        moveStart.x += endposx;
        moveStart.y += endposy;
        nodeclip = moveStart;

        this.startPos = moveStart.getPosition();
        this.node_ClipEndMove.x = moveEnd.x;
        this.node_ClipEndMove.y = moveEnd.y;
        this.node_ClipEndMove.x += posx;
        this.endPos = this.node_ClipEndMove.getPosition();
        //获得2点之间的距离  
        var distance = cc.pDistance(this.startPos, this.endPos);
        //计算移动需要话费的时间，时间 = 距离 / 速度  
        var moveTime = distance / (600 + time);
        this.moveClipTime = moveTime
        //
        var bezier = [cc.p(endposx, endposy), cc.p(endposx + startposx, endposy + startposy), cc.p(this.endPos.x, this.endPos.y)];
        var bezierTo = cc.bezierTo(moveTime, bezier);  //贝塞尔曲线
        nodeclip.runAction(bezierTo);

    },
    //清理缓存的手牌
    clearCacheCard() {
        //先移除现在的手牌
        for (var i = 0; i < this.myPokers.length; i++) {
            var pokerLength = this.myPokers[i].length
            for (var j = 0; j < pokerLength; j++) {
                this.myPokers[i][j].destroy()
            }
            this.myPokers[i] = []
        }

        for (let i = 0; i < this.Cards.length; i++) {
            this.Cards[i].destroy()
        }
        this.Cards = []
    },


    //名牌抢庄后 亮出自己的手牌
    SprMingCardShow() {
        // if (this._roomList.wanfa == 4 || this._roomList.wanfa == 5) {
        cc.log("名牌为", this.MingCardArray)
        this.DelActionPoker(G.myPlayerInfo.wxId)
        var posx = 123;
        var PokerList = this.MingCardArray;
        for (var z = 0; z < 8; z++) {
            this.CardPool.put(cc.instantiate(this.node_CardMove[0]))
        }
        for (var i = 0; i < PokerList.length; i++) {
            this.LookCard = this.CardPool.get();
            this.LookCard.parent = this.node_CardMove[0].parent
            //this.LookCard.setLocalZOrder(0);
            posx -= 112;
            // posx -= this.MyLiangCardInterval
            var pokerlistarray = [];
            pokerlistarray.push(PokerList[i])
            this.myPokers[0] = this.createPokers(this.LookCard, pokerlistarray, posx, true)
            this.lookCardArray[0].push(this.LookCard)
        }
        // }
    },

    //手牌定位
    SprGPSCardPosShow() {
        for (var i = 0; i < this.card_node.length; i++) {
            var card_node_i = this.card_node[i];
            this.myPokers[i].x = card_node_i.x;
            this.myPokers[i].y = card_node_i.y;
            this.node_CardMove[i].x = card_node_i.x;
            this.node_CardMove[i].y = card_node_i.y;
        }
    },

    //单加消息 谁看牌了 立即
    LookCardCloseMingCard(wxid) {
        cc.log("--删除 微信ID", wxid)
        if (this._roomList.wanfa == 4 || this._roomList.wanfa == 5) {
            if (wxid == G.myPlayerInfo.wxId) {
                for (var j = 0; j < this.lookCardArray[0].length; j++) {
                    if (this.lookCardArray[0].length != 0) {
                        this.CardPool.put(this.lookCardArray[0][j])
                    }
                }
            }
        }
    },
    //亮牌后刷新自己的手牌
    refreshLiangMyCards(PokerList, wxid, cardtype, fiveCard) {
        var PokerList = PokerList
        var userIndex = this.getTableIndex(wxid)
        this.DelActionPoker(wxid)
        cc.log("亮牌后刷新自己的手牌", PokerList, "   " + wxid);
        var cardMove = this.liangPaicardMoveParent.children[userIndex]
        var cardGrid = cardMove.getChildByName("grid")
        var cardArr = []
        if (cardtype == 100) {
            //没有牛
            cardMove.setPosition(this.NoLiangPaiPos[userIndex])
            if (wxid == G.myPlayerInfo.wxId) {
                cardArr = this.createPokers(cardMove, PokerList, 65, true)
                this.liangPaiFiveManage(false, cardArr, fiveCard)
            } else {
                cardArr = this.createPokers(cardMove, PokerList, 55, false)
                this.liangPaiFiveManage(false, cardArr, fiveCard)
            }
        } else {
            //有牛
            cardMove.setPosition(this.LiangPaiPos[userIndex])
            var posx = 86;
            for (var z = 0; z < 8; z++) {
                this.CardPool.put(cc.instantiate(cardGrid))
            }
            for (var i = 0; i < PokerList.length; i++) {
                this.LookCard = this.CardPool.get();
                this.LookCard.parent = cardMove
                this.LookCard.setLocalZOrder(0);
                var pokerlistarray = [];
                pokerlistarray.push(PokerList[i])
                if (wxid == G.myPlayerInfo.wxId) {
                    if (i == 3) {
                        posx -= 90;
                    } else {
                        posx -= 60;
                    }
                    cardArr = this.createPokers(this.LookCard, pokerlistarray, posx, true)

                } else {
                    if (i == 3) {
                        posx -= this.cardOffset;
                    } else {
                        posx -= 50;
                    }
                    cardArr = this.createPokers(this.LookCard, pokerlistarray, posx, false)
                }
                this.liangPaiFiveManage(true, cardArr, fiveCard)
                this.lookCardArray[userIndex].push(this.LookCard)
            }
        }
    },

    //亮牌 第五张 处理
    liangPaiFiveManage(isNiu, cardList, fiveCard) {
        var pokerNum = fiveCard.v + fiveCard.h
        if (isNiu == true) {
            var pokerNode = cardList[0]
            if (pokerNode != null) {
                var normal = pokerNode.getChildByName("normal")
                var sprName = normal.getComponent(cc.Sprite).spriteFrame.name
                if (sprName == pokerNum) {
                    pokerNode.setPosition(cc.p(pokerNode.position.x, pokerNode.position.y + 8))
                    normal.getChildByName("biao").active = true
                }
            }
        } else {
            for (var i = 0; i < cardList.length; i++) {
                var pokerNode = cardList[i]
                if (pokerNode != null) {
                    var normal = pokerNode.getChildByName("normal")
                    var sprName = normal.getComponent(cc.Sprite).spriteFrame.name
                    cc.log("获取扑克的名字； ", sprName)
                    if (sprName == pokerNum) {
                        pokerNode.setPosition(cc.p(pokerNode.position.x, pokerNode.position.y + 8))
                        normal.getChildByName("biao").active = true
                    }
                }
            }
        }
    },

    //结算时事件处理
    UpdateResurMoney(zhuangwxid, JieCount, isviwe) {
        var user = this.user_node;
        for (var i = 0; i < JieCount.length; i++) {
            this.SprMinResultShow(true, JieCount[i].wxid, JieCount[i].scoce, JieCount[i].allscoce)
            //输家音效
            if (JieCount[i].wxid == G.myPlayerInfo.wxId && JieCount[i].scoce <= 0) {
                this.playsoundCard(JieCount[i].wxid, "lose");
            }
            if (JieCount[i].wxid == zhuangwxid) {
                //continue;
            } else {
                //庄家输
                if (JieCount[i].scoce > 0) {
                    this.CopyFoundClip(zhuangwxid, JieCount[i].wxid, true)

                } else if (JieCount[i].scoce < 0) {
                    this.CopyFoundClip(JieCount[i].wxid, zhuangwxid, true)
                } else {
                }
            }
        }
    },
    //小结算
    SprMinResultShow(active, wxid, base, allscoce) {
        if (active == true) {
            //结算界面 显示玩家输赢分数
            var user = this.user_node[this.getTableIndex(wxid)].getChildByName("node_base");
            user.active = active;
            user.getChildByName("label_base").getComponent(cc.Label).string = base;
        } else {
            for (var i = 0; i < this.user_node.length; i++) {
                this.user_node[i].getChildByName("node_base").active = false;
            }
        }
    },

    //找出赢家
    WinPlayFunc(JieCount) {
        var winplay = 0;
        var wxid = 0;
        for (var i = 0; i < JieCount.length; i++) {
            if (JieCount[i].scoce > winplay) {
                winplay = JieCount[i].scoce;
                wxid = JieCount[i].wxid;
            }
        }
        return wxid;
    },
    sleep(n) {
        var start = new Date().getTime();
        while (true) {
            var time = new Date().getTime();
            if (time - start > n) {
                break;
            }
        }
    },
    //创建钻石              
    CopyFoundClip: function (wxid, Endwxid, isviwe) {
        var time = 0;   //原来800
        var count = 10;
        if (Endwxid == "xiazhu") {
            time = 100;
            count = 5;
            Endwxid = this.user_node[this.getTableIndex(wxid)].getChildByName("node_XiaNum").getChildByName("spr_diamond")
            for (var i = 0; i < count; i++) {
                time += 10;
                this.ActionClipFunc(wxid, Endwxid, isviwe, time)
            }
        } else {
            //结算
            cc.log("------结算坐标wanjai ----", this.getTableIndex(Endwxid))
            Endwxid = this.node_clipRuselMove[this.getTableIndex(Endwxid)];
            for (var i = 0; i < count; i++) {
                time += 50;//原来100
                this.ActionClipFunc(wxid, Endwxid, isviwe, time)
            }
        }
    },

    //筹码飞动画
    ActionClipFunc(wxid, Endwxid, isviwe, time) {
        var userInfo = this.getTableIndex(wxid);
        if (isviwe) {
            cc.log("---结算扔筹码动画---")
            this.nodeclip = cc.instantiate(this.node_clipRuselMove[userInfo])
            this.nodeclip.parent = this.node;
            // 获取筹码起点坐标
            this.nodeclip.x = this.node_clipRuselMove[userInfo].x;
            // 获取筹码起点坐标
            this.nodeclip.y = this.node_clipRuselMove[userInfo].y;

        } else {
            //下注界面
            var clipMove = this.user_node[userInfo].getChildByName("spr_clip")
            this.ClipPool = new cc.NodePool();
            this.nodeclip = cc.instantiate(clipMove)
            this.nodeclip.parent = this.user_node[userInfo].getChildByName("node_XiaNum");
            // 获取筹码起点坐标
            this.nodeclip.x = clipMove.x;
            // 获取筹码起点坐标
            this.nodeclip.y = clipMove.y;
        }
        this.spriteMoveCardPlay(this.nodeclip, Endwxid, time);
        this.roomclip.push(this.nodeclip)
    },

    //销毁桌面上的钻石
    DelActionClip() {
        //吟唱筹码
        for (var i = 0; i < this.roomclip.length; i++) {
            this.roomclip[i].destroy()
        }
        this.roomclip.length = 0;
    },
    //销毁发牌
    DelActionPoker(wxid) {
        for (var i = 0; i < this.PokerItem[this.getTableIndex(wxid)].length; i++) {
            if (this.PokerItem[this.getTableIndex(wxid)].length != 0) {
                this.CardPool.put(this.PokerItem[this.getTableIndex(wxid)][i])
            }
        }
        this.PokerItem[this.getTableIndex(wxid)].length = 0;
    },
    //移动动画
    spriteMoveCardPlay(moveStart, moveEnd, time, posx, delayTime) {

        ///随机取值范围
        var endposx = Math.round(Math.random() * 40 - 40);
        ///随机取值范围
        var endposy = Math.round(Math.random() * 40 - 40);
        var startposx = Math.round(Math.random() * 40 - 40);
        var startposy = Math.round(Math.random() * 40 - 40);
        if (posx == null) {
            posx = 0;
        }
        if (delayTime == null) {
            delayTime = 0;
        }
        var nodeclip;
        moveStart.x += endposx;
        moveStart.y += endposy;
        nodeclip = moveStart;

        this.startPos = moveStart.getPosition();
        this.node_ClipEndMove.x = moveEnd.x;
        this.node_ClipEndMove.y = moveEnd.y;
        this.node_ClipEndMove.x += posx;
        this.endPos = this.node_ClipEndMove.getPosition();
        //获得2点之间的距离  
        var distance = cc.pDistance(this.startPos, this.endPos);
        //计算移动需要话费的时间，时间 = 距离 / 速度  
        var moveTime = distance / (600 + time);
        this.moveClipTime = moveTime
        //
        var bezier = [cc.p(endposx, endposy), cc.p(endposx + startposx, endposy + startposy), cc.p(this.endPos.x, this.endPos.y)];
        var bezierTo = cc.bezierTo(moveTime, bezier);  //贝塞尔曲线
        nodeclip.runAction(bezierTo);

    },
    //奖池内金额
    JiangNum(num) {
    },
    //爆奖公告
    setZJHNotice(target) {
        this.prefab_notice.getComponent("RollingNotice").setRollingNotice(target)
    },
    //设置离开房间按钮是否可以点击
    setReturnHomeBtnCanTouch(bCanTouch) {
        var btn_returnHome = this.Node_meun.getChildByName("start_menu_node").getChildByName("top_menu").getChildByName("node_yes").getChildByName("layout_btn").getChildByName("btn_fanhui");
        btn_returnHome.getComponent(cc.Button).interactable = true
        if (bCanTouch) {
            btn_returnHome.opacity = 255
        }
        else {
            btn_returnHome.opacity = 255
        }
    },
    //倒计时提示
    SprCountDownShow(tisi, time, txt) {
        this._tisi = tisi;
        this._waitTime = time;
        this._hintTxt = txt;
        this.schedule(this.waitTimeCallfunc, 1, txt);

    },
    //关闭倒计时
    stopWaitTime(wxid) {
        this.showWaitTime(0, false)
        this.unschedule(this.waitTimeCallfunc)
    },
    //定时器显示隐藏
    showWaitTime(time, active) {
        var countDown = this.Node_meun.getChildByName("node_CouneDown");
        countDown.active = active;
        var tisi = "";
        if (this._hintTxt == true) {
            //155来区分需不需要带时间的
            tisi = this._tisi;
        } else {
            tisi = this._tisi + time;
        }
        countDown.getChildByName("label_tisi").getComponent(cc.Label).string = this._tisi + time;
    },
    //显示提示文本
    showWaitTxt(txt, active) {
        var countDown = this.Node_meun.getChildByName("node_CouneDown");
        countDown.active = active;
        countDown.getChildByName("label_tisi").getComponent(cc.Label).string = txt;
    },
    //定时器回调
    waitTimeCallfunc(dt) {
        this._waitTime--;
        this.showWaitTime(this._waitTime, true)
        if (this._waitTime <= 0) {
            this._waitTime = 0;
            this.stopWaitTime(this._waitWxid)
        }
    },
    //动画展示
    ActionNnShow(AcitonType, AcitonNum, wxid, active) {
        if (AcitonType == "xiazhu") {
            switch (AcitonNum) {
                case 1:
                case 2:
                    this.ActionNnFunc(wxid, "node_XiaZhu", "spr_Xia1", active)
                    break;
                case 3:
                    this.ActionNnFunc(wxid, "node_XiaZhu", "spr_Xia2", active)
                    break;
                case 4:
                    this.ActionNnFunc(wxid, "node_XiaZhu", "spr_Xia3", active)
                    break;
                case 5:
                    this.ActionNnFunc(wxid, "node_XiaZhu", "spr_Xia4", active)
                    break;
            }
        } else if (AcitonType == "zhuang") {
            switch (AcitonNum) {
                case 1:
                    this.ActionNnFunc(wxid, "node_Qiang", "spr_NotQiang", active)
                    break;
                case 2:
                    this.ActionNnFunc(wxid, "node_Qiang", "spr_1bei", active)
                    break;
                case 3:
                    this.ActionNnFunc(wxid, "node_Qiang", "spr_2bei", active)
                    break;
                case 4:
                    this.ActionNnFunc(wxid, "node_Qiang", "spr_3bei", active)
                    break;
                case 5:
                    this.ActionNnFunc(wxid, "node_Qiang", "spr_4bei", active)
                    break;
            }
        }
    },


    //推注状态显示：
    TuiZhuStart(type, data) {
        //type: 1：可推注人的的状态的显示；    2：已经推注人的转态的显示
        var userList = JSON.parse(data)
        if (userList.length == 0) {
            return
        }
        this.TuiZhuOver()
        cc.log("推注状态显示", userList)
        for (var i = 0; i < userList.length; i++) {
            var TuiZhu = this.user_node[this.getTableIndex(userList[i])].getChildByName("SprTuiZhu")
            if (type == 1) {
                TuiZhu.getChildByName("keTuiZhu").active = true
            } else if (type == 2) {
                TuiZhu.getChildByName("yiTuiZhu").active = true
            }
        }

    },
    TuiZhuOver() {
        for (var i = 0; i < this.user_node.length; i++) {
            var SprTuiZhu = this.user_node[i].getChildByName("SprTuiZhu")
            for (var j = 0; j < SprTuiZhu.childrenCount; j++) {
                SprTuiZhu.children[j].active = false
            }
        }
    },

    //亮牌牌型的赋值
    LiangPaiCardTypeShow(cardtypeNum, bsNum, wxid) {
        cc.log("亮牌牌型的赋值", cardtypeNum, bsNum)
        var parent = this.user_node[this.getTableIndex(wxid)].getChildByName("cardType")
        var pxGrid = parent.getChildByName("A")
        if (cardtypeNum > 111) {
            pxGrid = parent.getChildByName("B")
        }
        var type = pxGrid.getChildByName("spr_type")
        type.active = true
        type.getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame(cardtypeNum);
        if (cardtypeNum > 100) {
            var beiShu = pxGrid.getChildByName("spr_Num")
            beiShu.active = true
            beiShu.getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame(bsNum);
            this.SprLiangCardActionShow(wxid) //特效
        }
    },

    //亮牌特效
    SprLiangCardActionShow(wxid) {
        //赢家动画
        var parent = this.user_node[this.getTableIndex(wxid)].getChildByName("cardType")
        var winfont = parent.getChildByName("winfont")
        // var winfontboo = parent.getChildByName("winfontboo")
        winfont.active = true;
        // winfontboo.active = true;
        winfont.setLocalZOrder(1);
        // winfontboo.setLocalZOrder(1);
    },

    //隐藏所有动画
    SetActionNnClose(ChildByNodeName) {
        if (ChildByNodeName == "jiesuan") {
            for (var i = 0; i < this.node_CardMove.length; i++) {
                var parent = this.user_node[i].getChildByName("cardType")
                var a = parent.getChildByName("A")
                var b = parent.getChildByName("B")
                a.getChildByName("spr_type").active = false;
                a.getChildByName("spr_Num").active = false;
                b.getChildByName("spr_type").active = false;
                b.getChildByName("spr_Num").active = false;
                parent.getChildByName("winfont").active = false;
                // parent.getChildByName("winfontboo").active = false;
            }
            return;
        }
        for (var i = 0; i < this.user_node.length; i++) {
            var children = this.user_node[i].getChildByName(ChildByNodeName).children;
            for (var j = 0; j < children.length; j++) {
                children[j].active = false;
            }
        }
    },


    // zhuangAnimationPlay(listwxid, active, zhuangWxid) {
    //     var target = this
    //     if (this._roomList.wanfa != 1 && this._roomList.wanfa != 2) {
    //         for (var i = 0; i < listwxid.length; i++) {
    //             var node_qiangZhuang = this.user_node[this.getTableIndex(listwxid[i])].getChildByName("node_QiangZhuanAnimation")
    //             var anim = node_qiangZhuang.getComponent(cc.Animation)
    //             if (active == true) {
    //                 this.playEffectMusic("resources/game/nn/nn_sound/rest/random_banker_lianxu.mp3", false)
    //                 anim.play()
    //                 node_qiangZhuang.active = true;
    //             } else {
    //                 anim.stop()
    //                 node_qiangZhuang.active = false;
    //             }
    //         }
    //         if (active == false) {
    //             var node_SuerZhuang = this.user_node[this.getTableIndex(zhuangWxid)].getChildByName("node_SuerZhuanAnimation")
    //             var anim1 = node_SuerZhuang.getComponent(cc.Animation)
    //             var animState = anim1.play()
    //             this.playEffectMusic("resources/game/nn/nn_sound/rest/random_banker_lianxu.mp3", false)
    //             animState.repeatCount = 10
    //             node_SuerZhuang.active = true
    //             //庄动画的帧事件：最后一帧结束自动执行
    //             anim1.zhuangAnimEnd = function () {
    //                 console.log("庄动画播放完")
    //                 node_SuerZhuang.active = false
    //                 target.UpdataZhuang(zhuangWxid, true)
    //             }
    //         }

    //         if (active == true) {
    //             //延迟多长时间 执行 结束 序列帧动画
    //             target.scheduleOnce(function () {
    //                 target.zhuangAnimationPlay(listwxid, false, zhuangWxid)
    //             }, 2)
    //         }
    //     } else {
    //         target.UpdataZhuang(zhuangWxid, true)
    //     }
    // },
    //----------------------新的 抢庄动画-----------------------------------------
    zhuangAnimationPlay(listwxid, active, zhuangWxid, maxbeishu) {
        var target = this
        this.flagBit = 0
        this.index = 0;
        if (this._roomList.wanfa != 1 && this._roomList.wanfa != 2) {
            this.zhuangArrSort(listwxid, zhuangWxid, maxbeishu)

            this.playEffectMusic("resources/game/nn/nn_sound/rest/random_banker_lianxu.mp3", false)
        } else {
            target.UpdataZhuang(zhuangWxid, true)
        }
    },

    zhuang_Animation(listwxid, zhuangWxid, maxbeishu) {
        if (this.index >= listwxid.length) {
            this.index = 0;
            this.flagBit++;
            if (this.flagBit == 5) {
                this.zhuangShangEndAnim(zhuangWxid)
                this.zhuangShangEndAnim_1()
                this.ActionNnShow("xiazhu", maxbeishu, zhuangWxid, true)
                return
            }
        }
        var self = this;
        var wxid = listwxid[self.index]
        let callfunc = cc.callFunc(function () { self.zhuangShangAnim(wxid) });
        let zhuangfun = cc.callFunc(function () { self.zhuang_Animation(listwxid, zhuangWxid, maxbeishu); });
        // 顺序执行抢庄动画
        var seq = cc.sequence(callfunc, cc.delayTime(0.08), zhuangfun);
        this.node.runAction(seq)
    },

    //庄闪动画
    zhuangShangAnim(wxid) {
        var node_qiangZhuang = this.user_node[this.getTableIndex(wxid)].getChildByName("node_QiangZhuanAnimation_1")
        // var node_qiangZhuang = this.user_node[this.getTableIndex(wxid)].getChildByName("node_QiangZhuanAnimation")
        var anim = node_qiangZhuang.getComponent(cc.Animation)

        anim.play()
        node_qiangZhuang.active = true;
        this.index++
    },

    //抢庄结束
    zhuangShangEndAnim(zhuangWxid) {
        var target = this
        var node_SuerZhuang = this.user_node[this.getTableIndex(zhuangWxid)].getChildByName("node_SuerZhuanAnimation")
        var anim1 = node_SuerZhuang.getComponent(cc.Animation)
        var animState = anim1.play()
        this.playEffectMusic("resources/game/nn/nn_sound/rest/random_banker_lianxu.mp3", false)
        animState.repeatCount = 10
        node_SuerZhuang.active = true
        //庄动画的帧事件：最后一帧结束自动执行
        anim1.zhuangAnimEnd = function () {
            console.log("庄动画播放完")
            node_SuerZhuang.active = false
            target.UpdataZhuang(zhuangWxid, true)
        }
    },

    zhuangShangEndAnim_1() {
        for (var i = 0; i < this.user_node.length; i++) {
            var node_qiangZhuang = this.user_node[i].getChildByName("node_QiangZhuanAnimation_1")
            var anim = node_qiangZhuang.getComponent(cc.Animation)
            anim.stop()
            node_qiangZhuang.active = false;
        }
    },

    //微信id的重新排序
    zhuangArrSort(wxidList, zhuangWxid, maxbeishu) {
        var sitUserWxidArr = []
        for (var k = 0; k < this._userNodeList.length; k++) {
            var index = this.zhuangAnimCircle[k + ""]
            var userWxid = this._userNodeList[index].wxId
            if (parseInt(userWxid)) {
                sitUserWxidArr.push(this._userNodeList[index])
            }
        }
        var wxidArr = []
        for (var i = 0; i < wxidList.length; i++) {
            for (var j = 0; j < sitUserWxidArr.length; j++) {
                if (wxidList[i] + '' == sitUserWxidArr[j].wxId) {
                    wxidArr.push(wxidList[i])
                }
            }
        }
        cc.log("微信id的重新排序", wxidList, "\n", sitUserWxidArr, "\n", wxidArr)
        this.zhuang_Animation(wxidArr, zhuangWxid, maxbeishu)
    },


    //------------------------------------------------------------------------------------------------------

    ActionNnFunc(wxid, ChildByNodeName, ChildByName, active) {

        var ChildByNode = this.user_node[this.getTableIndex(wxid)].getChildByName(ChildByNodeName)
        if (ChildByNode != null) {
            for (var i = 0; i < ChildByNode.childrenCount; i++) {
                ChildByNode.children[i].active = false
            }

            ChildByNode.getChildByName(ChildByName).active = active;
        }
    },

    //顶庄归位
    AnimaDingZhuangSetPos(active) {
        this.Node_meun.getChildByName("Anima_Zhuang").getChildByName("SureZhuang").active = active
    },

    //大结算
    SprMaxResultShow(active, obj) {

        if (active == true) {
            this.DelCuoCard() //大结算显示 删除搓牌
        }

        var node = cc.instantiate(cc.globalRes['node_MaxResult']);
        node.parent = this.node;
        node.getComponent("NN_MAXResult").setGameControl(this._gameControl)
        node.getComponent("NN_MAXResult").SprMaxResultShow(obj)
    },

    //通过wxid 查找用户信息
    getUserListByWxid(wxid) {
        for (var i = 0; i < this._userList.length; i++) {
            if (this._userList[i].wxId == wxid) {
                return this._userList[i]
            }
        }
    },
    //播放快捷聊天音效
    playChatSound(index, wxid, rest) {
        var tempIndex = 0;
        var tempIndex = index - 1
        var sex = this.getUserListByWxid(wxid).sex
        if (sex == "1") {
            this.playEffectMusic("resources/game/nn/nn_sound/chat/man/chat_m_" + tempIndex + ".mp3", false)
        } else {
            this.playEffectMusic("resources/game/nn/nn_sound/chat/woman/chat_f_" + tempIndex + ".mp3", false)
        }
    },
    //播放游戏音效
    playNNEffectMusic(tempIndex, wxid, rest) {
        if (rest) {
            cc.log("---其他音效---", tempIndex)
            this.playEffectMusic("resources/game/nn/nn_sound/rest/" + tempIndex + ".mp3", false)
        }
        var sex = this.getUserListByWxid(wxid).sex
        if (tempIndex == "zhuang") {
            cc.log("---抢庄音效---")
            if (sex == "1") {
                this.playEffectMusic("resources/game/nn/nn_sound/rest/qiangzhuang_0.mp3", false)
            } else {
                this.playEffectMusic("resources/game/nn/nn_sound/rest/qiangzhuang_1.mp3", false)
            }
        }
    },

    //播放背景音乐
    playTractorBgMusic() {
        //背景音乐  记得要改为牛牛自己的
        this.gameBgMusicId = this.playBgMusic("resources/game/nn/nn_sound/bg/game_bg_ermj.mp3", true)
    },
    //音效处理 
    playsoundCard(wxid, soundName, jiesuan) {
        var NiuType = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        var num = 0;
        if (jiesuan) {
            cc.log("---结算音效---")
            for (var i = 0; i < 17; i++) {
                if (soundName == i) {
                    cc.log("---结算音效-sss--")
                    this.playEffectMusic("resources/game/nn/nn_sound/nnNum/f0_nn" + soundName + ".mp3", false)
                    break;
                }
            }
        }
        switch (soundName) {
            case "xiazhu":
                cc.log("---下注音效---")
                this.playNNEffectMusic("random_banker_lianxu", wxid, true)
                break;
            case "fapai":
                cc.log("---发牌音效---")
                this.playNNEffectMusic("fapai", wxid, true);
                break;
            case "lose":
                cc.log("---输了音效---")
                this.playNNEffectMusic("lose", wxid, true);
                break;
            case "qiangzhuang":
                cc.log("---抢庄音效---")
                this.playNNEffectMusic("zhuang", wxid);
                break;
            case "buqiang":
                cc.log("---抢庄音效---")
                this.playNNEffectMusic("zhuang", wxid);
                break;

        }
    },

    // 点击座位节点[显示被点击人的个人信息]
    onClickSeat(event, customEventData) {
        this.playClickMusic()
        var userInfo = this.getUserListByWxid(event.target.wxId);

        // if (event.target.wxId == G.myPlayerInfo.wxId) {
        //     cc.globalMgr.globalFunc.addGameUserInfo(true, event.target.wxId, userInfo, false, this.FindefAndGlod);
        // } else {
        cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, true, this.FindefAndGlod);
        // }
    },

    //判断数组中是否包含某个元素
    isInclude(listwxid) {
        var arr = listwxid.some(function (iswxid) {
            return iswxid == G.myPlayerInfo.wxId;
        })
        return arr

    },

    //根据索引查找桌面并赋值
    desktopInit(index) {
        this.NN_Desktop.getComponent(cc.Sprite).spriteFrame = this.desktopFrame[index]

    },

    //根据索引查找牌并赋值
    cardInit(index) {
        this.cardFrameName = this.cardFrame[index]
        G.NNRoomDesktop = this.cardFrame[index].name
    },

    //权限 要牌
    onClickQX() {
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cmd.SUB_SHOWCORDNODE
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    showSelectPokerWindow() {
        var obj = cc.find("Canvas/prefab_NNChossCard")
        if (obj != null) {
            obj.active = true
        } else {
            var nodeTwis = cc.instantiate(cc.globalRes['runPrefab_NNChossCard']);
            nodeTwis.parent = this.node.parent;
        }
    },
    closeSelectPokerWindow() {

        var obj = cc.find("Canvas/prefab_NNChossCard")
        if (obj != null) {
            obj.getComponent('NN_selectPokers').destroydunPokers()
            obj.active = false
        }
    },


    rubbingPokerEnd() {

        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid
        obj.zinetid = cmd.SUB_S_LOOK_MYTOSHOWCARD
        this.send(cmd.MAIN_MSG_ID, obj)

    },

    ruleSave(ruleObj) {
        var playing = parseInt(ruleObj.wanfa)
        var wanfa = NNRoomRule.NNRoomPlaying[playing] //玩法
        var difen = NNRoomRule.NNRoomDiFen[ruleObj.difen] //底分
        var jushu = NNRoomRule.NNRoomInning[ruleObj.jushu] //局数
        var doubleRules = NNRoomRule.NNRoomDoubleRules[ruleObj.fanbeiguize] //翻倍规则
        var Bolus = NNRoomRule.NNRoomBolus[ruleObj.tuizhu] //推注
        var AutoStart = "" //自动开始
        if (playing != 5) {
            AutoStart = NNRoomRule.NNRoomAutoStart6[ruleObj.autoBegin]
        } else {
            AutoStart = NNRoomRule.NNRoomAutoStart8[ruleObj.autoBegin]
        }

        var MaxRobZhuang = "" //最大抢庄
        if (playing == 4 || playing == 5) {
            MaxRobZhuang = NNRoomRule.NNRoomMaxRobZhuang[ruleObj.zuidaqiangzhuang]
        }
        else {
            MaxRobZhuang = ""
        }

        var shangZhuang = "" //上庄分数
        if (playing == 2) {
            if (ruleObj.shangfenfenshu == 1) {
                shangZhuang = "上庄分数 无"
            } else {
                //          5                               
                var fen = ruleObj.difen * 100 * ruleObj.shangfenfenshu / 2
                shangZhuang = "上庄分数" + fen
            }

        } else {
            shangZhuang = ""
        }

        var isJinZhiJiaRu = "" // 禁止加入
        if (ruleObj.jinzhijiaru) {

            isJinZhiJiaRu = "游戏开始后禁止加入"
        } else {
            isJinZhiJiaRu = ""
        }

        var isXiaZhuXianZhi = "" // 下注限制
        if (ruleObj.xiazhuxianzhi && playing > 2) {
            isXiaZhuXianZhi = "下注限制"
        }
        else {
            isXiaZhuXianZhi = ""
        }
        var arr = [ruleObj.shunziniu, ruleObj.wuhuaniu, ruleObj.tonghuaniu, ruleObj.huluniu, ruleObj.zhadanniu, ruleObj.wuxiaoniu, ruleObj.huanleniu]
        var teshuArr = NNRoomRule.ASpecialCardType(arr)

        var rule = wanfa + " " + difen + " AA支付 " + jushu + " " + doubleRules + " 推注" + Bolus + " " + AutoStart + " " + MaxRobZhuang + " " + shangZhuang + " " + isJinZhiJiaRu + " " + isXiaZhuXianZhi + " " + teshuArr

        this.gameRule = rule

    },

    //上局回顾
    onClickShangJuHuiGu() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_SHANGJUHUIGU
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
        this.Node_meun.getChildByName("start_menu_node").getChildByName("top_menu").getChildByName("node_no").active = true;
        this.Node_meun.getChildByName("start_menu_node").getChildByName("top_menu").getChildByName("node_yes").active = false;
    },

    shangJuHuiGu(body) {

        var node = cc.instantiate(cc.globalRes['node_shangJuHuiGu']);
        node.parent = this.node;
        node.getComponent("NN_shangJuHuiGu").shangJuHuiGu(body)
    },
    //--------------------------------断线重连初始化---------------------------------------------------------------
    //断线重连 初始化 房间位置
    reconnectionInit() {
        //隐藏全部庄的显示
        for (var i = 0; i < this.user_node.length; i++) {
            var node_qiangZhuang = this.user_node[i].getChildByName("node_QiangZhuanAnimation")
            var node_SuerZhuang = this.user_node[i].getChildByName("node_SuerZhuanAnimation")
            node_qiangZhuang.active = false
            node_SuerZhuang.active = false
        }
    },

    //抢庄按钮的隐藏 
    concealQiangZhuangBtn() {
        var zhuangBtn_1 = this.Node_meun.getChildByName("node_zhuang")
        var zhuangBtn_2 = this.Node_meun.getChildByName("node_mingZhuang")
        zhuangBtn_1.active = false
        zhuangBtn_2.active = false
    },

    //--------------------------------↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑-------------------------------
    //点击按钮断线
    OnClickReconnection() {
        G.socketMgr.socket.close()
    },

    onDestroy() {
        //停止播放音乐
        cc.audioEngine.stopAll()

        this.uneventRegist(this)
        this.unregist(this)
    }




});

