var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {

        spr_head: {
            default: null,
            type: cc.Sprite
        },
        laber_money: cc.Label,
        label_Name: {
            default: null,
            type: cc.Label
        },
        node_one: {
            default: null,
            type: cc.Node
        },
        node_two: {
            default: null,
            type: cc.Node
        },
        node_three: {
            default: null,
            type: cc.Node
        },
        label_id: {
            default: null,
            type: cc.Label
        }

    },


    onLoad() {
    },

    start() {

    },
    // 头像，姓名，金币数量,排序
    updateItem: function (sprite, name, money, id) {
        var that = this;
        if (sprite) {
            cc.loader.load({ url: sprite, type: 'png' }, function (err, tex) {
                if(tex != null)
                    that.spr_head.spriteFrame = new cc.SpriteFrame(tex)
            });
        }

        that.label_Name.string = this.FormatName(name);
        that.laber_money.string = this.FormatGold(money);

        if (id == 0) {
            that.node_one.active = true;
        }
        if (id == 1) {
            that.node_two.active = true;
        }
        if (id == 2) {
            that.node_three.active = true;
        } else {
            var sd = parseInt(id);
            that.label_id.string = sd + 1;
        }
        if (id < 3) {
            that.label_id.string = ""
        }

    },

    // update (dt) {},
});
