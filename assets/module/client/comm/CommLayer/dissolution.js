//by yky 
// 2018.4.13
var msgIds = require("MsgIds");
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        btn_close: {
            default: null,
            type: cc.Button
        },
        label_tips: {
            default: null,
            type: cc.RichText
        },
        label_waitTime: {
            default: null,
            type: cc.Label
        },
        sp_head: {
            default: [],
            type: cc.Sprite
        },
        sp_headtlj: {
            default: [],
            type: cc.Sprite
        },
        btn_agree: {
            default: null,
            type: cc.Button
        },
        btn_Refuse: {
            default: null,
            type: cc.Button
        }
    },

    onLoad() {
        this.userlist = []
        this.userHeadList = []
    },

    //同意按钮
    onClickedAgree() {
        var obj = new Object()
        obj.zinetid = msgIds.CALL_ALLPLAYER_DISSOLUTION
        obj.uid = G.myPlayerInfo.uid;
        obj.reqresult = 0       //  提交解散 处理结果 0.同意  1.拒绝
        this.send(msgIds.LEAVE_ROOM_MAIN_ID, obj)
        // this.btn_agree.node.active = false
    },

    //拒绝按钮
    onClickedRefuse() {
        var obj = new Object()
        obj.zinetid = msgIds.CALL_ALLPLAYER_DISSOLUTION
        obj.uid = G.myPlayerInfo.uid;
        obj.reqresult = 1       //  提交解散 处理结果 0.同意  1.拒绝
        this.send(msgIds.LEAVE_ROOM_MAIN_ID, obj)
        // this.btn_Refuse.node.active = false
    },

    //开始定时器
    startWaitTime(time) {
        this.Times = time
        this.showWaitLabel(time)
        this.schedule(this.waitTime, 1)
    },

    //倒计时
    waitTime(dt) {
        // cc.log("wait time ", this.Times)
        this.Times--
        this.showWaitLabel(this.Times)
        if (this.Times == 0) {
            this.showWaitLabel(this.Times)
            this.unschedule(this.waitTime)
            return
        }
    },

    //设置倒计时显示
    showWaitLabel(time) {
        this.label_waitTime.getComponent(cc.Label).string = time 
    },

    //提示信息
    setTipsLabel(name) {
        this.label_tips.getComponent(cc.RichText).string = "<color=#FA0303>" + this.FormatName(name) + "</c>" + "申请解散房间。"
    },

    //设置解散信息
    setDissolutionInfo(userInfoList, applyWxid) {
        this.userInfoList = userInfoList
        var startIndex = 0;
        var endIndex = 0;
        var offsetX = 0;
        var userLength = userInfoList.length
        if (userLength == 2) {
            startIndex = 1
            endIndex = 2
            offsetX = 0
        }
        else if (userLength == 3) {
            startIndex = 0
            endIndex = 2
            offsetX = 100
        }
        else if (userLength == 4) {
            startIndex = 0
            endIndex = 3
            offsetX = 0
        } else if (userLength > 4) {
            startIndex = 0
            endIndex = userLength - 1;
            offsetX = 0
        }
        var userindex = -1
        cc.log("startindex ", startIndex)
        cc.log("endindex ", endIndex)
        for (var i = startIndex; i <= endIndex; i++) {
            userindex++
            //玩家信息
            var userinfo = userInfoList[userindex]
            //玩家解散信息走两套 一套炸金花的
            var head;
            if (userLength > 4) {
                this.sp_headtlj[i].node.active = true;
                head = this.sp_headtlj[i].node
            } else {
                this.sp_head[i].node.active = true
                head = this.sp_head[i].node
            }
            head.x = head.x + offsetX
            this.userHeadList.push(head)
            var name = head.getChildByName("label_name")
            var sp_agree = head.getChildByName("sp_agree")
            var sp_warting = head.getChildByName("sp_warting")
            var sp_refuse = head.getChildByName("sp_refuse")
            sp_agree.active = false
            sp_refuse.active = false
            sp_warting.active = true

            var loadHead = function (head) {
                cc.loader.load({ url: userinfo.image, type: 'png' }, function (err, tex) {
                    head.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                });
            }
            loadHead(head)
            name.getComponent(cc.Label).string = this.FormatName(userinfo.name) 
        }
    },

    //设置玩家同意或者失败
    setPlayerAgreeStatus(wxid, isAgree) {

        for (var i = 0; i < this.userInfoList.length; i++) {
            if (this.userInfoList[i].wxid == wxid) {
                var head = this.userHeadList[i]
                var sp_agree = head.getChildByName("sp_agree")
                var sp_warting = head.getChildByName("sp_warting")
                var sp_refuse = head.getChildByName("sp_refuse")
                if (wxid == G.myPlayerInfo.wxId) {
                    this.btn_agree.node.active = false
                    this.btn_Refuse.node.active = false
                }
                if (isAgree == 0) {
                    sp_agree.active = true
                    sp_warting.active = false
                    sp_refuse.active = false
                }
                else {
                    sp_agree.active = false
                    sp_warting.active = false
                    sp_refuse.active = true
                }
                return
            }
        }
    },

    start() {

    },

    // update (dt) {},
});
