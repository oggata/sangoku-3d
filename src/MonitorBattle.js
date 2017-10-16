var BattleWindow = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.mode = "wait";
        this.field = cc.Sprite.create("res/monitor_battle.png");
        this.field.setAnchorPoint(0, 0);
        this.addChild(this.field);
        this.redScore = 0;
        this.greenScore = 0;
        this.whiteCnt = 0;
        this.networkWaitCnt = 0;
        this.waitCnt = 0;
        this.markers = [];
        this.greenMessages = [];
        this.greenMessageLabel = new cc.LabelTTF("", "Arial", 18);
        this.greenMessageLabel.setFontFillColor(new cc.Color(0, 255, 0, 255));
        this.greenMessageLabel.setAnchorPoint(0, 1);
        this.greenMessageLabel.setPosition(10, 620);
        this.addChild(this.greenMessageLabel);
        this.greenMessageRemoveCnt = 0;
        this.redMessages = [];
        this.redMessageLabel = new cc.LabelTTF("", "Arial", 18);
        this.redMessageLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        this.redMessageLabel.setAnchorPoint(1, 1);
        this.redMessageLabel.setPosition(630, 620);
        this.addChild(this.redMessageLabel);
        this.redMessageRemoveCnt = 0;
        this.initMap();
        this.turnCnt = 0;
        this.maxTurnCnt = 150;
        this.timeCnt = 0;
        this.greenCoinAmount = 1000;
        this.redCoinAmount = 1000;

        this.redTimeCnt = 0;
        this.greenTimeCnt = 0;
        this.scheduleUpdate();
        this.humans = [];
        this.coins = [];
        this.timeCnt2 = 0;
        this.redMarkers = [];
        //配置可能なリストを作る
        this.positionalMarkers = [];
        for (var j = 0; j < this.markers.length; j++) {
            ////スピードはMAPCHIPTYPEによって違う (1:普通 2:山岳 3:森 4:砂 5:海 6:その他)
            if (this.markers[j].mapChipType == 1 || this.markers[j].mapChipType == 3 || this.markers[j].mapChipType == 4) {
                this.positionalMarkers.push(this.markers[j]);
            }
        }
        //コンピューターの時は配置可能リストの中から、ランダムで配置する
        if (this.game.isCom == true) {
            //this.positionalMarkers.sort(this.shuffle);
            //this.addPoint2("RED", this.positionalMarkers[0].col, this.positionalMarkers[0].row);
            //this.addCastleIcon(this.positionalMarkers[0].col, this.positionalMarkers[0].row,1);
            this.addPoint2("RED", 23, 29);
            this.addCastleIcon(23, 29, 1);
        }
        this.errorMessageLabel = new cc.LabelTTF("", "Arial", 18);
        this.errorMessageLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.errorMessageLabel.setAnchorPoint(0, 0);
        this.errorMessageLabel.setPosition(10, 10);
        this.addChild(this.errorMessageLabel);
        this.computerCnt = 0;

        this.orderCnt = 0;
    },
    update: function (dt) {
        this.orderCnt++;
        if(this.orderCnt >= 30){
            this.orderCnt = 0;

            for (var j = 0; j < this.markers.length; j++) {
                this.field.reorderChild(
                    this.markers[j],
                    Math.floor(99999999 - (this.markers[j].col + this.markers[j].row) + 0)
                );
            }

            for (var j = 0; j < this.humans.length; j++) {
                this.field.reorderChild(
                    this.humans[j],
                    Math.floor(99999999 - (this.humans[j].col + this.humans[j].row) + 10)
                );
            }

        }



        //for (var j = 0; j < 5; j++) {
        if (this.coins.length <= 5) {
            this.positionalMarkers.sort(this.shuffle);
            this.addCoin(this.positionalMarkers[0].col, this.positionalMarkers[0].row);
        }
        //}
        if (this.mode == "gaming") {
            this.computerCnt++;
            if (this.computerCnt >= 30 * 20) {
                this.computerCnt = 0;
                this.positionalMarkers.sort(this.shuffle);


                var _rand = this.getRandNumberFromRange(1,3);
                if(_rand == 1){
                    this.addPoint2("RED", this.positionalMarkers[0].col, this.positionalMarkers[0].row);
                    this.addCastleIcon(this.positionalMarkers[0].col, this.positionalMarkers[0].row, 1);
                }else{
                    this.addPoint2("RED", this.positionalMarkers[0].col, this.positionalMarkers[0].row);
                    this.addVillageIcon(this.positionalMarkers[0].col, this.positionalMarkers[0].row, 1); 
                }

            }
        }
        //人間さんをupdateする
        for (var j = 0; j < this.humans.length; j++) {
            if (this.humans[j].update() == false) {
                this.field.removeChild(this.humans[j]);
                this.humans.splice(j, 1);
            }
        }
        for (var h = 0; h < this.humans.length; h++) {
            for (var c = 0; c < this.coins.length; c++) {
                if (this.humans[h].col == this.coins[c].col && this.humans[h].row == this.coins[c].row) {
                    this.coins[c].hp = 0;
                }
            }
        }
        //コインをupdateする
        for (var j = 0; j < this.coins.length; j++) {
            if (this.coins[j].update() == false) {
                this.field.removeChild(this.coins[j]);
                this.coins.splice(j, 1);
            }
        }
        //メッセージを制御する
        this.updateMessage();
        var _redCnt = 0;
        var _greenCnt = 0;
        var _whiteCnt = 0;
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].update();
            if (this.markers[i].colorId == "RED") {
                _redCnt++;
            }
            if (this.markers[i].colorId == "GREEN") {
                _greenCnt++;
            }
        }
        this.redScore = _redCnt;
        this.greenScore = _greenCnt;
        _whiteCnt = this.positionalMarkers.length - _redCnt - _greenCnt;
        /*
        if (this.mode == "wait") {
            this.waitCnt++;
            this.maxWaitCnt = 30 * 20;
            this.errorMessageLabel.setString("ログアウトまで" + Math.ceil((this.maxWaitCnt - this.waitCnt) / 30));
            if (this.waitCnt >= this.maxWaitCnt) {
                this.game.storage.CONNECTION_ERROR();
                this.game.goToStageLayer(1);
            }
            return;
        }
        */
        this.timeCnt++;
        this.redTimeCnt++;
        this.greenTimeCnt++;
        //残り少なくなったらスピードアップ
        this.speedLevel = 0;
        CONFIG.ALL_SPEED_LEVEL = [50, 45, 30, 28, 25, 20, 15, 10, 7, 5];
        if (this.whiteCnt <= 50) {
            this.maxTimeCnt = 5;
        } else {
            this.maxTimeCnt = CONFIG.ALL_SPEED_LEVEL[this.speedLevel];
            this.maxTimeCnt = 30;
        }
        this.timeCnt2++;
        if (this.timeCnt2 >= 30 * 1) {
            this.timeCnt2 = 0;
            if (this.mode == "gaming") {
                //this.incrementData("RED", 1);
                //this.incrementData("GREEN", 1);
            }
        }
        if (this.timeCnt >= this.maxTimeCnt) {
            if (this.mode == "gaming") {
                //this.incrementData("RED", 1);
                //this.incrementData("GREEN", 1);
            }
            this.timeCnt = 0;
            //ゲーム画面の時、ある程度ターンcntがプレイヤー間で離れてしまったらネットワークエラーにする
            //ただし、自動モードがonになっていない場合に限る
            if (this.mode != "result" && this.game.isCom == true) {
                this.turnCnt += 1;
            }
            if (this.mode != "result" && this.game.isCom == false) {
                if (Math.abs(this.turnCnt - this.game.storage.enemyTurnNum) >= 20) {
                    if (this.turnCnt > this.game.storage.enemyTurnNum) {
                        this.game.labelStartCnt007.setVisible(true);
                    } else {
                        this.turnCnt += 1;
                        this.game.labelStartCnt008.setVisible(true);
                    }
                    this.networkWaitCnt++;
                } else {
                    this.turnCnt += 1;
                    this.game.labelStartCnt007.setVisible(false);
                    this.game.labelStartCnt008.setVisible(false);
                    this.networkWaitCnt = 0;
                }
                //遅延が回復しない場合はネットワークエラー
                if (this.networkWaitCnt >= 1) {
                    this.errorMessageLabel.setString("ログアウトまで" + Math.ceil(20 - this.networkWaitCnt));
                }
                if (this.networkWaitCnt >= 20) {
                    this.game.storage.CONNECTION_ERROR();
                    this.game.goToStageLayer(1);
                }
            }
        }
        //空白が50以下になったら試合終了
        this.whiteCnt = _whiteCnt;
        if (_whiteCnt <= 50) {
            this.mode = "result";
        }
        //類型が100cntまで行ったら終了
        if (this.turnCnt >= this.maxTurnCnt) {
            this.mode = "result";
        }
    },
    incrementData: function (colorTxt, timeCnt) {
        //cc.log("increment");
        var _count = 0;
        for (var i = 0; i < this.markers.length; i++) {
            if (_count >= 2) return;
            if (this.markers[i].colorId == colorTxt) {
                var _rand = this.getRandNumberFromRange(1, 5);
                var _distance = 1;
                _targetCol = 0;
                _targetRow = 0;
                if (_rand == 1) {
                    _targetCol = this.markers[i].col;
                    _targetRow = this.markers[i].row - _distance;
                } else
                if (_rand == 2) {
                    _targetCol = this.markers[i].col;
                    _targetRow = this.markers[i].row + _distance;
                } else
                if (_rand == 3) {
                    _targetCol = this.markers[i].col - _distance;
                    _targetRow = this.markers[i].row;
                } else
                if (_rand == 4) {
                    _targetCol = this.markers[i].col + _distance;
                    _targetRow = this.markers[i].row;
                } else {
                    _targetCol = this.markers[i].col + _distance;
                    _targetRow = this.markers[i].row;
                }
                for (var j = 0; j < this.markers.length; j++) {
                    if (this.markers[j].col == _targetCol && this.markers[j].row == _targetRow) {
                        if (this.markers[j].baseMapType == 1 || this.markers[j].baseMapType == 3 || this.markers[j].baseMapType == 4) {
                            //if (this.markers[j].colorId == "WHITE") {
                            _count++;
                            this.markers[j].colorId = colorTxt;
                            this.markers[j].isRender = true;
                            this.markers[j].spriteBlack.setVisible(false);
                            //ここの座標のマーカーの周囲を見て相手をkillする
                            //}
                        }
                    }
                }
            }
            //}
        }
    },
    addGreenMessage: function (msg) {
        this.greenMessages.push(msg);
        if (this.greenMessages.length >= 10) {
            this.greenMessages.splice(0, 1);
        }
    },
    addRedMessage: function (msg) {
        this.redMessages.push(msg);
        if (this.redMessages.length >= 10) {
            this.redMessages.splice(0, 1);
        }
    },
    addHuman: function (col, row, colorName, markerId, algorithmId) {
        if (this.humans.length >= 20) return;
        this.human = new Human(this, col, row, colorName, markerId, algorithmId);
        this.field.addChild(this.human);
        this.humans.push(this.human);
    },
    addCoin: function (col, row) {
        this.coin = new Coin(this, col, row);
        var _marker = this.getMarker2(col, row);
        this.coin.setPosition(_marker.getPosition().x, _marker.getPosition().y);
        this.field.addChild(this.coin);
        this.coins.push(this.coin);
    },
    updateMessage: function () {
        //メッセージを制御する
        var greenTxt = "";
        for (var m = 0; m < this.greenMessages.length; m++) {
            greenTxt += this.greenMessages[m] + "\n";
        }
        this.greenMessageLabel.setString(greenTxt);
        if (this.greenMessages.length >= 5) {
            this.greenMessageRemoveCnt++;
            if (this.greenMessageRemoveCnt >= 30 * 5) {
                this.greenMessageRemoveCnt = 0;
                this.greenMessages.splice(0, 1);
            }
        } else {
            this.greenMessageRemoveCnt = 0;
        }
        var redTxt = "";
        for (var m = 0; m < this.redMessages.length; m++) {
            redTxt += this.redMessages[m] + "\n";
        }
        this.redMessageLabel.setString(redTxt);
        if (this.greenMessages.length >= 5) {
            this.redMessageRemoveCnt++;
            if (this.redMessageRemoveCnt >= 30 * 5) {
                this.redMessageRemoveCnt = 0;
                this.redMessages.splice(0, 1);
            }
        } else {
            this.redMessageRemoveCnt = 0;
        }
    },
    initMap: function () {
        var _incrementNum = 0;
        for (var row = 0; row < 40; row++) {
            for (var col = 0; col < 40; col++) {
                var _rand = CONFIG.MAP[_incrementNum];
                if (_rand == 1) {
                    this.chip = cc.Sprite.create("res/map-chip-001.png");
                }
                if (_rand == 2) {
                    this.chip = cc.Sprite.create("res/map-chip-002.png");
                }
                if (_rand == 3) {
                    this.chip = cc.Sprite.create("res/map-chip-003.png");
                }
                if (_rand == 4) {
                    this.chip = cc.Sprite.create("res/map-chip-004.png");
                }
                if (_rand == 5) {
                    this.chip = cc.Sprite.create("res/map-chip-005.png");
                }
                if (_rand == 6) {
                    this.chip = cc.Sprite.create("res/map-chip-006.png");
                }
                this.chip.setAnchorPoint(0, 0);
                this.chip.setPosition((col + row) * -16 + 32 * col + 320, 10 * (col + row) - 100);
                this.field.addChild(this.chip, 1 - (col + row));
                this.marker = new Marker(this, col, row, _rand, null, this.game.colorName);
                this.marker.setPosition((col + row) * -16 + 32 * col + 320, 10 * (col + row) - 100);
                var _rand2 = CONFIG.HIDDEN_MAP[_incrementNum];
                if (_rand2 == 1) {
                    //this.marker.spriteBlack.setVisible(true);
                } else {
                    this.marker.spriteBlack.setVisible(false);
                }
                this.field.addChild(this.marker);
                this.markers.push(this.marker);
                _incrementNum++;
            }
        }
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    addCastleIcon: function (col, row, cardId) {
        var _marker = this.getMarker2(col, row);
        if (_marker) {
            _marker.addCastle(cardId);
        }
    },
    addVillageIcon: function (col, row, cardId) {
        var _marker = this.getMarker2(col, row);
        if (_marker) {
            _marker.addVillage(cardId);
        }
    },
    addBattleIcon: function (col, row, cardId) {
        var _marker = this.getMarker2(col, row);
        if (_marker) {
            _marker.addBattle(cardId);
        }
    },
    isOwnTerritory2: function (colorName, posX, posY) {
        var _marker = this.getMarker(posX, posY - 200);
        if (_marker) {
            if (_marker.colorId == colorName) {
                return true;
            }
        }
        return false;
    },
    isOwnTerritory: function (colorName, col, row) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].col == col && this.markers[i].row == row && this.markers[i].colorId == colorName) {
                return true;
            }
        }
        return false;
    },
    addPoint2: function (colorName, col, row) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].mapChipType == 1 || this.markers[i].mapChipType == 3 || this.markers[i].mapChipType == 4) {
                if (this.markers[i].col == col && this.markers[i].row == row) {
                    this.markers[i].colorId = colorName;
                    this.markers[i].isRender = true;
                    return true;
                }
            }
        }
        return false;
    },
    getMarker: function (posX, posY) {
        var _mindist = 9999999;
        var _mindistMarker = null;
        for (var i = 0; i < this.markers.length; i++) {
            var _distance = Math.sqrt(
                (posX - this.markers[i].getPosition().x) * (posX - this.markers[i].getPosition().x) + (posY - this.markers[i].getPosition()
                    .y) * (posY - this.markers[i].getPosition().y));
            if (_mindist > _distance) {
                _mindist = _distance;
                _mindistMarker = this.markers[i];
            }
        }
        return _mindistMarker;
    },
    getMarker2: function (col, row) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].col == col && this.markers[i].row == row) {
                return this.markers[i];
            }
        }
        return null;
    },
    getRandNumByRoule: function (col, row, hoge, maxNum) {
        return ((col + row * col + row * this.turnCnt) + this.turnCnt) % maxNum;
        //return (98 + ( col + this.turnCnt ) * col + row * col * row + row * this.turnCnt * (row * col * 99 + this.turnCnt ) + (this.turnCnt * turnCnt)) % maxNum;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    }
});