//yang  2018/8/8
//麻将回放控制

var comm = require("Comm")
var msgIds = require("MsgIds");

cc.Class({
    extends: comm,

    properties: {

    },

    ctor() {
        //this.eventRegist("GameReConnect", this, this.reconnect)
        this._gameControl = null;
    },
    onLoad() {
        this.dataInfo;
        this.timeadd = 0;       //记录下第几条消息
        this.returnNum = true;  
        this.ForwardNum = 0; 
       
    },
   
    //结束回放
    endScence(){
        if(G.isSuspend == true){
            G.isRePlay = false
            this._gameControl.clearView();
            cc.director.loadScene("home");
        }
        else {
            this.unschedule(this.timeAdd)
            G.isSuspend = true
        }
    },
    //回放暂停
    suspend(){
        cc.log("暂停=====")
         this.unschedule(this.timeAdd)
         this.returnNum = true
    },
     //播放
     rePlayPlay(){
        cc.log("bofang=====")
         this.schedule(this.timeAdd,0.5)
         G.isSuspend = false
    },
    //回放前进
    Forward(){
        cc.log( G.isSuspend)
        if(G.isSuspend == true){
            this.isForward = true;
            this.timeadd ++
            if(this.timeadd >= this.dataInfo.length){
                this.timeadd =  this.dataInfo.length
            }
            else{
                cc.log(this.dataInfo[this.timeadd],this.timeadd,"qianjin------------>>>")
                for (var i = 0; i < this.dataInfo[this.timeadd].length;i++){
                this._gameControl.onEventGameMessage(JSON.parse(this.dataInfo[this.timeadd][i]).zinetid, JSON.parse(this.dataInfo[this.timeadd][i]))
                }
            }
        }
        else{
            this.unschedule(this.timeAdd)
            G.isSuspend = true
            cc.log(G.isSuspend,"zanting")
        }
       
    },
     //回放后退
     rePlayBack(){
        this.isRePlayBack = true
        if(G.isSuspend == true){
            this._gameControl.hideCPGHTips()
            cc.log(this.timeadd,"回退")
            this.timeadd--;
            if(this.timeadd<0){
                this.timeadd = 0
            }
            if(this.timeadd < this.dataInfo.length){
                cc.log(this.timeadd,"this.timeadd--;")
                this._gameControl._nodeSmallResult.active = false
                //this._gameControl._buyHorse.active = false
            }
            cc.log(this.timeadd,"回退hou")
            cc.log( this.dataInfo[this.timeadd],"回放信息")
            for (var i = 0; i < this.dataInfo[this.timeadd].length;i++){
               this._gameControl.onEventGameMessage(JSON.parse(this.dataInfo[this.timeadd][i]).zinetid, JSON.parse(this.dataInfo[this.timeadd][i]))
            }
        }
        else{
            this.unschedule(this.timeAdd) 
            G.isSuspend = true
        }
    },
    //回放派发消息
    timeAdd(){
        //cc.log(this.dataInfo,"===========================》》》》")
        //cc.log(this.dataInfo.length,this.timeadd,"回放长度")
        if(this.timeadd<this.dataInfo.length){
            for (var i = 0; i < this.dataInfo[this.timeadd].length;i++){
                //cc.log(JSON.parse(this.dataInfo[this.timeadd][i]),"=================>>>>>")
                this._gameControl.onEventGameMessage(JSON.parse(this.dataInfo[this.timeadd][i]).zinetid, JSON.parse(this.dataInfo[this.timeadd][i]))
            }
        }
        else{
            this.unschedule(this.timeAdd)
            G.isSuspend = true
        }
        this.timeadd ++;
    },

    //麻将回放进入场景
    RePlayEnterRoom(gameID,data){
        var sceneName = G.gameIdList[gameID + ""][0];
        this.timeadd = 0
        //cc.log(data,"==-=-=-=-=-=-=-=data-=-=-=-=-=")
        //var sceneName = "mahjonng"
        cc.log("sceneName " + sceneName);
        this.dataInfo = data
        G.isRePlay = true;   //麻将回放标识    回放结束置为false
        G.isSuspend = false;  //回放暂停标识   false未暂停  true 暂停
        G.gameNetId = parseInt(G.gameIdList[gameID + ""][1]);
        cc.globalMgr.SceneManager.getInstance().preloadScene(sceneName, this, function (target) {
            target.createGameControl(G.gameIdList[gameID + ""][0]);
            if (target._gameControl != null) {
                target.schedule(target.timeAdd, 0.5)
            }
        })
    },
    
    //创建游戏控制层
    createGameControl(gamename) {
        cc.log("==========",gamename)
        var scene = cc.director.getScene();
        console.assert(scene, "createGameControl get curScene failed!");
        var node = scene.getChildByName("Canvas");
        console.assert(node, "createGameControl get node failed!");
        var scriptName = gamename + "GameControl";
        if (gamename == "mahjong"){
            var script = node.getComponent(scriptName);
        }
        else{
         var script = node.getChildByName(scriptName).getComponent(scriptName);
        }
        console.assert(node, "createGameControl get script component failed!");
        cc.log("--gamecre---", scriptName)
        cc.log("--gamecre---", script)

        this._gameControl = script;
        this._gameControl.setGameFrameEngine(this)
        cc.log("oneventGameMessage one:" + gamename + " " + scriptName);
    },

    // //游戏内消息监听事件
    // onEventGameMessage(msgNumber, body, target) {
    //     if (target._gameControl != null) {
    //         target._gameControl.onEventGameMessage(body.zinetid, body)
    //     }
    //     else {
    //         cc.log("gameControl is null")
    //         target.addMessageBox("gameControl is null")
    //     }
    // },
});
