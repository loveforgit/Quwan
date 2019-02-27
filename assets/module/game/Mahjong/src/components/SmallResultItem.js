
cc.Class({
    extends:cc.Component,

    properties: {
        rtext_name: {
            default: null,
            type: cc.RichText,
        },
        rtext_paiXing: {
            default: null,
            type: cc.Label,
        },
        rtext_fanShu: {
            default: null,
            type: cc.RichText,
        },
       //赢
        label_fenShuWin: {
            default: null,
            type: cc.Label,
        },
        //输
        label_fenShuShu: {
            default: null,
            type: cc.Label,
        },
        node_head: {
            default: null,
            type: cc.Node,
        },
        node_pai: {
            default: null,
            type: cc.Node,
        },
        spr_head: {
            default: null,
            type: cc.Sprite,
        },
        spr_hu: {
            default: null,
            type: cc.Sprite,
        },
        spr_zimo:{
            default: null,
            type: cc.Sprite,
        },
        spr_fangPao:{
            default: null,
            type: cc.Sprite,
        },
        node_feng: {
            default: null,
            type: cc.Node,
        },
        spr_redBg: {
            default: null,
            type: cc.Sprite,
        },
    },

    onLoad () {
        this._paiWidth = 55-16;
    },

    refreshResult (result) {
        cc.log("jeisuan==========",result)
        this.node_pai.removeAllChildren(true);
        // this.rtext_name.string = result.f_nick;
        // this.rtext_paiXing.string =result.fanName;
        if(result.location == 0){
            this.node_feng.getChildByName("dong").getComponent(cc.Sprite).node.active = true
            this.node_feng.getChildByName("nan").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("xi").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("bei").getComponent(cc.Sprite).node.active = false
        }
        else if(result.location == 1){
            this.node_feng.getChildByName("dong").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("nan").getComponent(cc.Sprite).node.active = true
            this.node_feng.getChildByName("xi").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("bei").getComponent(cc.Sprite).node.active = false
        }
        else if(result.location == 2){
            this.node_feng.getChildByName("dong").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("nan").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("xi").getComponent(cc.Sprite).node.active = true
            this.node_feng.getChildByName("bei").getComponent(cc.Sprite).node.active = false
        }
        else if(result.location == 3){
            this.node_feng.getChildByName("dong").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("nan").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("xi").getComponent(cc.Sprite).node.active = false
            this.node_feng.getChildByName("bei").getComponent(cc.Sprite).node.active = true
        }
        if(result.iszhuang == 0){
            this.node_feng.getChildByName("zhuang").getComponent(cc.Sprite).node.active = false
        }
        else if(result.iszhuang == 1){
            this.node_feng.getChildByName("zhuang").getComponent(cc.Sprite).node.active = true
        }
       // 1自摸   2点炮 
    //    if(result.hutype == 1 || result.hutype == 2){
    //        this.spr_redBg.node.active = true
    //    }
      
       if (result.hutype ==1){
            this.spr_hu.node.active = false;
            this.spr_zimo.node.active = true;
       }
       else if (result.hutype == 2){
            this.spr_zimo.node.active = false;
            this.spr_hu.node.active = true;
       }
       else{
            this.spr_zimo.node.active = false;
            this.spr_hu.node.active = false;
            //this.spr_redBg.node.active = false;
       }
       if(result.isDianPao == true){
            this.spr_fangPao.node.active = true
       }
       else{
        this.spr_fangPao.node.active = false
       }
        // if (result.fanName === null) {
        //     this.rtext_paiXing.node.active = false;
        // } else {
        //     this.rtext_paiXing.node.active = true;
        //     this.rtext_paiXing.string = result.fanName;
        // }
        this.rtext_fanShu.string = result.fanshu + "番";
        cc.log(result.zongfen,"------------------------")
        if (result.zongfen > 0) {
            cc.log(result.zongfen.toString().length)
            this.label_fenShuShu.node.active = false;
            this.label_fenShuWin.node.active = true;
            this.label_fenShuWin.string = result.zongfen;
        } else if (result.zongfen <= 0) {
            this.label_fenShuShu.node.active = true;
            this.label_fenShuWin.node.active = false;
            this.label_fenShuShu.string = result.zongfen;
        }
        var images  = '';
        if(G.mjGameInfo.roomInfo.isjinbi){
            if(result.sex == 1 || result.sex == "男" ){
                images = G.nanImage;
            }
            else{
                images = G.nvImage;
            }
        }
        else{
            images = result.headimgurl
        }
        if(images !== null && images !== "") {
            cc.globalMgr.globalFunc.getUrlHead(this.spr_head, images, 70);
        }
       
        this.showPaiArr(result);
    },

    showPaiArr (result) {
        var posX = 0;
        if (result.listpenggang.length > 0) {
            var paiSpliteArr = cc.globalMgr.mahjongmgr.spliteArr(result.listpenggang);
            for (var i = 0; i < paiSpliteArr.length; i++) {
                var paiIdArr = paiSpliteArr[i];
                for (var j = 0; j < paiIdArr.length; j++) {
                    this.createMjSpr(paiIdArr[j], cc.p(posX,0));
                    posX += this._paiWidth;
                }
                posX += 20;
            }
        }
        if (result.listshoupai.length > 0) {
            for (var i = 0; i < result.listshoupai.length; i++) {
                var mjId = result.listshoupai[i];
                this.createMjSpr(mjId, cc.p(posX,0));
                posX += this._paiWidth;
            }
            posX += 20;
        }
        // if(result.huaList.length > 0){
        //     for (var i = 0; i < result.huaList.length; i++) {
        //         var mjId = result.huaList[i];
        //         this.createMjSpr(mjId, cc.p(posX,0));
        //         posX += this._paiWidth;
        //     }
        //     posX += 20; 
        // }
        
    },
   
    createMjSpr (mjId, pos) {
        var node = new cc.Node('Sprite');
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_",mjId);
        cc.log("=========B_",mjId)
        node.parent = this.node_pai;
        node.scale= 0.7;
        node.position = pos;
    },

    addJinTips (node) {
        var nodeJinTip = cc.instantiate(this.parent.parent.node_jinTip);
        nodeJinTip.scale = 0.05;
        nodeJinTip.position = cc.p(-19,31);
        nodeJinTip.parent = node;
        nodeJinTip.tag = 100;
    },
});
