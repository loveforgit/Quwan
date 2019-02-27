cc.Class({

    add(key, value) {
        // 添加字典的键值(key:value)
        this.dataStore[key] = value;
    },
    show() {
        //显示字典中的键值(key:value)
        for (var key in this.dataStore) {
            cc.log(key + " : ", this.dataStore[key]);
        }
    },
    find(key) {
        // 根据键(key)查找对应的值(value),返回值value
        return this.dataStore[key];
    },
    remove(key) {
        // 根据键(key)删除对应的值(value)
        delete this.dataStore[key];
    },
    count() {
        // 计算字典中的元素个数
        var n = 0;
        for (var key in Object.keys(this.dataStore)) {
            ++n;
        }
        return n;
    },
    kSort() {
        // 字典按值(value)排序,并输出排序后的结果
        var dic = this.dataStore;
        var res = Object.keys(dic).sort();
        for (var key in res) {
            console.log(res[key] + " : " + dic[res[key]]);
        }
    },
    vSort() {
        // 字典按值(value)排序,并输出排序后的结果
        var dic = this.dataStore;
        var res = Object.keys(dic).sort(function (a, b) {
            return dic[a] - dic[b];
        });
        for (var key in res) {
            console.log(res[key] + " : " + dic[res[key]]);
        }
    },
    clear() {
        // 清空字典内容
        for (var key in this.dataStore) {
            delete this.dataStore[key];
        }
    },

    hasOwnProperty(key) {
        //判断字典中是否存在 这个key值   如果存在 返回 true  否则  undefined
        var isKey = this.dataStore.hasOwnProperty(key)
        return isKey == true

    },
    Dictionary() {
        this.dataStore = new Array(); // 定义一个数组，保存字典元素

        // this.add = this.add             // 添加字典内容(key:value)
        // this.show =this.show           // 显示字典中的键值
        // this.find = find;             // 根据键(key)查找并返回对应的值(value)
        // this.remove = remove;         // 删掉相对应的键值
        // this.count = count;           // 计算字典中的元素的个数
        // this.kSort = kSort;           // 按键(key)排序
        // this.vSort = vSort;           // 按值(value)排序
        // this.clear = clear;           // 清空字典内容
    },



})