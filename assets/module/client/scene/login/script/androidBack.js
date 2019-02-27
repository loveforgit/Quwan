//by yky
//2018 4 25
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
  
    },

    onLoad()
    {
        //添加常驻节点
        cc.game.addPersistRootNode(this.node);
        //监听按键
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.KEY.back:
                this.addMessageBox("是否确定离开游戏？", this, function (target) {
                    cc.director.end();
                }, 3)
            break;
        }
    },
});
