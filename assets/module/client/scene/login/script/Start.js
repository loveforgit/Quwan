cc.Class({
    extends: cc.Component,

    properties: {
        progress_CheckUpdate: {
            default: null,
            type: cc.ProgressBar,
        },
        rtext_tip: {
            default: null,
            type: cc.RichText,
        },
        manifestUrl: cc.RawAsset,
        _updating: false,
        _canRetry: false,
        _storagePath: '',
    },

    onLoad() {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;

            // jsb.fileUtils.getWritablePath() + 
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'Huanleqipai');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                cc.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        cc.log('Hot update is ready');

        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isBrowser !== true) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            cc.log("Max concurrent tasks count have been limited to 2");
        }

        this.progress_CheckUpdate.progress = 0;
        this.checkUpdate();
    },

    checkUpdate() {
        if (this._updating) {
            cc.log('Checking or updating ...');
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            cc.log('Failed to load local manifest ...');
            cc.director.loadScene("LoadingRes");
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkUpdateCallBack.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    checkUpdateCallBack(event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                this._checkListener = null;
                cc.director.loadScene("LoadingRes");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                this._checkListener = null;
                cc.director.loadScene("LoadingRes");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                cc.eventManager.removeListener(this._checkListener);
                this._checkListener = null;
                cc.director.loadScene("LoadingRes");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('New version found, will try to update.');
                this.progress_CheckUpdate.progress = 0;
                this.clearCheckCallBack();
                this.hotUpdate();
                break;
            default:
                return;
        }
    },

    clearCheckCallBack() {
        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },

    hotUpdate() {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCallBack.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl);
            }

            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    updateCallBack(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.progress_CheckUpdate.progress = event.getPercent();
                //event.getPercentByFile();

                // this.rtext_tip.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.rtext_tip.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    cc.log('Updated file: ' + msg);
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('Update failed. ' + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this.setSearchPaths();
            // cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },

    setSearchPaths() {
        // Prepend the manifest's search path
        var searchPaths = jsb.fileUtils.getSearchPaths();
        var newPaths = this._am.getLocalManifest().getSearchPaths();
        console.log(JSON.stringify(newPaths));
        Array.prototype.unshift(searchPaths, newPaths);
        // This value will be retrieved and appended to the default search path during game startup,
        // please refer to samples/js-tests/main.js for detailed usage.
        // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
        cc.sys.localStorage.setItem('HotUpdateSearchPathsForHuanleqipai', JSON.stringify(searchPaths));
        jsb.fileUtils.setSearchPaths(searchPaths);
    },

    onDestroy() {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    },
});
