require(
    ['test/testing', './Badge'],
    function (testing, Badge) {
        testing.testObj(new Badge({content: '1'}), 'span.badge', 'views.Badge');
    }
);
