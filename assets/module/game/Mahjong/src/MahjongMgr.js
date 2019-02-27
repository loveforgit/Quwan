var mahjongSprites = [];

window.G.mjGameInfo = {
    roomInfo: {
        roomId: 111111,
        jushu: 1,
        renshu: 1,
        fangfei: 1,
        iscanchi: false,
        hutype: 1,   //1 自摸  2 点炮
        iserwuba: false,
        isfangzuobi: false,
        isgenzhuang: false,
        baseScore: 500,
        fengding: 1,
        wanFaTips: "",   //服务器没有给，自己拼
        isjinbi: false,  // 是否是金币场
        iscanminglou: false,  // 是否明楼
        fzwxid: 1111111,  // 房主微信ID
        isCanGangDing: false,  // 是否掀扛腚
        multiple: 0,    //游金
        gameRule: -1,    //宁海游戏玩法
        timeOut: -1,   //出牌时间
        wealth: -1,     //有财放炮
        contract:-1,    //三滩承包
        gameType:24,     //游戏类型
        isFoldCard:false,       //暗萧明潇
        isBaoTing:false,

        buyHorse: 2,         //掀梦2  4  8
        isdaifeng: false,       //是否带风
        isJiaBei: false,     //是否梦加倍
        isAll: false,        //点炮是否全包
    },
};

