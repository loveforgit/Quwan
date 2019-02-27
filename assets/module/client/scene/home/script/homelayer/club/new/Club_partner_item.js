var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        head: {
            default: null,
            type: cc.Sprite
        },

        names: {
            default: null,
            type: cc.Label
        },
        wxid: {
            default: null,
            type: cc.Label
        }
    },

    getParent(target){
        this.target = target

    },

    itemInfo(clubid, headURL, name, wxid, uid) {
        var target = this
        var loadHead = function (head) {
            cc.loader.load({ url: headURL, type: 'png' }, function (err, tex) {
                head.spriteFrame = new cc.SpriteFrame(tex)
            });
        };
        loadHead(target.head)
        this.names.string = name;
        this.wxid.string = wxid
        this.uid = uid
        this.clubid = clubid
    },

    //----------------------按钮点击-------------------------------
    onClickDelPartner() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_DELPARTNERList_CLUB;
        obj.clubId = this.clubid
        obj.otherUid = this.uid
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        this.target.onCloseClick()
        
    },


});
