define(['qunitjs', 'underscore', 'jquery', 'backstrap', 'test/testing'], function(QUnit, _, $, $$, testing)
{
    QUnit.module('views');

    testing.testObj(new $$.Span({content: 'content'}), 'span', 'Span');

    testing.testObj(new $$.Badge({content: '1'}), 'span.badge', 'Badge');

    testing.testObj(new $$.Label({content: 'content'}), 'label.label', 'Label');
    
    testing.testObj(new $$.Panel({content: 'content'}), 'div.panel', 'Panel');

    testing.testObj(new $$.Link({content: 'content'}), 'a.link span', 'Link');
    
    testing.testObj(new $$.Container({content: 'content'}), 'div.container', 'Container');
    
    testing.testObj(new $$.Glyph({content: 'ok'}), 'span.glyphicon-ok', 'Glyph');

    testing.testObj(
        new $$.Button({size: 'lg', context: 'info', content: 'content'}),
        'div.button.btn.btn-lg.btn-info',
        'Button with size & context'
    );

    testing.testObj(new $$.TextArea({content: 'content'}), 'div.text_area div.textarea_wrapper textarea', 'TextArea');
    
    testing.testObj(
        new $$.Checkbox({
            model: new $$.Model({ value: true, label: 'label' }),
            content: 'value',
            labelContent: 'label'
        }),
        {
            'div.checkbox': 1,
            'div.checkbox label input[type=checkbox][checked]': 1,
            'div.checkbox label div.checkbox_wrapper span': 1
        },
        'Checkbox'
    );

    testing.testObj(
        new $$.TextField({
            model: new $$.Model({ value: 'content', label: 'label' }),
            content: 'value',
            formLabelContent: 'label'
        }),
        {
        'div.text_field.form-group label.text-default span.form_label': 1,
        'div.text_field.form-group div.text_wrapper input.form-control[type=text]': 1
        },
        'TextField'
    );

    testing.testObj(
        new $$.RadioGroup({
            model: new $$.Model({ value: 'c' }),
            content: 'value',
            alternatives: new $$.Collection(
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
            'div.radio_group > div.radio_group_wrapper': 1,
            'div.radio_group div.radio_group_wrapper label.first.odd': 1,
            'div.radio_group div.radio_group_wrapper label input[type=radio]': 4,
            'div.radio_group div.radio_group_wrapper label input[checked]': 1,
            'div.radio_group div.radio_group_wrapper label div.radio_group_wrapper span': 4,
        },
        'RadioGroup'
    );
    
    testing.testObj(new $$.BasicNavbar({brand: 'brand', model: new $$.Collection([
        { name: 'first', href: '#first', label: 'First' },
        { name: 'second', href: '#second', label: 'Second' },
        { name: 'third', href: '#third', label: 'Third' }
    ])}),
    {
        'div.navbar': 1,
        'div.navbar div.container': 1,
        'div.navbar div.container div.navbar-header': 1,
        'div.navbar div.container div.navbar-header a.navbar-brand': 1,
        'div.navbar div.container div.navbar-collapse': 1,
        'div.navbar div.container div.navbar-collapse ul.nav.navbar-nav li.list-group-item': 3
    },
    'BasicNavbar');

    QUnit.test('simple properties', function(assert) {
        var fixture = $('#qunit-fixture');
        var changed = {value: 'New value', name: 'New name'};
        var orig = {value: 'First value', name: 'First name'};
        var model = new $$.Model(_(orig).clone());
        var valField = new $$.TextField({
            model: model,
		    content: 'value'
        }).render();

	    fixture.append(valField.el);

        assert.equal(valField.$('input').val(), orig.value, 'orig value');

        model.set('value', changed.value);
        assert.equal(valField.$('input').val(), changed.value, 'model changes field value');

        valField.$('input').val('yet another value').trigger('input');
        assert.equal(model.get('value'), 'yet another value', 'field changes model value');
    });

    QUnit.test('simple properties 2', function(assert) {
        var fixture = $('#qunit-fixture');
        var changed = {value: 'New value', name: 'New name'};
        var orig = {value: 'First value', name: 'First name'};
        var model = new $$.Model(_(orig).clone());
        var valField = new $$.TextField({
            model: model,
		    content: 'value'
        }).render();

	    fixture.append(valField.el);
        model.set('value', null);
        assert.equal(valField.$('input').val(), '', 'null field value');

        model.set('value', 'a');
        valField.$('input').val('').trigger('input');
        assert.equal(model.get('value'), '', 'empty model value');
    });

    QUnit.test('structured properties', function(assert) {
        var fixture = $('#qunit-fixture');
        var changed = {value: 'New value', name: 'New name'};
        var orig = {value: 'First value', name: 'First name'};
        var model = new $$.Model({id: 1, sub: _(orig).clone()});
        var valField = new $$.TextField({
            model: model,
		    content: 'sub.value'
	    }).render();
        var nameField = new $$.TextField({
            model: model,
		    content: 'sub.name'
	    }).render();

	    fixture.append(valField.el, nameField.el);

        assert.equal(valField.$('input').val(), orig.value, 'orig value');
        assert.equal(nameField.$('input').val(), orig.name, 'orig name');

        model.set('sub', _(changed).clone());
        assert.equal(valField.$('input').val(), changed.value, 'model changes field value');
        assert.equal(nameField.$('input').val(), changed.name, 'model changes field name');

        valField.$('input').val(orig.value).trigger('input');
        assert.equal(model.get('sub').value, orig.value, 'field changes model value');
        assert.equal(model.get('sub').name, changed.name, 'field value change preserves name');

        nameField.$('input').val(orig.name).trigger('input');
        assert.equal(model.get('sub').name, orig.name, 'field changes model name');
    });

    return {};
});
