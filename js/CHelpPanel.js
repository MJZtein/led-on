function CHelpPanel() {
    var _oText1;
    var _oText1Back;
    var _oText2;
    var _oText2Back;
    var _oHelpBg;
    var _oHand;
    var _oSquare1;
    var _oSquare2;
    var _oSquare3;
    var _oStartSquare;
    var _oEndSquare;
    var _oGroup;
    var _oFade;
    var _oThis;

    this._init = function() {
        _oGroup = new createjs.Container();
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oGroup, _oFade);
        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000).call(function() {
            _oFade.visible = false;
        });

        var _oShadow = new createjs.Shape();
        _oShadow.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oShadow.alpha = 0.7;
        _oGroup.addChild(_oShadow);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oHelpBg = createBitmap(oSprite);
        _oHelpBg.regX = oSprite.width / 2;
        _oHelpBg.regY = oSprite.height / 2;
        _oHelpBg.x = CANVAS_WIDTH_HALF;
        _oHelpBg.y = CANVAS_HEIGHT_HALF;
        _oGroup.addChild(_oHelpBg);

        this.initText();
        this.initAnimations();

        var oParent = this;
        _oGroup.on("pressup", function() {
            oParent._onExitHelp()
        });
        s_oGame._bDisableEvents = true;

        if (!s_bMobile) {
            _oGroup.cursor = "pointer";
        };
    };

    this.initText = function() {
        var iPosXLines = CANVAS_WIDTH_HALF;
        var iPosYLine1 = CANVAS_HEIGHT_HALF - 180;
        var iPosYLine2 = CANVAS_HEIGHT_HALF - 60;

        _oText1Back = new createjs.Text(TEXT_HELP1, " 32px " + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oText1Back.textAlign = "center";
        _oText1Back.textBaseline = "middle";
        _oText1Back.lineWidth = 500;
        _oText1Back.x = iPosXLines + 2;
        _oText1Back.y = iPosYLine1 + 2;

        _oText1 = new createjs.Text(TEXT_HELP1, " 32px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oText1.textAlign = _oText1Back.textAlign;
        _oText1.textBaseline = _oText1Back.textBaseline;
        _oText1.lineWidth = _oText1Back.lineWidth;
        _oText1.x = iPosXLines;
        _oText1.y = iPosYLine1;

        _oText2Back = new createjs.Text(TEXT_HELP2, " 32px " + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oText2Back.textAlign = "center";
        _oText2Back.textBaseline = "middle";
        _oText2Back.lineWidth = 500;
        _oText2Back.x = iPosXLines + 2;
        _oText2Back.y = iPosYLine2 + 2;

        _oText2 = new createjs.Text(TEXT_HELP2, " 32px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oText2.textAlign = _oText2Back.textAlign;
        _oText2.textBaseline = _oText2Back.textBaseline;
        _oText2.lineWidth = _oText2Back.lineWidth;
        _oText2.x = iPosXLines;
        _oText2.y = iPosYLine2;

        _oGroup.addChild(_oText1Back, _oText1, _oText2Back, _oText2);
    };

    this.initAnimations = function() {
        var iSquaresPositionX = CANVAS_WIDTH_HALF;
        var iSquaresPositionY = CANVAS_HEIGHT_HALF + 120;

        // ADD SQUARES AS EXAMPLES        
        var data = {
            images: [s_oSpriteLibrary.getSprite("pipe1"), // I SQUARE
                s_oSpriteLibrary.getSprite("pipe4")
            ], // END/START SQUARE (START SQUARE IS ALWAYS ON!)
            frames: {
                width: SQUARE_SIZE,
                height: SQUARE_SIZE
            },
            animations: {
                PIPE_1_OFF: [0, 0, false],
                PIPE_1_ON: [1, 1, false],
                PIPE_4_OFF: [2, 2, false],
                PIPE_4_ON: [3, 3, false]
            },
            framerate: 0
        };

        var oSpriteSheet = new createjs.SpriteSheet(data);

        _oSquare1 = createSprite(oSpriteSheet, 'PIPE_4_ON', 0, 0, SQUARE_SIZE, SQUARE_SIZE);
        _oSquare1.regX = _oSquare1.regY = SQUARE_SIZE / 2;
        _oSquare1.x = iSquaresPositionX - SQUARE_SIZE;
        _oSquare1.y = iSquaresPositionY;
        _oSquare1.rotation = 270;

        _oSquare2 = createSprite(oSpriteSheet, 'PIPE_1_OFF', 0, 0, SQUARE_SIZE, SQUARE_SIZE);
        _oSquare2.regX = _oSquare2.regY = SQUARE_SIZE / 2;
        _oSquare2.x = iSquaresPositionX;
        _oSquare2.y = iSquaresPositionY;
        _oSquare2.rotation = 90;

        _oSquare3 = createSprite(oSpriteSheet, 'PIPE_4_OFF', 0, 0, SQUARE_SIZE, SQUARE_SIZE);
        _oSquare3.regX = _oSquare3.regY = SQUARE_SIZE / 2;
        _oSquare3.x = iSquaresPositionX + SQUARE_SIZE;
        _oSquare3.y = iSquaresPositionY;
        _oSquare3.rotation = 90;

        // ADD START SQUARE (A BATTERY)
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
        _oStartSquare.x = _oSquare1.x;
        _oStartSquare.y = _oSquare1.y;

        // ADD END SQUARE (A LED)
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
        _oEndSquare.x = _oSquare3.x;
        _oEndSquare.y = _oSquare3.y;

        _oGroup.addChild(_oSquare1, _oSquare2, _oSquare3, _oStartSquare, _oEndSquare);

        // ADD A HELPING HAND
        var data = {
            images: [s_oSpriteLibrary.getSprite("hand_anim")],
            frames: {
                width: 202,
                height: 277
            },
            animations: {
                idle: [0, 9, 'stop'],
                stop: [9, 9, 'stop']
            },
            framerate: 30
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oHand = createSprite(oSpriteSheet, 'stop', 0, 0, 202, 277);
        _oHand.regX = 202 / 2;
        _oHand.regY = 277 / 2;
        _oHand.x = iSquaresPositionX + 20;
        _oHand.y = iSquaresPositionY + 60;
        _oHand.scaleX = _oHand.scaleY = 0.5;
        _oHand.rotation = 180;
        _oGroup.addChild(_oHand);

        this.startAnimation(0);
    };

    this.startAnimation = function(iAnimation) {
        var iAngle = 90 * iAnimation;
        _oHand.gotoAndPlay("idle");

        createjs.Tween.get(_oSquare2)
            .wait(250)
            .call(function() {
                _oThis.onAnimationStart(iAnimation);
            })
            .to({
                rotation: iAngle
            }, 500, createjs.Ease.cubicOut)
            .call(function() {
                _oThis.onAnimationEnd(iAnimation);
            })
            .play;
    };

    this.onAnimationStart = function(iAnimation) {
        if (iAnimation === 1) {
            _oSquare2.gotoAndPlay("PIPE_1_OFF");
            _oSquare3.gotoAndPlay("PIPE_4_OFF");
            _oEndSquare.gotoAndPlay("LED_TURN_OFF");
        };
    };

    this.onAnimationEnd = function(iAnimation) {
        _oHand.gotoAndPlay("idle");

        if (iAnimation !== 1) {
            _oSquare2.gotoAndPlay("PIPE_1_ON");
            _oSquare3.gotoAndPlay("PIPE_4_ON");
            _oEndSquare.gotoAndPlay("LED_TURN_ON");
        };

        // RESTART THE ANIMATION
        var iAnimationNext = iAnimation + 1;

        if (iAnimation >= 1) {
            iAnimationNext = 0;
        };

        _oThis.startAnimation(iAnimationNext);
    };

    this.unload = function() {
        createjs.Tween.get(_oGroup)
            .to({
                alpha: 0
            }, 500, createjs.Ease.cubicOut)
            .call(function() {
                createjs.Tween.removeAllTweens();
                s_oStage.removeChild(_oGroup);
                s_oGame._bDisableEvents = false;
                var oParent = this;
                _oGroup.off("pressup", function() {
                    oParent._onExitHelp();
                });
            });
    };

    this._onExitHelp = function() {
        this.unload();
        s_oGame._onExitHelp();
    };

    _oThis = this;

    this._init();

}