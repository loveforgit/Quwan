//by yky
//预加载资源文件
var ymtalk = require("youmetalk")
var comm = require("Comm")

function initGlobalMgr() {
    cc.globalMgr = {};
    cc.globalMgr.msgIds = require("MsgIds");
    cc.globalMgr.msgObjs = require("MsgObjs");
    cc.globalMgr.service = require("Service");
    cc.globalMgr.EventManager = require("EventManager");
    cc.globalMgr.SceneManager = require("SceneManager");
    var socketControl = require("C_WSocketControl")
    cc.globalMgr.socketControl = new socketControl()

    cc.globalMgr.XlSDK = require("XlSDK");
    var GlobalFunc = require("GlobalFunc");
    cc.globalMgr.globalFunc = new GlobalFunc();

    var GameFrameEngine = require("GameFrameEngine")
    cc.globalMgr.GameFrameEngine = new GameFrameEngine()

    var AudioMgr = require("AudioMgr");
    cc.globalMgr.audioMgr = new AudioMgr();

    var VoiceFrame = require("VoiceFrame")
    cc.globalMgr.voiceFrame = new VoiceFrame()

    //回放控制器
    var GameRePlayControl = require("GameRePlayControl")
    cc.globalMgr.GameRePlayControl = new GameRePlayControl()

    cc.globalMgr.seatIndexType = {
        seatIndexType_me: 0,
        seatIndexType_right: 1,
        seatIndexType_up: 2,
        seatIndexType_left: 3,
    };
}

