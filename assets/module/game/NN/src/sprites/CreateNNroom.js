var comm = require("Comm")

cc.Class({
    extends: comm,
    // extends: cc.Component,

    properties: {

        //自动开始游戏 动态
        AutobeginNode: {
            default: null,
            type: cc.Node
        },

        //0为翻牌规则弹窗 ，1，为特殊牌型弹窗
        Btn_Tan: {
            default: [],
            type: cc.Node
        },
        //翻牌规则选择显示 特殊牌型选择显示
        Label_FanAndBei: {
            default: [],
            type: cc.Label
        },

        node_Gamepublic: {
            default: null,
            type: cc.Node
        },

        //上庄显示
        node_ShangZhuang: {
            default: null,
            type: cc.Node
        },

        //抢庄显示
        node_maxQiangZhuang: {
            default: null,
            type: cc.Node
        },

        //下注限制
        node_xiaZhuXianZhi: {
            default: null,
            type: cc.Node
        },

        //下注限制
        node_playToggleGrid: {
            default: null,
            type: cc.Node
        },

        //房主付费
        fangZhuFee: {
            default: null,
            type: cc.RichText
        },

        //AA付费
        AAFee: {
            default: null,
            type: cc.RichText
        },


        //创建房间节点
        createNode: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {
        this.listenForClubList();

        var localData = this.getLocalData("NNCreatRoom");
        if (!localData) {
            this.playSelect(NNRoomRule.creatRoom.nnwanfa)  //玩法
            this.playToggleSelect(this.node_playToggleGrid, NNRoomRule.creatRoom.nnwanfa) // toggle 玩法选择
            this.refleshPersonNum(NNRoomRule.creatRoom.nnrenShu) //人数
            this.refleshDiFen(NNRoomRule.creatRoom.nndifen)  //底分
            this.refleshJuShu(NNRoomRule.creatRoom.nnjushu)  //局数
            this.refleshFee(NNRoomRule.creatRoom.nnfangfei)  //房费
            this.refleshFanBeiRule(NNRoomRule.creatRoom.nnfanbeiguize)  //翻倍规则
            this.refleshFanBeiGuiZe(NNRoomRule.creatRoom.shunziniu, NNRoomRule.creatRoom.wuhuaniu, NNRoomRule.creatRoom.tonghuaniu, NNRoomRule.creatRoom.huluniu, NNRoomRule.creatRoom.zhadanniu, NNRoomRule.creatRoom.wuxiaoniu, NNRoomRule.creatRoom.huanleniu)
            this.refleshAutoBegin(NNRoomRule.creatRoom.nnrenShu, NNRoomRule.creatRoom.nnautobegin)  //自动开始
            this.refleshFanTuiZhu(NNRoomRule.creatRoom.nntuizhu) // 推注
            this.refleshFangaojijinru(NNRoomRule.creatRoom.isjinzhijiaru, NNRoomRule.creatRoom.isxiazhuxianzhi)  //高级选项
            this.refleshmaxZhuang(NNRoomRule.creatRoom.nnzuidaqiangzhuang) //最大抢庄
            // this.refleshShangZhuang(NNRoomRule.creatRoom.nndifen, NNRoomRule.creatRoom.nnshangfenfenshu)  //上分分数
            this.SetFeeLabel(NNRoomRule.creatRoom.nnrenShu, NNRoomRule.creatRoom.nnjushu)//房费设置
        } else {
            cc.log("不为空", localData)
            G.copyObject(NNRoomRule.creatRoom, localData)
            this.playSelect(localData.nnwanfa)
            this.playToggleSelect(this.node_playToggleGrid, localData.nnwanfa)
            this.refleshPersonNum(localData.nnrenShu) //人数
            this.refleshDiFen(localData.nndifen)  //底分
            this.refleshJuShu(localData.nnjushu)  //局数
            this.refleshFee(localData.nnfangfei)  //房费
            this.refleshFanBeiRule(localData.nnfanbeiguize)  //翻倍规则
            this.refleshFanBeiGuiZe(localData.shunziniu, localData.wuhuaniu, localData.tonghuaniu, localData.huluniu, localData.zhadanniu, localData.wuxiaoniu, localData.huanleniu)
            this.refleshAutoBegin(localData.nnrenShu, localData.nnautobegin) // 自动开始
            this.refleshFanTuiZhu(localData.nntuizhu) // 推注
            this.refleshFangaojijinru(localData.isjinzhijiaru, localData.isxiazhuxianzhi)  //高级选项
            this.refleshmaxZhuang(localData.nnzuidaqiangzhuang) //最大抢庄
            // this.refleshShangZhuang(localData.nndifen, localData.nnshangfenfenshu)  //上分分数
            this.SetFeeLabel(localData.nnrenShu, localData.nnjushu) //房费设置
        }
    },



    //重置特殊牌型
    refleshFanBeiGuiZe(szn, whn, thn, huLuNiu, zdn, wuXiaoNiu, huanLeNiu) {
        var spec = this.node_Gamepublic.getChildByName("spec").getChildByName("grid")
        spec.getChildByName("Togglesz").getComponent(cc.Toggle).isChecked = szn
        spec.getChildByName("Togglewh").getComponent(cc.Toggle).isChecked = whn
        spec.getChildByName("Toggleth").getComponent(cc.Toggle).isChecked = thn
        spec.getChildByName("Togglehl").getComponent(cc.Toggle).isChecked = huLuNiu
        spec.getChildByName("Togglezd").getComponent(cc.Toggle).isChecked = zdn
        spec.getChildByName("Togglewx").getComponent(cc.Toggle).isChecked = wuXiaoNiu
        spec.getChildByName("Togglehuan").getComponent(cc.Toggle).isChecked = huanLeNiu

        //特殊牌型选择显示
        this.Label_FanAndBei[1].string = this.SprTeShuShow();
    },
    //重置翻倍规则
    refleshFanBeiRule(tagName) {
        var betRule = this.node_Gamepublic.getChildByName("betRule").getChildByName("grid")
        this.playToggleSelect(betRule, tagName)
    },
    //重置高级选项
    refleshFangaojijinru(isJiaRu, isXianZhi) {
        var gaoji = this.node_Gamepublic.getChildByName("lbl_gaoji")
        gaoji.getChildByName("toggleHighLevel").getComponent(cc.Toggle).isChecked = isJiaRu
        gaoji.getChildByName("toggleXiaZhuXianZhi").getComponent(cc.Toggle).isChecked = isXianZhi

    },

    //重置上庄分数
    refleshShangZhuang(diFen, tagName) {
        this.OnShangZhungBaseShow(diFen)
        var shangZhuang = this.node_Gamepublic.getChildByName("shangZhuang").getChildByName("grid")
        this.playToggleSelect(shangZhuang, tagName)
    },

    //重置最大抢庄
    refleshmaxZhuang(tagName) {
        var maxQiangZhuang = this.node_Gamepublic.getChildByName("maxQiangZhuang").getChildByName("grid")
        this.playToggleSelect(maxQiangZhuang, tagName)
    },

    //重置推注规则
    refleshFanTuiZhu(tagName) {
        var bet = this.node_Gamepublic.getChildByName("bet").getChildByName("grid")
        this.playToggleSelect(bet, tagName)
    },
    //重置自动开始 //需要先赋值完 按钮的名字 再执行这个方法
    refleshAutoBegin(renshu, tagName) {
        // this.AutoPersonNum(renshu)
        var autoBegin = this.node_Gamepublic.getChildByName("autoBegin").getChildByName("grid")
        this.playToggleSelect(autoBegin, tagName)
    },
    //重置房费
    refleshFee(tagName) {
        var fee = this.node_Gamepublic.getChildByName("fee").getChildByName("grid")
        this.playToggleSelect(fee, tagName)
    },

    //重置局数
    refleshJuShu(tagName) {
        var juShu = this.node_Gamepublic.getChildByName("juShu").getChildByName("grid")
        this.playToggleSelect(juShu, tagName)
    },
    //重置底分
    refleshDiFen(tagName) {
        var diFen = this.node_Gamepublic.getChildByName("diFen").getChildByName("grid")
        this.playToggleSelect(diFen, tagName)
    },


    //刷新人数
    refleshPersonNum(tagName) {
        var renshu = this.node_Gamepublic.getChildByName("renShu").getChildByName("grid")
        this.playToggleSelect(renshu, tagName)
    },
    //-------------玩法选择-------------------------------
    //玩法选择  上庄 、最大抢庄 、 禁止下注 的显示隐藏
    playSelect(wanfa) {
        var nnwanfa = parseInt(wanfa)
        if (nnwanfa == 1) {//牛牛上庄
            this.ruleIsEnabledCol(false, false)
            this.refleshBaRen(255, true)
        }
        else if (nnwanfa == 2) { // 固定抢庄
            this.ruleIsEnabledCol(true, false)
            this.refleshBaRen(255, true)
        }
        else if (nnwanfa == 3) { //自由抢庄
            this.ruleIsEnabledCol(false, false)
            this.refleshBaRen(255, true)
        }
        else if (nnwanfa == 4) { // 明牌抢庄
            this.ruleIsEnabledCol(false, true)
            this.refleshBaRen(255, true)
        }
        else if (nnwanfa == 5) { // 八人明牌
            this.ruleIsEnabledCol(false, true)
            var renshu = this.node_Gamepublic.getChildByName("renShu").getChildByName("grid")
            this.playToggleSelect(renshu, 8)
            // this.AutoPersonNum(8)
            this.refleshBaRen(180, false)
        }
        NNRoomRule.creatRoom.nnrenShu = nnwanfa == 5 ? 8 : 6
        this.node_xiaZhuXianZhi.active = nnwanfa >= 3
        NNRoomRule.creatRoom.nnwanfa = nnwanfa
        this.AutoPersonNum_playing(nnwanfa)

    },
    //选择八人明牌
    refleshBaRen(opacity, interactable) {
        var renshu = this.node_Gamepublic.getChildByName("renShu").getChildByName("grid")
        for (var i = 0; i < renshu.childrenCount; i++) {
            renshu.children[i].getComponent(cc.Toggle).interactable = interactable
            renshu.children[i].opacity = opacity
        }
    },

    //-------------玩法选择---- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑--------------------
    playToggleSelect(gridNode, togName) {
        for (var i = 0; i < gridNode.childrenCount; i++) {
            gridNode.children[i].getComponent(cc.Toggle).isChecked = false
        }
        var togNode = gridNode.getChildByName(togName + "")
        if (togNode) {
            togNode.getComponent(cc.Toggle).isChecked = true
        } else {
            gridNode.children[0].getComponent(cc.Toggle).isChecked = true
        }
    },

    //五玩法选择
    OnClickGameType(sub, event) {
        var gameType = parseInt(sub.node.name)
        cc.log("玩法选择；", gameType)
        this.playSelect(gameType)
    },

    //控制 上庄显示 和 抢庄 显示
    ruleIsEnabledCol(isSZ, isQZ) {
        this.node_ShangZhuang.active = isSZ
        this.node_maxQiangZhuang.active = isQZ
    },


    NNToggleOn(event, customEventData) {
        //this.playClickMusic()
        //特殊牌型选择
        var BtnName = event.node.name
        cc.log("选择的是： ", BtnName)
        switch (customEventData) {

            case "renShu":
                NNRoomRule.creatRoom.nnrenShu = parseInt(BtnName)
                // this.AutoPersonNum(NNRoomRule.creatRoom.nnrenShu)
                this.SetFeeLabel(NNRoomRule.creatRoom.nnrenShu, NNRoomRule.creatRoom.nnjushu)
                break;
            case "Auto":  //自动开始
                NNRoomRule.creatRoom.nnautobegin = parseInt(BtnName)
                break;
            case "diFen":
                NNRoomRule.creatRoom.nndifen = parseInt(BtnName)
                this.OnShangZhungBaseShow(parseInt(BtnName))
                break;
            case "juShu":
                NNRoomRule.creatRoom.nnjushu = parseInt(BtnName)
                this.SetFeeLabel(NNRoomRule.creatRoom.nnrenShu, NNRoomRule.creatRoom.nnjushu)
                break;
            case "Fee":  // 1：房主   2：AA  3:代开
                NNRoomRule.creatRoom.nnfangfei = parseInt(BtnName)
                break;
            case "tuiZhu":
                NNRoomRule.creatRoom.nntuizhu = parseInt(BtnName)
                break;
            case "jinZhiJiaRu":   //禁止加入
                NNRoomRule.creatRoom.isjinzhijiaru = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "xianZhiXiaZhu":  //禁止下注
                NNRoomRule.creatRoom.isxiazhuxianzhi = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "fanBei":
                NNRoomRule.creatRoom.nnfanbeiguize = parseInt(BtnName)
                this.Label_FanAndBei[0].string = parseInt(BtnName) == 1 ? "牛牛x4 牛九x3 牛八x2 牛七x2" : "牛牛x3 牛九x2 牛八x2"
                break;

            //----------------------------特殊牌型-------------------------
            case "shunziniu":
                NNRoomRule.creatRoom.shunziniu = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "wuhuaniu":
                NNRoomRule.creatRoom.wuhuaniu = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "tonghuaniu":
                NNRoomRule.creatRoom.tonghuaniu = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "huluniu":
                NNRoomRule.creatRoom.huluniu = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "zhadanniu":
                NNRoomRule.creatRoom.zhadanniu = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "wuxiaoniu":
                NNRoomRule.creatRoom.wuxiaoniu = event.node.getComponent(cc.Toggle).isChecked
                break;
            case "huanleniu":
                NNRoomRule.creatRoom.huanleniu = event.node.getComponent(cc.Toggle).isChecked
                break;
            //-----------------↑↑↑↑↑↑↑↑↑↑--特殊牌型-------↑↑↑↑↑↑↑↑↑↑---------------
            case "MaxQiangZhuang":
                NNRoomRule.creatRoom.nnzuidaqiangzhuang = parseInt(BtnName);
                break;
            case "shangZhuang":
                NNRoomRule.creatRoom.nnshangfen = parseInt(BtnName);
                break;

            default:
                break;
        }
        //特殊牌型选择显示
        this.Label_FanAndBei[1].string = this.SprTeShuShow();

    },


    onBtnClickON(event, customEventData) {
        var BtnName = event.target.name
        switch (customEventData) {

            case "FanBei":
                this.Btn_Tan[0].active = !this.Btn_Tan[0].active
                break;
            case "TeShu":
                this.Btn_Tan[1].active = !this.Btn_Tan[1].active
                break;
        }

    },

    //上庄分数计算
    OnShangZhungBaseShow(difen) {
        var sz = this.node_ShangZhuang.getChildByName("grid")
        NNRoomRule.NNRoomShanZhuangArr = []
        for (var i = 1; i < sz.childrenCount; i++) {
            var str = (difen * 100 * (2 + i)) / 2
            var item = sz.children[i]
            item.name = str + ""
            item.getChildByName("label").getComponent(cc.Label).string = str + ""
            NNRoomRule.NNRoomShanZhuangArr[i] = str
        }
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

    btnOnCreateRoom() {
        //添加音效
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
        //添加音效
        cc.log("createRoom");
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = 4;         //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.jushu = NNRoomRule.creatRoom.nnjushu;                                        //1.10局  2.20局  3.30局
        data.fangfei = NNRoomRule.creatRoom.nnfangfei;       //this.fangfei                              //1.房主支付 2.AA支付
        data.wanfa = NNRoomRule.creatRoom.nnwanfa
        data.difen = NNRoomRule.creatRoom.nndifen

        data.fanbeiguize = NNRoomRule.creatRoom.nnfanbeiguize
        data.autobegin = NNRoomRule.creatRoom.nnautobegin
        data.tuizhu = NNRoomRule.creatRoom.nntuizhu
        data.zuidaqiangzhuang = NNRoomRule.creatRoom.nnzuidaqiangzhuang
        data.jinzhijiaru = NNRoomRule.creatRoom.isjinzhijiaru
        data.jinzhicuopai = false
        data.xiazhuxianzhi = NNRoomRule.creatRoom.isxiazhuxianzhi
        data.shunziniu = NNRoomRule.creatRoom.shunziniu
        data.wuhuaniu = NNRoomRule.creatRoom.wuhuaniu
        data.tonghuaniu = NNRoomRule.creatRoom.tonghuaniu
        data.huluniu = NNRoomRule.creatRoom.huluniu
        data.zhadanniu = NNRoomRule.creatRoom.zhadanniu
        data.wuxiaoniu = NNRoomRule.creatRoom.wuxiaoniu
        data.huanleniu = NNRoomRule.creatRoom.huanleniu
        data.renShu = NNRoomRule.creatRoom.nnrenShu  // 人数来区分8人还是六人
        data.shangfen = NNRoomRule.creatRoom.nnshangfen;
        NNRoomRule.creatRoom.nngameType = 4

        cc.log("创建牛牛房间：", data)
        cc.globalMgr.GameFrameEngine.createRoom(data);
        var key = 'NNCreatRoom';
        this.setLocalData(key, NNRoomRule.creatRoom);
    },

    sendForClubCreateRoom() {
        //添加音效
        cc.log("createRoom");
        var data = new Object();
        data.uid = G.myPlayerInfo.uid;
        data.gametype = 4;         //游戏编号 (后续再加游戏 填写相应游戏编号)
        data.jushu = NNRoomRule.creatRoom.nnjushu;                                        //1.10局  2.20局  3.30局
        data.fangfei = NNRoomRule.creatRoom.nnfangfei;       //this.fangfei                              //1.房主支付 2.AA支付
        data.wanfa = NNRoomRule.creatRoom.nnwanfa
        data.difen = NNRoomRule.creatRoom.nndifen

        data.fanbeiguize = NNRoomRule.creatRoom.nnfanbeiguize
        data.autobegin = NNRoomRule.creatRoom.nnautobegin
        data.tuizhu = NNRoomRule.creatRoom.nntuizhu
        data.zuidaqiangzhuang = NNRoomRule.creatRoom.nnzuidaqiangzhuang
        data.jinzhijiaru = NNRoomRule.creatRoom.isjinzhijiaru
        data.jinzhicuopai = false
        data.xiazhuxianzhi = NNRoomRule.creatRoom.isxiazhuxianzhi
        data.shunziniu = NNRoomRule.creatRoom.shunziniu
        data.wuhuaniu = NNRoomRule.creatRoom.wuhuaniu
        data.tonghuaniu = NNRoomRule.creatRoom.tonghuaniu
        data.huluniu = NNRoomRule.creatRoom.huluniu
        data.zhadanniu = NNRoomRule.creatRoom.zhadanniu
        data.wuxiaoniu = NNRoomRule.creatRoom.wuxiaoniu
        data.huanleniu = NNRoomRule.creatRoom.huanleniu
        data.renShu = NNRoomRule.creatRoom.nnrenShu  // 人数来区分8人还是六人
        data.shangfen = NNRoomRule.creatRoom.nnshangfen;
        NNRoomRule.creatRoom.nngameType = 4

        var clubId = this._clubID;
        if (clubId != null) {
            data.julebuid = clubId;
        }

        //--------设置是否大厅俱乐部创建
        if (this._isFromHome != null) {
            data.isPlaySet = true;
        }

        cc.log("创建牛牛房间：", data)
        cc.globalMgr.GameFrameEngine.createRoom(data);
        var key = 'NNCreatRoom';
        this.setLocalData(key, NNRoomRule.creatRoom);

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
    },

    SprTeShuShow() {
        var teshu = this.Btn_Tan[1]
        var isteshu = true;
        for (var i = 0; i < teshu.childrenCount; i++) {
            var isChecked = teshu.children[i].getComponent(cc.Toggle).isChecked
            if (isChecked == false) {
                isteshu = false;
            }
        }
        if (isteshu) {
            return "全部勾选";
        } else {
            return "部分勾选";
        }
    },


    //----------------2018年10月25日 修改---------------

    // 自动开始 以人数的动态修改
    AutoPersonNum(num) {
        var grid = this.AutobeginNode.getChildByName('grid')
        var a = grid.children[1]
        var b = grid.children[2]
        var c = grid.children[3]
        if (num == 6) {
            a.name = "4", b.name = "5", c.name = "6"
            a.getChildByName('label').getComponent(cc.RichText).string = "满4人开"
            b.getChildByName('label').getComponent(cc.RichText).string = "满5人开"
            c.getChildByName('label').getComponent(cc.RichText).string = "满6人开"

        } else if (num == 8) {
            a.name = "6", b.name = "7", c.name = "8"
            a.getChildByName('label').getComponent(cc.RichText).string = "满6人开"
            b.getChildByName('label').getComponent(cc.RichText).string = "满7人开"
            c.getChildByName('label').getComponent(cc.RichText).string = "满8人开"

        } else if (num == 10) {
            a.name = "8", b.name = "9", c.name = "10"
            a.getChildByName('label').getComponent(cc.RichText).string = "满8人开"
            b.getChildByName('label').getComponent(cc.RichText).string = "满9人开"
            c.getChildByName('label').getComponent(cc.RichText).string = "满10人开"
        }

    },


    // 自动开始 以玩法的动态修改
    AutoPersonNum_playing(num) {
        var grid = this.AutobeginNode.getChildByName('grid')
        var a = grid.children[1]
        var b = grid.children[2]
        var c = grid.children[3]
        if (num < 5) {
            a.name = "4", b.name = "5", c.name = "6"
            a.getChildByName('label').getComponent(cc.RichText).string = "满4人开"
            b.getChildByName('label').getComponent(cc.RichText).string = "满5人开"
            c.getChildByName('label').getComponent(cc.RichText).string = "满6人开"

        } else {
            a.name = "6", b.name = "7", c.name = "8"
            a.getChildByName('label').getComponent(cc.RichText).string = "满6人开"
            b.getChildByName('label').getComponent(cc.RichText).string = "满7人开"
            c.getChildByName('label').getComponent(cc.RichText).string = "满8人开"

        }

    },


    SetFeeLabel(renshu, jushu) {

        if (jushu == 10) {
            this.fangZhuFee.string = "房主支付(        4  )"
            this.AAFee.string = "AA支付(        1  )"
        }
        else if (jushu == 20) {
            this.fangZhuFee.string = "房主支付(        8  )"
            this.AAFee.string = "AA支付(        2  )"
        }
        else if (jushu == 30) {
            this.fangZhuFee.string = "房主支付(        10  )"
            this.AAFee.string = "AA支付(        3  )"
        }

    },
    // Select
    btnOnClose() {
        //添加音效
        this.createNode.destroy();
    },

});

