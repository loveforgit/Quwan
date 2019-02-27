
cc.Class({
    extends: cc.Component,

    properties: {
        ResultAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        pokerTypeAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        content: {
            default: null,
            type: cc.Node
        },

        item: {
            default: null,
            type: cc.Node
        },
    },

    //上局回顾 回调
    shangJuHuiGu(body) {
        var data = JSON.parse(body.data)
        cc.log("上局回顾： ", body, data)
        this.content.removeAllChildren()
        for (var i = 0; i < data.length; i++) {
            cc.log("~~~", data[i])
            var copyItem = cc.instantiate(this.item)
            var headBg = copyItem.getChildByName("headBg")
            this.SprLoadHead(headBg, data[i].image)
            copyItem.getChildByName("name").getComponent(cc.Label).string = data[i].name
            copyItem.getChildByName("id").getComponent(cc.Label).string = data[i].wxid
            var cardType = copyItem.getChildByName("cardGrid")
            var card = data[i].cards
            for (var j = 0; j < card.length; j++) {
                var pok = card[j].v + card[j].h
                cardType.children[j].getComponent(cc.Sprite).spriteFrame = this.ResultAtlas.getSpriteFrame(pok);
                cardType.children[j].active = true
                cc.log("aaaa ", cardType.children[j])
            }

            var cardtypeNum = data[i].type
            var parent = copyItem.getChildByName("cardType")
            var pxGrid = parent.getChildByName("A")
            if (cardtypeNum > 111) {
                pxGrid = parent.getChildByName("B")
            }
            var type = pxGrid.getChildByName("spr_type")
            type.active = true
            type.getComponent(cc.Sprite).spriteFrame = this.pokerTypeAtlas.getSpriteFrame(cardtypeNum);

            copyItem.setPosition(0, -79 - (i * (copyItem.height + 2)))
            this.content.addChild(copyItem)

        }
        this.content.height = data.length * (this.item.height + 2)
    },

    //加载头像
    SprLoadHead(node, image) {
        if (image !== "") {
            cc.loader.load({ url: image, type: 'png' }, function (err, tex) {
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
            });
        }
    },


    onClickdestroy() {
        this.node.destroy()
    },
});
