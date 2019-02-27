
cc.Class({
    extends: cc.Component,

    properties: {
        spr_play: {
            default: null,
            type: cc.Button,
        },
        spr_suspend: {
            default: null,
            type: cc.Button,
        },
        spr_btnBg:{
            default: null,
            type: cc.Sprite,
        },
        btn_close: {
            default: null,
            type: cc.Button,
        },
        btn_open: {
            default: null,
            type: cc.Button,
        },
    },
    //暂停
    suspend () {
        cc.log("zanting==============")
        this.spr_play.node.active = true;
        this.spr_suspend.node.active = false;
        cc.globalMgr.GameRePlayControl.suspend()
    },
    Forward () {
        cc.log("前进==============")
        this.spr_play.node.active = true;
        this.spr_suspend.node.active = false;
        cc.globalMgr.GameRePlayControl.Forward()
    },
    rePlayBack () {
        cc.log("后退==============")
        this.spr_play.node.active = true;
        this.spr_suspend.node.active = false;
        cc.globalMgr.GameRePlayControl.rePlayBack()
    },
    rePlayPlay () {
        cc.log("播放==============")
        this.spr_play.node.active = false;
        this.spr_suspend.node.active = true;
        cc.globalMgr.GameRePlayControl.rePlayPlay()
    },
    rePlayEnd(){
        this.spr_play.node.active = false;
        this.spr_suspend.node.active = true;
        cc.globalMgr.GameRePlayControl.endScence()
        //cc.director.loadScene("home");
    },
    closeBtnBg(){
        this.btn_close.node.active = false
        this.btn_open.node.active = true
        this.spr_btnBg.node.active = false
    },
    openBtnBg(){
        this.btn_close.node.active = true
        this.btn_open.node.active = false
        this.spr_btnBg.node.active = true
    }
});
