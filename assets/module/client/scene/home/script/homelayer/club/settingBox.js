var comm = require("Comm");

cc.Class({
  extends: comm,

  properties: {
    //是群主显示的
    setBg: {
      default: null,
      type: cc.Node
    },
    //是成员显示的
    setBg_1: {
      default: null,
      type: cc.Node
    }
  },

  onLoad() {
    this.isMaster();
  },

  start() { },

  //判读是你自己是不是群主
  isMaster: function () {
    if (G.isClubHost && G.identity == 10) {
      this.setBg_1.active = false;
      this.setBg.active = true;
    } else {
      this.setBg.active = false;
      this.setBg_1.active = true;
    }
  },

  //解散俱乐部
  onDissolutionClubClick: function () {
    cc.log("解散俱乐部点击了");
    var outView = cc.instantiate(cc.globalRes["runDissolutionForClubBox"]);
    outView.parent = this.node.parent;
    outView.getComponent("dissolutionForClubBox").selectFun(true);
    this.node.parent.getComponent("Club").setOutView(outView);
    this.node.destroy();
  },

  //退出俱乐部
  onSignOutClubClick: function () {
    cc.log("退出俱乐部点击了");
    var outView = cc.instantiate(cc.globalRes["runDissolutionForClubBox"]);
    outView.parent = this.node.parent;
    outView.getComponent("dissolutionForClubBox").selectFun(false);
    this.node.parent.getComponent("Club").setSignOutView(outView);
    this.node.destroy();
  },

  //修改
  onChangeNameClick: function () {
    cc.log("修改俱乐部名称点击了");
    var changeView = cc.instantiate(cc.globalRes["runChangeNameForClubBox"]);
    changeView.parent = this.node.parent;
    this.node.parent.getComponent("Club").setChangeView(changeView);
    this.node.destroy();
  },


  //高级设置
  onClickGaoJiSet() {
    var scene = cc.director.getScene();
    let node = FTools.ShowPop("runGaoJiSetting", scene)
    node.setPosition(640, 360);
    this.node.destroy();
  },

  onClickNotice(){
    var scene = cc.director.getScene();
    let node = FTools.ShowPop("runSetNotice", scene)
    node.setPosition(640, 360);
    this.node.destroy();
  },


  //返回
  onBackClick: function () {
    this.node.destroy();
  }

});
