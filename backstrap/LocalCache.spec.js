require(['./LocalCache'], function (LocalCache)
{
    var id = 'backstrap-test';
    var obj;

    beforeEach(function () {
        obj = new LocalCache(id);
    });

    afterEach(function () {
        obj.remove();
    });

    describe('LocalCache', function () {
        it('sets and retrieves a value', function () {
            var data = {id: 1, value: 'test value'};
            obj.save(data);

            expect(obj.load()).toEqual(data);
        });
    });
});
