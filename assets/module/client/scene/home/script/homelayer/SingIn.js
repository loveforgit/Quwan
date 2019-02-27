
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {

        Label_DayArray: {
            default: [],
            type: [cc.Label]
        },
        Label_Month: {
            default: null,
            type: cc.Label
        },
        Label_SingNum: {
            default: null,
            type: cc.Label
        },
        ProgressBar_Singin: {
            default: [],
            type: cc.ProgressBar
        },
        Label_QianDayNum: {
            default: null,
            type: cc.Label
        },
        prefab_OpenVip: {
            default: null,
            type: cc.Prefab
        },
        Sprite_awardArray: {
            default: [],
            type: [cc.Node]
        },
        Button_awardArray: {
            default: [],
            type: [cc.Button]
        },
        node_JinDU: {
            default: null,
            type: cc.Node
        }
    },
    onLoad() {
        this.DayNum = [];
        this.InitCurrentDayNum();
        //this.InitCurrentDay();
        this.InitgLobalMgr();
        this.times = 1;
        this.dayMonthNumMax = 0;

    },

    start() {

    },
    InitgLobalMgr: function () {
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.SINGIN_ALLNUM_RESPONSE, this, this.onSingAllDayFunc); // 本月签到天数
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.SINGIN_MSG_RESPONSE, this, this.OnSingAllNum); // 获取签到几天 领奖品
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.SINGIN_RESPONSE, this, this.onSingInButtonFunc); // 日常签到
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.SINGIN_PRIZE_RESPONSE, this, this.onSingInButtonFunc); // 签到几天领奖
    },
    //点击签到
    OnClickEndSing: function () {
        //添加音效
        this.playClickMusic()
        var uid = G.myPlayerInfo.uid;
        cc.log("--签到时间---", this.times)
        G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_RESPONSE, cc.globalMgr.msgObjs.SingInDay(uid));// 日常签到
        G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_MSG_RESPONSE, cc.globalMgr.msgObjs.SingInDay(uid)); // 签到消息查询
        G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_ALLNUM_RESPONSE, cc.globalMgr.msgObjs.SingInDay(uid)); // 本月签到次数
        this.times++;
    },
    OnClickOpenVip: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(this.prefab_OpenVip);
        nodeCreateRoom.parent = this.node;
    },
    OnClickClose: function () {
        //添加音效
        this.playClickMusic()

        this.node.destroy();
    },
    //签到日历
    InitCurrentDay: function (Str, isbool, SingNum) {

        var curDate = new Date();
        /* 获取当前月份 */
        var curMonth = curDate.getMonth() + 1;
        curDate.setMonth(curMonth);
        curDate.setDate(0);
        var DayMonthNum = curDate.getDate();//当月总天数
        //cc.log("----月份位---" , curMonth)
        //cc.log("----总天数-------" ,  DayMonthNum);

        var fet = this;
        var systemDate = new Date();
        // 获取当年
        var year = systemDate.getFullYear();
        var month = systemDate.getMonth() + 1; //systemDate.getMonth() + 1;
        var week = 0;
        switch ((new Date(year + '-' + month + '-1')).getDay()) {
            case 1:
                week = 1;
                break;
            case 2:
                week = 2;
                break;
            case 3:
                week = 3;
                break;
            case 4:
                week = 4;
                break;
            case 5:
                week = 5;
                break;
            case 6:
                week = 6;
                break;
            default:
                week = 0;
        }

        for (var i = 0; i < DayMonthNum; i++) {
            this.Label_DayArray[i + week].string = i + 1 + "";
            if (i == (DayMonthNum - 1)) {
                //cc.log("----最后一天--", i)
                fet.Label_DayArray[i + week].node.getChildByName("spr_yue").active = true;
            }
        }
        ///让签到过的日期图片亮出来
        for (var i = 0; i < 35; i++) {
            if (fet.Label_DayArray[i].string == Str && isbool) {
                fet.Label_DayArray[i].node.getChildByName("spr_Sing").active = true;
            }
        }

        this.Label_Month.string = year + "年" + month + "月";
        this.Label_SingNum.string = "本月累计签到" + SingNum + "天";
        this.ProgressBarPlan(DayMonthNum, SingNum, )
        this.dayMonthNumMax = DayMonthNum;
    },
    //签到天数，累计领奖
    InitCurrentDayNum: function () {
        var uid = G.myPlayerInfo.uid;
        G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_MSG_RESPONSE, cc.globalMgr.msgObjs.SingInDay(uid)); // 签到消息查询
        G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_ALLNUM_RESPONSE, cc.globalMgr.msgObjs.SingInDay(uid)); // 本月签到次数
    },
    ///签到进度条
    ProgressBarPlan: function (ProNum, week) {
        var fet = this;
        this.progressBarPlanBG(week, ProNum);
        fet.Label_QianDayNum.string = "当月签到进度" + week + "/" + ProNum;
        fet.node_JinDU.getChildByName("label_leiji").active = true;
    },
    //进度条显示
    progressBarPlanBG: function (week, DayNum) {
        //cc.log("---本月--", DayNum);
        //cc.log("---签到--", week);
        var fet = this;

        for (var i = 0; i < this.ProgressBar_Singin.length; i++) {
            this.ProgressBar_Singin[i].node.active = false;
        }
        if (week <= 5) {
            var Num = week / DayNum;
            this.ProgressBar_Singin[0].node.active = true;
            fet.ProgressBar_Singin[0].progress = Num * 6;
        }
        else if (week > 5 && week <= 10) {
            week -= 5;
            var Num = week / DayNum;
            this.ProgressBar_Singin[0].node.active = true;
            this.ProgressBar_Singin[1].node.active = true;
            fet.ProgressBar_Singin[1].progress = Num * 6;
        }
        else if (week > 10 && week <= 15) {
            week -= 10;
            var Num = week / DayNum;
            this.ProgressBar_Singin[0].node.active = true;
            this.ProgressBar_Singin[1].node.active = true;
            this.ProgressBar_Singin[2].node.active = true;
            fet.ProgressBar_Singin[2].progress = Num * 6;
        }
        else if (week > 15 && week <= DayNum) {
            week -= 15;
            var Num = week / DayNum;
            this.ProgressBar_Singin[0].node.active = true;
            this.ProgressBar_Singin[1].node.active = true;
            this.ProgressBar_Singin[2].node.active = true;
            this.ProgressBar_Singin[3].node.active = true;
            fet.ProgressBar_Singin[3].progress = Num * 2;
        }

    },
    //签到领奖
    SingtoggleOn(event, customEventData) {
        var uid = G.myPlayerInfo.uid;
        //this.DayNum[1] 以后如果有需要可以在下下面uid后面把这个dayNum 当做参数传进去
        cc.log("---- 本月天数有---", this.dayMonthNumMax)
        switch (customEventData) {
            case "Prize1":
                G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_PRIZE_RESPONSE, cc.globalMgr.msgObjs.SingContinuousDay(uid, 5));
                break;
            case "Prize2":
                G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_PRIZE_RESPONSE, cc.globalMgr.msgObjs.SingContinuousDay(uid, 10));
                break;
            case "Prize3":
                G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_PRIZE_RESPONSE, cc.globalMgr.msgObjs.SingContinuousDay(uid, 15));
                break;
            case "Prize4":
                G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_PRIZE_RESPONSE, cc.globalMgr.msgObjs.SingContinuousDay(uid, this.dayMonthNumMax));
                break;
        }
        G.socketMgr.socket.send(cc.globalMgr.msgIds.SINGIN_MSG_RESPONSE, cc.globalMgr.msgObjs.SingInDay(uid)); // 签到消息查询
    },
    onSingInButtonFunc: function (msgNumber, body, target) {
        cc.log("--每日签到回调----")
        // if (body.msg) {
        //     cc.globalMgr.globalFunc.addMessageBox(body.msg);
        // }
        var msg = "恭喜成功领取" + body.lebi + "乐币福利";
        cc.globalMgr.globalFunc.addMessageBox(msg);
    },
    //处理累计签到天数，领奖
    OnSingAllNum: function (msgNumber, body, target) {
        for (var i = 0; i < 4; i++) {
            target.Sprite_awardArray[i].color = new cc.Color(115, 115, 115);
            target.Button_awardArray[i].interactable = false;
        }
        var qiandao = body.listqiandao;
        var str = JSON.parse(qiandao);
        target.DayNum = [];
        for (var item in str) {
            var Num = str[item].num;
            target.DayNum.push(Num);
            var isling = str[item].isling;
            var qiandaonun = parseInt(item) + 1
            if (!isling) {
                target.Sprite_awardArray[item].color = new cc.Color(225, 225, 225);
                target.Button_awardArray[item].interactable = true;
            }
        }
    },
    // 总签到数
    onSingAllDayFunc: function (msgNumber, body, target) {
        var qiandao = body.listdays;
        var str = JSON.parse(qiandao);
        var SingNum = 0;
        for (var item in str) {
            var Num = str[item].tian;
            var isqian = str[item].isqian;
            if (isqian) {
                SingNum++;
            }
            //签到日历
            target.InitCurrentDay(Num, isqian, SingNum)
        }
    },

    onDestroy: function () {
        cc.globalMgr.service.getInstance().unregist(this)

    },

});

