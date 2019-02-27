var comm = require("Comm")

cc.Class({

    extends: comm,

    properties: {
        inputTex: {
            default: null,
            type: cc.EditBox
        },

        headNode: {
            default: null,
            type: cc.Node
        },

        //查询俱乐部 按钮 集合
        btnOneNode: {
            default: null,
            type: cc.Node
        },

        //选择加入还是 取消 按钮集合
        btnTwoNode: {
            default: null,
            type: cc.Node
        },

        //创建人姓名
        nameShow: {
            default: null,
            type: cc.Label
        },

        //创始人ID
        idShow: {
            default: null,
            type: cc.Label
        },

        //头像图片
        imageShow: {
            default: null,
            type: cc.Sprite
        },
    },

    onLoad() {
        //启用查询监听
        // G.saveClubThis.listenForAll();
        this.init()
    },
    
    onEnable() {
        this.init()
    },

    init() {
        this.headNode.active = false;
        this.btnOneOrBtnTwoIsShow(true, false)
    },

    //查询按钮  和  加入按钮 
    btnOneOrBtnTwoIsShow(isOne, isTwo) {
        this.btnOneNode.active = isOne
        this.btnTwoNode.active = isTwo
    },

    //设置查询结果
    setResoultViewForFind(data) {
        if (data != null) {
            this.btnOneOrBtnTwoIsShow(false, true)
            this.headNode.active = true;
            var realData = data.clubInfo
            cc.log("设置查询数据：", realData);
            this.nameShow.string = realData.clubName;
            this.idShow.string = realData.clubId;
            //获取用户头像
            var that = this;
            cc.loader.load({ url: realData.clubImage, type: 'png' }, function (err, tex) {
                that.imageShow.spriteFrame = new cc.SpriteFrame(tex)
            });
        }
    },

    //查询
    onFindClick() {
        cc.log("查询被点击了");
        if (this.inputTex.string != "") {
            this.sendForFindClub();
            //设置查询界面
            G.saveClubThis.setFindView(this.node);
        }
    },

    //加入
    onAddClick() {
        cc.log("加入俱乐部被点击了");
        if (this.inputTex.string != "") {
            this.sendForAddClub();
        }
        this.node.active = false
    },

    //发送查询俱乐部消息zsxzx
    sendForFindClub() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_CLUB_MESSAGE;
        obj.clubId = this.inputTex.string;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        cc.log("查询发送数据：", obj);
    },

    //发送加入俱乐部消息
    sendForAddClub() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_PLAYER_APPLY_CLUB;
        obj.clubId = this.inputTex.string;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
        cc.log("查询发送数据：", obj);
    },

    //返回
    onBackClick() {
        this.init()
        //打开俱乐部左侧列表
        this.inputTex.string = ""
        this.node.active = false
    },
});
