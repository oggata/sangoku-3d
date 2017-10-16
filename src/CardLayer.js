var CardLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage,cardId) {
        this._super();

        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        this.storage = storage;
        this.baseNode = cc.LayerColor.create(new cc.Color(255, 191, 0, 255), 640, 1136);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);

        //var _rand = this.getRandNumberFromRange(1, 13);
        var _card = CONFIG.CARD[cardId];

        this.cardPosY = 1500;
        this.card = cc.Sprite.create(_card.image);
        this.baseNode.addChild(this.card);
        this.card.setPosition(320, this.cardPosY);
        this.labelSprite = cc.Sprite.create("res/label_get_a_normal_card.png");
        this.labelSprite.setPosition(320, 400);
        this.labelSprite.setOpacity(0);
        
        this.cardGetTime = 1;
        this.backCardActionOpacity = 0;
        this.cardWaitTime = 0;
/*
        var backButton = new cc.MenuItemImage("res/button_before.png", "res/button_before.png", function () {
            this.goToStageLayer();
        }, this);
        backButton.setPosition(90, 970);
        var menu001 = new cc.Menu(backButton);
        menu001.setPosition(0, 0);
        this.baseNode.addChild(menu001);
*/
        this.initializeWalkAnimation();

        this.timeCnt = 0;

        this.scheduleUpdate();
        return true;
    },
    update: function (dt) {

        this.timeCnt++;
        if(this.timeCnt >= 30 * 4.2){
            this.timeCnt = 0;
            this.goToStageLayer();
        }

        if (1 <= this.cardGetTime && this.cardGetTime < 30 * 5) {
            this.cardGetTime++;
            this.backCardActionOpacity += 0.05;
            if (this.backCardActionOpacity >= 1) {
                this.backCardActionOpacity = 1;
            }
            this.setCardMotion();
        }
    },

    initializeWalkAnimation: function () {

        this.image = "res/starburst.png";
        this.itemWidth = 640;
        this.itemHeight = 480;
        this.widthCount = 2;
        this.heightCount = 5;
        this.effectInterval = 0.1;
        this.effectTime = 0;

        var frameSeq = [];
        for (var i = 0; i < this.heightCount; i++) {
            for (var j = 0; j < this.widthCount; j++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.itemWidth * j, this.itemHeight * i, this.itemWidth,
                    this.itemHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.effectInterval);
        //this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.itemWidth, this.itemHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setPosition(320,1136/2 - 50);
        this.sprite.setScale(2.5,2.5);
        this.baseNode.addChild(this.sprite);
    },

    setCardMotion: function () {
        this.card.setOpacity(1 * 255);
        if (this.card.getPosition().y > 1200) {
            this.cardPosY -= 10;
        }
        if (this.card.getPosition().y <= 1200) {
            this.cardWaitTime++;
            if (30 * 1 < this.cardWaitTime) {
                if (600 <= this.card.getPosition().y && this.card.getPosition().y <= 1200) {
                    this.cardPosY -= 55;
                    this.labelSprite.setOpacity(255 * 1);
                }
            }
        }
        this.card.setPosition(320, this.cardPosY);
    },
    resetCardMotion: function () {
        this.labelSprite.setOpacity(0);
        this.card.setOpacity(1 * 255);
        this.cardWaitTime = 0;
        this.cardPosY = 1500;
        this.card.setPosition(320, this.cardPosY);
    },

    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
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
    goToCardLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CardLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(0.3, scene));
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
    }
});
CardLayer.create = function (storage,cardId) {
    return new CardLayer(storage,cardId);
};
var CardLayerScene = cc.Scene.extend({
    onEnter: function (storage,cardId) {
        this._super();
        var layer = new CardLayer(storage,cardId);
        this.addChild(layer);
    }
});
