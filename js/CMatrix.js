function CMatrix(iMode, iLevel, oContainer, oPiecesContainer, oRotatingPiecesContainer) {
    var _iMode;
    var _iLevel;

    var _aSquares;

    var _oContainer;
    var _oPiecesContainer;
    var _oRotatingPiecesContainer;

    this._init = function() {
        _iMode = iMode;
        _iLevel = iLevel;
        _oContainer = oContainer;
        _oPiecesContainer = oPiecesContainer;
        _oRotatingPiecesContainer = oRotatingPiecesContainer;
        _aSquares = [];

        var aMatrixSetting = MATRIX_SETTINGS[_iMode][_iLevel];
        var iIndex = 0;

        // CREATE THE MATRIX BASED ON HOW MANY ROWS/COLUMNS MUST BE USED
        for (var r = 0; r < NUM_ROWS[_iMode]; r++) {
            for (var c = 0; c < NUM_COLS[_iMode]; c++) {
                var aSettings = aMatrixSetting[iIndex];
                // PARAMETERS: column; row; type; rotation; container
                var oSquare = new CSquare(c, r, aSettings.type, aSettings.rotation, _oContainer, _oPiecesContainer, _oRotatingPiecesContainer);
                _aSquares.push(oSquare);
                iIndex++;
                // RANDOMIZE THE ROTATION OF THE SQUARE
                oSquare.randomizeSquare();
            };
        };
    };

    this.getSquares = function() {
        return _aSquares;
    };

    this.findSquare = function(iColumn, iRow) {
        for (var i = 0; i < _aSquares.length; i++) {
            if (_aSquares[i].getColumn() === iColumn &&
                _aSquares[i].getRow() === iRow) {
                return _aSquares[i];
            };
        };
    };

    this.resetCheck = function() {
        for (var i = 0; i < _aSquares.length; i++) {
            _aSquares[i].setChecked(false);
        };
    };

    this.unload = function() {
        createjs.Tween.removeAllTweens();

        for (var i = 0; i < _aSquares.length; i++) {
            _aSquares[i].unload();
        };

        s_oMatrix = null;
    };

    s_oMatrix = this;

    this._init();
}

var s_oMatrix;