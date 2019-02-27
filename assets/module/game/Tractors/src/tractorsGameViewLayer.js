//by cdl
var GameFrame = require("GameFrame")
var cmd = require("CMD_Tractors")
var MsgIds = require("MsgIds")

cc.Class({
    extends: GameFrame,

    properties: {
        game_node: {
            default: null,
            type: cc.Node
        },
        myCard_node: {
            default: null,
            type: cc.Node
        },
        poker_cards: {
            default: null,
            type: cc.Prefab
        },
        card_node: {
            default: [],
            type: cc.Node
        },
        top_node: {
            default: null,
            type: cc.Node
        },
        top_GlodTop: {
            default: null,
            type: cc.Node
        },
        user_node: {
            default: [],
            type: cc.Node
        },
        meun_node: {
            default: null,
            type: cc.Node
        },
        btn_chese: {
            default: [],
            type: cc.Button
        },
        spr_addMoneyBG: {
            default: null,
            type: cc.Node
        },
        btn_addmoneyAyyar: {
            default: [],
            type: cc.Node
        },

        //棋牌滑动起点
        spr_clipMove: {
            default: [],
            type: cc.Node
        },
        node_ClipEndMove: {
            default: null,
            type: cc.Node
        },
        node_nodeclip: {
            default: [],
            type: cc.Node
        },
        ResultAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        node_pvpCard: {
            default: null,
            type: cc.Node
        },
        node_MinSettle: {
            default: null,
            type: cc.Node
        },

        node_MaxSettle: {
            default: null,
            type: cc.Node
        },
        node_CardMove: {
            default: [],
            type: cc.Node
        },
        node_cardHome: {
            default: null,
            type: cc.Node
        },
        node_cardType: {
            default: null,
            type: cc.Node
        },
        Animation_game: {
            default: null,
            type: cc.Animation
        },
        node_pkMove: {
            default: [],
            type: cc.Node
        },
        bar_waitTime: {
            default: [],
            type: cc.ProgressBar
        },
        node_pvpDisplayCard: {
            default: [],
            type: cc.Node
        },
        node_playDisplay: {
            default: null,
            type: cc.Node
        },
        prefab_notice: {
            default: null,
            type: cc.Node
        },
        btn_voice: {
            default: null,
            type: cc.Button
        },
        btn_dissolove: {
            default: null,
            type: cc.Node
        },
        btn_location: {
            default: null,
            type: cc.Node
        },
        btn_afk: {
            default: null,
            type: cc.Node
        },
        Top_meunExit: {
            default: null,
            type: cc.Node
        },


        //作弊根节点
        zuoBiShow: {
            default: null,
            type: cc.Node
        },

        //作弊纸牌盒子
        zuoBiCardsBox: {
            default: [],
            type: cc.Node
        },


        //超端节点
        node_super: {
            default: null,
            type: cc.Node
        },
        //超端牌节点
        node_super_card_node: {
            default: [],
            type: cc.Node
        },
    },
    onLoad() {

        this.OnInitPoker();
        this.initPublicParm()
        this.initRoom();
        this.InitUserPOS();
        //监听滚动公告消息
        this.regist(MsgIds.NOTICE_MASSAGE, this, this.setNotice)

        //-------作弊部分参数
        this.zuoBiShow.active = false;
        //点击次数
        this._curTimes = 0;
        //要牌点数列表
        this._cardsPointList = [];
        //要牌花色列表
        this._cardsFlowerList = [];
        //要牌点数
        this._curPoint = 0;
        //纸牌序号
        this._curIndex = -1;
        //花色
        this._curFlower = "";
    },

    //-----------------------作弊超端--------透视-------------------------
    //点击显示超端界面
    onClickedSuperVisible(cardsList) {

        if (this.node_super.opacity == 0) {
            this.node_super.opacity = 255
        }
        else if (this.node_super.opacity == 255) {
            this.node_super.opacity = 0
        }
    },

    //超端牌显示
    showSuperCards(cardsList) {

        if (this.node_super_list == undefined) {
            this.node_super_list = [[], [], [], [], [], [], [], [], []]
        }
        //移除超端牌
        for (var i = 0; i < this.node_super_list.length; i++) {
            for (var j = 0; j < this.node_super_list[i].length; j++) {

                this.node_super_list[i][j].getComponent("CommPoker").reset()
                this.PokerCardsPool.put(this.node_super_list[i][j])
            }
            this.node_super_list[i] = []
        }

        for (var i = 0; i < cardsList.length; i++) {
            var cards = cardsList[i].cardList
            var wxid = cardsList[i].wxid
            var isMyUser = G.myPlayerInfo.wxId == wxid
            if (isMyUser == true) {
                this.node_super_list[this.getTableIndex(wxid)] = this.createPokers(this.node_super_card_node[this.getTableIndex(wxid)], cards, 120, this.getTableIndex(wxid), true)
            } else {
                this.node_super_list[this.getTableIndex(wxid)] = this.createPokers(this.node_super_card_node[this.getTableIndex(wxid)], cards, 95, this.getTableIndex(wxid), false)
            }
        }
    },

    //-------------------------作弊功能- 要牌------------------------
    //作弊回调
    onZuoBiClick() {
        cc.log("---------作弊点击", G.myPlayerInfo.qx);
        if (G.myPlayerInfo.qx == 1) {
            this._curTimes = 0;

            this.zuoBiShow.active = true;
            this.closeMaskForAllCards();
        }
        else {
            cc.log("-----没有作弊权限");
        }
        // this._curTimes = 0;

        // this.zuoBiShow.active = true;
        // this.closeMaskForAllCards();
    },

    //作弊关闭
    onZuoBiCloseClick() {
        cc.log("---------作弊关闭点击");
        this.zuoBiShow.active = false;
    },

    //关闭所有纸牌遮罩
    closeMaskForAllCards() {
        var len = this.zuoBiCardsBox.length;
        for (var i = 0; i < len; i++) {
            //打开按钮
            this.zuoBiCardsBox[i].getComponent(cc.Button).interactable = true;
            //关闭遮罩
            this.zuoBiCardsBox[i].getChildByName("maskSpr").getComponent(cc.Sprite).node.active = false;
        }
    },

    //打开选择纸牌遮罩
    openMaskForSelectCards(curIndex) {
        var len = this.zuoBiCardsBox.length;
        for (var i = 0; i < len; i++) {
            if (i == curIndex) {
                //禁用按钮
                this.zuoBiCardsBox[i].getComponent(cc.Button).interactable = false;
                //开遮罩
                this.zuoBiCardsBox[i].getChildByName("maskSpr").getComponent(cc.Sprite).node.active = true;
            }
        }
    },

    //重置回调
    onResetClick() {
        cc.log("----重置");
        this._curTimes = 0;
        //要牌点数列表
        this._cardsPointList = [];
        //要牌花色列表
        this._cardsFlowerList = [];

        this.closeMaskForAllCards();
    },

    getSendCard() {
        var sendcards = []
        var len = this._cardsPointList.length;
        for (var i = 0; i < len; i++) {
            var obj = new Object()
            obj.v = this._cardsPointList[i]
            obj.h = this._cardsFlowerList[i]
            sendcards.push(obj)
        }
        return sendcards;
    },

    sendForSelCards() {
        var sendCards = this.getSendCard()
        var obj = new Object()
        obj.zinetid = cmd.SUB_S_ZUOBI
        obj.uid = G.myPlayerInfo.uid
        obj.cards = sendCards
        this.send(cmd.MAIN_MSG_ID, obj)
        cc.log("-----发送作弊数据:", obj)
    },

    //纸牌回调
    onSelCardClick(event, customEventData) {
        this._curTimes = this._curTimes + 1;
        cc.log("----点击次数:", this._curTimes);
        if (this._curTimes >= 4) {
            // this._curTimes = 0;
            //禁用选牌
            cc.log("----点击次数大于4, 跳出");
            return;
        }

        switch (customEventData) {
            case "b14": {
                this._curIndex = 0;
                this._curFlower = "b";
                this._curPoint = 14;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c14": {
                this._curIndex = 1;
                this._curFlower = "c";
                this._curPoint = 14;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d14": {
                this._curIndex = 2;
                this._curFlower = "d";
                this._curPoint = 14;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a14": {
                this._curIndex = 3;
                this._curFlower = "a";
                this._curPoint = 14;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b2": {
                this._curIndex = 4;
                this._curFlower = "b";
                this._curPoint = 2;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c2": {
                this._curIndex = 5;
                this._curFlower = "c";
                this._curPoint = 2;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d2": {
                this._curIndex = 6;
                this._curFlower = "d";
                this._curPoint = 2;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a2": {
                this._curIndex = 7;
                this._curFlower = "a";
                this._curPoint = 2;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b3": {
                this._curIndex = 8;
                this._curFlower = "b";
                this._curPoint = 3;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c3": {
                this._curIndex = 9;
                this._curFlower = "c";
                this._curPoint = 3;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d3": {
                this._curIndex = 10;
                this._curFlower = "d";
                this._curPoint = 3;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a3": {
                this._curIndex = 11;
                this._curFlower = "a";
                this._curPoint = 3;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b4": {
                this._curIndex = 12;
                this._curFlower = "b";
                this._curPoint = 4;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c4": {
                this._curIndex = 13;
                this._curFlower = "c";
                this._curPoint = 4;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d4": {
                this._curIndex = 14;
                this._curFlower = "d";
                this._curPoint = 4;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a4": {
                this._curIndex = 15;
                this._curFlower = "a";
                this._curPoint = 4;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b5": {
                this._curIndex = 16;
                this._curFlower = "b";
                this._curPoint = 5;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c5": {
                this._curIndex = 17;
                this._curFlower = "c";
                this._curPoint = 5;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d5": {
                this._curIndex = 18;
                this._curFlower = "d";
                this._curPoint = 5;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a5": {
                this._curIndex = 19;
                this._curFlower = "a";
                this._curPoint = 5;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b6": {
                this._curIndex = 20;
                this._curFlower = "b";
                this._curPoint = 6;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c6": {
                this._curIndex = 21;
                this._curFlower = "c";
                this._curPoint = 6;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d6": {
                this._curIndex = 22;
                this._curFlower = "d";
                this._curPoint = 6;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a6": {
                this._curIndex = 23;
                this._curFlower = "a";
                this._curPoint = 6;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b7": {
                this._curIndex = 24;
                this._curFlower = "b";
                this._curPoint = 7;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c7": {
                this._curIndex = 25;
                this._curFlower = "c";
                this._curPoint = 7;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d7": {
                this._curIndex = 26;
                this._curFlower = "d";
                this._curPoint = 7;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a7": {
                this._curIndex = 27;
                this._curFlower = "a";
                this._curPoint = 7;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b8": {
                this._curIndex = 28;
                this._curFlower = "b";
                this._curPoint = 8;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c8": {
                this._curIndex = 29;
                this._curFlower = "c";
                this._curPoint = 8;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d8": {
                this._curIndex = 30;
                this._curFlower = "d";
                this._curPoint = 8;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a8": {
                this._curIndex = 31;
                this._curFlower = "a";
                this._curPoint = 8;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b9": {
                this._curIndex = 32;
                this._curFlower = "b";
                this._curPoint = 9;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c9": {
                this._curIndex = 33;
                this._curFlower = "c";
                this._curPoint = 9;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d9": {
                this._curIndex = 34;
                this._curFlower = "d";
                this._curPoint = 9;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a9": {
                this._curIndex = 35;
                this._curFlower = "a";
                this._curPoint = 9;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b10": {
                this._curIndex = 36;
                this._curFlower = "b";
                this._curPoint = 10;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c10": {
                this._curIndex = 37;
                this._curFlower = "c";
                this._curPoint = 10;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d10": {
                this._curIndex = 38;
                this._curFlower = "d";
                this._curPoint = 10;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a10": {
                this._curIndex = 39;
                this._curFlower = "a";
                this._curPoint = 10;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b11": {
                this._curIndex = 40;
                this._curFlower = "b";
                this._curPoint = 11;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c11": {
                this._curIndex = 41;
                this._curFlower = "c";
                this._curPoint = 11;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d11": {
                this._curIndex = 42;
                this._curFlower = "d";
                this._curPoint = 11;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a11": {
                this._curIndex = 43;
                this._curFlower = "a";
                this._curPoint = 11;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b12": {
                this._curIndex = 44;
                this._curFlower = "b";
                this._curPoint = 12;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c12": {
                this._curIndex = 45;
                this._curFlower = "c";
                this._curPoint = 12;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d12": {
                this._curIndex = 46;
                this._curFlower = "d";
                this._curPoint = 12;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a12": {
                this._curIndex = 47;
                this._curFlower = "a";
                this._curPoint = 12;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "b13": {
                this._curIndex = 48;
                this._curFlower = "b";
                this._curPoint = 13;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "c13": {
                this._curIndex = 49;
                this._curFlower = "c";
                this._curPoint = 13;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "d13": {
                this._curIndex = 50;
                this._curFlower = "d";
                this._curPoint = 13;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "a13": {
                this._curIndex = 51;
                this._curFlower = "a";
                this._curPoint = 13;
                this.openMaskForSelectCards(this._curIndex);
                break;
            }
            case "53": {

                break;
            }
            case "54": {

                break;
            }
            default:
                break;
        }
        // cc.log("---sub---", sub)
        // cc.log("---event--", event)
        if (this._curTimes == 1) {
            this._cardsPointList[0] = this._curPoint;
            this._cardsFlowerList[0] = this._curFlower;
        }
        else if (this._curTimes == 2) {
            this._cardsPointList[1] = this._curPoint;
            this._cardsFlowerList[1] = this._curFlower;
        }
        else if (this._curTimes == 3) {
            this._cardsPointList[2] = this._curPoint;
            this._cardsFlowerList[2] = this._curFlower;
        }
        cc.log("-----选牌列表:", this._cardsFlowerList, this._cardsPointList);
    },
    //-----------------作弊结束-----------------------


    //初始化扑克
    OnInitPoker() {
        this.PokerCardsPool = new cc.NodePool();
        cc.log("---初始化 牌面---")
        for (var i = 0; i < 300; i++) {
            this.PokerCardsPool.put(cc.instantiate(this.poker_cards))
        }

    },
    //初始化公有参数
    initPublicParm() {
        //桌面上的筹码
        //this.clipNode = [];
        // 存储玩家信息
        this._userList = {}
        // 房间号
        this._roomNum = 0;
        //房间规则、
        this.playMethod = 0;
        //局数
        this._roomJuNum = 0;
        this._maxCallScore = -1
        //我的手牌数据
        this.myPokers = [[], [], [], [], [], [], []]
        //玩家看过的牌
        this.PlayLookPokers = [];
        //结算界面显示的牌
        this.RepeoplePokers = [[], [], [], [], [], [], []];
        //pk的牌 1
        this.PlayPKOnepokers = [];
        //pk的牌 2
        this.PlayPKTwopokers = [];
        //当前下注数
        this.pointNum = 0;
        //初始化筹码
        this.InitClipNum = 0;
        // 加注里面可以选择的筹码
        this.AddponitNumArray = [4, 8, 10, 15, 20];
        //房间底注
        // this.clipDi = [0.5, 1, 2, 3, 5]
        //开始位置  筹码
        this.startPos = cc.p(0, 0);
        //结束位置  
        this.endPos = cc.p(0, 0);
        this.endpostion = this.node_ClipEndMove.getPosition();
        // 桌面上的筹码
        this.roomclip = [];
        //当前时间
        this.CurrentTime = 0;
        //跟注情况 1，跟注 2，加注
        this.GenClip = 0;
        this.GenClipCount = 0;
        this.AddClipCount = 0;

        this.node_cardType.active = false;
        //定时器转到速度
        this.speed = 0.08;
        this._pingpong = true;
        //好友房还是金币场 金币 1， 好友2
        this.FindefAndGlod = 0;
        //好友房离开房间 离开 1，解散 2
        this.FindefAndExit = false;
        //记录点击准备情况
        this.GlodState = false;
        //结算界面人数
        this.repeopleNum = "";
        this.isGameStart = false;
    },
    //记录玩家坐标信息
    InitUserPOS() {
        //玩家坐标
        cc.log("---定位玩家位置----")
        this.UserPosArr = []
        for (var i = 0; i < this.user_node.length; i++) {
            this.UserPosArr.push(this.user_node[i]);
        }
    },
    //初始化房间信息
    initRoom() {
        for (var i = 0; i < this.node_CardMove.length; i++) {
            this.node_CardMove[i].active = false;
        }
        this.node_playDisplay.active = false;
        cc.log("--跑马灯---")
        //监听滚动公告消息
        this.regist(MsgIds.NOTICE_MASSAGE, this, this.setNotice)
    },
    start() {
        this.playTractorBgMusic();
    },
    //每个新局的初始化
    InitNewRoomJu() {
        this.node_pvpCard.active = false;
        this.spr_addMoneyBG.active = false;
    },
    //创建扑克列
    createPokers(node, PokerList, offerx, index, isMyUser) {
        // cc.log("----拖拉机 牌---", index)
        var offerx = offerx
        var AllPokersWidth = PokerList.length * offerx
        var tempPokers = []
        for (var i = 0; i < PokerList.length; i++) {
            var poker = this.PokerCardsPool.get()
            tempPokers.push(poker)
            poker.parent = node
            poker.setLocalZOrder(0);
            if (node == this.node_CardMove[index]) {
                poker.setScale(0.6, 0.6)
                poker.setPosition((i - 1) * offerx + (AllPokersWidth / 10), 0)
            }
            else if (node == this.node_super_card_node[index]) {
                if (isMyUser == true) {
                    poker.setScale(0.9, 0.9)
                    poker.setPosition((i - 1) * offerx + (AllPokersWidth / 10), 0)
                } else {
                    poker.setScale(0.72, 0.72)
                    poker.setPosition((i - 1) * offerx + (AllPokersWidth / 10), 0)
                }

            }
            else {
                poker.setScale(0.4, 0.4)
                poker.setPosition((i - 1) * offerx + (AllPokersWidth / 10), 0)
            }
            poker.getComponent("CommPoker").setPoker(PokerList[i].v, PokerList[i].h)
        }
        return tempPokers
    },

    upRoomInfo(obj) {
        var ruleStr = obj.nowjuShu + "/" + obj.jushu + "局 " + obj.difen + "底分" + " " + "闷" + obj.menNumber + " " + "轮数" + obj.maxNumber;
        var play_label = this.top_node.getChildByName("img_base_type").getChildByName("label_room_msg").getComponent(cc.Label);
        play_label.string = ruleStr;
    },

    //更新规则
    updateBaseinfo(obj, isReady) {
        cc.log("---房间规则---", obj)
        this._roomJuNum = obj.jushu;
        var ruleStr = obj.nowjuShu + "/" + obj.jushu + "局 " + obj.difen + "底分" + " " + "闷" + obj.menNumber + " " + "轮数" + obj.maxNumber;
        var roomid = this.top_node.getChildByName("img_base_info").getChildByName("label_room_id").getComponent(cc.Label);
        roomid.string = obj.roomId;
        var play_label = this.top_node.getChildByName("img_base_type").getChildByName("label_room_msg").getComponent(cc.Label);
        play_label.string = ruleStr;
        var difen = this.top_node.getChildByName("spr_difen").getChildByName("label_difen").getComponent(cc.Label);
        difen.string = "底分 " + obj.difen;
        var gloddifen = this.top_GlodTop.getChildByName("layout_top").getChildByName("spr_dizhu").getChildByName("label_difen").getComponent(cc.Label);
        gloddifen.string = "底分 " + obj.difen;
        this._roomNum = obj.roomId;
        this.playMethod = ruleStr;
        // this.UpdateClipDi(obj.difen)
        this.InitClipNum = obj.difen;
        cc.log("---初始化筹码---", this.pointNum)
        if (obj.isbegin) {
            this.showReadybtn(true)
        }
        if (isReady) {
            cc.log("---准备过了---")
            this.showReadybtn(false)
        } else {
            cc.log("---还没有准备---")
            this.showReadybtn(true)
        }

        //设置
        this.UpDateDisPlayClip(this.AddponitNumArray)
    },
    // //根据底分来判断本局下注筹码
    // UpdateClipDi(ClipNum) {
    //     switch (ClipNum) {
    //         case this.clipDi[0]:
    //             this.AddponitNumArray = [0.5, 1, 5, 10, 20];
    //             break;
    //         case this.clipDi[1]:
    //             this.AddponitNumArray = [1, 5, 10, 20, 50];
    //             break;
    //         case this.clipDi[2]:
    //             this.AddponitNumArray = [2, 4, 8, 30, 80];
    //             break;
    //         case this.clipDi[3]:
    //             this.AddponitNumArray = [3, 6, 15, 40, 100];
    //             break;
    //         case this.clipDi[4]:
    //             this.AddponitNumArray = [5, 10, 20, 50, 150];
    //             break;
    //     }
    //     this.UpDateDisPlayClip(this.AddponitNumArray)
    // },
    //初始化筹码
    InitClipFunc() {
        this.pointNum = this.InitClipNum;
    },
    //根据底分来显示本剧筹码
    UpDateDisPlayClip(clip) {
        for (var i = 0; i < clip.length; i++) {
            //this.btn_addmoneyAyyar[i].getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame(clip[i]);
            this.btn_addmoneyAyyar[i].getChildByName("label_chouma").getComponent(cc.Label).string = clip[i];
            cc.log("-----设置原始筹码数");
        }
    },

    //双倍显示筹码
    UpDateDisPlayClipForDouble(clip) {
        for (var i = 0; i < clip.length; i++) {
            //this.btn_addmoneyAyyar[i].getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame(clip[i]);
            this.btn_addmoneyAyyar[i].getChildByName("label_chouma").getComponent(cc.Label).string = (clip[i] * 2);
            cc.log("-----设置双倍筹码数");
        }
    },

    //判断金币场还是好友房
    checkGlodAndFinfe(isjinbi) {
        cc.log("--金币场还是好友场--", isjinbi)
        if (!this.GlodState) {
            this.top_node.active = !isjinbi;
            this.top_GlodTop.active = isjinbi;
            if (isjinbi) {
                //是金币场
                for (var i = 0; i < this.user_node.length; i++) {
                    this.user_node[i].active = false;
                }
                this.meun_node.getChildByName("node_StartCoin").active = true;
                this.meun_node.getChildByName("node_StartFind").active = false;
                this.FindefAndGlod = 1;
                this.Top_meunExit.getChildByName("top_menu").getChildByName("node_yes").getChildByName("layout_btn").getChildByName("btn_showTopMenu").active = false
            } else {
                //是好友场
                this.meun_node.getChildByName("node_StartFind").active = true;
                this.meun_node.getChildByName("node_StartCoin").active = false;
                this.FindefAndGlod = 2;
                this.Top_meunExit.getChildByName("top_menu").getChildByName("node_yes").getChildByName("layout_btn").getChildByName("btn_showTopMenu").active = true
            }
        }
    },
    //提示开始游戏
    SprStartGameShow(active) {
        this.meun_node.getChildByName("node_StartGame").active = active;
    },
    //开始游戏
    OnClickStartFunc() {
        this.playClickMusic()
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_START_GAMEEND
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //换桌
    OnClickChangeTabelFunc() {
        this.playClickMusic()
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid
        this.send(cc.globalMgr.msgIds.CHANGE_TABLE, obj)
    },

    //隐藏显示准备按钮
    showReadybtn(active) {
        if (this.FindefAndGlod == 1) {
            cc.log("----金币场显示按钮---")
            this.meun_node.getChildByName("node_StartCoin").active = active;
            //this.meun_node.getChildByName("node_StartFind").active = false;
        } else if (this.FindefAndGlod == 2) {
            cc.log("----好友场显示按钮---")
            this.meun_node.getChildByName("node_StartFind").active = active;
            // this.meun_node.getChildByName("node_StartCoin").active = false;
        }
    },
    setNotice(msgNumber, body, target) {
        target.prefab_notice.getComponent("RollingNotice").setRollingNotice(body.msg)
    },
    //更新玩家信息
    updateUsersinfo(obj) {
        this._userList = obj
        cc.log("----userList---玩家信息----", this._userList)
        for (var i = 0; i < this.user_node.length; i++) {
            this.user_node[i].active = false;
        }
        for (var i = 0; i < obj.length; i++) {
            this.updateUserItem(this.user_node[this.getTableIndex(obj[i].wxId)], obj[i])
            this.user_node[this.getTableIndex(obj[i].wxId)].getChildByName("btn_seat").wxId = obj[i].wxId;
        }
    },
    //更新个人基本信息
    updateUserItem(head, obj) {
        head.active = true;
        cc.log("---用户头像显示出来---")
        //显示乐币
        head.getChildByName("spr_meney").getChildByName("label_money").getComponent(cc.Label).string = this.FormatGold(obj.jinbi)
        cc.loader.load({ url: obj.image, type: 'png' }, function (err, tex) {
            head.getChildByName("mask_head").getChildByName("sp_head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
        });
        head.getChildByName("label_wxid").getComponent(cc.Label).string = obj.wxId;
        cc.log("---玩家ok--")
        //head.getChildByName("sp_ok").active = false;
        head.getChildByName("roomone").active = false;
        head.getChildByName("spe_points").getChildByName("Label").getComponent(cc.Label).string = "0";
        // 倒计时
        head.getChildByName("sp_clockbg").active = false;
        // this.this.bar_waitTime[this.getTableIndex(this._waitWxid)].active = false;
        //玩家状态 显示
        head.getChildByName("spr_state").active = false;
        //比牌
        head.getChildByName("btn_pvp").active = false;
        head.getChildByName("spr_chat").active = false;
    },
    //玩家分数
    updateuserBase(obj) {
        this.user_node[this.getTableIndex(obj.wxid)].getChildByName("spr_meney").getChildByName("label_money").getComponent(cc.Label).string = this.FormatGold(obj.jinbi)
    },
    //庄家
    UpdataZhuang(wxid, avtive) {
        this.user_node[this.getTableIndex(wxid)].getChildByName("roomone").active = avtive;
    },
    //准备按钮
    onClickReady() {
        this.playClickMusic()
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_READY
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
        //this.showReadybtn(false)
        cc.log("--点击准备按钮，让菜单栏消失")
        this.GlodState = true;
    },
    //所有玩家准备隐藏
    allPlayerReady(active) {
        this.meun_node.getChildByName("node_chose").active = !active;
        for (var i = 0; i < this._userList.length; i++) {
            this.playerReady(this._userList[i].wxId, active)
        }
    },
    //玩家准备
    playerReady(wxId, active) {
        cc.log("--准备手势1---", active)
        this.user_node[this.getTableIndex(wxId)].getChildByName("sp_ok").active = active;
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
    setGameControl(gameControl) {
        this._gameControl = gameControl
        //绑定语音按钮 和头像框
        this._gameControl.bindVoiceBtnAndUsersBox(this.btn_voice, this.user_node)
        //绑定头像框
        this._gameControl.bindUsersBox(this.user_node)
    },
    //刷新自己手牌
    refreshMyCards(PokerList, listwxid) {
        //先移除现在的手牌
        for (var i = 0; i < this.myPokers.length; i++) {
            var pokerLength = this.myPokers[i].length
            if (pokerLength != 0) {
                for (var j = 0; j < pokerLength; j++) {
                    this.myPokers[i][j].getComponent("CommPoker").reset()
                    this.PokerCardsPool.put(this.myPokers[i][j])
                }
            }
            this.myPokers[i] = []
        }
        //移除看过的牌
        if (this.PlayLookPokers.length != 0) {
            for (var i = 0; i < this.PlayLookPokers.length; i++) {
                this.PlayLookPokers[i].getComponent("CommPoker").reset()
                this.PokerCardsPool.put(this.PlayLookPokers[i])
            }
            this.PlayLookPokers = []
        }
        //移除pk的牌  
        if (this.PlayPKOnepokers.length != 0) {
            for (var i = 0; i < this.PlayPKOnepokers.length; i++) {
                this.PlayPKOnepokers[i].getComponent("CommPoker").reset()
                this.PokerCardsPool.put(this.PlayPKOnepokers[i])
            }
            this.PlayPKOnepokers = []
        }
        //移除pk的牌  
        if (this.PlayPKTwopokers.length != 0) {
            for (var i = 0; i < this.PlayPKTwopokers.length; i++) {
                this.PlayPKTwopokers[i].getComponent("CommPoker").reset()
                this.PokerCardsPool.put(this.PlayPKTwopokers[i])
            }
            this.PlayPKTwopokers = []
        }
        this.listwxid = listwxid;
        //给点击准备的人发牌
        for (var i = 0; i < listwxid.length; i++) {
            cc.log("_--wxid--list---", listwxid[i])
            this.node_CardMove[i].active = true;
            if (listwxid[i] == G.myPlayerInfo.wxId) {
                this.myPokers[this.getTableIndex(listwxid[i])] = this.createPokers(this.node_CardMove[i], PokerList, 83, i)
            } else {
                this.myPokers[this.getTableIndex(listwxid[i])] = this.createPokers(this.node_CardMove[i], PokerList, 55)
            }
            this.spriteMoveCardPlay(this.node_CardMove[i], this.card_node[this.getTableIndex(listwxid[i])])
            this.user_node[this.getTableIndex(listwxid[i])].getChildByName("spr_state").getChildByName("label_state").getComponent(cc.Label).string = "开始";
        }
    },
    //让自己的牌显示出来
    refreshmycard(PokerList, wxid, type) {

        // //先移除现在的手牌
        // if (this.PlayLookPokers.length != 0) {
        //     for (var i = 0; i < this.PlayLookPokers.length; i++) {
        //         this.PlayLookPokers[i].getComponent("CommPoker").reset()
        //         this.PokerCardsPool.put(this.PlayLookPokers[i])
        //     }
        //     this.myPoker = []
        // }
        // if (wxid == G.myPlayerInfo.wxId) {
        //     this.node_cardType.active = true;
        //     this.PlayLookPokers = this.createPokers(this.myCard_node, PokerList, 85)
        //     this.node_cardType.getChildByName("spr_cardtype").getChildByName("label_cardtype").getComponent(cc.Label).string = this.PlayCardType(type);
        // }
        //先移除现在的手牌
        if (wxid == G.myPlayerInfo.wxId) {
            this.node_cardType.active = true;
            for (var i = 0; i < PokerList.length; i++) {
                this.myPokers[this.getTableIndex(wxid)][i].getComponent("CommPoker").setPoker(PokerList[i].v, PokerList[i].h)
            }

            this.node_cardType.getChildByName("spr_cardtype").getChildByName("label_cardtype").getComponent(cc.Label).string = this.PlayCardType(type);
            this.playerSound(type, wxid)
        }
    },
    //通知其他人下注看牌情况 id 状态类型  是否显示  是否比牌
    Informothers(wxid, str, active, pvp) {
        //看牌用绿色   弃牌用红色
        var color = new cc.Color(240, 255, 255)
        if (pvp) {
            if (str != "结束") {
                this.user_node[this.getTableIndex(wxid)].getChildByName("sp_clockbg").active = false;
            }
        } else {
            for (var i = 0; i < this.user_node.length; i++) {
                if (this.user_node[i].getChildByName("spr_state").getChildByName("label_state").getComponent(cc.Label).string != "比牌输") {
                }
            }
        }
        if (str == "看牌") {
            color = new cc.Color(34, 139, 34)
        } else if (str == "弃牌") {
            color = new cc.Color(220, 60, 20)
        }
        if (str != "结束") {
            var user_node = this.user_node[this.getTableIndex(wxid)].getChildByName("spr_state");
            user_node.active = active;
            let lab = user_node.getChildByName("label_state")
            lab.getComponent(cc.Label).string = str;
            lab.color = color
        }
    },
    // 跟注显示
    InforGenClip(wxid, str, active) {
        for (var i = 0; i < this.user_node.length; i++) {
            this.user_node[i].getChildByName("spr_chat").active = false;
        }
        if (str != "结束") {
            var user_node = this.user_node[this.getTableIndex(wxid)].getChildByName("spr_chat");
            user_node.active = active;
            user_node.getChildByName("label_chat").getComponent(cc.Label).string = str;
        }
    },
    //提示玩家操作
    hitPlayRes(wxid, active) {
        this.LookWxid = wxid;
        this.meun_node.getChildByName("node_chose").active = active;
        var user = this.user_node[this.getTableIndex(wxid)];
        var curB = cc.blink(15, 30);
        if (wxid == G.myPlayerInfo.wxId) {
            for (var i = 0; i < this.btn_chese.length; i++) {
                this.btn_chese[i].interactable = active;
                this.btn_chese[i].node.opacity = 255;
            }
        }
        else {
            for (var i = 0; i < this.btn_chese.length; i++) {
                //处理不应该出牌的玩家按钮情况
                this.btn_chese[i].node.opacity = 150;
                this.btn_chese[i].interactable = !active;
            }
        }
        user.getChildByName("spr_handdi").runAction(curB);
    },
    //玩家下注总金额显示
    getDendAlloMoney(wxid, currentallmoney) {
        this.user_node[this.getTableIndex(wxid)].getChildByName("spe_points").getChildByName("Label").getComponent(cc.Label).string = currentallmoney;
        this.user_node[this.getTableIndex(wxid)].getChildByName("spr_handdi").stopAllActions();
    },

    //发送下注消息
    Playwithnode(value, active) {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_PULL_MONEY
        obj.uid = G.myPlayerInfo.uid
        obj.type = this.GenClip

        if (value) {
            obj.xiazhu = value;
        } else {
            cc.log("加注金额sss--", this.pointNum)
            obj.xiazhu = this.pointNum; // 跟注金额
        }
        this.send(cmd.MAIN_MSG_ID, obj)
        if (active) {
            this.OnClickCloseAddMoney();
        }


    },
    //玩家最新跟注金额
    getSendMoney(currentmoney) {
        if (currentmoney) {
            this.pointNum = currentmoney;
        }
        cc.log("--最大注--", currentmoney)
    },
    //加注金额
    choseMoneyNum(event, customEventData) {
        this.playClickMusic()
        switch (customEventData) {
            case "10":
                this.Playwithnode(this.AddponitNumArray[0], true);
                break;
            case "20":
                this.Playwithnode(this.AddponitNumArray[1], true);
                break;
            case "30":
                this.Playwithnode(this.AddponitNumArray[2], true);
                break;
            case "50":
                this.Playwithnode(this.AddponitNumArray[3], true);
                break;
            case "100":
                this.Playwithnode(this.AddponitNumArray[4], true);
                break;
        }
    },
    //加注显示
    OnClickAddMoney(value) {
        this.spr_addMoneyBG.active = true;
        var value = value;
        for (var i = 0; i < this.btn_addmoneyAyyar.length; i++) {
            cc.log("---玩家显示下注--", this.btn_addmoneyAyyar[i])
            cc.log("---现在筹码为--", this.pointNum)
            if (this.pointNum >= value[i]) {
                this.btn_addmoneyAyyar[i].getComponent(cc.Button).interactable = false;
                this.btn_addmoneyAyyar[i].opacity = 155;
                this.btn_addmoneyAyyar[i].interactable = true;
            }
            else {
                this.btn_addmoneyAyyar[i].getComponent(cc.Button).interactable = true;
                this.btn_addmoneyAyyar[i].opacity = 255;
                this.btn_addmoneyAyyar[i].interactable = false;
            }
        }
        var btn_pvp = this.user_node[this.getTableIndex(this.LookWxid)].getChildByName("spr_state").getChildByName("label_state").getComponent(cc.Label).string;
        // if (btn_pvp == "看牌") {
        //     this.btn_addmoneyAyyar[this.btn_addmoneyAyyar.length - 1].active = true;
        // } else {
        //     this.btn_addmoneyAyyar[this.btn_addmoneyAyyar.length - 1].active = false;
        // }
    },
    OnClickCloseAddMoney() {
        this.spr_addMoneyBG.active = false;
    },
    //看牌
    OnClickLookCards() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_LOOK_CARDS;
        obj.uid = G.myPlayerInfo.uid;
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //玩家弃牌
    discards() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_DISCARD;
        obj.uid = G.myPlayerInfo.uid;
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //玩家比牌
    playpvpCard(pwxid) {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_PVP_CARD;
        obj.uid = G.myPlayerInfo.uid;
        obj.wxid = pwxid;
        this.send(cmd.MAIN_MSG_ID, obj)
        this.InitNewRoomJu()
    },
    //点击玩家比牌
    OnclickPlaypvpCard(sub, event) {
        var wxid = parseInt(event)
        var pwxid = this.user_node[wxid].getChildByName("label_wxid").getComponent(cc.Label).string;
        //如果比牌的玩家没有输而且不是自己
        if (pwxid != G.myPlayerInfo.wxId) {
            this.playpvpCard(pwxid);
        }
    },
    //玩家比牌结束
    playpvpEnd() {
        this.node_pvpCard.active = false;
        for (var i = 0; i < this.user_node.length; i++) {
            var user = this.user_node[i];
            if (user.active)
                user.getChildByName("btn_pvp").active = false;
        }
    },
    //比牌动画   比牌输      发起比牌人    被比牌人   发起比牌人手牌/被比牌人手牌/发起比牌人手牌类型/被比牌人手牌类型
    PlayPvPAnima(losewxid, initiatorwxid, otherwxid, bgListpai, otherListPai, bgpaixing, otherpaixing) {
        this.Animation_game.node.active = true;
        this.Animation_game.getComponent(cc.Animation).play("1")
        this.PlayPvpCurrent(losewxid, initiatorwxid, otherwxid)
        var self = this;
        setTimeout(function () {
            self.playpvpCardDisplay(losewxid, initiatorwxid, otherwxid, bgListpai, otherListPai, bgpaixing, otherpaixing)
        }, 1000);

        setTimeout(function () {
            self.playpvpAnimaStop(losewxid, initiatorwxid, otherwxid)
        }, 5000);
    },
    playpvpCardDisplay(losewxid, initiatorwxid, otherwxid, bgListpai, otherListPai, bgpaixing, otherpaixing) {
        this.node_playDisplay.active = true;
        if (bgListpai == undefined || otherListPai == undefined) {
            var listCards = [0, 0, 0];
            this.PlayPKOnepokers = this.createPokers(this.node_pvpDisplayCard[0], listCards, 50)
            this.PlayPKTwopokers = this.createPokers(this.node_pvpDisplayCard[1], listCards, 50)
            this.node_playDisplay.getChildByName("spr_xian").active = false;
            this.node_playDisplay.getChildByName("spr_bei").active = false;
        }
        else {
            this.PlayPKOnepokers = this.createPokers(this.node_pvpDisplayCard[0], bgListpai, 50)
            this.PlayPKTwopokers = this.createPokers(this.node_pvpDisplayCard[1], otherListPai, 50)
            this.node_playDisplay.getChildByName("spr_xian").getChildByName("label_pvp").getComponent(cc.Label).string = this.PlayCardType(bgpaixing)
            this.node_playDisplay.getChildByName("spr_bei").getChildByName("label_pvp").getComponent(cc.Label).string = this.PlayCardType(otherpaixing)
        }
    },
    //比牌玩家头像移动
    PlayPvpCurrent(losewxid, initiatorwxid, otherwxid) {

        this.initiator = this.user_node[this.getTableIndex(initiatorwxid)].getPosition();
        this.other = this.user_node[this.getTableIndex(otherwxid)].getPosition();
        var initiatorwxid = this.user_node[this.getTableIndex(initiatorwxid)];
        var otherwxid = this.user_node[this.getTableIndex(otherwxid)];
        var pkinitator = this.node_pkMove[0]
        var pkOther = this.node_pkMove[1]
        this.spriteMoveCardPlay(initiatorwxid, pkinitator, 300)
        this.spriteMoveCardPlay(otherwxid, pkOther, 300)
        for (var i = 0; i < this.user_node.length; i++) {
            if (this.user_node[i].active) {
                this.user_node[i].display = true;
                this.user_node[i].getChildByName("btn_pvp").active = false;
                this.user_node[i].active = false;
            }
        }
        initiatorwxid.getChildByName("spr_handdi").stopAllActions();
        initiatorwxid.active = true;
        otherwxid.active = true;
    },
    //比牌结果
    playpvpAnimaStop(losewxid, initiatorwxid, otherwxid) {
        this.node_playDisplay.active = false;
        this.node_playDisplay.getChildByName("spr_xian").active = true;
        this.node_playDisplay.getChildByName("spr_bei").active = true;
        var initiatorwxid = this.user_node[this.getTableIndex(initiatorwxid)];
        var otherwxid = this.user_node[this.getTableIndex(otherwxid)];
        this.spriteMoveCardPlay(initiatorwxid, this.initiator)
        this.spriteMoveCardPlay(otherwxid, this.other)
        this.Animation_game.node.active = false;
        cc.log("----结束比牌---")

        for (var i = 0; i < this.user_node.length; i++) {
            if (this.user_node[i].display) {
                this.user_node[i].active = true;
            }
        }
        //比牌结算后 关闭动画
        this.playpvpEnd();
    },
    tractorstoggleOn(event, customEventData) {
        this.playClickMusic()
        switch (customEventData) {
            case "lookcard":
                //看牌
                this.OnClickLookCards();
                this.pvpTime = false;
                break;
            case "discard":
                //弃牌
                this.discards();
                this.pvpTime = false;
                break;
            case "thancard":
                //比牌
                this.onclickPlayPvpCard();
                break;
            case "addmoney":
                //加注
                this.GenClip = 2;
                this.pvpTime = false;
                this.OnClickAddMoney(this.AddponitNumArray);
                break;
            case "withnode":
                //跟注
                this.GenClip = 1;
                this.Playwithnode();
                cc.log("--跟注---");
                this.pvpTime = false;
                break;
            case "sike":
                cc.log("---跟到底---");
                this.ONtrusteeship(true);
                break;
        }
    },
    //比牌
    onclickPlayPvpCard() {
        this.pvpTime = true;
        this.node_pvpCard.active = true;
        for (var i = 0; i < this.user_node.length; i++) {
            var user = this.user_node[i];
            if (user.active) {
                var btn_pvp = user.getChildByName("spr_state").getChildByName("label_state").getComponent(cc.Label).string;
                if (btn_pvp == "弃牌" || btn_pvp == "比牌输" || btn_pvp == "准备") {
                }
                else {
                    user.getChildByName("btn_pvp").active = true;
                }
                user.getChildByName("btn_seat").active = false;
            }
        }
    },
    spriteMoveAction: function (wxid, currentmoney, xuhao) {
        this.ClipPool = new cc.NodePool();

        var moneynum = "chip_" + currentmoney;
        this.spr_clipMove[this.getTableIndex(wxid)].getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame(xuhao);
        this.spr_clipMove[this.getTableIndex(wxid)].getChildByName("label_xaizhuNum").getComponent(cc.Label).string = currentmoney;

        for (var i = 0; i < 200; i++) {
            this.ClipPool.put(cc.instantiate(this.spr_clipMove[this.getTableIndex(wxid)]))
        }
        this.nodeclip = this.ClipPool.get();

        this.nodeclip.parent = this.node;
        // 获取筹码起点坐标
        this.nodeclip.x = this.node_nodeclip[this.getTableIndex(wxid)].x;
        // 获取筹码起点坐标
        this.nodeclip.y = this.node_nodeclip[this.getTableIndex(wxid)].y;
        this.startPos = this.nodeclip.getPosition();
        ///随机取值范围
        var endposx = Math.round(Math.random() * 200);
        ///随机取值范围
        var endposy = Math.round(Math.random() * 150 - 100);
        this.node_ClipEndMove.x = this.endpostion.x;
        this.node_ClipEndMove.y = this.endpostion.y;
        this.node_ClipEndMove.x += endposx;
        this.node_ClipEndMove.y += endposy;
        this.endPos = this.node_ClipEndMove.getPosition();
        //获得2点之间的距离  
        let distance = cc.pDistance(this.startPos, this.endPos);
        //计算移动需要话费的时间，时间 = 距离 / 速度  
        let moveTime = distance / 1000;
        cc.log("move = ", this.endPos.x, this.endPos.y);
        //变速移动   
        let moveTo = cc.moveTo(moveTime, this.endPos).easing(cc.easeInOut(3));
        //回调函数  
        let callfunc = cc.callFunc(function () {
            //this.trackLayout.node.active = false;  
        }, this);
        //让sprite移动  
        this.nodeclip.runAction(cc.sequence(moveTo, callfunc));
        this.roomclip.push(this.nodeclip);
    },
    //结算筹码动画
    spriteMoveActionroomEnd: function (wxid) {
        for (var i = 0; i < this.roomclip.length; i++) {

            this.nodeclip = this.roomclip[i];
            this.startPos = this.nodeclip.getPosition();

            this.node_ClipEndMove.x = this.node_nodeclip[this.getTableIndex(wxid)].x;
            this.node_ClipEndMove.y = this.node_nodeclip[this.getTableIndex(wxid)].y;
            this.endPos = this.node_ClipEndMove.getPosition();
            //获得2点之间的距离  
            let distance = cc.pDistance(this.startPos, this.endPos);
            //计算移动需要话费的时间，时间 = 距离 / 速度  
            let moveTime = distance / 400;
            //变速移动   
            let moveTo = cc.moveTo(moveTime, this.endPos).easing(cc.easeInOut(3));
            //回调函数  
            let callfunc = cc.callFunc(function () {
                //this.trackLayout.node.active = false;  
            }, this);
            //让sprite移动  
            this.nodeclip.runAction(cc.sequence(moveTo, callfunc));
        }
    },
    //销毁桌面上的筹码
    DelActionClip() {
        //吟唱筹码
        for (var i = 0; i < this.roomclip.length; i++) {
            this.ClipPool.put(this.roomclip[i])
        }
        this.ClipPool.clear();
        this.roomclip.length = 0;
    },
    //发牌动画
    spriteMoveCardPlay: function (moveStart, moveEnd, time) {
        var nodeclip;
        nodeclip = moveStart;
        this.startPos = moveStart.getPosition();
        this.node_ClipEndMove.x = moveEnd.x;
        this.node_ClipEndMove.y = moveEnd.y;

        this.endPos = this.node_ClipEndMove.getPosition();
        //获得2点之间的距离  
        let distance = cc.pDistance(this.startPos, this.endPos);
        //计算移动需要话费的时间，时间 = 距离 / 速度  
        let moveTime = distance / (600 + time);
        //变速移动   
        let moveTo = cc.moveTo(moveTime, this.endPos).easing(cc.easeInOut(3));
        //回调函数  
        let callfunc = cc.callFunc(function () {
            //this.trackLayout.node.active = false;  
        }, this);
        //让sprite移动  
        nodeclip.runAction(cc.sequence(moveTo, callfunc));
    },

    //暂离消息
    sendForZanLi() {
        var obj = new Object()
        obj.zinetid = cc.globalMgr.msgIds.SUB_S_ZI_ZANLI;
        obj.uid = G.myPlayerInfo.uid;
        this.send(cc.globalMgr.msgIds.SUB_S_ZANLI, obj);
        cc.log("------暂离消息:", obj);
    },

    //房间菜单
    OnClciktopMenu(sub, event) {
        this.playClickMusic()
        switch (event) {
            case "exitroom":
                cc.log("--退出房间--")
                this._gameControl.applyDissolution()
                break;
            case "gohome":
                cc.log("--返回大厅--")
                if (this.FindefAndGlod == 1) {
                    this._gameControl.goldRoomReturnHome(this.isGameStart)
                } else if (this.FindefAndGlod == 2) {
                    // this._gameControl.enterHome()
                    this.sendForZanLi();
                }

                break;
            case "chat":
                cc.log("--聊天--")
                cc.globalMgr.globalFunc.addChatLayer(cmd.MAIN_MSG_ID);
                break;
            case "share":
                cc.log("--分享---")
                cc.log("--this._userlist-----", this._userList)
                this.wxShare("欢乐棋牌炸金花", G.shareHttpServerPath, "房号:" + this._roomNum + this.playMethod, "0", "2")
                break;
            case "EndShare":
                cc.log("--结算分享--")
                this.wxShare("欢乐棋牌", G.shareHttpServerPath, "炸金花结算", "0", "1")
                break;
            case "glod":
                cc.log("--换桌---")
                this.OnClickglodReturn();
                break;
            case "GlodExit":
                cc.log("--金币场离开--")
                this._gameControl.goldRoomReturnHome(this.FindefAndExit)
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
                this.Top_meunExit.getChildByName("top_menu").getChildByName("node_no").active = false;
                this.Top_meunExit.getChildByName("top_menu").getChildByName("node_yes").active = true;

                break;
            case "offtopmeun":
                cc.log("---关闭顶部菜单栏--")

                this.Top_meunExit.getChildByName("top_menu").getChildByName("node_no").active = true;
                this.Top_meunExit.getChildByName("top_menu").getChildByName("node_yes").active = false;
                break;
            case "ruserstart":
                cc.log("--小结算准备按钮--")
                this.onClickReady(false);
                this.node_MinSettle.active = false;
                break;
            case "ruserClose":
                cc.log("---小结算关闭按钮")
                this.OnRuserClose();
                break;
            case "ONtrusteeship":
                cc.log("--托管---")
                this.ONtrusteeship(true);
                break
            case "OFFtrusteeship":
                cc.log("--取消托管---")
                this.ONtrusteeship(false);
                break
            case "copyRoomInfo":
                cc.log("--复制房间信息---")
                this.onClickedCopyRoomInfo();
                break;
        }
    },
    InitUserPosFunc() {
        cc.log("---头像位置归位---")
        for (var i = 0; i < this.user_node.length; i++) {
            this.user_node[i].x = this.UserPosArr[i].x;
            this.user_node[i].y = this.UserPosArr[i].y;
        }
    },
    //复制房号
    onClickedCopyRoomInfo() {
        this.copyString("欢乐棋牌炸金花，房号:" + this._roomNum + this.playMethod)
    },
    //小结算点击关闭后
    OnRuserClose() {
        this.node_MinSettle.active = false;
        this.showReadybtn(true);
    },

    isVipForMe() {
        var userInfo = this.getUserListByWxid(G.myPlayerInfo.wxId);
        return userInfo.isVip;
    },

    // 点击座位节点
    onClickSeat(event, customEventData) {
        this.playClickMusic()
        var userInfo = this.getUserListByWxid(event.target.wxId);
        var isVipForMe = this.isVipForMe();

        switch (customEventData) {
            case "mySeatClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(true, event.target.wxId, userInfo, false, this.FindefAndGlod);
                break;
            }
            case "oneClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this.FindefAndGlod);
                break;
            }
            case "twoClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this.FindefAndGlod);
                break;
            }
            case "threeClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this.FindefAndGlod);
                break;
            }
            case "fourClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this.FindefAndGlod);
                break;
            }
            case "fiftyClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this.FindefAndGlod);
                break;
            }
            case "sixClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this.FindefAndGlod);
                break;
            }

            default:
                break;
        }
    },
    //托管 
    ONtrusteeship(active) {
        //this.meun_node.getChildByName("node_chose").getChildByName("btn_ONtrusteeship").active = !active;
        //this.meun_node.getChildByName("node_chose").getChildByName("btn_OFFtrusteeship").active = active;

        cc.log("--开始托管---")
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_END_TRUSTEESHIP;
        obj.uid = G.myPlayerInfo.uid;
        this.send(cmd.MAIN_MSG_ID, obj)

    },
    //托管状态
    TrusteeshipType(wxid, active) {
        if (wxid == G.myPlayerInfo.wxId) {
            this.meun_node.getChildByName("node_chose").getChildByName("btn_ONtrusteeship").active = !active;
            this.meun_node.getChildByName("node_chose").getChildByName("btn_OFFtrusteeship").active = active;
        }
    },


    //开启倒计时
    startWaitTime(wxid) {
        this._waitTime = 12
        this._waitWxid = wxid
        this.bar_waitTime[this.getTableIndex(this._waitWxid)].progress = 1;
        this.setClockActive(true, wxid)
        this.showWaitTime(this._waitTime, true)
        this.schedule(this.waitTimeCallfunc, 1);
    },
    //关闭倒计时
    stopWaitTime(wxid, act) {
        this.setClockActive(false, wxid)
        this.unschedule(this.waitTimeCallfunc)
    },

    //定时器显示
    showWaitTime(time, active) {
        // this.user_node[this.getTableIndex(this._waitWxid)].getChildByName("sp_clockbg").getChildByName("label_time").getComponent(cc.Label).string = time

    },

    //定时器显示隐藏
    setClockActive(active, wxId) {
        var tempWxid = this._waitWxid
        if (wxId != undefined) {
            tempWxid = wxId
        }
        this.user_node[this.getTableIndex(tempWxid)].getChildByName("sp_clockbg").active = active
        //this.this.bar_waitTime[this.getTableIndex(tempWxid)].active = false;
    },

    //定时器回调
    waitTimeCallfunc(dt) {
        this._waitTime--;
        this.showWaitTime(this._waitTime, true)
        //this._updateProgressBar(this.bar_waitTime[this.getTableIndex(this._waitWxid)], dt)
        if (this._waitTime == 0) {
            this.stopWaitTime(this._waitWxid)
        } else {
            //this._updateProgressBar(this.bar_waitTime[this.getTableIndex(this._waitWxid)], dt)
        }
    },
    //定时器结算间隔
    startWaitCommTime(time) {
        //定时器时间
        this._CommTimt = time;
        this.schedule(this.waitCommTimeFunc, 1);
    },
    //定时器回调结算间隔
    waitCommTimeFunc(dt) {
        this._CommTimt--;
        if (this._CommTimt == 0) {
            //调出结算界面
            this.node_MinSettle.active = true;
            this.showReadybtn(true);
        }
    },
    //通过wxid 查找用户信息
    getUserListByWxid(wxid) {
        for (var i = 0; i < this._userList.length; i++) {
            if (this._userList[i].wxId == wxid) {
                return this._userList[i]
            }
        }
    },
    update(dt) {

        this._updateProgressBar(this.bar_waitTime[this.getTableIndex(this._waitWxid)], dt)
    },
    //出牌定时器
    _updateProgressBar: function (progressBar, dt) {
        var progress = progressBar.progress;
        if (progress < 1.0 && this._pingpong) {
            progress += dt * this.speed;
        }
        else {
            progress -= dt * this.speed;
            this._pingpong = progress <= 0;
        }
        progressBar.progress = progress;
    },
    //关闭窗口
    OnClickClose(sub, event) {
        this.playClickMusic()
        switch (event) {
            case "playpvpclose":
                this.node_pvpCard.active = false;
                for (var i = 0; i < this.user_node.length; i++) {
                    var user = this.user_node[i];
                    if (user.active) {
                        user.getChildByName("btn_seat").active = true;
                        //user.getChildByName("spr_chat").active = true;
                        user.getChildByName("btn_pvp").active = false;
                    }
                }
                break;
        }
    },

    //初始化房间
    clearTable(avitve) {
        //10秒中后，默认开始游戏
        this.node_MinSettle.active = false;
        this.showReadybtn(false);
        for (var i = 0; i < this.user_node.length; i++) {
            var head = this.user_node[i];
            cc.log("---隐藏头像每局刷新---")
        }
        for (var i = 2; i <= 7; i++) {
            var pp = "people" + i;
            this.node_MinSettle.getChildByName(pp).active = false;
        }
        if (avitve) {
            cc.log("--准备手势2---", avitve)
            head.getChildByName("sp_ok").active = false;
        }

    },
    //结算界面时候刷新玩家状态P
    refreshRoom(active) {
        this.meun_node.getChildByName("node_chose").active = active;
        for (var i = 0; i < this.user_node.length; i++) {
            var head = this.user_node[i];
            cc.log("--准备手势3---", active)
            head.getChildByName("sp_ok").active = active;
            head.getChildByName("roomone").active = active;
            head.getChildByName("spe_points").getChildByName("Label").getComponent(cc.Label).string = "0";
            // 倒计时
            head.getChildByName("sp_clockbg").active = active;
            // this.this.bar_waitTime[this.getTableIndex(this._waitWxid)].active = false;
            //玩家状态 显示
            head.getChildByName("spr_state").active = active;
            //比牌
            head.getChildByName("btn_pvp").active = active;
            var cardnode = this.card_node[i];
            cardnode.active = active;
            head.getChildByName("spr_chat").active = false;
            head.getChildByName("spr_handdi").stopAllActions();
        }
        this.GenClip = 0;

        this.node_cardType.active = false;
        this.listwxid = 0;
    },
    //显示结算界面
    showBigResultNode(resultData) {
        // this.scheduleOnce(this.setResultNode(resultData, 1), 3)
        var self = this
        setTimeout(function () {
            self.node_MaxSettle.active = true;
            self.MinSettle(resultData, 1)
        }, 5000);
    },

    MinSettleStart(obj, type) {
        var time = 3;
        this.scheduleOnce(function () {
            this.DelActionClip();
            this.node_MinSettle.active = true;
            this.MinSettle(obj, type)
        }, time)
    },
    PlayCardType(type) {
        var cardType = "";
        if (type == 1)
            cardType = "单牌";
        else if (type == 2)
            cardType = "对子";
        else if (type == 3)
            cardType = "顺子"
        else if (type == 4)
            cardType = "金花"
        else if (type == 5)
            cardType = "同花顺"
        else if (type == 6)
            cardType = "豹子"
        else if (type == 7)
            cardType = "天杀"
        else if (type == 8)
            cardType = "同花天杀"

        return cardType;

    },
    //结算筹码
    minsetClip(obj) {
        for (var i = 0; i < obj.length; i++) {
            //筹码飞向赢家
            if (obj[i].winstatus) {
                this.spriteMoveActionroomEnd(obj[i].wxid);
            }
            this.node_CardMove[i].active = false;
            //this.spriteMoveCardPlay(this.node_CardMove[i], this.node_cardHome)
            this.node_CardMove[i].x = this.node_cardHome.x;
            this.node_CardMove[i].y = this.node_cardHome.y;
        }
    },
    //金币场继续
    OnClickglodReturn() {
        cc.log("--金币场继续--")
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_GLOD_RETURN;
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //小结算
    MinSettle(obj, type) {
        this.clearSendCards()
        this.node_MinSettle.getChildByName("spr_bg").getChildByName("label_time").getComponent(cc.Label).string = "时间：" + obj[0].bgdate;
        this.node_MaxSettle.getChildByName("spr_bg").getChildByName("label_time").getComponent(cc.Label).string = "时间：" + obj[0].bgdate;
        var peopleNum = obj.length;
        var pp = "people" + peopleNum;
        this.repeopleNum = pp;
        //区分大结算还是小结算
        var nodex;
        if (type == 1) {
            nodex = this.node_MaxSettle;
        } else {
            nodex = this.node_MinSettle;
        }
        for (var i = 0; i < obj.length; i++) {
            var win = nodex.getChildByName("win");
            var lost = nodex.getChildByName("lost");
            var ppNum = "people" + i;
            nodex.getChildByName(pp).active = true;
            var people = nodex.getChildByName(pp)
            var wxid = people.getChildByName(ppNum).getChildByName("label_id");
            var image = people.getChildByName(ppNum).getChildByName("spr_head");
            var spr_win = people.getChildByName(ppNum).getChildByName("spr_win");
            var spr_lost = people.getChildByName(ppNum).getChildByName("spr_lost");
            var baseNum = people.getChildByName(ppNum).getChildByName("label_base");

            wxid.getComponent(cc.Label).string = "id:" + obj[i].wxid;


            //大结算
            if (type) {
                cc.log("---大结算--")
                if (obj[i].zongdefen > 0) {
                    if (G.myPlayerInfo.wxId == obj[i].wxid) {
                        win.active = true;
                        lost.active = false;
                    }
                    else {
                        win.active = false;
                        lost.active = true;
                    }
                    spr_win.active = true;
                    spr_lost.active = false;
                } else {
                    if (G.myPlayerInfo.wxId == obj[i].wxid) {
                        win.active = false;
                        lost.active = true;
                    }
                    spr_win.active = false;
                    spr_lost.active = true;
                }
            }
            else {
                cc.log("---小结算--")
                if (obj[i].winstatus) {
                    spr_win.active = true;
                    spr_lost.active = false;
                    if (G.myPlayerInfo.wxId == obj[i].wxid) {
                        win.active = true;
                        lost.active = false;
                    }
                    else {
                        win.active = false;
                        lost.active = true;
                    }
                } else {
                    spr_win.active = false;
                    spr_lost.active = true;
                    if (G.myPlayerInfo.wxId == obj[i].wxid) {
                        win.active = false;
                        lost.active = true;
                    }
                }
            }
            //小结算

            var loadHead = function (head) {
                cc.loader.load({ url: obj[i].image, type: 'png' }, function (err, tex) {
                    head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                });
            }
            loadHead(image)
            if (type == null) {
                var roomid = "房间：" + this._roomNum + "局数" + obj[0].xiaojiesuancount + "/" + this._roomJuNum;
                this.node_MinSettle.getChildByName("spr_bg").getChildByName("label_info").getComponent(cc.Label).string = roomid;
                baseNum.getComponent(cc.Label).string = this.FormatGold(obj[i].zongfen)
                var label_info = people.getChildByName(ppNum).getChildByName("spr_di").getChildByName("label_info");
                var btn_startGame = nodex.getChildByName("node_Find");
                var btn_GlodReturn = nodex.getChildByName("node_glod");
                if (this.FindefAndGlod == 1) {
                    btn_startGame.active = false;
                    btn_GlodReturn.active = true;
                    this.GlodState = false;
                }
                else if (this.FindefAndGlod == 2) {
                    btn_startGame.active = true;
                    btn_GlodReturn.active = false;
                }
                if (obj[i].xiaojiesuancount == this._roomJuNum) {
                    btn_startGame.active = false;
                }
                label_info.getComponent(cc.Label).string = this.PlayCardType(obj[i].type);
                this.TabelRoomCardDestroy(obj[i].wxid, people.getChildByName(ppNum).getChildByName("node_card"), obj[i].listpai)
                var disCard = people.getChildByName(ppNum).getChildByName("spr_di").getChildByName("label_DisCard");
                //isQiPai
                //if (obj[i].isQiPai && G.myPlayerInfo.wxId == obj[i].wxid) {
                if (obj[i].isQiPai) {
                    cc.log("--弃牌了--", obj[i].wxid)
                    disCard.active = true;
                } else {
                    cc.log("--没有弃牌--", obj[i].wxid)
                    disCard.active = false;
                }


            } else {
                baseNum.getComponent(cc.Label).string = this.FormatGold(obj[i].zongdefen)
            }
        }
    },
    //桌面上的牌创建销毁
    TabelRoomCardDestroy(wxid, node, listpai) {
        // this.clearSendCards(wxid);
        var pokerlist = this.createPokers(node, listpai, 50)
        cc.log(" fuck poker list ", pokerlist)
        this.RepeoplePokers[this.getTableIndex(wxid)] = pokerlist

    },

    //清空玩家出牌的牌
    clearSendCards() {
        for (var i = 0; i < this.RepeoplePokers.length; i++) {
            var pokerLength = this.RepeoplePokers[i].length
            if (pokerLength != 0) {
                for (var j = 0; j < pokerLength; j++) {
                    cc.log("i " + i + " j " + j)
                    this.RepeoplePokers[i][j].getComponent("CommPoker").reset()
                    this.PokerCardsPool.put(this.RepeoplePokers[i][j])
                }
            }
            this.RepeoplePokers[i] = []
        }
    },
    RoomWheel(Num) {
        this.top_node.getChildByName("node_wheel").getChildByName("label_wheel").getComponent(cc.Label).string = "轮数：" + Num;
    },
    //播放快捷聊天音效
    playChatSound(index, wxid) {
        var tempIndex = index - 1
        var sex = this.getUserListByWxid(wxid).sex
        if (sex == "1") {
            this.playEffectMusic("resources/game/tractors/tractors_sound/chat/man/man_chat_" + tempIndex + ".mp3", false)
        } else {
            this.playEffectMusic("resources/game/tractors/tractors_sound/chat/woman/woman_chat_" + tempIndex + ".mp3", false)
        }
    },
    //播放背景音乐
    playTractorBgMusic() {
        this.gameBgMusicId = this.playBgMusic("resources/game/tractors/tractors_sound/bg/bgMain.mp3", true)
    },
    //播放音效
    playerSound(soundName, wxid) {
        var sex = this.getUserListByWxid(wxid).sex
        if (sex == "1") {
            this.playEffectMusic("resources/game/tractors/tractors_sound/man/" + soundName + ".mp3", false)
        } else {
            this.playEffectMusic("resources/game/tractors/tractors_sound/woman/" + soundName + ".mp3", false)
        }
    },
    //看牌音效 音效数量 微信id 音效名称 
    playsoundCard(wxid, soundName, soundConut) {
        var round = Math.round(Math.random() * soundConut);
        if (round == 0) {
            switch (soundName) {
                case "lookCard":
                    this.playerSound("kanpai", wxid)
                    break;
                case "bipai":
                    this.playerSound("bipai", wxid)
                    break;
                case "fangqi":
                    this.playerSound("buwanla", wxid)
                    break;
                case "quanya":
                    this.playerSound("quanyaniganme", wxid)
                    break;
                case "tuoguan":
                    this.playerSound("gendaodila", wxid)
                    break;
                case "zhunbei":
                    this.playerSound("fapai", wxid)
                    break;
                case "addMoney":
                    this.playerSound("jiazhu", wxid)
                    break;
                case "GenMoney":
                    this.playerSound("genzhu", wxid)
                    break;
            }
        } else if (round == 1) {
            switch (soundName) {
                case "lookCard":
                    this.playerSound("wokanpailou", wxid)
                    break;
                case "bipai":
                    this.playerSound("henibiyibi", wxid)
                    break;
                case "fangqi":
                    this.playerSound("wofangqi", wxid)
                    break;
                case "quanya":
                    this.playerSound("yaowanjiuwandade", wxid)
                    break;
                case "tuoguan":
                    this.playerSound("nigenwojiugen", wxid)
                    break;
                case "zhunbei":
                    this.playerSound("kuaifapai", wxid)
                    break;
                case "addMoney":
                    this.playerSound("wozaijiadian", wxid)
                    break;
                case "GenMoney":
                    this.playerSound("wohaigen", wxid)
                    break;
            }

        } else if (round = 2) {
            switch (soundName) {
                case "GenMoney":
                    this.playerSound("wohaiyaogen", wxid)
                    break;
            }
        }
        else if (round = 3) {
            switch (soundName) {
                case "GenMoney":
                    this.playerSound("wozaigen", wxid)
                    break;
            }
        }
        else {
            cc.log("--没有音效--")
        }
    },
    //下注类型跟音效
    playSoundType(wxid, type) {
        if (type == 1) {
            this.InforGenClip(wxid, "跟注", true)
            this.playsoundCard(wxid, "GenMoney", 4)

        } else if (type == 2) {
            this.InforGenClip(wxid, "加注", true)
            this.playsoundCard(wxid, "addMoney", 2)
        }
    },
    //设置离开房间按钮是否可以点击
    setReturnHomeBtnCanTouch(bCanTouch) {
        var btn_returnHome = this.Top_meunExit.getChildByName("top_menu").getChildByName("node_yes").getChildByName("btn_fanhui");
        btn_returnHome.getComponent(cc.Button).interactable = bCanTouch
        if (bCanTouch) {
            btn_returnHome.opacity = 255
        }
        else {
            btn_returnHome.opacity = 120
        }
        this.GlodExit(bCanTouch);
    },
    //金币场离开房间
    GlodExit(bCanTouch) {
        if (bCanTouch) {
            cc.log("--离开房间---")
            this.FindefAndExit = false;
        } else {
            cc.log("--解散房间")

            this.FindefAndExit = true;
        }
    },

    btnOnLocation() {
        cc.log("点击了位置");
    },
    //下注总数
    OnDownClipAllShow(allZhu, active) {
        this.meun_node.getChildByName("label_xiaAll").active = active
        this.meun_node.getChildByName("label_xiaAll").getComponent(cc.Label).string = "总注: " + allZhu
    },

    //清除比牌按钮
    OnClearPVPBtn() {
        this.node_pvpCard.active = false;
        for (var i = 0; i < this.user_node.length; i++) {
            var user = this.user_node[i];
            if (user.active) {
                user.getChildByName("btn_seat").active = true;
                //user.getChildByName("spr_chat").active = true;
                user.getChildByName("btn_pvp").active = false;
            }
        }
    },

    //隐藏所有玩家手牌
    closeAllPlayerCards(id) {
        var len = this.myPokers.length;
        cc.log("-------查看手牌列表：", this.myPokers);
        for (var i = 0; i < len; i++) {
            var curLen = this.myPokers[this.getTableIndex(id)].length;
            var curObject = this.myPokers[this.getTableIndex(id)];
            if (curLen > 0) {
                for (var k = 0; k < curLen; k++) {
                    curObject[k].active = false;
                    cc.log("------关闭手牌");
                }
            }
        }
    },

    //显示所有玩家手牌
    openAllPlayerCards() {
        var len = this.myPokers.length;
        cc.log("-------查看手牌列表：", this.myPokers);
        for (var i = 0; i < len; i++) {
            var curLen = this.myPokers[i].length;
            var curObject = this.myPokers[i];
            if (curLen > 0) {
                for (var k = 0; k < curLen; k++) {
                    curObject[k].active = true;
                    cc.log("------打开手牌");
                }
            }
        }
    },

    onDestroy() {
        //销毁对象池
        this.PokerCardsPool.clear()
        //停止播放音乐
        cc.audioEngine.stopAll()

        this.uneventRegist(this)
        this.unregist(this)
    }


});
