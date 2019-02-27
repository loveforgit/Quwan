//by yky
//2018.4.14

cc.Class({
    extends: cc.Component,

    properties: {
        label_notice:{
            default:null,
            type:cc.Label
        },
        node_mask:{
            default:null,
            type:cc.Node
        }
    },
    onLoad () {
        //获取字体宽度
        this.startSchedule()
        this.setRollingNotice("")
    },

    //设置滚动公告内容
    setRollingNotice(str){
        this.label_notice.getComponent(cc.Label).string = str
    },

    startSchedule(){
        this.schedule(this.moveLabel, 0.01)
    },

    moveLabel(){
        var labelWidth = this.label_notice.node.width;
        var maskWidth =  this.node_mask.width
        if(this.label_notice.node.x < -labelWidth)
        {
            this.label_notice.node.x = maskWidth
        }
        else{
            this.label_notice.node.x --
        }
    },

    start () {

    },
});
