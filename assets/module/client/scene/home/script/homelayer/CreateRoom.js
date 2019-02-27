var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        createMJNode: {
            default: null,
            type: cc.Node
        },
        createDDZNode: {
            default: null,
            type: cc.Node
        },
        createZJHNode: {
            default: null,
            type: cc.Node
        },
        createNNNode: {
            default: null,
            type: cc.Node
        },
        //----------------------

        toggleGrid: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {
        this.toggleSelect(G.selectGameType)
    },

    toggleSelect(toggleName) {
        for (var i = 0; i < this.toggleGrid.childrenCount; i++) {
            this.toggleGrid.children[i].getComponent(cc.Toggle).isChecked = false
        }
        this.toggleGrid.getChildByName(toggleName + "").getComponent(cc.Toggle).isChecked = true
        this.selectRule(parseInt(toggleName))
    },
    // 选择 创建房间规则节点
    selectRuleNode(event, customEventData) {
        if (customEventData == "MJ") {
            this.selectRule(9)
        } else if (customEventData == "DDZ") {
            this.selectRule(3)
        } else if (customEventData == "ZJH") {
            this.selectRule(5)
        }
        else if (customEventData == "NN") {
            this.selectRule(4)
        }
        else if (customEventData == "NN2") {
            this.selectRule(4)
        }
    },


    selectRule(gameType) {
        if (gameType == 3) {
            this.createMJNode.active = false
            this.createDDZNode.active = true
            this.createZJHNode.active = false
            this.createNNNode.active = false
        } else if (gameType == 5) {
            this.createMJNode.active = false
            this.createDDZNode.active = false
            this.createZJHNode.active = true
            this.createNNNode.active = false
        } else if (gameType == 4) {
            this.createMJNode.active = false
            this.createDDZNode.active = false
            this.createZJHNode.active = false
            this.createNNNode.active = true
        }
        else if (gameType == 9) {
            this.createMJNode.active = true
            this.createDDZNode.active = false
            this.createZJHNode.active = false
            this.createNNNode.active = false
        }
        // else if (gameType == 5) {
        //     this.createMJNode.active = true
        //     this.createDDZNode.active = false
        //     this.createZJHNode.active = false
        //     this.createNNNode.active = false
        // }
    },

    OnClickClose() {
        //添加音效
        this.playClickMusic()
        this.node.destroy();
    },
});
