
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        rtext_roomId: {
            default: null,
            type: cc.RichText,
        },
        rtext_time: {
            default: null,
            type: cc.RichText,
        },
        rtext_jushu: {
            default: null,
            type: cc.RichText,
        },
        rtext_wanFaTips: {
            default: null,
            type: cc.RichText,
        },
        node_info: {
            default: null,
            type: cc.Node,
        },
        layout_info: {
            default: null,
            type: cc.Layout,
        },
        itemArr: [],
    },

    onLoad () {
        this.refreshWanFaStr(G.mjGameInfo.roomInfo.wanFaTips);
    },

    onClose () {
        this.node.active = false;
    },

    onShare () {
        cc.log("onShare");
        var title = "9桌棋牌";
        if (G.gameNetId === 3800) {
            title = "划水麻将";
        } else if (G.gameNetId === 3900) {
            title = "红中麻将";
        }
        cc.globalMgr.XlSDK.getInstance().share(title,G.shareHttpServerPath, "", "0", "1");
    },

    onEnd () {
        cc.log("onend");
        if( G.isClubRoomId != 0 &&  G.isClubRoomId != undefined){
            G.isClubRoomId = 0
            cc.log("----要跳转俱乐部界面了");
            cc.globalMgr.GameFrameEngine.enterClub()
        }
        else{
            cc.log("----要跳转大厅界面了");
            cc.director.loadScene("home");
        }
       
    },

    refreshWanFaStr (str) {
        this.rtext_wanFaTips.string = "本局玩法:" + str;
    },

    refreshInfos (infos) {
        cc.log(infos,"info============================")
        var saveScript = null;
        var maxScore = 0;
        var ownerIndex = 0;
        this.rtext_roomId.string = infos._roomId+"";
        this.rtext_time.string = infos.bgdate + "";
        cc.log(this.rtext_roomId.string)
        for (var i = 0; i < infos.listjiesuan.length; i++) {
            var info = infos.listjiesuan[i];
            var resultItem = cc.instantiate(this.node_info);
            resultItem.parent = this.layout_info.node;
            resultItem.active = true;
            this.itemArr.push(resultItem);
            var script = resultItem.getComponent("BigResultItem");
            script.refreshView(info);
            script.refreshItem(i);

            var score = info.zongdefen;
            if (score > maxScore) {
                maxScore = score;
                saveScript = script;
            }

            if (G.mjGameInfo.roomInfo.fzwxid === info.wxid) {
                script.refreshOwner(true);
            }
        }

        if (saveScript !== null) {
            saveScript.refreshWin(true);
        }

        this.refreshNameAndHead(infos);
    },

    refreshNameAndHead (infos) {
        cc.log(infos,"=============================jiesuan")
        for (var i = 0; i < infos.listjiesuan.length; i++) {
            var info = infos.listjiesuan[i];
            var resultItem = this.itemArr[i];
            var userData = this.getNameAndHeadByWxid(info.wxid);
            cc.log(userData,"=-----------=-")
            var script = resultItem.getComponent("BigResultItem");
            // if(userData.name != ""){
            //     script.refreshName(userData.name);
            // }
            if(userData.image !== ""){
                script.refreshHead(userData.image);
            }
        }
    },

    getNameAndHeadByWxid (wxId) {
        var retData = {};
        var userCount = this.parent._userInfoSorts.length;

        for (var i = 0; i< userCount; i++) {
            var userInfo = this.parent._userInfoSorts[i];
            if (userInfo.wxId === wxId) {
                //retData.name = userInfo.name;
                retData.image = userInfo.image;
                return retData;
            }
        }
    },
});
