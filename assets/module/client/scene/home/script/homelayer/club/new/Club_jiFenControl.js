var comm = require("Comm");
cc.Class({
  extends: comm,

  properties: {
    item: {
      default: null,
      type: cc.Node
    },

    scrollView: {
      default: null,
      type: cc.ScrollView
    }
  },

  onLoad() {
    this.onShang();
  },

  undateInfo(body) {
    var content = this.scrollView.content;
    content.removeAllChildren();
    var list = body.clubIntergralDetailsList;
    content.height = this.item.height * list.length * 1.1;
    for (var i = 0; i < list.length; i++) {
      var item = cc.instantiate(this.item);
      content.addChild(item);
      item.getChildByName("id").getComponent(cc.Label).string =
        list[i].userWxId + "";
      item.getChildByName("nick").getComponent(cc.Label).string =
        list[i].userName + "";
      item.getChildByName("jiFen").getComponent(cc.Label).string =
        list[i].addNum + "";
      item.getChildByName("anim").getComponent(cc.Label).string =
        list[i].managerName;
      item.getChildByName("time").getComponent(cc.Label).string =
        list[i].setDate + "";
      item.setPosition(0, -38 - i * (item.height + 5));
    }
  },

  onShang() {
    var obj = new Object();
    obj.type = 2;
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = cc.globalMgr.msgIds.SMALL_QUERYINTEGRAL_CLUB;
    obj.clubId = G.saveClubID;
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
  },
  onXia() {
    var obj = new Object();
    obj.type = 3;
    obj.uid = G.myPlayerInfo.uid;
    obj.zinetid = cc.globalMgr.msgIds.SMALL_QUERYINTEGRAL_CLUB;
    obj.clubId = G.saveClubID;
    this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
  },

  onQueryInfo() {
    var scene = cc.director.getScene();
    var node = FTools.ShowPop("runRulejiFen", scene)

    node.setPosition(640, 360);
  },

  onClickDestroy() {
    FTools.HidePop(this.node)
  },


});
