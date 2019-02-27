cc.Class({
    extends: cc.Component,

    properties: {
        _folds:null,
    },

    onLoad () {
        this.spr_foldArrow = this.node.getChildByName("node_game").getChildByName("node_foldArrow").getChildByName("node_foldPos");
        this.action_foldArrow = this.spr_foldArrow.getChildByName("spr_foldArrow");

        var moveUp = cc.moveBy(0.6,cc.p(0,35));
        var moveDown = cc.moveBy(0.6,cc.p(0,-35));
        var rep = cc.repeatForever(cc.sequence(moveUp, moveDown));
        this.action_foldArrow.runAction(rep);

        this.initView();

        cc.globalMgr.EventManager.getInstance().regist("refreshMjColor", this, this.refreshFoldsColor);
    },
    
    initView () {
        this._folds = {};
        var game = this.node.getChildByName("node_game");
        var sides = ["myself","right","up","left"];
        var foldMjCounts = 72;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var folds = [];
            var foldRoot = sideRoot.getChildByName("folds");
            // if (sideName == "left") foldMjCounts = 24;
            for(var j = 0; j < foldMjCounts; ++j){
                var childName = "mj" + j;
                var n = foldRoot.getChildByName(childName);
                n.active = false;
                var sprite = n.getComponent(cc.Sprite); 
                sprite.spriteFrame = null;
                folds.push(sprite);            
            }
            this._folds[sideName] = folds; 
        }
        
        this.hideAllFolds();
    },
    
    hideAllFolds () {
        for(var k in this._folds){
            var f = this._folds[k];
            for(var i in f){
                f[i].node.active = false;
                f[i].node.mjId = -1;
            }
        }

        this.spr_foldArrow.active = false;
    },
    
    initFolds (seatData) {
        var folds = seatData.folds;
        if(folds == null){
            return;
        }
        cc.log(seatData,"出牌都得小箭头")
        var localIndex = seatData.seatindex;
        var pre = cc.globalMgr.mahjongmgr.getFoldPre(localIndex);
        var side = cc.globalMgr.mahjongmgr.getSide(localIndex);
        if(this._folds!= undefined){
            var foldsSprites = this._folds[side];
            for(var i = 0; i < folds.length; ++i) {
                var sprite = foldsSprites[i];
                sprite.node.active = true;
                sprite.node.mjId = folds[i];
                cc.log(G.mjGameInfo.roomInfo,"sdsdaads暗萧")
                if(G.mjGameInfo.roomInfo.isFoldCard == true && G.isRePlay != true){
                    this.setSpriteChuPaiFrameByMJID(pre,sprite,folds[i]);
                }
                else{
                    this.setSpriteFrameByMJID(pre,sprite,folds[i]);
                }
            }
            for(var i = folds.length; i < foldsSprites.length; ++i) {
                var sprite = foldsSprites[i];
                sprite.spriteFrame = null;
                sprite.node.active = false;
            }  
            this.spr_foldArrow.active = false;
            var lastIndex = 0;
            lastIndex = folds.length - 1;
            var sprite = foldsSprites[lastIndex];
            if (sprite !== undefined) {
                cc.log(sprite,"xiaojiantou")
                var pos = sprite.node.parent.convertToWorldSpace(sprite.node.position);
                this.spr_foldArrow.active = true;
                if(side == "left") {
                    this.spr_foldArrow.position = cc.p(pos.x + 20, pos.y);
                    //this.spr_foldArrow.position = cc.p(pos.x , pos.y);
                } else if (side == "right") {
                    this.spr_foldArrow.position = cc.p(pos.x - 20, pos.y);
                    //this.spr_foldArrow.position = cc.p(pos.x , pos.y);
                } else if (side == "up") {
                    this.spr_foldArrow.position = cc.p(pos.x, pos.y );
                } else if (side == "myself") {
                    this.spr_foldArrow.position = cc.p(pos.x, pos.y );
                }
            }
        }
    },
    //暗萧是走这里
    setSpriteChuPaiFrameByMJID (pre,sprite,mjid) {
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre,mjid);
        sprite.node.active = true;
    },

    setSpriteFrameByMJID (pre,sprite,mjid) {
        if (mjid === -1) return;
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,mjid);
        sprite.node.active = true;
    },

    refreshFoldsColor (msgBody, target) {
        var sides = ["myself","right","up","left"];
        for (var i = 0; i < sides.length; i++) {
            var side = sides[i];
            var foldsSprites = target._folds[side];
            var pre = cc.globalMgr.mahjongmgr.getFoldPre(i);
            for (var j = 0; j < foldsSprites.length; ++j) {
                var index = j;
                if (side == "right" || side == "up") {
                    index = foldsSprites.length - j - 1;
                }
                var sprite = foldsSprites[index];
                target.setSpriteFrameByMJID(pre,sprite,sprite.node.mjId);
            }
        }
    },

    onDestroy: function () {
        cc.globalMgr.EventManager.getInstance().unregist(this);
    },
});
