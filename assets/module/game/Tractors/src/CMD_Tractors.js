//by cdl
//炸金花消息定义

module.exports = {
    playerCount: 7,            //玩家人数
    MAIN_MSG_ID: 500,         //主消息id
    //服务器命令结构
    //Receive 接收
    //send    发送 
    SUB_R_READY: 80,             //玩家准备
    SUB_R_USER_INFO: 1,          //房间信息
    SUB_R_USERPLAY: 2,            //加注个人信息配置
    SUB_R_UPDATE_INFO: 3,        //更新玩家信息
    SUB_R_GETMY_CARD: 100,       //获取自己手牌
    SUB_R_CALL_CHOSE: 120,       //轮到该玩家操作
    SUB_R_PULL_MONEY: 130,       //提交下注
    SUB_R_LOOK_CARDS: 135,       //请求看牌
    SUB_R_DISCARD: 140,          //弃牌
    SUB_R_PVP_CARD: 170,         //比牌
    SBU_R_SETTLE_ACCOUNTS: 250,  //小结算
    SUB_R_SETTLE_MAX: 260,       //大结算
    SBU_R_SETTLE_BASE: 270,       //小结算分数
    SUB_R_whell: 131,              //轮数
    SUB_R_COIN_NUM: 132,           //乐币更新
    SUB_R_ZHUANG: 95,               //庄家
    SUB_R_GLOD_RETURN: 280,         //金币场继续
    SUB_R_MAX_CLIP: 160,            //当前可下注
    SUB_R_END_TRUSTEESHIP: 290,         //托管
    SUB_R_CHANE_TRUSTEESHIP: 291,    // 取消托管
    SUB_R_START_GAME: 91,              //开始游戏显示
    SUB_R_START_GAMEEND: 90,            //点击开始游戏
    SUB_R_LOSET: 171,                //断线重连后玩家状态
    SUB_R_ALLDOWNCLIP: 133,          //桌面上的总注

    //作弊
    SUB_S_ZUOBI: 310,

    SUB_R_SUPER: 300,              //开启超端
    //刷新房间规则
    SUB_R_RULEINFO: 320,
}