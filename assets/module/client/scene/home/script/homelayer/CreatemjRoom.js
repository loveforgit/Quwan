var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        node_mahjongCreate: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        this.refreshRoomCreateMahjongData();
        this.listenForClubList();
    },

    refreshView(type) {
        if (type === 1) {
            this.refreshRoomCreateMahjongData();
            // this.refreshRoomCreate(type);
        }
    },

    refreshRoomCreateMahjongData() {
        this.createRoomTpye = G.renqiuMahjongType;
        this.juShu = 8;
        this.renShu = 2;
        this.payType = 1;
        this.fengDing = 1;
        this.xianMeng = 2;
        this.isdaiFeng = true;
        this.isMengFanBei = false;
        this.isDianPao = false;
        this.isBigDianPao = false;
    },

    refreshRoomCreate(roomType) {
        switch (roomType) {
            case 1: {
                if (this._nodeLastCreate !== undefined) {
                    this._nodeLastCreate.destroy();
                    this._nodeLastCreate = undefined;
                }
                this._nodeMahjongCreate = cc.instantiate(this.node_mahjongCreate);
                this._nodeMahjongCreate.parent = this.node;
                this._nodeMahjongCreate.position = cc.p(-267, 50);
                this._nodeMahjongCreate.active = true;
                this._nodeLastCreate = this._nodeMahjongCreate;
                break;
            }
            default:
                break;
        }
    },

    toggleRoomTypeOn(event, customEventData) {
        switch (customEventData) {
            case "mahjongCreateRoom": {
                this.refreshRoomCreateMahjongData();
                this.refreshRoomCreate(this.createRoomTpye);
            }
                break;
            default:
                break;
        }
    },

    toggleMahjongOn(event, customEventData) {
        switch (customEventData) {
            case "juShuo8": {
                this.juShu = 8;
            }
                break;
            case "juShuo16": {
                this.juShu = 16;
            }
                break;

            case "fangZuPay": {
                this.payType = 1;
                // this.SprDiamShow(this.payType);
            }
                break;
            case "AAPay": {
                this.payType = 2;
                // this.SprDiamShow(this.payType);
            }
                break;
            case "People2": {
                this.renShu = 2;
            }
                break;
            case "People3": {
                this.renShu = 3;
            }
                break;
            case "People4": {
                this.renShu = 4;
                // this.refreshHunSelect(false);
            }
                break;
            case "fengding4": {
                this.fengDing = 1;
                // this.refreshHunSelect(true);
            }
                break;
            case "fengding8": {
                this.fengDing = 2;
                // this.refreshHunSelect(true);
            }
                break;
            case "fengding16": {
                this.fengDing = 3;
            }
                break;
            case "fengding99": {
                this.fengDing = 0;
            }
                break;
            case "xm2": {
                this.xianMeng = 2;
            }
                break;
            case "xm4": {
                this.xianMeng = 4;
            }
                break;
            case "xm8": {
                this.xianMeng = 8;
            }
                break;
            case "fengtrue": {
                this.isdaiFeng = true;
            }
                break;
            case "fengfalse": {
                this.isdaiFeng = false;
            }
                break;

            case "mengfalse": {
                this.isMengFanBei = false;
            }
                break;
            case "mengtrue": {
                this.isMengFanBei = true;
            }
                break;
            case "nodianpao": {
                this.isDianPao = false;
            }
                break;
            case "dianpao": {
                this.isDianPao = true;
            }
                break;
            case "smallDianPao": {
                this.isBigDianPao = false;
            }
                break;
            case "BigDianPao": {
                this.isBigDianPao = true;
            }
                break;
            default:
                break;
        }
    },


    //钻石数量显示
    SprDiamShow(diamnum) {
        var node = this.node.getChildByName("node_mahjongCreate").getChildByName("toggle_juShuo");
        var label_4ju = node.getChildByName("toggle_juShuo4").getChildByName("label_cost");
        var label_8ju = node.getChildByName("toggle_juShuo8").getChildByName("label_cost");
        var label_16ju = node.getChildByName("toggle_juShuo16").getChildByName("label_cost");
        switch (diamnum) {
            case 1:
                label_4ju.getComponent(cc.Label).string = "2";
                label_8ju.getComponent(cc.Label).string = "4";
                label_16ju.getComponent(cc.Label).string = "8";
                break;
            case 2:
                label_4ju.getComponent(cc.Label).string = "1";
                label_8ju.getComponent(cc.Label).string = "2";
                label_16ju.getComponent(cc.Label).string = "3";
                break;
            default:
                break;
        }
    },

    refreshHunSelect(flag) {
        var fengNode = this.node.getChildByName("node_mahjongCreate").getChildByName("toggle_feng");
        var toggleDaiFeng = fengNode.getChildByName("toggle_feng");
        var toggleNoFeng = fengNode.getChildByName("toggle_noFeng");
        var huNode = this.node.getChildByName("node_mahjongCreate").getChildByName("toggle_huPai");
        var toggleZimo = huNode.getChildByName("toggle_selfTouch");
        var toggleDianPao = huNode.getChildByName("toggle_pointGunBeard");

        toggleDaiFeng.getComponent(cc.Toggle).interactable = flag;
        toggleNoFeng.getComponent(cc.Toggle).interactable = flag;
        toggleZimo.getComponent(cc.Toggle).interactable = flag;
        toggleDianPao.getComponent(cc.Toggle).interactable = flag;
        if (!flag) {
            toggleDaiFeng.getComponent(cc.Toggle).isChecked = true;
            toggleNoFeng.getComponent(cc.Toggle).isChecked = false;
            toggleZimo.getComponent(cc.Toggle).isChecked = true;
            toggleDianPao.getComponent(cc.Toggle).isChecked = false;
        }
    },

    btnOnClose() {
        this.node.destroy();
    },

    //设置俱乐部ID(俱乐部用，不要删除)
    setIdForClub: function (id) {
        this._clubID = id;
    },

    //设置是否是大厅俱乐部房间创建
    setCreateIsFromHome(isTrue) {
        this._isFromHome = isTrue;
        cc.log("----设置是否大厅创建：", this._isFromHome);
    },

    btnOnCreateRoom() {
        cc.log("createRoom");
        //--------设置是否大厅俱乐部创建
        var isHome = this._isFromHome;
        //1---创建俱乐部,2---修改俱乐部房间规则,3---正常创建
        if (isHome == 1) {
            //创建俱乐部消息
            this.sendForCreateClub();
        }
        else if (isHome == 2) {
            this.sendForClubCreateRoom();
        }
        else {
            cc.log("-----正常创建");
            this.sendForNormalCreateRoom();
        }
    },

    //正常创建房间
    sendForNormalCreateRoom() {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = this.createRoomTpye;    //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.jushu = this.juShu;                                        //1.10局  2.20局  3.30局
        data.renshu = this.renShu;                                          //人数
        data.fangfei = this.payType;                                    //1.房主支付 2.AA支付
        data.buyHorse = this.xianMeng;                                      //掀梦2  4  8
        data.hutype = this.isDianPao;                                    //是否点炮1不点  2点炮
        data.isdaifeng = this.isdaiFeng;                                  //是否带风
        data.isJiaBei = this.isMengFanBei;                                    //是否梦加倍
        data.isAll = this.isBigDianPao;                                  //点炮是否全包
        data.fengding = this.fengDing;                                 //封顶1   2   3  0
        
        cc.log("------查看创建麻将房间:", data);
        cc.globalMgr.GameFrameEngine.createRoom(data);
    },

    sendForClubCreateRoom() {
        cc.log("createRoom");
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = this.createRoomTpye;         //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.jushu = this.juShu;                                        //1.10局  2.20局  3.30局
        data.difen = this.diFen;
        data.fangfei = this.payType;                                    //1.房主支付 2.AA支付
        data.hutype = this.huType;                                      //1.自摸胡   2.点炮胡
        data.isDaiHun = this.hunPai;                                    //0不带 1单混 2双混
        data.isDaiFeng = this.fengPai;                                  //true 开启带风 false 不开启
        data.isDaiPao = this.xiaPao;                                    //true 开启带跑 false 不开启
        data.isDuanMen = this.duanMen;                                  //断门
        data.isGangPao = this.gangPao;                                  //true 开启杠跑算分 false 不开启
        data.isBankerBottom = this.zhuangJiaJiaDi;                      //true 开启庄家加底 false 不开启
        data.isGangShangHua = this.gangShangHuaJiaBei;                  //true 开启杠上花加倍 false 不开启
        data.isQiDui = this.qiDuiJiaBei;                                //true 开启七对加倍 false 不开启
        data.daiKai = this.daiKai;
        if (data.daiKai === 1) data.fangfei = 1;

        //---------------------俱乐部用，不要删除
        var clubId = this._clubID;
        if (clubId != null) {
            data.julebuid = clubId;
        }
        //--------设置是否大厅俱乐部创建
        if (this._isFromHome != null) {
            data.isPlaySet = true;
        }

        cc.log("------查看创建麻将房间俱乐部ID:", clubId, data);
        cc.globalMgr.GameFrameEngine.createRoom(data);

        //直接关闭界面
        this.btnOnClose();
    },

    //发送创建俱乐部消息
    sendForCreateClub: function () {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_CREATE_CLUB;
        obj.juLeBuName = G.nameForCreateClub;

        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        cc.log("---------创建俱乐部请求发送了:", obj);
    },

    //消息监听
    listenForClubList() {
        this.regist(cc.globalMgr.msgIds.CLUB_MAIN_ID, this, this.subMsgEvent);
        // cc.log("进入俱乐部大消息监听");
    },

    //子消息事件处理
    subMsgEvent: function (msgNumber, body, target) {
        if (body.zinetid == cc.globalMgr.msgIds.CLUB_R_FORCREATEROOM) {
            cc.log("-------大厅俱乐部创建房间30数据:", body)
            target.setIdForClub(body.julebuid);
            //添加选择游戏界面
            target.sendForClubCreateRoom();
        }
    }
});
