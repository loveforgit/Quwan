var chatConfig = require("ChatConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        tipsShow: {
            default: null,
            type: cc.Label
        },
        //音乐
        audioClip: {
            url: cc.AudioClip,
            default: null
        },
        //音效
        effectClip: {
            url: cc.AudioClip,
            default: null
        }
    },

    addWaittingConnection(tips) {
        this.waittingConnectionNode = cc.instantiate(cc.globalRes["waitingConnectionPrb"]);
        var curScene = cc.director.getScene();
        if (curScene !== undefined && this.waittingConnectionNode !== undefined) {
            this.waittingConnectionNode.parent = curScene;
            this.waittingConnectionNode.getComponent("loading").setTips(tips)
            this.scheduleOnce(this.removeWaittingConnection, 5)
        }
    },

    removeWaittingConnection() {
        if (this.waittingConnectionNode !== undefined) {
            this.waittingConnectionNode.destroy();
            this.waittingConnectionNode = undefined;
        }
    },

    // cc.globalMgr.globalFunc.addMessageBox("<color=#0fffff>baichaoyang</color>");
    // showOkOrCanelBtn
    // 1 showOk
    // 2 showCanel
    // 3 show Ok and canel btn
    addMessageBox(str, target, func, showOkOrCanelBtn) {
        var messageBox = cc.instantiate(cc.globalRes["messageBoxPrb"]);
        var curScene = cc.director.getScene();
        if (curScene !== undefined && messageBox !== undefined) {
            messageBox.parent = curScene;
            messageBox.getComponent("MessageBox").setTipStr(str);

            if (target != undefined && func != undefined) {
                messageBox.getComponent("MessageBox").setOkBtnClickEvent(target, func)
            }
            if (showOkOrCanelBtn != undefined) {
                messageBox.getComponent("MessageBox").showOkOrCanelBtn(showOkOrCanelBtn);
            }
        }
    },

    addChatLayer(gameId) {
        var chatLayer = cc.instantiate(cc.globalRes["chatLayerPrb"]);
        var curScene = cc.director.getScene();
        if (curScene !== undefined && chatLayer !== undefined) {
            chatLayer.parent = curScene;
        }
        var script = chatLayer.getComponent("ChatLayer");
        script.refreshView(gameId);
    },

    // 添加文字消息提示
    addChatMsgTip(gameId, parentNode, dir, pos, msgId, addName) { // dir = 1 左边  dir = -1 右边
        var chatMsgNode = cc.instantiate(cc.globalRes["chatMsgTipPrb"]);
        chatMsgNode.parent = parentNode;
        var script = chatMsgNode.getComponent("ChatMsgTip");
        if(addName != null){
            script.setMsg(gameId, msgId, addName);
            // cc.log("-------加名字");
        }
        else{
            script.setMsg(gameId, msgId);
        }
        // script.setMsg(gameId, msgId);
        script.setDir(dir);
        script.setPos(pos);
    },

    // 添加表情动画提示
    addChatFaceTip(parentNode, pos, msgId) {
        var chatFaceNode = cc.instantiate(cc.globalRes["chatFaceAnimPrb"]);
        chatFaceNode.parent = parentNode;
        chatFaceNode.position = pos;
        var faceAnim = chatFaceNode.getComponent(cc.Animation);
        faceAnim.play(chatConfig.faceTables[msgId]);
        faceAnim.on('finished', function () {
            cc.log("faceAnim finished");
            chatFaceNode.destroy();
        });
    },
    // 添加输入聊天
    addInputTip(parentNode, dir, pos, msgId, addName) {
        var chatMsgNode = cc.instantiate(cc.globalRes["chatMsgTipPrb"]);
        chatMsgNode.parent = parentNode;
        var script = chatMsgNode.getComponent("ChatMsgTip");
        if(addName != null){
            script.setMsgForInput(msgId, addName);
            // cc.log("-------加名字");
        }
        else{
            script.setMsgForInput(msgId);
        }
        // script.setMsgForInput(msgId);
        script.setDir(dir);
        script.setPos(pos);
    },

    addGameUserInfo(isMe, targetWxId, userInfo, isShowVipView, isShowVipViewJinbi) {
        var gameUserInfo = cc.instantiate(cc.globalRes["gameUserInfoPrb"]);
        var curScene = cc.director.getScene();
        if (curScene !== undefined && gameUserInfo !== undefined) {
            gameUserInfo.parent = curScene;
        }
        var script = gameUserInfo.getComponent("GameUserinfo");
        script.refreshMagicView(isMe, targetWxId);
        script.refreshUserInfo(userInfo);
        if (isShowVipView) {
            script.refreshVipView(true);
            script.initMagicFaceScrollView(true);
            if (isShowVipViewJinbi) {
                script.refreshVipViewJinBi(true);
            }
        } else {
            script.initMagicFaceScrollView(false);
        }
    },

    addMagicFace(sourcePos, targetPos, msgId) {
        var magicFaceNode = cc.instantiate(cc.globalRes["magicFaceAnimPrb"]);
        var curScene = cc.director.getScene();
        if (curScene !== undefined && magicFaceNode !== undefined) {
            magicFaceNode.parent = curScene;
            magicFaceNode.position = sourcePos;
            var script = magicFaceNode.getComponent("MagicFaceAnim");
            var magicFaceTables = Object.assign(chatConfig.magicFaceVipTables, chatConfig.magicFaceTables);
            script.setSpriteFrame(magicFaceTables[msgId]);

            var action = cc.moveTo(0.5, targetPos);
            var finish = cc.callFunc(function () {
                var magicFaceAnim = magicFaceNode.getComponent(cc.Animation);
                magicFaceAnim.play(magicFaceTables[msgId]);
                var audioUrl = "magicAudio/" + msgId + ".mp3";
                cc.globalMgr.audioMgr.playSFX(audioUrl);
                magicFaceAnim.on('finished', function () {
                    cc.log("magicFaceAnim finished");
                    magicFaceNode.destroy();
                });
            }, this);
            var seq = cc.sequence(action, finish);
            magicFaceNode.runAction(seq);
        }
    },

    getUrlHead(headSpr, headUrl, width) {
        cc.loader.load({ url: headUrl, type: 'png' }, function (err, tex) {
            if (err !== null) {
                cc.log("get weixin head failed!");
                return;
            }
            headSpr.spriteFrame = new cc.SpriteFrame(tex)
            var curWidth = headSpr.node.width;
            headSpr.node.scale = width / curWidth;
        });
    },

    //通用提示
    addTips(str, parentNode) {
        if (!str || !parentNode) {
            return;
        };
        console.log('进入提示回调！');
        var node = new cc.Node('tipsShow');
        var Label = node.addComponent(cc.Label);
        Label.string = str;
        Label.fontSize = 45;
        Label.lineHeight = 100;
        Label.node.color = new cc.Color(0, 0, 0);
        // node.parent = parentNode;
        var size = cc.director.getWinSize();
        node.parent = cc.director.getScene();
        node.position = cc.p(size.width / 2, size.height / 2);
        if (node !== undefined) {

            var action = cc.fadeOut(1.0);
            node.runAction(action);

        }
    },

    //添加子游戏下载UI
    addChildGameUpdate(nodeParent, gameName) {
        var childGameUpdate = cc.instantiate(cc.globalRes["childGameUpdate"]);
        childGameUpdate.parent = nodeParent;
        var script = childGameUpdate.getComponent("ChildGameUpdate");
        script.startUpdate(gameName);
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
    FormatGold(GoldNum) {
        if (GoldNum < 0) {
            var tempGold = -GoldNum
            if (tempGold >= 10000) {
                tempGold = tempGold / 10000
                tempGold = tempGold.toFixed(2)      // 取余
                tempGold = tempGold + '万'
            }
            return '-' + tempGold
        }
        else {
            var tempGold = GoldNum
            if (GoldNum >= 10000) {
                tempGold = GoldNum / 10000
                tempGold = tempGold.toFixed(2)      // 四舍五入 取后两位
                tempGold = tempGold + "万"
            }
            return tempGold + ''
        }
        return ''
    },
});
