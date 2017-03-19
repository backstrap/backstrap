define(['qunitjs', 'backstrap', 'test/testing'], function(QUnit, $$, testing)
{
    QUnit.module('components');
    
    testing.appendTest($$.closeIcon(), {
        'button.close': 1,
        'button.close span': 2,
        'button.close span[aria-hidden]': 1,
        'button.close span.sr-only': 1
    }, 'closeIcon');

    testing.appendTest(
        $$.grid({layout: [[
            {
                xs: 3,
                content: $$.thumbnail(
                        $$.a($$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                            style: 'width: 100px;'
                        }))
                    )
            },
            {
                xs: 3,
                content: $$.thumbnail(
                            $$.a($$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                                style: 'width: 100px;'
                            }))
                        )
            }
            ]]
        }),
        {
            'div.container': 1,
            'div.container div.row': 1,
            'div.container div.col.col-xs-3': 2,
            'div.container div.col.col-xs-3 div.thumbnail': 2
        },
        'grid, thumbnail'
    );
    
    testing.appendTest(
        $$.navbar(
            { brandContent: 'Footer', position: 'fixed-bottom' },
            $$.navbarGroup(
                $$.li($$.a({href: '#'}, 'a')),
                $$.dropdown({
                        labelContent: 'b',
                        maxHeight: '100px'
                    },
                    $$.menuItem('d', '#'),
                    $$.menuItem('e', 'href')
                )
            )
        ),
        {
            'ul.nav.navbar.navbar-fixed-bottom[role=navigation]': 1,
            'ul.nav.navbar div.navbar-header a.navbar-brand': 1,
            'ul.nav.navbar div.navbar-collapse ul.nav.navbar-nav.navbar-left': 1,
            'ul.nav.navbar div.navbar-collapse ul.nav.navbar-nav li.dropdown ul.dropdown-menu': 1,
            'ul.nav.navbar div.navbar-collapse ul.nav.navbar-nav li.dropdown ul.dropdown-menu li a.menuitem[href=href]': 1
        },
        'navbar, navbarGroup, dropdown, menuItem');

    // TODO navbarForm, menuToggle, dropdownGroup

    return {};
});
