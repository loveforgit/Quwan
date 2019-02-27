// 麻将消息定义

module.exports = {
    JOIN_ROOM_SMALLID_RET: 1,               //加入房间后刷新房间人信息
    PLYAER_PREPARED_SMALLID_RET: 80,        //玩家准备了
    GAME_START_SMALLID_RET: 90,             //开始游戏
    ZHUANG_SMALLID_RET: 95,                 //刷新庄家信息
    FA_PAI_SMALLID_RET: 100,                //发牌消息
    GAME_TIPS_SMALL_NETID: 110,             //游戏温馨提示(玩家xx与yy距离过近)
    MOPAI_SMALLID_RET: 200,                 //摸牌
    CHU_PAI_SMALL_NETID: 210,               //出牌
    PENG_GANG_HU_TIP_SMALLID_RET: 220,      //碰杠胡提示
    PENG_GANG_HU_OPT_SMALLID_SED: 240,      //提交碰杠胡
    TING_PAI_SMALLID_RET: 260,              //停牌提示
    PGH_RE_HOLDS_SMALLID_RET: 280,          //碰杠胡操作后 刷新碰杠人的手牌区（只会发给碰杠操作者自己）
    PGH_RE_PGQUYU_SMALLID_RET: 300,         //碰杠胡操作后 刷新碰杠者的碰杠区(通知所有人)
    PGH_RE_HOLDCOUNTS_SMALLID_RET: 500,     //碰杠胡操作后 刷新操作碰杠者的手牌区小消息
    PGH_RE_FOLDS_SMALLID_RET: 600,          //碰杠胡操作后 刷新打牌人的打牌区(通知所有人)
    MINGLOU_TIP_SMALLID_RET: 310,           //提示明楼消息(显示过 和 明楼按钮)
    MINGLOU_SMALLID_SEND: 320,              //提交明楼
    SMALL_RESULT_SMALLID_RET: 800,          //显示小结算
    BIG_RESULT_SMALLID_RET: 900,            //显示大结算 
    SMALL_BUY_HOUSE_RET:810,                //显示买马
    GAME_CONTINUE: 1300,                    //继续
    MOPING_XUNI5_TIP_SMALLID_RET: 150,      //提示可选的虚拟五
    MOPING_XUNI5_SMALLID_SEND: 160,         //提交选择的 虚拟5 的牌
    MOPING_XUNI5_GANG_SMALLID_SEND: 161,    //提交杠出的 虚拟5 的牌
    MOPING_XUNI5_GANG_SMALLID_RET: 162,     //虚拟5后的杠提示
    REFRESH_COIN_SMALLID_RET: 750,          //刷新每个人的金币
    GANG_DING_SMALLID_RET: 101,             //杠锭消息 开局推送，杠锭后 也刷
    TEST_REQ_MJ_SEND: 2420,                 //测试用要牌
    REFRESH_GAME_VIRTUAL_FIVE_RET: 155,     //刷新桌面上的虚拟五
    HAIDIPAI_TIP_RET: 212,                  //海底牌提示
    JIN_RET: 120,                           //开金消息
    HUAPAI_RET: 270,                        //花牌消息
    LOCATION_MAIN:37,                       //定位
    DIRECTION_MAIN:330,                     //显示方向
    GETMJFORSERVE_RES: 2410,                //要牌
    ROOMREPLAYINFO:70,                      //战绩小结算
    SHOWOTHERHOLDS:230,                     //牌局结束显示所有玩家的手牌
    PLAYAUDIOBUHUA:271,                     //播放补花音效
    PLAYGENZHUANG:340,                      //跟庄
    TINGPAI_TIP: 290,                       //听牌提示按钮
    XIAPAO_TIP_RET: 192,                    //提示下跑
    PAOFEN_NETID: 193,                      //提交跑分
    XIAPAO_RESULT_RET: 194,                 //全部下跑结果
    DING_QUE_TIP_RET: 170,                  //提示定缺
    DING_QUE_SEND: 180,                     //提交定缺
    DING_QUE_RET: 190,                      //定缺结果
}
