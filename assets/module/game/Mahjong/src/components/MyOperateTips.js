var cmd = require("CMD_mahjong")

cc.Class({
    extends: cc.Component,

    properties: {
        node_CPGH:{
            default: null,
            type: cc.Node, 
        },
        node_opts: { //数组顺序按碰，杠，吃，胡
            default: [],
            type: cc.Node,
        },
        node_chi: {
            default: [],
            type: cc.Node,
        },
        node_gang: {
            default: [],
            type: cc.Node,
        },
        btn_mingLou: {
            default: null,
            type: cc.Node,
        },
        btn_mingLouGuo: {
            default: null,
            type: cc.Node,
        },
        btn_guo: {
            default: null,
            type: cc.Node,
        },
        node_xuni5: {
            default: null,
            type: cc.Node,
        },
        fiveButtonArr: {
            default: [],
            type: cc.Button,
        },
        btn_virtualFive: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad () {
        this.refreshNodeOptsView(false);
        this.gameId = G.gameNetId;
        this.chiList ;
        this.isChi = true;
        cc.globalMgr.EventManager.getInstance().regist("refreshMjColor", this, this.refreshMjColor);
    },

    // 在这里初始化数据比较坑，你在上一层获取该脚本组件后，直接调用这里面的方法，会先调用方法，后调用start
    // start () {

    // },

    refreshNodeOptsView (flag) {
        // for (var i = 0; i < this.node_opts.length; i++) {
        //     var node = this.node_opts[i];
        //     node.active = flag;
        // }
        // for (var i = 0; i < this.node_chi.length; i++) {
        //     var node = this.node_chi[i];
        //     node.active = flag;
        // }
        for (var i = 0; i < this.node_gang.length; i++) {
            this.node_gang[i].active = flag;
        }

        this.btn_mingLou.active = false;
        this.btn_mingLouGuo.active = false;

        this.btn_guo.active = false;
        this.node_xuni5.active = false;
        this.btn_virtualFive.active = false;
        //-------唐山麻将吃碰杠提示
        this.node_CPGH.active = false;
       
        this._tipPGHCuid = null;
        this._pengPai = 0;
        this._gangPai = 0;
        this._huPai = 0;
        this._chiType = 0; 
        this._selectPai = 0;
        this._virtualPai = 0;
        this.node_CPGH.getChildByName("xiao_Guo").getComponent(cc.Button).node.active = false
        // this.node_CPGH.getChildByName("btn_Ting").getComponent(cc.Button).node.active = false
       
    },
    showBtn(active){
        this.node_CPGH.getChildByName("node_layout").getChildByName("hu_btn").active = active
        this.node_CPGH.getChildByName("node_layout").getChildByName("chi_btn").active = active
        this.node_CPGH.getChildByName("node_layout").getChildByName("gang_btn").active = active
        this.node_CPGH.getChildByName("node_layout").getChildByName("peng_btn").active = active
        // this.node_CPGH.getChildByName("btn_Ting").getComponent(cc.Button).node.active = !active
    },
    setGameId (gameId) {
        this.gameId = gameId;
    },
    refreshCPG(msgData){
        cc.log(msgData,"吃碰杠提示====================================")
        this.showBtn(false)
        this.node_CPGH.active = true
        this.chiList = msgData.listchi;
        this.isChi = true;
        for (var i = 0; i < this.node_chi.length; i++) {
            var node = this.node_chi[i];
            node.active = false;
        }
        if(msgData.peng === 1){
            this.node_CPGH.getChildByName("node_layout").getChildByName("peng_btn").active = true
          
            this._pengPai = msgData.listpeng[0];
        }
        else{
            // this.node_CPGH.getChildByName("peng_btn").getComponent(cc.Button).interactable = false
        }
        if(msgData.gang === 1){
            this.node_CPGH.getChildByName("node_layout").getChildByName("gang_btn").active = true

            this._gangCount = msgData.listgang.length;
            if (this._gangCount === 1) {
                this._gangPai = msgData.listgang[0];
            } else {
                this.refreshGangView(msgData.listgang);
            }
        }
        else{
            // this.node_CPGH.getChildByName("gang_btn").getComponent(cc.Button).interactable = false
        }
        if(msgData.chi === 1){
            this.node_CPGH.getChildByName("node_layout").getChildByName("chi_btn").active = true

            this._chiCount = msgData.listchi.length;
            if (this._chiCount == 1) {
                var chiData = msgData.listchi[0];
                this._chiType = chiData._Key;
            } else {
                //this.refreshChiView(msgData.listchi);
            }
        }
        else{
            // this.node_CPGH.getChildByName("chi_btn").getComponent(cc.Button).interactable = false
        }
        if(msgData.hu === 1){
            this.node_CPGH.getChildByName("node_layout").getChildByName("hu_btn").active = true
            this._huPai = msgData.hupai;

            if (msgData.CanGuo !== undefined && msgData.CanGuo === 1) {
                this.btn_guo.active = false;
            }
        }
        else{
            // this.node_CPGH.getChildByName("hu_btn").getComponent(cc.Button).interactable = false
        }
        // if (msgData.hunGang > 0) {
        //     this.node_CPGH.getChildByName("hunGang_btn").getComponent(cc.Button).interactable = true;
        //     this._selectPai = msgData.hunGang;
        // } else {
        //     this.node_CPGH.getChildByName("hunGang_btn").getComponent(cc.Button).interactable = false;
        // }
        this.btn_guo.active = true;
        this._tipPGHCuid = msgData.uid;
    },
    refreshView (msgData) {
        cc.log(msgData,"msgData====>>")
        var nodeIndex = 0;
        this._chiCount = 0;
        this._gangCount = 0;
        this.btn_guo.active = true;
        this.chiList = msgData.listchi;
        this.isChi = true;
        if (msgData.peng === 1) {
            var nodeOpt = this.node_opts[nodeIndex++];
            nodeOpt.active = true;
            this.refreshBtnView(nodeOpt,msgData.listpeng, 0);
            this._pengPai = msgData.listpeng[0];
        } 
        if (msgData.gang === 1) {
            var nodeOpt = this.node_opts[nodeIndex++];
            nodeOpt.active = true;
            this.refreshBtnView(nodeOpt,msgData.listgang, 1);

            this._gangCount = msgData.listgang.length;
            if (this._gangCount === 1) {
                this._gangPai = msgData.listgang[0];
            } else {
                this.refreshGangView(msgData.listgang);
            }
        } 
        if (msgData.chi === 1) {
            var nodeOpt = this.node_opts[nodeIndex++];
            nodeOpt.active = true;
            this.refreshBtnView(nodeOpt,null,2);

            this._chiCount = msgData.listchi.length;
            if (this._chiCount == 1) {
                var chiData = msgData.listchi[0];
                this._chiType = chiData._Key;
            } else {
                //this.refreshChiView(msgData.listchi);
            }
        } 
        if (msgData.hu === 1) {
            var nodeOpt = this.node_opts[nodeIndex++];
            nodeOpt.active = true;
            this.refreshBtnView(nodeOpt,null,3);
            this._huPai = msgData.hupai;

            if (msgData.CanGuo !== undefined && msgData.CanGuo === 1) {
                this.btn_guo.active = false;
            }
        } 
        if (msgData.xuNi === 1) {
            this.btn_virtualFive.active = true;
            this._virtualPai = msgData.listXuNi[0];
        }
        this._tipPGHCuid = msgData.uid;
    },

    refreshChiView (listChi) {
        for (var i = 0; i < listChi.length; i++) {
            var chiData = listChi[i];
            var chiNode = this.node_chi[i];
            chiNode.key = chiData._Key;
            chiNode.active = true;
            this.refreshChiNode(chiNode, chiData._ListPai);
        }
    },

    refreshChiNode (chiNode, chiArr) {
        for (var i = 0; i < chiArr.length; i++) {
            var chiId = chiArr[i];
            var sprMj = chiNode.children[i].getComponent(cc.Sprite);
            sprMj.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",chiId);
        }
    },

    refreshGangView (listGang) {
        for (var i = 0; i < listGang.length; i++) {
            var gangNode = this.node_gang[i];
            gangNode.key = listGang[i];
            gangNode.active = true;
            gangNode.getComponent(cc.Sprite).spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_", listGang[i]);
        }
    },

    refreshMingLou (type) {
        // this.btn_mingLou.active = true;
        // this.btn_mingLouGuo.active = true;
        cc.log(type,"潇===================")
        this.node_CPGH.active = true
        this.node_CPGH.getChildByName("hu_btn").getComponent(cc.Button).interactable = false
        this.node_CPGH.getChildByName("chi_btn").getComponent(cc.Button).interactable = false
        this.node_CPGH.getChildByName("gang_btn").getComponent(cc.Button).interactable = false
        this.node_CPGH.getChildByName("peng_btn").getComponent(cc.Button).interactable = false
        this.node_CPGH.getChildByName("xiao_Guo").getComponent(cc.Button).node.active = true
        if(type == false){
            // this.node_CPGH.getChildByName("btn_Ting").getComponent(cc.Button).node.active = false
        }
        else{
            this.showBtn(false)
            //this.node_CPGH.getChildByName("btn_Ting").getComponent(cc.Button).node.active = true
        }
    },

    btnOnChi (event) {
        //this.node.active = false;
        this._selectPai = 0;
        this._chiType = event.target.key;
        this.PGCHSend(4);
    },

    btnOnGang (event) {
        this._selectPai = event.target.key;
        this.PGCHSend(1);
    },

    refreshBtnView (nodeOpt,mjArr,index) {
        var script = nodeOpt.getComponent("MyOperate");
        script.refreshBtnView(mjArr,index);
    },

    btnOnPGCHG (event,customEventData) {
        switch(customEventData) {
            case "pengOption":{
                this._selectPai = this._pengPai;
                this.PGCHSend(0);
            }
                break;
            case "gangOption":{
                if (this._gangCount === 1) {
                    this._gangCount = 0;
                    this._selectPai = this._gangPai;
                    this.PGCHSend(1);
                }
            }
                break;
            case "hunGangOption":{
                this.PGCHSend(1);
            }
                break;
            case "chiOption":{
                if (this._chiCount == 1) {
                    this._chiCount = 0;
                    this._selectPai = 0;
                    this.PGCHSend(4);
                }
                //吃牌提示显示
                else{
                    if(this.isChi == true){
                        this.isChi = false
                        cc.log( this.chiList,"持牌提示")
                        this.refreshChiView(this.chiList);
                    }
                   else if(this.isChi == false){
                        this.isChi = true
                        for (var i = 0; i < this.node_chi.length; i++) {
                            var node = this.node_chi[i];
                            node.active = false;
                        }
                   }
                }
            }
                break;
            case "huOption":{
                this._selectPai = this._huPai;
                this.PGCHSend(2);
            }
                break;
            case "guoOption": {
                this.PGCHSend(3);
            }
                break;
            default:
                break;
        }
    },

    PGCHSend (optionType) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.PENG_GANG_HU_OPT_SMALLID_SED;
        data.beiuid = this._tipPGHCuid;   //这个uid要用提示信息里面的uid
        data.pai = this._selectPai;      //提交碰杠的牌 吃牌传0
        data.type = optionType;   //0 碰 1 杠 2.胡 3. 取消 4.吃
        data.chitype = this._chiType;         //1.左左吃  2. 左右吃  3. 右右吃

        G.socketMgr.socket.send(this.gameId, cc.globalMgr.msgObjs.pengGangHuSend(data));
    },

    btnOnMingLou () {
        this.mingLouSend(2);
    },

    btnOnMingLouGuo () {
        this.mingLouSend(1);
    },
    btnOnTianTing () {
        this.mingLouSend(3);
    },
    mingLouSend (optionType) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.MINGLOU_SMALLID_SEND;
        data.type = optionType;            //1为 过  2.为 提交明楼

        G.socketMgr.socket.send(this.gameId, cc.globalMgr.msgObjs.mingLouSend(data));
        cc.log(data,"tijiao,mmignsdfada")
    },

    refreshVirtualFiveColor () {
        var nodeChilds = this.node_xuni5.children;
        var sprite = nodeChilds[0].getComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",5);
        sprite = nodeChilds[1].getComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",15);
        sprite = nodeChilds[2].getComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",25);
    },

    refreshVirtualView (fiveArray) {
        this.node_xuni5.active = true;
        var useCount = 0;
        for (var i = 0; i < this.fiveButtonArr.length; i++) {
            var button = this.fiveButtonArr[i];
            button.interactable = true;
            button.enableAutoGrayEffect = true;
        }

        var button = this.fiveButtonArr[3];
        button.node.active = false;

        for (var i = 0; i < fiveArray.length - 1; i++) {
            var fiveData = fiveArray[i];
            if (fiveData.isUse) {
                var button = this.fiveButtonArr[i];
                button.interactable = false;
                useCount += 1;
            }
        }

        if (useCount === 3) {
            var button = this.fiveButtonArr[3];
            button.node.active = true;
        }

        this.refreshVirtualFiveColor();
    },

    btnOnVirtualFive (event,customEventData) {
        switch(customEventData) {
            case "virtual5":{
                this.node.active = false;
                this.virtualFiveSend(5);
            }
                break;
            case "virtual15":{
                this.node.active = false;
                this.virtualFiveSend(15);
            }
                break;
            case "virtual25":{
                this.node.active = false;
                this.virtualFiveSend(25);
            }
                break;
            case "virtualRandom":{
                this.node.active = false;
                this.virtualFiveSend(0);
            }
                break;
            case "virtualGang":{
                this.node.active = false;
                this.virtualFiveGangSend(0);
            }
                break;
            default:
                break;
        }
    },

    virtualFiveSend (mjId) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.MOPING_XUNI5_SMALLID_SEND;
        data.pai = mjId;

        G.socketMgr.socket.send(this.gameId, cc.globalMgr.msgObjs.virtualFiveSend(data));
    },

    virtualFiveGangSend () {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.MOPING_XUNI5_GANG_SMALLID_SEND;
        data.pai = this._virtualPai;

        G.socketMgr.socket.send(this.gameId, cc.globalMgr.msgObjs.virtualFiveSend(data));
    },

    refreshMjColor (msgBody, target) {
        for (var i = 0; i < target.fiveButtonArr.length; i++) {
            var button = target.fiveButtonArr[i];
            var mjSprite = button.node.getComponent(cc.Sprite);
            switch(i){
                case 0:
                    mjSprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",5);
                    break;
                case 1:
                    mjSprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",15);
                    break;
                case 2:
                    mjSprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",25);
                    break;
                case 3:
                    mjSprite.spriteFrame = cc.globalMgr.mahjongmgr.getHoldsEmptySpriteFrame("up");
                    break;
                default:
                    break;
            }
        }
    },

    onDestroy: function () {
        cc.globalMgr.EventManager.getInstance().unregist(this);
    },
});
