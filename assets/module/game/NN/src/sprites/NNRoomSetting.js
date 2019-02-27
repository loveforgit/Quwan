var comm = require("Comm")

cc.Class({
    extends: comm,

    properties: {
        // -----------------------------音效相关----------------------------
        //音效滑动条
        sliderForEffect: {
            default: null,
            type: cc.Slider
        },

        //音效进度条
        progressForEffect: {
            default: null,
            type: cc.ProgressBar
        },

        //音效开
        effectOn: {
            default: null,
            type: cc.Node
        },

        //音效关
        effectOff: {
            default: null,
            type: cc.Node
        },

        // -----------------------------音乐相关----------------------------
        //音乐滑动条
        sliderForMusic: {
            default: null,
            type: cc.Slider
        },

        //音乐进度条
        progressForMusic: {
            default: null,
            type: cc.ProgressBar
        },

        //音乐开
        musicOn: {
             default: null,
             type: cc.Node
         },

        // //音乐关
         musicOff: {
             default: null,
             type: cc.Node
         }
    },

    onLoad() {
        this.NNGame = null;
        this._gameLayer = null
        // console.log("查看全局用户数据！");
        var localData = this.getLocalData("musicData");
        // cc.log("查看初始本地数据");
        // cc.log(localData)
        if(!localData){
            // console.log('未发现本地文件！');
            this.progressForMusic.progress = this.sliderForMusic.progress = G.musicData.musicVolume;
            this.progressForEffect.progress = this.sliderForEffect.progress = G.musicData.effectVolume;
        }
        else
        {
            // console.log('发现本地文件！');
            //如果音乐按钮打开
            if(localData.musicIsOn){
                // this.musicOn.active = true;
                // this.musicOff.active = false;
                this.sliderForMusic.enabled = true;
                this.progressForMusic.progress = localData.musicVolume;
                // cc.log("---音量大小--" , localData.musicVolume)
                // cc.log("---音量提示栏---" ,  this.progressForMusic.progress)
                this.sliderForMusic.progress = localData.musicVolume;
            }
            else{
                // this.musicOn.active = false;
                // this.musicOff.active = true;
                this.sliderForMusic.enabled = true;
                this.progressForMusic.progress = 0;
                this.sliderForMusic.progress = 0;
            }

            //如果音效按钮打开
            if(localData.effectIsOn){
                // this.effectOn.active = true;
                // this.effectOff.active = false;
                this.sliderForEffect.enabled = true;
                this.progressForEffect.progress = localData.effectVolume;
                this.sliderForEffect.progress = localData.effectVolume;
                
                // cc.log("---音效大小--" , localData.musicVolume)
                // cc.log("---音效提示栏---" ,  this.progressForMusic.progress)
            }
            else{
                // this.effectOn.active = false;
                // this.effectOff.active = true;
                this.sliderForEffect.enabled = true;
                this.progressForEffect.progress = 0;
                this.sliderForEffect.progress = 0;
            }
        }
    },

    setBgMusicId(bgMusicID){
        this.bgMusicID = bgMusicID
    },

    start() {
    },

    // -----------------------------音乐相关----------------------------
    OnMusicClick: function () {
        cc.log("音乐滑块被点击了！");
        this.progressForMusic.progress = this.sliderForMusic.progress;
        //记录音量到本地
        G.musicData.musicVolume = this.sliderForMusic.progress;
        var key = 'musicData';
        this.setLocalData(key, G.musicData);
        if(this.bgMusicID != undefined){
            cc.audioEngine.setVolume(this.bgMusicID,G.musicData.musicVolume);
        }
    },

    OnMusicOnClick: function () {
        // cc.log("音乐关！");
        // this.musicOn.active = false;
        // this.musicOff.active = true;
        this.sliderForMusic.enabled = true;
        this.sliderForMusic.progress = 0;
        this.progressForMusic.progress = 0;
        //记录音乐按钮状态到本地
        G.musicData.musicIsOn = false;
        G.musicData.effectVolume = this.progressForEffect.progress;
        G.musicData.musicVolume = 0;
        var key = 'musicData';
        this.setLocalData(key, G.musicData);
        if(this.bgMusicID != undefined){
            cc.audioEngine.setVolume(this.bgMusicID, 0);
        }
    },

    OnMusicOffClick: function () {
        // this.musicOn.active = true;
        // this.musicOff.active = false;
        this.sliderForMusic.enabled = true;
        this.sliderForMusic.progress = 1.0;
        this.progressForMusic.progress = 1.0;
        //记录音乐按钮状态到本地
        G.musicData.musicIsOn = true;
        G.musicData.effectVolume = this.progressForEffect.progress;
        G.musicData.musicVolume = 1.0;
        var key = 'musicData';
        this.setLocalData(key, G.musicData);
        if(this.bgMusicID != undefined){
            cc.audioEngine.setVolume(this.bgMusicID, 1);
        }
    },

    // -----------------------------音效相关----------------------------
    //音效部分
    OnEffectClick: function () {
        // console.log("音效滑块被点击了！");
        this.progressForEffect.progress = this.sliderForEffect.progress;
        //记录音量到本地
        G.musicData.effectVolume = this.sliderForEffect.progress;
        var key = 'musicData';

        this.setLocalData(key, G.musicData);
    },

    OnEffectOnClick: function () {
        // this.effectOn.active = false;
        // this.effectOff.active = true;
        this.sliderForEffect.enabled = true;
        this.sliderForEffect.progress = 0;
        this.progressForEffect.progress = 0;
        var localData = this.getLocalData("musicData");
        // cc.log("点击进入本地数据！");
        // cc.log(localData);

        //记录音效按钮状态到本地
        G.musicData.effectIsOn = false;
        
        G.musicData.musicVolume = this.progressForMusic.progress;
        G.musicData.effectVolume = 0;
        var key = 'musicData';
        this.setLocalData(key, G.musicData);
        // cc.log("点击g数据！");
        // cc.log(G.musicData);
        var localData = this.getLocalData("musicData");
        // cc.log("点击结束本地数据！");
        // cc.log(localData);
        // if(G.audioIDS.btnEffectID){
        //     cc.audioEngine.setVolume(G.audioIDS.btnEffectID, 0);
        // }
    },
    
    OnEffectOffClick: function () {
        // this.effectOn.active = true;
        // this.effectOff.active = false;
        this.sliderForEffect.enabled = true;
        this.sliderForEffect.progress = 1.0;
        this.progressForEffect.progress = 1.0;
        //记录音效按钮状态到本地
        G.musicData.effectIsOn = true;
        G.musicData.musicVolume = this.progressForMusic.progress;
        G.musicData.effectVolume = 1.0;
        var key = 'musicData';
        this.setLocalData(key, G.musicData);
        // if(G.audioIDS.btnEffectID){
        //     cc.audioEngine.setVolume(G.audioIDS.btnEffectID, 1);
        // }
    },

    //退出游戏
    OnExitGame: function () {
        //添加音效
        this.playClickMusic()
        
        // cc.log("---退出游戏----")
        //cc.director.loadScene("Logon");
        cc.game.end();
    },

    //切换账号
    onChangeClick: function(){
        //添加音效
        this.playClickMusic()

        this.logOut();
    }, 
    //打开GPS
    onClickOPenGPS: function(){
        //添加音效
        this.playClickMusic()
        //todo 向服务器发送消息
    //    this.appDetails()
    }, 
    //设置gamelayer
    setGamelayer(gameLayer){

        this._gameLayer = gameLayer
        cc.log("设置gamelayer", this._gameLayer)
    },

    //超端控制按钮
    onClickSuper(){
        cc.log("超端控制按钮", this._gameLayer)
        if(this._gameLayer != null)
            this._gameLayer.onClickedSuperVisible()
    },



    //关闭
    OnClickClose: function () {
        //添加音效
        this.playClickMusic()

        this.node.destroy();
        // cc.log("---退出游戏close----")
        // cc.director.loadScene("Logon");
        // cc.game.end();
        //os.exit() ios 退出游戏

    },

     //获取牛牛nnGameViewLayer 对象 上所挂脚本对象
     NNGameThis(game){
        this.NNGame = game
    
       },

  //牛牛房间 桌面 设置
   NNRoomDeskSet(sub,event){
    this.playClickMusic()
    switch (event){
      case "desk1":
        this.NNGame.desktopInit(0)
            break;
      case "desk2":
       this.NNGame.desktopInit(1)
            break;
      case "desk3":
       this.NNGame.desktopInit(2)
            break;
      case "desk4":
       this.NNGame.desktopInit(3)
            break;
    }

   },
   //牛牛房间 扑克 设置
   NNRoomCardSet(sub,event){
    this.playClickMusic()
    switch (event){
      case "card1":
      this.NNGame.cardInit(0) 
            break;
      case "card2":
      this.NNGame.cardInit(1) 
            break;
      case "card3":
      this.NNGame.cardInit(2) 
            break;
      case "card4":
      this.NNGame.cardInit(3) 
            break;
    }

   },
});
