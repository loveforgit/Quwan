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
        onLine_01: {
            default: null,
            type: cc.Label
        },
        onLine_02: {
            default: null,
            type: cc.Label
        },
        onLine_03: {
            default: null,
            type: cc.Label
        },
        onLine_04: {
            default: null,
            type: cc.Label
        },
        Field_node: {
            default: [],
            type: cc.Node
        },
        spr_Title: {
            default: [],
            type: cc.Node
        }
    },

    onLoad() {
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

        //请求金币场数据
        cc.globalMgr.GameFrameEngine.requsetGoldRoomInfo(G.RequireGameGoldType ,this, this.requsetGoldRoomInfoCallFunc )
        // console.log('经典斗被点击了！');
    },

    //请求金币场数据回调
    requsetGoldRoomInfoCallFunc(target, body){
 
        target.initGoldInfo(body)
        G.GameGlodType = body.gameId;
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
        target.balanceShow.string = target.FormatGold(G.myPlayerInfo.lebi); ///乐币 需要监听
        target.goldShow.string = target.FormatGold(G.myPlayerInfo.fk); /// 享币  需要监听
        cc.log("is vip", G.myPlayerInfo.isVip)
        if (G.myPlayerInfo.isVip == 1) {
            target.nickName.node.color = new cc.Color(255, 0, 0)
            target.refreshVipView(true);
        }
        else {
            target.nickName.node.color = new cc.Color(255, 255, 255)
            target.refreshVipView(false);
        }
    },

    start() {
        if (G.RequireGameGoldType == G.LandType) {
            this.InitTitleChese(this.spr_Title[5]);
        } else if (G.RequireGameGoldType == G.TractorsType) {
            this.InitTitleChese(this.spr_Title[2]);
        } else if (G.RequireGameGoldType == G.MahjongYanTaiType) {
            this.InitTitleChese(this.spr_Title[1]);
        } else if (G.RequireGameGoldType == G.MahjongMoPingType) {
            this.InitTitleChese(this.spr_Title[0]);
        }
    },
    //选择玩法标题
    InitTitleChese(node) {
        for (var i = 0; i < this.spr_Title.length; i++) {
            this.spr_Title[i].active = false;
        }
        node.active = true;
    },

    //关闭
    onCloseClick() {
        //添加音效
        this.playClickMusic()

        console.log('关闭被点击了!');
        this.node.destroy();
    },

    //回到上层界面
    onClickReturnLastLayer()
    {
        if(G.GameGlodType == G.LandType)
        {
            cc.globalMgr.SceneManager.getInstance().preloadScene("landSelectList")
        }
        else if(G.GameGlodType == G.TractorsType)
        {
            cc.globalMgr.SceneManager.getInstance().preloadScene("cardsGameSelect")
        }
        else if(G.GameGlodType == G.MahjongYanTaiType || G.GameGlodType == G.MahjongMoPingType)
        {
            cc.globalMgr.SceneManager.getInstance().preloadScene("mahjongGameSelect")
        }
    },

    //初始化经典斗地主数据
    initGoldInfo(body) {
        var listRoom = body.listRoom
        for (let i = 0; i < this.Field_node.length; i++) {

            const element = this.Field_node[i];
            var diZhuShow = element.getChildByName("diZhuShow")
            var needShow = element.getChildByName("needShow")
            var playCount = element.getChildByName("playCount")

            diZhuShow.getComponent(cc.Label).string = listRoom[i].diFen
            needShow.getComponent(cc.Label).string = listRoom[i].xianZhi
            playCount.getComponent(cc.Label).string = listRoom[i].renShu
            this.Field_node[i].roomdengji = listRoom[i].roomdengji
        }
    },

    //头像
    onHeadClick() {
        //添加音效
        this.playClickMusic()

        console.log('头像被点击了!');
        var scene = cc.director.getScene();
        var node = cc.instantiate(cc.globalRes['runNode_PlayInfo']);
        node.parent = scene;
        node.setPosition(640, 360);
        var audio = this.audio;
    },

    //会员充值
    OnVipPayClick: function () {
        //添加音效
        this.playClickMusic()
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        // var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_VipPay']);
        nodeCreateRoom.parent = this.node;
    },

    //初级场
    onPrimaryClick(target) {
        //添加音效
        this.playClickMusic()
        cc.globalMgr.GameFrameEngine.enterGoldRoom(this.Field_node[0].roomdengji, G.GameGlodType)
    },

    //中级场
    onIntermediateClick() {
        //添加音效
        this.playClickMusic()
        cc.globalMgr.GameFrameEngine.enterGoldRoom(this.Field_node[1].roomdengji, G.GameGlodType)
    },

    //高级场
    onAdvancedClick() {
        //添加音效
        this.playClickMusic()
        cc.globalMgr.GameFrameEngine.enterGoldRoom(this.Field_node[2].roomdengji, G.GameGlodType)
    },

    //大师场
    onMasterClick() {
        //添加音效
        this.playClickMusic()

        cc.globalMgr.GameFrameEngine.enterGoldRoom(this.Field_node[3].roomdengji, G.GameGlodType)
    },

    //好友约牌
    onFriendsClick() {
        //添加音效
        this.playClickMusic()

        //先请求玩家有没有在房间内
        cc.globalMgr.GameFrameEngine.requestPlayerInRoom(this, this.requestPlayerInRoomCallFunc)
    },
    //查询有没有在房间内，回调
    requestPlayerInRoomCallFunc(target) {
        var curNode = null;
        if (G.GameGlodType == G.LandType) {
            curNode = cc.instantiate(cc.globalRes['runCreateDDZPrb']);
        } else if (G.GameGlodType == G.TractorsType) {
            curNode = cc.instantiate(cc.globalRes['runCreateTractorsprb']);
        } else if (G.GameGlodType == G.MahjongYanTaiType) {
            curNode = cc.instantiate(cc.globalRes['runNode_createRoom']);
            var script = curNode.getComponent("CreateRoom");
            script.refreshView(1);
        } else if (G.GameGlodType == G.MahjongMoPingType) {
            curNode = cc.instantiate(cc.globalRes['runNode_createRoom']);
            var script = curNode.getComponent("CreateRoom");
            script.refreshView(2);
        }

        if (curNode !== null) {
            console.log('进入约牌！');
            curNode.parent = target.node;
        }
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
    }

});
