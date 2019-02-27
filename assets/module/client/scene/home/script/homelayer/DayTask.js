var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        Node_Botn: {
            default: null,
            type: cc.Node
        },
        Node_NotBotn: {
            default: null,
            type: cc.Node
        },
        Node_NotItem: {
            default: null,
            type: cc.Node
        },
    },
    OnDauTaslprogress: function (customEventData, num) {
        this.playClickMusic()
        var taskNum = customEventData;
    },

    onLoad() {

    },

    start() {

    },
    OnClickClose: function () {
        this.playClickMusic()
        this.node.destroy();
    },
    OnClickTask: function (event, customEventData) {
       this.playClickMusic()

       var num = "123457";
       var zz = num - 0;
       cc.log("--zz--" , zz)
    },

});
