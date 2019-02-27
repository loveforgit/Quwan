cc.Class({
    extends: cc.Component,

    properties: {
        rtext_Tip: {
            default: null,
            type: cc.RichText,
        },
        btn_sure :{
            default: null,
            type: cc.Button
        },
        btn_canel:{
            default: null,
            type: cc.Button
        }
    },
    
    onLoad(){
        this._okFunc = null;
        this._target = null;
    },

    start () {

    },

    setTipStr (str) {
        this.rtext_Tip.string = str;
    },

    setSureBtnVisible(bVisible){
        this.btn_sure.node.active = bVisible
    },

    setOkBtnClickEvent(target,func, isDestroy){
        this._target = target
        this._okFunc = func
        this._isDestroy = isDestroy
    },

    showOkOrCanelBtn(index){
        if(index == 1)
        {
            this.showOkBtn()
        }
        else if(index == 2)
        {
            this.showCanelBtn()
        }
        else if(index == 3)
        {
            this.showOkAndCanelBtn()
        }
    },

    //显示确定按钮
    showOkBtn()
    {
        this.btn_sure.node.active = true
        this.btn_canel.node.active = false
        this.btn_sure.node.x = 11
        this.btn_sure.node.y = -200
    },

    //显示取消按钮
    showCanelBtn()
    {
        this.btn_sure.node.active = false
        this.btn_canel.node.active = true
        this.btn_canel.node.x = 11
        this.btn_sure.node.y = -200
    },

    //显示确定取消俩按钮
    showOkAndCanelBtn()
    {
        this.btn_sure.node.active = true
        this.btn_canel.node.active= true
        this.btn_sure.node.x = 193
        this.btn_sure.node.y = -200
        this.btn_canel.node.x = -128
        this.btn_canel.node.y = -200
    },

    //取消按钮点击事件
    onClickedCanel()
    {
        this.node.destroy()
    },

    btnOnSure () {
        if(this._target != null && this._okFunc != null)
        {
            // this._target.func(this._okFunc)
            this._okFunc(this._target);
            if(this._isDestroy != true)
            {
                this.node.destroy()
            }
           
        }else{
            this.node.destroy();
        }
    },
});
