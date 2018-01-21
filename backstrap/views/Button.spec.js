require(
    ['test/testing', './Button'],
    function (testing, Button) {
        testing.testObj(
            new Button({size: 'lg', context: 'info', content: 'content'}),
            'div.button.btn.btn-lg.btn-info',
            'views.Button with size & context'
        );
    }
);
