function CInterface(iMode, iLevel) {
    var _oContainer;
    var _oAudioToggle;
    var _iMode = iMode;
    var _iLevel = iLevel;
    var _iBottomLinePos;

    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosRestart;
    var _pStartPosFullscreen;

    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oButExit;
    var _oButRestart;
    var _oTimeText;
    var _oPointsText;
    var _oLevelText;
    var _oAreYouSurePanel;

    this._init = function() {
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');

        _pStartPosExit = {
            x: CANVAS_WIDTH - oSpriteExit.width / 2 - 20,
            y: (oSpriteExit.height / 2) + 10
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');

            _pStartPosAudio = {
                x: _pStartPosExit.x - oSpriteExit.width / 2 - oSprite.width / 4,
                y: _pStartPosExit.y
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, _oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {
                x: 20 + oSprite.width / 4,
                y: (oSprite.height / 2) + 10
            };
            _pStartPosRestart = {
                x: _pStartPosAudio.x - oSprite.width / 2,
                y: _pStartPosAudio.y
            };
        } else {
            _pStartPosFullscreen = {
                x: _pStartPosExit.x - oSpriteExit.width - 10,
                y: _pStartPosExit.y
            };
            _pStartPosRestart = {
                x: _pStartPosFullscreen.x,
                y: _pStartPosFullscreen.y
            };
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

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, _oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oButRestart = new CGfxButton(_pStartPosRestart.x, _pStartPosRestart.y, s_oSpriteLibrary.getSprite("but_restart_small"), _oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.initInterfacesText = function() {
        _iBottomLinePos = CANVAS_HEIGHT - 250;

        _oTimeText = new createjs.Text(TEXT_TIME + " " + TIME[_iMode] / 1000, "30px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oTimeText.textAlign = "left";
        _oTimeText.textBaseline = "alphabetic";
        _oTimeText.x = 40;
        _oTimeText.y = _iBottomLinePos;
        _oContainer.addChild(_oTimeText);

        var iLevelN = _iLevel + 1;
        _oLevelText = new createjs.Text(TEXT_LEVEL + " " + iLevelN, "30px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oLevelText.textAlign = "center";
        _oLevelText.x = CANVAS_WIDTH_HALF;
        _oLevelText.textBaseline = "alphabetic";
        _oLevelText.y = _iBottomLinePos;
        _oContainer.addChild(_oLevelText);

        _oPointsText = new createjs.Text(TIME[_iMode] / 100 + " " + TEXT_PTS, "30px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oPointsText.textAlign = "right";
        _oPointsText.x = CANVAS_WIDTH - 40;
        _oPointsText.textBaseline = "alphabetic";
        _oPointsText.y = _iBottomLinePos;
        _oContainer.addChild(_oPointsText);

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshLevelText = function(iLevelN) {
        _oLevelText.text = TEXT_LEVEL + " " + iLevelN;
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y + iNewY);
        }

        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
        _oButRestart.setPosition(_pStartPosRestart.x - iNewX, _pStartPosRestart.y + iNewY);

        _iBottomLinePos = CANVAS_HEIGHT - iNewY - 50;
        if (_oTimeText !== undefined) {
            _oTimeText.y = _iBottomLinePos;
            _oLevelText.y = _iBottomLinePos;
            _oPointsText.y = _iBottomLinePos;
        };
    };

    this.refreshTimer = function(iTimer) {
        if (iTimer < 0) {
            iTimer = 0;
        };

        _oTimeText.text = TEXT_TIME + " " + iTimer;
    };

    this.refreshPointsText = function(iValue) {
        _oPointsText.text = iValue + " " + TEXT_PTS;
    };

    this.unload = function() {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
        }

        _oButRestart.unload();
        _oButExit.unload();
        s_oInterface = null;
        s_oGame._bDisableEvents = false;
    };

    this._onExit = function() {
        _oAreYouSurePanel = new CAreYouSurePanel(_oContainer);
        s_oGame._bDisableEvents = true;
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onFullscreenRelease = function() {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }

        sizeHandler();
    };

    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setActive(s_bFullscreen);
        };
    };

    this._onRestart = function() {
        if (s_oEndPanel !== null) {
            this.unload();
            s_oEndPanel.unload();
        };

        if (s_oWinPanel !== null) {
            this.unload();
            s_oWinPanel.unload();
        };

        s_oGame.restart();
    };

    s_oInterface = this;

    this._init();

    return this;
}

var s_oInterface = null;