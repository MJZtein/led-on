function CGame(oData, iMode, iLevel) {
    var _bStartGame;
    var _bDisableEvents;
    var _bWin;
    var _bTimesUp; // USED TO CALL THE "TIMESUP" FUNCTION ONCE ONLY
    var _bMovingSquares;

    var _iScore;
    var _iMode;
    var _iTimer;
    var _iLevel;
    var _iLightedSquares;
    var _iLevelStars;
    var _iTimeSpent;
    var _iTotalScore;

    var _oGameContainer;
    var _oInterface;
    var _oEndPanel;
    var _oHelpPanel;
    var _oTimer;
    var _oMatrix;
    var _oMatrixContainer;
    var _oPipesContainer;
    var _oPiecesContainer;
    var _oRotatingPiecesContainer;

    var _aSquares;

    this._init = function() {
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);
        $(s_oMain).trigger("start_level", _iLevel + 1);

        _iMode = iMode;
        _iLevel = iLevel;

        this.resetVariables();

        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        oBg.cache;
        _oMatrixContainer = new createjs.Container();
        _oGameContainer.addChild(oBg, _oMatrixContainer);

        _oRotatingPiecesContainer = new createjs.Container();
        _oPipesContainer = new createjs.Container();
        _oPiecesContainer = new createjs.Container();
        _oMatrixContainer.addChild(_oRotatingPiecesContainer, _oPipesContainer, _oPiecesContainer);

        this.initMatrix();

        _oInterface = new CInterface(_iMode, _iLevel);
        _oInterface.initInterfacesText();

        if (_iLevel === 0) {
            _oHelpPanel = CHelpPanel();
        } else {
            this._onExitHelp();
        };
    };

    this.resetVariables = function() {
        _oEndPanel = null;

        _bStartGame = false;
        _bDisableEvents = false;
        _bTimesUp = true;
        _bWin = false;
        _bMovingSquares = false;

        _iScore = 0;
        _iTimer = TIME[_iMode];
        _iLightedSquares = 0;
        _iLevelStars = 0;
        _iTimeSpent = 0;
        _iTotalScore = s_iTotalScore;

        _aSquares = [];

        setVolume("soundtrack", 0.3);
    };

    this.initMatrix = function() {
        _oMatrix = new CMatrix(_iMode, _iLevel, _oPipesContainer, _oPiecesContainer, _oRotatingPiecesContainer);
        _aSquares = _oMatrix.getSquares();

        // FOR START AND END SQUARES, THERE'S SOME EXTRA SETTINGS TO SET
        for (var i = 0; i < _aSquares.length; i++) {
            _aSquares[i].checkSquareType();
            _aSquares[i].setRotatingSquare();
        };

        s_oGame.startCheck();

        // ZOOM THE MATRIX, CACHE CONTAINER
        this.arrangeMatrix();
        var bounds = _oPipesContainer.getBounds();
        _oPipesContainer.cache(_oPipesContainer.x - bounds.width / 2,
            _oPipesContainer.y - bounds.height / 2, bounds.width * 1.5, bounds.height * 1.5);
    };

    this.arrangeMatrix = function() {
        var iScale = MATRIX_SCALE[_iMode];

        var iOffset = SQUARE_SIZE / 2 * iScale;
        _oMatrixContainer.scaleX = _oMatrixContainer.scaleY = iScale;

        var bounds = _oMatrixContainer.getBounds();
        _oMatrixContainer.regX = bounds.width / 2;
        _oMatrixContainer.regY = bounds.height / 2;
        _oMatrixContainer.x = CANVAS_WIDTH_HALF + iOffset;
        _oMatrixContainer.y = CANVAS_HEIGHT_HALF + iOffset;
    };

    this.updateCache = function() {
        _oPipesContainer.updateCache();
    };

    this.onRotationFinished = function(iColumn, iRow) {
        var oSquare = s_oMatrix.findSquare(iColumn, iRow);
        oSquare.onRotationFinished();
    };

    this.setMoving = function(bValue) {
        _bMovingSquares = bValue;
    };

    this.isMoving = function() {
        return _bMovingSquares;
    };

    this.unload = function() {
        _oInterface.unload();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        s_oGame = null;
    };

    this.updateScores = function() {
        // THIS SCORE IS HOW MANY SECONDS HAVE BEEN USED (MULTIPLIED 10), THIS WILL BE MULTIPLIED FOR A DIFFICULTY MULTIPLIER
        _iScore = Math.ceil((TIME[_iMode] - _iTimeSpent) / 100) * SCORE_MULTIPLIER[_iMode];

        // AVOID A NEGATIVE SCORE
        if (_iScore < 0) {
            _iScore = 0;
        };

        // UPDATE TOTAL SCORE
        _iTotalScore += _iScore;
        s_iTotalScore = _iTotalScore;
        saveItem("lights_total_score", s_iTotalScore);

        // UPDATE BEST SCORE
        if (_iScore > s_aBestScore[_iMode]) {
            s_aBestScore[_iMode] = _iScore;
            setItemJson("lights_best_score", s_aBestScore);
        };

        this.updateLastLevel();
        this.updateLevelStars();
    };

    this.updateLastLevel = function() {
        if (_iLevel + 2 > s_aLastLevel[_iMode]) {
            s_aLastLevel[_iMode] = _iLevel + 2;
            setItemJson("lights_last_level", s_aLastLevel);
        };
    };

    this.updateLevelStars = function() {
        var aLevelStars = s_aLevelStars[_iMode];

        if (aLevelStars === undefined || aLevelStars === null) {
            aLevelStars = new Array;
            for (var i = 0; i < MATRIX_SETTINGS[_iMode].length; i++) {
                aLevelStars.push(0);
            };
        };

        // ADD LEVEL STARS ACCORDING TO THE TIME REMAINING
        if (_iTimer <= TIME[_iMode] / 3) {
            _iLevelStars = 1;
        } else if (_iTimer <= TIME[_iMode] / 3 * 2 && _iTimer > TIME[_iMode] / 3) {
            _iLevelStars = 2;
        } else if (_iTimer > (TIME[_iMode] / 3) * 2) {
            _iLevelStars = 3;
        };

        if (_iLevelStars > aLevelStars[_iLevel]) {
            aLevelStars[_iLevel] = _iLevelStars;
            s_aLevelStars[_iMode] = aLevelStars;
            setItemJson("lights_level_stars", s_aLevelStars);
        };
    };

    this._checkWin = function() {
        playSound("game_win", 0.5, false);
        stopSound("soundtrack");
        stopSound("timer");

        setTimeout(function() {
            playSound("soundtrack", 0.5, false);
        }, 5000);

        if (_bWin) {
            if (_oEndPanel === null) {
                this.updateScores();
                _oEndPanel = new CWinPanel(_iMode, _iTimeSpent, _iLevel, _iLevelStars);
                $(s_oMain).trigger("share_event", _iScore);
                $(s_oMain).trigger("save_score", s_iTotalScore);
            };
        };
    };

    this.onExit = function() {
        setVolume("soundtrack", 1);
        s_oGame.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };

    this.restart = function() {
        setVolume("soundtrack", 0.3);
        $(s_oMain).trigger("restart_level", _iLevel + 1);

        _oPipesContainer.uncache();
        this.resetVariables();
        _oInterface.refreshPointsText(TIME[_iMode] / 10);
        _oInterface.refreshLevelText(_iLevel + 1);
        _oMatrix.unload();
        this.initMatrix();

        s_oStage.update();
        this._onExitHelp();
    };

    this._onExitHelp = function() {
        _bStartGame = true;
    };

    this.gameOver = function() {
        _bStartGame = false;
        _iScore = 0;
        _iLevelStars = 0;

        if (_oEndPanel === null) {
            playSound("game_over", 0.5, false);
            stopSound("soundtrack");

            setTimeout(function() {
                playSound("soundtrack", 0.5, false);
            }, 5000);


            _oEndPanel = new CEndPanel(_iMode);
            _bDisableEvents = true;

            $(s_oMain).trigger("share_event", s_iTotalScore);
            $(s_oMain).trigger("save_score", s_iTotalScore);
        };
    };

    this.updateTimer = function() {
        if (_iTimer > 0 && _bStartGame && !this._bDisableEvents) {
            _iTimer -= s_iTimeElaps;
            _oInterface.refreshTimer(Math.ceil(_iTimer / 1000));
            _iTimeSpent = Math.ceil((TIME[_iMode] - _iTimer) / 10);
            _oInterface.refreshPointsText(Math.ceil((TIME[_iMode] - _iTimeSpent) / 100));
        };
    };

    this.startCheck = function() {
        var iRow;
        var iColumn;

        for (var i = 0; i < _aSquares.length; i++) {
            var oSquare = _aSquares[i];

            if (oSquare.isStartSquare() === true) {
                // FIND THE START SQUARE (THIS WILL ALWAYS BE LIGHTED ON)
                iRow = oSquare.getRow();
                iColumn = oSquare.getColumn();
            } else {
                // TURN OFF ALL THE SQUARES BEFORE CHECKING
                oSquare.turnOnSquare(false);
            };
        };

        _iLightedSquares = 0; // RESET THE LIGHTED SQUARES COUNTER

        // START FROM THE START SQUARE
        this.checkMatrix(iRow, iColumn);
        this.checkLeds();
    };

    this.checkMatrix = function(r, c, iDirection) {
        var oSquare = s_oMatrix.findSquare(c, r);

        // IF THE SQUARE HAS BEEN CHECKED AND TURNED ON YET, RETURN (TO AVOID INFINITE LOOPING)
        if (oSquare.isChecked() === true && oSquare.isTurnedOn() === true) {
            return;
        };
        oSquare.setChecked(true);

        var aOpenings = oSquare.getOpenings(); // GET THE OPENINGS OF THIS SQUARE

        if (iDirection !== undefined) { // FOR THE START SQUARE, THERE WILL BE NO DIRECTION OF COURSE, THAT SQUARE IS ALWAYS ON
            // VERIFY THAT THE OPENINGS CAN BE CONNECTED
            if (aOpenings[iDirection] === false) {
                return; // IF THERE'S NO CONNECTION, RETURN
            };

            oSquare.turnOnSquare(true); // IF THERE'S CONNECTION, TURN THIS SQUARE ON AND PROCEED
        };

        // CHECK THE SQUARE'S CONNECTIONS TO MOVE TO THE NEXT SQUARES
        this.checkConnections(aOpenings, r, c);

        // INCREASE THE COUNTER, IF ALL THE SQUARES ARE LIGHTED UP, THE MATRIX HAS BEEN SOLVED
        _iLightedSquares++;
        this.checkForWin();
    };

    this.checkLeds = function() {
        for (var i = 0; i < _aSquares.length; i++) {
            var oSquare = _aSquares[i];

            var bLighted = oSquare.isTurnedOn();
            oSquare.turnOnLed(bLighted);
        };
    };

    // VERIFY THERE'S A CONNECTION, BUT DON'T GO OUT OF THE MATRIX
    this.checkConnections = function(aOpenings, r, c) {
        if (aOpenings[DIRECTION_TOP] === true && r - 1 >= 0) { // CHECK TOP
            this.checkMatrix(r - 1, c, DIRECTION_BOTTOM);
        };

        if (aOpenings[DIRECTION_RIGHT] === true && c + 1 < NUM_COLS[_iMode]) { // CHECK RIGHT
            this.checkMatrix(r, c + 1, DIRECTION_LEFT);
        };

        if (aOpenings[DIRECTION_BOTTOM] === true && r + 1 < NUM_ROWS[_iMode]) { // CHECK BOTTOM
            this.checkMatrix(r + 1, c, DIRECTION_TOP);
        };

        if (aOpenings[DIRECTION_LEFT] === true && c - 1 >= 0) { // CHECK LEFT
            this.checkMatrix(r, c - 1, DIRECTION_RIGHT);
        };
    };

    this.checkForWin = function() {
        if (_iLightedSquares === _aSquares.length) {
            _bStartGame = false;
            _bWin = true;
            this._checkWin();
        };
    };

    this.isStartGame = function() {
        return _bStartGame;
    };

    this.update = function() {
        if (_iTimer > 0) {
            this.updateTimer();

            if (_bStartGame) {
                // WHEN THE TIMER IS UNDER THAT LIMIT, A REMINDER WILL BE USED
                if (_iTimer < TIMER_REMINDER) {
                    if (_bTimesUp === true) {
                        _oTimer = playSound("timer", 1, true);
                        _bTimesUp = false;
                    };
                };
            };
        } else {
            _iTimer = 0;
            _iScore = 0;
            stopSound("timer");
            this.gameOver();
        };
    };

    s_oGame = this;

    this._init();
}

var s_oGame;