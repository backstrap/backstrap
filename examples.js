require(['jquery', 'backbone', 'backstrap'], function($, Backbone, $$) {
	
	var bicycles = new Backbone.Collection([
	    { type: 'mountain',   color: 'red',    purchased: '12/24/2013' },
	    { type: 'road',       color: 'silver', purchased: '03/11/2013' },
	    { type: 'cyclocross', color: 'blue',   purchased: '10/10/2011' },
	    { type: 'hybrid',     color: 'white',  purchased: '07/30/2012' },
	    { type: 'recumbent',  color: 'yellow', purchased: '08/01/2012' }
	]);
	
	var grid;
	
	$('body').append(
		$$.div({className: 'wrapper'},
			$$.pageHeader($$.h1('Backstrap Examples')),
			grid = $$.grid({ layout: [
			    [ 12 ],
			    [ 4, 4, 4 ]
			]})
		)
	);
	
	grid.getCell(1, 1).append($$.container(
		$$.jumbotron({bgcontext: 'primary'},
			'Some example text in a Jumbotron, including ',
			$$.span({context: 'warning'}, 'some text in a warning context color,'),
			'a ',
			$$.button('Button'),
			' that doesn\'t do anything, and a star glyph: ',
			$$.glyph('star')
		),
		$$.p('For the rest of the page, we will bind this dataset to various components:'),
		$$.blockquote($$.code($$.pre(
			"var bicycles = new Backbone.Collection([\n",
			"    { type: 'mountain',   color: 'red',    purchased: '12/24/2013' },\n",
			"    { type: 'road',       color: 'silver', purchased: '03/11/2013' },\n",
			"    { type: 'cyclocross', color: 'blue',   purchased: '10/10/2011' },\n",
			"    { type: 'hybrid',     color: 'white',  purchased: '07/30/2012' },\n",
			"    { type: 'recumbent',  color: 'yellow', purchased: '08/01/2012' }\n",
			"]);"
		))),
		$$.p('Note that the widgets are all sharing the same data model objects, ',
			'so changing a value with one widget will cause changes in the other widgets.')
	));
	
	grid.getCell(2, 1).append(
		$$.div({ context: 'primary' },
			$$.plain.label('Mountain bike color: '),
			$$.badge('red')
		)
	);
	
	grid.getCell(2, 2).append(
		$$.div({ context: 'primary' },
			$$.plain.label('Mountain bike color: '),
			$$.badge('red')
		)
	);
	
	grid.getCell(2, 3).append(
		$$.div({ context: 'primary' },
			$$.plain.label('Mountain bike color: '),
			$$.badge('red')
		)
	);
	
});