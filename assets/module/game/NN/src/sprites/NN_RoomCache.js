//牛牛房间规则存储
window.NNRoomRule = {
    //玩法
    NNRoomPlaying: {
        "1": "牛牛上庄",
        "2": "固定庄家",
        "3": "自由抢庄",
        "4": "明牌抢庄",
        "5": "八人明牌",
    },

    //底分
    NNRoomDiFen: {
        "1": "1/2",
        "2": "2/4",
        "3": "3/6",
        "4": "4/8",
        "5": "5/10",
    },

    //局数
    NNRoomInning: {
        "1": "10局",
        "2": "20局",
    },


    //房费
    NNRoomRate: {
        "1": "AA支付",
        "2": "房主支付",
    },

    //翻倍规则
    NNRoomDoubleRules: {

        "1": "牛牛x4 牛九x3 牛八x2 牛七x2",
        "2": "牛牛x3 牛九x2 牛八x2 ",
    },

    //自动开始 6人
    NNRoomAutoStart6: {

        "1": "手动开始",
        "4": "满4人开",
        "5": "满5人开",
        "6": "满6人开",
    },

    //自动开始 8人
    NNRoomAutoStart8: {

        "1": "手动开始",
        "6": "满6人开",
        "7": "满7人开",
        "8": "满8人开",
    },

    //推注选项
    NNRoomBolus: {
        "0": "无",
        "5": "5倍",
        "10": "10倍",
        "15": "15倍",
    },

    //上庄分数
    NNRoomShanZhuangArr:[],

    //最大抢庄
    NNRoomMaxRobZhuang: {

        "1": "1倍",
        "2": "2倍",
        "3": "3倍",
        "4": "4倍",
    },

    ASpecialCardType: function (arr) {
        var CardType = ""
        if (arr[0] == true) {
            CardType += "顺子牛"
        }

        if (arr[1] == true) {
            CardType += " 五花牛"
        }

        if (arr[2] == true) {
            CardType += " 同花牛"
        }

        if (arr[3] == true) {
            CardType += " 葫芦牛"
        }

        if (arr[4] == true) {
            CardType += " 炸弹牛"
        }

        if (arr[5] == true) {
            CardType += " 五小牛"
        }

        if (arr[6] == true) {
            CardType += " 欢乐牛"
        }

        return CardType
    },
    //创建房间记忆 【注还没对接 有时间对接  2018/8/17】
    creatRoom: {
        gametype: 0,
        nngameType: 0,
        nnjushu: 10, //局数
        nnwanfa: 1, //玩法
        nndifen: 1, //底分
        nnfangfei: 2, //房费
        nnfanbeiguize: 1, //翻倍规则
        nnautobegin: 1, //自动
        nntuizhu: 0, //推注
        nnzuidaqiangzhuang: 4, //最大抢庄
        nnshangfenfenshu: 1,  //上庄分数
        isjinzhijiaru: false, //禁止加入
        isxiazhuxianzhi: true, //下注限制
        nnteshuArr: [true, true, true, true, true, true, true], //特殊
        nnrenShu: 6, //人数
        nnshangfen: 1, //上分

        shunziniu:true,
        wuhuaniu:true,
        tonghuaniu:true,
        huluniu:true,
        zhadanniu:true,
        wuxiaoniu:true,
        huanleniu:true,
    },




}
