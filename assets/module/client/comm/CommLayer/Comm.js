
var msgIds = require("MsgIds");
var msgObjs = require("MsgObjs");
var service = require("Service");
var EventManager = require("EventManager");
var SceneManager = require("SceneManager");
var GlobalFunc = require("GlobalFunc");
var XlSDK = require("XlSDK")
//var ScreenShot = require("Screenshot")

cc.Class({
    extends: cc.Component,

    properties: {

    },

    start() {

    },

    //监听安卓返回事件
    addAndroidBackEvent() {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isBrowser !== true) {
            cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (keyCode, event) {
                    cc.log('pressed key: ' + keyCode);
                    this.addMessageBox("onKeyPressed")
                },
                onKeyReleased: function (keyCode, event) {
                    cc.log('released key: ' + keyCode);
                    this.addMessageBox("onKeyReleased")
                }
            });
        }
    },

    //格式化名字
    FormatName(name) {
        var tempName = name
        if (!tempName) {
            return;
        }
        if (name.length > 5) {
            tempName = name.substring(0, 5)
            tempName = tempName + "..."
        }

        return tempName + ''
    },

    //格式化金币数
    // FormatGold(GoldNum) {
    //     if (GoldNum < 0) {
    //         var tempGold = -GoldNum
    //         if (tempGold >= 10000) {
    //             tempGold = tempGold / 10000
    //             tempGold = tempGold.toFixed(2)      // 取余
    //             tempGold = tempGold + '万'
    //         }
    //         return '-' + tempGold
    //     }
    //     else {
    //         var tempGold = GoldNum
    //         if (GoldNum >= 10000) {
    //             tempGold = GoldNum / 10000
    //             tempGold = tempGold.toFixed(2)      // 四舍五入 取后两位
    //             tempGold = tempGold + "万"
    //         }
    //         return tempGold + ''
    //     }
    //     return ''
    // },

    FormatGold(GoldNum) {
        if (GoldNum < 0) {
            var tempGold = -GoldNum
            if (tempGold >= 100000000) {
                tempGold = tempGold / 100000000
                tempGold = tempGold.toFixed(2)     
                tempGold = tempGold + '亿'
            } else if (tempGold >= 10000) {
                tempGold = tempGold / 10000
                tempGold = tempGold.toFixed(2)      
                tempGold = tempGold + '万'
            }
            return '-' + tempGold
        }
        else {
            var tempGold = GoldNum
            if (GoldNum >= 100000000) {
                tempGold = GoldNum / 100000000;
                tempGold = tempGold.toFixed(2);     
                tempGold = tempGold + "亿";
            }else if (GoldNum >= 10000) {
                tempGold = GoldNum / 10000;
                tempGold = tempGold.toFixed(2);      
                tempGold = tempGold + "万";
            }
            return tempGold + '';
        }
        return '';
    },

    //发送信息
    send(netId, obj) {
        G.socketMgr.socket.send(netId, obj);
    },

    //注册监听事件， 断线重连会销毁
    regist(msgNumber, target, func) {
        cc.globalMgr.service.getInstance().regist(msgNumber, target, func)
    },

    //取消注册监听事件
    unregist(target, msgNumber) {
        cc.globalMgr.service.getInstance().unregist(target, msgNumber)
    },

    //事件分发，断线重连不会销毁
    fireEvent(eventName, obj) {
        EventManager.getInstance().fireEvent(eventName, obj)
    },

    //注册分发监听事件
    eventRegist(eventName, target, func) {
        cc.globalMgr.EventManager.getInstance().regist(eventName, target, func);
    },
    //取消分发监听事件
    uneventRegist(target) {
        cc.globalMgr.EventManager.getInstance().unregist(target)
    },
    // 微信分享 title 标题 url 链接 text 文本 shareTo （0，好友 1 朋友圈） 必须是string类型  mediaType  0，文本 1，图片 2，网址
    wxShare(title, url, text, shareTo, mediaType) {
        cc.log("---分享这里---")
        cc.globalMgr.XlSDK.getInstance().share(title, url, text, shareTo, mediaType);
    },
    //微信切换账号
    wxaccountSwitch() {
        cc.log("---微信切换账号---")
        if (cc.sys.isBrowser === true) {
            return;
        }
        cc.globalMgr.XlSDK.getInstance().accountSwitch();
    },
    //微信登出
    wxlogout() {
        cc.log("---微信登出---")

        cc.globalMgr.service.getInstance().clear();
        cc.globalMgr.SceneManager.getInstance().loadScene("Logon")
        //如果是原生平台，调用微信登录
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.globalMgr.XlSDK.getInstance().logout();
        }
    },
    //添加提示框
    addMessageBox(str, target, func, showOkOrCanelBtn) {
        cc.globalMgr.globalFunc.addMessageBox(str, target, func, showOkOrCanelBtn);
    },

    //添加转圈圈界面
    addWaittingConnection(str) {
        cc.globalMgr.globalFunc.addWaittingConnection(str);
    },

    //移除转圈圈
    removeWaittingConnection() {
        cc.globalMgr.globalFunc.removeWaittingConnection();
    },

    //添加提示问题
    addTips(str, parentNode) {
        cc.globalMgr.globalFunc.addTips(str, parentNode);
    },

    //本地保存
    setLocalData: function (key, value) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    },

    //本地读取
    getLocalData: function (key) {
        var data = JSON.parse(cc.sys.localStorage.getItem(key));
        // console.log("查看要获取的本地的数据！");
        // console.log(data);
        return data;
    },

    //播放背景音效
    playBgMusic(filePath, loop) {
        //先暂停现在在播放的音效
        cc.audioEngine.stopAll()
        var effectClip = cc.url.raw(filePath);
        var musicData = this.getLocalData("musicData");
        var musicVolume = 0;
        if (musicData) {
            if (musicData.musicIsOn) {
                musicVolume = musicData.musicVolume
            }
            else {
                musicVolume = 0
            }
        }
        else {
            musicVolume = 0.5;

            G.musicData.musicVolume = musicVolume;
        }
        var musicID = cc.audioEngine.play(effectClip, loop, musicVolume);
        return musicID
    },

    //播放音效
    playEffectMusic(filePath, loop) {
        var effectClip = cc.url.raw(filePath);
        var musicData = this.getLocalData("musicData");
        var musicVolume = 0;
        if (musicData) {
            if (musicData.effectIsOn) {
                musicVolume = musicData.effectVolume
            }
            else {
                musicVolume = 0
            }
        }
        else {
            musicVolume = 0.5;
            G.musicData.effectVolume = musicVolume;
        }
        // cc.log(effectClip , loop, musicVolume)
        var musicID = -1
        if (musicVolume != 0) {
            musicID = cc.audioEngine.play(effectClip, loop, musicVolume);
        }
    },

    //播放点击按钮音效
    playClickMusic() {
        this.playEffectMusic("resources/sounds/button_click.mp3", false)
    },

    //打开网址在浏览器
    openUrl(url) {
        cc.sys.openURL(url)
    },  

    //复制字符串
    copyString(str) {
        this.addTips("复制成功", this.node)
        if (cc.sys.os == cc.sys.OS_ANDROID  && cc.sys.isBrowser !== true) {
            var test = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "copyString", "(Ljava/lang/String;)I", str);
        } else if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX && cc.sys.isBrowser !== true) {
            jsb.reflection.callStaticMethod("AppController", "copyString:", str);
        }
    },

    //玩家切换账号
    changeAccount() {
        cc.globalMgr.service.getInstance().clear();
        cc.globalMgr.SceneManager.getInstance().loadScene("Logon")
    },

    //销毁的时候，没写onDestroy，会自动销毁监听事件
    onDestroy() {
        this.uneventRegist(this)
        this.unregist(this)
    },



});
