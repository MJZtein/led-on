function CMenu() {
    var _oMenuContainer;
    var _oBg;
    var _oGameLogo;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oButCredits;
    var _oCreditsPanel = null;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;

    this._init = function() {
        //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE
        _oMenuContainer = new createjs.Container();
        s_oStage.addChild(_oMenuContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oMenuContainer.addChild(_oBg);

        this.initLeds();

        var oGameLogo = s_oSpriteLibrary.getSprite('logo_menu');
        _oGameLogo = createBitmap(oGameLogo);
        _oGameLogo.regX = oGameLogo.width / 2;
        _oGameLogo.regY = oGameLogo.height / 2;
        _oGameLogo.x = CANVAS_WIDTH / 2;
        _oGameLogo.y = -150;
        createjs.Tween.get(_oGameLogo, {
            loop: false
        }).to({
            y: CANVAS_HEIGHT / 2 - 150
        }, 1000, createjs.Ease.cubicOut);
        _oMenuContainer.addChild(_oGameLogo);

        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT + 150, oSpritePlay, _oMenuContainer);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        createjs.Tween.get(_oButPlay.getSprite(), {
            loop: false
        }).to({
            y: CANVAS_HEIGHT / 2 + 250
        }, 1000, createjs.Ease.cubicOut);

        var oSprite;
        /*
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:20 + oSprite.width/2,y:(oSprite.height / 2) + 10};
        _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite, _oMenuContainer);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);
		*/

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: CANVAS_WIDTH - oSprite.width / 4 - 20,
                y: (oSprite.height / 2) + 10
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, _oMenuContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && inIframe() === false) {
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {
                x: 20 + oSprite.width / 2,
                y: (oSprite.height / 2) + 10
            };

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, _oMenuContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oMenuContainer.addChild(_oFade);

        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000).call(function() {
            _oMenuContainer.removeChild(_oFade);
        });

        if (!s_bStorageAvailable) {
            new CMsgBox(TEXT_ERR_LS, _oMenuContainer);
        } else {
            var iTotalScore = getItem("lights_total_score");
            if (iTotalScore !== null && iTotalScore !== undefined) {
                s_iTotalScore = Number(iTotalScore);
            } else {
                s_iTotalScore = 0;
            };

            var aBestScore = getItemJson("lights_best_score");
            if (aBestScore !== null && aBestScore !== undefined) {
                s_aBestScore = aBestScore;
            } else {
                s_aBestScore = [0, 0, 0, 0];
            };

            var aLastLevel = getItemJson("lights_last_level");
            if (aLastLevel !== null && s_aLastLevel !== undefined) {
                s_aLastLevel = aLastLevel;
            } else {
                s_aLastLevel = [1, 1, 1, 1];
            };

            if (s_aLevelStars === undefined || s_aLevelStars === null) {
                s_aLevelStars = new Array;

                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < MATRIX_SETTINGS[i].length; j++) {
                        s_aLevelStars[i].push(0);
                    };
                };
            };

            var aLevelStars = getItemJson("lights_level_stars");
            if (aLevelStars !== null && s_aLevelStars !== undefined) {
                s_aLevelStars = aLevelStars;
            };
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.initLeds = function() {
        var oLed;
        var iLedWidth = 141;
        var iLedHeight = 165;
        var iStartY = CANVAS_HEIGHT_HALF - 10;
        var iOffsetX = 300;
        var iOffsetY = 250;

        var aX = [CANVAS_WIDTH_HALF - iOffsetX, CANVAS_WIDTH_HALF, CANVAS_WIDTH_HALF + iOffsetX, CANVAS_WIDTH_HALF - iOffsetX, CANVAS_WIDTH_HALF, CANVAS_WIDTH_HALF + iOffsetX];
        var aY = [iStartY, iStartY, iStartY, iStartY - iOffsetY, iStartY - iOffsetY, iStartY - iOffsetY];

        for (var i = 0; i < 6; i++) {
            var iRandomN = Math.floor((Math.random() * 4) + 1);
            var szAnimation = "led_" + iRandomN;
            var iX = aX[i];
            var iY = aY[i];

            var data = {
                images: [s_oSpriteLibrary.getSprite(szAnimation)],
                frames: {
                    width: iLedWidth,
                    height: iLedHeight
                },
                animations: {
                    PIPE_END_ON: [1, 9, "LED_TURN_OFF"],
                    LED_TURN_OFF: {
                        frames: [9, 8, 7, 6, 5, 4, 3, 2, 1],
                        next: "PIPE_END_ON"
                    }
                },
                framerate: Math.floor((Math.random() * 30) + 15)
            };

            var oSpriteSheet = new createjs.SpriteSheet(data);
            oLed = createSprite(oSpriteSheet, 'PIPE_END_ON', 0, 0, iLedWidth, iLedHeight);
            oLed.regX = iLedWidth / 2 - 2;
            oLed.regY = iLedHeight / 2 + 20;
            oLed.scaleX = oLed.scaleY = 0.7;
            oLed.x = iX;
            oLed.y = iY;
            _oMenuContainer.addChild(oLed);
        };
    };

    this.unload = function() {
        _oButPlay.unload();
        _oButPlay = null;

        //_oButCredits.unload();

        _oMenuContainer.removeChild(_oBg);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
        }
        s_oMenu = null;
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }

        //_oButCredits.setPosition(_pStartPosCredits.x + iNewX,_pStartPosCredits.y + iNewY);
    };

    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setActive(s_bFullscreen);
        };
    };

    this.exitFromCredits = function() {
        _oCreditsPanel = null;
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onCredits = function() {
        _oCreditsPanel = new CCreditsPanel();
    };

    this._onButPlayRelease = function() {
        this.unload();

        if (isIOS() && s_oSoundTrack === null) {
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                //
            }
        } else {
            playSound("click", 1, false);
        }

        s_oMain.gotoMenuMode();
    };

    this._onFullscreenRelease = function() {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }

        sizeHandler();
    };

    this.update = function() {

    };

    s_oMenu = this;

    this._init();
}

var s_oMenu = null;