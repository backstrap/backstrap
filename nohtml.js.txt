require(["jquery", "backstrap", "backbone"], function ($, $$, BB) {
	/*
	 * Load the main CSS.
	 * We don't want CSS loading to get in the way
	 * of our "Loading..." page display.
	 */
	$("head").append($$.css("src/require.css")).
		append($$.css("src/bootstrap/css/bootstrap.min.css")).
		append($$.css("src/bootstrap/css/bootstrap-theme.min.css"));
	
	/*
	 * Build some application objects.
	 * Typically you'll have a Backbone Router on your page.
	 * This one doesn't do anything useful.
	 */
	new (BB.Router.extend({
		routes: {
			'home': 'home',
			'foo': 'home'
		},
		home: function () { alert('home button clicked'); }
	}))();
	
	/*
	 * Build the page contents.
	 */
	var page = $$.container($$.grid({ layout: [
		[   // A full-width header.
			{
				xs: 12,
				content: $$.pageHeader($$.h1("Hello, No-HTML World!"))
			}
		],
		[   // A full-width jumbotron.
			{
				xs: 12,
				content:
					$$.jumbotron(
						$$.p(
							'This is an example of a "No-HTML" web page using Backstrap. ',
							'The HTML just puts a simple "Loading..." message on the page, ',
							'along with the CSS for that content. ',
							'Then JavaScript does the heavy lifting of ',
							'loading the main JS libraries and CSS, ',
							'and building our content programmatically ',
							'with Backstrap, Backbone, Bootstrap and jQuery. ',
							'Once everything is ready, we swap out the page contents, ',
							'and our application is up and running! ',
							'See ',
							$$.a(
								{
									context: 'link',
									href: 'https://github.com/backstrap/backstrap'
								},
								'the Backstrap project on GitHub'
							),
							' for more info.'
						)
					)
			}
		],
		[   // A pair of half-width panels.
			{
				xs: 6,
				content:
					$$.panel($$.p(
						'Obviously this isn\'t a good solution for building static pages. ',
						'But it may be appropriate for web applications which want to ',
						'do a lot of JavaScript processing on the client anyway.',
						'And Backstrap is also useful for adding dynamic content ',
						'to more traditional HTMl pages too.'
					))
			}, {
				xs: 6,
				content:
					$$.panel(
						$$.p('View ', $$.a({href: 'nohtml.html.txt'},
							'the HTML for this page.'
						)),
						$$.p('View ', $$.a({href: 'nohtml.js.txt'},
							'the JavaScript for this page.'
						))
					)
			}
		],
		[   // Three columns with a button in the middle column.
			{ xs: 4 },
			{
				xs: 4,
				content:
					$$.button(
						{
							context: 'primary',
							onClick: function () { document.location="#home"; }
						},
						'Home'
					)
			},
			{ xs: 4 },
		]
	]}));

	/*
	 * Now we just display the page and start watching for events...
	 */
	$("body").empty().removeClass("loading").append(page);
	BB.history.start();
});