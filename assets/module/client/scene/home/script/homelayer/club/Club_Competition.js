var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //茶水收取
        lab_chaShui: {
            default: null,
            type: cc.Label
        },
        //茶水比例
        lab_chaShuiBiLi: {
            default: null,
            type: cc.Label
        },
        //输入的 最低游戏分
        lab_minGameScore: {
            default: null,
            type: cc.EditBox
        },
        //输入的 可抢庄分数
        lab_qiangZhuangScore: {
            default: null,
            type: cc.EditBox
        },

        //茶水选择的 节点
        chaShuiBox: {
            default: null,
            type: cc.Node
        },

        //茶水比例 条
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        //游戏中上下分 节点
        GameUpScoreNode: {
            default: null,
            type: cc.Node
        },

        //隐藏玩家 ID
        userIdShowNode: {
            default: null,
            type: cc.Node
        },

        nodeOne: {
            default: null,
            type: cc.Node,
            tooltip: "image节点"
        },

        helpNode: {
            default: null,
            type: cc.Node,
            tooltip: "帮助节点"
        },
    },

    onLoad() {
        this.helpNode.active = false
        this.chaShuiBox.active = false
        this.lab_chaShui.string = "所有赢家"
        this.lab_chaShuiBiLi.string = "10%"
        this.scoreSet = true
        this.isUpScore = true
        this.isIdShow = true
    },


    //按钮是否能点击
    btnIsClick(bool) {

        this.GameUpScoreNode.opacity = bool ? 255 : 100
        this.userIdShowNode.opacity = bool ? 255 : 100
        this.GameUpScoreNode.getChildByName("Toggle").getComponent(cc.Toggle).interactable = bool
        this.userIdShowNode.getChildByName("Toggle").getComponent(cc.Toggle).interactable = bool
    },

    onClickChaShuiBoxIsShow() {
        this.chaShuiBox.active = !this.chaShuiBox.active
    },

    //茶水选择事件
    onClickSelectChaShuiEvent(event, customEventData) {
        var name = event.target.name
        var txt = "所有赢家"
        if (name == "1") {
            txt = "大赢家"
        } else if (name == "2") {
            txt = "前两名赢家"
        } else if (name == "3") {
            txt = "前三名赢家"
        } else if (name == "4") {
            txt = "所有赢家"
        }
        this.lab_chaShui.string = txt
    },

    sliderEvent(slider, customEventData) {
        var num = slider.progress
        this.progressBar.progress = num
        this.lab_chaShuiBiLi.string = Math.floor(num * 10) + "%"
    },

    onToggleEvetn(event, customEventData) {
        var isChecked = event.isChecked
        if (customEventData == "scoreSet") {
            //不可负分选择
            this.scoreSet = isChecked
        } else if (customEventData == "isUpScore") {
            //不可上分
            this.isUpScore = isChecked
        } else if (customEventData == "idShow") {
            //隐藏玩家id
            this.isIdShow = isChecked
        }

    },


    //点击确定发送事件
    sendConfirmEvent() {

    },

    onClickHelpShow() {
        this.nodeOne.active = false
        this.helpNode.active = true
    },

    onClickHelpHide() {
        this.nodeOne.active = true
        this.helpNode.active = false
    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
