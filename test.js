require(['jquery', 'backstrap'], function($, $$) {

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
        { brand: 'KP' },
        $$.ul({ className: 'nav navbar-nav'},
            $$.li({ className: 'nav navbar-item'}, $$.a({ href: '#boo' }, 'Boo!')),
            $$.li({ className: 'nav navbar-item'}, $$.a({ href: '#logout' }, 'Logout'))
        )
    ), 'navbar');
    
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

	testObj(new $$.Dropdown({buttonLabel: 'Things', buttonId: 'button1', align: 'left', model: new $$.Collection([
		{ name: 'first', href: '#first', label: 'First' },
		{ header: true, label: 'More things'},
		{ name: 'second', href: '#second', label: 'Second' },
		{ divider: true },
		{ name: 'third', href: '#third', label: 'Third' }
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
		content: 'name'
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
	
	test($$.div, ' === END === ');
});
