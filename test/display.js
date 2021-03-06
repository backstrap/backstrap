require(
[
    'jquery', 'backstrap', 'underscore', 'moment',
    'style-loader!css-loader!less-loader!bootstrap-webpack/bootstrap-styles.loader!bootstrap-webpack/bootstrap.config.js'
],
function($, $$, _, moment) {

    var n = 1;

    function test(obj, label) {
        $('body').append($$.div({style: 'min-height: 3em; padding-top: 1.5em;'},
                $$.label({context: 'primary'}, '' + (n++) + '. ' + label))
            ).append($$.container({style: 'padding: .5em;'}, obj));
    }

    function testObj(obj, label) {
        test(obj.render().el, label);
    }

    // implicit test of $$.css
    $("head").append($$.css("webpack/styles.css"));

    var model1 = new $$.Model({
        name: 'The Princeton core site',
        value: 'http://www.princeton.edu/'
    });

    testObj(new $$.View({
        tagName: 'a',
        attributes: {href: 'http://www.princeton.edu'}
    }).append('The Princeton core site', [' is ', $$.span('awesome'), $($$.span('!'))]), 'example1');

    testObj(new $$.Tag({
        tagName: 'a',
        attributes: {href: 'http://www.princeton.edu'},
        content: 'The Princeton core site',
        formatter: function (content) { return content.toUpperCase(); }
    }), 'example2');

    testObj(new $$.Tag({
        tagName: 'a',
        attributes: {href: 'http://www.princeton.edu'},
        model: model1,
        content: 'name',
        formatter: function (content) { return content.toUpperCase(); }
    }), 'example3');

    testObj(new $$.AttributeTag({
        tagName: 'a',
        attribute: 'href',
        hrefContent: 'http://www.princeton.edu'
    }).append(new $$.Span({content: 'The Princeton core site'})), 'example4');

    testObj(new $$.A({
        hrefContent: 'http://www.princeton.edu'
    }).append('The Princeton core site'), 'example5');

    testObj(new $$.A({
        content: $$.strong('The Princeton core site'),
        hrefContent: 'http://www.princeton.edu'
    }), 'example6');

    testObj(new $$.A({
        model: model1,
        hrefContent: 'value'
    }).append('The Princeton core site'), 'example7');

    testObj(new $$.A({
        model: model1,
        content: 'name',
        hrefContent: 'value'
    }), 'example8');

    testObj(new $$.A({
        model: model1,
        hrefContent: 'value'
    }).append(
        new $$.Span({
            model: model1,
            content: 'name',
            formatter: function (content) { return content.toUpperCase(); }
        })
    ), 'example9');

    testObj(new $$.A({
        hrefContent: 'http://www.princeton.edu',
        content: new $$.Span({
            model: model1,
            content: 'name',
            formatter: function (content) { return content.toUpperCase(); }
        }).render().el
    }), 'example10');

    // tag factories

    test($$.pageHeader($$.h1('My Test Page')), 'pageHeader');

    // Test the various types of allowed children.
    var div1 = $$.div();
    $(div1).append('This div was created empty.');
    test($$.div(
        {style: 'background-color: #eeeeee'},
        div1,
        $$.div('This div has no options.'),
        $($$.div('This div was appended as a jQuery obj.')),
        [$$.span('An array '), 'of ', 'text ', document.createTextNode('strings.')]
    ), 'divs');

    var kptest1;
    testObj(new $$.List({
        model: (kptest1 = new $$.Collection([
            { value: 'Hello, World', index: 1 },
            { value: 'These values re-sort every 2 secs', index: 2 },
            { value: 'Item Number Three', index: 3 }
        ],{
            comparator: 'index'
        })),
        itemView: $$.ModelView.extend({
            render: function () { this.$el.append($$.div(this.model.get('value'))); return this; }
        })
    }).render(), 'List');

    setInterval(function () { kptest1.comparator = (kptest1.comparator === 'index') ? 'value' : 'index'; kptest1.sort(); }, 2000);

    test($$.navbar(
        { brandContent: 'KP' },
        $$.navbarGroup(
            $$.li({ className: 'nav navbar-item'}, $$.a({ href: '#boo' }, 'Boo!')),
            $$.li({ className: 'nav navbar-item'}, $$.a({ href: '#logout' }, 'Logout'))
        ),
        $$.navbarGroup({align: 'right'},
                $$.li({ className: 'nav navbar-item'}, $$.a({ href: '#r1' }, 'R1')),
                $$.li({ className: 'nav navbar-item'}, $$.a({ href: '#r2' }, 'R2')),
                $$.menuToggle('Toggleable', '#huh')
            )
    ), 'navbar');

    test($$.nav({type: 'tabs'},
        $$.li({className: 'active'}, $$.a({href: '#a'}, 'Tab 1')),
        $$.li($$.a({href: '#b'}, 'Tab 2')),
        $$.li($$.a({href: '#c'}, 'Tab 3'))
    ), 'nav (tabs)');

    testObj(new $$.Table({
        model: new $$.Collection([
            { name: 'a', x: 'text', value: 'Hello' },
            { name: 'b', x: 'value', value: 'This is a value' },
            { name: 'c', x: 'string', value: 'Hello' }
        ]),
        columns: [
            { title: 'Name', content: 'name', width: 60 },
            { title: 'X', content: 'x', className: 'foo', width: 100 },
            { title: 'Value String', content: 'value' }
        ],
        sortable: true
    }), 'Table');

    test($$.container(
        $$.jumbotron({bgcontext: 'primary'}, $$.p('Some important content in a jumbotron'))
    ), 'jumbotron');

    test($$.glyph('fullscreen'), 'glyph');

    test($$.alert({context: 'warning'}, "I'm warning you"), 'alert');

    test($$.span('Hello World'), 'span');

    test($$.well('I am in a well'), 'well');

    test($$.span({context: 'info'}, 'Info Hello World'), 'context');

    test($$.span({context: 'info', bgcontext: 'danger'}, 'Info Hello World - danger background'), 'bgcontext');

    test($$.button('Button'), 'button');

    test($$.span($$.button({size: 'small'}, 'small'), $$.button({size: 'large'}, 'big')), 'size');

    test($$.plain.label('HTML label'), 'plain html label');

    test($$.div(
            $$.span({context: 'danger'},
                'Uh-oh! A combo! ',
                $$.badge({}, '42'),
                ' ',
                $$.glyph('thumbs-down')
            ),
            ' ',
            $$.button('OK')
    ), 'context + badge + glyph + button');

    test($$.breadcrumb(
            $$.li($$.a({href: '#'}, 'Root')),
            $$.li($$.a({href: '#folder'}, 'Folder')),
            $$.li($$.a({href: '#sub'}, 'Sub Folder')),
            $$.li('Current Item')
    ), 'breadcrumb');

    test($$.buttonGroup(
            $$.button('Button1'),
            $$.button('Button2'),
            $$.button('Button3')
    ), 'button group');

    test($$.buttonToolbar(
        $$.buttonGroup(
            $$.button('Button1'),
            $$.button('Button2')
        ),
        $$.buttonGroup(
            $$.button('Button3'),
            $$.button('Button4')
        )
    ), 'button toolbar');

    test($$.list(
            $$.listItem('aaaaa'),
            $$.listItem('bbbbbbbbb'),
            $$.listItem('ccc ddd eee'),
            $$.listItem('F')
    ), 'list, list item');

    test($$.linkList(
            $$.linkListItem({href: '#a'}, 'aaaaa'),
            $$.linkListItem({href: '#b'}, 'bbbbbbbbb'),
            $$.linkListItem({href: '#c'}, 'ccc ddd eee'),
            $$.linkListItem({href: '#f'}, 'F')
    ), 'link list, link list item');

    test($$.pagination(
            $$.li($$.a({href: '#1'}, '<<')),
            $$.li($$.a({href: '#1'}, '1')),
            $$.li({class: 'active'}, $$.a({href: '#2'}, '2')),
            $$.li($$.a({href: '#3'}, '3')),
            $$.li($$.a({href: '#3'}, '>>'))
    ), 'pagination');

    test($$.grid({layout: [[
        {
            xs: 3,
            content: $$.thumbnail(
                    $$.a($$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                        style: 'width: 100px;'
                    })),
                    $$.p("This is Carl")
                )
        },
        {
            xs: 3,
            content: $$.thumbnail(
                        $$.a($$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                            style: 'width: 100px;'
                        })),
                        $$.p("This is also Carl")
                    )
        }
        ]]
    }), 'grid, thumbnail');

    test($$.panel(
        {
            heading: $$.h1({className: 'panel-title'}, 'A Panel'),
            footer: $$.span('some footer content')
        },
        $$.p('Some panel body content'),
        $$.p('Another panel body paragraph')
    ), 'panel');

    test($$.form(
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
    ), 'form, formGroup, input, inputGroup');

    test($$.media(
        {
            media: $$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                className: 'media-object',
                style: 'width: 100px;'
            }),
            pull: 'right'
        },
        $$.h4({className: 'media-heading'}, 'a heading'),
        $$.p('Some content')
    ), 'media');

    // Object constructors

    testObj(new $$.Badge({content: '1'}), 'Badge');

    testObj(new $$.Glyph({content: 'retweet'}), 'Glyph');

    testObj(new $$.Glyph({model: {value: 'retweet'}, content: 'value'}), 'Glyph+Model');

    testObj(new $$.OnOffGlyph({model: {value: true}, content: 'value', onContent: 'remove', onContext: 'info'}), 'OnOffGlyph');

    testObj(new $$.Button({size: 'lg', context: 'info', content: 'Hello'}), 'Button');

    testObj(new $$.Span({content: 'Hello'}), 'Span');

    var subviewtest = new $$.View();
    subviewtest.appendView(new $$.Span({content: 'Hello Kevin'}));
    testObj(subviewtest, 'SubViews');

    testObj(new $$.Span({
        model: new $$.Model({id: 1, value: 'Sample span content'}),
        content: 'value',
        formatter: function (s) { return (s + ', formatted!'); }
    }), 'Span');

    testObj(new $$.BasicNavbar({brand: 'Wow!', model: new $$.Collection([
        { name: 'first', href: '#first', label: 'First' },
        { name: 'second', href: '#second', label: 'Second' },
        { name: 'third', href: '#third', label: 'Third' }
    ])}), 'BasicNavbar');

    var obj = new $$.Context({content: 'danger'}).render();
    obj.$el.append(new $$.Glyph({content: 'star'}).render().el);
    testObj(obj, 'Context + Glyph');

    obj = new $$.Context({content: 'danger', background: true}).render();
    obj.$el.append(new $$.Glyph({content: 'star'}).render().el);
    obj.$el.append(new $$.Badge({content: '33'}).render().el);
    testObj(obj, 'Context(bg) + Glyph + Badge');

    testObj(new $$.Div({
        model: new $$.Model({id: 1, value: 'Sample div content'}),
        content: 'value',
        formatter: function (s) { return s.replace('div', '<div>'); }
    }), 'Div');

    testObj(new $$.Div({
        model: new $$.Model({id: 1, x: 'X', y: 'Y'}),
        content: ['x','y'],
        formatter: function (content) { return _(content).map(function (s) { return $$.div(s); }); }
    }), 'Div - multi');

    testObj(new $$.Div({
        model: new $$.Model({id: 1, x: 'X', y: 'Y'}),
        content: [function (m) { return m.get('x'); }, function (m) { return m.get('y'); }],
        formatter: function (content) { return _(content).map(function (s) { return $$.div(s); }); }
    }), 'Div - multifunc');

    testObj(new $$.Dropdown({align: 'left', context: 'primary',
        type: 'button',
        labelContent: 'Things',
        model: new $$.Collection([
            { name: 'first', href: '#first', label: 'First' },
            { element: 'divider' },
            { element: 'header', label: 'More things'},
            { name: 'second', href: '#second', label: 'Second' },
            { name: 'third', href: '#third', label: 'Third' },
            { name: 'fourth', href: '#fourth', label: $$.span($$.glyph('star'), ' Star!') },
    ])}), 'Dropdown');

    var dropdown;

    testObj(dropdown = new $$.Dropdown({
        type: 'split-button',
        model: new $$.Collection([
            { name: 'first', label: 'First' },
            { name: 'second', label: 'Second' },
            { name: 'third', label: 'Third' },
        ]),
        itemView: $$.View.extend({
            events: {
                'click': function () { alert(this.model.get('label')); dropdown.setLabel(this.$el.clone()); }
            },
            render: function () {
                this.$el.append(
                    $$.em(this.model.get('name')),
                    $$.strong(this.model.get('label'))
                );
            }
        })
    }), 'Dropdown2');

    testObj(new $$.NavPills({context: 'primary', model: new $$.Collection([
        { name: 'first', href: '#first', label: 'First' },
        { name: 'second', href: '#second', label: 'Second' },
        { name: 'third', href: '#third', label: 'Third' }
    ])}), 'NavPills');

    testObj(new $$.NavTabs({model: new $$.Collection([
        { name: 'first', href: '#first', label: 'First' },
        { name: 'second', href: '#second', label: 'Second' },
        { name: 'third', href: '#third', label: 'Third' }
    ])}), 'NavTabs');

    testObj(new $$.Table({striped: true, bordered: true, hover: true, condensed: true,
        columns: [
            { title: 'Name', content: 'a' },
            { title: 'Value', content: 'b' },
            { title: 'Detail', content: 'c' }
        ],
        model: new $$.Collection([
            { a: 'abcde', b: 'bcdef', c: 'cdefg' },
            { a: 'ab123', b: 'b123', c: '123' },
            { a: 'ab234', b: 'b3456', c: '34567' },
            { a: 'abcde', b: 'bcdef', c: 'cdefg' },
            { a: 'uerhiu', b: 'u78dh3', c: 'starwgd' }
        ])
    }), 'Table');

    test($$.form(
      new $$.Checkbox({
        model: new $$.Model({
            label: 'Use Checkbox?',
            value: true
        }),
        content: 'value',
        labelContent: 'label'
    }).render()), 'Checkbox');

    testObj(new $$.Calendar({
        model: new $$.Model({
            name: 'Christmas', date: new Date(2014, 12, 25)
        }),
        content: 'date'
    }), 'Calendar');

    testObj(new $$.DatePicker({
        model: new $$.Model({
            name: 'Christmas', date: new Date(2014, 12, 31)
        }),
        content: 'date'
    }), 'DatePicker');

    testObj(new $$.TimePicker({
        model: new $$.Model({
            name: 'Christmas', date: new Date(2014, 12, 31, 6, 17)
        }),
        content: 'date',
        interval: 15
    }), 'TimePicker');

    testObj(new $$.Link({
        model: new $$.Model({
            name: 'Someplace'
        }),
        content: 'name',
        onClick: function () { alert('clicked'); }
    }), 'Link');

    testObj(new $$.TextArea({
        model: new $$.Model({
            name: 'First M. Last', description: 'lorem ipsum quod erat and all that jazz.'
        }),
        content: 'description'
    }), 'TextArea');

    testObj(new $$.TextField({
        model: new $$.Model({
            name: 'First M. Last', description: 'lorem ipsum quod erat and all that jazz.', label: 'Your Name'
        }),
        content: 'name',
        formLabelContent: 'label'
    }), 'TextField');

    testObj(new $$.Label({
        model: new $$.Model({ descrip: 'lorem ipsum' }),
        labelContent: 'descrip'
    }), 'Label');

    testObj(new $$.Menu({
        model: new $$.Model({ value: 'e' }),
        content: 'value',
        alternatives: new $$.Collection(
            [
             { name: 'Adam',    value: 'a' },
             { name: 'Bert',    value: 'b' },
             { name: 'Cathy',   value: 'c' },
             { name: 'Douglas', value: 'd' },
             { name: 'Ellen',   value: 'e' },
             { name: 'Fred',    value: 'f' },
             { name: 'Georgia', value: 'g' },
            ]
        ),
        altLabelContent: 'name',
        altValueContent: 'value'
    }), 'Menu');

    testObj(new $$.Select({
        model: new $$.Model({ value: 'e' }),
        content: 'value',
        alternatives: new $$.Collection(
            [
             { name: 'Adam',    value: 'a' },
             { name: 'Bert',    value: 'b' },
             { name: 'Cathy',   value: 'c' },
             { name: 'Douglas', value: 'd' },
             { name: 'Ellen',   value: 'e' },
             { name: 'Fred',    value: 'f' },
             { name: 'Georgia', value: 'g' },
            ]
        ),
        altLabelContent: 'name',
        altValueContent: 'value'
    }), 'Select');

    testObj(new $$.RadioGroup({
        model: new $$.Model({ value: 'c' }),
        content: 'value',
        alternatives: new $$.Collection(
            [
             { name: 'Adam',    value: 'a' },
             { name: 'Bert',    value: 'b' },
             { name: 'Cathy',   value: 'c' },
             { name: 'Douglas', value: 'd' },
             { name: 'Ellen',   value: 'e' },
             { name: 'Fred',    value: 'f' },
             { name: 'Georgia', value: 'g' },
            ]
        ),
        altLabelContent: 'name',
        altValueContent: 'value'
    }), 'RadioGroup');

    var KPmodel = $$.Model.extend({
        initialize: function () {
            $$.Model.prototype.initialize.apply(this, arguments);
            this.on('change:fn', function (f,v) {
                if (v.length < 50) { // assume "multi"
                    console.log('got ' + v.length + ' items');
                } else {
                    console.log('got ' + v.length + ' bytes: ' + v.substr(0,32) + '...');
                }
            });
        }
    });

    testObj(new $$.FileInput({model: new KPmodel({fn:null}), content: 'fn'}), 'FileInput');
    testObj(new $$.FileInput({model: new KPmodel({fn:[]}), content: 'fn', multiple: true}), 'FileInput - multi');

    var KpCollection = $$.Collection.extend({
        model: $$.Model.extend({
            events: { click: function () { console.log(this.value); } }
        })
    });

    test($$.navbar(
        { brandContent: 'Footer' },
        $$.navbarGroup(
            $$.li($$.a({href: '#'}, 'Something')),
            new $$.Dropdown({
                tagName: 'li',
                labelContent: 'Filters',
                dropup: true,
                model: new KpCollection([
                    { label: 'Announcements', value: 'announcement' },
                    { label: 'Activities', value: 'activity' },
                    { label: 'Deadlines', value: 'deadline' },
                    { label: 'Events', value: 'event' }
                ])
            }).render(),
            $$.li($$.a({href: '#'}, 'Something Else')),
            $$.dropdown({
                    labelContent: 'Filters',
                    dropup: true,
                },
                $$.li({className: 'header'}, 'Things!'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Thing two', '#'),
                $$.dropdownGroup({labelContent: 'Special Things!'},
                    $$.menuItem('Thing 3', '#'),
                    $$.menuItem('Thing 4', '#'),
                    $$.menuToggle('Toggleable', '#huh')
                ),
                $$.menuItem('Final thing', '#')
            )
        )
    ), 'Dropups On a Navbar');

    test($$.div($$.navbar(
        { brandContent: 'Footer', position: 'fixed-bottom' },
        $$.navbarGroup(
            $$.li($$.a({href: '#'}, 'Something')),
            $$.li($$.a({href: '#'}, 'Something Else')),
            $$.dropdown({
                    labelContent: 'Filters',
                    maxHeight: '100px'
                },
                $$.li({className: 'header'}, 'Things!'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Some thing', '#'),
                $$.menuItem('Thing two', '#'),
                new $$.DropdownGroup({
                    labelContent: 'My Operations',
                    itemViewOptions: { content: 'op', labelContent: 'name' },
                    model: new $$.Collection([
                            { op: '#a', name: 'Operation A' },
                            { op: '#b', name: 'Operation B' },
                            { op: '#c', name: 'Operation C' }
                        ])
                }).render(),
                $$.menuItem('Final thing', '#')
            )
        )
    )), 'Dropdown Group On a fixed-footer Navbar');

    test($$.jumbotron('Hello!'), 'JT');

    var subitemModel = new $$.Model({id: 1, sub: {value: 'First value : 00:00:00', name: 'A Name'}});
    setInterval(function () {
        var oldSub = subitemModel.get('sub');
        var newSub = {value: oldSub.value.substr(0, oldSub.value.length-11) + ' : ' + moment().format('HH:mm:ss')};
        subitemModel.set('sub', _.extend({}, oldSub, newSub));
    }, 10000);
    test(new $$.div(
        new $$.TextField({
            model: subitemModel,
            content: 'sub.value'
        }).render(),
        new $$.TextField({
            model: subitemModel,
            content: 'sub.name'
        }).render()
    ), 'Dotted Property');

    test($$.div, ' === END === ');
});
