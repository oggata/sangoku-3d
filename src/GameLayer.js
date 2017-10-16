var item001Cnt = 0;
var isCancelAd = false;
var isFailedAd = false;
var GameLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage) {
        this._super();
        this.layerType = "HOME";
        this.selectedCardNum = 1;
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        this.storage = storage;
        this.storage.isSteal = false;
        this.status = "gaming";

        this.back = cc.LayerColor.create(new cc.Color(255, 191, 0, 255), 640, 1136);
        this.back.setPosition(0, 0);
        this.addChild(this.back);

        this.pngCastle = cc.Sprite.create("res/castle.png");
        this.pngCastle.setPosition(320,800);
        this.back.addChild(this.pngCastle);

        this.pngCristal = cc.Sprite.create("res/cristal.png");
        this.pngCristal.setPosition(280,500);
        this.back.addChild(this.pngCristal);
//this.storage.saveCreatureDataToStorage(1);
//this.storage.saveCreatureDataToStorage(2);
        var cardButton = new cc.MenuItemImage("res/button_get_card.png", "res/button_get_card_on.png", function () {
            if (this.storage.totalCoinAmount <= 0) {
                this.errorLabel.setString("クリスタルが不足しています.");
                this.error.setVisible(true);
                this.errorCnt = 1;
            } else {
                this.storage.totalCoinAmount -= 1;
                var _rand = this.getRandNumberFromRange(1, 6);
                var _card = CONFIG.CARD[_rand];
                this.storage.saveCreatureDataToStorage(_card);
                this.goToCardLayer(_rand);
            }
        }, this);
        cardButton.setPosition(320, 600);
        var coinButton = new cc.MenuItemImage("res/button_get_coin.png", "res/button_get_coin_on.png", function () {
            if (this.pastSecond >= 1) {
                this.errorLabel.setString("" + this.pastSecond + "秒で1クリスタルに変換できます.");
                this.error.setVisible(true);
                this.errorCnt = 1;
            } else {
                this.setTargetTime();
                this.storage.addCoin(1);
            }
        }, this);
        coinButton.setPosition(320, 400);

        var battleBit = new cc.MenuItemImage("res/button_bit.png", "res/button_bit.png", function () {
            this.goToCreditLayer();
        }, this);
        battleBit.setPosition(550, 50);
        var battleButton = new cc.MenuItemImage("res/button_battle.png", "res/button_battle_on.png", function () {
            this.goToBattleLayer();
        }, this);
        battleButton.setPosition(120, 1000);
        var debugButton = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            this.goToFieldLayer("GREEN");
        }, this);
        debugButton.setPosition(100, 100);
        var debugButton2 = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            cc.sys.localStorage.clear();
        }, this);
        debugButton2.setPosition(100, 50);
        var menu001 = new cc.Menu(cardButton, coinButton, debugButton, debugButton2,battleBit);
        menu001.setPosition(0, 0);
        this.addChild(menu001);
        this.coinAmountLabel = new cc.LabelTTF("x " + this.storage.totalCoinAmount, "Arial", 28);
        this.coinAmountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        //this.coinAmountLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.addChild(this.coinAmountLabel);
        this.coinAmountLabel.setAnchorPoint(0, 0.5);
        this.coinAmountLabel.setPosition(320, 505);
        this.timeLabel = new cc.LabelTTF("00:00:00", "Arial", 24);
        this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        //this.timeLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.addChild(this.timeLabel);
        this.timeLabel.setPosition(320, 260);
        this.playerNameLabel = new cc.LabelTTF(this.storage.playerName, "Arial", 18);
        this.playerNameLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.addChild(this.playerNameLabel);
        this.playerNameLabel.setPosition(320, 670);
        this.targetTime = 0;
        this.maxChargeTime = 60 * 3;
        this.timeGauge = new TimeGauge(this);
        this.timeGauge.setPosition(0, 0);
        this.back.addChild(this.timeGauge);
        this.errorCnt = 0;
        this.error = cc.Sprite.create("res/error.png");
        this.error.setPosition(320, 500);
        this.addChild(this.error, 9999999);
        this.error.setVisible(false);
        this.errorLabel = new cc.LabelTTF("", "Arial", 28);
        this.errorLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.error.addChild(this.errorLabel);
        this.errorLabel.setPosition(320, 120);
        this.header = new Header(this);
        this.addChild(this.header);
        this._time = 0;
        this._webSocketIntervalCnt = 0;
        this.scheduleUpdate();
        return true;
    },
    update: function (dt) {
        this.timeGauge.update();
        if (this.errorCnt >= 1) {
            this.errorCnt++;
            if (this.errorCnt >= 30 * 2) {
                this.errorCnt = 0;
                this.error.setVisible(false);
            }
        }
        if (this.storage.isSteal == true) {
            this.goToFieldLayer("RED");
        }
        this.header.userCntLabel.setString("x " + this.storage.users.length);
        this.header.treasureCntLabel.setString("x " + this.storage.treasureAmount);
        this.coinAmountLabel.setString("x " + this.storage.totalCoinAmount);
        this._webSocketIntervalCnt++;
        if (this._webSocketIntervalCnt >= 30) {
            var _data = '{' 
                + '"type":"SYNC_PLAYERS",' 
                + '"userId":' + this.storage.userId 
                + ',' 
                + '"userStatus":' + 0 
                + ',' 
                + '"treasureAmount":' + this.storage.treasureAmount + '' 
                + '}';
            this.storage.webSocketHelper.sendMsg(_data);
            this._webSocketIntervalCnt = 0;
        }
        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }else{
            this.timeLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        }
        this.timeLabel.setString("残り" + this.pastSecond + "秒");
    },
    setTargetTime: function () {
        //if(this.storage.targetTime == null){
        this.storage.targetTime = parseInt(new Date() / 1000) + this.maxChargeTime;
        this.storage.saveCurrentData();
        //}
    },
    getPastSecond2: function () {
        var diffSecond = this.storage.targetTime - parseInt(new Date() / 1000);
        return diffSecond;
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
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(TopLayer.create(this.storage));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    //シーンの切り替え----->
    goToStageLayer: function (pSender) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    goToCreditLayer: function (pSender) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CreditLayer.create(this.storage, 0));
        cc.director.runScene(cc.TransitionSlideInR.create(1, scene));
    },
    goToBattleLayer: function (pSender) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(BattleLayer2.create(this.storage, 0));
        cc.director.runScene(cc.TransitionSlideInR.create(1, scene));
    },
    goToCardLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CardLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFade.create(0.3, scene));
    },
    goToFieldLayer: function (hackingType) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        scene.addChild(FieldLayer2.create(this.storage, hackingType, false));
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
GameLayer.create = function (storage) {
    return new GameLayer(storage);
};
var GameLayerScene = cc.Scene.extend({
    onEnter: function (storage) {
        this._super();
        var layer = new GameLayer(storage);
        this.addChild(layer);
    }
});
var Gauge = cc.Node.extend({
    ctor: function (width, height, color) {
        this._super();
        this.width = width;
        this.height = height;
        this.rectBase = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), this.width, this.height);
        this.rectBase.setPosition(0, 0);
        this.addChild(this.rectBase, 1);
        //this.rectBack = cc.LayerColor.create(new cc.Color(105, 105, 105, 255), this.width - 1, this.height - 1);
        //this.rectBack.setPosition(1, 1);
        //this.addChild(this.rectBack, 2);
        var colorCode = new cc.Color(255, 255, 255, 255);
        if (color == "RED") {
            colorCode = new cc.Color(255, 0, 0, 255);
            this.rectBack = cc.LayerColor.create(new cc.Color(0, 255, 0, 255), this.width - 2, this.height - 2);
            this.rectBack.setPosition(2, 2);
            this.addChild(this.rectBack, 2);
        }
        if (color == "GREEN") {
            colorCode = new cc.Color(0, 255, 0, 255);
            this.rectBack = cc.LayerColor.create(new cc.Color(255, 0, 0, 255), this.width - 2, this.height - 2);
            this.rectBack.setPosition(2, 2);
            this.addChild(this.rectBack, 2);
        }
        this.rectBar = cc.LayerColor.create(colorCode, this.width - 2, this.height - 2);
        this.rectBar.setPosition(2, 2);
        this.addChild(this.rectBar, 3);
        this.rectBar.setAnchorPoint(0, 0);
    },
    init: function () {},
    update: function (scaleNum) {
        this.rectBar.setScale(scaleNum, 1);
    },
    setVisible: function (isVisible) {
        this.rectBase.setVisible(isVisible);
        this.rectBack.setVisible(isVisible);
        this.rectBar.setVisible(isVisible);
    }
});