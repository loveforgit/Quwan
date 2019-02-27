/** 
 * 调用代码（测试用）：
 * var ymtalk = require("youmetalk");
 * cc.eventManager.addListener({
		event: cc.EventListener.CUSTOM,    
		eventName: ymtalk.YMEvt.evt_common,
		callback: function (event) {
                var obj = event.getUserData();
                switch(obj.event){
                    case 0:
                    ymtalk.youmetalk.talk_JoinChannelSingleMode("userid", "roomid", roletype, false);
                    break;
                }
			}
		}, 1);
 * ymtalk.init(ymtalk._testKey, ymtalk._testSecret);
 * 
 * 
 * 
*/

var ymtalk_module = {

    YMRoleType: {
        rt_none:0,              ///< 非法用户，调用API时不能传此参数
        rt_talkfree:1,          ///< 自由讲话者，适用于小组通话（建议小组成员数最多10个），每个人都可以随时讲话, 同一个时刻只能在一个语音频道里面
        rt_talklimit:2,         ///< 有限制的讲话者（暂不用）
        rt_listener:3,          ///< 听众，主播/指挥的听众，同一个时刻只能在一个语音频道里面，只听不讲
        rt_command:4,           ///< 指挥，国家/帮派等的指挥官，同一个时刻只能在一个语音频道里面，可以随时讲话，可以播放背景音乐，戴耳机情况下可以监听自己语音
        rt_host:5,              ///< 主播，广播型语音频道的主持人，同一个时刻只能在一个语音频道里面，可以随时讲话，可以播放背景音乐，戴耳机情况下可以监听自己语音
        rt_guest:6              ///< 嘉宾，主播或指挥邀请的连麦嘉宾，同一个时刻只能在一个语音频道里面， 可以随时讲话
    },

    YMEvt: {
        evt_tips: "YMTips",                   ///< 提示消息，包括文字与错误码
        evt_restapi:"YMRestApi",              ///< RestApi请求的结果通知，包括请求id、错误码、请求命令以及返回值
        evt_memchange:"YMMemberChange",       ///< 成员变更通知，包括频道id、成员json字符串、和一个update标识
        evt_broadcast:"YMBroadcast",          ///< 频道广播，包括频道id、广播类型（目前是抢连麦）、三个通知字符串
        evt_common:"YMCommon",                ///< 主要的事件通知，包括频道id、事件类型、错误码和对应参数
    },

    // tip通知
    addTips: function( strTips, errcode ){
        var err = errcode != undefined? errcode: 0;
        var event = new cc.EventCustom(this.YMEvt.evt_tips);
        var p = {
            msg: strTips,
            error: err
        };
        event.setUserData( p );
        cc.eventManager.dispatchEvent( event );
    },

    // RestApi请求的结果通知
    _restapiNotify: function(reqid, errcode, command, result){
        var event = new cc.EventCustom(this.YMEvt.evt_restapi);
        var p = {
            cmd: command,
            error: errcode,
            requestid: reqid,
            res: result
        };
        event.setUserData( p );
        cc.eventManager.dispatchEvent( event );       
    },

    // 成员变更通知
    _memchangeNotify: function(cnid, memjson, bupdate){
        var event = new cc.EventCustom(this.YMEvt.evt_memchange);
        var p = {
            channel: cnid,
            memberstr: memjson,
            isupdate: bupdate
        };
        event.setUserData( p );
        cc.eventManager.dispatchEvent( event );   
    },

    // 频道广播
    _channelNotify: function(bctype, cnid, p1, p2, con){
        var event = new cc.EventCustom(this.YMEvt.evt_broadcast);
        var p = {
            channel: cnid,
            notifytype: bctype,
            param1: p1,
            param2: p2,
            content: con
        };
        event.setUserData( p );
        cc.eventManager.dispatchEvent( event );   
    },

    // 主要的事件通知
    _commonNotify: function(notifytype,  errcode, cnid, pra){
        var event = new cc.EventCustom(this.YMEvt.evt_common);
        var p = {
            channel: cnid,
            error: errcode,
            event: notifytype,
            param: pra
        };
        event.setUserData( p );
        cc.eventManager.dispatchEvent( event );  
    },

    // 随机生成userid（测试用）
    randomID: function(){
        return "userid_" + Math.ceil(Math.random()*100000);
    },

    // 众鑫用appkey 
    _testKey: "YOUMEE8A5DF3872C7E37C282C47709CA703E7DAAFC394",
    // 众鑫用appsecret
    _testSecret: "8YLh50zHVwpXdtS0IUbrilI2fACaFriDTRaTnTdxnKK0GnNSRero/VQiHEwMhkWBsTYihTPuRE3wVbeSv/m4XEcVRWVBIQNQepIB1xdBhsqUuTNuV3vFOhtIo5hpE7b8uoXPjL9jLPCeqj3TtMfOfoLYv0jSCld84/LMj5Rayc0BAAE=",
    // 众鑫用频道id
    _testroomName: "44624513c2878434ca965e8b04ab970b",

    // SDK对象，可通过此对象直接调用sdk函数
    youmetalk: null,

    // SDK是否初始化成功
    isinited: false,

    // SDK对象初始化
    init: function(appkey, appsecret, regionid, exregionname){
        if(this.isinited){
            this.addTips("初始化已完成");           
            return true;
        }
        this.addTips("开始初始化...");
        var self = this;
        if(this.youmetalk == null){
            this.youmetalk = new YouMeTalk();
            this.youmetalk.OnRequestRestApi = function( requestid, errcode, command, result ){
                cc.log("OnRequestRestApi:%d,%d", requestid, errcode );
                cc.log("command:%s", command );
                cc.log("result:%s", result );
                self._restapiNotify(requestid, errcode, command, result);
            }
            
            this.youmetalk.OnMemberChange = function (channel, memberListJsonString, isUpdate){
                cc.log("OnMemberChange");
                cc.log("OnMemberChange:%s,%s,%s", channel,  memberListJsonString ,isUpdate);
                //memberListJsonString eg: {"channelid":"123","memchange":[{"isJoin":true,"userid":"u541"},{"isJoin":true,"userid":"u948"}]}
                self._memchangeNotify(channel, memberListJsonString, isUpdate);
            }
            
            this.youmetalk.OnBroadcast = function(bctype, channel, param1, param2, content){
                switch( bctype){
                    case 1:	//YOUME_BROADCAST_GRABMIC_BROADCAST_GETMIC
                        cc.log("有人抢到了麦");
                        break;
                    case 2:	//YOUME_BROADCAST_GRABMIC_BROADCAST_FREEMIC
                        cc.log("有人释放了麦");
                        break;
                    case 3:	//YOUME_BROADCAST_INVITEMIC_BROADCAST_CONNECT
                        cc.log("A和B正在连麦");
                        break;
                    case 4:	//YOUME_BROADCAST_INVITEMIC_BROADCAST_DISCONNECT
                        cc.log("A和B取消了连麦");
                        break;
                    default:
                        break;
                }
                self._channelNotify(bctype, channel, param1, param2, contentstr);
            }
            
            this.youmetalk.OnEvent = function( event,  errorcode, channel, param )
            {
                cc.log("OnEvent:event_"+event + ",error_" + errorcode + ",channel_" + channel + ",param_" + param)
                switch( event ){
                     case 0: //YOUME_EVENT_INIT_OK:
                        cc.log("Talk 初始化成功");
                        self.addTips("初始化成功");
                        self.isinited = true;
                        //self.youmetalk.talk_JoinChannelSingleMode(g_userID, g_roomName, g_roleType, false);
                        break;
                    case 1://YOUME_EVENT_INIT_FAILED:
                        cc.log("Talk 初始化失败");
                        self.addTips("初始化失败", errorcode);
                        self.isinited = false;
                        break;
                    case 2://YOUME_EVENT_JOIN_OK:
                    {
                        cc.log("Talk 进入房间成功");
                        self.addTips( "进入房间成功，ID：" + channel);
                        //self.youmetalk.talk_SetSpeakerMute(false);
                        //self.youmetalk.talk_SetMicrophoneMute(false);
                    }
                        break;
                    case 3://YOUME_EVENT_JOIN_FAILED:
                        cc.log("Talk 进入房间失败");
                        self.addTips("进入房间失败，ID：" + channel, errorcode);
                        break;
                    case 4://YOUME_EVENT_LEAVED_ONE:
                        cc.log("Talk 离开单个房间");
                        addTips("退出单个房间成功");
                        break;
                    case 5://YOUME_EVENT_LEAVED_ALL:
                        cc.log("Talk 离开所有房间");                    
                        self.addTips("退出所有房间成功");
                        break;
                    case 6://YOUME_EVENT_PAUSED:
                        cc.log("Talk 暂停");
                        self.addTips("暂停语音");
                        break;
                    case 7://YOUME_EVENT_RESUMED:
                        cc.log("Talk 恢复");
                        self.addTips("恢复语音");
                        break;
                    case 8://YOUME_EVENT_SPEAK_SUCCESS:///< 切换对指定频道讲话成功（适用于多频道模式）
                        break;
                    case 9://YOUME_EVENT_SPEAK_FAILED:///< 切换对指定频道讲话失败（适用于多频道模式）
                        break;
                    case 10://YOUME_EVENT_RECONNECTING:///< 断网了，正在重连
                        cc.log("Talk 正在重连");
                        self.addTips("正在重连");
                        break;
                    case 11://YOUME_EVENT_RECONNECTED:///< 断网重连成功
                        cc.log("Talk 重连成功");
                        self.addTips("重连成功");
                        break;
                    case 12://YOUME_EVENT_REC_PERMISSION_STATUS:///< 通知录音权限状态，成功获取权限时错误码为YOUME_SUCCESS，获取失败为YOUME_ERROR_REC_NO_PERMISSION（此时不管麦克风mute状态如何，都没有声音输出）
                        cc.log("录音权限状态,%d",errorcode);
                        break;
                    case 13://YOUME_EVENT_BGM_STOPPED:///< 通知背景音乐播放结束
                        cc.log("背景音乐播放结束,%s",param);
                        self.addTips( "背景音乐播放结束" );
                        break;
                    case 14://YOUME_EVENT_BGM_FAILED:///< 通知背景音乐播放失败
                        cc.log("背景音乐播放失败,%s",param);
                        self.addTips( "背景音乐播放失败", errorcode );
                        break;
                    case 15://YOUME_EVENT_MEMBER_CHANGE:///< 频道成员变化(已停用)
                        cc.log("频道成员变化,%s",param);
                        break;
                    case 16://YOUME_EVENT_OTHERS_MIC_ON:///< 其他用户麦克风打开
                        cc.log("其他用户麦克风打开,%s",param);
                        self.addTips("其他用户麦克风打开" + param);
                        
                        break;
                    case 17://YOUME_EVENT_OTHERS_MIC_OFF:///< 其他用户麦克风关闭
                        cc.log("其他用户麦克风关闭,%s",param);
                        self.addTips("其他用户麦克风关闭" + param);
                        break;
                    case 18://YOUME_EVENT_OTHERS_SPEAKER_ON:///< 其他用户扬声器打开
                        cc.log("其他用户扬声器打开,%s",param);
                        break;
                    case 19://YOUME_EVENT_OTHERS_SPEAKER_OFF: ///< 其他用户扬声器关闭
                        cc.log("其他用户扬声器关闭,%s",param);
                        break;
                    case 20://YOUME_EVENT_OTHERS_VOICE_ON: ///<其他用户进入讲话状态
                        cc.log("其他用户进入讲话状态,%s",param);
                        break;
                    case 21://YOUME_EVENT_OTHERS_VOICE_OFF: ///<其他用户进入静默状态
                        cc.log("其他用户进入静默状态,%s",param);
                        break;
                    case 22://YOUME_EVENT_MY_MIC_LEVEL: ///<麦克风的语音级别
                        cc.log("麦克风的语音级别,%s",param);
                        break;
                    case 23://YOUME_EVENT_MIC_CTR_ON: ///<麦克风被其他用户打开
                        cc.log("麦克风被其他用户打开,%s",param);
                        break;
                    case 24://YOUME_EVENT_MIC_CTR_OFF: ///<麦克风被其他用户关闭
                        cc.log("麦克风被其他用户关闭,%s",param);
                        break;
                    case 25://YOUME_EVENT_SPEAKER_CTR_ON: ///<扬声器被其他用户打开
                        cc.log("扬声器被其他用户打开,%s",param);
                        break;
                    case 26://YOUME_EVENT_SPEAKER_CTR_OFF: ///<扬声器被其他用户关闭
                        cc.log("扬声器被其他用户关闭,%s",param);
                        break;
                    case 27://YOUME_EVENT_LISTEN_OTHER_ON: ///<取消屏蔽某人语音
                        cc.log("取消屏蔽某人语音,%s",param);
                        break;
                    case 28://YOUME_EVENT_LISTEN_OTHER_OFF: ///<屏蔽某人语音
                        cc.log("屏蔽某人语音,%s",param);
                        break;
                    case 29://YOUME_EVENT_LOCAL_MIC_ON: ///< 自己的麦克风打开
                        cc.log("麦克风开启,%s",param);
                        self.addTips("麦克风开启", errorcode);
                        break;
                    case 30://YOUME_EVENT_LOCAL_MIC_OFF: ///< 自己的麦克风关闭
                        cc.log("麦克风静音,%s",param);
                        self.addTips("麦克风静音", errorcode);  
                        break;
                    case 31://YOUME_EVENT_LOCAL_SPEAKER_ON: ///< 自己的扬声器打开
                        cc.log("扬声器开启,%s",param);
                        self.addTips("扬声器开启", errorcode);
                        break;
                    case 32://YOUME_EVENT_LOCAL_SPEAKER_OFF: ///< 自己的扬声器关闭
                        cc.log("扬声器静音,%s",param);
                        self.addTips("扬声器静音", errorcode);
                        break;
                    default:
                        break;
                }

                
                self._commonNotify(event, errorcode, channel, param);
            };
        }
        var rid = regionid != undefined? regionid: 0;
        var exname = exregionname != undefined? exregionname: "";
        var errorcode = this.youmetalk.talk_Init(appkey, appsecret, rid, exname);
        cc.log("[Talk_Init]errorcode " + errorcode);
        return errorcode == 0;
    }
}

module.exports = ymtalk_module;




