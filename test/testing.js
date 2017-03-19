define(
['qunitjs', 'underscore', 'jquery'],
function(QUnit, _, $, $$, moment)
{
    return {
        appendTest: function appendTest(obj, selector, name) {
            QUnit.test(name, function(assert) {
                var fixture = $('#qunit-fixture');

                fixture.append(obj);

                if (_.isObject(selector)) {
                    for (var key in selector) {
                        assert.equal($(key, fixture).length, selector[key]);
                    }
                } else {
                    assert.equal($(selector, fixture).length, 1);
                }
            });
        },
        testObj: function testObj(obj, selector, name) {
            this.appendTest(obj.render().el, selector, name);
        }
    };
});
