
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        btn_close: {
            default: null,
            type: cc.Button
        },
        lable_name: {
            default: null,
            type: cc.Label
        },
        spr_vip: {
            default: null,
            type: cc.Node
        },
        lable_uid: {
            default: null,
            type: cc.Label
        },
        lable_leNum: {
            default: null,
            type: cc.Label
        },
        lable_xiangNum: {
            default: null,
            type: cc.Label
        },
        lable_ip: {
            default: null,
            type: cc.Label
        },

        sprite_playImage: {
            default: null,
            type: cc.Sprite
        },

        label_WinLv: {
            default: null,
            type: cc.Label
        },

        label_levelLv: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.updateUserinfoLayer("", this)
        //监听个人信息更新
        this.eventRegist("UPDATEUSERINFO", this, this.updateUserinfoLayer)

        this.lable_ip.string = G.myPlayerInfo.ip;
        this.label_WinLv.string = G.myPlayerInfo.shengLv
        this.label_levelLv.string = G.myPlayerInfo.taoLv

        var that = this;
        if (G.myPlayerInfo.image) {
            cc.loader.load({ url: G.myPlayerInfo.image, type: 'png' }, function (err, tex) {
                that.sprite_playImage.spriteFrame = new cc.SpriteFrame(tex)

            });
        }
    },

    //刷新个人信息界面
    updateUserinfoLayer(obj, target) {
        //--------------------------------个人信息--------------------------------
        target.lable_name.string = "昵称：" + target.FormatName(G.myPlayerInfo.name);
        cc.log("---姓名---", G.myPlayerInfo.name)
        target.lable_uid.string = "" + G.myPlayerInfo.wxId;
        // target.lable_leNum.string = target.FormatGold(G.myPlayerInfo.jinbi); ///乐币 需要监听
        // target.lable_xiangNum.string = target.FormatGold(G.myPlayerInfo.fk); /// 享币  需要监听
        // cc.log("is vip", G.myPlayerInfo.isVip)
        // if (G.myPlayerInfo.isVip == 1) {
        //     target.lable_name.node.color = new cc.Color(255, 0, 0)
        //     target.spr_vip.getChildByName("spr_vipNo").active = true;
        //     target.spr_vip.getChildByName("spr_vipOFF").active = false;
        // }
        // else {
        //     target.lable_name.node.color = new cc.Color(255, 255, 255)
        //     target.spr_vip.getChildByName("spr_vipNo").active = false;
        //     target.spr_vip.getChildByName("spr_vipOFF").active = true;
        // }
    },


    start() {


    },

    onClickPlayInfoClose_button: function () {
        //添加音效
        this.playClickMusic()

        cc.log("----关闭弹窗---")
        this.node.destroy();
    },
    onClickplayinfoXiangAdd_button: function () {
        //添加音效
        this.playClickMusic()

        /// 购买享币 todo
        cc.log("----购买享币----")
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        nodeCreateRoom.parent = this.node;
    },
    onClickplayinfoLeAdd_button: function () {
        //添加音效
        this.playClickMusic()

        /// 购买乐币 todo
        cc.log("----购买乐币----")
        var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_Shop']);
        nodeCreateRoom.parent = this.node;
    },
    onClickplayinfoVIP_button: function () {
        //添加音效
        this.playClickMusic()
        if (G.myPlayerInfo.isVip == 0) {
            var nodeCreateRoom = cc.instantiate(cc.globalRes['runPrefab_VipPay']);
            // nodeCreateRoom.parent = this.node;
            var curScene = cc.director.getScene();
            var size = cc.director.getWinSize();
            nodeCreateRoom.position = cc.p(size.width / 2, size.height / 2);
            nodeCreateRoom.parent = curScene;
            this.node.destroy();
        }
    },
    onClickplayinfoCopy_button: function () {
        //添加音效
        this.playClickMusic()
        this.copyString(G.myPlayerInfo.wxId)
        /// 拷贝游戏id todo
        cc.log("----复制游戏id----")
    }

});



