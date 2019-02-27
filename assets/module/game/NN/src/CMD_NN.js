//by cdl
//牛牛消息定义

module.exports = {
    isGameBegin:false,  //游戏是否开始
    playerCount: 6,            //玩家人数
    MAIN_MSG_ID: 400,         //主消息id

    //服务器命令结构
    //Receive 接收
    //send    发送 
    SUB_SHOW_STATE: 60,              //可以点击开始按钮
    SUB_SI_DOWN: 70,                 //玩家坐下
    SUB_R_READY: 80,                 //玩家准备
    SUB_R_USER_INFO: 1,              //房间信息
    SUB_STATE_GAME: 90,              //开始游戏
    SUB_R_GETMY_CARD: 100,           //发牌
    SUB_R_QIANGZUANG: 120,           //提示抢庄
    SUB_R_TUIZHU: 121,           //显示可推注

    SUB_R_SBUMIT: 130,               //提交抢庄
    SUB_R_SBUMIT_RESULT: 140,        //抢庄结果
    SUB_R_HINT_XIAZHU: 150,          //提示下注
    SUB_R_SUBMIT_XIAZHU: 160,        //提交结果
    SUB_R_XIAZHU_RESULT: 170,        //下注结束 提示亮牌
    SUB_R_LOOK_FIRECARD: 180,        //看第五张牌
    SUB_S_LOOK_MYTOSHOWCARD:190,    //亮牌给自己
    SUB_R_DISCARD: 350,              //亮牌
    SUB_R_ALLSHOWCARD: 360,              //最后统一亮牌
    SUB_R_DISCARDINFO: 351,           //后加消息 谁看牌了
    SUB_R_CUOCARD: 340,                //搓牌
    SUB_R_MIN_RESULT: 220,           //小结算
    SUB_R_MAX_RESULT: 230,           //大结算
    SUB_R_JIANGCHI: 950,             //奖池
    SUB_R_JIANGCHI_NAME: 900,        //爆奖人
    SUB_R_HINT_READY: 410,           //提示准备
    SUB_R_READY_SUER: 420,            //准备过的人
    SUB_R_CLEAR_DESKTOP_CARD:430,       //清理桌面的数据   和准备同时接受
    HINT_END: 0,                         //提示结束 
    SUB_R_UPDATE_COIN: 132,              //更新玩家金币/输赢
    SUB_CLEARZHU: 165,            //未做下的人清除下注数据
    SUB_SHOWCORDNODE:260, //请求要牌界面开启
    SUB_QX:270, //要牌
    SUB_SHANGJUHUIGU:440, // 上局回顾

}