cc.Class({
    extends: cc.Component,

    properties: {
        leftAtlas_green:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        rightAtlas_green:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomAtlas_green:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomFoldAtlas_green:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        emptyAtlas_green:{
            default:null,
            type:cc.SpriteAtlas
        },

        leftAtlas_blue:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        rightAtlas_blue:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomAtlas_blue:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomFoldAtlas_blue:{
            default:null,
            type:cc.SpriteAtlas
        },
        // //回放上面的麻将
        // topFoldAtlas_blue:{
        //     default:null,
        //     type:cc.SpriteAtlas
        // },
        // //结束后显示自己的牌
        // bottonMyMj_show:{
        //     default:null,
        //     type:cc.SpriteAtlas
        // },
        emptyAtlas_blue:{
            default:null,
            type:cc.SpriteAtlas
        },

        leftAtlas_yellow:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        rightAtlas_yellow:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomAtlas_yellow:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        bottomFoldAtlas_yellow:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        emptyAtlas_yellow:{
            default:null,
            type:cc.SpriteAtlas
        },
        
      
        _sides:null,
        _pres:null,
        _foldPres:null,
    },
    
    onLoad (){
        this._sides = ["myself","right","up","left"];
        this._pres = ["M_","R_","B_","L_"];
        this._foldPres = ["B_","R_","B_","L_"];

        cc.globalMgr.mahjongmgr = this;
        mahjongSprites.push("null"); 
        //筒(1-9)
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("dot_" + i);        
        }
        mahjongSprites.push("null"); 
        
        //条(11-19)
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("bamboo_" + i);
        }
        mahjongSprites.push("null"); 
        
        //万(21-29)
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("character_" + i);
        }
        mahjongSprites.push("null"); 
        
        
        //东南西北风(31,33,35,37)
        mahjongSprites.push("wind_east");
        mahjongSprites.push("null"); 
        mahjongSprites.push("wind_south");
        mahjongSprites.push("null"); 
        mahjongSprites.push("wind_west");
        mahjongSprites.push("null"); 
        mahjongSprites.push("wind_north");
        mahjongSprites.push("null"); 
        mahjongSprites.push("null"); 
        mahjongSprites.push("null"); 

        //中、发、白(41,43,45)
        mahjongSprites.push("red");
        mahjongSprites.push("null"); 
        mahjongSprites.push("green");
        mahjongSprites.push("null"); 
        mahjongSprites.push("white");

        // for (var i = 46; i <= 60; i++) {
        //     mahjongSprites.push("null");
        // }

        // //梅兰菊竹(61,63,65,67)
        // mahjongSprites.push("plum");
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("orchid");
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("chry");
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("bamboo");
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("null"); 

        // //春夏秋冬(71,73,75,77)
        // mahjongSprites.push("spring");
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("summer");
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("autumn");
        // mahjongSprites.push("null"); 
        // mahjongSprites.push("winter");
        // mahjongSprites.push("null");
       
       
        this.setAltas("green");
    },

    // setAltas (color) {
    //     // if (color === "green") {
    //     //     this.bottomAtlas = this.bottomAtlas_green;
    //     //     this.bottomFoldAtlas = this.bottomFoldAtlas_green;
    //     //     this.leftAtlas = this.leftAtlas_green;
    //     //     this.rightAtlas = this.rightAtlas_green;
    //     //     this.emptyAtlas = this.emptyAtlas_green;
    //     // } else if (color === "blue") {
    //         this.bottomAtlas = this.bottomAtlas_blue;
    //         this.bottomFoldAtlas = this.bottomFoldAtlas_blue;
    //         this.leftAtlas = this.leftAtlas_blue;
    //         this.rightAtlas = this.rightAtlas_blue;
    //         this.emptyAtlas = this.emptyAtlas_blue;
    //         //回放上面的麻将
    //         this.topFoldAtlas=this.topFoldAtlas_blue;
    //         this.bottonMyMj = this.bottonMyMj_show;
    //     // }
    //     // var obj = {};
    //     // cc.globalMgr.EventManager.getInstance().fireEvent("refreshMjColor", obj);
    // },

    setAltas (color) {
        if (color === "green") {
            this.bottomAtlas = this.bottomAtlas_green;
            this.bottomFoldAtlas = this.bottomFoldAtlas_green;
            this.leftAtlas = this.leftAtlas_green;
            this.rightAtlas = this.rightAtlas_green;
            this.emptyAtlas = this.emptyAtlas_green;
        } else if (color === "blue") {
            this.bottomAtlas = this.bottomAtlas_blue;
            this.bottomFoldAtlas = this.bottomFoldAtlas_blue;
            this.leftAtlas = this.leftAtlas_blue;
            this.rightAtlas = this.rightAtlas_blue;
            this.emptyAtlas = this.emptyAtlas_blue;
        } else if (color === "yellow") {
            this.bottomAtlas = this.bottomAtlas_yellow;
            this.bottomFoldAtlas = this.bottomFoldAtlas_yellow;
            this.leftAtlas = this.leftAtlas_yellow;
            this.rightAtlas = this.rightAtlas_yellow;
            this.emptyAtlas = this.emptyAtlas_yellow;
        }
        var obj = {};
        cc.globalMgr.EventManager.getInstance().fireEvent("refreshMjColor", obj);
    },
    
    getMahjongSpriteByID (id){
        return mahjongSprites[id];
    },
    
    getMahjongType (id){
        if(id >= 1 && id <= 9){
            return 1;
        }
        else if(id >= 11 && id <= 19){
            return 2;
        }
        else if(id >= 21 && id <= 29){
            return 3;
        }
        else {
            return 4;
        }
    },
    //出牌显示暗萧还是明潇
    getSpriteChuPaiFrameByMJID (pre,mjid){
        cc.log("走的暗奥")
        //var spriteFrameName = this.getMahjongSpriteByID(mjid);
        cc.log(pre,"=============================")
        //spriteFrameName = pre + spriteFrameName;
        if(pre == "B_"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_bottom");
        }
        else if(pre == "R_"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_bottom");
        }
        else if(pre == "L_" ){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_bottom");
        }
        else if(pre == "D_" || pre == "S_"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_left");
        }
    },
    getSpriteFrameByMJID (pre,mjid){
        var spriteFrameName = this.getMahjongSpriteByID(mjid);
        
        if (pre === "D_") pre = "B_";

        spriteFrameName = pre + spriteFrameName;
        if(pre == "M_"){
            return this.bottomAtlas.getSpriteFrame(spriteFrameName);
        }
        else if(pre == "B_"){
            return this.bottomFoldAtlas.getSpriteFrame(spriteFrameName);
        }
        else if(pre == "L_"){
            return this.leftAtlas.getSpriteFrame(spriteFrameName);
        }
        else if(pre == "R_"){
            return this.rightAtlas.getSpriteFrame(spriteFrameName);
        }
        // else if(pre == "D_"){
        //     return this.topFoldAtlas.getSpriteFrame(spriteFrameName);
        // }
        // else if(pre == "S_"){
        //     return  this.bottonMyMj.getSpriteFrame(spriteFrameName);
        // }
       
    },
    //任意牌
    getSpriteAnyByMJID(){
        return this.emptyAtlas.getSpriteFrame("e_mj_renyi");
    },
    playAudioURLByMJID (sex, id){
        // var realId = 0;
        // if (id >= 1 && id <= 9) {   //筒(1-9)
        //     realId = id ;
        // }
        // else if (id >= 11 && id <= 19) {  //条(11-19)
        //     realId = id ;
        // }
        // else if (id >= 21 && id <= 29) {   //万(21-29)
        //     realId = id ;
        // } else if (id >= 31 && id <= 45) {  //东南西北风(31,33,35,37)  中、发、白(41,43,45)
        //     realId = id;
        // }
       
        cc.log(id,"打出的牌值是什么")
        var audioUrl = "";
        if (sex == 1 || sex === "男") {
            // if(  G.islanguage == true){
            //    audioUrl = "mahjong/nan/" + id + ".mp3";
            // }
            // else if(G.islanguage == false){
            //     audioUrl = "mahjong/nan2/nan_" + id + ".mp3";
            // }
            audioUrl = "mahjong/nan/" + id + ".mp3";
        } else  {
            // if( G.islanguage == true){
            //     audioUrl = "mahjong/nv/" + id + ".mp3";
            // }
            // else if(G.islanguage == false){
            //     audioUrl = "mahjong/nv2/" + id + ".mp3";
            // }
            audioUrl = "mahjong/nv/" + id + ".mp3";
        }
        //var audioDaPaiUrl = "mahjong/audio/OUT_CARD.mp3";
        cc.globalMgr.audioMgr.playSFX(audioUrl);
        //cc.globalMgr.audioMgr.playSFX(audioDaPaiUrl);
    },
    //播放点击牌音效
    playAudioURL(){
        var audioUrl = "mahjong/audio/TOUCH_CARD.mp3";
        cc.globalMgr.audioMgr.playSFX(audioUrl);
    },
  
    // playAudioOpt("nan","peng");
    playAudioOpt (sex, opt) {
        cc.log(opt,"播放吃碰杠")
        if(sex == 1 || sex === "男"){
            // if( G.islanguage == true){  //普通话
            //     var audioUrl = "mahjong/nan/" + opt + ".mp3";
            // }
            // else if(G.islanguage == false){
            //     var audioUrl = "mahjong/nan2/nan_" + opt + ".mp3";
            // }
            var audioUrl = "mahjong/nan/" + opt + ".mp3";
        }
        else {
            // if( G.islanguage == true){
            //     var audioUrl = "mahjong/nv/" + opt + ".mp3";
            // }
            // else if(G.islanguage == false){
            //     var audioUrl = "mahjong/nv2/"+  opt +".mp3";
            // }
            var audioUrl = "mahjong/nv/" + opt + ".mp3";
        }
        cc.globalMgr.audioMgr.playSFX(audioUrl);
    },
    
    getEmptySpriteFrame (side){
        if(side == "up"){
            //return this.emptyAtlas.getSpriteFrame("e_mj_b_up");
           return this.emptyAtlas.getSpriteFrame("e_mj_b_bottom");
            //return this.emptyAtlas.getSpriteFrame("e_mj_up");
        }   
        else if(side == "myself"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_bottom");
        }
        else if(side == "left"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_left");
        }
        else if(side == "right"){
            return this.emptyAtlas.getSpriteFrame("e_mj_b_right");
        }
    },
    
    getHoldsEmptySpriteFrame (side){
        if(side == "up"){
            return this.emptyAtlas.getSpriteFrame("e_mj_up");
        }   
        else if(side == "myself"){
            return null;
        }
        else if(side == "left"){
            return this.emptyAtlas.getSpriteFrame("e_mj_left");
        }
        else if(side == "right"){
            return this.emptyAtlas.getSpriteFrame("e_mj_right");
        }
    },
    
    sortMJ (mahjongs,dingque){
        var self = this;
        mahjongs.sort(function(a,b){
            if(dingque >= 0){
                var t1 = self.getMahjongType(a);
                var t2 = self.getMahjongType(b);
                if(t1 != t2){
                    if(dingque == t1){
                        return 1;
                    }
                    else if(dingque == t2){
                        return -1;
                    }
                }
            }
            return a - b;
        });
    },
    
    getSide (localIndex){
        return this._sides[localIndex];
    },
    
    getPre (localIndex){
        return this._pres[localIndex];
    },
    
    getFoldPre (localIndex){
        return this._foldPres[localIndex];
    },

    spliteArr (paiArr) {
        var paiSpliteArr = [];
        var paiIdArr = [];
        var pai = paiArr[0];
        paiIdArr.push(pai);
        paiSpliteArr.push(paiIdArr);
        var count = 1;
        for (var i = 1; i < paiArr.length; i++) {
            if (paiArr[i] === pai) {
                paiIdArr.push(paiArr[i]);
                count += 1;
            } else {
                if (count < 3) {
                    paiIdArr.push(paiArr[i]);
                    count += 1;
                    if (count === 3) {
                        pai = -1;
                    }
                } else {
                    paiIdArr = [];
                    pai = paiArr[i];
                    paiIdArr.push(pai);
                    paiSpliteArr.push(paiIdArr);
                    count = 1;
                }
            }
        }
        return paiSpliteArr;
    },

    playChatTextAudioById (sex, id){
        var audioUrl = "";
        if (sex ==1 ||sex == "男") {
            audioUrl = "mahjong/chat/man_chat" + id + ".mp3";
        } else if (sex ==2 || sex == "女") {
            audioUrl = "mahjong/chat/woman_chat" + id + ".mp3";
        }
        cc.log(audioUrl,"==========f===========>yinxiao")
        
        cc.globalMgr.audioMgr.playSFX(audioUrl);
    },

    onDestroy: function () {
        cc.globalMgr.EventManager.getInstance().unregist(this);
    },
});

