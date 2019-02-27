window.G = {
    // IP: "10.0.0.240",
    // PORT: "9660",

    // IP: "10.0.0.113",
    // PORT: "8185",

    // 常发棋牌 暂时
    IP: "47.92.73.248",
    PORT: "9260",

    // IP: "47.95.9.122",
    // PORT: "9184",

    urlHttpServerPath: "http://10.0.0.213:8183",
    shareHttpServerPath: "https://fir.im/haunleqipai",
    socketMgr: {
        socket: null
    },
    finishState: 0,

    isTestVer: true,   // 测试时使用， 打包时设置false

    selectGameType: 9,  //选择游戏类型
    saveClubThis: null,  //存储俱乐部
    saveClubID: 0,   //存储俱乐部id
    saveClubName: "",   //存储俱乐部名字
    selectClubGameType: 4, // 存储选择的游戏类型
    identity: -1,   //身份俱乐部 部主、合伙人 、成员

    initnode: 0,  //
    youmeTalkInitSuccess: false,   //语音通话初始化成功

    myPlayerInfo: {
        uid: 0,              //用户登录id
        name: "",            //用户昵称
        image: "",           //用户头像
        sex: "",             //用户性别
        ip: "",              //玩家ip
        wxId: "",            //玩家编号
        gold: 0,             //玩家金币
        idx: "",             //玩家进房间索引位置
        fk: 0,               //玩家房卡数量
        stime: 0,            //玩家注册日期
        isrenzheng: "",      //玩家是否认证过
        tuijianma: "",       //玩家填写过的推荐码
        sit: "",             //玩家是否坐下
        qx: "",              //玩家是否有特殊权限
        city: "",            //玩家所在城市
        jinbi: 1000,          //乐币数量
        xiangbi: 1000,       //享币数量
        cardid: 0,           //认证身份证
        realname: 0,         //认证姓名
        shengLv: "",        //胜率
        taoLv: "",          //逃跑率
        isVip: 0,             //vip
        shareImageUrl: ""    //分享图片链接
    },

    //玩家当前的房号 , 在大厅或者登陆的时候初始化为0，在游戏内的话，设置为 当前游戏房间房号
    currentRoomId: 0,

    //微信登录后获得的数据
    wxUserInfo: {
        uid: 0,
        sex: "",
        nickname: "",
        headimgurl: ""
    },
    GameGlodType: 0,                     // 金币场房间类型
    RequireGameGoldType: 0,              // 请求金币场配置数据 ，游戏类型

    //游戏列表
    MahjongYanTaiType: 1,                //烟台麻将
    MahjongMoPingType: 2,                //牟平虚拟五麻将
    LandType: 3,                         //斗地主
    ZhaJinHuaType: 5,                      //炸金花
    CowType: 4,                          //牛牛
    MahjongType: 9,                      //郑州麻将
    renqiuMahjongType: 56,                      //任丘麻将

    //参数1 ：游戏名字， 参数2：游戏主消息字段
    gameIdList: {
        "1": ["mahjong", "100"],         // 烟台麻将
        "2": ["mahjong", "200"],         // 虚拟五麻将
        "3": ["land", "300"],            // 斗地主 
        "4": ["nn", "400"],               // 牛牛
        "5": ["tractors", "500"],        // 炸金花
        "56": ["mahjong", "5600"],         // 任丘麻将
        "40": ["hundred", "4000"],     //百人牛牛
        "310": ["gameForTuiTongZi", "3100"],         //百人推筒子
        "311": ["tuiTongZiRoomCard", "3110"],         //房卡推筒子
    },

    gameNetId: 100,                    // 游戏对应的大消息号ID
    mahjongYanTaiGameId: 100,          // 烟台麻将gameId
    mahjongMoPingGameId: 200,          // 牟平虚拟五gameId

    //

    ///查看log
    mylog: [],

    //拷贝结构体
    copyObject(targetArr, arr) {
        Object.keys(targetArr).forEach(function (key) {
            if (arr[key] != undefined) {
                targetArr[key] = arr[key]
            }
        })
    },

    //音量设置
    musicData: {
        musicVolume: 0,
        effectVolume: 0,
        musicIsOn: true,
        effectIsOn: true
    },

    //背景音id
    bgMusicId: null,

    //保存创建俱乐部名字
    nameForCreateClub: null,

    //解散返回俱乐部id
    returnIdForClub: 0,
}
