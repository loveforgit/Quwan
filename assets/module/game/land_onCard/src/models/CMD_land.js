//by yky
//斗地主消息定义

module.exports = {
    playerCount: 3,                //玩家人数
    MAIN_MSG_ID: 300,             //主消息id
    //服务器命令结构
    //Receive 接收
    //send    发送 
    SUB_R_READY: 80,               //玩家准备
    SUB_R_USER_INFO: 1,           //玩家信息
    SUB_R_GETMY_CARD: 100,         //获取自己手牌
    SUB_R_CALL_LAND: 120,          //提示叫地主
    SUB_R_GET_LAND: 180,          //拿到地主
    SUB_R_THREE_CARD: 190,          //三张底牌
    SUB_R_PROMPT_SEND_CARD: 200,   //提示出牌
    SUB_S_PLAY_CARDS: 210,         //出牌消息
    SUB_R_MYSELF_CARDS: 220,       //获取自己手牌 
    SUB_R_TIPS_SEND_CARD: 230,     //提示管牌/出牌 
    SUB_R_SEND_ERROR: 211,         //出牌不合法
    SUB_R_SEND_CANOT: 212,         //管不住
    SUB_R_NOT_SEND: 240,           //玩家不出
    SUB_R_LIT_RESULT: 250,         //小结算
    SUB_R_BIG_RESULT: 260,         //大结算
    SUB_R_REFRESH_BASE_SCORE: 170, //刷新倍数底分
    SUB_R_PLAYER_SCORE: 270,       //刷新玩家分数
    SUB_R_GAMES_COUNT: 280,        //刷新游戏局数, 玩家继续下一局
    SUB_S_CALL_LAND: 150,          //提交叫地主
    SUB_S_NOT_SEND_CARD: 240,      //提示不管牌
    SUB_S_TRUSTEESHIP: 290,        //托管
    SUB_S_NOT_TRUSTEESHIP: 291,    //取消托管     
    SUB_S_POKER_TYPE_SOUNDE: 310,   //牌型音效
    SUB_S_TIP_ADDBEI: 320,            //是否加倍
    SUB_S_SEND_JIABEI: 330,          //发送加倍不加倍
}