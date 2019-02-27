
var SceneManager =  cc.Class({
    extends: cc.Component,
    statics: {
        currentScene:null,
        currentSceneName:"",

    },
    ctor(){
        this.currentScene=null;
        this.currentSceneName = "";
    },
    //预加载场景
    preloadScene(sceneName, target, callback)
    {
        var that = this
        cc.globalMgr.globalFunc.addWaittingConnection("正在加载资源,请稍后...");
        cc.director.preloadScene(sceneName, function () {
            cc.log("Next scene preloaded");
            cc.globalMgr.globalFunc.removeWaittingConnection();
            that.loadScene(sceneName, target, callback)
        });
    },
    //切换场景
    loadScene(sceneName, target, callback)
    {
        this.currentSceneName = sceneName;
        this.currentScene = cc.director.loadScene(sceneName,function(){
            if(callback != undefined && callback != undefined )
            {
                callback(target); 
            }
        })
    },
    //获取当前场景
    getRunningScene()
    {
        return cc.director.getScene()
    },
    //运行指定场景
    runScene(sceneName)
    {
        cc.director.runScene(sceneName)
    },
    //立刻切换指定场景
    runSceneImmediate(scene, onBeforeLoadScene, onLaunched)
    {
        cc.director.runSceneImmediate(scene, onBeforeLoadScene, onLaunched)
    }

});

SceneManager._instance = null;
SceneManager.getInstance = function(){
    if(!SceneManager._instance){
        SceneManager._instance = new SceneManager();
    }
    return SceneManager._instance;
}
