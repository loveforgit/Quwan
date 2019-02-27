var comm = require("Comm");
cc.Class({
  extends: comm,

  properties: {
    startTime: {
      default: null,
      type: cc.Node
    },

    endTime: {
      default: null,
      type: cc.Node
    },

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
    this.init();
  },

  //初始化
  init() {
    var date = new Date(); // 年
    this.SY = this.startTime.getChildByName("year").getComponent(cc.Label);
    this.SM = this.startTime.getChildByName("month").getComponent(cc.EditBox);
    this.SD = this.startTime.getChildByName("day").getComponent(cc.EditBox);
    this.SY.string = date.getFullYear();
    this.SM.string = date.getMonth() + 1;
    this.SD.string = date.getDate();

    this.EY = this.endTime.getChildByName("year").getComponent(cc.Label);
    this.EM = this.endTime.getChildByName("month").getComponent(cc.EditBox);
    this.ED = this.endTime.getChildByName("day").getComponent(cc.EditBox);

    this.EY.string = date.getFullYear();
    this.EM.string = date.getMonth() + 1;
    this.ED.string = date.getDate();
  },

  onClickOk() {
    var sm = parseInt(this.SM.string);
    var em = parseInt(this.EM.string);

    var sd = parseInt(this.SD.string);
    var ed = parseInt(this.ED.string);

    var daty = this.getCountDays()
    if ((sm > 0 && sm < 13) && (em > 0 && em < 13) && (sd > 0 && sd <= daty) && (ed > 0 && ed <= daty)) {

      var obj = new Object();
      obj.uid = G.myPlayerInfo.uid;
      obj.timeMin = this.SY.string + "-" + sm + "-" + sd;
      obj.timeMax = this.EY.string + "-" + em + "-" + ed;
      cc.log(obj.timeMin);
      cc.log(obj.timeMax);
      obj.zinetid = cc.globalMgr.msgIds.SMALL_QUERYTimeINTEGRAL_CLUB;
      obj.clubId = G.saveClubID;
      this.send(cc.globalMgr.msgIds.CLUB_MAIN_ID, obj);
    } else {

      cc.globalMgr.globalFunc.addMessageBox("输入日期错误,请重新输入")
    }
  },

  getCountDays() {
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth();
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth + 1);
    /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
  },

  undateInfo(body) {
    var content = this.scrollView.content;
    content.removeAllChildren();
    var list = body.clubIntergralDetailsList;
    content.height = this.item.height * list.length * 1.1;
    for (var i = 0; i < list.length; i++) {
      var item = cc.instantiate(this.item);
      content.addChild(item);
      item.getChildByName("id").getComponent(cc.Label).string = list[i].userWxId + "";
      item.getChildByName("nick").getComponent(cc.Label).string = list[i].userName + "";
      item.getChildByName("jifen").getComponent(cc.Label).string = list[i].addNum + "";
      item.getChildByName("main").getComponent(cc.Label).string = list[i].managerName;
      item.getChildByName("data").getComponent(cc.Label).string = list[i].setDate + "";
      item.setPosition(0, -33 - i * (item.height + 5));
    }
  },

  onClickDestroy() {
    FTools.HidePop(this.node)
  },


});
