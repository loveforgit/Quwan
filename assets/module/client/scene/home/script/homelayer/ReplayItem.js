var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        node_Canvas: {
            default: null,
            type: cc.Node
        },
    },


    onLoad() {
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.REPLAY_ITEM_RESPONSE, this, this.OnLookReplayFunc); // 战绩小列表
    },

    start() {

    },
    //查看炸金花还是其他 true 炸金花
    CheckLookReplay: function (type) {
        if (type) {
            cc.log("--炸金花类型回放---")
            var fet = this;
            fet.node_Canvas.getChildByName("node_rest").active = false;
            fet.node_Canvas.getChildByName("node_tuolaj").active = true;
        } else {
            var fet = this;
            fet.node_Canvas.getChildByName("node_rest").active = true;
            fet.node_Canvas.getChildByName("node_tuolaj").active = false;
        }

    },
    //房间号，时间，玩家a，玩家a分数，b，c，d
    updateItemrest: function (roomID, time, Name1, base1, Name2, base2, Name3, base3, Name4, base4, order) {
        var fet = this;
        var node_rest = fet.node_Canvas.getChildByName("node_rest");
        var label_RoomID = fet.node_Canvas.getChildByName("label_RoomId").getChildByName("label_id").getComponent(cc.Label);
        var label_Time = fet.node_Canvas.getChildByName("label_Time").getChildByName("label_id").getComponent(cc.Label);
        var label_order = fet.node_Canvas.getChildByName("labe_odler").getComponent(cc.Label);
        var label_Name_1 = node_rest.getChildByName("label_Name_1").getComponent(cc.Label);
        var label_base_1 = node_rest.getChildByName("label_Name_1").getChildByName("label_base_1").getComponent(cc.Label);
        var label_Name_2 = node_rest.getChildByName("label_Name_2").getComponent(cc.Label);
        var label_base_2 = node_rest.getChildByName("label_Name_2").getChildByName("label_base_2").getComponent(cc.Label);
        var label_Name_3 = node_rest.getChildByName("label_Name_3").getComponent(cc.Label);
        var label_base_3 = node_rest.getChildByName("label_Name_3").getChildByName("label_base_3").getComponent(cc.Label);
        var label_Name_4 = node_rest.getChildByName("label_Name_4").getComponent(cc.Label);
        var label_base_4 = node_rest.getChildByName("label_Name_4").getChildByName("label_base_4").getComponent(cc.Label);
        label_Name_1.string = this.FormatName(Name1);
        label_base_1.string = this.FormatGold(base1);
        label_Name_2.string = this.FormatName(Name2);
        label_base_2.string = this.FormatGold(base2);
        label_Name_3.string = this.FormatName(Name3);
        label_base_3.string = this.FormatGold(base3);
        label_Name_4.string = this.FormatName(Name4);
        label_base_4.string = this.FormatGold(base4);
        label_RoomID.string = roomID;
        label_Time.string = time;
        label_order.string = order;
        if (!Name4)
            node_rest.getChildByName("label_Name_4").active = false;
        if (!base4)
            node_rest.getChildByName("label_Name_4").getChildByName("label_base_4").active = false;
    },
    //房间号，时间，玩家a，玩家a分数，b，c，d
    updateItemtlj: function (roomID, time, Name1, base1, Name2, base2, Name3, base3, Name4, base4, Name5, base5, Name6, base6, Name7, base7, order) {
        var fet = this;
        var node_rest = fet.node_Canvas.getChildByName("node_tuolaj");
        var label_RoomID = fet.node_Canvas.getChildByName("label_RoomId").getChildByName("label_id").getComponent(cc.Label);
        var label_Time = fet.node_Canvas.getChildByName("label_Time").getChildByName("label_id").getComponent(cc.Label);
        var label_order = fet.node_Canvas.getChildByName("labe_odler").getComponent(cc.Label);
        var label_Name_1 = node_rest.getChildByName("label_Name_1").getComponent(cc.Label);
        var label_base_1 = node_rest.getChildByName("label_Name_1").getChildByName("label_base_1").getComponent(cc.Label);
        var label_Name_2 = node_rest.getChildByName("label_Name_2").getComponent(cc.Label);
        var label_base_2 = node_rest.getChildByName("label_Name_2").getChildByName("label_base_2").getComponent(cc.Label);
        var label_Name_3 = node_rest.getChildByName("label_Name_3").getComponent(cc.Label);
        var label_base_3 = node_rest.getChildByName("label_Name_3").getChildByName("label_base_3").getComponent(cc.Label);
        var label_Name_4 = node_rest.getChildByName("label_Name_4").getComponent(cc.Label);
        var label_base_4 = node_rest.getChildByName("label_Name_4").getChildByName("label_base_4").getComponent(cc.Label);
        var label_Name_5 = node_rest.getChildByName("label_Name_5").getComponent(cc.Label);
        var label_base_5 = node_rest.getChildByName("label_Name_5").getChildByName("label_base_5").getComponent(cc.Label);
        var label_Name_6 = node_rest.getChildByName("label_Name_6").getComponent(cc.Label);
        var label_base_6 = node_rest.getChildByName("label_Name_6").getChildByName("label_base_6").getComponent(cc.Label);
        var label_Name_7 = node_rest.getChildByName("label_Name_7").getComponent(cc.Label);
        var label_base_7 = node_rest.getChildByName("label_Name_7").getChildByName("label_base_7").getComponent(cc.Label);
        label_Name_1.string = this.FormatName(Name1);
        label_base_1.string = this.FormatGold(base1);
        label_Name_2.string = this.FormatName(Name2);
        label_base_2.string = this.FormatGold(base2);
        label_Name_3.string = this.FormatName(Name3);
        label_base_3.string = this.FormatGold(base3);
        label_Name_4.string = this.FormatName(Name4);
        label_base_4.string = this.FormatGold(base4);
        label_Name_5.string = this.FormatName(Name5);
        label_base_5.string = this.FormatGold(base5);
        label_Name_6.string = this.FormatName(Name6);
        label_base_6.string = this.FormatGold(base6);
        label_Name_7.string = this.FormatName(Name7);
        label_base_7.string = this.FormatGold(base7);
        label_RoomID.string = roomID;
        label_Time.string = time;
        label_order.string = order;
        if (!Name3)
            node_rest.getChildByName("label_Name_3").active = false;
        if (!base3)
            node_rest.getChildByName("label_Name_3").getChildByName("label_base_3").active = false;
        if (!Name4)
            node_rest.getChildByName("label_Name_4").active = false;
        if (!base4)
            node_rest.getChildByName("label_Name_4").getChildByName("label_base_4").active = false;
        if (!Name5)
            node_rest.getChildByName("label_Name_5").active = false;
        if (!base5)
            node_rest.getChildByName("label_Name_5").getChildByName("label_base_5").active = false;
        if (!Name6)
            node_rest.getChildByName("label_Name_6").active = false;
        if (!base6)
            node_rest.getChildByName("label_Name_6").getChildByName("label_base_6").active = false;
        if (!Name7)
            node_rest.getChildByName("label_Name_7").active = false;
        if (!base7)
            node_rest.getChildByName("label_Name_7").getChildByName("label_base_7").active = false;

    },
    ///点击房间回放
    OnClickRoomPlay: function (event, customEventData) {
        //添加音效
        this.playClickMusic()

        switch (customEventData) {
            case "MouPingRePlay":
                var uid = "yyes-pc01";
                cc.log("---order---", this.label_order.string)
                G.socketMgr.socket.send(cc.globalMgr.msgIds.REPLAY_ITEM_RESPONSE, cc.globalMgr.msgObjs.ReItemPlay(uid, this.label_order.string));//战绩小列表

                break;
            case "YanTaiRePlay":
                cc.log("---点击的是烟台回放------")
                break;
        }
    },
    OnLookReplayFunc: function (msgNumber, body, target) {
        //添加音效
        this.playClickMusic()

        //cc.log("---body---",body)
    },
});
