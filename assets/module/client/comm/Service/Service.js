//消息注册分发
var ServiceClass=cc.Class({
    extends:cc.Component,
    statics:{
        register:[],
        httpRegister:[]
    },
    ctor(){
        this.register = [];
        this.httpRegister = [];
    },
    
    logN () {

        cc.log("#logNlogN:"+Object.keys(this.register).length);
    },
    excute(msgNumber,body)
    {
        var hasExcute=false;
        var key=msgNumber+"";
        var targets=this.register[key];
        if(targets==undefined)
        {
            cc.log("#未注册:"+msgNumber+"  "+Object.keys(this.register).length);
            return false;
        }
        var size=targets.length;
        if(size==0)
        {
            cc.log("未注册:"+msgNumber);
        }
       // cc.log("excute----"+size);
        for(var i=size-1;i>=0;i--)
        {
            var t=targets[i];
            t.func(msgNumber,body,t.target);
            hasExcute=true;
            if(t.swallow!=undefined&&t.swallow)
            {
                break;
            }
           // cc.log("msgNumber:"+msgNumber);
        }
        
       
        //body=null;

        return hasExcute;
    },

    registWithSwallow(msgNumber,target,func,swallow)
    {
        //cc.log("----*222**1---"+msgNumber);
        var key=msgNumber+"";
        var targets=this.register[key];

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
                // cc.log("----size---"+size);
            }
            // cc.log("----***1---"+msgNumber);
            var tt={};
            tt.target=target;
            tt.func=func;
            tt.swallow=swallow;
            targets.push(tt);
        }
        else{
            //cc.log("----2---"+msgNumber);
            targets=[];
            var tt={};
            tt.target=target;
            tt.func=func;
            tt.swallow=swallow;
            targets.push(tt);
            this.register[key]=targets;
        }
    },
    regist(msgNumber,target,func)
    {
        // cc.log("msgNumber ", msgNumber)
        this.registWithSwallow(msgNumber,target,func,false);
    },
    //移除target所有的监听
    //如果msgNumber 有值，只移除msgNumer
    unregist(target, msgNumber)
    {
        if(msgNumber != undefined)
        {
            var msgKey = msgNumber;
            var targets = this.register[msgKey];
            if(targets == undefined)
            {
                return;
            }
            var size = targets.length;
            cc.log("msg key "  + msgKey)
            cc.log("size " + size)
            for(var i = 0;i < size;i++)
            {
                var t = targets[i];
                if(t.target == target)
                {
                    targets.splice(i, 1);
                    cc.log("remove msg regist "+ msgKey);
                    break;
                }
            }
        }
        else
        {
            for(var key in this.register)
            {
                var targets=this.register[key];
                if(targets==undefined)
                {
                    return;
                }
                var size=targets.length;
                for(var i=0;i<size;i++)
                {
                   
                    var t=targets[i];
                    
                    if(t.target==target)
                    {
                        targets.splice(i, 1);
                        cc.log("remove regist "+key);
                        break;
                    }
                }
            }
        }
    },
    
    clear() {
        this.httpRegister={};
        this.register={};
    },
  
    sendHttpRequest(req,callback,uid)
    {
        var reqtype = req.reqtype;
        delete req.reqtype;
        var str = JSON.stringify(req);
        var data = "";
        if(uid ==  undefined) 
        {
            data="reqtype="+reqtype+"&json="+str + "&uid=" + G.myPlayerInfo.uid;
        }
        else{
            data = "reqtype="+reqtype+"&json="+str + "&uid=" + uid;
        }
        cc.log(data);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET",G.urlHttpServerPath, true);
        xhr.onreadystatechange = function () {

            if(xhr.readyState == 4 && xhr.status == 200){
                var response = xhr.responseText;
                try
                {
                    if(callback)
                    {
                        var obj=JSON.parse(response);
                        callback(obj);
                    }
                }
               catch (e)
                {
                   cc.log(e.message);
                }
            }else if(xhr.readyState == 4 && xhr.status != 200){
                try
                {
                    cc.log("http 应答错误:"+xhr.status);
                    if(callback)
                    {
                        callback(null);
                    }
                }
                catch (e)
                {
                    cc.log(e.message);
                }
            }

        };
        xhr.send(data);
    },
    sendHttpRequest2(msgNumber,req,callback,target)
    {

        var str = JSON.stringify(req);
        var data="msgNumber="+msgNumber+"&json="+str;


        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST",G.urlHttpServerPath);


        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {

            if(xhr.readyState == 4 && xhr.status == 200){

                var response = xhr.responseText;

                if(callback)
                {
                    cc.log("http response:"+response);
                    var obj=JSON.parse(response);
                    obj.target=target;
                    callback(obj);
                }
            }else if(xhr.readyState == 4 && xhr.status != 200){
                cc.log("http 应答错误:"+xhr.status);
                if(callback)
                {
                    callback(null);
                }
            }
        };
        xhr.send(data);
    },

    checkIpRequest(uid,ip,callback)
    {

        var xhr = cc.loader.getXMLHttpRequest();

        xhr.open("GET","http://ip.taobao.com/service/getIpInfo.php?ip="+ip, true);

        //  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {

            if(xhr.readyState == 4 && xhr.status == 200){

                var response = xhr.responseText;

                try
                {
                    if(callback)
                    {
                        cc.log("http response:"+response);
                        var obj=JSON.parse(response);
                        callback(uid,obj);
                    }
                }
                catch (e)
                {
                    cc.log(e.message);
                }
            }
            else{
                callback(uid,null);
            }
        };
        xhr.send();
    }
}) 

ServiceClass._instance = null;
ServiceClass.getInstance = function(){
    if(!ServiceClass._instance){
        ServiceClass._instance = new ServiceClass();
    }
    return ServiceClass._instance;
}
    
    
    
