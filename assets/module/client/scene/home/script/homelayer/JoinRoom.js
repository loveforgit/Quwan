var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        lable_0: {
            default: null,
            type: cc.Label
        },
        lable_1: {
            default: null,
            type: cc.Label
        },
        lable_2: {
            default: null,
            type: cc.Label
        },
        lable_3: {
            default: null,
            type: cc.Label
        },
        lable_4: {
            default: null,
            type: cc.Label
        },
        lable_5: {
            default: null,
            type: cc.Label
        },
        prefab_Loading: {
            default: null,
            type: cc.Prefab,
        },
    },
    onLoad() {
        this.JoinRoomNum = [];
        this.Num = 0;
        this.AddNum = 0;
        this.lable_0.string = "";
        this.lable_1.string = "";
        this.lable_2.string = "";
        this.lable_3.string = "";
        this.lable_4.string = "";
        this.lable_5.string = "";
        // cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.JOIN_ROONID_RESPONSE, this, this.onJoinRoomFunc);
    },

    start() {

    },
    OnClickColse: function () {
        this.playClickMusic()

        this.node.destroy();
    },
    JoinRoomtoggleOn: function (event, customEventData) {
        this.playClickMusic()
        
        switch (customEventData) {
            case "0":
                this.Num = 0;
                break;
            case "1":
                this.Num = 1;
                break;
            case "2":
                this.Num = 2;
                break;
            case "3":
                this.Num = 3;
                break;
            case "4":
                this.Num = 4;
                break;
            case "5":
                this.Num = 5;
                break;
            case "6":
                this.Num = 6;
                break;
            case "7":
                this.Num = 7;
                break;
            case "8":
                this.Num = 8;
                break;
            case "9":
                this.Num = 9;
                break;
            case "dele":
                this.Num = 11;
                break;
            case "reset":
                this.Num = 22;
                break;
        }
        var node = this;
        if (this.Num < 10 && this.JoinRoomNum.length < 6) {
            node.JoinRoomNum.push(node.Num);
        }
        if (node.Num == 11) {
            if( node.JoinRoomNum.length > 0)
            node.JoinRoomNum.length = node.JoinRoomNum.length - 1;
        }
        if (node.Num == 22) {
            node.JoinRoomNum.length = 0;
        }
        if ((node.JoinRoomNum[0])) {
            node.lable_0.string = node.JoinRoomNum[0] + "";
        } else {
            if(node.JoinRoomNum[0] == 0){
                node.lable_0.string = "0";
            }else{
                node.lable_0.string = "";
            }
            
        }
        if ((node.JoinRoomNum[1])) {
            node.lable_1.string = node.JoinRoomNum[1] + "";
        } else {
            if(node.JoinRoomNum[1] == 0){
                node.lable_1.string = "0";
            }else{
                node.lable_1.string = "";
            }
        }
        if ((node.JoinRoomNum[2])) {
            node.lable_2.string = node.JoinRoomNum[2] + "";
        } else {
            if(node.JoinRoomNum[2] == 0){
                node.lable_2.string = "0";
            }else{
                node.lable_2.string = "";
            }
        }
        if ((node.JoinRoomNum[3])) {
            node.lable_3.string = node.JoinRoomNum[3] + "";
        } else {
            if(node.JoinRoomNum[3] == 0){
                node.lable_3.string = "0";
            }else{
                node.lable_3.string = "";
            }
        }
        if ((node.JoinRoomNum[4])) {
            node.lable_4.string = node.JoinRoomNum[4] + "";
        } else {
            if(node.JoinRoomNum[4] == 0){
                node.lable_4.string = "0";
            }else{
                node.lable_4.string = "";
            }
        }
        if ((node.JoinRoomNum[5])) {
            node.lable_5.string = node.JoinRoomNum[5] + "";
        } else {
            if(node.JoinRoomNum[5] == 0){
                node.lable_5.string = "0";
            }else{
                node.lable_5.string = "";
            }
        }
        if (node.JoinRoomNum.length == 6) {
            var uid = G.myPlayerInfo.uid;
            var roomid = 0;
            var num = node.JoinRoomNum;
            roomid = (num[0] * 100000) + (num[1] * 10000) + (num[2] * 1000) + (num[3] * 100) + (num[4] * 10) + (num[5] * 1)
            cc.globalMgr.GameFrameEngine.joinRoom(uid, roomid)
        }

    },
    onJoinRoomFunc: function (msgNumber, body, target) {
        this.playClickMusic()
       
        cc.log(body)
        cc.director.loadScene("mahjong");
    },
   
    // onDestroy: function () {
    //     Service.getInstance().unregist(this)
        
    // }


});



