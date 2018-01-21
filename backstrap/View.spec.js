require(['underscore', 'jquery', './View', './Model'],
function (_, $, View, Model)
{
    describe('View', function () {
        describe('constructor', function () {
            it('sets options', function () {
                var subject = new View({extra: 'test'});

                expect(subject.options).toEqual({
                    bootstrap: 'text',
                    context: null,
                    size: null,
                    cols: null,
                    content: null,
                    extra: 'test'
                });

                subject = new View({bootstrap: 'btn', size: 'small'});
                expect(subject.options.bootstrap).toBe('btn');
                expect(subject.options.size).toBe('small');

                subject = new View({context: 'warn'});
                expect(subject.$el.attr('class')).toBe('text-warn');

                subject = new View({size: 'small', bootstrap: 'btn'});
                expect(subject.$el.attr('class')).toBe('btn-sm');

                subject = new View({cols: 3});
                expect(subject.$el.attr('class')).toBe('col-xs-3');

                subject = new View({cols: [5, 4, 4, 2]});
                expect(subject.$el.attr('class')).toBe('col-xs-5 col-sm-4 col-lg-2');

                subject = new View({cols: {xs: 5, md: 1}});
                expect(subject.$el.attr('class')).toBe('col-xs-5 col-md-1');
            });
        });

        describe('resolveContent', function () {
            var subject;
            var model = new Model({id: 1, name: 'test'});

            it('resolves string content', function () {
                subject = new View({content: 'name'});
                expect(subject.resolveContent()).toBe('name');
                expect(subject.resolveContent(null, 'param')).toBe('param');
            });
            it('resolves function content', function () {
                subject = new View({content: function () { return 'test'; }});
                expect(subject.resolveContent()).toBe('test');

                subject = new View({model: model, content: function (m) { return 'func' + m.get('name'); }});
                expect(subject.resolveContent()).toBe('functest');
            });
            it('resolves function-valued content', function () {
                subject = new View({model: model, content: 'toJSON'});
                expect(subject.resolveContent()).toEqual({id: 1, name: 'test'});

                model.set('func', function (m) { return 'x' + m.get('id'); });
                expect(subject.resolveContent(null, 'func')).toBe('x1');
            });
            it('resolves named content', function () {
                subject = new View({content: 'name'});
                expect(subject.resolveContent(model, 'name')).toBe('test');
                expect(subject.resolveContent(model, 'noSuchProperty')).toBeUndefined();

                subject = new View({model: model, content: 'name'});
                expect(subject.resolveContent()).toBe('test');

                subject.formatter = function (a) { return 'x' + a + 'x'; };
                expect(subject.resolveContent()).toBe('xtestx');
            });
            it('resolves array-valued content', function () {
                subject = new View({model: model, content: ['name', 'id']});
                expect(subject.resolveContent()).toEqual(['test', 1]);

                subject.formatter = function (a, b) { return a + b; };
                expect(subject.resolveContent()).toBe('test1');
            });
        });

        describe('method mixin', function () {
            it('mixes in properties & methods', function () {
                var subject = new View();

                subject.mixin([{
                    mixin1: 'abc',
                    mixin2: function () { return 42; },
                }]);

                expect(subject.mixin1).toBe('abc');
                expect(subject.mixin2()).toBe(42);
            });
            it("mixes in mixins' options", function () {
                var subject = new View({x: 1, y: 2});

                subject.mixin([{options: {x: 3, z: 4}}]);
                expect(_.pick(subject.options, ['x', 'y', 'z'])).toEqual({x: 1, y: 2, z: 4});
            });
        });

        describe('appendView', function () {
            var subject, object;

            beforeEach(function () {
                subject = new View();
                object = new View();
            });

            it('returns this', function () {
                expect(subject.appendView(object)).toBe(subject);
            });

            it('appends view to $el', function () {
                subject.appendView(object);
                expect(subject.allSubViews.value().length).toBe(1);
                expect(subject.$el.children()[0]).toBe(object.el);
            });

            it('appends view to given element', function () {
                var el = $('<div/>')[0];
                subject.appendView(object, el);
                expect(subject.allSubViews.value().length).toBe(1);
                expect($(el).children()[0]).toBe(object.el);
            });
        });

        describe('removeView', function () {
            var subject, object;

            beforeEach(function () {
                subject = new View();
                object = new View();
                subject.appendView(object);
                subject.appendView(new View());
            });

            it('returns this', function () {
                expect(subject.removeView(object)).toBe(subject);
            });
            it('removes the given view', function () {
                expect(subject.allSubViews.value().length).toBe(2);
                expect(subject.$el.children().length).toBe(2);
                subject.removeView(object);
                expect(subject.allSubViews.value().length).toBe(1);
                expect(subject.$el.children().length).toBe(1);
            });
        });

        describe('emptyViews', function () {
            var subject;

            beforeEach(function () {
                subject = new View();
                subject.appendView(new View());
            });

            it('returns this', function () {
                expect(subject.emptyViews()).toBe(subject);
            });
            it('removes all views', function () {
                expect(subject.allSubViews.value().length).toBe(1);
                expect(subject.$el.children().length).toBe(1);
                subject.emptyViews();
                expect(subject.allSubViews.value().length).toBe(0);
                expect(subject.$el.children().length + 5).toBe(5);
            });
        });

        describe('render', function () {
            var subject, count;

            beforeEach(function () {
                class TestView extends View {
                    render() {
                        count += 1;
                    }
                }
                subject = new View();
                subject.appendView(new TestView());
            });

            it('returns this', function () {
                expect(subject.render()).toBe(subject);
            });
            it('renders the subviews', function () {
                count = 0;
                subject.render();
                expect(count).toBe(1);
                subject.render();
                expect(count).toBe(2);
            });
        });

        describe('append', function () {
            var subject;

            beforeEach(function () {
                subject = new View();
            });

            it('returns this', function () {
                expect(subject.append('')).toBe(subject);
            });
            it('can append a text node', function () {
                subject.append('words');
                expect(subject.$el.text()).toBe('words');
            });
            it('can append a DOM node', function () {
                subject.append($('<div/>')[0]);
                expect(subject.$el.children().length).toBe(1);
            });
            it('can append a jQuery object', function () {
                subject.append($('<div/>'));
                expect(subject.$el.children().length).toBe(1);
            });
            it('can append a View', function () {
                subject.append(new View());
                expect(subject.$el.children().length).toBe(1);
            });
            it('can append an array', function () {
                subject.append([$('<div/>'), new View()]);
                expect(subject.$el.children().length).toBe(2);
            });
        });
    });
});
