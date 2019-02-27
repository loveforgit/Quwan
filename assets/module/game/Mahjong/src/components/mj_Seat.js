cc.Class({
    extends: cc.Component,

    properties: {
        rtext_name: {
            default: null,
            type: cc.RichText,
        },
        label_coin: {
            default: null,
            type: cc.Label,
        },
        spr_head: {
            default: null,
            type: cc.Sprite,
        },
        spr_Dong: {
            default: null,
            type: cc.Sprite,
        },
        spr_Nan: {
            default: null,
            type: cc.Sprite,
        },
        spr_Xi: {
            default: null,
            type: cc.Sprite,
        },
        spr_Bei: {
            default: null,
            type: cc.Sprite,
        },
        spr_tong: {
            default: null,
            type: cc.Sprite,
        },
        spr_tiao: {
            default: null,
            type: cc.Sprite,
        },
        spr_wan: {
            default: null,
            type: cc.Sprite,
        },
    },

    onLoad () {
        this.spr_zhuangTip = this.node.getChildByName("spr_zhuangTip");
        this.spr_zhuangTip.active = false;
        this.wxId = 0;
    },

    refreshView (userInfo) {
        this.userInfo = userInfo;
        this.wxId = this.userInfo.wxId;
        // this.rtext_name.string = userInfo.uid;

        
        this.label_coin.string = this.parent.FormatGold(userInfo.lebi);
        var headImage = "";
        cc.log(G.mjGameInfo.roomInfo.isjinbi,"是否是金币场")
        if (G.mjGameInfo.roomInfo.isjinbi == true) {
            if(userInfo.sex == 1 || userInfo.sex == "男"){
                headImage = G.nanImage;
            }
            else{
                headImage = G.nvImage;
            }
        }
        else{
            this.rtext_name.string = this.parent.FormatName(userInfo.name);
            headImage = userInfo.image;
        }
        cc.log(headImage,"人物的头像")
        if (headImage !== null && headImage !== "" ) {
            cc.globalMgr.globalFunc.getUrlHead(this.spr_head, headImage, 70);
        }
     
        if (userInfo.isVip) {
            this.rtext_name.node.color = new cc.Color(255, 0, 0);
        }
    },
    refreshDirection(msg){
        cc.log(msg,"fangxiang=============================")
        //var wxId = this.getUserWxId();
        cc.log(this.wxId,"============-")
        for (i=0;i<msg.locationList.length;i++){
            if (msg.locationList[i].wxId ==this.wxId){
                if (msg.locationList[i].position == 0){
                    this.spr_Dong.node.active = true;
                    this.spr_Nan.node.active = false;
                    this.spr_Xi.node.active = false;
                    this.spr_Bei.node.active = false;
                }
                else if (msg.locationList[i].position == 1){
                    this.spr_Dong.node.active = false;
                    this.spr_Nan.node.active = true;
                    this.spr_Xi.node.active = false;
                    this.spr_Bei.node.active = false;
                }
                else if (msg.locationList[i].position == 2){
                    this.spr_Dong.node.active = false;
                    this.spr_Nan.node.active = false;
                    this.spr_Xi.node.active = true;
                    this.spr_Bei.node.active = false;
                }
                else if (msg.locationList[i].position == 3){
                    this.spr_Dong.node.active = false;
                    this.spr_Nan.node.active = false;
                    this.spr_Xi.node.active = false;
                    this.spr_Bei.node.active = true;
                }
            }
        }
    },
    hideDirection(){
        this.spr_Dong.node.active = false;
        this.spr_Nan.node.active = false;
        this.spr_Xi.node.active = false;
        this.spr_Bei.node.active = false;
    },
    refreshZhuang (flag) {
        this.spr_zhuangTip.active = flag;
    },

    getUserWxId () {
        return this.userInfo.wxId;
    },

    refreshScore (score) {
        this.label_coin.string = this.parent.FormatGold(score);
    },

    hideDingQueTips () {
        this.spr_tong.node.active = false;
        this.spr_tiao.node.active = false;
        this.spr_wan.node.active = false;
    },

    refreshDingQueTips (type) {   //提交的定缺类型 1.缺筒 2.缺条 3.缺万
        if (type === 1) {
            this.spr_tong.node.active = true;
            this.spr_tiao.node.active = false;
            this.spr_wan.node.active = false;
        } else if (type === 2) {
            this.spr_tong.node.active = false;
            this.spr_tiao.node.active = true;
            this.spr_wan.node.active = false;
        } else if (type === 3) {
            this.spr_tong.node.active = false;
            this.spr_tiao.node.active = false;
            this.spr_wan.node.active = true;
        }
    },
});
