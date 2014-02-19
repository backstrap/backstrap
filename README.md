Backstrap
=========

** UNDER CONSTRUCTION **
** Just getting started really.  Check back soon! **

The Backstrap JavaScript library provides a layer of functionality tying together Bootstrap and Backbone.

Need something meaty to go between the backbone of your client-side JS app
and its UI skin?  Look no further, you've found it: Backstrap!

The Backstrap JavaScript library provides a layer of functionality
tying together
Bootstrap (<http://getbootstrap.com/>)
and Backbone (<http://backbonejs.org/>)

It is available on GitHub and as a Composer component on packagist.org

The core Backstrap object is based heavily on
Joe Stelmach's nifty laconic.js
(<https://github.com/joestelmach/laconic>)
Laconic simplifies the generation of DOM content.
As such, it is bound by his license:
<https://github.com/joestelmach/laconic/blob/master/LICENSE>

It follows the RequireJS protocol for async loading.

I've added support for a natural syntax for making
Bootstrap-aware objects, including Bootstrap's
sizing, context, glyphicon, and button features.
More coming soon.

Suggested use:

	require(['backstrap'], function($$) {
		$$.div({},
			$$.span({context: 'danger'},
				'Uh-oh! ',
				$$.span({glyph: 'star'})
			),
			$$.button({size: 'large'}, 'OK')
		);
	}

It also provides an extension of the prinicples found in
the Backbone-UI module (<https://github.com/perka/backbone-ui>).
The same license applies to Backbone-UI:
<https://github.com/perka/backbone-ui/blob/master/LICENSE>

## Detailed usage

See, of course, the laconic doc for his description of its usage.

Basically the same, except for the following:

- $$.button automatically adds the Bootstrap "btn" class to your button.
Note that this is the only supported way to build buttons -
you should avoid doing, for example, $$.a({className: "btn"}).
- if you pass a "size" attribute with
one of the supported size names (lg, sm, xs, large, small, extra-small)
it will be converted into a suitable Bootstrap classname.
- if you pass a "context" attribute
it will be converted into a suitable Bootstrap classname.
- if you pass a "glyph" attribute
it will be converted into a suitable Bootstrap classname.
Use just the distinct part of the Bootstrap glyphicon class,
e.g. $$.span({glyph: "star"}) becomes <span class="glyphicon glyphicon-star">.
- There is a shortcut method $$.glyph(name) for creating glyphs.
$$.glyph("star") is equivalent to $$.span({glyph: "star"}).

Note that backstrap does no checking of attribute name validity.
the above attributes may not be appropriate in all contexts.
You are responsible for using them ... responsibly.

So, the above gives you an easy way to build nice static content.
But here's where it gets even more fun!

The backstrap object also provides construcotrs for several
object classes that extend Backbone.View, to give you powerful
(and good-looking!) data-driven, model-bound DOM widgets,
using the power of Backbone-UI.
They are:

- BasicNavbar
- Button
- Context
- Glyph
- NavPills
- NavTabs
- Table

### Button

A simple example:

	var model = new Backbone.Model({name: 'Submit'});
	var button = new $$.Button({model: model, content: 'name'}).render();
	...
	// Alter the displayed label.
	model.set('name', 'Save as Draft');


### Glyph

A simple example:

	var model = new Backbone.Model({glyph: 'star'});
	var glyph = new $$.Glyph({model: model, content: 'glyph'}).render();
	...
	// Alter the displayed icon.
	model.set('glyph', 'ok');

Glyph is also smart enough to wrap your glyphicon in an outer span
in order to properly implement "size" and "context" attributes.

	var glyph = new $$.Glyph({content: 'star', size: 'large', context: 'danger'}).render();

Gives you a large red star (note that you can pass a literal value directly to content
instead of supplying a model object and property name.)
