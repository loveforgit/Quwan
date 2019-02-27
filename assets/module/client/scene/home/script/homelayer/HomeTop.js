var comm = require("Comm");
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
    },

    onLoad() {
        //获取用户头像
        var that = this;
        if (G.myPlayerInfo.image) {
            cc.loader.load({ url: G.myPlayerInfo.image, type: 'png' }, function (err, tex) {
                that.sprite_playImage.spriteFrame = new cc.SpriteFrame(tex)
            });
        }
        this.updateUserinfoLayer("", this)
    },

    //刷新个人信息界面
    updateUserinfoLayer(obj, target) {
        //--------------------------------个人信息--------------------------------
        this.text_name.string = target.FormatName(G.myPlayerInfo.name);
        target.num_plalyid.string = "ID:" + G.myPlayerInfo.wxId;
        target.lable_goldNum.string = target.FormatGold(G.myPlayerInfo.jinbi); ///乐币 需要监听
        target.lable_diamondNum.string = target.FormatGold(G.myPlayerInfo.fk); /// 享币 需要监听
    },

    //点击用户头像
    onClickedButton_handfram: function () {
        //添加音效
        this.playClickMusic()

        var scene = cc.director.getScene();
        var node = cc.instantiate(cc.globalRes['runNode_PlayInfo']);
        node.parent = scene;
        node.setPosition(640, 360);
        var audio = this.audio;
    },

    onClickhomeDiamondAdd_button: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        nodeCreateRoom.parent = this.node;
    },

    onClickhomeGoldAdd_button: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        nodeCreateRoom.parent = this.node;
    },

 
    //设置
    OnClickSetting: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Setting']);
        nodeCreateRoom.parent = this.node;
        nodeCreateRoom.getComponent("Setting").setBgMusicId(this.homeMusicId)
    },

    //规则
    OnClickRule: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Rule']);
        nodeCreateRoom.parent = this.node;
    },

    //创建房间
    OnClickCreateRoom: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createRoom']);
        nodeCreateRoom.parent = this.node;
    },

    //加入房间
    OnClickJoinRoom: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = this.node;
    },

    start() {

    },

    // update (dt) {},
});