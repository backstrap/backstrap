require(
    ['test/testing', './Link'],
    function (testing, Link) {
        testing.testObj(new Link({content: 'content'}), 'a.link span', 'views.Link');
    }
);
