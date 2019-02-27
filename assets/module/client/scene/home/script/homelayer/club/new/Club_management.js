
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        inputID: {
            default: null,
            type: cc.EditBox
        },

        userInfo: {
            default: null,
            type: cc.Node
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
    },
    start() {
    },
    onLoad() {
        this.btnInit()
    },

    //按钮查找初始化
    btnInit() {
        this.image = this.node.getChildByName('image');
        this.setBtn = this.image.getChildByName('sp_text_border');
        var ok = this.setBtn.getChildByName('b_btn_sure'); //确定设置管理员
        ok.on('click', this.setManagement, this);
    },

    //设置显示的ID
    getUserID(id) {
        this.inputID.string = id
    },

    getManagementInfo(body) {
        var clubManagerList = body.clubManagerList
        var data = body.date
        // var content = this.scrollView.content
        // content.removeAllChildren()
        // content.height = 114 * clubManagerList.length
        if (clubManagerList.length <= 0) {
            this.userInfo.active = false;
            return
        }
        var head = this.userInfo.getChildByName('hand').getComponent(cc.Sprite)
        var loadHead = function (head) {
            cc.loader.load({ url: clubManagerList[0].image, type: 'png' }, function (err, tex) {
                head.spriteFrame = new cc.SpriteFrame(tex)
            });
        };
        loadHead(head)
        this.userInfo.getChildByName('name').getComponent(cc.Label).string = clubManagerList[0].name
        this.userInfo.getChildByName('id').getComponent(cc.Label).string = clubManagerList[0].wxId
        this.userInfo.getChildByName('time').getComponent(cc.Label).string = data
        this.otherUid = clubManagerList[0].uid
        this.userInfo.active = true
        var delBtn = this.userInfo.getChildByName('b_btn_delete')
        delBtn.on('click', this.onclickDelManagement, this);

    },

    //-----------------------点击事件--------------------------------

    //删除管理员
    onclickDelManagement() {
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_DELMANAGENT_CLUB;
        obj.clubId = G.saveClubID;
        obj.otherUid = this.otherUid
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },

    //确定 设置管理员  的回调
    setManagement: function (button) {
        //do whatever you want with button
        if (this.inputID.string == '') {
            this.addTips("请输入用户ID", this.node)
            return null
        }
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_SETMANAGENT_CLUB;
        obj.rank = 9;
        obj.clubId =G.saveClubID;
        obj.wxId = parseInt(this.inputID.string)
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },
    onClickDestroy() {
        FTools.HidePop(this.node)
    },

});
