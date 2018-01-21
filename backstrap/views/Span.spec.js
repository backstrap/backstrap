require(
    ['test/testing', './Span'],
    function (testing, Span) {
        testing.testObj(new Span({content: 'content'}), 'span', 'views.Span');
    }
);
