var TimeGauge = cc.Node.extend({
    ctor: function (game) {
    	this._super();
    	this.game = game;
        this.gaugeSprite001 = cc.Sprite.create("res/gauge_001.png");
        this.gaugeSprite001.setPosition(320, 300);
        this.addChild(this.gaugeSprite001);
        this.gaugeSprite002 = cc.Sprite.create("res/gauge_002.png");
        this.gaugeSprite002.setPosition(320, 300);
        this.addChild(this.gaugeSprite002);
        this.gaugeSprite003 = cc.Sprite.create("res/gauge_003.png");
        this.gaugeSprite003.setPosition(320, 300);
        this.addChild(this.gaugeSprite003);
        this.gaugeSprite004 = cc.Sprite.create("res/gauge_004.png");
        this.gaugeSprite004.setPosition(320, 300);
        this.addChild(this.gaugeSprite004);
        this.gaugeSprite005 = cc.Sprite.create("res/gauge_005.png");
        this.gaugeSprite005.setPosition(320, 300);
        this.addChild(this.gaugeSprite005);
        this.gaugeSprite006 = cc.Sprite.create("res/gauge_006.png");
        this.gaugeSprite006.setPosition(320, 300);
        this.addChild(this.gaugeSprite006);
    },
    update: function () {
        this.gaugeSprite001.setVisible(false);
        this.gaugeSprite002.setVisible(false);
        this.gaugeSprite003.setVisible(false);
        this.gaugeSprite004.setVisible(false);
        this.gaugeSprite005.setVisible(false);
        this.gaugeSprite006.setVisible(false);
        var _rate = this.game.pastSecond / this.game.maxChargeTime;
        if (_rate >= 0.8) {
            this.gaugeSprite001.setVisible(true);
        } else if (_rate >= 0.6) {
            this.gaugeSprite002.setVisible(true);
        } else if (_rate >= 0.4) {
            this.gaugeSprite003.setVisible(true);
        } else if (_rate >= 0.2) {
            this.gaugeSprite004.setVisible(true);
        } else if (_rate > 0) {
            this.gaugeSprite005.setVisible(true);
        } else if (_rate == 0){
            this.gaugeSprite006.setVisible(true);
        }
        return true;
    },
});