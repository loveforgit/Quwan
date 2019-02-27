module.exports = {
  //登录
  LOGIN_REQUEST: 1,
  //接收服务端推送的个人信息
  MYPLAYER_INFO_RESPONSE: 3,
  //发送创建房间
  CREATE_ROOM_REQUEST: 18,
  //发到服务端的心跳请求
  HEART_CLIENT_TO_SERVER_REQUEST: 2,
  //接收到来自服务器心跳应答
  HEART_SERVER_TO_CLIENT_RESPONSE: 2,
  //接收到来自服务器心跳请求
  HEART_SERVER_TO_CLIENT_REQUEST: 10,
  //发送房间号
  JOIN_ROONID_RESPONSE: 19,

  //接收断线重连消息
  SOCKET_CLOSE_RECONTIN_CONNECT: 1000,

  //公告
  NOTICE: 5301,

  //错误提示 404
  ERROR_RESPONSE: 404,

  YANTAI_MJ_GAME_BIG_NETID: 100,               // 烟台麻将
  MOPING_MJ_GAME_BIG_NETID: 200,               // 牟平麻将

  LEAVE_ROOM_MAIN_ID: 5000,                      //解散房间 (玩家要离开房间请求，当房主要离开时 就认为要解散房间) , 主字段
  PLAYER_APPLY_DISSOLUTION: 1,                   //有玩家申请解散，弹出申请面板
  POP_DISSOLUTION: 2,                            //当游戏已开始，房间申请解散，需要弹出解散面板
  CALL_ALLPLAYER_DISSOLUTION: 3,                  //广播 提交解散信息散
  RESULT_DISSOLUTION: 4,                         //当有人拒绝或者所有人同意时，发送处理结果
  LONG_TIME_NOT_READY: 5,                        //长时间未准备，弹出框，确认回到大厅

  CHAT_MSG_FACE_MAIN_ID: 5100,               // 语音聊天系统
  SMALL_MSG_ID: 11,                          // 文字小消息     
  SMALL_FACE_ID: 12,                         // 表情
  SMALL_MAGIC_FACE_ID: 13,                   // 魔法表情
  SMALL_MSGINPUT_ID: 15,                      // 聊天文字

  //公告消息监听
  NOTICE_MASSAGE: 5300,

  PLAYER_IN_ROOM_IS_ONLINE: 50,               //玩家在游戏房间里，是否处于断线状态

  // ENTER_GOLD_ROOM: 30,                       //进入金币房间
  // REQUEST_GOLD_ROOM_INFO : 80,               //请求金币场配置

  //查询有没有在房间内
  REQUEST_PLAYER_IN_ROOM: 20,
  REOLACE_LIST: 17,                      //代开列表
  DISSOLVE_DAIKAIROOM: 5001,                      //解散代开房间
  //购买vip
  BUY_VIP: 21,                                //购买vip请求

  //查询当月签到总天数
  SINGIN_ALLNUM_RESPONSE: 9,
  //点击签到
  SINGIN_RESPONSE: 10,
  //签到消息查询
  SINGIN_MSG_RESPONSE: 11,
  //签到领奖
  SINGIN_PRIZE_RESPONSE: 12,
  //绑定代理
  BINGDING_AGENT_RESPONSE: 5,
  //解除绑定代理
  CHANE_AGENT_RESPONSE: 6,
  //查询代理信息
  LOOK_AGENT_RESPONSE: 8,
  //乐币排行榜
  LEMONTY_RESPONSE: 15,
  //战绩总查询
  REPLAY_RESPONSE: 60,
  //战绩回放
  REPLAY_ITEM_RESPONSE: 70,
  //支付
  PAY_RESPONSE: 5200,
  //认证
  RESAL_NAME: 40,
  // 乐币不足提示
  COIN_INSUFFICIENT: 24,
  // 获取补助
  COIN_SUBSIDY: 25,
  // 告诉服务器微信分享成功
  SHARE_WX_CALLBACK_SEND: 16,
  // 查询充值记录
  CHARGE_RECORD_SEND: 5210,
  // 充值成功返回
  CHARGE_SUCCESS_RET: 5201,
  // 自动弹出充值记录
  CHARGE_SHOW_RET: 26,
  //反馈
  WRITE_FEEDBACK: 41,
  WRITE_FEEDBACK_SUGGEST: 1,
  WRITE_FEEDBACK_QUESTION: 2,

  //炸金花匹配场
  ENTER_GOLD_ROOM: 30,
  SUB_REQUEST_MATCH_INFO: 80,
  CHANGE_TABLE: 5120,                        //换桌
  HUNDRED_JOIN_ROOM: 4010,              //百人牛牛加入间

  TUITONGZI_JOIN_ROOM: 3100,         //百人推筒子


  ///----------------银行系统
  BANK_MAIN: 3200,
  BANK_CHECKBANK: 1,    //点击银行按钮
  BANK_ZHUCEBANK: 2,       //注册银行
  BANK_LOGONBANK: 3,       //登录银行
  BANK_REFLOGINPWD: 4,     //修改登录密码
  BANK_REFTACKPWD: 5,      //修改取款密码
  BANK_TACKJINBI: 6,       //提现

  //暂离
  SUB_S_ZANLI: 3106,
  //暂离小消息
  SUB_S_ZI_ZANLI: 1,
  //================定位系统===================
  // 发送定位信息
  LOCATION_SEND: 35,
  // 获取定位信息
  GET_LOCATION_ID: 36,
  //================定位系统===================

  //-------------------俱乐部系统
     //俱乐部系统
     CLUB_MAIN_ID: 7000,                         //俱乐部系统，主消息号
     SMALL_REQUEST_CLUB: 1,                     //查询俱乐部
     SMALL_CREATE_CLUB: 2,                      //玩家创建俱乐部
     SMALL_RESET_CLUB: 3,                       //玩家修改俱乐部
     SMALL_PLAYER_APPLY_CLUB: 4,                //玩家申请加入某个俱乐部
     SMALL_REQUEST_CLUB_ALLPLAYER: 5,           //查询一个俱乐部中所有成员
     SMALL_REQUEST_CLUB_ALL_ROOM: 6,            //查询一个俱乐部中所有房间
     SMALL_CLUB_MESSAGE: 7,                     //查询一个俱乐部中信息
     SMALL_DISSOLUTION_CLUB: 8,                //解散某个俱乐部
     SMALL_CLUB_MASTER_REQUEST_MESSAGE: 9,      //俱乐部群主 主动查询 某个俱乐部是否有 申请消息 
     SMALL_AGREE_PLAYER_JOIN_MYCLUB: 10,        //同意某个玩家加入我的俱乐部
     SAMLL_REFUSE_PLAYER_JOIN_MYCLUB: 11,       //拒绝某个玩家加入我的俱乐部
     SAMLL_DELETE_PLAYER_IN_CLUB: 12,           //俱乐部内删除某个玩家
     SAMLL_HIDE_PLYAER_APPLY: 13,               //俱乐部内屏蔽某个玩家的申请
     SAMLL_EXIT_CLUB: 14,                       //玩家退出某个俱乐部
     SAMLL_REFRESH_CLUB: 15,                       //刷新俱乐部
     SAMLL_CLUB_PLAYER_INFO: 16,                //俱乐部玩家详情
     SAMLL_GETUSERIMAGE_CLUB: 17,          //俱乐部 牛牛、麻将四人进园子 桌子上的玩家头像 
     SMALL_INVITEUSER_CLUB: 20,                   //邀请玩家加入俱乐部
     SMALL_INTEGRAL_CLUB: 24,                   //俱乐部上下积分
     SMALL_SETMANAGENT_CLUB: 28,                  // 设置成员为管理员\合伙人 28
     SMALL_GETMANAGENT_CLUB: 30,                  // 点击管理面板获取信息【是否有管理员】
     SMALL_DELMANAGENT_CLUB: 33,                  //删除管理
     SMALL_GETRULE_CLUB: 36,                      //获取规则
     SMALL_QUERYINTEGRAL_CLUB: 37,                //获取上下分详情
     SMALL_QUERYTimeINTEGRAL_CLUB: 38,                //根据时间段获取上下分详情
     SMALL_QUERYPARTNERList_CLUB: 25,               //查询合伙人列表
     SMALL_DELPARTNERList_CLUB: 26,               //合伙人的删除
     SMALL_PARTNER_CLUB: 27,                   //俱乐部合伙人 的消费情况
     SMALL_Fund_CLUB: 32,              //俱乐部基金
 
     SMALL_USERINTEGRAL_CLUB: 34,              //俱乐部 个人 积分
}

