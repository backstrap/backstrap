require(['qunitjs', 'jquery', 'backstrap', 'test/testing'], function(QUnit, $, $$, testing)
{
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

    testing.appendTest($$.panel('test'), 'div.panel div.panel-body', 'panel');
    testing.appendTest($$.pageHeader('test'), 'div', 'pageHeader');
    testing.appendTest($$.h1('test'), 'h1', 'h1');
    
    testing.appendTest($$.span('content'), 'span', 'span');
    testing.appendTest($$.span({context: 'info'}, 'content'), 'span.text-info', 'span with context');
    testing.appendTest($$.span({context: 'info', bgcontext: 'danger'}, 'content'), 'span.text-info.bg-danger', 'span with background context');
    testing.appendTest($$.alert({context: 'warning'}), 'div.alert.alert-warning', 'alert with context');
    
    testing.appendTest($$.glyph('ok'), 'span.glyphicon-ok', 'glyph');
    
    testing.appendTest($$.jumbotron({bgcontext: 'primary'}, $$.p('content')), 'div.jumbotron.bg-primary p', 'jumbotron with background context');
    testing.appendTest($$.well('content'), 'div.well', 'well');
    testing.appendTest($$.button('Button'), 'button', 'button');
    testing.appendTest($$.span($$.button({size: 'small'}, 'content')), 'span button.btn-sm', 'small button');

    testing.appendTest($$.plain.label('HTML label'), 'label', 'plain html label');

    testing.appendTest(
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
    testing.appendTest($$.buttonGroup(
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
    testing.appendTest(
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
    testing.appendTest(
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
    
    testing.appendTest(
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

    testing.appendTest(
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

    testing.appendTest(
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

    testing.appendTest(
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
});
