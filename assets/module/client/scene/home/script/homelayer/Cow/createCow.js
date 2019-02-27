var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {
        node_help: {
            default: [],
            type: cc.Node
        },

    },
    onLoad() {
        this.refreshRoomCreateMahjongData();
    },
    refreshRoomCreateMahjongData() {
        this.renshu = 6;
        this.jushu = 10;
        this.fangfei = 1;
        this.wanglai = 0;
        this.huapai = 0;
        this.beishu = 1;
        this.guize = 1;
        this.tuizhu = false;
        this.xiazhuxianzhi = false;
        this.fanbei = false;
        this.anqiang = false;
        this.jingdianxuanfen = 1;
        this.quweixuanfen = 1;
        this.xianjiamaima = false;
        this.kuaisuyouxi = false;
        this.jinzhicuopai = false;
        this.jisuyouxi = false;
        this.tonghuashun = false;
        this.yitiaolong = false;
        this.zhadanniu = false;
        this.wuxiaoniu = false;
        this.huluniu = false;
        this.jinniu = false;
        this.tonghuaniu = false;
        this.yinniu = false;
        this.shunziniu = false;
    },
    toggleNNOn(event, customEventData) {
        this.playClickMusic()
        var TeShuArr = [];
        switch (customEventData) {

            case "difen1":
                this.difen = 1;
                break;
            case "difen2":
                this.difen = 2;
                break;
            case "difen3":
                this.difen = 3;
                break;
            case "difen4":
                this.difen = 4;
                break;
            case "difen5":
                this.difen = 5;
                break;
            case "ju10":
                this.jushu = 1;
                cc.log("--钻石--ee-")
                break;
            case "ju20":
                this.jushu = 2;
                break;
            case "ju30":
                this.jushu = 3;
                break;
            case "fangZuPay":
                this.fangfei = 1;
                break;
            case "AAPay":
                this.fangfei = 2;
                break;
            case "auto1":
                this.autobegin = 1;
                break;
            case "auto4":
                this.autobegin = 4;
                break;
            case "auto5":
                this.autobegin = 5;
                break;
            case "auto6":
                this.autobegin = 6;
                break;
            case "gaojixiazhu":
                this.xiazhuxianzhi = !this.xiazhuxianzhi;
                //TeShuArr.push(this.xiazhuxianzhi)
                break;
            case "gaojijinru":
                this.jinzhijiaru = !this.jinzhijiaru;
                //TeShuArr.push(this.jinzhijiaru)
                break;
            case "maxZhuang1":
                this.zuidaqiangzhuang = 1;
                break;
            case "maxZhuang2":
                this.zuidaqiangzhuang = 2;
                break;
            case "maxZhuang3":
                this.zuidaqiangzhuang = 3;
                break;
            case "maxZhuang4":
                this.zuidaqiangzhuang = 4;
                break;
            case "fanbei1":
                this.fanbeiguize = 1;
                break;
            case "fanbei2":
                this.fanbeiguize = 2;
                break;
            case "shunziniu":
                this.shunziniu = !this.shunziniu;
                TeShuArr.push(this.shunziniu)
                break;
            case "wuhuaniu":
                this.wuhuaniu = !this.wuhuaniu;
                TeShuArr.push(this.wuhuaniu)
                break;
            case "tonghuaniu":
                this.tonghuaniu = !this.tonghuaniu;
                TeShuArr.push(this.tonghuaniu)
                break;
            case "huluniu":
                this.huluniu = !this.huluniu;
                TeShuArr.push(this.huluniu)
                break;
            case "zhadanniu":
                this.zhadanniu = !this.zhadanniu;
                TeShuArr.push(this.zhadanniu)
                break;
            case "wuxiaoniu":
                this.wuxiaoniu = !this.wuxiaoniu;
                TeShuArr.push(this.wuxiaoniu)
                break;
            case "huanleniu":
                this.huanleniu = !this.huanleniu;
                TeShuArr.push(this.huanleniu)
                break;
            case "tuizhu0":
                this.tuizhu = 0;
                break;
            case "tuizhu5":
                this.tuizhu = 5;
                break;
            case "tuizhu10":
                this.tuizhu = 10
                break;
            case "tuizhu15":
                this.tuizhu = 15;
                break;
        }
        this.SprDiamShow(this.jushu, this.fanbeiguize, TeShuArr);

    },
    //钻石数量显示
    SprDiamShow(diamnum, fanbei, teshuArr) {
        var node = this.node.getChildByName("node_mahjongCreate").getChildByName("node_fuxian").getChildByName("toggle_pay");
        var label_fz = node.getChildByName("toggle_fangZu").getChildByName("label_cost");
        var label_aa = node.getChildByName("toggle_AA").getChildByName("label_cost");
        var label_teshu = this.node.getChildByName("node_mahjongCreate").getChildByName("node_danxaun").getChildByName("node_teshu").getChildByName("spr_bg").getChildByName("label_teshu");
        var label_fanbei = this.node.getChildByName("node_mahjongCreate").getChildByName("node_danxaun").getChildByName("node_fanbei").getChildByName("spr_bg").getChildByName("label_fanbei");
        switch (diamnum) {
            case 1:
                label_fz.getComponent(cc.RichText).string = "3";
                label_aa.getComponent(cc.RichText).string = "1";
                break;
            case 2:
                label_fz.getComponent(cc.RichText).string = "6";
                label_aa.getComponent(cc.RichText).string = "2";
                break;
            case 3:
                label_fz.getComponent(cc.RichText).string = "9";
                label_aa.getComponent(cc.RichText).string = "3";
                break;
        }
        switch (fanbei) {
            case 1:
                label_fanbei.getComponent(cc.Label).string = "牛牛×4、牛九×3、牛八×2、牛七×2"
                break;
            case 2:
                label_fanbei.getComponent(cc.Label).string = "牛牛×3、牛九×2、牛八×2"
                break;
        }
        var isteshu = true;
        for (var i = 0; i < teshuArr.length; i++) {
            if (teshuArr[i] == false) {
                isteshu = false;
            }
        }
        if (isteshu) {
            label_teshu.getComponent(cc.Label).string = "全部勾选";
        } else {
            label_teshu.getComponent(cc.Label).string = "部分勾选";
        }
    },
    onOpenHelp(event, type) {
        var Type = type;
        switch (Type) {
            case "jingdianwanglai":
                if (this.node_help[0].active) {
                    this.node_help[0].active = false;
                } else {
                    this.node_help[0].active = true;
                }
                break;
            case "fengkuangwanglai":
                if (this.node_help[1].active) {
                    this.node_help[1].active = false;
                } else {
                    this.node_help[1].active = true;
                }
                break;
            case "xianjiatuizhu":
                if (this.node_help[2].active) {
                    this.node_help[2].active = false;
                } else {
                    this.node_help[2].active = true;
                }
                break;
            case "xiazhuxianzhi":
                if (this.node_help[3].active) {
                    this.node_help[3].active = false;
                } else {
                    this.node_help[3].active = true;
                }
                break;
            case "fanbei":
                if (this.node_help[4].active) {
                    this.node_help[4].active = false;
                } else {
                    this.node_help[4].active = true;
                }
                break;
            case "anqiang":
                if (this.node_help[5].active) {
                    this.node_help[5].active = false;
                } else {
                    this.node_help[5].active = true;
                }
                break;
            case "xianjiamaima":
                if (this.node_help[6].active) {
                    this.node_help[6].active = false;
                } else {
                    this.node_help[6].active = true;
                }
                break;
            case "huapai":
                if (this.node_help[7].active) {
                    this.node_help[7].active = false;
                } else {
                    this.node_help[7].active = true;
                }
                break;
            case "fanbeiguzie":
                if (this.node_help[8].active) {
                    this.node_help[8].active = false;
                } else {
                    this.node_help[8].active = true;
                }
                break;
            case "jingdianxuanfen":
                if (this.node_help[9].active) {
                    this.node_help[9].active = false;
                } else {
                    this.node_help[9].active = true;
                }
                break;

            case "quweixuanfen":
                if (this.node_help[10].active) {
                    this.node_help[10].active = false;
                } else {
                    this.node_help[10].active = true;
                }
                break;

            case "gexingxuanze":
                if (this.node_help[11].active) {
                    this.node_help[11].active = false;
                } else {
                    this.node_help[11].active = true;
                }
                break;
        }
    },
    OnClickCreateNnRoom() {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = 4;         //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.jushu = this.jushu;                                        //1.10局  2.20局  3.30局
        data.fangfei = this.fangfei                              //1.房主支付 2.AA支付
        data.wanfa = this.wanfa
        data.difen = this.difen
        data.fanbeiguize = this.fanbeiguize
        data.autobegin = this.autobegin
        data.tuizhu = this.tuizhu
        data.zuidaqiangzhuang = this.zuidaqiangzhuang
        data.shangfenfenshu = this.shangfenfenshu
        data.jinzhijiaru = this.jinzhijiaru
        data.jinzhicuopai = this.jinzhicuopai
        data.xiazhuxianzhi = this.xiazhuxianzhi
        data.shunziniu = this.shunziniu
        data.wuhuaniu = this.wuhuaniu
        data.tonghuaniu = this.tonghuaniu
        data.huluniu = this.huluniu
        data.zhadanniu = this.zhadanniu
        data.wuxiaoniu = this.wuxiaoniu
        data.huanleniu = this.huanleniu
        cc.log("--五小牛---", this.wuxiaoniu)
        cc.globalMgr.GameFrameEngine.createRoom(data);
    },
    //翻倍规则
    OnFanBeiClick(event, type) {
        this.playClickMusic()
        var Type = type;
        switch (Type) {
            case "jingdianwanglai":
                if (this.node_help[0].active) {
                    this.node_help[0].active = false;
                } else {
                    this.node_help[0].active = true;
                }
                break;
        }
        this.node.getChildByName("node_mahjongCreate").getChildByName("node_danxaun").getChildByName("node_fanbei").getChildByName("node_show").active = !this.node.getChildByName("node_mahjongCreate").getChildByName("node_danxaun").getChildByName("node_fanbei").getChildByName("node_show").active;
    },
    OnTeShuClick() {
        this.playClickMusic()
        this.node.getChildByName("node_mahjongCreate").getChildByName("node_danxaun").getChildByName("node_teshu").getChildByName("node_show").active = !this.node.getChildByName("node_mahjongCreate").getChildByName("node_danxaun").getChildByName("node_teshu").getChildByName("node_show").active;

    },
    OnCliseClose() {
        this.node.destroy();
    }


    // update (dt) {},
});



