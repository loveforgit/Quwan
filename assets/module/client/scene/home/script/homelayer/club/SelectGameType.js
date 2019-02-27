var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {

    },



    //创建扎金花
    onClickCreateZJH() {
        cc.log("创建扎金花")
    },

    //创建任丘麻将
    onClickCreateRenQiuMJ() {
        cc.log("创建任丘麻将")
    },

    //创建牛牛
    onClickCreateNN() {
        cc.log("创建牛牛")
    },

    //创建斗地主
    onClickCreateDDZ() {
        cc.log("创建斗地主")
    },

    //创建三公
    onClickCreateSanGong() {
        cc.log("创建三公")
    },

    //创建牌九
    onClickCreatePaiJiu() {
        cc.log("创建牌九")
    },

    onClickDestroy() {
        this.playClickMusic()
        FTools.HidePop(this.node)
    },
});
