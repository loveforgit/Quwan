//by yky
var GameFrame = require("GameFrame")
var cmd = require("CMD_NN")
var comm = require("Comm")
var MAX_CHIP_NUM = 30
cc.Class({
    extends: comm,
    editor: {
        executionOrder: -1
    },
    properties: {


        poker_big: {
            default: null,
            type: cc.Prefab
        },
        myCard_node: {
            default: null,
            type: cc.Node
        },
        //牌墩位置
        DockCard_node: {
            default: [],
            type: cc.Node
        },
        node_select_card: {
            default: null,
            type: cc.Node
        },
        myPokerTouch_node: {
            default: null,
            type: cc.Node
        }

    },
    onLoad() {
        this.initSelectCardLayer()
        this.refreshMyCards()

    },

    //初始化选牌界面
    initSelectCardLayer() {
        var obj = cc.find("Canvas/nnGameViewLayer")
        this._gamelayer = obj.getComponent("nnGameViewLayer")
        //初始化公有参数
        this.initPublicParm()

        //创建手牌扑克对象池
        this.PokerCardsPool = new cc.NodePool();
        for (var i = 0; i < MAX_CHIP_NUM * 10; i++)
            this.PokerCardsPool.put(cc.instantiate(this.poker_big))


        this.addTouchEvent()
        this.adddunPosSelect0TouchEvent()
    },


    //手牌排序
    sortPoker(cdPokerNodes) {
        var pokersValue = []
        for (var i = 0; i < cdPokerNodes.length; i++) {
            pokersValue.push(cdPokerNodes[i].getComponent("thirteenCompoker").pokerValue)
        }

        //值排序
        var tempPokers = []
        pokersValue.sort(function (a, b) {
            return b - a
        })
        cc.log("pokersValue : " + pokersValue)
        cc.log("sortType " + this.SortType)
        var hashPoker = []
        for (var i = 0; i < cdPokerNodes.length; i++)
            hashPoker[i] = 0
        var index = 0
        for (var i = 0; i < pokersValue.length; i++) {
            for (var j = 0; j < cdPokerNodes.length; j++) {
                if (hashPoker[j] == 0 && pokersValue[i] == cdPokerNodes[j].getComponent("thirteenCompoker").pokerValue) {
                    cdPokerNodes[j].getComponent("thirteenCompoker").setPokerIndex(index)
                    cdPokerNodes[j].getComponent("thirteenCompoker").selected = false
                    index++
                    tempPokers.push(cdPokerNodes[j])
                    hashPoker[j] = 1
                }
            }
        }
        //值排序
        if (this.SortType == 0) {
            cc.log("值排序")
            return tempPokers
        }
        else if (this.SortType == 1) {
            cc.log("花色排序")
            var tempColorPokers = []
            var colorList = ['b', 'c', 'd', 'a']
            var pokerColorList = [[], [], [], []]

            hashPoker = []
            for (var i = 0; i < tempPokers.length; i++)
                hashPoker[i] = 0
            var index = 0
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < tempPokers.length; j++) {
                    if (hashPoker[j] == 0 && colorList[i] == tempPokers[j].getComponent("thirteenCompoker").pokerColor) {
                        tempPokers[j].getComponent("thirteenCompoker").setPokerIndex(index)
                        tempPokers[j].getComponent("thirteenCompoker").selected = false
                        index++
                        tempColorPokers.push(tempPokers[j])
                        hashPoker[j] = 0
                    }
                }
            }
            return tempColorPokers
        }
        // return tempPokers
    },


    //保存手牌从左到右的位置
    savePokerPos(pokerNodes) {
        this._myPokerPos = []
        for (var i = 0; i < pokerNodes.length; i++) {
            var pos = pokerNodes[i].getPosition()
            this._myPokerPos.push(pos)
        }
    },

    //保存牌墩1牌从左到右的位置
    saveDockPos1(pokerNodes) {
        this._myDockPokerPos = []
        for (var i = 0; i < pokerNodes.length; i++) {
            var pos = pokerNodes[i].getPosition()
            this._myDockPokerPos.push(pos)
        }
    },

    //移除扑克从牌墩队列
    removePokersFormDunList(pokerNodes, dunPos) {
        cc.log("this._dunPokers[dunPos]:" + this._dunPokers[dunPos].length)
        //cc.log("pokerNodes:"+pokerNodes.length)
        //var pokerLenght = pokerNodes.length
        for (var i = pokerNodes.length - 1; i >= 0; i--) {

            for (var j = 0; j < this._dunPokers[dunPos].length; j++) {
                if (pokerNodes[i].getComponent("thirteenCompoker").pokerValue == this._dunPokers[dunPos][j].getComponent("thirteenCompoker").pokerValue && pokerNodes[i].getComponent("thirteenCompoker").pokerColor == this._dunPokers[dunPos][j].getComponent("thirteenCompoker").pokerColor) {
                    cc.log("移除扑克从牌墩队列" + pokerNodes[i].getComponent("thirteenCompoker").pokerValue + pokerNodes[i].getComponent("thirteenCompoker").pokerColor)
                    this._dunPokers[dunPos].splice(j, 1)

                }
            }
        }
        if (this._dunPokers[dunPos].length > 0) {
            cc.log("this._dunPokers[dunPos]:" + this._dunPokers[dunPos].length)
            //将选中的牌放入牌墩
            this.resetDunCardPos(dunPos, this._dunPokers[dunPos])

        }


    },


    //移除扑克从手牌队列
    removePokersFormPokerList(pokerNodes, pokerNodeList) {

        for (var i = 0; i < pokerNodes.length; i++) {
            for (var j = 0; j < pokerNodeList.length; j++) {
                if (pokerNodes[i].getComponent("thirteenCompoker").pokerValue == pokerNodeList[j].getComponent("thirteenCompoker").pokerValue && pokerNodes[i].getComponent("thirteenCompoker").pokerColor == pokerNodeList[j].getComponent("thirteenCompoker").pokerColor) {
                    cc.log("移除扑克从手牌队列" + pokerNodes[i].getComponent("thirteenCompoker").pokerValue + pokerNodes[i].getComponent("thirteenCompoker").pokerColor)
                    pokerNodeList.splice(j, 1)

                }
            }
        }
        cc.log(pokerNodeList)
    },

    //添加扑克到手牌队列
    addPokersToPokerList(pokerNodes, pokerNodeList) {
        for (var i = 0; i < pokerNodes.length; i++) {
            pokerNodeList.push(pokerNodes[i])
        }
    },


    //初始化公有参数
    initPublicParm() {

        this.myPokers = []              //我的手牌数据  
        this.myPokersPosList = []       //原始手牌位置链表        


        this._dunPokers = [[], [], []]     //每墩的扑克牌队列      
        this.SortType = 0              //0 代表值排序，1 代表花色排序
    },

    //游戏按钮点击事件
    onClickedGameEvent(event, customEventData) {

        switch (customEventData) {
            //选择把牌放在哪一墩
            //头墩点击
            case "headDun":
                this.selectPokerSetToDunPos(0)
                //this.selectPokerSetPos(0)
                break

            //比牌
            case "sure":
                this.sendWantCards()
                break
            //重置
            case "reset":
                this.resetHandPoker()
                break
            //撤掉牌墩1的牌
            case "cancleDun0":
                this.cancelSelectDunPokers(0)
                break
            case "giveUp":
                // this.node.destroy()
                // this._gamelayer.closeWantPoker()
                this.node_select_card.active = false
                break

            default:
                break
        }
    },

    //获取所选的牌
    sendWantCards() {
        //todo 获取所选的牌
        cc.log("获取所选的牌", this._dunPokers[0])
        if (this._dunPokers[0].length < 5) {
            this.addTips("不足5张牌", this.node.parent)
        } else {
            var obj = new Object()
            obj.uid = G.myPlayerInfo.uid
            obj.zinetid = cmd.SUB_QX //270
            //todo 把选的牌传过去        
            obj.cardList = this.returnPokersList(this._dunPokers[0])
            this.send(cmd.MAIN_MSG_ID, obj)
            this.destroydunPokers()
        }
    },
    //删除牌
    destroydunPokers() {
        this.cancelSelectDunPokers(0)
        this.cancelSelectDunPokers(0)
        // this.setPokersNotSelect(this._dunPokers[0]) //将牌设为未选中状态
        // this.returnDunPokerToMypoker(0, this._dunPokers[0])//牌墩牌返回手牌
        //  this.addPokersToPokerList(this._dunPokers[0], this.myPokers)
        // //重置牌位置
        // //this.resetPokerPos()
        // //重置单张牌位置
        // this.resetSinglePokerPos(this._dunPokers[0])
        // //移除扑克从牌墩队列
        // this.removePokersFormDunList(this._dunPokers[0], 0)
    },
    //重置手牌
    resetHandPoker() {
        var tempPoker = []
        for (var i = 0; i < this._dunPokers.length; i++) {
            for (var j = 0; j < this._dunPokers[i].length; j++) {
                var selectDunPokers = this._dunPokers[i][j]
                tempPoker.push(selectDunPokers)
            }
            //清空墩牌数据
            this._dunPokers[i] = []
        }

        this.addPokersToPokerList(tempPoker, this.myPokers)
        //重置牌位置
        this.resetPokerPos()
        this.setPokersNotSelect(selectDunPokers)

        var obj = new Object()
        obj.zinetid = cmd.SUB_S_REMVOE_ALL_DUN
        this.send(cmd.MAIN_MSG_ID, obj)
    },

    //选择把牌放在哪一墩
    //dunpos 0 头墩， 1 中墩， 2 尾墩
    selectPokerSetToDunPos(dunPos) {
        //选中的牌
        var selectPokers = this.getSelectPokers()
        //选中的牌长度
        var selectPokerLength = selectPokers.length

        //如果选中的长度
        if (selectPokerLength > 0) {

            if (selectPokerLength + this._dunPokers[dunPos].length > 5) {//超过牌墩1的数量               
                return
            }
            else if (selectPokerLength + this._dunPokers[dunPos].length <= 5) {//可以直接放上去            
                this.doSelectPokerToPos(dunPos, selectPokers)//将选中的牌放入牌墩
                //todo 向服务器发送消息

            }

        }

    },
    //撤销选中的牌墩的牌
    cancelSelectDunPokers(dunPos) {
        var selectDunPokers = this._dunPokers[dunPos]
        if (selectDunPokers.length <= 0) return
        cc.log("selected", selectDunPokers[0].getComponent("thirteenCompoker").selected)
        if (selectDunPokers[0].getComponent("thirteenCompoker").selected == true) {
            this.setPokersNotSelect(selectDunPokers) //将牌设为未选中状态
            this.returnDunPokerToMypoker(dunPos, selectDunPokers)//牌墩牌返回手牌                   
        }
        else {
            for (var i = 0; i < selectDunPokers.length; i++) {
                selectDunPokers[i].getComponent("thirteenCompoker").selected = true
                selectDunPokers[i].getComponent("thirteenCompoker").setPokerMaskColor()
            }
        }
    },

    //撤销选中的牌墩的牌
    cancelSelectDunPoker(dunPos, cardIndex) {
        //var selectDunPoker = this._dunPokers[dunPos][cardIndex]
        var selectDunPoker = cardIndex
        if (selectDunPoker.length <= 0) return
        cc.log("selected", selectDunPoker[0].getComponent("thirteenCompoker").selected)
        if (selectDunPoker[0].getComponent("thirteenCompoker").selected == true) {
            this.setPokersNotSelect(selectDunPoker) //将牌设为未选中状态
            this.returnDunPokerToMypoker(dunPos, selectDunPoker)//牌墩牌返回手牌             
        }
        else {
            for (var i = 0; i < selectDunPoker.length; i++) {
                selectDunPoker[i].getComponent("thirteenCompoker").selected = true
                selectDunPoker[i].getComponent("thirteenCompoker").setPokerMaskColor()
            }
        }
    },





    //设置扑克队列不选择状态
    setPokersNotSelect(pokers) {
        for (var i = 0; i < pokers.length; i++) {
            pokers[i].getComponent("thirteenCompoker").unselected()
        }
    },

    //返回手牌到墩牌
    doSelectPokerToPos(dunPos, selectPokers) {
        this.addPokersToPokerList(selectPokers, this._dunPokers[dunPos])
        //移动选中的牌，到相应的位置
        //this.moveSelectPokerToPos(dunPos, selectPokers)
        this.resetDunCardPos(dunPos, this._dunPokers[dunPos])
        //移除选中的牌从手牌
        this.removePokersFormPokerList(selectPokers, this.myPokers)
        cc.log("myPokers", this.myPokers)

        this.setPokersNotSelect(selectPokers)



    },
    //返回墩牌到手牌
    returnDunPokerToMypoker(dunPos, selectDunPokers) {
        this.addPokersToPokerList(selectDunPokers, this.myPokers)
        //重置牌位置
        //this.resetPokerPos()
        //重置单张牌位置
        for (var i = 0; i < selectDunPokers.length; i++) {
            this.resetSinglePokerPos(selectDunPokers[i])
        }

        //移除扑克从牌墩队列
        this.removePokersFormDunList(selectDunPokers, dunPos)

    },

    //重置单张手牌牌位置
    resetSinglePokerPos(poker) {
        var posIndex = -1
        for (var i = 0; i < this.myPokersPosList.length; i++) {
            if (poker.getComponent("thirteenCompoker").pokerColor == this.myPokersPosList[i].h && poker.getComponent("thirteenCompoker").pokerValue == this.myPokersPosList[i].v) {
                posIndex = i
                break
            }
        }

        //todo 找到手牌中的索引，将其位置移到那里
        //移动位置
        for (var i = 0; i < this.myPokers.length; i++) {
            if (poker.getComponent("thirteenCompoker").pokerColor == this.myPokers[i].getComponent("thirteenCompoker").pokerColor && poker.getComponent("thirteenCompoker").pokerValue == this.myPokers[i].getComponent("thirteenCompoker").pokerValue) {
                var pokerNode = this.myPokers[i]
                pokerNode.zIndex = posIndex
                pokerNode.getComponent("thirteenCompoker").setPokerIndex(posIndex)
                pokerNode.runAction(cc.spawn(cc.moveTo(0.2, this._myPokerPos[posIndex]), cc.scaleTo(0.2, 0.55)))
                break
            }


        }
    },
    //重置手牌牌位置
    resetPokerPos() {
        var tempSortPokers = this.sortPoker(this.myPokers)
        this.myPokers = tempSortPokers
        //移动位置
        for (var i = 0; i < tempSortPokers.length; i++) {
            var pokerNode = tempSortPokers[i]
            pokerNode.zIndex = i
            pokerNode.getComponent("thirteenCompoker").setPokerIndex(i)
            pokerNode.runAction(cc.spawn(cc.moveTo(0.2, this._myPokerPos[i]), cc.scaleTo(0.2, 0.55)))

        }
    },


    //重置某墩墩牌位置
    resetDunCardPos(dunPos, cbSelectPokers) {
        var posConfig = [[100, 186, 272, 358, 444, 530, 626, 712, 798, 884, 970, 1056, 1142], [285, 365, 445, 525, 605], [240, 345, 450, 555, 640]]
        var posy = [150, 150, 150]
        var dunPosList = posConfig[dunPos]
        var PokersTotLength = cbSelectPokers.length
        var index = 0
        var scale = dunPos > 1 ? 1 : 0.9

        cbSelectPokers = this.sortPoker(cbSelectPokers)
        for (var i = 0; i < PokersTotLength; i++) {
            var selectPoker = cbSelectPokers[index]
            selectPoker.zIndex = 10000 + i + dunPos * 100
            if (i == PokersTotLength - 1) {
                selectPoker.getComponent("thirteenCompoker").setPokerMaskWidth(140)
            } else {
                selectPoker.getComponent("thirteenCompoker").setPokerMaskWidth((dunPosList[1] - dunPosList[0]) + 5)
            }
            index++
            selectPoker.runAction(cc.spawn(cc.moveTo(0.1, cc.p(dunPosList[i], posy[dunPos])), cc.scaleTo(0.2, scale)))
            this.dadadqa(dunPos, selectPoker)

        }

    },
    //移动选中的牌到相应的位置
    //0 头墩，1 中墩， 2 尾墩
    moveSelectPokerToPos(dunPos, cbSelectPokers) {

        //var posConfig = [[-85, 5, 85], [-160, -80, 0,80,160], [-200, -95, 10,115,200]]
        //var posy = [248,139,6]
        var posConfig = [[100, 186, 272, 358, 444, 530, 626, 712, 798, 884, 970, 1056, 1142], [285, 365, 445, 525, 605], [240, 345, 450, 555, 640]]
        var posy = [150, 150, 150]
        var dunPosList = posConfig[dunPos]
        var PokersTotLength = this._dunPokers[dunPos].length + cbSelectPokers.length
        var index = 0
        var scale = dunPos > 1 ? 1 : 0.9

        cbSelectPokers = this.sortPoker(cbSelectPokers)
        for (var i = this._dunPokers[dunPos].length; i < PokersTotLength; i++) {
            var selectPoker = cbSelectPokers[index]
            selectPoker.zIndex = 10000 + i + dunPos * 100
            if (i == PokersTotLength - 1) {
                selectPoker.getComponent("thirteenCompoker").setPokerMaskWidth(140)
            } else {
                selectPoker.getComponent("thirteenCompoker").setPokerMaskWidth((dunPosList[1] - dunPosList[0]) * scale)
            }

            index++
            selectPoker.runAction(cc.spawn(cc.moveTo(0.1, cc.p(dunPosList[i], posy[dunPos])), cc.scaleTo(0.2, scale)))
            this.dadadqa(dunPos, selectPoker)
            this._dunPokers[dunPos].push(selectPoker)
        }

    },
    //恢复牌面层级
    dadadqa(dunPos, selectPoker) {
        selectPoker.runAction(cc.sequence(cc.callFunc(function () {

        }), cc.delayTime(0.1), cc.callFunc(function () {
            selectPoker.zIndex = 1000 + dunPos * 100
        })))

    },

    //获取选中的牌
    getSelectPokers() {
        var selectPokers = []
        for (var i = 0; i < this.myPokers.length; i++) {
            var commPoker = this.myPokers[i].getComponent("thirteenCompoker");

            if (commPoker.selected == true) {
                selectPokers.push(this.myPokers[i])
            }
        }
        return selectPokers
    },



    //刷新自己手牌
    refreshMyCards() {
        //先移除现在的手牌
        if (this.myPokers.length != 0) {
            for (var i = 0; i < this.myPokers.length; i++) {
                this.myPokers[i].getComponent("thirteenCompoker").reset()
                this.PokerCardsPool.put(this.myPokers[i])
            }
            this.myPokers = []
        }
        this.myPokersPosList = []
        var PokerList = []
        var pokerColorList = ["a", "b", "c", "d"]
        var pokerValueList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        for (var i = 0; i < pokerColorList.length; i++) {
            for (var j = 0; j < pokerValueList.length; j++) {
                var obj = new Object()
                obj.h = pokerColorList[i]
                obj.v = pokerValueList[j]
                PokerList.push(obj)
                this.myPokersPosList.push(obj)
            }
        }
        this.myPokers = this.createPokers(this.myCard_node, PokerList, 80)
        this.savePokerPos(this.myPokers)

    },






    //创建扑克列
    createPokers(node, PokerList, offerx) {
        var offerx = offerx
        var AllPokersWidth = PokerList.length * offerx
        var pokerLength = PokerList.length
        var tempPokers = []
        var pokerlimit = 12
        for (var i = 0; i < PokerList.length; i++) {
            var poker = null;
            poker = this.PokerCardsPool.get()
            tempPokers.push(poker)
            poker.parent = node
            poker.zIndex = i
            if (PokerList[i].v != 0) {
                poker.getComponent("thirteenCompoker").setPoker(PokerList[i].v, PokerList[i].h)
            }
            // cc.log("poker=="+PokerList[i].v+PokerList[i].h)
            poker.getComponent("thirteenCompoker").setPokerMaskWidth(142)
            poker.getComponent("thirteenCompoker").setPokerMaskHeight(185)
            poker.getComponent("thirteenCompoker").setPokerIndex(i)
            if (i < 14) {
                poker.setPosition((i - 1) * offerx + 50 - 500 + 640, 284 + 360)
            } else if (i < 28) {
                poker.setPosition((i - 15) * offerx + 50 - 500 + 640, 181 + 360)
            } else if (i < 42) {
                poker.setPosition((i - 29) * offerx + 50 - 500 + 640, 78 + 360)
            } else {
                poker.setPosition((i - 43) * offerx + 50 - 500 + 640, -25 + 360)
            }

            poker.scale = 0.55
        }



        return tempPokers
    },




    //设置所有的手牌为不选择状态
    setAllMyPokerNotSelect() {
        // cc.log("setAllMyPokerNotSelect")
        for (var i = 0; i < this.myPokers.length; i++) {
            var myPoker = this.myPokers[i].getComponent("thirteenCompoker")
            myPoker.unselected()
        }
    },
    //设置所有的墩1牌为不选择状态
    setAllDunCardsNotSelect(dunPos) {
        // cc.log("setAllMyPokerNotSelect")
        for (var i = 0; i < this._dunPokers[dunPos].length; i++) {
            var myPoker = this._dunPokers[dunPos][i].getComponent("thirteenCompoker")
            myPoker.unselected()
        }
    },
    //添加手牌触摸事件
    addTouchEvent: function () {
        cc.log("add touch event")
        var self = this
        self.judgeSelect = function (touchPos, maskWidth, maskheight) {
            if (touchPos.x > 0 && touchPos.y > 0 && touchPos.x < maskWidth && touchPos.y < maskheight) {
                return true
            }
            else {
                return false
            }
        }
        this._touchstart = { x: 0, y: 0 }
        this._touchPokers = []
        this._touchStartPoker = null
        this.myPokerTouch_node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("poker touch start")
            for (var i = 0; i < self.myPokers.length; i++) {
                var masknode = self.myPokers[i].getChildByName("maskLayout")
                var touchStartLocation = masknode.convertTouchToNodeSpace(event)
                var maskWidth = masknode.width
                var maskheight = masknode.height
                if (self.judgeSelect(touchStartLocation, maskWidth, maskheight)) {
                    self.myPokers[i].getComponent("thirteenCompoker").setPokerSelecting()
                    self._touchStartPoker = self.myPokers[i]
                }
            }

            if (self._touchStartPoker == null) {
                self.setAllMyPokerNotSelect()
            }
            else {
                self._touchPokers.push(self._touchStartPoker)
            }
        })


        this.myPokerTouch_node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("poker touch end")
            // cc.log("event location ", event.getLocation())
            for (var i = 0; i < self.myPokers.length; i++) {
                self.myPokers[i].getComponent("thirteenCompoker").setPokerNotSelecting()
            }
            for (var i = 0; i < self._touchPokers.length; i++) {
                var pokerSelected = self._touchPokers[i].getComponent("thirteenCompoker").selected
                cc.log("pokerSelected", pokerSelected)
                if (pokerSelected == true) {
                    self._touchPokers[i].getComponent("thirteenCompoker").unselected()
                }
                else {
                    self._touchPokers[i].getComponent("thirteenCompoker").doselect()
                }

            }
            self.selectPokerSetToDunPos(0)
            self._touchPokers = []
            self._touchStartPoker = null
        })
    },

    //添加牌墩1触摸事件
    adddunPosSelect0TouchEvent: function () {
        cc.log("add touch event")
        var self0 = this
        self0.dunPosSelect0 = function (touchPos, maskWidth, maskheight) {
            if (touchPos.x > 0 && touchPos.y > 0 && touchPos.x < maskWidth && touchPos.y < maskheight) {
                return true
            }
            else {
                return false
            }
        }

        this._touchstart0 = { x: 0, y: 0 }
        this._touchPokers0 = []
        this._touchStartPoker0 = null
        this.DockCard_node[0].on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("poker touch start")
            self0._touchStartPoker0 = null
            self0._touchPokers0 = []
            for (var i = 0; i < self0._dunPokers[0].length; i++) {
                var masknode = self0._dunPokers[0][i].getChildByName("maskLayout")
                var touchStartLocation = masknode.convertTouchToNodeSpace(event)
                var maskWidth = masknode.width
                var maskheight = masknode.height
                if (self0.dunPosSelect0(touchStartLocation, maskWidth, maskheight)) {
                    self0._dunPokers[0][i].getComponent("thirteenCompoker").setPokerSelecting()
                    self0._touchStartPoker0 = self0._dunPokers[0][i]
                }
            }

            if (self0._touchStartPoker0 == null) {
                self0.setAllDunCardsNotSelect(0)
            }
            else {
                self0._touchPokers0.push(self0._touchStartPoker0)
            }
        })

        this.DockCard_node[0].on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("poker touch end")
            // cc.log("event location ", event.getLocation())
            for (var i = 0; i < self0._dunPokers[0].length; i++) {
                self0._dunPokers[0][i].getComponent("thirteenCompoker").setPokerNotSelecting()
            }
            for (var i = 0; i < self0._touchPokers0.length; i++) {
                var pokerSelected = self0._touchPokers0[i].getComponent("thirteenCompoker").selected
                cc.log("pokerSelected", pokerSelected)

            }
            //撤销选中的牌墩的牌
            self0.cancelSelectDunPoker(0, self0._touchPokers0)
            self0.cancelSelectDunPoker(0, self0._touchPokers0)
            self0._touchPokers0 = []
            self0._touchStartPoker0 = null
        })
    },

    //返回牌数据的列表
    returnPokersList(pokerNodes) {
        var tempPokersData = []
        for (var i = 0; i < pokerNodes.length; i++) {
            var obj = new Object()
            obj.v = pokerNodes[i].getComponent("thirteenCompoker").pokerValue
            obj.h = pokerNodes[i].getComponent("thirteenCompoker").pokerColor
            tempPokersData.push(obj)
        }
        return tempPokersData
    },

    onDestroy() {
        //销毁对象池
        this.PokerCardsPool.clear()


        this.uneventRegist(this)
        this.unregist(this)
    },

});

