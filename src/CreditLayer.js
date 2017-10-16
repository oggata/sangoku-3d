var CreditLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage) {
        this._super();
        //this.webSocketHelper = new WebSocketHelper(this);
        this.layerType = "HOME";
        this.selectedCardNum = 1;
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        this.storage = storage;

        this.baseNode = cc.LayerColor.create(new cc.Color(255, 191, 0, 255), 640, 1136);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);

        var backButton = new cc.MenuItemImage("res/button_before.png", "res/button_before.png", function () {
            this.goToStageLayer();
        }, this);
        backButton.setPosition(90, 970);
        var menu001 = new cc.Menu(backButton);
        menu001.setPosition(0, 0);
        this.baseNode.addChild(menu001);

        this.layoutSprite = cc.Sprite.create("res/back_credit.png");
        this.layoutSprite.setPosition(320,600);
        this.baseNode.addChild(this.layoutSprite);

        this.coin001Label = new cc.LabelTTF("0.000BTC", "Arial", 62);
        this.coin001Label.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.coin001Label.setAnchorPoint(0, 0);
        this.coin001Label.setPosition(50, 170);
        this.layoutSprite.addChild(this.coin001Label);

        this.coin002Label = new cc.LabelTTF("1000SGK", "Arial", 62);
        this.coin002Label.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.coin002Label.setAnchorPoint(0, 0);
        this.coin002Label.setPosition(50, 60);
        this.layoutSprite.addChild(this.coin002Label);
        return true;
    },

    update: function (dt) {

    },
    goToCreditLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CreditLayer.create(this.storage, 0));
        cc.director.runScene(cc.TransitionSlideInR.create(1, scene));
    },
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
        cc.director.runScene(cc.TransitionSlideInL.create(1.5, scene));
    },
    goToBattleLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(BattleLayer2.create(this.storage, 0));
        cc.director.runScene(cc.TransitionSlideInR.create(1, scene));
    },
    goToFieldLayer: function (hackingType) {
        var scene = cc.Scene.create();
        scene.addChild(FieldLayer2.create(this.storage, hackingType, false));
        cc.director.runScene(cc.TransitionFlipY.create(0.5, scene));
    },
});
CreditLayer.create = function (storage) {
    return new CreditLayer(storage);
};
var CreditLayerScene = cc.Scene.extend({
    onEnter: function (storage) {
        this._super();
        var layer = new CreditLayer(storage);
        this.addChild(layer);
    }
});