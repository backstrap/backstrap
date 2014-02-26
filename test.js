require(['jquery', 'backbone', 'backstrap'], function($, Backbone, $$) {

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
	$("head").append($$.css("components/require.css")).
		append($$.css("components/bootstrap/css/bootstrap.min.css")).
		append($$.css("components/bootstrap/css/bootstrap-theme.min.css"));

	// tag factories
	
	test($$.pageHeader($$.h1('My Test Page')), 'pageHeader');
	
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
	
	test($$.html.label('HTML label'), 'plain html label');
	
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
			$$.html.label('Name:'),
			$$.input({type: 'text', name: 'name'})
		),
		$$.formGroup(
			$$.html.label('Password:'),
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
	
	testObj(new $$.BasicNavbar({brand: 'Wow!', model: new Backbone.Collection([
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

	testObj(new $$.Dropdown({buttonLabel: 'Things', buttonId: 'button1', align: 'left', model: new Backbone.Collection([
		{ name: 'first', href: '#first', label: 'First' },
		{ header: true, label: 'More things'},
		{ name: 'second', href: '#second', label: 'Second' },
		{ divider: true },
		{ name: 'third', href: '#third', label: 'Third' }
	])}), 'Dropdown');

	testObj(new $$.NavPills({context: 'primary', model: new Backbone.Collection([
		{ name: 'first', href: '#first', label: 'First' },
		{ name: 'second', href: '#second', label: 'Second' },
		{ name: 'third', href: '#third', label: 'Third' }
	])}), 'NavPills');
	
	testObj(new $$.NavTabs({model: new Backbone.Collection([
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
		model: new Backbone.Collection([
			{ a: 'abcde', b: 'bcdef', c: 'cdefg' },
			{ a: 'ab123', b: 'b123', c: '123' },
			{ a: 'ab234', b: 'b3456', c: '34567' },
			{ a: 'abcde', b: 'bcdef', c: 'cdefg' },
			{ a: 'uerhiu', b: 'u78dh3', c: 'starwgd' }
		]
		)
	}), 'Table');
});
