var comm = require("Comm")
cc.Class({
    extends: comm,

    //玩法设置
    onClickPlaying() {
        //添加音效
        this.playClickMusic()
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.clubId = G.saveClubID
        obj.zinetid = cc.globalMgr.msgIds.SMALL_GETRULE_CLUB;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },
    //合伙人
    onClickPartner() {
        //添加音效
        this.playClickMusic()
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.clubId = G.saveClubID
        obj.zinetid = cc.globalMgr.msgIds.SMALL_PARTNER_CLUB;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },
    //管理
    onClickAdmin() {
        //添加音效
        this.playClickMusic()
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.clubId = G.saveClubID;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_GETMANAGENT_CLUB;
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },
    //基金
    onClickFund() {
        //添加音效
        this.playClickMusic()
        var obj = new Object();
        obj.uid = G.myPlayerInfo.uid;
        obj.zinetid = cc.globalMgr.msgIds.SMALL_Fund_CLUB;
        obj.clubId = G.saveClubID
        this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    },

    //查询 俱乐部 上下详情
    onClickQueryIntegral() {
        //添加音效
        this.playClickMusic()
        FTools.ShowPop("runjiFenCor", this.node)
    },

    //邀请玩家进入俱乐部
    onInviteUserClick() {

        var node = cc.instantiate(cc.globalRes['runprefab_club_Join']);
        node.parent = this.node
        node.getComponent('JoinRoom').onBtnActiveEnabel('invite', 7, '请输入要邀请到俱乐部的玩家ID')
        this.node.getComponent("Club").setJoinView(node)
    },


    //帮助
    onClickHelp() {
        this.playClickMusic()
        FTools.ShowPop("runClub_help", this.node)
    },



    //比赛设置
    onClickCompetitionSettig() {
        FTools.ShowPop("runClub_competition", this.node)

    },
});
