var comm = require("Comm");
var Dictionary = require("Dictionary");

cc.Class({
  extends: comm,

  properties: {
    tipSpr: {
      default: null,
      type: cc.Node
    },
    //设置
    setBtn: {
      default: null,
      type: cc.Button
    },
    //消息
    newsBtn: {
      default: null,
      type: cc.Button
    },
    //成员
    memberBtn: {
      default: null,
      type: cc.Button
    },
    userInfo: {
      default: null,
      type: cc.Node
    },
    //上面按钮的父节点
    topBtnGrid: {
      default: null,
      type: cc.Node
    },

    //俱乐部ID显示
    ClubIdShow: {
      default: null,
      type: cc.Label
    },
    //提示
    tiShi: {
      default: null,
      type: cc.Node
    },
    leftNode: {
      default: null,
      type: cc.Node,
      tooltip:"左侧俱乐部列表"
    },

    rightNode: {
      default: null,
      type: cc.Node,
      tooltip:"右面房间列表"
    },
  },

  onClickLeftClubEvent() {
    cc.log("~~~~~~~~~~~")
    this.leftNode.active = true
  },

  onLoad: function () {
    G.saveClubThis = this;
    this._leftView = null;
    this._rightView = null;
    this.tipSpr.active = false;
    this.leftNode.active = false
    //左列表消息请求与监听
    this.sendForLeft();
    this.listenForAll();

    this.defaultBtnShow();

    this.updateUserinfoLayer("", this);
    this.DictionaryInit()
    this.rightNode.getComponent("Club_RightDesk").initDictionary()

  },


  //实例化 字典
  DictionaryInit() {
    this.dic = new Dictionary()
    this.dic.Dictionary()
    cc.log("俱乐部信息的存储：1")
  },

  //刷新个人信息界面
  updateUserinfoLayer(obj, target) {
    var userBG = target.userInfo.getChildByName("bg");
    // var hand = userBG.getChildByName("s_handzz").getChildByName("spr_hand").getComponent(cc.Sprite);
    var name = userBG.getChildByName("name").getComponent(cc.Label);
    var wxid = userBG.getChildByName("wxid").getComponent(cc.Label);
    name.string = G.myPlayerInfo.name;
    wxid.string = "iD:" + G.myPlayerInfo.wxId;
    //积分待对接
    // if (G.myPlayerInfo.image) {
    //   cc.loader.load({ url: G.myPlayerInfo.image, type: "png" }, function (err, tex) {
    //     hand.spriteFrame = new cc.SpriteFrame(tex);
    //   });
    // }
  },

  //设置俱乐部ID显示
  setIdForTop(id) {
    cc.log("设置俱乐部ID显示 ", id);
    this.ClubIdShow.string = "ID:" + id;
  },
  //-----------------------------设置游戏类型--------------------------------------
  setGameType(index) {
    this.gameType = index;
  },

  getGameType() {
    return this.gameType;
  },
  //-----------------------------上上上上上--------------------------------------

  //关闭消息提示
  closeTipsForNews() {
    this.tipSpr.active = false;
  },

  btnIsShow(rank) {
    cc.log("按钮显示： ", rank);
    this.defaultBtnShow();
    G.identity = rank;
    if (rank == 10) {
      //群主
      this.masterBtnShow();
      G.isClubHost = true;
    } else if (rank == 9) {
      //管理
      this.manageBtnShow();
      G.isClubHost = true;
    } else if (rank == 8) {
      //合伙人
      this.parenerBtnShow();
      G.isClubHost = false;
    } else {
      this.memberBtnShow();
      G.isClubHost = false;
    }
  },

  //默认按钮显示
  defaultBtnShow() {
    for (var i = 0; i < this.topBtnGrid.childrenCount; i++) {
      this.topBtnGrid.children[i].active = false;
    }
    G.isClubHost = false;
  },

  //群主按钮显示
  masterBtnShow() {
    for (var i = 0; i < this.topBtnGrid.childrenCount; i++) {
      this.topBtnGrid.children[i].active = true;
    }
    this.topBtnGrid.setPosition(cc.p(135, 310)); //241 -159
  },

  //管理按钮显示
  manageBtnShow() {
    for (var i = 0; i < this.topBtnGrid.childrenCount; i++) {
      if (i == 3 || i >= 4) {
        this.topBtnGrid.children[i].active = true;
      }
    }
    this.topBtnGrid.setPosition(cc.p(459, 310));
  },

  //合伙人
  parenerBtnShow() {
    for (var i = 0; i < this.topBtnGrid.childrenCount; i++) {
      if (i == 3 || i == 4 || i > 5) {
        this.topBtnGrid.children[i].active = true;
      }
    }
    this.topBtnGrid.setPosition(cc.p(540, 310));
  },

  //会员按钮显示
  memberBtnShow() {
    for (var i = 0; i < this.topBtnGrid.childrenCount; i++) {
      if (i > 5 || i == 4) {
        this.topBtnGrid.children[i].active = true;
      }
    }
    this.topBtnGrid.setPosition(cc.p(671, 310));
  },

  // -------------------------------------左列表部分-------------------------------------

  //左列表消息发送
  sendForLeft() {
    var obj = new Object();
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = cc.globalMgr.msgIds.SMALL_REQUEST_CLUB;
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    // cc.log("俱乐部左列表请求发送了");
  },
  // -------------------------------------查询部分-------------------------------------
  //设置查询视图
  setFindView(node) {
    this._findView = node;
  },

  //获取查询视图
  getFindView() {
    return this._findView;
  },

  // -------------------------------------修改俱乐部名称部分-------------------------------------
  //设置修改视图
  setChangeView(node) {
    this._changeView = node;
  },

  //获取修改视图
  getChangeView() {
    return this._changeView;
  },

  // -------------------------------------解散俱乐部名称部分-------------------------------------
  //设置解散视图
  setOutView(node) {
    this._outView = node;
  },

  //获取解散视图
  getOutView() {
    return this._outView;
  },

  // -------------------------------------解散俱乐部名称部分-------------------------------------
  //设置退出视图
  setSignOutView(node) {
    this._signOutView = node;
  },

  //获取退出视图
  getSignOutView() {
    return this._signOutView;
  },

  // -------------------------------------查询申请加入部分-------------------------------------
  //设置消息背景视图
  setNewsBgView(node) {
    this._newsBgView = null;
    this._newsBgView = node;
  },

  //获取消息背景视图
  getNewsBgView() {
    return this._newsBgView;
  },

  //设置消息滚动视图
  setNewsListView(node) {
    this._newsListView = null;
    this._newsListView = node;
  },

  //关闭消息背景视图
  closeNewsViewBg() {
    var curView = this.getNewsBgView();
    if (curView != null) {
      curView.destroy();
    }
    this._newsListView = null;
    this._newsBgView = null;
  },

  // -------------------------------------加入面板-------------------------------------

  //设置退出视图
  setJoinView(node) {
    this.JoinView = node;
  },

  //获取退出视图
  getJoinView() {
    return this.JoinView;
  },

  //成员详情面板

  setMemberNode(node) {
    this.memberNode = node
  },


  // -------------------------------------消息监听部分-------------------------------------
  //消息监听
  listenForAll() {
    this.regist(cc.globalMgr.msgIds.CLUB_MAIN_ID, this, this.subMsgEvent);
  },

  //子消息事件处理
  subMsgEvent: function (msgNumber, body, target) {
    cc.log("俱乐部子消息==》》", body, "  子ID：" + body.zinetid);
    if (body.zinetid == cc.globalMgr.msgIds.SMALL_REQUEST_CLUB) {
      target.refreshClub(body);
    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_REQUEST_CLUB_ALL_ROOM) {
      //俱乐部房间列表   6
      cc.log("房间列表数据：", body);
      var gameType = body.gameType;

    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_CLUB_MESSAGE) {
      //查询

      var node = target.leftNode.getChildByName("joinClubBox")
      node.getComponent("addClubBox").setResoultViewForFind(body)

    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_PLAYER_APPLY_CLUB) {
      //加入俱乐部
      cc.log("加入俱乐部 消息：", body);
    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_REQUEST_CLUB_ALLPLAYER) {
      //会员成员查询
      var curView = FTools.ShowPop("runMemberBox", target.node)
      curView.getComponent("memberBox").addItemForMember(body);
    }
    // else if (body.zinetid == cc.globalMgr.msgIds.SMALL_RESET_CLUB) {
    //     //修改俱乐部名称
    //     var curView = target.getChangeView();
    //     // cc.log("修改俱乐部名称数据：", body);
    // }
    else if (body.zinetid == cc.globalMgr.msgIds.SMALL_DISSOLUTION_CLUB) {
      //解散俱乐部

    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_CLUB_MASTER_REQUEST_MESSAGE) {

      target.server_messageList(body);

    } else if (body.zinetid == cc.globalMgr.msgIds.SAMLL_REFRESH_CLUB) {
      // 15   刷新俱乐部
      target.refreshClub(body);
    }
    else if (body.zinetid == cc.globalMgr.msgIds.SAMLL_GETUSERIMAGE_CLUB) {
      //俱乐部 牛牛、麻将四人进园子 桌子上的玩家头像   17
      cc.log("俱乐部 == 》 17", body);
      var roomId = body.roomId;
    }
    else if (body.zinetid == cc.globalMgr.msgIds.SMALL_INTEGRAL_CLUB) {
      //上下积分  24
      target.memberNode.getComponent("memberInfo").getScore(body.integral);

    } else if (
      body.zinetid == cc.globalMgr.msgIds.SMALL_QUERYPARTNERList_CLUB
    ) {
      ////查询合伙人列表  25
      var curNode = FTools.ShowPop("runprefab_club_partnerList", target.node)
      curNode.getComponent("Club_partnerListCon").updateInfo(body);
    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_PARTNER_CLUB) {
      //俱乐部合伙人  明细     27
      cc.log("//俱乐部合伙人  明细");

      var curNode = FTools.ShowPop("runprefab_club_partner", target.node)
      curNode.getComponent("Club_partner").updateInfo(body);

    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_GETMANAGENT_CLUB) {
      //点击管理面板获取信息
      let node = FTools.ShowPop("runPrefab_club_management", target.node)
      node.getComponent("Club_management").getManagementInfo(body);
    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_Fund_CLUB) {
      //俱乐部基金
      var curNode = FTools.ShowPop("runprefab_club_fund", target.node)
      curNode.getComponent("Club_fund").getFundNumber(body.fund);

    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_USERINTEGRAL_CLUB) {
      //俱乐部 个人 积分  34
      target.btnIsShow(body.rank);
    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_GETRULE_CLUB) {
      //俱乐部 规则的修改  36
      var data = JSON.parse(body.guize);
    } else if (body.zinetid == cc.globalMgr.msgIds.SMALL_QUERYINTEGRAL_CLUB) {
      if (target.RuleJiFen != null) {
        target.RuleJiFen.getComponent("Club_jiFenControl").undateInfo(body);
      }
    } else if (
      body.zinetid == cc.globalMgr.msgIds.SMALL_QUERYTimeINTEGRAL_CLUB
    ) {
      //时间段 查询 俱乐部上下积分  38

      if (target.ruleTimejiFen != null) {
        target.ruleTimejiFen.getComponent("Club_jiFenRuleControl").undateInfo(body);
      }
    }
  },

  onDestroy: function () {
    cc.globalMgr.service.getInstance().unregist(this);
    // cc.globalMgr.EventManager.getInstance().unregist(target)
  },
  // -------------------------------------按钮事件部分-------------------------------------
  //设置
  onSetClick: function () {
    cc.log("设置被点击了");
    //添加音效
    this.playClickMusic()
    var nodeCreateRoom = cc.instantiate(cc.globalRes["runSettingBox"]);
    nodeCreateRoom.parent = this.node;
  },

  //消息
  onNewsClick: function () {
    cc.log("消息被点击了");
    //添加音效
    this.playClickMusic()
    var obj = new Object();
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = cc.globalMgr.msgIds.SMALL_CLUB_MASTER_REQUEST_MESSAGE;
    obj.clubId = G.saveClubID;
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
  },

  //俱乐部成员查询消息
  onMemberClick: function () {
    cc.log("成员被点击了");
    //添加音效
    this.playClickMusic()
    var obj = new Object();
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = cc.globalMgr.msgIds.SMALL_REQUEST_CLUB_ALLPLAYER;
    if (G.saveClubID != 0) {
      obj.clubId = G.saveClubID;
    }
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    // 消息请求与监听
    this.listenForAll();
  },

  // -----------------------创建俱乐部视图部分-----------------------

  //返回
  onBackClick: function () {
    cc.log("返回大厅被点击了");
    cc.globalMgr.SceneManager.getInstance().loadScene("home");
    //移除游戏内事件监听
    this.unregist(this);
  },

  //加入俱乐部查询
  onFindClick: function () {
    cc.log("查询被点击了");
  },

  //加入俱乐部返回
  onBackForAddClub: function () {
    cc.log("加入俱乐部返回被点击了");
  },

  OnClickClose: function () {
    //添加音效
    this.playClickMusic();
    this.node.destroy();
  },

  //刷新俱乐部
  refreshClub(body) {

    this.saveClubInfo(body.clubList)

    var curView = this.leftNode.getChildByName("clubList")
    curView.getComponent("scrolLeft").GetView(this);
    curView.getComponent("scrolLeft").addItemForLeft(body);

    var dateLen = body.clubList.length;
    this.tiShi.active = !(dateLen > 0);
    if (dateLen > 0) {
      if (G.saveClubID != 0) {
        this.refreshClubIntegral(G.saveClubID);
      }
      var msgCount = body.clubList[0].msgCount;
      this.tipSpr.active = msgCount > 0;
    } else {
      this.defaultBtnShow();

      this.ClubIdShow.string = "";
    }
  },

  //存储 俱乐部的 id 和 名字
  saveClubInfo(dataObj) {
    for (let i = 0; i < dataObj.length; i++) {
      var data = dataObj[i]
      this.dic.add(data.clubId, data.clubName)
    }
  },

  readClubInfo(key) {

    return this.dic.find(key)
  },

  //刷新积分
  refreshClubIntegral(ClubId) {
    var obj = new Object();
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = cc.globalMgr.msgIds.SMALL_USERINTEGRAL_CLUB;
    obj.clubId = ClubId;
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
  },

  //申请加入俱乐部 消息
  server_messageList(body) {
    cc.log("申请加入俱乐部 ==>> 9");
    if (G.saveClubID != body.clubId) return;
    var getData = body.clubMsgList;
    this.tipSpr.active = getData.length > 0;
    var scene = cc.director.getScene();
    var node = FTools.ShowPop("runNewsBox", scene)
    node.setPosition(640, 360);
    node.getComponent("newsBox").getInfo(getData, body.clubId);
  },

});
