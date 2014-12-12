require(['jquery', 'backstrap', 'moment', 'mobiscroll'], function($, $$, moment) {

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
    $("head").append($$.css("components/require.css"));

    // tag factories

    test($$.pageHeader($$.h1('My Test Page')), 'pageHeader');
    
    var fred = new $$.Model({ when: '2014-11-10T09:10', id: 1, name:'fred' });
    testObj(new $$.DateTime({
        model: fred,
        content: 'when',
        contentFormat: 'YYYY-MM-DDTHH:mm'
        //mobiscroll: {
            // preset: 'datetime', // one of date, time, or datetime.
            //theme: 'ios7'
            //onSelect: function () { setTimeout(function () { console.log(fred.get('when')); }, 500); }
        //}
    }), 'DateTime');

    var zzz;
    testObj(zzz = new $$.DateTime({
        model: fred,
        content: 'when',
        contentFormat: 'YYYY-MM-DDTHH:mm',
        mobiscroll: {
	    showLabel: true,
            preset: 'time',
        }
    }), 'DateTime again (shared data)');
    // var w = zzz.mobiscroll('getInst').settings.wheels;
    // w[0][0].values = ['09',10,11,12,'01','02','03','04','05','06','07','08'];
    // w[0][0].keys = [9,10,11,12,1,2,3,4,5,6,7,8];
    // zzz.mobiscroll('option', 'wheels', w);
    //console.log(w);

    testObj(new $$.NumberField({
        model: new $$.Model({ howmany: 7, id: 1, name:'fred' }),
        content: 'howmany',
        mobiscroll: { min: 1, max: 24, step: 2, showLabel: true, invalid: [ 5 ] }
    }), 'NumberField');

    var mark = new $$.Model({ duration: 'P1D2H', id: 1, name:'mark' });
    testObj(new $$.DurationField({
        model: mark,
        content: 'duration',
        mobiscroll: { showLabel: true, wheelset: 'dhi', onSelect: function () { setTimeout(function () { console.log(mark.get('duration')); }, 500); } }
    }), 'DurationField');
 
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
            { name: 'a', value: 'Hello' },
            { name: 'b', value: 'This is a value' },
            { name: 'c', value: 'Hello' }
        ]),
        columns: [
                  { title: 'Name', content: 'name' },
                  { title: 'Value String', content: 'value' }
        ]
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

    testObj(new $$.Button({size: 'lg', context: 'info', content: 'Hello'}), 'Button');
    
    testObj(new $$.Span({content: 'Hello'}), 'Span');
	
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
	}).render().el), 'Checkbox');

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
			name: 'First M. Last', description: 'lorem ipsum quod erat and all that jazz.'
		}),
		content: 'name',
		formLabelContent: 'Your Name'
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
            }).render().el,
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
                }).render().el,
                $$.menuItem('Final thing', '#')
            )
        )
    )), 'Dropdown Group On a fixed-footer Navbar');
    test($$.jumbotron('Hello!'), 'JT');

    test($$.div, ' === END === ');
});
