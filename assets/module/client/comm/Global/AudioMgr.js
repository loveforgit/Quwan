cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume:1.0,
        sfxVolume:1.0,
        
        bgmAudioID:-1,
    },

    onLoad () {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null){
            this.bgmVolume = parseFloat(t);    
        }
        
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null){
            this.sfxVolume = parseFloat(t);    
        }
    },
    
    getUrl (url) {
        return cc.url.raw("resources/sounds/" + url);
    },
    
    playBGM (url) {
        var audioUrl = this.getUrl(url);
        console.log(audioUrl);
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
    },
    
    playSFX (url) {
        var audioUrl = this.getUrl(url);
        // if(this.sfxVolume > 0){
        //     var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
        // }

        var musicData = JSON.parse(cc.sys.localStorage.getItem("musicData"));
        var musicVolume = 0;
        if (musicData) {
            if (musicData.effectIsOn) {
                musicVolume = musicData.effectVolume
            }
            else {
                musicVolume = 0
            }
        }
        else {
            musicVolume = 0.5;
            G.musicData.effectVolume = musicVolume;
        }
        // cc.log(effectClip , loop, musicVolume)
        var musicID = -1
        if (musicVolume != 0) {
            musicID = cc.audioEngine.play(audioUrl, false, musicVolume);
        }
        return musicID;
    },
    
    setSFXVolume (v) {
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    },
    
    setBGMVolume (v,force) {
        if(this.bgmAudioID >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != v || force){
            cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    },
    
    pauseAll () {
        cc.audioEngine.pauseAll();
    },
    
    resumeAll () {
        cc.audioEngine.resumeAll();
    }
});
