
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        //筛子点数
        diceNodeShow: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad () {
        this._anim = this.node.getComponent(cc.Animation);
        cc.log("------查看动画对象：", this._anim);
    },


    start () {

    },

    //开始动画
    startAnimation(){
        this._anim.play();
    },

    //停止动画
    stopAnimation(){
        this._anim.stop();
    },

    //设置点数
    setPointForDice(data01, data02){
        this._diceValue01 = data01;
        this._diceValue02 = data02;
    },

    OnDestroySelfForDice:function(){
        var curCard = cc.instantiate(this.diceNodeShow);
        curCard.getComponent("diceShow").setPoint(this._diceValue01, this._diceValue02);
        curCard.parent = this.node.parent;

        cc.log("------销毁动画");
        this.node.destroy();
    },

    OnDestroySelf:function(){
        cc.log("------销毁动画");
        this.node.destroy();
    },

});
