cc.Class({
    extends: cc.Component,

    properties: {
      
        spr_chi: {
            default: null,
            type: cc.Sprite,
        },
        spr_peng: {
            default: null,
            type: cc.Sprite,
        },
        spr_gang: {
            default: null,
            type: cc.Sprite,
        },
        spr_hu: {
            default: null,
            type: cc.Sprite,
        },
        spr_guo: {
            default: null,
            type: cc.Sprite,
        },
    },
    hideTips(){
        this.spr_hu.node.active = false
        this.spr_chi.node.active = false
        this.spr_peng.node.active = false
        this.spr_gang.node.active = false
        this.spr_guo.node.active = true
    },
    onLoad(){
        this.spr_hu =  this.spr_hu;
        this.spr_chi =  this.spr_chi;
        this.spr_peng = this.spr_peng;
        this.spr_gang = this.spr_gang;
        this.spr_guo = this.spr_guo;
    },
    refreshTipsView (body, index) {
       this.hideTips();
       cc.log(body,index,"=============cpgh")
        if(index == 1){             //右
            var instance = 130
            if(body.hu == 1){
                this.spr_hu.node.active = true
                this.spr_hu.node.setPosition(390,480-instance)
                instance+=90
            }
            cc.log(instance,"-----------=====cpgh")
            if(body.peng == 1){
                this.spr_peng.node.active = true
                this.spr_peng.node.setPosition(390,480-instance)
                instance+=90
            }
            cc.log(instance,"---------aa--=====cpgh")
            if(body.gang == 1){
                this.spr_gang.node.active = true
                this.spr_gang.node.setPosition(390,480-instance)
                instance+=90
            }
            cc.log(instance,"-------sss----=====cpgh")
            if(body.chi == 1){
                this.spr_chi.node.active = true
                this.spr_chi.node.setPosition(390,480-instance)
                instance+=90
            }
        }
        if(index == 2){         //上
            var instance = 132
            if(body.hu == 1){
                this.spr_hu.node.active = true
                this.spr_hu.node.setPosition(-392,-306 + instance)
                instance+=132
            }
            cc.log(instance,"-----------=====cpgh")
            if(body.peng == 1){
                this.spr_peng.node.active = true
                this.spr_peng.node.setPosition(-392,-306 + instance)
                instance+=132
            }
            cc.log(instance,"---------aa--=====cpgh")
            if(body.gang == 1){
                this.spr_gang.node.active = true
                this.spr_gang.node.setPosition(-392,-306 + instance)
                instance+=132
            }
            cc.log(instance,"-------sss----=====cpgh")
            if(body.chi == 1){
                this.spr_chi.node.active = true
                this.spr_chi.node.setPosition(-392,-306 + instance)
                instance+=132
            }
        }
        if(index == 3){             //左
            var instance = 137
            if(body.hu == 1){
                this.spr_hu.node.active = true
                this.spr_hu.node.setPosition(-413,-160+instance)
                instance+=90
            }
            cc.log(instance,"-----------=====cpgh")
            if(body.peng == 1){
                this.spr_peng.node.active = true
                this.spr_peng.node.setPosition(-413,-160+instance)
                instance+=90
            }
            cc.log(instance,"---------aa--=====cpgh")
            if(body.gang == 1){
                this.spr_gang.node.active = true
                this.spr_gang.node.setPosition(-413,-160+instance)
                instance+=90
            }
            cc.log(instance,"-------sss----=====cpgh")
            if(body.chi == 1){
                this.spr_chi.node.active = true
                this.spr_chi.node.setPosition(-413,-160+instance)
                instance+=70
            }
            cc.log( this.spr_chi.node.position,"-------sss----=====cpgh")
        }
    },
});
