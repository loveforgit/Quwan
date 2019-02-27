
var comm = require("Comm")
cc.Class({
    extends: comm,

    properties: {
        Figures:{
            default: null,
            type: cc.SpriteAtlas
        },
        AtlasWidth: 10
    },
    ctor(){
        this._spList = []
    },
    
    onLoad(){
        
    },  
    setNum(num){

        //移除所有的艺术字体
        cc.log(this._spList)
        for(var i = 0 ;i < this._spList.length;i++)
        {
            this._spList[i].destroy()
        }
        this._spList = []
        var tempNum = num>=0?"+" + num :"" + num + ""
        cc.log("tempNum ", tempNum)
        for(var i = 0;i < tempNum.length ;i ++)
        {
            var temp = tempNum[i]
            var sp = new cc.Node().addComponent(cc.Sprite)
            if(tempNum[i] == "万")
            {
                temp = "wan"
            }
            else if (tempNum[i] == "+"){
                temp = "add"
            }
            var spFrame = this.Figures.getSpriteFrame(temp);
            sp.spriteFrame= spFrame
            sp.node.parent = this.node
            sp.node.x = i * this.AtlasWidth
            this._spList.push(sp)
        }
    }

    // update (dt) {},
});
