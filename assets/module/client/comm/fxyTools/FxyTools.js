window.FTools = {

    //范晓勇 工具类
    savePrefabArr: [],
    ShowPop(prefabName, parent) {
        var isExist = this.PrefabExist(prefabName)
        if (isExist == null) {
            var node = cc.instantiate(cc.globalRes[prefabName]);
            node.parent = parent;
            node.name = prefabName
            this.savePrefabArr.push(node)
            return node
        } else {
            return isExist
        }
    },

    HidePop(node) {
        var isInclude = this.savePrefabArr.some(function (obj) {
            return obj == node
        });
        if (isInclude == true) {
            for (let i = 0; i < this.savePrefabArr.length; i++) {
                if (this.savePrefabArr[i] == node) {
                    this.savePrefabArr[i].destroy()
                }
            }
        } else {
            node.destroy()
        }
    },

    PrefabExist(prefabName) {
        var prefabObj = null
        this.savePrefabArr.some(function (obj) {
            prefabObj = obj.name == prefabName ? obj : null
            return obj == prefabName
        });
        return prefabObj
    },

}