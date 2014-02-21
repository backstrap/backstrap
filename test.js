require(['backstrap'], function() {

	var n = 1;
	
    function test(obj, label) {
	    $('body').append($$.div({style: 'min-height: 3em; padding-top: 1.5em;'},
	    		$$.label({context: 'primary'}, '' + (n++) + '. ' + label))
	    	).append($$.container({style:'padding: .5em;'}, obj));
    }
    
    function testObj(obj, label) {
	    test(obj.render().el, label);
    }

	test($$.pageHeader($$.h1('My Test Page')), 'pageHeader');
	
	test($$.container(
		$$.jumbotron({bgcontext: 'primary'}, $$.p('Some important content in a jumbotron'))
	), 'jumbotron');
	
	test($$.glyph('fullscreen'), 'glyph');

	test($$.span('Hello World'), 'span');
	
	test($$.well('I am in a well'), 'well');

	test($$.span({context: 'info'}, 'Info Hello World'), 'context');
	
	test($$.span({context: 'info', bgcontext: 'danger'}, 'Info Hello World - danger background'), 'bgcontext');

	test($$.label({size: 'small'}, 'small label'), 'size');
	
	test($$.htmllabel('HTML label'), 'htmllabel');
	
	test($$.button({size: 'large'}, 'Large button'), 'button');
	
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
	
	testObj(new $$.BasicNavbar({brand: 'Wow!', model: new Backbone.Collection([
		{ name: 'first', href: '#first', label: 'First' },
		{ name: 'second', href: '#second', label: 'Second' },
		{ name: 'third', href: '#third', label: 'Third' }
	])}), 'BasicNavbar');
	
	testObj(new $$.Button({size:'lg', context:'info', content: 'Hello'}), 'Button');

	testObj(new $$.Glyph({content: 'retweet'}), 'Glyph');

	var obj = new $$.Context({content:'danger'}).render();
	obj.$el.append(new $$.Glyph({content:'star'}).render().el);
	testObj(obj, 'Context + Glyph');
	
	obj = new $$.Context({content:'danger', background: true}).render();
	obj.$el.append(new $$.Glyph({content:'star'}).render().el);
	obj.$el.append(new $$.Badge({content:'33'}).render().el);
	testObj(obj, 'Context(bg) + Glyph + Badge');

	testObj(new $$.Dropdown({buttonLabel: 'Things', buttonId: 'button1', align: 'left', model: new Backbone.Collection([
		{ name: 'first', href: '#first', label: 'First' },
		{ header: true, label: 'More things'},
		{ name: 'second', href: '#second', label: 'Second' },
		{ divider: true },
		{ name: 'third', href: '#third', label: 'Third' }
	])}), 'Dropdown');

	testObj(new $$.NavPills({model: new Backbone.Collection([
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
