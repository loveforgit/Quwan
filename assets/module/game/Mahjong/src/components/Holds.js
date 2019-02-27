cc.Class({
    extends: cc.Component,

    properties: {
        _holds: null,
        _rePlayHolds: null,
        _leftMJArr: [],
        _rightMJArr: [],
        _upMJArr: []
    },

    onLoad() {
        this.initView();
        cc.log("hold,---------------------<<")
        cc.globalMgr.EventManager.getInstance().regist("refreshMjColor", this, this.refreshHoldsColor);
    },

    initView() {
        this._rePlayHolds = {};
        this._holds = {};
        var game = this.node.getChildByName("node_game");
        var sides = ["myself", "right", "up", "left"];
        //回放
        //if (G.isRePlay == true) {
            for (var i = 0; i < sides.length; ++i) {
                var sideName = sides[i];
                var sideRoot = game.getChildByName(sideName);
                var rePlayHolds = [];
                if (sideName == "myself") {
                    var holdRoot = sideRoot.getChildByName("rePlayHolds");
                    // var holdRoot = sideRoot.getChildByName("holds");
                    for (var j = 0; j < holdRoot.children.length; ++j) {
                        var n = holdRoot.children[j];
                        // n.active = false;
                        var sprite = n.getComponent(cc.Sprite);
                        // sprite.spriteFrame = null;
                        rePlayHolds.push(sprite);
                    }
                     this._rePlayHolds[sideName] = rePlayHolds;
                }
                if (sideName != "myself") {
                    var holdRoot = sideRoot.getChildByName("rePlayHolds");
                    if(sideName == "up"){
                        for(var j = 0 ;j < 14 ; j++)
                        {
                            rePlayHolds.push(holdRoot.getChildByName("e_mj_up_" + j).getComponent(cc.Sprite))
                        }
                    }
                    else if(sideName == "left"){
                        for(var j = 0 ;j < 14 ; j++)
                        {
                            rePlayHolds.push(holdRoot.getChildByName("e_mj_left_" + j).getComponent(cc.Sprite))
                        }
                    }
                    else if(sideName == "right"){
                        for(var j = 0 ;j < 14 ; j++)
                        {
                            rePlayHolds.push(holdRoot.getChildByName("e_mj_right_" + j).getComponent(cc.Sprite))
                        }
                    }
                    this._rePlayHolds[sideName] = rePlayHolds;
                }
            }
        //}
        //正常打牌走这里
            for (var i = 0; i < sides.length; ++i) {
                var sideName = sides[i];
                cc.log(sideName, "-------------------==================>>>")
                // if (sideName != "myself") {
                    var sideRoot = game.getChildByName(sideName);
                    var holds = [];
                    var holdRoot = sideRoot.getChildByName("holds");
                    for (var j = 0; j < holdRoot.children.length; ++j) {
                        var n = holdRoot.children[j];
                        // n.active = false;
                        var sprite = n.getComponent(cc.Sprite);
                        // sprite.spriteFrame = null;
                        holds.push(sprite);
                    }
                    this._holds[sideName] = holds;
                // }
            }
            this.refreshAllRePlayHolds(false);
            this.refreshAllHolds(false);
    },
    //回放隐藏所有牌
    refreshAllRePlayHolds(flag) {
        for (var k in this._rePlayHolds) {
            var f = this._rePlayHolds[k];
            for (var i in f) {
                f[i].node.active = flag;
                cc.log("隐藏牌====")
            }
        }
    },
    refreshAllHolds(flag) {
        for (var k in this._holds) {
            var f = this._holds[k];
            for (var i in f) {
                f[i].node.active = flag;
            }
        }
    },
 
    //回放
    refreshRePlayTopHolds(body,seatIndex) {
        if (G.isRePlay == true) {
            var side = cc.globalMgr.mahjongmgr.getSide(seatIndex);
            cc.log(side,"zuoweihao=======================>.")
            var holds = this._rePlayHolds[side];
            var holdCount = body.listpai.length;
            var mjArrCount = holds.length;
            var dissCount = 1;
            cc.log(body,"body---------------------------->")
            if (body.pai != undefined) {
                var sprite = holds[0];
                cc.log(sprite.node.position,"weizhi")
                sprite.node.active = true;
                var mjid = body.pai;
                sprite.node.mjId = mjid;
                sprite.node.y = 0;
                if(side == "up"){
                    this.setSpriteFrameByMJID("D_", sprite, mjid);
                }
                else if(side == "right"){
                    this.setSpriteFrameByMJID("R_", sprite, mjid);
                }
                else if(side == "left"){
                    sprite.node.position = cc.p(0,-344)
                    this.setSpriteFrameByMJID("L_", sprite, mjid);
                }
               
            }
            else{
                var sprite = holds[0];
                sprite.node.active = false;
            }
            cc.log(mjArrCount, "shulaing-------------->>")
            for (var i = holdCount+1  ; i < mjArrCount; ++i) {
                cc.log(holds, "yinchang444444444444444444444444")
                var sprite = holds[i];
                sprite.node.mjId = null;
                sprite.spriteFrame = null;
                sprite.node.active = false;
            }
            if ( body.listpai.length>=14 ){
                dissCount = 0
            }
            cc.log("dissCount",dissCount)
            var index = 0;
            if(body.listpai.length >13){
                body.listpai.length = 13
            }
            for (var i = 1; i < body.listpai.length+1; i++) {
                // holds[i].node.active = flag;
                cc.log(i,"i-------------------->>")
                var mjid = body.listpai[index];
                var sprite = holds[i];
                //var sprite = holds[i];
                sprite.node.mjId = mjid;
                //this._myMJShowArr.push(sprite);
                if(side == "up"){
                    this.setSpriteFrameByMJID("D_", sprite, mjid);
                    // sprite.node.y = 0;
                    cc.log(sprite.node.getPosition(),"wup======================")
                }
                else if(side == "right"){
                    cc.log(mjid,"=================righjt")
                    this.setSpriteFrameByMJID("R_", sprite, mjid);
                }
                else if(side == "left"){
                    cc.log(mjid,"=================left")
                    cc.log(sprite.node.position,"weizhi")
                    this.setSpriteFrameByMJID("L_", sprite, mjid);
                }
                index++;
                
            }
        }
    },

     //天听
    setSpriteTianTingByMJID(pre, sprite) {
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
        sprite.node.active = true;
    },
   
    setSpriteFrameByMJID(pre, sprite, mjid) {
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
    },
    //隐藏明牌人的手牌
    refreshMingPaiPlayer(side){
        var holds = this._holds[side];
        for (var i in holds) {
            holds[i].node.active = false;
        }
    },
    refreshTopHolds(flag) {
        var holds = this._holds["up"];
        for (var i in holds) {
            holds[i].node.active = flag;
        }
    },
    //显示明牌玩家的手牌
    showMingPai(cardlist,index,type){
        var side = cc.globalMgr.mahjongmgr.getSide(index);
        var holds = this._rePlayHolds[side];
        var mjArrCount = holds.length;
        var myCardNum  = 0;
        for (var i = cardlist.length+1 ; i < mjArrCount; ++i) {
            if(side == "myself"){
                cc.log(myCardNum,"myosdodos==============")
                var sprite = holds[myCardNum++];
                sprite.node.mjId = null;
                sprite.spriteFrame = null;
                sprite.node.active = false;
            }
            else{
                var sprite = holds[i];
                sprite.node.mjId = null;
                sprite.spriteFrame = null;
                sprite.node.active = false;
            }
        }
        var index = 0;
        cc.log(side,type,"-----------side-------------")
        for(i = 0;i< cardlist.length;i++){
            var mjid = cardlist[index];
            var sprite = holds[i];
            sprite.node.mjId = mjid;
            // if(side == "myself"){
            //     cc.log(sprite.node.getPosition(),"ddddddddddddddddddddd")
            //     this.setSpriteFrameByMJID("B_", sprite, mjid);
            // }
             if(side == "up"){
                 if(type == 2){
                    this.setSpriteFrameByMJID("D_", sprite, mjid);
                 }
                 else if(type == 3){
                    this.setSpriteTianTingByMJID("B_",sprite);
                 }
                sprite.node.y = 0;
                cc.log(sprite.node.getPosition(),"wup======================")
            }
            else if(side == "right"){
                cc.log(mjid,"=================righjt")
                if(type == 2){
                    this.setSpriteFrameByMJID("R_", sprite, mjid);
                }
                else if(type == 3){
                    this.setSpriteTianTingByMJID("D_",sprite);
                }
            }
            else if(side == "left"){
                cc.log(mjid,"=================left")
                cc.log(sprite.node.position,"weizhi")
                if(type == 2){
                    this.setSpriteFrameByMJID("L_", sprite, mjid);
                }
                else if(type == 3){
                    this.setSpriteTianTingByMJID("D_",sprite);
                }
            }
            index++;
        }
    },
    //牌局结束显示其他玩家手牌
    showthreeholds(cardlist,index){
        this.refreshAllHolds(false);
        cc.log(cardlist,index,"index=========")
        var side = cc.globalMgr.mahjongmgr.getSide(index);
        var holds = this._rePlayHolds[side];
        var mjArrCount = holds.length;
        cc.log(cardlist,index,"index=======sss==")
        var myCardNum  = 0;
        for (var i = cardlist.cards.length+1 ; i < mjArrCount; ++i) {
            if(side == "myself"){
                cc.log(myCardNum,"myosdodos==============")
                var sprite = holds[myCardNum++];
                sprite.node.mjId = null;
                sprite.spriteFrame = null;
                sprite.node.active = false;
            }
            else{
                var sprite = holds[i];
                sprite.node.mjId = null;
                sprite.spriteFrame = null;
                sprite.node.active = false;
            }
        }
        var index = 0;
        cc.log(side,"-----------side-------------")
        for(i = 0;i< cardlist.cards.length;i++){
            var mjid = cardlist.cards[index];
            var sprite = holds[i];
            sprite.node.mjId = mjid;
            // if(side == "myself"){
            //     cc.log(sprite.node.getPosition(),"ddddddddddddddddddddd")
            //     this.setSpriteFrameByMJID("B_", sprite, mjid);
            // }
             if(side == "up"){
                this.setSpriteFrameByMJID("D_", sprite, mjid);
                sprite.node.y = 0;
            }
            else if(side == "right"){
                this.setSpriteFrameByMJID("R_", sprite, mjid);
            }
            else if(side == "left"){
                this.setSpriteFrameByMJID("L_", sprite, mjid);
            }
            index++;
        }
    },
    refreshThreeHolds(flag) {
        if (G.isRePlay == true) {
            // for (var k in this._rePlayHolds) {
            //     if (k != "myself" && k != "left") {
            //         var f = this._rePlayHolds[k];
            //         for (var i in f) {
            //             f[i].node.active = flag;
            //         }
            //     }
            // }
        }
        else {
            for (var k in this._holds) {
                if (k != "myself" && k != "up") {
                    var f = this._holds[k];
                    for (var i in f) {
                        f[i].node.active = flag;
                    }
                }
            }
        }
    },

    refreshOtherHolds(flag) {
        if (G.isRePlay == true) {
            for (var k in this._rePlayHolds) {
                if (k != "myself") {
                    var f = this._rePlayHolds[k];
                    for (var i in f) {
                        f[i].node.active = flag;
                    }
                }
            }
        }
        else {
            for (var k in this._holds) {
                if (k != "myself") {
                    var f = this._holds[k];
                    for (var i in f) {
                        f[i].node.active = flag;
                    }
                }
            }
        }
    },

    initHolds(seatIndex, mjCount, isShowMoPai) {
        var side = cc.globalMgr.mahjongmgr.getSide(seatIndex);
        if (G.isRePlay == true) {
            var holdsSprites = this._rePlayHolds[side];
        }
        else {
            var holdsSprites = this._holds[side];
        }
        cc.log(holdsSprites, "------------------>>>")
        if(holdsSprites!= undefined){
            for (var i = 0; i < holdsSprites.length; ++i) {
                var sprite = holdsSprites[i];
                if (side == "left") {
                    if (isShowMoPai) {
                        if (i < (14 - mjCount)) {
                            sprite.node.active = false;
                        } else {
                            sprite.node.active = true;
                        }
                    } else {
                        if (i < (13 - mjCount)) {
                            sprite.node.active = false;
                        } else if (i === 13) {
                            sprite.node.active = false;
                        } else {
                            sprite.node.active = true;
                        }
                    }
                } else {
    
                    if (isShowMoPai) {
                        cc.log("yincahgnpaixing===ss==============")
                        if (i < mjCount) {
                            sprite.node.active = true;
                        } else {
                            sprite.node.active = false;
                        }
                    } else {
                        cc.log("yincahgnpaixing=================")
                        if (i == 0) {
                            sprite.node.active = false;
                        } else if (i <= mjCount) {
                            sprite.node.active = true;
                        } else {
                            sprite.node.active = false;
                        }
                    }
                }
            }
        }
    },

    hideLastHolds(seatIndex, flag) {
        if (G.isRePlay == true) {
            var side = cc.globalMgr.mahjongmgr.getSide(seatIndex);
            var holdsSprites = this._rePlayHolds[side];
            var lastSprite = null;
            if (side == "left") {
                lastSprite = holdsSprites[holdsSprites.length - 1];
            } else {
                lastSprite = holdsSprites[0];
            }
            lastSprite.node.active = flag;
        }
        else {
            var side = cc.globalMgr.mahjongmgr.getSide(seatIndex);
            var holdsSprites = this._holds[side];
            var lastSprite = null;
            if (side == "left") {
                lastSprite = holdsSprites[holdsSprites.length - 1];
            } else {
                lastSprite = holdsSprites[0];
            }
            lastSprite.node.active = flag;
        }
    },

    refreshHoldsColor(msgBody, target) {
        if (G.isRePlay == true) {
            var sides = ["myself", "right", "up", "left"];
            for (var i = 0; i < sides.length; ++i) {
                var sideName = sides[i];
                var holds = target._rePlayHolds[sideName];
                for (var j = 0; j < holds.length; j++) {
                    var sprite = holds[j];
                    if (sideName === "myself") {
                        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_", sprite.node.mjId);
                    } else {
                        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getHoldsEmptySpriteFrame(sideName);
                    }
                }
            }
        }
        else {
            var sides = ["myself", "right", "up", "left"];
            for (var i = 0; i < sides.length; ++i) {
                var sideName = sides[i];
                var holds = target._holds[sideName];
                for (var j = 0; j < holds.length; j++) {
                    var sprite = holds[j];
                    if (sideName === "myself") {
                        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_", sprite.node.mjId);
                    } else {
                        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getHoldsEmptySpriteFrame(sideName);
                    }
                }
            }
        }
    },

    onDestroy: function () {
        cc.globalMgr.EventManager.getInstance().unregist(this);
    },
});
