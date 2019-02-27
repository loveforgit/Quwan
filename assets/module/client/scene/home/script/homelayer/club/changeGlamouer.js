var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //昵称
        label_nickName: {
            default: null,
            type: cc.Label
        },
        //id
        label_id: {
            default: null,
            type: cc.Label
        },
        //现在的魅力值
        label_nowGlamouer: {
            default: null,
            type: cc.Label
        },
        //头像
        sp_head: {
            default: null,
            type: cc.Sprite
        },
        //获取输入的积分
        label_integral: {
            default: null,
            type: cc.EditBox
        }
    },

    //更新信息
    updateInfo(headUrl, uid, wxid, nickName, glamouer, clubId) {
        //获取用户头像
        this.sp_head.spriteFrame = headUrl
        this.label_id.string = wxid
        this.label_nickName.string = nickName
        this.label_nowGlamouer.string = glamouer
        this._iClubId = clubId
        this.uid = uid
    },

    onClickAddOrSub(event, CustomEventData) {
        if (this.label_integral.string != '') {
            if (CustomEventData == "add") {
                this.onClickChangeGlamouer(true)
            }
            else if (CustomEventData == "sub") {
                this.onClickChangeGlamouer(false)
            }
        }
    },

    //确认修改魅力值
    onClickChangeGlamouer(b) {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.clubId = this._iClubId
        obj.otherUid = this.uid
        obj.number = parseInt(this.label_integral.string);
        if (b == true) {
            obj.type = 1

        } else {
            obj.type = 2
        }
        obj.zinetid = cc.globalMgr.msgIds.SMALL_INTEGRAL_CLUB;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);

        this.node.destroy();
    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
