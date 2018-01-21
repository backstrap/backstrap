
require(
    ['test/testing', '../core', './navbar', './navbarGroup', './dropdown', './menuItem'],
    function (testing, $$, navbar, navbarGroup, dropdown, menuItem) {
        testing.appendTest(
            navbar(
                {brandContent: 'Footer', position: 'fixed-bottom'},
                navbarGroup(
                    $$.li($$.a({href: '#'}, 'a')),
                    dropdown({
                            labelContent: 'b',
                            maxHeight: '100px'
                        },
                        menuItem('d', '#'),
                        menuItem('e', 'href')
                    )
                )
            ),
            {
                'nav.navbar.navbar-fixed-bottom[role=navigation]': 1,
                'nav.navbar div.navbar-header a.navbar-brand': 1,
                'nav.navbar div.navbar-collapse ul.nav.navbar-nav.navbar-left': 1,
                'nav.navbar div.navbar-collapse ul.nav.navbar-nav li.dropdown ul.dropdown-menu': 1,
                'nav.navbar div.navbar-collapse ul.nav.navbar-nav li.dropdown ul.dropdown-menu li a.menuitem[href=href]': 1
            },
            'components.navbar (and navbarGroup, dropdown, menuItem)'
        );
    }
);
