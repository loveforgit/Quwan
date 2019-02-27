
var comm = require("Comm")
var msgIds = require("MsgIds");
cc.Class({
    extends: comm,

    properties: {
        input_account: {
            default: null,
            type: cc.EditBox
        },
        input_password: {
            default: null,
            type: cc.EditBox
        },

        accTips: {
            default: null,
            type: cc.Node
        },
        // toggle_agreement: {
        //     default: null,
        //     type: cc.Toggle
        // },
        // layer_agreement: {
        //     default: null,
        //     type: cc.Node
        // },
        // btn_agreement_close: {
        //     default: null,
        //     type: cc.Button
        // },
    },

    onLoad() {
        this._accStr = "";
        this._passwordStr = "";
        this._name = "";
        // this.toggle_agreement.isChecked = true
        var info = this.getInfoFromLocal();
        if (info != null) {
            cc.log("------获取本地默认账号：", info);
            var num_01 = info.code;
            var num_02 = info.pass;

            this.input_account.string = num_01;
            this.input_password.string = num_02;
            this._accStr = num_01;
            this._passwordStr = num_02;
            this._name = info.name;
        }
        else {
            cc.log("------没有本地默认账号");
            this.input_account.string = "";
            this.input_password.string = "";
            this._accStr = "";
            this._passwordStr = "";
            this._name = "";
        }

        this.accTips.active = false;
    },

    //获取本地个人信息
    getInfoFromLocal() {
        var userData = JSON.parse(cc.sys.localStorage.getItem('codeData'));
        return userData;
    },

    start() {

    },
    //输入开始
    onStartClick: function () {
        this._accStr = this.input_account.string;
        this._passwordStr = this.input_password.string;
        cc.log("输入开始:", this._accStr, this._passwordStr);
    },

    //输入改变
    onChangeClick: function () {
        this._accStr = this.input_account.string;
        this._passwordStr = this.input_password.string;
        cc.log("输入改变:", this._accStr, this._passwordStr);
    },
    //输入结束
    onEndClick: function () {
        this._accStr = this.input_account.string;
        this._passwordStr = this.input_password.string;
        cc.log("输入结束:", this._accStr, this._passwordStr);
    },

    //提示显示
    showNumberTips: function (num) {
        if (isNaN(num) || this._accStr == "" || this._passwordStr == "") {
            cc.log("------显示");
            // this.accTips.active = true;
            // this.addHits("用户名或密码不正确")
        }
        else {
            cc.log("------关闭");
            // this.accTips.active = false;
        }
    },
    // //点击用户协议
    // onClickedButton_agreement: function () {
    //     this.playClickMusic()
    //     this.layer_agreement.active = true;
    // },
    // //用户协议关闭点击
    // onClickedButton_close: function () {
    //     this.layer_agreement.active = false
    // },
    sendLogin: function () {
        // if (this.toggle_agreement.isChecked == false) {
        //     // G.globalFunc.addMessageBox();
        //     cc.globalMgr.globalFunc.addMessageBox("同意用户协议，才能进入游戏");
        //     return;
        // } else {
        var inputNum = Number(this._passwordStr);
        cc.log("----- 查看pass输入转换：", inputNum);
        this.showNumberTips(inputNum);

        var data = new Object();
        data.zhuCe = 1;
        data.uid = this._accStr;
        data.username = this._name;
        data.pwd = this._passwordStr;
        // data.tourist = 1;

        this.send(msgIds.LOGIN_REQUEST, data);

        var data = {};
        data.code = this._accStr;
        data.pass = this._passwordStr;
        data.name = this._name;
        cc.log("----保存账号：", data);
        this.saveInfoToLocal(data);

        // }
    },

    //储存本地信息
    saveInfoToLocal(data) {
        var codeData = {};
        codeData = data;
        cc.log("-----存储个人登录账号密码：", codeData);

        cc.sys.localStorage.setItem('codeData', JSON.stringify(codeData));
    },

    // //注册
    // onClickRegister: function () {
    //     this.playClickMusic()
    //     this.OnLoaders("prefabs/login/prefab_userRegister", this.node.parent)
    // },
    //忘记密码
    onClickRetrive: function () {
        this.playClickMusic()
        this.OnLoaders("prefabs/login/prefab_retrive", this.node.parent)
    },
    OnClickClose: function () {
        //添加音效
        this.playClickMusic()

        this.node.destroy();
    },

});
