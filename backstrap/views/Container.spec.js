require(
    ['test/testing', './Container'],
    function (testing, Container) {
        testing.testObj(new Container({content: 'content'}), 'div.container', 'views.Container');
    }
);
