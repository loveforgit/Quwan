var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //创建人姓名
        nameShow: {
            default: null,
            type: cc.Label
        },
        //ID
        idShow: {
            default: null,
            type: cc.Label
        },
        //头像图片
        imageShow: {
            default: null,
            type: cc.Sprite
        },

    },

    //姓名， id, 房间数，人数，头像
    updateItem: function (nickname, wxid, img, uid, clubID) {
        //设置ID
        this.clubid = clubID
        this._selfId = uid
        this.nameShow.string = nickname + "申请加入俱乐部";
        this.idShow.string = wxid;
        var image = img
        if(image == '')
        {
            image = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIMibhc0u2ksurELC631A2UDdPaPKnLkCFO0BMEzCApG21vqSrY9tIDaP93DpgH8SF456ZVTWckujA/132'
        }
        var that = this;
        cc.loader.load({ url: image, type: 'png' }, function (err, tex) {
            that.imageShow.spriteFrame = new cc.SpriteFrame(tex)
        });
    },

    //屏蔽
    onShieldClick: function () {
        cc.log("屏蔽被点击了");
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SAMLL_HIDE_PLYAER_APPLY;
        obj.clubId = this.clubid;
        obj.otherUid = this._selfId;

        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },

    //拒绝
    onRejectClick: function () {
        cc.log("拒绝被点击了");
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SAMLL_REFUSE_PLAYER_JOIN_MYCLUB;
        obj.clubId = this.clubid;
        obj.otherUid = this._selfId;
        obj.msg = ''

        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },

    //同意
    onAgreeClick: function () {
        cc.log("同意被点击了");
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_AGREE_PLAYER_JOIN_MYCLUB;
        obj.clubId = this.clubid;
        obj.otherUid = this._selfId;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },
});
