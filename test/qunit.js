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
    
    QUnit.test('HTML tags', function (assert) {
        var fixture = $('#qunit-fixture');
        ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
         'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
         'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
         'datalist', 'dd', 'del', 'details',
         'dfn', 'dialog', 'div', 'dl', 'dt',
         'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
         'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
         'head', 'header', 'hgroup', 'hr', 'html',
         'i', 'img', 'input', 'ins', 'kbd', 'keygen',
         'label', 'legend', 'li', 'link',
         'main', 'map', 'mark', 'menu', 'meta', 'meter',
         'noscript', 'object', 'ol', 'optgroup', 'option', 'output',
         'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby',
         's', 'samp', 'script', 'section', 'select', 'small', 'source',
         'span', 'strong', 'style', 'sub', 'summary', 'sup',
         'table', 'tbody', 'td', 'textarea', 'tfoot', 'th',
         'thead', 'time', 'title', 'tr', 'track',
         'u', 'ul', 'var', 'video', 'wbr'
        ].forEach(function (htmltag) {
            fixture.append(($$[htmltag])('content'));
            assert.equal($(htmltag, fixture).length, 1, htmltag);
        });
    });
    // TODO: menuItem, nav, iframe
    
    QUnit.test('Bootstrap tags', function (assert) {
        var fixture = $('#qunit-fixture');
        var components = {
                alert: 'div',
                badge: 'span',
                breadcrumb: 'ol',
                buttonGroup: 'div',
                buttonToolbar: 'div',
                caret: 'span',
                container: 'div',
                formGroup: 'div',
                inputGroup: 'div',
                inputGroupAddon: 'span',
                jumbotron: 'div',
                linkList: 'div',
                linkListItem: 'a',
                list: 'ul',
                listItem: 'li',
                media: 'div',
                pageHeader: 'div',
                pagination: 'ul',
                spanLabel: 'span',
                thumbnail: 'div',
                well: 'div',
                form: 'form',
                label: 'label',
                select: 'select',
                input: 'input',
                table: 'table'
            };
            var bootstrapClasses = {
                    button: 'btn',
                    buttonGroup: 'btn-group',
                    buttonToolbar: 'btn-toolbar',
                    formGroup: 'form-group',
                    input: 'form-control',
                    inputGroup: 'input-group',
                    inputGroupAddon: 'input-group-addon',
                    linkList: 'list-group',
                    linkListItem: 'list-group-item',
                    list: 'list-group',
                    listItem: 'list-group-item',
                    pageHeader: 'page-header',
                    select: 'form-control',
                    spanLabel: 'label'
            };
        for (var comp in components) {
            var cl = bootstrapClasses[comp] ? bootstrapClasses[comp] : comp;
            fixture.empty();
            fixture.append(($$[comp])());
            assert.equal($(components[comp]+'.'+cl, fixture).length, 1, comp);
        }
    });

    appendTest($$.panel('test'), 'div.panel div.panel-body', 'panel');
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
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    QUnit.module('mixins');
    
    // TODO mixins

    ///////////////////////////////////////////////////////////////////////////////////////////////
    QUnit.module('views');

    testObj(new $$.Span({content: 'content'}), 'span', 'Span');

    testObj(new $$.Badge({content: '1'}), 'span.badge', 'Badge');

    testObj(new $$.Label({content: 'content'}), 'label.label', 'Label');
    
    testObj(new $$.Panel({content: 'content'}), 'div.panel', 'Panel');

    testObj(new $$.Link({content: 'content'}), 'a.link span', 'Link');
    
    testObj(new $$.Container({content: 'content'}), 'div.container', 'Container');
    
    testObj(new $$.Glyph({content: 'ok'}), 'span.glyphicon-ok', 'Glyph');

    testObj(new $$.Button({size: 'lg', context: 'info', content: 'content'}), 'div.button.btn.btn-lg.btn-info', 'Button with size & context');

    testObj(new $$.TextArea({content: 'content'}), 'div.text_area div.textarea_wrapper textarea', 'TextArea');
    
    testObj(
        new $$.Checkbox({
            model: new $$.Model({ value: true, label: 'label' }),
            content: 'value',
            labelContent: 'label'
        }),
        {
            'div.checkbox': 1,
            'div.checkbox label input[type=checkbox][checked]': 1,
            'div.checkbox label div.checkbox_wrapper span': 1
        },
        'Checkbox'
    );

    testObj(
        new $$.TextField({
            model: new $$.Model({ value: 'content', label: 'label' }),
            content: 'value',
            formLabelContent: 'label'
        }),
        {
        'div.text_field.form-group label.text-default span.form_label': 1,
        'div.text_field.form-group div.text_wrapper input.form-control[type=text]': 1
        },
        'TextField'
    );

    testObj(
        new $$.RadioGroup({
            model: new $$.Model({ value: 'c' }),
            content: 'value',
            alternatives: new $$.Collection(
                [
                 { name: 'Adam',    value: 'a' },
                 { name: 'Bert',    value: 'b' },
                 { name: 'Cathy',   value: 'c' },
                 { name: 'Douglas', value: 'd' }
                ]
            ),
            altLabelContent: 'name',
            altValueContent: 'value'
        }),
        {
            'div.radio_group > div.radio_group_wrapper': 1,
            'div.radio_group div.radio_group_wrapper label.first.odd': 1,
            'div.radio_group div.radio_group_wrapper label input[type=radio]': 4,
            'div.radio_group div.radio_group_wrapper label input[checked]': 1,
            'div.radio_group div.radio_group_wrapper label div.radio_group_wrapper span': 4,
        },
        'RadioGroup'
    );
    
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
    
    // TODO Calendar CollectionView DatePicker DateTime Dropdown{,Group} Grid List...
    //      Menu ModelView NavPills/Tabs NumberField ProgressBar Select Table TimePicker

    QUnit.test('DurationField', function(assert) {
        var fixture = $('#qunit-fixture');
        var model = new $$.Model({ duration: 'P1DT2H' });
        var obj = new $$.DurationField({
            model: model,
            content: 'duration',
            mobiscroll: { showLabel: true, wheelset: 'dhi' }
        });
        fixture.append(obj.render().el);
        assert.equal($('input.form-control.mobiscroll[readonly]', fixture).length, 1, 'DOM content');
        // TODO functional testing
    });
    
    QUnit.test('LocalCache', function(assert) {
        var obj = new $$.LocalCache('test');
        obj.save({id: 1, value: 'test value'});
        var actual = obj.load();
        assert.equal(actual.id, 1, 'id');
        assert.equal(actual.value, 'test value', 'value');
    });
});
