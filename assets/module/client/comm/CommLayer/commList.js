var comm = require("Comm");
cc.Class({
    extends: comm,

    properties: {
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        node_item: {
            default: null,
            type: cc.Node
        },
        spawnCount: 0,
        totalCount: 0,
        spacing: 0,
        bufferZone: 0
    },

    onLoad: function () {
        this.content = this.scrollView.content;
        this.items = [];
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.curItem = 0;
        //item项
        // this._curItem = null;
    },

    initialize: function (index) {
        var _curItemP = this.node_item;
        cc.log("列表项高度+++++++", _curItemP.height);

        this.content.height = this.totalCount * (_curItemP.height + this.spacing) + this.spacing;
        var itemsLen = this.items.length;
        if (this.spawnCount > 0) {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].destroy();
            }
            this.items.length = 0;
        }

        for (let i = 0; i < this.spawnCount; ++i) {
            var curItem = cc.instantiate(_curItemP);
            this.content.addChild(curItem);
            curItem.setPosition(0, - curItem.height * (0.5 + i) - this.spacing * (i + 1));
            this.items.push(curItem);
        }

        if (this.spawnCount > 0) {
            this.content.active = true;
        }
        else {
            this.content.active = false;
        }
    },

    // getPositionInView: function (item) {
    //     let worldPos = item.parent.convertToWorldSpaceAR(item.position);
    //     let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
    //     return viewPos;
    // },

    // update: function (dt) {
    //     this.updateTimer += dt;
    //     if (this.updateTimer < this.updateInterval) return;
    //     this.updateTimer = 0;
    //     let items = this.items;
    //     let buffer = this.bufferZone;
    //     let isDown = this.scrollView.content.y < this.lastContentPosY;
    //     let offest = (this._curItem.height + this.spacing) * items.length;
    //     for (let i = 0; i < items.length; ++i) {
    //         let viewPos = this.getPositionInView(items[i]);
    //         if (isDown) {
    //             if (viewPos.y < -buffer && items[i].y + offest < 0) {
    //                 items[i].setPositionY(items[i].y + offest);
    //             }
    //         } else {
    //             if (viewPos.y > buffer && items[i].y - offest > -this.content.height) {
    //                 items[i].setPositionY(items[i].y - offest);
    //             }
    //         }
    //     }
    //     this.lastContentPosY = this.scrollView.content.y;
    // },
});
