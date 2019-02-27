var comm = require("Comm");
var MsgIds = require("MsgIds")
cc.Class({
    extends: comm,

    properties: {
        //滚动公告
        prefab_notice: {
            default: null,
            type: cc.Node
        },
        //无房间提示
        noroom_sprite: {
            default: null,
            type: cc.Node,
        },
        //房间模板
        room_tem: {
            default: null,
            type: cc.Node,
        },
        //代开房间列表
        room_list: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {

        this.items = []; //存储房间列表
        var obj = new Object();
        obj.roomType = G.selectGameType;
        obj.uid = G.myPlayerInfo.uid;
        this.send(MsgIds.REOLACE_LIST, obj);//战绩回访 大窗
        //监听代开游戏房间信息
        this.regist(MsgIds.REOLACE_LIST, this, this.getroomlist)
        //监听大厅滚动公告消息
        this.regist(MsgIds.NOTICE_MASSAGE, this, this.setNotice)
    },

    //创建房间
    OnClickCreateRoom: function () {
        //添加音效
        this.playClickMusic()

        //牛牛
        if (G.selectGameType == 4) {
            var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createNNRoom']);
            nodeCreateRoom.parent = this.node;
        }
        //麻将
        else if (G.selectGameType == 9) {
            var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createRoom']);
            nodeCreateRoom.parent = this.node;
        }
        //炸金花
        else if (G.selectGameType == 5) {
            var nodeCreateRoom = cc.instantiate(cc.globalRes['runNode_createZhaJinHuaRoom']);
            nodeCreateRoom.parent = this.node;
        }

    },
    //传递公告消息
    setNotice(msgNumber, body, target) {
        cc.log("-----查看滚动公告:", body, target);
        target.prefab_notice.getComponent("RollingNotice").setRollingNotice(body.msg)
    },
    //获取房间信息
    getroomlist(msgNumber, body, target) {
        // JSON.stringify(body)
        for (let i = 0; i < target.items.length; ++i) {
            target.items[i].destroy();
        }



        var Gametype = body.roomType;
        var roomlist = JSON.parse(body.roomlist);
        cc.log("游戏列表——————-", body)

        if (roomlist.length == 0) {
            target.noroom_sprite.active = true;
        }
        else {
            target.noroom_sprite.active = false;
            // cc.log("房间数++++++++", roomlist.length)
            for (var i = 0; i < roomlist.length; i++) {
                var node = cc.instantiate(target.room_tem)


                node.parent = target.room_list;
                cc.log("____游戏类型————————————", roomlist[i].jushu);
                node.getChildByName("fh").getComponent(cc.Label).string = roomlist[i].roomid;
                if (G.selectGameType == 5) {
                    node.getChildByName("df").getComponent(cc.Label).string = "炸金花";
                }
                else if (G.selectGameType == 4) {
                    node.getChildByName("df").getComponent(cc.Label).string = "牛牛";
                }
                else if (G.selectGameType == 9) {
                    node.getChildByName("df").getComponent(cc.Label).string = "麻将";
                }



                node.getChildByName("jnum").getComponent(cc.Label).string = roomlist[i].jushu;
                node.getChildByName("rennum").getComponent(cc.Label).string = roomlist[i].nowrenshu + "/" + roomlist[i].renshu;
                var btnDisollve = node.getChildByName("disollve")

                btnDisollve.name = roomlist[i].roomid + "";
                btnDisollve.on('click', this.onClickDelRoomListItem, target);
                node.name = roomlist[i].roomid + "";
                node.on('click', this.joinlistroom, target);

                
                node.setPosition(0, 0);
                target.items.push(node);




            }
        }


    },

     //点击背景加入房间
    joinlistroom(eve) {

        var uid = G.myPlayerInfo.uid;
        cc.globalMgr.GameFrameEngine.joinRoom(uid, parseInt(eve.target.name))
        // cc.globalMgr.GameFrameEngine.requestPlayerInRoom(target, function () { })
        // cc.globalMgr.GameFrameEngine.joinRoom(uid, eve)

    },


    onClickDelRoomListItem(eve) {
        cc.log("删除： ", eve.target)
        var roomid = parseInt(eve.target.name)
        if (roomid != null && roomid > 0) {
            var obj = new Object()
            obj.uid = G.myPlayerInfo.uid;
            obj.roomid = roomid
            this.send(MsgIds.DISSOLVE_DAIKAIROOM, obj)
        }

    },
    onclickrunhome() {
        cc.globalMgr.SceneManager.getInstance().preloadScene("home")
    },

    //加入房间
    OnClickJoinRoom: function () {
        //添加音效
        this.playClickMusic()

        var nodeCreateRoom = cc.instantiate(cc.globalRes['runLayer_JoinRoom']);
        nodeCreateRoom.parent = this.node;
    },
    // OnclickDissolveroom() {

    //     var obj = new Object()
    //     obj.uid = G.myPlayerInfo.uid;
    //     obj.roomid =

    //         target.send(msgIds.DISSOLVE_DAIKAIROOM, obj)
    // }

    // update (dt) {},
});
