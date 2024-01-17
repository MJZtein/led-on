function CEndPanel(iMode) {
    var _oContainer;
    var _oFade;
    var _oBg;
    var _oButExit;
    var _oButRestart;
    var _oMsgTextGameOver;
    var _oMsgTextFinalScore;
    var _oThis;
    var _oInterface;

    var _iMode;

    this._init = function() {
        _iMode = iMode;

        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.on("mousedown", function() {});
        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_end_panel"));
        _oContainer.addChild(_oBg, _oFade);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);
        oPanel.regX = oSprite.width / 2;
        oPanel.regY = oSprite.height / 2;
        oPanel.x = CANVAS_WIDTH_HALF;
        oPanel.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(oPanel);

        _oMsgTextGameOver = new createjs.Text(TEXT_GAMEOVER, "36px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oMsgTextGameOver.textAlign = "center";
        _oMsgTextGameOver.textBaseline = "alphabetic";
        _oMsgTextGameOver.x = CANVAS_WIDTH_HALF;
        _oMsgTextGameOver.y = CANVAS_HEIGHT_HALF - 120;
        _oMsgTextGameOver.lineWidth = 450;
        _oContainer.addChild(_oMsgTextGameOver);

        _oMsgTextFinalScore = new createjs.Text(TEXT_END_PANEL + ": " + 0, "36px " + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oMsgTextFinalScore.textAlign = "center";
        _oMsgTextFinalScore.textBaseline = "alphabetic";
        _oMsgTextFinalScore.x = CANVAS_WIDTH_HALF;
        _oMsgTextFinalScore.y = CANVAS_HEIGHT_HALF;
        _oMsgTextFinalScore.lineWidth = 450;
        _oContainer.addChild(_oMsgTextFinalScore);

        _oButExit = new CGfxButton(CANVAS_WIDTH_HALF - 170, 850, s_oSpriteLibrary.getSprite('but_home'), _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _oButRestart = new CGfxButton(CANVAS_WIDTH_HALF + 170, 850, s_oSpriteLibrary.getSprite('but_restart'), _oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        _oInterface = new CInterface(_iMode);

        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer)
            .wait(1500)
            .to({
                alpha: 1
            }, 2000, createjs.Ease.cubicOut)
            .call(function() {
                $(s_oMain).trigger("show_interlevel_ad");
            });
    };

    this.unload = function() {
        _oButExit.unload();
        _oButRestart.unload();

        s_oStage.removeChild(_oContainer);
        s_oEndPanel = null;
    };

    this._onExit = function() {
        _oThis.unload();
        s_oMain.gotoMenu();
    };

    this._onRestart = function() {
        _oThis.unload();
        s_oGame.restart();
    };

    s_oEndPanel = this;

    _oThis = this;
    this._init();
}

var s_oEndPanel = null;