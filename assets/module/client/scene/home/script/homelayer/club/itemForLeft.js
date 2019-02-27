var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //创建人姓名
        nameShow: {
            default: null,
            type: cc.Label
        },
        //创始人ID
        idShow: {
            default: null,
            type: cc.Label
        },
        //头像图片
        imageShow: {
            default: null,
            type: cc.Sprite
        },
    },

    //保存持有 scrolLeft脚本
    saveOtherScript(target) {
        this.scrolLeftScript = target
    },

    //姓名， id, 房间数，人数，头像
    updateItem(name, id, roomCount, playerCount, image, index) {
        this.nameShow.string = name;
        this.idShow.string = id;
        this.node.name = id + ''
        //获取用户头像
        var that = this;
        cc.loader.load({ url: image, type: 'png' }, function (err, tex) {
            that.imageShow.spriteFrame = new cc.SpriteFrame(tex)
        });
        if (index == 0) {
            G.saveClubID = id
            this.node.getComponent(cc.Toggle).isChecked = true
            this.sendForRight() //请求房间列表
        }
    },

    //列表项按钮事件
    onLeftBtnClick: function (event, ee) {
        this.scrolLeftScript.itemRestoration(this.node.index)
        //发送获取右侧列表信息请求
        this.sendForRight();
        var ClubId = parseInt(this.node.name)
        G.saveClubID = ClubId
        //设置俱乐部界面ID显示
        // G.saveClubThis.setIdForTop(ClubId);
        //请求积分
        G.saveClubThis.refreshClubIntegral(ClubId);
    },

    //右列表消息发送
    sendForRight() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.gameType = G.selectClubGameType
        obj.zinetid = cc.globalMgr.msgIds.SMALL_REQUEST_CLUB_ALL_ROOM;
        obj.clubId = parseInt(this.node.name)

        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj)
        cc.log("右列表发送数据：", obj);
    },


    //普通房
    onClickCommonRoom() {
        cc.log("请求普通房")
    },

    //积分房
    onClickIntegralRoom() {
        cc.log("请求积分房")
    },

});
