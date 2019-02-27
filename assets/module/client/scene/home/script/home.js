
var comm = require("Comm")
var MsgIds = require("MsgIds")
cc.Class({
    extends: comm,

    properties: {
        //昵称
        text_name: {
            default: null,
            type: cc.Label
        },
        //金币
        lable_goldNum: {
            default: null,
            type: cc.Label
        },
        //钻石
        lable_diamondNum: {
            default: null,
            type: cc.Label
        },
        //ID
        num_plalyid: {
            default: null,
            type: cc.Label
        },
        //头像
        sprite_playImage: {
            default: null,
            type: cc.Sprite
        },
        //滚动公告
        prefab_notice: {
            default: null,
            type: cc.Node
        },
        scrollRecord: {
            default: null,
            type: cc.ScrollView
        },
        spr_img1: {
            default: null,
            type: cc.Node,
        },
        spr_img2: {
            default: null,
            type: cc.Node,
        },
        spr_img3: {
            default: null,
            type: cc.Node,
        },
    },
    ctor() {
        this._RankingGaem = null;
    },

    onLoad() {

        this.sprMemberGray = this.node.getChildByName("layout_top").getChildByName("spr_memberGray");
        this.sprMemberHigh = this.node.getChildByName("layout_top").getChildByName("spr_memberHigh");

        //播放背景音乐pi
        this.playhomeBgMusic()
        var storage = window.localStorage;

        //获取用户头像
        var that = this;
        if (G.myPlayerInfo.image) {
            cc.loader.load({ url: G.myPlayerInfo.image, type: 'png' }, function (err, tex) {
                that.sprite_playImage.spriteFrame = new cc.SpriteFrame(tex)
            });
        }
        this.updateUserinfoLayer("", this)
        //监听大厅滚动公告消息
        this.regist(MsgIds.NOTICE_MASSAGE, this, this.setNotice)
        //监听个人信息更新
        this.eventRegist("UPDATEUSERINFO", this, this.updateUserinfoLayer)
        //监听排行榜的信息更新
        // var uid = G.myPlayerInfo.uid;
        // var page = 1;
        // G.socketMgr.socket.send(cc.globalMgr.msgIds.LEMONTY_RESPONSE, cc.globalMgr.msgObjs.LeMoneyWin(uid, page));
        // cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.LEMONTY_RESPONSE, this, this.OnLookHomeWinFunc);

        //玩家在大厅界面，离开游戏房间
        cc.globalMgr.voiceFrame.LeaveRoom()
        G.currentRoomId = 0
        cc.log("当前玩家所在房间号", G.currentRoomId)

        // this.scrollImg();

        this.timestamp = 0;
        this.direction = "right";
    },

    //刷新个人信息界面
    updateUserinfoLayer(obj, target) {
        //--------------------------------个人信息--------------------------------
        target.text_name.string = target.FormatName(G.myPlayerInfo.name);
        target.num_plalyid.string = "ID:" + G.myPlayerInfo.wxId;
        target.lable_goldNum.string = target.FormatGold(G.myPlayerInfo.jinbi); ///乐币 需要监听
        target.lable_diamondNum.string = target.FormatGold(G.myPlayerInfo.fk); /// 享币 需要监听
    },
    //创建房间
    OnClickCreateRoom: function (event, type) {
        //添加音效
        this.playClickMusic()
        G.selectGameType = type;
        var node_CreateRoom = cc.instantiate(cc.globalRes['runNode_createRoom']);
        node_CreateRoom.parent = this.node;
        // //牛牛
        // if (G.selectGameType == 4) {
        //     // var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createNNRoom']);
        //     // nodeCreateRoom.parent = this.node;
        // }
        // //麻将
        // else if (G.selectGameType == 9) {
        //     var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createMahjongRoom']);
        //     nodeCreateRoom.parent = this.node.getComponent("node_CreateRoom");
        // }
        // //炸金花
        // else if (G.selectGameType == 5) {
        //     var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createTractorsRoom']);
        //     nodeCreateRoom.parent = this.node.getComponent("node_CreateRoom");
        // }
        // //斗地主
        // else if (G.selectGameType == 3) {
        //     var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createDDZRoom']);
        //     nodeCreateRoom.parent = this.node.getComponent("node_CreateRoom");
        // }

    },
  

    playhomeBgMusic() {
        this.homeMusicId = this.playBgMusic("resources/sounds/bg_music.mp3", true)
        //保存背景音id(游戏内设置界面用)
        G.bgMusicId = this.homeMusicId;
    },

    setNotice(msgNumber, body, target) {
        target.prefab_notice.getComponent("RollingNotice").setRollingNotice(body.msg)
    },

    //点击用户头像
    onClickedButton_handfram: function () {
        //添加音效
        this.playClickMusic()

        var scene = cc.director.getScene();
        var node = cc.instantiate(cc.globalRes['runNode_PlayInfo']);
        node.parent = scene;
        node.setPosition(640, 360);
    },

    //购买钻石金币
    onClickhomeDiamondorGoldAdd_button: function (event, customEventData) {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        nodeCreateRoom.parent = this.node;
        var index = parseInt(customEventData)
        nodeCreateRoom.getComponent("Shop").changenode(index);
        nodeCreateRoom.getComponent("Shop").setToggleisCheck(index);
    },

    // //购买金币
    // onClickhomeGoldAdd_button: function () {
    //     //添加音效
    //     this.playClickMusic()

    //     var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
    //     nodeCreateRoom.parent = this.node;
    // },

    //麻将类
    btnOnMaJiang() {
        //添加音效
        this.playClickMusic()

        cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestPlayerInRoomCallFunc)
    },

    //查询有没有在房间内，回调
    requestPlayerInRoomCallFunc(target) {
        var curNode = cc.instantiate(cc.globalRes['runNode_createRoom']);
        var script = curNode.getComponent("CreateRoom");
        script.refreshView(1);

        if (curNode !== null) {
            console.log('进入约牌！');
            curNode.parent = target.node;
        }
    },

    //俱乐部
    OnClickClub() {
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runClub']);
        nodeCreateRoom.parent = this.node;
    },

    //加入房间
    OnCliceJoinRoom() {
        //添加音效
        this.playClickMusic()

        //先请求玩家有没有在房间内
        cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestJoinRoomPlayerInRoomCallFunc)
    },

    requestJoinRoomPlayerInRoomCallFunc(target) {
        console.log('加入约牌被点击了！');
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = target.node;
    },

    //反馈
    OnClickFeedback: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Feedback']);
        nodeCreateRoom.parent = this.node;
    },

    //实名认证
    OnClickRealName: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_RealName']);
        nodeCreateRoom.parent = this.node;

    },

    //规则
    OnClickRule: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Rule']);
        nodeCreateRoom.parent = this.node;
    },
    //公告
    OnClickNotice: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runprefab_notice']);
        nodeCreateRoom.parent = this.node;
    },

    //分享
    OnClickShare: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Share']);
        nodeCreateRoom.parent = this.node;
    },

    //客服
    OnClickService: function () {
        //添加音效
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Service']);
        nodeCreateRoom.parent = this.node;

    },
    //邀请码
    OnClickBangAgent: function () {
        //添加音效
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_BangVIP']);
        nodeCreateRoom.parent = this.node;
    },
    //绑定手机号
    OnClickBinding: function () {
        //添加音效
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_binding']);
        nodeCreateRoom.parent = this.node;
    },
    // //银行系统
    // OnClickBank: function () {
    //     this.playClickMusic()
    //     var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Bank']);
    //     nodeCreateRoom.parent = this.node;
    // },

    //商城
    OnClickShop: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        nodeCreateRoom.parent = this.node;
    },

    //会员充值
    OnClickVipPay: function () {
        //添加音效
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        // var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_VipPay']);
        nodeCreateRoom.parent = this.node;
    },

    // //每日任务
    // OnClickDayTask: function () {
    //     //添加音效
    //     this.playClickMusic()
    //     this.addTips("玩命研发中...", this.node)
    // },

    //设置
    OnClickSetting: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Setting']);
        nodeCreateRoom.parent = this.node;
        nodeCreateRoom.getComponent("Setting").setBgMusicId(this.homeMusicId)
    },

    //回放
    OnClickRePlay: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_RePlay']);
        nodeCreateRoom.parent = this.node;
    },

    // //签到
    // OnClickSingIn: function () {
    //     //添加音效
    //     this.playClickMusic()

    //     var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_SingIn']);
    //     nodeCreateRoom.parent = this.node;

    // },

    btnOnLeaveRoom() {
        //添加音效
        this.playClickMusic()

        var data = new Object();
        data.uid = G.myPlayerInfo.uid;

        G.socketMgr.socket.send(cc.globalMgr.msgIds.LEAVE_ROOM_NETID, cc.globalMgr.msgObjs.leaveRoom(data));
    },

    // //推筒子
    // OnPushBobbinClick: function () {
    //     //添加音效
    //     this.playClickMusic()
    //     cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestPlayerInRoombobbinCallFunc)

    // },
    // requestPlayerInRoombobbinCallFunc(target) {
    //     cc.globalMgr.SceneManager.getInstance().preloadScene("pushBobbinGame")
    // },
    // //牛牛
    // OnCowClick: function () {
    //     //添加音效
    //     this.playClickMusic();


    //     G.selectGameType = 4;
    //     cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestPlayerInRoomCowCallFunc)
    // },

    // //麻将
    // OnMahjongClick: function () {
    //     //添加音效
    //     this.playClickMusic()

    //     G.selectGameType = 9;
    //     cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestPlayerInRoomCowCallFunc)
    // },

    // //炸金花
    // OnZhaJinHuaClick: function () {
    //     //添加音效
    //     this.playClickMusic()

    //     G.selectGameType = 5;
    //     cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestPlayerInRoomCowCallFunc)
    // },
    // requestPlayerInRoomCowCallFunc(target) {
    //     cc.globalMgr.SceneManager.getInstance().preloadScene("mahjongGame")

    // },

    scrollImg() {
        this.spr_img1.position = cc.p(0, 0);
        this.spr_img2.position = cc.p(354, 0);
        this.spr_img3.potition = cc.p(708, 0);
        var moveTo1 = cc.moveTo(4, cc.p(-354, 0));
        var moveTo2 = cc.moveTo(8, cc.p(-354, 0));
        var moveTo3 = cc.moveTo(12, cc.p(-354, 0));

        var self = this;
        var callFunc1 = cc.callFunc(function () {
            self.spr_img1.position = cc.p(708, 0);
        });
        var callFunc2 = cc.callFunc(function () {
            self.spr_img2.position = cc.p(708, 0);
        });
        var callFunc3 = cc.callFunc(function () {
            self.spr_img3.position = cc.p(708, 0);
        });

        var callFuncEnd1 = cc.callFunc(function () {
            self.spr_img1.runAction(cc.repeatForever(cc.sequence(cc.moveTo(12, cc.p(-354, 0)), callFunc1)));
        });
        var callFuncEnd2 = cc.callFunc(function () {
            self.spr_img2.runAction(cc.repeatForever(cc.sequence(cc.moveTo(12, cc.p(-354, 0)), callFunc2)));
        });
        var callFuncEnd3 = cc.callFunc(function () {
            self.spr_img3.runAction(cc.repeatForever(cc.sequence(cc.moveTo(12, cc.p(-354, 0)), callFunc3)));
        });

        this.spr_img1.runAction(cc.sequence(moveTo1, callFunc1, callFuncEnd1));
        this.spr_img2.runAction(cc.sequence(moveTo2, callFunc2, callFuncEnd2));
        this.spr_img3.runAction(cc.sequence(moveTo3, callFunc3, callFuncEnd3));
    },

    //加入约牌
    onAddArrangeClick() {
        //添加音效
        this.playClickMusic()
        //先请求玩家有没有在房间内
        cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestJoinRoomPlayerInRoomCallFunc)
    },

    requestJoinRoomPlayerInRoomCallFunc(target) {
        console.log('加入约牌被点击了！');
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = target.node;
    },
});