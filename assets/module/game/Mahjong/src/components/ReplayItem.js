
var comm = require("Comm")
var cmd = require("CMD_mahjong")
cc.Class({
    extends: comm,

    properties: {
        userNodeList: {
            default: [],
            type: cc.Node
        },

        prefab_big_result: {
            default: null,
            type: cc.Prefab
        },
       
    },

    onLoad() {
        // this.headArray = []
        // this.nameArray = []
        // this.baseArray = []
        // this.winInt = false
        //cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_ITEM_RESPONSE, this, this.OnLookReplayFunc); // 战绩小列表
        this.orderid = 0
        this.shareResult;
        this.gameType = 35;
    },

    setIdForItem(id){
        this.orderid = id;
    },

    //房间号，时间，玩家a，玩家a分数，b，c，d
    updateItem (curPlayData, index) {
        cc.log("---单个玩家信息：", curPlayData)
        // this.nameArray = NameArray;       //名字
        // this.baseArray = BaseArray;        //分数
        // var fet = this;
        // fet.label_RoomID.string = roomID;
        // fet.label_Time.string = time;
        // this.orderid = orderid;
        // //this.gameType = gameType;
        
        // for (var i = 0; i < NameArray.length; i++) {
        //     this.userGrid.children[i].active = true
        //     this.label_Name[i].string = NameArray[i];
        // }

        var image = curPlayData.headimgurl;
        var name = curPlayData.f_nick;
        var id = curPlayData.wxid;
        var score = curPlayData.fenshu;

        //名字
        this.userNodeList[index].getChildByName("label_Name").getComponent(cc.Label).string = name;
        //id
        this.userNodeList[index].getChildByName("label_score").getComponent(cc.Label).string = id;
        //分数
        this.userNodeList[index].getChildByName("nameL").getComponent(cc.Label).string = score;

        //头像
        var headNode = this.userNodeList[index].getChildByName("spr_hand").getComponent(cc.Sprite);
        cc.loader.load({ url: image, type: 'png' }, function (err, tex) {
            headNode.spriteFrame = new cc.SpriteFrame(tex)
        });
    },

    ///点击房间回放
    OnClickRoomPlay: function (event, customEventData) {
        //添加音效
        cc.log( this.gameType,"================gameType")
        this.playClickMusic()
        var shareResult = cc.instantiate(this.prefab_big_result)
        var curScene = cc.director.getScene();
        shareResult.parent = curScene;
        shareResult.setPosition(640, 360);

        // cc.globalMgr.globalFunc.addLayerToWindowsCenter(this.shareResult)
        shareResult.getComponent("shareBigResult").requireRePlay(this.gameType,this.orderid)
    },

    OnLookReplayFunc: function (msgNumber, body, target) {
        //添加音效
        //this.playClickMusic()
        cc.log("---body---", body)
    },
});