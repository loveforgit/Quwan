
cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Node
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
      
        spawnCount: 0,
        totalCount: 0, // how many items we need for the whole list
        spacing: 0, // space between each item
        bufferZone: 0, // when item is away from bufferZone, we relocate it
    },

    // use this for initializationP
    onLoad: function () {
        cc.log("---helloworld----")
        this.content = this.scrollView.content;
        this.items = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
        this.initialize();
    },
    initialize: function () {
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            this.items.push(item);
        
        }
    },

    getPositionInView: function (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        let offset = (this.itemTemplate.height + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                //cc.log("----if----")
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].setPositionY(items[i].y + offset);
                   // let item = items[i].getComponent('ReplayItem');
                   // let itemId = item.itemID - items.length; // update item id

                }
            } else {
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    //cc.log("----else----", items.length)
                    items[i].setPositionY(items[i].y - offset);
                   // let item = items[i].getComponent('ReplayItem');
                    //let itemId = item.itemID + items.length;
                }
            }
        }
        this.lastContentPosY = this.scrollView.content.y;

        this.totalCount = G.mylog.length;
        // if(G.mylog.length)
        //this.lookLog();

    },
    // lookLog: function () {
    //     var log =  G.mylog;
    //     var items = this.items;
    //     for (var i in log) {
    //         items[i].getChildByName("log").getComponent(cc.Label).string = log[i];
    //        // cc.log("---ss-s-s-s-s-s")
    //     }
    //    // this.initialize();


    //     ////////////helloworld
    // },
   

});
