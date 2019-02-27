
var MsgIds = require("MsgIds")
var MsgObjs = require("MsgObjs")
var Service = require("Service")

//产生随机数函数
function RndNum(n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        btn_wxLogon: {
            default: null,
            type: cc.Button
        },
        btn_agreement: {
            default: null,
            type: cc.Button
        },
        toggle_agreement: {
            default: null,
            type: cc.Toggle
        },
        layer_agreement: {
            default: null,
            type: cc.Node
        },
        btn_agreement_ok: {
            default: null,
            type: cc.Button
        },
        btn_agreement_close: {
            default: null,
            type: cc.Button
        },
        edit_userName: {
            default: null,
            type: cc.EditBox,
        },
    },

    // use this for initialization
    onLoad: function () {
        if (cc.sys.os == cc.sys.OS_WINDOWS) {
            this.edit_userName.node.active = true;
        } else {
            this.edit_userName.node.active = false;
        }
        this.toggle_agreement.isChecked = true

        this.connectSocket()
        this.addAndroidBackEvent()

    },

    connectSocket: function () {
        this.isSend = false
        var t_s = require("C_WSocket")
        var s = new t_s()
        cc.log(" ip ", G.IP)
        s.connect(G.IP, G.PORT);
        G.socketMgr.socket = s;
        G.socketMgr.close = function () {
            if (G.socketMgr.socket != undefined) {
                G.socketMgr.socket.close()
                G.socketMgr.socket = null;
            }
        }
        //处理消息分发

        cc.globalMgr.socketControl.startService()

    },
    WxLogon: function (dt) {
        G.mylog.push(" fuck wxlogon")

        if (G.socketMgr.socket.isConnected == true && this.isSend == false) {
            this.unschedule(this.WxLogon)

            this.isSend = true
            G.mylog.push("--222uid---", G.wxUserInfo.uid)
            G.mylog.push("--222sex---", G.wxUserInfo.sex)
            G.socketMgr.socket.send(MsgIds.LOGIN_REQUEST, MsgObjs.login(G.wxUserInfo.uid, G.wxUserInfo.nickname, G.wxUserInfo.headimgurl, G.wxUserInfo.sex))

            G.mylog.push(" --app尝试登录----")
        }
    },

    //网页登录
    webLogon: function (dt) {
        if (G.socketMgr.socket.isConnected == true && this.isSend == false) {
            this.isSend = true
            // G.socketMgr.socket.send(MsgIds.LOGIN_REQUEST, MsgObjs.login(RndNum(6), RndNum(6), "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIMibhc0u2ksurELC631A2UDdPaPKnLkCFO0BMEzCApG21vqSrY9tIDaP93DpgH8SF456ZVTWckujA/132", "男"))
            // cc.log("---登录账户---", this.edit_userName.getComponent(cc.EditBox).string)
            // if (this.edit_userName.getComponent(cc.EditBox).string)
            G.socketMgr.socket.send(MsgIds.LOGIN_REQUEST, MsgObjs.login(this.edit_userName.getComponent(cc.EditBox).string, this.edit_userName.getComponent(cc.EditBox).string, "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIMibhc0u2ksurELC631A2UDdPaPKnLkCFO0BMEzCApG21vqSrY9tIDaP93DpgH8SF456ZVTWckujA/132", "男"))
            // else
            // G.socketMgr.socket.send(MsgIds.LOGIN_REQUEST, MsgObjs.login(RndNum(6), RndNum(6), "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIMibhc0u2ksurELC631A2UDdPaPKnLkCFO0BMEzCApG21vqSrY9tIDaP93DpgH8SF456ZVTWckujA/132", "男"))
            // G.socketMgr.socket.send(MsgIds.LOGIN_REQUEST, MsgObjs.login(66664, 666666, "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIMibhc0u2ksurELC631A2UDdPaPKnLkCFO0BMEzCApG21vqSrY9tIDaP93DpgH8SF456ZVTWckujA/132", "男"))

        }
    },

    //同意协议点击
    CheckBoxClicked_agreement: function (toggle) {
        this.playClickMusic()
        if (toggle.isChecked) {
            cc.sys.localStorage.setItem("isAgreeAgreement", "true")
        } else {
            cc.sys.localStorage.setItem("isAgreeAgreement", "false")
        }
    },
    //点击用户协议
    onClickedButton_agreement: function () {
        this.playClickMusic()
        this.layer_agreement.active = true;
    },
    //微信登录
    onClickedButton_wx: function () {
        this.playClickMusic()
        if (this.toggle_agreement.isChecked == false) {
            // G.globalFunc.addMessageBox();
            cc.globalMgr.globalFunc.addMessageBox("同意用户协议，才能进入游戏");
            return;
        }

        // cc.globalMgr.globalFunc.addMessageBox("ceshi" + cc.sys.isBrowser);
        //如果是网页环境
        if (cc.sys.isBrowser) {
            cc.log("--网页登录---")
            //网页登录
            this.schedule(this.webLogon, 0.1)
        }
        // 如果是原生平台，调用微信登录
        else if (((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os))) {
            cc.log("--点击微信登录---")
            G.mylog.push("--点击微信登录--")
            cc.globalMgr.XlSDK.getInstance().login()
            G.mylog.push("--sdk下--")
            this.eventRegist("wxloginSuccess", this, this.WxLogonSuccess)
            this.eventRegist("wxloginfail", this, this.WxLogonfail)
            cc.log("--点击微信登录ss---")
        }
    },
    // 微信登录成功
    WxLogonSuccess: function (obj, target) {
        G.mylog.push(" 登录成功回调");
        cc.log(" fuck object ", obj)
        G.copyObject(G.wxUserInfo, obj)
        // cc.globalMgr.globalFunc.addWaittingConnection("正在登录,请稍后...");
        target.schedule(target.WxLogon, 0.1)
    },
    //微信登录失败
    WxLogonfail(obj, target) {
        cc.log(" 微信登录失败 ", obj)
        target.addMessageBox("微信授权失败，请重新尝试")
    },
    //用户协议确定点击
    onClickedButton_ok: function () {
        this.toggle_agreement.isChecked = true
        this.layer_agreement.active = false
        cc.sys.localStorage.setItem("isAgreeAgreement", "true")
    },
    //用户协议关闭点击
    onClickedButton_close: function () {
        this.layer_agreement.active = false
    },
    //账号登录
    onClickAccountLogin: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['accountLogin']);
        nodeCreateRoom.parent = this.node;
    },
    onDestroy: function () {
        Service.getInstance().unregist(this)
    }
});
