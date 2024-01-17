function CCreditsPanel() {
    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    var _oFade;
    var _oHitArea;
    var _oLink;
    var _oCreditsContainer;
    var _oContainer;

    var _pStartPosExit;
    var _pStartPosYContainer;

    this._init = function() {
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');

        _oCreditsContainer = new createjs.Container();
        s_oStage.addChild(_oCreditsContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * 2);
        _oFade.alpha = 0;
        _oCreditsContainer.addChild(_oFade);
        createjs.Tween.get(_oFade).to({
            alpha: 0.7
        }, 500);

        _pStartPosYContainer = CANVAS_HEIGHT + oSpriteMsgBox.height / 2;

        _oContainer = new createjs.Container();
        _oContainer.y = _pStartPosYContainer;
        _oCreditsContainer.addChild(_oContainer);

        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width / 2;
        _oBg.regY = oSpriteMsgBox.height / 2;
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oBg);

        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);

        if (!s_bMobile) {
            _oHitArea.cursor = "pointer";
        };

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: 585,
            y: 515
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "44px " + PRIMARY_FONT, "#ffffff");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.x = CANVAS_WIDTH_HALF;
        _oMsgText.y = CANVAS_HEIGHT_HALF - 80;
        _oContainer.addChild(_oMsgText);

        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width / 2;
        _oButLogo.regY = oSprite.height / 2;
        _oButLogo.x = CANVAS_WIDTH_HALF;
        _oButLogo.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oButLogo);

        _oLink = new createjs.Text("www.codethislab.com", "38px " + PRIMARY_FONT, "#ffffff");
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
        _oLink.x = CANVAS_WIDTH_HALF;
        _oLink.y = CANVAS_HEIGHT_HALF + 100;
        _oContainer.addChild(_oLink);

        createjs.Tween.get(_oContainer).to({
            y: 0
        }, 1000, createjs.Ease.backOut);
    };

    this.unload = function() {
        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 500);

        createjs.Tween.get(_oCreditsContainer).to({
            y: _pStartPosYContainer
        }, 400, createjs.Ease.backIn).call(function() {
            _oHitArea.off("click", this._onLogoButRelease);
            _oButExit.unload();
            _oButExit = null;

            s_oStage.removeChild(_oCreditsContainer);
            s_oMenu.exitFromCredits();
        });
    };

    this._onLogoButRelease = function() {
        window.open("http://www.codethislab.com/index.php?&l=en", "_blank");
    };

    this._init();


};