var Header = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.back2 = cc.Sprite.create("res/header.png");
        this.back2.setAnchorPoint(0, 0);
        this.back2.setPosition(0, this.game.viewSize.height - 140);
        this.addChild(this.back2);
        this.treasureCntLabel = new cc.LabelTTF("1000", "Arial", 22);
        this.treasureCntLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.treasureCntLabel.setAnchorPoint(1, 0);
        this.back2.addChild(this.treasureCntLabel);
        this.treasureCntLabel.setPosition(620, 90);
        this.userCntLabel = new cc.LabelTTF("x322", "Arial", 22);
        this.userCntLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.userCntLabel.setAnchorPoint(1, 0);
        this.back2.addChild(this.userCntLabel);
        this.userCntLabel.setPosition(620, 32);
        if (this.game.layerType == "HOME") {
            var battleButton = new cc.MenuItemImage("res/button_battle.png", "res/button_battle_on.png", function () {
                this.game.goToBattleLayer();
            }, this);
            battleButton.setPosition(120, 24);
            var menu001 = new cc.Menu(battleButton);
            menu001.setPosition(0, 0);
            this.back2.addChild(menu001);
        }
        if (this.game.layerType == "BATTLE") {
            var homeButton = new cc.MenuItemImage("res/button_home.png", "res/button_home_on.png", function () {
                this.game.goToHomeLayer();
            }, this);
            homeButton.setPosition(120, 24);
            var menu001 = new cc.Menu(homeButton);
            menu001.setPosition(0, 0);
            this.back2.addChild(menu001);
        }
    },
    init: function () {},
    update: function () {
        return true;
    },
});