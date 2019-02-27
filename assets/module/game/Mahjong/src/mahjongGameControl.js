var GameFrame = require("GameFrame")
var cmd = require("CMD_mahjong")
var chatConfig = require("ChatConfig");
var MsgIds = require("MsgIds")

cc.Class({
    extends: GameFrame,

    properties: {
        gameRoot: {
            default: null,
            type: cc.Node
        },

        prepareRoot: {
            default: null,
            type: cc.Node
        },

        prefab_myPGC: {
            default: null,
            type: cc.Prefab,
        },

        prefab_rightPGC: {
            default: null,
            type: cc.Prefab,
        },

        prefab_upPGC: {
            default: null,
            type: cc.Prefab,
        },

        prefab_leftPGC: {
            default: null,
            type: cc.Prefab,
        },

        spr_tingPaiTip: {
            default: null,
            type: cc.SpriteFrame,
        },

        prefab_tingPaiTip: {
            default: null,
            type: cc.Prefab,
        },

        node_voice: {
            default: null,
            type: cc.Button,
        },
        btn_leaveRoom: {
            default: null,
            type: cc.Button,
        },
        mask_bg: {
            default: null,
            type: cc.Node,
        },
        btn_share: {
            default: null,
            type: cc.Node,
        },
        btn_prepare: {
            default: null,
            type: cc.Node,
        },
        btn_prepareJinBi: {
            default: null,
            type: cc.Node,
        },
        btn_changeDesk: {
            default: null,
            type: cc.Node,
        },
        btn_copy: {
            default: null,
            type: cc.Node,
        },
        none_kaiJin: {
            default: null,
            type: cc.Prefab,
        },
        spr_bg: {
            default: null,
            type: cc.Sprite,
        },
        sprframe_bg: {
            default: [],
            type: cc.SpriteFrame,
        },
        node_gangVirtualFive: {
            default: null,
            type: cc.Node,
        },
        spr_virtualFiveTip: {
            default: null,
            type: cc.SpriteFrame,
        },
        node_jinTip: {
            default: null,
            type: cc.Node,
        },

        node_kaiJin: {
            default: null,
            type: cc.Node,
        },

        node_location:{
            default: null,
            type: cc.Node,
        },
        tipsShow:{
            default: null,
            type: cc.Node,
        },
        chat_node:{
            default: null,
            type: cc.Node,
        },
        none_shaiZi: {
            default: null,
            type: cc.Prefab,
        },
        sprframe_paoFens: {
            default: [],
            type: cc.SpriteFrame,
        },
        prefab_mjGameSetting: {
            default: null,
            type: cc.Prefab,
        },
        _myMJArr: [],
        _myMJShowArr: [],   // 用于保存显示的麻将
        _options: null,
        _selectedMJ: null,
        _chupaiSprite: [],
        _mjcount: null,
        _gamecount: null,
        _seatNodes: [],
        _seatPrareNodes: [],
        _pengGangNodes: [],
        _huaPaiNodes: [],
        _optAnimNodes: [],
        _pengGangDatas: [],
        _mjLimitOneDrag : false,
        _mjIsDraging: false,
        _failPai:null,
        _isBaoTing: false,
        _tingPaiTips: [],
        _paoFenSprArr: [],
        _dingQueType: -1,
    },

    onLoad() {

        this.addComponent("Folds");
        this.addComponent("Holds"); 
        this.addComponent("mj_InfoBar");

        this.mask_bg.active = true;
        this.initView();
        this._playerCount = 4;
        this._realPlayerNum = 2;
        this.clubId = 0;
        this.initSeatDatas();
        this.initTouchEvent();
        this._isTingPaiMsg = false;
        this._isSmallResultRefresh = false;
        this._sex = G.myPlayerInfo.sex;
        this._isMingLou = false;
        this._isGameStart = false;
        this._isPlayOptAnim = false;
        this._refreshUserInfo = false;
        this._refreshVirtualFiveJinBi = true;
        this._clickSwitchDesk = false;
        this._hunZiArr = [];
        this.initNet();
        this.isMingLou = false;     //明楼
        this.isTinTing = false;     //天听
        // this.initCMDFunc();
        this.bindVoiceBtnAndUsersBox(this.node_voice, this._seatNodes);
        this.bindUsersBox(this._seatNodes);

        cc.globalMgr.EventManager.getInstance().regist("refreshMjColor", this, this.refreshMjColor);

        this.refreshMjSetting();

        // if (G.gameNetId === 100) {
        //     this.refreshYanTaiView();
        // }

       
        

    },

    start() {
        this.playLandBgMusic();
    },

    initNet() {
        cc.globalMgr.service.getInstance().regist(cc.globalMgr.msgIds.OTERR_LEAVE_ROOM_NETID, this, this.onOtherLeaveRoom);
    },

    initView() {
        var gameChild = this.node.getChildByName("node_game");

        this._mjcount = gameChild.getChildByName('label_mjcount').getComponent(cc.Label);
        this._mjcount.string = "剩" + "0" + "张";
        this._gamecount = gameChild.getChildByName('label_gamecount').getComponent(cc.Label);
        this._gamecount.string = "剩" + "0" + "局";

        var myselfChild = gameChild.getChildByName("myself");
        this._myselfChild = myselfChild;
        var myholds = myselfChild.getChildByName("holds");
        this._myholds = myholds;

        // this._chuPaidrag = myselfChild.getChildByName("node_myDrag").getChildByName('chupaidrag');
        // this._chuPaidrag.position = cc.p(0,-500);
        // this._chuPaidrag.active = false;

        // this._chupaidrag = gameChild.getChildByName('chupaidrag');
        // this._chupaidrag.active = false;

        for (var i = 0; i < myholds.children.length; ++i) {
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            sprite.node.addComponent("mjMyMahjong").init(this);
            this._myMJArr.push(sprite);
            // sprite.spriteFrame = null;
            var button = sprite.node.getComponent(cc.Button);
            button.nodeMjOptAnim = true;
        }
       

        var realwidth = cc.director.getVisibleSize().width;
        myholds.scaleX *= realwidth / 1280;
        myholds.scaleY *= realwidth / 1280;

        var sides = ["myself", "right", "up", "left"];
        for (var i = 0; i < sides.length; ++i) {
            var side = sides[i];

            var sideChild = gameChild.getChildByName(side);
            this._chupaiSprite.push(sideChild.getChildByName("ChuPai").children[0].getComponent(cc.Sprite));
            this._seatNodes.push(sideChild.getChildByName("node_seat"));
            this._seatPrareNodes.push(sideChild.getChildByName("node_seat").getChildByName("spr_ok"));
            this._pengGangNodes.push(sideChild.getChildByName("penggangs"));
            this._huaPaiNodes.push(sideChild.getChildByName("node_huaPai"));
            this._optAnimNodes.push(sideChild.getChildByName("node_mjOptAnim"));
            this._tingPaiTips.push(sideChild.getChildByName("node_seat").getChildByName("spr_tingpai"));
        }

        this._nodeArrow = gameChild.getChildByName("node_arrow");
        //初始化隐藏方向指示
        this._nodeArrow.getChildByName("spr_arrowFrame").getComponent(cc.Sprite).node.active = false;
        this._scriptArrow = this._nodeArrow.getComponent("ArrowControl");
        this._nodePGCH = gameChild.getChildByName("node_pgch");
        //回放吃碰杠提示
        this._rightPGCH = gameChild.getChildByName("right_pgch");
        this._leftPGCH = gameChild.getChildByName("left_pgch");
        this._upPGCH = gameChild.getChildByName("up_pgch");

        var nodeRightBtn = this.node.getChildByName("node_rightBtn");
        this._btnPullDown = nodeRightBtn.getChildByName("btn_pullDown");
        this._btnPullUp = nodeRightBtn.getChildByName("btn_pullUp");
        this._sprPullDownBg = nodeRightBtn.getChildByName("spr_pullDownBg");
        this._btnDissolve = this._sprPullDownBg.getChildByName("layout_btnPull").getChildByName("btn_applyDissolve");
        this._btnLocation = this._sprPullDownBg.getChildByName("layout_btnPull").getChildByName("btn_location");

        this._nodeSmallResult = this.node.getChildByName("node_smallResult");
        this._nodeBigResult = this.node.getChildByName("node_bigResult");
        //麻将回放控制面板
        this._rePlayBtnControl = this.node.getChildByName("node_rePlayBtnControl");
        //买马面板
        this._buyHorse = this.node.getChildByName("buyhorse");
       
        this._nodeGangDing = gameChild.getChildByName("node_gangDing");
        this._sprGangDing = this._nodeGangDing.getChildByName("spr_mj").getComponent(cc.Sprite);

        this._nodeTestReqMj = this.node.getChildByName("node_testReqMj");
        this._btnTestReqMj = gameChild.getChildByName("btn_testRetMj");

        this._nodeJinPai = gameChild.getChildByName("node_jinPai");
        this._sprJinPai1 = this._nodeJinPai.getChildByName("spr_Jin1").getComponent(cc.Sprite);
        this._sprJinPai2 = this._nodeJinPai.getChildByName("spr_Jin2").getComponent(cc.Sprite);

        this._nodeVirtualFive = gameChild.getChildByName("node_xuni5");
        this._nodeHaiDiLaoTip = gameChild.getChildByName("spr_haiDiLao");

        this._sprMjKaiJin = this.node_kaiJin.getChildByName("spr_mjKaiJin").getComponent(cc.Sprite);

        // this._nodeTingBtn = gameChild.getChildByName("btn_ting");
        this._nodeXiaPao = gameChild.getChildByName("node_xiaPao");
        var paoFenTipNode = gameChild.getChildByName("node_paoFenTip");
        for (var i = 0; i < paoFenTipNode.children.length; i++) {
            this._paoFenSprArr.push(paoFenTipNode.children[i].getComponent(cc.Sprite));
        }
        this._nodeDingQue = gameChild.getChildByName("node_dingque");

        if (G.isTestVer) {
            this._btnTestReqMj.active = true;
        }
        if(G.isCoinRoom == true){
            this.chat_node.active = false
           
        }
        else{
            this.chat_node.active = true
        }
    },
    onClickShaiZi(){
        this.setShaiZiShow(3,6);
    },
    //开始筛子
    setShaiZiShow(diceValue1, diceValue2){
        //添加筛子动画
        // var curCard = cc.instantiate(cc.globalRes["runShaiZiEffect"]);
        var curCard = cc.instantiate(this.none_shaiZi);
        curCard.parent = this.node;
        curCard.getComponent("animationComm").startAnimation();
        curCard.getComponent("animationComm").setPointForDice(diceValue1, diceValue2);
    },
    initTouchEvent () {
        var self = this;
        this.node.on('mj_touchevent_shoot', function (event) {
            if (!self._isMyTurn && !self._nodePGCH.active) {
                console.log("not your turn.");
                return;
            }
            var sender = event.target;
            self.clearAllTingUI();
            // cc.mahjong3d.mahjong3dmgr.playAudioOpt(self._sex, "ting");
            self.shoot(sender.mjId);
            sender.active = false;
            self._failPai = sender;
            if(self.holds.length == 2 || self.holds.length == 5 || self.holds.length == 8 || self.holds.length == 11 || self.holds.length == 14 ){
                self._failPai.active = false;
            }
            else{
                self._failPai.active = true;
            }
            if (self._selectedMJ) {
                // self._selectedMJ.y = 0;
                self._selectedMJ = null;
            }
            self._mjIsDraging = false;
        });

        this.node.on('mj_dragevent_start', function (event) {
            // if (self._selectedMJ) {
            //     self._selectedMJ.y = 0;
            //     self._selectedMJ = null;
            // }
            self._mjIsDraging = true;
        });

        this.node.on('mj_touchevent_end', function (event) {
            cc.log(self._selectedMJ,"------------_selectedMJ--------------->>")
            if (self._selectedMJ) {
                self._selectedMJ.y = 0;
                self._selectedMJ = null;
            }
            self._mjIsDraging = false;
        });
    },
    refreshMyHoldsPos () {
        for (var i = 0; i < this._myMJArr.length; i++) {
            var sprite = this._myMJArr[i];
            sprite.node.y = 0;
        }
    },
    refreshOtherHoldsView (holdScript, flag) {
        cc.log("ooooooooooooo---",flag)
        if (this._playerCount === 2) {
            holdScript.refreshTopHolds(flag);
        } else if (this._playerCount === 3) {
            holdScript.refreshThreeHolds(flag);
        } else {
            holdScript.refreshOtherHolds(flag);
        }
    },

    refreshVirtualFiveJinBiView() {
        var virtualFivePos = this._nodeVirtualFive.position;
        this._nodeVirtualFive.position = cc.p(virtualFivePos.x, virtualFivePos.y + 5);
        this._nodeVirtualFive.scale = 1.0;

        var mjCountNode = this.node.getChildByName("node_game").getChildByName('label_mjcount');
        var mjCountNodePos = mjCountNode.position;
        mjCountNode.position = cc.p(mjCountNodePos.x, mjCountNodePos.y - 32);
    },

    refreshYanTaiView() {
        var mjCountNode = this.node.getChildByName("node_game").getChildByName('label_mjcount');
        var mjCountNodePos = mjCountNode.position;
        mjCountNode.position = cc.p(mjCountNodePos.x, mjCountNodePos.y - 32);

        var gameCountNode = this.node.getChildByName("node_game").getChildByName('label_gamecount');
        var gameCountNodePos = gameCountNode.position;
        gameCountNode.position = cc.p(gameCountNodePos.x, gameCountNodePos.y - 32);
    },

    refreshMjSetting() {
        var mjYellow = this.getLocalData("mjYellow");
        if (mjYellow) {
            cc.globalMgr.mahjongmgr.setAltas("yellow");
        }
        var mjGreen = this.getLocalData("mjGreen");
        if (mjGreen) {
            cc.globalMgr.mahjongmgr.setAltas("green");
        }
        var mjBlue = this.getLocalData("mjBlue");
        if (mjBlue) {
            cc.globalMgr.mahjongmgr.setAltas("blue");
        }

        //先整个初始化
        if (G.gameNetId === 3800) {
            this.spr_bg.spriteFrame = this.sprframe_bg[0];
        } else if (G.gameNetId === 3900) {
            this.spr_bg.spriteFrame = this.sprframe_bg[3];
        }

        var deskPurple = this.getLocalData("deskPurple");
        if (deskPurple) {
            if (G.gameNetId === 3800) {
                this.spr_bg.spriteFrame = this.sprframe_bg[0];
            } else if (G.gameNetId === 3900) {
                this.spr_bg.spriteFrame = this.sprframe_bg[3];
            }
        }
        var deskRed = this.getLocalData("deskRed");
        if (deskRed) {
            if (G.gameNetId === 3800) {
                this.spr_bg.spriteFrame = this.sprframe_bg[1];
            } else if (G.gameNetId === 3900) {
                this.spr_bg.spriteFrame = this.sprframe_bg[4];
            }
        }
        var deskBlue = this.getLocalData("deskBlue");
        if (deskBlue) {
            if (G.gameNetId === 3800) {
                this.spr_bg.spriteFrame = this.sprframe_bg[2];
            } else if (G.gameNetId === 3900) {
                this.spr_bg.spriteFrame = this.sprframe_bg[5];
            }
        }
    },

    refreshHoldsTouch(flag) {
        for (var i = 0; i < this._myMJArr.length; i++) {
            var sprite = this._myMJArr[i];
            var button = sprite.node.getComponent(cc.Button);
            button.interactable = true;
            sprite.node.removeAllChildren(true);
        }
    },

    isDingQuePai(mjId) {
        var mjType = cc.globalMgr.mahjongmgr.getMahjongType(mjId);
        if (this._dingQueType === mjType) {
            return true;
        }
        return false;
    },

    addQuePaiShader(node) {
        node.color = cc.Color.GRAY;
    },

    clearQuePaiShader(node) {
        node.color = cc.Color.WHITE;
    },

    refreshDingQueView(node, mjId) {
        if (this.isDingQuePai(mjId)) {
            this.addQuePaiShader(node);
        } else {
            this.clearQuePaiShader(node);
        }
    },

    clearAllDingQueShader() {
        for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            this.clearQuePaiShader(sprite.node);
        }
    },

    refreshHoldsDingQueShader() {
        for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            this.refreshDingQueView(sprite.node, sprite.node.mjId);
        }
    },

    clearAllTingUI () {
        if (this._isTingPaiMsg) {
            this.clearTingPaiTip();
            this._myselfChild.removeChildByTag(1);
        }
    },
    addJinTips(node) {
        var nodeJinTip = cc.instantiate(this.node_jinTip);
        nodeJinTip.position = cc.p(-19, 36);
        nodeJinTip.parent = node;
        nodeJinTip.tag = 100;
    },

    addVirtualFiveTip(node) {
        var virtualFiveTipNode = new cc.Node('Sprite');
        var sp = virtualFiveTipNode.addComponent(cc.Sprite);
        sp.spriteFrame = this.spr_virtualFiveTip;
        virtualFiveTipNode.parent = node;
        virtualFiveTipNode.position = cc.p(-14, 29);
    },

    clearDragMj () {
        if (this._selectedMJ != null) {
            cc.log("--------------错误处理- -----")
            var mahjongScript = this._selectedMJ.getComponent("mjMyMahjong");
            mahjongScript.mjTouchEnd(this._selectedMJ);
        }
    },

    refreshHolds(isHideMoPai,showMyMj) {
        cc.log("刷新自己的手牌")
        var holds = this.holds;
        if (holds == null) {
            return;
        }

        this.clearAllJinTips();
        this.clearAllTingUI();
       // this.clearTingPaiTip();
        this.clearDragMj();
        // this.refreshHoldsTouch(true);

        //初始化手牌
        var holdCount = holds.length;
        var mjArrCount = this._myMJArr.length;
        var dissCount = mjArrCount - holdCount;
        if (isHideMoPai) {
            dissCount -= 1;
            var sprite = this._myMJArr[mjArrCount - 1];
            sprite.node.active = false;
            if (dissCount < 0) {
                dissCount = 0;
            }
        }

        for (var i = 0; i < dissCount; ++i) {
            var sprite = this._myMJArr[i];
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }

        var index = 0;
        cc.log(holds,"------=========ssd")
        for (var i = 0; i < holds.length; ++i) {
            var mjid = holds[index++];
            var sprite = this._myMJArr[dissCount + i];
           
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            sprite.scale = 1
            this._myMJShowArr.push(sprite);
            for (var j = 0; j < this._hunZiArr.length; j++) {
                if (mjid === this._hunZiArr[j]) {
                    this.addJinTips(sprite.node);
                }
            }
            cc.log(showMyMj,"showMyMj===")
           
            if(this.isTinTing == true){
                //this.setSpriteFrameByMJID("S_", sprite, mjid);          //天听
                this.setSpriteTianTingByMJID("B_",sprite)
            }
            else{
                if(showMyMj!= undefined && showMyMj == 1){
                    this.setSpriteFrameByMJID("S_", sprite, mjid);
                    }
                else{
                    this.setSpriteFrameByMJID("M_", sprite, mjid);
                    this.refreshDingQueView(sprite.node, mjid);
                }
            }
        }
            cc.log("xianshishoupaissi")
        if (mjid > 50) {
            var button = sprite.node.getComponent(cc.Button);
            button.interactable = false;
            if (mjid > 100) {
                this.addVirtualFiveTip(sprite.node);
            }
        }

        // 处理13张手牌时左边间隔太大问题
        var pos = this._myholds.position;
        if (holdCount == 13) {
            this._myholds.position = cc.p(pos.x - 30, pos.y);
            this._isMoveMyHolds = true;
        } else {
            if (this._isMoveMyHolds) {
                this._myholds.position = cc.p(pos.x + 30, pos.y);
                this._isMoveMyHolds = false;
            }
        }
        var prepareNode = this._seatPrareNodes[0];
        prepareNode.active = false;
    },

    refreshMyHoldColor (mjNode, colorType) {
        var button = mjNode.getComponent(cc.Button);
        if (colorType === "white") {
            mjNode.color = cc.Color.WHITE;
            button.interactable = true;
            mjNode.isGray = false;
        } else if (colorType === "gray") {
            mjNode.color = cc.Color.GRAY;
            button.interactable = false;
            mjNode.isGray = true;
        }
    },

    refreshTingPaiHoldsColor () {
        for (var i = 0; i < this._myMJArr.length; i++) {
            var mjNode = this._myMJArr[i].node;
            if (mjNode.isCanTingPai) {
                this.refreshMyHoldColor(mjNode, "white");
            } else {
                this.refreshMyHoldColor(mjNode, "gray");
            }
        }
    },

    refreshAllHoldsColor (colorType) {
        for (var i = 0; i < this._myMJArr.length; i++) {
            var mjNode = this._myMJArr[i].node;
            this.refreshMyHoldColor(mjNode, colorType);
        }
    },

    refreshPengGang(seatData, isNotSaveData) {
        var pengGangs = seatData.pengGangs;
        cc.log(pengGangs,"oo============oo")
        if (pengGangs == null) {
            return;
        }
        var localIndex = seatData.seatindex;
        var side = cc.globalMgr.mahjongmgr.getSide(localIndex);
        var pengGangNode = this._pengGangNodes[localIndex];
        pengGangNode.active = true;
        pengGangNode.removeAllChildren(true);
        for (var i = 0; i < pengGangs.length; i++) {
            var pengGangData = pengGangs[i];
            var node = null;
            if (side == "myself") {
                node = cc.instantiate(this.prefab_myPGC);
                node.position = cc.p(175 * i, 0);
            } else if (side == "right") {
                node = cc.instantiate(this.prefab_rightPGC);
                node.position = cc.p(0, 100 * i);
            } else if (side == "up") {
                node = cc.instantiate(this.prefab_upPGC);
                node.position = cc.p(-130 * i, 0);
            } else if (side == "left") {
                node = cc.instantiate(this.prefab_leftPGC);
                node.position = cc.p(0, -100 * i);
            }
            node.parent = pengGangNode;
            var script = node.getComponent("PGCHolds");
            var sideId = this.getSeatIndex(pengGangData.wxid)
            script.refreshView(localIndex, pengGangData,sideId,side);
        }
        if (!isNotSaveData) {
            var isHave = false;
            for (var i = 0; i < this._pengGangDatas.length; i++) {
                var pengGangData = this._pengGangDatas[i];
                if (pengGangData.seatindex === localIndex) {
                    isHave = true;
                    break;
                }
            }
            if (isHave) {
                this._pengGangDatas.splice(localIndex, 1, seatData);
            } else {
                this._pengGangDatas.push(seatData);
            }
        }
    },

    setSpriteFrameByMJID(pre, sprite, mjid) {
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
    },
    //天听
    setSpriteTianTingByMJID(pre, sprite) {
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
        sprite.node.active = true;
    },
    shoot(mjId) {
        this.chuPaiSend(G.gameNetId, mjId);
        // this.showChupai(mjId);   // 有些问题，不显示
    },

    showChupai(mjId) {
        if (mjId >= 0) {
            var localIndex = 0;
            var sprite = this._chupaiSprite[localIndex];
            sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_", mjId);
            sprite.node.active = true;
        }
    },

    initSeatDatas() {
        this._seatDatas = [];
        for (var i = 0; i < this._playerCount; i++) {
            var seatData = {};
            seatData.seatindex = i;
            seatData.folds = [];
            seatData.pengGangs = [];
            this._seatDatas.push(seatData);
        }
        this._isMyTurn = false;
    },

    clearSeatDatas() {
        var length = this._seatDatas.length;
        for (var i = 0; i < length; i++) {
            var seatData = this._seatDatas[i];
            seatData.folds = [];
            seatData.pengGangDatas = [];
        }
    },

    clearSeatDingQueUI() {
        for (var i = 0; i < this._seatNodes.length; i++) {
            var seatNode = this._seatNodes[i];
            var seatScript = seatNode.getComponent("mj_Seat");
            seatScript.hideDingQueTips(false);
        }
    },

    clearView() {
        cc.log("yinchangpai")
        var foldScript = this.getComponent("Folds");
        foldScript.hideAllFolds();
        var holdScript = this.getComponent("Holds");
        holdScript.refreshAllHolds(false);

        var length = this._pengGangNodes.length;
        for (var i = 0; i < length; i++) {
            var pengGangNode = this._pengGangNodes[i];
            pengGangNode.active = false;
            pengGangNode.removeAllChildren(true);
        }

        this._scriptArrow.refreshAllArrowActive(false);
        this._nodeJinPai.active = false;
        this._hunZiArr = [];
        this.clearAllJinTips();

        var length = this._huaPaiNodes.length;
        for (var i = 0; i < length; i++) {
            var huaPaiNode = this._huaPaiNodes[i];
            huaPaiNode.active = false;
        }

        this._isMingLou = false;
        if (G.gameNetId === 200) {
            this._nodeVirtualFive.active = false;
        }

        this._nodeHaiDiLaoTip.active = false;
        this._isBaoTing = false;
        this.clearTingPaiTips();
        // this.refreshAllHoldsColor("white");
        this.clearPaoFen();
        this._nodeDingQue.active = false;
        this.clearAllDingQueShader();
        this.clearSeatDingQueUI();
        this._dingQueType = -1;

        this._pengGangDatas = [];
    },

    clearPaoFen() {
        for (var i = 0; i < this._paoFenSprArr.length; i++) {
            var sprPao = this._paoFenSprArr[i];
            sprPao.node.active = false;
        }
    },

    //
    clearJinTips(node) {
        node.removeChildByTag(100);
    },

    clearAllJinTips() {
        for (var i = 0; i < this._myMJArr.length; i++) {
            var mjNode = this._myMJArr[i].node;
            this.clearJinTips(mjNode);
        }
    },

    clearPrepareView() {
        for (var i = 0; i < this._seatPrareNodes.length; i++) {
            var prepareNode = this._seatPrareNodes[i];
            prepareNode.active = false;
        }
    },

    clearTingPaiTips () {
        for (var i = 0; i < this._tingPaiTips.length; i++) {
            var tingPaiNode = this._tingPaiTips[i];
            tingPaiNode.active = false;
        }
    },

    refreshBtnView(flag) {
        cc.log("1111111")
        this.btn_share.active = flag;
        this.btn_prepare.active = flag;
        this.btn_copy.active = flag;
    },

    refreshJinBiBtnView(flag) {
        this.btn_prepareJinBi.active = flag;
        this.btn_changeDesk.active = flag;
    },

    isVipForMe() {
        var userInfo = this.getUserInfo(G.myPlayerInfo.wxId);
        return userInfo.isVip;
    },

    // 控件事件回调
    btnOnTingPai () {
        this._isBaoTing = true;
        this._nodeTingBtn.active = false; 
        this.refreshTingPaiHoldsColor();
    },

    btnOnLeaveRoom() {
        this.playClickMusic();
        if (G.mjGameInfo.roomInfo.isjinbi) {
            this.goldRoomReturnHome(this._isGameStart);
        } else {
            this.enterHome();
            // cc.log(this.clubId,"俱乐部ID")
            // this.applyLeaveRoom(this.clubId)
        }
    },

    btnOnApplyDissolution() {
        this.playClickMusic();
        cc.log(this.clubid,"apply Dissolution");
        this.applyDissolution(this.clubid);
    },

    btnOnSet() {
        this.playClickMusic();
        cc.log("设置按钮")
        if (this._gameSetting === undefined) {
            this._gameSetting = cc.instantiate(this.prefab_mjGameSetting);
            this._gameSetting.parent = this.node;
        } else {
            this._gameSetting.active = true;
        }
        var script = this._gameSetting.getComponent("mjGameSetting");
        script.setBgMusicId(this.gameBgMusicId);
        script.parent = this;
    },

    playLandBgMusic() {
        this.gameBgMusicId = this.playBgMusic("resources/sounds/mahjong/bgMain.mp3", true);
    },

    btnOnLocation() {
        cc.log("点击了位置");

    },
    //点击任意区域将牌放下
    onclickPullDownMj(){
        for (var i = 0; i < this._myMJArr.length; ++i){
            this._myMJArr[i].node.y = 0;
        }
        this._selectedMJ = null;
        if (this._isTingPaiMsg) {
            //this.clearTingPaiTip();
            this._myselfChild.removeChildByTag(1);
        }
    },
    onMJClicked(event) {
        //this.playClickMusic();
        if(this.isMingLou == true){
            cc.log("明楼了 不能出牌")
            return;
        }
        if (!this._isMyTurn && !this._nodePGCH.active) {
            console.log("not your turn.");
            return;
        }
        cc.log("拖动出牌")
        //cc.globalMgr.mahjongmgr.playAudioURL();
        if (this._mjIsDraging) {
            cc.log("mj is draging return.拖牌错误处理");
            if (self._selectedMJ) {
                this.clearDragMj();
                self._selectedMJ.y = 0;
                self._selectedMJ = null;
            }
            return;
        }
        for (var i = 0; i < this._myMJArr.length; ++i) {
            if (event.target == this._myMJArr[i].node) {
                if (event.target == this._selectedMJ) {
                    if (this._isMyTurn) {
                        this.shoot(this._selectedMJ.mjId);
                    }
                    this._selectedMJ.y = 0;
                    this._selectedMJ = null;
                    //if (this._isTingPaiMsg) {
                        //this.clearTingPaiTip();
                    this.clearAllTingUI();
                        //cc.globalMgr.mahjongmgr.playAudioOpt(this._sex, "ting");
                    //}
                    cc.log("点击麻将")
                    return;
                }
                cc.log(this._selectedMJ,"-=-=-=-=-=-=-=-=-=")
                if (this._selectedMJ != null) {
                    this._selectedMJ.y = 0;
                    if (this._isTingPaiMsg) {
                        this._myselfChild.removeChildByTag(1);
                    }
                }
                event.target.y = 30;
                this._selectedMJ = event.target;
                
                if (this._isTingPaiMsg) {
                    this.showTingPaiTip(this._selectedMJ);
                }
                return;
            }
        }
    },

    showTingPaiTip (selectedMj) {
        if (selectedMj.tingPaiDatas === undefined) {
            return;
        }

        if (this._myselfChild.getChildByTag(1) != null) {
            this._myselfChild.removeChildByTag(1);
        }

        var tipNode = cc.instantiate(this.prefab_tingPaiTip);
        tipNode.parent = this._myselfChild;
        tipNode.position = cc.p(0,-200);
        tipNode.tag = 1;
        var script = tipNode.getComponent("TingPaiTip");
        script.refreshView(selectedMj.tingPaiDatas);
    },

    clearTingPaiTip() {
        if (!this._isTingPaiMsg) {
            return;
        }

        this._isTingPaiMsg = false;
        for (var i = 0; i < this._myMJShowArr.length; i++) {
            var sprite = this._myMJShowArr[i];
            sprite.node.removeAllChildren(true);
            sprite.node.tingPaiDatas = undefined;
            sprite.node.isCanTingPai = false;
        }
    },

    btnOnPullDown() {
        this.playClickMusic();
        this._btnPullDown.active = false;
        this._btnPullUp.active = true;
        this._sprPullDownBg.active = true;
    },
    //定位
    btnOnLocation(){
        cc.globalMgr.GameFrameEngine.sendLocation()
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        G.socketMgr.socket.send(cmd.LOCATION_MAIN, data);
        cc.globalMgr.service.getInstance().regist(cmd.LOCATION_MAIN, this, this.getLocationMsg);
    },
    getLocationMsg(msgNumber, body, target){
        var indexSead = [];
        //var indexSide;
        target.node_location.active = true
        var script = target.node_location.getComponent("Location")
        script.parent = target;
        for(i=0;i<body.imageList.length;i++){
            indexSead.push(target.getSeatNode(body.imageList[i].idx).seatIndex)
        }
       
        script.refreshInfos(body,indexSead);
    },

    btnOnPullUp() {
        this.playClickMusic();
        this._btnPullDown.active = true;
        this._btnPullUp.active = false;
        this._sprPullDownBg.active = false;
    },

    btnOnChat() {
        this.playClickMusic();
        cc.globalMgr.globalFunc.addChatLayer(G.gameNetId);
    },

    btnOnSeat(event, customEventData) {
        this.playClickMusic();
        var isVipForMe = this.isVipForMe();
        if(G.mjGameInfo.roomInfo.isjinbi == true){
            G.isCoinRoom = true;
        }
        switch (customEventData) {
            case "mySeatClicked": {
                var targetWxId = event.target.getComponent("mj_Seat").getUserWxId();
                var userInfo = this.getUserInfo(targetWxId);
                cc.globalMgr.globalFunc.addGameUserInfo(true, targetWxId, userInfo, false, false);
                break;
            }
            case "rightSeatClicked": {
                var targetWxId = event.target.getComponent("mj_Seat").getUserWxId();
                var userInfo = this.getUserInfo(targetWxId);
                cc.globalMgr.globalFunc.addGameUserInfo(false, targetWxId, userInfo, isVipForMe, G.mjGameInfo.roomInfo.isjinbi);
                break;
            }
            case "upSeatClicked": {
                var targetWxId = event.target.getComponent("mj_Seat").getUserWxId();
                var userInfo = this.getUserInfo(targetWxId);
                cc.globalMgr.globalFunc.addGameUserInfo(false, targetWxId, userInfo, isVipForMe, G.mjGameInfo.roomInfo.isjinbi);
                break;
            }
            case "leftSeatClicked": {
                var targetWxId = event.target.getComponent("mj_Seat").getUserWxId();
                var userInfo = this.getUserInfo(targetWxId);
                cc.globalMgr.globalFunc.addGameUserInfo(false, targetWxId, userInfo, isVipForMe, G.mjGameInfo.roomInfo.isjinbi);
                break;
            }
            default:
                break;
        }
    },
    //要牌
    btnOnReqMj() {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = cmd.GETMJFORSERVE_RES;
        G.socketMgr.socket.send(G.gameNetId, data);
    },
    openGetMj(msgNumber){
        this._nodeTestReqMj.active = true;
        var script = this._nodeTestReqMj.getComponent("testReqMj")
        script.parent = this;
        script.refreshNum(msgNumber.listPai);
    },
    //点击分享按钮
    // btnOnShare() {
    //     cc.log(G.mjGameRule,"youxiwanfa")
    //     this.playClickMusic();
    //     var fir =  'http://www.5008008.cn/?name='+ G.mjGameInfo.roomInfo.roomId +'&type=abc'

    //     var shareStr = "房间号:" + G.mjGameInfo.roomInfo.roomId + "," + G.mjGameInfo.roomInfo.wanFaTips + ",速度来!可通过连接直接进入房间";
    //     var userinfo = undefined
    //     var userNum = this._playerCount - this._userInfoSorts.length
    //     if(userNum >0){
    //         if(this._userInfoSorts != undefined){
    //             userinfo =" ("+ this._userInfoSorts.length +" 缺 " + userNum+") "
    //         }
    //     }else{
    //         userinfo = " "
    //     }
       
    //     var title = "";
    //     if (G.gameNetId === 2400) {
    //         title = "宁海麻将：";
    //     } else if (G.gameNetId === 2500) {
    //         title = "三门麻将：";
    //     }
    //     // this.wxShare(title, G.shareHttpServerPath, shareStr, "0", 2);
    //     //this.wxShare(title+userinfo, fir, shareStr, "0", 2);
    //     this.wxShare("房号【" + G.mjGameInfo.roomInfo.roomId +"】" +  userinfo, fir, title +G.mjGameRule+"\n点击链接直接进入", "0", 2)
    // },

    btnOnShare() {
        this.playClickMusic();
        var shareStr = "房间号:" + G.mjGameInfo.roomInfo.roomId + "," + G.mjGameInfo.roomInfo.wanFaTips + ",速度来!";
        var title = "9桌棋牌";
        if (G.gameNetId === 3800) {
            title = "划水麻将";
        } else if (G.gameNetId === 3900) {
            title = "红中麻将";
        }
        this.wxShare(title, G.shareHttpServerPath, shareStr, "0", 2);
    },

    btnOnPrepare() {
        cc.log("准备开始游戏")
       
        this.btn_prepare.active = false;
        this.btn_prepareJinBi.active = false;
        this.prapareSend(G.gameNetId);
    },

    btnOnCopy() {
        if (G.gameNetId === 100) {
            this.copyString("宁海麻将,房号:" + G.mjGameInfo.roomInfo.roomId);
        } else if (G.gameNetId === 200) {
            this.copyString("三门麻将,房号:" + G.mjGameInfo.roomInfo.roomId);
        }
    },

    btnOnChangeDesk() {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;


        G.socketMgr.socket.send(MsgIds.CHANGE_TABLE, cc.globalMgr.msgObjs.mahjongGameContinue(data));
        this._clickSwitchDesk = true;
    },

    // 网络发送
    chuPaiSend(gameId, mjId) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = cmd.CHU_PAI_SMALL_NETID;
        data.chupai = mjId;
        data.isBaoTing = this._isBaoTing;
        G.socketMgr.socket.send(gameId, data);
    },

    prapareSend(gameId) {
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.zinetid = cmd.PLYAER_PREPARED_SMALLID_RET;

        G.socketMgr.socket.send(gameId, cc.globalMgr.msgObjs.prapareSend(data));
    },

    // 网络回调
    onOtherLeaveRoom(msgNumber, body, target) {
        cc.log("otherLeaveRoom success!");
        var userCount = target._userInfoSorts.length;
        for (var i = 0; i < userCount; i++) {
            var userInfo = target._userInfoSorts[i];
            if (userInfo.wxId === body.wxid) {
                var seatNode = target._seatNodes[i];
                seatNode.active = false;
            }
        }
    },

    hideOtherLastHold() {
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            var userInfo = this._userInfoSorts[i];
            if (userInfo.wxId !== G.myPlayerInfo.wxId) {
                var seatIndex = userInfo.seatIndex;
                var holdScript = this.getComponent("Holds");
                holdScript.hideLastHolds(seatIndex, false);
            }
        }
    },

    onFaPai(body) {        
        cc.log(body,"onFaPai");
        this._buyHorse.active = false ;
        this.refreshPrepareView(false);
        this.holds = body.listpai;
        if(G.isRePlay == true){
            var index = this.getSeatIndex(body.wxId)
            cc.log(index,"--------------座位号----------")
            if (body.wxId ==  G.myPlayerInfo.wxId){
                this.refreshHolds(true);
            }
            else{
                var holdScript = this.getComponent("Holds");
                holdScript.refreshRePlayTopHolds(body,index)
                this._isSmallResultRefresh = false;
            }
        }
        else{
            //发过牌zhiweitrue
            this.isMingLou = false
            cc.log(this._mjIsDraging,"this._startDrag----------------")
            this._mjIsDraging = false;
            this.refreshHolds(true);
            cc.log(this._isSmallResultRefresh,"刷新其他玩家的牌")
            //if (this._isSmallResultRefresh) {
                var holdScript = this.getComponent("Holds");
                this.refreshOtherHoldsView(holdScript,true);
                this.hideOtherLastHold();
                this._isSmallResultRefresh = false;
            //}
            if (this._nodeSmallResult.active) {
                this._nodeSmallResult.active = false;
            }
            //this.showJinPai(45);
        }
    },
   
    showOtherHolds(msgData){
        cc.log(msgData.showCards,"-------msgData(msgData.showCards---------")
        var holdScript = this.getComponent("Holds");
        this._isMyTurn = false;
        for(i = 0; i < msgData.showCards.length ; i++){
            if(msgData.showCards[i].wxId ==  G.myPlayerInfo.wxId){
                this.refreshHolds(true,1);
            }
            else{
                var index = this.getSeatIndex(msgData.showCards[i].wxId)
                holdScript.showthreeholds(msgData.showCards[i],index);
                cc.log(index,"--------index------------")
            }
        }
    },

    onChuPai(body) {
        var foldScript = this.getComponent("Folds");
        var sexChuPai = 1;
        // this._nodeTingBtn.active = false;
        if (body.wxid == G.myPlayerInfo.wxId) {
            cc.log(body,"onChuPai for me!");
            this.holds = body.listpai;
            if(this.isMingLou == true){
                cc.log("明楼啦=============")
                this.refreshHolds(true,1);
            }
            else{
                this.refreshHolds(true);
            }
            var seatData = this._seatDatas[0];
            seatData.folds.push(body.chupai);
            foldScript.initFolds(seatData);
            sexChuPai =  G.myPlayerInfo.sex;
        } else {
            for (var i = 0; i < this._userInfoSorts.length; i++) {
                if (body.wxid == this._userInfoSorts[i].wxId) {
                    cc.log("onChuPai for other!");
                    var userInfo = this._userInfoSorts[i];
                    var seatIndex = userInfo.seatIndex;
                    var seatData = this._seatDatas[seatIndex];
                    seatData.folds.push(body.chupai);
                    foldScript.initFolds(seatData);
                    //出牌的时候 如果明牌了   就不刷新手牌
                    var holdScript = this.getComponent("Holds");
                    // if(body.isFoldCard == false){
                        holdScript.hideLastHolds(seatIndex, false);
                    // }
                    // else if(body.isFoldCard == true){
                    //     var index = this.getSeatIndex(body.wxid) 
                    //     cc.log(index,"明牌后摸排人的座位号")
                    //     var side = cc.globalMgr.mahjongmgr.getSide(index);
                    //     cc.log(side,"明牌后摸排人的座位") 
                    //     holdScript.refreshMingPaiPlayer(side);
                    // }
                    sexChuPai =this._userInfoSorts[i].sex;
                }
            }
        }
        cc.globalMgr.mahjongmgr.playAudioURLByMJID(sexChuPai, body.chupai);

        //this.clearTingPaiTip();
        this.clearAllTingUI();
        if(G.isRePlay == true){
             this.hideCPGHTips();
        }
        if (this._nodePGCH.active) {
            cc.log("yincangyincang===========")
            this._nodePGCH.active = false;
        }
        if (this.node_gangVirtualFive.active) {
            this.node_gangVirtualFive.active = false;
        }
    },
    onPlayBuHuaAudio(msgData){
        var sexBuHua = 1;
        cc.log(msgData,"buhua------------>")
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            if (msgData.wxid == this._userInfoSorts[i].wxId) {
                sexBuHua =this._userInfoSorts[i].sex;
            }
        }
        cc.globalMgr.mahjongmgr.playAudioOpt(sexBuHua,"buhua");
    },
    onMoPai(body) {
        cc.log(body,"onMoPai");
        if(G.isRePlay == true){
            this.hideCPGHTips()             //隐藏吃碰杠提示
            if (body.wxid == G.myPlayerInfo.wxId) {
                this.holds = body.listpai;
                this.holds.push(body.pai)
                this.refreshHolds(true);
                this._moPaiId = body.pai; //摸牌人才会收到该参数(摸牌后，摸牌人知道刚摸的这个牌是啥)
                this._scriptArrow.refreshArrow(cc.globalMgr.seatIndexType.seatIndexType_me);
                this._isMyTurn = true;
            } else {
                for (var i = 0; i < this._userInfoSorts.length; i++) {
                    var userInfo = this._userInfoSorts[i]
                    if (body.wxid == userInfo.wxId) {
                        cc.log(userInfo,"other user mopai");
                        this._scriptArrow.refreshArrow(userInfo.seatIndex);
                        this._isMyTurn = false;
                        var holdScript = this.getComponent("Holds");
                        //holdScript.hideLastHolds(userInfo.seatIndex, true);
                        holdScript.refreshRePlayTopHolds(body,userInfo.seatIndex)
                    }
                }
            }
        }
        else{
            if (body.wxid == G.myPlayerInfo.wxId) {
                this.holds = body.listpai;
                if(this.isMingLou == true){
                    cc.log("明楼啦=============2")
                    this.refreshHolds(false,1);
                }
                else{
                    this.refreshHolds(false);
                }
                //this.refreshHolds(false);
                this._moPaiId = body.pai; //摸牌人才会收到该参数(摸牌后，摸牌人知道刚摸的这个牌是啥)
                this._scriptArrow.refreshArrow(cc.globalMgr.seatIndexType.seatIndexType_me);
                this._isMyTurn = true;
            } else {
                for (var i = 0; i < this._userInfoSorts.length; i++) {
                    var userInfo = this._userInfoSorts[i]
                    if (body.wxid == userInfo.wxId) {
                        cc.log("other user mopai");
                        this._scriptArrow.refreshArrow(userInfo.seatIndex);
                        this._isMyTurn = false;
                        //摸排的时候如果此人明牌  则不刷新手牌
                        var holdScript = this.getComponent("Holds");
                        // if(body.isFoldCard == false){
                            holdScript.hideLastHolds(userInfo.seatIndex, true);
                        // }
                        // else if(body.isFoldCard == true){
                        //     var index = this.getSeatIndex(body.wxid) 
                        //     cc.log(index,"明牌后摸排人的座位号")
                        //     var side = cc.globalMgr.mahjongmgr.getSide(index);
                        //     cc.log(side,"明牌后摸排人的座位") 
                        //     holdScript.refreshMingPaiPlayer(side);
                        // }
                    }
                }
            }
        }
        this._lastPaiCount = body.paicount;  //摸牌后，刷新牌堆还有多少张牌
        this._mjcount.string = "剩" + this._lastPaiCount + "张";

        //this.clearTingPaiTip();
        this.clearAllTingUI();
        if (this._nodePGCH.active) {
            cc.log("-=-=-=-=-=yicnang")
            this._nodePGCH.active = false;
        }
        if (this.node_gangVirtualFive.active) {
            this.node_gangVirtualFive.active = false;
        }
    },
    //隐藏回放所有的吃碰杠提示
    hideCPGHTips(){
        this._rightPGCH.active = false
        this._leftPGCH.active = false
        this._upPGCH.active = false
    },  
    onCanPGCH(body) {
        cc.log(body,"onCanPGCH");
        if(G.isRePlay == true){
            this.hideCPGHTips();
            var index = this.getSeatIndex(body.user)
            cc.log(index,"index----------")
            switch(index){
                case 0:{
                        this._nodePGCH.active = true;
                        var script = this._nodePGCH.getComponent("MyOperateTips");
                        script.parent = this;
                        script.refreshNodeOptsView(false);
                        script.refreshCPG(body);
                       
                        break
                }
                case 1:{
                        var script = this._rightPGCH.getComponent("otherPgchTips");
                        script.parent = this;
                        this. _rightPGCH.active = true;
                        script.refreshTipsView(body,index)
                        break;
                    }
                case 2:{
                        var script = this._upPGCH.getComponent("otherPgchTips");
                        script.parent = this;
                        this. _upPGCH.active = true;
                        script.refreshTipsView(body,index)
                        break;
                }    
                case 3:{
                        var script = this._leftPGCH.getComponent("otherPgchTips");
                        script.parent = this;
                        this. _leftPGCH.active = true;
                        script.refreshTipsView(body,index)
                        break;
                }
            }
            //script.refreshTipsView(body,index)
            // if(index == 1){
            //     var script = this._rightPGCH.getComponent("otherPgchTips");
            //     script.parent = this;
            //     this. _rightPGCH.active = true;
            //     script.refreshTipsView(body,1)
            // }
        }
        else{
            this._nodePGCH.active = true;
            var script = this._nodePGCH.getComponent("MyOperateTips");
            script.parent = this;
            script.refreshNodeOptsView(false);
            //script.refreshView(body);
            script.refreshCPG(body);
        }
    },

    onCanTingPai(body) {
        cc.log("onCanTingPai");
        cc.log(body.rtnmodel);
        this._isTingPaiMsg = true;
        var canTingPaiList = JSON.parse(body.rtnmodel).lists;
        for (var i = 0; i < this._myMJShowArr.length; i++) {
            var sprite = this._myMJShowArr[i];
            var mjId = sprite.node.mjId;
            for (var j = 0; j < canTingPaiList.length; j++) {
                var tingPaiDatas = canTingPaiList[j];
                if (tingPaiDatas.key === mjId) {
                    sprite.node.tingPaiDatas = tingPaiDatas.listtingpai;
                    var tingPaiTipNode = new cc.Node('Sprite');
                    var sp = tingPaiTipNode.addComponent(cc.Sprite);
                    sp.spriteFrame = this.spr_tingPaiTip;
                    tingPaiTipNode.parent = sprite.node;
                    tingPaiTipNode.position = cc.p(0, 70);
                    sprite.node.isCanTingPai = true;
                    var moveUp = cc.moveBy(0.6,cc.p(0,10));
                    var moveDown = cc.moveBy(0.6,cc.p(0,-10));
                    var rep = cc.repeatForever(cc.sequence(moveUp, moveDown));
                    tingPaiTipNode.runAction(rep);
                }
            }
        }

        // if (!this._isBaoTing && G.mjGameInfo.roomInfo.isBaoTing) {
        //     this._nodeTingBtn.active = true;
        // }
    },

    getSeatIndex(wxId) {
        if (this._playerCount === 2) {
            if (wxId === G.myPlayerInfo.wxId) {
                return cc.globalMgr.seatIndexType.seatIndexType_me;
            } else {
                return cc.globalMgr.seatIndexType.seatIndexType_up;
            }
        }

        //查找自己的位置
        var myIndex = -1;
        //wxid 对应的位置
        var otherIndex = -1;
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            if (this._userInfoSorts[i].wxId == G.myPlayerInfo.wxId) {
                myIndex = i;
            }

            if (this._userInfoSorts[i].wxId == wxId) {

                otherIndex = i;
            }
        }
        var seatIndex = (otherIndex - myIndex + this._playerCount) % this._playerCount;
        cc.log(seatIndex,"座位是多少")

        if (this._playerCount === 3) {
            if(seatIndex === cc.globalMgr.seatIndexType.seatIndexType_up){
                seatIndex = cc.globalMgr.seatIndexType.seatIndexType_left;
                return seatIndex;
            }
        }

        return seatIndex;
    },

    hideInGoldRoomView() {
        cc.log("7777777")
        if (G.mjGameInfo.roomInfo.isjinbi) {
            this.refreshBtnView(false);
            this._btnDissolve.active = false;
        } else {
            this.refreshJinBiBtnView(false);
            // this.btn_leaveRoom.node.active = false;
            // this._btnLocation.active = true;
        }
    },

    //修改麻将人数, 并根据人数，修改位置
    resetPlayerNum(playerNum) 
    {
        var gameChild = this.node.getChildByName("node_game");
        var sides1 = ["myself", "right", "up", "left"];
        var sides2 = ["myself", "up"]
        if(playerNum == 2){
            for( var i = 0;i < sides1.length; i++)
            {
                var side = sides1[i]
                var sideChild = gameChild.getChildByName(side)
                sideChild.active = false
            }
            this._chupaiSprite = []
            this._seatNodes = []
            this._seatPrareNodes = []
            this._pengGangDatas = []
            this._mingLouNodes = []
            this._optAnimNodes = []
            for( var i = 0; i < sides2.length;i++)
            {
                var side = sides2[i]
                var sideChild = gameChild.getChildByName(side)
                sideChild.active = true

                this._chupaiSprite.push(sideChild.getChildByName("ChuPai").children[0].getComponent(cc.Sprite));
                this._seatNodes.push(sideChild.getChildByName("node_seat"));
                this._seatPrareNodes.push(sideChild.getChildByName("node_seat").getChildByName("spr_ok"));
                this._pengGangNodes.push(sideChild.getChildByName("penggangs"));
                this._mingLouNodes.push(sideChild.getChildByName("node_mingLou"));
                this._optAnimNodes.push(sideChild.getChildByName("node_mjOptAnim"));
            }
        }
        else {
            for (var i = 0; i < sides1.length; ++i) {
                var side = sides1[i];
    
                var sideChild = gameChild.getChildByName(side);
                if(i < playerNum){
                    sideChild.active = true
                }
                else{
                    sideChild.active = false
                }   
            }
        }
    },

    onUsersInfo(msgData) {
        cc.log(msgData,"refreshUserInfo");
        this.mask_bg.active = false;
        if(G.isRePlay == true){
            this.refreshBtnView(false)
            this._rePlayBtnControl.active = true
            // if (G.gameNetId == 2900){
            //     this._nodeJinPai.active = true;
            // }
        }
        else{
            this._rePlayBtnControl.active = false
            this.btn_prepare.active = true;
        }
       
        // if(msgData.mypailist.length > 0){
        //     this.holds = msgData.mypailist
        //     this.refreshHolds(true)
        // }
        cc.log(msgData);
        //房间是否是俱乐部创房
        this.clubId = msgData.clubId;
        G.isClubRoomId = msgData.clubId;
        if(msgData.needReady != null  && msgData.needReady == true ){
            this.refreshBtnView(true);
            var data = new Object();
            data.uid = G.myPlayerInfo.uid;
            data.zinetid = cmd.GAME_CONTINUE;
            G.socketMgr.socket.send(G.gameNetId, data);
        }
        if(msgData.isReady == true){
            // this.refreshBtnView(false)
            this.btn_prepare.active = false;
            var prepareNode = this._seatPrareNodes[0];
            prepareNode.active = true;
        }
       
        
        var roomInfo = JSON.parse(msgData.guize);
        cc.log(roomInfo,"========================")
         //金币场隐藏聊天
         cc.log(roomInfo.isjinbi,"是否是金币场")
         if (roomInfo.isjinbi == true) {
             this.chat_node.active = false
         }
        //人数不同，重置界面
        this._playerCount = roomInfo.renshu
        // this.resetPlayerNum(roomInfo.renshu)
        G.copyObject(G.mjGameInfo.roomInfo, roomInfo);
        var InfoBarScript = this.getComponent("mj_InfoBar");
        InfoBarScript.refreshRoomInfo();
        this.hideInGoldRoomView();

        this._userInfoSorts = msgData.listuser;
        var userCounts = this._userInfoSorts.length;
        for (var i = 0; i < userCounts; i++) {
            var userInfo = this._userInfoSorts[i];
            var seatIndex = this.getSeatIndex(userInfo.wxId);
            userInfo.seatIndex = seatIndex;
        }
        //游戏未开始显示邀请按钮
        if(G.isCoinRoom = false){
            if(userCounts < roomInfo.renshu && msgData.gameBegin == false){
                this.btn_share.active = true;
            }
        }
        this.refreshSeatUI();

        if (!this._refreshUserInfo) {
            this._refreshUserInfo = true;
            if (G.mjGameInfo.roomInfo.isjinbi) {
                this.refreshJinBiBtnView(true);
            }
        }

        if (msgData.current_wxid !== undefined) {
            this.dealWithReconnect(msgData);
        }

        this.judegeUserIsRoomOwner(roomInfo.fzwxid)

        //加入语音房间
        this.voiceJoinRoom(G.mjGameInfo.roomInfo.roomId)

        if (G.mjGameInfo.roomInfo.isjinbi && this._clickSwitchDesk) {
            this._clickSwitchDesk = false;
            this.clearPrepareView();
            this.refreshJinBiBtnView(true);
        }
        
    },

    judegeUserIsRoomOwner(ownerId) {
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            if (ownerId == this._userInfoSorts[i].wxId) {
                //显示房主标签
            }
        }

        //判断玩家是否是房主，如果是房主，玩家不能离开房间
        // if(ownerId == G.myPlayerInfo.wxId) {
        //     this.setReturnHomeBtnCanTouch(false)
        // }
    },

    //设置离开房间按钮是否可以点击
    setReturnHomeBtnCanTouch(bCanTouch) {
        if (G.mjGameInfo.roomInfo.isjinbi) {
            return;
        }

        this.btn_leaveRoom.interactable = bCanTouch;
        if (bCanTouch) {
            this.btn_leaveRoom.node.opacity = 255;
        }
        else {
            this.btn_leaveRoom.node.opacity = 120;
        }
    },

    refreshSeatUI() {
        var userCount = this._userInfoSorts.length;
        var seatCount = this._seatNodes.length;
        for (var i = 0; i < seatCount; i++) {
            var seatNode = this._seatNodes[i];
            seatNode.active = false;
        }
        cc.log(this._userInfoSorts,"个人信息===================")
        for (var i = 0; i < userCount; i++) {
            var userInfo = this._userInfoSorts[i];
            var seatNode = this._seatNodes[userInfo.seatIndex];
            seatNode.wxId = userInfo.wxId;
            seatNode.active = true;
            var seatScript = seatNode.getComponent("mj_Seat");
            seatScript.parent = this;
            seatScript.refreshView(this._userInfoSorts[i]);
        }
    },

    refreshPrepareView(flag) {
        for (var i = 0; i < this._seatPrareNodes.length; i++) {
            var prepareNode = this._seatPrareNodes[i];
            prepareNode.active = flag;
        }
    },

    dealWithReconnect(msgData) {
        cc.log(msgData,"8888888888888")
        this.refreshBtnView(false);
        this.refreshJinBiBtnView(false);
        // this.refreshPrepareView(false);
        // this.setReturnHomeBtnCanTouch(false);

        // 显示补金
        this.showJinPai(msgData.hunZiList);

        this.holds = msgData.mypailist;
        if (msgData.current_wxid == G.myPlayerInfo.wxId) {
            if(this.isMingLou == true){
                cc.log("明楼啦=============3")
                this.refreshHolds(false,1);
            }
            else{
                this.refreshHolds(false);
            }
            //this.refreshHolds(false);
        } else {
            if(this.isMingLou == true){
                cc.log("明楼啦=============3")
                this.refreshHolds(true,1);
            }
            else{
                this.refreshHolds(true);
            }
            //this.refreshHolds(true);
        }

        var foldScript = this.getComponent("Folds");
        for (var i = 0; i < msgData.listdapaiqu.length; i++) {
            var foldData = msgData.listdapaiqu[i];

            if (foldData.wxid == G.myPlayerInfo.wxId) {
                var seatData = this._seatDatas[0];
                seatData.folds = foldData.listdapai;
                foldScript.initFolds(seatData);
            } else {
                for (var j = 0; j < this._userInfoSorts.length; j++) {
                    if (foldData.wxid == this._userInfoSorts[j].wxId) {
                        var userInfo = this._userInfoSorts[j];
                        var seatIndex = userInfo.seatIndex;
                        var seatData = this._seatDatas[seatIndex];
                        seatData.folds = foldData.listdapai;
                        foldScript.initFolds(seatData);
                    }
                }
            }
        }

        var holdScript = this.getComponent("Holds");
        for (var i = 0; i < msgData.listpaicount.length; i++) {
            var holdData = msgData.listpaicount[i];
            for (var j = 0; j < this._userInfoSorts.length; j++) {
                if (holdData.wxid == this._userInfoSorts[j].wxId) {
                    var userInfo = this._userInfoSorts[j];
                    var seatIndex = userInfo.seatIndex;
                    // holdScript.initHolds(seatIndex,holdData.paicount);
                    if (msgData.current_wxid == userInfo.wxId) {
                        holdScript.initHolds(seatIndex, holdData.paicount, true);
                    } else {
                        holdScript.initHolds(seatIndex, holdData.paicount, false);
                    }
                }
            }
        }
        
        for (var i = 0; i < msgData.listpenggangqu.length; i++) {
            var PGCData = msgData.listpenggangqu[i];
            if (PGCData.wxid == G.myPlayerInfo.wxId) {
                var seatData = this._seatDatas[0];
                seatData.pengGangs = PGCData.listpenggang;
                this.refreshPengGang(seatData);
            } else {
                for (var j = 0; j < this._userInfoSorts.length; j++) {
                    if (PGCData.wxid == this._userInfoSorts[j].wxId) {
                        var userInfo = this._userInfoSorts[j];
                        var seatIndex = userInfo.seatIndex;
                        var seatData = this._seatDatas[seatIndex];
                        seatData.pengGangs = PGCData.listpenggang;
                        this.refreshPengGang(seatData);
                    }
                }
            }
        }

        if (msgData.current_wxid == G.myPlayerInfo.wxId) {
            this._scriptArrow.refreshArrow(cc.globalMgr.seatIndexType.seatIndexType_me);
            this._isMyTurn = true;
        } else {
            for (var i = 0; i < this._userInfoSorts.length; i++) {
                var userInfo = this._userInfoSorts[i]
                if (msgData.current_wxid == userInfo.wxId) {
                    this._scriptArrow.refreshArrow(userInfo.seatIndex);
                    this._isMyTurn = false;
                }
            }
        }

        for (var i = 0; i < msgData.listhuapaiqu.length; i++) {
            var huaPaiData = msgData.listhuapaiqu[i];
            var seatData = this.getSeatNode(huaPaiData.wxid);
            var huaPaiNode = this._huaPaiNodes[seatData.seatIndex];
    
            huaPaiNode.active = true;
            var script = huaPaiNode.getComponent("mjHuaPai");
            script.refreshView(huaPaiData.listhuapai, seatData.seatIndex);
        }
    },

    onPrepare(msgData) {
        cc.log("onPrepare");
        var seatData = this.getSeatNode(msgData.wxid);
        var prepareNode = this._seatPrareNodes[seatData.seatIndex];
        prepareNode.active = true;
    },
    //提示
    addTips(msgData) {
        if (!msgData) {
            return;
        };
        console.log(msgData,'进入提示回调！');
        if(msgData.msg === "刚吃的牌本圈无法打出" ){
            if(this._failPai != null && this._failPai != undefined){
                this._failPai.active = true
                this._failPai.color = new cc.Color(255, 255, 255);
            }
        }
        this.tipsShow.active = true
        this.tipsShow.getChildByName("msgtip").getComponent(cc.Label).string = msgData.msg;
        this.schedule(this.hideTip, 1)
    },
    hideTip(){
        this.tipsShow.active = false
        this.unschedule(this.hideTip)
    },
    onGameStart(msgData) {
        cc.log("onGameStart");
        var holdScript = this.getComponent("Holds");
        this.refreshOtherHoldsView(holdScript,true);

        this.hideOtherLastHold();

        this._mjcount.node.active = true;

        // this.setReturnHomeBtnCanTouch(false);
        cc.log("99999999999")
        this.refreshBtnView(false);
        this.refreshJinBiBtnView(false);

        if (G.mjGameInfo.roomInfo.isjinbi) {
            this._gamecount.node.active = false;
        }
        this._isGameStart = true;
        this.refreshPrepareView(false);
    },

    onPGHReHolds(msgData) {
        cc.log(msgData,"penggaohpishuaoxan==")
        if(G.isRePlay == true){
            var index = this.getSeatIndex(msgData.wxId)
            if(msgData.wxId ==  G.myPlayerInfo.wxId){
                this.holds = msgData.listpai;
                this.refreshHolds(true);
            }
            else{
                cc.log("shuaxinshoupai==============")
                var holdScript = this.getComponent("Holds");
                holdScript.refreshRePlayTopHolds(msgData,index)
            }
        }
        else{
            this.holds = msgData.listpai;
            if(this.isMingLou == true){
                cc.log("明楼啦=============2")
                this.refreshHolds(true,1);
            }
            else{
                this.refreshHolds(true);
            }
            //this.refreshHolds(true);
        }
    },

    onPGHRePGQuYu(msgData) {
        if (msgData.wxid == G.myPlayerInfo.wxId) {
            this.clearDragMj();
            cc.log("onPGHRePGQuYu for me!");
            var seatData = this._seatDatas[0];
            seatData.pengGangs = JSON.parse(msgData.listpenggang);
            cc.log(seatData.pengGangs,"==========------penggag")
            this.refreshPengGang(seatData);
            if(G.isRePlay!=true){
                this._scriptArrow.refreshArrow(cc.globalMgr.seatIndexType.seatIndexType_me);
            }
            this._isMyTurn = true;
        } else {
            for (var i = 0; i < this._userInfoSorts.length; i++) {
                if (msgData.wxid == this._userInfoSorts[i].wxId) {
                    cc.log("onPGHRePGQuYu for other!");
                    var userInfo = this._userInfoSorts[i];
                    var seatIndex = userInfo.seatIndex;
                    var seatData = this._seatDatas[seatIndex];
                    seatData.pengGangs = JSON.parse(msgData.listpenggang);
                    cc.log(seatData.pengGangs,"==========------penggag")
                    this.refreshPengGang(seatData);
                    if(G.isRePlay != true){
                        this._scriptArrow.refreshArrow(userInfo.seatIndex);
                    }
                    this._isMyTurn = false;
                }
            }
        }
        if(G.isRePlay == true){
            //this.hideCPGHTips()
            var index = this.getSeatNode(msgData.wxid)
            this._scriptArrow.refreshArrow(index);
        }
    },

    onPGHReHoldCount(msgData) {
        cc.log(msgData,"吃碰杠信息====》》")
        var holdScript = this.getComponent("Holds");
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            if (msgData.wxid == this._userInfoSorts[i].wxId) {
                cc.log("onPGHReHoldCount for other!");
                var userInfo = this._userInfoSorts[i];
                var seatIndex = userInfo.seatIndex;
                holdScript.initHolds(seatIndex, msgData.paicount,true);
            }
        }
    },

    onPGHReFolds(msgData) {
        var foldScript = this.getComponent("Folds");
        if (msgData.wxid == G.myPlayerInfo.wxId) {
            cc.log("onPGHReFolds for me!");
            var seatData = this._seatDatas[0];
            seatData.folds = msgData.listdapai;
            foldScript.initFolds(seatData);
        } else {
            for (var i = 0; i < this._userInfoSorts.length; i++) {
                if (msgData.wxid == this._userInfoSorts[i].wxId) {
                    cc.log("onPGHReFolds for other!");
                    var userInfo = this._userInfoSorts[i];
                    var seatIndex = userInfo.seatIndex;
                    var seatData = this._seatDatas[seatIndex];
                    seatData.folds = msgData.listdapai;
                    foldScript.initFolds(seatData);
                }
            }
        }
    },

    onCanMingLou(msgData) {
        cc.log(msgData,"onCanMingLou");
        this._nodePGCH.active = true;
        var script = this._nodePGCH.getComponent("MyOperateTips");
        script.parent = this;
        //script.refreshNodeOptsView(false);
        script.refreshMingLou(msgData.tianTing);
    },

    onHuaPai(msgData) {
        cc.log("onHuaPai");
        if(G.isRePlay != true){
            this._nodePGCH.active = false;
        }
        var seatData = this.getSeatNode(msgData.wxid);
        var huaPaiNode = this._huaPaiNodes[seatData.seatIndex];

        huaPaiNode.active = true;
        var script = huaPaiNode.getComponent("mjHuaPai");
        script.refreshView(msgData.huaList, seatData.seatIndex);
    },

    onVirtualFive(msgData) {
        cc.log("onVirtualFive");
        this._nodePGCH.active = true;
        var script = this._nodePGCH.getComponent("MyOperateTips");
        script.parent = this;
        script.refreshNodeOptsView(false);
        script.refreshVirtualView(msgData.listWu);
    },
    onBuyHouse(msgData){
        cc.log(msgData,"=============================--")
        // if (msgData.zinetid == 290){
            this._buyHorse.active = true ;
            var script = this._buyHorse.getComponent("buyHouse");
            script.parent = this;
            script.refreshResult(msgData);
        // }
    },
    //结算
    onSmallResult(msgData) {
        this._buyHorse.active = false ;
        cc.log(msgData,"onSmallResult");
        cc.log(msgData.info);
        if(G.isRePlay != true ){
            var holdScript = this.getComponent("Holds");
            holdScript.refreshAllRePlayHolds(false);
        }
        this._isSmallResultRefresh = true;
        this.clearSeatDatas();
        this._nodeSmallResult.active = true;
        var script = this._nodeSmallResult.getComponent("SmallResult");
        script.parent = this;
        script.refreshInfos(msgData);
        this._nodeSmallResult.active = false; // 该节点不先显示的话，刷新结算牌组会出现只刷出来一张牌的情况
            
        if(G.isRePlay == true){
            this.hideCPGHTips();    //隐藏回放吃碰杠提示
        }        
        if (this._nodePGCH.active) {
            this._nodePGCH.active = false;
        }
        if (this.node_gangVirtualFive.active) {
            this.node_gangVirtualFive.active = false;
        }
        this._isGameStart = false;

        if (!this._isPlayOptAnim) {
            cc.log("显示小结算11")
            this._nodeSmallResult.active = true;
            this.clearView();
        }

        if(G.isRePlay==true){
            this._nodeSmallResult.active = true;
        }
        this._refreshUserInfo = false;
        //隐藏方位
        this.hideDirection()
    },
    hideDirection(){
        for (var i = 0; i < this._seatNodes.length; i++) {
            var seatNode = this._seatNodes[i];
            var script = seatNode.getComponent("mj_Seat");
            script.hideDirection();
        }
    },
    onBigResult(msgData) {
        cc.log("onBigResult");
        cc.log(msgData);
        // this._nodeBigResult.active = true;
        this._isBigResultCome = true;
        var script = this._nodeBigResult.getComponent("BigResult");
        script.parent = this;
        script.refreshInfos(JSON.parse(msgData.listjson));
    },
    showSmallResule(){
        this._nodeSmallResult.active = true;
        this.unschedule(this.showSmallResule)
    },
    playOptAnim(wxId, animName) {
        cc.log(wxId,animName,"playOptAnim==================")
        this._isPlayOptAnim = true;
        var seatData = this.getSeatNode(wxId);
        var nodeMjOptAnim = this._optAnimNodes[seatData.seatIndex];
        nodeMjOptAnim.active = true;
        var mjOptAnim = nodeMjOptAnim.getComponent(cc.Animation);
        mjOptAnim.play(animName);
        var self = this;
        cc.log(animName,"animName0000dd000")
        if(G.isRePlay == true){
                mjOptAnim.on('finished', function () {
                    nodeMjOptAnim.active = false;
                    self._isPlayOptAnim = false;
                    // if (animName === "zimo" || animName === "hu") {
                    //     if (self._isSmallResultRefresh) {
                    //         cc.log("显示小结算ssss")
                    //         self._nodeSmallResult.active = true;
                    //         self.clearView();
                    //     }
                    // }
                }); 
               if (animName === "zimo" || animName === "hu") {
                        if (self._isSmallResultRefresh) {
                            cc.log("显示小结算ssss")
                            this.schedule(this.showSmallResule,0.5)
                            self.clearView();
                        }
                }
        }
        else{
            mjOptAnim.on('finished', function () {
                nodeMjOptAnim.active = false;
                self._isPlayOptAnim = false;
                if (animName === "zimo" || animName === "hu") {
                    if (self._isSmallResultRefresh) {
                        cc.log("显示小结算ssss")
                        self._nodeSmallResult.active = true;
                        self.clearView();
                    }
                }
        });
       
        }
    },
    
    onOtherPGCHTip(msgData) {
        // msgData.pai  :27
        // msgData.type :0          //提交 类型 0.为碰  1.为杠  2.暗杠 3.自摸  4.点炮胡 5取消 6吃
        // msgData.wxid :9997072    //提交碰杠胡过吃的人
        var sexType = 1;
        this._nodePGCH.active = false;
        if(G.isRePlay == true){
            this.hideCPGHTips();    //隐藏提示
        }   
        this.node_gangVirtualFive.active = false;
        cc.log(msgData,":msg-----")
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            if (msgData.wxid == this._userInfoSorts[i].wxId) {
                sexType =this._userInfoSorts[i].sex;
            }
        }
        // var round = Math.random();
        // cc.log(round,"随机数是多少啊")
        switch (msgData.type) {
            case 0: {
                // if(round <= 0.5){
                    cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "peng");
                // }
                // else{
                //     cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "peng2");
                // }
                this.playOptAnim(msgData.wxid, "peng");
                break;
            }
            case 1: {
                // if(round <= 0.5){
                    cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "gang");
                // }
                // else{
                //     cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "gang2");
                // }
                this.playOptAnim(msgData.wxid, "gang");
                break;
            }
            case 2: {
                cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "gang");
                this.playOptAnim(msgData.wxid, "gang");
                break;
            }
            case 3: {
                cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "zimo");
                this.playOptAnim(msgData.wxid, "zimo");
                //自摸后禁止操作
                this._isMyTurn = false;
                break;
            }
            case 4: {
                // if(round <= 0.5){
                    cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "hu");
                // }
                // else{
                //     cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "hu2");
                // }
                this.playOptAnim(msgData.wxid, "hu");
                //胡牌后禁止操作
                this._isMyTurn = false;
                break;
            }
            case 5: {
                // cc.globalMgr.mahjongmgr.playAudioOpt(this._sex,"guo");
                break;
            }
            case 6: {
                // if(round <= 0.5){
                    cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "chi");
                // }
                // else{
                //     cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "chi2");
                // }
                this.playOptAnim(msgData.wxid, "chi");
                break;
            }
        }
    },

    getSeatNode(wxId) {
        var seatData = {};
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            var userInfo = this._userInfoSorts[i];
            if (wxId == userInfo.wxId) {
                var userInfo = this._userInfoSorts[i];
                var seatNode = this._seatNodes[userInfo.seatIndex];
                seatData.seatNode = seatNode;
                seatData.seatIndex = userInfo.seatIndex;
                return seatData;
            }
        }
    },

    getUserInfo(wxId) {
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            var userInfo = this._userInfoSorts[i];
            if (wxId == userInfo.wxId) {
                return userInfo;
            }
        }
    },

    dealWithChatMsg(wxId, msgId) {
        var seatData = this.getSeatNode(wxId);
        var pos = cc.p(50, 0);
        var dir = 1;
        var chatSex = 1;
        if (seatData.seatIndex == 0 || seatData.seatIndex == 3) {
            pos = cc.p(50, 0);
            dir = 1;
        } else if (seatData.seatIndex == 1 || seatData.seatIndex == 2) {
            pos = cc.p(-50, 0);
            dir = -1;
        }
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            if (wxId == this._userInfoSorts[i].wxId) {
                chatSex =this._userInfoSorts[i].sex;
            }
        }
        cc.globalMgr.globalFunc.addChatMsgTip(G.gameNetId, seatData.seatNode, dir, pos, msgId);
        cc.globalMgr.mahjongmgr.playChatTextAudioById(chatSex, msgId);
    },

    showJinPai(hunZiList) {
        cc.log("显示金牌")
        if (hunZiList.length <= 0) return;
        this._hunZiArr = hunZiList;
        this._nodeJinPai.active = true;
        this._sprJinPai1.node.active = false;
        this._sprJinPai2.node.active = false;
        for(var i = 0; i < this._hunZiArr.length; i++) {
            if (i === 0) {
                this._sprJinPai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", this._hunZiArr[i]);
                this._sprJinPai1.node.active = true;
            }
            if (i === 1) {
                this._sprJinPai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", this._hunZiArr[i]);
                this._sprJinPai2.node.active = true;
            }
        }
    },

    onJinZi(msgData) {
        //this.node_kaiJin.active = true; //隐藏金牌动画
        // var kaiJinAnim = this.node_kaiJin.getComponent(cc.Animation);
        // kaiJinAnim.play("kaiJin");
        // this._sprMjKaiJin.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_", msgData.jinZi);
        // kaiJinAnim.on('finished', function () {
        //     this.node_kaiJin.active = false;
        // }.bind(this));

        this.showJinPai(msgData.hunZiList);
    },

    dealWithChatFace(wxId, msgId) {
        var seatData = this.getSeatNode(wxId);
        cc.globalMgr.globalFunc.addChatFaceTip(seatData.seatNode, cc.p(0, 0), msgId);
    },

    dealWithMagicFace(sourceWxId, targetWxId, msgId) {
        var seatData1 = this.getSeatNode(sourceWxId);
        var seatData2 = this.getSeatNode(targetWxId);
        var seat1 = seatData1.seatNode;
        var seat2 = seatData2.seatNode;
        var pos1 = seat1.parent.convertToWorldSpaceAR(seat1.position);
        var pos2 = seat2.parent.convertToWorldSpaceAR(seat2.position);
        cc.globalMgr.globalFunc.addMagicFace(pos1, pos2, msgId);
    },

    dealWithInputMsg(wxId, msgId) {
        var seatData = this.getSeatNode(wxId);
        var pos = cc.p(50, 0);
        var dir = 1;
        if (seatData.seatIndex == 0 || seatData.seatIndex == 3) {
            pos = cc.p(50, 0);
            dir = 1;
        } else if (seatData.seatIndex == 1 || seatData.seatIndex == 2) {
            pos = cc.p(-50, 0);
            dir = -1;
        }
        cc.globalMgr.globalFunc.addInputTip(seatData.seatNode, dir, pos, msgId);
    },

    onRefreshZhuang(msgData) {
        for (var i = 0; i < this._seatNodes.length; i++) {
            var seatNode = this._seatNodes[i];
            var script = seatNode.getComponent("mj_Seat");
            script.refreshZhuang(false);
        }

        var seatData = this.getSeatNode(msgData.wxid);
        var script = seatData.seatNode.getComponent("mj_Seat");
        script.refreshZhuang(true);
        var index = this.getSeatIndex(msgData.wxid) 
        cc.log(index,"庄家座位号")  
        this._nodeArrow.getChildByName("spr_arrowFrame").getComponent(cc.Sprite).node.active = true;
        if(index == 0 ){
            this._nodeArrow.getChildByName("spr_arrowFrame").getComponent(cc.Sprite).node.rotation = 90;
        } 
        else if(index == 2){
            this._nodeArrow.getChildByName("spr_arrowFrame").getComponent(cc.Sprite).node.rotation = 270;
        } 
        else if(index == 3){
            this._nodeArrow.getChildByName("spr_arrowFrame").getComponent(cc.Sprite).node.rotation = 180;
        }   
    },

    onRefreshUserCoin(msgData) {
        var listScoreDatas = JSON.parse(msgData.listfen);
        for (var i = 0; i < listScoreDatas.length; i++) {
            var scoreData = listScoreDatas[i];
            var seatData = this.getSeatNode(scoreData.wxid);
            var script = seatData.seatNode.getComponent("mj_Seat");
            script.refreshScore(scoreData.fenshu);
        }
    },

    onRefreshGangDing(msgData) {
        this._nodeGangDing.active = true;
        this._nodeGangDing.mjId = msgData.pai;
        this._sprGangDing.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", msgData.pai);
    },

    // 收这个消息，主要用于断线重连后和继续下局刷新牌数，局数
    onRefreshContinue(msgData) {
        cc.log(msgData,"msgData---")
        // if(G.isRePlay != true && msgData.reconnect != true ){
        //     var holdScript = this.getComponent("Holds");
        //     holdScript.refreshAllRePlayHolds(false);
        // }
        this._mjcount.node.active = true;
        this._mjcount.string = "剩" + msgData.paicount + "张";
        if (!G.mjGameInfo.roomInfo.isjinbi) {
            this._gamecount.node.active = true;
            this._gamecount.string = "剩" + msgData.jushu + "局";
        }
    },

    onVirtualFiveGang(msgData) {
        cc.log("onVirtualFiveGang");
        this.node_gangVirtualFive.active = true;
        var script = this.node_gangVirtualFive.getComponent("gangVirtualFive");
        script.refreshVirtualFiveView(msgData.listGang);
    },

    onGameVirtualFiveRefresh(msgData) {
        cc.log("onGameVirtualFiveRefresh");
        this._nodeVirtualFive.active = true;
        this.refreshVirtualFive(msgData.listWu);

        if (G.mjGameInfo.roomInfo.isjinbi && this._refreshVirtualFiveJinBi) {
            this.refreshVirtualFiveJinBiView();
            this._refreshVirtualFiveJinBi = false;
        }
    },

    onShowHaiDiPai() {
        cc.log("onShowHaiDiPai");
        this._nodeHaiDiLaoTip.active = true;
        var scaleBig = cc.scaleTo(0.5, 1.5);
        var scaleSmall = cc.scaleTo(0.5, 1);
        var rep = cc.sequence(scaleBig, scaleSmall);
        this._nodeHaiDiLaoTip.runAction(rep);
    },
    onMingLou(body){
        cc.log(body,"------------------------------明楼")
        var holdScript = this.getComponent("Holds");
        var sexType = 1;
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            if (body.wxid == this._userInfoSorts[i].wxId) {
                sexType =this._userInfoSorts[i].sex;
            }
        }
        //播放潇音效
        if(body.type == 2){
            if(body.reconnect == false && body.isTianTing == false){
                cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "xiaosa");
            }
            else if(body.reconnect == false && body.isTianTing == true){
                cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "mingting");
            }
        }
        else if(body.type == 3){
            if(body.reconnect == false)
            cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "tianting");
        }
        if(body.wxid ==  G.myPlayerInfo.wxId){
            this._isMyTurn = false;
            if(body.type == 2){
                this.isMingLou = true
                cc.log(this.isTinTing,"有人潇洒了")
                this.isTinTing = false
                // if(this.isTinTing == true){
                //     this.isTinTing = false
                //     if(body.reconnect == false){
                //         cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "mingting");
                //     }
                // }
                // else{
                //     cc.log("有人潇洒了")
                //     cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "xiaosa");
                // }
                this.refreshHolds(true,1);
                
            }  
            else if(body.type == 3){
                this.isTinTing = true
                this.refreshHolds(true);
                //cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "tianting");
            }
        }
        else{
            // if(body.type == 2){
            //     cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "xiaosa");
            // }
            // else if(body.type == 3){
            //     cc.globalMgr.mahjongmgr.playAudioOpt(sexType, "tianting");
            // }
            var index = this.getSeatIndex(body.wxid)
            //for(i = 0; i < body.listpai.length ; i++){
            holdScript.showMingPai(body.listpai,index,body.type)
            cc.log(index,"--------index------------aa")
            //}
            var side = cc.globalMgr.mahjongmgr.getSide(index);
            cc.log(side,"明牌后摸牌人的座位") 
            holdScript.refreshMingPaiPlayer(side);
        }
    },
    //跟庄
    onPlayGenZhuang(msgData){
        
    },

    getSeatData(wxId) {
        for (var i = 0; i < this._userInfoSorts.length; i++) {
            var userInfo = this._userInfoSorts[i];
            if (wxId == userInfo.wxId) {
                var seatData = this._seatDatas[userInfo.seatIndex];
                var seatNode = this._seatNodes[userInfo.seatIndex];
                seatData.seatNode = seatNode;
                seatData.seatIndex = userInfo.seatIndex;
                seatData.wxId = wxId;
                return seatData;
            }
        }
    },

    onTingPaiRet (msgData) {
        cc.log("onTingPaiTip");
        var seatData = this.getSeatData(msgData.wxid);
        var tingPaiNode = this._tingPaiTips[seatData.seatIndex];
        tingPaiNode.active = true;

        if (msgData.wxid === G.myPlayerInfo.wxId) {
            this.refreshAllHoldsColor("gray");
        }
    },

    onXiaPaoTip(msgData) {
        this._nodeXiaPao.active = true;
        this.refreshBtnView(false);
        if (this._nodeSmallResult.active) {
            this._nodeSmallResult.active = false;
        }

        // var xiaPaoScript = this._nodeXiaPao.getComponent("mjXiaPaoTip");
        // if (G.mjGameInfo.roomInfo.daiPao === 1) {
        //     xiaPaoScript.refreshBtnView(true);
        // } else if (G.mjGameInfo.roomInfo.daiPao === 2) {
        //     xiaPaoScript.refreshBtnView(false);
        // }
    },

    onXiaPaoRet(msgData) {
        if (msgData.wxid === G.myPlayerInfo.wxId) {
            cc.log("onXiaPaoRet for me!");
            this._nodeXiaPao.active = false;
        }
        var seatData = this.getSeatData(msgData.wxid);
        var sprPao = this._paoFenSprArr[seatData.seatIndex];
        sprPao.node.active = true;
        sprPao.spriteFrame = this.sprframe_paoFens[msgData.paoFen];
    },

    onXiaPaoResult(msgData) {

    },

    onDingQueTip(msgData) {
        cc.log("onDingQueTip");
        this._dingQueData = msgData;
        if (!this._isSwitchThreeMj) {
            this.showDingQueTip();
        }
    },

    showDingQueTip() {
        this._nodeDingQue.active = true;
        var script = this._nodeDingQue.getComponent("DingQue");
        script.refreshView(false);
        script.refreshBestDingQue(this._dingQueData);
    },

    onDingQueRet(msgData) {
        cc.log("onDingQueRet for me!");
        if (msgData.wxid == G.myPlayerInfo.wxId) {
            var seatData = this.getSeatNode(msgData.wxid);
            var dingQueScript = this._nodeDingQue.getComponent("DingQue");
            dingQueScript.refreshDingQueView(seatData.seatIndex);
        }
    },

    onDingQueResult(msgData) {
        cc.log("onDingQueResult");
        var seatData = this.getSeatNode(msgData.wxid);
        var seatScript = seatData.seatNode.getComponent("mj_Seat");
        seatScript.refreshDingQueTips(msgData.dingQue);

        var dingQueScript = this._nodeDingQue.getComponent("DingQue");
        dingQueScript.refreshDingQueView(seatData.seatIndex);

        if (msgData.wxid == G.myPlayerInfo.wxId) {
            this._dingQueType = msgData.dingQue;
            this.refreshHoldsDingQueShader();
        }
    },

    onEventGameMessage(sub, msgData) {
        cc.log("mjGameControl subIds:", sub);
        switch (sub) {
            case cmd.JOIN_ROOM_SMALLID_RET: {
                this.onUsersInfo(msgData);
            }
                break;
            case cmd.PLYAER_PREPARED_SMALLID_RET: {
                this.onPrepare(msgData);
            }
                break;
            case cmd.GAME_START_SMALLID_RET: {
                this.onGameStart(msgData);
            }
                break;
            case cmd.ZHUANG_SMALLID_RET: {
                this.onRefreshZhuang(msgData);
            }
                break;
            case cmd.FA_PAI_SMALLID_RET: {
                this.onFaPai(msgData);
            }
                break;
            case cmd.CHU_PAI_SMALL_NETID: {
                this.onChuPai(msgData);
            }
                break;
            case cmd.MOPAI_SMALLID_RET: {
                this.onMoPai(msgData);
            }
                break;
            case cmd.PENG_GANG_HU_TIP_SMALLID_RET: {
                this.onCanPGCH(msgData);
            }
                break;
            case cmd.PGH_RE_HOLDS_SMALLID_RET: {
                this.onPGHReHolds(msgData);
            }
                break;
            case cmd.PGH_RE_PGQUYU_SMALLID_RET: {
                this.onPGHRePGQuYu(msgData);
            }
                break;
            case cmd.PGH_RE_HOLDCOUNTS_SMALLID_RET: {
                this.onPGHReHoldCount(msgData);
            }
                break;
            case cmd.PGH_RE_FOLDS_SMALLID_RET: {
                this.onPGHReFolds(msgData);
            }
                break;
            case cmd.TING_PAI_SMALLID_RET: {
                this.onCanTingPai(msgData);
            }
                break;
            case cmd.MINGLOU_TIP_SMALLID_RET: {
                this.onCanMingLou(msgData);
            }
                break;
            case cmd.MINGLOU_SMALLID_SEND: {
                this.onMingLou(msgData);
            }
                break;
            case cmd.SMALL_RESULT_SMALLID_RET: {
                this.onSmallResult(msgData);
            }
                break;
            case cmd.SMALL_BUY_HOUSE_RET: {
                this.onBuyHouse(msgData);
            }
                break;
            case cmd.BIG_RESULT_SMALLID_RET: {
                this.onBigResult(msgData);
            }
                break;
            case cmd.PENG_GANG_HU_OPT_SMALLID_SED: {
                this.onOtherPGCHTip(msgData);
            }
                break;
            case cmd.MOPING_XUNI5_TIP_SMALLID_RET: {
                this.onVirtualFive(msgData);
            }
                break;
            case cmd.REFRESH_COIN_SMALLID_RET: {
                this.onRefreshUserCoin(msgData);
            }
                break;
            case cmd.JIN_RET: {
                this.onJinZi(msgData);
                cc.log(msgData,"混子")
            }
                break;
            case cmd.GANG_DING_SMALLID_RET: {
                this.onRefreshGangDing(msgData);
            }
                break;
            case cmd.GAME_CONTINUE: {
                this.onRefreshContinue(msgData);
            }
                break;
            case cmd.MOPING_XUNI5_GANG_SMALLID_RET: {
                this.onVirtualFiveGang(msgData);
            }
                break;
            case cmd.REFRESH_GAME_VIRTUAL_FIVE_RET: {
                this.onGameVirtualFiveRefresh(msgData);
            }
                break;
            case cmd.HAIDIPAI_TIP_RET: {
                this.onShowHaiDiPai();
            }
                break;   
            case cmd.BU_HUA: {   //补花 
                this.onFaPai();
            }
                break
            case cmd.HUAPAI_RET: {
                this.onHuaPai(msgData);
            }
                break;
            case cmd.LOCATION_MAIN:{
                this.getLocationMsg(msg);
            }
                break;
            case cmd.DIRECTION_MAIN:{
                this.getDirectionMsg(msgData);
            }
                break;
            case cmd.GETMJFORSERVE_RES:{
                this.openGetMj(msgData);
            }
                break;
            case cmd.GAME_TIPS_SMALL_NETID:{
                cc.log("提示打不出去")
                this.addTips(msgData);
            }
                break;
            case cmd.SHOWOTHERHOLDS:{
                // this.showOtherHolds(msgData);
            }
                break;
            case cmd.PLAYAUDIOBUHUA:{
                this.onPlayBuHuaAudio(msgData);
            }
                break;
            case cmd.PLAYGENZHUANG:{
                cc.log(msgData,"跟庄========")
                this.onPlayGenZhuang(msgData);
            }   
                break;
            case cmd.TINGPAI_TIP: {
                this.onTingPaiRet(msgData);
            }
                break;
            case cmd.XIAPAO_TIP_RET: {
                this.onXiaPaoTip(msgData);
            }
                break;
            case cmd.PAOFEN_NETID: {
                this.onXiaPaoRet(msgData);
            }
                break;
            case cmd.XIAPAO_RESULT_RET: {
                this.onXiaPaoResult(msgData);
            }
                break;
            case cmd.DING_QUE_TIP_RET: {
                this.onDingQueTip(msgData);
            }
                break;
            case cmd.DING_QUE_SEND: {
                this.onDingQueRet(msgData);
            }
                break;
            case cmd.DING_QUE_RET: {
                this.onDingQueResult(msgData);
            }
                break;
            default:
                break
        }
    },

    //####  下面是测试用代码，暂时保留
    // initCMDFunc() {
    //     this.cmdCallFunc = {
    //         1: "onUser",
    //     };
    // },
    getDirectionMsg(msgNumber){
        for (var i = 0; i < this._seatNodes.length; i++) {
            var seatNode = this._seatNodes[i];
            var script = seatNode.getComponent("mj_Seat");
            script.parent = this;
            script.refreshDirection(msgNumber);
        }
    },
    onDestroy() {
        cc.globalMgr.service.getInstance().unregist(this);
        cc.globalMgr.EventManager.getInstance().unregist(this);
    },

    refreshMjColor(msgBody, target) {
        for (var i = 0; i < target._pengGangDatas.length; ++i) {
            var pengGangData = target._pengGangDatas[i];
            target.refreshPengGang(pengGangData, true);
        }

        for(var i = 0; i < target._hunZiArr.length; i++) {
            if (i === 0) {
                target._sprJinPai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", target._hunZiArr[i]);
                target._sprJinPai1.node.active = true;
            }
            if (i === 1) {
                target._sprJinPai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", target._hunZiArr[i]);
                target._sprJinPai2.node.active = true;
            }
        }

        // if (target._nodeGangDing.active) {
        //     target._sprGangDing.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", target._nodeGangDing.mjId);
        // }

        // target.refreshVirtualFiveColor();
    },

    refreshVirtualFiveColor() {
        var nodeChilds = this._nodeVirtualFive.children;
        var sprite = nodeChilds[0].getComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", 5);
        sprite = nodeChilds[1].getComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", 15);
        sprite = nodeChilds[2].getComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_", 25);
    },

    refreshVirtualFiveTouch() {
        var nodeChilds = this._nodeVirtualFive.children;
        for (var i = 0; i < nodeChilds.length; i++) {
            var button = nodeChilds[i].getComponent(cc.Button);
            button.interactable = true;
            button.enableAutoGrayEffect = true;
        }
    },

    refreshVirtualFive(fiveArray) {
        this.refreshVirtualFiveTouch();

        var nodeChilds = this._nodeVirtualFive.children;
        for (var i = 0; i < fiveArray.length; i++) {
            var fiveData = fiveArray[i];
            if (fiveData.isUse) {
                var button = nodeChilds[i].getComponent(cc.Button);
                button.interactable = false;
            }
        }
    },
});