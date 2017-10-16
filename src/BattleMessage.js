var BattleMessage = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.messageSprite = cc.Sprite.create("res/message.png");
        this.messageSprite.setPosition(30, 0);
        this.messageSprite.setAnchorPoint(0, 0);
        this.addChild(this.messageSprite, 9999999);
        //メッセージの制御
        this.messageLabel = cc.LabelTTF.create("", "Arial", 24);
        this.messageLabel.setPosition(120, 170);
        this.messageLabel.setAnchorPoint(0, 1);
        this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.messageSprite.addChild(this.messageLabel);
        this.messageLabel.setAnchorPoint(0, 1);
        this.message = "出撃準備だ！\nまずは、\n出撃地点を3箇所\nタップせよ.";
        this.messageTime = 0;
        this.visibleStrLenght = 0;
    },
    init: function () {},
    update: function () {
        if (this.message == "") {
            this.setVisible(false);
        } else {
            this.setVisible(true);
        }
        //メッセージ表示の管理
        this.messageTime++;
        if (this.messageTime >= 1) {
            this.messageTime = 0;
            this.visibleStrLenght++;
        }
        if (this.visibleStrLenght > this.message.length) {
            this.visibleStrLenght = this.message.length;
        }
        var _visibleString = this.message.substring(0, this.visibleStrLenght);
        this.messageLabel.setString(_visibleString);
        return true;
    },
});