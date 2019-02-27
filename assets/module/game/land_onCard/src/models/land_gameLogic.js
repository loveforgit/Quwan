/**
 * by yky
 * 2018.8.25
 */
module.exports = {

    /**s
     * 将扑克结构体数据列表转值列表
     * @param cdCardObjDatas
     */
    CardObjDatasToValueDatas(cdCardObjDatas) {
        var cardValueDatas = [];
        for (var i = 0; i < cdCardObjDatas.length; i++) {
            var obj = cdCardObjDatas[i];
            cardValueDatas.push(obj.v);
        }
        return cardValueDatas;
    },

    /**
     * 判断是否是三带一，或者是三带二
     * @param cdCardDatas 所有牌数据
     */
    getSanDaiValue(cdCardDatas) {
        if (cdCardDatas.length > 5 || cdCardDatas.length < 4) return 0;
        var hash = []
        for (var i = 3; i <= 15; i++)
            hash[i] = 0;
        for (var i = 0; i < cdCardDatas.length; i++) {
            hash[cdCardDatas[i].v]++;
        }

        var SanDaiValue = 0
        for (var i = 3; i <= 15; i++) {
            if (hash[i] == 3) {
                SanDaiValue = i
                break
            }
        }
        return SanDaiValue
    },

    /**
     * 将三带排序，并返回
     * @param cdCardDatas 所有牌数据
     * @param SanDaiValue 三带的牌值
     */
    getSortSanDai(cdCardDatas) {
        var sortPokers = []
        var SanDaiValue = this.getSanDaiValue(cdCardDatas)

        for (var i = 0; i < cdCardDatas.length; i++) {
            if (cdCardDatas[i].v == SanDaiValue) {
                sortPokers.push(cdCardDatas[i])
            }
        }


        for (var i = 0; i < cdCardDatas.length; i++) {
            if (cdCardDatas[i].v != SanDaiValue) {
                sortPokers.push(cdCardDatas[i])
            }
        }
        return sortPokers
    },

    /**
     * 获取牌数据中的顺子
     * @param cdCardDatas 所有牌数据
     * 
     */
    getShunZiIndexList(cdCardDatas) {
        var hash = [];
        for (var i = 3; i <= 14; i++) {
            hash[i] = 0;
        }

        for (var i = 0; i < cdCardDatas.length; i++) {
            hash[cdCardDatas[i]]++;
        }

        var minIndex = -1;
        var maxIndex = -1;
        for (var i = 3; i <= 14; i++) {
            if (hash[i] >= 1) {
                minIndex = i;
                break;
            }
        }

        for (var i = 14; i >= 3; i--) {
            if (hash[i] >= 1) {
                maxIndex = i;
                break
            }
        }

        var bShunZi = true
        for (var i = minIndex; i <= maxIndex; i++) {
            if (hash[i] == 0) {
                bShunZi = false
            }
        }

        //判断长度够不够
        if (maxIndex - minIndex + 1 < 5) {
            bShunZi = false
        }


        var selectIndexList = []
        if (bShunZi == true) {
            for (var i = minIndex; i <= maxIndex; i++) {
                for (var j = 0; j < cdCardDatas.length; j++) {
                    if (i == cdCardDatas[j]) {
                        selectIndexList.push(j)
                        break;
                    }
                }
            }
        }
        else {
            for (var j = 0; j < cdCardDatas.length; j++) {
                selectIndexList.push(j)
            }
        }

        return selectIndexList;
    }
}