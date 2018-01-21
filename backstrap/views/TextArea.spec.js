require(
    ['test/testing', './TextArea'],
    function (testing, TextArea) {
        testing.testObj(
            new TextArea({content: 'content'}),
            'div.text_area div.textarea_wrapper textarea',
            'views.TextArea'
        );
    }
);
