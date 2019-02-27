var comm = require("Comm")
cc.Class({
    extends: comm,
    // extends: cc.Component

    properties: {
        //注册界面
        node_OneBank: {
            default: null,
            type: cc.Node
        },
        //登录银行
        node_BankLoadPass: {
            default: null,
            type: cc.Node
        },
        //修改密码
        node_loginBank: {
            default: null,
            type: cc.Node
        },
        //提现界面
        node_bankShow: {
            default: null,
            type: cc.Node
        },
        // 0 姓名 1 卡号 2 取现密码 3 登录密码   注册界面
        // 4 登录密码                          登录密码界面
        // 5 原始密码  6 新密码                 更改密码界面
        // 7 提现金额  8 提款密码               提款界面

        node_user: {
            default: [],
            type: cc.EditBox
        }

    },

    onLoad() {
        this.AgentInit();
    },
    AgentInit: function () {
        var obj = new Object()
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.BANK_CHECKBANK
        G.socketMgr.socket.send(cc.globalMgr.msgIds.BANK_MAIN, obj);
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.BANK_MAIN, this, this.OnBackButtonFunc); // 绑定代理

    },

    start() {

    },
    OnClickClose: function () {
        this.playClickMusic()
        this.node.destroy();
    },


    OnClickBangAgent: function (sub, event) {
        this.playClickMusic()
        switch (event) {
            case "zhuce":
                //注册银行
                var obj = new Object()
                obj.uid = G.myPlayerInfo.uid;
                obj.bankName = this.node_user[0].string
                obj.bankNum = this.node_user[1].string
                obj.bankTakePwd = this.node_user[2].string
                obj.bankLoginPwd = this.node_user[3].string
                obj.zinetid = cc.globalMgr.msgIds.BANK_ZHUCEBANK
                G.socketMgr.socket.send(cc.globalMgr.msgIds.BANK_MAIN, obj);
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.BANK_MAIN, this, this.OnBackButtonFunc); // 绑定代理
                break;
            case "change":
                //修改登录密码
                var obj = new Object()
                obj.uid = G.myPlayerInfo.uid;
                obj.oldLoginPwd = this.node_user[5].string
                obj.newLoginPwd = this.node_user[6].string
                obj.zinetid = cc.globalMgr.msgIds.BANK_REFLOGINPWD
                G.socketMgr.socket.send(cc.globalMgr.msgIds.BANK_MAIN, obj);
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.BANK_MAIN, this, this.OnBackButtonFunc); // 绑定代理
                break;
            case "changetixian":
                //修改提现密码
                var obj = new Object()
                obj.uid = G.myPlayerInfo.uid;
                obj.oldLoginPwd = this.node_user[5].string
                obj.newLoginPwd = this.node_user[6].string
                obj.zinetid = cc.globalMgr.msgIds.BANK_REFTACKPWD
                G.socketMgr.socket.send(cc.globalMgr.msgIds.BANK_MAIN, obj);
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.BANK_MAIN, this, this.OnBackButtonFunc); // 绑定代理
                break;
            case "login":
                //登录银行
                var obj = new Object()
                obj.uid = G.myPlayerInfo.uid;
                obj.bankLoginPwd = this.node_user[4].string
                obj.zinetid = cc.globalMgr.msgIds.BANK_LOGONBANK
                G.socketMgr.socket.send(cc.globalMgr.msgIds.BANK_MAIN, obj);
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.BANK_MAIN, this, this.OnBackButtonFunc); // 绑定代理
                break
            case "changePadd":
                //修改密码界面
                this.node_loginBank.active = true;
                break;
            case "tixain":
                //提现
                var obj = new Object()
                obj.uid = G.myPlayerInfo.uid;
                obj.jinbi = this.node_user[7].string
                obj.TakePwd = this.node_user[8].string
                obj.zinetid = cc.globalMgr.msgIds.BANK_TACKJINBI
                G.socketMgr.socket.send(cc.globalMgr.msgIds.BANK_MAIN, obj);
                cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.BANK_MAIN, this, this.OnBackButtonFunc); // 绑定代理
                break;
        }


    },

    OnBackButtonFunc(msgNumber, body, target) {
        switch (body.zinetid) {
            case cc.globalMgr.msgIds.BANK_CHECKBANK:
                //查询是否绑定过
                target.OnLookBankUser(body.type)
                break;
            case cc.globalMgr.msgIds.BANK_ZHUCEBANK:
                //注册银行
                cc.globalMgr.globalFunc.addMessageBox(body.msg);
                target.OnClickClose()
                break;
            case cc.globalMgr.msgIds.BANK_LOGONBANK:
                //登录银行 成功 可以弹出取款界面了
                target.node_bankShow.active = true
                cc.globalMgr.globalFunc.addMessageBox(body.msg);

                break;
            case cc.globalMgr.msgIds.BANK_REFLOGINPWD:
                //修改密码
                target.node_loginBank.active = false;
                cc.globalMgr.globalFunc.addMessageBox(body.msg);
                break;
                case cc.globalMgr.msgIds.BANK_TACKJINBI:
                //提现成功
                cc.globalMgr.globalFunc.addMessageBox(body.msg);
                target.OnClickClose()
                break;
        }
    },
    OnLookBankUser(type) {
        if (type) {
            this.node_OneBank.active = false
            this.node_BankLoadPass.active = true;

        } else {
            this.node_OneBank.active = true
            this.node_BankLoadPass.active = false;
        }

    },

    onDestroy: function () {
        cc.globalMgr.service.getInstance().unregist(this)

    },
});