cc.Class({
    extends: cc.Component,

    properties: {
        label_tips: {
            default: null,
            type: cc.Label
        },
        ProgressBar: {
            default: null,
            type: cc.ProgressBar
        }
    },

    onLoad() {
        initGlobalMgr();

        this.loadGlobalRes(this, this.loadResult);
        //在加载的过程中初始化语音引擎
        //如果是原生平台，调用微信登录
        cc.globalMgr.voiceFrame.initVoice()

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("game event hide");
            cc.globalMgr.voiceFrame.LeaveRoom()
            //暂停背景音乐
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("game event show", G.currentRoomId);
            if (G.currentRoomId != 0) {
                cc.log("游戏开始状态，玩家进入房号 " + G.currentRoomId + " 房间号")
                cc.globalMgr.voiceFrame.JoinRoom(G.currentRoomId, G.myPlayerInfo.wxId)
            }

            //开启背景音乐
            cc.audioEngine.resumeAll();
        });

        //初始化设置窗口尺寸
        G.WinSize = cc.director.getWinSize()
        //资源是否加载完成
        this._loadSuccess = false
        //开启定时器
        this._startTime = 0
    },

    //时间增加
    timeAdd() {
        this._startTime++
        this.ProgressBar.progress = this._startTime / 11
        //资源加载成功，跳转到登录界面
        if (this._loadSuccess == true && this._startTime >= 11) {
            this.unschedule(this.timeAdd)
            cc.globalMgr.SceneManager.getInstance().loadScene("Logon")
        }

    },

    loadGlobalRes(target, func) {
        this.target = target;
        this.func = func;
        //加载预制体资源
        var loadResName = {
            "prefabs/comm/prefab_dissolution": "dissolution",
            "prefabs/comm/prefab_loading": 'waitingConnectionPrb',
            'prefabs/comm/prefab_messageBox': 'messageBoxPrb',
            "prefabs/comm/prefab_chat1": 'chatLayerPrb',
            "prefabs/comm/prefab_chatMsgTip": "chatMsgTipPrb",
            "prefabs/comm/prefab_faceAnim": "chatFaceAnimPrb",
            "prefabs/comm/prefab_gameUserinfo": "gameUserInfoPrb",
            "prefabs/comm/prefab_voice": "voicePrb",
            "prefabs/comm/prefab_aniVoice": "aniVoice",
            "prefabs/comm/prefab_magicFaceAnim": "magicFaceAnimPrb",
            //翻牌
            "prefabs/comm/prefab_drawCard": "prefab_drawCard",
            "prefabs/comm/prefab_childGameUpdate": "childGameUpdate",
            "prefabs/home/prefab_Data": "prefab_Data",

            // //创建郑州麻将房间
            // 'prefabs/home/node_createMahjongRoom': 'runNode_createMahjongRoom',
            //创建房间地图
            'prefabs/home/node_createRoom': 'runNode_createRoom',
            //创建推筒子房间
            // 'prefabs/home/node_createPushBubbinRoom': 'runNode_createPushBubbinRoom',
            // //创建房间
            //'prefabs/home/node_createRoom': 'runNode_createRoom',
            // // 扎金花创建房间
            // 'prefabs/home/node_createTractors': 'runNode_createTractorsRoom',
            // //牛牛创建房间
            // 'prefabs/home/nn/prefab_createNNroom': 'runNode_createNNRoom',
            //  //创建斗地主房间
            //  'prefabs/home/node_createDDZ': 'runNode_createDDZRoom',
            //加入房间
            'prefabs/home/layer_JoinRoom': 'runLayer_JoinRoom',
            //分享
            'prefabs/home/prefab_Share': 'runPrefab_Share',
            //战绩
            'prefabs/home/prefab_RePlay': 'runPrefab_RePlay',
            //战绩layout模板
            'prefabs/home/node_itemTemplate': 'runNode_itemTemplate',
            //战绩item
            'prefabs/home/node_rePlayItem': 'runNode_rePlayItem',
            //商店
            'prefabs/home/prefab_Shop': 'runPrefab_Shop',
            //个人主页
            'prefabs/home/node_PlayInfo': 'runNode_PlayInfo',
            //实名认证
            'prefabs/home/prefab_RealName': 'runPrefab_RealName',
            //设置
            'prefabs/home/prefab_Setting': 'runPrefab_Setting',
            //客服
            'prefabs/home/prefab_Service': 'runPrefab_Service',
            //签到
            'prefabs/home/prefab_SingIn': 'runPrefab_SingIn',
            //会员充值
            'prefabs/home/prefab_VipPay': 'runPrefab_VipPay',
            //邀请码
            'prefabs/home/prefab_BangVIP': 'runPrefab_BangVIP',
            //绑定手机
            'prefabs/home/prefab_binding': 'runPrefab_binding',
            //银行系统
            'prefabs/home/prefab_Bank': 'runPrefab_Bank',
            //每日任务
            'prefabs/home/prefab_dailytask': 'runPrefab_DailyTask',
            //排名
            'prefabs/home/prefab_rankingOpen': 'runPrefab_RankingOpen',
            //反馈
            'prefabs/home/prefab_feedback': 'runPrefab_Feedback',
            //玩法
            'prefabs/home/prefab_Playingmethod': 'runPrefab_PlayingMethod',
            //规则
            'prefabs/home/prefab_Rule': 'runPrefab_Rule',

            //设置公告
            'prefabs/home/prefab_accountLogin': 'accountLogin',
            //公告
            'prefabs/home/prefab_notice': "runprefab_notice",
            //纸牌类主界面
            'prefabs/ddz/cardClassList': 'runCardClassList',
            //纸牌选择界面
            'prefabs/ddz/cardSelectList': 'runCardSelectList',
            //约牌界面
            'prefabs/ddz/arrangeCard': 'runArrangeCardPrb',
            // //创建炸金花
            // 'prefabs/Tractors/node_createTractors': 'runCreateTractorsprb',
            //麻将类
            "prefabs/mahjong/prefab_mahjongClassList": "runMahjongClassList",
            //-----------------------百人推筒子------------------
            //vip头像
            'prefabs/tuiTongZi/vipHeadNode': 'runVipHeadNode',
            //设置小界面
            'prefabs/tuiTongZi/prefab_SettingForTongZi': 'runSettingForTongZi',

            // -------------------------斗地主----------------------

            // 'prefabs/land_onCard/prefabs/land_Setting': 'land_Setting',

              

            // -------------------------俱乐部模块----------------------
            //俱乐部
            'prefabs/home/club/prefab_club': 'runClub',
            //设置俱乐部子界面
            'prefabs/home/club/prefab_settingBox': 'runSettingBox',
            //消息俱乐部子背景界面
            'prefabs/home/club/prefab_newsBox': 'runNewsBox',
            //会员俱乐部子界面
            'prefabs/home/club/prefab_memberBox': 'runMemberBox',
            'prefabs/home/club/prefab_memberBoxTwo': 'runMemberBoxTwo',
            //搜索会员
            'prefabs/home/club/prefab_memberBoxSeekUser': 'runSeekUser',
            //高级设置
            'prefabs/home/club/prefab_club_gaoJiSetting': 'runGaoJiSetting',
            //积分房 比赛设置  
            'prefabs/home/club/prefab_Club_competition': 'runClub_competition',
            //设置公告
            'prefabs/home/club/prefab_setNotice': 'runSetNotice',







            //修改俱乐部名字子界面
            'prefabs/home/club/prefab_changeNameForClubBox': 'runChangeNameForClubBox',
            //解散俱乐部子界面
            'prefabs/home/club/prefab_dissolutionForClubBox': 'runDissolutionForClubBox',
            //俱乐部玩家详情
            'prefabs/home/club/prefab_memberInfo': 'runMemberInfo',
            //魅力值修改
            'prefabs/home/club/prefab_ChangeGlamouer': 'runChangeGlamouer',
            //创建房间玩法选择界面
            'prefabs/home/club/prefab_selectGameType': 'runSelectGameType',
            'prefabs/home/club/prefab_Club_RoomInfo': 'runDesktopRoomInfo',
            //添加基金
            'prefabs/home/club/prefab_club_AddFund': 'runAddFund',
            //帮助
            'prefabs/home/club/prefab_club_help': 'runClub_help',

            //------------------新增-----------------------------------
            //加入房间面板：
            'prefabs/home/club/prefab_club_Join': 'runprefab_club_Join',
            //基金
            'prefabs/home/club/prefab_club_fund': 'runprefab_club_fund',
            //合伙人管理
            'prefabs/home/club/prefab_club_partner': 'runprefab_club_partner',
            //合伙人列表     
            'prefabs/home/club/prefab_club_partnerList': 'runprefab_club_partnerList',
            //管理   
            'prefabs/home/club/prefab_club_management': 'runPrefab_club_management',
            //上下积分查询
            'prefabs/home/club/parfab_club_jiFenCor': 'runjiFenCor',
            //根据时间段查询积分
            'prefabs/home/club/prefab_Club_RulejiFen': 'runRulejiFen',

            'prefabs/home/nn/node_MaxResult': 'node_MaxResult', //牛牛大结算
            'prefabs/home/nn/prefab_NNChossCard': 'runPrefab_NNChossCard',  //要牌界面

        }
        cc.globalRes = {};

        this.loadResCount = 0
        var arr = Object.keys(loadResName);
        this.ResCount = arr.length;
        var that = this;
        Object.keys(loadResName).forEach(function (key) {
            cc.loader.loadRes(key, function (err, prefab) {
                if (err) {
                    cc.log("load prefabs" + loadResName[key] + "error");
                    cc.error(err.message || err);
                    return;
                }
                that.loadResCount++;
                if (that.target != undefined && that.func != undefined) {
                    that.func(target, that.loadResCount, that.ResCount);
                }
                cc.globalRes[loadResName[key]] = prefab;
            });
        })
    },

    //预加载资源结果
    loadResult(target, loadResCount, ResCount) {
        console.log("loadResCount",loadResCount);
        console.log("ResCount",ResCount);
        //target.label_tips.string = "正在加载资源(" + loadResCount + "/" + ResCount + ")," + "请稍后...";
        this.ProgressBar.progress = loadResCount / ResCount
        //资源加载成功，跳转到登录界面
        if (loadResCount == ResCount) {
            cc.globalMgr.SceneManager.getInstance().loadScene("Logon")
        }
    },
});



