Backstrap
=========

**UNDER CONSTRUCTION**

**__Just getting started. Check back soon!__**

The Backstrap JavaScript library provides a layer of functionality tying together Bootstrap and Backbone.

Need something meaty to go between the backbone of your client-side JS app
and its UI skin? Look no further, you've found it: Backstrap!

The Backstrap JavaScript library provides a layer of functionality
tying together
Bootstrap (<http://getbootstrap.com/>)
and Backbone (<http://backbonejs.org/>)

It is available on [GitHub](https://github.com/backstrap/backstrap)
and as a Composer component on [packagist.org](https://packagist.org/packages/backstrap/backstrap).

The core Backstrap object is based heavily on
Joe Stelmach's nifty laconic.js
(<https://github.com/joestelmach/laconic>)
"Laconic simplifies the generation of DOM content."
As such, it is bound by that license:
<https://github.com/joestelmach/laconic/blob/master/LICENSE>

It also provides an extension of the ideas found in
Backbone-UI (<https://github.com/perka/backbone-ui>).
The same license applies to Backbone-UI:
<https://github.com/perka/backbone-ui/blob/master/LICENSE>

To all of that I've added a natural syntax for making
Bootstrap-aware objects, including Bootstrap's
sizing and context-coloring features;
automatic use of Bootstrap class names;
methods for making standard complex widgets like
grids, navbars, button-groups, forms.

Backstrap defines the global namespace $$.

Sample suggested use:

	$$.div(
		$$.span({context: 'danger'},
			'Uh-oh! ',
			$$.glyph('star')
		),
		$$.button({size: 'large'}, 'OK')
	);

## Detailed usage

See the [laconic doc](http://joestelmach.github.io/laconic/)
for a description of its usage.
Everything there pretty much applies here, with the following changes:

- Backstrap defines the global namespace `$$` instead of laconic's `$.el`.
- if you pass a "size" attribute with
one of the supported size names (lg, sm, xs, large, small, extra-small)
it will be converted into a suitable Bootstrap classname.
- if you pass a "context" attribute
it will be converted into a suitable Bootstrap classname.
- if you pass a "glyph" attribute
it will be converted into a suitable Bootstrap classname.
Use just the distinct part of the Bootstrap glyphicon class,
e.g. $$.span({glyph: "star"}) becomes <span class="glyphicon glyphicon-star">.
- there is a shortcut method $$.glyph(name) for creating glyphs.
$$.glyph("star") is equivalent to $$.span({glyph: "star"}).
- there are some new pseudo-tags, such as
$$.badge() to create a span with class="badge";
$$.grid() to create a div with a pre-built grid layout.
- various tags get extra decoration, for instance $$.button()
automatically adds the Bootstrap "btn" class to your button.
Note that this is the only supported way to build buttons -
you should avoid doing, for example, $$.a({className: "btn"}).
The term "label" is overloaded, since there is both an HTML label tag and
a Bootstrap label class. See the [label](#label) section below for details
on how to use labels.
- there are also constructors for building various Bootstrap.View extensions,
which allow you to make Backbone Model-bound widgets that are also
Bootstrap-enabled. For instance $$.BasicNavbar which creates a navbar
whose contents are built from a description provided as a Backbone Collection.

Backstrap, like laconic, adds an `appendTo()` convenience method
to each DOM object it creates.

### HTML Tags

Every HTML5 tag has a factory function in the $$ namespace.
Some deprecated HTML4 tags are also included.
Additionally, some pseudo-tags have been added which build
Bootstrap-enabled tags.
These methods should be invoked with a variable-length list of
child elements, strings, numbers, or arrays containing these types.
An optional attributes object may be passed as the first argument.
For example: 

	$$.div({'class' : 'example'}, 
		$$.div('content'));

### Bootstrap Tags

The special Bootstrap methods are:

#### glyph

The `$$.glyph(name)` method creates a `span` with class "glyphicon glyphicon-<name>".

See also the Glyph constructor, below.

#### badge

The `$$.badge()` method creates a `span` with class "badge".

See also the Badge constructor, below.

#### label

The term "label" is, unfortunaterly, overloaded. The following methods are available:

- `$$.label()` gives you an HTML `label` tag with class "label".
- `$$.htmllabel()` gives you a bare HTML `label` tag.
- `$$.spanlabel()` gives you an HTML `span` tag with class "label".

#### grid

The `$$.grid()` method creates a nested set of divs. Pass it a "layout" attribute
in the attributes argument to format the grid. The "layout" attribute should contain
an array of arrays of cell specifications. Each cell specification can be either
a simple integer specifying the width (in columns) of the cell, or an object
with properties for each device-size for which you want to set a column width.
Use either Bootstrap's short names ("lg", "sm") or full names ("large", "small").
It may also contain a "content" property containing a DOM object to use as
the contents of the cell. For example:

	$$.grid({layout: [
		[ 6, 6 ],
		[ { xs: 12, md: 6, content: $$.div('Hello, World') } ]
	]});

Pass grid a "fluid: true" attribute to get a fluid layout (using Bootstrap's
"container-fluid" class instead of "container" on the top-level div).

We also add a few convenience methods on the top-level div:
appendRows(layout), appendRow(layout), getRow(rowNum), and getCell(rowNum, colNum).
For example:

	var grid = $$.grid({layout: [ [ 6, 6 ] ]});
	grid.appendRow([ 4, 4, 4 ]);
	grid.getCell(2, 2).append('Hello World');

puts "Hello World" in the middle cell of the second row.

### Object Constructors

The tag factory functions described above give you
an easy way to build nice static content.
But here's where things get even more fun!
The Backstrap object also provides constructors for several
object classes that extend Backbone.View, to give you powerful
(and good-looking!) data-driven, model-bound DOM widgets,
using the power of Backbone-UI.
They are:

- BasicNavbar
- Badge
- Button
- Context
- Glyph
- NavPills
- NavTabs
- Table

For efficiency, you should use the factory functions, like `$$.glyph()`,
for static graphics, and use the object constructor, like `$$.Glyph()`,
to bind a graphic object to a data model whose values may change
over the life of the page.

#### Badge

Creates a Bootstrap badge (a span with class="badge") whose content is model-bound.

Example:

	var model = new Backbone.Model({item: 'tweets', count: 42});
	var badge = new $$.Badge({model: model, content: 'count'}).render();

#### BasicNavbar

**Needs documentation**

#### Button

Creates a Bootstrap button whose label is model-bound.

A simple example:

	var model = new Backbone.Model({name: 'Submit'});
	var button = new $$.Button({model: model, content: 'name'}).render();
	...
	// Alter the displayed label.
	model.set('name', 'Save as Draft');

#### Context

Creates a span whose Bootstrap context-color is model-bound.

A simple example - displays the text in a span with class "text-info":

	var model = new Backbone.Model({context: 'info'});
	var text = new $$.Context({model: model, content: 'context'}, 'This is some text').render();

Passing `background: true` makes it use the "bg-*" classes instead of "text-*".
You can also pass it a tagName attribute to create something other than a span.

#### Dropdown

**Needs documentation**

#### Glyph

Creates a Bootstrap Glyphicon glyph (a span with class="glyphicon") whose icon is model-bound.

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

#### NavPills

**Needs documentation**

#### NavTabs

**Needs documentation**

#### Table

**Needs documentation**
