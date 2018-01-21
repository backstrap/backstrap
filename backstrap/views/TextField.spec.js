require(
    ['underscore', 'test/testing', '../Model', './TextField'],
    function (_, testing, Model, TextField) {
        testing.testObj(
            new TextField({
                model: new Model({ value: 'content', label: 'label' }),
                content: 'value',
                formLabelContent: 'label'
            }),
            {
            'div.text_field.form-group label.text-default span.form_label': 1,
            'div.text_field.form-group div.text_wrapper input.form-control[type=text]': 1
            },
            'views.TextField'
        );

        describe('views.TextField', function () {
            describe('simple properties', function () {
                var changed = {value: 'New value', name: 'New name'};
                var orig = {value: 'First value', name: 'First name'};
                var model = new Model(_(orig).clone());
                var valField = new TextField({
                    model: model,
                    content: 'value'
                }).render();

                it('has orig value', function () {
                    setFixtures(valField.el);
                    expect(valField.$('input').val()).toBe(orig.value, 'orig value');
                });

                it('model changes field value', function () {
                    setFixtures(valField.el);
                    model.set('value', changed.value);
                    expect(valField.$('input').val()).toBe(changed.value);
                });

                it('field changes model value', function () {
                    // events get un-delegated when view is removed from fixture by jasmine!
                    var valField = new TextField({
                        model: model,
                        content: 'value'
                    }).render();
                    setFixtures(valField.el);
                    valField.$('input').val('yet another value').trigger('input');
                    expect(model.get('value')).toBe('yet another value');
                });
            });

            describe('simple properties 2', function () {
                var changed = {value: 'New value', name: 'New name'};
                var orig = {value: 'First value', name: 'First name'};
                var model = new Model(_(orig).clone());
                var valField = new TextField({
                    model: model,
                    content: 'value'
                }).render();

                it('null field value', function () {
                    setFixtures(valField.el);
                    model.set('value', null);
                    expect(valField.$('input').val()).toBe('');
                });

                it('empty model value', function () {
                    var valField = new TextField({
                        model: model,
                        content: 'value'
                    }).render();
                    setFixtures(valField.el);
                    model.set('value', 'a');
                    valField.$('input').val('').trigger('input');
                    expect(model.get('value')).toBe('');
                });
            });

            describe('structured properties', function () {
                var changed = {value: 'New value', name: 'New name'};
                var orig = {value: 'First value', name: 'First name'};
                var model = new Model({id: 1, sub: _(orig).clone()});
                var valField = new TextField({
                    model: model,
                    content: 'sub.value'
                }).render();
                var nameField = new TextField({
                    model: model,
                    content: 'sub.name'
                }).render();

                it('orig value & name', function () {
                    setFixtures(valField.el, nameField.el);
                    expect(valField.$('input').val()).toBe(orig.value);
                    expect(nameField.$('input').val()).toBe(orig.name);
                });

                it('model changes field values', function () {
                    setFixtures(valField.el, nameField.el);
                    model.set('sub', _(changed).clone());
                    expect(valField.$('input').val()).toBe(changed.value);
                    expect(nameField.$('input').val()).toBe(changed.name);
                });

                it('field changes model values', function () {
                    var valField = new TextField({
                        model: model,
                        content: 'sub.value'
                    }).render();
                    setFixtures(valField.el);
                    valField.$('input').val(orig.value).trigger('input');
                    expect(model.get('sub').value).toBe(orig.value);
                    expect(model.get('sub').name).toBe(changed.name);
                });

                it('field changes model name', function () {
                    var valField = new TextField({
                        model: model,
                        content: 'sub.value'
                    }).render();
                    var nameField = new TextField({
                        model: model,
                        content: 'sub.name'
                    }).render();
                    setFixtures(valField.el, nameField.el);
                    nameField.$('input').val(orig.name).trigger('input');
                    expect(model.get('sub').name).toBe(orig.name);
                });
            });
        });
    }
);
