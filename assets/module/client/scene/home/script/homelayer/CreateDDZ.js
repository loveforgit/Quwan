var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        node_DDZCreate: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        this.refreshRoomCreateDDZData();
        this.listenForClubList();
    },

    refreshView(type) {
        if (type === 1) {
            this.refreshRoomCreateDDZData();
            // this.refreshRoomCreate(type);
        }
    },

    refreshRoomCreateDDZData() {
        this.createRoomTpye = 3
        this.juShu = 10;
        this.shangzhuang = 1;
        this.payType = 1;
        this.fengDing = 0;
        this.xianzhi = 0;
        this.isMingPai = false;
        this.isjipaiqi = false;

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
                this.refreshRoomCreateDDZData();
                this.refreshRoomCreate(this.createRoomTpye);
            }
                break;
            default:
                break;
        }
    },

    toggleDDZOn(event, customEventData) {
        switch (customEventData) {
            case "ju10": {
                this.juShu = 10;
            }
                break;
            case "ju20": {
                this.juShu = 20;
            }
                break;
            case "ju30": {
                this.juShu = 30;
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
            case "jiaofen": {
                this.shangzhuang = 1;
            }
                break;
            case "jiaozhuang": {
                this.shangzhuang = 2;
            }
                break;
            case "nofengding": {
                this.fengDing = 0;
                // this.refreshHunSelect(false);
            }
                break;
            case "fengding32": {
                this.fengDing = 32;
                // this.refreshHunSelect(true);
            }
                break;
            case "fengding64": {
                this.fengDing = 64;
                // this.refreshHunSelect(true);
            }
                break;
            case "fengding128": {
                this.fengDing = 128;
            }
                break;
            case "noxianzhi": {
                this.xianzhi = 0;
            }
                break;
            case "xianzhi_jiaozhuang": {
                this.xianzhi = 1;
            }
                break;
            case "xianzhi_jiaofen": {
                this.xianzhi = 2;
            }
                break;
            case "mingpai": {
                if (this.isMingPai) {
                    this.isMingPai = false;
                    cc.log("------假------", this.isMingPai)
                } else {
                    this.isMingPai = true;
                    cc.log("------真-------", this.isMingPai)
                }
            };
                break;
            case "jipaiqi": {
                if (this.isjipaiqi) {
                    this.isjipaiqi = false;
                    cc.log("------假------", this.isjipaiqi)
                } else {
                    this.isjipaiqi = true;
                    cc.log("------真-------", this.isjipaiqi)
                }
            };
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
