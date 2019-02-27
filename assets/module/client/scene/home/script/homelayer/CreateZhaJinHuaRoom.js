var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        // node_zhaJinHuaCreate: {
        //     default: null,
        //     type: cc.Node,
        // },
        lab_difen: {
            default: null,
            type: cc.Label,
        },
        // 0 10局  1 20局  2 30局
        node_money: {
            default: [],
            type: cc.Label
        },
        node_lsit: {
            default: [],
            type: cc.Node
        },
        lab_lsit: {
            default: [],
            type: cc.Label
        }
    },


    onLoad() {
        // this._daiKai = 0;

        this.listenForClubList();

        this.refreshRoomCreateMahjongData();
    },

    refreshView(type) {
        if (type === 1) {
            this.refreshRoomCreateMahjongData();
            // this.refreshRoomCreate(type);
        }
    },
    //加减分
    onClickNum(event, difen) {
        switch (difen) {
            case "jia":
                if (this.diFen >= 5) {
                    this.lab_difen.node.parent.getChildByName("b_jia").color = new cc.Color(164, 164, 164);
                    return;
                }
                this.lab_difen.node.parent.getChildByName("b_jian").color = new cc.Color(255, 255, 255);
                this.diFen += 1;
                break;
            case "jian":
                if (this.diFen <= 1) {
                    this.lab_difen.node.parent.getChildByName("b_jian").color = new cc.Color(164, 164, 164);
                    return;
                }
                this.lab_difen.node.parent.getChildByName("b_jia").color = new cc.Color(255, 255, 255);
                this.diFen -= 1;
                break;
        }

        this.lab_difen.string = this.diFen + "";

    },
    onOpenList(event, type) {
        if (type == "tonghua") {
            if (this.node_lsit[0].active) {
                this.node_lsit[0].active = false
            } else {
                this.node_lsit[0].active = true
            }
        } else if (type == "baozi") {
            if (this.node_lsit[1].active) {
                this.node_lsit[1].active = false
            } else {
                this.node_lsit[1].active = true
            }
        } else if (type == "menpai") {
            if (this.node_lsit[2].active) {
                this.node_lsit[2].active = false
            } else {
                this.node_lsit[2].active = true
            }
        } else if (type == "qipai") {
            if (this.node_lsit[3].active) {
                this.node_lsit[3].active = false
            } else {
                this.node_lsit[3].active = true
            }
        }

    },

    refreshRoomCreateMahjongData() {
        this.createRoomTpye = 5;
        this.juShu = 6;
        this.payType = 1;
        this.peopleNum = 6;
        this.diFen = 1;
        this.yfhh = 10;
        this.yfxx = 10;
        this.tpsy = 1;
        this.bpls = 0;
        this.thhappy = 0;
        this.bzhappy = 0;
        this.menPai = 0;
        this.qiPai = 0;
        this.A23Da = false;
        this.biShuangBei = false;
        this.special = false;
        this.order = false;
        this.shunZiDa = false;

    },

    refreshRoomCreate(roomType) {
        switch (roomType) {
            case 1: {
                if (this._nodeLastCreate !== undefined) {
                    this._nodeLastCreate.destroy();
                    this._nodeLastCreate = undefined;
                }
                this._nodeZhaJinHuaCreate = cc.instantiate(this.node_zhaJinHuaCreate);
                this._nodeZhaJinHuaCreate.parent = this.node;
                this._nodeZhaJinHuaCreate.position = cc.p(-267, 50);
                this._nodeZhaJinHuaCreate.active = true;
                this._nodeLastCreate = this._nodeZhaJinHuaCreate;
                break;
            }
            default:
                break;
        }
    },

    toggleRoomTypeOn(event, customEventData) {
        switch (customEventData) {
            case "zhaJinHuaCreateRoom": {
                this.refreshRoomCreateMahjongData();
                this.refreshRoomCreate(this.createRoomTpye);
            }
                break;
            default:
                break;
        }
    },

    toggleZhaJinHuaOn(event, customEventData) {
        switch (customEventData) {

            case "juShuo6": {
                this.juShu = 6;
            }
                break;
            case "juShuo9": {
                this.juShu = 9;
            }
                break;
            case "juShuo12": {
                this.juShu = 12;
            }
                break;
            case "fangZuPay": {
                this.payType = 1;
                this.node_money[0].string = "3"
                this.node_money[1].string = "6"
            }
                break;
            case "AAPay": {
                this.payType = 2;
                this.node_money[0].string = "1"
                this.node_money[1].string = "2"
            }
                break;
            case "People6": {
                this.peopleNum = 6;
            }
                break;
            case "People8": {
                this.peopleNum = 8;
            }
                break;
            case "People10": {
                this.peopleNum = 10;
            }
                break;
            case "yafenhuihe10": {
                this.yfhh = 10;
            }
                break;
            case "yafenhuihe20": {
                this.yfhh = 20;
            }
                break;
            case "yafenhuihe30": {
                this.yfhh = 30;
            }
                break;
            case "yafenxuanxiang10": {
                this.yfxx = 10;
            }
                break;
            case "yafenxuanxiang20": {
                this.yfxx = 20;
            }
                break;
            case "yafenxuanxiang30": {
                this.yfxx = 30;
            }
                break;
            case "tongpai0": {
                this.tpsy = 1;
            }
                break;
            case "tongpai1": {
                this.tpsy = 2;
            }
                break;
            case "bipailun0": {
                this.bpls = 0;
            }
                break;
            case "bipailun1": {
                this.bpls = 1;
            }
                break;
            case "bipailun2": {
                this.bpls = 2;
            }
                break;
            case "bipailun3": {
                this.bpls = 3;
            }
                break;

            case "tonghua0": {
                this.thhappy = 0;
                this.lab_lsit[0].string = "同花不收喜"
            }
                break;
            case "tonghua5": {
                this.thhappy = 5;
                this.lab_lsit[0].string = "同花顺5分"
            }
                break;
            case "tonghua10": {
                this.thhappy = 10;
                this.lab_lsit[0].string = "同花顺10分"
            }
                break;
            case "tonghua15": {
                this.thhappy = 15;
                this.lab_lsit[0].string = "同花顺15分"
            }
                break;
            case "tonghua30": {
                this.thhappy = 30;
                this.lab_lsit[0].string = "同花顺30分"
            }
                break;
            case "baozi0": {
                this.bzhappy = 0;
                this.lab_lsit[1].string = "豹子不收喜"
            }
                break;
            case "baozi10": {
                this.bzhappy = 10;
                this.lab_lsit[1].string = "豹子10分"
            }
                break;
            case "baozi20": {
                this.bzhappy = 20;
                this.lab_lsit[1].string = "豹子20分"
            }
                break;
            case "baozi30": {
                this.bzhappy = 30;
                this.lab_lsit[1].string = "豹子30分"
            }
                break;
            case "baozi50": {
                this.bzhappy = 50;
                this.lab_lsit[1].string = "豹子50分"
            }
                break;
            case "menpai0": {
                this.menPai = 0;
                this.lab_lsit[2].string = "不闷牌"
            }
                break;
            case "menpai1": {
                this.menPai = 1;
                this.lab_lsit[2].string = "必闷1轮"
            }
                break;
            case "menpai2": {
                this.menPai = 2;
                this.lab_lsit[2].string = "必闷2轮"
            }
                break;
            case "menpai3": {
                this.menPai = 3;
                this.lab_lsit[2].string = "必闷3轮"
            }
                break;
            case "menpai4": {
                this.menPai = 4;
                this.lab_lsit[2].string = "必闷4轮"
            }
                break;
            case "menpai5": {
                this.menPai = 5;
                this.lab_lsit[2].string = "必闷5轮"
            }
                break;
            case "menpai6": {
                this.menPai = 6;
                this.lab_lsit[2].string = "必闷6轮"
            }
                break;
            case "menpai7": {
                this.menPai = 7;
                this.lab_lsit[2].string = "必闷7轮"
            }
                break;
            case "menpai8": {
                this.menPai = 8;
                this.lab_lsit[2].string = "必闷8轮"
            }
                break;
            case "menpai9": {
                this.menPai = 9;
                this.lab_lsit[2].string = "必闷9轮"
            }
                break;
            case "menpai10": {
                this.menPai = 10;
                this.lab_lsit[2].string = "必闷10轮"
            }
                break;

            case "qipai15": {
                this.qiPai = 15;
                this.lab_lsit[3].string = "15秒弃牌"
            }
                break;
            case "qipai30": {
                this.qiPai = 30;
                this.lab_lsit[3].string = "30秒弃牌"
            }
                break;
            case "qipai60": {
                this.qiPai = 60;
                this.lab_lsit[3].string = "60秒弃牌"
            }
                break;
            case "qipai90": {
                this.qiPai = 90;
                this.lab_lsit[3].string = "90秒弃牌"
            }
                break;
            case "qipai120": {
                this.qiPai = 120;
                this.lab_lsit[3].string = "120秒弃牌"
            }
                break;

            case "A23da": {
                if (this.A23Da) {
                    this.A23Da = false;
                    cc.log("------假------", this.A23Da)
                } else {
                    this.A23Da = true;
                    cc.log("------真-------", this.A23Da)
                }
            }
                break;
            case "beibipai": {
                if (this.biShuangBei) {
                    this.biShuangBei = false;
                    cc.log("------假------", this.biShuangBei)
                } else {
                    this.biShuangBei = true;
                    cc.log("------真-------", this.biShuangBei)
                }
            }
                break;
            case "235": {
                if (this.special) {
                    this.special = false;
                    cc.log("------假------", this.special)
                } else {
                    this.special = true;
                    cc.log("------真-------", this.special)
                }
            }
                break;
            case "anxukp": {
                if (this.order) {
                    this.order = false;
                    cc.log("------假------", this.order)
                } else {
                    this.order = true;
                    cc.log("------真-------", this.order)
                }
            }
                break;
            case "shunzidajinhua": {
                if (this.shunZiDa) {
                    this.shunZiDa = false;
                    cc.log("------假------", this.shunZiDa)
                } else {
                    this.shunZiDa = true;
                    cc.log("------真-------", this.shunZiDa)
                }
            }
                break;

            default:
                break;
        }
    },

    btnOnClose() {
        this.node.destroy();
    },

    //设置俱乐部ID
    setIdForClub: function (id) {
        this._clubID = id;
    },

    //设置是否是大厅俱乐部房间创建
    setCreateIsFromHome(isTrue) {
        this._isFromHome = isTrue;
        cc.log("----设置是否大厅创建：", this._isFromHome);
    },

    btnOnCreateRoom(event, dk) {
        cc.log("createRoom");
        // if(dk == 1){
        //     this._daiKai = dk;
        // }
        // else {
        //     this._daiKai = 0;
        // }

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

    //发送创建俱乐部消息
    sendForCreateClub: function () {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_CREATE_CLUB;
        obj.juLeBuName = G.nameForCreateClub;

        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        cc.log("---------创建俱乐部请求发送了:", obj);
    },

    //正常创建房间
    sendForNormalCreateRoom() {
        // var DK = dk;
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = this.createRoomTpye;         //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.jushu = this.juShu;                                        //1.10局  2.20局  3.30局
        data.fangfei = this.payType;                                    //1.房主支付 2.AA支付
        data.peoplenum = this.peopleNum;                                //1.手动开始   2.满五人开   3.满六人开   4.满七人开
        data.difen = this.diFen;                                        //1.1分   2.2分   3.3分    4.5分
        data.isFangZuoBi = this.fangZuoBi;                            //true 开启防作弊 false 不开启
        data.menNumber = this.menpai;
        data.maxNumber = this.genzhu;
        // data.daiKai = this._daiKai;

        cc.log("------查看扎金花创建房间:", data);
        cc.globalMgr.GameFrameEngine.createRoom(data);
    },

    sendForClubCreateRoom() {
        cc.log("createRoom");
        // var DK = dk;
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = this.createRoomTpye;         //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.jushu = this.juShu;                                        //1.10局  2.20局  3.30局
        data.fangfei = this.payType;                                    //1.房主支付 2.AA支付
        data.peoplenum = this.peopleNum;                                //1.手动开始   2.满五人开   3.满六人开   4.满七人开
        data.difen = this.diFen;                                        //1.1分   2.2分   3.3分    4.5分
        data.isFangZuoBi = this.fangZuoBi;                            //true 开启防作弊 false 不开启
        data.menNumber = this.menpai;
        data.maxNumber = this.genzhu;
        // data.daiKai = this._daiKai;

        var clubId = this._clubID;
        if (clubId != null) {
            data.julebuid = clubId;
        }

        //--------设置是否大厅俱乐部创建
        if (this._isFromHome != null) {
            data.isPlaySet = true;
        }

        cc.log("------查看扎金花创建房间俱乐部ID:", clubId, data);
        cc.globalMgr.GameFrameEngine.createRoom(data);

        //直接关闭界面
        this.btnOnClose();
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
