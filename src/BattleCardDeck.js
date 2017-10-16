var BattleCardDeck = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.isSetCard = false;
        this.rectBase001 = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 362 * 0.27, 494 * 0.27);
        this.rectBase001.setAnchorPoint(0, 0);
        this.rectBase001.setPosition(10, 30);
        this.addChild(this.rectBase001, 9999999);
        this.rectBase002 = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 362 * 0.27, 494 * 0.27);
        this.rectBase002.setAnchorPoint(0, 0);
        this.rectBase002.setPosition(10 + 100, 30);
        this.addChild(this.rectBase002, 9999999);
        this.rectBase003 = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 362 * 0.27, 494 * 0.27);
        this.rectBase003.setAnchorPoint(0, 0);
        this.rectBase003.setPosition(10 + 100 * 2, 30);
        this.addChild(this.rectBase003, 9999999);
        this.rectBase004 = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 362 * 0.27, 494 * 0.27);
        this.rectBase004.setAnchorPoint(0, 0);
        this.rectBase004.setPosition(30 + 100 * 3, 30);
        this.addChild(this.rectBase004, 9999999);
        this.rectBase005 = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 362 * 0.27, 494 * 0.27);
        this.rectBase005.setAnchorPoint(0, 0);
        this.rectBase005.setPosition(30 + 100 * 4, 30);
        this.addChild(this.rectBase005, 9999999);
        this.rectBase006 = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 362 * 0.27, 494 * 0.27);
        this.rectBase006.setAnchorPoint(0, 0);
        this.rectBase006.setPosition(30 + 100 * 5, 30);
        this.addChild(this.rectBase006, 9999999);


        this.touchMoveSprite = cc.Sprite.create("res/target_card.png");
        this.addChild(this.touchMoveSprite, 9999999);
        this.touchMoveSprite.setVisible(false);

        this.touchMovedSprite = cc.Sprite.create("res/target_card2.png");
        this.addChild(this.touchMovedSprite, 9999999);
        this.touchMovedSprite.setVisible(false);

        this.touchMoveSpriteNg = cc.Sprite.create("res/target_card_ng.png");
        this.addChild(this.touchMoveSpriteNg, 9999999);
        //this.touchMoveSpriteNg.setPosition(170, 180);
        this.touchMoveSpriteNg.setVisible(false);

        this.cardOkSprite001 = cc.Sprite.create("res/label_card_ok.png");
        this.addChild(this.cardOkSprite001, 9999999);
        this.cardOkSprite001.setPosition(170, 180);
        this.cardOkSprite001.setVisible(false);

        this.cardOkSprite002 = cc.Sprite.create("res/label_card_ok.png");
        this.addChild(this.cardOkSprite002, 9999999);
        this.cardOkSprite002.setPosition(480, 180);
        this.cardOkSprite002.setVisible(false);


        this.selectedCards = [];
    },
    init: function () {},
    setCards: function () {
        this.card001 = new ccui.Button(this.getCardImage(1), "res/card000_on.png");
        this.card001.cardId = this.getCardId(1);
        this.card001.setAnchorPoint(0, 0);
        this.card001.addTouchEventListener(this.touchEvent, this);
        this.card001.setScale(0.27);
        this.card001.setPosition(10 + 100 * 0, 30);
        this.addChild(this.card001);
        this.card002 = new ccui.Button(this.getCardImage(2), "res/card000_on.png");
        this.card002.cardId = this.getCardId(2);
        this.card002.setAnchorPoint(0, 0);
        this.card002.addTouchEventListener(this.touchEvent, this);
        this.card002.setScale(0.27);
        this.card002.setPosition(10 + 100 * 1, 30);
        this.addChild(this.card002);
        this.card003 = new ccui.Button(this.getCardImage(3), "res/card000_on.png");
        this.card003.cardId = this.getCardId(3);
        this.card003.setAnchorPoint(0, 0);
        this.card003.addTouchEventListener(this.touchEvent, this);
        this.card003.setScale(0.27);
        this.card003.setPosition(10 + 100 * 2, 30);
        this.addChild(this.card003);
        this.card004 = new ccui.Button(this.getCardImage(4), "res/card000_on.png");
        this.card004.cardId = this.getCardId(4);
        this.card004.setAnchorPoint(0, 0);
        this.card004.addTouchEventListener(this.touchEvent, this);
        this.card004.setScale(0.27);
        this.card004.setPosition(30 + 100 * 3, 30);
        this.addChild(this.card004);
        this.card005 = new ccui.Button(this.getCardImage(5), "res/card000_on.png");
        this.card005.cardId = this.getCardId(5);
        this.card005.setAnchorPoint(0, 0);
        this.card005.addTouchEventListener(this.touchEvent, this);
        this.card005.setScale(0.27);
        this.card005.setPosition(30 + 100 * 4, 30);
        this.addChild(this.card005);
        this.card006 = new ccui.Button(this.getCardImage(6), "res/card000_on.png");
        this.card006.cardId = this.getCardId(6);
        this.card006.setAnchorPoint(0, 0);
        this.card006.addTouchEventListener(this.touchEvent, this);
        this.card006.setScale(0.27);
        this.card006.setPosition(30 + 100 * 5, 30);
        this.addChild(this.card006);
    },
    touchEvent: function (sender, type) {
        switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            cc.log("Touch Down");

            //選択中のカードをズームして表示する
            var _cardData = CONFIG.CARD[sender.cardId];
            this.selectedCardSprite = cc.Sprite.create(_cardData.image);
            this.addChild(this.selectedCardSprite, 9999999);
            this.selectedCardSprite.setPosition(320,500);
            this.selectedCards.push(this.selectedCardSprite);


            this.game.tutorial001.setVisible(false);
            if (this.game.isUseCard() == false) return;
            this.touchMoveSprite.setVisible(true);
            //this.touchMoveSpriteNg.setVisible(true);
            break;
        case ccui.Widget.TOUCH_MOVED:
            cc.log("Touch Move");

            //sender.getTouchBeganPosition();
            //this.removeChild(this.selectedCardSprite);
            //選択中カードの表示を削除する
            for (var i = 0; i < this.selectedCards.length; i++) {
                this.removeChild(this.selectedCards[i]);
                this.selectedCards.splice(i,1);
            }

            if (this.game.isUseCard() == false) return;
            var _cardData = CONFIG.CARD[sender.cardId];
            if(_cardData.isOwnTerritory == false || this.game.gameStatus == "prepare"){
                //自分のテリトリー外にも設置できる
                this.touchMoveSprite.setVisible(true);
                this.touchMoveSpriteNg.setVisible(false);     
            }else{
                //自分のテリトリーだけに設置できる
                var _result = this.game.battleWindow.isOwnTerritory2(this.game.colorName, sender.getTouchMovePosition().x, sender.getTouchMovePosition().y);
                if(_result == true){
                    this.touchMoveSprite.setVisible(true);
                    this.touchMoveSpriteNg.setVisible(false);
                }else{
                    this.touchMoveSprite.setVisible(false);
                    this.touchMoveSpriteNg.setVisible(true);
                }
            }
            this.touchMoveSprite.setVisible(true);
            this.touchMoveSprite.setPosition(sender.getTouchMovePosition().x + 20, sender.getTouchMovePosition().y - 30);
            this.touchMoveSpriteNg.setPosition(sender.getTouchMovePosition().x + 20, sender.getTouchMovePosition().y - 30);
            this.touchMovedSprite.setPosition(sender.getTouchMovePosition().x + 20, sender.getTouchMovePosition().y - 30);
            

            break;
        case ccui.Widget.TOUCH_ENDED:
            cc.log("Touch END");

            //sender.getTouchBeganPosition();
            //this.removeChild(this.selectedCardSprite);
            //選択中カードの表示を削除する
            for (var i = 0; i < this.selectedCards.length; i++) {
                this.removeChild(this.selectedCards[i]);
                this.selectedCards.splice(i,1);
            }

            if (this.game.isUseCard() == false) return;
            this.touchMoveSprite.setVisible(false);
            this.touchMoveSpriteNg.setVisible(false);
            this.touchMovedSprite.setVisible(false);

            break;
        case ccui.Widget.TOUCH_CANCELED:
            cc.log("Touch Cancelled");
            if (this.game.isUseCard() == false) return;
            this.touchMoveSprite.setVisible(false);
            this.touchMoveSpriteNg.setVisible(false);
            this.touchMovedSprite.setVisible(false);


            var _cardData = CONFIG.CARD[sender.cardId];

            if(_cardData.isOwnTerritory == false || this.game.gameStatus == "prepare"){
                //自分のテリトリー外にも設置できる
                var _isOnlyOwnTerritory = false;
                var _result = this.game.useCard(sender.cardId, sender.getTouchMovePosition().x, sender.getTouchMovePosition().y,_isOnlyOwnTerritory);
                if(_result == true){
                    this.touchMovedSprite.setVisible(true);
                }
            }else{
                //自分のテリトリーだけに設置できる
                var _isOnlyOwnTerritory = true;
                var _result = this.game.useCard(sender.cardId, sender.getTouchMovePosition().x, sender.getTouchMovePosition().y,_isOnlyOwnTerritory);
                if(_result == true){
                    this.touchMovedSprite.setVisible(true);
                }   
            }

            //選択中カードの表示を削除する
            for (var i = 0; i < this.selectedCards.length; i++) {
                this.removeChild(this.selectedCards[i]);
                this.selectedCards.splice(i,1);
            }
            break;
        default:
            break;
        }
    },
    update: function () {
        if (this.game.isUseCard() == true) {
            if (this.game.colorName == "GREEN") {
                this.cardOkSprite001.setVisible(true);
            } else {
                this.cardOkSprite002.setVisible(true);
            }
        } else {
            this.cardOkSprite001.setVisible(false);
            this.cardOkSprite002.setVisible(false);
        }
        if (this.isSetCard == false) {
            if (this.game.isCom == true) {
                this.isSetCard = true;
                this.setCards();
            }
            if (Object.keys(this.game.storage.enemyDeckData).length > 0) {
                this.isSetCard = true;
                this.setCards();
            }
        }
        if (this.isSetCard == true) {
            var _rate = this.game.cardUsePower / this.game.cardUseMaxPower;
            if (this.game.colorName == "GREEN") {
                this.rectBase001.setScale(1, 1 - _rate);
                this.rectBase002.setScale(1, 1 - _rate);
                this.rectBase003.setScale(1, 1 - _rate);
            } else {
                this.rectBase004.setScale(1, 1 - _rate);
                this.rectBase005.setScale(1, 1 - _rate);
                this.rectBase006.setScale(1, 1 - _rate);
            }
        }
        return true;
    },

    getCard: function (orderNum) {
        var _card001 = null;
        var _card002 = null;
        var _card003 = null;
        var _card004 = null;
        var _card005 = null;
        var _card006 = null;
        if (this.game.colorName == "GREEN") {
            if (this.game.storage.deckData.DECK_1) {
                var _deck1 = JSON.parse(this.game.storage.deckData.DECK_1);
            }
            if (this.game.storage.deckData.DECK_2) {
                var _deck2 = JSON.parse(this.game.storage.deckData.DECK_2);
            }
            if (this.game.storage.deckData.DECK_3) {
                var _deck3 = JSON.parse(this.game.storage.deckData.DECK_3);
            }
            if (_deck1) {
                _card001 = _deck1;
            }
            if (_deck2) {
                _card002 = _deck2;
            }
            if (_deck3) {
                _card003 = _deck3;
            }
            if (this.game.storage.enemyDeckData.DECK_1) {
                var _deck4 = JSON.parse(this.game.storage.enemyDeckData.DECK_1);
            }
            if (_deck4) {
                _card004 = _deck4;
            }
            if (this.game.storage.enemyDeckData.DECK_2) {
                var _deck5 = JSON.parse(this.game.storage.enemyDeckData.DECK_2);
            }
            if (_deck5) {
                _card005 = _deck5;
            }
            if (this.game.storage.enemyDeckData.DECK_3) {
                var _deck6 = JSON.parse(this.game.storage.enemyDeckData.DECK_3);
            }
            if (_deck6) {
                _card006 = _deck6;
            }
        } else {
            if (this.game.storage.deckData.DECK_1) {
                var _deck4 = JSON.parse(this.game.storage.deckData.DECK_1);
            }
            if (this.game.storage.deckData.DECK_2) {
                var _deck5 = JSON.parse(this.game.storage.deckData.DECK_2);
            }
            if (this.game.storage.deckData.DECK_3) {
                var _deck6 = JSON.parse(this.game.storage.deckData.DECK_3);
            }
            if (_deck4) {
                _card004 = _deck4;
            }
            if (_deck5) {
                _card005 = _deck5;
            }
            if (_deck6) {
                _card006 = _deck6;
            }
            if (this.game.storage.enemyDeckData.DECK_1) {
                var _deck1 = JSON.parse(this.game.storage.enemyDeckData.DECK_1);
            }
            if (_deck1) {
                _card001 = _deck1;
            }
            if (this.game.storage.enemyDeckData.DECK_2) {
                var _deck2 = JSON.parse(this.game.storage.enemyDeckData.DECK_2);
            }
            if (_deck2) {
                _card002 = _deck2;
            }
            if (this.game.storage.enemyDeckData.DECK_3) {
                var _deck3 = JSON.parse(this.game.storage.enemyDeckData.DECK_3);
            }
            if (_deck3) {
                _card003 = _deck3;
            }
        }
        if (orderNum == 1) {
            return _card001;
        }
        if (orderNum == 2) {
            return _card002;
        }
        if (orderNum == 3) {
            return _card003;
        }
        if (orderNum == 4) {
            return _card004;
        }
        if (orderNum == 5) {
            return _card005;
        }
        if (orderNum == 6) {
            return _card006;
        }
    },

    getCardImage: function (orderNum) {
        var _data = this.getCard(orderNum);
        if(_data != null){
            return _data.image;
        }
        return "res/card000.png";
    },

    getCardId: function (orderNum) {
        //return orderNum;
        var _data = this.getCard(orderNum);
        if(_data != null){
            return CONFIG.CARD[_data.id].id;
        }
        return 0;
    },
});