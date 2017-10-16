var CardList = cc.Node.extend({
    ctor: function (battle) {
        this._super();
        this.battle = battle;
        this.list = cc.Sprite.create("res/list.png");
        this.list.setPosition(320, 1136 / 2);
        this.addChild(this.list);
        this.pageId = 1;
        this.cardData = [];
        this.cards = [];
        this.menus = [];
        this.pageLabel = new cc.LabelTTF("" + this.pageId + "/10", "Arial", 38);
        this.pageLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.pageLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.addChild(this.pageLabel);
        this.pageLabel.setAnchorPoint(0.5, 0.5);
        this.pageLabel.setPosition(320, 970);
        this.setCard();
        var nextButton = new cc.MenuItemImage("res/button_next.png", "res/button_next.png", function () {
            this.nextPage();
        }, this);
        nextButton.setPosition(320 + 170, 140);
        var formerButton = new cc.MenuItemImage("res/button_before.png", "res/button_before.png", function () {
            this.formerPage();
        }, this);
        formerButton.setPosition(320 - 170, 140);
        var clopseButton = new cc.MenuItemImage("res/button_close9.png", "res/button_close9.png", function () {
            this.setVisible(false);
        }, this);
        clopseButton.setPosition(320, 140);
        var menu002 = new cc.Menu(clopseButton, nextButton, formerButton);
        menu002.setPosition(0, 0);
        this.list.addChild(menu002);
        this.cardDetailNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.cardDetailNode.setOpacity(255 * 0.8);
        this.addChild(this.cardDetailNode);
        this.cardDetailNode.setVisible(false);
        var clopseButton = new cc.MenuItemImage("res/button_cancel.png", "res/button_cancel.png", function () {
            this.cardDetailNode.setVisible(false);
            this.cardDetailNode.removeChild(this.menu);
        }, this);
        clopseButton.setPosition(220, 250);
        var okButton = new cc.MenuItemImage("res/button_setcard.png", "res/button_setcard.png", function () {
            this.cardDetailNode.setVisible(false);
            this.cardDetailNode.removeChild(this.menu);
            this.setCardWindow(this.selectedOrderNum);
        }, this);
        okButton.setPosition(420, 250);
        var menu003 = new cc.Menu(clopseButton, okButton);
        menu003.setPosition(0, 0);
        this.cardDetailNode.addChild(menu003);
    },
    addCard: function (cardData) {
        cc.log(cardData["image"]);
        var _cardData = new cc.MenuItemImage(cardData["image"], "res/card000_on.png", function (val) {
        }, this);
        this.menu = new cc.Menu(_cardData);
        this.menu.setPosition(320, 600);
        this.cardDetailNode.addChild(this.menu);
    },
    setCard: function () {
        this.pageLabel.setString(this.pageId + "/10");
        //全てのカードを一旦削除する
        for (var i = 0; i <= this.menus.length; i++) {
            this.menus.splice(i, 1);
            this.removeChild(this.menus[i]);
        }
        var roopCnt = 0;
        var _startNum = 1 + 8 * (this.pageId - 1);
        var _endNum = _startNum + 8;
        for (var i = _startNum; i <= _endNum; i++) {
            //cc.log("iは" + i + "/次まで" + Math.floor(this.pageId + 8));
            roopCnt++;
            this.ownCardData = this.getOwnCardData(i);
            if (this.ownCardData == null) {
                this.image = "res/card000.png";
            } else {
                this.image = this.ownCardData.image;
            }
            var _cardData = new cc.MenuItemImage(this.image, "res/card000_on.png", function (val) {
                var _data3 = this.getOwnCardData(val.orderNum);
                if (_data3) {
                    if (_data3.cnt >= 1) {
                        //this.setCardWindow(val.orderNum);
                        this.cardDetailNode.setVisible(true);
                        this.addCard(CONFIG.CARD[val.orderNum]);
                        this.selectedOrderNum = val.orderNum;
                    }
                }
            }, this);
            _cardData.orderNum = i;
            _cardData.setPosition(CONFIG.LIST_POSITION[roopCnt].x, CONFIG.LIST_POSITION[roopCnt].y);
            _cardData.setScale(0.45);
            var menu = new cc.Menu(_cardData);
            menu.setPosition(0, 0);
            this.menus.push(menu);
            this.list.addChild(menu);
            var _data = this.battle.storage.creatureData["ID_" + i];
            var _data2 = (new Function("return " + _data))();
            if (_data2) {
                this.cntLabel = new cc.LabelTTF("x" + _data2.cnt, "Arial", 62);
                this.cntLabel.setAnchorPoint(1, 0);
                this.cntLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
                this.cntLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
                _cardData.addChild(this.cntLabel);
                this.cntLabel.setPosition(320, 20);
            }
        }
    },
    getOwnCardData: function (cardNum) {
        var data = null;
        for (var key in this.battle.storage.creatureData) {
            if (key == "ID_" + cardNum) {
                var value = this.battle.storage.creatureData[key];
                var value2 = (new Function("return " + value))();
                data = value2;
            }
        }
        return data;
    },
    setCardWindow: function (cardId) {
        this.setVisible(false);
        this.battle.storage.saveDeckDataToStorage(this.battle.targetCardPositionNum, CONFIG.CARD[cardId]);
        this.battle.replaceCard();
    },
    nextPage: function () {
        this.pageId += 1;
        if (this.pageId >= 10) {
            this.pageId = 10;
        }
        this.setCard();
    },
    formerPage: function () {
        this.pageId -= 1;
        if (this.pageId < 1) {
            this.pageId = 1;
        }
        this.setCard();
    },
});