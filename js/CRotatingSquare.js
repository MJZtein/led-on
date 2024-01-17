function CRotatingSquare(iColumn, iRow, szAnimation, iRotation, oContainer) {
    var _oThis;
    var _oSprite;
    var _oContainer;
    var _oTween;

    var _iColumn;
    var _iRow;
    var _iRotation;
    var _iAlpha = 0.01;

    var _szAnimation;

    this._init = function() {
        _oContainer = oContainer;
        _iColumn = iColumn;
        _iRow = iRow;
        _szAnimation = szAnimation;
        _iRotation = iRotation;

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

        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oSprite = createSprite(oSpriteSheet, _szAnimation, 0, 0, SQUARE_SIZE, SQUARE_SIZE);
        _oSprite.regX = _oSprite.regY = SQUARE_SIZE / 2;
        _oSprite.x = SQUARE_SIZE * _iColumn;
        _oSprite.y = SQUARE_SIZE * _iRow;
        _oSprite.rotation = _iRotation;
        _oSprite.alpha = _iAlpha;
        _oSprite.gotoAndPlay(_szAnimation);
        _oContainer.addChild(_oSprite);

        _oTween = createjs.Tween.get(_oSprite);
    };

    this.setRotation = function(iAngle) {
        _oSprite.rotation = iAngle;
    };

    this.initRotation = function(iRotationAngle) {
        _oSprite.alpha = 1;

        // SOSTITUIRE CON IL PUNTATORE _oTween <--------------------------------------------------------------------------------------
        createjs.Tween.get(_oSprite)
            .to({
                rotation: iRotationAngle
            }, 200, createjs.Ease.cubicOut)
            .call(function() {
                s_oGame.onRotationFinished(_iColumn, _iRow);
            });
    };

    this.stopRotation = function() {
        _oSprite.alpha = _iAlpha;

        if (_oSprite.rotation >= 360) {
            _oSprite.rotation = 0;
        };

        s_oGame.startCheck();
        s_oGame.updateCache();
    };

    this.unload = function() {
        createjs.Tween.removeAllTweens();
        _oContainer.removeChild(_oSprite);
        _oThis = null;
    };

    _oThis = this;

    this._init();
};