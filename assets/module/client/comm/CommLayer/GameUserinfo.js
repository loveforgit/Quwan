var comm = require("Comm")
var chatConfig = require("ChatConfig");

cc.Class({
    extends: comm,

    properties: {
        rtext_name: {
            default: null,
            type: cc.RichText,
        },
        rtext_winRate: {
            default: null,
            type: cc.RichText,
        },
        rtext_runAway: {
            default: null,
            type: cc.RichText,
        },
        rtext_id: {
            default: null,
            type: cc.RichText,
        },
        rtext_ip: {
            default: null,
            type: cc.RichText,
        },
        rtext_date: {
            default: null,
            type: cc.RichText,
        },
        spr_headIcon: {
            default: null,
            type: cc.Sprite,
        },
        node_magicFace: {
            default: null,
            type: cc.Node,
        },
        spr_woman: {
            default: null,
            type: cc.Node,
        },
        spr_man: {
            default: null,
            type: cc.Node,
        },
        spr_memberGray: {
            default: null,
            type: cc.Node,
        },
        spr_memberHigh: {
            default: null,
            type: cc.Node,
        },
        btn_kickAway: {
            default: null,
            type: cc.Node,
        },
        scroll_faceMsgContent: {
            default: null,
            type: cc.Node,
        },
        node_faceMsgItem: {
            default: null,
            type: cc.Node,
        },
        atlas_magicFace: {
            default: null,
            type: cc.SpriteAtlas,
        },
        scroll_faceMsg: {
            default: null,
            type: cc.ScrollView,
        },
        scroll_distanceContent: {
            default: null,
            type: cc.Node,
        },
        node_distanceItem: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        this.faceMsgItemHeight = 127;
        this.refreshVipView(false);
    },

    onTouchLayer() {
        this.node.destroy();
    },

    refreshUserInfo(userInfo) {
        cc.log("自己的个人信息 ", userInfo)
        this.rtext_name.string = this.FormatName(userInfo.name)
        this.rtext_id.string = userInfo.wxId + "";
        this.rtext_date.string = userInfo.stime;
        this.rtext_ip.string = userInfo.city;
        // this.rtext_winRate.string = userInfo.shengLv;
        // this.rtext_runAway.string = userInfo.taoLv;

        if (userInfo.sex === "男") {
            this.spr_man.active = true;
            this.spr_woman.active = false;
        } else if (userInfo.sex === "女") {
            this.spr_man.active = false;
            this.spr_woman.active = true;
        }

        if (userInfo.image !== null) {
            cc.globalMgr.globalFunc.getUrlHead(this.spr_headIcon, userInfo.image, 115);
        }

        // if (userInfo.isVip) {
        //     this.rtext_name.node.color = new cc.Color(255, 0, 0);
        //     this.refreshMemberUI(true);
        // }

        var runAwayRate = userInfo.taoLv;
        var runAwayRateNum = parseFloat(runAwayRate.replace("%", ""));
        if (runAwayRateNum >= 20) {
            this.rtext_name.node.color = new cc.Color(0, 0, 0);
        }
    },

    refreshMagicView(flag, targetWxId) {
        this.node_magicFace.active = !flag;
        this.targetWxId = targetWxId;
        // if (!flag) {
        //     this.initMagicFaceScrollView();
        // }

        if (cc.sys.OS_ANDROID === cc.sys.os || cc.sys.OS_IOS === cc.sys.os) {
            this.sendGetLocation();
        }
    },

    btnOnMagicClicked(event) {
        var msgId = event.target.parent.msgId;
        cc.log("msgId", msgId);
        this.sendMsg(this.targetWxId, msgId);
    },

    sendMsg(targetWxId, msgId) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = cc.globalMgr.msgIds.SMALL_MAGIC_FACE_ID;
        data.idx = msgId;
        data.targetWxId = targetWxId;

        G.socketMgr.socket.send(cc.globalMgr.msgIds.CHAT_MSG_FACE_MAIN_ID, cc.globalMgr.msgObjs.chatMagicFace(data));
        this.node.destroy();
    },

    refreshMemberUI(flag) {
        this.spr_memberGray.active = !flag;
        this.spr_memberHigh.active = flag;
    },

    btnKickAway() {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.tiWxid = this.targetWxId;

        G.socketMgr.socket.send(cc.globalMgr.msgIds.KICKAWAY_SEND, cc.globalMgr.msgObjs.kickAwaySend(data));
        this.node.destroy();
    },

    refreshVipViewJinBi(flag) {
        // this.btn_kickAway.active = flag;
    },

    refreshVipView(flag) {
        // this.scroll_faceMsg.horizontal = flag;
    },

    initMagicFaceScrollView(isVip) {
        var totolWidth = 0;
        var magicFaceTables = {};
        if (isVip) {
            magicFaceTables = Object.assign(chatConfig.magicFaceVipTables, chatConfig.magicFaceTables);
        } else {
            magicFaceTables = chatConfig.magicFaceTables;
        }
        var self = this;
        var index = 0;
        Object.keys(magicFaceTables).forEach(function (key) {
            var magicFaceItem = cc.instantiate(self.node_faceMsgItem);
            magicFaceItem.parent = self.scroll_faceMsgContent;
            magicFaceItem.active = true;
            magicFaceItem.position = cc.p(self.faceMsgItemHeight * index, 0);
            index += 1;
            magicFaceItem.msgId = key;
            totolWidth += self.faceMsgItemHeight;

            var spr_emoj = magicFaceItem.getChildByName("spr_emoj").getComponent(cc.Sprite);
            var sprFrameName = magicFaceTables[key];
            spr_emoj.spriteFrame = self.atlas_magicFace.getSpriteFrame(sprFrameName);
        })
        this.scroll_faceMsgContent.setContentSize(totolWidth, this.faceMsgItemHeight);
    },

    refreshScrollDistance(distanceArr) {
        var itemWidth = 372;
        var itemHeight = 20;
        var totolHeight = 0;
        this.scroll_distanceContent.removeAllChildren(true);
        for (var i = 0; i < distanceArr.length; i++) {
            var distanceItem = cc.instantiate(this.node_distanceItem);
            distanceItem.parent = this.scroll_distanceContent;
            distanceItem.active = true;
            distanceItem.position = cc.p(0, -i * itemHeight);
            totolHeight += itemHeight;

            var data = distanceArr[i];

            var distanceText = distanceItem.getChildByName("label_distance").getComponent(cc.Label);
            distanceText.string = data.name + " 距离 " + data.juli;
        }
        this.scroll_distanceContent.setContentSize(itemWidth, totolHeight);
    },

    sendGetLocation() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;                        //用户id
        obj.dianWxid = this.targetWxId;

        this.send(cc.globalMgr.msgIds.GET_LOCATION_ID, obj);
        this.regist(cc.globalMgr.msgIds.GET_LOCATION_ID, this, function (msgNumber, body, target) {
            target.unregist(target, cc.globalMgr.msgIds.GET_LOCATION_ID)
            target.refreshScrollDistance(body.listmodel);
        })
    },
});
