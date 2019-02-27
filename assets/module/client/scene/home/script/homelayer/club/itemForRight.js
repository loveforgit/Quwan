var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {

    },


    onLoad() {
        //保存房间号
        this._roomNum = -1;
    },

    //姓名， id, 房间数，人数，头像
    updateItem(data) {
        var sprBox = this.node.getChildByName('sprBox')
        var labBox = this.node.getChildByName('labBox')
        var userinfo = this.node.getChildByName('userinfo')

        var arr = [data.shunziniu, data.wuhuaniu, data.tonghuaniu, data.huluniu, data.zhadanniu, data.wuxiaoniu, data.huanleniu]
        var teshuArr = NNRoomRule.ASpecialCardType(arr)
        this._roomNum = data.roomid
        sprBox.getChildByName('ju').getChildByName('label').getComponent(cc.Label).string = data.jushu * 10 + "局"
        sprBox.getChildByName('fen').getChildByName('label').getComponent(cc.Label).string = data.difen + "/" + (data.difen * 2)
        sprBox.getChildByName('gui').getChildByName('label').getComponent(cc.Label).string = NNRoomRule.NNRoomDoubleRules[data.fanbeiguize]
        sprBox.getChildByName('te').getChildByName('label').getComponent(cc.Label).string = teshuArr
        cc.log("特殊规则：："+teshuArr)
        labBox.getChildByName('roomID').getComponent(cc.Label).string = "房间号：" + data.roomid;
        labBox.getChildByName('playerNum').getComponent(cc.Label).string = "人数：" + data.curcount + "/8";
        labBox.getChildByName('state').getComponent(cc.Label).string = data.isbegin == 0 ? '状态:等待中' : '状态:已开始'

        var head = userinfo.getChildByName('mask').getChildByName('headImage').getComponent(cc.Sprite)
        userinfo.getChildByName('nickName').getComponent(cc.Label).string = data.username
        userinfo.getChildByName('id').getComponent(cc.Label).string = data.fzwxid

        //获取用户头像
        var that = this;
        var loadHead = function (head) {
            cc.loader.load({ url: data.image, type: 'png' }, function (err, tex) {
                head.spriteFrame = new cc.SpriteFrame(tex)
            });
        }
        loadHead(head)

    },


    //加俱乐部入房间
    onJoinRoomClick: function () {
        cc.log("加入俱乐部房间被点击了");
        //添加音效
        this.playClickMusic()
        var uid = G.myPlayerInfo.uid;
        var roomid = this._roomNum;
        if (roomid != -1) {
            cc.globalMgr.GameFrameEngine.joinRoom(uid, roomid)
        }
    },
    // update (dt) {},
});
