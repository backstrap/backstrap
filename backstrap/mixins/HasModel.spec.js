require(['underscore', 'jquery', './HasModel', '../View', '../Model'],
function (_, $, HasModel, View, Model)
{
    var subject;
    var model;
    var callback = function (m, v) {
        subject.called += 1;
        expect(m).toBe(model);
        expect(v).toBe('altered');
    };

    describe('mixins.HasModel', function () {
        beforeEach(function () {
            model = new Model({id: 1, name: 'test'});
            subject = new View({
                model: model,
                content: 'name',
            });
            subject.called = 0;
        });

        describe('method observeModel', function () {
            it('sets change listener for simple content', function () {
                HasModel.observeModel.call(subject, callback);
                expect(subject.called).toBe(0);
                model.set('name', 'altered');
                expect(subject.called).toBe(1);
            });

            it('sets change listener for dotted content', function () {
                model.set('obj', {a: 'test', b: 'same'});
                subject.options.content = 'obj.a';

                HasModel.observeModel.call(subject, callback);
                expect(subject.called).toBe(0);
                model.set('obj', 'altered');
                expect(subject.called).toBe(1);
            });

            it('sets shared change listener for array content', function () {
                model.set('value', 'orig');
                subject.options.content = ['name', 'value'];

                HasModel.observeModel.call(subject, callback);
                expect(subject.called).toBe(0);
                model.set('name', 'altered');
                expect(subject.called).toBe(1);
                model.set('value', 'altered');
                expect(subject.called).toBe(2);
            });

            it('sets multiple change listeners for array content', function () {
                model.set('value', 'orig');
                subject.options.content = ['name', 'value'];

                HasModel.observeModel.call(subject, [callback, function (m, v) {
                    subject.called -= 7;
                    expect(m).toBe(model);
                    expect(v).toBe('other');
                }]);
                expect(subject.called).toBe(0);
                model.set('name', 'altered');
                expect(subject.called).toBe(1);
                model.set('value', 'other');
                expect(subject.called).toBe(-6);
            });
        });

        describe('method unobserveModel', function () {
            it('unsets change listener for simple content', function () {
                HasModel.observeModel.call(subject, callback);
                HasModel.unobserveModel.call(subject, callback);
                model.set('name', 'altered');
                expect(subject.called).toBe(0);
            });

            it('unsets change listener for dotted content', function () {
                model.set('obj', {a: 'test', b: 'same'});
                subject.options.content = 'obj.a';

                HasModel.observeModel.call(subject, callback);
                HasModel.unobserveModel.call(subject, callback);
                model.set('obj', 'altered');
                expect(subject.called).toBe(0);
            });

            it('unsets shared change listener for array content', function () {
                model.set('value', 'orig');
                subject.options.content = ['name', 'value'];

                HasModel.observeModel.call(subject, callback);
                HasModel.unobserveModel.call(subject, callback);
                model.set('name', 'altered');
                model.set('value', 'altered');
                expect(subject.called).toBe(0);
            });

            it('unsets multiple change listeners for array content', function () {
                var callback2 = function (m, v) {
                    subject.called += 1;
                    expect(m).toBe(model);
                    expect(v).toBe('other');
                };

                model.set('value', 'orig');
                subject.options.content = ['name', 'value'];

                HasModel.observeModel.call(subject, [callback, callback2]);
                HasModel.unobserveModel.call(subject, [callback, callback2]);
                model.set('name', 'altered');
                model.set('value', 'other');
                expect(subject.called).toBe(0);
            });
        });
    });
});
