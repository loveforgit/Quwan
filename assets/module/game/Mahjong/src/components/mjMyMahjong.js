
cc.Class({
    extends: cc.Component,

    properties: {
        _startDrag:false,
        _dragEventSended:false,
        _originalPosition:null,
        _startPosition:null,
    },

    onLoad: function () {
          
    },

    init (gameControl) {
        this.gameControl = gameControl;
        this._originalPosition = this.node.position;
        this.initTouchEvent();
        cc.log("初始化沱牌")
    },
    
    initTouchEvent:function(){
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if(self.gameControl.isMingLou == true){
                cc.log("明牌了 不能拖动")
                return
            }
            if(!self.gameControl._isMyTurn && !self.gameControl._nodePGCH.active){
                console.log("not your turn.");
                if(self._originalPosition != null){
                    self.mjTouchEnd(event.target);
                }

                event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_end', true));
                return;
            }

            if(self.gameControl._mjLimitOneDrag) return;
            self.gameControl._mjLimitOneDrag = true;
            //event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_start', true));
            self._startDrag = true;
            self._dragEventSended = false;
            // self._originalPosition = new cc.Vec2(self.node.getPositionX(), 0); 

            var localPos = self.node.getParent().convertTouchToNodeSpace(event.touch);
            //event.target.setPosition(localPos);
            self._startPosition = localPos;
        });

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log('touchmove');
            if(!self.gameControl._isMyTurn && !self.gameControl._nodePGCH.active){
                console.log("not your turn.");
                if(self._originalPosition != null){
                    self.mjTouchEnd(event.target);
                }

                event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_end', true));
                return;
            }
            if(!self._startDrag) return;
            cc.log("拖牌")
            var localPos = self.node.getParent().convertTouchToNodeSpace(event.touch);
            if (self._dragEventSended) {
                event.target.setPosition(localPos);
            }

            var dtY = self._startPosition.y - localPos.y;
            var dp = cc.pDistance(self._startPosition,localPos);
            if(!self._dragEventSended && dp > 10){
                event.target.dispatchEvent( new cc.Event.EventCustom('mj_dragevent_start', true));
                self._dragEventSended = true;

                self.gameControl.refreshMyHoldsPos();

                var nodeParentPos = self.node.getParent().getParent().getParent().getPosition()

                var pos =  self.node.convertToWorldSpaceAR(cc.v2(0,0));
                // self.gameControl._chuPaidrag.position = cc.p(pos.x, pos.y + 15);
                // self.gameControl._chuPaidrag.active = true;
                // self.gameControl.setSpriteFrameByMJID("M_", self.gameControl._chuPaidrag.getComponent(cc.Sprite), self.node.mjId);
            }
        });
        
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("mj dragging is end!");
            if(!self.gameControl._isMyTurn && !self.gameControl._nodePGCH.active){
                console.log("not your turn.");
                if(self._originalPosition != null){
                    self.mjTouchEnd(event.target);
                }

                event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_end', true));
                return;
            }
            //event.target.y = event.getLocationY() - 87.5;
            if(!self._startDrag) return;
            var localPos = self.node.getParent().convertTouchToNodeSpace(event.touch);
            // event.target.setPosition(localPos);
            var dp = cc.pDistance(self._startPosition,localPos);
            if(self._dragEventSended){
                if(dp > 40){
                    cc.log(dp,"00000000000000")
                    event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_shoot', true));
                    self.mjTouchEnd(event.target);
                    // setTimeout(function() {
                    //     if(self._originalPosition != null){
                    //         // event.target.setPosition(self._originalPosition);
                    //         event.target.dispatchEvent( new cc.Event.EventCustom('initMahjongs', true));
                    //     }
                    // }, 2000);
                }else{
                    cc.log(dp,"00000000000000-->")
                    event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_end', true));
                    if(self._originalPosition != null){
                        self.mjTouchEnd(event.target);
                    }
                }
                
            }else{
               // event.target.x = self._originalPosition.x;
            }

            self.clearDragFlag();
        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if(!self.gameControl._isMyTurn && !self.gameControl._nodePGCH.active){
                console.log("not your turn.");
                if(self._originalPosition != null){
                    self.mjTouchEnd(event.target);
                }

                event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_end', true));
                return;
            }
            cc.log("3333333333222112")
            //event.target.y = event.getLocationY() - 87.5;
            if(!self._startDrag) return;
            var localPos = self.node.getParent().convertTouchToNodeSpace(event.touch);
            // event.target.setPosition(localPos);
            var dp = cc.pDistance(self._startPosition,localPos);
            if(self._dragEventSended){
                if(dp > 40){
                    cc.log("00000000000000")
                    event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_shoot', true));
                    self.mjTouchEnd(event.target);
                    // setTimeout(function() {
                    //     if(self._originalPosition != null){
                    //         // event.target.setPosition(self._originalPosition);
                    //         event.target.dispatchEvent( new cc.Event.EventCustom('initMahjongs', true));
                    //     }
                    // }, 2000);
                }else{
                    cc.log("00000000000000-->")
                    event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_end', true));
                    if(self._originalPosition != null){
                        self.mjTouchEnd(event.target);
                    }
                }
                
            }else{
               // event.target.x = self._originalPosition.x;
            }

            self.clearDragFlag();
            // if(!self.gameControl._isMyTurn){
            //     console.log("not your turn.");
            //     return;
            // }

            // if(self._dragEventSended){
            //     if(self._originalPosition != null){
            //         self.mjTouchEnd(event.target);
            //     }

            //     event.target.dispatchEvent( new cc.Event.EventCustom('mj_touchevent_end', true));
            // }else{
                
            //    // event.target.x = self._originalPosition.x;
            // }

            // self.clearDragFlag();
        });
    },

    mjTouchEnd (mjNode) {
      if(this._originalPosition != null){
            mjNode.setPosition(this._originalPosition);
            mjNode.active = true;
      }
        // this.gameControl._chuPaidrag.position = cc.p(0,-500);
        // this.gameControl._chuPaidrag.active = false;

        this.clearDragFlag();
    },
  
    clearDragFlag () {
        this._startDrag = false;
        this._dragEventSended = false;
        this.gameControl._mjLimitOneDrag = false;
    }
});
