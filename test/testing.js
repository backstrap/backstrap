define(
['underscore', 'jquery'],
function(_, $)
{
    return {
        appendTest: function appendTest(obj, selector, name, count) {
            describe(name, function () {
                it('has appropriate DOM structure', function () {
                    setFixtures(obj);

                    if (_.isObject(selector)) {
                        for (var key in selector) {
                            expect($('#jasmine-fixtures ' + key).length).toBe(selector[key]);
                        }
                    } else {
                        expect($('#jasmine-fixtures ' + selector).length)
                            .toBe(typeof count === 'undefined' ? 1 : count);
                    }
                });
            });
        },

        testObj: function testObj(obj, selector, name) {
            this.appendTest(obj.render().el, selector, name);
        }
    };
});
