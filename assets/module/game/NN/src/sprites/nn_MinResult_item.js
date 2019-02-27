cc.Class({
    extends: cc.Component,

  properties: {
    //界面属性定义
  itemObj:{
    default: null,
    type: cc.Node
  },
    },

    updateItem (userinfo) {

      var spr_resultItem = this.itemObj
      cc.loader.load({ url: userinfo.image, type: 'png' }, function (err, tex) {
        spr_resultItem.getChildByName("mask_head").getChildByName("spr_head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
      });
      
      spr_resultItem.getChildByName("label_name").getComponent(cc.Label).string = userinfo.name
      spr_resultItem.getChildByName("spr_qiang").getChildByName("label_num").getComponent(cc.Label).string = userinfo.qiangZhuang
      spr_resultItem.getChildByName("spr_zhuang").getChildByName("label_num").getComponent(cc.Label).string = userinfo.zuoZhuang
      spr_resultItem.getChildByName("spr_tui").getChildByName("label_num").getComponent(cc.Label).string = userinfo.tuiZhu 
      spr_resultItem.getChildByName("label_id").getComponent(cc.Label).string = "ID:"+userinfo.wxId 
      var scorejia = spr_resultItem.getChildByName("label_base_jia")
      var scorejian = spr_resultItem.getChildByName("label_base_jian")
      if(userinfo.score >0)
      {
        scorejia.active = true
        scorejian.active = false
        scorejia.getComponent(cc.Label).string =  "/"+userinfo.score

      }else{
        scorejia.active = false
        scorejian.active = true
        scorejian.getComponent(cc.Label).string =  "/"+userinfo.score
      }

      if( userinfo.fzWxid == 1) {
        spr_resultItem.getChildByName("spr_fangzhu").getComponent(cc.Sprite).node.active = true
      }

      if(userinfo.istuhao == true){
        spr_resultItem.getChildByName("spr_hao").getComponent(cc.Sprite).node.active = true
      }
      
      if( userinfo.isdayingjia == true){
        spr_resultItem.getChildByName("spr_win").getComponent(cc.Sprite).node.active = true
      }
     
      this.itemObj.active = true
    },
});
