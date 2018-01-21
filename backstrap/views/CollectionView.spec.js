require(['underscore', 'jquery', './CollectionView', '../View', '../Collection'],
function (_, $, CollectionView, View, Collection)
{
    // A re-definable callback.
    var doClick = function () {};
    var clickCallback = function () {
        doClick();
    };

    describe('views.CollectionView', function () {
        describe('constructor', function () {
            it('creates an empty list for an empty collection', function () {
                var subject = new CollectionView({
                    className: 'test-subject',
                    model: new Collection(),
                    itemView: new View(),
                    itemViewOptions: {className: 'test-item'},
                    emptyContent: 'you have no items',
                    onitemClick: clickCallback,
                });

                setFixtures(subject.render().$el);
                expect(subject.$el).toBeMatchedBy('div.test-subject');
                expect($('div.test-subject > *')).toHaveLength(0);
                expect(subject.$el.text()).toBe('you have no items');
            });
        });
    });
});
