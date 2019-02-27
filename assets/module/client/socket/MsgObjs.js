module.exports = {
    //心跳检测
    heartCheck(uid) {
        var Obj = new Object()
        Obj.uid = uid
        return Obj
    },
    //登录
    login(uid, username, image, sex) {
        var Obj = new Object()
        Obj.uid = uid
        Obj.username = username
        Obj.image = image
        Obj.sex = sex
        return Obj
    },

    //创建麻将房间
    createRoom(data) {
        var Obj = new Object()
        Obj.uid = data.uid
        Obj.gametype = data.gametype         //游戏编号 3.麻将 (后续再加游戏 填写相应游戏编号)
        Obj.fangfei = data.fangfei           //1.房主支付 2.AA支付
        Obj.jushu = data.jushu               //1.4局  2.8局  3.16 局
        Obj.hutype = data.hutype             //1.自摸胡   2.点炮胡 
        Obj.iserwuba = data.iserwuba         //true 强制 2 5 8 做将 ;false 不强制
        Obj.iscanchi = data.iscanchi         //true 开启可吃牌 ;false 不能吃牌
        Obj.isgenzhuang = data.isgenzhuang   //true 开启跟庄 ;false 不开启跟庄
        Obj.fengding = data.fengding         //1.不限制封顶  2.4番封顶  3.8番封顶
        Obj.difen = data.difen               //500.底分500 ； 1000 底分为 1000 ；3000 底分为3000
        Obj.iscanminglou = data.iscanminglou   //明楼  
        Obj.isCanGangDing = data.isCanGangDing //杠腚
        return Obj;
    },
    //创建斗地主房间
    createRoomDDZ(data) {
        var obj = new Object();
        obj.uid = data.uid;                     //玩家id
        obj.gametype = data.gametype;           //游戏编号 3 ddz
        obj.fangfei = data.fangfei;             //支付
        obj.jushu = data.jushu;                 //局数
        obj.difen = data.difen;                 //底分
        return obj;
    },
    //加入房间
    JoinRoom(uid, roomNum) {
        var obj = new Object();
        obj.uid = uid;                        //用户id
        obj.roomid = roomNum;                 //房间编号
        return obj;
    },
    //准备
    prapareSend(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        return obj;
    },
    //离开房间
    leaveRoom(data) {
        var obj = new Object();
        obj.uid = data.uid;       //用户id
        return obj;
    },
    // 出牌
    chuPaiSend(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        obj.chupai = data.chupai;
        return obj;
    },
    // 碰杠胡
    pengGangHuSend(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        obj.beiuid = data.beiuid;
        obj.pai = data.pai;
        obj.type = data.type;
        obj.chitype = data.chitype;
        return obj;
    },
    // 麻将继续
    mahjongGameContinue(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        return obj;
    },
    // 明楼
    mingLouSend(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        obj.type = data.type;
        return obj;
    },
    // 虚拟5
    virtualFiveSend(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        obj.pai = data.pai;
        return obj;
    },
    // 测试用要牌
    testReqMj(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        obj.pai = data.pai;
        return obj;
    },
    //日常签到 解绑推广码 查询代理信息（ 通用 以后如有需要可以单独写）
    SingInDay: function (uid) {
        var obj = new Object();
        obj.uid = uid;
        return obj;
    },
    //解绑推广码
    JieAgent: function (uid) {
        var obj = new Object();
        obj.uid = uid;
        return obj;
    },

    //连续签到领奖 
    SingContinuousDay: function (uid, DayNum) {
        var obj = new Object();
        obj.uid = uid;
        obj.num = DayNum;
        return obj;
    },

    //绑定代理
    BingDingAgent: function (uid, agentid) {
        var obj = new Object();
        obj.uid = uid;
        obj.tuijianma = agentid;
        return obj;
    },


    //乐币排行榜
    LeMoneyWin: function (_uid, _page) {
        var obj = new Object();
        obj.uid = _uid;
        obj.page = _page;
        return obj;
    },

    //历史战绩查询 总
    RePlay: function RePlay(_uid, _gametype) {
        var obj = new Object();
        obj.uid = _uid;
        obj.gameid = _gametype;
        return obj;
    },
    ReItemPlay: function (_uid, _order) {
        var obj = new Object();
        obj.uid = _uid;
        obj.orderid = _order;
        return obj;
    },

    //加载房间内消息
    enterRoom: function (_uid, _subNetId) {
        var obj = new Object()
        obj.uid = _uid;
        obj.zinetid = _subNetId;
        return obj;
    },

    //=========================================================HTTP==========================================
    //注：http发送结构体请求，必须有reqtype, uid字段

    //用户登录
    HttpLogin(uid, pwd) {
        var Obj = new Object();
        Obj.reqtype = "login";
        Obj.uid = uid;                        //用户Id
        Obj.pwd = pwd;             //用户密码
        return Obj;
    },
    //用户支付
    ShopPay(uid, money, pingtai, zftype) {
        var Obj = new Object();
        Obj.uid = uid;
        Obj.money = money;
        Obj.pingtai = pingtai;
        Obj.zftype = zftype;
        return Obj;
    },

    //文字，表情发送
    chatMsgFace(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        obj.idx = data.idx;
        return obj;
    },

    // 魔法表情
    chatMagicFace(data) {
        var obj = new Object();
        obj.uid = data.uid;
        obj.zinetid = data.zinetid;
        obj.idx = data.idx;
        obj.sendwxid = data.targetWxId;
        return obj;
    },
    //认证
    realName(uid, cardid, realname) {
        var obj = new Object();
        obj.uid = uid;
        obj.cardid = cardid;
        obj.realname = realname;
        return obj;
    },
    // 微信分享成功告诉服务器
    shareSend (data) {
        var obj = new Object();
        obj.uid = data.uid;
        return obj;
    },
    // 请求充值记录
    chargeRecordSend (data) {
        var obj = new Object();
        obj.uid = data.uid;
        return obj;
    },
}

