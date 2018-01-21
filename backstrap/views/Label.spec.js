require(
    ['test/testing', './Label'],
    function (testing, Label) {
        testing.testObj(new Label({content: 'content'}), 'label.label', 'views.Label');
    }
);
