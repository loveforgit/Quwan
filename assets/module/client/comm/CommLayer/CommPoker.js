
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        pokerWidth : 45,
        pokerType : "big",
        initcard :  {
            default: null,
            type: cc.Node
        },
        normal: {
            default: null,
            type: cc.Node
        },
        lefttop: {
            default: null,
            type: cc.Node
        },
        leftcolor: {
            default: null,
            type: cc.Node
        },
        rightbottom: {
            default: null,
            type: cc.Node
        },
        rightcolor: {
            default: null,
            type: cc.Node
        },
        kingbg:{
            default: null,
            type: cc.Node
        },
        king: {
            default: null,
            type: cc.Node
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        maskLayout:{
            default:null,
            type:cc.Node
        },
        maskLayoutbg:{
            default:null,
            type:cc.Node
        },
       
    },

    // use this for initialization
    onLoad: function () {
        this.initcard.active = true ;
        this.normal.active = false;
        this.selected = false ;
        this.kingbg.active = false ;
        this.pokerValue = 0
        this.pokerColor = ""
        this.maskLayout.width = this.pokerWidth
        //是否在选中状态
        this.selecting =  false
        this.maskLayout.opacity = 0
        this.maskLayoutbg.opacity = 0
        //扑克在牌列中的位置
        this.PokerIndex = -1
    },
    setPokerIndex(index){
        this.PokerIndex = index
    },
    getPokerIndex(){
        return this.PokerIndex
    },

    unselected:function(){
        if(this.selected){
            if(this.pokerValue >= 52){
                this.kingbg.y = 0;
            }else{
                this.normal.y = 0;
            }
            this.maskLayout.y = -90
            this.maskLayoutbg.y = -90
        }
        this.selected = false ;
        // cc.log("unselected", this.selected)
    },

    doselect:function(){
        // cc.log("doselect", this.selected)
        if(this.selected == false){
   
            if(this.pokerValue >= 52) {
                this.kingbg.y = this.kingbg.y + 30;
            }else{
                this.normal.y = this.normal.y + 30;
            }
            this.maskLayout.y = this.maskLayout.y + 30
            this.maskLayoutbg.y = this.maskLayoutbg.y + 30 
            this.selected = true ;
        }else{
            this.unselected();
        }
    },

    //设置扑克没有在选中状态
    setPokerNotSelecting(){
        if(this.selecting == true){
            this.selecting = false
            this.maskLayout.opacity = 0
            this.maskLayoutbg.opacity = 0;
        }
    },

    //设置扑克在正在选中状态
    setPokerSelecting(){
        if(this.selecting == false){
            this.selecting = true
            this.maskLayout.opacity = 0
            this.maskLayoutbg.opacity = 150
        }
    },

    //获取遮罩层的宽和高
    getPokerMaskSize()
    {
        var maskWidth = this.maskLayout.width
        var maskHeight = this.maskLayout.height
        var size = {}
        size.width = maskWidth
        size.height = maskHeight
        return size
    },

    //设置遮罩整张扑克
    setPokerMask(){
        this.maskLayout.width = 138
    },

    //设置遮罩宽度
    setPokerMaskWidth (width){
        this.maskLayout.width = width   
    },

    setPoker:function(pokerValue, pokerColor){
        //cc.log("---commpoker-pokerValue--" , pokerValue)
       // cc.log("---commpoker-pokerColor--" , pokerColor)
        let self = this ;
        self.pokerValue = pokerValue
        this.pokerValue = pokerValue
        this.pokerColor = pokerColor
        var frame , cardframe ; 
        var rightFrame;
        if(self.pokerValue < 52){
            if(pokerColor == "a"){
                frame = this.atlas.getSpriteFrame('sp_diamonds');
                rightFrame = this.atlas.getSpriteFrame('fangpian.')
            }else if(pokerColor == "b"){
                frame = this.atlas.getSpriteFrame('sp_Spades');
                rightFrame = this.atlas.getSpriteFrame('heitao')
            }else if(pokerColor == "c"){
                frame = this.atlas.getSpriteFrame('sp_heart');
                rightFrame = this.atlas.getSpriteFrame('hongxin')
            }else if(pokerColor == "d"){
                frame = this.atlas.getSpriteFrame('sp_clubs');
                rightFrame = this.atlas.getSpriteFrame('meihua');
            }
            
            //14 代表A 15代表 2
            var tempPokerValue = self.pokerValue
           
            if(tempPokerValue > 13)
            {
                tempPokerValue = self.pokerValue - 13
                
            }
            //方块 红桃
            if(pokerColor == "a" || pokerColor == "c")
            {
                cardframe = this.atlas.getSpriteFrame('r'+ tempPokerValue)
            }else{
                cardframe = this.atlas.getSpriteFrame(tempPokerValue)
            }

            this.leftcolor.getComponent(cc.Sprite).spriteFrame = frame;
            this.lefttop.getComponent(cc.Sprite).spriteFrame = cardframe;
            this.rightcolor.getComponent(cc.Sprite).spriteFrame = rightFrame;
            this.rightbottom.getComponent(cc.Sprite).spriteFrame = cardframe;

            this.initcard.active = false ;
            this.normal.active = true ;
            this.kingbg.active = false ;
            this.normal.y = 0 ;
        }else if(self.pokerValue == 53){
            if(this.pokerType == "big")
                frame = this.atlas.getSpriteFrame('sp_sking_big');
            else if(this.pokerType == "mid")
                frame = this.atlas.getSpriteFrame('sp_sking_mid');
            else
                frame = this.atlas.getSpriteFrame('sp_sking_small');
            this.king.getComponent(cc.Sprite).spriteFrame = frame;
            this.initcard.active = false ;
            this.normal.active = false;
            this.kingbg.active = true ;
            this.kingbg.y = 0 ;
        }else if(self.pokerValue == 54){
            if(this.pokerType == "big")
                frame = this.atlas.getSpriteFrame('sp_king_big');
            else if(this.pokerType == "mid")
                frame = this.atlas.getSpriteFrame('sp_king_mid');
            else
                frame = this.atlas.getSpriteFrame('sp_king_Small');

            this.king.getComponent(cc.Sprite).spriteFrame = frame;
            this.initcard.active = false ;
            this.normal.active = false;
            this.kingbg.active = true ;
            this.kingbg.y = 0 ;
        }
    },
    reset:function(){
        this.x = 0
        this.y = 0
        this.normal.y = 0;
        this.kingbg.y = 0;
        this.maskLayout.y = -90
        this.maskLayoutbg.y = -90
        this.normal.active = false;
        this.kingbg.active = false;
        
        this.initcard.active = true ;
        this.normal.active = false;
        this.selected = false ;
        this.kingbg.active = false ;
        this.pokerValue = 0
        this.pokerColor = ""
        //是否在选中状态
        this.selecting =  false
        this.maskLayout.opacity = 0
        this.maskLayoutbg.opacity = 0
        this.index = 0
        this.maskLayout.width = this.pokerWidth
    }
});
