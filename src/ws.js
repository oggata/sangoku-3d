var WebSocketHelper = cc.Class.extend({
    //_userId:0,
    ctor: function (storage) {
        ws = new WebSocket("ws://:8080");
        ws.storage = storage;
        this.ws = ws;
        //接続イベント
        ws.onopen = function (evt) {
            ws.send("onopen");
        };
        //メッセージ受信イベント
        ws.onmessage = function (evt) {
            //cc.log(evt.data);
            if (isJSON(evt.data)) {
                _data = JSON.parse(evt.data)
                if (_data["type"] == "SET_USER_ID") {
                    ws.storage.userId = _data["userId"];
                }
                if (_data["type"] == "ADD_PLAYER") {
                    var _user = new User(this, _data["userId"], _data["treasureAmount"]);
                    ws.storage.users.push(_user);
                }
                if (_data["type"] == "REMOVE_PLAYER") {
                    for (var i = 0; i < ws.storage.users.length; i++) {
                        if (ws.storage.users[i].userId == _data["userId"]) {
                            ws.storage.users.splice(i, 1);
                        }
                    }
                }
                //全playerのデータを1秒おきに同期する処理
                if (_data["type"] == "SYNC_PLAYERS") {
                    var _cnt = 0;
                    for (var i = 0; i < ws.storage.users.length; i++) {
                        if (ws.storage.users[i].userId == _data["userId"]) {
                            //userIDが自アプリのデータ上に存在していればupdate
                            ws.storage.users[i].treasureAmount = _data["treasureAmount"];
                            ws.storage.users[i].userStatus = _data["userStatus"];
                            ws.storage.users[i].cardId001 = _data["cardId001"];
                            ws.storage.users[i].cardId002 = _data["cardId002"];
                            ws.storage.users[i].cardId003 = _data["cardId003"];
                            _cnt += 1;
                        }
                    }
                    //userIDが自アプリのデータ上に存在していなければ追加
                    if (_cnt == 0) {
                        var _user = new User(this, _data["userId"], _data["treasureAmount"]);
                        ws.storage.users.push(_user);
                    }
                }
                if (_data["type"] == "SYNC_ENEMY_DATA_ON_BATTLE") {
                    //cc.log("accept");
                    if(ws.storage.userId == _data["userId"]){
                        //cc.log("accept");
                        ws.storage.battleTargetUserId = _data["battleTargetUserId"];
                        ws.storage.enemyTouchPosX  = _data["enemyTouchPosX"];
                        ws.storage.enemyTouchPosY  = _data["enemyTouchPosY"];
                        ws.storage.enemyTreasureAmount  = _data["enemyTreasureAmount"];
                        ws.storage.enemyColorName  = _data["enemyColorName"];
                        ws.storage.enemyBattleStatus  =  _data["enemyBattleStatus"];

                        if(_data["enemyTurnNum"] != 0){
                            ws.storage.enemyTurnNum  =  _data["enemyTurnNum"];
                        }
                        if(_data["enemyUsedCardId"] != 0){
                            ws.storage.enemyUsedCardId  =  _data["enemyUsedCardId"];
                        }
                        if(_data["enemyUsedCardTurn"] != 0){
                            ws.storage.enemyUsedCardTurn  =  _data["enemyUsedCardTurn"];
                        }
                        ws.storage.enemyUsedCardMsg  =  _data["enemyUsedCardMsg"];
                        var stData = _data['enemyDeckData'];
                        for (var key in stData) {
                            if (stData.hasOwnProperty(key)) {
                                var value = stData[key];
                                ws.storage.enemyDeckData[key] = value;
                            }
                        }
                        var stData = _data['enemyEventData'];
                        for (var key in stData) {
                            if (stData.hasOwnProperty(key)) {
                                var value = stData[key];
                                ws.storage.enemyEventData[key] = value;
                            }
                        }
                    }
                }

                if (_data["type"] == "STEAL_PLAYER") {
                    if (ws.storage.userId == _data["userId"]) {
                        ws.storage.isSteal = true;
                    }
                }

                if (_data["type"] == "CONNECTION_ERROR") {
                    if (ws.storage.userId == _data["userId"]) {
                        ws.storage.isConnectionError = true;
                    }
                }
            }
        };
    },
    sendMsg: function (msg) {
        ws.send(msg);
    },
});
var User = cc.Node.extend({
    ctor: function (game, userId, treasureAmount) {
        this._super();
        this.game = game;
        this.userId = userId;
        this.userStatus = null;
        this.cardId001 = 0;
        this.cardId002 = 0;
        this.cardId003 = 0;
        this.treasureAmount = treasureAmount;
    },
    update: function () {
        return true;
    },
});
var isJSON = function (arg) {
    arg = (typeof arg === "function") ? arg() : arg;
    if (typeof arg !== "string") {
        return false;
    }
    try {
        arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
        return true;
    } catch (e) {
        return false;
    }
};
var getRandNumberFromRange = function (min, max) {
    var rand = min + Math.floor(Math.random() * (max - min));
    return rand;
};