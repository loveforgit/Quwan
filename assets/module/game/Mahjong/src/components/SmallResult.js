var cmd = require("CMD_mahjong")

cc.Class({
    extends: cc.Component,

    properties: {
        spr_win: {
            default: null,
            type: cc.Node,
        },
        spr_lose: {
            default: null,
            type: cc.Node,
        },
        spr_huang: {
            default: null,
            type: cc.Node,
        },
        spr_jieSan: {
            default: null,
            type: cc.Node,
        },
        rtext_wanFaTips: {
            default: null,
            type: cc.RichText,
        },
        // btn_switchDesk: {
        //     default: null,
        //     type: cc.Node,
        // },
        btn_share:{
            default:null,
            type:cc.Node,
        },
        nodeItems: {
            default:[],
            type: cc.Node,
        },

        node_jinTip: {
            default: null,
            type: cc.Node,
        },
        node_house: {
            default: null,
            type: cc.Node,
        },
        label_roomId:{
            default:null,
            type:cc.Label
        },
        label_time:{
            default:null,
            type:cc.Label
        },
        spr_hunZi1: {
            default:null,
            type:cc.Sprite,
        },
        spr_hunZi2: {
            default:null,
            type:cc.Sprite,
        },
    },

    onLoad () {
        this.gameId = G.gameNetId;
        if (G.mjGameInfo.roomInfo.isjinbi) {
            this.refreshWanFaStr("");
        }
        else{
            this.refreshWanFaStr(G.mjGameInfo.roomInfo.wanFaTips);
        }
    },

    start () {
        // if (G.mjGameInfo.roomInfo.isjinbi) { 
        //     this.btn_switchDesk.active = true;
        // }
    },

    setGameId (gameId) {
        this.gameId = gameId;
    },

    onClose () {
        this.node.active = false;
    },

    onShare () {
        cc.log("onShare");
        var title = "9桌棋牌";
        if (G.gameNetId === 3800) {
            title = "划水麻将";
        } else if (G.gameNetId === 3900) {
            title = "红中麻将";
        }
        cc.globalMgr.XlSDK.getInstance().share(title,G.shareHttpServerPath, "", "0", "1");
    },

    onSwitchDesk () {
        cc.log("onSwitchDesk");
        this.node.active = false;
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.GAME_CONTINUE;

        G.socketMgr.socket.send(this.gameId, cc.globalMgr.msgObjs.mahjongGameContinue(data));
    },

    onContinue () {
        cc.log("onContinue");
        this.node.active = false;
        if (this.parent._isBigResultCome) {
            this.parent._nodeBigResult.active = true;
        } else {
            var data = new Object();
            data.uid = G.myPlayerInfo.uid;    
            data.zinetid = cmd.GAME_CONTINUE;
           // G.socketMgr.socket.send(this.gameId, cc.globalMgr.msgObjs.mahjongGameContinue(data));
            G.socketMgr.socket.send(this.gameId,data);
        }
    },

    refreshWinOrFailed (flag) {
        this.spr_win.active = flag;
        this.spr_lose.active = !flag;
        this.spr_huang.active = false;
        this.spr_jieSan.active = false;
    },

    refreshWanFaStr (str) {
        this.rtext_wanFaTips.string = str;
    },

    refreshNodeItemsView (flag) {

        for (var i = 0; i < this.nodeItems.length; i++) {
            var smallResultItem = this.nodeItems[i];
            smallResultItem.active = flag;
            cc.log("yincahng=========")
        }
    },
    createMjSpr (mjId, pos) {
        var node = new cc.Node('Sprite');
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_",mjId);
        cc.log("=========B_",mjId)
        node.parent = this.node_house;
        //node.scale= 0.4;
        node.position = pos;
    },
    //显示买马
    showPaiArr (result) {
        var posX = 0;
        this._paiWidth = 100
        if (result.length >0) {
            var paiSpliteArr = cc.globalMgr.mahjongmgr.spliteArr(result);
            for (var i = 0; i < paiSpliteArr.length; i++) {
                var paiIdArr = paiSpliteArr[i];
                for (var j = 0; j < paiIdArr.length; j++) {
                    this.createMjSpr(paiIdArr[j], cc.p(posX,0));
                    posX -= this._paiWidth;
                }
                posX -= 30;
            }
        }
    },
    refreshInfos (msgData) {
        cc.log(msgData,"小结算信息")
        
        var infos = JSON.parse(msgData.info)
        cc.log(infos,"==============================")
        if(infos.time != undefined){
            this.label_time.string = "时间："+infos.time;
        }
        this.refreshNodeItemsView(false);
        if(G.mjGameInfo.roomInfo.isjinbi){
            this.label_roomId.string = "";
        }
        else{
            this.label_roomId.string = "房间号"+infos.roomId;
        }
        if(infos.buyHorse != undefined){
           this.showPaiArr(infos.buyHorse)
        }
        var resultArr = infos.listjiesuan;
        for (var i = 0; i < resultArr.length; i++) {
            var result = resultArr[i];
            var smallResultItem = this.nodeItems[i];
            smallResultItem.active = true;
            var script = smallResultItem.getComponent("SmallResultItem");
            script.refreshResult(result);
            //小结算  你输了  你赢了
            // if (parseInt(result.wxid) === G.myPlayerInfo.wxId) {
            //     if (result.winstatus === 1) {
            //         this.refreshWinOrFailed(true);
            //     } else if (result.winstatus === 0) {
            //         this.refreshWinOrFailed(false);
            //     } else if (result.winstatus === 2) {
            //         this.spr_win.active = false;
            //         this.spr_lose.active = false;
            //         this.spr_huang.active = true;
            //         this.spr_jieSan.active = false;
            //     }
            //     else if (result.winstatus === 3) {
            //         this.spr_win.active = false;
            //         this.spr_lose.active = false;
            //         this.spr_huang.active = false;
            //         this.spr_jieSan.active = true;
            //     }
            // }
        }
        // this.refreshHunZi(infos.hunZiList);
    },

    refreshHunZi (hunZiArr) {
        this.spr_hunZi1.node.active = false;
        this.spr_hunZi2.node.active = false;
        for(var i = 0; i < hunZiArr.length; i++) {
            if (i === 0) {
                this.spr_hunZi1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", hunZiArr[i]);
                this.spr_hunZi1.node.active = true;
            }
            if (i === 1) {
                this.spr_hunZi2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", hunZiArr[i]);
                this.spr_hunZi2.node.active = true;
            }
        }
    },
});
