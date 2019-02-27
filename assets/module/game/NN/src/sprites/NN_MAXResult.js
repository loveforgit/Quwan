var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {

    },

    //DelCuoCard
    SprMaxResultShow(obj) {
        var grid = this.node.getChildByName("grid")
        for (var i = 0; i < obj.length; i++) {
            var itemInfo = grid.children[i]
            itemInfo.active = true;
            var node = itemInfo.getChildByName("spr_resultItem");
            node.getChildByName("label_name").getComponent(cc.Label).string = obj[i].name;
            node.getChildByName("spr_qiang").getChildByName("label_num").getComponent(cc.Label).string = obj[i].qiangZhuang;
            node.getChildByName("spr_zhuang").getChildByName("label_num").getComponent(cc.Label).string = obj[i].zuoZhuang;
            node.getChildByName("spr_tui").getChildByName("label_num").getComponent(cc.Label).string = obj[i].tuiZhu;
            node.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + obj[i].wxId;
            var score = obj[i].score
            node.getChildByName("label_base").getComponent(cc.Label).string = score
            if (score > 0) {
                node.getChildByName("label_base").color = new cc.Color(255, 0, 0);
            } else if (score < 0) {
                node.getChildByName("label_base").color = new cc.Color(0, 255, 0);
            }

            // var label_jia = node.getChildByName("label_base_jia")
            // var label_jian = node.getChildByName("label_base_jian")
            // if (score > 0) {
            //     label_jia.active = true
            //     label_jian.active = false
            //     label_jia.getComponent(cc.Label).string = "/" + score
            // } else if (score == 0) {
            //     label_jia.active = true
            //     label_jian.active = false
            //     label_jia.getComponent(cc.Label).string = score
            // } else {
            //     label_jia.active = false
            //     label_jian.active = true
            //     label_jian.getComponent(cc.Label).string = "/" + score
            // }

            //处理图片显示相关内容
            if (obj[i].fzWxid == obj[i].wxId) {
                node.getChildByName("spr_fangzhu").active = true;
            } else {
                node.getChildByName("spr_fangzhu").active = false;
            }
            if (obj[i].istuhao == true) {
                node.getChildByName("spr_hao").active = true;
            }
            if (obj[i].isdayingjia == true) {
                node.getChildByName("spr_win").active = true;
            }
            this.SprLoadHead(node.getChildByName("mask_head").getChildByName("spr_head"), obj[i].image);
        }

    },
    //加载头像
    SprLoadHead(node, image) {
        if (image !== "") {
            cc.loader.load({ url: image, type: 'png' }, function (err, tex) {
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
            });
        }
    },

    setGameControl(gameControl){
        this._gameControl = gameControl
    },

    onClickBackHome(){
        if (G.isClubRoomId != 0 && G.isClubRoomId != undefined) {
            G.isClubRoomId = 0
            cc.log("----要跳转俱乐部界面了");
            cc.globalMgr.GameFrameEngine.enterClub()
        }
        else {
            cc.log("----要跳转大厅界面了");
            this._gameControl.enterHomeEvent()
        }
        // t
    },
    onClickShare(){
        this.wxShare("805娱乐 牛牛", G.shareHttpServerPath, "结算", "0", 1)
    },
});
