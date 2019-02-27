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

        //音乐关
        musicOff: {
            default: null,
            type: cc.Node
        },

        btn_exitGame: {
            default: null,
            type: cc.Node
        },

        btn_switchAccount: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {
        // console.log("查看全局用户数据！");
        var localData = this.getLocalData("musicData");
        // cc.log("查看初始本地数据");
        // cc.log(localData)
        this.progressForMusic.progress = this.sliderForMusic.progress = G.musicData.musicVolume;
        this.progressForEffect.progress = this.sliderForEffect.progress = G.musicData.effectVolume;
        if(!localData){
            // console.log('未发现本地文件！');
            this.progressForMusic.progress = this.sliderForMusic.progress = G.musicData.musicVolume;
            this.progressForEffect.progress = this.sliderForEffect.progress = G.musicData.effectVolume;
        }
        else
        {
            cc.log('发现本地文件！');
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
                this.sliderForMusic.enabled = true;  /// enabled =false 原来
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
                this.sliderForEffect.enabled = true; /// enabled =false 原来
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
        // if(this.sliderForMusic.progress > 0){
        //     this.musicOn.active = true;
        //     this.musicOff.active = false;
        // }
        // else{
        //     this.musicOn.active = false;
        //     this.musicOff.active = true;
        // }
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
        this.sliderForMusic.enabled = true;  /// enabled =false 原来
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
        // if(this.sliderForEffect.progress > 0){
        //     this.effectOn.active = true;
        //     this.effectOff.active = false;
        // }
        // else{
        //     this.effectOn.active = false;
        //     this.effectOff.active = true;
        // }
        var key = 'musicData';

        this.setLocalData(key, G.musicData);
    },

    OnEffectOnClick: function () {
        // this.effectOn.active = false;
        // this.effectOff.active = true;
        this.sliderForEffect.enabled = true;  /// enabled =false 原来
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
    },

    //退出游戏
    OnExitGame: function () {
        //添加音效
        this.playClickMusic()
        cc.game.end();
    },

    //关闭
    OnClickClose: function () {
        //添加音效
        this.playClickMusic()
        this.node.destroy();
    },

    btnOnSwitchAccount () {
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os)) {
            this.wxlogout();
            cc.director.loadScene("Logon");
        }
    },

    refreshBtnView (flag) {
        this.btn_exitGame.active = flag;
        this.btn_switchAccount.active = flag;
    },
});
