
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
var SocketIO = SocketIO || window.io;

var MsgIds = require("MsgIds")
var EventManager = require("EventManager")
var Service = require("Service")
var MsgObjs = require("MsgObjs")

var C_WSocket = cc.Class({
    extends: cc.Component,
    properties: {

    },
    // statics: {
        ctor()
        {
            this.isConnected = false
            this.msgQueue = []
            this.sendId = 0;
            this.scene = null;
            this.hasSendHeart = false;
        },
       
        connect:function (ip,port) {
            this.host = "ws://"+ip+":"+port+"/Echo";  //test
            // this.host = "ws://"+ip+":"+port;
            cc.log('开始连接:'+this.host);
            this.socket = new WebSocket(this.host);
            var that=this;
            this.socket.onopen = function(evt){
                cc.log('建立连接');
                that.isConnected=true;
               
            };
            this.close=function(){
                if (this.socket&&this.isConnected){
                    cc.log("关闭");
                    this.socket.onclose();
                    this.socket = null;
                    this.isConnected=false;
                }
            }
            this.socket.onmessage = function(evt){
                var data = evt.data;
                // cc.log("get server message!");
                var serverMsg = JSON.parse(data);
                var obj={};
                obj.msgNumber=serverMsg.netid;
                obj.body=serverMsg;
                //注册全局监听事件
                cc.globalMgr.socketControl.initControl(obj.msgNumber, obj.body)
                if(obj.msgNumber == MsgIds.HEART_SERVER_TO_CLIENT_RESPONSE) {
                    // cc.log("接收到来自服务器心跳应答", obj)
                    that.hasSendHeart=false;
                }
                else if(obj.msgNumber == MsgIds.LOGIN_REQUEST || obj.msgNumber == MsgIds.SOCKET_CLOSE_RECONTIN_CONNECT || obj.msgNumber == MsgIds.ERROR_RESPONSE || obj.msgNumber == MsgIds.MYPLAYER_INFO_RESPONSE)
                {
                    cc.log("不处理")
                }
                else{
                    if(obj.msgNumber != MsgIds.HEART_SERVER_TO_CLIENT_RESPONSE && obj.msgNumber != MsgIds.NOTICE_MASSAGE && obj.msgNumber != MsgIds.PLAYER_IN_ROOM_IS_ONLINE){
                        cc.log(" onmessage obj " , obj);
                    }
                    that.msgQueue.push(obj);
                }
            };

            this.socket.onerror = function(evt){
                cc.log('连接错误');
                that.isConnected=false;
                if(G.finishState==2)
                {
                    var obj2={};
                    EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT2",obj2);
                    return;
                }
                cc.log("第一次断线")
                var obj={};
                EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT",obj);
            };

            this.socket.onclose = function(evt){
                cc.log('连接关闭');
                that.isConnected=false;
                if(G.finishState==2)
                {
                    var obj2={};
                    EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT2",obj2);
                    return;
                }
                cc.log("第一次断线")
                var obj={};
                EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT",obj);
            };
        },
    
        send:function (msgId, msgBody) {
            if (G.socketMgr.socket.isConnected == false )
                return
            //测试发送数据
            if (msgId !== 2) {
                cc.log("send msgId: " + msgId );
                cc.log("send msgBody", msgBody);
            }
            msgBody.netid = msgId;
            var sendStr = JSON.stringify(msgBody);  
            this.socket.send(sendStr);                                                                                     
        }
    // }
})
