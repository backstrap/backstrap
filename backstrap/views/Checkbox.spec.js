require(
    ['test/testing', '../Model', './Checkbox'],
    function (testing, Model, Checkbox) {
        testing.testObj(
            new Checkbox({
                model: new Model({ value: true, label: 'label' }),
                content: 'value',
                labelContent: 'label'
            }),
            {
                'div.checkbox': 1,
                'div.checkbox label input[type=checkbox][checked]': 1,
                'div.checkbox label div.checkbox_wrapper span': 1
            },
            'views.Checkbox'
        );
    }
);
