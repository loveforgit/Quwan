
cc.Class({
    extends: cc.Component,

    properties: {
        spr_pai1: {
            default: null,
            type: cc.Sprite,
        },
        spr_pai2: {
            default: null,
            type: cc.Sprite,
        },
        spr_pai3: {
            default: null,
            type: cc.Sprite,
        },
        spr_pai4: {
            default: null,
            type: cc.Sprite,
        },
        //吃碰杠指示
        // node_arrowTop: {
        //     default: null,
        //     type: cc.Node,
        // },
        // node_arrowleft: {
        //     default: null,
        //     type: cc.Node,
        // },
        // node_arrowRight: {
        //     default: null,
        //     type: cc.Node,
        // },
        // node_arrowBottom: {
        //     default: null,
        //     type: cc.Node,
        // },
    },
    //更新吃牌指向位置
    refreshPositon(x,y){
        this.node_arrowTop.position = cc.p(x,y);
        this.node_arrowleft.position = cc.p(x,y);
        this.node_arrowRight.position = cc.p(x,y);
        this.node_arrowBottom.position = cc.p(x,y);
    },
    refreshView (localIndex, pengGangData,sideId,side) {
        cc.log(sideId,"------------位置-------------------")
        /*  --------------------------吃碰杠指示
        if (sideId == 0 ){
            //cc.log("xia=============================")
            this.node_arrowTop.active = false;
            this.node_arrowleft.active = false;
            this.node_arrowRight.active = false;
            this.node_arrowBottom.active = true
        }
        //if (pengGangData.fangxiang == "上" ){
        else if (sideId == 2 ){
            //cc.log("上=============================")
            this.node_arrowTop.active = true;
            this.node_arrowleft.active = false;
            this.node_arrowRight.active = false;
            this.node_arrowBottom.active = false;

        }
        //else if (pengGangData.fangxiang == "左"){
        else if (sideId == 3){
            //cc.log("zuo=============================")
            this.node_arrowTop.active = false;
            this.node_arrowleft.active = true;
            this.node_arrowRight.active = false;
            this.node_arrowBottom.active = false;
        }
        //else if (pengGangData.fangxiang == "右"){
        else if (sideId == 1){
            //cc.log("you=============================")
            this.node_arrowTop.active = false;
            this.node_arrowleft.active = false;
            this.node_arrowRight.active = true;
            this.node_arrowBottom.active = false;
        }
        */
        var paiArr = pengGangData.listpenggangpai;
        var paiCount = paiArr.length;
        var pre = cc.globalMgr.mahjongmgr.getFoldPre(localIndex);
        if (paiCount == 3) {
            // if(G.mjGameInfo.roomInfo.isFoldCard == true && G.isRePlay != true){
            //     this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
            //     this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
            //     this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
            // }
            // else{
                this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[0]);
                this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[1]);
                this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[2]);
            //}
            this.spr_pai4.node.active = false;
            cc.log(paiArr[0],paiArr[1],"pps")
            /*              吃碰杠指示
            if(paiArr[0] != paiArr[1]){
                if(pengGangData.card == paiArr[0]){
                   if(side == "myself"){
                       this.refreshPositon(26,33)
                   }
                   else if(side == "right"){
                    this.refreshPositon(-5,23)
                   }
                   else if(side == "left"){
                    this.refreshPositon(9,-9)
                   }
                   else if(side == "up"){
                    this.refreshPositon(-27,90)
                   }
                }
                if(pengGangData.card == paiArr[2]){
                    if(side == "myself"){
                        this.refreshPositon(137,33)
                    }
                    else if(side == "right"){
                     this.refreshPositon(-5,85)
                    }
                    else if(side == "left"){
                     this.refreshPositon(9,-72)
                    }
                    else if(side == "up"){
                     this.refreshPositon(-136,90)
                    }
                }
            }
            */
            
            cc.log(this.spr_pai1.node.position,this.spr_pai2.node.position,this.spr_pai3.node.position,"weizhisdsdsdsds")
        } else if (paiCount == 4) {
            if (pengGangData.isangang) {
                var side = cc.globalMgr.mahjongmgr.getSide(localIndex);
                /*-----------------吃碰杠指示
                this.node_arrowTop.active = false;
                this.node_arrowleft.active = false;
                this.node_arrowRight.active = false;
                this.node_arrowBottom.active = false;
                */
                if (side === "myself") {
                //     this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                //     this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                //     this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                //     if(G.mjGameInfo.roomInfo.isFoldCard == true && G.isRePlay != true){     //暗萧
                //         this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
                //     }   
                //     else{
                //         this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[0]);
                //     }
                    if (paiArr[0] !== paiArr[1]) {
                        this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[0]);
                        this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[1]);
                        this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[2]);
                        this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[3]);
                    } else {
                        this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                        this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                        this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                        this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[3]);
                    }
                } else {
                    // this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                    // this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                    // this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);

                    // if(G.mjGameInfo.roomInfo.isFoldCard == true && G.isRePlay != true){     //暗萧
                    //     this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
                    // }   
                    // else{
                        // this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[3]);
                    //}
                    if (paiArr[0] !== paiArr[1]) {
                        this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[0]);
                        this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[1]);
                        this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[2]);
                        this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[3]);
                    } else {
                        this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                        this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                        this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                        // this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getEmptySpriteFrame(side);
                        this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[3]);
                    }
                }
            } else {
                // if(G.mjGameInfo.roomInfo.isFoldCard == true && G.isRePlay != true){
                //     this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
                //     this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
                //     this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
                //     this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteChuPaiFrameByMJID(pre);
                // }
                // else{
                    this.spr_pai1.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[0]);
                    this.spr_pai2.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[1]);
                    this.spr_pai3.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[2]);
                    this.spr_pai4.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID(pre,paiArr[3]);
                //}
            }
        }
    },
});
