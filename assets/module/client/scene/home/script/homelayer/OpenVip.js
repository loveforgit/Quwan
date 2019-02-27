
var comm = require("Comm")
var MsgIds = require("MsgIds")
cc.Class({
    extends: comm,

    properties: {
        Node_vip: {
            default: null,
            type: cc.Node
        },
        Node_endVip: {
            default: null,
            type: cc.Node
        },
        node_vipPay: {
            default: null,
            type: cc.Node
        }
    },


    onLoad() {
        this.VipPayNum = 100;
        cc.globalMgr.service.getInstance().regist(MsgIds.CHARGE_SUCCESS_RET, this, this.onChargeSuccess);
    },

    start() {


    },
    OnClickOpenVip: function () {
        //添加音效
        this.playClickMusic()

        this.Node_vip.active = false;
        this.Node_endVip.active = true;
    },
    OnClickEndVip: function () {
        //添加音效
        this.playClickMusic()

        //开通会员
        cc.log("---开通会员----")
        // var obj = new Object()
        // obj.uid = G.myPlayerInfo.uid
        // this.send(MsgIds.BUY_VIP, obj)
        // this.regist(MsgIds.BUY_VIP, this, this.buyVipCallFunc)
        this.node_vipPay.active = true;

    },
    //购买vip返回结果
    buyVipCallFunc(msgNumber, obj, target) {
        cc.log("buy vip data", obj)
        target.node.destroy();
    },
    OnClickGoBack: function (event, customEventData) {
        //添加音效
        this.playClickMusic()

        switch (customEventData) {
            case "GoBack":
                this.Node_vip.active = true;
                this.Node_endVip.active = false;
                break;
            case "GoHome":
                this.node.destroy();
                break;

        }
    },
    OnClickClose: function (sub, event) {
        if (event == "shopbg") {
            //添加音效
            this.playClickMusic()
            this.node.destroy();
            cc.log("--关闭商城--")
        } else if (event == "pay") {
            this.node_vipPay.active = false;
            cc.log("--关闭选择支付界面--")
        } else if (event == "endpay") {
            this.node_web.active = false;
            cc.log("--关闭内置浏览器--")
        }

    },
    OnClickPayType: function (sub, eve) {
        switch (eve) {
            case "wxpay":
                this.paytype = 1;
                break;
            case "zfbpay":
                this.paytype = 0;
                break;
        }

        if (this.paytype != 88) {
            var uid = G.myPlayerInfo.uid;
            var money = this.VipPayNum;
            var pingtai, zftype;
            var zftype = 1;
            //支付平台 安卓
            if (cc.sys.OS_ANDROID == cc.sys.os && cc.sys.isBrowser !== true) {
                pingtai = 3;
                cc.log("--平台--安卓")
            }
            //苹果
            else if (cc.sys.OS_IOS == cc.sys.os) {
                pingtai = 2;
                cc.log("--平台--苹果")
            }
            //其他
            else {
                pingtai = 1;
                cc.log("--平台--pc")
            }
            //支付类型 1，微信 0 ，支付宝
            if (this.paytype == 1) {
                zftype = 1;
            } else {
                zftype = 0;
            }
            this.shopPay(uid, pingtai, zftype)
        }
    },
    //商城支付
    shopPay: function (uid, pingtai, zftype) {
        cc.log("_-微信支付--", uid, pingtai, zftype)
        var Obj = new Object();
        Obj.uid = uid;
        Obj.pingtai = pingtai;
        Obj.zftype = zftype;
        G.socketMgr.socket.send(MsgIds.BUY_VIP, Obj);
        cc.globalMgr.service.getInstance().regist(MsgIds.BUY_VIP, this, this.OnShopPay);
    },
    OnShopPay: function (msgNumber, body, target) {
        cc.log("-msgNumber---", msgNumber)
        cc.log("-body---", body)
        cc.log("-target---", target)
        if (body.url) {
            cc.log("--是时候打开网页支付了--");
            // target.node_web.active = true;
            cc.log("--pryhttp--", body.url)
            // target.webview.url = body.url
            target.openUrl(body.url)
        }
    },

    onChargeSuccess (msgNumber, body, target) {
        cc.log("充值成功返回了");
        target.node.destroy();
        var msg = "充值成功";
        cc.globalMgr.globalFunc.addMessageBox(msg);
    },
});
