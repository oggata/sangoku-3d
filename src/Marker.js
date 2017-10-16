var Marker = cc.Node.extend({
    ctor: function (game, col, row, baseMapType, buildingMapType, colorName) {
        this._super();
        this.game = game;
        /*
                this.testLabel = new cc.LabelTTF(row, "Arial", 13);
                this.testLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
                this.testLabel.setPosition(10,8);
                this.addChild(this.testLabel);
        */
        this.myColorName = colorName;
        this.spriteRed = cc.Sprite.create("res/map-base-red.png");
        //this.spriteRed.setOpacity(255 * 0.5);
        this.addChild(this.spriteRed);
        this.spriteRed.setPosition(10,0);
        this.spriteRed.setAnchorPoint(0, 0);
        this.spriteRed.setVisible(false);
        this.spriteGreen = cc.Sprite.create("res/map-base-green.png");
        //this.spriteGreen.setOpacity(255 * 0.5);
        this.addChild(this.spriteGreen);
        this.spriteGreen.setPosition(10,0);
        this.spriteGreen.setAnchorPoint(0, 0);
        this.spriteGreen.setVisible(false);
        this.spriteBlack = cc.Sprite.create("res/map-base-black.png");
        this.addChild(this.spriteBlack);
        this.spriteBlack.setAnchorPoint(0, 0);
        this.spriteBlack.setVisible(false);
        this.markerId = getRandNumberFromRange(1, 99999);
        this.mapChipType = baseMapType;
        this.baseMapType = baseMapType;
        this.buildingMapType = buildingMapType;
        this.colorId = "WHITE";
        this.col = col;
        this.row = row;
        this.timeCnt = 0;
        this.productMaxTime = 30 * 0.5;
        this.humanCnt = 0;
        this.population = 0;
        this.maxPopulation = 1;
        this.addHumanCnt = 0;
        this.isRender = false;
        this.cardData = null;
        //自分のマーカーから距離1の場所を探す
        this.rangeDistance = 1;
        this.range1markers = this.getRange(1);
        this.testTime = 0;
        this.distances = [];
        this.minDist = 1;
        this.enemyColorName = null;
    },
    update: function () {
        if(this.addHumanCnt>0){
            this.addHumanCnt++;
            if(this.addHumanCnt >= 30 * 1){
                this.addHumanCnt = 0;
            }
        }
        if (this.colorId == "GREEN") {
            this.enemyColorName = "RED";
        }
        if (this.colorId == "RED") {
            this.enemyColorName = "GREEN";
        }
        if (this.buildingMapType != null) {
            this.testTime++;
            if (this.testTime >= 10 * 5) {
                this.testTime = 0;
                this.minDist = this.getMinDistanceMarker();
                //if (this.colorId == "GREEN" && this.buildingMapType == "castle") {
                //cc.log(this.minDist);
                //}
            }
        }
        this.population = 0;
        for (var i = 0; i < this.game.humans.length; i++) {
            if (this.game.humans[i].markerId == this.markerId) {
                this.population++;
            }
        }
        this.setRender();
        if (this.buildingMapType == "castle") {
            this.algorithmId = "castle";
            this.range1markers = this.getRange(this.rangeDistance);
            if (this.game.mode == "gaming") {
                this.timeCnt++;
                if (this.timeCnt >= this.productMaxTime) {
                    this.timeCnt = 0;
                    if (this.population < this.maxPopulation && this.addHumanCnt == 0) {
                        this.game.addHuman(this.col, this.row, this.colorId, this.markerId, this.algorithmId);
                        this.addHumanCnt = 1;
                    }
                }
            }
        }
        if (this.buildingMapType == "village") {
            this.algorithmId = "village";
            this.range1markers = this.getRange(this.rangeDistance);
            if (this.game.mode == "gaming") {
                //ここが家の場合は、人を生み出す
                this.timeCnt++;
                if (this.timeCnt >= this.productMaxTime && this.addHumanCnt == 0) {
                    this.timeCnt = 0;
                    if (this.population < this.maxPopulation) {
                        this.game.addHuman(this.col, this.row, this.colorId, this.markerId, this.algorithmId);
                        this.addHumanCnt = 1;
                    }
                }
            }
        }
        return true;
    },
    getMinDistanceMarker: function () {
        for (var i = 0; i < this.distances.length; i++) {
            var _marker = this.getMarker3(this.distances[i].col, this.distances[i].row);
            this.distances[i].colorName = _marker.colorId;
            //this.distances[i].buildingMapType = _marker.buildingMapType;
            this.distances[i].baseMapType = _marker.baseMapType;
        }
        var _minDist = 999;
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].dist < _minDist && this.distances[i].colorName == "WHITE") {
                if (this.distances[i].baseMapType == 1 || this.distances[i].baseMapType == 3 || this.distances[i].baseMapType == 4) {
                    _minDist = this.distances[i].dist;
                }
            }
            if (this.distances[i].dist < _minDist && this.distances[i].colorName == this.enemyColorName) {
                if (this.distances[i].dist >= 1) {
                    if (this.distances[i].baseMapType == 1 || this.distances[i].baseMapType == 3 || this.distances[i].baseMapType == 4) {
                        _minDist = this.distances[i].dist;
                    }
                }
            }
        }
        //cc.log("minDist" + _minDist);
        return _minDist;
    },
    getMarker: function (col, row) {
        /*既に含まれている場合は省く*/
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].col == col && this.distances[i].row == row) {
                return;
            }
        }
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].col == col && this.game.markers[j].row == row && this.game.markers[j].colorId == "WHITE") {
                if (this.game.markers[j].baseMapType == 1 || this.game.markers[j].baseMapType == 3 || this.game.markers[j].baseMapType ==
                    4) {
                    return this.game.markers[j];
                }
            }
        }
        if (this.enemyColorName != null) {
            for (var j = 0; j < this.game.markers.length; j++) {
                if (this.game.markers[j].col == col && this.game.markers[j].row == row && this.game.markers[j].colorId == this.enemyColorName) {
                    if (this.game.markers[j].baseMapType == 1 || this.game.markers[j].baseMapType == 3 || this.game.markers[j].baseMapType ==
                        4) {
                        return this.game.markers[j];
                    }
                }
            }
        }
        return null;
    },
    /*
    getMarker2: function (col, row) {
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].col == col && this.game.markers[j].row == row && this.game.markers[j].colorId == "WHITE") {
                if (this.game.markers[j].baseMapType == 1 || this.game.markers[j].baseMapType == 3 || this.game.markers[j].baseMapType ==
                    4) {
                    return this.game.markers[j];
                }
            }
        }
        return null;
    },
    */
    getMarker3: function (col, row) {
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].col == col && this.game.markers[j].row == row) {
                //if(this.game.markers[j].baseMapType == 1 || this.game.markers[j].baseMapType == 3 || this.game.markers[j].baseMapType == 4)
                //{
                return this.game.markers[j];
                //}
            }
        }
        return null;
    },
    setDistance: function (col, row) {
        this.distances = [];
        this.distances.push({
            col: col,
            row: row,
            dist: 0,
            colorName: 'WHITE'
        });
        for (var i = 0; i < 50; i++) {
            this.setTestMarker(i);
        }
    },
    setTestMarker: function (_distNum) {
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].dist == _distNum - 1) {
                var _targetMaker = this.distances[i];
                var _marker001 = {
                    col: _targetMaker.col + 1,
                    row: _targetMaker.row + 0
                };
                var _marker002 = {
                    col: _targetMaker.col - 1,
                    row: _targetMaker.row + 0
                };
                var _marker003 = {
                    col: _targetMaker.col + 0,
                    row: _targetMaker.row + 1
                };
                var _marker004 = {
                    col: _targetMaker.col + 0,
                    row: _targetMaker.row - 1
                };
                var _next001Marker = this.getMarker(_marker001.col, _marker001.row);
                if (_next001Marker) {
                    this.distances.push({
                        col: _marker001.col,
                        row: _marker001.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
                var _next002Marker = this.getMarker(_marker002.col, _marker002.row);
                if (_next002Marker) {
                    this.distances.push({
                        col: _marker002.col,
                        row: _marker002.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
                var _next003Marker = this.getMarker(_marker003.col, _marker003.row);
                if (_next003Marker) {
                    this.distances.push({
                        col: _marker003.col,
                        row: _marker003.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
                var _next004Marker = this.getMarker(_marker004.col, _marker004.row);
                if (_next004Marker) {
                    this.distances.push({
                        col: _marker004.col,
                        row: _marker004.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
            }
        }
        /*
                for (var i = 0; i < this.distances.length; i++) {
                    var _marker = this.getMarker2(this.distances[i].col,this.distances[i].row);
                    if(_marker){
                        _marker.testLabel.setString(this.distances[i].dist);
                    }
                }
        */
    },
    getRange: function (distance) {
        var _moveMarkers = [];
        for (var i = 0; i < this.game.markers.length; i++) {
            var _col = Math.abs(this.game.markers[i].col - this.col);
            var _row = Math.abs(this.game.markers[i].row - this.row);
            if (_col > _row) {
                if (_col == distance && this.game.markers[i].colorId == "WHITE") {
                    if (this.game.markers[i].mapChipType == 1 || this.game.markers[i].mapChipType == 3 || this.game.markers[i].mapChipType ==
                        4) {
                        _moveMarkers.push(this.game.markers[i]);
                    }
                }
            } else {
                if (_row == distance && this.game.markers[i].colorId == "WHITE") {
                    if (this.game.markers[i].mapChipType == 1 || this.game.markers[i].mapChipType == 3 || this.game.markers[i].mapChipType ==
                        4) {
                        _moveMarkers.push(this.game.markers[i]);
                    }
                }
            }
        }
        if (_moveMarkers.length == 0) {
            if (this.rangeDistance <= 7) {
                this.rangeDistance++;
            }
        }
        return _moveMarkers;
    },
    addCastle: function (cardId) {
        if (this.buildingMapType != "castle") {
            this.buildingMapType = "castle";
            this.castleSprite = cc.Sprite.create("res/map-chip-castle.png");
            this.castleSprite.setAnchorPoint(0, 0);
            this.addChild(this.castleSprite);
            //cc.log("col:" + this.col + "/row:" + this.row);
            //距離を追加する
            this.setDistance(this.col, this.row);
        }
    },
    addVillage: function (cardId) {
        if (this.buildingMapType != "village") {
            this.buildingMapType = "village";
            this.castleSprite = cc.Sprite.create("res/map-chip-house.png");
            this.castleSprite.setAnchorPoint(0, 0);
            this.addChild(this.castleSprite);
            //距離を追加する
            this.setDistance(this.col, this.row);
        }
    },
    addBattle: function () {
        if (this.buildingMapType != "battle") {
            this.buildingMapType = "battle";
            this.castleSprite = cc.Sprite.create("res/map-chip-castle.png");
            this.castleSprite.setAnchorPoint(0, 0);
            this.castleSprite.setAnchorPoint(0, 0);
            this.addChild(this.castleSprite);
            //距離を追加する
            this.setDistance(this.col, this.row);
        }
    },
    setRender: function () {
        if (this.colorId == "WHITE" && this.isRender == true) {
            this.isRender = false;
            this.spriteRed.setVisible(false);
            this.spriteGreen.setVisible(false);
        }
        if (this.colorId == "RED" && this.isRender == true) {
            this.isRender = false;
            this.spriteRed.setVisible(true);
            this.spriteGreen.setVisible(false);
        }
        if (this.colorId == "GREEN" && this.isRender == true) {
            this.isRender = false;
            this.spriteRed.setVisible(false);
            this.spriteGreen.setVisible(true);
        }
    },
    incrementData: function (colorTxt, timeCnt) {
        //cc.log("increment");
        for (var i = 0; i < this.distances.length; i++) {
            var _marker = this.getMarker3(this.distances[i].col, this.distances[i].row);
            this.distances[i].colorName = _marker.colorId;
        }
        /*
        var _minDist = 999;
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].dist < _minDist && this.distances[i].colorName == "WHITE") {
                _minDist = this.distances[i].dist;
            }
            if (this.distances[i].dist < _minDist && this.distances[i].colorName == this.enemyColorName) {
                if (this.distances[i].dist >= 1) {
                    _minDist = this.distances[i].dist;
                }
            }
        }*/
        /*
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
*/
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
});
var Ripple = cc.Node.extend({
    ctor: function (game, colorTxt) {
        this._super();
        this.game = game;
        this.colorTxt = colorTxt;
        switch (this.colorTxt) {
        case "GREEN":
            this.marker = cc.Sprite.create("res/marker_green.png");
            break;
        case "RED":
            this.marker = cc.Sprite.create("res/marker_red.png");
            break;
        case "GREEN_BLOCK":
            this.marker = cc.Sprite.create("res/marker_green_block.png");
            break;
        case "RED_BLOCK":
            this.marker = cc.Sprite.create("res/marker_red_block.png");
            break;
        }
        this.addChild(this.marker);
        this.marker.setScale(this.scaleRate);
        //this.marker.setOpacity(255 * 0.5);
        this.scaleRate = 0.1;
        this.effectTime = 0;
    },
    update: function () {
        this.effectTime += 1;
        if (this.colorTxt == "GREEN" || this.colorTxt == "RED") {
            this.scaleRate += 0.04;
        } else {
            this.scaleRate = 1;
        }
        this.marker.setScale(this.scaleRate);
        if (this.effectTime >= 30) {
            return false;
        }
        return true;
    }
});