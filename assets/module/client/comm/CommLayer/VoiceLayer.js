// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        sp_ani :{
            default: [],
            type: cc.Sprite
        }
    },

    onLoad () {
        this.startIndex = 1
        this.schedule(this.changeSoundAni, 0.1)
    },

    //定时器改变动画
    changeSoundAni(){
        
        for(var i = 0;i < 7;i++)
            this.sp_ani[i].node.active = false
        for(var i = 0;i <= this.startIndex;i ++)
            this.sp_ani[i].node.active = true
        this.startIndex ++
        if(this.startIndex >= 7)
            this.startIndex = 0
    },  

    start () {

    },

});
