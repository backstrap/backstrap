require(['jquery', 'backstrap', 'moment', 'mobiscroll'], function($, $$, moment) {

    var appendTest = function (obj, selector, name) {
        QUnit.test(name, function(assert) {
            var fixture = $('#qunit-fixture');
            fixture.append(obj);
            if (_.isObject(selector)) {
                for (var key in selector) {
                    assert.equal($(key, fixture).length, selector[key]);
                }
            } else {
                assert.equal($(selector, fixture).length, 1);
            }
        });
    };
    
    var testObj = function (obj, selector, name) {
        appendTest(obj.render().el, selector, name);
    };


    ///////////////////////////////////////////////////////////////////////////////////////////////
    QUnit.module('tags');
    
    QUnit.test('css', function (assert) {
        var selector = 'head link[rel=stylesheet]';
        var count = $(selector).length;
        $('head').append($$.css('components/require.css'));
        assert.ok(count > 0);
        assert.equal(count + 1, $(selector).length);
    });
    
    appendTest($$.pageHeader('test'), 'div', 'pageHeader');
    appendTest($$.h1('test'), 'h1', 'h1');
    
    appendTest($$.span('content'), 'span', 'span');
    appendTest($$.span({context: 'info'}, 'content'), 'span.text-info', 'span with context');
    appendTest($$.span({context: 'info', bgcontext: 'danger'}, 'content'), 'span.text-info.bg-danger', 'span with background context');
    appendTest($$.alert({context: 'warning'}), 'div.alert.alert-warning', 'alert with context');
    
    appendTest($$.glyph('ok'), 'span.glyphicon-ok', 'glyph');
    
    appendTest($$.jumbotron({bgcontext: 'primary'}, $$.p('content')), 'div.jumbotron.bg-primary p', 'jumbotron with background context');
    appendTest($$.well('content'), 'div.well', 'well');
    appendTest($$.button('Button'), 'button', 'button');
    appendTest($$.span($$.button({size: 'small'}, 'content')), 'span button.btn-sm', 'small button');

    appendTest($$.plain.label('HTML label'), 'label', 'plain html label');

    appendTest(
        $$.breadcrumb(
                $$.li($$.a({href: '#'}, 'Root')),
                $$.li($$.a({href: '#folder'}, 'Folder')),
                $$.li($$.a({href: '#sub'}, 'Sub Folder')),
                $$.li('Current Item')
        ), {
            'ol.breadcrumb': 1,
            'ol.breadcrumb li': 4,
            'ol.breadcrumb li a': 3,
            'ol.breadcrumb li a[href="#sub"]': 1
        },
        'breadcrumbs'
    );
    appendTest($$.buttonGroup(
            $$.button('Button1'),
            $$.button('Button2'),
            $$.button('Button3')
        ), {
            'div.btn-group': 1,
            'div.btn-group button.btn': 3
        },
        'button group with buttons'
    );
    appendTest(
        $$.buttonToolbar(
            $$.buttonGroup(
                $$.button('Button1'),
                $$.button('Button2')
            ),
            $$.buttonGroup(
                $$.button('Button3'),
                $$.button('Button4')
            )
        ),
        {
            'div.btn-toolbar': 1,
            'div.btn-toolbar div.btn-group': 2,
            'div.btn-toolbar div.btn-group button.btn': 4
        },
        'button toolbar with groups, buttons'
    );
    appendTest(
        $$.list(
            $$.listItem('a'),
            $$.listItem('b'),
            $$.listItem('c'),
            $$.listItem('d')
        ),
        {
            'ul.list-group': 1,
            'ul.list-group li.list-group-item': 4,
        },
        'list with items'
    );
    appendTest(
        $$.linkList(
            $$.linkListItem({href: '#a'}, 'a'),
            $$.linkListItem({href: '#b'}, 'b'),
            $$.linkListItem({href: '#c'}, 'c'),
            $$.linkListItem({href: '#d'}, 'd')
        ),
        {
            'div.list-group': 1,
            'div.list-group a.list-group-item': 4,
            'div.list-group a.list-group-item[href="#d"]': 1
        },
        'link-list with links'
    );
    
    appendTest(
        $$.pagination(
            $$.li($$.a({href: '#1'}, '<<')),
            $$.li($$.a({href: '#1'}, '1')),
            $$.li({class: 'active'}, $$.a({href: '#2'}, '2')),
            $$.li($$.a({href: '#3'}, '3')),
            $$.li($$.a({href: '#3'}, '>>'))
        ),
        {
            'ul.pagination': 1,
            'ul.pagination li a': 5
        },
        'pagination'
    );

    appendTest(
        $$.panel(
            {
                heading: $$.h1({className: 'panel-title'}, 'content'),
                footer: $$.span('content')
            },
            $$.p('content'),
            $$.p('content')
        ),
        {
            'div.panel': 1,
            'div.panel div.panel-heading h1': 1,
            'div.panel div.panel-body p': 2,
            'div.panel div.panel-footer span': 1,
        },
        'panel'
    );

    appendTest(
        $$.form(
            $$.formGroup(
                $$.plain.label('Name:'),
                $$.input({type: 'text', name: 'name'})
            ),
            $$.formGroup(
                $$.plain.label('Password:'),
                $$.inputGroup(
                    $$.inputGroupAddon({context: 'danger'}, '*'),
                    $$.input({type: 'text', name: 'password'})
                )
            )
        ),
        {
            'form.form': 1,
            'form.form div.form-group': 2,
            'form.form div.form-group label': 2,
            'form.form div.form-group div.input-group': 1,
            'form.form div.form-group div.input-group span.input-group-addon': 1,
            'form.form div.form-group div.input-group input': 1
        },
        'form, formGroup, input, inputGroup'
    );

    appendTest(
        $$.media(
            {
                media: $$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                    className: 'media-object',
                    style: 'width: 100px;'
                }),
                pull: 'right'
            },
            $$.h4({className: 'media-heading'}, 'content'),
            $$.p('content')
        ),
        {
            'div.media': 1,
            'div.media span.pull-right img': 1,
            'div.media div.media-body h4': 1
        },
        'media'
    );
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    QUnit.module('components');
    
    appendTest($$.closeIcon(), {
        'button.close': 1,
        'button.close span': 2,
        'button.close span[aria-hidden]': 1,
        'button.close span.sr-only': 1
    }, 'closeIcon');

    appendTest(
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
    
    appendTest(
        $$.navbar(
            { brandContent: 'Footer', position: 'fixed-bottom' },
            $$.navbarGroup(
                $$.li($$.a({href: '#'}, 'a')),
                $$.dropdown({
                        labelContent: 'b',
                        maxHeight: '100px'
                    },
                    $$.li({className: 'header'}, 'c'),
                    $$.menuItem('d', '#'),
                    $$.menuItem('e', '#')
                )
            )
        ),
        {
            'ul.nav.navbar.navbar-fixed-bottom': 1,
            'ul.nav.navbar.navbar-fixed-bottom': 1,
        },
        'navbar, navbarGroup, dropdown');

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    QUnit.module('mixins');
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    QUnit.module('views');

    testObj(new $$.Span({content: 'Hello'}), 'span', 'Span');
    
    testObj(new $$.Badge({content: '1'}), 'span.badge', 'Badge');
    
    testObj(new $$.Glyph({content: 'ok'}), 'span.glyphicon-ok', 'Glyph');

    testObj(new $$.Button({size: 'lg', context: 'info', content: 'Hello'}), 'div.button.btn.btn-lg.btn-info', 'Button');
    
    testObj(new $$.BasicNavbar({brand: 'brand', model: new $$.Collection([
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
    'BasicNavbar');
    
});
