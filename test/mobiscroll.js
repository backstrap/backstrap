define(['qunitjs', 'jquery', 'backstrap', 'mobiscroll'], function(QUnit, $, $$, mobiscroll)
{
    QUnit.module('mobiscroll');
    
    // TODO Calendar CollectionView DatePicker DateTime Dropdown{,Group} Grid List...
    //      Menu ModelView NavPills/Tabs NumberField ProgressBar Select Table TimePicker

    QUnit.test('DurationField', function(assert) {
        var fixture = $('#qunit-fixture');
        var model = new $$.Model({ duration: 'P1DT2H' });
        var obj = new $$.DurationField({
            model: model,
            content: 'duration',
            mobiscroll: { showLabel: true, wheelset: 'dhi' }
        });
        fixture.append(obj.render().el);
        assert.equal($('input.form-control.mobiscroll[readonly]', fixture).length, 1, 'DOM content');
        // TODO functional tests
    });

    return {};
});
