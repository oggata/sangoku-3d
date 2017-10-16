var BattleEffect = cc.Node.extend({
    ctor: function (game, colorName, cardId) {
        this._super();
        this.game = game;
        this.colorName = colorName;
        this.cardId = cardId;
        this.cardData = CONFIG.CARD[cardId];

        this.baseNode = cc.LayerColor.create(new cc.Color(255, 255, 255, 0), 640, 640);
        this.baseNode.setPosition(0,0);
        this.addChild(this.baseNode);

        this.image = "res/kaenbeam.png";
        this.itemWidth = 640 / 2;
        this.itemHeight = 480 / 2;
        this.widthCount = 2;
        this.heightCount = 10;
        this.effectInterval = 0.1;
        this.effectTime = 0;
        this.initializeWalkAnimation();

        this.charaSprite = cc.Sprite.create(CONFIG.CARD[cardId].image);
        /*
        if(this.colorName == "GREEN"){
            this.charaSprite = cc.Sprite.create("res/chara001.png");
        }else{
            this.charaSprite = cc.Sprite.create("res/chara002.png");
        }
        */
        this.baseNode.addChild(this.charaSprite,999);
        this.charaScale = 0.5;
        this.charaSprite.setPosition(0, 100);
        this.charaSprite.setScale(this.charaScale, this.charaScale);
        if (this.colorName == "GREEN") {
            this.markerX = 0;
            this.markerAddX = 20;
        } else {
            this.markerX = 640;
            this.markerAddX = -20;
        }

        this.marker = cc.LayerColor.create(new cc.Color(255, 0, 0, 0), 50, 50);
        this.marker.setPosition(this.markerX,320);
        this.baseNode.addChild(this.marker,99999);

        this.fukidashi = cc.Sprite.create("res/fukidashi.png");
        this.fukidashi.setAnchorPoint(0.5,0.5);
        this.fukidashi.setPosition(320,40);
        this.baseNode.addChild(this.fukidashi,999999);

        this.msgLabel = new cc.LabelTTF(this.cardData["useTxt"], "Arial", 38);
        this.msgLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.fukidashi.addChild(this.msgLabel);
        this.fukidashi.setVisible(false);
        this.msgLabel.setPosition(320, 200);

        this.charaSprite.setPosition(this.marker.getPosition().x,this.marker.getPosition().y);
        this.markerWaitCnt = 0;
    },
    init: function () {},
    update: function () {
        //マーカーを動かす
        this.markerX += this.markerAddX;
        if(this.markerX == 320){
            if(this.markerWaitCnt >= 30 * 1){
                this.fukidashi.setVisible(false);
                this.markerWaitCnt = 0;
                this.markerX += this.markerAddX;
            }else{
                this.fukidashi.setVisible(true);
                this.markerWaitCnt++;
                this.markerX = 320 - this.markerAddX;
            }
        }
        this.marker.setPosition(this.markerX,320);

        //キャラクターを追従させる
        this.charaSprite.setPosition(this.marker.getPosition().x,this.marker.getPosition().y);
        this.charaScale += 0.2;
        if (this.charaScale >= 1.4) {
            this.charaScale = 1.4;
        }
        this.charaSprite.setScale(this.charaScale, this.charaScale);
        this.effectTime++;
        if (this.effectTime >= 30 * 3) {
            this.effectTime = 0;
            return false;
        }
        return true;
    },
    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var i = 0; i < this.heightCount; i++) {
            for (var j = 0; j < this.widthCount; j++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.itemWidth * j, this.itemHeight * i, this.itemWidth,
                    this.itemHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.effectInterval);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        //this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.itemWidth, this.itemHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setPosition(320,320);
        this.sprite.setScale(4,4);
        this.baseNode.addChild(this.sprite);
    },
});