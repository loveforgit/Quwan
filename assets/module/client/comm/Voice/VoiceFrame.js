//by yky
//2018 4 18
var comm = require("Comm")
var ymtalk  = require("youmetalk")
var ANIVOICETAG = 888
cc.Class({
    extends: comm,

    properties: {

    },

    onLoad () {
        
    },
    ctor(){
        this._VoiceInitSuccess = false
        // this._usersBox = []
        this._btnVoice = null
    },
    //初始化语音接口
    initEvent: function(){
        cc.log("语音接口初始化")
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os ) ) {
            cc.log("进入语音接口")
            var self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.CUSTOM,   
                eventName: ymtalk.YMEvt.evt_tips,
                callback: function(event){
                    var obj = event.getUserData();
                    var s = obj.msg;
                    if(obj.error != 0){
                        s += "[errorcode]" + obj.error;
                    }
                    G.mylog.push(s)
                    // self.label.string = s;
                }
            },1);

            cc.eventManager.addListener({
                event: cc.EventListener.CUSTOM,     
                eventName: ymtalk.YMEvt.evt_common,
                callback: function (event) {
                    var obj = event.getUserData();
                    switch(obj.event){
                    case 0://YOUME_EVENT_INIT_OK:
                        self.initVoiceSuccess();
                        G.mylog.push("初始化成功")
                        // self.addMessageBox("初始化语音消息成功")
                        break;
                    case 1://YOUME_EVENT_INIT_FAILED:
                        // self.updateUI(false);     
                        G.mylog.push("初始化失败")          
                        break;
                    case 2://YOUME_EVENT_JOIN_OK:
                        G.mylog.push("加入房间成功")   
                        
                        self.joinRoomSuccess()
                        break;
                    case 3://YOUME_EVENT_JOIN_FAILED:
                        G.mylog.push("加入房间失败")   
                        break;
                    case 5://YOUME_EVENT_LEAVED_ALL:
                        break;
                    case 16: //< 其他用户麦克风打开
                        self.otherPlayerMicOn(obj.param)
                        break;
                    case 17:    //< 其他用户麦克风关闭
                        self.otherPlayerMicOff( obj.param)
                        break;
                    case 29://YOUME_EVENT_LOCAL_MIC_ON: ///< 自己的麦克风打开
                        break;
                    case 30://YOUME_EVENT_LOCAL_MIC_OFF: ///< 自己的麦克风关闭
                        break;
                    case 31://YOUME_EVENT_LOCAL_SPEAKER_ON: ///< 自己的扬声器打开
                        break;
                    case 32://YOUME_EVENT_LOCAL_SPEAKER_OFF: ///< 自己的扬声器关闭
                        break;
                    }
                }
            }, 1);
        }
    },

    //绑定头像框
    bindUserBox(UsersBox)
    {
        this._usersBox = UsersBox
        // this.addMessageBox("绑定头像框 : " + this._usersBox.length)
    },

    //加入房间成功
    joinRoomSuccess()
    {
        // this.addMessageBox("加入房间成功")
        //开启听筒
        ymtalk.youmetalk.talk_SetSpeakerMute(false);
    }, 

    //其他玩家打开麦克风
    otherPlayerMicOn(wxid)
    {
        // this.addMessageBox("其他玩家打开麦克风" + wxid)
        var userBox = this.getUserBoxByWxId(wxid)
        // this.addMessageBox("wxid : " + userBox)
        if(userBox != undefined)
        {
            if(this.aniVoice != undefined && this.aniVoice != null)
            {
                this.aniVoice.destroy()
                this.aniVoice = null
            }
            
            this.aniVoice = cc.instantiate(cc.globalRes['aniVoice']);
            this.aniVoice.getComponent(cc.Animation).play("anmi_voice");
            this.aniVoice.parent = userBox
            this.aniVoice.setTag(ANIVOICETAG)
            
        }
         //开启听筒
        ymtalk.youmetalk.talk_SetSpeakerMute(false);
        // this.setVoiceBtnCanTouch(false)
        if(that.voicePrb != undefined){
            that.voicePrb.destroy();
            that.voicePrb = undefined
        }
    },

    //其他玩家关闭麦克风
    otherPlayerMicOff(wxid) 
    {
        if(this.aniVoice != undefined && this.aniVoice != null)
        {
            this.aniVoice.destroy()
            this.aniVoice = null
        }
        //关闭听筒
        ymtalk.youmetalk.talk_SetSpeakerMute(true);
        // this.setVoiceBtnCanTouch(true)
    },

    setVoiceBtnCanTouch(bCanTouch)
    {
        if(bCanTouch == true){
            this._btnVoice.node.opacity = 255
        }
        else{
            this._btnVoice.node.opacity = 120
        }
    },

    //根据wxId 查询到玩家头像框
    getUserBoxByWxId(wxId)
    {
        // this.addMessageBox("length :" + this._usersBox.length)
        for(var i = 0;i < this._usersBox.length;i ++)
        {
            if(this._usersBox[i].wxId == wxId)
                return this._usersBox[i]
        }
        
        return undefined;
    },

    //初始化语音
    initVoice (){
        // this.addMessageBox("初始化语音开始")
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os)) {
            
            this.initEvent()
            ymtalk.init(ymtalk._testKey, ymtalk._testSecret);
            // this.addMessageBox("初始化语音结束")
        }
    },

    //初始化成功语音消息
    initVoiceSuccess(){
        // this.addMessageBox("初始化语音消息成功")
        this._VoiceInitSuccess = true
    },

    //初始化失败语音消息
    initVoiceFaile(){
        // this.addMessageBox("初始化语音消息失败！语音功能暂不可用")
        this._VoiceInitSuccess = false
    },

    //玩家进入房间
    JoinRoom(roomid, userId){
        this.roomid = roomid
        this.userId = userId
        cc.log("玩家加入room " , this.roomid )
        cc.log("userid " , userId)
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os)) {
            this.schedule(this.playerJoinRoom, 0.5)
        }
    },    
    //玩家请求进入房间
    playerJoinRoom(){
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) ) {
            if(this._VoiceInitSuccess == true){
                //停止定时器
                this.unschedule(this.playerJoinRoom)
                
                ymtalk.addTips("正在加入房间...");
                // this.addMessageBox("加入房间 :" + this.roomid)
                ymtalk.youmetalk.talk_JoinChannelSingleMode(this.userId, this.roomid, ymtalk.YMRoleType.rt_talkfree, false);
                this.setAutoSendStatus(true)
            }
        }
    },
    
    //玩家离开房间
    LeaveRoom:function(){
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) ) {
            ymtalk.addTips("正在离开房间...");
            ymtalk.youmetalk.talk_LeaveChannelAll();
            // this._usersBox = []
        }
     },

    //反初始化，释放语音sdk所有资源
    unInit()
    {
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) ) {
            ymtalk.youmetalk.talk_UnInit();
        }
    },

    //玩家开启，关闭麦克风， false 代表打开，true 代表失败
    setSpeakAndMicroPhoneMute(bOpen)
    {
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os)) {
            if(this._VoiceInitSuccess == true)
            {
                // this.addMessageBox("麦克风 ：" + bOpen )
                ymtalk.youmetalk.talk_SetMicrophoneMute(bOpen);
            }
        }
    },

    //设置是否通知别人麦克风和扬声器的开关
    setAutoSendStatus(statue)
    {
        if ((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) ) {
            if(this._VoiceInitSuccess == true)
                 ymtalk.youmetalk.talk_SetAutoSendStatus(statue)
        }
    },



    //监听语音按钮的触发事件
    setVoiceEvent(VoiceButton){
        this.voicePrb = undefined
        
        var that = this
        that._btnVoice = VoiceButton
        
        // this.schedule(function(){
        //     this.addMessageBox("userbox length " + this._usersBox.length)
        // },2)
        // this.addMessageBox("监听语音按钮" + that._usersBox.length)
        // that.a= 11
        // this.setVoiceBtnCanTouch(false)
        VoiceButton.node.on(cc.Node.EventType.TOUCH_START, function(){
            
            // if(that._btnVoice.node.opacity == 120)
            //     return

            that.setSpeakAndMicroPhoneMute(false)

            if(that.voicePrb == undefined){
                that.voicePrb = cc.instantiate(cc.globalRes['voicePrb']);
            }
            else {
                that.voicePrb.destroy();
                that.voicePrb = undefined
            }
            var curScene = cc.director.getScene();

            that.voicePrb.parent = curScene;
            // cc.globalMgr.globalFunc.addLayerToWindowsCenter(that.voicePrb);
            
        })
        VoiceButton.node.on(cc.Node.EventType.TOUCH_END, function(){
            cc.log("按钮松开点击")
            // if(that._btnVoice.node.opacity == 120)
            //     return
            // that.otherPlayerMicOff(G.myPlayerInfo.wxId)
            that.setSpeakAndMicroPhoneMute(true)
            if(that.voicePrb != undefined){
                that.voicePrb.destroy();
                that.voicePrb = undefined
            }
        })
        VoiceButton.node.on(cc.Node.EventType.TOUCH_CANCEL, function(){
            cc.log("取消点击")
            // that.otherPlayerMicOff(G.myPlayerInfo.wxId)
            that.setSpeakAndMicroPhoneMute(true)
            if(that.voicePrb != undefined){
                that.voicePrb.destroy();
                that.voicePrb = undefined
            }
           
        })
    },

});
