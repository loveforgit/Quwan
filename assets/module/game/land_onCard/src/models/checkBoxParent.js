cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {

        this.item = []
        for (var i in this.node.children) {
            var comm = this.node.children[i]
            this.item.push(comm)
        }
    },
    getEnabled() {
        var tag = this
        var test = {
            get item() {
                for (var i in tag.item) {
                    if (tag.item[i].getComponent(cc.Toggle).isChecked) {

                        return tag.item[i];
                    }
                }
            }
        }
        return test.item
    },
    //设置选择的 toggle组件
    addEnabeld(toggleName) {
        for (var i in this.node.children) {
            this.node.children[i].getComponent(cc.Toggle).isChecked = false
        }
        var toggle = this.node.getChildByName(toggleName + '')
        if (toggle != null) {
            toggle.getComponent(cc.Toggle).isChecked = true
        }
    }
});
