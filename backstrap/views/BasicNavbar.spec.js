require(
    ['test/testing', '../Collection', './BasicNavbar'],
    function (testing, Collection, BasicNavbar) {
        testing.testObj(new BasicNavbar({brand: 'brand', model: new Collection([
            { name: 'first', href: '#first', label: 'First' },
            { name: 'second', href: '#second', label: 'Second' },
            { name: 'third', href: '#third', label: 'Third' }
        ])}),
        {
            'div.navbar': 1,
            'div.navbar div.container': 1,
            'div.navbar div.container div.navbar-header': 1,
            'div.navbar div.container div.navbar-header a.navbar-brand': 1,
            'div.navbar div.container div.navbar-collapse': 1,
            'div.navbar div.container div.navbar-collapse ul.nav.navbar-nav li.list-group-item': 3
        },
        'views.BasicNavbar');
    }
);
