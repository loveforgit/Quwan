
var comm = require("Comm")
var msgIds = require("MsgIds");
cc.Class({
    extends: comm,

    properties: {

        input_password: {
            default: null,
            type: cc.EditBox
        },
        input_password2: {
            default: null,
            type: cc.EditBox
        },
        //手机号
        input_PhoneNmu: {
            default: null,
            type: cc.EditBox
        },
        //验证码
        input_verificationCode: {
            default: null,
            type: cc.EditBox
        },

        accTips: {
            default: null,
            type: cc.Node
        },
        toggle_agreement: {
            default: null,
            type: cc.Node
        },
        layer_agreement: {
            default: null,
            type: cc.Node
        },
        agreement: {
            default: null,
            type: cc.Node
        },
        btn_agreement_close: {
            default: null,
            type: cc.Button
        },
        //手机
        node_shouji: {
            default: null,
            type: cc.Node
        },
        //验证码
        node_yanzhengma: {
            default: null,
            type: cc.Node
        },

        //密码
        node_mima: {
            default: null,
            type: cc.Node
        },
        //确认密码
        node_okmima: {
            default: null,
            type: cc.Node
        },
        //确认注册
        submitBtn: {
            default: null,
            type: cc.Node
        },
        //下一步
        nextStepBtn: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {
        this.accTips.active = false;
        // this.node_nicheng.active = false;
        this.node_mima.active = false;
        this.node_okmima.active = false;
        this.submitBtn.active = false;
        this.nextStepBtn.active = true;
        this.toggle_agreement.active = true;
        this.agreement.active = true;
        this.node_shouji.active = true;
        this.node_yanzhengma.active = true;
        this.registinformation();
    },

    start() {
        // this.accTips.active = false;
    },

    //输入结束
    onEndClick: function () {

        this._nickStr = this.input_password.string;
        this._passwordStr = this.input_password2.string;
        this._phoneStr = this.input_PhoneNmu.string;
        this._codeStr = this.input_verificationCode.string;
        cc.log("输入结束:", this._nickStr, this._passwordStr, this._phoneStr, this._codeStr);
    },

    //提示显示
    showNumberTips: function (num1, num2, num3) {
        if (isNaN(num1) || isNaN(num2) || isNaN(num3) || this._passwordStr == "" || this._phoneStr == "" || this._nickStr == "" || this._codeStr == "") {
            cc.log("------显示");
            this.accTips.active = true;
        }
        else {
            cc.log("------关闭");
            this.accTips.active = false;
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

    //发送请求验证码
    sendVerificationCode: function () {
        cc.log("-----手机号-------", this._phoneStr)
        cc.log("-----验证码号-------", this._codeStr)
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = msgIds.SMALL_FINDSENDTVERIFICATIONCODE;
        if (this.input_PhoneNmu.string != "") {
            data.phone = this.input_PhoneNmu.string
        }
        this.send(msgIds.REGISTER_MAIN_ID, data);

    },

    //服务器确认手机验证码
    onClicknextStepBtn() {
        
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = msgIds.BINDING_PHONENUMBER_MAIN_ID;
        data.phone = this._phoneStr;
        data.code = this._codeStr;

        this.send(msgIds.REGISTER_MAIN_ID, data);

    },

    //接收消息
    registinformation() {
        this.regist(msgIds.REGISTER_MAIN_ID, this, function (msgNumber, body, target) {
            if (body.zinetid == msgIds.BINDING_PHONENUMBER_MAIN_ID) {
                target.nextStepBtnOk(body.zinetid, body, target);
            }
            else if (body.zinetid == msgIds.SMALL_IMMEDIATEBINDING) {
                // target.nextStepBtnOk(body.zinetid, body, target);
            }

        })


    },
    // //验证成功回调
    // nextStepBtnOk(msgNumber, body, target) {

    //     cc.log("------是否验证成功---------", body.istrue)
    //     if (!body.istrue) {
    //         //注册不成功
    //     }
    //     else {
    //         target.toggle_agreement.active = false;
    //         target.agreement.active = false;
    //         target.submitBtn.active = true;
    //         target.nextStepBtn.active = false;
    //         target.node_shouji.active = false;
    //         target.node_yanzhengma.active = false;
    //         // target.node_nicheng.active = true;
    //         target.node_mima.active = true;
    //         target.node_okmima.active = true;
    //     }

    // },
    //提交注册
    submitRegister: function () {
        var inputNum_01 = Number(this._passwordStr);
        var inputNum_02 = Number(this._phoneStr);
        cc.log("----- 查看pass输入转换：", inputNum_01, inputNum_02);
        this.showNumberTips(inputNum_01, inputNum_02);

        var data = new Object();
        // data.uid = G.myPlayerInfo.uid;
        data.zinetid = msgIds.SMALL_FIND;
        data.uid = G.myPlayerInfo.uid;
        data.password = this._nickStr;
        data.password2 = this._passwordStr;
        data.phone = this._phoneStr;
        data.code = this._codeStr;
        this.send(msgIds.REGISTER_MAIN_ID, data);
        // this.regist(msgIds.REGISTER_MAIN_ID, this)
    },

    OnClickClose: function () {
        //添加音效
        this.playClickMusic()

        this.node.destroy();
    },

});
