var cmd = require("CMD_mahjong")

cc.Class({
    extends: cc.Component,

    properties: {
        node_mjList: {
            default: [],
            type: cc.Node,
        },
        node_mj: {
            default: null,
            type: cc.Node,
        },
        label_num:{
            default: null,
            type: cc.Node,
        }
    },

    onLoad () {
        this.mjWidth = 75+30;
        this.initView();
        this.mjNumList = [];
        this.copyMJNum();
    },
    
    createMjSpr (nodeParent, posX, mjId) {
        var nodeMj = cc.instantiate(this.node_mj);
        nodeMj.parent = nodeParent;
        nodeMj.position = cc.p(posX,0);
        nodeMj.mjId = mjId;
        var mjSprite = nodeMj.getComponent(cc.Sprite);
        mjSprite.spriteFrame = cc.globalMgr.mahjongmgr.getSpriteFrameByMJID("M_",mjId);    
        //nodeMj.getChildByName("lab_num").getComponent(cc.Label).string = d;
    },
    copyMJNum(){
        for(var i=0;i<52;i++){
            var nodeMjNum = cc.instantiate(this.label_num);
            this.mjNumList.push(nodeMjNum)
        }
    },
    refreshNum(msgList){
        var pos1 = 10;
        var pos2 = 10;
        var pos3 = 10;
        var pos4 = 10;
        var pos5 = 10;
        for(var i = 0; i < msgList.length; i++){
            //var nodeMjNum = cc.instantiate(this.label_num);
           this.mjNumList[i].getComponent(cc.RichText).string = msgList[i].zhang + "";
            if ( i < 9){
                this.mjNumList[i].parent = this.node_mjList[0]
                this.mjNumList[i].position = cc.p(pos1,88)
                pos1 +=this.mjWidth;
            }
            else if (i >= 9 && i < 18){
                this.mjNumList[i].parent = this.node_mjList[1]
                this.mjNumList[i].position = cc.p(pos2,88)
                pos2 +=this.mjWidth;
            }
            else if(i >= 18 && i < 27){
               this.mjNumList[i].parent = this.node_mjList[2]
                this.mjNumList[i].position = cc.p(pos3,88)
                pos3 +=this.mjWidth;
            }
            else if(i >= 27 && i < 34){
                this.mjNumList[i].parent = this.node_mjList[3]
                this.mjNumList[i].position = cc.p(pos4,88)
                pos4 +=this.mjWidth;
            }
            else {
               this.mjNumList[i].parent = this.node_mjList[4]
                this.mjNumList[i].position = cc.p(pos5,88)
                pos5 +=this.mjWidth;
            }
          
           
        }
    },
    initView () {
        var posX = 0;
        //筒(1-9)
        for(var i = 1; i < 10; ++i) {            
            this.createMjSpr(this.node_mjList[0], posX, i);
            posX += this.mjWidth;
        }
        
        //条(11-19)
        posX = 0;
        for(var i = 11; i < 20; ++i){
            this.createMjSpr(this.node_mjList[1], posX, i);
            posX += this.mjWidth;
        }
        
        //万(21-29)
        posX = 0;
        for(var i = 21; i < 30; ++i){
            this.createMjSpr(this.node_mjList[2], posX, i);
            posX += this.mjWidth;
        }
        
        //东南西北风(31,33,35,37)
        posX = 0;
        this.createMjSpr(this.node_mjList[3], posX, 31);
        posX += this.mjWidth;

        this.createMjSpr(this.node_mjList[3], posX, 33);
        posX += this.mjWidth;

        this.createMjSpr(this.node_mjList[3], posX, 35);
        posX += this.mjWidth;

        this.createMjSpr(this.node_mjList[3], posX, 37);
        posX += this.mjWidth;

        //中、发、白(41,43,45)
        this.createMjSpr(this.node_mjList[3], posX, 41);
        posX += this.mjWidth;

        this.createMjSpr(this.node_mjList[3], posX, 43);
        posX += this.mjWidth;

        this.createMjSpr(this.node_mjList[3], posX, 45);
        posX += this.mjWidth;

        //梅兰菊竹(61,63,65,67)
        // posX = 0;
        // this.createMjSpr(this.node_mjList[4], posX, 61);
        // posX += this.mjWidth;

        // this.createMjSpr(this.node_mjList[4], posX, 63);
        // posX += this.mjWidth;

        // this.createMjSpr(this.node_mjList[4], posX, 65);
        // posX += this.mjWidth;

        // this.createMjSpr(this.node_mjList[4], posX, 67);
        // posX += this.mjWidth;

        // //春夏秋冬(71,73,75,77)
        // this.createMjSpr(this.node_mjList[4], posX, 71);
        // posX += this.mjWidth;

        // this.createMjSpr(this.node_mjList[4], posX, 73);
        // posX += this.mjWidth;

        // this.createMjSpr(this.node_mjList[4], posX, 75);
        // posX += this.mjWidth;

        // this.createMjSpr(this.node_mjList[4], posX, 77);
        // posX += this.mjWidth;
    },

    btnOnMjSelect (event) {
        var mjId = event.target.mjId;

        var data = new Object();
        data.uid = G.myPlayerInfo.uid;    
        data.zinetid = cmd.TEST_REQ_MJ_SEND;
        data.pai = mjId;
        //G.socketMgr.socket.send(G.gameNetId, cc.globalMgr.msgObjs.testReqMj(data));
        G.socketMgr.socket.send(G.gameNetId, data);
        this.node.active = false;
    },

    btnOnClose () {
        this.node.active = false;
    },
});
