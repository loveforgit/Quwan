var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {

        headItme: {
            default: null,
            type: cc.Node
        },

        content: {
            default: null,
            type: cc.Node
        },


        gameName: {
            default: null,
            type: cc.Label
        },

        lab_ru: {
            default: null,
            type: cc.Label
        },

        lab_fen: {
            default: null,
            type: cc.Label
        },

        lab_zhiFu: {
            default: null,
            type: cc.Label
        },

        lab_ren: {
            default: null,
            type: cc.Label
        },

        lab_state: {
            default: null,
            type: cc.Label
        },
    },

    onLoad() {
        this.createHead(10)
    },

    // 根据房间的人数生成头像
    createHead(headCount) {
        var headPos = ClubDeskSet.userHeadPos(headCount)
        for (let i = 0; i < headCount; i++) {
            var item = cc.instantiate(this.headItme)
            this.content.addChild(item)
            item.setPosition(cc.p(headPos[i]))
            item.active = true
        }
    },

    setDesktopInfo(gameName, ru, fen, zhifu, ren, state) {
        this.gameName = gameName
        this.lab_ru = ru
        this.lab_fen = fen
        this.lab_zhiFu = zhifu
        this.lab_ren = ren
        this.lab_state = state
    },


    //玩法设置
    onClickSetPlaying() {
        var scene = cc.director.getScene();
        let node = FTools.ShowPop("runSelectGameType", scene)
        node.setPosition(640, 360);
        let spr = node.getComponent("SelectGameType")
    },


    //玩法设置
    onClickSetDesktopInfo() {
        var scene = cc.director.getScene();
        let node = FTools.ShowPop("runDesktopRoomInfo", scene)
        node.setPosition(640, 360);
        let spr = node.getComponent("Club_setRoomInfo")

    },

});
