var comm = require("Comm");
cc.Class({
  extends: comm,

  properties: {
    content: {
      default: null,
      type: cc.Node
    },

    item: {
      default: null,
      type: cc.Node
    },
    totalFee: {
      default: null,
      type: cc.Label
    },
    totalTax: {
      default: null,
      type: cc.Label
    },

    btnGrid: {
      default: null,
      type: cc.Node
    }
  },

  onLoad() {
    this.btnGrid.children[0].active = G.isClubHost;
    this.btnGrid.children[1].active = G.isClubHost;
  },

  //更新信息
  updateInfo(body) {
    this.totalFee.string = body.totalFee;
    this.totalTax.string = body.totalTax;
    var partnerDetailsList = body.partnerDetailsList;
    var length = partnerDetailsList.length;
    this.content.height = (this.item.height + 10) * length;
    this.content.removeAllChildren(); //清除所有子节点
    for (var i = 0; i < length; i++) {
      var item = cc.instantiate(this.item);
      this.content.addChild(item);
      this.itemInfo(item, partnerDetailsList[i]);
      item.setPosition(0, -30 - (this.item.height + 10) * i);
    }
  },

  itemInfo(item, data) {
    item.getChildByName("id").getComponent(cc.Label).string = data.wxId;
    item.getChildByName("nickName").getComponent(cc.Label).string = data.userName;
    item.getChildByName("scoreTotal").getComponent(cc.Label).string = data.score;
    item.getChildByName("xiaoHao").getComponent(cc.Label).string = data.fee;
    item.getChildByName("maney").getComponent(cc.Label).string = data.tax;
  },

  //----------------------按钮点击-------------------------------
  onClickDelPartner() {
    var obj = new Object();
    obj.uid = G.myPlayerInfo.uid;
    obj.clubId = G.saveClubID;
    obj.zinetid = cc.globalMgr.msgIds.SMALL_QUERYPARTNERList_CLUB;
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
  },

  onClickAddPartner() {
    var curNode = cc.instantiate(cc.globalRes["runprefab_club_Join"]);
    curNode.parent = this.node;
    curNode.getComponent("JoinRoom").onBtnActiveEnabel("joinPartner", 7, "请输入合伙人ID");
  },

  onClickDestroy() {
    FTools.HidePop(this.node)
  },

});
