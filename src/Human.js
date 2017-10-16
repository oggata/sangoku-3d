var Human = cc.Node.extend({
    ctor: function (game, col, row, colorName, markerId, algorithmId) {
        this._super();
        this.game = game;
        this.hp = 100;
        this.maxHp = 100;
        this.colorName = colorName;
        this.markerId = markerId;
        this.algorithmId = algorithmId;
        this.image = "res/human.png";
        this.imgWidth = 96/3;
        this.imgHeight = 192/4;
        //init
        this.direction = "front";
        this.walkingDirection = "up";
        this.tmpWalkingDirection = "up";
        this.initializeWalkAnimation();
        this._mostNearMarker = null;
        this._mostNearDistance = 99999;
        this.col = col;
        this.row = row;
        var marker = this.getMarker(col, row);
        this.setPosition(marker.getPosition().x, marker.getPosition().y);
        this.baseMarker = null;
        this.targetMarkers = [];
        this.targetMarker = null;
        this.route = [];
        this.reverseArr = [];
        this.targetDistance = 2;
        this.timeCnt = 0;
        this.walkSpeed = 1.3;
        if (this.algorithmId == "castle") {
            this.setRoute2();
        } else {
            this.setRoute();
        }
        this.setScale(0.6,0.6);
        this.tmpTargetDist = null;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    getMarker: function (col, row) {
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].col == col && this.game.markers[j].row == row) {
                return this.game.markers[j];
            }
        }
        return null;
    },
    init: function () {},
    findDistance: function (col, row, dist) {
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].markerId == this.markerId) {
                this.baseMarker = this.game.markers[j];
            }
        }
        for (var i = 0; i < this.baseMarker.distances.length; i++) {
            if (this.baseMarker.distances[i].col == col + 1 && this.baseMarker.distances[i].row == row && this.baseMarker.distances[
                    i].dist == dist) {
                return this.baseMarker.distances[i];
            }
            if (this.baseMarker.distances[i].col == col - 1 && this.baseMarker.distances[i].row == row && this.baseMarker.distances[
                    i].dist == dist) {
                return this.baseMarker.distances[i];
            }
            if (this.baseMarker.distances[i].col == col && this.baseMarker.distances[i].row == row + 1 && this.baseMarker.distances[
                    i].dist == dist) {
                return this.baseMarker.distances[i];
            }
            if (this.baseMarker.distances[i].col == col && this.baseMarker.distances[i].row == row - 1 && this.baseMarker.distances[
                    i].dist == dist) {
                return this.baseMarker.distances[i];
            }
        }
        return null;
    },

    setRoute: function () {
        //this.walkSpeed = 2;
        //1.targetDistance = 1の距離でマーカーを探してターゲットする
        //this.targetDistance = this.getRandNumberFromRange(1,10);
        this.targetDistance = 1;

        //このHumanClassが作成されたマーカーを探す
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].markerId == this.markerId) {
                this.baseMarker = this.game.markers[j];
                this.targetDistance = this.baseMarker.minDist;
            }
        }

        //HumanClassが作成されたマーカーから、特定距離(5)のマーカーを全部取得する
        for (var i = 0; i < this.baseMarker.distances.length; i++) {
            if (this.baseMarker.distances[i].dist == this.targetDistance) {



        if (this.colorName == "GREEN") {
            this.enemyColorName = "RED";
        } else {
            this.enemyColorName = "GREEN";
        }
/*
if (this.colorName == "GREEN") {
cc.log("colorName:" + this.baseMarker.distances[i].colorName + "/enemy:" + this.enemyColorName);
}*/
                //敵のcolorかwhiteの時だけ
                if(this.baseMarker.distances[i].colorName == this.enemyColorName 
                    || this.baseMarker.distances[i].colorName == "WHITE"){
                    var _marker = this.getMarker(this.baseMarker.distances[i].col, this.baseMarker.distances[i].row);
                    this.targetMarkers.push(this.baseMarker.distances[i]);
                }
            }
        }
        //選択されたマーカー一覧から一つを選ぶ
        if (this.targetMarkers.length > 0) {
            this.targetMarker = this.targetMarkers[0];
        } else {
            //この距離でなければ距離を足していく
            this.targetDistance += 1;
            this.targetMarker = null;
        }
        if (this.targetMarker != null) {
            this.route.push(this.targetMarker);
            //仮に5だとしたら、4回繰り返して、元をたどる
            this.nextMarker = this.targetMarker;

            //全部のマーカーを塗る
            this.nextMarker.isFill = true;

            for (var dist = 1; dist < this.targetDistance; dist++) {
                this.nextMarker = this.findDistance(this.nextMarker.col, this.nextMarker.row, this.targetDistance - dist);
                if (this.nextMarker) {
                    this.route.push(this.nextMarker);
                }
            }
        }
        var count = 0;
        this.reverseArr = [];
        for (var i = this.route.length - 1; i >= 0; i--) {
            this.reverseArr[count] = this.route[i];
            count++;
        };
    },

    setRoute2: function () {
        //this.walkSpeed = 0.5;
        //this.walkSpeed = 2;
        //このHumanClassが作成されたマーカーを探す
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].markerId == this.markerId) {
                this.baseMarker = this.game.markers[j];
                this.targetDistance = this.baseMarker.minDist;
            }
        }

        //HumanClassが作成されたマーカーから数えて、相手の陣地のあるマップを全て取得する
        for (var i = 0; i < this.baseMarker.distances.length; i++) {
            if (this.colorName == "GREEN") {
                this.enemyColorName = "RED";
            } else {
                this.enemyColorName = "GREEN";
            }
            if (this.baseMarker.distances[i].colorName == this.enemyColorName) {
                var _marker = this.getMarker(this.baseMarker.distances[i].col, this.baseMarker.distances[i].row);
                this.targetMarkers.push(this.baseMarker.distances[i]);
            }
        }
        //マーカーからの距離でsortする
        this.targetMarkers.sort(function(a,b){
            if(a.dist < b.dist) return -1;
            if(a.dist > b.dist) return 1;
            return 0;
        });
        //選択されたマーカー一覧から一つを選ぶ
        if (this.targetMarkers.length > 0) {
            this.targetMarker = this.targetMarkers[0];
            //this.targetMarker.distanceToGoal = this.targetMarkers.length;
            this.targetDistance = this.targetMarker.dist;
        } else {
            //この距離でなければ距離を足していく
            //this.targetDistance += 1;
            this.targetMarker = null;
        }
        if (this.targetMarker != null) {
            this.targetMarker.isFill = true;
            this.route.push(this.targetMarker);
            //仮に5だとしたら、4回繰り返して、元をたどる
            this.nextMarker = this.targetMarker;
            for (var dist = 1; dist < this.targetDistance; dist++) {
                this.nextMarker = this.findDistance(this.nextMarker.col, this.nextMarker.row, this.targetDistance - dist);
                //最後の1個だけマーカーを塗る
                //if(dist <= 2){
                //    this.nextMarker.isFill = true;
                //}else{
                //    this.nextMarker.isFill = false;
                //}
                //this.nextMarker.isFill = false;
                this.nextMarker.isFill = true;
                if (this.nextMarker) {
                    this.route.push(this.nextMarker);
                }
            }
        }
        var count = 0;
        this.reverseArr = [];
        for (var i = this.route.length - 1; i >= 0; i--) {
            this.reverseArr[count] = this.route[i];
            count++;
        };
    },

    object_array_sort:function(data,key,order,fn){
        //デフォは降順(DESC)
        var num_a = -1;
        var num_b = 1;

        if(order === 'asc'){//指定があれば昇順(ASC)
          num_a = 1;
          num_b = -1;
        }

        data = data.sort(function(a, b){
          var x = a[key];
          var y = b[key];
          if (x > y) return num_a;
          if (x < y) return num_b;
          return 0;
        });

        fn(data); // ソート後の配列を返す
    },

    getSotedData:function(){
        //
        //this.sortedDistances = [];
        //this.targetMarkers.をdist順でsortする
        this.object_array_sort(this.baseMarker.distances, 'dist', 'asc', function(sortedDistances){
            //ソート後の処理
            //console.log(sortedDistances); //
            //this.sortedDistances = sortedDistances;
            return sortedDistances;
        });
    },

    update: function () {
        /*
        this.timeCnt++;
        if (this.timeCnt >= 30 * 1) {
            this.timeCnt = 0;
            //var _dist = this.getMinDistanceMarker();
            //cc.log("DIST" + _dist);
        }
        */
        if (this.reverseArr.length >= 1) {
            if (this.reverseArr[0]) {
                this.targetMarker = this.getMarker(this.reverseArr[0].col, this.reverseArr[0].row);
                this.isFill = this.reverseArr[0].isFill;
                if (this.targetMarker) {
                    this.moveToTarget(this.targetMarker, this.walkSpeed, this.walkSpeed, this.isFill);
                }
            }
        } else {
            return false;
        }
        return true;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    remove: function () {
        this.removeChild(this.sprite);
    },
    getDirection: function () {
        return this.direction;
    },
    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var i = 0; i < 3; i++) {
            var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 0, this.imgWidth, this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setAnchorPoint(0, 0);
        this.sprite.setPosition(6,12);
        this.addChild(this.sprite);
    },

    moveToTarget: function (object, speed, targetDist, isFill) {



        var diffX = Math.floor(object.getPosition().x - this.getPosition().x);
        var diffY = Math.floor(object.getPosition().y - this.getPosition().y);
        if (diffX > 0 && diffY > 0) {
            this.walkRightUp();
        }
        if (diffX > 0 && diffY < 0) {
            this.walkRightDown();
        }
        if (diffX < 0 && diffY > 0) {
            this.walkLeftUp();
        }
        if (diffX < 0 && diffY < 0) {
            this.walkLeftDown();
        }



        var dX = object.getPosition().x - this.getPosition().x;
        var dY = object.getPosition().y - this.getPosition().y;
        var dist = Math.sqrt(dX * dX + dY * dY);
        if (dist > targetDist) {
            var rad = Math.atan2(dX, dY);
            var speedX = speed * Math.sin(rad);
            var speedY = speed * Math.cos(rad);
            this.setPosition(this.getPosition().x + speedX, this.getPosition().y + speedY);
        } else {
            this.setPosition(object.getPosition().x, object.getPosition().y);
            if(isFill == true){
                
                if(object.colorId != this.colorName){
                    this.reverseArr = [];
                }

                if(object.buildingMapType == null){
                    object.colorId = this.colorName;
                    object.isRender = true;
                }
            }
            object.spriteBlack.setVisible(false);
            this.col = object.col;
            this.row = object.row;
            this.targetMarker = null;
            this.reverseArr.splice(0, 1);
        }
    },
    moveToRight: function (speed, target) {
        var _ySPeed = 0;
        if (target) {
            var dY = target.getPosition().y - this.getPosition().y;
            if (dY >= 20) {
                _ySPeed = speed;
            }
            if (dY <= -20) {
                _ySPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x + speed, this.getPosition().y + _ySPeed);
        this.walkRight();
    },
    moveToLeft: function (speed, target) {
        var _ySPeed = 0;
        if (target) {
            var dY = target.getPosition().y - this.getPosition().y;
            if (dY >= 2) {
                _ySPeed = speed;
            }
            if (dY <= -2) {
                _ySPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x - speed, this.getPosition().y + _ySPeed);
        this.walkLeft();
    },
    moveToUp: function (speed, target) {
        var _xSPeed = 0;
        if (target) {
            var dX = target.getPosition().x - this.getPosition().x;
            if (dX >= 2) {
                _xSPeed = speed;
            }
            if (dX <= -2) {
                _xSPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x + _xSPeed, this.getPosition().y + speed);
        this.walkBack();
    },
    moveToDown: function (speed, target) {
        var _xSPeed = 0;
        if (target) {
            var dX = target.getPosition().x - this.getPosition().x;
            if (dX >= 2) {
                _xSPeed = speed;
            }
            if (dX <= -2) {
                _xSPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x + _xSPeed, this.getPosition().y - speed);
        this.walkLeftDown();
    },
    walkLeftDown: function () {
        if (this.direction != "front") {
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 0, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.05);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkRightDown: function () {
        if (this.direction != "left") {
            this.direction = "left";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 1, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.05);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkLeftUp: function () {
        if (this.direction != "right") {
            this.direction = "right";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 2, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.05);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkRightUp: function () {
        if (this.direction != "back") {
            this.direction = "back";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 3, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.05);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
});