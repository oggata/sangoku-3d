var LifeLayer = cc.Layer.extend({
    ctor: function (storage, playerColorTxt) {
        this._super();

        this.playerColorTxt = "green";

        this.field = cc.Sprite.create("res/monitor_battle.png");
        this.field.setPosition(20, 200);
        this.field.setAnchorPoint(0, 0);
        this.field.setScale(0.95);
        this.addChild(this.field);

        this.redScoreLabel = new cc.LabelTTF("1000", "Arial", 28);
        this.redScoreLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.redScoreLabel.setAnchorPoint(0, 0);
        this.redScoreLabel.setPosition(20,600);
        this.field.addChild(this.redScoreLabel,999999);

        this.greenScoreLabel = new cc.LabelTTF("1000", "Arial", 28);
        this.greenScoreLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.greenScoreLabel.setAnchorPoint(1, 0);
        this.greenScoreLabel.setPosition(620,600);
        this.field.addChild(this.greenScoreLabel,999999);

        this.resultLabel = new cc.LabelTTF("YOU LOSE..", "Arial", 52);
        this.resultLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.resultLabel.setPosition(320,320);
        this.resultLabel.setVisible(false);
        this.field.addChild(this.resultLabel,999999);

        this.markers = [];
        for(var row = 0; row < 40; row++) { 
            for(var col = 0; col < 40; col++) { 
                this.marker = cc.LayerColor.create(new cc.Color(255, 255, 255, 255), 16, 16);
                this.marker.setPosition(16*col, 16*row);
                this.marker.colorId = "white";
                this.marker.col = col;
                this.marker.row = row;
                this.field.addChild(this.marker);
                this.markers.push(this.marker);
            }
        }

        var data001 = { col : this.getRandNumberFromRange(1,39), row : this.getRandNumberFromRange(1,39)};
        var data002 = { col : this.getRandNumberFromRange(1,39), row : this.getRandNumberFromRange(1,39)};
        var data003 = { col : this.getRandNumberFromRange(1,39), row : this.getRandNumberFromRange(1,39)};
        var data004 = { col : this.getRandNumberFromRange(1,39), row : this.getRandNumberFromRange(1,39)};
        var data005 = { col : this.getRandNumberFromRange(1,39), row : this.getRandNumberFromRange(1,39)};
        var data006 = { col : this.getRandNumberFromRange(1,39), row : this.getRandNumberFromRange(1,39)};

        for(var i = 0; i < this.markers.length; i++) {
            if(this.markers[i].col == data001.col && this.markers[i].row == data001.row){
                this.markers[i].colorId = "red";
            }
            if(this.markers[i].col == data002.col && this.markers[i].row == data002.row){
                this.markers[i].colorId = "red";
            }
            if(this.markers[i].col == data003.col && this.markers[i].row == data003.row){
                this.markers[i].colorId = "red";
            }
            if(this.markers[i].col == data004.col && this.markers[i].row == data004.row){
                this.markers[i].colorId = "green";
            }
            if(this.markers[i].col == data005.col && this.markers[i].row == data005.row){
                this.markers[i].colorId = "green";
            }
            if(this.markers[i].col == data006.col && this.markers[i].row == data006.row){
                this.markers[i].colorId = "green";
            }
        }
        this.timeCnt = 0;
        this.scheduleUpdate();
    },

    update: function (dt) {
        var _redCnt = 0;
        var _greenCnt = 0;
        var _whiteCnt = 0;
        for(var i = 0; i < this.markers.length; i++) {
            if(this.markers[i].colorId == "white"){
                this.markers[i].color = new cc.Color(0, 0, 0, 255);
                _whiteCnt++;
            }
            if(this.markers[i].colorId == "black"){
                this.markers[i].color = new cc.Color(0, 0, 0, 255);
            }
            if(this.markers[i].colorId == "red"){
                this.markers[i].color = new cc.Color(140, 0, 0, 255);
                _redCnt++;
            }
            if(this.markers[i].colorId == "green"){
                this.markers[i].color = new cc.Color(35, 140, 0, 255);
                _greenCnt++;
            }
        }
        this.redScoreLabel.setString(_redCnt);
        this.greenScoreLabel.setString(_greenCnt);
        this.timeCnt++;
        if(this.timeCnt >= 5){
            this.timeCnt =0;
            this.increment("red");
            this.increment("green");
            //this.kill("red","green");
            //this.kill("green","red");
        }

        if(_whiteCnt == 0){
            if(this.playerColorTxt == "green"){
                if(_redCnt < _greenCnt){
                    this.resultLabel.setString("YOU WIN...\nHACKING SUCCESS");
                }if(_redCnt > _greenCnt){
                    this.resultLabel.setString("YOU LOST...\nHACKING MISSIED");
                }
                this.resultLabel.setFontFillColor(new cc.Color(0, 255, 0, 255));
                this.resultLabel.setVisible(true);
            }else if(this.playerColorTxt == "red"){
                if(_redCnt < _greenCnt){
                    this.resultLabel.setString("YOU LOST...\nPROTECTION MISSIED");
                }if(_redCnt > _greenCnt){
                    this.resultLabel.setString("YOU WIN...\nPROTECTION SUCCESS");
                }
                this.resultLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
                this.resultLabel.setVisible(true);
            }
        }

    },

    increment:function(colorTxt){
        for(var i = 0; i < this.markers.length; i++) {
            var _speed = this.getRandNumberFromRange(1,5);
            if(this.getRandNumberFromRange(1,2) == _speed){
                //先ずはpower1-8で考える
                //自分のどちら方向に進むかを指定する
                if(this.markers[i].colorId == colorTxt){
                    var _rand = this.getRandNumberFromRange(1,9);
                    var _distance = this.getRandNumberFromRange(1,5);
                    //_distance = 3;
                    _targetCol = 0;
                    _targetRow = 0;
                    if(_rand == 1){
                        _targetCol = this.markers[i].col - _distance;
                        _targetRow = this.markers[i].row - _distance;
                    }else if(_rand == 2){
                        _targetCol = this.markers[i].col;
                        _targetRow = this.markers[i].row - _distance;
                    }else if(_rand == 3){
                        _targetCol = this.markers[i].col + _distance;
                        _targetRow = this.markers[i].row - _distance;
                    }else if(_rand == 4){
                        _targetCol = this.markers[i].col - _distance;
                        _targetRow = this.markers[i].row;
                    }else if(_rand == 5){
                        _targetCol = this.markers[i].col + _distance;
                        _targetRow = this.markers[i].row;
                    }else if(_rand == 6){
                        _targetCol = this.markers[i].col - _distance;
                        _targetRow = this.markers[i].row + _distance;
                    }else if(_rand == 7){
                        _targetCol = this.markers[i].col;
                        _targetRow = this.markers[i].row + _distance;
                    }else if(_rand == 8){
                        _targetCol = this.markers[i].col + _distance;
                        _targetRow = this.markers[i].row + _distance;
                    }

                    for(var j = 0; j < this.markers.length; j++) {
                        if(this.markers[j].col == _targetCol && this.markers[j].row == _targetRow){
                            if(this.markers[j].colorId == "white"){
                                this.markers[j].colorId = colorTxt;
                                //ここの座標のマーカーの周囲を見て相手をkillする
                            }
                        }
                    }
                }
            }
        }
    },

    kill:function(colorTxt,enemyColorTxt){
        for(var i = 0; i < this.markers.length; i++) {
            //周囲の8個のますの状態を調べる
            var _001col = this.markers[i].col - 1;
            var _001row = this.markers[i].row - 1;
            var _002col = this.markers[i].col;
            var _002row = this.markers[i].row - 1;
            var _003col = this.markers[i].col + 1;
            var _003row = this.markers[i].row - 1;
            var _004col = this.markers[i].col - 1;
            var _004row = this.markers[i].row;
            var _005col = this.markers[i].col + 1;
            var _005row = this.markers[i].row;
            var _006col = this.markers[i].col - 1;
            var _006row = this.markers[i].row + 1;
            var _007col = this.markers[i].col;
            var _007row = this.markers[i].row + 1;
            var _008col = this.markers[i].col + 1;
            var _008row = this.markers[i].row + 1;

            var _cnt = 0;
            for(var j = 0; j < this.markers.length; j++) {
                if(this.markers[j].col == _001col && this.markers[j].row == _001row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
                if(this.markers[j].col == _002col && this.markers[j].row == _002row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
                if(this.markers[j].col == _003col && this.markers[j].row == _003row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
                if(this.markers[j].col == _004col && this.markers[j].row == _004row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
                if(this.markers[j].col == _005col && this.markers[j].row == _005row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
                if(this.markers[j].col == _006col && this.markers[j].row == _006row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
                if(this.markers[j].col == _007col && this.markers[j].row == _007row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
                if(this.markers[j].col == _008col && this.markers[j].row == _008row){
                    if(this.markers[j].colorId == colorTxt){
                        _cnt++;
                    }
                }
            }
            if(_cnt >= 1){
                if(this.markers[i].colorId == enemyColorTxt){
                    this.markers[i].colorId = colorTxt;
                }
            }
            /*
            //1. 生きているセルの隣に生きているセルが1つもしくは0の場合、そのセルは過疎により死ぬ。
            if(_cnt == 0 || _cnt == 1){
                if(this.markers[i].colorId == colorTxt){
                    //this.markers[i].colorId = "white";
                }
            }
            //2. 生きているセルの隣に生きているセルが2つもしくは3つの場合、そのセルは生き残る。（ちょうど良い生存状況）
            if(_cnt == 2 || _cnt == 3){
                if(this.markers[i].colorId == colorTxt){
                    this.markers[i].colorId = colorTxt;
                }
            }
            //3. 生きているセルの隣に生きているセルが4つ以上ある場合、そのセルは過密により死ぬ。
            if(_cnt >= 4){
                if(this.markers[i].colorId == colorTxt){
                    //this.markers[i].colorId = "white";
                }
            }
            //4. 死んでいるセルの隣に生きているセルがちょうど3つあれば、生きているセルになる。（生殖、誕生）
            if(_cnt == 3){
                if(this.markers[i].colorId == "white"){
                    this.markers[i].colorId = colorTxt;
                }
            }
            */
        }
    },

    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    touchStart: function (location) {
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
    },
    touchMove: function (location) {},
    touchFinish: function (location) {},
    //シーンの切り替え----->
    goToTopLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(TopLayer.create(this.storage));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    //シーンの切り替え----->
    goToStageLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    goToBattleLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(BattleLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionSlideInR.create(1, scene));
    },
    goToFieldLayer: function (hackingType) {
        var scene = cc.Scene.create();
        scene.addChild(FieldLayer.create(this.storage, hackingType));
        cc.director.runScene(cc.TransitionFlipY.create(0.5, scene));
    },
    showInfo: function (text) {
        console.log(text);
        if (this.infoLabel) {
            var lines = this.infoLabel.string.split('\n');
            var t = '';
            if (lines.length > 0) {
                t = lines[lines.length - 1] + '\n';
            }
            t += text;
            this.infoLabel.string = t;
        }
    },
    admobInit: function () {
        if ('undefined' == typeof (sdkbox)) {
            isFailedAd = true;
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof (sdkbox.PluginAdMob)) {
            isFailedAd = true;
            this.showInfo('sdkbox.PluginAdMob is undefined')
            return;
        }
        var self = this
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function (name) {
                self.showInfo('adViewDidReceiveAd name=' + name);
            },
            adViewDidFailToReceiveAdWithError: function (name, msg) {
                self.showInfo('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
            },
            adViewWillPresentScreen: function (name) {
                self.showInfo('adViewWillPresentScreen name=' + name);
            },
            adViewDidDismissScreen: function (name) {
                isCancelAd = true;
                self.showInfo('adViewDidDismissScreen name=' + name);
            },
            adViewWillDismissScreen: function (name) {
                self.showInfo('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: function (name) {
                self.showInfo('adViewWillLeaveApplication=' + name);
                if (name == "gameover") {
                    sdkbox.PluginAdMob.hide("gameover");
                    item001Cnt = 1;
                }
            }
        });
        sdkbox.PluginAdMob.init();
        // just for test
        var plugin = sdkbox.PluginAdMob
        if ("undefined" != typeof (plugin.deviceid) && plugin.deviceid.length > 0) {
            this.showInfo('deviceid=' + plugin.deviceid);
            // plugin.setTestDevices(plugin.deviceid);
        }
    }
});
LifeLayer.create = function (storage) {
    return new LifeLayer(storage);
};
var LifeLayerScene = cc.Scene.extend({
    onEnter: function (storage) {
        this._super();
        var layer = new LifeLayer(storage);
        this.addChild(layer);
    }
});
