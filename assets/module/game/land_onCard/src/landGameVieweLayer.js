//by yky
var GameFrame = require("GameFrame")
var cmd = require("CMD_land")
var comm = require("Comm")
var MsgIds = require("MsgIds")
var gameLogic = require("land_gameLogic")
cc.Class({
    extends: comm,

    properties: {
        game_node: {
            default: null,
            type: cc.Node
        },
        top_node: {
            default: null,
            type: cc.Node
        },
        addScore_node: {
            default: null,
            type: cc.Node
        },
        sendCard_node: {
            default: null,
            type: cc.Node
        },
        start_menu_node: {
            default: null,
            type: cc.Node
        },
        top_cards: {
            default: [],
            type: cc.Node
        },
        user_node: {
            default: [],
            type: cc.Node
        },
        play_label: {
            default: null,
            type: cc.Label
        },
        poker_big: {
            default: null,
            type: cc.Prefab
        },
        poker_mid: {
            default: null,
            type: cc.Prefab
        },
        poker_min: {
            default: null,
            type: cc.Prefab
        },
        poker_setting: {
            default: null,
            type: cc.Prefab
        },
        card_node: {
            default: [],
            type: cc.Node
        },
        myCard_node: {
            default: null,
            type: cc.Node
        },
        //回放其他人的手牌
        leftCard_node: {
            default: null,
            type: cc.Node
        },
        rightCard_node: {
            default: null,
            type: cc.Node
        },
        top_menu_bg_sp: {
            default: null,
            type: cc.Sprite
        },
        Ready_btn: {
            default: null,
            type: cc.Button
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        ResultAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        addScore_btn: {
            default: [],
            type: cc.Button
        },
        tips_label: {
            default: null,
            type: cc.Label
        },
        antispring_animation: {
            default: null,
            type: cc.Animation
        },
        aircraft_Animation: {
            default: null,
            type: cc.Animation
        },
        chuntian_animation: {
            default: null,
            type: cc.Animation
        },
        deepfried_animation: {
            default: null,
            type: cc.Animation
        },
        evenpair_animation: {
            default: null,
            type: cc.Animation
        },
        shunzi_animation: {
            default: null,
            type: cc.Animation
        },
        zhadan_animation: {
            default: null,
            type: cc.Animation
        },
        result_node: {
            default: null,
            type: cc.Node
        },
        scoreMultipleLabel: {
            default: null,
            type: cc.Label
        },
        myPokerTouch_node: {
            default: null,
            type: cc.Node
        },
        voice_btn: {
            default: null,
            type: cc.Button
        },
        btn_showTopMenu: {
            default: [],
            type: cc.Button
        },
        bg_mask: {
            default: null,
            type: cc.Node
        },
        big_result_node: {
            default: null,
            type: cc.Node
        },
        btn_wxShare: {
            default: null,
            type: cc.Button
        },
        btn_Invitation: {
            default: null,
            type: cc.Button
        },
        btn_changeTable: {
            default: null,
            type: cc.Node
        },
        sprFrame_lord: {
            default: null,
            type: cc.SpriteFrame,
        },
        sprFrame_farmer: {
            default: null,
            type: cc.SpriteFrame,
        },
        chat_node: {
            default: null,
            type: cc.Node
        },
        // addBei_node: {
        //     default: null,
        //     type: cc.Node
        // },
        rePlaycontrol: {
            default: null,
            type: cc.Node,
        },
        //剩余按钮
        btn_Residue: {
            default: null,
            type: cc.Node,
        },
        //记牌器节点
        node_JiPaiQi: {
            default: null,
            type: cc.Node,
        },
        bgSpr: cc.Sprite, //桌布
        bgSprFrame: [cc.SpriteFrame], //桌布数组
        bgpaione: cc.Sprite, //0玩家牌背
        bgpaitow: cc.Sprite, //1玩家牌背
        bgpaithree: cc.Sprite, //2玩家牌背
        paiSprFrame: [cc.SpriteFrame],//牌背数组
    },
    onLoad() {
        if (G.isRePlay == true) {
            this.rePlaycontrol.active = true
        }
        else {
            this.rePlaycontrol.active = false
        }
        //初始化公有参数
        this.initPublicParm()

        //创建手牌扑克对象池
        this.PokerCardsPool = new cc.NodePool();
        for (var i = 0; i < 30; i++) {
            var poke = cc.instantiate(this.poker_big);
            poke.setScale(0.85);
            this.PokerCardsPool.put(poke)
        }

        //创建右边手牌扑克对象池
        this.rightPokerCardsPool = new cc.NodePool();
        for (var i = 0; i < 30; i++)
            this.rightPokerCardsPool.put(cc.instantiate(this.poker_mid))

        //创建左边手牌扑克对象池
        this.leftPokerCardsPool = new cc.NodePool();
        for (var i = 0; i < 30; i++)
            this.leftPokerCardsPool.put(cc.instantiate(this.poker_mid))

        //创建三张扑克对象池
        this.PokerMinPool = new cc.NodePool();
        for (var i = 0; i < 10; i++)
            this.PokerMinPool.put(cc.instantiate(this.poker_min))

        //创建发牌扑克对象池
        this.PokerMidPool = new cc.NodePool();
        for (var i = 0; i < 50; i++)
            this.PokerMidPool.put(cc.instantiate(this.poker_mid))
        cc.log(G.isCoinRoom, "G.isCoinRoom=============")
        if (G.isCoinRoom == true) {
            this.chat_node.active = false
        }
        else {
            this.chat_node.active = true
        }
        //隐藏加倍
        //this.hideAddBeiBtn()
    },

    start() {
        this.playLandBgMusic()
        this.addTouchEvent()
    },

    //隐藏背景遮罩
    hideMaskBg() {
        this.bg_mask.active = false
    },

    //设置金币场还是房卡场，金币显示
    setGoldRoomOrCardRoom(isGold) {
        var img_base_info = this.top_node.getChildByName("img_base_info")
        var label_play = this.top_node.getChildByName("label_play")

        img_base_info.active = !isGold
        label_play.active = !isGold
        this.btn_Invitation.node.active = !isGold

        //金币场显示按钮
        this.btn_changeTable.active = isGold
        cc.log(isGold, "isGold========================")
        //金币场隐藏 解散按钮
        if (isGold == true) {
            G.isCoinRoom = true;        //金币场
            var btn_dissolution = this.top_menu_bg_sp.node.getChildByName("layout_btn").getChildByName("btn_dissolution")
            // var btn_return_home = this.top_menu_bg_sp.node.getChildByName("btn_return_home")
            // var btn_set = this.top_menu_bg_sp.node.getChildByName("btn_set")
            btn_dissolution.active = false
            // btn_return_home.y = 70
            // btn_set.y = 0
        } else {
            G.isCoinRoom = false;
            var btn_leaveRoom = this.top_menu_bg_sp.node.getChildByName("layout_btn").getChildByName("btn_return_home");
            var btn_location = this.top_menu_bg_sp.node.getChildByName("layout_btn").getChildByName("btn_location");
            btn_leaveRoom.active = false;
            // btn_location.active = true;
        }
        this._isGold = isGold
    },

    //设置离开房间按钮是否可以点击
    setReturnHomeBtnCanTouch(bCanTouch) {
        var btn_returnHome = this.top_menu_bg_sp.node.getChildByName("btn_return_home")
        btn_returnHome.getComponent(cc.Button).interactable = bCanTouch
        if (bCanTouch) {
            btn_returnHome.opacity = 255
        }
        else {
            btn_returnHome.opacity = 120
        }
    },

    //设置换桌按钮是否可以点击
    setCopyBtnCanTouch(bCanTouch) {
        var btn_copy = this.start_menu_node.getChildByName("btn_copy")
        btn_copy.getComponent(cc.Button).interactable = bCanTouch
        if (bCanTouch) {
            btn_copy.active = true
        }
        else {
            btn_copy.active = false
        }
    },

    //设置换桌按钮是否可以点击
    setChangeTableBtnCanTouch(bCanTouch) {
        this.btn_changeTable.getComponent(cc.Button).interactable = bCanTouch
        if (bCanTouch) {
            this.btn_changeTable.active = true
        }
        else {
            this.btn_changeTable.active = false
        }
    },

    //初始化公有参数
    initPublicParm() {
        this._userList = {}
        this._maxCallScore = -1
        this.myPokers = []              //我的手牌数据
        this.leftPokers = []            //左边手牌数据
        this.rightPokers = []           //右边手牌数据
        this.threePokers = []           //三张牌数据
        this.sendPokers = [[], [], []]    //三个玩家出的牌
        this.saveTipsPokers = {}        //保存提示扑克列表
        this.tipsIndex = 0              //提示
        this._gameStart = false         //游戏是否开始
        this._isGold = false            //判断是否是金币场
        this._landWxId = 0
        this.isShowCardNum = false      //是否显示剩余牌数
        //初始化桌布
        var index = cc.sys.localStorage.getItem("GameLayerBgindex");
        if (index != null) {
            this.bgSpr.spriteFrame = this.bgSprFrame[index];
        }

        //初始化牌面
        var index = cc.sys.localStorage.getItem("GameLayerBgpai");
        if (index != null) {
            this.bgpaione.spriteFrame = this.paiSprFrame[index];
            this.bgpaitow.spriteFrame = this.paiSprFrame[index];
            this.bgpaithree.spriteFrame = this.paiSprFrame[index];
        }
    },

    //设置游戏是否开始
    setGameIsStart(bStart) {
        this._gameStart = bStart
    },

    //初始化桌面
    clearTable() {
        cc.log("初始化桌面")
        if (G.isRePlay == true) {
            this.showReadybtn(false)
        }
        //移除三张底牌
        this.clearThreePokers()
        //移除所有叫分
        this.hideAllPlayerScore()
        //移除自己的手牌
        var test = []
        this.refreshMyCards(test)
        //隐藏按钮
        this.showSendCardMenu(G.myPlayerInfo.wxId, false)
        this.showCallLandMenu(false);
        if (G.isRePlay == true) {
            this.showReadybtn(false)
        }
        //移除叫分
        for (var i = 0; i < cmd.playerCount; i++) {

            //清空桌面所有的牌
            var pokerLength = this.sendPokers[i].length
            if (pokerLength != 0) {
                for (var j = 0; j < pokerLength; j++) {
                    this.sendPokers[i][j].getComponent("Land_CommPoker").reset()
                    this.PokerMidPool.put(this.sendPokers[i][j])
                }
                this.sendPokers[i] = []
            }
            //移除地主标志
            //this.user_node[i].getChildByName("sp_land").active = false
            // this.showLandImg(this._userList[i].wxId, false)
            //移除不出提示
            this.user_node[i].getChildByName("sp_operation").active = false
            // this.showNotSendSp(this._userList[i].wxId, false)
            //清空警告
            // this.showEarnTips(this._userList[i].wxId, false)
            this.user_node[i].getChildByName("sp_warn").active = false
            //清空剩余牌
            // this.showSurplusCardNums(this._userList[i].wxId, false)
            this.user_node[i].getChildByName("spr_cardnumbg").active = false
        }

        //移除提示
        this.showTipsLabel("", false)
        //移除结算界面
        this.showResultNode(false)
        this._maxCallScore = -1
        this.saveTipsPokers = {}
        this.tipsIndex = 0
    },
    //下一局初始化桌面
    nextClearTable() {
        cc.log("下一局初始化桌面")
        if (G.isRePlay == true) {
            this.showReadybtn(false)
        }
        //移除三张底牌
        this.clearThreePokers()
        //移除所有叫分
        this.hideAllPlayerScore()
        //移除自己的手牌
        var test = []
        this.refreshMyCards(test)
        //隐藏按钮
        this.showSendCardMenu(G.myPlayerInfo.wxId, false)
        this.showCallLandMenu(false);
        //移除叫分
        for (var i = 0; i < cmd.playerCount; i++) {
            //清空桌面所有的牌
            var pokerLength = this.sendPokers[i].length
            if (pokerLength != 0) {
                for (var j = 0; j < pokerLength; j++) {
                    this.sendPokers[i][j].getComponent("Land_CommPoker").reset()
                    this.PokerMidPool.put(this.sendPokers[i][j])
                }
                this.sendPokers[i] = []
            }
            //移除不出提示
            this.user_node[i].getChildByName("sp_operation").active = false
            // this.showNotSendSp(this._userList[i].wxId, false)
            //清空警告
            // this.showEarnTips(this._userList[i].wxId, false)
            this.user_node[i].getChildByName("sp_warn").active = false
            //移除加倍
            this.user_node[i].getChildByName("spr_jiabei").active = false;
            //清空剩余牌
            // this.showSurplusCardNums(this._userList[i].wxId, false)
            this.user_node[i].getChildByName("label_cardnumbers").active = false
        }
        //移除提示
        this.showTipsLabel("", false)
        //移除结算界面
        this.showResultNode(false)
        this._maxCallScore = -1
        this.saveTipsPokers = {}
        this.tipsIndex = 0
    },
    //移除三张底牌
    clearThreePokers() {
        for (var i = 0; i < this.threePokers.length; i++) {
            this.threePokers[i].getComponent("Land_CommPoker").reset()
            this.PokerMinPool.put(this.threePokers[i])
        }
    },

    //刷新倍数底分
    refreshBaseScore(baseScore, multipleScore) {
        this.scoreMultipleLabel.getComponent(cc.Label).string = multipleScore
    },

    //更新局数
    updateGamesNumber(gamesNumer, gamesCount) {
        var ruleStr = "局数:" + gamesNumer + "/" + gamesCount
        //玩法
        this.play_label.string = ruleStr
    },

    // //更新规则
    // updateBaseinfo(obj) {
    //     this._rule = obj
    //     this.roomid_label.string = obj.roomId
    // },
    //结束回放回到大厅
    endRePlay() {
        this._gameControl.enterHomeEvent()
    },
    //显示提示信息
    showTipsLabel(tipString, active) {
        this.tips_label.getComponent(cc.Label).string = tipString
        this.tips_label.node.active = active
        if (active == true) {
            this.tips_label.node.opacity = 255
            var action = cc.fadeOut(1.0);
            this.tips_label.node.runAction(action);
        }
    },

    //存储个人信息
    saveUserinfo(obj) {
        this._userList = obj
    },
    //更新玩家信息
    updateUsersinfo(obj) {
        cc.log(obj, G.isCoinRoom, "obj--------------------")
        this._userList = obj
        for (var i = 0; i < this.user_node.length; i++)
            this.user_node[i].active = false
        for (var i = 0; i < obj.length; i++) {
            this.updateUserItem(this.user_node[this.getTableIndex(obj[i].wxId)], obj[i])
            this.setNodeWxId(this.user_node[this.getTableIndex(obj[i].wxId)], obj[i].wxId);
        }
    },

    // 给座位节点设置wxId属性
    setNodeWxId(seatNode, wxId) {
        seatNode.wxId = wxId;
    },

    //更新个人基本信息
    updateUserItem(head, obj) {
        cc.log(obj, "个人信息")
        head.name = obj.wxId + ""
        head.active = true
        var headImage = ""

        // head.getChildByName("label_score").getComponent(cc.Label).string = this.FormatGoldFormatGold(obj.lebi);
        head.getChildByName("sp_owner").active = false;
        if (G.isCoinRoom == true) {
            if (obj.sex == 1 || obj.sex == "男") {
                headImage = G.nanImage
            }
            else {
                headImage = G.nvImage
            }
        }
        else {
            head.getChildByName("label_name").getComponent(cc.Label).string = this.FormatName(obj.name);
            headImage = obj.image
        }
        cc.log(G.isCoinRoom, headImage, "headImage=======================")
        cc.loader.load({ url: headImage, type: 'png' }, function (err, tex) {
            head.getChildByName("mask_head").getChildByName("sp_head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
        });
        head.getChildByName("sp_callScore").active = false;
        head.getChildByName("sp_clockbg").active = false;
        head.getChildByName("sp_land").active = false;
        head.getChildByName("sp_landNong").active = false;
        cc.log("隐藏地主标志")
        head.getChildByName("sp_ok").active = false;
        head.getChildByName("spr_jiabei").active = false;
        head.getChildByName("sp_operation").active = false;
        head.getChildByName("label_cardnumbers").active = false;
        head.getChildByName("sp_warn").active = false

        if (obj.isVip) {
            head.getChildByName("label_name").color = new cc.Color(255, 0, 0);
        }
    },

    //判断玩家是否是房主
    judegeUserIsRoomOwner(ownerId) {
        for (var i = 0; i < this._userList.length; i++) {
            if (ownerId == this._userList[i].wxId) {
                this.user_node[this.getTableIndex(ownerId)].getChildByName("sp_owner").active = true;
            }
        }

        //判断玩家是否是房主，如果是房主，玩家不能离开房间
        // if(ownerId == G.myPlayerInfo.wxId)
        // {
        //     this.setReturnHomeBtnCanTouch(false)
        // }
    },

    //更新玩家分数
    updateUserScore(data) {
        for (var i = 0; i < data.length; i++) {
            this.user_node[this.getTableIndex(data[i].wxid)].getChildByName("label_score").getComponent(cc.Label).string = this.FormatGold(data[i].fenshu)
        }
    },
    //所有玩家准备隐藏
    allPlayerReady(active) {
        for (var i = 0; i < cmd.playerCount; i++) {
            this.playerReady(this._userList[i].wxId, active)
        }
    },

    //玩家准备
    playerReady(wxId, active) {
        this.user_node[this.getTableIndex(wxId)].getChildByName("sp_ok").active = active
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

    //游戏刚开始剩余派
    setGameStartSurplusCardNums() {
        for (var i = 0; i < cmd.playerCount; i++) {
            this.setSurplusCardNums(this._userList[i].wxId, 17)
        }
    },

    //剩余牌隐藏
    showSurplusCardNums(wxid, active) {
        this.user_node[this.getTableIndex(wxid)].getChildByName("label_cardnumbers").active = active
    },

    //刚抢完地主剩余牌
    setLandSurplusCardNums(landwxid) {
        if (this.isShowCardNum == false) {
            this.hideCardNum()
        }
        else {
            for (var i = 0; i < cmd.playerCount; i++) {
                if (landwxid == this._userList[i].wxId) {
                    this.setSurplusCardNums(landwxid, 20)
                } else {
                    this.setSurplusCardNums(this._userList[i].wxId, 17)
                }
            }
        }

    },
    //是否显示剩余牌数
    isShowCardNums(cardNums) {
        cc.log(" //是否显示剩余牌数:::: ", cardNums)
        this.isShowCardNum = cardNums;
    },
    hideCardNum() {
        if (this.isShowCardNum == false) {
            cc.log(cmd.playerCount, "cmd.playerCount=========")
            for (var i = 0; i < cmd.playerCount; i++) {
                cc.log(this._userList[i].wxId, "landwxid=============")
                this.user_node[this.getTableIndex(this._userList[i].wxId)].getChildByName("label_cardnumbers").active = false
            }
        }
    },
    //剩余牌
    setSurplusCardNums(wxid, cardsNum) {
        cc.log(this.isShowCardNum, "this.isShowCardNum=============")
        if (this.isShowCardNum == false) {
            this.hideCardNum()
        }
        else {
            if (cardsNum > 0 && cardsNum < 3) {
                this.showEarnTips(wxid, true)
                this.playerSound("remain" + cardsNum, wxid)
            }
            this.user_node[this.getTableIndex(wxid)].getChildByName("label_cardnumbers").active = true
            this.user_node[this.getTableIndex(wxid)].getChildByName("label_cardnumbers").getComponent(cc.Label).string = "剩余:" + cardsNum
        }

    },

    //隐藏显示警告
    showEarnTips(wxid, active) {
        this.user_node[this.getTableIndex(wxid)].getChildByName("sp_warn").active = active
    },
    //隐藏所有警告
    showEarnTipsAll(active) {
        for (var i = 0; i < cmd.playerCount; i++) {
            this.showEarnTips(this._userList[i].wxId, false)
        }
    },
    //保存提示手牌列表数据
    saveTipsPokersList(tipsPokers) {
        this.saveTipsPokers = tipsPokers
        this.tipsIndex = 0
    },
    //初始化提示手牌列表数据
    initTipsPokersList() {
        this.saveTipsPokers = []
        this.tipsIndex = 0
    },

    //设置所有的手牌为不选择状态
    setAllMyPokerNotSelect() {
        // cc.log("setAllMyPokerNotSelect")
        for (var i = 0; i < this.myPokers.length; i++) {
            var myPoker = this.myPokers[i].getComponent("Land_CommPoker")
            myPoker.unselected()
        }
    },

    //提示管牌
    promptSendCards(PokerLists, index) {
        cc.log("promptSendCards ", index)
        var PokerList = PokerLists[index].listguanpai
        this.setAllMyPokerNotSelect()
        for (var i = 0; i < PokerList.length; i++) {
            for (var j = 0; j < this.myPokers.length; j++) {
                var poker = PokerList[i]
                var myPoker = this.myPokers[j].getComponent("Land_CommPoker")
                if (poker.v == myPoker.pokerValue && poker.h == myPoker.pokerColor) {
                    myPoker.doselect()
                    break
                }
            }
        }
    },

    //播放特效
    playAnimation(index) {
        cc.log("playAnimation ", index)
        if (index == 0 || index >= 6) return
        var animationName = ["liandui", "feiji", "shunzi", "zhadan", "wangzha"]
        var soundName = ["", "s_feiji", "s_shunzi", "s_zhadan", "s_huojian"]
        if (index != 1)
            this.playSound(soundName[index - 1])

        var game_animations = [this.evenpair_animation, this.aircraft_Animation, this.shunzi_animation, this.zhadan_animation, this.deepfried_animation]
        var animation = game_animations[index - 1]

        animation.node.active = true
        animation.getComponent(cc.Animation).play()
        // 设置动画的监听事件
        animation.on('finished', function () {
            cc.log("finished")
            animation.node.active = false
        }, this)

        if (index - 1 == 3 || index - 1 == 4) {
            this.boomCanvesAction()
        }
    },

    //炸弹晃动屏幕
    boomCanvesAction() {
        var moveAction = cc.sequence(cc.moveTo(0.1, cc.p(this.node.x - 20, this.node.y)), cc.moveTo(0.1, cc.p(this.node.x + 40, this.node.y)), cc.moveTo(0.1, cc.p(this.node.x - 30, this.node.y)), cc.moveTo(0.1, cc.p(this.node.x + 30, this.node.y)), cc.moveTo(0.1, cc.p(0, 0)))
        var gameLayer = cc.find("Canvas/gameLayer")
        gameLayer.runAction(moveAction)
    },

    //播放春天
    playSpringAnimation(resultData) {

        cc.log("播放春天")
        var isSpring = false
        for (var i = 0; i < 3; i++) {
            if (G.myPlayerInfo.wxId == resultData[i].wxid)
                isSpring = resultData[i].ischuntian
        }
        if (isSpring) {
            cc.log("播放春天动画")
            this.chuntian_animation.node.active = true
            this.chuntian_animation.getComponent(cc.Animation).play()
            // 设置动画的监听事件
            this.chuntian_animation.on('finished', function () {
                cc.log("finished")
                this.chuntian_animation.node.active = false
            }, this)
        }
    },

    //播放反春
    playNotSpringAnimation(resultData) {
        cc.log("播放反春天")
        var isNotSpring = false
        for (var i = 0; i < 3; i++) {
            if (G.myPlayerInfo.wxId == resultData[i].wxid)
                isNotSpring = resultData[i].isfanchun
        }
        if (isNotSpring) {
            cc.log("播放反春")
            this.antispring_animation.node.active = true
            this.antispring_animation.getComponent(cc.Animation).play()
            // 设置动画的监听事件
            this.antispring_animation.on('finished', function () {
                cc.log("finished")
                this.antispring_animation.node.active = false
            }, this)
        }
    },

    // //复制房号
    // onClickedCopyRoomInfo() {
    //     this.copyString("趣玩斗地主，房号:" + this._rule.roomId + " 局数: " + this._rule.jushu)
    // },

    //点击显示上层 按钮
    onClickedShowTopMenu() {

        if (this.top_menu_bg_sp.node.active == true) {
            this.top_menu_bg_sp.node.active = false
            this.btn_showTopMenu[0].node.active = true
            this.btn_showTopMenu[1].node.active = false
        }
        else {
            this.top_menu_bg_sp.node.active = true
            this.btn_showTopMenu[0].node.active = false
            this.btn_showTopMenu[1].node.active = true
        }
    },
    //点击解散按钮
    onClickedDissolution() {
        this.playClickMusic()
        // cc.director.loadScene("land")
        this._gameControl.applyDissolution()
    },

    // //金币场点击返回按钮
    // onClickedGoldReturnHome() {

    // },

    //战绩按钮
    onClickedReturnHome() {
        cc.log("exploits")
        //添加音效
        this.playClickMusic()
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_SETTLE_MAX
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
        // if (this._isGold) {
        //     this._gameControl.goldRoomReturnHome(this._gameStart)
        // }
        // else {
        //     this._gameControl.enterHome()
        // }

    },
    //设置按钮
    onClickedSet() {
        //添加音效
        this.playClickMusic()
        cc.log("设置按钮")
        var nodeCreateRoom = cc.instantiate(cc.globalRes[this.poker_setting]);
        nodeCreateRoom.parent = this.node;
        nodeCreateRoom.getComponent("Setting").setBgMusicId(this.gameBgMusicId)
    },
    //点击分享按钮
    onClickedShare() {
        this.playClickMusic()
        this.wxShare("趣玩-斗地主", G.shareHttpServerPath, "房号:" + this._rule.roomId + " 局数 " + this._rule.jushu, "0", "2")
    },

    //点击结束分享按钮
    onClickedEndShare() {
        this.playClickMusic()
        this.wxShare("趣玩-斗地主", G.shareHttpServerPath, "斗地主结算", "0", "1")
    },

    //点击聊天按钮
    onClickedChat() {
        this._gameControl.addChatLayer(cmd.MAIN_MSG_ID)
    },
    //点击语音聊天按钮
    onClickedVoice() {

    },
    //点击背景回调
    onClickedBg() {
        cc.log("onclickedBg")
        this.setAllMyPokerNotSelect()
    },
    //点击继续按钮
    onClickedNext() {
        //发送继续
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_GAMES_COUNT
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
        //隐藏小结算界面
        this.showResultNode(false)
    },
    //点击换桌
    onClickedChangeTabel() {
        cc.log("--换桌")
        //发送继续
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid
        this.send(MsgIds.CHANGE_TABLE, obj)

        //隐藏小结算界面
        this.showResultNode(false)
    },

    //不出按钮
    onClickedNotSendCard() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_S_NOT_SEND_CARD
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
        this.showSendCardMenu(G.myPlayerInfo.wxId, false)
        this.stopWaitTime(G.myPlayerInfo.wxId)
    },
    //出牌按钮
    onClickedSendCard() {
        var sendCards = this.getSendCard()
        cc.log("sendcards", sendCards)
        var obj = new Object()
        obj.zinetid = cmd.SUB_S_PLAY_CARDS
        obj.uid = G.myPlayerInfo.uid
        obj.dapai = sendCards
        this.send(cmd.MAIN_MSG_ID, obj)
    },
    //提示按钮
    onClickedPrompt() {
        if (this.saveTipsPokers.length == 0) {
            var obj = new Object()
            obj.zinetid = cmd.SUB_R_TIPS_SEND_CARD
            obj.uid = G.myPlayerInfo.uid
            this.send(cmd.MAIN_MSG_ID, obj)
        }
        else {
            this.tipsIndex = (this.tipsIndex + 1) % this.saveTipsPokers.length
            // if(this.tipsIndex == 0 )
            // {
            //     this.tipsIndex = this.saveTipsPokers.length
            // }
            this.promptSendCards(this.saveTipsPokers, this.tipsIndex)
        }
    },
    //准备按钮
    onClickReady() {
        var obj = new Object()
        obj.zinetid = cmd.SUB_R_READY
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
        this.showReadybtn(false)
        this.setChangeTableBtnCanTouch(false)
    },

    //结束按钮回调
    onClickEnd() {
        this._gameControl.enterHomeEvent()
    },

    //叫分按钮事件回调
    onClickedAddScore(event, key) {
        var obj = new Object()
        obj.zinetid = cmd.SUB_S_CALL_LAND
        obj.fen = key
        obj.uid = G.myPlayerInfo.uid
        this.send(cmd.MAIN_MSG_ID, obj)
        this.showCallLandMenu(false)
        this.stopWaitTime(G.myPlayerInfo.wxId)
    },

    isVipForMe() {
        var userInfo = this.getUserListByWxid(G.myPlayerInfo.wxId);
        return userInfo.isVip;
    },

    // 点击座位节点
    onClickSeat(event, customEventData) {
        var userInfo = this.getUserListByWxid(event.target.wxId);
        var isVipForMe = this.isVipForMe();
        switch (customEventData) {
            case "mySeatClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(true, event.target.wxId, userInfo, false, this._rule.isjinbi);
                break;
            }
            case "rightSeatClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this._rule.isjinbi);
                break;
            }
            case "leftSeatClicked": {
                cc.globalMgr.globalFunc.addGameUserInfo(false, event.target.wxId, userInfo, isVipForMe, this._rule.isjinbi);
                break;
            }
            default:
                break;
        }
    },

    //显示结算面板 1s 之后执行
    showResultWaitTime() {
        this.scheduleOnce(function () {
            this.showResultNode(true)
        }, 2)
    },

    //显示隐藏结算界面
    showResultNode(active) {
        this.result_node.active = active
    },

    //显示结算后的所有玩家手牌
    showResultPlayersPokers(resultData) {
        for (var i = 0; i < resultData.length; i++) {
            var wxid = resultData[i].wxid
            var pokers = resultData[i].listpai
            if (wxid == G.myPlayerInfo.wxId) {
                this.refreshMyCards(pokers)
            }
            else {
                this.playerSendCard(wxid, pokers)
            }
        }
    },

    //显示结算界面
    showBigResultNode(resultData) {
        cc.log("大结算")
        var self = this
        this.scheduleOnce(function () {
            self.showResultNode(false)
            self.setBigResultNode(resultData, 1)
        }, 3)
    },

    //大结算面板
    setBigResultNode(resultData) {
        cc.log("大结算面板")
        cc.log(resultData)
        var resultbg = this.big_result_node
        resultbg.active = true
        for (var i = 0; i < resultData.length; i++) {
            var itembg = resultbg.getChildByName("sp_item_bg_" + i)
            var nameLabel = itembg.getChildByName("label_name")
            var socreLabel = itembg.getChildByName("label_score")
            var bigWinSp = itembg.getChildByName("sp_big_win")
            var useInfo = this.getUserListByWxid(resultData[i].wxid)
            var head = itembg.getChildByName("sp_result_head")

            var loadHead = function (head) {
                cc.loader.load({ url: useInfo.image, type: 'png' }, function (err, tex) {
                    head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                });
            }
            loadHead(head)

            //判断当前分数是否是最高分
            var isMaxScore = function (score) {
                var isMaxScore = true
                for (var j = 0; j < resultData.length; j++)
                    if (score < resultData[j].zongdefen)
                        return false
                return isMaxScore
            }
            if (isMaxScore(resultData[i].zongdefen) == true) {
                bigWinSp.active = true
            }
            else {
                bigWinSp.active = false
            }

            socreLabel.getComponent(cc.Label).string = this.FormatGold(resultData[i].zongdefen)
            nameLabel.getComponent(cc.Label).string = this.FormatName(resultData[i].name)

        }
        var sp_lose = resultbg.getChildByName("sp_lose")
        var sp_win = resultbg.getChildByName("sp_win")
        var myResultData = this.getMyResultData(resultData)
        if (myResultData.zongdefen > 0) {
            sp_lose.active = false
            sp_win.active = true
        }
        else {
            sp_lose.active = true
            sp_win.active = false
        }
    },

    //设置结算界面
    //type 0 == 小结算 1 == 大结算
    setResultNode(resultData, type) {
        cc.log(resultData, "resultData===========小结算")
        for (var i = 0; i < this._userList.length; i++) {
            this.user_node[i].getChildByName("sp_land").active = false
        }
        var resultbg = this.result_node.getChildByName("bg")
        for (var i = 0; i < resultData.length; i++) {
            var itembg = resultbg.getChildByName("sp_item_bg_" + i)
            var nameLabel = itembg.getChildByName("Label_name")
            var socreLabel = itembg.getChildByName("Label_score")
            var landSp = itembg.getChildByName("Label_difen")
            var bigWinSp = itembg.getChildByName("Label_beishu")

            nameLabel.getComponent(cc.Label).string = this.FormatName(resultData[i].name)
            socreLabel.getComponent(cc.Label).string = resultData[i].score
            landSp.getComponent(cc.Label).string = resultData[i].difen
            bigWinSp.getComponent(cc.Label).string = resultData[i].beishu
            if (resultData[i].isdizhu) {
                itembg.getChildByName("sp_dizhu").active = true
            }
            else {
                itembg.getChildByName("sp_dizhu").active = false
            }
        }

        //     var useInfo = this.getUserListByWxid(resultData[i].wxid)
        //     var images = "";
        //     if (G.isCoinRoom == true) {
        //         if (resultData[i].sex = 1 || resultData[i].sex == "男") {
        //             images = G.nanImage;
        //         }
        //         else {
        //             images = G.nvImage;
        //         }
        //     }
        //     else {
        //         images = useInfo.image;
        //     }
        //     var loadHead = function (head) {
        //         cc.loader.load({ url: images, type: 'png' }, function (err, tex) {
        //             head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
        //         });
        //     }
        //     loadHead(head)

        //     if (resultData[i].isdizhu == 1) {
        //         landSp.active = true
        //     }
        //     else {
        //         landSp.active = false
        //     }

        //     //大结算隐藏底分
        //     if (type == 1) {
        //         baseScoreLabel.active = false

        //         //判断当前分数是否是最高分
        //         var isMaxScore = function (score) {
        //             var isMaxScore = true
        //             for (var j = 0; j < resultData.length; j++)
        //                 if (score < resultData[j].zongdefen)
        //                     return false
        //             return isMaxScore
        //         }
        //         if (isMaxScore == true) {
        //             bigWinSp.active = true
        //         }
        //         else {
        //             bigWinSp.active = false
        //         }
        //         socreLabel.getComponent(cc.Label).string = this.FormatGold(resultData[i].zongdefen)
        //         nameLabel.getComponent(cc.Label).string = this.FormatName(resultData[i].name)
        //     }
        //     else {
        //         socreLabel.getComponent(cc.Label).string = this.FormatGold(resultData[i].zongfenddz)
        //         nameLabel.getComponent(cc.Label).string = this.FormatName(resultData[i].f_nick)
        //         baseScoreLabel.getComponent(cc.Label).string = resultData[i].difen
        //         scoreMultipleLabel.getComponent(cc.Label).string = resultData[i].beishu
        //         baseScoreLabel.active = true
        //         scoreMultipleLabel.active = true
        //         bigWinSp.active = false
        //     }
        // }
        // //底分
        // var baseLabel = resultbg.getChildByName("label_base")
        // var multipleLabel = resultbg.getChildByName("label_multiple")
        // //继续按钮
        // var btnNext = resultbg.getChildByName("btn_next")
        // //结束
        // var btn_end = resultbg.getChildByName("btn_end")
        // //大结算
        // if (type == 1) {
        //     baseLabel.active = false
        //     multipleLabel.active = false
        //     btnNext.active = false
        //     btn_end.active = true
        // }
        // else {
        //     baseLabel.active = true
        //     multipleLabel.active = true
        //     btnNext.active = true
        //     btn_end.active = false
        // }

        // //得到自己的数据
        // var winOrLoseSp = resultbg.getChildByName("sp_win_or_lose")
        // var myResultData = this.getMyResultData(resultData)
        // var LabelAtlas_win = resultbg.getChildByName("LabelAtlas_win")
        // var LabelAtlas_lose = resultbg.getChildByName("LabelAtlas_lose")
        // var playerScore = 0
        // if (type == 1) {
        //     playerScore = myResultData.zongdefen
        // }
        // else {
        //     playerScore = myResultData.zongfenddz
        // }

        // if (playerScore > 0) {
        //     this.playSound("ddz_win")
        //     LabelAtlas_win.active = true
        //     LabelAtlas_lose.active = false

        //     LabelAtlas_win.getComponent("ArtFigures").setNum(playerScore)
        //     winOrLoseSp.getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame('landResult-title_win_new1');
        // }
        // else {
        //     this.playSound("ddz_lose")
        //     LabelAtlas_win.active = false
        //     LabelAtlas_lose.active = true

        //     LabelAtlas_lose.getComponent("ArtFigures").setNum(playerScore)
        //     winOrLoseSp.getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame('landResult-lose_anim_101');
        // }

    },
    //获取自己的结算数据
    getMyResultData(datas) {
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].wxid == G.myPlayerInfo.wxId) {
                return datas[i]
            }
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

    //隐藏显示准备按钮
    showReadybtn(active) {
        this.Ready_btn.node.active = active
    },

    //移动准备按钮
    moveReadyBtn(isGold) {
        if (isGold == true) {
            this.Ready_btn.node.x = 107
        }
        else {
            this.Ready_btn.node.x = 0
        }
    },

    //隐藏显示邀请按钮
    showInvitation(active) {
        cc.log("隐藏显示邀请按钮", active)
        this.btn_Invitation.node.active = active
    },

    //显示不出
    showNotSendSp(wxid, active) {
        this.user_node[this.getTableIndex(wxid)].getChildByName("sp_operation").active = active
        this.user_node[this.getTableIndex(wxid)].getChildByName("sp_operation").getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('anim_magic_pass');
    },

    //隐藏所有不出
    showNotSendspAll() {
        for (var i = 0; i < cmd.playerCount; i++)
            this.showNotSendSp(this._userList[i].wxId, false)
    },

    //开启倒计时
    startWaitTime(wxid, waitTime) {
        cc.log("开启定时器 ", waitTime)
        this._waitTime = waitTime
        this._waitWxid = wxid
        this.setClockActive(true, wxid)
        this.showWaitTime(this._waitTime, true)
        this.schedule(this.waitTimeCallfunc, 1);
    },
    //关闭倒计时
    stopWaitTime(wxid) {
        this.setClockActive(false, wxid)
        this.unschedule(this.waitTimeCallfunc)
    },

    //抢地主倍数
    showCallLandScore(wxId, score) {
        var frame = this.atlas.getSpriteFrame('anim_callscore_' + score);
        this.user_node[this.getTableIndex(wxId)].getChildByName("sp_callScore").active = true
        this.user_node[this.getTableIndex(wxId)].getChildByName("sp_callScore").getComponent(cc.Sprite).spriteFrame = frame
    },

    //隐藏所有玩家抢地主倍数
    hideAllPlayerScore() {
        for (var i = 0; i < 3; i++) {
            this.user_node[i].getChildByName("sp_callScore").active = false
        }
    },

    //定时器显示
    showWaitTime(time, active) {
        this.user_node[this.getTableIndex(this._waitWxid)].getChildByName("sp_clockbg").getChildByName("label_time").getComponent(cc.Label).string = time
        if (time === 5 && this._waitWxid === G.myPlayerInfo.wxId) {
            this.playTimeLastFiveTipSFX();
        }
    },

    //定时器显示隐藏
    setClockActive(active, wxId) {
        var tempWxid = this._waitWxid
        if (wxId != undefined) {
            tempWxid = wxId
        }
        this.user_node[this.getTableIndex(tempWxid)].getChildByName("sp_clockbg").active = active
    },
    //定时器回调
    waitTimeCallfunc(dt) {
        this._waitTime--;
        this.showWaitTime(this._waitTime, true)
        if (this._waitTime == 0) {
            this.stopWaitTime(this._waitWxid)
        }
    },
    //保存其他玩家抢庄的分数
    saveOtherCallScore(score) {
        this._maxCallScore = Math.max(this._maxCallScore, parseInt(score))
    },
    // //是否加倍
    // isAddBei(data) {
    //     this.addBei_node.active = true

    // },
    // //隐藏加倍按钮
    // hideAddBeiBtn() {
    //     this.addBei_node.active = false
    // },

    // addBeiInfo(data) {
    //     if (data.wxid == G.myPlayerInfo.wxId) {
    //         this.addBei_node.active = false
    //     }
    //     this.playerJiaBei(data.wxid, data.type)
    //     cc.log(data, "jiabeibu ")
    // },

    //玩家加倍
    // playerJiaBei(wxId, type) {
    //     cc.log("------------加倍玩家-----------", wxId, "ID", type)
    //     if (type == 1) {
    //         this.user_node[this.getTableIndex(wxId)].getChildByName("spr_jiabei").active = false;
    //     } else if (type == 2) {
    //         this.user_node[this.getTableIndex(wxId)].getChildByName("spr_jiabei").active = true;
    //     }

    // },
    // noAddBei() {
    //     // type 1 不加倍 2 加倍
    //     var obj = new Object()
    //     obj.zinetid = cmd.SUB_S_SEND_JIABEI
    //     obj.type = 1
    //     obj.uid = G.myPlayerInfo.uid
    //     this.send(cmd.MAIN_MSG_ID, obj)
    // },

    //点击加倍
    // addBeiBtn() {
    //     // type 1 不加倍 2 加倍
    //     var obj = new Object()
    //     obj.zinetid = cmd.SUB_S_SEND_JIABEI
    //     obj.type = 2
    //     obj.uid = G.myPlayerInfo.uid
    //     this.send(cmd.MAIN_MSG_ID, obj)
    // },

    //叫地主界面显示
    callLand(wxid, difen) {
        //如果是玩家选择叫地主
        if (wxid == G.myPlayerInfo.wxId) {
            this.showCallLandMenu(true, difen);
        }
    },
    //显示出牌按钮界面
    //type 是否显示不出按钮
    //isCanSend 是否可以管住牌，如果可以管住，显示出牌按钮，否则只显示不出按钮
    showSendCardMenu(wxid, active, type, isCanSend) {
        if (wxid == G.myPlayerInfo.wxId) {
            this.sendCard_node.active = active
            var btn_buchu = this.sendCard_node.getChildByName("btn_buchu")
            var btn_prompt = this.sendCard_node.getChildByName("btn_prompt")
            var btn_chupai = this.sendCard_node.getChildByName("btn_chupai")
            if (isCanSend != undefined) {
                if (isCanSend == true) {
                    btn_buchu.active = true
                    btn_prompt.active = true
                    btn_chupai.active = true
                    btn_buchu.setPosition(-48, -53)
                }
                else {
                    btn_buchu.active = true
                    btn_prompt.active = false
                    btn_chupai.active = false
                    btn_buchu.setPosition(249, -53)
                }
            }
            if (type != undefined) {
                if (type == 0) {
                    this.sendCard_node.getChildByName("btn_buchu").active = false
                } else {
                    this.sendCard_node.getChildByName("btn_buchu").active = true
                }
            }
        }
    },
    //清空桌面所有出的牌
    clearAllSendPoker() {
        for (var i = 0; i < cmd.playerCount; i++) {
            this.clearSendCards(this._userList[i].wxId)
        }
    },
    //隐藏显示抢地主按钮
    showCallLandMenu(active, diFen) {
        this.addScore_node.active = active
        if (diFen) {
            this._maxCallScore = diFen
        }
        cc.log(this._maxCallScore, "this._maxCallScore=======================")
        for (var i = 1; i < 4; i++) {
            if (i > this._maxCallScore) {
                this.addScore_btn[i].getComponent(cc.Button).interactable = true
            }
            else {
                this.addScore_btn[i].getComponent(cc.Button).interactable = false
            }
        }
    },

    //显示地主标志
    showLandImg(wxId, active) {
        cc.log(wxId, active, "显示地主标志")
        this.user_node[this.getTableIndex(wxId)].getChildByName("sp_land").active = active
        this._landWxId = wxId
        if (this._landWxId == G.myPlayerInfo) {
            this.myPokers[this.myPokers.length - 1].getComponent("Land_CommPoker").showLandImg()
        }
        // for (var i = 0; i < this._userList.length; i++) {
        //     if (wxId != this._userList[i].wxId) {
        //         this.user_node[this.getTableIndex(this._userList[i].wxId)].getChildByName("sp_landNong").active = true
        //     }
        // }
        // if (active == true) {
        //     for (var i = 0; i < this._userList.length; i++) {
        //         this.user_node[i].getChildByName("sp_land").getComponent(cc.Sprite).node.active = false
        //         if (wxId == this._userList[i].wxId) {
        //             cc.log(this._userList[i].wxId,"显示地主标志")
        //             cc.log(this.getTableIndex(this._userList[i].wxId),"=============================")
        //             this.user_node[this.getTableIndex(this._userList[i].wxId)].getChildByName("sp_land").getComponent(cc.Sprite).node.active = true
        //         }
        //         else{
        //             cc.log("显示农民标志")
        //         }

        //     }
        // }
    },

    //隐藏显示底下三张牌牌值
    createThreeCards(PokerList) {
        for (var i = 0; i < 3; i++) {
            var tempPoker = this.PokerMinPool.get()
            tempPoker.parent = this.top_cards[i]
            tempPoker.getComponent("Land_CommPoker").setPoker(PokerList[i].v, PokerList[i].h)
            tempPoker.x = 0;
            tempPoker.y = 0;
            cc.log("three x " + tempPoker.x + " y " + tempPoker.y)

            this.threePokers.push(tempPoker)
        }
    },

    //刷新自己手牌
    refreshMyCards(PokerList, wechatId) {
        if (G.isRePlay == true && wechatId != undefined) {
            this.showNotSendspAll();
            var index = this.getTableIndex(wechatId);

            switch (index) {
                case 0:
                    if (this.myPokers.length != 0) {
                        for (var i = 0; i < this.myPokers.length; i++) {
                            this.myPokers[i].getComponent("Land_CommPoker").reset();
                            this.PokerCardsPool.put(this.myPokers[i]);
                        }
                        this.myPokers = [];
                    }

                    this.myPokers = this.createPokers(this.myCard_node, PokerList, 50, G.myPlayerInfo.wxId)
                    cc.log("我的手牌长度: ", this.myPokers.length);
                    break;
                case 1:
                    if (this.rightPokers.length != 0) {
                        for (var i = 0; i < this.rightPokers.length; i++) {
                            this.rightPokers[i].getComponent("Land_CommPoker").reset()
                            this.rightPokerCardsPool.put(this.rightPokers[i])
                        }
                        this.rightPokers = []
                    }
                    this.rightPokers = this.createPokers(this.rightCard_node, PokerList, 30, wechatId)
                    break;
                case 2:
                    if (this.leftPokers.length != 0) {
                        for (var i = 0; i < this.leftPokers.length; i++) {
                            this.leftPokers[i].getComponent("Land_CommPoker").reset()
                            this.leftPokerCardsPool.put(this.leftPokers[i])
                        }
                        this.leftPokers = []
                    }
                    this.leftPokers = this.createPokers(this.leftCard_node, PokerList, 30, wechatId)
                    break;
                default:
                    return;
            }
        }
        else {
            //先移除现在的手牌
            if (this.myPokers.length != 0) {
                for (var i = 0; i < this.myPokers.length; i++) {
                    this.myPokers[i].getComponent("Land_CommPoker").reset()
                    this.PokerCardsPool.put(this.myPokers[i])
                    cc.log("移除我的手牌")
                }
                this.myPokers = []
            }

            var isLand = false
            if (this._landWxId == G.myPlayerInfo.wxId) {
                isLand = true;
            }
            this.myPokers = this.createPokers(this.myCard_node, PokerList, 55, isLand)

        }
    },

    //清空玩家自己出的牌
    clearMySendCards(wxId) {
        if (wxId == G.myPlayerInfo.wxId) {
            this.clearSendCards(wxId)
        }
    },

    //清空玩家出牌的牌
    clearSendCards(wxid) {
        // cc.log(" pokerList " , this.sendPokers)
        var pokerLength = this.sendPokers[this.getTableIndex(wxid)].length
        if (pokerLength != 0) {
            for (var i = 0; i < pokerLength; i++) {
                this.sendPokers[this.getTableIndex(wxid)][i].getComponent("Land_CommPoker").reset()
                this.PokerMidPool.put(this.sendPokers[this.getTableIndex(wxid)][i])
            }
            this.sendPokers[this.getTableIndex(wxid)] = []
        }

    },
    //玩家出牌消息接收
    playerSendCard(wxid, PokerList) {
        this.clearSendCards(wxid)

        var isLand = false;
        if (wxid == this._landWxId) {
            isLand = true;
        }

        //如果是三带 ，创建三带
        if (gameLogic.getSanDaiValue(PokerList) > 0) {
            this.sendPokers[this.getTableIndex(wxid)] = this.createSanDai(this.card_node[this.getTableIndex(wxid)], PokerList, isLand)
        }
        else {
            this.sendPokers[this.getTableIndex(wxid)] = this.createPokers(this.card_node[this.getTableIndex(wxid)], PokerList, 40, isLand)
        }
    },

    //创建三带扑克列
    createSanDai(node, pokerList, isLand) {
        var pokerPos = [[0, 0], [22, 0], [53, -11], [170, -6], [212, -6]]
        var pokerRotation = [-19, 0, 26, 0, 0]

        var sortPokerList = gameLogic.getSortSanDai(pokerList);
        cc.log("sortPokerList ", sortPokerList)
        var tempPokers = []
        var self = this;
        var createPokerByIndex = function (index, length) {
            var poker = self.PokerMidPool.get()
            poker.parent = node
            tempPokers.push(poker)
            poker.getComponent("Land_CommPoker").setPoker(sortPokerList[index].v, sortPokerList[index].h)
            poker.x = pokerPos[index][0]
            poker.y = pokerPos[index][1]

            if (index == length - 1 && isLand == true) {
                poker.getComponent("Land_CommPoker").showLandImg();
            }

            poker.rotation = pokerRotation[index]
            if (node == self.card_node[0]) {
                poker.x = poker.x - 200
            }
            else if (node == self.card_node[1]) {
                poker.x = poker.x - 200
            }
            else if (node == self.card_node[2]) {
                poker.x = poker.x + 30
            }
            return poker;
        }

        //先创建带的牌
        for (var i = 3; i < sortPokerList.length; i++) {
            tempPokers.push(createPokerByIndex(i, sortPokerList.length))
        }
        //顺序创建三张
        this.node.runAction(cc.sequence(cc.callFunc(function () {
            tempPokers.push(createPokerByIndex(0));
        }), cc.delayTime(0.1), cc.callFunc(function () {
            tempPokers.push(createPokerByIndex(1));
        }), cc.delayTime(0.1), cc.callFunc(function () {
            tempPokers.push(createPokerByIndex(2));
        })))
        return tempPokers;
    },

    //创建扑克列
    createPokers(node, PokerList, offerx, isLand) {
        var offerx = offerx
        var AllPokersWidth = PokerList.length * offerx
        var pokerLength = PokerList.length
        var tempPokers = []
        var pokerlimit = 8
        for (var i = 0; i < PokerList.length; i++) {
            var poker = null;
            if (node == this.myCard_node) {
                poker = this.PokerCardsPool.get()
            }
            //------------huifang----------
            else if (node == this.rightCard_node) {
                cc.log("右边的牌刷新")
                poker = this.rightPokerCardsPool.get()
            }
            else if (node == this.leftCard_node) {
                cc.log("左边的牌刷新")
                poker = this.leftPokerCardsPool.get()
            }
            //--------------huifang------------------
            else {
                poker = this.PokerMidPool.get()
            }

            tempPokers.push(poker)
            poker.parent = node
            poker.getComponent("Land_CommPoker").setPoker(PokerList[i].v, PokerList[i].h)
            poker.getComponent("Land_CommPoker").setPokerIndex(i)

            if (i == PokerList.length - 1 && isLand == true) {
                poker.getComponent("Land_CommPoker").showLandImg()
            }

            if (node == this.myCard_node) {
                poker.setPosition((i - 1) * offerx - AllPokersWidth / 2, 0)
                cc.log("poker x : ", poker.x, "poker y : ", poker.y);
                if (i == PokerList.length - 1) {
                    //遮罩整张扑克
                    poker.getComponent("Land_CommPoker").setPokerMask()
                }
            }
            //--------------回放-----------------------------
            else if (node == this.rightCard_node) {
                poker.setPosition((i - 1) * offerx - AllPokersWidth / 2, 0)
                cc.log(poker.postion, "右边的牌")
                poker.scale = 0.7
            }
            else if (node == this.leftCard_node) {
                poker.setPosition((i - 1) * offerx - AllPokersWidth / 2, 0)
                cc.log(poker.position, "左边的牌")
                poker.scale = 0.7
            }
            //-------------回放-------------------------------

            else if (node == this.card_node[0]) {
                poker.setPosition((i - 1) * offerx - AllPokersWidth / 2, 0);

            }
            else if (node == this.card_node[1]) {
                if (pokerLength < pokerlimit) {
                    poker.setPosition((i - 1) * offerx - AllPokersWidth + 90, 0);
                }
                else {
                    if (i >= pokerlimit) {
                        poker.setPosition((i - pokerlimit - 1) * offerx - (pokerLength - pokerlimit) * offerx + 90, -70);
                    }
                    else {
                        poker.setPosition((i - 1) * offerx - (pokerlimit * offerx) + 90, 0);
                    }
                }
            }
            else if (node == this.card_node[2]) {
                if (pokerLength < pokerlimit) {
                    poker.setPosition((i - 1) * offerx, 0);
                }
                else {
                    if (i >= pokerlimit) {
                        poker.setPosition((i - pokerlimit - 1) * offerx, -70);
                    }
                    else {
                        poker.setPosition((i - 1) * offerx, 0);
                    }
                }
            }
            /// 注释 此次推送为测试
        }
        return tempPokers;
    },
    //玩家自己出牌消息
    getSendCard() {
        var sendcards = [];
        for (var i = 0; i < this.myPokers.length; i++) {
            var commPoker = this.myPokers[i].getComponent("Land_CommPoker");

            if (commPoker.selected == true) {
                var obj = new Object();
                obj.v = commPoker.pokerValue;
                obj.h = commPoker.pokerColor;
                sendcards.push(obj);
            }
        }
        return sendcards;
    },

    setGameControl(gameControl) {
        this._gameControl = gameControl
        //绑定语音按钮 和头像框
        this._gameControl.bindVoiceBtnAndUsersBox(this.voice_btn, this.user_node)
        //绑定头像框
        this._gameControl.bindUsersBox(this.user_node)
    },
    //添加触摸事件
    //添加触摸事件
    addTouchEvent: function () {
        cc.log("add touch event")
        var self = this
        self.judgeSelect = function (touchPos, maskWidth, maskheight) {
            if (touchPos.x > 0 && touchPos.y > 0 && touchPos.x < maskWidth && touchPos.y < maskheight) {
                return true
            }
            else {
                return false
            }
        }
        this._touchstart = { x: 0, y: 0 }
        this._touchPokers = []
        this._touchStartPoker = null
        this.myPokerTouch_node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("poker touch start")
            for (var i = 0; i < self.myPokers.length; i++) {
                var masknode = self.myPokers[i].getChildByName("maskLayout")
                var touchStartLocation = masknode.convertTouchToNodeSpace(event)
                var maskWidth = masknode.width
                var maskheight = masknode.height
                if (self.judgeSelect(touchStartLocation, maskWidth, maskheight)) {
                    self.myPokers[i].getComponent("Land_CommPoker").setPokerSelecting()
                    self._touchStartPoker = self.myPokers[i]
                }
            }

            if (self._touchStartPoker == null) {
                self.setAllMyPokerNotSelect();
            }
            else {
                self._touchPokers.push(self._touchStartPoker);
            }
        })

        this.myPokerTouch_node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log("poker touch move")
            if (self._touchStartPoker == null) return;
            for (var i = 0; i < self.myPokers.length; i++) {
                var masknode = self.myPokers[i].getChildByName("maskLayout")
                var touchStartLocation = masknode.convertTouchToNodeSpace(event)
                var maskWidth = masknode.width
                var maskheight = masknode.height

                if (self.judgeSelect(touchStartLocation, maskWidth, maskheight)) {
                    for (var j = 0; j < self.myPokers.length; j++) {
                        if (self._touchStartPoker != self.myPokers[j])
                            self.myPokers[j].getComponent("Land_CommPoker").setPokerNotSelecting()
                    }
                    var startPokerIndex = self._touchStartPoker.getComponent("Land_CommPoker").getPokerIndex()
                    var selectPokerIndex = self.myPokers[i].getComponent("Land_CommPoker").getPokerIndex()
                    var tempStartIndex = Math.min(startPokerIndex, selectPokerIndex)
                    var tempEndIndex = Math.max(startPokerIndex, selectPokerIndex)
                    self._touchPokers = []
                    for (var j = tempStartIndex; j <= tempEndIndex; j++) {
                        self.myPokers[j].getComponent("Land_CommPoker").setPokerSelecting()
                        self._touchPokers.push(self.myPokers[j])
                    }
                }
            }
        })
        this.myPokerTouch_node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("poker touch end");
            // cc.log("event location ", event.getLocation())
            for (var i = 0; i < self.myPokers.length; i++) {
                self.myPokers[i].getComponent("Land_CommPoker").setPokerNotSelecting()
            }

            //滑动的牌是否有之前选中的牌
            var bHaveSelected = false
            for (var i = 0; i < self._touchPokers.length; i++) {
                var pokerSelected = self._touchPokers[i].getComponent("Land_CommPoker").selected
                if (pokerSelected == true) {
                    bHaveSelected = true
                    break
                }
            }
            //滑动的牌有选中的牌，把选中的牌设置为未移动
            //如果没有，判断滑动的牌，是否能组成顺子，如果可以，把组成的顺子提上来
            if (bHaveSelected == true) {
                for (var i = 0; i < self._touchPokers.length; i++) {
                    var pokerSelected = self._touchPokers[i].getComponent("Land_CommPoker").selected
                    cc.log("pokerSelected", pokerSelected)
                    if (pokerSelected == true) {
                        self._touchPokers[i].getComponent("Land_CommPoker").unselected()
                    }
                    else {
                        self._touchPokers[i].getComponent("Land_CommPoker").doselect()
                    }
                }
            }
            else {
                var cardValues = []
                for (var i = 0; i < self._touchPokers.length; i++) {
                    var value = self._touchPokers[i].getComponent("Land_CommPoker").pokerValue
                    cardValues.push(value)
                }
                var selectCardIndexs = gameLogic.getShunZiIndexList(cardValues)

                for (var i = 0; i < self._touchPokers.length; i++) {
                    var bDoSelect = false;
                    for (var j = 0; j < selectCardIndexs.length; j++) {
                        if (i == selectCardIndexs[j]) {
                            bDoSelect = true;
                        }
                    }
                    if (bDoSelect) {
                        self._touchPokers[i].getComponent("Land_CommPoker").doselect()
                    }
                    else {
                    }
                }
            }
            self._touchPokers = []
            self._touchStartPoker = null;
        })
    },

    playSound(soundName) {
        this.playEffectMusic("resources/game/land/ddz_sound/" + soundName + ".mp3", false);
    },
    //播放背景音乐
    playLandBgMusic() {
        this.gameBgMusicId = this.playBgMusic("resources/game/land/ddz_sound/bgMain.mp3", true);
    },
    //玩家音效
    playerSound(soundName, wxid) {
        var sex = this.getUserListByWxid(wxid).sex
        if (sex == "1") {
            this.playEffectMusic("resources/game/land/ddz_sound/man/" + soundName + ".mp3", false)
        } else {
            this.playEffectMusic("resources/game/land/ddz_sound/woman/" + soundName + ".mp3", false)
        }
    },

    //播放快捷聊天音效
    playChatSound(index, wxid) {
        var tempIndex = index - 1;
        var sex = this.getUserListByWxid(wxid).sex;
        if (sex == "1") {
            this.playEffectMusic("resources/game/land/ddz_sound/man/Man_Chat_" + tempIndex + ".mp3", false)
        } else {
            this.playEffectMusic("resources/game/land/ddz_sound/woman/Woman_Chat_" + tempIndex + ".mp3", false)
        }
    },

    btnOnLocation() {
        cc.log("点击了位置");
    },

    onClickResidue() {

        if (this.node_JiPaiQi.active) {
            this.node_JiPaiQi.active = false
        } else {
            this.node_JiPaiQi.active = true
        }
    },
    //更换桌布
    Tablecloth(customEventData) {
        var num = parseInt(customEventData)
        this.bgSpr.spriteFrame = this.bgSprFrame[num];
    },
    //更换牌面
    Cardback(customEventData) {
        var num = parseInt(customEventData)
        this.bgpaione.spriteFrame = this.paiSprFrame[num];
        this.bgpaitow.spriteFrame = this.paiSprFrame[num];
        this.bgpaithree.spriteFrame = this.paiSprFrame[num];
    },
    onDestroy() {
        //销毁对象池
        this.PokerCardsPool.clear()
        this.rightPokerCardsPool.clear()
        this.leftPokerCardsPool.clear()
        this.PokerMidPool.clear()
        this.PokerMinPool.clear()
        //停止播放音乐
        cc.audioEngine.stopAll()

        this.uneventRegist(this)
        this.unregist(this)
    }
});
