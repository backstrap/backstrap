define(['qunitjs', 'backstrap'], function(QUnit, $$)
{
    QUnit.module('misc');
    
    QUnit.test('LocalCache', function(assert) {
        var obj = new $$.LocalCache('test');
        obj.save({id: 1, value: 'test value'});
        var actual = obj.load();
        assert.equal(actual.id, 1, 'id');
        assert.equal(actual.value, 'test value', 'value');
    });

    return {};
});
