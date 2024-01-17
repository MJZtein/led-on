function CSquare(iColumn, iRow, iType, iRotation, oContainer, oPiecesContainer, oRotatingPiecesContainer) {
    var _oContainer;
    var _oPiecesContainer;
    var _oRotatingPiecesContainer;
    var _oThis;
    var _oSprite;
    var _oStartSquare;
    var _oEndSquare;
    var _oRotatingSquare;

    var _iColumn;
    var _iRow;
    var _iType;
    var _iRotation;

    var _bTurnedOn;
    var _bLightedOn;
    var _bChecked;

    this._init = function() {
        _oContainer = oContainer;
        _oPiecesContainer = oPiecesContainer;
        _oRotatingPiecesContainer = oRotatingPiecesContainer;
        _iColumn = iColumn;
        _iRow = iRow;
        _iType = iType;
        _iRotation = iRotation;

        _bTurnedOn = false;
        _bLightedOn = false;

        this.initSquare();

        _oSprite.on("pressup", this.onClickedSquare);

        if (!s_bMobile) {
            _oSprite.cursor = "pointer";
        };
    };

    this.initSquare = function() {
        var data = {
            images: [s_oSpriteLibrary.getSprite("pipe0"), // T SQUARE   
                s_oSpriteLibrary.getSprite("pipe1"), // I SQUARE
                s_oSpriteLibrary.getSprite("pipe2"), // L SQUARE
                s_oSpriteLibrary.getSprite("pipe3"), // CROSS SQUARE
                s_oSpriteLibrary.getSprite("pipe4")
            ], // END/START SQUARE (START SQUARE IS ALWAYS ON!)
            frames: {
                width: SQUARE_SIZE,
                height: SQUARE_SIZE
            },
            animations: {
                PIPE_0_OFF: [0, 0, false],
                PIPE_0_ON: [1, 1, false],
                PIPE_1_OFF: [2, 2, false],
                PIPE_1_ON: [3, 3, false],
                PIPE_2_OFF: [4, 4, false],
                PIPE_2_ON: [5, 5, false],
                PIPE_3_OFF: [6, 6, false],
                PIPE_3_ON: [7, 7, false],
                PIPE_4_OFF: [8, 8, false],
                PIPE_4_ON: [9, 9, false]
            },
            framerate: 30
        };

        var aAnimations = ['PIPE_0_OFF', 'PIPE_1_OFF', 'PIPE_2_OFF', 'PIPE_3_OFF', 'PIPE_4_OFF', 'PIPE_4_ON'];

        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oSprite = createSprite(oSpriteSheet, aAnimations[_iType], 0, 0, SQUARE_SIZE, SQUARE_SIZE);
        _oSprite.regX = _oSprite.regY = SQUARE_SIZE / 2;
        _oSprite.x = SQUARE_SIZE * _iColumn;
        _oSprite.y = SQUARE_SIZE * _iRow;
        _oSprite.rotation = _iRotation;
        _oSprite.gotoAndPlay(aAnimations[_iType]);
        _oContainer.addChild(_oSprite);

        _oRotatingSquare = new CRotatingSquare(iColumn, iRow, aAnimations[_iType], iRotation, _oRotatingPiecesContainer);
    };

    this.setRotatingSquare = function() {
        _oRotatingSquare.setRotation(_oSprite.rotation);
    };

    this.setEndSquareAnimations = function() {
        var iRandomN = Math.floor((Math.random() * 4) + 1);
        var szAnimation = "led_" + iRandomN;
        var iLedWidth = 141;
        var iLedHeight = 165;

        var data = {
            images: [s_oSpriteLibrary.getSprite(szAnimation)],
            frames: {
                width: iLedWidth,
                height: iLedHeight
            },
            animations: {
                PIPE_END_OFF: [0, 0, false],
                LED_TURN_ON: [1, 9, false],
                LED_TURN_OFF: {
                    frames: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                    next: false
                }
            },
            framerate: 30
        };

        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oEndSquare = createSprite(oSpriteSheet, 'PIPE_END_OFF', 0, 0, iLedWidth, iLedHeight);
        _oEndSquare.regX = iLedWidth / 2 - 2;
        _oEndSquare.regY = iLedHeight / 2 + 20;
        _oEndSquare.x = _oSprite.x;
        _oEndSquare.y = _oSprite.y;
        _oPiecesContainer.addChild(_oEndSquare);
    };

    this.setStartSquareAnimations = function() {
        var data = {
            images: [s_oSpriteLibrary.getSprite("battery")],
            frames: {
                width: SQUARE_SIZE,
                height: SQUARE_SIZE
            },
            animations: {
                idle: [0, 49, "idle"]
            },
            framerate: 30
        };

        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oStartSquare = createSprite(oSpriteSheet, 'idle', 0, 0, SQUARE_SIZE, SQUARE_SIZE);
        _oStartSquare.regX = _oStartSquare.regY = SQUARE_SIZE / 2;
        _oStartSquare.x = _oSprite.x;
        _oStartSquare.y = _oSprite.y;
        _oPiecesContainer.addChild(_oStartSquare);

        _bTurnedOn = true;
    };

    this.checkSquareType = function() {
        switch (_iType) {
            case SQUARE_END:
                this.setEndSquareAnimations();
                break;
            case SQUARE_START:
                this.setStartSquareAnimations();
                break;
        };
    };

    this.onClickedSquare = function() {
        if (s_oGame.isStartGame() === false || s_oGame.isMoving() === true) {
            return;
        };

        s_oGame.setMoving(true); // AVOID MORE TWEENS AT ONCE        
        s_oMatrix.resetCheck();

        // THE ROTATING SQUARE METHOD IS USED TO IMPROVE THE GRAPHIC EFFECT
        _oSprite.visible = false;
        s_oGame.updateCache();

        var iRotation = _oSprite.rotation + 90;
        _oRotatingSquare.initRotation(iRotation);

        _oSprite.rotation = iRotation;
        if (_oSprite.rotation >= 360) {
            _oSprite.rotation = 0;
        };

        playSound("rotation", 0.8, false);
    };

    this.onRotationFinished = function() {
        _oSprite.visible = true;
        _oRotatingSquare.stopRotation();
        s_oGame.setMoving(false);
    };

    this.getOpenings = function() {
        var aOpenings = [];
        var aPossibleOpenings = [];
        var iRotation = _oSprite.rotation / 90;

        switch (_iType) {
            case SQUARE_T: // [TOP, RIGHT, BOTTOM, LEFT]
                aPossibleOpenings = [
                    [false, true, true, true],
                    [true, false, true, true],
                    [true, true, false, true],
                    [true, true, true, false]
                ];
                aOpenings = aPossibleOpenings[iRotation];
                break;
            case SQUARE_I:
                aPossibleOpenings = [
                    [false, true, false, true],
                    [true, false, true, false],
                    [false, true, false, true],
                    [true, false, true, false]
                ];
                aOpenings = aPossibleOpenings[iRotation];
                break;
            case SQUARE_L:
                aPossibleOpenings = [
                    [false, true, true, false],
                    [false, false, true, true],
                    [true, false, false, true],
                    [true, true, false, false]
                ];
                aOpenings = aPossibleOpenings[iRotation];
                break;
            case SQUARE_CROSS:
                aOpenings = [true, true, true, true];
                break;
            case SQUARE_END:
            case SQUARE_START:
                aPossibleOpenings = [
                    [false, false, true, false],
                    [false, false, false, true],
                    [true, false, false, false],
                    [false, true, false, false]
                ];
                aOpenings = aPossibleOpenings[iRotation];
                break;
        };

        return aOpenings;
    };

    this.isStartSquare = function() {
        if (_iType === SQUARE_START) {
            return true;
        } else {
            return false;
        };
    };

    this.getColumn = function() {
        return _iColumn;
    };

    this.getRow = function() {
        return _iRow;
    };

    this.randomizeSquare = function() {
        while (_oSprite.rotation === _iRotation) {
            _oSprite.rotation = 90 * Math.floor((Math.random() * 3) + 0);
        };

        if (_iType === SQUARE_START) {
            _bTurnedOn = true;
        } else {
            if (_oSprite.rotation === _iRotation) {
                _bTurnedOn = true;
            } else {
                _bTurnedOn = false;
            };
        };
    };

    this.getType = function() {
        return _iType;
    };

    this.getRotation = function() {
        return _oSprite.rotation;
    };

    this.turnOnLed = function(bValue) {
        if (_iType !== SQUARE_END) {
            return;
        };

        if (bValue === true && _bLightedOn === false) {
            _bLightedOn = true;
            if (s_oGame.isStartGame() === true && soundPlaying("light_on") === false) {
                playSound("light_on", 0.8, false);
            };
            _oEndSquare.gotoAndPlay('LED_TURN_ON');
        };

        if (bValue === false && _bLightedOn === true) {
            _bLightedOn = false;
            if (s_oGame.isStartGame() === true && soundPlaying("light_off") === false) {
                playSound("light_off", 1, false);
            };
            _oEndSquare.gotoAndPlay('LED_TURN_OFF');
        };
    };

    this.turnOnSquare = function(bValue) {
        if (_iType !== SQUARE_START) {
            var szSuffix; // USED TO OBTAIN THE ANIMATION NAME

            if (bValue === true) {
                szSuffix = '_ON';
            } else {
                szSuffix = '_OFF';
            };

            _oSprite.gotoAndPlay('PIPE_' + _iType + szSuffix);
            _bTurnedOn = bValue;
        };
    };

    this.isTurnedOn = function() {
        return _bTurnedOn;
    };

    this.isChecked = function() {
        return _bChecked;
    };

    this.setChecked = function(bValue) {
        _bChecked = bValue;
    };

    this.unload = function() {
        createjs.Tween.removeAllTweens();
        _oContainer.removeChild(_oSprite);
        _oPiecesContainer.removeChild(_oEndSquare, _oStartSquare);
        _oThis = _oEndSquare = _oStartSquare = null;
        _oRotatingSquare.unload();
    };

    _oThis = this;

    this._init();
};