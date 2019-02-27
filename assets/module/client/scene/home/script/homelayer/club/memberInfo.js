
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //昵称
        label_nickName: {
            default: null,
            type: cc.Label
        },
        //id
        label_id: {
            default: null,
            type: cc.Label
        },
        // //魅力值
        // label_glamour:{
        //     default: null,
        //     type:cc.Label
        // },
        //身份
        label_identity: {
            default: null,
            type: cc.Label
        },
        //积分
        label_score: {
            default: null,
            type: cc.Label
        },
        //状态
        label_state: {
            default: null,
            type: cc.Label
        },
        //头像
        sp_head: {
            default: null,
            type: cc.Sprite
        },
    },
    onLoad() {
        this.node.getChildByName('sp_player_info_bg').getChildByName('btn_xg').active = G.isClubHost //修改按钮的显示 

    },

    //接受从服务器推送过来的值 积分
    getScore(integral) {
        this.label_score.string = integral
    },

    //点击修改魅力值
    onClickChangeGlamouer() {
        //俱乐部成员详情
        var scene = cc.director.getScene();
        var node = FTools.ShowPop("runChangeGlamouer", scene)
        node.setPosition(640, 360);
        node.getComponent("changeGlamouer").updateInfo(this.sp_head.spriteFrame, this._selfId, this.label_id.string, this.label_nickName.string, this.label_score.string, this.clubId)
    },
    //获取UID
    setIdForMember: function (id) {
        this._selfId = id;
    },
    //更新个人信息
    updateInfo(headUrl, wxid, nickName, identity, glamouer, score, state, clubId) {
        //获取用户头像
        var shengfen = ''
        this.sp_head.spriteFrame = headUrl
        this.label_id.string = wxid
        this.label_nickName.string = nickName
        // this.label_glamour.string = glamouer
        if (identity == 10) {
            shengfen = '部主'
        } else if (identity == 9) {
            shengfen = '管理'
        } else if (identity == 8) {
            shengfen = '合伙人'
        } else {
            shengfen = '成员'
        }
        cc.log("在线状态", state)
        this.label_identity.string = shengfen
        this.label_score.string = score
        this.label_state.string = state == '1' ? "在线" : "离线"
        this.clubId = clubId
    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },

});
