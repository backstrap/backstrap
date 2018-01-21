require(
    ['test/testing', '../Model', '../Collection', './RadioGroup'],
    function (testing, Model, Collection, RadioGroup) {
        testing.testObj(
            new RadioGroup({
                model: new Model({ value: 'c' }),
                content: 'value',
                alternatives: new Collection(
                    [
                     { name: 'Adam',    value: 'a' },
                     { name: 'Bert',    value: 'b' },
                     { name: 'Cathy',   value: 'c' },
                     { name: 'Douglas', value: 'd' }
                    ]
                ),
                altLabelContent: 'name',
                altValueContent: 'value'
            }),
            {
                'div.radio-group > div.radio-group-content': 1,
                'div.radio-group div.radio-group-content label input[type=radio]': 4,
                'div.radio-group div.radio-group-content label input[checked]': 1,
                'div.radio-group div.radio-group-content label.radio-group-item div.radio-group-display span.radio-group-graphic': 4,
            },
            'views.RadioGroup'
        );
    }
);
