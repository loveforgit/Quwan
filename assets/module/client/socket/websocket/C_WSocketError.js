
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    init(){
        var obj = {}        
        
        this.startConnected = true;
        this.connectCount = 0;
        this._messageBox = null;
        this.schedule(this.update2, 3.0);
        this.schedule(this.update, 0.1);
        //如果当前场景是在大厅界面，不移除消息监听事件
        cc.log("currentSceneName ",  cc.globalMgr.SceneManager.getInstance().currentSceneName)
        if(cc.globalMgr.SceneManager.getInstance().currentSceneName != "Logon")
        {
            cc.log("currentSceneName  fuck ")
            cc.globalMgr.service.getInstance().clear();
        }
        cc.log("connectCount ", this.connectCount)
        cc.globalMgr.EventManager.getInstance().regist("SOCKET_CLOSE_EVENT2",this, this.socketError)
        this.socketError(obj, this);
    },
    createMessageBox(){
        //如果消息提示框还没有创建，创建消息提示框
        if(this._messageBox == null){
            this._messageBox = cc.instantiate(cc.globalRes['messageBoxPrb']);
            var curScene = cc.director.getScene();
            if (curScene !== null && this._messageBox !== undefined) {
                this._messageBox.parent = curScene;
                this._messageBox.getComponent("MessageBox").setTipStr("[尝试重新连接]");
                this._messageBox.getComponent("MessageBox").showOkBtn()
                this._messageBox.getComponent("MessageBox").setOkBtnClickEvent(this, this.sureClicked, true);
            }
        }
    },
    
    socketError(obj, target){
        target.createMessageBox();
        cc.log("connectCount ", target.connectCount)
        if(target.connectCount > 0)
        {
            target._messageBox.getComponent("MessageBox").setTipStr("[尝试重新连接：" + target.connectCount + "次失败！]");
            target._messageBox.getComponent("MessageBox").setSureBtnVisible(false);
        }
        else 
        {
            target._messageBox.getComponent("MessageBox").setTipStr("[通讯异常，正在尝试重新连接]");
            target._messageBox.getComponent("MessageBox").setSureBtnVisible(false);
        }
    
        if(target.connectCount>=5)
        {
            // target.connectCount = 0;
            target._messageBox.getComponent("MessageBox").setTipStr("通讯异常，请检查网络！点击确定，再次尝试连接");
            target._messageBox.getComponent("MessageBox").setSureBtnVisible(true);
            target.startConnected = false;
        }
        else{
            target.startConnected= true;
        }
    },
    //确定按钮点击事件
    sureClicked(target){
        target.connectCount = 0;
        target.startConnected = true;
        target._messageBox.getComponent("MessageBox").setSureBtnVisible(false);
    },
    //重连操作
    reConnect(){
        var t_s = require("C_WSocket")
        var s = new t_s()
        s.connect(G.IP, G.PORT);
        G.socketMgr.socket = s;
    },
    //销毁socketError
    closeSocketError(){
        cc.log("销毁socketError")
        this.unschedule(this.update);
        this.unschedule(this.update2);
        this._messageBox.destroy();
        this._messageBox = null;
        G.finishState = 0;
        cc.globalMgr.EventManager.getInstance().unregist(this);
    },
    update2(dt){  
        if(!this.startConnected)
        {
            return;
        }
        this.startConnected = false;
        this.reConnect();
        this.connectCount ++;
    },
    update(dt){
        if(G.socketMgr.socket.isConnected == true)
        {
            //如果当前运行的场景是 大厅场景，重新请求登录
            if(cc.globalMgr.SceneManager.getInstance().currentSceneName != "Logon")
            {
                cc.log(" 发送连接消息")
                G.socketMgr.socket.send(cc.globalMgr.msgIds.LOGIN_REQUEST, cc.globalMgr.msgObjs.login(G.myPlayerInfo.uid , G.myPlayerInfo.name, G.myPlayerInfo.image, G.myPlayerInfo.sex))
            }

            this.closeSocketError()
        }
    }
});
