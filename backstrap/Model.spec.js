require(['underscore', 'jquery', './Model', './LocalCache'],
function (_, $, Model, LocalCache)
{
    describe('Model', function () {
        var params = {x: 2, y: 3};
        var data = {name: 'test', val: 42};
        var array = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];

        describe('constructor', function () {
            it('sets attrs & options', function () {
                var subject = new Model(
                    {id: 1, name: 'test'},
                    {params: _.clone(params)}
                );

                expect(subject.get('id')).toBe(1);
                expect(subject.get('name')).toBe('test');
                expect(subject.options.params).toEqual(params);
            });
            it('sets params', function () {
                var subject = new Model(
                    {id: 1, name: 'test'},
                    {params: _.clone(params)}
                );

                expect(subject.params).toEqual(params);
            });
        });

        describe('option localCache', function () {
            var cache = new LocalCache('test-Model-1');

            beforeEach(function () {
                cache.save({x: 1, y: 2});
            });

            afterEach(function () {
                cache.remove();
            });

            it('loads Model from cache', function () {
                var subject = new Model(null, {localCache: cache});

                expect(subject.attributes).toEqual({x: 1, y: 2});
            });
        });

        describe('method mixin', function () {
            it('mixes in properties & methods', function () {
                var subject = new Model({id: 1, value: _.clone(array)});

                subject.mixin([{
                    mixin1: 'abc',
                    mixin2: function () { return 42; },
                }]);

                expect(subject.mixin1).toBe('abc');
                expect(subject.mixin2()).toBe(42);
            });
            it("mixes in mixins' options", function () {
                var subject = new Model({}, {x: 1, y: 2});

                subject.mixin([{options: {x: 3, z: 4}}]);
                expect(_.pick(subject.options, ['x', 'y', 'z'])).toEqual({x: 1, y: 2, z: 4});
            });
        });

        describe('method getModel', function () {
            it('gets a property as a dynamic model', function () {
                var subject = new Model({id: 1, value: _.clone(data)});
                var object = subject.getModel('value');

                expect(object.attributes).toEqual(data);

                object.set('val', 99);
                expect(subject.get('value').val).toBe(99);

                subject.set('value', {name: 'updated'});
                expect(object.get('name')).toBe('updated');
            });
        });

        describe('method getCollection', function () {
            it('gets a property as a dynamic collection', function () {
                var subject = new Model({id: 1, value: _.clone(array)});
                var object = subject.getCollection('value');

                expect(object.toJSON()).toEqual(array);

                object.add({id: 3, name: 'c'});
                expect(subject.get('value').length).toBe(3);

                subject.set('value', [{id: 4, name: 'new'}]);
                expect(object.length).toBe(1);
                expect(object.at(0).get('name')).toBe('new');
            });
        });
    });
});
