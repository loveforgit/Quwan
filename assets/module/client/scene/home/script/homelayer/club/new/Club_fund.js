
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        label_fundNumber: {
            default: null,
            type: cc.Label
        },
    },

    getFundNumber(num) {
        this.label_fundNumber.string = num
    },

    onClickChongZhi() {
         FTools.ShowPop("runAddFund", this.node)
    },
    onClickDestroy() {
        FTools.HidePop(this.node)
    },

});
