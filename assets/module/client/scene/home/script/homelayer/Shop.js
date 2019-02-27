
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
    
        lable_xiangNum: {
            default: null,
            type: cc.Label
        },
        node_web: {
            default: null,
            type: cc.Node
        },
        webview: {
            default: null,
            type: cc.WebView
        },
        node_pay: {
            default: null,
            type: cc.Node
        },
        // node_selectDiamond: {
        //     default: null,
        //     type: cc.Node
        // },
        // node_selectGold: {
        //     default: null,
        //     type: cc.Node
        // },
       
        node_chargeRecord: {
            default: null,
            type: cc.Node,
        },
        scroll_record: {
            default: null,
            type: cc.ScrollView,
        },
        scroll_recordContent: {
            default: null,
            type: cc.Node,
        },
        node_recordItem: {
            default: null,
            type: cc.Node,
        },
        // node_Change: {
        //     default: [],
        //     type: cc.Node,
        // },

        // Toggle_select: {
        //     default: [],
        //     type: cc.Toggle,
        // },
    },

    OnClickClose: function (sub, event) {
        if (event == "shopbg") {
            //添加音效
            this.playClickMusic()
            this.node.destroy();
            cc.log("--关闭商城--")
        } else if (event == "pay") {
            this.node_pay.active = false;
            cc.log("--关闭选择支付界面--")
        } else if (event == "endpay") {
            this.node_web.active = false;
            cc.log("--关闭内置浏览器--")
        }

    },
    onLoad() {

        // this.PlayShouChong();
        // this.lable_leNum.string = this.FormatGold(G.myPlayerInfo.jinbi); ///乐币 需要监听
        this.lable_xiangNum.string = this.FormatGold(G.myPlayerInfo.fk); /// 享币  需要监听
        this.paytype = 88;
        this.payNum = 0;

        this.scrollWidth = 817;
        this.recordItemHeight = 40;
        //购买钻石金币数
        this.shop_numArray = [18, 30, 68, 128, 228, 328];
    },

    start() {

    },
    // //首充标志
    // PlayShouChong() {
    //     cc.log("----商城打开----")
    //     if (G.myPlayerInfo.isShouChong) {
    //         this.spr_shouchong.active = false;
    //     } else {
    //         this.spr_shouchong.active = true;
    //     }
    // },

    OnClickCoinNum: function (event, customEventData) {
        switch (customEventData) {
            case "1":
                cc.log(this.shop_numArray[0], "---0--钻");
                this.payNum = this.shop_numArray[0];
                break
            case "2":
                cc.log(this.shop_numArray[1], "---1--钻");
                this.payNum = this.shop_numArray[1];
                break
            case "3":
                cc.log(this.shop_numArray[2], "---2--钻");
                this.payNum = this.shop_numArray[2];
                break
            case "4":
                cc.log(this.shop_numArray[3], "---3--钻");
                this.payNum = this.shop_numArray[3];
                break
            case "5":
                cc.log(this.shop_numArray[4], "---4--钻");
                this.payNum = this.shop_numArray[4];
                break
            case "6":
                cc.log(this.shop_numArray[5], "---5--钻");
                this.payNum = this.shop_numArray[5];
                break
        }
        if (this.payNum) {
            this.node_pay.active = true;
        }
    },

    // //选择钻石或金币
    // OnClickSelectDiamondOrGold: function (event, customEventData) {
    //     switch (customEventData) {
    //         case "1":
    //             this.changenode(0);
    //             break
    //         case "2":
    //             this.changenode(1);
    //             break
    //     }
    // },

    // changenode: function (index) {
    //     for (var i = 0; i < this.node_Change.length; i++) {
    //         this.node_Change[i].active = false;
    //     }
    //     this.node_Change[index].active = true;
    // },

    // setToggleisCheck: function (index) {
    //     for (var i = 0; i < this.Toggle_select.length; i++) {
    //         this.Toggle_select[i].isChecked = false;
    //     }
    //     this.Toggle_select[index].isChecked = true;
    // },

    //商城支付
    shopPay: function (uid, money, pingtai, zftype) {
        cc.log("_-微信支付--", uid, money, pingtai, zftype)
        G.socketMgr.socket.send(cc.globalMgr.msgIds.PAY_RESPONSE, cc.globalMgr.msgObjs.ShopPay(uid, money, pingtai, zftype));
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.PAY_RESPONSE, this, this.OnShopPay); // 绑定代理
    },
    OnShopPay: function (msgNumber, body, target) {
        cc.log("-msgNumber---", msgNumber)
        cc.log("-body---", body)
        cc.log("-target---", target)
        if (body.url) {
            cc.log("--是时候打开网页支付了--");
            // target.node_web.active = true;
            cc.log("--cc.web---", target.webview.url)
            cc.log("--pryhttp--", body.url)
            // target.webview.url = body.url
            target.openUrl(body.url)
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
            var money = this.payNum;
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
            this.shopPay(uid, money, pingtai, zftype)
        }
    },

    // onClickChargeRecord() {
    //     var data = new Object();
    //     data.uid = G.myPlayerInfo.uid;
    //     G.socketMgr.socket.send(cc.globalMgr.msgIds.CHARGE_RECORD_SEND, cc.globalMgr.msgObjs.chargeRecordSend(data));
    //     this.addWaittingConnection("正在请求数据，请稍后")

    //     this.regist(cc.globalMgr.msgIds.CHARGE_RECORD_SEND, this, function (msgNumber, body, target) {
    //         cc.log("请求金币场数据")
    //         target.removeWaittingConnection()
    //         //移除监听
    //         target.unregist(target, cc.globalMgr.msgIds.CHARGE_RECORD_SEND)

    //         target.refreshScrollView(body.payList);
    //     })
    // },

    // refreshScrollView(records) {
    //     this.node_chargeRecord.active = true;
    //     var totolHeight = 0;
    //     this.scroll_recordContent.removeAllChildren(true);
    //     for (var i = 0; i < records.length; i++) {
    //         var recordItem = cc.instantiate(this.node_recordItem);
    //         recordItem.parent = this.scroll_recordContent;
    //         recordItem.active = true;
    //         recordItem.position = cc.p(0, -i * this.recordItemHeight);
    //         totolHeight += this.recordItemHeight;

    //         var data = records[i];

    //         var numberText = recordItem.getChildByName("label_number").getComponent(cc.Label);
    //         numberText.string = data.orderid;
    //         var numText = recordItem.getChildByName("label_num").getComponent(cc.Label);
    //         numText.string = data.addnum;
    //         var moneyText = recordItem.getChildByName("label_money").getComponent(cc.Label);
    //         moneyText.string = data.money;
    //         var invitText = recordItem.getChildByName("label_invit").getComponent(cc.Label);
    //         invitText.string = data.tuijianma;
    //         // var stateText = recordItem.getChildByName("label_state").getComponent(cc.Label);
    //         // stateText.string = data.state;
    //         var timeText = recordItem.getChildByName("label_time").getComponent(cc.Label);
    //         timeText.string = data.setdate;
    //     }
    //     this.scroll_recordContent.setContentSize(this.scrollWidth, totolHeight);
    // },

    // onCloseChargeRecord() {
    //     this.node_chargeRecord.active = false;
    // },
});
