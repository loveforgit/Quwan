var comm = require("Comm")
cc.Class({
    extends: comm,

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
        pokerWidth: 45,
        pokerType: "big",
        maskY: -71,
        initcard: {
            default: null,
            type: cc.Node
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        maskLayout: {
            default: null,
            type: cc.Node
        },
        maskLayoutbg: {
            default: null,
            type: cc.Node
        },

    },

    // use this for initialization
    onLoad: function () {
        this.initcard.active = true;
        this.selected = false;
        this.pokerValue = 0
        this.pokerColor = ""
        this.maskLayout.width = this.pokerWidth
        //是否在选中状态
        this.selecting = false
        this.maskLayout.opacity = 0
        this.maskLayoutbg.opacity = 0
        this._isCanPlayEffect = true

        //扑克在牌列中的位置
        this.PokerIndex = -1
    },
    setPokerIndex(index) {
        this.PokerIndex = index
    },
    getPokerIndex() {
        return this.PokerIndex
    },

    unselected: function () {
        if (this.selected) {
            this.initcard.y = 0;
            this.maskLayout.y = -90
            this.maskLayoutbg.y = -90
        }
        this.selected = false;
        this.selecting = false
        this.maskLayoutbg.color = new cc.Color(0, 0, 0)
        this.maskLayoutbg.opacity = 0
        // cc.log("unselected", this.selected)
    },

    doselect: function () {
        // cc.log("doselect", this.selected)
        if (this.selected == false) {
            this.initcard.y = this.initcard.y + 50;
            this.maskLayout.y = this.maskLayout.y + 50
            this.maskLayoutbg.y = this.maskLayoutbg.y + 50
            this.selected = true;
        } else {
            this.unselected();
        }
    },
    //设置牌遮罩无颜色
    setPokerMaskNoColor() {
        this.maskLayoutbg.opacity = 0
        this.maskLayoutbg.color = new cc.Color(0, 0, 0)
    },
    //设置牌遮罩的颜色
    setPokerMaskColor() {
        this.maskLayoutbg.opacity = 150
        this.maskLayoutbg.color = new cc.Color(97, 189, 84)
    },

    //设置扑克没有在选中状态
    setPokerNotSelecting() {
        if (this.selecting == true) {
            this.selecting = false
            this.maskLayout.opacity = 0
            this.maskLayoutbg.opacity = 0;
            // cc.log("没有选中状态")

            // this._isCanPlayEffect = true
        }
    },

    //设置是否播放地点牌音效
    setIsPlayEffect(isPlay)
    {
        this._isCanPlayEffect = isPlay
    },

    //设置扑克在正在选中状态
    setPokerSelecting() {
        if (this.selecting == false) {
            this.selecting = true
            this.maskLayout.opacity = 0
            this.maskLayoutbg.opacity = 150
            // cc.log("选中状态")

            if (this._isCanPlayEffect) {
                this.playclickcardSound("TOUCH_CARD");
                this._isCanPlayEffect = false
            }
        }
    },

    //播放麻将点牌音效
    playclickcardSound(soundName) {
        this.playEffectMusic("resources/sounds/mahjong/audio/" + soundName + ".mp3", false)
    },


    //获取遮罩层的宽和高
    getPokerMaskSize() {
        var maskWidth = this.maskLayout.width
        var maskHeight = this.maskLayout.height
        var size = {}
        size.width = maskWidth
        size.height = maskHeight
        return size
    },

    //设置遮罩整张扑克
    setPokerMask() {
        this.maskLayout.width = 142
    },

    //设置遮罩宽度
    setPokerMaskWidth(width) {
        this.maskLayout.width = width
    },

    //设置遮罩高度
    setPokerMaskHeight(height) {
        this.maskLayout.height = height
    },

    //设置癞子牌
    setPokerLaizi() {
    },

    setPoker: function (pokerValue, pokerColor) {

        let self = this;
        self.pokerValue = pokerValue
        this.pokerValue = pokerValue
        this.pokerColor = pokerColor
        this.initcard.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(pokerValue + pokerColor);
    },

    showBg() {
        this.initcard.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("spBigBg");
    },

    reset: function () {
        this.node.scale = 1
        this.x = 0
        this.y = 0
        this.maskLayout.y = -90
        this.maskLayoutbg.y = -90
        this.initcard.y = 0;

        this.initcard.active = true;
        this.selected = false;
        this.pokerValue = 0
        this.pokerColor = ""
        //是否在选中状态
        this.selecting = false
        this.maskLayout.opacity = 0
        this.maskLayoutbg.opacity = 0
        this.index = 0
        this.maskLayout.width = this.pokerWidth

        this._isCanPlayEffect = true
    }
});
