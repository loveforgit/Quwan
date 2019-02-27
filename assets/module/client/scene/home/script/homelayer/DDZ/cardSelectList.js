var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        nickImage:{
            default: null,
            type: cc.Sprite
        },
        nickName:{
            default: null,
            type: cc.Label
        },
        nickID:{
            default: null,
            type: cc.Label
        },
        balanceShow:{
            default: null,
            type: cc.Label
        },
        goldShow:{
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sprMemberGray = this.node.getChildByName("topBar").getChildByName("spr_memberGray");
        this.sprMemberHigh = this.node.getChildByName("topBar").getChildByName("spr_memberHigh");

        this.updateUserinfoLayer("", this)
        //监听个人信息更新
        this.eventRegist("UPDATEUSERINFO", this, this.updateUserinfoLayer)

        //获取头像
        var that = this;
        if(G.myPlayerInfo.image){
            cc.loader.load({url: G.myPlayerInfo.image, type:'png'}, function(err, tex){
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
        target.balanceShow.string = target.FormatGold(G.myPlayerInfo.lebi); ///乐币 需要监听
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

    start () {

    },

    
    //头像
    onHeadClick(){
        //添加音效
        this.playClickMusic()

        //console.log('头像被点击了!');
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

    //关闭
    onCloseClick(){
        //添加音效
        this.playClickMusic()

        console.log('关闭被点击了!');
        this.node.destroy();
    },

    //回到扑克牌 场景
    onClickCardsSelectScene()
    {
        cc.globalMgr.SceneManager.getInstance().preloadScene("cardsGameSelect")
    },

    //癞斗
    onLaiDouClick(){
        //添加音效
        this.playClickMusic()

        console.log('癞斗被点击了!');
        var stringForTips = "待开发，敬请期待。。。";
        var parent = this.node;
        cc.globalMgr.globalFunc.addTips(stringForTips, parent);
    },

    //经典斗
    onJingDianDouClick(){
        //添加音效
        this.playClickMusic()

        G.RequireGameGoldType = G.LandType
        cc.globalMgr.SceneManager.getInstance().preloadScene("arrangeCard")
    },
    
    //欢斗
    onHuanDouClick(){
        //添加音效
        this.playClickMusic()

        console.log('欢斗被点击了！');
        var stringForTips = "待开发，敬请期待。。。";
        var parent = this.node;
        cc.globalMgr.globalFunc.addTips(stringForTips, parent);
    },

    //响应android java的加入语音房间成功  
    OnJoinVoiceRoom:function(){  
        config.JoinVoiceRoom=true;  
        if ((cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) && cc.sys.isBrowser !== true) {  
                // 开启扬声器  
                jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'GVoiceOpenSpeaker', '()V');  
            }  
    }, 

});
