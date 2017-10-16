var Coin = cc.Node.extend({
    ctor: function (game, col, row) {
        this._super();
        this.game = game;
        this.col = col;
        this.row = row;
        //this.sprite = cc.Sprite.create("res/map-base-coin.png");
        //this.addChild(this.sprite);
        //this.sprite.setPosition(200,200);

        this.image = "res/pipo_coin001.png";
        this.imgWidth = 50;
        this.imgHeight = 50;

        this.initializeWalkAnimation();

        this.hp = 100;
    },
    init: function () {},

    update: function () {
        if(this.hp == 0){
            return false;            
        }
        return true;
    },

    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var row = 0; row < 1; row++) {
            for (var col = 0; col < 5; col++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * col, this.imgHeight * row, this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, 0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setAnchorPoint(0, 0);
        //this.sprite.setPosition(6,6);
        this.sprite.setPosition(8,8);
        this.sprite.setScale(0.3,0.3);
        this.addChild(this.sprite);
    },
});