function CLevelSelect(iMode) {
    var _iMode;
    var _iCurPage;
    var _iHeightToggle;
    var _aLevelButs;
    var _aPointsX;
    var _aContainerPage;
    var _aStars;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;

    var _oBg;
    var _oFade;
    var _oButExit;
    var _oAudioToggle;
    var _oArrowRight = null;
    var _oArrowLeft = null;
    var _oTextTitleBack;
    var _oTextTitle;
    var _oBestScoreBack;
    var _oBestScore;
    var _oTotalScoreBack;
    var _oTotalScore;
    var _oContainer;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function() {
        _iMode = iMode;
        _iCurPage = 0;
        _aStars = [];

        NUM_LEVELS = MATRIX_SETTINGS[_iMode].length;

        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oContainer.addChild(_oBg);

        _oTextTitleBack = new createjs.Text(TEXT_SELECT_LEVEL, " 48px " + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oTextTitleBack.textAlign = "center";
        _oTextTitleBack.lineWidth = 600;
        _oTextTitleBack.textBaseline = "middle";
        _oTextTitleBack.x = CANVAS_WIDTH_HALF + 2;
        _oTextTitleBack.y = CANVAS_HEIGHT_HALF - 298;
        _oContainer.addChild(_oTextTitleBack);

        _oTextTitle = new createjs.Text(TEXT_SELECT_LEVEL, " 48px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oTextTitle.textAlign = "center";
        _oTextTitle.lineWidth = 600;
        _oTextTitle.textBaseline = "middle";
        _oTextTitle.x = CANVAS_WIDTH_HALF;
        _oTextTitle.y = CANVAS_HEIGHT_HALF - 300;
        _oContainer.addChild(_oTextTitle);

        _oBestScoreBack = new createjs.Text(TEXT_DIFFICULTY[_iMode] + " " + TEXT_YOUR_BEST_SCORE + " " + s_aBestScore[_iMode], " 30px " + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oBestScoreBack.textAlign = "center";
        _oBestScoreBack.lineWidth = 400;
        _oBestScoreBack.textBaseline = "middle";
        _oBestScoreBack.x = CANVAS_WIDTH_HALF + 2;
        _oBestScoreBack.y = CANVAS_HEIGHT_HALF + 318;
        _oContainer.addChild(_oBestScoreBack);

        _oBestScore = new createjs.Text(TEXT_DIFFICULTY[_iMode] + " " + TEXT_YOUR_BEST_SCORE + " " + s_aBestScore[_iMode], " 30px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oBestScore.textAlign = "center";
        _oBestScore.lineWidth = 400;
        _oBestScore.textBaseline = "middle";
        _oBestScore.x = CANVAS_WIDTH_HALF;
        _oBestScore.y = CANVAS_HEIGHT_HALF + 320;
        _oContainer.addChild(_oBestScore);

        _oTotalScoreBack = new createjs.Text(TEXT_TOTAL_SCORE + s_iTotalScore, " 30px " + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oTotalScoreBack.textAlign = "center";
        _oTotalScoreBack.lineWidth = 400;
        _oTotalScoreBack.textBaseline = "middle";
        _oTotalScoreBack.x = CANVAS_WIDTH_HALF + 2;
        _oTotalScoreBack.y = CANVAS_HEIGHT_HALF + 358;
        _oContainer.addChild(_oTotalScoreBack);

        _oTotalScore = new createjs.Text(TEXT_TOTAL_SCORE + s_iTotalScore, " 30px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oTotalScore.textAlign = "center";
        _oTotalScore.lineWidth = 400;
        _oTotalScore.textBaseline = "middle";
        _oTotalScore.x = CANVAS_WIDTH_HALF;
        _oTotalScore.y = CANVAS_HEIGHT_HALF + 360;
        _oContainer.addChild(_oTotalScore);

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - oSpriteExit.width / 2 - 20,
            y: (oSpriteExit.height / 2) + 10
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _iHeightToggle = oSpriteExit.height;

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
        } else {
            _pStartPosFullscreen = {
                x: _pStartPosExit.x - oSpriteExit.width - 10,
                y: _pStartPosExit.y
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

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000).call(function() {
            _oContainer.removeChild(_oFade);
        });

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

        this._checkBoundLimits();

        //FIND X COORDINATES FOR LEVEL BUTS
        _aPointsX = new Array();
        var iWidth = CANVAS_WIDTH - (EDGEBOARD_X * 2);
        var iOffsetX = Math.floor(iWidth / NUM_COLS_PAGE_LEVEL) / 2;
        var iXPos = 0;
        for (var i = 0; i < NUM_COLS_PAGE_LEVEL; i++) {
            _aPointsX.push(iXPos);
            iXPos += iOffsetX * 2;
        }

        _aContainerPage = new Array();
        this._createNewLevelPage(0, NUM_LEVELS);

        if (_aContainerPage.length > 1) {
            //MULTIPLE PAGES
            for (var k = 1; k < _aContainerPage.length; k++) {
                _aContainerPage[k].visible = false;
            }

            var iOffsetX = 280;
            var iOffsetY = 350;
            _oArrowRight = new CGfxButton(CANVAS_WIDTH_HALF + iOffsetX, CANVAS_HEIGHT_HALF + iOffsetY, s_oSpriteLibrary.getSprite('but_arrow_right'), _oContainer);
            _oArrowRight.addEventListener(ON_MOUSE_UP, this._onRight, this);

            _oArrowLeft = new CGfxButton(CANVAS_WIDTH_HALF - iOffsetX, CANVAS_HEIGHT_HALF + iOffsetY, s_oSpriteLibrary.getSprite('but_arrow_left'), _oContainer);
            _oArrowLeft.addEventListener(ON_MOUSE_UP, this._onLeft, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this._onExit = function() {
        this.unload();
        s_oMain.gotoMenuMode();
    };

    this._checkBoundLimits = function() {
        var oSprite = s_oSpriteLibrary.getSprite('but_level');
        var iY = 0;

        var iHeightBound = CANVAS_HEIGHT - (EDGEBOARD_Y * 2) - (_iHeightToggle * 2);
        var iNumRows = 0;

        while (iY < iHeightBound) {
            iY += oSprite.height + 20;
            iNumRows++;
        }

        if (NUM_ROWS_PAGE_LEVEL > iNumRows) {
            NUM_ROWS_PAGE_LEVEL = iNumRows;
        }

        var iNumCols = 0;
        var iX = 0;
        var iWidthBounds = CANVAS_WIDTH - (EDGEBOARD_X * 2);
        var oSprite = s_oSpriteLibrary.getSprite('but_level');

        while (iX < iWidthBounds) {
            iX += (oSprite.width / 2) + 5;
            iNumCols++;
        }
        if (NUM_COLS_PAGE_LEVEL > iNumCols) {
            NUM_COLS_PAGE_LEVEL = iNumCols;
        }
    };

    this._createNewLevelPage = function(iStartLevel, iEndLevel) {
        var oContainerLevelBut = new createjs.Container();
        _oContainer.addChild(oContainerLevelBut);
        _aContainerPage.push(oContainerLevelBut);

        _aLevelButs = new Array();
        var iCont = 0;
        var iY = 0;
        var iNumRow = 1;
        var bNewPage = false;
        var oSprite = s_oSpriteLibrary.getSprite('but_level');
        var iLastLevel = s_aLastLevel[_iMode];

        for (var i = iStartLevel; i < iEndLevel; i++) {
            var iXPos = _aPointsX[iCont] + oSprite.width / 4;
            var iYPos = iY + oSprite.height / 2;
            var oBut = new CLevelBut(iXPos, iYPos, i + 1, oSprite, (i + 1) > iLastLevel ? false : true, oContainerLevelBut);
            oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onButLevelRelease, this, i);
            _aLevelButs.push(oBut);

            // ADD STARS ACCORDING TO THE LEVELS SCORE
            this.addStars(i, iXPos, iYPos, oContainerLevelBut);

            iCont++;
            if (iCont === _aPointsX.length) {
                iCont = 0;
                iY += oSprite.height + 20;
                iNumRow++;
                if (iNumRow > NUM_ROWS_PAGE_LEVEL) {
                    bNewPage = true;
                    break;
                }
            }
        }

        var bounds = oContainerLevelBut.getBounds();
        oContainerLevelBut.x = CANVAS_WIDTH_HALF;
        oContainerLevelBut.y = CANVAS_HEIGHT_HALF;
        oContainerLevelBut.regX = bounds.width / 2;
        oContainerLevelBut.regY = bounds.height / 2;

        if (bNewPage) {
            //ADD A PAGE
            this._createNewLevelPage(i + 1, iEndLevel);
        }
    };

    this.addStars = function(iLevel, iX, iY, oContainer) {
        for (var i = 0; i < 3; i++) {
            var oData = {
                images: [s_oSpriteLibrary.getSprite('star')],
                // width, height & registration point of each sprite
                frames: {
                    width: 70,
                    height: 70,
                    regX: 70 / 2,
                    regY: 70 / 2
                },
                animations: {
                    off: [0],
                    on: [1]
                }
            };

            var oSpriteSheet = new createjs.SpriteSheet(oData);
            var oStar = createSprite(oSpriteSheet, "off", 70 / 2, 70 / 2, 70, 70);
            oStar.scaleX = oStar.scaleY = 0.5;
            _aStars.push(oStar);

            var aOffsetX = [-40, 0, 40];
            oStar.x = iX + aOffsetX[i];
            oStar.y = iY - 55;

            var aLevelStars = s_aLevelStars[_iMode];
            if (aLevelStars !== undefined && aLevelStars !== null) {
                if (aLevelStars[iLevel] > i) {
                    oStar.gotoAndPlay("on");
                };
            };

            oContainer.addChild(oStar);
        };
    };

    this._onRight = function() {
        _aContainerPage[_iCurPage].visible = false;

        _iCurPage++;
        if (_iCurPage >= _aContainerPage.length) {
            _iCurPage = 0;
        }

        _aContainerPage[_iCurPage].visible = true;
    };

    this._onLeft = function() {
        _aContainerPage[_iCurPage].visible = false;

        _iCurPage--;
        if (_iCurPage < 0) {
            _iCurPage = _aContainerPage.length - 1;
        }

        _aContainerPage[_iCurPage].visible = true;
    };

    this.unload = function() {
        for (var i = 0; i < _aLevelButs.length; i++) {
            var oBut = _aLevelButs[i];
            oBut.unload();
            oBut = null;
        };

        for (var i = 0; i < _aStars.length; i++) {
            _oContainer.removeChild(_aStars[i]);
        };

        if (_oArrowLeft !== null) {
            _oArrowLeft.unload();
            _oArrowLeft = null;
        };

        if (_oArrowRight !== null) {
            _oArrowRight.unload();
            _oArrowRight = null;
        };

        _oContainer.removeChild(_oBg);
        _oBg = null;

        _oButExit.unload();
        _oButExit = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
            _oButFullscreen = null;
        }

        s_oLevelSelect = null;
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y + iNewY);
        }

        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };


    this._onButLevelRelease = function(iLevel) {
        if (isIOS() && s_oSoundTrack === null) {
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                //
            }
        } else {
            playSound("click", 1, false);
        }

        var clickable = _aLevelButs[iLevel].ifClickable();
        if (clickable) {
            this.unload();
            s_oMain.gotoGame(_iMode, iLevel);
        };
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

    s_oLevelSelect = this;

    this._init();
}

var s_oLevelSelect = null;