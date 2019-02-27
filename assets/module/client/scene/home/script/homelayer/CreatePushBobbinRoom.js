cc.Class({
    extends: cc.Component,

    properties: {
        node_pushBubbinCreate: {
            default: null,
            type: cc.Node
        },
        // 0 房主  1 aa
          node_money:{
            default:[],
            type:cc.Label
        }
    },

    onLoad() {
        this.refreshRoomCreatePushBubbinData();
    },

    refreshRoomCreatePushBubbinData() {
        this._createRoomType = 311;
        this._juShu = 10;
        this._diFen = 1;
        //上庄（ 1为随机庄 2 固定庄 3 轮流庄）
        this._shangzhuang = 1;
        //支付类型（1. 房主付费 2.AA支付）
        this._payType = 1;
        //人数（1.手动开始 4.满4人开 5.满5人开 6.满6人开）
        this._autoBegin = 1;
        //是否允许中途加入（true 为游戏开始可加入）
        this._isGameStop = false;
        //八九点
        this._isBaJiuDian = true;
        //二八杠
        this._isErBaGang = false;
        //对子
        this._isDuiZi = false;
        //对白版
        this._isDuiBaiBan = false;

        // this.twoTimes = false;
        // this.threeTimes = false;
        // this.fourTimes = false;
        // this.fiveTimes = false;
        // this.banned = false;
    },

    togglePushBubbinOn(event, customEventData) {
        switch (customEventData) {
            //局数
            case "ju10":
                this._juShu = 10;
                // this.node_money[0].string = "3"
                // this.node_money[1].string = "1"
                break;
            case "ju20":
                this._juShu = 20;
                // this.node_money[0].string = "6"
                // this.node_money[1].string = "2"
                break;
            case "ju30":
                this._juShu = 30;
                // this.node_money[0].string = "9"
                // this.node_money[1].string = "3"
                break;
            //支付类型
            case "fangZhuPay":
                this._payType = 1;
                break;
            case "AAPay":
                this._payType = 2;
                break;
            //人数
            case "manualStart":
                this._autoBegin = 1;
                break;
            case "peopleNum4":
                this._autoBegin = 4;
                break;
            case "peopleNum5":
                this._autoBegin = 5;
                break;
            case "peopleNum6":
                this._autoBegin = 6;
                break;
            //底分
            case "difen1":
                this._diFen = 1;
                break;
            case "difen2":
                this._diFen = 2;
                break;
            case "difen3":
                this._diFen = 3;
                break;
            case "difen4":
                this._diFen = 4;
                break;
            case "difen5":
                this._diFen = 5;
                break;
            case "random":
                this.shangzhuang = 1;
                break;
            case "fixed":
                this.shangzhuang = 2;
                break;
            case "inTurn":
                this.shangzhuang = 3;
                break;
            //八九点
            case "twoTimes": {
                if (event.isChecked) {
                    this._isBaJiuDian = true;
                } else {
                    this._isBaJiuDian = false;
                }
            }
                break;
            //二八点
            case "threeTimes": {
                if (event.isChecked) {
                    this._isErBaGang = true;
                } else {
                    this._isErBaGang = false;
                }
            }
                break;
            //对子
            case "fourTimes": {
                if (event.isChecked) {
                    this._isDuiZi = true;
                } else {
                    this._isDuiZi = false;
                }
            }
                break;
            //对白版
            case "fiveTimes": {
                if (event.isChecked) {
                    this._isDuiBaiBan = true;
                } else {
                    this._isDuiBaiBan = false;
                }
            }
                break;
            //中途加入
            case "banned": {
                if (event.isChecked) {
                    this._isGameStop = true;
                } else {
                    this._isGameStop = false;
                }
            }
                break;
        }
        this.SprDiamShow(this._juShu)
    },

    btnOnClose() {
        this.node.destroy();
    },
    //钻石数量显示
    SprDiamShow(diamnum) {
        cc.log("---钻石更新--", diamnum)
        var node = this.node.getChildByName("node_pushBubbinCreate").getChildByName("toggle_pay");
        var label_fz = node.getChildByName("toggle_fangZu").getChildByName("label_cost");
        var label_aa = node.getChildByName("toggle_AA").getChildByName("label_cost");
        switch (diamnum) {
            case 10:
                label_fz.getComponent(cc.Label).string = "3";
                label_aa.getComponent(cc.Label).string = "1";
                break;
            case 20:
                label_fz.getComponent(cc.Label).string = "6";
                label_aa.getComponent(cc.Label).string = "2";
                break;
            case 30:
                label_fz.getComponent(cc.Label).string = "9";
                label_aa.getComponent(cc.Label).string = "3";
                break;
        }
    },

    btnOnCreateRoom() {
        cc.log("createRoom");
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = this._createRoomType;         //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.juShu = this._juShu;                                        //1.10局  2.20局  3.30局
        // data.juShu = 1;  
        data.diFen = this._diFen;                                    //1.房主支付 2.AA支付
        data.shangZhuang = this._shangzhuang;                                //1.手动开始 2.满四人开 3.满五人开 4.满六人开
        data.fangFei = this._payType;                                        //1.1/2  2.2/4  3.3/6  4.4/8  5.5/10
        data.autoBegin = this._autoBegin;                            //1.随机庄  2.固定庄  3.轮流庄
        data.isGameStop = this._isGameStop;                                  //true 开启八九点二倍 false 不开启
        data.isBaJiuDian = this._isBaJiuDian;                              //true 开启二八杠三倍 false 不开启
        data.isErBaGang = this._isErBaGang;                                //true 开启对子四倍 false 不开启
        data.isDuiZi = this._isDuiZi;
        data.isDuiBaiBan = this._isDuiBaiBan;                         //true 开启对白板五倍 false 不开启
        // data.banned = !this.banned;                                      //true 游戏开始后禁入 false 不开启

        cc.globalMgr.GameFrameEngine.createRoom(data);
    },

    start() {

    },

    // update (dt) {},
});
