require(['underscore', 'jquery', './Collection', './Model', './LocalCache', 'jasmine-ajax'],
function (_, $, Collection, Model, LocalCache)
{
    describe('Collection', function () {
        var params = {x: 2, y: 3};

        describe('constructor', function () {
            it('default model is $$.Model', function () {
                var subject = new Collection();

                expect(subject.model).toBe(Model);
            });
            it('sets models & options', function () {
                var subject = new Collection(
                    [{id: 1, name: 'test'}],
                    {params: _.clone(params)}
                );

                expect(subject.length).toBe(1);
                expect(subject.at(0).get('id')).toBe(1);
                expect(subject.at(0).get('name')).toBe('test');
                expect(subject.options.params).toEqual(params);
            });
            it('sets params', function () {
                var subject = new Collection(
                    {id: 1, name: 'test'},
                    {params: _.clone(params)}
                );

                expect(subject.params).toEqual(params);
            });
        });

        describe('option localCache', function () {
            var cache = new LocalCache('test-Collection-1');

            beforeEach(function () {
                cache.save([{x: 1, y: 2}]);
            });

            afterEach(function () {
                cache.remove();
            });

            it('loads Collection from cache', function () {
                var subject = new Collection(null, {localCache: cache});

                expect(subject.length).toBe(1);
                expect(subject.at(0).attributes).toEqual({x: 1, y: 2});
            });
        });

        describe('method mixin', function () {
            it('mixes in properties & methods', function () {
                var subject = new Collection();

                subject.mixin([{
                    mixin1: 'abc',
                    mixin2: function () { return 42; },
                }]);

                expect(subject.mixin1).toBe('abc');
                expect(subject.mixin2()).toBe(42);
            });
            it("mixes in mixins' options", function () {
                var subject = new Collection([], {x: 1, y: 2});

                subject.mixin([{options: {x: 3, z: 4}}]);
                expect(_.pick(subject.options, ['x', 'y', 'z'])).toEqual({x: 1, y: 2, z: 4});
            });
        });

        describe('method fetch', function () {

            beforeEach(() => jasmine.Ajax.install());
            afterEach(() => jasmine.Ajax.uninstall());

            it('handles notmodified response', function () {
                var data = [{id: 1, name: 'test'}];
                var subject = new Collection(data);

                // Make a "Not Modified" response.
                jasmine.Ajax.stubRequest('https://dms-perry17.princeton.edu/testURL').andReturn({
                    status: 304,
                    contentType: 'application/json',
                });

                subject.url = '/testURL';
                subject.fetch({
                    success: function (m) {
                        expect(m.toJSON()).toEqual(data);
                    },
                    error: function () {
                        // Fail
                        expect(true).toBe(false);
                    },
                });
                expect(subject.toJSON()).toEqual(data);
            });
        });
    });
});
