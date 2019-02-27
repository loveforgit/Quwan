var comm = require("Comm");
var MsgIds = require("MsgIds")
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

    content: {
      default: null,
      type: cc.Node
    },

    //部主可以点击的按钮
    btn: {
      default: null,
      type: cc.Node
    },
    //管理可以点击的按钮
    ManageBtn: {
      default: null,
      type: cc.Node
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

  //编辑
  onClickCompile(event, parameter) {
    var node = this.ManageBtn
    if (G.identity == 10) {
      node = this.btn
    }
    node.active = !node.active
    if (node.active == true) {
      event.target.parent.parent.setLocalZOrder(1)
      this.content.height += node.height
    } else {
      event.target.parent.parent.setLocalZOrder(0)
      this.content.height -= node.height
    }
  },


  // 调整积分
  onClickSetIntegral(event, parameter) {

  },


  //冻结
  onClickDongJie() {

  },

  //删除
  onClickUserDel() {
    var obj = new Object();
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = MsgIds.SAMLL_DELETE_PLAYER_IN_CLUB;
    obj.clubId = G.saveClubID;
    obj.otherUid = this._selfUid;
    this.send(MsgIds.CLUB_MAIN_ID, obj);
  },

  //添加成员为管理员
  onClickAddMemberMain() {

  },

  //删除成员管理员 权限
  onClickDelMemberMain() {

  },

  //转让会长权限
  onClickMakeOverMain() {

  },





});
