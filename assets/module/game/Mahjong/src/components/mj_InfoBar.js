cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        var infoNode = this.node.getChildByName("node_infoBar");
        this.roomId = infoNode.getChildByName("laebl_roomIdTip").getChildByName("label_roomIds").getComponent(cc.Label);
        this.wanFaTips = infoNode.getChildByName("label_wanfa").getComponent(cc.Label);
        this.roomIdTip = infoNode.getChildByName("laebl_roomIdTip");
    },

    refreshGoldRoomInfo (wanFaStr) {
        this.roomIdTip.active = false;
        var pos = this.roomIdTip.position;
        this.wanFaTips.node.position = pos;
        this.wanFaTips.string = "";
        //G.mjGameInfo.roomInfo.wanFaTips = wanFaStr;
    },

    refreshRoomInfo () {
        if (G.gameNetId === 3800) {
            this.refreshHuaShuiInfo();
        } else if (G.gameNetId === 3900) {
            this.refreshHongZhongInfo();
        }
    },

    refreshHuaShuiInfo () {
        cc.log(G.mjGameInfo.roomInfo,"=================sjsj")
        this.roomId.string = G.mjGameInfo.roomInfo.roomId;
        var wanFaStr = "";
        var shareWanFaStr = "";

        wanFaStr += G.mjGameInfo.roomInfo.renshu + "人 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.renshu + "人 ";

        wanFaStr += G.mjGameInfo.roomInfo.jushu + "局 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.jushu + "局 ";

        wanFaStr += G.mjGameInfo.roomInfo.fangfei === 1 ? "房主支付 " : "AA支付 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.fangfei === 1 ? "房主支付 " : "AA支付 ";

        if (G.mjGameInfo.roomInfo.fengding === 1) {
            wanFaStr += G.mjGameInfo.roomInfo.jushu + "清上清 ";
            shareWanFaStr += G.mjGameInfo.roomInfo.jushu + "清上清 ";
        } else if (G.mjGameInfo.roomInfo.fengding === 2) {
            wanFaStr += G.mjGameInfo.roomInfo.jushu + "豪华清 ";
            shareWanFaStr += G.mjGameInfo.roomInfo.jushu + "豪华清 ";
        } else if (G.mjGameInfo.roomInfo.fengding === 3) {
            wanFaStr += G.mjGameInfo.roomInfo.jushu + "超豪华清 ";
            shareWanFaStr += G.mjGameInfo.roomInfo.jushu + "超豪华清 ";
        }
        // } else if (G.mjGameInfo.roomInfo.fengding === 0) {
        //     wanFaStr += G.mjGameInfo.roomInfo.jushu + "不限制 ";
        //     shareWanFaStr += G.mjGameInfo.roomInfo.jushu + "不限制 ";
        // }

        wanFaStr += G.mjGameInfo.roomInfo.buyHorse + "梦 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.buyHorse + "梦 ";

        wanFaStr += G.mjGameInfo.roomInfo.isdaifeng ? "带风 " : "不带风 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.isdaifeng ? "带风 " : "不带风 ";
        
        wanFaStr += G.mjGameInfo.roomInfo.isJiaBei ? "梦翻倍 " : "梦不翻倍 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.isJiaBei ? "梦翻倍 " : "梦不翻倍 ";

        wanFaStr += G.mjGameInfo.roomInfo.hutype === 1 ? "不带点炮 " : "带点炮 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.hutype === 1 ? "不带点炮 " : "带点炮 ";

        wanFaStr += G.mjGameInfo.roomInfo.isAll ? "点炮大包 " : "点炮一家出 ";
        shareWanFaStr += G.mjGameInfo.roomInfo.isAll ? "点炮大包 " : "点炮一家出 ";

        this.wanFaTips.string = wanFaStr;
        G.mjGameInfo.roomInfo.wanFaTips = wanFaStr;
        G.mjGameRule = shareWanFaStr;
        if (G.mjGameInfo.roomInfo.isjinbi) {
            this.refreshGoldRoomInfo(wanFaStr);
        }
    },

    refreshHongZhongInfo () {
        cc.log(G.mjGameInfo.roomInfo,"=================sjsj")
        this.roomId.string = G.mjGameInfo.roomInfo.roomId;
        var wanFaStr = "";
        var shareWanFaStr = "";

        if (G.mjGameInfo.roomInfo.jushu === 8) {
            wanFaStr += "8局 ";
            shareWanFaStr += "8局 ";
        } else if (G.mjGameInfo.roomInfo.jushu === 16) {
            wanFaStr += "16局 ";
            shareWanFaStr += "16局 ";
        }

        if (G.mjGameInfo.roomInfo.renshu === 4) {
            wanFaStr += "4人 ";
            shareWanFaStr += "4人 ";
        } else if (G.mjGameInfo.roomInfo.renshu === 3) {
            wanFaStr += "3人 ";
            shareWanFaStr += "3人 ";
        } else if (G.mjGameInfo.roomInfo.renshu === 2) {
            wanFaStr += "2人 ";
            shareWanFaStr += "2人 ";
        }

        if (G.mjGameInfo.roomInfo.fangfei === 1) {
            wanFaStr += "房主付 ";
            shareWanFaStr += "房主付 ";
        } else if (G.mjGameInfo.roomInfo.fangfei === 2) {
            wanFaStr += "AA付 ";
            shareWanFaStr += "AA付 ";
        } 

        if (G.mjGameInfo.roomInfo.isCanDianPao) {
            wanFaStr += "自摸胡 ";
            shareWanFaStr += "自摸胡 ";
        }

        if (G.mjGameInfo.roomInfo.isQiangGangHu) {
            wanFaStr += "杠上杠翻番 ";
            shareWanFaStr += "杠上杠翻番 ";
        }

        if (G.mjGameInfo.roomInfo.hunType === 1) {
            wanFaStr += "红中癞子 ";
            shareWanFaStr += "红中癞子 ";
        }

        if (G.mjGameInfo.roomInfo.isqidui) {
            wanFaStr += "可胡七对 ";
            shareWanFaStr += "可胡七对 ";
        }

        if (G.mjGameInfo.roomInfo.baseScore > 0) {
            wanFaStr += "下鱼" + G.mjGameInfo.roomInfo.baseScore + "条 ";
            shareWanFaStr += "下鱼" + G.mjGameInfo.roomInfo.baseScore + "条 ";
        }

        this.wanFaTips.string = wanFaStr;
        G.mjGameInfo.roomInfo.wanFaTips = wanFaStr;
        G.mjGameRule = shareWanFaStr;
        if (G.mjGameInfo.roomInfo.isjinbi) {
            this.refreshGoldRoomInfo(wanFaStr);
        }
    },
});
