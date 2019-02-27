var comm = require("Comm");
cc.Class({
  extends: comm,

  properties: {
    //创建人姓名
    nameShow: {
      default: null,
      type: cc.Label
    },
    //ID
    idShow: {
      default: null,
      type: cc.Label
    },
    //头像图片
    imageShow: {
      default: null,
      type: cc.Sprite
    },
  },

  onLoad() {
    this.rank = 0; //管理 10 群主   9管理  8 合伙人
    this.state = ""; //在线状态 1在线  0不在线
    this.integral = 0; //积分
  },

  //姓名， id, 房间数，人数，头像
  updateItem: function (nickname, mId, img, otherUid, rank, state, integral) {
    //设置ID
    this._selfUid = otherUid
    this.nameShow.string = nickname;
    this.idShow.string = mId;
    // if (G.isClubHost == true && otherUid != G.myPlayerInfo.uid) {
    //   this.btn_del.node.active = G.isClubHost;
    // }
    this.rank = rank;
    cc.log("item 在线状态：", state);
    this.state = state;
    this.integral = integral;

    var head = img;
    if (head == "") {
      head = "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIMibhc0u2ksurELC631A2UDdPaPKnLkCFO0BMEzCApG21vqSrY9tIDaP93DpgH8SF456ZVTWckujA/132";
    }
    //获取用户头像
    var that = this;
    cc.loader.load({ url: head, type: "png" }, function (err, tex) {
      that.imageShow.spriteFrame = new cc.SpriteFrame(tex);
    });
  },
  //删除消息发送
  sendForDelMember() {
    var obj = new Object();
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = cc.globalMgr.msgIds.SAMLL_DELETE_PLAYER_IN_CLUB;
    obj.clubId = G.saveClubID;
    obj.otherUid = this._selfUid;
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
  },
  //点击详情 
  onClickPlayerInfo() {
    var scene = cc.director.getScene();
    var node = FTools.ShowPop("runMemberInfo", scene)
    node.setPosition(640, 360);
    G.saveClubThis.setMemberNode(node)
    var spr = node.getComponent("memberInfo")

    spr.updateInfo(this.imageShow.spriteFrame, this.idShow.string, this.nameShow.string, this.rank, 0, this.integral, this.state, G.saveClubID);
    spr.setIdForMember(this._selfUid)
  }

});
