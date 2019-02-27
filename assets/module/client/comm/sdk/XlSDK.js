
var XlSDK = cc.Class({
    extends: cc.Component,

    statics: {
        agent: 0,
        user_plugin: 0,
    },
    login: function () {
        G.mylog.push("--初始化sdk-")
        var agent = anysdk.agentManager;
        this.userPlugin = agent.getUserPlugin();
        if (this.userPlugin) {
            this.userPlugin.setListener(this.onUserResult, this);
        }
        if (!this.userPlugin) {
            cc.log(" 插件为空 ");
            return;
        }
        cc.log("开始登陆");
        this.userPlugin.login();
    },
    //在回调中使用creator1.4.2例子的回调部分：
    onUserResult: function (code, msg) {
        cc.log("登陆回调,code:" + code + ",msg:" + msg);
        switch (code) {
            case anysdk.UserActionResultCode.kInitSuccess:
                cc.log('初始化成功,code:' + code + ",msg:" + msg);
                G.mylog.push("---初始化成功---" + code + "mag" + msg);
                break;
            case anysdk.UserActionResultCode.kInitFail:
                cc.log(' 初始化失败,code:' + code + ",msg:" + msg);
                G.mylog.push("---初始化失败---" + code + "mag" + msg);
                break;
            case anysdk.UserActionResultCode.kLoginSuccess:
                cc.log('登陆成功,code:' + code + ",msg:" + msg);
                G.mylog.push("-登录成功-")
                var uid = this.userPlugin.getUserID();
                var play = JSON.parse(msg);
                var uid = play.uid;
                var sex = play.sex;
                var nickname = play.nickname;
                var headimgurl = play.headimgurl;
                //执行微信登录成功回调
                cc.globalMgr.EventManager.getInstance().fireEvent("wxloginSuccess", play)
                break;
            case anysdk.UserActionResultCode.kLoginFail:
                cc.log(' 登录失败,code:' + code + ",msg:" + msg);
                G.mylog.push("---登陆失败---" + code + "mag:" + msg);
                //执行微信登录失败回调
                var obj = {}
                cc.globalMgr.EventManager.getInstance().fireEvent("wxloginfail", obj)
                break;
            case anysdk.UserActionResultCode.kLogoutSuccess: //用户登出成功回调
                G.mylog.push("---登出成功----")
                break;
            case anysdk.UserActionResultCode.kLogoutFail: //用户登出失败回调
                G.mylog.push("---登出失败----")
                break;
            case anysdk.UserActionResultCode.kAccountSwitchSuccess: //切换账号成功回调
                //切换账号成功，一般可以做重新获取用户ID，和初始化游戏操作
                G.mylog.push("--切换账号成功-")
                break;
            case anysdk.UserActionResultCode.kAccountSwitchFail: //切换账号失败回调
                //切换账号失败，游戏相关操作
                G.mylog.push("--切换账号失败-")
                break;
        }
    },
    logout: function () {
        //调用用户系统登出功能
        cc.log("--用户登出系统--")
        var agent = anysdk.agentManager;
        var user_plugin = agent.getUserPlugin();
        if (!user_plugin || !user_plugin.logout) {
            cc.log("--用户登出系统return--")
            return;
        }
        if (user_plugin) {
            cc.log("--用户登出系统回调--")
            user_plugin.setListener(this.onUserResult, this);
        }
        user_plugin.logout();
    },
    //用户系统调用切换账号功能
    accountSwitch: function () {
        cc.log("--用户切换系统--")
        G.mylog.push("--用户切换系统-")
        var agent = anysdk.agentManager;
        var user_plugin = agent.getUserPlugin();
        if (!user_plugin || !user_plugin.accountSwitch) {
            cc.log("--用户切换账号return--")
            return;
        }
        if (user_plugin) {
            G.mylog.push("--切换账号回调-")
            //user_plugin.removeListener();
            user_plugin.setListener(this.onUserResult, this);
        }
        G.mylog.push("--开始切换账号-")
        user_plugin.accountSwitch();
    },

    //调用分享接口
    share: function (_title, _url, _text, _shareTo, _mediaType) {
        cc.log("---title----", _title)
        cc.log("---_url----", _url)
        cc.log("---_text----", _text)
        cc.log("---_shareTo----", _shareTo)
        if (((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) && cc.sys.isBrowser !== true)) {
            G.mylog.push("--初始化sdk分享---")
            var agent = anysdk.agentManager;
            G.mylog.push("--初始化有值---")
            var share_plugin = agent.getSharePlugin();
            if (share_plugin) {
                G.mylog.push("--初始化调分享---")
                share_plugin.setListener(this.onShareResult, this);
            } if (!share_plugin) {
                return;
            }

            var info = {}
            if (_mediaType == "0" || _mediaType == "2") {
                if(cc.sys.OS_ANDROID == cc.sys.os)
                {
                    info = {
                        title: _title,
                        url: _url,
                        text: _text,
                        shareTo: _shareTo,
                        mediaType: _mediaType, // 0，文本 1，图片 2，网址
                        thumbSizeX: 64,
                        thumbSizeY: 64,
                    }
                }
                else if(cc.sys.OS_IOS == cc.sys.os){
                    info = {
                        title: _title,
                        url: _url,
                        text: _text,
                        shareTo: _shareTo,
                        mediaType: _mediaType, // 0，文本 1，图片 2，网址
                        thumbImage: "thumbimage.png",
                        thumbSizeX: 64,
                        thumbSizeY: 64,
                    }
                }
                
                G.mylog.push("--开始分享--")
                share_plugin.share(info)
            }
            else {
                this.saveCancas(_title, _url, _text, _shareTo, _mediaType, share_plugin);
            }
        }
    },

    saveCancas: function (_title, _url, _text, _shareTo, _mediaType, share_plugin) {
        var size = cc.director.getWinSize();
        var fileName = "share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName; //拿到可写路径，将图片保存在本地，可以在ios端或者java端读取该文件  
        cc.log("saveCancas fullPath:",fullPath);
        // var destPath = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getSDCardPath", "()Ljava/lang/String;");
        // cc.log("saveCancas destPath",destPath);
        // var fullPath = destPath + "/" + fileName;
        if (jsb.fileUtils.isFileExist(fullPath)) {
            jsb.fileUtils.removeFile(fullPath);
        }
        var texture = cc.RenderTexture.create(Math.floor(size.width), Math.floor(size.height), cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        // var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height));
        texture.setPosition(cc.p(size.width / 2, size.height / 2));
        texture.begin();
        cc.director.getRunningScene().visit(); //这里可以设置要截图的节点，设置后只会截取指定节点和其子节点  
        texture.end();
        texture.saveToFile(fileName, cc.ImageFormat.JPG, false, function () {
            cc.log('save succ');
            texture.removeFromParent(true);
            var destPath = ""
            if(cc.sys.OS_ANDROID == cc.sys.os)
            {
                destPath = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "copyFileToSDCard", "(Ljava/lang/String;)Ljava/lang/String;", fullPath);
            }
            else if(cc.sys.OS_IOS == cc.sys.os){
                destPath = fullPath
            }
            
            cc.log("copyImage destPath",destPath);
            var info = {}
            if(cc.sys.OS_ANDROID == cc.sys.os)
            {
                info = {
                    title: _title,
                    url: _url,
                    text: _text,
                    shareTo: _shareTo,
                    imagePath: destPath,
                    mediaType: _mediaType, // 0，文本 1，图片 2，网址
                    // thumbImage: "thumbimage.png",
                    thumbSizeX: 64,
                    thumbSizeY: 64,
                }
            }
            else if(cc.sys.OS_IOS == cc.sys.os){
                info = {
                    title: _title,
                    url: _url,
                    text: _text,
                    shareTo: _shareTo,
                    imagePath: destPath,
                    mediaType: _mediaType, // 0，文本 1，图片 2，网址
                    thumbImage: "thumbimage.png",
                    thumbSizeX: 64,
                    thumbSizeY: 64,
                }
            }
            G.mylog.push("--开始分享截图--");
            share_plugin.share(info);
        });
    },

    //分享回调
    onShareResult: function (code, msg) {

        switch (code) {
            case anysdk.ShareResultCode.kShareSuccess:
                G.mylog.push("--分享成功--")
                G.mylog.push("-code-:" + code + "-msg-:" + msg)
                break;
            case anysdk.ShareResultCode.kShareFail:
                G.mylog.push("--分享失败----")
                break;
            case anysdk.ShareResultCode.kShareCancel:
                G.mylog.push("--分享取消---")
                break;
            case anysdk.ShareResultCode.kShareNetworkError:
                G.mylog.push("--分享网络错误---")
                break;
        }
    },

    // 下载服务端图片到本地
    shareDownloadPic (remoteUrl,_title, _url, _text, _shareTo) {
        if (((cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) && cc.sys.isBrowser !== true)) {
            G.mylog.push("--初始化sdk分享---")
            var agent = anysdk.agentManager;
            G.mylog.push("--初始化有值---")
            var share_plugin = agent.getSharePlugin();
            if (share_plugin) {
                G.mylog.push("--初始化调分享---")
                share_plugin.setListener(this.onShareResult, this);
            } if (!share_plugin) {
                return;
            }

            var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
            var filepath = dirpath + "xlcardposter" + '.jpg';
        
            function loadEnd(){
                var destPath = ""
                if(cc.sys.OS_ANDROID == cc.sys.os)
                {
                    destPath = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "copyFileToSDCard", "(Ljava/lang/String;)Ljava/lang/String;", filepath);
                }
                else if(cc.sys.OS_IOS == cc.sys.os){
                    destPath = filepath
                }
                cc.log("copyImage destPath",destPath);
                var info = {
                    title: _title,
                    url: _url,
                    text: _text,
                    shareTo: _shareTo,
                    imagePath: destPath,
                    mediaType: "1", // 0，文本 1，图片 2，网址
                    thumbImage: "thumbimage.png",
                    thumbSizeX: 64,
                    thumbSizeY: 64,
                }
                G.mylog.push("--开始分享宣传图--");
                share_plugin.share(info);
            }
        
            if(jsb.fileUtils.isFileExist(filepath)){
                cc.log('Remote is find' + filepath);
                loadEnd();
                return;
            }
        
            var saveFile = function(data){
                if(typeof data !== 'undefined'){
                    if(!jsb.fileUtils.isDirectoryExist(dirpath)){
                        jsb.fileUtils.createDirectory(dirpath);
                    }
        
                    if(jsb.fileUtils.writeDataToFile(new Uint8Array(data) , filepath)){
                        cc.log('Remote write file succeed.');
                        loadEnd();
                    }else{
                        cc.log('Remote write file failed.');
                    }
                }else{
                    cc.log('Remote download file failed.');
                }
            };
            
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';   // 1.7以上的版本，这个不能写在里面
        
            xhr.onreadystatechange = function () {
                cc.log("xhr.readyState  " +xhr.readyState);
                cc.log("xhr.status  " +xhr.status);
                if (xhr.readyState === 4 ) {
                    cc.globalMgr.globalFunc.removeWaittingConnection();
                    if(xhr.status === 200){
                        saveFile(xhr.response);
                    }else{
                        saveFile(null);
                    }
                }
            }.bind(this);
            xhr.open("GET", remoteUrl, true);
            xhr.send();
            cc.globalMgr.globalFunc.addWaittingConnection("");
        }
    },
});

XlSDK._instance = null;
XlSDK.getInstance = function () {
    if (!XlSDK._instance) {
        XlSDK._instance = new XlSDK();
    }
    return XlSDK._instance;
}
