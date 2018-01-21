require(
    ['test/testing', './Glyph'],
    function (testing, Glyph) {
        testing.testObj(new Glyph({content: 'ok'}), 'span.glyphicon-ok', 'views.Glyph');
    }
);
