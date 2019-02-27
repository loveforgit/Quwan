var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        nickImage: {
            default: null,
            type: cc.Sprite
        },
        nickName: {
            default: null,
            type: cc.Label
        },
        nickID: {
            default: null,
            type: cc.Label
        },
        balanceShow: {
            default: null,
            type: cc.Label
        },
        goldShow: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.nickName.string = this.FormatName(G.myPlayerInfo.name);
        // this.nickID.string = "id:" + G.myPlayerInfo.wxId
        // this.balanceShow.string = this.FormatGold(G.myPlayerInfo.jinbi);
        // this.goldShow.string = this.FormatGold(G.myPlayerInfo.fk);

        this.sprMemberGray = this.node.getChildByName("topBar").getChildByName("spr_memberGray");
        this.sprMemberHigh = this.node.getChildByName("topBar").getChildByName("spr_memberHigh");

        this.updateUserinfoLayer("", this)
        //监听个人信息更新
        this.eventRegist("UPDATEUSERINFO", this, this.updateUserinfoLayer)
        //获取头像
        var that = this;
        if (G.myPlayerInfo.image) {
            cc.loader.load({ url: G.myPlayerInfo.image, type: 'png' }, function (err, tex) {
                that.nickImage.spriteFrame = new cc.SpriteFrame(tex);
            });
        };
    },

    refreshVipView (flag) {
        this.sprMemberGray.active = !flag;
        this.sprMemberHigh.active = flag;
    },

    //刷新个人信息界面
    updateUserinfoLayer(obj, target) {
        //--------------------------------个人信息--------------------------------
        target.nickName.string = target.FormatName(G.myPlayerInfo.name);
        target.nickID.string = "id:" + G.myPlayerInfo.wxId;
        target.balanceShow.string = target.FormatGold(G.myPlayerInfo.jinbi); ///乐币 需要监听
        target.goldShow.string = target.FormatGold(G.myPlayerInfo.fk); /// 享币  需要监听
        cc.log("is vip", G.myPlayerInfo.isVip)
        if(G.myPlayerInfo.isVip == 1)
        {
            target.nickName.node.color = new cc.Color(255,0,0)
            target.refreshVipView(true);
        }
        else{
            target.nickName.node.color = new cc.Color(255,255,255)
            target.refreshVipView(false);
        }
    },

    start() {

    },

    //关闭
    onCloseClick() {
        this.playClickMusic()

        console.log('关闭被点击了!');
        this.node.destroy();
        cc.audioEngine.stop();
    },

    //头像
    onHeadClick() {
        this.playClickMusic()

        //console.log('头像被点击了!');
        var scene = cc.director.getScene();
        var node = cc.instantiate(cc.globalRes['runNode_PlayInfo']);
        node.parent = scene;
        node.setPosition(640, 360);
        var audio = this.audio;
    },

    //斗地主
    onDouDiZhuClick() {
        this.playClickMusic()

        console.log('斗地主被点击了！');
        var curNode = cc.instantiate(cc.globalRes['runCardSelectList']);
        console.log('看下节点是否存在！');
        if (curNode !== undefined) {
            curNode.parent = this.node;
        }
    },

    //炸金花
    onTuoLaJiClick() {
        this.playClickMusic()
        G.RequireGameGoldType = G.TractorsType
        cc.globalMgr.SceneManager.getInstance().preloadScene("arrangeCard")
        //请求金币场数据
        // cc.globalMgr.GameFrameEngine.requsetGoldRoomInfo(G.TractorsType, this, this.requsetGoldRoomInfoCallFunc)
    },
    //请求金币场数据回调
    // requsetGoldRoomInfoCallFunc(target, body) {
    //     var curNode = cc.instantiate(cc.globalRes['runArrangeCardPrb']);
    //     if (curNode !== undefined) {
    //         curNode.getComponent("arrangeCard").initGoldInfo(body)
    //         curNode.parent = target.node;
    //         G.GameGlodType = body.gameId;
    //     }
    // },

    //保皇
    onBaoHuangClick() {
        this.playClickMusic()

        console.log('斗地主被点击了！');
        var stringForTips = "玩儿命研发中。。。";
        var parent = this.node;
        cc.globalMgr.globalFunc.addTips(stringForTips, parent);
    },

    //够级
    onGouJiClick() {
        this.playClickMusic()

        console.log('够级被点击了！');
        var stringForTips = "玩儿命研发中。。。";
        var parent = this.node;
        cc.globalMgr.globalFunc.addTips(stringForTips, parent);
    },

    //跑得快
    onPaoDeKuaiClick() {
        this.playClickMusic()

        console.log('跑得快被点击了！');
        var stringForTips = "玩儿命研发中。。。";
        var parent = this.node;
        cc.globalMgr.globalFunc.addTips(stringForTips, parent);
    },

    //加入约牌
    onJiaRuYuePaiClick() {
        this.playClickMusic()

        console.log('加入约牌被点击了！');
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = this.node;
    },

    //分享
    OnShareClick: function () {
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Share']);
        nodeCreateRoom.parent = this.node;
    },

    //客服
    OnServiceClick: function () {
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Service']);
        nodeCreateRoom.parent = this.node;
    },

    //邀请码
    OnBangAgentClick: function () {
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_BangVIP']);
        nodeCreateRoom.parent = this.node;
    },

    //商城
    OnShopClick: function () {
        this.playClickMusic()

        this.addTips("玩命研发中...", this.node)
    },

    //会员充值
    OnVipPayClick: function () {
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        // var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_VipPay']);
        nodeCreateRoom.parent = this.node;
    },

    //每日任务
    OnDayTaskClick: function () {
        this.playClickMusic()

        this.addTips("玩命研发中...", this.node)
    },

    //设置
    OnSettingClick: function () {
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Setting']);
        nodeCreateRoom.parent = this.node;
    },

    //回放
    OnRePlayClick: function () {
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_RePlay']);
        nodeCreateRoom.parent = this.node;
    },

    btnOnYanTaiMahjong () {
        //请求金币场数据
        // cc.globalMgr.GameFrameEngine.requsetGoldRoomInfo(G.MahjongYanTaiType, this, this.requsetGoldRoomInfoCallFunc);
        G.RequireGameGoldType = G.MahjongYanTaiType
        cc.globalMgr.SceneManager.getInstance().preloadScene("arrangeCard")
    },

    btnOnMoPingMahjong () {
        //请求金币场数据
        // cc.globalMgr.GameFrameEngine.requsetGoldRoomInfo(G.MahjongMoPingType, this, this.requsetGoldRoomInfoCallFunc);
        G.RequireGameGoldType = G.MahjongMoPingType
        cc.globalMgr.SceneManager.getInstance().preloadScene("arrangeCard")
    },

    //返回大厅
    onClickReturnHome(){
        this.playClickMusic()
        cc.globalMgr.SceneManager.getInstance().preloadScene("home")
    },

    btnOnMorePlay () {
        var stringForTips = "玩儿命研发中。。。";
        var parent = this.node;
        cc.globalMgr.globalFunc.addTips(stringForTips, parent);
    },
});





