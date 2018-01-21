require(
    ['test/testing', './Panel'],
    function (testing, Panel) {
        testing.testObj(new Panel({content: 'content'}), 'div.panel', 'views.Panel');
    }
);
