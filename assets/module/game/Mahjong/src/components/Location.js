var comm = require("Comm")
var mahjongGameControl = require("mahjongGameControl")
cc.Class({
    extends:comm,

    properties: {
        spr_head0: {
            default: null,
            type: cc.Sprite,
        },
        spr_head1: {
            default: null,
            type: cc.Sprite,
        },
        spr_head2: {
            default: null,
            type: cc.Sprite,
        },
        spr_head3: {
            default: null,
            type: cc.Sprite,
        },
        label_01:{
            default: null,
            type: cc.Label,
        },
        label_02:{
            default: null,
            type: cc.Label,
        },
        label_03:{
            default: null,
            type: cc.Label,
        },
        label_13:{
            default: null,
            type: cc.Label,
        },
        label_12:{
            default: null,
            type: cc.Label,
        },
        label_23:{
            default: null,
            type: cc.Label,
        },
    },

    onLoad () {
       
      
    },
    getsaet(wxId){
       var index =  this.parent.getSeatNode(wxId);
       return index.seatIndex;
    },
    refreshDistance(distanceList){
        for (i=0;i<distanceList.length;i++){
            var seatA = this.getsaet(distanceList[i].idxA);
            var seatB = this.getsaet(distanceList[i].idxB);
            if (seatA==0 && seatB ==1 || seatA==1 && seatB ==0){
                this.label_01.string = distanceList[i].distance;
            }
            else if(seatA==0 && seatB ==2 || seatA==2 && seatB ==0){
                this.label_02.string = distanceList[i].distance;
            }
            else if(seatA==0 && seatB ==3 || seatA==3 && seatB ==0){
                this.label_03.string = distanceList[i].distance;
            }
            else if(seatA==1 && seatB ==2 || seatA==2 && seatB ==1){
                this.label_12.string = distanceList[i].distance;
            }
            else if(seatA==1 && seatB ==3 || seatA==3 && seatB ==1){
                this.label_13.string = distanceList[i].distance;
            }
            else if(seatA==2 && seatB ==3 || seatA==3 && seatB ==2){
                this.label_23.string = distanceList[i].distance;
            }
        }
    },
    refreshInfos(msg,index){
        var head0;
        var head1;
        var head2;
        var head3;
         this.refreshDistance(msg.distanceList);
         for(i = 0;i<msg.imageList.length;i++ ){
            if (index[i] == 0){
                 head0 = this.spr_head0.node;
                cc.loader.load({ url: msg.imageList[i].image, type: 'png' }, function (err, tex) {
                    head0.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                });
               if (msg.imageList[i].type == 0){
                    head0.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head0.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head0.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=true
                }
                else if(msg.imageList[i].type == 1){
                    head0.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head0.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=true
                    head0.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
                else{
                    head0.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=true
                    head0.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head0.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
            }
           else if(index[i] == 1){
                head1 = this.spr_head1.node;
                cc.loader.load({ url: msg.imageList[i].image, type: 'png' }, function (err, tex) {
                    head1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                });
                if (msg.imageList[i].type == 0){
                    head1.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head1.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head1.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=true
                }
                else if(msg.imageList[i].type == 1){
                    head1.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head1.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=true
                    head1.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
                else{
                    head1.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=true
                    head1.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head1.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
            }
            else if(index[i] == 2){
                head2 = this.spr_head2.node;
                cc.loader.load({ url: msg.imageList[i].image, type: 'png' }, function (err, tex) {
                    head2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                });
                if (msg.imageList[i].type == 0){
                    head2.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head2.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head2.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=true
                }
                else if(msg.imageList[i].type == 1){
                    head2.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head2.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=true
                    head2.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
                else{
                    head2.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=true
                    head2.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head2.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
            }
            else if(index[i] == 3){
               head3 = this.spr_head3.node;
                cc.loader.load({ url: msg.imageList[i].image, type: 'png' }, function (err, tex) {
                    head3.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                });
                if (msg.imageList[i].type == 0){
                    head3.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head3.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head3.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=true
                }
                else if(msg.imageList[i].type == 1){
                    head3.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=false
                    head3.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=true
                    head3.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
                else{
                    head3.getChildByName("spr_colorRed").getComponent(cc.Sprite).node.active=true
                    head3.getChildByName("spr_colorGreen").getComponent(cc.Sprite).node.active=false
                    head3.getChildByName("spr_colorGrey").getComponent(cc.Sprite).node.active=false
                }
           }
       }
        
    },
   
    onClickClose:function(){
          //添加音效
          //this.playClickMusic()

        this.node.active = false;
    }
});
