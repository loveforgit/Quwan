cc.Class({
    extends: cc.Component,

    properties: {
        node_pai: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad () {
      
    },

    onClose () {
        this.node.active = false;
    },

   
    refreshResult (result) {
        this.showPaiArr(result);
    },
    showPaiArr (result) {
        var posX = 0
        if (result.birdcard.length > 1){
            posX =  -130
        }
        else {
            posX = 0;
        }
        if (result.birdcard.length > 0) {
            var paiSpliteArr = cc.globalMgr.mahjongmgr.spliteArr(result.birdcard);
            for (var i = 0; i < paiSpliteArr.length; i++) {
                var paiIdArr = paiSpliteArr[i];
                for (var j = 0; j < paiIdArr.length; j++) {
                    this.createMjSpr(paiIdArr[j], cc.p(posX,-25));
                    posX += 250;
                }
            }
        }
    },
    createMjSpr (mjId, pos) {
        var node = new cc.Node('Sprite');
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("B_",mjId);
        cc.log("=========B_",mjId)
        node.parent = this.node_pai;
        node.scale= 1.2;
        node.position = pos;
    },
 

});
