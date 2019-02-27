
var EventManager=cc.Class({
    extends: cc.Component,
    statics: {
        register:[]
    },
    ctor(){
        this.register = [];
    },
    
    fireEvent(eventName,obj) {

        cc.log("fire event:"+eventName);
        G.mylog.push("eventName" , eventName);
        var targets = this.register[eventName];
        if (targets == undefined) {
            return;
        }
        var size = targets.length;
        // cc.log("fire event size:"+size);
        for (var i = 0; i < size; i++) {
            var t = targets[i];
            // cc.log("fire event i:"+i);
            t.func(obj, t.target);
        }
    },

    regist(eventName,target,func)
    {
        var targets=this.register[eventName];

        if(targets!=undefined)
        {
            var size=targets.length;
            for(var i=0;i<size;i++)
            {
                var t=targets[i];
                if(t.func==func&&t.target==target)
                {

                    return;
                }
            }
            var tt={};
            tt.target=target;
            tt.func=func;
            targets.push(tt);
        }
        else{
            targets=[];
            var tt={};
            tt.target=target;
            tt.func=func;
            targets.push(tt);
            this.register[eventName]=targets;
        }
    },
    unregist(target) {
        for (var key in this.register) {
            var targets = this.register[key];
            if (targets == undefined) {
                return;
            }
            var size = targets.length;
            for (var i = 0; i < size; i++) {
                var t = targets[i];
                if (t.target == target) {
                    targets.splice(i, 1);
                    break;
                }
            }
            }
    },

    unregistAll(key) {
        delete this.register[key];
    }

});

EventManager._instance = null;
EventManager.getInstance = function(){
    if(!EventManager._instance){
        EventManager._instance = new EventManager();
    }
    return EventManager._instance;
}